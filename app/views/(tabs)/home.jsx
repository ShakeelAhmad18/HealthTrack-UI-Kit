import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../constants/helper"; // Adjusted path based on your import
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Helper function to format dates for comparison
const formatDateForComparison = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const ALL_SCHEDULES = [
  {
    id: "s1",
    fullDate: new Date(2025, 6, 9), // Month is 0-indexed (July is 6)
    displayDate: "09 July - Tuesday",
    time: "09:00 am",
    doctor: "Dr. Emily Clark",
  },
  {
    id: "s2",
    fullDate: new Date(2025, 6, 10),
    displayDate: "10 July - Wednesday",
    time: "10:00 am",
    doctor: "Dr. Olivia Turner",
  },
  {
    id: "s3",
    fullDate: new Date(2025, 6, 11), // Current active date in UI
    displayDate: "11 July - Thursday - Today", // Changed from Wed to Thu for example
    time: "10:00 am",
    doctor: "Dr. Olivia Turner",
  },
  {
    id: "s4",
    fullDate: new Date(2025, 6, 11),
    displayDate: "11 July - Thursday - Today",
    time: "02:30 pm",
    doctor: "Dr. Marcus Bell",
  },
  {
    id: "s5",
    fullDate: new Date(2025, 6, 12),
    displayDate: "12 July - Friday",
    time: "09:30 am",
    doctor: "Dr. Sophia Lee",
  },
  {
    id: "s6",
    fullDate: new Date(2025, 6, 14),
    displayDate: "14 July - Monday",
    time: "08:00 am",
    doctor: "Dr. Alexander Bennett",
  },
  {
    id: "s7",
    fullDate: new Date(2025, 6, 16), // Example beyond initial dates, for scroll testing
    displayDate: "16 July - Wednesday",
    time: "08:00 am",
    doctor: "Dr. Alexander Bennett",
  },
];

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // State for active date
  const today = new Date();
  const [activeDate, setActiveDate] = useState(today); // Initialize with today's date

  // State for filtered schedules
  const [filteredSchedule, setFilteredSchedule] = useState([]);

  useEffect(() => {
    const formattedActiveDate = formatDateForComparison(activeDate);
    const schedulesForSelectedDate = ALL_SCHEDULES.filter(
      (schedule) =>
        formatDateForComparison(schedule.fullDate) === formattedActiveDate
    );
    setFilteredSchedule(schedulesForSelectedDate);
  }, [activeDate]);

  // Generate dates for the horizontal picker (7 days from today)
  const getDatesForPicker = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  const datesForPicker = getDatesForPicker();

  const categories = [
    {
      name: "Favorite",
      icon: "heart-outline",
      path: "views/doctors/favorites",
    },
    { name: "Doctors", icon: "doctor", path: "views/doctors/Doctors" },
    { name: "Pharmacy", icon: "pill", path: "views/pharmacy/pharmacy" },
    {
      name: "Specialties",
      icon: "meditation",
      path: "views/Specialties/Specialties",
    },
    {
      name: "Record",
      icon: "file-document-outline",
      path: "views/record/MedicalRecord",
    },
  ];

  const specialties = [
    {
      name: "Cardiology",
      icon: "heart-pulse",
      path: "views/Specialties/Cardiology",
    },
    {
      name: "Dermatology",
      icon: "hair-dryer",
      path: "views/Specialties/Dermatology",
    },
    {
      name: "General Medicine",
      icon: "stethoscope",
      path: "views/Specialties/GeneralMedicine",
    },
    {
      name: "Gynecology",
      icon: "gender-female",
      path: "views/Specialties/Gynecology",
    },
    {
      name: "Odontology",
      icon: "tooth-outline",
      path: "views/Specialties/Odontology",
    },
    { name: "Oncology", icon: "dna", path: "views/Specialties/Oncology" },
    {
      name: "Ophthalmology",
      icon: "eye-outline",
      path: "views/Specialties/Ophthalmology",
    }, // Added Ophthalmology
    {
      name: "Pediatrics",
      icon: "baby-face-outline",
      path: "views/Specialties/Pediatrics",
    }, // Added Pediatrics
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("views/profile/Notification")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.iconPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={COLORS.iconPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="search-outline"
              size={24}
              color={COLORS.iconPrimary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>Hi, Welcome Back</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.userName}>Jane Doe</Text>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=3" }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editIcon}>
              <FontAwesome name="pencil" size={12} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Categories", "See all categories pressed")
              }
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => router.push(`${category?.path}`)}
              >
                {category.name === "Favorite" ? (
                  <Ionicons
                    name={category.icon}
                    size={30}
                    color={COLORS.iconPrimary}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={30}
                    color={COLORS.iconPrimary}
                  />
                )}
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Schedule Section */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.upcomingScheduleContainer}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleLight}>Upcoming Schedule</Text>
            <TouchableOpacity
              onPress={() => router.push("views/(tabs)/calendar")}
            >
              <Text style={styles.seeAllTextLight}>Month</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.datePicker}>
            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datePickerScrollContent}
            >
              {datesForPicker.map((date, index) => {
                const dayOfWeek = date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase();
                const dayOfMonth = date.getDate();
                const isActive =
                  formatDateForComparison(date) ===
                  formatDateForComparison(activeDate);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dateItem, isActive && styles.activeDateItem]}
                    onPress={() => setActiveDate(date)}
                  >
                    <Text
                      style={[
                        styles.dateTextDay,
                        isActive && styles.activeDateText,
                      ]}
                    >
                      {dayOfWeek}
                    </Text>
                    <Text
                      style={[
                        styles.dateTextDate,
                        isActive && styles.activeDateText,
                      ]}
                    >
                      {dayOfMonth}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.appointmentList}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleLight}></Text>
              {/* Empty title for alignment */}
              <TouchableOpacity
                onPress={() => router.push("views/(tabs)/calendar")}
              >
                <Text style={styles.seeAllTextLight}>See all</Text>
              </TouchableOpacity>
            </View>
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((appointment) => (
                <View key={appointment.id} style={styles.appointmentItem}>
                  <View style={styles.bulletPoint} />
                  <View>
                    <Text style={styles.appointmentDate}>
                      {appointment.displayDate}
                    </Text>
                    <Text style={styles.appointmentTimeDoctor}>
                      {appointment.time}{" "}
                      <Text style={styles.appointmentDoctor}>
                        {appointment.doctor}
                      </Text>
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noScheduleContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={50}
                  color={COLORS.white}
                  style={{ opacity: 0.7 }}
                />
                <Text style={styles.noScheduleText}>
                  No schedules for this date.
                </Text>
                <Text style={styles.noScheduleSubText}>
                  Tap another date or add a new appointment.
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
        {/* AI Health Assistant Button Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.aiButtonContainer}
            onPress={() => router.push("views/ai/home")}
          >
            <LinearGradient
              colors={["#33E4DB", "#00BBD3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiButtonGradient}
            >
              <MaterialCommunityIcons
                name="robot-happy-outline"
                size={40}
                color={COLORS.white}
                style={styles.aiButtonIcon}
              />
              <View style={styles.aiButtonTextContainer}>
                <Text style={styles.aiButtonTitle}>AI Health Assistant</Text>
                <Text style={styles.aiButtonSubtitle}>
                  Get personalized health insights & recommendations
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Specialties Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <TouchableOpacity
              onPress={() => router.push("views/Specialties/Specialties")}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.specialtiesGrid}>
            {specialties.map((specialty, index) => (
              <TouchableOpacity
                key={index}
                style={styles.specialtyCard}
                onPress={() => router.push(`${specialty.path}`)}
              >
                <MaterialCommunityIcons
                  name={specialty.icon}
                  size={40}
                  color={COLORS.white}
                />
                <Text style={styles.specialtyText}>{specialty.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    padding: 5,
    borderRadius: 10,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1, // Add a border for better definition
    borderColor: COLORS.white,
  },
  // Section Header Styles
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  sectionTitleLight: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  seeAllTextLight: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "600",
    opacity: 0.9, // Slightly less prominent
  },
  // Categories Styles
  categoriesScrollContent: {
    // Added for inner scrollview padding
    paddingRight: 10, // Gives some space at the end of scroll
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 65, // Slightly wider for better touch target
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  // Upcoming Schedule Styles
  upcomingScheduleContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    overflow: "hidden",
    shadowColor: COLORS.black, // Added shadow for the entire gradient container
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  datePickerScrollContent: {
    paddingHorizontal: 5, // Small padding for scroll items
  },
  arrowButton: {
    padding: 8,
    // Optional: a transparent background to make it look like part of the gradient
    // backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
  },
  dateItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 60, // Slightly wider for better spacing
    height: 75, // Slightly taller
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 4, // Reduced margin for more dates visibility
    paddingVertical: 8,
    borderWidth: 1, // Subtle border
    borderColor: "transparent",
    overflow: "hidden", // Ensures inner content respects border radius
  },
  activeDateItem: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary, // Active border color
    borderWidth: 2, // More prominent border for active state
    shadowColor: COLORS.primary, // Subtle shadow for active date
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  dateTextDay: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
    fontWeight: "bold",
    opacity: 0.9, // Make it a bit more subtle
  },
  dateTextDate: {
    fontSize: 24, // Slightly larger date number
    color: COLORS.textLight,
    fontWeight: "bold",
  },
  activeDateText: {
    color: COLORS.primary, // Active date text color
  },
  appointmentList: {
    marginTop: 10,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12, // More vertical padding
    borderBottomWidth: 0.5, // Finer border
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginTop: 8, // Adjust based on text alignment
    marginRight: 12,
    flexShrink: 0, // Prevent bullet point from shrinking
  },
  appointmentDate: {
    fontSize: 14,
    color: COLORS.textLight,
    opacity: 0.8,
  },
  appointmentTimeDoctor: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textLight,
    marginTop: 4, // More space from date
  },
  appointmentDoctor: {
    fontWeight: "bold",
  },
  noScheduleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  noScheduleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 15,
  },
  noScheduleSubText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.7,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  // AI Button Styles
  aiButtonContainer: {
    borderRadius: 20,
    overflow: "hidden", // Ensures gradient respects border radius
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 25, // Space below the button
  },
  aiButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  aiButtonIcon: {
    marginRight: 15,
  },
  aiButtonTextContainer: {
    flex: 1, // Allows text to take available space
  },
  aiButtonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 5,
  },
  aiButtonSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.8,
  },
  // Specialties Grid Styles
  specialtiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around", // Use space-around for even distribution and inner margin
  },
  specialtyCard: {
    width: (width - 40 - 30) / 2, // (screen_width - horizontal_padding*2 - gap_between_cards) / 2
    height: 150,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 }, // Increased shadow for more pop
    shadowOpacity: 0.3, // More pronounced shadow
    shadowRadius: 12, // Softer shadow
    elevation: 10, // Increased elevation for Android
  },
  specialtyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    marginTop: 10,
    textAlign: "center",
  },
});

export default HomeScreen;
