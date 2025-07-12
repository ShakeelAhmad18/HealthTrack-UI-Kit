// app/appointments/detail.js (or app/appointment-detail-screen.js)
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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/helper"; // Adjust path as needed

// Dummy Appointment Detail Data
const DUMMY_APPOINTMENT_DETAIL = {
  id: "appt123",
  doctor: {
    name: "Dr. Emma Hall, M.D.",
    specialty: "General Doctor",
    profileImage:
      "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    experience: 30, // Assuming this is years of experience
    isFavorite: true,
  },
  appointment: {
    date: "WED, 10:00 AM",
    monthYear: "Month 24, Year", // As per image, placeholder for actual date
    status: "upcoming", // Can be 'upcoming', 'completed', 'cancelled'
  },
  bookingFor: {
    person: "Another Person",
    fullName: "Jane Doe",
    age: 30,
    gender: "Female",
  },
  problem:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};

const AppointmentDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams(); // If passing appointment ID via params

  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching appointment details from an API
    const fetchDetails = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAppointmentDetails(DUMMY_APPOINTMENT_DETAIL); // Set dummy data
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        Alert.alert(
          "Error",
          "Could not load appointment details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [params.appointmentId]); // Re-fetch if appointmentId changes

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleConfirmAppointment = () => {
    Alert.alert(
      "Confirm Appointment",
      "Are you sure you want to confirm this appointment?"
    );
    // In a real app, send API request to confirm
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            Alert.alert("Cancelled", "Appointment has been cancelled.");
            // In a real app, send API request to cancel and then navigate back
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handlePayment = () => {
    Alert.alert("Proceed to Payment");
  };

  const handleCancelButton = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () =>
            Alert.alert(
              "Booking Cancelled",
              "Your booking has been cancelled."
            ),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading appointment details...</Text>
      </View>
    );
  }

  if (!appointmentDetails) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Appointment details not found.</Text>
      </View>
    );
  }

  const { doctor, appointment, bookingFor, problem } = appointmentDetails;

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
          <Text style={styles.headerTitle}>Your Appointment</Text>
          <View style={{ width: 28 }} />
        </View>
        {/* Doctor Info Card */}
        <View style={styles.doctorCard}>
          <Image
            source={{ uri: doctor.profileImage }}
            style={styles.doctorImage}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            <View style={styles.doctorStats}>
              <Ionicons name="star" size={16} color={COLORS.starYellow} />
              <Text style={styles.statText}>{doctor.rating}</Text>
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={16}
                color={COLORS.iconSecondary}
                style={styles.statIcon}
              />
              <Text style={styles.statText}>{doctor.experience}</Text>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={COLORS.iconSecondary}
                style={styles.statIcon}
              />
              <Text style={styles.statText}>?</Text>
              {/* Placeholder for chat count/status */}
              <Ionicons
                name={doctor.isFavorite ? "heart" : "heart-outline"}
                size={16}
                color={doctor.isFavorite ? COLORS.error : COLORS.iconSecondary}
                style={styles.statIcon}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Appointment Date & Actions */}
        <View style={styles.appointmentDateCard}>
          <View style={styles.dateInfo}>
            <Text style={styles.dateMonthYear}>{appointment.monthYear}</Text>
            <Text style={styles.dateDayTime}>{appointment.date}</Text>
          </View>
          <View style={styles.appointmentActions}>
            <TouchableOpacity onPress={handleConfirmAppointment}>
              <Ionicons
                name="checkmark-circle"
                size={30}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancelAppointment}
              style={styles.cancelCircleIcon}
            >
              <Ionicons name="close-circle" size={30} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Booking For Section */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Booking For</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Person</Text>
            <Text style={styles.detailValue}>{bookingFor.person}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{bookingFor.fullName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age</Text>
            <Text style={styles.detailValue}>{bookingFor.age}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{bookingFor.gender}</Text>
          </View>
        </View>
        {/* Problem Description */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Problem</Text>
          <Text style={styles.problemText}>{problem}</Text>
        </View>
        {/* Action Buttons at Bottom */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handlePayment}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.paymentButtonGradient}
            >
              <Text style={styles.paymentButtonText}>Payment</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    paddingBottom: 20, // Adjusted padding to accommodate doctor card
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
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 15,
    marginTop: 10, // Space from header title
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  doctorStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 4,
    marginRight: 10,
    fontWeight: "600",
  },
  statIcon: {
    marginLeft: 5,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  appointmentDateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  dateInfo: {
    flex: 1,
  },
  dateMonthYear: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  dateDayTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  appointmentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelCircleIcon: {
    marginLeft: 15,
  },
  detailCard: {
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  problemText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 10,
  },
  paymentButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  paymentButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: COLORS.background, // Match background for a subtle look
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.error,
  },
});

export default AppointmentDetailScreen;
