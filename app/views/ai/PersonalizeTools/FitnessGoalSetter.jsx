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

// Pre-defined quick goal types and fitness levels
const GOAL_TYPES = [
  "Weight Loss",
  "Muscle Gain",
  "Endurance",
  "Flexibility",
  "Overall Health",
];
const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const FitnessGoalSetterScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for goal input
  const [goalType, setGoalType] = useState(null);
  const [targetMetric, setTargetMetric] = useState(""); // e.g., "10 kg", "5 km"
  const [timeframe, setTimeframe] = useState(""); // e.g., "3 months", "6 weeks"
  const [currentLevel, setCurrentLevel] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // State for AI analysis result (fitness plan)
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to update local state when AI response is received from the hook
  useEffect(() => {
    if (response) {
      setGeneratedPlan(response);
      setLoadingPlan(false); // Stop local loading
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setPlanError(error);
      setLoadingPlan(false); // Stop local loading
      Alert.alert("Plan Generation Error", error);
    }
  }, [error]);

  const handleGeneratePlan = async () => {
    if (
      !goalType ||
      !targetMetric.trim() ||
      !timeframe.trim() ||
      !currentLevel
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields (Goal Type, Target Metric, Timeframe, Current Level)."
      );
      return;
    }

    setLoadingPlan(true);
    setGeneratedPlan(null);
    setPlanError(null);

    // Construct the prompt for the AI
    const prompt = `As a fitness goal setter AI, generate a personalized fitness plan or detailed advice based on the following user's goals and current status. Provide actionable steps, exercise suggestions, and general tips. Do not provide medical advice or specific dietary plans beyond general healthy eating.

    User's Fitness Goal:
    - Goal Type: ${goalType}
    - Target Metric: ${targetMetric.trim()}
    - Timeframe: ${timeframe.trim()}
    - Current Fitness Level: ${currentLevel}
    - Additional Notes: ${additionalNotes.trim() || "None provided"}

    Please provide:
    1. A summary of the personalized fitness plan/advice.
    2. Key exercise types or strategies.
    3. General lifestyle tips to support the goal.`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all inputs and the generated plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setGoalType(null);
            setTargetMetric("");
            setTimeframe("");
            setCurrentLevel(null);
            setAdditionalNotes("");
            setGeneratedPlan(null);
            setPlanError(null);
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
          <Text style={styles.headerTitle}>Fitness Goal Setter</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Set your fitness goals and get a personalized plan
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
          {/* Goal Type Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>What is your main goal?</Text>
            <View style={styles.optionButtonsContainer}>
              {GOAL_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    goalType === type && styles.optionButtonActive,
                  ]}
                  onPress={() => setGoalType(type)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      goalType === type && styles.optionButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Target Metric & Timeframe */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Target & Timeframe</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Target (e.g., 70 kg, run 5 km)"
              placeholderTextColor={COLORS.textPlaceholder}
              value={targetMetric}
              onChangeText={setTargetMetric}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Timeframe (e.g., 3 months, 6 weeks)"
              placeholderTextColor={COLORS.textPlaceholder}
              value={timeframe}
              onChangeText={setTimeframe}
            />
          </View>

          {/* Current Fitness Level */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Your Current Fitness Level</Text>
            <View style={styles.optionButtonsContainer}>
              {FITNESS_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    currentLevel === level && styles.optionButtonActive,
                  ]}
                  onPress={() => setCurrentLevel(level)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      currentLevel === level && styles.optionButtonTextActive,
                    ]}
                  >
                    {level}
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
              placeholder="Any specific health conditions, preferences, or limitations?"
              placeholderTextColor={COLORS.textPlaceholder}
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Generate Plan Button */}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGeneratePlan}
            disabled={
              loadingPlan ||
              !goalType ||
              !targetMetric.trim() ||
              !timeframe.trim() ||
              !currentLevel
            }
          >
            {loadingPlan ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.generateButtonText}>Generate My Plan</Text>
            )}
          </TouchableOpacity>

          {/* Generated Plan Display */}
          <View style={styles.planResultSection}>
            <Text style={styles.sectionTitle}>
              Your Personalized Fitness Plan
            </Text>
            {loadingPlan ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Generating your fitness plan...
                </Text>
              </View>
            ) : planError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{planError}</Text>
              </View>
            ) : generatedPlan ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{generatedPlan}</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Fill in your goals and tap 'Generate My Plan'
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
  planResultSection: {
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

export default FitnessGoalSetterScreen;
