// app/neurology-doctors.js (or app/doctors/neurology.js if using static routes)

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
// No LinearGradient import needed for this screen
import { COLORS } from "../../constants/helper"; // Adjust path

const { width } = Dimensions.get("window");

// Dummy Data for Neurology Doctors
const ALL_NEUROLOGY_DOCTORS = [
  {
    id: "neuro1",
    name: "Dr. Robert Lewis, M.D.",
    specialization: "General Neurology",
    profileImage:
      "https://images.unsplash.com/photo-1559839734-2b716b178d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHwxNXx8ZG9jdG9yfGVufDB8fHx8MTcwNjU1NjY4N3ww&ixlib=rb-4.0.3&q=80&w=400",
    rating: 4.8,
    availability: "Mon, Wed, Fri",
    experience: "18 years",
  },
  {
    id: "neuro2",
    name: "Dr. Stephanie Wong, M.D.",
    specialization: "Epilepsy Specialist",
    profileImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHwyMHx8ZG9jdG9yfGVufDB8fHx8MTcwNjU1NjY4N3ww&ixlib=rb-4.0.3&q=80&w=400",
    rating: 4.9,
    availability: "Tue, Thu",
    experience: "15 years",
  },
  {
    id: "neuro3",
    name: "Dr. Kevin Chen, M.D.",
    specialization: "Stroke Neurology",
    profileImage:
      "https://images.unsplash.com/photo-1579684385135-adcd4b847683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHwyMnx8ZG9jdG9yfGVufDB8fHx8MTcwNjU1NjY4N3ww&ixlib=rb-4.0.3&q=80&w=400",
    rating: 4.7,
    availability: "Mon-Fri",
    experience: "12 years",
  },
  {
    id: "neuro4",
    name: "Dr. Lisa Davis, M.D.",
    specialization: "Movement Disorders",
    profileImage:
      "https://images.unsplash.com/photo-1537368910025-72d530165686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHwzMXx8ZG9jdG9yfGVufDB8fHx8MTcwNjU1NjY4N3ww&ixlib=rb-4.0.3&q=80&w=400",
    rating: 4.6,
    availability: "Wed, Fri",
    experience: "10 years",
  },
  {
    id: "neuro5",
    name: "Dr. Sam Wilson, M.D.",
    specialization: "Neuro-Oncology",
    profileImage:
      "https://images.unsplash.com/photo-1550831107-15537533894a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHw0OXx8ZG9jdG9yfGVufDB8fHx8MTcwNjU1NzUzMHww&ixlib=rb-4.0.3&q=80&w=400",
    rating: 4.8,
    availability: "Mon, Tue, Thu",
    experience: "17 years",
  },
];

const NeurologyDoctorsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const router=useRouter();
  const specialtyTitle = "Neurology";

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("A-Z");
  const [displayedDoctors, setDisplayedDoctors] = useState([]);

  useEffect(() => {
    let filtered = ALL_NEUROLOGY_DOCTORS.filter(
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
    router.push("doctors/Filters");
  };

  const handleDoctorInfoPress = (doctor) => {
    Alert.alert("Doctor Info", `Showing details for ${doctor.name}`);
  };

  const handleSchedulePress = (doctor) => {
    Alert.alert("Schedule Appointment", `Book appointment with ${doctor.name}`);
  };

  const handleQuestionPress = (doctor) => {
    Alert.alert("Ask Question", `Open chat with ${doctor.name}`);
  };

  const handleFavoritePress = (doctor) => {
    Alert.alert("Favorite", `Toggling favorite for ${doctor.name}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Custom Header (Solid Background) */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.iconPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{specialtyTitle}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>
      {/* Find Your Doctor Subtitle */}
      <Text style={styles.subtitle}>Find Your Doctor</Text>
      {/* Search Bar (Solid White Background) */}
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
      {/* Doctors List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.doctorsListContainer,
          { paddingBottom: insets.bottom + 80 }, 
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
            {/* Using a brain icon for Neurology */}
            <MaterialCommunityIcons
              name="brain"
              size={60}
              color={COLORS.textSecondary}
              style={{ opacity: 0.6 }}
            />
            <Text style={styles.noResultsText}>No Neurology Doctors Found</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.background, // Solid background
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary, // Dark text on solid background
    flex: 1,
    textAlign: "center",
  },
  headerRightPlaceholder: {
    width: 28 + 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  // Search Bar (Solid White Background - Consistent with initial designs)
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white, // Solid white background
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
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: "flex-start",
    gap: 10,
  },
  sortByText: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeSortFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  sortFilterButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  activeSortFilterButtonText: {
    color: COLORS.white,
  },
  filterIcon: {
    marginLeft: 5,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: "auto",
  },
  doctorsListContainer: {
    paddingHorizontal: 20,
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

export default NeurologyDoctorsScreen;
