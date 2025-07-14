// app/schedule/index.js (or app/schedule-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView, // Import KeyboardAvoidingView
  Platform, // Import Platform to differentiate OS
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

const { width } = Dimensions.get("window");

// Dummy Doctor Data (for header)
const DUMMY_DOCTOR_INFO = {
  name: "Dr. Emma Hall, M.D.",
};

// Dummy Schedule Data
const DUMMY_SCHEDULE = {
  upcomingDays: [
    { date: new Date(2025, 7, 9), dayShort: "MON" }, // Aug 9, 2025
    { date: new Date(2025, 7, 10), dayShort: "TUE" },
    { date: new Date(2025, 7, 11), dayShort: "WED" },
    { date: new Date(2025, 7, 12), dayShort: "THU" },
    { date: new Date(2025, 7, 13), dayShort: "FRI" },
    { date: new Date(2025, 7, 14), dayShort: "SAT" },
    { date: new Date(2025, 7, 15), dayShort: "SUN" },
  ],
  availableTimes: [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
  ],
  bookedTimes: ["10:30 AM", "1:00 PM", "3:30 PM"], // Example booked times
};

const ScheduleScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router=useRouter();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Index of selected day in upcomingDays
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientType, setPatientType] = useState("Yourself"); // 'Yourself' or 'Another Person'
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(null); // 'Male', 'Female', 'Other'
  const [problemDescription, setProblemDescription] = useState("");

  useEffect(() => {
    // Simulate fetching doctor and schedule data
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setDoctorInfo(DUMMY_DOCTOR_INFO);
        setSchedule(DUMMY_SCHEDULE);
        // Set initial patient details if "Yourself" is selected
        if (patientType === "Yourself") {
          setFullName("Jane Doe"); // Example: fetch from user profile
          setAge("30"); // Example: fetch from user profile
          setGender("Female"); // Example: fetch from user profile
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Alert.alert("Error", "Could not load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientType]); // Re-fetch if patientType changes to update dummy info

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleGoToPayment = () => {
    if (!selectedTime) {
      Alert.alert("Select Time", "Please select an available time slot.");
      return;
    }
    if (!fullName || !age || !gender || !problemDescription) {
      Alert.alert(
        "Missing Information",
        "Please fill in all patient details and describe your problem."
      );
      return;
    }

    const bookingDetails={
        fullName,
        age,
        gender,
        problemDescription
    }

     router.push({ pathname: 'views/Payments/PaymentMethod', params: { ...bookingDetails } });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
    );
  }

  if (!doctorInfo || !schedule) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Schedule data not found.</Text>
      </View>
    );
  }

  const selectedDay = schedule.upcomingDays[selectedDayIndex];

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
          <Text style={styles.headerTitle}>{doctorInfo.name}</Text>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity>
              <Ionicons name="call-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="videocam-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Schedule Header */}
        <View style={styles.upcomingScheduleHeader}>
          <Text style={styles.upcomingScheduleTitle}>Upcoming Schedule</Text>
          <Text style={styles.monthText}>Month</Text>
        </View>

        {/* Day Selector */}
        <View style={styles.daySelectorContainer}>
          <TouchableOpacity style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScrollContainer}
          >
            {schedule.upcomingDays.map((day, index) => {
              const isSelected = index === selectedDayIndex;
              const dayNumber = day.date.getDate();
              const dayName = day.dayShort;
              return (
                <TouchableOpacity
                  key={day.date.toISOString()}
                  style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                  onPress={() => setSelectedDayIndex(index)}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected && styles.dayNumberSelected,
                    ]}
                  >
                    {dayNumber}
                  </Text>
                  <Text
                    style={[
                      styles.dayName,
                      isSelected && styles.dayNameSelected,
                    ]}
                  >
                    {dayName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* KeyboardAvoidingView to prevent input from being hidden */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // 'padding' for iOS, 'height' for Android
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 180 : 0} // Adjust offset based on header height
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Available Time Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Available Time</Text>
            <View style={styles.timeSlotsContainer}>
              {schedule.availableTimes.map((time, index) => {
                const isBooked = schedule.bookedTimes.includes(time);
                const isSelected = selectedTime === time;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlotButton,
                      isBooked && styles.timeSlotBooked,
                      isSelected && styles.timeSlotSelected,
                    ]}
                    onPress={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        isBooked && styles.timeSlotTextBooked,
                        isSelected && styles.timeSlotTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Patient Details Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Patient Details</Text>
            <View style={styles.patientTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.patientTypeButton,
                  patientType === "Yourself" &&
                    styles.patientTypeButtonSelected,
                ]}
                onPress={() => {
                  setPatientType("Yourself");
                  setFullName("Jane Doe"); // Dummy data for yourself
                  setAge("30");
                  setGender("Female");
                }}
              >
                <Text
                  style={[
                    styles.patientTypeButtonText,
                    patientType === "Yourself" &&
                      styles.patientTypeButtonTextSelected,
                  ]}
                >
                  Yourself
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.patientTypeButton,
                  patientType === "Another Person" &&
                    styles.patientTypeButtonSelected,
                ]}
                onPress={() => {
                  setPatientType("Another Person");
                  setFullName(""); // Clear for another person
                  setAge("");
                  setGender(null);
                }}
              >
                <Text
                  style={[
                    styles.patientTypeButtonText,
                    patientType === "Another Person" &&
                      styles.patientTypeButtonTextSelected,
                  ]}
                >
                  Another Person
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor={COLORS.textPlaceholder}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.textInput}
                value={age}
                onChangeText={setAge}
                placeholder="Enter age"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderSelector}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "Male" && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender("Male")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "Male" && styles.genderButtonTextSelected,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "Female" && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender("Female")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "Female" && styles.genderButtonTextSelected,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "Other" && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender("Other")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "Other" && styles.genderButtonTextSelected,
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Describe your problem</Text>
              <TextInput
                style={[styles.textInput, styles.problemDescriptionInput]}
                value={problemDescription}
                onChangeText={setProblemDescription}
                placeholder="Enter Your Problem Here..."
                placeholderTextColor={COLORS.textPlaceholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top" // Align text to the top for multiline
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Go to Payment Button */}
      <View
        style={[
          styles.bottomButtonContainer,
          { paddingBottom: insets.bottom + 15 },
        ]}
      >
        <TouchableOpacity
          style={styles.goToPaymentButton}
          onPress={handleGoToPayment}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goToPaymentButtonGradient}
          >
            <Text style={styles.goToPaymentButtonText}>Go to Payment</Text>
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
    flex: 1,
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
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    flex: 1, // Allow title to take available space
    textAlign: "center",
    marginHorizontal: 10, // Provide some margin
  },
  headerRightIcons: {
    flexDirection: "row",
    alignItems: "center",
    // No specific width needed, icons will space themselves
  },
  upcomingScheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  upcomingScheduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  monthText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "600",
  },
  daySelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  arrowButton: {
    padding: 5,
  },
  daysScrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  dayCardSelected: {
    backgroundColor: COLORS.primary,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  dayNumberSelected: {
    color: COLORS.white,
  },
  dayName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dayNameSelected: {
    color: COLORS.white,
  },
  keyboardAvoidingView: {
    // New style for KeyboardAvoidingView
    flex: 1, // Take up remaining space
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
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  timeSlotButton: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  timeSlotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotBooked: {
    backgroundColor: COLORS.lightGrey,
    borderColor: COLORS.mediumGrey,
    opacity: 0.7, // Indicate it's disabled
  },
  timeSlotText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  timeSlotTextSelected: {
    color: COLORS.white,
  },
  timeSlotTextBooked: {
    color: COLORS.textLight,
  },
  // Patient Details Section
  patientTypeSelector: {
    flexDirection: "row",
    backgroundColor: COLORS.lightBackground,
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden", // Ensures buttons inside respect border radius
  },
  patientTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15, // Apply to individual buttons
  },
  patientTypeButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  patientTypeButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  patientTypeButtonTextSelected: {
    color: COLORS.white,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  genderSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
    overflow: "hidden",
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.separator,
  },
  genderButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  genderButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  genderButtonTextSelected: {
    color: COLORS.white,
  },
  problemDescriptionInput: {
    minHeight: 100, // Make it taller for description
  },
  // Bottom Button Container
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  goToPaymentButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  goToPaymentButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  goToPaymentButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default ScheduleScreen;
