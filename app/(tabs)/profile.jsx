// app/profile/index.js (or app/profile-screen.js)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert, // Still used for other alerts, but not for logout confirmation
  LayoutAnimation, // For smooth dropdown animation
  Platform, // For LayoutAnimation config
  Modal, // For the custom logout modal
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/helper"; // Adjust path as needed based on your project structure

// Removed: UIManager.setLayoutAnimationEnabledExperimental(true);
// This is a no-op in React Native's New Architecture and causes a warning.
// LayoutAnimation still works for basic animations without this line.

// Custom Logout Confirmation Modal Component
const LogoutConfirmationModal = ({ isVisible, onCancel, onConfirm }) => {
  const insets = useSafeAreaInsets();
  if (!isVisible) return null;

  return (
    <Modal
      animationType="fade" // Use 'fade' for the overlay, 'slide' for the content if using separate Animated.View
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel} // Allows back button to close on Android
    >
      <View style={modalStyles.overlay}>
        <View
          style={[modalStyles.modalContainer, { paddingBottom: insets.bottom }]}
        >
          <Text style={modalStyles.modalText}>
            Are you sure you want to log out?
          </Text>
          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={modalStyles.cancelButton}
              onPress={onCancel}
            >
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.confirmButton}
              onPress={onConfirm}
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={modalStyles.confirmButtonGradient}
              >
                <Text style={modalStyles.confirmButtonText}>Yes, Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
    justifyContent: "flex-end", // Align modal to the bottom
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30, // Large rounded corners as per image
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -5 }, // Shadow upwards
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20, // Space from bottom edge
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white, // White background for cancel
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1, // Border for cancel button
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden", // Ensure gradient respects border radius
    marginLeft: 10,
    shadowColor: COLORS.primary, // Shadow matching gradient color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  confirmButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  // State for managing the visibility of the settings dropdown
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  // State for managing the visibility of the custom logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Dummy user data (replace with actual user data from your state/context)
  const user = {
    name: "Jane Doe",
    phoneNumber: "+123 567 89000",
    email: "Janedoe@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1724435811349-32d27f4d5806?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example image URL
  };

  // Handles navigation to Edit Profile screen
  const handleEditProfile = () => {
    router.push("profile/EditProfile");
  };

  // Handles toggling the settings dropdown
  const handleToggleSettingsDropdown = () => {
    // Configure LayoutAnimation for a smooth transition
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200, // duration in ms
        LayoutAnimation.Types.easeInEaseOut, // animation type
        LayoutAnimation.Properties.opacity // property to animate
      )
    );
    setShowSettingsDropdown((prev) => !prev);
  };

  // Handles navigation for specific options (e.g., Favorite, Payment Method)
  const handleOptionPress = (optionName) => {
    Alert.alert("Option Selected", `You pressed ${optionName}`);
    // You can add specific router.push for these if they have dedicated screens
  };

  // Handles navigation for Notification settings
  const handleNotificationPress = () => {
    router.push("profile/NotificationSettings"); // Navigate to Notification settings screen
    setShowSettingsDropdown(false); // Close dropdown after navigation
  };

  // Handles navigation for Password Manager
  const handlePasswordManagerPress = () => {
    router.push("profile/PasswordManager"); // Navigate to Password Manager screen
    setShowSettingsDropdown(false); // Close dropdown after navigation
  };

  // Handles logout action (opens custom modal)
  const handleLogout = () => {
    setShowLogoutModal(true); // Show the custom logout modal
  };

  // Handles confirmation of logout from the custom modal
  const confirmLogout = () => {
    setShowLogoutModal(false); // Close the modal
    console.log("User confirmed logout");
    // Implement your actual logout logic here (e.g., clear tokens, navigate to login screen)
    // router.replace('/login'); // Example navigation to login
  };

  // Reusable component for profile options
  const ProfileOption = ({
    iconName,
    text,
    onPress,
    isLogout = false,
    showChevron = true,
    style = {},
  }) => (
    <TouchableOpacity style={[styles.optionItem, style]} onPress={onPress}>
      <View style={styles.optionLeft}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={isLogout ? COLORS.error : COLORS.primary}
          style={styles.optionIcon}
        />
        <Text style={[styles.optionText, isLogout && { color: COLORS.error }]}>
          {text}
        </Text>
      </View>
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.iconSecondary}
        />
      )}
    </TouchableOpacity>
  );

  // Define dropdown options
  const dropdownOptions = [
    {
      iconName: "bell-outline",
      text: "Notification",
      onPress: handleNotificationPress,
    },
    {
      iconName: "key-outline",
      text: "Password Manager",
      onPress: handlePasswordManagerPress,
    },
  ];

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
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 28 }} />
          {/* Placeholder for right icon if needed, currently empty to balance back button */}
        </View>

        {/* User Info Section within Gradient */}
        <View style={styles.userInfoSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editProfileIcon}
              onPress={handleEditProfile}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userContact}>{user.phoneNumber}</Text>
            <Text style={styles.userContact}>{user.email}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Profile Options */}
        <ProfileOption
          iconName="account-outline"
          text="Profile"
          onPress={() => router.push("profile/EditProfile")}
        />
        <ProfileOption
          iconName="heart-outline"
          text="Favorite"
          onPress={() => router.push("doctors/favorites")}
        />
        <ProfileOption
          iconName="credit-card-outline"
          text="Payment Method"
          onPress={() => router.push("profile/Payment")}
        />
        <ProfileOption
          iconName="lock-outline"
          text="Privacy Policy"
          onPress={() => router.push("profile/Privacy")}
        />
        {/* Settings Option with Dropdown Toggle */}
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleToggleSettingsDropdown}
        >
          <View style={styles.optionLeft}>
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color={COLORS.primary}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Settings</Text>
          </View>
          <Ionicons
            name={showSettingsDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.iconSecondary}
          />
        </TouchableOpacity>

        {/* Dropdown Options (conditionally rendered) */}
        {showSettingsDropdown && (
          <View style={styles.dropdownContainer}>
            {dropdownOptions.map((option, index) => (
              <ProfileOption
                key={option.text} // Use text as key (should be unique)
                iconName={option.iconName}
                text={option.text}
                onPress={option.onPress}
                showChevron={true}
                // Apply border only to items that are not the last one
                style={[
                  styles.dropdownItem,
                  index === dropdownOptions.length - 1 &&
                    styles.lastDropdownItem,
                ]}
              />
            ))}
          </View>
        )}

        <ProfileOption
          iconName="help-circle-outline"
          text="Help"
          onPress={() => router.push("profile/Help")}
        />
        <ProfileOption
          iconName="logout"
          text="Logout"
          onPress={handleLogout} // This now triggers the custom modal
          isLogout={true}
        />
      </ScrollView>

      {/* Custom Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isVisible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 30, // Increased padding to accommodate user info
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
    paddingBottom: 15, // Adjusted to make room for userInfoSection
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10, // Space below header title
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.white,
    resizeMode: "cover",
  },
  editProfileIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userDetails: {
    flex: 1, // Take remaining space
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 2,
  },
  userContact: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20, // Padding from the bottom of the gradient header
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 15, // Slightly rounded corners for list items
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10, // Space between list items
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    marginRight: 15,
    width: 24, // Ensure consistent icon spacing
    textAlign: "center", // Center icon if it's smaller than width
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  dropdownContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15, // Match parent optionItem's border radius
    marginTop: -5, // Overlap slightly with the settings item for a connected look
    marginBottom: 10,
    overflow: "hidden", // Ensures children respect borderRadius
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  dropdownItem: {
    backgroundColor: COLORS.white, // Ensure dropdown items have white background
    borderRadius: 0, // No individual rounded corners for dropdown items
    marginBottom: 0, // No margin between dropdown items
    paddingLeft: 40, // Indent dropdown items
    borderBottomWidth: 1, // Separator between dropdown items
    borderBottomColor: COLORS.separator,
    paddingVertical: 15, // Consistent vertical padding
    paddingRight: 15, // Consistent right padding
  },
  lastDropdownItem: {
    borderBottomWidth: 0, // Remove border for the last item
  },
});

export default ProfileScreen;
