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

const QUICK_LAB_EXAMPLES = [
  "Blood Test: Glucose 95 mg/dL (Normal: 70-99), Cholesterol 210 mg/dL (Normal: <200), HDL 50 mg/dL (Normal: >40), LDL 130 mg/dL (Normal: <100).",
  "Urinalysis: pH 6.0, Protein Negative, Glucose Negative, Ketones Negative.",
  "Thyroid Panel: TSH 3.2 mIU/L (Normal: 0.4-4.0), Free T4 1.1 ng/dL (Normal: 0.8-1.8).",
  "Complete Blood Count (CBC): WBC 7.5 x10^9/L (Normal: 4.0-11.0), RBC 4.8 x10^12/L (Normal: 4.5-5.5), Hemoglobin 14.0 g/dL (Normal: 12.0-16.0).",
  "Vitamin D: 25 ng/mL (Normal: 30-100).",
];

const LabResultInterpreterScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [labResultsInput, setLabResultsInput] = useState("");
  const [interpretationResult, setInterpretationResult] = useState(null); // Stores AI's interpretation
  const [loadingInterpretation, setLoadingInterpretation] = useState(false); // Local loading state
  const [interpretationError, setInterpretationError] = useState(null); // Local error state

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to update local state when AI response is received from the hook
  useEffect(() => {
    if (response) {
      setInterpretationResult(response);
      setLoadingInterpretation(false); // Stop local loading
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setInterpretationError(error);
      setLoadingInterpretation(false); // Stop local loading
      Alert.alert("Interpretation Error", error);
    }
  }, [error]);

  const handleInterpretResults = async () => {
    if (!labResultsInput.trim()) {
      Alert.alert(
        "Input Required",
        "Please enter your lab results to interpret."
      );
      return;
    }

    setLoadingInterpretation(true);
    setInterpretationResult(null);
    setInterpretationError(null);

    // Construct the prompt for the AI
    const prompt = `As a lab result interpreter AI, analyze the following lab results and provide a clear, easy-to-understand explanation for each value, indicating if it's within normal range, high, or low. Explain what each parameter means in simple terms and suggest general, non-medical next steps (e.g., consult a doctor, maintain healthy lifestyle). Do not provide a diagnosis or medical advice. Lab Results: "${labResultsInput}"`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleQuickExample = (example) => {
    setLabResultsInput(example);
    // Optionally, automatically interpret after setting the example
    // handleInterpretResults();
  };

  const handleClearInput = () => {
    setLabResultsInput("");
    setInterpretationResult(null);
    setInterpretationError(null);
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
          <Text style={styles.headerTitle}>Lab Result Interpreter</Text>
          <TouchableOpacity
            onPress={handleClearInput}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Understand your medical tests</Text>
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
          {/* Lab Results Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Enter Your Lab Results</Text>
            <TextInput
              style={styles.labInput}
              placeholder="Paste or type your lab results here (e.g., 'Glucose: 90 mg/dL, Cholesterol: 180 mg/dL')."
              placeholderTextColor={COLORS.textPlaceholder}
              value={labResultsInput}
              onChangeText={setLabResultsInput}
              multiline
              editable={!loadingInterpretation}
            />
            <TouchableOpacity
              style={styles.interpretButton}
              onPress={handleInterpretResults}
              disabled={loadingInterpretation || !labResultsInput.trim()}
            >
              {loadingInterpretation ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.interpretButtonText}>
                  Interpret Results
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/* Quick Examples */}
          <View style={styles.quickExamplesSection}>
            <Text style={styles.sectionTitle}>Quick Examples</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickExamplesScrollContent}
            >
              {QUICK_LAB_EXAMPLES.map((example, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickExampleButton}
                  onPress={() => handleQuickExample(example)}
                >
                  <Text style={styles.quickExampleButtonText}>
                    {example.split(":")[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Interpretation Result Display */}
          <View style={styles.interpretationResultSection}>
            <Text style={styles.sectionTitle}>Interpretation Result</Text>
            {loadingInterpretation ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Analyzing your lab results...
                </Text>
              </View>
            ) : interpretationError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{interpretationError}</Text>
              </View>
            ) : interpretationResult ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{interpretationResult}</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="microscope"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Your lab result interpretation will appear here.
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
  labInput: {
    minHeight: 120, // Ample space for lab results
    maxHeight: 250,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlignVertical: "top", // For Android multiline input
  },
  interpretButton: {
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
  interpretButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
  quickExamplesSection: {
    marginBottom: 20,
  },
  quickExamplesScrollContent: {
    paddingRight: 15, // Space at the end
  },
  quickExampleButton: {
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
  quickExampleButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  interpretationResultSection: {
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

export default LabResultInterpreterScreen;
