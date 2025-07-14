// app/pharmacy/index.js (or app/pharmacy-screen.js)
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
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router"; // Import useRouter
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy Pharmacy Data
const DUMMY_PHARMACIES = [
  {
    id: "p1",
    name: "MediCure Pharmacy",
    icon: "medical-bag", // Example icon name
    address: "778 Locust View Drive Oakland, CA",
    schedule: "7:15 AM - 6:30 PM",
    rating: 4,
    isFavorite: true,
  },
  {
    id: "p2",
    name: "Vitality Pharmacy",
    icon: "heart-plus",
    address: "778 Locust View Drive Oakland, CA",
    schedule: "7:15 AM - 6:30 PM",
    rating: 5,
    isFavorite: false,
  },
  {
    id: "p3",
    name: "PureHealth Pharmacy",
    icon: "hospital-box",
    address: "778 Locust View Drive Oakland, CA",
    schedule: "7:15 AM - 6:30 PM",
    rating: 3,
    isFavorite: true,
  },
  {
    id: "p4",
    name: "Stay Health Pharmacy",
    icon: "needle",
    address: "778 Locust View Drive Oakland, CA",
    schedule: "7:15 AM - 6:30 PM",
    rating: 4,
    isFavorite: false,
  },
  {
    id: "p5",
    name: "GreenLeaf Pharmacy",
    icon: "leaf",
    address: "123 Green St, San Francisco, CA",
    schedule: "8:00 AM - 7:00 PM",
    rating: 5,
    isFavorite: true,
  },
];

const PharmacyScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter(); // Initialize useRouter

  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("A-Z"); // 'A-Z', 'Info', 'Favorites'

  useEffect(() => {
    // Simulate fetching pharmacy data
    const fetchPharmacies = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setPharmacies(DUMMY_PHARMACIES);
      } catch (error) {
        console.error("Failed to fetch pharmacies:", error);
        Alert.alert("Error", "Could not load pharmacies. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacies();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = (id) => {
    setPharmacies((prevPharmacies) =>
      prevPharmacies.map((pharmacy) =>
        pharmacy.id === id
          ? { ...pharmacy, isFavorite: !pharmacy.isFavorite }
          : pharmacy
      )
    );
  };

  const handlePharmacyPress = () => {
    router.push("views/pharmacy/PharmacyDetail")
  };

  const handleFilterPress = () => {
    router.push("views/pharmacy/PharmacyFilter"); // Navigate to the Pharmacy Filter screen
  };

  // Filter and sort pharmacies
  const filteredAndSortedPharmacies = [...pharmacies]
    .filter(
      (pharmacy) =>
        pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "A-Z") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Favorites") {
        // Favorites first, then A-Z
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Info") {
        // This could be based on distance, or some other "info" metric
        // For now, let's sort by rating descending for "Info"
        return b.rating - a.rating;
      }
      return 0;
    });

  const renderPharmacyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pharmacyCard}
      onPress={() => handlePharmacyPress()}
    >
      <View style={styles.pharmacyIconContainer}>
        <MaterialCommunityIcons
          name={item.icon}
          size={40}
          color={COLORS.primary}
        />
      </View>
      <View style={styles.pharmacyDetails}>
        <Text style={styles.pharmacyName}>{item.name}</Text>
        <Text style={styles.pharmacyAddress}>{item.address}</Text>
        <Text style={styles.pharmacySchedule}>{item.schedule}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.recommendedText}>Recommended</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={item.rating >= star ? "star" : "star-outline"}
              size={16}
              color={COLORS.starYellow}
              style={styles.starIcon}
            />
          ))}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleToggleFavorite(item.id)}
        style={styles.favoriteButton}
      >
        <Ionicons
          name={item.isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={item.isFavorite ? COLORS.error : COLORS.iconSecondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Pharmacy</Text>
          {/* Filter Button Added Here */}
          <TouchableOpacity
            onPress={handleFilterPress}
            style={styles.filterButton}
          >
            <Ionicons name="options-outline" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Subtitle and Search Bar */}
        <Text style={styles.headerSubtitle}>Find Your Pharmacy</Text>
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

        {/* Sort By Options */}
        <View style={styles.sortOptionsContainer}>
          <Text style={styles.sortByLabel}>Sort By</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "A-Z" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("A-Z")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "A-Z" && styles.sortButtonTextActive,
              ]}
            >
              A-Z
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "Info" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("Info")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "Info" && styles.sortButtonTextActive,
              ]}
            >
              Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "Favorites" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("Favorites")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "Favorites" && styles.sortButtonTextActive,
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading pharmacies...</Text>
        </View>
      ) : filteredAndSortedPharmacies.length > 0 ? (
        <FlatList
          data={filteredAndSortedPharmacies}
          renderItem={renderPharmacyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.pharmacyListContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noPharmaciesContainer}>
          <Text style={styles.noPharmaciesText}>No pharmacies found.</Text>
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
  filterButton: {
    // New style for the filter button
    padding: 5,
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
  sortOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Align to start
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sortByLabel: {
    fontSize: 14,
    color: COLORS.white,
    marginRight: 15,
    fontWeight: "600",
  },
  sortButton: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
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
  pharmacyListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pharmacyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pharmacyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.lightPrimary, // Light primary background for icon circle
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.primary, // Border matching the icon color
  },
  pharmacyDetails: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  pharmacyAddress: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  pharmacySchedule: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendedText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginRight: 5,
  },
  starIcon: {
    marginRight: 2,
  },
  favoriteButton: {
    padding: 5,
    marginLeft: 10,
  },
  noPharmaciesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  noPharmaciesText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default PharmacyScreen;
