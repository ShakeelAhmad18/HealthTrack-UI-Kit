// app/medical-record/analysis/[id].js (or app/analysis-detail-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; 

// Dummy Data for a specific Analysis Detail
const DUMMY_ANALYSIS_DETAIL = {
  id: "blood_test_1",
  type: "Blood Test",
  generalDescription:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam rutrum gravida mauris, eu commodo lectus dapibus at. Sed mattis fringilla ligula et aliquet.",
  sections: [
    {
      title: "GLUCOSE",
      items: [
        { label: "Fasting Levels", value: "12 mg/dL" },
        { label: "Oral Glucose Tolerance Test (OGTT)", value: "6 mg/dL" },
        { label: "Hemoglobin A1c (HbA1c)", value: "16 mg/dL" },
      ],
    },
    {
      title: "ELECTROLYTES",
      items: [
        { label: "Sodium", value: "10%" },
        { label: "Potassium", value: "23%" },
        { label: "Chloride", value: "12%" },
      ],
    },
    {
      title: "LIVER ENZYMES",
      items: [
        { label: "ALT", value: "6%" },
        { label: "AST", value: "19%" },
        { label: "ALP", value: "12%" },
        { label: "Bilirubin", value: "14g%" },
      ],
    },
  ],
};

const AnalysisDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams(); 

  const [analysisDetails, setAnalysisDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAnalysisDetails(DUMMY_ANALYSIS_DETAIL);
      } catch (error) {
        console.error("Failed to fetch analysis details:", error);
        Alert.alert(
          "Error",
          "Could not load analysis details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [params.id]); 

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading analysis details...</Text>
      </View>
    );
  }

  if (!analysisDetails) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Analysis details not found.</Text>
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
        {/* Analysis Overview */}
        <View style={styles.analysisOverview}>
          <Text style={styles.analysisSectionTitle}>Analysis</Text>
          <Text style={styles.analysisType}>{analysisDetails.type}</Text>
          <Text style={styles.generalDescription}>
            {analysisDetails.generalDescription}
          </Text>
        </View>

        {/* Detailed Sections */}
        {analysisDetails.sections.map((section, index) => (
          <View key={index} style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                {/* Dotted line placeholder */}
                <View style={styles.dottedLine} />
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        ))}
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
  analysisOverview: {
    marginBottom: 20,
  },
  analysisSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  analysisType: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary, // Primary color for the specific analysis type
    marginBottom: 10,
  },
  generalDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 10,
  },
  detailSection: {
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
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary, // Primary color for section titles
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-end", // Align items to the bottom
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS.textPrimary,
    flexShrink: 1, // Allow label to shrink
    marginRight: 5, // Space before dotted line
  },
  dottedLine: {
    flex: 1, // Take up available space
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: COLORS.separator,
    marginBottom: 4, // Adjust to align with text baseline
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginLeft: 5, // Space after dotted line
  },
});

export default AnalysisDetailScreen;
