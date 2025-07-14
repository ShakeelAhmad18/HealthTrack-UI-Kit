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
import Slider from "@react-native-community/slider"; // For Age slider
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

const HealthRiskAssessmentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // Input states for health factors
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState(null); // 'Male', 'Female', 'Other'
  const [smokingStatus, setSmokingStatus] = useState(null); // 'Never', 'Former', 'Current'
  const [alcoholConsumption, setAlcoholConsumption] = useState(null); // 'None', 'Light', 'Moderate', 'Heavy'
  const [physicalActivity, setPhysicalActivity] = useState(null); // 'Sedentary', 'Light', 'Moderate', 'Active'
  const [existingConditions, setExistingConditions] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");

  // State for AI analysis result
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

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

  const handleAnalyzeRisk = async () => {
    // Basic validation
    if (!gender || !smokingStatus || !alcoholConsumption || !physicalActivity) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields (Gender, Smoking, Alcohol, Activity)."
      );
      return;
    }

    setLoadingAnalysis(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    // Construct the prompt for the AI
    const prompt = `As a health risk assessment AI, analyze the following user profile and lifestyle factors to provide a general health risk assessment, potential areas of concern, and actionable health improvement tips. Do not provide a medical diagnosis or specific treatment plans. Keep the language clear, concise, and encouraging.

    User Profile:
    - Age: ${age} years
    - Gender: ${gender}
    - Smoking Status: ${smokingStatus}
    - Alcohol Consumption: ${alcoholConsumption}
    - Physical Activity Level: ${physicalActivity}
    - Existing Medical Conditions: ${
      existingConditions.trim() || "None reported"
    }
    - Family Medical History: ${familyHistory.trim() || "None reported"}

    Please provide:
    1. A summary of potential health risks based on the provided information.
    2. Key areas of concern or factors that could be improved.
    3. General, actionable health improvement tips tailored to the profile.`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleClearInputs = () => {
    setAge(30);
    setGender(null);
    setSmokingStatus(null);
    setAlcoholConsumption(null);
    setPhysicalActivity(null);
    setExistingConditions("");
    setFamilyHistory("");
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
          <Text style={styles.headerTitle}>Health Risk Assessment</Text>
          <TouchableOpacity
            onPress={handleClearInputs}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Evaluate your health risks with AI
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
          {/* Personal Information Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Text style={styles.inputLabel}>Age: {age} years</Text>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={99}
              step={1}
              value={age}
              onValueChange={setAge}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.separator}
              thumbTintColor={COLORS.primary}
            />

            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.optionButtonsContainer}>
              {["Male", "Female", "Other"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionButton,
                    gender === item && styles.optionButtonActive,
                  ]}
                  onPress={() => setGender(item)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      gender === item && styles.optionButtonTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lifestyle Factors Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Lifestyle Factors</Text>

            <Text style={styles.inputLabel}>Smoking Status</Text>
            <View style={styles.optionButtonsContainer}>
              {["Never", "Former", "Current"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionButton,
                    smokingStatus === item && styles.optionButtonActive,
                  ]}
                  onPress={() => setSmokingStatus(item)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      smokingStatus === item && styles.optionButtonTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Alcohol Consumption</Text>
            <View style={styles.optionButtonsContainer}>
              {["None", "Light", "Moderate", "Heavy"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionButton,
                    alcoholConsumption === item && styles.optionButtonActive,
                  ]}
                  onPress={() => setAlcoholConsumption(item)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      alcoholConsumption === item &&
                        styles.optionButtonTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Physical Activity</Text>
            <View style={styles.optionButtonsContainer}>
              {["Sedentary", "Light", "Moderate", "Active"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionButton,
                    physicalActivity === item && styles.optionButtonActive,
                  ]}
                  onPress={() => setPhysicalActivity(item)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      physicalActivity === item &&
                        styles.optionButtonTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Medical History Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Medical History</Text>
            <Text style={styles.inputLabel}>
              Existing Medical Conditions (e.g., Diabetes, Hypertension)
            </Text>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Describe any existing conditions..."
              placeholderTextColor={COLORS.textPlaceholder}
              value={existingConditions}
              onChangeText={setExistingConditions}
              multiline
            />

            <Text style={styles.inputLabel}>
              Family Medical History (e.g., Heart disease in family)
            </Text>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Describe any relevant family history..."
              placeholderTextColor={COLORS.textPlaceholder}
              value={familyHistory}
              onChangeText={setFamilyHistory}
              multiline
            />
          </View>

          {/* Analyze Button */}
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyzeRisk}
            disabled={
              loadingAnalysis ||
              !gender ||
              !smokingStatus ||
              !alcoholConsumption ||
              !physicalActivity
            }
          >
            {loadingAnalysis ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>Get Risk Assessment</Text>
            )}
          </TouchableOpacity>

          {/* Analysis Result Display */}
          <View style={styles.analysisResultSection}>
            <Text style={styles.sectionTitle}>Your Health Risk Analysis</Text>
            {loadingAnalysis ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Generating assessment...</Text>
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
                  name="clipboard-pulse-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Fill in your details and tap 'Get Risk Assessment'
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
    paddingBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 10,
    marginTop: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 10,
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
  textAreaInput: {
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
    marginTop: 10,
    marginBottom: 20,
  },
  analyzeButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
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

export default HealthRiskAssessmentScreen;
