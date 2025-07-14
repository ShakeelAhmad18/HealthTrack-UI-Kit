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

// Pre-defined quick suggestions for stress factors
const QUICK_STRESS_SUGGESTIONS = [
  "Feeling overwhelmed by work deadlines.",
  "Had a conflict with a family member.",
  "Difficulty sleeping for several nights.",
  "Constant worrying about finances.",
  "Feeling isolated and lonely.",
  "Too many commitments, no time for myself.",
  "Physical symptoms like headaches and muscle tension.",
  "Feeling irritable and easily annoyed.",
];

const StressMonitorScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [stressDescription, setStressDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null); // Stores AI's stress analysis
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

  const handleAnalyzeStress = async () => {
    if (!stressDescription.trim()) {
      Alert.alert(
        "Input Required",
        "Please describe your current stress factors to analyze."
      );
      return;
    }

    setLoadingAnalysis(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    // Construct the prompt for the AI
    const prompt = `As a stress monitor AI, analyze the following description of a user's feelings and situations. Provide insights into potential stress levels, identify possible triggers, and suggest practical, actionable coping mechanisms or mindfulness exercises. Present the information clearly and concisely, suitable for a general user. Do not provide medical diagnosis or specific treatment plans. Stress description: "${stressDescription}"`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleQuickSuggestion = (suggestion) => {
    setStressDescription(suggestion);
    // Optionally, automatically analyze after setting the suggestion
    // handleAnalyzeStress();
  };

  const handleClearInput = () => {
    setStressDescription("");
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
          <Text style={styles.headerTitle}>Stress Monitor</Text>
          <TouchableOpacity
            onPress={handleClearInput}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Understand and manage your stress
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
          {/* Stress Description Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Describe Your Stress</Text>
            <TextInput
              style={styles.stressInput}
              placeholder="e.g., 'Feeling very anxious about an upcoming exam and having trouble concentrating.'"
              placeholderTextColor={COLORS.textPlaceholder}
              value={stressDescription}
              onChangeText={setStressDescription}
              multiline
              editable={!loadingAnalysis}
            />
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={handleAnalyzeStress}
              disabled={loadingAnalysis || !stressDescription.trim()}
            >
              {loadingAnalysis ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.analyzeButtonText}>Analyze Stress</Text>
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
              {QUICK_STRESS_SUGGESTIONS.map((suggestion, index) => (
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
                <Text style={styles.loadingText}>
                  Analyzing your stress factors...
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
            ) : analysisResult ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{analysisResult}</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="emoticon-sad-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Describe your feelings to get stress insights.
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
  stressInput: {
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

export default StressMonitorScreen;
