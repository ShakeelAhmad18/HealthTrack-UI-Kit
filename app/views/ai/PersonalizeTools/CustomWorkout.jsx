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
import Slider from "@react-native-community/slider";
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

// Pre-defined options for workout generation
const WORKOUT_GOALS = [
  "Strength",
  "Cardio",
  "Flexibility",
  "Full Body",
  "Specific Muscles",
];
const EQUIPMENT_OPTIONS = [
  "No Equipment",
  "Dumbbells",
  "Resistance Bands",
  "Gym Access",
];
const INTENSITY_LEVELS = ["Low", "Medium", "High"];

const CustomWorkoutGeneratorScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // Input states for workout preferences
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(30); // in minutes
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [targetMuscles, setTargetMuscles] = useState(""); // e.g., "legs, core"
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // State for AI generated workout plan
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [loadingGeneration, setLoadingGeneration] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to update local state when AI response is received from the hook
  useEffect(() => {
    if (response) {
      setGeneratedWorkout(response);
      setLoadingGeneration(false); // Stop local loading
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setGenerationError(error);
      setLoadingGeneration(false); // Stop local loading
      Alert.alert("Workout Generation Error", error);
    }
  }, [error]);

  const handleToggleEquipment = (equipment) => {
    setSelectedEquipment((prevSelected) =>
      prevSelected.includes(equipment)
        ? prevSelected.filter((item) => item !== equipment)
        : [...prevSelected, equipment]
    );
  };

  const handleGenerateWorkout = async () => {
    if (!selectedGoal || !selectedIntensity || selectedEquipment.length === 0) {
      Alert.alert(
        "Missing Information",
        "Please select a goal, intensity, and at least one equipment option."
      );
      return;
    }

    setLoadingGeneration(true);
    setGeneratedWorkout(null);
    setGenerationError(null);

    // Construct the prompt for the AI
    const prompt = `As a fitness workout generator AI, create a personalized workout routine based on the following user preferences. Provide a clear, step-by-step plan including warm-up, exercises with reps/sets or duration, and cool-down. Do not provide medical advice or specific dietary plans.

    Workout Preferences:
    - Goal: ${selectedGoal}
    - Duration: ${workoutDuration} minutes
    - Equipment Available: ${selectedEquipment.join(", ") || "None"}
    - Target Muscle Groups: ${targetMuscles.trim() || "Not specified"}
    - Intensity: ${selectedIntensity}
    - Additional Notes/Limitations: ${additionalNotes.trim() || "None provided"}

    Please provide:
    1. A brief overview of the workout.
    2. Detailed exercise instructions (warm-up, main workout, cool-down).
    3. Any general tips for this workout.`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all inputs and the generated workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setSelectedGoal(null);
            setWorkoutDuration(30);
            setSelectedEquipment([]);
            setTargetMuscles("");
            setSelectedIntensity(null);
            setAdditionalNotes("");
            setGeneratedWorkout(null);
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
          <Text style={styles.headerTitle}>Custom Workout Generator</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Create your perfect workout plan
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
          {/* Workout Goal Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>What's your workout goal?</Text>
            <View style={styles.optionButtonsContainer}>
              {WORKOUT_GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.optionButton,
                    selectedGoal === goal && styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedGoal(goal)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedGoal === goal && styles.optionButtonTextActive,
                    ]}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>
              Workout Duration: {workoutDuration} minutes
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={15}
              maximumValue={120}
              step={5}
              value={workoutDuration}
              onValueChange={setWorkoutDuration}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.separator}
              thumbTintColor={COLORS.primary}
            />
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderLabel}>15 min</Text>
              <Text style={styles.sliderLabel}>120 min</Text>
            </View>
          </View>

          {/* Equipment Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Equipment Available</Text>
            <View style={styles.optionButtonsContainer}>
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <TouchableOpacity
                  key={equipment}
                  style={[
                    styles.optionButton,
                    selectedEquipment.includes(equipment) &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => handleToggleEquipment(equipment)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedEquipment.includes(equipment) &&
                        styles.optionButtonTextActive,
                    ]}
                  >
                    {equipment}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Target Muscles Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>
              Target Muscle Groups (Optional)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Legs, Core, Arms"
              placeholderTextColor={COLORS.textPlaceholder}
              value={targetMuscles}
              onChangeText={setTargetMuscles}
            />
          </View>

          {/* Intensity Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Workout Intensity</Text>
            <View style={styles.optionButtonsContainer}>
              {INTENSITY_LEVELS.map((intensity) => (
                <TouchableOpacity
                  key={intensity}
                  style={[
                    styles.optionButton,
                    selectedIntensity === intensity &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedIntensity(intensity)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedIntensity === intensity &&
                        styles.optionButtonTextActive,
                    ]}
                  >
                    {intensity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Notes */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any specific exercises to avoid, or other preferences?"
              placeholderTextColor={COLORS.textPlaceholder}
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Generate Workout Button */}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateWorkout}
            disabled={
              loadingGeneration ||
              !selectedGoal ||
              !selectedIntensity ||
              selectedEquipment.length === 0
            }
          >
            {loadingGeneration ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Workout</Text>
            )}
          </TouchableOpacity>

          {/* Generated Workout Display */}
          <View style={styles.workoutResultSection}>
            <Text style={styles.sectionTitle}>
              Your Personalized Workout Plan
            </Text>
            {loadingGeneration ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Generating your workout...
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
            ) : generatedWorkout ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{generatedWorkout}</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Fill in your preferences and tap 'Generate Workout'
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
    flexBasis: "45%", // Roughly two per row
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
    marginTop: -10, // Pull up slightly to align with slider
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
  generateButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
  workoutResultSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    minHeight: 250, // Ensure it has a minimum height
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

export default CustomWorkoutGeneratorScreen;
