// app/medical-record/allergies.js (or app/allergies-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal, // For Add Allergy Modal
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy User Medical Info (can be passed via params or fetched)
const DUMMY_USER_MEDICAL_INFO = {
  name: "Jane Doe",
  gender: "Female",
  bloodType: "AB +",
  age: "26 Years",
  weight: "65 Kg",
};

// Dummy Allergies Data
const DUMMY_ALLERGIES = [
  {
    id: "al1",
    name: "Insulin",
    symptoms: "Skin Symptoms: redness, itching and swelling at injection site.",
    addedDate: "10 February 20XX",
  },
  {
    id: "al2",
    name: "Codeine",
    symptoms: "Respiratory Symptoms: Wheezing, difficulty breathing.",
    addedDate: "06 June 20XX",
  },
  {
    id: "al3",
    name: "Pollen",
    symptoms: "Respiratory Symptoms: Sneezing, runny nose, nasal congestion.",
    addedDate: "20 October 20XX",
  },
  {
    id: "al4",
    name: "Latex",
    symptoms: "Skin Symptoms: Itching, redness, rash.",
    addedDate: "20 October 20XX",
  },
];

const AllergiesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);

  useEffect(() => {
    // Simulate fetching allergies from an API
    const fetchAllergies = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAllergies(DUMMY_ALLERGIES); // Set dummy data
      } catch (error) {
        console.error("Failed to fetch allergies:", error);
        Alert.alert("Error", "Could not load allergies. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllergies();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddMore = () => {
    setShowAddAllergyModal(true);
  };

  const handleSaveNewAllergy = (newAllergy) => {
    setAllergies((prevAllergies) => [
      {
        id: `al${prevAllergies.length + 1}`,
        addedDate: new Date()
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
          .replace(/ /g, " "), // Format as "DD Month YYYY"
        ...newAllergy,
      },
      ...prevAllergies, // Add new allergy to the top
    ]);
    Alert.alert("Success", "New allergy added successfully!");
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
          <Text style={styles.headerTitle}>Medical Record</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* User Info Section */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{DUMMY_USER_MEDICAL_INFO.name}</Text>
          <View style={styles.medicalInfoRow}>
            <Text style={styles.medicalInfoLabel}>Gender:</Text>
            <Text style={styles.medicalInfoValue}>
              {DUMMY_USER_MEDICAL_INFO.gender}
            </Text>
            <Text style={styles.medicalInfoLabel}>Blood Type:</Text>
            <Text style={styles.medicalInfoValue}>
              {DUMMY_USER_MEDICAL_INFO.bloodType}
            </Text>
          </View>
          <View style={styles.medicalInfoRow}>
            <Text style={styles.medicalInfoLabel}>Age:</Text>
            <Text style={styles.medicalInfoValue}>
              {DUMMY_USER_MEDICAL_INFO.age}
            </Text>
            <Text style={styles.medicalInfoLabel}>Weight:</Text>
            <Text style={styles.medicalInfoValue}>
              {DUMMY_USER_MEDICAL_INFO.weight}
            </Text>
          </View>
        </View>

        {/* Allergies Section Title */}
        <View style={styles.allergiesHeader}>
          <Text style={styles.allergiesTitle}>Allergies</Text>
          <Text style={styles.allergiesSubtitle}>And Adverse Reactions</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading allergies...</Text>
          </View>
        ) : allergies.length > 0 ? (
          allergies.map((allergy) => (
            <View key={allergy.id} style={styles.allergyCard}>
              <View style={styles.allergyContent}>
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline" // Or a more neutral icon if not confirmed
                  size={24}
                  color={COLORS.primary}
                  style={styles.allergyIcon}
                />
                <View style={styles.allergyTextContainer}>
                  <Text style={styles.allergyName}>{allergy.name}</Text>
                  <Text style={styles.allergySymptoms}>{allergy.symptoms}</Text>
                  <Text style={styles.allergyAddedInfo}>
                    Added Manually {allergy.addedDate}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noAllergiesContainer}>
            <Text style={styles.noAllergiesText}>
              No allergies recorded yet.
            </Text>
          </View>
        )}

        {/* Add More Button */}
        <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMore}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addMoreButtonGradient}
          >
            <Text style={styles.addMoreButtonText}>Add More</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Allergy Modal */}
      <AddAllergyModal
        isVisible={showAddAllergyModal}
        onClose={() => setShowAddAllergyModal(false)}
        onSave={handleSaveNewAllergy}
      />
    </View>
  );
};

// Custom Add Allergy Modal Component
const AddAllergyModal = ({ isVisible, onClose, onSave }) => {
  const [allergyName, setAllergyName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (allergyName.trim() === "" || symptoms.trim() === "") {
      Alert.alert(
        "Missing Information",
        "Please enter both allergy name and symptoms."
      );
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      onSave({ name: allergyName.trim(), symptoms: symptoms.trim() });
      setAllergyName("");
      setSymptoms("");
      onClose();
    } catch (error) {
      console.error("Failed to save allergy:", error);
      Alert.alert("Error", "Could not save allergy. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={modalStyles.overlay}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Add New Allergy</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Ionicons
                name="close-circle-outline"
                size={30}
                color={COLORS.iconSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={modalStyles.modalScrollView}
          >
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Allergy Name</Text>
              <TextInput
                style={modalStyles.textInput}
                placeholder="e.g., Peanuts, Penicillin"
                placeholderTextColor={COLORS.textPlaceholder}
                value={allergyName}
                onChangeText={setAllergyName}
              />
            </View>

            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Symptoms / Reactions</Text>
              <TextInput
                style={[modalStyles.textInput, modalStyles.multilineInput]}
                placeholder="e.g., Skin rash, difficulty breathing"
                placeholderTextColor={COLORS.textPlaceholder}
                multiline
                numberOfLines={4}
                value={symptoms}
                onChangeText={setSymptoms}
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={modalStyles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={modalStyles.saveButtonGradient}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={modalStyles.saveButtonText}>Save Allergy</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  // User Info Section
  userInfoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlign: "center", // Center name as per image
  },
  medicalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  medicalInfoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
    width: "30%", // Allocate space for label
  },
  medicalInfoValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1, // Take remaining space
    fontWeight: "normal",
  },
  // Allergies Section Title
  allergiesHeader: {
    marginBottom: 15,
    alignItems: "center", // Center align as per image
  },
  allergiesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary, // Primary color for main title
  },
  allergiesSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Allergy Card
  allergyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  allergyContent: {
    flexDirection: "row",
    alignItems: "flex-start", // Align icon to top of text
  },
  allergyIcon: {
    marginRight: 10,
    marginTop: 2, // Adjust vertical alignment with text
  },
  allergyTextContainer: {
    flex: 1,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  allergySymptoms: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 5,
  },
  allergyAddedInfo: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  noAllergiesContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  noAllergiesText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  // Add More Button
  addMoreButton: {
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
  addMoreButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addMoreButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 0 : 20,
    maxHeight: "80%",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  modalScrollView: {
    flexGrow: 0,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 20,
    marginBottom: Platform.OS === "ios" ? 20 : 0,
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

export default AllergiesScreen;
