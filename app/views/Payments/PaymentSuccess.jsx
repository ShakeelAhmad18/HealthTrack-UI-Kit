// app/payment-success/index.js (or app/payment-success-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing"; 
import { COLORS } from "../../../constants/helper"; 

const PaymentSuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Dummy data for the successful payment details
  const [appointmentDetails, setAppointmentDetails] = useState({
    doctorName: "Dr. Emma Hall, M.D.",
    doctorSpecialty: "General Doctor",
    doctorImage:
      "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB4MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "August 24, 2025", // Example: "August 24, 2025"
    time: "10:00 AM",
    duration: "30 Minutes",
    bookingFor: "Jhon Doe",
    amount: "100.00",
    receiptId: "APT-20250824-001",
    paymentDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });
  const [loading, setLoading] = useState(true); 
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); 

  useEffect(() => {
    const fetchConfirmation = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
       
      } catch (error) {
        console.error("Failed to fetch confirmation details:", error);
        Alert.alert("Error", "Could not load confirmation details.");
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmation();
  }, []);

  const handleBackPress = () => {
    navigation.goBack(); 
  };

  const generateReceiptHtml = () => {
    const {
      doctorName,
      doctorSpecialty,
      doctorImage,
      date,
      time,
      duration,
      bookingFor,
      amount,
      receiptId,
      paymentDate,
    } = appointmentDetails;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Receipt</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(to right, #00C6FF, #0072FF); /* Gradient from COLORS.gradientStart to COLORS.gradientEnd */
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 5px 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 30px 25px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0072FF; /* Primary color */
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 15px;
          }
          .detail-label {
            font-weight: 600;
            color: #555;
          }
          .detail-value {
            color: #333;
          }
          .doctor-info {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            padding: 15px;
            background-color: #f8f8f8;
            border-radius: 10px;
            border: 1px solid #eee;
          }
          .doctor-image {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            margin-right: 15px;
            border: 2px solid #0072FF;
          }
          .doctor-name {
            font-size: 18px;
            font-weight: 700;
            color: #333;
          }
          .doctor-specialty {
            font-size: 14px;
            color: #777;
          }
          .total-section {
            border-top: 2px dashed #ddd;
            padding-top: 20px;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 700;
          }
          .total-label {
            color: #333;
          }
          .total-value {
            color: #0072FF; /* Primary color */
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #888;
            border-top: 1px solid #eee;
            margin-top: 20px;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Receipt</h1>
            <p>Thank you for your payment!</p>
          </div>
          <div class="content">
            <div class="section-title">Appointment Details</div>
            <div class="doctor-info">
              <img src="${doctorImage}" class="doctor-image" alt="Doctor Image">
              <div>
                <p class="doctor-name">${doctorName}</p>
                <p class="doctor-specialty">${doctorSpecialty}</p>
              </div>
            </div>
            <div class="detail-row">
              <span class="detail-label">Receipt ID:</span>
              <span class="detail-value">${receiptId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Date:</span>
              <span class="detail-value">${paymentDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date / Time:</span>
              <span class="detail-value">${date} / ${time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${duration}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Booking For:</span>
              <span class="detail-value">${bookingFor}</span>
            </div>

            <div class="total-section">
              <span class="total-label">Total Paid:</span>
              <span class="total-value">$${amount}</span>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated receipt. No signature required.</p>
            <p>&copy; ${new Date().getFullYear()} HealthTrack. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleDownloadReceipt = async () => {
    setIsGeneratingPdf(true);
    try {
      const htmlContent = generateReceiptHtml();
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (uri) {
        // Check if sharing is available on the device
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            UTI: ".pdf",
            mimeType: "application/pdf",
          });
          Alert.alert(
            "Receipt Shared",
            "The receipt has been prepared for sharing."
          );
        } else {
          Alert.alert(
            "Download Complete",
            `Receipt saved to: ${uri}. You can find it in your device's downloads.`
          );
        }
      } else {
        Alert.alert("Error", "Failed to generate receipt URI.");
      }
    } catch (error) {
      console.error("PDF generation or sharing failed:", error);
      Alert.alert(
        "Error",
        `Failed to generate or share receipt: ${
          error.message || "Please try again."
        }`
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleReturnNow = () => {
    navigation.popToTop(); 
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading confirmation...</Text>
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
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={120}
            color={COLORS.primary}
            style={styles.successIcon}
          />
        </View>

        {/* Congratulation Message */}
        <Text style={styles.congratulationText}>Congratulation</Text>
        <Text style={styles.paymentStatusText}>Payment is Successfully</Text>

        {/* Appointment Details Card */}
        <View style={styles.appointmentDetailsCard}>
          <Text style={styles.cardTitle}>
            You have successfully booked an appointment with
          </Text>
          <Text style={styles.doctorName}>{appointmentDetails.doctorName}</Text>
          <View style={styles.appointmentInfoRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.iconSecondary}
            />
            <Text style={styles.appointmentInfoText}>
              {appointmentDetails.date}
            </Text>
            <Ionicons
              name="time-outline"
              size={18}
              color={COLORS.iconSecondary}
              style={styles.timeIcon}
            />
            <Text style={styles.appointmentInfoText}>
              {appointmentDetails.time}
            </Text>
          </View>
        </View>

        {/* Download Receipt Button */}
        <TouchableOpacity
          style={styles.downloadReceiptButton}
          onPress={handleDownloadReceipt}
          disabled={isGeneratingPdf} // Disable button while generating PDF
        >
          {isGeneratingPdf ? (
            <ActivityIndicator color={COLORS.textPrimary} />
          ) : (
            <>
              <Text style={styles.downloadReceiptText}>Download Receipt</Text>
              <Ionicons
                name="download-outline"
                size={20}
                color={COLORS.textPrimary}
                style={styles.downloadIcon}
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Return Now Button */}
      <View
        style={[
          styles.bottomButtonContainer,
          { paddingBottom: insets.bottom + 15 },
        ]}
      >
        <TouchableOpacity
          style={styles.returnNowButton}
          onPress={handleReturnNow}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.returnNowButtonGradient}
          >
            <Text style={styles.returnNowButtonText}>Return Now</Text>
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center", // Center content horizontally
  },
  successIconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.lightPrimary, // Light primary background for the circle
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 5,
    borderColor: COLORS.primary, // Primary color border
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  successIcon: {
    // Icon itself
  },
  congratulationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  paymentStatusText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
  appointmentDetailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxWidth: 350, // Max width for larger screens
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  cardTitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  appointmentInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  appointmentInfoText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 5,
    marginRight: 15,
  },
  timeIcon: {
    marginLeft: 5, // Space between date and time icons
  },
  downloadReceiptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 30,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  downloadReceiptText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  downloadIcon: {
    color: COLORS.primary, // Primary color for download icon
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
  returnNowButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  returnNowButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  returnNowButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default PaymentSuccessScreen;
