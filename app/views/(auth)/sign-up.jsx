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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

// Constants (should be imported from your constants file)
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

const SignUpScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    dateOfBirth: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    console.log("Sign up attempt with:", formData);
    // Handle sign up logic here
  };

  const handleSocialSignUp = (platform) => {
    console.log(`Sign up with ${platform}`);
    // Handle social sign up logic
  };

  const handleTermsPress = () => {
    console.log("Terms of Use pressed");
    // router.push('/terms');
  };

  const handlePrivacyPress = () => {
    console.log("Privacy Policy pressed");
    // router.push('/privacy');
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
            <Text style={styles.headerTitle}>Sign Up</Text>
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
          {/* Full Name Input */}
          <Text style={styles.inputLabel}>Full name</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "fullName" && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={COLORS.textPlaceholder}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange("fullName", text)}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
            />
          </View>
          {/* Email Input */}
          <Text style={styles.inputLabel}>Email</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "email" && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="example@example.com"
              placeholderTextColor={COLORS.textPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "password" && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="**********"
              placeholderTextColor={COLORS.textPlaceholder}
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
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
          {/* Mobile Number Input */}
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "mobileNumber" && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="+1 234 567 890"
              placeholderTextColor={COLORS.textPlaceholder}
              keyboardType="phone-pad"
              value={formData.mobileNumber}
              onChangeText={(text) => handleInputChange("mobileNumber", text)}
              onFocus={() => setFocusedField("mobileNumber")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          {/* Date of Birth Input */}
          <Text style={styles.inputLabel}>Date Of Birth</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "dateOfBirth" && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="DD / MM / YYYY"
              placeholderTextColor={COLORS.textPlaceholder}
              value={formData.dateOfBirth}
              onChangeText={(text) => handleInputChange("dateOfBirth", text)}
              onFocus={() => setFocusedField("dateOfBirth")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>By continuing, you agree to </Text>
            <TouchableOpacity onPress={handleTermsPress}>
              <Text style={styles.termsLink}>Terms of Use</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> and </Text>
            <TouchableOpacity onPress={handlePrivacyPress}>
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>.</Text>
          </View>
          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.signUpButtonGradient}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>or sign up with</Text>
            <View style={styles.separatorLine} />
          </View>
          {/* Social Sign Up */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignUp("Google")}
            >
              <Ionicons
                name="logo-google"
                size={SIZES.xLarge}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignUp("Facebook")}
            >
              <Ionicons
                name="logo-facebook"
                size={SIZES.xLarge}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignUp("Apple")}
            >
              <Ionicons
                name="logo-apple"
                size={SIZES.xLarge}
                color={COLORS.primary}
              />
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
  inputLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
    marginTop: SIZES.medium,
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
    marginBottom: SIZES.medium,
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
  passwordToggle: {
    padding: SIZES.small,
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SIZES.large,
  },
  termsText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  termsLink: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  signUpButton: {
    borderRadius: 25,
    overflow: "hidden",
    ...SHADOWS.medium,
    marginTop: SIZES.small,
  },
  signUpButtonGradient: {
    paddingVertical: SIZES.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.textLight,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SIZES.xLarge,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.separator,
  },
  separatorText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginHorizontal: SIZES.small,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SIZES.xLarge,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: SIZES.small,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default SignUpScreen;
