// app/medical-record/index.js (or app/medical-record-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions, // For responsive grid layout
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; 
const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

// Dummy User Medical Info
const DUMMY_USER_MEDICAL_INFO = {
  gender: "Female",
  bloodType: "AB +",
  age: "26 Years",
  weight: "65 Kg",
};

// Dummy Medical Record Categories
const DUMMY_MEDICAL_CATEGORIES = [
  { id: "allergies", name: "Allergies", icon: "clipboard-plus" },
  { id: "analysis", name: "Analysis", icon: "microscope" },
  { id: "vaccinations", name: "Vaccinations", icon: "needle" },
  {
    id: "medical_history",
    name: "Medical History",
    icon: "clipboard-text-multiple",
  }
];

const MedicalRecordScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const [hasRecords, setHasRecords] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate fetching user's medical records status
    const checkRecordsStatus = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
       
        setHasRecords(true); // Set to true to show the menu, false to show empty state
      } catch (error) {
        console.error("Failed to check records status:", error);
        Alert.alert("Error", "Could not load medical record status.");
      } finally {
        setLoading(false);
      }
    };
    checkRecordsStatus();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddRecords = () => {
    Alert.alert(
      "Add Records",
      "Navigating to a screen to add new medical records."
    );

    setHasRecords(true); // For demo, immediately switch to menu view
  };

  const handleCategoryPress = (categoryId) => {
   router.push(`views/record/${categoryId}`)
  };

  // Filter categories based on search query
  const filteredCategories = DUMMY_MEDICAL_CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Text style={styles.headerTitle}>Medical Record</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Conditional Header Subtitle / Search Bar */}
        {!loading && hasRecords && (
          <View>
            <Text style={styles.headerSubtitle}>
              Find Your Medical Information
            </Text>
            <View style={styles.searchBarContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color={COLORS.iconSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={COLORS.textPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        )}
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading medical records...</Text>
        </View>
      ) : hasRecords ? (
        // Medical Record Menu State
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* User Medical Info Section */}
          <TouchableOpacity onPress={()=>router.push("views/record/AddRecord")}>
            <View style={styles.medicalInfoContainer}>
              <View style={styles.medicalInfoRow}>
                <Text style={styles.medicalInfoLabel}>Gender:</Text>
                <Text style={styles.medicalInfoValue}>
                  {DUMMY_USER_MEDICAL_INFO.gender}
                </Text>
                <Text style={styles.medicalInfoLabel}>Blood Type:</Text>
                <Text style={styles.medicalInfoValue}>
                  {DUMMY_USER_MEDICAL_INFO.bloodType}
                </Text>
              </View>
              <View style={styles.medicalInfoRow}>
                <Text style={styles.medicalInfoLabel}>Age:</Text>
                <Text style={styles.medicalInfoValue}>
                  {DUMMY_USER_MEDICAL_INFO.age}
                </Text>
                <Text style={styles.medicalInfoLabel}>Weight:</Text>
                <Text style={styles.medicalInfoValue}>
                  {DUMMY_USER_MEDICAL_INFO.weight}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* Medical Record Categories Grid */}
          <View style={styles.categoriesGrid}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={50}
                    color={COLORS.primary}
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noCategoriesText}>
                No categories found for your search.
              </Text>
            )}
          </View>
        </ScrollView>
      ) : (
        // Empty State: No Medical Records Yet
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons
            name="clipboard-plus-outline"
            size={100}
            color={COLORS.iconSecondary}
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateText}>
            You Have Not Added Any Medical Records Yet
          </Text>
          <TouchableOpacity
            style={styles.addRecordsButton}
            onPress={handleAddRecords}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addRecordsButtonGradient}
            >
              <Text style={styles.addRecordsButtonText}>Add Records</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingBottom: 20, // Default padding
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
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 15,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
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
  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 50, // Adjust to push content down from header
  },
  emptyStateIcon: {
    marginBottom: 20,
    color: COLORS.primary, // Use primary color for the icon
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary, // Use primary color for text as in image
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 30,
  },
  addRecordsButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    width: "80%", // Make button wider
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addRecordsButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addRecordsButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
  // Medical Info (Menu State) Styles
  medicalInfoContainer: {
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
  medicalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  medicalInfoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
    width: "30%", // Allocate space for label
  },
  medicalInfoValue: {
    fontSize: 14,
    color: "#00BBD3",
    flex: 1, // Take remaining space
    fontWeight: "normal",
  },
  // Categories Grid
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0, // No extra padding here, handled by item margin
  },
  categoryCard: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH, // Make it square
    backgroundColor: COLORS.primary, // Solid primary color as in image
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  categoryIcon: {
    color: COLORS.white, // White icons on primary background
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  noCategoriesText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: COLORS.textSecondary,
    width: "100%",
  },
});

export default MedicalRecordScreen;
