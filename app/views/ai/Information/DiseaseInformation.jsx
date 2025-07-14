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
  // No LayoutAnimation for this version
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming expo-router
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

// --- MOCK DISEASE DATA FOR AUTOCOMPLETE ---
const MOCK_DISEASE_SUGGESTIONS = [
  "Diabetes Mellitus Type 2",
  "Hypertension",
  "Coronary Artery Disease",
  "Asthma",
  "Chronic Obstructive Pulmonary Disease",
  "Influenza",
  "Pneumonia",
  "Osteoarthritis",
  "Rheumatoid Arthritis",
  "Migraine",
  "Anxiety Disorder",
  "Depression",
  "Alzheimer's Disease",
  "Parkinson's Disease",
  "HIV/AIDS",
  "Tuberculosis",
  "Malaria",
  "Dengue Fever",
  "Celiac Disease",
  "Crohn's Disease",
];

// --- MOCK "DISEASE OF THE DAY" DATA ---
const DISEASES_OF_THE_DAY = [
  {
    name: "Hypertension (High Blood Pressure)",
    overview:
      "Hypertension, or high blood pressure, is a common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems, such as heart disease.",
    icon: "heart-pulse",
  },
  {
    name: "Diabetes Mellitus Type 2",
    overview:
      "Type 2 diabetes is a chronic condition that affects the way your body processes blood sugar (glucose). With type 2 diabetes, your body either doesn't produce enough insulin, or it resists insulin.",
    icon: "blood-glucose",
  },
  {
    name: "Asthma",
    overview:
      "Asthma is a chronic lung disease that inflames and narrows the airways. It causes recurring periods of wheezing (a whistling sound when you breathe), chest tightness, shortness of breath, and coughing.",
    icon: "lung",
  },
];

const DiseaseInformationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for disease input and suggestions
  const [currentDiseaseInput, setCurrentDiseaseInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // State for AI-generated disease info
  const [diseaseInfoResult, setDiseaseInfoResult] = useState(null); // Parsed AI response
  const [loadingDiseaseInfo, setLoadingDiseaseInfo] = useState(false);
  const [diseaseInfoError, setDiseaseInfoError] = useState(null);

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    overview: true, // Overview often expanded by default
    symptoms: false,
    causes: false,
    riskFactors: false,
    diagnosis: false,
    treatment: false,
    prevention: false,
    prognosis: false,
  });

  // Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to handle AI response for disease info
  useEffect(() => {
    if (response) {
      const parsed = parseGeminiResponse(response);
      setDiseaseInfoResult(parsed);
      setLoadingDiseaseInfo(false);
      setDiseaseInfoError(null);
      // Scroll to the result section automatically
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [response, parseGeminiResponse]);

  // Effect to handle errors from API hook
  useEffect(() => {
    if (error) {
      setDiseaseInfoError(error);
      setLoadingDiseaseInfo(false);
      setDiseaseInfoResult(null);
      Alert.alert("AI Error", error);
    }
  }, [error]);

  // Set initial Disease of the Day
  const [currentDiseaseOfTheDay, setCurrentDiseaseOfTheDay] = useState(null);
  useEffect(() => {
    const todayIndex = new Date().getDate() % DISEASES_OF_THE_DAY.length;
    setCurrentDiseaseOfTheDay(DISEASES_OF_THE_DAY[todayIndex]);
  }, []);

  // Handle disease input change for autocomplete
  const handleDiseaseInputChange = (text) => {
    setCurrentDiseaseInput(text);
    if (text.length > 1) {
      const filtered = MOCK_DISEASE_SUGGESTIONS.filter((disease) =>
        disease.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5); // Limit suggestions
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  // Perform search for a disease
  const handleSearchDisease = async (diseaseName) => {
    const term = diseaseName.trim();
    if (!term) {
      Alert.alert("Input Required", "Please enter a disease name to search.");
      return;
    }

    setCurrentDiseaseInput(term); // Set input to the selected/confirmed term
    setLoadingDiseaseInfo(true);
    setDiseaseInfoResult(null);
    setDiseaseInfoError(null);
    setFilteredSuggestions([]); // Clear suggestions after selection/search
    setIsInputFocused(false); // Remove focus to hide suggestions

    const prompt = `As a knowledgeable medical information AI, provide comprehensive and easy-to-understand information about the following disease: "${term}".

    Please structure your response exactly as follows, using the specified headings. If a section is not directly applicable or information is unavailable, state 'Information unavailable.'

    ### Overview
    [A concise summary of the disease.]

    ### Common Symptoms
    [A bulleted list of common signs and symptoms.]

    ### Causes
    [A bulleted list of common causes or etiologies.]

    ### Risk Factors
    [A bulleted list of factors that increase the risk of developing the disease.]

    ### Diagnosis
    [How the disease is typically diagnosed (e.g., tests, examinations).]

    ### Treatment Options
    [Common treatment approaches and medications.]

    ### Prevention
    [Measures that can be taken to prevent the disease.]

    ### Prognosis
    [The likely course or outcome of the disease.]
    `;

    await generateContent(prompt);
  };

  // Parses the Gemini API response into a structured format for display
  const parseGeminiResponse = useCallback(
    (rawResponse) => {
      if (!rawResponse) return null;

      const sections = {};
      const sectionOrder = [
        "Overview",
        "Common Symptoms",
        "Causes",
        "Risk Factors",
        "Diagnosis",
        "Treatment Options",
        "Prevention",
        "Prognosis",
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

      // Join arrays into single strings for each section, handling bullet points
      const result = {
        diseaseName: currentDiseaseInput, // Use the searched term as the disease name
      };
      sectionOrder.forEach((header) => {
        const key = header.toLowerCase().replace(/[^a-z0-9]/g, ""); // e.g., "common_symptoms"
        let content = sections[header]
          ? sections[header].join("\n").trim()
          : "Information unavailable.";
        // Remove any leading bullet markdown if AI included it, for cleaner display
        content = content.replace(/^- /, "").replace(/^\* /, "");
        result[key] = content;
      });

      return result;
    },
    [currentDiseaseInput]
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
      "Are you sure you want to clear the current search and results?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setCurrentDiseaseInput("");
            setFilteredSuggestions([]);
            setDiseaseInfoResult(null);
            setLoadingDiseaseInfo(false);
            setDiseaseInfoError(null);
            setExpandedSections({
              overview: true,
              symptoms: false,
              causes: false,
              riskFactors: false,
              diagnosis: false,
              treatment: false,
              prevention: false,
              prognosis: false,
            });
          },
        },
      ]
    );
  };

  const renderInfoSection = (title, content, sectionKey, iconName) => {
    if (!content || content === "Information unavailable.") return null;

    const isExpanded = expandedSections[sectionKey];
    const icon = iconName ? (
      <MaterialCommunityIcons
        name={iconName}
        size={22}
        color={COLORS.primary}
        style={styles.sectionIcon}
      />
    ) : null;

    return (
      <View style={styles.infoSectionCard}>
        <TouchableOpacity
          onPress={() => toggleSection(sectionKey)}
          style={styles.infoSectionHeader}
        >
          {icon}
          <Text style={styles.infoSectionTitle}>{title}</Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
        {isExpanded && <Text style={styles.infoSectionContent}>{content}</Text>}
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
          <Text style={styles.headerTitle}>Disease Insights</Text>
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
          Understand conditions, symptoms, and treatments
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
          {/* Disease of the Day */}
          {currentDiseaseOfTheDay && (
            <View style={styles.diseaseOfTheDayCard}>
              <View style={styles.diseaseOfTheDayHeader}>
                <MaterialCommunityIcons
                  name="star-outline"
                  size={24}
                  color={COLORS.accent}
                />
                <Text style={styles.diseaseOfTheDayTitle}>
                  Disease of the Day
                </Text>
              </View>
              <Text style={styles.diseaseOfTheDayName}>
                {currentDiseaseOfTheDay.name}
              </Text>
              <Text style={styles.diseaseOfTheDayOverview}>
                {currentDiseaseOfTheDay.overview}
              </Text>
              <TouchableOpacity
                onPress={() => handleSearchDisease(currentDiseaseOfTheDay.name)}
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
            <Text style={styles.sectionTitle}>Search for a Disease</Text>
            <View
              style={[
                styles.searchInputContainer,
                isInputFocused && {
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
                placeholder="E.g., Diabetes, Asthma, Cancer"
                placeholderTextColor={COLORS.textPlaceholder}
                value={currentDiseaseInput}
                onChangeText={handleDiseaseInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                  setIsInputFocused(false);
                  setTimeout(() => setFilteredSuggestions([]), 200); // Delay to allow tap on suggestion
                }}
                onSubmitEditing={() => handleSearchDisease(currentDiseaseInput)}
                returnKeyType="search"
              />
              {currentDiseaseInput.length > 0 && (
                <TouchableOpacity
                  onPress={() => setCurrentDiseaseInput("")}
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

            {/* Autocomplete Suggestions */}
            {isInputFocused &&
              filteredSuggestions.length > 0 &&
              currentDiseaseInput.length > 1 && (
                <View style={styles.suggestionsContainer}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => handleSearchDisease(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleSearchDisease(currentDiseaseInput)}
              disabled={loadingDiseaseInfo || !currentDiseaseInput.trim()}
            >
              {loadingDiseaseInfo ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="book-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.searchButtonIcon}
                  />
                  <Text style={styles.searchButtonText}>Get Information</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Disease Information Display */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Disease Details</Text>
            {loadingDiseaseInfo ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Fetching information on "
                  {currentDiseaseInput || "the disease"}"...
                </Text>
                <Text style={styles.loadingSubtext}>
                  This might take a few seconds.
                </Text>
              </View>
            ) : diseaseInfoError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>
                  Could not retrieve information: {diseaseInfoError}
                </Text>
              </View>
            ) : diseaseInfoResult ? (
              <View style={styles.resultContainer}>
                <Text style={styles.diseaseNameHeader}>
                  {diseaseInfoResult.diseaseName}
                </Text>
                {renderInfoSection(
                  "Overview",
                  diseaseInfoResult.overview,
                  "overview",
                  "information"
                )}
                {renderInfoSection(
                  "Common Symptoms",
                  diseaseInfoResult.commonsymptoms,
                  "symptoms",
                  "pulse"
                )}
                {renderInfoSection(
                  "Causes",
                  diseaseInfoResult.causes,
                  "causes",
                  "virus-outline"
                )}
                {renderInfoSection(
                  "Risk Factors",
                  diseaseInfoResult.riskfactors,
                  "risk"
                )}
                {renderInfoSection(
                  "Diagnosis",
                  diseaseInfoResult.diagnosis,
                  "diagnosis",
                  "microscope"
                )}
                {renderInfoSection(
                  "Treatment Options",
                  diseaseInfoResult.treatmentoptions,
                  "treatment",
                  "medical-bag"
                )}
                {renderInfoSection(
                  "Prevention",
                  diseaseInfoResult.prevention,
                  "prevention",
                  "shield-check-outline"
                )}
                {renderInfoSection(
                  "Prognosis",
                  diseaseInfoResult.prognosis,
                  "prognosis",
                  "chart-line"
                )}
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="hospital-box-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Enter a disease name above to get detailed, easy-to-understand
                  information.
                </Text>
              </View>
            )}
          </View>

          {/* Disclaimer Section */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Disclaimer:</Text>
            <Text style={styles.disclaimerText}>
              This information is for educational purposes only and is not a
              substitute for professional medical advice. Always consult a
              qualified healthcare professional for diagnosis, treatment, and
              personalized health guidance.
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
  diseaseOfTheDayCard: {
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
  diseaseOfTheDayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  diseaseOfTheDayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.accent,
    marginLeft: 8,
  },
  diseaseOfTheDayName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  diseaseOfTheDayOverview: {
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
  resultContainer: {
    // Styling for the overall result display
  },
  diseaseNameHeader: {
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
    flex: 1, // Allows title to take available space
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  infoSectionContent: {
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

export default DiseaseInformationScreen;
