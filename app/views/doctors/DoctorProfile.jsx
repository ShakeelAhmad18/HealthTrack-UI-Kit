// app/doctor-profile/[id].js (or app/doctor-profile-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, LocaleConfig } from "react-native-calendars"; // Import Calendar and LocaleConfig
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

const { width } = Dimensions.get("window");

// Configure react-native-calendars to use English locale
LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan.",
    "Feb.",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul.",
    "Aug",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  today: "Today",
};
LocaleConfig.defaultLocale = "en";

// Dummy Doctor Profile Data
const DUMMY_DOCTOR_PROFILE = {
  id: "doc1",
  name: "Dr. Emma Hall, M.D.",
  specialty: "General Doctor",
  profileImage:
    "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  rating: 5,
  reviewCount: 30,
  schedule: "Mon - Sat / 9 AM - 4 PM",
  profileDescription:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  // For react-native-calendars, you'd typically have a list of available dates in 'YYYY-MM-DD' format
  // For simplicity, we'll assume all future dates are available from today.
};

const DoctorProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams(); // To get the doctor ID
  const router=useRouter();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // selectedDate will now store the 'YYYY-MM-DD' string from react-native-calendars
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Simulate fetching doctor profile data
    const fetchDoctorProfile = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setDoctorProfile(DUMMY_DOCTOR_PROFILE);
        // Set initial selected date to today's date for demonstration
        const today = new Date();
        setSelectedDate(today.toISOString().split("T")[0]); // Format to 'YYYY-MM-DD'
      } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
        Alert.alert(
          "Error",
          "Could not load doctor profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorProfile();
  }, [params.id]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMakeAppointment = (doctorProfile) => {
    router.push({
      pathname: "views/doctors/Schedule",
      params: {
        doctorId: doctorProfile.id
      },
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading doctor profile...</Text>
      </View>
    );
  }

  if (!doctorProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Doctor profile not found.</Text>
      </View>
    );
  }

  // Get today's date in 'YYYY-MM-DD' format for minDate
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Marked dates for the calendar
  const markedDates = {
    [selectedDate]: {
      selected: true,
      marked: true,
      selectedColor: COLORS.primary,
      dotColor: COLORS.white,
    },
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
        <View style={[styles.headerTopContent, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconWrapper}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={24}
                color={COLORS.white}
              />
              <Text style={styles.headerIconText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconWrapper}>
              <Ionicons name="call-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconWrapper}>
              <Ionicons
                name="videocam-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconWrapper}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity>
              <Ionicons
                name="help-circle-outline"
                size={28}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Doctor Profile Info */}
        <View style={styles.doctorProfileInfo}>
          <Image
            source={{ uri: doctorProfile.profileImage }}
            style={styles.doctorImage}
          />
          <View style={styles.doctorTextInfo}>
            <Text style={styles.doctorName}>{doctorProfile.name}</Text>
            <Text style={styles.doctorSpecialty}>
              {doctorProfile.specialty}
            </Text>
            <View style={styles.doctorStats}>
              <Ionicons name="star" size={16} color={COLORS.starYellow} />
              <Text style={styles.statText}>{doctorProfile.rating}</Text>
              <MaterialCommunityIcons
                name="message-text-outline"
                size={16}
                color={COLORS.iconSecondary}
                style={styles.statIcon}
              />
              <Text style={styles.statText}>{doctorProfile.reviewCount}</Text>
            </View>
          </View>
        </View>
        {/* Schedule Bar */}
        <View style={styles.scheduleBar}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.scheduleText}>{doctorProfile.schedule}</Text>
        </View>
      </LinearGradient>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 }, 
        ]}
      >
        {/* Profile Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.profileDescription}>
            {doctorProfile.profileDescription}
          </Text>
        </View>
        {/* Choose Date Section with Calendar */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Choose Date</Text>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            markedDates={markedDates}
            minDate={todayString} 
            theme={{
              backgroundColor: COLORS.background,
              calendarBackground: COLORS.white,
              textSectionTitleColor: COLORS.textSecondary,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: COLORS.white,
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.textPrimary,
              textDisabledColor: COLORS.lightGrey,
              dotColor: COLORS.primary,
              selectedDotColor: COLORS.white,
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.textPrimary,
              indicatorColor: COLORS.primary,
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 13,
            }}
            style={styles.calendar}
          />
        </View>
      </ScrollView>
      {/* Make Appointment Button */}
      <View
        style={[
          styles.bottomButtonContainer,
          { paddingBottom: insets.bottom + 15 },
        ]}
      >
        {/* Dynamic bottom padding */}
        <TouchableOpacity
          style={styles.makeAppointmentButton}
          onPress={()=>handleMakeAppointment(doctorProfile)}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.makeAppointmentButtonGradient}
          >
            <Text style={styles.makeAppointmentButtonText}>
              Make Appointment
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
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
  headerTopContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  headerButton: {
    padding: 5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)", // Semi-transparent white background
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  headerIconText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 5,
    fontWeight: "600",
  },
  headerRightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorProfileInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  doctorImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 15,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  doctorTextInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 15,
    color: COLORS.lightGrey, // Lighter color for specialty
    marginBottom: 10,
  },
  doctorStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 5,
    marginRight: 15,
    fontWeight: "600",
  },
  statIcon: {
    marginLeft: 0, // No extra margin for these icons
  },
  scheduleBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: -10, // Pull up to overlap with header gradient
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scheduleText: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionCard: {
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
  profileDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  // Calendar specific styles for react-native-calendars
  calendar: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  // Bottom Button
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 15, // Keep top padding consistent
    backgroundColor: COLORS.white, // White background for the button area
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  makeAppointmentButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  makeAppointmentButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  makeAppointmentButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default DoctorProfileScreen;
