// app/doctors.js (main doctors listing screen)

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
  FlatList,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { COLORS } from "../../constants/helper"; // Adjust path as needed

const { width } = Dimensions.get("window");

// Dummy Data for All Doctors (Combined from previous specialties)
const ALL_DOCTORS_DATA = [
  {
    id: "cardio1",
    name: "Dr. Daniel Rodriguez",
    specialization: "Interventional Cardiologist",
    category: "Cardiology",
    profileImage:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
  },
  {
    id: "derm1",
    name: "Dr. Hannah Lewis, M.D.",
    specialization: "Dermatopathology",
    category: "Dermatology",
    profileImage:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
  },
  {
    id: "gyn1",
    name: "Dr. Ava Williams, M.D.",
    specialization: "Maternal-Fetal Medicine",
    category: "Gynecology",
    profileImage:
      "https://plus.unsplash.com/premium_photo-1681843004557-f3128f91aeb7?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
  },
  {
    id: "onto1",
    name: "Dr. John Doe",
    specialization: "General Dentistry",
    category: "Odontology",
    profileImage:
      "https://plus.unsplash.com/premium_photo-1681843004557-f3128f91aeb7?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
  },
  {
    id: "onc1",
    name: "Dr. Michael Green, M.D.",
    specialization: "Medical Oncology",
    category: "Oncology",
    profileImage:
      "https://plus.unsplash.com/premium_photo-1681967035389-84aabd80cb1e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
  },
  {
    id: "opth1",
    name: "Dr. Anna Rodriguez, M.D.",
    specialization: "General Ophthalmology",
    category: "Ophthalmology",
    profileImage:
      "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
  },
  {
    id: "ortho1",
    name: "Dr. William Turner, M.D.",
    specialization: "General Orthopedics",
    category: "Orthopedics",
    profileImage:
      "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
  },
  {
    id: "ped1",
    name: "Dr. Chloe Anderson, M.D.",
    specialization: "General Pediatrics",
    category: "Pediatrics",
    profileImage:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
  },
  {
    id: "neuro1",
    name: "Dr. Robert Lewis, M.D.",
    specialization: "General Neurology",
    category: "Neurology",
    profileImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
  },
  {
    id: "gyn2",
    name: "Dr. Chloe Green, M.D.",
    specialization: "Obstetrics and Gynecology (OB/GYN)",
    category: "Gynecology",
    profileImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
  },
  {
    id: "opth2",
    name: "Dr. Benjamin Davis",
    specialization: "Retinal Specialist",
    category: "Ophthalmology",
    profileImage:
      "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
  },
  {
    id: "gyn3",
    name: "Dr. Daniel Lee, Ph.D.",
    specialization: "Gynecologic Oncology",
    category: "Gynecology",
    profileImage:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
  },
  {
    id: "cardio2",
    name: "Dr. Jessica Ramirez",
    specialization: "Electrophysiologist",
    category: "Cardiology",
    profileImage:
      "https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
  },
  {
    id: "onto2",
    name: "Dr. Alexander Bennett",
    specialization: "Orthodontist",
    category: "Odontology",
    profileImage:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
  },
  {
    id: "derm2",
    name: "Dr. Jacob Lopez, M.D.",
    specialization: "Surgical Dermatology",
    category: "Dermatology",
    profileImage:
      "https://plus.unsplash.com/premium_photo-1681966826227-d008a1cfe9c7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
  },
  {
    id: "gyn4",
    name: "Dr. Quinn Cooper, M.D.",
    specialization: "Menopausal and Geriatric",
    category: "Gynecology",
    profileImage:
      "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
  },
];

// Corrected Specialty Categories with valid MaterialCommunityIcons names
const SPECIALTY_CATEGORIES = [
  { id: "all", name: "All", icon: "medical-bag" },
  { id: "Cardiology", name: "Cardiology", icon: "heart-pulse" },
  { id: "Dermatology", name: "Dermatology", icon: "face-mask" }, // Changed from hair-dryer for clarity
  { id: "General Medicine", name: "General Medicine", icon: "stethoscope" },
  { id: "Gynecology", name: "Gynecology", icon: "face-woman" }, // Changed from 'reproductive'
  { id: "Odontology", name: "Odontology", icon: "tooth-outline" },
  { id: "Ophthalmology", name: "Ophthalmology", icon: "eye-outline" },
  { id: "Orthopedics", name: "Orthopedics", icon: "bone" }, // Changed from 'bone-outline'
  { id: "Pediatrics", name: "Pediatrics", icon: "baby-face-outline" },
  { id: "Neurology", name: "Neurology", icon: "brain" },
];

const DoctorsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router=useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("A-Z");
  const [displayedDoctors, setDisplayedDoctors] = useState([]);

  useEffect(() => {
    let filtered = ALL_DOCTORS_DATA;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (doctor) => doctor.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialization
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortOption === "A-Z") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Top Rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setDisplayedDoctors(filtered);
  }, [searchQuery, selectedCategory, sortOption]);

  const handleFilterPress = () => {
    Alert.alert("Filter Options", "Advanced filtering coming soon!");
  };

  const handleDoctorInfoPress = (doctor) => {
    Alert.alert("Doctor Info", `Showing details for ${doctor.name}`);
  };

  const handleSchedulePress = (doctor) => {
    Alert.alert("Schedule Appointment", `Book appointment with ${doctor.name}`);
    // navigation.navigate('BookingScreen', { doctorId: doctor.id, doctorName: doctor.name });
  };

  const handleQuestionPress = (doctor) => {
    Alert.alert("Ask Question", `Open chat with ${doctor.name}`);
    // navigation.navigate('ChatWithDoctor', { doctorId: doctor.id, doctorName: doctor.name });
  };

  const handleFavoritePress = (doctor) => {
    Alert.alert("Favorite", `Toggling favorite for ${doctor.name}`);
    // Implement favorite/unfavorite logic
  };

  const renderSpecialtyCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.specialtyCategoryButton,
        selectedCategory === item.id && styles.activeSpecialtyCategoryButton,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <MaterialCommunityIcons
        name={item.icon}
        size={30}
        color={selectedCategory === item.id ? COLORS.white : COLORS.iconPrimary}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Linear Gradient spanning Header and Search Section */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        {/* Header content */}
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctors</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        {/* Find Your Doctor Subtitle */}
        <Text style={styles.gradientSubtitle}>Find Your Doctor</Text>
        {/* Search Bar - styled for gradient background */}
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.primary}
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
      </LinearGradient>
      <View style={styles.specialtiesSection}>
        <FlatList
          data={SPECIALTY_CATEGORIES}
          renderItem={renderSpecialtyCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.specialtyCategoriesList}
        />
        <TouchableOpacity
          onPress={() => router.push("Specialties/Specialties")}
        >
          <Text style={styles.seeAllTextSmall}>See all</Text>
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.sortFilterButton}>
          <Text style={styles.sortFilterButtonText}>Filter</Text>
          <Ionicons
            name="filter"
            size={16}
            color={COLORS.primary}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortFilterButton,
            sortOption === "Top Rating" && styles.activeSortFilterButton,
          ]}
          onPress={() => router.push("doctors/Rating")}
        >
          <Text
            style={[
              styles.sortFilterButtonText,
              sortOption === "Top Rating" && styles.activeSortFilterButtonText,
            ]}
          >
            Top Rating
          </Text>
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
              onPress={() => router.push(`doctors/${doctor.id}`)}
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
                    onPress={() => router.push(`doctors/${doctor.id}`)}
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
            <MaterialCommunityIcons
              name="doctor"
              size={60}
              color={COLORS.textSecondary}
              style={{ opacity: 0.6 }}
            />
            <Text style={styles.noResultsText}>No Doctors Found</Text>
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
  // New: Gradient Container for Header and Search
  gradientContainer: {
    paddingBottom: 20, // Add padding at the bottom for the search bar
  },
  // Header content within the gradient
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white, // Text color should be white on gradient
    flex: 1,
    textAlign: "center",
  },
  headerRightPlaceholder: {
    width: 28 + 10,
  },
  // Subtitle within the gradient
  gradientSubtitle: {
    fontSize: 16,
    color: COLORS.white, // Subtitle color should also be white
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  // Search Bar (within gradient, so different styling)
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white, // Search bar itself is white
    borderRadius: 15,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
    color: COLORS.primary, // Icon color remains primary for consistency
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearSearchButton: {
    padding: 5,
  },
  // Horizontal Specialty Categories Section
  specialtiesSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingVertical: 15, // Added vertical padding for spacing
    marginBottom: 5, // Reduce margin to bring closer to sort options
    backgroundColor: COLORS.background, // Match screen background for this section
    borderBottomWidth: StyleSheet.hairlineWidth, // Small separator line
    borderBottomColor: COLORS.border,
  },
  specialtyCategoriesList: {
    alignItems: "center",
    paddingRight: 10,
  },
  specialtyCategoryButton: {
    width: 60, // Slightly smaller for more fit in view
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeSpecialtyCategoryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  seeAllTextSmall: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
    paddingRight: 20,
  },
  // Sort & Filter Options
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 15, // Give some space from categories
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
  // Doctors List Specific Styles (Consistent)
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

export default DoctorsScreen;
