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

// Pre-defined quick examples for health report input
const QUICK_HEALTH_EXAMPLES = [
  "Last week: 7 hours sleep/night, ate balanced meals, exercised 3 times (cardio). Felt energetic. No specific health issues.",
  "Last month: inconsistent sleep (5-6 hours), ate out frequently, no exercise. Felt sluggish and stressed. Occasional headaches.",
  "Recent lab results: Cholesterol slightly high, blood sugar normal. Diet has been good, but minimal physical activity. Feeling generally well.",
  "Experienced mild fatigue and occasional joint pain for the past two weeks. Diet is mostly plant-based. Moderate exercise.",
];

const HealthReportScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [healthDataInput, setHealthDataInput] = useState("");
  const [reportResult, setReportResult] = useState(null); // Stores AI's health report
  const [loadingReport, setLoadingReport] = useState(false); // Local loading state
  const [reportError, setReportError] = useState(null); // Local error state

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to update local state when AI response is received from the hook
  useEffect(() => {
    if (response) {
      setReportResult(response);
      setLoadingReport(false); // Stop local loading
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setReportError(error);
      setLoadingReport(false); // Stop local loading
      Alert.alert("Report Generation Error", error);
    }
  }, [error]);

  const handleGenerateReport = async () => {
    if (!healthDataInput.trim()) {
      Alert.alert(
        "Input Required",
        "Please describe your health data to generate a report."
      );
      return;
    }

    setLoadingReport(true);
    setReportResult(null);
    setReportError(null);

    // Construct the prompt for the AI
    const prompt = `As a health report generator AI, create a comprehensive health report based on the following user-provided health data. Structure the report with sections for summary, analysis of key areas (e.g., sleep, diet, activity, symptoms), potential implications, and personalized recommendations for improvement. Maintain a professional yet easy-to-understand tone. Do not provide medical diagnosis or specific treatment plans. Health Data: "${healthDataInput}"`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleQuickExample = (example) => {
    setHealthDataInput(example);
    // Optionally, automatically generate report after setting the example
    // handleGenerateReport();
  };

  const handleClearInput = () => {
    setHealthDataInput("");
    setReportResult(null);
    setReportError(null);
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
          <Text style={styles.headerTitle}>Health Report</Text>
          <TouchableOpacity
            onPress={handleClearInput}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Generate your personalized health summary
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
          {/* Health Data Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Describe Your Health Data</Text>
            <TextInput
              style={styles.healthDataInput}
              placeholder="e.g., 'I track my sleep (average 7 hours), diet (mostly healthy, occasional fast food), and exercise (3 times a week). Recently felt a bit tired.'"
              placeholderTextColor={COLORS.textPlaceholder}
              value={healthDataInput}
              onChangeText={setHealthDataInput}
              multiline
              editable={!loadingReport}
            />
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateReport}
              disabled={loadingReport || !healthDataInput.trim()}
            >
              {loadingReport ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.generateButtonText}>Generate Report</Text>
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
              {QUICK_HEALTH_EXAMPLES.map((example, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickExampleButton}
                  onPress={() => handleQuickExample(example)}
                >
                  <Text style={styles.quickExampleButtonText} numberOfLines={1}>
                    {example.split(".")[0]}...
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Health Report Display */}
          <View style={styles.reportResultSection}>
            <Text style={styles.sectionTitle}>
              Your Personalized Health Report
            </Text>
            {loadingReport ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Generating your health report...
                </Text>
              </View>
            ) : reportError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{reportError}</Text>
              </View>
            ) : reportResult ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{reportResult}</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="file-chart-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Your comprehensive health report will appear here.
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
  healthDataInput: {
    minHeight: 120, // Ample space for detailed input
    maxHeight: 250,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlignVertical: "top", // For Android multiline input
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
  },
  generateButtonText: {
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
  reportResultSection: {
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

export default HealthReportScreen;
