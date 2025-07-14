import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming you're using Expo Router
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

// Pre-defined options for analysis focus (optional)
const ANALYSIS_FOCUS_OPTIONS = ["Nutrition", "Allergens", "Substitutions"];

const RecipeAnalyzerScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // Input states
  const [recipeText, setRecipeText] = useState("");
  const [servings, setServings] = useState("1"); // Default to 1 serving
  const [selectedAnalysisFocus, setSelectedAnalysisFocus] = useState([]); // Multi-select

  // State for AI generated analysis
  const [analyzedResult, setAnalyzedResult] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to update local state when AI response is received from the hook
  useEffect(() => {
    if (response) {
      setAnalyzedResult(response);
      setLoadingAnalysis(false); // Stop local loading
      // Scroll to the generated result section for better UX
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setAnalysisError(error);
      setLoadingAnalysis(false); // Stop local loading
      Alert.alert("Recipe Analysis Error", error);
    }
  }, [error]);

  const handleToggleAnalysisFocus = (focus) => {
    setSelectedAnalysisFocus((prevSelected) =>
      prevSelected.includes(focus)
        ? prevSelected.filter((item) => item !== focus)
        : [...prevSelected, focus]
    );
  };

  const handleAnalyzeRecipe = async () => {
    if (!recipeText.trim()) {
      Alert.alert(
        "Missing Recipe",
        "Please paste or type your recipe/ingredients to analyze."
      );
      return;
    }

    const parsedServings = parseInt(servings);
    if (isNaN(parsedServings) || parsedServings <= 0) {
      Alert.alert(
        "Invalid Servings",
        "Please enter a valid number of servings (e.g., 1, 2, 4)."
      );
      return;
    }

    setLoadingAnalysis(true);
    setAnalyzedResult(null);
    setAnalysisError(null);

    // Construct the prompt for the AI
    const prompt = `As a precise recipe analyzer AI, break down the following recipe text. Provide:
    1. A concise **Nutritional Summary** (Calories, Protein, Carbs, Fats - if derivable, or state generally).
    2. A **Key Ingredients** list.
    3. **Potential Allergens** (e.g., nuts, dairy, gluten, soy, eggs, shellfish).
    4. **Dietary Suitability Notes** (e.g., "Vegetarian-friendly," "Vegan option," "Gluten-free potential").
    5. **Healthier Alternatives/Tips** to improve the recipe's nutritional profile.

    Analyze the following recipe, assuming it yields approximately ${parsedServings} serving(s):

    "${recipeText.trim()}"

    Focus Areas: ${
      selectedAnalysisFocus.length > 0
        ? selectedAnalysisFocus.join(", ")
        : "General Analysis"
    }.
    Ensure the response is easy to read with clear headings for each section.`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all inputs and the analyzed recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setRecipeText("");
            setServings("1");
            setSelectedAnalysisFocus([]);
            setAnalyzedResult(null);
            setAnalysisError(null);
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
          <Text style={styles.headerTitle}>Recipe Analyzer</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Understand your meals, ingredient by ingredient
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
          {/* Recipe Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>
              Paste Your Recipe / Ingredients
            </Text>
            <View style={styles.recipeInputContainer}>
              <TextInput
                style={styles.recipeTextInput}
                placeholder="e.g., '2 chicken breasts, 1 cup rice, 1/2 broccoli...'"
                placeholderTextColor={COLORS.textPlaceholder}
                value={recipeText}
                onChangeText={setRecipeText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              {recipeText.length > 0 && (
                <TouchableOpacity
                  style={styles.clearInputButton}
                  onPress={() => setRecipeText("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Servings & Analysis Focus Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Analysis Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Approx. Servings:</Text>
              <TextInput
                style={styles.servingsInput}
                placeholder="1"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                value={servings}
                onChangeText={setServings}
              />
            </View>

            <Text style={styles.subSectionTitle}>
              Focus Analysis On (Optional)
            </Text>
            <View style={styles.optionButtonsContainer}>
              {ANALYSIS_FOCUS_OPTIONS.map((focus) => (
                <TouchableOpacity
                  key={focus}
                  style={[
                    styles.optionButton,
                    selectedAnalysisFocus.includes(focus) &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => handleToggleAnalysisFocus(focus)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedAnalysisFocus.includes(focus) &&
                        styles.optionButtonTextActive,
                    ]}
                  >
                    {focus}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Analyze Button */}
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              (!recipeText.trim() || loadingAnalysis) &&
                styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyzeRecipe}
            disabled={!recipeText.trim() || loadingAnalysis}
          >
            {loadingAnalysis ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze Recipe</Text>
            )}
          </TouchableOpacity>

          {/* Analyzed Result Display */}
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Analysis Results</Text>
            {loadingAnalysis ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Analyzing your recipe, please wait...
                </Text>
              </View>
            ) : analysisError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{analysisError}</Text>
              </View>
            ) : analyzedResult ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{analyzedResult}</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Paste a recipe or list of ingredients above to analyze its
                  nutritional content, allergens, and more!
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
    paddingBottom: 15,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 10,
    marginTop: 10,
  },
  inputSection: {
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
  recipeInputContainer: {
    position: "relative",
    marginBottom: 10,
  },
  recipeTextInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
    minHeight: 120, // Taller input area
  },
  clearInputButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginRight: 10,
  },
  servingsInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
    maxWidth: 80, // Fixed width for servings input
    textAlign: "center",
  },
  optionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: COLORS.background,
    flexGrow: 1,
    flexBasis: width / 3 - 30, // Roughly three per row
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  optionButtonTextActive: {
    color: COLORS.white,
  },
  analyzeButton: {
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
    marginBottom: 20,
  },
  analyzeButtonDisabled: {
    backgroundColor: COLORS.primary + "60",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  analyzeButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
  resultSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    color: COLORS.textSecondary,
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
  resultCard: {
    width: "100%",
    // No specific styling for the card itself, content will define size
  },
  resultText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 24,
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

export default RecipeAnalyzerScreen;
