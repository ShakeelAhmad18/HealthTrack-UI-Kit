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
  LayoutAnimation, // For subtle animations
  UIManager, // For LayoutAnimation on Android
  // NativeModules, // You might need this if checking for new arch via a custom module
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming you use expo-router
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook


const { width } = Dimensions.get("window");

// Mock "Term of the Day" data (in a real app, this would come from an API or a rotating list)
const TERMS_OF_THE_DAY = [
  {
    term: "Myocardium",
    definition: "The muscular tissue of the heart.",
    pronunciation: "/ˌmaɪoʊˈkɑːrdiəm/",
    etymology: "Myo- (muscle) + cardium (heart)",
  },
  {
    term: "Dyspnea",
    definition: "Difficult or labored breathing; shortness of breath.",
    pronunciation: "/dɪspˈniːə/",
    etymology: "Dys- (bad, difficult) + pnea (breathing)",
  },
  {
    term: "Hypotension",
    definition: "Abnormally low blood pressure.",
    pronunciation: "/ˌhaɪpoʊˈtɛnʃən/",
    etymology: "Hypo- (under, below) + tension (pressure)",
  },
  {
    term: "Bradycardia",
    definition: "A slow heart rate, typically less than 60 beats per minute.",
    pronunciation: "/ˌbrædɪˈkɑːrdiə/",
    etymology: "Brady- (slow) + cardia (heart condition)",
  },
];

const MedicalTerminologyScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for term input
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

  // State for AI analysis result
  const [definitionResult, setDefinitionResult] = useState(null); // Full AI explanation
  const [loadingDefinition, setLoadingDefinition] = useState(false);
  const [definitionError, setDefinitionError] = useState(null);

  // State for collapsible sections in results
  const [expandedSections, setExpandedSections] = useState({
    definition: true,
    etymology: false,
    examples: false,
    pronunciation: false,
    relatedTerms: false,
  });

  // State for search history
  const [searchHistory, setSearchHistory] = useState([]); // {id, term}

  // Term of the day state
  const [currentTermOfTheDay, setCurrentTermOfTheDay] = useState(null);

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to handle AI response for definition
  useEffect(() => {
    if (response) {
      setDefinitionResult(response);
      setLoadingDefinition(false); // Stop local loading
      setDefinitionError(null); // Clear any previous errors

      // Scroll to the result section automatically
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setDefinitionError(error);
      setLoadingDefinition(false); // Stop local loading
      setDefinitionResult(null); // Clear previous results
      Alert.alert("AI Error", error);
    }
  }, [error]);

  // Set initial Term of the Day
  useEffect(() => {
    // In a real app, this would probably be a daily API call or date-based logic
    const todayIndex = new Date().getDate() % TERMS_OF_THE_DAY.length;
    setCurrentTermOfTheDay(TERMS_OF_THE_DAY[todayIndex]);
  }, []);

  const handleAskTerm = async () => {
    const term = searchTerm.trim();
    if (!term) {
      Alert.alert("Input Required", "Please enter a medical term to search.");
      return;
    }

    setLoadingDefinition(true);
    setDefinitionResult(null);
    setDefinitionError(null);
    LayoutAnimation.easeInEaseOut(); // Animate layout changes

    // Add to history (only if not already there or if it's a new search)
    if (
      !searchHistory.some(
        (item) => item.term.toLowerCase() === term.toLowerCase()
      )
    ) {
      setSearchHistory((prev) =>
        [{ id: Date.now().toString(), term: term }, ...prev].slice(0, 5)
      ); // Keep last 5
    }

    // AI Prompt Strategy: Structured output is key for parsing
    const prompt = `As a precise and knowledgeable medical terminology expert, explain the following medical term. Provide clear, concise, and easy-to-understand information suitable for a general audience.
    
    Please structure your response exactly as follows, using the specified headings. If a section is not directly applicable or information is unavailable, state 'Not applicable' or 'Information unavailable'.
    
    ### Definition
    [Your concise, simple definition here.]
    
    ### Etymology (Word Origin)
    [Break down the term into its roots, prefixes, and suffixes, explaining each part's meaning. Example: 'Cardio-' (heart), '-logy' (study of).]
    
    ### Simple Examples
    [Provide 1-2 practical, easy-to-understand sentences or scenarios demonstrating how the term is used.]
    
    ### Pronunciation Guide
    [Provide a simple phonetic guide or a common way to pronounce the term. Example: '/dɪsˈpniːə/' or 'dis-NEE-uh']
    
    ### Related Terms
    [List 2-3 closely related medical terms or concepts that might enhance understanding.]
    
    Medical Term: "${term}"`;

    await generateContent(prompt);
  };

  const parseGeminiResponse = useCallback((rawResponse) => {
    if (!rawResponse) return null;

    const sections = {};
    const sectionHeaders = [
      "Definition",
      "Etymology (Word Origin)",
      "Simple Examples",
      "Pronunciation Guide",
      "Related Terms",
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

    // Join arrays into single strings for each section, preserving paragraphs
    const result = {};
    sectionHeaders.forEach((header) => {
      result[header.toLowerCase().replace(/[^a-z0-9]/g, "")] = sections[header]
        ? sections[header].join("\n").trim()
        : "Information unavailable.";
    });

    return result;
  }, []);

  const toggleSection = (sectionName) => {
    LayoutAnimation.easeInEaseOut(); // Animate expansion/collapse
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All",
      "Are you sure you want to clear the current search and history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            LayoutAnimation.easeInEaseOut();
            setSearchTerm("");
            setDefinitionResult(null);
            setLoadingDefinition(false);
            setDefinitionError(null);
            setSearchHistory([]);
            setExpandedSections({
              definition: true,
              etymology: false,
              examples: false,
              pronunciation: false,
              relatedTerms: false,
            });
          },
        },
      ]
    );
  };

  const handleSelectHistoryTerm = (term) => {
    setSearchTerm(term);
    handleAskTerm(); // Re-run search with history term
  };

  const renderResultSection = (title, content, sectionKey) => {
    if (!content || content === "Information unavailable.") return null; // Don't render if no content

    const isExpanded = expandedSections[sectionKey];
    const iconName = isExpanded ? "chevron-up" : "chevron-down";

    return (
      <View style={styles.resultSectionCard}>
        <TouchableOpacity
          onPress={() => toggleSection(sectionKey)}
          style={styles.resultSectionHeader}
        >
          <Text style={styles.resultSectionTitle}>{title}</Text>
          <Ionicons name={iconName} size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        {isExpanded && (
          <Text style={styles.resultSectionContent}>{content}</Text>
        )}
      </View>
    );
  };

  const parsedResult = parseGeminiResponse(definitionResult);

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
          <Text style={styles.headerTitle}>Medical Lexicon</Text>
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
          Demystifying complex medical terms
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
          {/* Term of the Day */}
          {currentTermOfTheDay && (
            <View style={styles.termOfTheDayCard}>
              <View style={styles.termOfTheDayHeader}>
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  size={24}
                  color={COLORS.accent}
                />
                <Text style={styles.termOfTheDayTitle}>Term of the Day</Text>
              </View>
              <Text style={styles.termOfTheDayTerm}>
                {currentTermOfTheDay.term}
              </Text>
              <Text style={styles.termOfTheDayDefinition}>
                {currentTermOfTheDay.definition}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchTerm(currentTermOfTheDay.term);
                  handleAskTerm();
                }}
                style={styles.learnMoreButton}
              >
                <Text style={styles.learnMoreButtonText}>Learn More</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Search Input Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              What term do you want to understand?
            </Text>
            <View
              style={[
                styles.searchInputContainer,
                isSearchInputFocused && {
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={COLORS.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="E.g., Hypertension, Biopsy, Pathology"
                placeholderTextColor={COLORS.textPlaceholder}
                value={searchTerm}
                onChangeText={setSearchTerm}
                onFocus={() => setIsSearchInputFocused(true)}
                onBlur={() => setIsSearchInputFocused(false)}
                onSubmitEditing={handleAskTerm} // Allow search on enter key
                returnKeyType="search"
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchTerm("")}
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
            <TouchableOpacity
              style={styles.askButton}
              onPress={handleAskTerm}
              disabled={loadingDefinition || !searchTerm.trim()}
            >
              {loadingDefinition ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="bulb-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.askButtonIcon}
                  />
                  <Text style={styles.askButtonText}>Ask AI</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.historyScrollContent}
              >
                {searchHistory.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyTag}
                    onPress={() => handleSelectHistoryTerm(item.term)}
                  >
                    <Text style={styles.historyTagText}>{item.term}</Text>
                    <Ionicons
                      name="reload-circle-outline"
                      size={16}
                      color={COLORS.textSecondary}
                      style={{ marginLeft: 5 }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Analysis Result Display */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Understanding the Term</Text>
            {loadingDefinition ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  AI is breaking down "{searchTerm || "the term"}"...
                </Text>
                <Text style={styles.loadingSubtext}>
                  This might take a few seconds.
                </Text>
              </View>
            ) : definitionError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>
                  Could not get definition: {definitionError}
                </Text>
              </View>
            ) : parsedResult ? (
              <View style={styles.resultContainer}>
                {renderResultSection(
                  "Definition",
                  parsedResult.definition,
                  "definition"
                )}
                {renderResultSection(
                  "Etymology (Word Origin)",
                  parsedResult.etymology,
                  "etymology"
                )}
                {renderResultSection(
                  "Simple Examples",
                  parsedResult.simpleexamples,
                  "examples"
                )}
                {renderResultSection(
                  "Pronunciation Guide",
                  parsedResult.pronunciationguide,
                  "pronunciation"
                )}
                {renderResultSection(
                  "Related Terms",
                  parsedResult.relatedterms,
                  "relatedterms"
                )}
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Enter a medical term above to get a clear, easy-to-understand
                  explanation.
                </Text>
              </View>
            )}
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
  termOfTheDayCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.accent,
  },
  termOfTheDayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  termOfTheDayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.accent,
    marginLeft: 8,
  },
  termOfTheDayTerm: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  termOfTheDayDefinition: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary + "10", // Light primary background
  },
  learnMoreButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 5,
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
  askButton: {
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
  },
  askButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
  },
  askButtonIcon: {
    marginRight: 5,
  },
  historyScrollContent: {
    paddingRight: 15,
    paddingBottom: 5, // For shadow
  },
  historyTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.info + "20", // Light blue background
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.info,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyTagText: {
    fontSize: 14,
    color: COLORS.infoDark, // Darker blue text
    fontWeight: "600",
  },
  resultContainer: {
    // Styling for the overall result display
  },
  resultSectionCard: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden", // Ensures content doesn't bleed out during animation
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  resultSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white, // Header background
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator + "50", // Lighter separator
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  resultSectionContent: {
    padding: 15,
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
});

export default MedicalTerminologyScreen;
