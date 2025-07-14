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
  success: "#4CAF50",
  error: "#FF5252",
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

const SetPasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Password validation rules
  const passwordCriteria = [
    {
      label: "At least 8 characters",
      isValid: newPassword.length >= 8,
    },
    {
      label: "Includes an uppercase letter",
      isValid: /[A-Z]/.test(newPassword),
    },
    {
      label: "Includes a lowercase letter",
      isValid: /[a-z]/.test(newPassword),
    },
    {
      label: "Includes a number",
      isValid: /[0-9]/.test(newPassword),
    },
    {
      label: "Includes a special character (!@#$%^&*)",
      isValid: /[!@#$%^&*]/.test(newPassword),
    },
  ];

  const validatePassword = () => {
    let errors = [];
    if (newPassword.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(newPassword)) {
      errors.push("Password must contain an uppercase letter.");
    }
    if (!/[a-z]/.test(newPassword)) {
      errors.push("Password must contain a lowercase letter.");
    }
    if (!/[0-9]/.test(newPassword)) {
      errors.push("Password must contain a number.");
    }
    if (!/[!@#$%^&*]/.test(newPassword)) {
      errors.push("Password must contain a special character (!@#$%^&*).");
    }

    if (newPassword !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      setPasswordError(errors.join("\n"));
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = () => {
    if (validatePassword()) {
      console.log("Setting new password:", newPassword);
      setIsSubmitted(true);
    }
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
            <Text style={styles.headerTitle}>Set New Password</Text>
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
              <Text style={styles.title}>Create Your New Password</Text>
              <Text style={styles.subtitle}>
                Your new password should be strong and unique.
              </Text>
              {/* New Password Input */}
              <Text style={styles.inputLabel}>New Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  newPasswordFocused && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your new password"
                  placeholderTextColor={COLORS.textPlaceholder}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  onFocus={() => setNewPasswordFocused(true)}
                  onBlur={() => setNewPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={SIZES.medium}
                    color={COLORS.iconSecondary}
                  />
                </TouchableOpacity>
              </View>
              {/* Password strength criteria */}
              <View style={styles.passwordCriteriaContainer}>
                {passwordCriteria.map((criterion, index) => (
                  <View key={index} style={styles.criterionItem}>
                    <Ionicons
                      name={
                        criterion.isValid ? "checkmark-circle" : "close-circle"
                      }
                      size={SIZES.small}
                      color={criterion.isValid ? COLORS.success : COLORS.error}
                    />
                    <Text
                      style={[
                        styles.criterionText,
                        {
                          color: criterion.isValid
                            ? COLORS.textPrimary
                            : COLORS.textSecondary,
                        },
                      ]}
                    >
                      {criterion.label}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Confirm Password Input */}
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  confirmPasswordFocused && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your new password"
                  placeholderTextColor={COLORS.textPlaceholder}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={SIZES.medium}
                    color={COLORS.iconSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
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
                  <Text style={styles.submitButtonText}>Set Password</Text>
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
              <Text style={styles.successTitle}>Password Set!</Text>
              <Text style={styles.successText}>
                Your password has been successfully updated. You can now log in
                with your new password.
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("views/(auth)/sign-in")}
                style={styles.goToLoginButton}
              >
                <Text style={styles.goToLoginText}>Go to Login</Text>
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
    marginBottom: SIZES.xLarge * 1.5, // Slightly less than Forgot Password for criteria list
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
    marginBottom: SIZES.medium, // Reduced for password criteria
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
  eyeIcon: {
    paddingLeft: SIZES.small,
  },
  passwordCriteriaContainer: {
    marginBottom: SIZES.xLarge,
    paddingLeft: SIZES.small,
  },
  criterionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.xSmall / 2,
  },
  criterionText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    marginLeft: SIZES.xSmall,
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.error,
    textAlign: "left",
    marginTop: SIZES.xSmall,
    marginBottom: SIZES.medium,
    paddingHorizontal: SIZES.xSmall,
  },
  submitButton: {
    borderRadius: 25,
    overflow: "hidden",
    ...SHADOWS.medium,
    marginTop: SIZES.large, // Adjust spacing
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
    marginBottom: SIZES.xLarge,
    lineHeight: SIZES.medium * 1.5,
  },
  goToLoginButton: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    borderRadius: 25,
    backgroundColor: COLORS.primary, // Using primary color for consistency
    ...SHADOWS.small,
  },
  goToLoginText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.textLight,
  },
});

export default SetPasswordScreen;
