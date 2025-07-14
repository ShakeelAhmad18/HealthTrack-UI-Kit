// app/appointments/index.js (or app/appointment-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList, // For efficient list rendering
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy Appointment Data
const DUMMY_APPOINTMENTS = {
  complete: [
    {
      id: "comp1",
      doctorName: "Dr. Emma Hall, M.D.",
      specialty: "General Doctor",
      rating: 5,
      isFavorite: true,
      profileImage:
        "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "comp2",
      doctorName: "Dr. Jacob Lopez, M.D.",
      specialty: "Surgical Dermatology",
      rating: 4,
      isFavorite: false,
      profileImage:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHw3OXx8ZmVtYWxlJTIwZG9jdG9yfGVufDB8fHx8MTcwNjU1ODAzM3ww&ixlib=rb-4.0.3&q=80&w=400",
    },
    {
      id: "comp3",
      doctorName: "Dr. Quinn Cooper, M.D.",
      specialty: "Menopausal and Geriatric Gynecology",
      rating: 5,
      isFavorite: true,
      profileImage:
        "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "comp4",
      doctorName: "Dr. Lucy Perez, Ph.D.",
      specialty: "Clinical Dermatology",
      rating: 5,
      isFavorite: true,
      profileImage:
        "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  upcoming: [
    {
      id: "up1",
      doctorName: "Dr. Madison Clark, Ph.D.",
      specialty: "General Doctor",
      profileImage:
        "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      date: "Sunday, 12 June",
      time: "9:30 AM - 10:00 AM",
    },
    {
      id: "up2",
      doctorName: "Dr. Logan Williams, M.D.",
      specialty: "Dermatology",
      profileImage:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHw3OXx8ZmVtYWxlJTIwZG9jdG9yfGVufDB8fHx8MTcwNjU1ODAzM3ww&ixlib=rb-4.0.3&q=80&w=400",
      date: "Friday, 20 June",
      time: "2:30 PM - 3:00 PM",
    },
    {
      id: "up3",
      doctorName: "Dr. Chloe Green, M.D.",
      specialty: "Gynecology",
      profileImage:
        "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      date: "Tuesday, 15 June",
      time: "9:30 AM - 10:00 AM",
    },
    {
      id: "up4",
      doctorName: "Dr. Daniel Rodriguez",
      specialty: "Cardiology",
      profileImage:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHw3OXx8ZmVtYWxlJTIwZG9jdG9yfGVufDB8fHx8MTcwNjU1ODAzM3ww&ixlib=rb-4.0.3&q=80&w=400",
      date: "Friday, 20 June",
      time: "2:30 PM - 3:00 PM",
    },
  ],
  cancelled: [
    {
      id: "cancel1",
      doctorName: "Dr. Rachel Kim",
      specialty: "Oncology",
      profileImage:
        "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "cancel2",
      doctorName: "Dr. Jonathan Rodriguez",
      specialty: "Ophtamology",
      profileImage:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzI0NTZ8MHwxfHNlYXJjaHw3OXx8ZmVtYWxlJTIwZG9jdG9yfGVufDB8fHx8MTcwNjU1ODAzM3ww&ixlib=rb-4.0.3&q=80&w=400",
    },
    {
      id: "cancel3",
      doctorName: "Dr. Samantha Patel",
      specialty: "Ophtamology",
      profileImage:
        "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "cancel4",
      doctorName: "Dr. Christopher Evans",
      specialty: "Orthopedics",
      profileImage:
        "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
};

const AppointmentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("upcoming"); // Default to 'Upcoming' tab
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState({
    complete: [],
    upcoming: [],
    cancelled: [],
  });

  useEffect(() => {
    // Simulate fetching appointments from an API
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAppointments(DUMMY_APPOINTMENTS); // Set dummy data
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        Alert.alert("Error", "Could not load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleReBook = (doctorName) => {
    Alert.alert(
      "Re-Book Appointment",
      `You want to re-book with ${doctorName}.`
    );
    // In a real app, navigate to a booking screen with doctor pre-selected
    // router.push({ pathname: 'book-appointment', params: { doctorName } });
  };

  const handleAddReview = (doctorName) => {
   
    router.push({ pathname: 'views/Appointments/Review', params: { doctorName } });
  };

  const handleDetails = (appointmentId) => {

     router.push({ pathname: 'views/Appointments/AppointmentDetail', params: { appointmentId } });

  };

  const handleConfirmAppointment = (id) => {
    Alert.alert("Confirm Appointment", `Confirming appointment ID: ${id}.`);
    // In a real app, send API request to confirm
    setAppointments((prev) => ({
      ...prev,
      upcoming: prev.upcoming.filter((app) => app.id !== id),
      complete: [
        ...prev.complete,
        { ...prev.upcoming.find((app) => app.id === id), status: "confirmed" },
      ], // Move to complete or update status
    }));
  };

  const handleCancelAppointment = (appointmentId) => {
    router.push({
      pathname: "views/Appointments/CancelAppointment",
      params: { appointmentId },
    });
  };

  const renderCompleteAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.doctorInfo}>
        <Image source={{ uri: item.profileImage }} style={styles.doctorImage} />
        <View style={styles.doctorTextInfo}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
          <View style={styles.ratingAndFavorite}>
            <Ionicons name="star" size={16} color={COLORS.starYellow} />
            <Text style={styles.doctorRating}>{item.rating}</Text>
            <Ionicons
              name={item.isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={item.isFavorite ? COLORS.error : COLORS.iconSecondary}
              style={styles.favoriteIcon}
            />
          </View>
        </View>
      </View>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleReBook(item.doctorName)}
        >
          <Text style={styles.actionButtonText}>Re-Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAddReview(item.doctorName)}
        >
          <Text style={styles.actionButtonText}>Add Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUpcomingAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.doctorInfo}>
        <Image source={{ uri: item.profileImage }} style={styles.doctorImage} />
        <View style={styles.doctorTextInfo}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
          <View style={styles.dateTimeContainer}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={16}
              color={COLORS.iconSecondary}
            />
            <Text style={styles.dateTimeText}>{item.date}</Text>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={COLORS.iconSecondary}
              style={styles.timeIcon}
            />
            <Text style={styles.dateTimeText}>{item.time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.upcomingActions}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => handleDetails(item.id)}
        >
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
        <View style={styles.upcomingActionIcons}>
          <TouchableOpacity onPress={() => handleConfirmAppointment(item.id)}>
            <Ionicons
              name="checkmark-circle"
              size={30}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCancelAppointment(item.id)}
            style={styles.cancelIcon}
          >
            <Ionicons name="close-circle" size={30} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCancelledAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.doctorInfo}>
        <Image source={{ uri: item.profileImage }} style={styles.doctorImage} />
        <View style={styles.doctorTextInfo}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        </View>
      </View>
      <View style={styles.actionButtonsContainer}>
        {/* Only Add Review for cancelled appointments as per image */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAddReview(item.doctorName)}
        >
          <Text style={styles.actionButtonText}>Add Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>All Appointment</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "complete" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("complete")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "complete" && styles.tabButtonTextActive,
              ]}
            >
              Complete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "upcoming" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "upcoming" && styles.tabButtonTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "cancelled" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("cancelled")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "cancelled" && styles.tabButtonTextActive,
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : (
        <FlatList
          data={appointments[activeTab]}
          renderItem={
            activeTab === "complete"
              ? renderCompleteAppointment
              : activeTab === "upcoming"
              ? renderUpcomingAppointment
              : renderCancelledAppointment // Default to cancelled
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.appointmentListContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.noAppointmentsText}>
              No {activeTab} appointments found.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 20, // Adjusted padding to accommodate tabs
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
  tabButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 5, // Inner padding to give space around buttons
    marginBottom: 10, // Space between tabs and content below
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20, // Rounded corners for active tab
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  tabButtonTextActive: {
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  appointmentListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  appointmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  doctorTextInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  ratingAndFavorite: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  doctorRating: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 5,
    marginRight: 10,
    fontWeight: "600",
  },
  favoriteIcon: {
    marginLeft: 5,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    paddingTop: 15,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: COLORS.background,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },
  // Upcoming specific styles
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    flexWrap: "wrap", // Allow content to wrap to the next line
  },
  dateTimeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 5,
    marginRight: 10,
    flexShrink: 1, // Allow text to shrink if needed
  },
  timeIcon: {
    marginLeft: 5,
  },
  upcomingActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    paddingTop: 15,
    marginTop: 10,
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  detailsButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },
  upcomingActionIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelIcon: {
    marginLeft: 15,
  },
  noAppointmentsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default AppointmentScreen;
