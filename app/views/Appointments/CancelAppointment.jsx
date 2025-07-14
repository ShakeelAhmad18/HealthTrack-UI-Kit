import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; 
import { ActivityIndicator } from "react-native";

const CancelAppointmentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReasonText, setOtherReasonText] = useState("");
  const [isCancelling, setIsCancelling] = useState(false); // For loading state on button

  const appointmentId = params.appointmentId || "N/A";

  const cancellationReasons = [
    { label: "Rescheduling", value: "rescheduling" },
    { label: "Weather Conditions", value: "weather_conditions" },
    { label: "Unexpected Work", value: "unexpected_work" },
    { label: "Others", value: "others" },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCancelAppointment = async () => {
    if (!selectedReason) {
      Alert.alert(
        "Selection Required",
        "Please select a reason for cancellation."
      );
      return;
    }

    if (selectedReason === "others" && otherReasonText.trim() === "") {
      Alert.alert(
        "Reason Required",
        "Please enter your reason for cancellation."
      );
      return;
    }

    setIsCancelling(true);

    const cancellationData = {
      appointmentId: appointmentId,
      reason: selectedReason,
      customReason: selectedReason === "others" ? otherReasonText.trim() : null,
    };


    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Appointment Cancelled",
        `Your appointment (ID: ${appointmentId}) has been successfully cancelled due to: ${
          selectedReason === "others" ? otherReasonText.trim() : selectedReason
        }.`
      );
      navigation.goBack();
    } catch (error) {
      console.error("Cancellation failed:", error);
      Alert.alert("Error", "Failed to cancel appointment. Please try again.");
    } finally {
      setIsCancelling(false);
    }
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
            onPress={handleBackPress}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cancel Appointment</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <Text style={styles.introText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          {/* Cancellation Reasons */}
          <View style={styles.reasonsContainer}>
            {cancellationReasons.map((reason) => (
              <TouchableOpacity
                key={reason.value}
                style={styles.radioButton}
                onPress={() => setSelectedReason(reason.value)}
              >
                <MaterialCommunityIcons
                  name={
                    selectedReason === reason.value
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={24}
                  color={
                    selectedReason === reason.value
                      ? COLORS.primary
                      : COLORS.iconSecondary
                  }
                />
                <Text style={styles.radioLabel}>{reason.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Other Reason Text Input */}
          {selectedReason === "others" && (
            <View style={styles.otherReasonInputContainer}>
              <Text style={styles.introText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
              <TextInput
                style={styles.reasonTextInput}
                placeholder="Enter Your Reason Here..."
                placeholderTextColor={COLORS.textPlaceholder}
                multiline
                numberOfLines={4}
                value={otherReasonText}
                onChangeText={setOtherReasonText}
              />
            </View>
          )}
          {/* Cancel Appointment Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelAppointment}
            disabled={isCancelling}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cancelButtonGradient}
            >
              {isCancelling ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  introText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  reasonsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  otherReasonInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  reasonTextInput: {
    minHeight: 100, // Make it a multi-line input
    textAlignVertical: "top", // Align text to top for multiline
    padding: 10,
    backgroundColor: COLORS.background, // A subtle background for the input
    borderRadius: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  cancelButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cancelButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default CancelAppointmentScreen;
