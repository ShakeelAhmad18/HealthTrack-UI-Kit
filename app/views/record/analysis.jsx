// app/medical-record/analysis.js (or app/analysis-screen.js)
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Ensure MaterialCommunityIcons is imported
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy Analysis Data
const DUMMY_ANALYSIS_RECORDS = [
  {
    id: "a1",
    type: "Blood Test",
    details: "Glucose: Elevated levels may indicate diabetes.",
    addedDate: "10 February 20XX",
    timestamp: new Date("20XX-02-10T09:00:00").getTime(),
  },
  {
    id: "a2",
    type: "Urine Tests",
    details:
      "Color, and Odor: Abnormalities may indicate urinary tract infections or kidney disease.",
    addedDate: "06 June 20XX",
    timestamp: new Date("20XX-06-06T10:30:00").getTime(),
  },
  {
    id: "a3",
    type: "Lipid Profile",
    details:
      "Triglycerides: Elevated levels may indicate increased cardiovascular risk.",
    addedDate: "20 October 20XX",
    timestamp: new Date("20XX-10-20T11:45:00").getTime(),
  },
  {
    id: "a4",
    type: "Thyroid Tests",
    details: "T3 and T4: Abnormal levels may indicate thyroid dysfunction.",
    addedDate: "20 October 20XX",
    timestamp: new Date("20XX-10-20T12:00:00").getTime(),
  },
  {
    id: "a5",
    type: "Complete Blood Count (CBC)",
    details: "Hemoglobin: Low levels may indicate anemia.",
    addedDate: "01 January 20XX",
    timestamp: new Date("20XX-01-01T08:00:00").getTime(),
  },
];

const AnalysisScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const [analysisRecords, setAnalysisRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest'
  const [selectedDate, setSelectedDate] = useState({
    day: "",
    month: "",
    year: "",
  }); // For date filtering

  useEffect(() => {
    // Simulate fetching analysis records
    const fetchAnalysisRecords = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAnalysisRecords(DUMMY_ANALYSIS_RECORDS);
      } catch (error) {
        console.error("Failed to fetch analysis records:", error);
        Alert.alert(
          "Error",
          "Could not load analysis records. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysisRecords();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDownload = (recordId) => {
    Alert.alert("Download", `Downloading record ID: ${recordId}`);
    // In a real app, trigger a file download
  };

  // Sorting and Filtering Logic
  const sortedAndFilteredRecords = [...analysisRecords]
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.timestamp - a.timestamp;
      } else if (sortBy === "oldest") {
        return a.timestamp - b.timestamp;
      }
      return 0; // No change if no valid sort option
    })
    .filter((record) => {
      // Basic date filtering (can be enhanced for full date picker logic)
      const recordDate = new Date(record.timestamp);
      const dayMatch = selectedDate.day
        ? recordDate.getDate() === parseInt(selectedDate.day)
        : true;
      const monthMatch = selectedDate.month
        ? recordDate.getMonth() + 1 === parseInt(selectedDate.month)
        : true;
      const yearMatch = selectedDate.year
        ? recordDate.getFullYear() === parseInt(selectedDate.year)
        : true;
      return dayMatch && monthMatch && yearMatch;
    });

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

        {/* Analysis Section Title */}
        <View style={styles.analysisHeader}>
          <Text style={styles.analysisTitle}>Analysis</Text>
        </View>

        {/* Search/Sort/Filter Options */}
        <View style={styles.filterOptionsContainer}>
          <Text style={styles.searchByText}>Search By:</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "newest" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("newest")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "newest" && styles.sortButtonTextActive,
              ]}
            >
              Newest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "oldest" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("oldest")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "oldest" && styles.sortButtonTextActive,
              ]}
            >
              Oldest
            </Text>
          </TouchableOpacity>

          <View style={styles.dateFilterContainer}>
            <Text style={styles.dateLabel}>Date:</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="D"
              placeholderTextColor={COLORS.textPlaceholder}
              keyboardType="numeric"
              maxLength={2}
              value={selectedDate.day}
              onChangeText={(text) =>
                setSelectedDate({ ...selectedDate, day: text })
              }
            />
            <TextInput
              style={styles.dateInput}
              placeholder="M"
              placeholderTextColor={COLORS.textPlaceholder}
              keyboardType="numeric"
              maxLength={2}
              value={selectedDate.month}
              onChangeText={(text) =>
                setSelectedDate({ ...selectedDate, month: text })
              }
            />
            <TextInput
              style={styles.dateInput}
              placeholder="Y"
              placeholderTextColor={COLORS.textPlaceholder}
              keyboardType="numeric"
              maxLength={4}
              value={selectedDate.year}
              onChangeText={(text) =>
                setSelectedDate({ ...selectedDate, year: text })
              }
            />
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading analysis records...</Text>
        </View>
      ) : sortedAndFilteredRecords.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {sortedAndFilteredRecords.map((record) => (
            // Key prop moved to the outermost TouchableOpacity
            <TouchableOpacity
              key={record.id}
              onPress={() => router.push("views/record/analysisDetail")}
            >
              <View style={styles.analysisCard}>
                <View style={styles.analysisContent}>
                  <MaterialCommunityIcons
                    name="circle-outline" // Icon for radio-like selection
                    size={24}
                    color={COLORS.primary}
                    style={styles.analysisIcon}
                  />
                  <View style={styles.analysisTextContainer}>
                    <Text style={styles.analysisType}>{record.type}</Text>
                    <Text style={styles.analysisDetails}>{record.details}</Text>
                    <Text style={styles.analysisAddedInfo}>
                      Added Manually {record.addedDate}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDownload(record.id)}>
                    {/* Changed to MaterialCommunityIcons for download icon */}
                    <MaterialCommunityIcons
                      name="download-circle"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noRecordsContainer}>
          <Text style={styles.noRecordsText}>No analysis records found.</Text>
        </View>
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
  analysisHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white, // White text on gradient header
  },
  filterOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", // Allow wrapping for smaller screens
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchByText: {
    fontSize: 14,
    color: COLORS.white,
    marginRight: 10,
    fontWeight: "600",
  },
  sortButton: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8, // For wrapping
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  sortButtonTextActive: {
    color: COLORS.white,
  },
  dateFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 8, // Increased padding for better visibility
    paddingHorizontal: 10,
    marginBottom: 8, // For wrapping
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  dateLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginRight: 5,
    fontWeight: "600",
  },
  dateInput: {
    width: 35, // Slightly increased width
    height: 35, // Increased height for better touchability
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background, // Explicit background for visibility
    borderRadius: 8, // Slightly rounded corners for inputs
    borderWidth: 1, // Added border for definition
    borderColor: COLORS.separator,
    marginHorizontal: 3, // Increased margin
    paddingHorizontal: 2,
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  analysisCard: {
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
  analysisContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  analysisIcon: {
    marginRight: 10,
  },
  analysisTextContainer: {
    flex: 1,
    marginRight: 10, // Space for download icon
  },
  analysisType: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  analysisDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 5,
  },
  analysisAddedInfo: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  noRecordsContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  noRecordsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default AnalysisScreen;
