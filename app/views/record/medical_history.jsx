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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper";
import * as Print from "expo-print"; // For PDF generation
import * as Sharing from "expo-sharing"; // For sharing PDF

// Dummy Data for Medical History
const DUMMY_MEDICAL_HISTORY = {
  inControl: {
    condition: "Paroxysmal Tachycardia",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  treatmentPlan: [
    { id: "tp1", dose: "Lorem ipsum dolor 5mg (Morning)" },
    { id: "tp2", dose: "Lorem ipsum dolor 15mg (Night)" },
  ],
  downloadHistory: [
    {
      id: "dh1",
      date: { day: "24", month: "01", year: "24" },
      doctor: {
        id: "doc1",
        name: "Dr. Emma Hall, M.D.",
        specialty: "General Doctor",
        isFavorite: true,
      },
    },
    {
      id: "dh2",
      date: { day: "20", month: "01", year: "24" },
      doctor: {
        id: "doc2",
        name: "Dr. James Taylor, M.D.",
        specialty: "General Doctor",
        isFavorite: false,
      },
    },
    {
      id: "dh3",
      date: { day: "15", month: "12", year: "23" },
      doctor: {
        id: "doc3",
        name: "Dr. Olivia White, M.D.",
        specialty: "Cardiologist",
        isFavorite: true,
      },
    },
  ],
};

const MedicalHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDownloadDate, setSelectedDownloadDate] = useState({
    day: "24",
    month: "01",
    year: "24",
  }); // Default from image
  const [selectedDoctorForDownload, setSelectedDoctorForDownload] =
    useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMedicalHistory(DUMMY_MEDICAL_HISTORY);
        if (DUMMY_MEDICAL_HISTORY.downloadHistory.length > 0) {
          setSelectedDoctorForDownload(
            DUMMY_MEDICAL_HISTORY.downloadHistory[0].doctor.id
          );
        }
      } catch (error) {
        console.error("Failed to fetch medical history:", error);
        Alert.alert(
          "Error",
          "Could not load medical history. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalHistory();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInfoPress = (doctorName) => {
    Alert.alert("Doctor Info", `View details for ${doctorName}`);
  };

  const generatePdfContent = (history) => {
    if (!history) return "<h1>Medical History Not Available</h1>";

    const selectedDoc = history.downloadHistory.find(
      (dh) =>
        dh.doctor.id === selectedDoctorForDownload &&
        dh.date.day === selectedDownloadDate.day &&
        dh.date.month === selectedDownloadDate.month &&
        dh.date.year === selectedDownloadDate.year
    );

    const doctorName = selectedDoc ? selectedDoc.doctor.name : "N/A";
    const appointmentDate = selectedDoc
      ? `${selectedDoc.date.day}/${selectedDoc.date.month}/${selectedDoc.date.year}`
      : "N/A";

    const inControlHtml = `
      <h2>In Control</h2>
      <p><strong>Condition:</strong> ${history.inControl.condition}</p>
      <p><strong>Description:</strong> ${history.inControl.description}</p>
    `;

    const treatmentPlanHtml = `
      <h2>Treatment Plan</h2>
      <ul>
        ${history.treatmentPlan.map((item) => `<li>${item.dose}</li>`).join("")}
      </ul>
    `;

    const downloadInfoHtml = `
      <h3>Download Details:</h3>
      <p><strong>Doctor:</strong> ${doctorName}</p>
      <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
    `;

    return `
      <h1>Medical History Report</h1>
      ${inControlHtml}
      ${treatmentPlanHtml}
      ${downloadInfoHtml}
      <p style="text-align: center; margin-top: 30px;">Generated on: ${new Date().toLocaleDateString()}</p>
    `;
  };

  const handleDownloadPdf = async () => {
    if (
      !medicalHistory ||
      !selectedDoctorForDownload ||
      !selectedDownloadDate.day ||
      !selectedDownloadDate.month ||
      !selectedDownloadDate.year
    ) {
      Alert.alert(
        "Selection Required",
        "Please select an appointment date and a doctor to download."
      );
      return;
    }

    setIsDownloading(true);

    try {
      const htmlContent = generatePdfContent(medicalHistory);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (uri) {
        Alert.alert(
          "PDF Generated",
          "Your medical history PDF has been generated."
        );
        // Option to share the PDF
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            UTI: ".pdf",
          });
        } else {
          Alert.alert(
            "Sharing Not Available",
            "PDF generated, but sharing is not available on this device."
          );
        }
      } else {
        Alert.alert("Error", "Failed to generate PDF.");
      }
    } catch (error) {
      console.error("PDF generation/sharing error:", error);
      Alert.alert(
        "Error",
        "An error occurred while generating or sharing the PDF."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const renderDateInputs = (dateObject, onDateChange) => (
    <View style={styles.dateInputRow}>
      <TextInput
        style={styles.dateInput}
        placeholder="D"
        placeholderTextColor={COLORS.textPlaceholder}
        keyboardType="numeric"
        maxLength={2}
        value={dateObject.day}
        onChangeText={(text) => onDateChange({ ...dateObject, day: text })}
      />
      <TextInput
        style={styles.dateInput}
        placeholder="M"
        placeholderTextColor={COLORS.textPlaceholder}
        keyboardType="numeric"
        maxLength={2}
        value={dateObject.month}
        onChangeText={(text) => onDateChange({ ...dateObject, month: text })}
      />
      <TextInput
        style={styles.dateInput}
        placeholder="Y"
        placeholderTextColor={COLORS.textPlaceholder}
        keyboardType="numeric"
        maxLength={4}
        value={dateObject.year}
        onChangeText={(text) => onDateChange({ ...dateObject, year: text })}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading medical history...</Text>
      </View>
    );
  }

  if (!medicalHistory) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Medical history not found.</Text>
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
          <Text style={styles.headerTitle}>Medical Record</Text>
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
        {/* Medical History Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.mainSectionTitle}>Medical History</Text>
        </View>
        {/* In Control Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>In Control</Text>
          <Text style={styles.conditionName}>
            {medicalHistory.inControl.condition}
          </Text>
          <Text style={styles.conditionDescription}>
            {medicalHistory.inControl.description}
          </Text>
        </View>
        {/* Treatment Plan Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Treatment Plan</Text>
          {medicalHistory.treatmentPlan.map((item) => (
            <Text key={item.id} style={styles.treatmentDose}>
              {item.dose}
            </Text>
          ))}
        </View>
        {/* Download History Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Download history</Text>
          <View style={styles.downloadFilterRow}>
            <Text style={styles.downloadLabel}>Appointment Date</Text>
            {renderDateInputs(selectedDownloadDate, setSelectedDownloadDate)}
          </View>

          <TouchableOpacity style={styles.doctorDropdown}>
            <Text style={styles.doctorDropdownText}>
              {selectedDoctorForDownload
                ? medicalHistory.downloadHistory.find(
                    (dh) => dh.doctor.id === selectedDoctorForDownload
                  )?.doctor.name
                : "Select Doctor"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          {/* Doctor selection list */}
          {medicalHistory.downloadHistory.map((item) => (
            <TouchableOpacity
              key={item.doctor.id}
              style={styles.doctorSelectionItem}
              onPress={() => setSelectedDoctorForDownload(item.doctor.id)}
            >
              <MaterialCommunityIcons
                name={
                  selectedDoctorForDownload === item.doctor.id
                    ? "radiobox-marked"
                    : "radiobox-blank"
                }
                size={24}
                color={
                  selectedDoctorForDownload === item.doctor.id
                    ? COLORS.primary
                    : COLORS.iconSecondary
                }
              />
              <Text style={styles.doctorSelectionName}>{item.doctor.name}</Text>
              <Text style={styles.doctorSelectionSpecialty}>
                {item.doctor.specialty}
              </Text>
              <TouchableOpacity
                onPress={() => handleInfoPress(item.doctor.name)}
                style={styles.doctorInfoButton}
              >
                <Text style={styles.doctorInfoButtonText}>Info</Text>
              </TouchableOpacity>
              <Ionicons
                name={item.doctor.isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={
                  item.doctor.isFavorite ? COLORS.error : COLORS.iconSecondary
                }
                style={styles.doctorFavoriteIcon}
              />
            </TouchableOpacity>
          ))}

          {/* Download Button */}
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadPdf}
            disabled={isDownloading}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.downloadButtonGradient}
            >
              {isDownloading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.downloadButtonText}>Download</Text>
              )}
            </LinearGradient>
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
  },
  sectionTitleContainer: {
    marginBottom: 15,
  },
  mainSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  card: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  // In Control Section
  conditionName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  conditionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  // Treatment Plan Section
  treatmentDose: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 5,
    marginLeft: 10, // Indent for list-like appearance
  },
  // Download History Section
  downloadFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  downloadLabel: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginRight: 10,
  },
  dateInputRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  dateInput: {
    width: 35,
    height: 35,
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.separator,
    marginHorizontal: 2,
    paddingHorizontal: 2,
  },
  doctorDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.separator,
    marginBottom: 15,
  },
  doctorDropdownText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  doctorSelectionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  doctorSelectionName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  doctorSelectionSpecialty: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  doctorInfoButton: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  doctorInfoButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  doctorFavoriteIcon: {
    marginLeft: 10,
  },
  downloadButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  downloadButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default MedicalHistoryScreen;
