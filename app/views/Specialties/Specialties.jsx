import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { COLORS } from "../../../constants/helper";

const { width } = Dimensions.get("window");

const ALL_SPECIALTIES = [
  {
    id: "s1",
    name: "Cardiology",
    icon: "heart-pulse",
    path: "views/Specialties/Cardiology",
  },
  {
    id: "s2",
    name: "Dermatology",
    icon: "hair-dryer",
    path: "views/Specialties/Dermatology",
  },
  {
    id: "s3",
    name: "General Medicine",
    icon: "stethoscope",
    path: "views/Specialties/GeneralMedicine",
  },
  {
    id: "s4",
    name: "Gynecology",
    icon: "gender-female",
    path: "views/Specialties/Gynecology",
  },
  {
    id: "s5",
    name: "Odontology",
    icon: "tooth-outline",
    path: "views/Specialties/Odontology",
  },
  {
    id: "s6",
    name: "Oncology",
    icon: "dna",
    path: "views/Specialties/Oncology",
  },
  {
    id: "s7",
    name: "Ophthalmology",
    icon: "eye-outline",
    path: "views/Specialties/Ophthalmology",
  },
  {
    id: "s8",
    name: "Orthopedics",
    icon: "bone",
    path: "views/Specialties/Orthopedics",
  },
  {
    id: "s9",
    name: "Pediatrics",
    icon: "baby-face-outline",
    path: "views/Specialties/Pediatrics",
  },
  {
    id: "s10",
    name: "Neurology",
    icon: "brain",
    path: "views/Specialties/Neurology",
  },
];

const SpecialtiesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("A-Z");
  const [activeTab, setActiveTab] = useState("Specialties");
  const [displayedSpecialties, setDisplayedSpecialties] = useState([]);

  useEffect(() => {
    let filtered = ALL_SPECIALTIES.filter((specialty) =>
      specialty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortOption === "A-Z") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Z-A") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setDisplayedSpecialties(filtered);
  }, [searchQuery, sortOption]);

  const handleFilterPress = () => {
    Alert.alert("Filter Options", "Implement advanced filtering logic here.");
  };

  const handleSpecialtyPress = (specialtyName) => {
    router.push(`${specialtyName}`);
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
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Specialties</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <Text style={styles.subtitle}>Find Your Doctor</Text>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textPlaceholder}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={COLORS.textPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && Platform.OS === "android" && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearSearchButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.sortByText}>Sort By</Text>
          <TouchableOpacity
            style={[
              styles.sortFilterButton,
              sortOption === "A-Z" && styles.activeSortFilterButton,
            ]}
            onPress={() => setSortOption("A-Z")}
          >
            <Text
              style={[
                styles.sortFilterButtonText,
                sortOption === "A-Z" && styles.activeSortFilterButtonText,
              ]}
            >
              A-Z
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortFilterButton}
            onPress={handleFilterPress}
          >
            <Text style={styles.sortFilterButtonText}>Filter</Text>
            <Ionicons
              name="filter"
              size={16}
              color={COLORS.primary}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.specialtiesGridContainer,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        <View style={styles.specialtiesGrid}>
          {displayedSpecialties.length > 0 ? (
            displayedSpecialties.map((specialty) => (
              <TouchableOpacity
                key={specialty.id}
                style={styles.specialtyCard}
                onPress={() => handleSpecialtyPress(specialty.path)}
              >
                <MaterialCommunityIcons
                  name={specialty.icon}
                  size={45}
                  color={COLORS.white}
                />
                <Text style={styles.specialtyText}>{specialty.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons
                name="medical-outline"
                size={60}
                color={COLORS.textSecondary}
                style={{ opacity: 0.6 }}
              />
              <Text style={styles.noResultsText}>No Specialties Found</Text>
              <Text style={styles.noResultsSubText}>
                Try a different search term or filter.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Gradient Header Styles
  headerGradient: {
    paddingBottom: 20, // Adjust as needed to fit content + search/sort
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
    paddingVertical: 10, // Adjust padding inside gradient
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white, // Text color for header title
    flex: 1,
    textAlign: "center",
  },
  headerRightPlaceholder: {
    width: 28 + 10, // Match back button size + padding to balance title
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white, // Text color for subtitle
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  // Search Bar (moved inside gradient for visual consistency)
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearSearchButton: {
    padding: 5,
  },
  // Sort & Filter Options (moved inside gradient for visual consistency)
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20, // Keep some space at the bottom of the gradient
    justifyContent: "flex-start",
    gap: 10,
  },
  sortByText: {
    fontSize: 14,
    color: COLORS.white, // Text color for "Sort By"
    marginRight: 5,
  },
  sortFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.white, // Border color when not active
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeSortFilterButton: {
    backgroundColor: COLORS.white, // Active button background (can be primary if desired)
    borderColor: COLORS.white,
    shadowColor: COLORS.white,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  sortFilterButtonText: {
    fontSize: 14,
    color: COLORS.primary, // Text color when not active
    fontWeight: "600",
  },
  activeSortFilterButtonText: {
    color: COLORS.primary, // Text color when active
  },
  filterIcon: {
    marginLeft: 5,
  },
  // Specialties Grid (remains outside gradient)
  specialtiesGridContainer: {
    paddingHorizontal: 20,
    paddingTop: 20, // Add padding top as content starts below gradient
    paddingBottom: 20,
  },
  specialtiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  specialtyCard: {
    width: (width - 40 - 15) / 2,
    height: width * 0.4,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
  specialtyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    marginTop: 10,
    textAlign: "center",
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    marginTop: 30,
    width: "100%",
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginTop: 15,
  },
  noResultsSubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.7,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default SpecialtiesScreen;
