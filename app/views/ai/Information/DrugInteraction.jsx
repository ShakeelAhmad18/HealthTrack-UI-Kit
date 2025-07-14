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
  // Removed: LayoutAnimation,
  // Removed: UIManager,
  // Removed: Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming expo-router
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

// Removed: LayoutAnimation configuration for Android

const { width } = Dimensions.get("window");

// --- MOCK DRUG DATA FOR AUTOCOMPLETE ---
// In a real app, this would come from a robust, searchable drug database API.
const MOCK_DRUG_SUGGESTIONS = [
  "Lisinopril",
  "Amlodipine",
  "Metformin",
  "Simvastatin",
  "Levothyroxine",
  "Aspirin",
  "Ibuprofen",
  "Omeprazole",
  "Amoxicillin",
  "Atorvastatin",
  "Warfarin",
  "Fluoxetine",
  "Gabapentin",
  "Hydrochlorothiazide",
  "Tramadol",
  "Sertraline",
  "Albuterol",
  "Prednisone",
  "Doxycycline",
  "Insulin Glargine",
];

// --- INTERACTION SEVERITY MAPPING ---
const INTERACTION_SEVERITY = {
  major: { color: COLORS.error, icon: "alert-octagon" },
  moderate: { color: COLORS.warning, icon: "alert" },
  minor: { color: COLORS.info, icon: "information" },
  "no known interaction": { color: COLORS.success, icon: "check-circle" },
};

const DrugInteractionScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for drug input and selection
  const [currentDrugInput, setCurrentDrugInput] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState([]); // Array of { id, name }
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // State for interaction results
  const [interactionResults, setInteractionResults] = useState(null); // Parsed AI response
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [interactionError, setInteractionError] = useState(null);

  // State for collapsible interaction detail sections
  const [expandedInteractions, setExpandedInteractions] = useState({}); // { interactionId: boolean }

  // Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to handle AI response for interactions
  useEffect(() => {
    if (response) {
      const parsed = parseGeminiResponse(response);
      setInteractionResults(parsed);
      setLoadingInteractions(false);
      setInteractionError(null);
      // Automatically expand the first interaction if major/moderate
      if (parsed && parsed.interactions && parsed.interactions.length > 0) {
        const firstInteractionId = parsed.interactions[0].id;
        if (
          parsed.interactions[0].severity === "major" ||
          parsed.interactions[0].severity === "moderate"
        ) {
          setExpandedInteractions((prev) => ({
            ...prev,
            [firstInteractionId]: true,
          }));
        }
      }
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [response, parseGeminiResponse]);

  // Effect to handle errors from API hook
  useEffect(() => {
    if (error) {
      setInteractionError(error);
      setLoadingInteractions(false);
      setInteractionResults(null);
      Alert.alert("Interaction Error", error);
    }
  }, [error]);

  // Handle drug input change for autocomplete
  const handleDrugInputChange = (text) => {
    setCurrentDrugInput(text);
    if (text.length > 1) {
      const filtered = MOCK_DRUG_SUGGESTIONS.filter((drug) =>
        drug.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5); // Limit suggestions
      // Removed: LayoutAnimation.easeInEaseOut();
      setFilteredSuggestions(filtered);
    } else {
      // Removed: LayoutAnimation.easeInEaseOut();
      setFilteredSuggestions([]);
    }
  };

  // Add drug from suggestion or direct input
  const addDrug = (drugName) => {
    const trimmedDrug = drugName.trim();
    if (
      trimmedDrug &&
      !selectedDrugs.some(
        (d) => d.name.toLowerCase() === trimmedDrug.toLowerCase()
      )
    ) {
      // Removed: LayoutAnimation.easeInEaseOut();
      setSelectedDrugs((prev) => [
        ...prev,
        { id: Date.now().toString(), name: trimmedDrug },
      ]);
      setCurrentDrugInput("");
      setFilteredSuggestions([]);
      setIsInputFocused(false);
      // Clear previous results when adding a new drug
      setInteractionResults(null);
      setInteractionError(null);
    }
  };

  // Remove a selected drug
  const removeDrug = (id) => {
    // Removed: LayoutAnimation.easeInEaseOut();
    setSelectedDrugs((prev) => prev.filter((drug) => drug.id !== id));
    // Clear previous results if drugs are removed
    setInteractionResults(null);
    setInteractionError(null);
  };

  const handleCheckInteractions = async () => {
    if (selectedDrugs.length < 2) {
      Alert.alert(
        "Minimum Drugs Required",
        "Please add at least two drugs to check for interactions."
      );
      return;
    }

    setLoadingInteractions(true);
    setInteractionResults(null);
    setInteractionError(null);
    // Removed: LayoutAnimation.easeInEaseOut(); // Animate results container appearance

    const drugNames = selectedDrugs.map((d) => d.name).join(", ");

    // Advanced AI Prompt Strategy for structured output
    const prompt = `As a drug interaction analysis AI, analyze potential interactions between the following drugs: ${drugNames}.
    
    For each potential interaction, provide the following details. If no known interactions are found, state 'No known significant interactions.'
    
    Format the output as follows, with clear sections for each interaction:
    
    ---
    **Interaction 1: [Drug A] + [Drug B]**
    **Severity:** [Major/Moderate/Minor/No Known Significant Interaction]
    **Mechanism:** [Brief explanation of how the drugs interact at a pharmacological level.]
    **Clinical Effect:** [What happens to the patient; potential symptoms or outcomes.]
    **Management:** [Recommended actions, e.g., "Avoid concomitant use," "Monitor closely for symptoms," "Adjust dose," "Consult healthcare professional."]
    ---
    **Interaction 2: [Drug C] + [Drug D]**
    ...
    
    If no significant interactions are found, the entire response should simply be:
    "**No known significant interactions between the listed drugs.** Please consult a healthcare professional for personalized advice."
    `;

    await generateContent(prompt);
  };

  // Parses the Gemini API response into a structured format
  const parseGeminiResponse = useCallback(
    (rawResponse) => {
      if (!rawResponse) return null;

      if (
        rawResponse.includes(
          "**No known significant interactions between the listed drugs.**"
        )
      ) {
        return {
          summary: "No known significant interactions.",
          interactions: [
            {
              id: "no_interaction",
              drugs: selectedDrugs.map((d) => d.name).join(" & "),
              severity: "no known interaction",
              mechanism:
                "No known significant interactions found based on available data.",
              clinicalEffect:
                "No adverse clinical effects expected from interaction.",
              management:
                "Continue current therapy as prescribed. Always consult a healthcare professional for personalized advice.",
            },
          ],
        };
      }

      const interactions = [];
      const interactionBlocks = rawResponse
        .split("---")
        .filter((block) => block.trim().length > 0);

      interactionBlocks.forEach((block, index) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        let currentInteraction = { id: `interaction_${index}` };

        lines.forEach((line) => {
          if (line.startsWith("**Interaction")) {
            currentInteraction.drugs =
              line.split(": ")[1]?.replace(/\*\*/g, "").trim() ||
              "Unknown Drugs";
          } else if (line.startsWith("**Severity:**")) {
            currentInteraction.severity =
              line.split(": ")[1]?.replace(/\*\*/g, "").toLowerCase().trim() ||
              "unknown";
          } else if (line.startsWith("**Mechanism:**")) {
            currentInteraction.mechanism =
              line.split(": ")[1]?.replace(/\*\*/g, "").trim() || "N/A";
          } else if (line.startsWith("**Clinical Effect:**")) {
            currentInteraction.clinicalEffect =
              line.split(": ")[1]?.replace(/\*\*/g, "").trim() || "N/A";
          } else if (line.startsWith("**Management:**")) {
            currentInteraction.management =
              line.split(": ")[1]?.replace(/\*\*/g, "").trim() || "N/A";
          }
        });
        if (currentInteraction.drugs) {
          // Only add if it's a valid interaction block
          interactions.push(currentInteraction);
        }
      });

      return {
        summary:
          interactions.length > 0
            ? `Found ${interactions.length} potential interaction(s).`
            : "No significant interactions found.",
        interactions: interactions,
      };
    },
    [selectedDrugs]
  );

  const toggleInteractionExpand = (id) => {
    // Removed: LayoutAnimation.easeInEaseOut();
    setExpandedInteractions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All",
      "Are you sure you want to clear all entered drugs and results?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            // Removed: LayoutAnimation.easeInEaseOut();
            setCurrentDrugInput("");
            setSelectedDrugs([]);
            setFilteredSuggestions([]);
            setInteractionResults(null);
            setLoadingInteractions(false);
            setInteractionError(null);
            setExpandedInteractions({});
          },
        },
      ]
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
          <Text style={styles.headerTitle}>Drug Interactions</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Check for potential drug-drug interactions
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
          {/* Drug Input Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Enter Medications</Text>

            {/* Selected Drugs Display */}
            {selectedDrugs.length > 0 && (
              <View style={styles.selectedDrugsContainer}>
                {selectedDrugs.map((drug) => (
                  <View key={drug.id} style={styles.drugTag}>
                    <Text style={styles.drugTagName}>{drug.name}</Text>
                    <TouchableOpacity
                      onPress={() => removeDrug(drug.id)}
                      style={styles.removeDrugButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={COLORS.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Current Drug Input */}
            <View
              style={[
                styles.drugInputContainer,
                isInputFocused && {
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="pill"
                size={24}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.drugInput}
                placeholder={
                  selectedDrugs.length === 0
                    ? "First drug name..."
                    : "Next drug name..."
                }
                placeholderTextColor={COLORS.textPlaceholder}
                value={currentDrugInput}
                onChangeText={handleDrugInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                  setIsInputFocused(false);
                  // Give a slight delay before clearing suggestions
                  setTimeout(() => setFilteredSuggestions([]), 200);
                }}
                onSubmitEditing={() => addDrug(currentDrugInput)}
                returnKeyType="done"
              />
              {currentDrugInput.length > 0 && (
                <TouchableOpacity
                  onPress={() => setCurrentDrugInput("")}
                  style={styles.clearInputButton}
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
              currentDrugInput.length > 1 && (
                <View style={styles.suggestionsContainer}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => addDrug(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            <TouchableOpacity
              style={styles.checkButton}
              onPress={handleCheckInteractions}
              disabled={loadingInteractions || selectedDrugs.length < 2}
            >
              {loadingInteractions ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="search"
                    size={20}
                    color={COLORS.white}
                    style={styles.checkButtonIcon}
                  />
                  <Text style={styles.checkButtonText}>
                    Check Interactions ({selectedDrugs.length})
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Interaction Results Display */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Interaction Analysis</Text>
            {loadingInteractions ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Analyzing interactions...
                </Text>
                <Text style={styles.loadingSubtext}>
                  This might take a few moments.
                </Text>
              </View>
            ) : interactionError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>
                  Error checking interactions: {interactionError}
                </Text>
              </View>
            ) : interactionResults &&
              interactionResults.interactions.length > 0 ? (
              <View>
                <Text style={styles.summaryText}>
                  {interactionResults.summary}
                </Text>
                {interactionResults.interactions.map((interaction) => {
                  const severityInfo =
                    INTERACTION_SEVERITY[interaction.severity] ||
                    INTERACTION_SEVERITY.minor;
                  const isExpanded = expandedInteractions[interaction.id];
                  return (
                    <View
                      key={interaction.id}
                      style={[
                        styles.interactionCard,
                        { borderColor: severityInfo.color },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => toggleInteractionExpand(interaction.id)}
                        style={styles.interactionHeader}
                      >
                        <MaterialCommunityIcons
                          name={severityInfo.icon}
                          size={28}
                          color={severityInfo.color}
                          style={styles.interactionIcon}
                        />
                        <View style={styles.interactionHeaderText}>
                          <Text
                            style={[
                              styles.interactionDrugs,
                              { color: severityInfo.color },
                            ]}
                          >
                            {interaction.drugs}
                          </Text>
                          <Text
                            style={[
                              styles.interactionSeverity,
                              { color: severityInfo.color },
                            ]}
                          >
                            Severity: {interaction.severity.toUpperCase()}
                          </Text>
                        </View>
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={24}
                          color={COLORS.textSecondary}
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.interactionDetails}>
                          <Text style={styles.detailHeading}>Mechanism:</Text>
                          <Text style={styles.detailText}>
                            {interaction.mechanism}
                          </Text>

                          <Text style={styles.detailHeading}>
                            Clinical Effect:
                          </Text>
                          <Text style={styles.detailText}>
                            {interaction.clinicalEffect}
                          </Text>

                          <Text style={styles.detailHeading}>Management:</Text>
                          <Text style={styles.detailText}>
                            {interaction.management}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ) : selectedDrugs.length >= 2 ? ( // Only show "No significant interactions" if 2+ drugs are selected
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={60}
                  color={COLORS.success}
                  style={{ opacity: 0.8 }}
                />
                <Text style={styles.placeholderText}>
                  No significant interactions found between the selected drugs.
                </Text>
                <Text style={styles.placeholderSubText}>
                  Always consult a healthcare professional.
                </Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="pill" // Already updated in previous step
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Add at least two medications above to check for interactions.
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
              qualified healthcare professional before making any decisions
              about your health or medications.
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
  selectedDrugsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    // Add a slight border/background for visual grouping
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 8,
    minHeight: 50, // Ensures it's visible even if empty to start
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  drugTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "15", // Light primary background for tags
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  drugTagName: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
  removeDrugButton: {
    marginLeft: 6,
    padding: 2,
  },
  drugInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.separator,
    height: 50, // Fixed height for input
  },
  inputIcon: {
    marginRight: 10,
  },
  drugInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearInputButton: {
    padding: 5,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
    position: "absolute", // Position over content
    width: "100%",
    top: 155, // Adjust based on card padding + input height
    zIndex: 100, // Ensure it's on top
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth, // Fine line
    borderBottomColor: COLORS.separator,
  },
  suggestionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  checkButton: {
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
  checkButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
  },
  checkButtonIcon: {
    marginRight: 5,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  interactionCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2, // Highlight with a thicker border
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  interactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.white, // Header background within card
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator + "50",
  },
  interactionIcon: {
    marginRight: 10,
  },
  interactionHeaderText: {
    flex: 1,
  },
  interactionDrugs: {
    fontSize: 16,
    fontWeight: "bold",
  },
  interactionSeverity: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  interactionDetails: {
    padding: 15,
    paddingTop: 10,
  },
  detailHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 5,
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
    borderLeftColor: COLORS.warning, // Emphasize importance
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

export default DrugInteractionScreen;
