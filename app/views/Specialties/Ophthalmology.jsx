// app/ophthalmology-doctors.js (or app/doctors/ophthalmology.js if using static routes)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  Alert,
  Platform,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { COLORS } from "../../../constants/helper"; // Adjust path

const { width } = Dimensions.get("window");

// Dummy Data for Ophthalmology Doctors
const ALL_OPHTHALMOLOGY_DOCTORS = [
  {
    id: "opth1",
    name: "Dr. Anna Rodriguez, M.D.",
    specialization: "General Ophthalmology",
    profileImage:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    availability: "Mon, Wed, Fri",
    experience: "12 years",
  },
  {
    id: "opth2",
    name: "Dr. Ben Carter, M.D.",
    specialization: "Retina Specialist",
    profileImage:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    availability: "Tue, Thu",
    experience: "18 years",
  },
  {
    id: "opth3",
    name: "Dr. Sophie Kim, M.D.",
    specialization: "Cataract Surgery",
    profileImage:
      "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    availability: "Mon-Fri",
    experience: "10 years",
  },
  {
    id: "opth4",
    name: "Dr. Liam Parker, M.D.",
    specialization: "Glaucoma Specialist",
    profileImage:
      "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    availability: "Wed, Fri, Sat",
    experience: "14 years",
  },
  {
    id: "opth5",
    name: "Dr. Chloe Davis, M.D.",
    specialization: "Pediatric Ophthalmology",
    profileImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHwyMHx8ZG9jdG9yfGVufDB8fHx8MTcwNjU1NjY4N3ww&ixlib=rb-4.0.3&q=80&w=400",
    rating: 4.9,
    availability: "Mon, Tue, Thu",
    experience: "7 years",
  },
];

const OphthalmologyDoctorsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const router = useRouter();
  const specialtyTitle = "Ophthalmology";

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("A-Z");
  const [displayedDoctors, setDisplayedDoctors] = useState([]);

  useEffect(() => {
    let filtered = ALL_OPHTHALMOLOGY_DOCTORS.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOption === "A-Z") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Z-A") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setDisplayedDoctors(filtered);
  }, [searchQuery, sortOption]);

  const handleFilterPress = () => {
    router.push("views/doctors/Filters");
  };

  const handleDoctorInfoPress = (doctor) => {
    router.push({
      pathname: "views/doctors/DoctorProfile",
      params: doctor.id,
    });
  };

  const handleSchedulePress = (doctor) => {
    router.push("views/doctors/DoctorProfile");
  };

  const handleQuestionPress = (doctor) => {
    router.push({
      pathname: "views/chat/ChatDetail",
      params: {
        chatPartnerName: doctor.name,
        chatPartnerImage: doctor.profileImage,
      },
    });
  };

  const handleFavoritePress = (doctor) => {
   
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
          <Text style={styles.headerTitle}>{specialtyTitle}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Find Your Doctor Subtitle */}
        <Text style={styles.subtitle}>Find Your Doctor</Text>

        {/* Search Bar */}
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

        {/* Sort & Filter Options */}
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
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "See All",
                "See all available doctors (e.g., reset filters)."
              )
            }
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Doctors List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.doctorsListContainer,
          { paddingBottom: insets.bottom + 80 }, // Ensure space for bottom navigation
        ]}
      >
        {displayedDoctors.length > 0 ? (
          displayedDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.doctorCard}
              onPress={() => handleDoctorInfoPress(doctor)}
            >
              <Image
                source={{ uri: doctor.profileImage }}
                style={styles.doctorImage}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialization}>
                  {doctor.specialization}
                </Text>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => handleDoctorInfoPress(doctor)}
                  >
                    <Text style={styles.infoButtonText}>Info</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSchedulePress(doctor)}
                  >
                    <FontAwesome
                      name="calendar"
                      size={20}
                      color={COLORS.iconSecondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleQuestionPress(doctor)}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={20}
                      color={COLORS.iconSecondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleFavoritePress(doctor)}
                  >
                    <Ionicons
                      name="heart-outline"
                      size={20}
                      color={COLORS.error}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            {/* Using eye-related icon from MaterialCommunityIcons */}
            <MaterialCommunityIcons
              name="eye-outline"
              size={60}
              color={COLORS.textSecondary}
              style={{ opacity: 0.6 }}
            />
            <Text style={styles.noResultsText}>
              No Ophthalmology Doctors Found
            </Text>
            <Text style={styles.noResultsSubText}>
              Try a different search term or filter.
            </Text>
          </View>
        )}
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
    paddingBottom: 20, // Adjust as needed to fit all content
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
    paddingBottom: 10, // Space between title and subtitle
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
    width: 28 + 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white, // Text color for subtitle
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  // Search Bar (now inside gradient)
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
  // Sort & Filter Options (now inside gradient)
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
  seeAllText: {
    fontSize: 14,
    color: COLORS.white, // Text color for "See all"
    fontWeight: "600",
    marginLeft: "auto", // Pushes "See all" to the far right
  },
  // Doctors List Specific Styles (remains outside gradient)
  doctorsListContainer: {
    paddingHorizontal: 20,
    paddingTop: 20, // Add padding top as content starts below gradient
    paddingBottom: 20,
  },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  infoButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
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

export default OphthalmologyDoctorsScreen;
