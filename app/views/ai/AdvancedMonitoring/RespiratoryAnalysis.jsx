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

// Pre-defined respiratory patterns for quick selection
const RESPIRATORY_PATTERNS = [
  { label: "Normal", value: "Normal breathing pattern" },
  { label: "Tachypnea", value: "Tachypnea (rapid breathing)" },
  { label: "Bradypnea", value: "Bradypnea (slow breathing)" },
  { label: "Hyperpnea", value: "Hyperpnea (deep breathing)" },
  { label: "Cheyne-Stokes", value: "Cheyne-Stokes respiration" },
  { label: "Kussmaul", value: "Kussmaul breathing" },
];

const RespiratoryAnalysisScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for respiratory input
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [pattern, setPattern] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [respiratoryNotes, setRespiratoryNotes] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);

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

  // Simulate real-time respiratory monitoring
  const startMonitoring = () => {
    setIsMonitoring(true);
    Alert.alert(
      "Respiratory Monitoring Started",
      "Breathe normally for accurate readings."
    );
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    Alert.alert("Monitoring Stopped", "Data has been saved for analysis.");
  };

  const handleLogReading = () => {
    if (!respiratoryRate.trim() || !pattern.trim()) {
      Alert.alert(
        "Input Required",
        "Please enter both respiratory rate and pattern."
      );
      return;
    }
    const newReading = {
      id: Date.now().toString(),
      respiratoryRate: respiratoryRate.trim(),
      pattern: pattern.trim(),
      oxygenSaturation: oxygenSaturation.trim(),
      notes: respiratoryNotes.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setLoggedReadings((prev) => [newReading, ...prev]);
    setRespiratoryRate("");
    setPattern("");
    setOxygenSaturation("");
    setRespiratoryNotes("");
    Alert.alert("Logged", "Respiratory reading logged successfully!");
  };

  const handleQuickSelect = (respPattern) => {
    setPattern(respPattern.value);
    setRespiratoryNotes(respPattern.label);
  };

  const handleAnalyzeReadings = async () => {
    if (loggedReadings.length === 0) {
      Alert.alert(
        "No Readings",
        "Please log some respiratory readings before analysis."
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
          `Rate: ${r.respiratoryRate}bpm, Pattern: ${r.pattern}, SpO2: ${
            r.oxygenSaturation || "N/A"
          }% (${r.timestamp}${r.notes ? `, Notes: ${r.notes}` : ""})`
      )
      .join("; ");

    // Construct the prompt for the AI
    const prompt = `As a respiratory analysis AI, interpret the following breathing readings. Provide insights into potential patterns, general respiratory health implications, and when to seek medical attention. Do not provide specific medical diagnosis. Respiratory Readings: "${readingsText}"`;

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
            setRespiratoryRate("");
            setPattern("");
            setOxygenSaturation("");
            setRespiratoryNotes("");
            setLoggedReadings([]);
            setAnalysisResult(null);
            setAnalysisError(null);
            setIsMonitoring(false);
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
          <Text style={styles.headerTitle}>Respiratory Analysis</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Monitor and analyze your breathing patterns
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
          {/* Real-time Monitoring Section */}
          <View style={styles.realTimeSection}>
            <Text style={styles.sectionTitle}>Real-time Breathing Monitor</Text>
            <View style={styles.respVisualization}>
              <MaterialCommunityIcons
                name="lungs"
                size={100}
                color={isMonitoring ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={styles.respStatusText}>
                {isMonitoring ? "Monitoring in progress..." : "Not monitoring"}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.monitorButton, isMonitoring && styles.stopButton]}
              onPress={isMonitoring ? stopMonitoring : startMonitoring}
            >
              <Ionicons
                name={isMonitoring ? "stop" : "play"}
                size={24}
                color={COLORS.white}
              />
              <Text style={styles.monitorButtonText}>
                {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Log Respiratory Reading Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Log Respiratory Reading</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.respInput}
                placeholder="Rate (bpm)"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                value={respiratoryRate}
                onChangeText={setRespiratoryRate}
                maxLength={3}
              />
              <TextInput
                style={styles.respInput}
                placeholder="SpO2 (%)"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                value={oxygenSaturation}
                onChangeText={setOxygenSaturation}
                maxLength={3}
              />
            </View>
            <TextInput
              style={[styles.respInput, { marginBottom: 15 }]}
              placeholder="Breathing Pattern"
              placeholderTextColor={COLORS.textPlaceholder}
              value={pattern}
              onChangeText={setPattern}
            />
            <TextInput
              style={styles.notesInput}
              placeholder="Notes (e.g., After exercise, With symptoms)"
              placeholderTextColor={COLORS.textPlaceholder}
              value={respiratoryNotes}
              onChangeText={setRespiratoryNotes}
              multiline
              numberOfLines={2}
            />
            <TouchableOpacity
              style={styles.logButton}
              onPress={handleLogReading}
              disabled={!respiratoryRate.trim() || !pattern.trim()}
            >
              <Text style={styles.logButtonText}>Log Respiratory Reading</Text>
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
              {RESPIRATORY_PATTERNS.map((respPattern, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickSuggestionButton}
                  onPress={() => handleQuickSelect(respPattern)}
                >
                  <Text style={styles.quickSuggestionText}>
                    {respPattern.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Logged Readings Display */}
          <View style={styles.loggedReadingsSection}>
            <Text style={styles.sectionTitle}>Your Respiratory History</Text>
            {loggedReadings.length > 0 ? (
              loggedReadings.map((reading) => (
                <View key={reading.id} style={styles.readingCard}>
                  <MaterialCommunityIcons
                    name="lungs"
                    size={24}
                    color={COLORS.primary}
                  />
                  <View style={styles.readingDetails}>
                    <Text style={styles.readingValue}>
                      {reading.respiratoryRate}bpm - {reading.pattern}
                      {reading.oxygenSaturation
                        ? `, SpO2: ${reading.oxygenSaturation}%`
                        : ""}
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
                  name="lungs"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  No respiratory readings logged yet.
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
              <Text style={styles.analyzeButtonText}>
                Analyze Breathing Data
              </Text>
            )}
          </TouchableOpacity>

          {/* Analysis Result Display */}
          <View style={styles.analysisResultSection}>
            <Text style={styles.sectionTitle}>Respiratory Analysis</Text>
            {loadingAnalysis ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Analyzing your breathing patterns...
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
                  Your respiratory analysis will appear here after logging and
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
  respVisualization: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    marginVertical: 15,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  respStatusText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  monitorButton: {
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
  monitorButtonText: {
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
  respInput: {
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

export default RespiratoryAnalysisScreen;
