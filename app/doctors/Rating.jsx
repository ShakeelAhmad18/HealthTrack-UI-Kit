// app/doctor-rating.js (or app/rating/index.js if using expo-router)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/helper"; // Adjust path as needed

const { width } = Dimensions.get("window");

// Dummy Doctor Data (matching image and providing more examples)
const DUMMY_DOCTORS = [
  {
    id: "emma_hall",
    tag: "Professional Doctor", // From image
    name: "Dr. Emma Hall, M.D.",
    specialization: "General Doctor", // From image
    profileImage:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5, // From image
  },
  {
    id: "jacob_lopez",
    tag: "Professional Doctor", // From image
    name: "Dr. Jacob Lopez, M.D.",
    specialization: "Surgical Dermatology", // From image
    profileImage:
      "https://plus.unsplash.com/premium_photo-1681843004557-f3128f91aeb7?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
  },
  {
    id: "lucy_perez",
    tag: "Professional Doctor", // From image
    name: "Dr. Lucy Perez, Ph.D.",
    specialization: "Clinical Dermatology", // From image
    profileImage:
      "https://plus.unsplash.com/premium_photo-1681843004557-f3128f91aeb7?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
  },
  {
    id: "quinn_cooper",
    tag: "Professional Doctor", // From image
    name: "Dr. Quinn Cooper, M.D.",
    specialization: "Menopausal and Geriatric Gynecology", // From image
    profileImage:
      "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
  },
  {
    id: "benjamin_davis",
    tag: "Professional Doctor",
    name: "Dr. Benjamin Davis",
    specialization: "Retinal Specialist",
    profileImage:
      "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
  },
  {
    id: "hannah_lewis",
    tag: "Professional Doctor",
    name: "Dr. Hannah Lewis, M.D.",
    specialization: "Dermatopathology",
    profileImage:
      "https://plus.unsplash.com/premium_photo-1681843004557-f3128f91aeb7?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
  },
];

const DoctorRatingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("A-Z"); // Default sort
  const router=useRouter();
  const handleFilterPress = () => Alert.alert("Filter", "Open filter options.");
  const handleTopRatingPress = () => {
    // In a real app, this would sort by rating. For now, it's a visual cue.
    Alert.alert("Top Rating", "Showing doctors by top rating.");
  };

  const filteredAndSortedDoctors = DUMMY_DOCTORS.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortType === "A-Z") {
      return a.name.localeCompare(b.name);
    }
    return 0; 
  });

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
          <Text style={styles.headerTitle}>Rating</Text>
          <View style={{ width: 28 }} /> 
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
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
          />
        </View>
      </LinearGradient>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Sort and Filter Section */}
        <View style={styles.sortFilterContainer}>
          <Text style={styles.sortByText}>Sort By</Text>
          <TouchableOpacity
            onPress={() => setSortType("A-Z")}
            style={[
              styles.sortButton,
              sortType === "A-Z" && styles.sortButtonActive,
            ]}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortType === "A-Z" && styles.sortButtonTextActive,
              ]}
            >
              A-Z
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFilterPress}
            style={styles.filterButton}
          >
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleTopRatingPress}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>Top Rating</Text>
          </TouchableOpacity>
        </View>
        {/* Doctor List */}
        {filteredAndSortedDoctors.map((doctor) => (
          <View key={doctor.id} style={styles.doctorCard}>
            {/* Left Section of Card: Professional Tag, Image, Name, Specialization */}
            <View style={styles.doctorInfoLeft}>
              <View style={styles.professionalTag}>
                <MaterialCommunityIcons
                  name="shield-star-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.professionalTagText}>{doctor.tag}</Text>
              </View>
              <Image
                source={{ uri: doctor.profileImage }}
                style={styles.doctorImage}
              />
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialization}>
                {doctor.specialization}
              </Text>
            </View>
            {/* Right Section of Card: Info Button, Rating, Action Icons */}
            <View style={styles.doctorInfoRight}>
              <TouchableOpacity
                onPress={() => router.push(`doctors/${doctor.id}`)}
                style={styles.infoButton}
              >
                <Text style={styles.infoButtonText}>Info</Text>
              </TouchableOpacity>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons
                  name="star"
                  size={18}
                  color={COLORS.warning}
                />
                <Text style={styles.ratingNumber}>{doctor.rating}</Text>
              </View>
              <View style={styles.actionIcons}>
                <TouchableOpacity
                  style={styles.actionIcon}
                >
                  <FontAwesome
                    name="calendar"
                    size={18}
                    color={COLORS.iconSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionIcon}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={COLORS.iconSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionIcon}
                >
                  <Ionicons
                    name="heart-outline"
                    size={18}
                    color={COLORS.iconSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 30,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 12 : 8, // Adjust for platform consistency
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sortFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 5, // Small padding to align with cards
  },
  sortByText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginRight: 10,
  },
  sortButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortButtonText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  sortButtonTextActive: {
    color: COLORS.white,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  seeAllButton: {
    marginLeft: "auto", // Pushes to the right
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  doctorCard: {
    flexDirection: "row", // Arrange children (left and right info) in a row
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    alignItems: "flex-start", // Align items to the top of the card
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorInfoLeft: {
    // This now correctly wraps the professional tag, image, and text
    flex: 2, // Give more space to the left content
    marginRight: 15, // Space between left and right sections
  },
  professionalTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGrey,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 10, // Space below the tag before the image
    alignSelf: "flex-start", // Keeps the tag aligned to the left within doctorInfoLeft
  },
  professionalTagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: 5,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.separator,
    marginBottom: 10, // Space below image before name
    resizeMode: "cover",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  doctorInfoRight: {
    flex: 1, // Give adequate space to the right content
    justifyContent: "space-between", // Distribute children vertically within this column
    alignItems: "flex-end", // Align children to the right
    // No fixed height needed if content dictates size and justifyContent is used
    paddingVertical: 5, // Small padding for vertical alignment within the card
  },
  infoButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    // No marginBottom here, as justifyContent takes care of spacing
  },
  infoButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10, // Space above rating from info button
    marginBottom: 10, // Space below rating before action icons
  },
  ratingNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: 5,
  },
  actionIcons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 5, // Small space above action icons from rating
  },
  actionIcon: {
    padding: 4, // Smaller padding for tighter icons
  },
});

export default DoctorRatingScreen;
