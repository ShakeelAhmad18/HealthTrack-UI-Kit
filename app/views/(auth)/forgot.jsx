import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

// Reusing your existing constants
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
  iconPrimary: "#00BBD3",
  iconSecondary: "#666666",
  white: "#FFFFFF",
  black: "#000000",
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

const ForgotPasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log("Reset password requested for:", email);
    // In a real app, you would call your API here
    setIsSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={[styles.headerContent, { paddingTop: insets.top }]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={SIZES.xLarge}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Forgot Password</Text>
            <View style={{ width: SIZES.xLarge }} />
          </View>
        </LinearGradient>
        <ScrollView
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + SIZES.large },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!isSubmitted ? (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your
                password.
              </Text>
              {/* Email Input */}
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  emailFocused && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="example@example.com"
                  placeholderTextColor={COLORS.textPlaceholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.submitButtonGradient}
                >
                  <Text style={styles.submitButtonText}>Send Reset Link</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Ionicons
                name="checkmark-circle"
                size={SIZES.xxLarge}
                color={COLORS.primary}
                style={styles.successIcon}
              />
              <Text style={styles.successTitle}>Email Sent!</Text>
              <Text style={styles.successText}>
                We've sent a password reset link to your email address. Please
                check your inbox.
              </Text>
              <Text style={styles.successNote}>
                Didn't receive the email? Check your spam folder or try again.
              </Text>
              <TouchableOpacity
                onPress={() => setIsSubmitted(false)}
                style={styles.tryAgainButton}
              >
                <Text style={styles.tryAgainText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: SIZES.large,
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
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.medium,
  },
  backButton: {
    padding: SIZES.small,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.textLight,
    textAlign: "center",
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.xLarge,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xLarge * 2,
    lineHeight: SIZES.medium * 1.5,
  },
  inputLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SIZES.medium,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SIZES.xLarge,
    ...SHADOWS.small,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    paddingVertical: Platform.OS === "ios" ? SIZES.small : 0,
  },
  submitButton: {
    borderRadius: 25,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  submitButtonGradient: {
    paddingVertical: SIZES.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.textLight,
  },
  successContainer: {
    alignItems: "center",
    marginTop: SIZES.xLarge,
  },
  successIcon: {
    marginBottom: SIZES.large,
  },
  successTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  successText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES.small,
    lineHeight: SIZES.medium * 1.5,
  },
  successNote: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES.xLarge,
    lineHeight: SIZES.small * 1.5,
  },
  tryAgainButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
  },
  tryAgainText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordScreen;
