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
import Slider from "@react-native-community/slider";
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

// Pre-defined options for meal plan generation
const DIETARY_PREFERENCES = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "Paleo",
  "Gluten-Free",
  "Dairy-Free",
];
const MEAL_TYPES = [
  "3 Meals (Breakfast, Lunch, Dinner)",
  "5 Meals (incl. Snacks)",
  "Custom",
]; // Added Custom for flexibility

const MealPlanGeneratorScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // Input states for meal plan preferences
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    []
  );
  const [calorieGoal, setCalorieGoal] = useState(2000); // Default calorie goal
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [preferredCuisines, setPreferredCuisines] = useState("");
  const [allergiesDislikes, setAllergiesDislikes] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState("");
  const [customMealCount, setCustomMealCount] = useState("");

  // State for AI generated meal plan
  const [generatedMealPlan, setGeneratedMealPlan] = useState(null);
  const [loadingGeneration, setLoadingGeneration] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to update local state when AI response is received from the hook
  useEffect(() => {
    if (response) {
      setGeneratedMealPlan(response);
      setLoadingGeneration(false); // Stop local loading
      // Scroll to the generated workout section for better UX
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setGenerationError(error);
      setLoadingGeneration(false); // Stop local loading
      Alert.alert("Meal Plan Generation Error", error);
    }
  }, [error]);

  const handleTogglePreference = (preference) => {
    setSelectedDietaryPreferences((prevSelected) =>
      prevSelected.includes(preference)
        ? prevSelected.filter((item) => item !== preference)
        : [...prevSelected, preference]
    );
  };

  const handleGenerateMealPlan = async () => {
    if (
      selectedDietaryPreferences.length === 0 ||
      !selectedMealType ||
      (selectedMealType === "Custom" && !customMealCount)
    ) {
      Alert.alert(
        "Missing Information",
        "Please select at least one dietary preference, a meal type, and specify custom meal count if selected."
      );
      return;
    }

    setLoadingGeneration(true);
    setGeneratedMealPlan(null);
    setGenerationError(null);

    // Determine the actual meal count for the prompt
    let mealCountForPrompt = selectedMealType;
    if (selectedMealType === "Custom") {
      const parsedCustomCount = parseInt(customMealCount);
      if (isNaN(parsedCustomCount) || parsedCustomCount <= 0) {
        Alert.alert(
          "Invalid Input",
          "Please enter a valid number for custom meal count."
        );
        setLoadingGeneration(false);
        return;
      }
      mealCountForPrompt = `${parsedCustomCount} meals/snacks`;
    }

    // Construct the prompt for the AI
    const prompt = `As an AI meal plan generator, create a personalized meal plan based on the following user preferences. Provide a clear, structured plan including breakfast, lunch, dinner, and snacks (if applicable), with brief descriptions of each meal. Do not provide medical advice or specific caloric breakdowns per meal, focus on the overall plan.

    Meal Plan Preferences:
    - Dietary Preferences: ${selectedDietaryPreferences.join(", ") || "None"}
    - Calorie Goal (approximate): ${calorieGoal} calories/day
    - Number of Meals/Type: ${mealCountForPrompt}
    - Preferred Cuisines: ${preferredCuisines.trim() || "Not specified"}
    - Allergies/Dislikes: ${allergiesDislikes.trim() || "None provided"}
    - Available Ingredients (optional suggestions): ${
      availableIngredients.trim() || "None provided"
    }

    Please provide:
    1. A brief overview or theme for the meal plan.
    2. A daily meal schedule (e.g., Breakfast, Lunch, Dinner, Snacks) with simple meal ideas for each.
    3. Any general tips for following this meal plan (e.g., hydration, portion control).`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all inputs and the generated meal plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setSelectedDietaryPreferences([]);
            setCalorieGoal(2000);
            setSelectedMealType(null);
            setPreferredCuisines("");
            setAllergiesDislikes("");
            setAvailableIngredients("");
            setCustomMealCount("");
            setGeneratedMealPlan(null);
            setGenerationError(null);
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
          <Text style={styles.headerTitle}>Personalized Meal Plan</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Craft your ideal daily nutrition
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
          {/* Dietary Preferences Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
            <View style={styles.optionButtonsContainer}>
              {DIETARY_PREFERENCES.map((preference) => (
                <TouchableOpacity
                  key={preference}
                  style={[
                    styles.optionButton,
                    selectedDietaryPreferences.includes(preference) &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => handleTogglePreference(preference)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedDietaryPreferences.includes(preference) &&
                        styles.optionButtonTextActive,
                    ]}
                  >
                    {preference}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Calorie Goal Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>
              Approximate Daily Calorie Goal: {calorieGoal} kcal
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1200}
              maximumValue={3000}
              step={100}
              value={calorieGoal}
              onValueChange={setCalorieGoal}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.separator}
              thumbTintColor={COLORS.primary}
            />
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderLabel}>1200 kcal</Text>
              <Text style={styles.sliderLabel}>3000 kcal</Text>
            </View>
          </View>

          {/* Meal Type Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>How many meals/day?</Text>
            <View style={styles.optionButtonsContainer}>
              {MEAL_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    selectedMealType === type && styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedMealType(type)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedMealType === type &&
                        styles.optionButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedMealType === "Custom" && (
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 4 (for 4 meals/snacks)"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                value={customMealCount}
                onChangeText={setCustomMealCount}
              />
            )}
          </View>

          {/* Preferred Cuisines Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>
              Preferred Cuisines (Optional)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Italian, Mexican, Asian"
              placeholderTextColor={COLORS.textPlaceholder}
              value={preferredCuisines}
              onChangeText={setPreferredCuisines}
            />
          </View>

          {/* Allergies/Dislikes Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>
              Allergies or Dislikes (Optional)
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g., Peanuts, Dairy, Cilantro"
              placeholderTextColor={COLORS.textPlaceholder}
              value={allergiesDislikes}
              onChangeText={setAllergiesDislikes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Available Ingredients Section */}
          <View style={styles.inputSection}>
            <View style={styles.sectionTitleWithIcon}>
              <Text style={styles.sectionTitle}>
                Available Ingredients (Optional)
              </Text>
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={20}
                color={COLORS.textSecondary}
                style={{ marginLeft: 5 }}
              />
            </View>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g., Chicken breast, Spinach, Quinoa"
              placeholderTextColor={COLORS.textPlaceholder}
              value={availableIngredients}
              onChangeText={setAvailableIngredients}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Generate Meal Plan Button */}
          <TouchableOpacity
            style={[
              styles.generateButton,
              (loadingGeneration ||
                selectedDietaryPreferences.length === 0 ||
                !selectedMealType ||
                (selectedMealType === "Custom" && !customMealCount)) &&
                styles.generateButtonDisabled,
            ]}
            onPress={handleGenerateMealPlan}
            disabled={
              loadingGeneration ||
              selectedDietaryPreferences.length === 0 ||
              !selectedMealType ||
              (selectedMealType === "Custom" && !customMealCount)
            }
          >
            {loadingGeneration ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Meal Plan</Text>
            )}
          </TouchableOpacity>

          {/* Generated Meal Plan Display */}
          <View style={styles.mealPlanResultSection}>
            <Text style={styles.sectionTitle}>Your Personalized Meal Plan</Text>
            {loadingGeneration ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Crafting your personalized meal plan...
                </Text>
              </View>
            ) : generationError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{generationError}</Text>
              </View>
            ) : generatedMealPlan ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{generatedMealPlan}</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Tell us your preferences to create your ideal meal plan!
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
    paddingBottom: 40, // More space at bottom
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  sectionTitleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
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
    flexGrow: 1, // Allow buttons to grow
    flexBasis: width / 2 - 40, // Roughly two per row, accounting for padding/margin
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
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -10,
    paddingHorizontal: 5,
  },
  sliderLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
    marginBottom: 15,
  },
  notesInput: {
    minHeight: 80,
    maxHeight: 150,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  generateButton: {
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
  generateButtonDisabled: {
    backgroundColor: COLORS.primary + "60", // Faded primary color when disabled
    shadowOpacity: 0.1,
    elevation: 2,
  },
  generateButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
  mealPlanResultSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    minHeight: 280, // Slightly more height for meal plan
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Add some bottom margin
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

export default MealPlanGeneratorScreen;
