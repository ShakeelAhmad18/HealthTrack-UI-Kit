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
import { useNavigation } from "expo-router"; // Assuming you are using Expo Router
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

// Pre-defined common symptoms for quick input
const COMMON_SYMPTOMS = [
  "Headache",
  "Fever",
  "Cough",
  "Sore Throat",
  "Fatigue",
  "Nausea",
  "Dizziness",
  "Muscle Pain",
  "Shortness of Breath",
  "Rash",
  "Stomach Ache",
  "Diarrhea",
  "Chest Pain",
  "Joint Pain",
  "Blurred Vision",
];

const SymptomChecker = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for chat messages
  const [messages, setMessages] = useState([]); // Stores { type: 'user' | 'ai', text: '...' }
  const [currentSymptomInput, setCurrentSymptomInput] = useState("");

  // Use the custom Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  // Effect to add AI response to messages when it's received
  useEffect(() => {
    if (response) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: response },
      ]);
    }
  }, [response]);

  // Effect to handle errors from the API hook
  useEffect(() => {
    if (error) {
      Alert.alert("AI Error", error);
    }
  }, [error]);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    };
    const timeout = setTimeout(scrollToBottom, 50); // Small delay to allow layout to update
    return () => clearTimeout(timeout);
  }, [messages.length, loading]);

  const handleSendSymptom = async () => {
    if (!currentSymptomInput.trim()) return;

    const userMessage = { type: "user", text: currentSymptomInput.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const promptToSend = currentSymptomInput.trim();
    setCurrentSymptomInput(""); // Clear input immediately

    // Prepare chat history for the API call
    // Only send text messages for chat history
    const chatHistoryForApi = messages.map((msg) => ({
      role: msg.type === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Construct the full prompt for the AI
    const fullPrompt = `As a symptom checker AI, analyze the following symptoms and provide possible conditions, next steps, and advice. Keep the language clear and concise, suitable for a general user. Do not provide a diagnosis. Symptoms: "${promptToSend}"`;

    // Call the Gemini API via the hook
    await generateContent(fullPrompt, chatHistoryForApi);
  };

  const handleQuickSymptom = (symptom) => {
    setCurrentSymptomInput(symptom);
    // Optionally, automatically send the prompt after setting it
    // handleSendSymptom(); // Uncomment if you want instant send on quick action
  };

  const handleClearChat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear the entire conversation?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", onPress: () => setMessages([]) },
      ]
    );
  };

  const renderMessage = (message, index) => (
    <View
      key={index}
      style={[
        styles.messageBubble,
        message.type === "user"
          ? styles.userMessageBubble
          : styles.aiMessageBubble,
      ]}
    >
      <Text
        style={
          message.type === "user"
            ? styles.userMessageText
            : styles.aiMessageText
        }
      >
        {message.text}
      </Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>Symptom Checker</Text>
          <TouchableOpacity
            onPress={handleClearChat}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Describe your symptoms for AI insights
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScrollView}
          contentContainerStyle={styles.chatScrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && !loading && (
            <View style={styles.initialPromptContainer}>
              <MaterialCommunityIcons
                name="stethoscope"
                size={80}
                color={COLORS.textSecondary}
                style={{ opacity: 0.6 }}
              />
              <Text style={styles.initialPromptText}>
                What are your symptoms?
              </Text>
              <Text style={styles.initialPromptSubText}>
                Tell me how you're feeling.
              </Text>
            </View>
          )}

          {messages.map(renderMessage)}

          {loading && (
            <View style={styles.loadingIndicatorContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Analyzing symptoms...</Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Symptoms Section */}
        <View style={styles.quickSymptomsSection}>
          <Text style={styles.quickSymptomsTitle}>Common Symptoms:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickSymptomsScrollContent}
          >
            {COMMON_SYMPTOMS.map((symptom, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickSymptomButton}
                onPress={() => handleQuickSymptom(symptom)}
              >
                <Text style={styles.quickSymptomButtonText}>{symptom}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Input Area */}
        <View style={[styles.inputArea, { paddingBottom: insets.bottom }]}>
          <TextInput
            style={styles.messageInput}
            placeholder="e.g., 'I have a persistent cough and fever.'"
            placeholderTextColor={COLORS.textPlaceholder}
            value={currentSymptomInput}
            onChangeText={setCurrentSymptomInput}
            multiline
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendSymptom}
            disabled={loading || !currentSymptomInput.trim()}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Ionicons name="send" size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
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
  chatScrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  chatScrollViewContent: {
    justifyContent: "flex-end", // Stick messages to bottom
    minHeight: "100%", // Ensure content takes up full height for scrollToEnd
  },
  initialPromptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  initialPromptText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 20,
  },
  initialPromptSubText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 5,
    textAlign: "center",
  },
  messageBubble: {
    maxWidth: "85%", // Slightly wider bubbles
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20, // More rounded corners
    marginBottom: 10,
  },
  userMessageBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 8, // Pointed corner for user
  },
  aiMessageBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 8, // Pointed corner for AI
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, // Slightly more pronounced shadow
    shadowRadius: 3,
    elevation: 2,
  },
  userMessageText: {
    fontSize: 15,
    color: COLORS.white,
  },
  aiMessageText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  loadingIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderBottomLeftRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  quickSymptomsSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  quickSymptomsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  quickSymptomsScrollContent: {
    paddingRight: 15, // Space at the end
  },
  quickSymptomButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
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
  quickSymptomButtonText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 25, // More rounded input
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    maxHeight: 120, // Slightly increased max height
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28, // Larger and more rounded send button
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: COLORS.primary, // Add shadow to send button
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default SymptomChecker;
