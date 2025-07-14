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
  Dimensions,
  LayoutAnimation, // For subtle animations
  Platform, // For LayoutAnimation
  UIManager, // For LayoutAnimation
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming you use expo-router
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook


const { width } = Dimensions.get("window");

// Mood suggestions with emojis, associated sentiment values, and valid MaterialCommunityIcons
const MOOD_SUGGESTIONS = [
  {
    emoji: "😊",
    label: "Happy",
    value: 5,
    color: COLORS.success,
    icon: "emoticon-happy-outline",
  },
  {
    emoji: "😐",
    label: "Okay",
    value: 3,
    color: COLORS.info,
    icon: "emoticon-neutral-outline",
  },
  {
    emoji: "😔",
    label: "Sad",
    value: 2,
    color: COLORS.warning,
    icon: "emoticon-sad-outline",
  },
  {
    emoji: "😠",
    label: "Angry",
    value: 1,
    color: COLORS.error,
    icon: "emoticon-angry-outline",
  },
  {
    emoji: "😌",
    label: "Relaxed",
    value: 4,
    color: COLORS.tertiary,
    icon: "emoticon-excited-outline",
  },
  {
    emoji: "😟",
    label: "Anxious",
    value: 2,
    color: COLORS.secondary,
    icon: "emoticon-neutral",
  },
];

// Quick guided exercise suggestions (placeholder for real content)
const GUIDED_EXERCISES = [
  {
    id: "1",
    title: "5-Min Breath",
    icon: "yoga",
    type: "breathing",
    description: "Calm with deep breaths.",
  },
  {
    id: "2",
    title: "Mindful Scan",
    icon: "meditation",
    type: "meditation",
    description: "Body awareness practice.",
  },
  {
    id: "3",
    title: "Gratitude",
    icon: "hand-heart",
    type: "journal",
    description: "List things you're thankful for.",
  },
  {
    id: "4",
    title: "Nature Sounds",
    icon: "forest",
    type: "audio",
    description: "Soothing sounds of nature.",
  },
];

const MentalHealthScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for mood logging
  const [selectedMood, setSelectedMood] = useState(null); // {emoji, label, value, color, icon}
  const [journalEntry, setJournalEntry] = useState("");
  const [isJournalFocused, setIsJournalFocused] = useState(false); // For real-time UI feedback

  // State for logged moods (for current session, no persistence here)
  const [loggedMoods, setLoggedMoods] = useState([]); // { id, mood, journal, timestamp }

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
      // Scroll to the analysis result section
      setTimeout(() => {
        // Give a little time for rendering
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
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

  // Handle mood selection with subtle animation
  const handleMoodSelect = (mood) => {
    LayoutAnimation.easeInEaseOut(); // Animate changes
    setSelectedMood(mood);
  };

  const handleLogMood = () => {
    if (!selectedMood && !journalEntry.trim()) {
      Alert.alert(
        "Input Required",
        "Please select a mood or write a journal entry to log."
      );
      return;
    }

    const newMoodLog = {
      id: Date.now().toString(),
      mood: selectedMood,
      journal: journalEntry.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }), // Added for better history (e.g., Jul 13)
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate item addition
    setLoggedMoods((prev) => [newMoodLog, ...prev]); // Add new log to top
    setSelectedMood(null);
    setJournalEntry("");
    setIsJournalFocused(false); // Reset focus state
    Alert.alert("Logged!", "Your mood and thoughts have been recorded.");
  };

  const handleAnalyzeJournal = async () => {
    if (loggedMoods.length === 0) {
      Alert.alert(
        "No Entries",
        "Please log some mood and journal entries before analysis."
      );
      return;
    }

    setLoadingAnalysis(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    // Filter out entries without substantial journal text for analysis
    const relevantEntries = loggedMoods.filter(
      (entry) => entry.journal.length > 30 // Increased minimum length for better AI output
    );

    if (relevantEntries.length === 0) {
      Alert.alert(
        "Not Enough Journal Content",
        "Please write more detailed journal entries (at least 30 characters each) to get a meaningful AI analysis. The AI needs more context!"
      );
      setLoadingAnalysis(false);
      return;
    }

    // Format logged entries for the AI prompt
    const entriesText = relevantEntries
      .map(
        (e) =>
          `Mood: ${e.mood?.label || "N/A"}, Entry: "${e.journal}" (Logged: ${
            e.date
          } ${e.timestamp})`
      )
      .join("\n---\n"); // Use a clear separator for multiple entries

    // Construct the prompt for the AI
    const prompt = `As a compassionate mental well-being AI, interpret the following journal and mood entries. Provide supportive insights into potential emotional patterns, offer general coping strategies, and suggest themes for self-reflection. Focus on encouragement and gentle guidance. Do not offer medical advice, diagnoses, or specific treatment plans. Keep the tone empathetic and non-judgmental. Summarize key feelings, identify any noticeable trends over time, and provide 2-3 actionable, general well-being tips. Journal Entries: \n\n"${entriesText}"`;

    // Call the Gemini API via the hook
    await generateContent(prompt);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all logged moods, journal entries, and analysis? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            ); // Animate removal
            setSelectedMood(null);
            setJournalEntry("");
            setLoggedMoods([]);
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
          <Text style={styles.headerTitle}>Mind & Mood Hub</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Log your feelings, find calm, and reflect
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
          {/* Mood Log Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <View style={styles.moodSelectorContainer}>
              {MOOD_SUGGESTIONS.map((mood) => (
                <TouchableOpacity
                  key={mood.label}
                  onPress={() => handleMoodSelect(mood)}
                  style={[
                    styles.moodButton,
                    selectedMood?.label === mood.label &&
                      styles.moodButtonSelected,
                    {
                      borderColor:
                        selectedMood?.label === mood.label
                          ? mood.color
                          : COLORS.separator,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={mood.icon}
                    size={40}
                    color={
                      selectedMood?.label === mood.label
                        ? mood.color
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.moodLabelText,
                      selectedMood?.label === mood.label && {
                        color: mood.color,
                      },
                    ]}
                  >
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Journal Your Thoughts</Text>
            <TextInput
              style={[
                styles.journalInput,
                isJournalFocused && {
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                },
              ]}
              placeholder="What's on your mind? Write freely about your day, challenges, or triumphs..."
              placeholderTextColor={COLORS.textPlaceholder}
              value={journalEntry}
              onChangeText={setJournalEntry}
              multiline
              numberOfLines={4}
              onFocus={() => setIsJournalFocused(true)}
              onBlur={() => setIsJournalFocused(false)}
            />
            <TouchableOpacity
              style={styles.logButton}
              onPress={handleLogMood}
              disabled={!selectedMood && !journalEntry.trim()}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={COLORS.white}
                style={styles.logButtonIcon}
              />
              <Text style={styles.logButtonText}>Log Entry</Text>
            </TouchableOpacity>
          </View>

          {/* Guided Exercises Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Quick Mind Boosters</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSuggestionsScrollContent}
            >
              {GUIDED_EXERCISES.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseButton}
                >
                  <MaterialCommunityIcons
                    name={exercise.icon}
                    size={35}
                    color={COLORS.primary}
                  />
                  <Text style={styles.exerciseButtonText}>
                    {exercise.title}
                  </Text>
                  <Text style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Mood History Display */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Mood Timeline</Text>
            {loggedMoods.length > 0 ? (
              loggedMoods.map((log) => (
                <View key={log.id} style={styles.moodLogCard}>
                  {log.mood && (
                    <View
                      style={[
                        styles.moodLogIconContainer,
                        { backgroundColor: log.mood.color + "20" },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={log.mood.icon}
                        size={28}
                        color={log.mood.color}
                      />
                    </View>
                  )}
                  <View style={styles.moodLogDetails}>
                    <Text style={styles.moodLogTitle}>
                      {log.mood?.label || "Mood Not Selected"}
                    </Text>
                    {log.journal ? (
                      <Text style={styles.moodLogJournal} numberOfLines={2}>
                        "{log.journal}"
                      </Text>
                    ) : null}
                    <Text style={styles.moodLogTime}>
                      {log.date} at {log.timestamp}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="text-box-plus-outline" // Corrected icon
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Start your journey by logging your first mood and thoughts!
                </Text>
              </View>
            )}
          </View>

          {/* Analyze Journal Button */}
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyzeJournal}
            disabled={loadingAnalysis || loggedMoods.length === 0}
          >
            {loadingAnalysis ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <>
                <Ionicons
                  name="sparkles"
                  size={20}
                  color={COLORS.white}
                  style={styles.logButtonIcon}
                />
                <Text style={styles.analyzeButtonText}>Get AI Insights</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Analysis Result Display */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>AI Insights & Reflection</Text>
            {loadingAnalysis ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  The AI is reflecting on your entries...
                </Text>
                <Text style={styles.loadingSubtext}>
                  This may take a moment.
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
                  name="lightbulb-on-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Your personalized AI insights will appear here after you log
                  and analyze your entries.
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
    paddingBottom: 40,
  },
  card: {
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
  moodSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  moodButton: {
    alignItems: "center",
    justifyContent: "center",
    width: width / 3 - 30, // Adjusted width for better spacing with 6 items
    aspectRatio: 1, // Make it square
    margin: 5,
    borderRadius: 15,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: COLORS.separator,
    backgroundColor: COLORS.background, // A light background for unselected
  },
  moodButtonSelected: {
    backgroundColor: COLORS.primary + "10", // A subtle highlight
    borderWidth: 2, // Thicker border when selected
  },
  moodLabelText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginTop: 5,
  },
  journalInput: {
    minHeight: 100,
    maxHeight: 200,
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
    flexDirection: "row",
  },
  logButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
  },
  logButtonIcon: {
    marginRight: 5,
  },
  quickSuggestionsScrollContent: {
    paddingRight: 15,
  },
  exerciseButton: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.35, // Wider cards for more info
    height: 120, // Fixed height for consistency
  },
  exerciseButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  exerciseDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 3,
  },
  moodLogCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  moodLogIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  moodLogDetails: {
    flex: 1,
  },
  moodLogTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  moodLogJournal: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  moodLogTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
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
    flexDirection: "row",
  },
  analyzeButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 8,
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
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },
  loadingSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
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

export default MentalHealthScreen;
