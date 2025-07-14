// app/payment-summary/index.js (or app/payment-summary-screen.js)
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
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy Data for Payment Summary
const DUMMY_PAYMENT_SUMMARY = {
  totalAmount: "100.00",
  doctor: {
    name: "Dr. Emma Hall, M.D.",
    specialty: "General Doctor",
    profileImage:
      "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB4MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    reviewCount: 30,
  },
  appointmentDetails: {
    date: "Month 24, Year", // Example: "August 24, 2025"
    time: "10:00 AM",
    duration: "30 Minutes",
    bookingFor: "Jhon Doe",
  },
  paymentBreakdown: {
    amount: "$100.00",
    durationCost: "30 Minutes", // This seems to be a label, not a cost, based on image
    total: "$100",
  },
  selectedPaymentMethod: "Card", // e.g., "Card", "Apple Pay", "PayPal"
};

const PaymentSummaryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router=useRouter();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Simulate fetching payment summary data
    const fetchSummary = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSummaryData(DUMMY_PAYMENT_SUMMARY);
      } catch (error) {
        console.error("Failed to fetch payment summary:", error);
        Alert.alert(
          "Error",
          "Could not load payment summary. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChangePaymentMethod = () => {
    Alert.alert(
      "Change Payment Method",
      "Navigate to payment method selection screen."
    );
    // In a real app: navigation.navigate('PaymentMethodScreen');
  };

  const handlePayNow = async () => {
    setProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate payment gateway processing
       
      router.push("views/Payments/PaymentSuccess")
     
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Failed",
        `There was an issue processing your payment: ${
          error.message || "Please try again."
        }`
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading payment summary...</Text>
      </View>
    );
  }

  if (!summaryData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Payment summary not available.</Text>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={styles.totalAmountText}>$ {summaryData.totalAmount}</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Doctor Info Card */}
        <View style={styles.doctorCard}>
          <Image
            source={{ uri: summaryData.doctor.profileImage }}
            style={styles.doctorImage}
          />
          <View style={styles.doctorInfoText}>
            <Text style={styles.doctorName}>{summaryData.doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>
              {summaryData.doctor.specialty}
            </Text>
            <View style={styles.doctorStats}>
              <Ionicons name="star" size={16} color={COLORS.starYellow} />
              <Text style={styles.statText}>{summaryData.doctor.rating}</Text>
              <MaterialCommunityIcons
                name="message-text-outline"
                size={16}
                color={COLORS.iconSecondary}
                style={styles.statIcon}
              />
              <Text style={styles.statText}>
                {summaryData.doctor.reviewCount}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="check-decagram"
            size={30}
            color={COLORS.primary}
            style={styles.verifiedIcon}
          />
        </View>

        {/* Appointment Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date / Hour</Text>
            <Text style={styles.detailValue}>
              {summaryData.appointmentDetails.date} /{" "}
              {summaryData.appointmentDetails.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>
              {summaryData.appointmentDetails.duration}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking for</Text>
            <Text style={styles.detailValue}>
              {summaryData.appointmentDetails.bookingFor}
            </Text>
          </View>
        </View>

        {/* Payment Breakdown */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>
              {summaryData.paymentBreakdown.amount}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>
              {summaryData.paymentBreakdown.durationCost}
            </Text>
          </View>
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {summaryData.paymentBreakdown.total}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodCard}>
          <Text style={styles.paymentMethodLabel}>Payment Method</Text>
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodValue}>
              {summaryData.selectedPaymentMethod}
            </Text>
            <TouchableOpacity onPress={handleChangePaymentMethod}>
              <Text style={styles.changePaymentMethodText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View
        style={[
          styles.bottomButtonContainer,
          { paddingBottom: insets.bottom + 15 },
        ]}
      >
        <TouchableOpacity
          style={styles.payNowButton}
          onPress={handlePayNow}
          disabled={processingPayment}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payNowButtonGradient}
          >
            {processingPayment ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.payNowButtonText}>Pay Now</Text>
            )}
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
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  totalAmountText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
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
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: COLORS.lightPrimary,
  },
  doctorInfoText: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 3,
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
    color: COLORS.textSecondary,
    marginLeft: 3,
    marginRight: 10,
  },
  statIcon: {
    marginLeft: 0,
  },
  verifiedIcon: {
    marginLeft: 10,
  },
  detailsCard: {
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  paymentMethodCard: {
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
  paymentMethodLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  paymentMethodDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentMethodValue: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  changePaymentMethodText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "bold",
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
  payNowButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  payNowButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  payNowButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default PaymentSummaryScreen;
