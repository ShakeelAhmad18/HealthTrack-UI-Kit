// app/doctor-info.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
import { useNavigation, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

const { width } = Dimensions.get("window");

const DUMMY_DOCTOR_DATA = {
  id: "jacob_lopez",
  name: "Dr. Jacob Lopez, M.D.",
  specialization: "Surgical Dermatology",
  profileImage:
    "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example image URL
  rating: 5, // As shown by 5 stars in image
  reviews: 40, // As shown in image
  experience: "15 years experience", // From image tag
  availability: "Mon-Sat / 9:00AM - 5:00PM", // From image tag
  focus:
    "The impact of hormonal imbalances on skin conditions, specializing in acne, hirsutism, and other skin disorders.",
  profile:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  careerPath:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  highlights:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};

const DoctorInfoScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams(); // If using dynamic routes, get ID from params

  // In a real app, you would fetch doctor data based on params.id
  const doctor = DUMMY_DOCTOR_DATA; // For now, use dummy data directly

  if (!doctor) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Doctor not found or loading...</Text>
      </View>
    );
  }

  const handleSchedulePress = () =>
    Alert.alert("Schedule", "Redirect to scheduling screen.");
  const handleCallPress = () =>
    Alert.alert("Call Doctor", "Initiate call to doctor.");
  const handleVideoCallPress = () =>
    Alert.alert("Video Call", "Initiate video call with doctor.");
  const handleChatPress = () => Alert.alert("Chat", "Open chat with doctor.");
  const handleQuestionPress = () => Alert.alert("Help", "Get help or FAQs.");
  const handleFavoritePress = () =>
    Alert.alert("Favorite", "Toggle favorite status.");

  return (
    <View style={styles.container}>
      {/* Gradient Header - Now also contains the 'Information' heading and info tags */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          {/* Left Icon: Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIconWrapper}
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          {/* Center Action Icons */}
          <View style={styles.headerActionIcons}>
            <TouchableOpacity
              onPress={handleSchedulePress}
              style={styles.headerIconWrapper}
            >
              <FontAwesome name="calendar" size={16} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCallPress}
              style={styles.headerIconWrapper}
            >
              <Ionicons name="call" size={16} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleVideoCallPress}
              style={styles.headerIconWrapper}
            >
              <Ionicons name="videocam" size={16} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleChatPress}
              style={styles.headerIconWrapper}
            >
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
          {/* Right Icons: Help and Favorite */}
          <View style={styles.headerRightIcons}>
            <TouchableOpacity
              onPress={handleQuestionPress}
              style={styles.headerIconWrapper}
            >
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFavoritePress}
              style={styles.headerIconWrapper}
            >
              <Ionicons name="heart-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Doctor Profile Section */}
        <View style={styles.doctorProfileSection}>
          <Image
            source={{ uri: doctor.profileImage }}
            style={styles.doctorProfileImage}
          />
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialization}>
            {doctor.specialization}
          </Text>
          <View style={styles.ratingReviews}>
            <MaterialCommunityIcons
              name="star"
              size={18}
              color={COLORS.warning}
            />
            <Text style={styles.ratingText}>{doctor.rating}</Text>
            <Ionicons
              name="chatbox"
              size={18}
              color={COLORS.white}
              style={{ marginLeft: 15 }}
            />
            <Text style={styles.ratingText}>{doctor.reviews}</Text>
          </View>
        </View>
        <View style={styles.infoSectionHeaderInGradient}>
          <Text style={styles.infoSectionTitleInGradient}>Information</Text>
        </View>
        <View style={styles.infoTagsContainer}>
          <View style={styles.infoTag}>
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.infoTagText}>{doctor.experience}</Text>
          </View>
          <View style={styles.infoTag}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoTagText}>{doctor.availability}</Text>
          </View>
        </View>
      </LinearGradient>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Content Sections */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Focus:</Text>
          <Text style={styles.sectionText}>{doctor.focus}</Text>
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.sectionText}>{doctor.profile}</Text>
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Career Path</Text>
          <Text style={styles.sectionText}>{doctor.careerPath}</Text>
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <Text style={styles.sectionText}>{doctor.highlights}</Text>
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
  // Gradient Header styles
  headerGradient: {
    // We'll calculate dynamic padding at the bottom based on where the info tags are pulled up
    paddingBottom: 10, // Increased to provide enough space for the pulled-up info cards
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
    paddingHorizontal: 10, // Reduced padding for tighter layout
    paddingBottom: 10, // Spacing above doctor image
  },
  headerIconWrapper: {
    // Wrapper to ensure consistent tap area for smaller icons
    padding: 6, // Reduced padding
  },
  headerActionIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    marginHorizontal: 5, // Reduced margin
    gap: 0, // Ensure no extra gap
  },
  headerRightIcons: {
    flexDirection: "row",
  },
  // Doctor Profile Section within Gradient
  doctorProfileSection: {
    alignItems: "center",
    marginBottom: 20, // Space below doctor profile before the heading
  },
  doctorProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.white,
    marginBottom: 10,
    resizeMode: "cover",
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 5,
  },
  doctorSpecialization: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 10,
  },
  ratingReviews: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    color: COLORS.white,
    marginLeft: 5,
    fontWeight: "600",
  },
  // New: 'Information' Heading within the gradient
  infoSectionHeaderInGradient: {
    paddingHorizontal: 20,
    marginTop: 20, // Space between doctor profile and this heading
    marginBottom: 15, // Space between this heading and the info tags
  },
  infoSectionTitleInGradient: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#33E4DB", // Text color is white within the gradient
  },
  // Info Tags - now pulling up into the gradient
  infoTagsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    alignSelf: "center",
    marginTop: -40, // Pulls the tags up into the gradient section, adjusted value
    marginBottom: 0, // No margin bottom here, as it sits on the gradient edge
    gap: 15, // Space between tags
  },
  infoTag: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoTagText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginLeft: 8,
    flexShrink: 1,
  },
  // Scrollable Content Sections
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 10, // Small padding to start the content below the info tags
  },
  contentSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00BBD3",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: COLORS.textSecondary,
  },
});

export default DoctorInfoScreen;
