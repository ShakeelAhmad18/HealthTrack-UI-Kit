import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal, // For AI Info Modal
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../../../constants/helper";
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook

const { width } = Dimensions.get("window");

const MedicationReminderScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for new reminder form
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Daily"); // Daily, Weekly, Specific Days
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [times, setTimes] = useState([new Date()]); // Array of Date objects for times
  const [showTimePickerIndex, setShowTimePickerIndex] = useState(null); // Index of time picker to show
  const [notes, setNotes] = useState("");
  const [isAddingReminder, setIsAddingReminder] = useState(false);

  // State for AI Info Modal
  const [showAiInfoModal, setShowAiInfoModal] = useState(false);
  const [aiMedicationQuery, setAiMedicationQuery] = useState(""); // Stores the medication name for the AI query
  const {
    response: aiResponse,
    loading: aiLoading,
    error: aiError,
    generateContent: generateAiContent,
  } = useGeminiApi();

  // State for reminders list
  const [reminders, setReminders] = useState([]); // { id, name, dosage, frequency, startDate, times, notes, status: 'active' | 'taken' | 'skipped' }

  useEffect(() => {
    // Dummy initial reminders for demonstration
    setReminders([
      {
        id: "r1",
        name: "Amoxicillin",
        dosage: "250mg",
        frequency: "Daily",
        startDate: new Date(),
        times: [
          new Date(new Date().setHours(9, 0, 0, 0)),
          new Date(new Date().setHours(21, 0, 0, 0)),
        ],
        notes: "Take with food.",
        status: "active",
      },
      {
        id: "r2",
        name: "Vitamin D",
        dosage: "1000 IU",
        frequency: "Weekly",
        startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        times: [new Date(new Date().setHours(12, 0, 0, 0))],
        notes: "Once a week on Tuesdays.",
        status: "active",
      },
    ]);
  }, []);

  useEffect(() => {
    // This effect runs when aiResponse or aiError changes
    if (aiResponse && showAiInfoModal) {
      // AI response will automatically appear in the modal if it's open
    }
    if (aiError) {
      Alert.alert("AI Info Error", aiError);
    }
  }, [aiResponse, aiError, showAiInfoModal]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || times[showTimePickerIndex];
    const newTimes = [...times];
    newTimes[showTimePickerIndex] = currentTime;
    setTimes(newTimes);
    setShowTimePickerIndex(null); // Close picker
  };

  const addTimeInput = () => {
    setTimes([...times, new Date()]); // Add a new time input initialized to current time
  };

  const removeTimeInput = (indexToRemove) => {
    setTimes(times.filter((_, index) => index !== indexToRemove));
  };

  const handleAddReminder = async () => {
    if (!medicationName.trim() || !dosage.trim() || times.length === 0) {
      Alert.alert(
        "Missing Information",
        "Please fill in medication name, dosage, and at least one time."
      );
      return;
    }

    setIsAddingReminder(true);

    const newReminder = {
      id: `r${Date.now()}`, // Use a more robust unique ID, e.g., timestamp
      name: medicationName.trim(),
      dosage: dosage.trim(),
      frequency,
      startDate,
      times: times.map((t) => new Date(t)), // Ensure times are copied
      notes: notes.trim(),
      status: "active",
    };

    try {
      // Simulate API call to save reminder
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setReminders((prev) => [...prev, newReminder]);
      Alert.alert("Success", "Medication reminder added!");
      // Clear form
      setMedicationName("");
      setDosage("");
      setFrequency("Daily");
      setStartDate(new Date());
      setTimes([new Date()]);
      setNotes("");
    } catch (error) {
      console.error("Failed to add reminder:", error);
      Alert.alert("Error", "Failed to add reminder. Please try again.");
    } finally {
      setIsAddingReminder(false);
    }
  };

  const handleMarkAsTaken = (id) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, status: "taken" } : r))
    );
    Alert.alert("Success", "Medication marked as taken.");
  };

  const handleSkipReminder = (id) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, status: "skipped" } : r))
    );
    Alert.alert("Skipped", "Medication reminder skipped.");
  };

  const handleAskAIAboutMedication = async () => {
    if (!medicationName.trim()) {
      Alert.alert(
        "Medication Name Required",
        "Please enter a medication name before asking the AI."
      );
      return;
    }
    setAiMedicationQuery(medicationName.trim()); // Set the query for the modal title
    setShowAiInfoModal(true); // Open the modal
    const prompt = `Provide detailed information about the medication "${medicationName.trim()}", including its common uses, typical dosage, potential side effects, and important precautions. Keep the language clear and concise, suitable for a general user. Do not provide medical advice or diagnosis.`;
    await generateAiContent(prompt); // Trigger AI call
  };

  const renderReminderItem = ({ item }) => (
    <View key={item.id} style={styles.reminderCard}>
     
      {/* Key added here */}
      <View style={styles.reminderInfo}>
        <MaterialCommunityIcons name="pill" size={24} color={COLORS.primary} />
        <View style={styles.reminderTextContent}>
          <Text style={styles.reminderName}>
            {item.name} - {item.dosage}
          </Text>
          <Text style={styles.reminderDetails}>
            {item.frequency} |
            {item.times
              .map((t) =>
                t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              )
              .join(", ")}
          </Text>
          {item.notes ? (
            <Text style={styles.reminderNotes}>{item.notes}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.reminderActions}>
        {item.status === "active" ? (
          <>
            <TouchableOpacity
              onPress={() => handleMarkAsTaken(item.id)}
              style={styles.actionIconCircle}
            >
              <Ionicons
                name="checkmark-circle"
                size={30}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSkipReminder(item.id)}
              style={styles.actionIconCircle}
            >
              <Ionicons name="close-circle" size={30} color={COLORS.error} />
            </TouchableOpacity>
          </>
        ) : (
          <Text
            style={[
              styles.reminderStatusText,
              item.status === "taken"
                ? styles.statusTaken
                : styles.statusSkipped,
            ]}
          >
            {item.status === "taken" ? "Taken" : "Skipped"}
          </Text>
        )}
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
          <Text style={styles.headerTitle}>Medication Reminders</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={styles.headerSubtitle}>
          Manage your medication schedule
        </Text>
      </LinearGradient>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Add New Reminder Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Add New Reminder</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Medication Name</Text>
              <View style={styles.medicationInputRow}>
                <TextInput
                  style={styles.textInputMedicationName}
                  placeholder="e.g., Ibuprofen"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={medicationName}
                  onChangeText={setMedicationName}
                  editable={!isAddingReminder}
                />
                <TouchableOpacity
                  style={styles.aiInfoButton}
                  onPress={handleAskAIAboutMedication}
                  disabled={isAddingReminder || !medicationName.trim()}
                >
                  <MaterialCommunityIcons
                    name="robot-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dosage</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 200mg, 1 tablet"
                placeholderTextColor={COLORS.textPlaceholder}
                value={dosage}
                onChangeText={setDosage}
                editable={!isAddingReminder}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <View style={styles.frequencyButtonsContainer}>
                {["Daily", "Weekly", "Specific Days"].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      frequency === freq && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setFrequency(freq)}
                    disabled={isAddingReminder}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        frequency === freq && styles.frequencyButtonTextActive,
                      ]}
                    >
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateInputTouchable}
                disabled={isAddingReminder}
              >
                <TextInput
                  style={[styles.textInput, styles.dateInput]}
                  value={startDate.toLocaleDateString()}
                  editable={false}
                  placeholder="Select Date"
                  placeholderTextColor={COLORS.textPlaceholder}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="datePicker"
                  value={startDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Times</Text>
              {times.map((time, index) => (
                <View key={index} style={styles.timeInputRow}>
                  <TouchableOpacity
                    onPress={() => setShowTimePickerIndex(index)}
                    style={styles.timeInputTouchable}
                    disabled={isAddingReminder}
                  >
                    <TextInput
                      style={[styles.textInput, styles.timeInput]}
                      value={time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      editable={false}
                      placeholder="Select Time"
                      placeholderTextColor={COLORS.textPlaceholder}
                    />
                  </TouchableOpacity>
                  {times.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeTimeInput(index)}
                      style={styles.removeTimeButton}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={24}
                        color={COLORS.error}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                onPress={addTimeInput}
                style={styles.addTimeButton}
                disabled={isAddingReminder}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.addTimeButtonText}>Add Another Time</Text>
              </TouchableOpacity>
              {showTimePickerIndex !== null && (
                <DateTimePicker
                  testID="timePicker"
                  value={times[showTimePickerIndex]}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onTimeChange}
                />
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="e.g., Take with food, before bed"
                placeholderTextColor={COLORS.textPlaceholder}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                editable={!isAddingReminder}
              />
            </View>
            <TouchableOpacity
              style={styles.saveReminderButton}
              onPress={handleAddReminder}
              disabled={isAddingReminder}
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveReminderButtonGradient}
              >
                {isAddingReminder ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.saveReminderButtonText}>
                    Save Reminder
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {/* Upcoming Reminders Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
            {reminders.filter((r) => r.status === "active").length > 0 ? (
              reminders
                .filter((r) => r.status === "active")
                .map((item) => renderReminderItem({ item }))
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="bell-plus-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  No active reminders. Add one above!
                </Text>
              </View>
            )}
          </View>
          {/* Past/Completed/Skipped Reminders Section (Optional) */}
          {reminders.filter((r) => r.status !== "active").length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Past Reminders</Text>
              {reminders
                .filter((r) => r.status !== "active")
                .map((item) => renderReminderItem({ item }))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* AI Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAiInfoModal}
        onRequestClose={() => setShowAiInfoModal(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalHeader}>
              <Text style={modalStyles.modalTitle}>
                AI Medication Info: {aiMedicationQuery}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAiInfoModal(false)}
                style={modalStyles.closeButton}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={30}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={modalStyles.modalContent}>
              {aiLoading ? (
                <View style={modalStyles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={modalStyles.loadingText}>
                    Fetching info from AI...
                  </Text>
                </View>
              ) : aiError ? (
                <View style={modalStyles.errorContainer}>
                  <Ionicons
                    name="warning-outline"
                    size={24}
                    color={COLORS.error}
                  />
                  <Text style={modalStyles.errorText}>{aiError}</Text>
                </View>
              ) : aiResponse ? (
                <Text style={modalStyles.aiResponseText}>{aiResponse}</Text>
              ) : (
                <Text style={modalStyles.placeholderText}>
                  No information available yet. Enter a medication name and ask
                  the AI!
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 10,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 15,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
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
  medicationInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  textInputMedicationName: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  aiInfoButton: {
    padding: 10,
    marginRight: 5,
  },
  frequencyButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  frequencyButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: COLORS.background,
  },
  frequencyButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  frequencyButtonTextActive: {
    color: COLORS.white,
  },
  dateInputTouchable: {
    width: "100%",
  },
  dateInput: {
    // Specific styles for date input if needed
  },
  timeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  timeInputTouchable: {
    flex: 1,
  },
  timeInput: {
    // Specific styles for time input if needed
  },
  removeTimeButton: {
    marginLeft: 10,
    padding: 5,
  },
  addTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.lightBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addTimeButtonText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  saveReminderButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveReminderButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveReminderButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
  // Reminder List Styles
  reminderCard: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reminderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  reminderTextContent: {
    marginLeft: 10,
    flex: 1,
  },
  reminderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  reminderDetails: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  reminderNotes: {
    fontSize: 12,
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },
  reminderActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIconCircle: {
    marginLeft: 10,
    padding: 2,
  },
  reminderStatusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  statusTaken: {
    color: COLORS.primary,
  },
  statusSkipped: {
    color: COLORS.error,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  placeholderText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    opacity: 0.7,
  },
});

// Modal Styles
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    backgroundColor: COLORS.lightBackground,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "20",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.error,
    flexShrink: 1,
  },
  aiResponseText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  placeholderText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: 30,
  },
});

export default MedicationReminderScreen;
