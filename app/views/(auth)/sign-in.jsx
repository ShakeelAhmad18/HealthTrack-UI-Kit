// views/LoginScreen/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router"; // Import useNavigation for canGoBack()

import { COLORS, SIZES, FONT, SHADOWS } from "../../../constants/helper";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false); // State for email input focus
  const [passwordFocused, setPasswordFocused] = useState(false); // State for password input focus
  const router = useRouter();
  const navigation = useNavigation(); // Get navigation object for canGoBack()

  const handleLogin = () => {
    console.log("Login attempt with:", { email, password });
    // In a real app, you'd integrate with your authentication service here.
    // On successful login: router.replace('views/(tabs)'); or router.replace('/home');
  };

  const handleForgotPassword = () => {

    router.push('views/(auth)/forgot');
  };

  const handleSocialLogin = (platform) => {
    console.log(`Login with ${platform}`);
    // Implement social login logic (e.g., Google OAuth, Facebook SDK)
  };

  const handleSignUp = () => {
    router.push("views/(auth)/sign-up"); // Example navigation to a Sign Up screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header with LinearGradient */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={[styles.headerContent, { paddingTop: insets.top }]}>
            {/* Conditionally render back button */}
            {navigation.canGoBack() && (
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
            )}
            <Text style={styles.headerTitle}>Log In</Text>
            {/* Placeholder to balance the back button if it exists, or for consistent spacing */}
            <View
              style={{ width: navigation.canGoBack() ? SIZES.xLarge : 0 }}
            />
          </View>
        </LinearGradient>

        {/* ScrollView for content, ensuring it's scrollable when keyboard is active */}
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Ensures taps on buttons/links work when keyboard is open
        >
          {/* Welcome Section */}
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeDescription}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          {/* Email Input */}
          <Text style={styles.inputLabel}>Email or Mobile Number</Text>
          <View
            style={[
              styles.inputFieldContainer,
              emailFocused && styles.inputFieldContainerFocused, // Apply focused style
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
              onFocus={() => setEmailFocused(true)} // Set focus state
              onBlur={() => setEmailFocused(false)} // Clear focus state
            />
          </View>
          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View
            style={[
              styles.inputFieldContainer,
              passwordFocused && styles.inputFieldContainerFocused, // Apply focused style
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="**********"
              placeholderTextColor={COLORS.textPlaceholder}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)} // Set focus state
              onBlur={() => setPasswordFocused(false)} // Clear focus state
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={SIZES.large}
                color={COLORS.iconSecondary}
              />
            </TouchableOpacity>
          </View>
          {/* Forgot Password */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Forget Password</Text>
          </TouchableOpacity>
          {/* Log In Button */}
          <TouchableOpacity
            style={styles.loginButtonTouchable}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>or sign up with</Text>
            <View style={styles.line} />
          </View>

          {/* Social Login */}
          <View style={styles.socialLoginContainer}>
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() => handleSocialLogin("Google")}
            >
              <Ionicons
                name="logo-google"
                size={SIZES.xLarge}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() => handleSocialLogin("Facebook")}
            >
              <Ionicons
                name="logo-facebook"
                size={SIZES.xLarge}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() => handleSocialLogin("Fingerprint")}
            >
              <MaterialCommunityIcons
                name="fingerprint"
                size={SIZES.xLarge}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link - Dynamic bottom margin */}
          <View
            style={[
              styles.signUpContainer,
              { marginBottom: insets.bottom + SIZES.medium },
            ]}
          >
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
  scrollViewContent: {
    flexGrow: 1, // Allows ScrollView to grow and take available space
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large * 2, // Generous top padding
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
    borderRadius: 20, // Makes tap area more visible
    backgroundColor: "rgba(255,255,255,0.2)", // Slight visibility improvement
    marginRight: SIZES.small, // Better spacing
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.textLight,
  },
  welcomeTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  welcomeDescription: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xLarge * 2, // Increased margin for better separation
  },
  inputLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.xSmall,
    marginTop: SIZES.large, // Consistent spacing above inputs
  },
  inputFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: SIZES.medium,
    ...SHADOWS.small,
    height: 55,
    borderWidth: 1,
    borderColor: COLORS.separator,
    marginBottom: SIZES.medium, // Added margin between input containers
  },
  inputFieldContainerFocused: {
    borderColor: COLORS.primary, // Highlight border when focused
    shadowColor: COLORS.primary, // Brighter shadow when focused
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
  passwordToggle: {
    paddingLeft: SIZES.small,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: SIZES.xSmall, // Reduced margin to bring closer to password input
    padding: SIZES.xSmall,
  },
  forgotPasswordText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  loginButtonTouchable: {
    width: "100%",
    borderRadius: 40,
    overflow: "hidden",
    ...SHADOWS.medium,
    marginTop: SIZES.xLarge, // Consistent spacing before button
  },
  loginButtonGradient: {
    paddingVertical: SIZES.medium + 5,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.textLight,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SIZES.xLarge * 2, // Consistent spacing around separator
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.separator,
  },
  separatorText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginHorizontal: SIZES.medium,
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SIZES.xLarge * 2, // Consistent spacing below social icons
  },
  socialIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: SIZES.medium,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SIZES.medium,
  },
  signUpText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  signUpLink: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
});

export default LoginScreen;
