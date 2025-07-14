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
import { useNavigation } from "expo-router";
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

// Pre-defined quick meal suggestions
const QUICK_MEAL_SUGGESTIONS = [
  "Oatmeal with berries and nuts",
  "Chicken salad with avocado",
  "Pasta with marinara and vegetables",
  "Grilled salmon with asparagus",
  "Lentil soup with whole-wheat bread",
  "Spinach and feta omelette",
  "Greek yogurt with granola",
];

const NutritionAnalysisScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [mealDescription, setMealDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null); // Stores AI's nutrition analysis
  const [loadingAnalysis, setLoadingAnalysis] = useState(false); // Local loading state for this screen
  const [analysisError, setAnalysisError] = useState(null); // Local error state for this screen

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to update local state when AI response is received from the hook
  useEffect(() => {
    if (response) {
      setAnalysisResult(response);
      setLoadingAnalysis(false); // Stop local loading
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setAnalysisError(error);
      setLoadingAnalysis(false); // Stop local loading
      Alert.alert("Analysis Error", error);
    }
  }, [error]);

  const handleAnalyzeMeal = async () => {
    if (!mealDescription.trim()) {
      Alert.alert("Input Required", "Please describe your meal to analyze.");
      return;
    }

    setLoadingAnalysis(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    // Construct the prompt for the AI
    const prompt = `As a nutrition analysis AI, analyze the following meal and provide a breakdown of estimated calories, macronutrients (protein, carbs, fats), and any notable vitamins/minerals. Also, offer a brief healthy eating tip related to this meal. Present the information clearly and concisely. If specific quantities are not provided, estimate based on common serving sizes. Meal: "${mealDescription}"`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleQuickSuggestion = (suggestion) => {
    setMealDescription(suggestion);
    // Optionally, automatically analyze after setting the suggestion
    // handleAnalyzeMeal();
  };

  const handleClearInput = () => {
    setMealDescription("");
    setAnalysisResult(null);
    setAnalysisError(null);
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
          <Text style={styles.headerTitle}>Nutrition Analysis</Text>
          <TouchableOpacity
            onPress={handleClearInput}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Get insights into your meals</Text>
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
          {/* Meal Description Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Describe Your Meal</Text>
            <TextInput
              style={styles.mealInput}
              placeholder="e.g., 'Breakfast: 2 eggs, 2 slices of whole-wheat toast, 1 apple.'"
              placeholderTextColor={COLORS.textPlaceholder}
              value={mealDescription}
              onChangeText={setMealDescription}
              multiline
              editable={!loadingAnalysis}
            />
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={handleAnalyzeMeal}
              disabled={loadingAnalysis || !mealDescription.trim()}
            >
              {loadingAnalysis ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.analyzeButtonText}>Analyze Meal</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Suggestions */}
          <View style={styles.quickSuggestionsSection}>
            <Text style={styles.sectionTitle}>Quick Suggestions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSuggestionsScrollContent}
            >
              {QUICK_MEAL_SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickSuggestionButton}
                  onPress={() => handleQuickSuggestion(suggestion)}
                >
                  <Text style={styles.quickSuggestionButtonText}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Analysis Result Display */}
          <View style={styles.analysisResultSection}>
            <Text style={styles.sectionTitle}>Analysis Result</Text>
            {loadingAnalysis ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Analyzing your meal...</Text>
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
            ) : analysisResult ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{analysisResult}</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="food-fork-drink"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Your nutrition analysis will appear here.
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
    paddingBottom: 20, // Ensure space at bottom
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
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
  mealInput: {
    minHeight: 100,
    maxHeight: 200,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlignVertical: "top", // For Android multiline input
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
  },
  analyzeButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
  quickSuggestionsSection: {
    marginBottom: 20,
  },
  quickSuggestionsScrollContent: {
    paddingRight: 15, // Space at the end
  },
  quickSuggestionButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickSuggestionButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  analysisResultSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    minHeight: 200, // Ensure it has a minimum height
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: COLORS.error + "20", // Light red background
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
    // No additional styling needed here, as it's the content wrapper
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

export default NutritionAnalysisScreen;
