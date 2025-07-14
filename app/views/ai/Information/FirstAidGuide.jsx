import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Linking, // For making phone calls
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming expo-router
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

// --- MOCK DATA ---
const MOCK_FIRST_AID_CATEGORIES = [
  { name: "Bleeding & Wounds", icon: "bandage", query: "First Aid for cuts and bleeding" }, // Changed from "bandage-outline" to "bandage"
  { name: "Breathing Emergencies", icon: "lungs", query: "First Aid for choking" }, // Changed from "lung" to "lungs"
  { name: "Burns & Scalds", icon: "fire", query: "First Aid for burns" },
  { name: "Fractures & Sprains", icon: "bone", query: "First Aid for fractures and sprains" },
  { name: "Head Injuries", icon: "head-plus-outline", query: "First Aid for head injuries" },
  { name: "Poisoning", icon: "bottle-tonic-skull", query: "First Aid for poisoning" }, // Changed from "poison" to "bottle-tonic-skull"
  { name: "Allergic Reactions", icon: "leaf-off", query: "First Aid for severe allergic reactions" }, // Changed from " аллерги" to "leaf-off" (or find a better fitting icon)
  { name: "Seizures", icon: "brain", query: "First Aid for seizures" },
  { name: "Heatstroke", icon: "sun-thermometer-outline", query: "First Aid for heatstroke" },
];

const MOCK_FIRST_AID_SUGGESTIONS = [
  "Cuts",
  "Burns",
  "Choking",
  "Fracture",
  "Sprain",
  "Head injury",
  "Poisoning",
  "Allergy attack",
  "Seizure",
  "Heatstroke",
  "Fainting",
  "Nosebleed",
  "Animal bite",
  "Sting",
  "CPR",
  "Shock",
  "Concussion",
  "Diabetes emergency",
  "Asthma attack",
];

const EMERGENCY_NUMBER = "911"; // Or your local emergency number (e.g., "112" for Europe, "1122" for Pakistan)

const FirstAidGuideScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for search input and suggestions
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

  // State for AI situation input
  const [currentSituationInput, setCurrentSituationInput] = useState("");

  // State for AI-generated first aid guide
  const [firstAidGuideResult, setFirstAidGuideResult] = useState(null); // Parsed AI response
  const [loadingGuide, setLoadingGuide] = useState(false);
  const [guideError, setGuideError] = useState(null);

  // State for collapsible guide sections
  const [expandedSections, setExpandedSections] = useState({
    initialAssessment: true,
    steps: true,
    callEmergency: true,
    doNotDo: true,
  });

  // Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to handle AI response for first aid guide
  useEffect(() => {
    if (response) {
      const parsed = parseGeminiResponse(response);
      setFirstAidGuideResult(parsed);
      setLoadingGuide(false);
      setGuideError(null);
      // Scroll to the result section automatically
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [response, parseGeminiResponse]);

  // Effect to handle errors from API hook
  useEffect(() => {
    if (error) {
      setGuideError(error);
      setLoadingGuide(false);
      setFirstAidGuideResult(null);
      Alert.alert("AI Error", error);
    }
  }, [error]);

  const handleSearchInputChange = (text) => {
    setCurrentSearchInput(text);
    if (text.length > 1) {
      const filtered = MOCK_FIRST_AID_SUGGESTIONS.filter((topic) =>
        topic.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5);
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const fetchFirstAidGuide = async (topicOrSituation) => {
    const promptPrefix =
      currentSituationInput.length > 0
        ? `Analyze the following emergency situation and provide first aid steps: "${topicOrSituation}"`
        : `Provide a step-by-step first aid guide for "${topicOrSituation}".`;

    const prompt = `${promptPrefix}

    Structure your response exactly as follows, using the specified headings. If a section is not directly applicable or information is unavailable, state 'N/A' for that section's content.

    ### Topic
    [The specific first aid topic or a summary of the situation.]

    ### Initial Assessment
    [What to quickly check for or observe.]

    ### Step-by-step Actions
    [A numbered list of specific actions to take. Each step on a new line.]

    ### When to Call Emergency
    [Clear criteria for when to call ${EMERGENCY_NUMBER} or local emergency services.]

    ### What NOT to Do
    [Important warnings or actions to avoid.]
    `;

    setLoadingGuide(true);
    setFirstAidGuideResult(null);
    setGuideError(null);
    setCurrentSearchInput(topicOrSituation); // Set search input to the chosen topic
    setCurrentSituationInput(""); // Clear situation input after fetching
    setFilteredSuggestions([]);
    setIsSearchInputFocused(false);

    await generateContent(prompt);
  };

  const parseGeminiResponse = useCallback(
    (rawResponse) => {
      if (!rawResponse) return null;

      const sections = {};
      const sectionOrder = [
        "Topic",
        "Initial Assessment",
        "Step-by-step Actions",
        "When to Call Emergency",
        "What NOT to Do",
      ];

      let currentSection = "";
      rawResponse.split("\n").forEach((line) => {
        const trimmedLine = line.trim();
        const match = trimmedLine.match(/^###\s(.+)$/); // Match lines starting with "### "
        if (match) {
          currentSection = match[1];
          sections[currentSection] = [];
        } else if (currentSection) {
          sections[currentSection].push(trimmedLine);
        }
      });

      const result = {
        title: sections["Topic"]
          ? sections["Topic"].join(" ").trim()
          : currentSearchInput,
      };
      sectionOrder.forEach((header) => {
        const key = header.toLowerCase().replace(/[^a-z0-9]/g, ""); // e.g., "initialassessment"
        let content = sections[header]
          ? sections[header].join("\n").trim()
          : "N/A";
        result[key] = content;
      });

      return result;
    },
    [currentSearchInput]
  );

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All",
      "Are you sure you want to clear all inputs and results?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setCurrentSearchInput("");
            setCurrentSituationInput("");
            setFilteredSuggestions([]);
            setFirstAidGuideResult(null);
            setLoadingGuide(false);
            setGuideError(null);
            setExpandedSections({
              initialAssessment: true,
              steps: true,
              callEmergency: true,
              doNotDo: true,
            });
          },
        },
      ]
    );
  };

  const callEmergency = () => {
    Alert.alert(
      "Call Emergency",
      `Are you sure you want to call ${EMERGENCY_NUMBER}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => Linking.openURL(`tel:${EMERGENCY_NUMBER}`),
        },
      ]
    );
  };

  const renderGuideSection = (
    title,
    content,
    sectionKey,
    iconName,
    isWarning = false
  ) => {
    if (!content || content === "N/A") return null;

    const isExpanded = expandedSections[sectionKey];
    const icon = iconName ? (
      <MaterialCommunityIcons
        name={iconName}
        size={22}
        color={isWarning ? COLORS.error : COLORS.primary}
        style={styles.sectionIcon}
      />
    ) : null;

    return (
      <View
        style={[styles.infoSectionCard, isWarning && styles.warningSectionCard]}
      >
        <TouchableOpacity
          onPress={() => toggleSection(sectionKey)}
          style={styles.infoSectionHeader}
        >
          {icon}
          <Text
            style={[
              styles.infoSectionTitle,
              isWarning && { color: COLORS.error },
            ]}
          >
            {title}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.infoSectionContentContainer}>
            {sectionKey === "steps" ? ( // Special handling for numbered steps
              content
                .split("\n")
                .filter(Boolean)
                .map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                    <Text style={styles.stepText}>
                      {step.replace(/^- /, "").replace(/^\* /, "")}
                    </Text>
                  </View>
                ))
            ) : (
              <Text style={styles.infoSectionContent}>{content}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>First Aid Guide</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons
              name="close-circle-outline"
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Quick assistance for emergency situations
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Emergency Call Button */}
          <TouchableOpacity
            style={styles.emergencyCallButton}
            onPress={callEmergency}
          >
            <Ionicons name="call" size={28} color={COLORS.white} />
            <Text style={styles.emergencyCallButtonText}>
              Call Emergency ({EMERGENCY_NUMBER})
            </Text>
          </TouchableOpacity>

          {/* Search by Topic */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Search by Topic</Text>
            <View
              style={[
                styles.searchInputContainer,
                isSearchInputFocused && {
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                },
              ]}
            >
              <Ionicons
                name="search"
                size={24}
                color={COLORS.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="E.g., Bleeding, Choking, Burn"
                placeholderTextColor={COLORS.textPlaceholder}
                value={currentSearchInput}
                onChangeText={handleSearchInputChange}
                onFocus={() => setIsSearchInputFocused(true)}
                onBlur={() => {
                  setIsSearchInputFocused(false);
                  setTimeout(() => setFilteredSuggestions([]), 200); // Delay to allow tap on suggestion
                }}
                onSubmitEditing={() => fetchFirstAidGuide(currentSearchInput)}
                returnKeyType="search"
              />
              {currentSearchInput.length > 0 && (
                <TouchableOpacity
                  onPress={() => setCurrentSearchInput("")}
                  style={styles.clearSearchButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
            {isSearchInputFocused &&
              filteredSuggestions.length > 0 &&
              currentSearchInput.length > 1 && (
                <View style={styles.suggestionsContainer}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => fetchFirstAidGuide(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => fetchFirstAidGuide(currentSearchInput)}
              disabled={loadingGuide || !currentSearchInput.trim()}
            >
              {loadingGuide ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.searchButtonIcon}
                  />
                  <Text style={styles.searchButtonText}>Get Topic Guide</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Categories */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Quick Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {MOCK_FIRST_AID_CATEGORIES.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryCard}
                  onPress={() => fetchFirstAidGuide(category.query)}
                >
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={40}
                    color={COLORS.primary}
                  />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Describe Your Situation (AI-Powered) */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Or, Describe Your Situation</Text>
            <View style={styles.situationInputContainer}>
              <MaterialCommunityIcons
                name="comment-text-outline"
                size={24}
                color={COLORS.textSecondary}
                style={styles.situationIcon}
              />
              <TextInput
                style={styles.situationInput}
                placeholder="E.g., 'My child has a deep cut on their leg and it won't stop bleeding.'"
                placeholderTextColor={COLORS.textPlaceholder}
                value={currentSituationInput}
                onChangeText={setCurrentSituationInput}
                multiline
                numberOfLines={3}
                returnKeyType="done"
              />
              {currentSituationInput.length > 0 && (
                <TouchableOpacity
                  onPress={() => setCurrentSituationInput("")}
                  style={styles.clearSituationButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => fetchFirstAidGuide(currentSituationInput)}
              disabled={loadingGuide || !currentSituationInput.trim()}
            >
              {loadingGuide ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="robot-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.searchButtonIcon}
                  />
                  <Text style={styles.searchButtonText}>
                    Get AI First Aid Advice
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* First Aid Guide Display */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>First Aid Guide</Text>
            {loadingGuide ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Generating first aid guide...
                </Text>
                <Text style={styles.loadingSubtext}>
                  This might take a few moments.
                </Text>
              </View>
            ) : guideError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>
                  Error retrieving guide: {guideError}
                </Text>
              </View>
            ) : firstAidGuideResult ? (
              <View style={styles.resultContainer}>
                <Text style={styles.guideTitle}>
                  {firstAidGuideResult.title}
                </Text>
                {renderGuideSection(
                  "Initial Assessment",
                  firstAidGuideResult.initialassessment,
                  "initialAssessment",
                  "clipboard-text-outline"
                )}
                {renderGuideSection(
                  "Step-by-step Actions",
                  firstAidGuideResult.stepbystepactions,
                  "steps",
                  "list-status"
                )}
                {renderGuideSection(
                  "When to Call Emergency",
                  firstAidGuideResult.whenmocallemergency,
                  "callEmergency",
                  "phone-alert-outline",
                  true
                )}
                {renderGuideSection(
                  "What NOT to Do",
                  firstAidGuideResult.whatnotto,
                  "doNotDo",
                  "alert-octagon-outline",
                  true
                )}
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="lifebuoy"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Find quick first aid steps for any emergency.
                </Text>
                <Text style={styles.placeholderSubText}>
                  Search a topic or describe your situation.
                </Text>
              </View>
            )}
          </View>

          {/* Disclaimer Section */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Disclaimer:</Text>
            <Text style={styles.disclaimerText}>
              This first aid guide is for informational purposes only and is not
              a substitute for professional medical advice, diagnosis, or
              treatment. In a medical emergency, always call your local
              emergency number (e.g., ${EMERGENCY_NUMBER}) immediately.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 15,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emergencyCallButton: {
    backgroundColor: COLORS.error,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 25,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  emergencyCallButtonText: {
    fontSize: 19,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.separator,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearSearchButton: {
    padding: 5,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
    position: "absolute",
    width: "100%",
    top: 155, // Adjust based on card padding + input height
    zIndex: 100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.separator,
  },
  suggestionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: "row",
    marginTop: 10,
  },
  searchButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
  },
  searchButtonIcon: {
    marginRight: 5,
  },
  categoriesContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  categoryCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.3, // Roughly 3 cards per row in horizontal scroll
    height: 110,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 8,
    textAlign: "center",
  },
  situationInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Align icon to top
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.separator,
    minHeight: 80, // Minimum height for multiline
  },
  situationIcon: {
    marginTop: 12, // Align icon better with multiline input
    marginRight: 10,
  },
  situationInput: {
    flex: 1,
    paddingVertical: 12, // Ensure consistent padding for multiline
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearSituationButton: {
    padding: 5,
    marginTop: 8,
  },
  resultContainer: {
    // Styling for the overall result display
  },
  guideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  infoSectionCard: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  warningSectionCard: {
    borderColor: COLORS.error,
    borderLeftWidth: 5, // Highlight warnings with a thicker left border
    backgroundColor: COLORS.error + "10",
  },
  infoSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator + "50",
  },
  sectionIcon: {
    marginRight: 10,
  },
  infoSectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  infoSectionContentContainer: {
    padding: 15,
  },
  infoSectionContent: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginRight: 8,
    minWidth: 25, // Ensure numbers align
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "20",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.error,
    flexShrink: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    opacity: 0.7,
  },
  placeholderSubText: {
    marginTop: 5,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    opacity: 0.5,
    fontStyle: "italic",
  },
  disclaimerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.warningDark,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default FirstAidGuideScreen;
