import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Linking,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import useGeminiApi from "../../../../lib/useGeminiApi"; // Adjust path as needed

const { width, height } = Dimensions.get("window");

// Constants
const COLORS = {
  primary: "#00BBD3",
  secondary: "#33E4DB",
  background: "#E9F6FE",
  gradientStart: "#00BBD3",
  gradientEnd: "#33E4DB",
  textPrimary: "#333333",
  textSecondary: "#666666",
  textLight: "#FFFFFF",
  textPlaceholder: "#999999",
  border: "#DDDDDD",
  separator: "#EEEEEE",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
  white: "#FFFFFF",
  black: "#000000",
  lightGrey: "#F0F0F0",
  mediumGrey: "#CCCCCC",
  darkGrey: "#888888",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const FONT = {
  regular: "Arial",
  medium: "Arial-Medium",
  bold: "Arial-Bold",
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

const QUICK_DOCTOR_EXAMPLES = [
  "I have a persistent cough and sore throat. What could it be?",
  "What are common remedies for mild headaches?",
  "Can you explain the benefits of a balanced diet for heart health?",
  "What should I do if I feel dizzy after standing up quickly?",
  "How can I improve my sleep hygiene?",
];

const AIDoctorScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [userQuery, setUserQuery] = useState("");
  const [aiAdviceResult, setAiAdviceResult] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState(null);

  const adviceCardAnimHeight = useSharedValue(0);
  const adviceCardOpacity = useSharedValue(0);

  // Use the Gemini API hook
  const { response, loading, error, generateContent } = useGeminiApi();

  const animatedAdviceCardStyle = useAnimatedStyle(() => {
    return {
      height: adviceCardAnimHeight.value,
      opacity: adviceCardOpacity.value,
    };
  });

  useEffect(() => {
    if (response) {
      setAiAdviceResult(response);
      setLoadingAdvice(false);
      adviceCardAnimHeight.value = withTiming(height * 0.5, { duration: 600 });
      adviceCardOpacity.value = withTiming(1, { duration: 600 });
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 700);
    }
  }, [response, adviceCardAnimHeight, adviceCardOpacity]);

  useEffect(() => {
    if (error) {
      setAdviceError(error);
      setLoadingAdvice(false);
      Alert.alert("AI Advice Error", error);
      adviceCardAnimHeight.value = withTiming(0, { duration: 300 });
      adviceCardOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [error, adviceCardAnimHeight, adviceCardOpacity]);

  const handleGetAdvice = useCallback(async () => {
    Keyboard.dismiss();

    if (!userQuery.trim()) {
      Alert.alert(
        "Input Required",
        "Please describe your symptoms or ask a health question to get advice."
      );
      return;
    }

    setLoadingAdvice(true);
    setAiAdviceResult(null);
    setAdviceError(null);
    adviceCardAnimHeight.value = withTiming(0, { duration: 300 });
    adviceCardOpacity.value = withTiming(0, { duration: 300 });

    const prompt = `Act as an AI medical assistant. Provide helpful, general health information and advice based on the following user's query. Always include a clear disclaimer at the beginning and end of your response stating that you are an AI and cannot provide medical diagnosis or treatment, and that they should consult a real doctor for any health concerns. Keep responses concise, easy to understand, and structured in clear paragraphs.

    User's Health Query: "${userQuery}"`;

    setUserQuery("");
    await generateContent(prompt);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [userQuery, generateContent, adviceCardAnimHeight, adviceCardOpacity]);

  const handleQuickExample = useCallback((example) => {
    setUserQuery(example);
  }, []);

  const handleClearInput = useCallback(() => {
    setUserQuery("");
    setAiAdviceResult(null);
    setAdviceError(null);
    adviceCardAnimHeight.value = withTiming(0, { duration: 300 });
    adviceCardOpacity.value = withTiming(0, { duration: 300 });
  }, [adviceCardAnimHeight, adviceCardOpacity]);

  const handleConsultDoctor = useCallback(() => {
    Alert.alert(
      "Consult a Professional",
      "For accurate diagnosis and personalized treatment, please consult a qualified healthcare professional.",
      [
        { text: "OK", style: "cancel" },
        {
          text: "Find a Doctor",
          onPress: () =>
            Linking.openURL(
              "https://www.google.com/search?q=find+a+doctor+near+me"
            ),
        },
      ]
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
            <Ionicons
              name="arrow-back"
              size={SIZES.large}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health AI</Text>
          <TouchableOpacity
            onPress={handleClearInput}
            style={styles.headerButton}
          >
            <Ionicons
              name="trash-outline"
              size={SIZES.large}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Your intelligent health companion
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? insets.top + SIZES.xxLarge : 0
        }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollViewContent,
              { paddingBottom: insets.bottom + SIZES.xxLarge },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>
                Describe Your Symptoms or Query
              </Text>
              <View style={styles.queryInputContainer}>
                <TextInput
                  style={styles.queryInput}
                  placeholder="e.g., 'I have a mild fever and body aches. What should I do?'"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={userQuery}
                  onChangeText={setUserQuery}
                  multiline
                  editable={!loadingAdvice}
                  textAlignVertical="top"
                />
                {userQuery.length > 0 && !loadingAdvice && (
                  <TouchableOpacity
                    style={styles.clearInputButton}
                    onPress={() => setUserQuery("")}
                  >
                    <Ionicons
                      name="close-circle"
                      size={SIZES.large}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  (loadingAdvice || !userQuery.trim()) &&
                    styles.actionButtonDisabled,
                ]}
                onPress={handleGetAdvice}
                disabled={loadingAdvice || !userQuery.trim()}
              >
                {loadingAdvice ? (
                  <ActivityIndicator color={COLORS.textLight} size="small" />
                ) : (
                  <Text style={styles.actionButtonText}>Get AI Advice</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.quickExamplesSection}>
              <Text style={styles.sectionTitle}>Quick Query Examples</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickExamplesScrollContent}
              >
                {QUICK_DOCTOR_EXAMPLES.map((example, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickExampleButton}
                    onPress={() => handleQuickExample(example)}
                  >
                    <Text
                      style={styles.quickExampleButtonText}
                      numberOfLines={2}
                    >
                      {example}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.adviceResultSectionWrapper}>
              <Text style={styles.sectionTitle}>AI Health Insights</Text>
              {loadingAdvice ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>
                    Analyzing your query...
                  </Text>
                </View>
              ) : adviceError ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="warning-outline"
                    size={SIZES.xLarge}
                    color={COLORS.error}
                  />
                  <Text style={styles.errorText}>{adviceError}</Text>
                </View>
              ) : aiAdviceResult ? (
                <Animated.View
                  style={[styles.resultCard, animatedAdviceCardStyle]}
                >
                  <View style={styles.resultCardHeader}>
                    <Ionicons
                      name="sparkles"
                      size={SIZES.large}
                      color={COLORS.primary}
                    />
                    <Text style={styles.resultCardTitle}>AI Health Advice</Text>
                  </View>
                  <Text style={styles.disclaimerText}>
                    <Ionicons
                      name="information-circle-outline"
                      size={SIZES.medium}
                      color={COLORS.warning}
                    />{" "}
                    This is general AI-generated information and not medical
                    advice. Always consult a healthcare professional for
                    diagnosis or treatment.
                  </Text>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultText}>{aiAdviceResult}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.consultDoctorButton}
                    onPress={handleConsultDoctor}
                  >
                    <Ionicons
                      name="person-add-outline"
                      size={SIZES.medium}
                      color={COLORS.textLight}
                    />
                    <Text style={styles.consultDoctorButtonText}>
                      Consult a Doctor
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <MaterialCommunityIcons
                    name="stethoscope"
                    size={60}
                    color={COLORS.textSecondary}
                    style={{ opacity: 0.6 }}
                  />
                  <Text style={styles.placeholderText}>
                    Type your health question above to receive AI insights.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: SIZES.medium,
    borderBottomLeftRadius: SIZES.xxLarge,
    borderBottomRightRadius: SIZES.xxLarge,
    ...SHADOWS.medium,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.medium,
    paddingBottom: SIZES.small,
  },
  headerButton: {
    padding: SIZES.xSmall,
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.bold,
    color: COLORS.textLight,
  },
  headerSubtitle: {
    fontSize: SIZES.medium,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SIZES.small,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.medium,
  },
  inputSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.large,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  queryInputContainer: {
    position: "relative",
    marginBottom: SIZES.medium,
  },
  queryInput: {
    minHeight: 120,
    maxHeight: 200,
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingRight: SIZES.xxLarge,
  },
  clearInputButton: {
    position: "absolute",
    top: SIZES.small,
    right: SIZES.small,
    padding: SIZES.xSmall,
    zIndex: 1,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.xxLarge,
    paddingVertical: SIZES.medium,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.primary + "60",
    ...SHADOWS.small,
  },
  actionButtonText: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.textLight,
  },
  quickExamplesSection: {
    marginBottom: SIZES.medium,
  },
  quickExamplesScrollContent: {
    paddingRight: SIZES.medium,
  },
  quickExampleButton: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.large,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    marginRight: SIZES.small,
    minWidth: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  quickExampleButtonText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontFamily: FONT.medium,
    textAlign: "center",
  },
  adviceResultSectionWrapper: {
    marginBottom: SIZES.medium,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    minHeight: 150,
    ...SHADOWS.small,
  },
  loadingText: {
    marginTop: 0,
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    fontFamily: FONT.regular,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "20",
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.error,
    ...SHADOWS.small,
  },
  errorText: {
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.error,
    flexShrink: 1,
    fontFamily: FONT.regular,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.large,
    padding: SIZES.medium,
    ...SHADOWS.medium,
    width: "100%",
    minHeight: 150,
    maxHeight: height * 0.6,
    overflow: "hidden",
  },
  resultCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.small,
    paddingBottom: SIZES.xSmall,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  resultCardTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginLeft: SIZES.xSmall,
  },
  disclaimerText: {
    fontSize: SIZES.small,
    fontFamily: FONT.medium,
    color: COLORS.warning,
    backgroundColor: COLORS.warning + "10",
    borderRadius: SIZES.xSmall,
    padding: SIZES.xSmall,
    marginBottom: SIZES.small,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  resultTextContainer: {
    flex: 1,
    marginBottom: SIZES.medium,
  },
  resultText: {
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    lineHeight: SIZES.large,
    fontFamily: FONT.regular,
  },
  consultDoctorButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.large,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SIZES.xSmall,
    ...SHADOWS.small,
  },
  consultDoctorButtonText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.bold,
    color: COLORS.textLight,
    marginLeft: SIZES.xSmall,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SIZES.xxLarge,
    minHeight: 250,
  },
  placeholderText: {
    marginTop: SIZES.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
    opacity: 0.7,
    fontFamily: FONT.regular,
  },
});

export default AIDoctorScreen;
