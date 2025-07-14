import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps"; 
import { COLORS } from "../../../constants/helper"; 

const { width } = Dimensions.get("window");

// Dummy Pharmacy Detail Data
const DUMMY_PHARMACY_DETAIL = {
  id: "p1",
  name: "MediCure Pharmacy",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus nulla ac porttitor rutrum. Praesent dui ante, aliquet sit amet est at, ornare imperdiet massa.",
  address: "778 Locust View Drive Oakland, CA",
  phone: "(323) 302-9912",
  schedule: "7:15 AM - 6:30 PM",
  days: "Monday To Saturday",
  rating: 4,
  isFavorite: true,
  latitude: 37.8044, // Example coordinates for MediCure Pharmacy
  longitude: -122.2712,
  userFrequency: [
    { time: "7:15 AM - 12:00 PM", percentage: 20 },
    { time: "1:00 PM - 4:00 PM", percentage: 50 },
    { time: "5:00 PM - 6:30 PM", percentage: 80 },
  ],
};

const PharmacyDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams(); // To get the pharmacy ID

  const [pharmacyDetails, setPharmacyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: DUMMY_PHARMACY_DETAIL.latitude,
    longitude: DUMMY_PHARMACY_DETAIL.longitude,
    latitudeDelta: 0.005, // Zoom in very close for detail
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    // Simulate fetching pharmacy details based on ID from params
    const fetchDetails = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // In a real app, you would fetch data based on params.id
        setPharmacyDetails(DUMMY_PHARMACY_DETAIL);
        setMapRegion({
          latitude: DUMMY_PHARMACY_DETAIL.latitude,
          longitude: DUMMY_PHARMACY_DETAIL.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch (error) {
        console.error("Failed to fetch pharmacy details:", error);
        Alert.alert(
          "Error",
          "Could not load pharmacy details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [params.id]); // Re-fetch if pharmacy ID changes

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    if (pharmacyDetails) {
      setPharmacyDetails((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
      Alert.alert(
        "Favorite Status",
        pharmacyDetails.isFavorite
          ? "Removed from favorites."
          : "Added to favorites!"
      );
      // In a real app, update backend
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading pharmacy details...</Text>
      </View>
    );
  }

  if (!pharmacyDetails) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Pharmacy details not found.</Text>
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
          <Text style={styles.headerTitle}>{pharmacyDetails.name}</Text>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={pharmacyDetails.isFavorite ? "heart" : "heart-outline"}
              size={28}
              color={pharmacyDetails.isFavorite ? COLORS.error : COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Pharmacy Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.pharmacyNameInCard}>{pharmacyDetails.name}</Text>
          <Text style={styles.pharmacyDescription}>
            {pharmacyDetails.description}
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{pharmacyDetails.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{pharmacyDetails.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Attention schedule:</Text>
            <View>
              <Text style={styles.detailValue}>{pharmacyDetails.schedule}</Text>
              <Text style={styles.detailValueDays}>{pharmacyDetails.days}</Text>
            </View>
          </View>
        </View>

        {/* User Frequency Section */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>User Frequency</Text>
          {pharmacyDetails.userFrequency.map((freq, index) => (
            <View key={index} style={styles.frequencyRow}>
              <Text style={styles.frequencyTime}>{freq.time}</Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${freq.percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.frequencyPercentage}>{freq.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Recommended & Map Section */}
        <View style={styles.infoCard}>
          <View style={styles.recommendedContainer}>
            <Text style={styles.recommendedText}>Recommended</Text>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={pharmacyDetails.rating >= star ? "star" : "star-outline"}
                size={20}
                color={COLORS.starYellow}
                style={styles.starIcon}
              />
            ))}
          </View>
          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
              onRegionChangeComplete={setMapRegion}
            >
              <Marker
                coordinate={{
                  latitude: pharmacyDetails.latitude,
                  longitude: pharmacyDetails.longitude,
                }}
                title={pharmacyDetails.name}
                description={pharmacyDetails.address}
              >
                <Ionicons
                  name="location-sharp"
                  size={35}
                  color={COLORS.primary}
                />
              </Marker>
            </MapView>
            {/* Navigation Arrows for map (dummy functionality) */}
            <TouchableOpacity
              style={[styles.mapNavButton, styles.mapNavLeft]}
              onPress={() => Alert.alert("Map Navigation", "Navigate Left")}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mapNavButton, styles.mapNavRight]}
              onPress={() => Alert.alert("Map Navigation", "Navigate Right")}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
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
    flexShrink: 1, // Allow title to shrink
    textAlign: "center",
  },
  favoriteButton: {
    padding: 5,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
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
  pharmacyNameInCard: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary, // Primary color for the pharmacy name in card
    marginBottom: 10,
  },
  pharmacyDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start", // Align label and value to top
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginRight: 10,
    width: 120, // Fixed width for labels to align values
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.textSecondary,
    flex: 1, // Take remaining space
  },
  detailValueDays: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  // User Frequency
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  frequencyTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
    width: 120, // Fixed width for time labels
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightBackground,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary, // Primary color for progress
    borderRadius: 4,
  },
  frequencyPercentage: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  // Recommended & Map
  recommendedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center", // Center align stars
  },
  recommendedText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginRight: 10,
  },
  starIcon: {
    marginRight: 3,
  },
  mapContainer: {
    width: "100%",
    height: 200, // Fixed height for the map
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
    backgroundColor: COLORS.lightBackground, // Fallback background
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    position: "relative", // For absolute positioning of nav buttons
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapNavButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -12 }], // Center vertically
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  mapNavLeft: {
    left: 10,
  },
  mapNavRight: {
    right: 10,
  },
});

export default PharmacyDetailScreen;
