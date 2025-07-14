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

// Pre-defined quick log suggestions for common blood sugar ranges (mg/dL)
const QUICK_BLOOD_SUGAR_SUGGESTIONS = [
  { value: "90", label: "Normal (Fasting)" },
  { value: "120", label: "Normal (Post-meal)" },
  { value: "110", label: "Pre-diabetic" },
  { value: "180", label: "High (Hyperglycemia)" },
  { value: "60", label: "Low (Hypoglycemia)" },
];

const BloodSugarAnalysisScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for blood sugar input
  const [bloodSugarValue, setBloodSugarValue] = useState("");
  const [readingTime, setReadingTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [readingNotes, setReadingNotes] = useState("");

  // State for logged readings (for current session, no persistence here)
  const [loggedReadings, setLoggedReadings] = useState([]); // { id, value, time, notes, timestamp }

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

  const handleLogReading = () => {
    if (!bloodSugarValue.trim()) {
      Alert.alert("Input Required", "Please enter a blood sugar reading.");
      return;
    }
    const newReading = {
      id: Date.now().toString(),
      value: bloodSugarValue.trim(),
      time: readingTime, // Use current time or user-entered time
      notes: readingNotes.trim(),
      timestamp:
        new Date().toLocaleDateString() +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };
    setLoggedReadings((prev) => [newReading, ...prev]); // Add new reading to top
    setBloodSugarValue("");
    setReadingNotes("");
    setReadingTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ); // Reset time to current
    Alert.alert("Logged", "Blood sugar reading logged successfully!");
  };

  const handleQuickLog = (suggestion) => {
    setBloodSugarValue(suggestion.value);
    setReadingNotes(suggestion.label);
    setReadingTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ); // Set current time
    // Optionally, automatically log after setting
    // handleLogReading();
  };

  const handleAnalyzeReadings = async () => {
    if (loggedReadings.length === 0) {
      Alert.alert(
        "No Readings",
        "Please log some blood sugar readings before analysis."
      );
      return;
    }

    setLoadingAnalysis(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    // Format logged readings for the AI prompt
    const readingsText = loggedReadings
      .map(
        (r) =>
          `Value: ${r.value} mg/dL, Time: ${r.time} (${r.timestamp}${
            r.notes ? `, Notes: ${r.notes}` : ""
          })`
      )
      .join("; ");

    // Construct the prompt for the AI
    const prompt = `As a blood sugar analysis AI, interpret the following blood sugar readings. Provide insights into potential trends, general health implications (e.g., fasting vs. post-meal), and actionable lifestyle recommendations for maintaining or improving blood sugar levels. Do not provide medical diagnosis or specific treatment plans. Blood Sugar Readings: "${readingsText}"`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all logged readings and analysis?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setBloodSugarValue("");
            setReadingTime(
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            );
            setReadingNotes("");
            setLoggedReadings([]);
            setAnalysisResult(null);
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
          <Text style={styles.headerTitle}>Blood Sugar Analysis</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Track and understand your blood sugar
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
          {/* Log New Reading Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Log New Reading</Text>
            <View style={styles.bsInputRow}>
              <TextInput
                style={styles.bsInput}
                placeholder="Value (mg/dL)"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                value={bloodSugarValue}
                onChangeText={setBloodSugarValue}
                maxLength={4} // Max 4 digits for blood sugar
              />
              <TextInput
                style={styles.timeInput}
                placeholder="Time (e.g., 08:00 AM)"
                placeholderTextColor={COLORS.textPlaceholder}
                value={readingTime}
                onChangeText={setReadingTime}
                maxLength={8} // e.g., "10:30 AM"
              />
            </View>
            <TextInput
              style={styles.notesInput}
              placeholder="Notes (e.g., Fasting, After meal, Before bed)"
              placeholderTextColor={COLORS.textPlaceholder}
              value={readingNotes}
              onChangeText={setReadingNotes}
              multiline
              numberOfLines={2}
            />
            <TouchableOpacity
              style={styles.logButton}
              onPress={handleLogReading}
              disabled={!bloodSugarValue.trim()}
            >
              <Text style={styles.logButtonText}>Log Reading</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Log Suggestions */}
          <View style={styles.quickSuggestionsSection}>
            <Text style={styles.sectionTitle}>Quick Log</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSuggestionsScrollContent}
            >
              {QUICK_BLOOD_SUGAR_SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickSuggestionButton}
                  onPress={() => handleQuickLog(suggestion)}
                >
                  <Text style={styles.quickSuggestionText}>
                    {suggestion.label}
                  </Text>
                  <Text style={styles.quickSuggestionValue}>
                    {suggestion.value} mg/dL
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Logged Readings Display */}
          <View style={styles.loggedReadingsSection}>
            <Text style={styles.sectionTitle}>Your Logged Readings</Text>
            {loggedReadings.length > 0 ? (
              loggedReadings.map((reading) => (
                <View key={reading.id} style={styles.readingCard}>
                  <MaterialCommunityIcons
                    name="diabetes"
                    size={24}
                    color={COLORS.primary}
                  />
                  <View style={styles.readingDetails}>
                    <Text style={styles.readingValue}>
                      {reading.value} mg/dL
                    </Text>
                    <Text style={styles.readingTime}>{reading.timestamp}</Text>
                    {reading.notes ? (
                      <Text style={styles.readingNotes}>{reading.notes}</Text>
                    ) : null}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="clipboard-pulse-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  No readings logged yet.
                </Text>
              </View>
            )}
          </View>

          {/* Analyze Readings Button */}
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyzeReadings}
            disabled={loadingAnalysis || loggedReadings.length === 0}
          >
            {loadingAnalysis ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze Readings</Text>
            )}
          </TouchableOpacity>

          {/* Analysis Result Display */}
          <View style={styles.analysisResultSection}>
            <Text style={styles.sectionTitle}>Analysis Result</Text>
            {loadingAnalysis ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Analyzing your blood sugar...
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
                  name="chart-line-variant"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Your blood sugar analysis will appear here after logging and
                  analyzing.
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
  bsInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  bsInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    borderWidth: 1,
    borderColor: COLORS.separator,
    marginRight: 10,
  },
  timeInput: {
    flex: 0.7, // Smaller than value input
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  notesInput: {
    minHeight: 60,
    maxHeight: 120,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  logButton: {
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
  logButtonText: {
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
    borderRadius: 15,
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
    alignItems: "center",
  },
  quickSuggestionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginBottom: 3,
  },
  quickSuggestionValue: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  loggedReadingsSection: {
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
  readingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  readingDetails: {
    marginLeft: 10,
    flex: 1,
  },
  readingValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  readingTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  readingNotes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 2,
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

export default BloodSugarAnalysisScreen;
