// app/favorite/index.js (or app/favorite-screen.js)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  LayoutAnimation,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

const { width } = Dimensions.get("window");


const DUMMY_FAVORITE_DOCTORS = [
  {
    id: "ava_williams",
    tag: "Professional Doctor",
    name: "Dr. Ava Williams, M.D.",
    specialization: "Maternal-Fetal Medicine",
    profileImage:
      "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "daniel_rodriguez",
    tag: "Professional Doctor",
    name: "Dr. Daniel Rodriguez",
    specialization: "Interventional Cardiologist",
    profileImage:
      "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "emma_hall",
    tag: "Professional Doctor",
    name: "Dr. Emma Hall, M.D.",
    specialization: "General Doctor",
    profileImage:
      "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "james_taylor",
    tag: "Professional Doctor",
    name: "Dr. James Taylor, M.D.",
    specialization: "General Doctor",
    profileImage:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHw3OXx8ZmVtYWxlJTIwZG9jdG9yfGVufDB8fHx8MTcwNjU1ODAzM3ww&ixlib=rb-4.0.3&q=80&w=400", // Generic image, but name from image
  },
];

// Dummy Data for Favorite Services (matching image)
const DUMMY_FAVORITE_SERVICES = [
  {
    id: "cardiology",
    name: "Cardiology", // From image
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.", // From image
    icon: "heart-outline", // Example for consistent icon
    expanded: false,
  },
  {
    id: "dermatology",
    name: "Dermatology", // From image
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "heart-outline",
    expanded: false,
  },
  {
    id: "general_medicine",
    name: "General Medicine", // From image
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "heart-outline",
    expanded: false,
  },
  {
    id: "gynecology",
    name: "Gynecology", // From image
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "heart-outline",
    expanded: false,
  },
  {
    id: "odontology",
    name: "Odontology", // From image
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "heart-outline",
    expanded: false,
  },
  {
    id: "oncology",
    name: "Oncology", // From image
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 세포 유전.",
    icon: "heart-outline",
    expanded: false,
  },
];

const FavoriteScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("doctors"); // 'doctors' or 'services'
  const [sortType, setSortType] = useState("A-Z"); // Default sort
  const [favoriteServices, setFavoriteServices] = useState(
    DUMMY_FAVORITE_SERVICES
  ); // State for expandable services

  const handleInfoPress = (doctor) => {
    Alert.alert("Doctor Info", `View details for ${doctor.name}`);

  };

  const handleMakeAppointment = (doctor) => {
    Alert.alert("Appointment", `Make appointment with ${doctor.name}`);
  };

  const handleFilterPress = () => Alert.alert("Filter", "Open filter options.");

  const toggleServiceExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFavoriteServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id
          ? { ...service, expanded: !service.expanded }
          : service
      )
    );
  };

  const handleLookingDoctors = (serviceName) => {
    Alert.alert("Looking Doctors", `Find doctors for ${serviceName}`);
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
          <Text style={styles.headerTitle}>Favorite</Text>
          <View style={{ width: 28 }} />
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
        </View>
        {/* Doctors/Services Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "doctors" && styles.toggleButtonActive,
            ]}
            onPress={() => setActiveTab("doctors")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                activeTab === "doctors" && styles.toggleButtonTextActive,
              ]}
            >
              Doctors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "services" && styles.toggleButtonActive,
            ]}
            onPress={() => setActiveTab("services")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                activeTab === "services" && styles.toggleButtonTextActive,
              ]}
            >
              Services
            </Text>
          </TouchableOpacity>
        </View>
        {/* Conditional Rendering based on Active Tab */}
        {activeTab === "doctors" ? (
          // Doctors List
          <View style={styles.listSection}>
            {DUMMY_FAVORITE_DOCTORS.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                {/* Top row: Image, Text Content (Name, Tag, Spec), and Heart Icon */}
                <View style={styles.doctorInfoRow}>
                  <Image
                    source={{ uri: doctor.profileImage }}
                    style={styles.doctorImage}
                  />
                  <View style={styles.doctorDetailsAndHeart}>
                    {/* Name and Heart Icon on the same line */}
                    <View style={styles.nameAndHeartRow}>
                      <Text style={styles.doctorName}>{doctor.name}</Text>
                      <Ionicons name="heart" size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.professionalTag}>
                      <MaterialCommunityIcons
                        name="shield-star-outline"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Text style={styles.professionalTagText}>
                        {doctor.tag}
                      </Text>
                    </View>
                    <Text style={styles.doctorSpecialization}>
                      {doctor.specialization}
                    </Text>
                  </View>
                </View>
                {/* Bottom button: Make Appointment */}
                <TouchableOpacity
                  onPress={() => handleMakeAppointment(doctor)}
                  style={styles.makeAppointmentButton}
                >
                  <Text style={styles.makeAppointmentButtonText}>
                    Make Appointment
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.listSection}>
            {favoriteServices.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <TouchableOpacity
                  onPress={() => toggleServiceExpand(service.id)}
                  style={styles.serviceCardHeader}
                >
                  <View style={styles.serviceHeaderLeft}>
                    <Ionicons
                      name="heart"
                      size={24}
                      color={COLORS.primary}
                      style={styles.heartIcon}
                    />
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </View>
                  <Ionicons
                    name={service.expanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                {service.expanded && (
                  <View style={styles.serviceCardBody}>
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleLookingDoctors(service.name)}
                      style={styles.lookingDoctorsButton}
                    >
                      <Text style={styles.lookingDoctorsButtonText}>
                        Looking Doctors
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sortFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
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
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 30,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  toggleButtonTextActive: {
    color: COLORS.white,
  },
  listSection: {
    // This container simply holds the cards, no complex flex needed here
  },

  // --- Doctor Card Styles (FULLY REVISED to match Favorite Doc.png) ---
  doctorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 15,
    padding: 15, // Padding for the entire card content
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    // The main doctorCard is a column by default, no need for flexDirection: 'column' explicitly
  },
  doctorInfoRow: {
    flexDirection: "row",
    alignItems: "center", // Vertically align image and text content
    marginBottom: 15, // Space between info row and the button below
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: COLORS.separator,
    marginRight: 15, // Space between image and text content
    resizeMode: "cover",
  },
  doctorDetailsAndHeart: {
    flex: 1, // Allows this section to take up available space
    // flexDirection: 'column' is default, so text will stack
  },
  nameAndHeartRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Push name to left, heart to right
    alignItems: "center", // Vertically align name and heart
    marginBottom: 5, // Space between name/heart row and tag
  },
  doctorName: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    flexShrink: 1, // Allow name to shrink if needed, leaving space for heart
    marginRight: 10, // Space between name and heart
  },
  professionalTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGrey,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 5,
    alignSelf: "flex-start", // Ensures the tag only takes up as much width as its content
  },
  professionalTagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: 5,
  },
  doctorSpecialization: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flexWrap: "wrap", // Allow specialization to wrap if too long
  },
  makeAppointmentButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center", // Center text horizontally within button
    justifyContent: "center", // Center text vertically within button
    width: "100%", // Make button span full width of the card's content area
  },
  makeAppointmentButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "bold",
  },

  // --- Service Card Styles (Accordion - no changes needed here) ---
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  serviceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  serviceHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  serviceCardBody: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  serviceDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  lookingDoctorsButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  lookingDoctorsButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default FavoriteScreen;
