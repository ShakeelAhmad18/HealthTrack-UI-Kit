// app/filters/index.js (or app/filter-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions, // For responsive specialty icons
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider"; // For Age slider
import { COLORS } from "../../constants/helper"; // Adjust path as needed

const { width } = Dimensions.get("window");

// Dummy Specialty Icons Data
const DUMMY_SPECIALTIES = [
  { id: "gyn", name: "Gynecology", icon: "human-male-female" },
  { id: "gastro", name: "Gastroenterology", icon: "stomach" },
  { id: "cardio", name: "Cardiology", icon: "heart-pulse" },
  { id: "derma", name: "Dermatology", icon: "face-woman-outline" },
  { id: "ped", name: "Pediatrics", icon: "baby-face-outline" },
  { id: "neuro", name: "Neurology", icon: "brain" },
];

const FilterScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State for filter options
  const [availabilityToday, setAvailabilityToday] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null); // 'Male', 'Female', or null
  const [selectedRating, setSelectedRating] = useState(0); // 0 to 5 stars
  const [selectedExperience, setSelectedExperience] = useState(null); // e.g., '1-5', '6-9', '10>' or null
  const [selectedSpecialties, setSelectedSpecialties] = useState([]); // Array of selected specialty IDs
  const [ageRange, setAgeRange] = useState([20, 80]); // Min and Max age from slider

  // Initial state for resetting filters
  const initialFilterState = {
    availabilityToday: false,
    selectedGender: null,
    selectedRating: 0,
    selectedExperience: null,
    selectedSpecialties: [],
    ageRange: [20, 80],
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleResetFilters = () => {
    setAvailabilityToday(initialFilterState.availabilityToday);
    setSelectedGender(initialFilterState.selectedGender);
    setSelectedRating(initialFilterState.selectedRating);
    setSelectedExperience(initialFilterState.selectedExperience);
    setSelectedSpecialties(initialFilterState.selectedSpecialties);
    setAgeRange(initialFilterState.ageRange);
    Alert.alert("Filters Reset", "All filters have been reset to default.");
  };

  const handleApplyFilters = () => {
    const filters = {
      availabilityToday,
      selectedGender,
      selectedRating,
      selectedExperience,
      selectedSpecialties,
      ageRange,
    };
    Alert.alert("Filters Applied", JSON.stringify(filters, null, 2));
    // In a real app, you would pass these filters back to the previous screen
    // or dispatch an action to fetch data based on these filters.
    navigation.goBack(); // Go back after applying filters
  };

  const toggleSpecialty = (id) => {
    setSelectedSpecialties((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
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
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Availability Today */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Availability Today</Text>
          <Switch
            trackColor={{ false: COLORS.mediumGrey, true: COLORS.primary }}
            thumbColor={COLORS.white}
            ios_backgroundColor={COLORS.mediumGrey}
            onValueChange={setAvailabilityToday}
            value={availabilityToday}
            style={styles.switch}
          />
        </View>

        {/* Gender Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Gender</Text>
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
                  selectedGender === "Female" && styles.genderButtonTextActive,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Rated Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Top Rated</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setSelectedRating(star)}
              >
                <Ionicons
                  name={selectedRating >= star ? "star" : "star-outline"}
                  size={30}
                  color={
                    selectedRating >= star
                      ? COLORS.starYellow
                      : COLORS.iconSecondary
                  }
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Work Experience Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Work Experience (Years)</Text>
          <View style={styles.experienceButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.experienceButton,
                selectedExperience === "1-5" && styles.experienceButtonActive,
              ]}
              onPress={() => setSelectedExperience("1-5")}
            >
              <Text
                style={[
                  styles.experienceButtonText,
                  selectedExperience === "1-5" &&
                    styles.experienceButtonTextActive,
                ]}
              >
                1-5
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.experienceButton,
                selectedExperience === "6-9" && styles.experienceButtonActive,
              ]}
              onPress={() => setSelectedExperience("6-9")}
            >
              <Text
                style={[
                  styles.experienceButtonText,
                  selectedExperience === "6-9" &&
                    styles.experienceButtonTextActive,
                ]}
              >
                6-9
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.experienceButton,
                selectedExperience === "10>" && styles.experienceButtonActive,
              ]}
              onPress={() => setSelectedExperience("10>")}
            >
              <Text
                style={[
                  styles.experienceButtonText,
                  selectedExperience === "10>" &&
                    styles.experienceButtonTextActive,
                ]}
              >
                10 
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Specialty Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Specialty</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtyIconsContainer}
          >
            {DUMMY_SPECIALTIES.map((specialty) => (
              <TouchableOpacity
                key={specialty.id}
                style={[
                  styles.specialtyIconWrapper,
                  selectedSpecialties.includes(specialty.id) &&
                    styles.specialtyIconWrapperActive,
                ]}
                onPress={() => toggleSpecialty(specialty.id)}
              >
                <MaterialCommunityIcons
                  name={specialty.icon}
                  size={30}
                  color={
                    selectedSpecialties.includes(specialty.id)
                      ? COLORS.white
                      : COLORS.primary
                  }
                />
                <Text
                  style={[
                    styles.specialtyIconText,
                    selectedSpecialties.includes(specialty.id) &&
                      styles.specialtyIconTextActive,
                  ]}
                >
                  {specialty.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Age Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Age</Text>
          <Slider
            style={styles.ageSlider}
            minimumValue={20}
            maximumValue={80}
            step={1}
            value={ageRange[0]} // Using only the min for single slider, or could use two sliders for range
            onValueChange={(value) => setAgeRange([value, 80])} // For single slider to represent min age
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.separator}
            thumbTintColor={COLORS.primary}
          />
          <View style={styles.ageValueContainer}>
            <Text style={styles.ageValueText}>{ageRange[0]} Years</Text>
            {/* If you want a range, you'd need another slider or a custom component */}
            <Text style={styles.ageValueText}>80 Years</Text>
          </View>
        </View>

        {/* Apply Filters Button */}
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilters}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.applyButtonGradient}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
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
  resetText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSection: {
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
  // Availability Switch
  switch: {
    alignSelf: "flex-start", // Align switch to left
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
  // Top Rated Stars
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%", // Adjust width to center stars
    alignSelf: "center",
    marginBottom: 10,
  },
  starIcon: {
    paddingHorizontal: 5,
  },
  // Work Experience Buttons
  experienceButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  experienceButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: COLORS.background,
  },
  experienceButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  experienceButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  experienceButtonTextActive: {
    color: COLORS.white,
  },
  // Specialty Icons
  specialtyIconsContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  specialtyIconWrapper: {
    width: width * 0.22, // Roughly 4 icons per row on most screens
    aspectRatio: 1, // Make it square
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightBackground,
    borderRadius: 15,
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  specialtyIconWrapperActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  specialtyIconText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 5,
    textAlign: "center",
  },
  specialtyIconTextActive: {
    color: COLORS.white,
  },
  // Age Slider
  ageSlider: {
    width: "100%",
    height: 40,
  },
  ageValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -10, // Pull up slightly to align with slider
    paddingHorizontal: 5,
  },
  ageValueText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  // Apply Button
  applyButton: {
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
  applyButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default FilterScreen;
