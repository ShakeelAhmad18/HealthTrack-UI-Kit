// app/medical-record/add.js (or app/add-record-screen.js)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider"; // For Age, Weight, Height sliders
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

const AddRecordScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State for input fields
  const [selectedGender, setSelectedGender] = useState(null); // 'Male', 'Female', 'Other'
  const [age, setAge] = useState(26); // Default age from image
  const [weight, setWeight] = useState(75); // Default weight from image
  const [height, setHeight] = useState(178); // Default height from image
  const [bloodType, setBloodType] = useState("AB +"); // Default blood type from image
  const [isSaving, setIsSaving] = useState(false); // For loading state on save button

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSaveRecord = async () => {
    // Basic validation
    if (!selectedGender || !bloodType.trim()) {
      Alert.alert(
        "Missing Information",
        "Please select your gender and enter your blood type."
      );
      return;
    }

    setIsSaving(true);

    const recordData = {
      gender: selectedGender,
      age: age,
      weight: weight,
      height: height,
      bloodType: bloodType.trim(),
      timestamp: new Date().toISOString(),
    };


    try {
      // Simulate API call to save record
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Record Saved",
        "Your medical record has been successfully added!"
      );
      navigation.goBack(); // Navigate back after successful save
    } catch (error) {
      console.error("Failed to save record:", error);
      Alert.alert("Error", "Failed to save medical record. Please try again.");
    } finally {
      setIsSaving(false);
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
          <Text style={styles.headerTitle}>Add Record</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Gender Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What is your gender</Text>
            <View style={styles.genderButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGender === "Male" && styles.genderButtonActive,
                ]}
                onPress={() => setSelectedGender("Male")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    selectedGender === "Male" && styles.genderButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGender === "Female" && styles.genderButtonActive,
                ]}
                onPress={() => setSelectedGender("Female")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    selectedGender === "Female" &&
                      styles.genderButtonTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGender === "Other" && styles.genderButtonActive,
                ]}
                onPress={() => setSelectedGender("Other")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    selectedGender === "Other" && styles.genderButtonTextActive,
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Age Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>How old are you</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={age}
              onValueChange={setAge}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.separator}
              thumbTintColor={COLORS.primary}
            />
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderLabel}>0</Text>
              <Text style={styles.sliderCurrentValue}>{age}</Text>
              <Text style={styles.sliderLabel}>100</Text>
            </View>
          </View>

          {/* Weight Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What is your weight</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={200}
              step={1}
              value={weight}
              onValueChange={setWeight}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.separator}
              thumbTintColor={COLORS.primary}
            />
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderLabel}>0</Text>
              <Text style={styles.sliderCurrentValue}>{weight}</Text>
              <Text style={styles.sliderLabel}>200</Text>
            </View>
          </View>

          {/* Height Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What is your height</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={200}
              step={1}
              value={height}
              onValueChange={setHeight}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.separator}
              thumbTintColor={COLORS.primary}
            />
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderLabel}>0</Text>
              <Text style={styles.sliderCurrentValue}>{height}</Text>
              <Text style={styles.sliderLabel}>200</Text>
            </View>
          </View>

          {/* Blood Type Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What is your blood type</Text>
            <TextInput
              style={styles.bloodTypeInput}
              placeholder="e.g., A+, O-, B+"
              placeholderTextColor={COLORS.textPlaceholder}
              value={bloodType}
              onChangeText={setBloodType}
              autoCapitalize="characters" // Suggest capitals for blood type
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveRecord}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  // Gender Buttons
  genderButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: COLORS.background, // Default background
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  genderButtonTextActive: {
    color: COLORS.white,
  },
  // Sliders
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -10, // Pull up slightly to align with slider
    paddingHorizontal: 5,
  },
  sliderLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  sliderCurrentValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  // Blood Type Input
  bloodTypeInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  // Save Button
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default AddRecordScreen;
