// app/edit-profile/index.js (or app/edit-profile-screen.js)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator, // For loading state
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/helper"; // Adjust path as needed

// Import for Phone Number Input
import PhoneInput from "react-native-phone-number-input";

// Import for Date Picker
import DateTimePicker from "@react-native-community/datetimepicker";

// Import for Image Picker
import * as ImagePicker from "expo-image-picker";
import { useReducedMotion } from "react-native-reanimated";

const EditProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router=useRouter();
  // State for user data
  const [fullName, setFullName] = useState("Jane Doe");
  const [phoneNumber, setPhoneNumber] = useState("12356789000"); // Store raw number
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState(""); // Store formatted number from PhoneInput
  const [email, setEmail] = useState("janedoe@example.com");
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1)); // Default date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState(
      "https://images.unsplash.com/photo-1724435811349-32d27f4d5806?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const [loading, setLoading] = useState(false); // Loading state for update button

  // Reference for PhoneInput component
  const phoneInput = React.useRef(null);

  // Handle navigation back
  const handleBackPress = () => {
    router.back();
  };

  // Handle settings press (example, you might navigate to a settings screen)
  const handleSettingsPress = () => {
    Alert.alert("Settings", "Navigate to global app settings.");
  };

  // Handle changing profile picture
  const handleChangeProfilePicture = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant media library permissions to change your profile picture."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Handle date change from DatePicker
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios"); // Keep picker open on iOS, close on Android
    setDateOfBirth(currentDate);
  };

  // Format date for display
  const formatDateForDisplay = (date) => {
    if (!date) return "DD / MM / YYYY";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    setLoading(true); // Start loading

    // Basic validation (you can add more robust validation)
    if (!fullName || !phoneNumber || !email || !dateOfBirth) {
      Alert.alert("Error", "Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Example of getting full international number from PhoneInput
    const fullNumber =
      phoneInput.current?.getNumberAfterPossiblyEliminatingZero();

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay


      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack(); // Navigate back on success
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert(
        "Error",
        `Failed to update profile: ${error.message || "Please try again."}`
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
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={handleSettingsPress}
            style={styles.headerButton}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profilePicture}
            />
            <TouchableOpacity
              style={styles.editImageIcon}
              onPress={handleChangeProfilePicture}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color={COLORS.white}
              />
            </TouchableOpacity>
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
        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.textPlaceholder}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            layout="second" // Puts country picker to the left
            onChangeText={(text) => {
              setPhoneNumber(text); // Raw number
            }}
            onChangeFormattedText={(text) => {
              setFormattedPhoneNumber(text); // Formatted number
            }}
            withDarkTheme={false} // Use light theme
            withShadow // Add shadow to the component
            autoFocus // Auto focus on load
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneInputTextContainer}
            textInputStyle={styles.phoneInputTextInput}
            codeTextStyle={styles.phoneInputCodeText}
            flagButtonStyle={styles.phoneInputFlagButton}
            countryPickerButtonStyle={styles.phoneInputCountryPickerButton}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
            placeholderTextColor={COLORS.textPlaceholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Date Of Birth</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateInputTouchable}
          >
            <TextInput
              style={[styles.textInput, styles.dateInput]}
              value={formatDateForDisplay(dateOfBirth)}
              editable={false} // Make it not directly editable by keyboard
              placeholder="DD / MM / YYYY"
              placeholderTextColor={COLORS.textPlaceholder}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateOfBirth}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"} // 'spinner' for iOS, 'default' for Android
              onChange={onDateChange}
              maximumDate={new Date()} // Cannot select future dates
            />
          )}
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}
          disabled={loading} // Disable button while loading
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.updateButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.updateButtonText}>Update Profile</Text>
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
  profileImageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.white,
    resizeMode: "cover",
  },
  editImageIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
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
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  // Styles for react-native-phone-number-input
  phoneInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    width: "100%", // Ensure it takes full width
    height: 60, // Adjust height
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  phoneInputTextContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 0, // Remove default padding
  },
  phoneInputTextInput: {
    paddingVertical: 0, // Remove default padding
    fontSize: 16,
    color: COLORS.textPrimary,
    height: "100%", // Ensure text input fills container
  },
  phoneInputCodeText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  phoneInputFlagButton: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderTopRightRadius: 0, // Adjust corners for seamless look
    borderBottomRightRadius: 0,
    paddingLeft: 10, // Adjust padding
  },
  phoneInputCountryPickerButton: {
    // No specific styles needed unless you want to override default
  },
  dateInputTouchable: {
    // Wrapper for the TextInput to make the entire area touchable for the date picker
  },
  dateInput: {
    // Specific styles for date input if needed
  },
  updateButton: {
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
  updateButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default EditProfileScreen;
