// app/password-manager/index.js (or app/password-manager-screen.js)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator, // For loading state
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming you are using Expo Router
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Reusable password input component - MOVED OUTSIDE to prevent re-renders
const PasswordInput = ({
  label,
  value,
  onChangeText,
  isPasswordVisible,
  toggleVisibility,
  showForgotPassword = false,
  handleForgotPassword,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.passwordInputContainer}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible} // Toggle visibility
        placeholder={`Enter your ${label.toLowerCase()}`}
        placeholderTextColor={COLORS.textPlaceholder}
        autoCapitalize="none" // Passwords are typically not capitalized
        autoCorrect={false} // Disable auto-correction for passwords
      />
      <TouchableOpacity
        onPress={toggleVisibility}
        style={styles.passwordVisibilityToggle}
      >
        <Ionicons
          name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
          size={24}
          color={COLORS.iconSecondary}
        />
      </TouchableOpacity>
    </View>
    {showForgotPassword && (
      <TouchableOpacity
        onPress={handleForgotPassword}
        style={styles.forgotPasswordButton}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    )}
  </View>
);

const PasswordManagerScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State for password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // State for password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [loading, setLoading] = useState(false); // Loading state for the change password button

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password?", "Navigate to password recovery flow.");
    // In a real app, you would navigate to a forgot password screen
    // router.push('auth/forgot-password');
  };

  const handleChangePassword = async () => {
    setLoading(true); // Start loading

    // Basic validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Error", "All password fields are required.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    // In a real application, you would send this to your backend
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Example API call (uncomment and replace with your actual endpoint)
      // const response = await fetch('YOUR_API_ENDPOINT/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword,
      //     newPassword,
      //   }),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Failed to change password');

      Alert.alert("Success", "Your password has been changed successfully!");
      // Clear fields on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      // Optionally navigate back
      // navigation.goBack();
    } catch (error) {
      console.error("Password change error:", error);
      Alert.alert(
        "Error",
        `Failed to change password: ${error.message || "Please try again."}`
      );
    } finally {
      setLoading(false); // End loading
    }
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
            onPress={handleBackPress}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Password Manager</Text>
          <View style={{ width: 28 }} />
          {/* Placeholder for right icon if needed, currently empty to balance back button */}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled" // Added to prevent keyboard dismissal
      >
        {/* Current Password Input */}
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          isPasswordVisible={showCurrentPassword}
          toggleVisibility={() => setShowCurrentPassword((prev) => !prev)}
          showForgotPassword={true}
          handleForgotPassword={handleForgotPassword} // Pass the handler
        />

        {/* New Password Input */}
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          isPasswordVisible={showNewPassword}
          toggleVisibility={() => setShowNewPassword((prev) => !prev)}
        />

        {/* Confirm New Password Input */}
        <PasswordInput
          label="Confirm New Password"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          isPasswordVisible={showConfirmNewPassword}
          toggleVisibility={() => setShowConfirmNewPassword((prev) => !prev)}
        />

        {/* Change Password Button */}
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={handleChangePassword}
          disabled={loading} // Disable button while loading
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.changePasswordButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.changePasswordButtonText}>
                Change Password
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 15,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  textInput: {
    flex: 1, // Allow text input to take most of the space
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  passwordVisibilityToggle: {
    padding: 10,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end", // Align to the right
    marginTop: 8,
    marginRight: 5, // Small margin from the right edge of the input
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary, // Use primary color for links
    fontWeight: "600",
  },
  changePasswordButton: {
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  changePasswordButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  changePasswordButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default PasswordManagerScreen;
