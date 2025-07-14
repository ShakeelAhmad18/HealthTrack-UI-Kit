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
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; 

// Dummy Data for Vaccinations
const DUMMY_VACCINATIONS = {
  history: [
    { id: "h1", name: "Covid", date: { day: "18", month: "08", year: "20" } },
    { id: "h2", name: "Tetanus", date: { day: "09", month: "02", year: "19" } },
    { id: "h3", name: "Typus", date: { day: "22", month: "06", year: "18" } },
    {
      id: "h4",
      name: "Hepatitis",
      date: { day: "15", month: "09", year: "17" },
    },
  ],
  upcoming: [
    {
      id: "u1",
      name: "Human Papillomavirus (HPV)",
      dose: "Second Dose",
      date: { day: "18", month: "02", year: "24" },
    },
    {
      id: "u2",
      name: "Human Papillomavirus (HPV)",
      dose: "Third Dose",
      date: { day: "", month: "", year: "" },
    },
  ],
};

const VaccinationsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [vaccinations, setVaccinations] = useState({
    history: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);

  const [upcomingHpvThirdDoseDate, setUpcomingHpvThirdDoseDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  useEffect(() => {
    const fetchVaccinations = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setVaccinations(DUMMY_VACCINATIONS);
        const thirdDose = DUMMY_VACCINATIONS.upcoming.find(
          (v) => v.dose === "Third Dose"
        );
        if (thirdDose) {
          setUpcomingHpvThirdDoseDate(thirdDose.date);
        }
      } catch (error) {
        console.error("Failed to fetch vaccinations:", error);
        Alert.alert(
          "Error",
          "Could not load vaccinations data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchVaccinations();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSaveUpcomingVaccination = () => {
    if (
      !upcomingHpvThirdDoseDate.day ||
      !upcomingHpvThirdDoseDate.month ||
      !upcomingHpvThirdDoseDate.year
    ) {
      Alert.alert(
        "Missing Date",
        "Please enter a complete date for the third dose."
      );
      return;
    }
    Alert.alert(
      "Save Upcoming Vaccination",
      `Saving HPV Third Dose on: ${upcomingHpvThirdDoseDate.day}/${upcomingHpvThirdDoseDate.month}/${upcomingHpvThirdDoseDate.year}`
    );
    setVaccinations((prev) => ({
      ...prev,
      upcoming: prev.upcoming.map((v) =>
        v.dose === "Third Dose" ? { ...v, date: upcomingHpvThirdDoseDate } : v
      ),
    }));
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
        <Text style={styles.loadingText}>Loading vaccinations...</Text>
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
        {/* Vaccinations Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.mainSectionTitle}>Vaccinations</Text>
        </View>
        {/* Immunisation History */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Immunisation history</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableNameHeader}> </Text>
            {/* Empty for alignment */}
            <Text style={styles.tableDateHeader}>D</Text>
            <Text style={styles.tableDateHeader}>M</Text>
            <Text style={styles.tableDateHeader}>Y</Text>
          </View>
          {vaccinations.history.length > 0 ? (
            vaccinations.history.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.tableItemName}>{item.name}</Text>
                <Text style={styles.tableItemDate}>{item.date.day}</Text>
                <Text style={styles.tableItemDate}>{item.date.month}</Text>
                <Text style={styles.tableItemDate}>{item.date.year}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No history available.</Text>
          )}
        </View>
        {/* Next Immunisations Due */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Immunisations due</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableNameHeader}> </Text>
            {/* Empty for alignment */}
            <Text style={styles.tableDateHeader}>D</Text>
            <Text style={styles.tableDateHeader}>M</Text>
            <Text style={styles.tableDateHeader}>Y</Text>
          </View>
          {vaccinations.upcoming.length > 0 ? (
            vaccinations.upcoming.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.tableItemName}>{item.name}</Text>
                {item.dose && (
                  <Text style={[styles.tableItemDose, { flexShrink: 1 }]}>
                    {item.dose}
                  </Text> 
                )}
                {item.dose === "Third Dose" && item.id === "u2" ? ( 
                  renderDateInputs(
                    upcomingHpvThirdDoseDate,
                    setUpcomingHpvThirdDoseDate
                  )
                ) : (
                  <>
                    <Text style={styles.tableItemDate}>{item.date.day}</Text>
                    <Text style={styles.tableItemDate}>{item.date.month}</Text>
                    <Text style={styles.tableItemDate}>{item.date.year}</Text>
                  </>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No upcoming immunisations.</Text>
          )}
          {/* Save Button for editable upcoming vaccination */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveUpcomingVaccination}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Upcoming</Text>
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
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    marginBottom: 10,
  },
  tableNameHeader: {
    flex: 2, // Allocate more space for name
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  tableDateHeader: {
    flex: 0.5, // Allocate space for D, M, Y
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightSeparator,
  },
  tableItemName: {
    flex: 2,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  tableItemDose: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 5,
    flex: 2, // Adjust flex to fit
  },
  tableItemDate: {
    flex: 0.5,
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  dateInputRow: {
    flexDirection: "row",
    flex: 1.8, // Increased flex to give more space to inputs
    justifyContent: "space-around",
    alignItems: "center",
  },
  dateInput: {
    width: 32, // Slightly reduced width
    height: 35,
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.separator,
    marginHorizontal: 1, // Reduced horizontal margin
    paddingHorizontal: 2,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingVertical: 20,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default VaccinationsScreen;
