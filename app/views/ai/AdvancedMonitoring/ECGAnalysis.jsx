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
import { COLORS } from "../../../../constants/helper";
import useGeminiApi from "../../../../lib/useGeminiApi";

const { width } = Dimensions.get("window");

// Pre-defined ECG patterns for quick selection
const ECG_PATTERNS = [
  { label: "Normal Sinus", value: "Normal sinus rhythm" },
  { label: "Atrial Fib", value: "Atrial fibrillation" },
  { label: "Sinus Brady", value: "Sinus bradycardia" },
  { label: "Sinus Tachy", value: "Sinus tachycardia" },
  { label: "Ventricular Tachy", value: "Ventricular tachycardia" },
];

const ECGAnalysisScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for ECG input
  const [heartRate, setHeartRate] = useState("");
  const [rhythm, setRhythm] = useState("");
  const [ecgNotes, setEcgNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // State for logged readings
  const [loggedReadings, setLoggedReadings] = useState([]);

  // State for AI analysis result
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to update local state when AI response is received
  useEffect(() => {
    if (response) {
      setAnalysisResult(response);
      setLoadingAnalysis(false);
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      setAnalysisError(error);
      setLoadingAnalysis(false);
      Alert.alert("Analysis Error", error);
    }
  }, [error]);

  // Simulate real-time ECG recording
  const startRecording = () => {
    setIsRecording(true);
    // In a real app, this would connect to a wearable device
    Alert.alert(
      "ECG Recording Started",
      "Place your fingers on the electrodes to begin real-time monitoring."
    );
  };

  const stopRecording = () => {
    setIsRecording(false);
    Alert.alert("ECG Recording Stopped", "Data has been saved for analysis.");
  };

  const handleLogReading = () => {
    if (!heartRate.trim() || !rhythm.trim()) {
      Alert.alert(
        "Input Required",
        "Please enter both heart rate and rhythm pattern."
      );
      return;
    }
    const newReading = {
      id: Date.now().toString(),
      heartRate: heartRate.trim(),
      rhythm: rhythm.trim(),
      notes: ecgNotes.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setLoggedReadings((prev) => [newReading, ...prev]);
    setHeartRate("");
    setRhythm("");
    setEcgNotes("");
    Alert.alert("Logged", "ECG reading logged successfully!");
  };

  const handleQuickSelect = (pattern) => {
    setRhythm(pattern.value);
    setEcgNotes(pattern.label);
  };

  const handleAnalyzeReadings = async () => {
    if (loggedReadings.length === 0) {
      Alert.alert(
        "No Readings",
        "Please log some ECG readings before analysis."
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
          `HR: ${r.heartRate}bpm, Rhythm: ${r.rhythm} (${r.timestamp}${
            r.notes ? `, Notes: ${r.notes}` : ""
          })`
      )
      .join("; ");

    // Construct the prompt for the AI
    const prompt = `As a cardiology analysis AI, interpret the following ECG readings. Provide insights into potential patterns, general cardiac health implications, and when to seek medical attention. Do not provide specific medical diagnosis. ECG Readings: "${readingsText}"`;

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
            setHeartRate("");
            setRhythm("");
            setEcgNotes("");
            setLoggedReadings([]);
            setAnalysisResult(null);
            setAnalysisError(null);
            setIsRecording(false);
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
          <Text style={styles.headerTitle}>ECG Analysis</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Monitor and analyze your heart's electrical activity
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
          {/* Real-time ECG Monitoring Section */}
          <View style={styles.realTimeSection}>
            <Text style={styles.sectionTitle}>Real-time ECG Monitoring</Text>
            <View style={styles.ecgVisualization}>
              {/* This would be replaced with actual ECG visualization in production */}
              <MaterialCommunityIcons
                name="heart-pulse"
                size={100}
                color={isRecording ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={styles.ecgStatusText}>
                {isRecording ? "Recording in progress..." : "Not recording"}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.stopButton]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons
                name={isRecording ? "stop" : "play"}
                size={24}
                color={COLORS.white}
              />
              <Text style={styles.recordButtonText}>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Log ECG Reading Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Log ECG Reading</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.ecgInput}
                placeholder="Heart Rate (bpm)"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                value={heartRate}
                onChangeText={setHeartRate}
                maxLength={3}
              />
              <TextInput
                style={[styles.ecgInput, { flex: 2 }]}
                placeholder="Rhythm Pattern"
                placeholderTextColor={COLORS.textPlaceholder}
                value={rhythm}
                onChangeText={setRhythm}
              />
            </View>
            <TextInput
              style={styles.notesInput}
              placeholder="Notes (e.g., After exercise, With symptoms)"
              placeholderTextColor={COLORS.textPlaceholder}
              value={ecgNotes}
              onChangeText={setEcgNotes}
              multiline
              numberOfLines={2}
            />
            <TouchableOpacity
              style={styles.logButton}
              onPress={handleLogReading}
              disabled={!heartRate.trim() || !rhythm.trim()}
            >
              <Text style={styles.logButtonText}>Log ECG Reading</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Pattern Selection */}
          <View style={styles.quickSuggestionsSection}>
            <Text style={styles.sectionTitle}>Common Patterns</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSuggestionsScrollContent}
            >
              {ECG_PATTERNS.map((pattern, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickSuggestionButton}
                  onPress={() => handleQuickSelect(pattern)}
                >
                  <Text style={styles.quickSuggestionText}>
                    {pattern.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Logged Readings Display */}
          <View style={styles.loggedReadingsSection}>
            <Text style={styles.sectionTitle}>Your ECG History</Text>
            {loggedReadings.length > 0 ? (
              loggedReadings.map((reading) => (
                <View key={reading.id} style={styles.readingCard}>
                  <MaterialCommunityIcons
                    name="cardiology"
                    size={24}
                    color={COLORS.primary}
                  />
                  <View style={styles.readingDetails}>
                    <Text style={styles.readingValue}>
                      {reading.heartRate}bpm - {reading.rhythm}
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
                  name="heart-flash"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  No ECG readings logged yet.
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
              <Text style={styles.analyzeButtonText}>Analyze ECG Data</Text>
            )}
          </TouchableOpacity>

          {/* Analysis Result Display */}
          <View style={styles.analysisResultSection}>
            <Text style={styles.sectionTitle}>Cardiac Analysis</Text>
            {loadingAnalysis ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Analyzing your ECG patterns...
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
                  name="chart-bell-curve"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Your ECG analysis will appear here after logging and
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
    paddingBottom: 20,
  },
  realTimeSection: {
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
  ecgVisualization: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    marginVertical: 15,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  ecgStatusText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  recordButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  recordButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 10,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  ecgInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
    marginRight: 10,
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
    paddingRight: 15,
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
    minHeight: 200,
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

export default ECGAnalysisScreen;
