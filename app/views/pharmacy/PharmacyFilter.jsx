// app/pharmacy/filter.js (or app/pharmacy-filter-screen.js)
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
  FlatList, // For efficient list rendering
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps"; // Import MapView and Marker
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy Pharmacy Data (extended with distance for filtering)
const DUMMY_PHARMACIES_FILTER = [
  {
    id: "fp1",
    name: "MediCure Pharmacy",
    address: "778 Locust View Drive Oakland, CA",
    schedule: "7:15 AM - 6:30 PM",
    rating: 4,
    distance: "2.5 Km",
    latitude: 37.8044, // Dummy latitude for map marker
    longitude: -122.2712, // Dummy longitude for map marker
  },
  {
    id: "fp2",
    name: "Vitality Pharmacy",
    address: "778 Locust View Drive Oakland, CA",
    schedule: "9:00 AM - 8:30 PM",
    rating: 5,
    distance: "5 Km",
    latitude: 37.808,
    longitude: -122.26,
  },
  {
    id: "fp3",
    name: "PureHealth Pharmacy",
    address: "778 Locust View Drive Oakland, CA",
    schedule: "7:15 AM - 6:30 PM",
    rating: 3,
    distance: "3.1 Km",
    latitude: 37.795,
    longitude: -122.28,
  },
  {
    id: "fp4",
    name: "CityCare Pharmacy",
    address: "101 Main Street, San Francisco, CA",
    schedule: "8:00 AM - 7:00 PM",
    rating: 4,
    distance: "15 Km",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: "fp5",
    name: "Downtown Drugs",
    address: "45 Market St, Oakland, CA",
    schedule: "8:30 AM - 5:30 PM",
    rating: 5,
    distance: "1.8 Km",
    latitude: 37.8,
    longitude: -122.27,
  },
];

const PharmacyFilterScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router=useRouter();
  const [city, setCity] = useState("Oakland, CA"); // Default from image
  const [address, setAddress] = useState("778 Locust View Drive"); // Default from image
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [loading, setLoading] = useState(false); // No initial loading for filter screen

  // Default map region (centered around Oakland, CA)
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.8044,
    longitude: -122.2712,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    // Simulate filtering based on initial dummy data
    applyFilters();
  }, []); // Run once on component mount

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleClearAll = () => {
    setCity("");
    setAddress("");
    setFilteredPharmacies(DUMMY_PHARMACIES_FILTER); // Reset to all pharmacies
    // Reset map to a default or wider view if all filters are cleared
    setMapRegion({
      latitude: 37.8044,
      longitude: -122.2712,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    Alert.alert("Filters Cleared", "All filter criteria have been reset.");
  };

  const applyFilters = () => {
    setLoading(true);
    // Simulate API call or complex filtering
    setTimeout(() => {
      const lowerCaseCity = city.toLowerCase();
      const lowerCaseAddress = address.toLowerCase();

      const results = DUMMY_PHARMACIES_FILTER.filter((pharmacy) => {
        const matchesCity =
          lowerCaseCity === "" ||
          pharmacy.address.toLowerCase().includes(lowerCaseCity);
        const matchesAddress =
          lowerCaseAddress === "" ||
          pharmacy.address.toLowerCase().includes(lowerCaseAddress);
        return matchesCity && matchesAddress;
      });

      // Sort by distance for a more "nearest" feel
      results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      setFilteredPharmacies(results);

      // Adjust map region to center on the first result, or default if no results
      if (results.length > 0) {
        setMapRegion({
          latitude: results[0].latitude,
          longitude: results[0].longitude,
          latitudeDelta: 0.02, // Zoom in closer
          longitudeDelta: 0.01,
        });
      } else {
        // If no results, reset to a broader default view
        setMapRegion({
          latitude: 37.8044,
          longitude: -122.2712,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }

      setLoading(false);
    }, 500); // Simulate a small delay for filtering
  };

  // Render the live map with markers
  const renderMap = () => {
    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion} // Update region when user moves map
        >
          {filteredPharmacies.map((pharmacy) => (
            <Marker
              key={pharmacy.id}
              coordinate={{
                latitude: pharmacy.latitude,
                longitude: pharmacy.longitude,
              }}
              title={pharmacy.name}
              description={pharmacy.address}
            >
              {/* Custom marker icon if desired */}
              <Ionicons
                name="location-sharp"
                size={30}
                color={COLORS.primary}
              />
            </Marker>
          ))}
        </MapView>
      </View>
    );
  };

  const renderPharmacyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pharmacyCard}
      onPress={() =>
        router.push("views/pharmacy/PharmacyDetail")
      }
    >
      <View style={styles.pharmacyLocationIcon}>
        <Ionicons name="location-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.pharmacyDetails}>
        <Text style={styles.pharmacyName}>{item.name}</Text>
        <Text style={styles.pharmacyAddress}>Address: {item.address}</Text>
        <Text style={styles.pharmacySchedule}>
          Attention Schedule: {item.schedule}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.recommendedText}>Recommended</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={item.rating >= star ? "star" : "star-outline"}
              size={14}
              color={COLORS.starYellow}
              style={styles.starIcon}
            />
          ))}
        </View>
      </View>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>Distance: {item.distance}</Text>
      </View>
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
          <Text style={styles.headerTitle}>Filter</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
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
          <Text style={styles.findPharmacyText}>
            Find your nearest pharmacy
          </Text>

          {/* City Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={COLORS.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Add Your City"
              placeholderTextColor={COLORS.textPlaceholder}
              value={city}
              onChangeText={setCity}
              onEndEditing={applyFilters} // Apply filters when editing ends
            />
            {city !== "" && (
              <TouchableOpacity
                onPress={() => {
                  setCity("");
                  applyFilters();
                }}
                style={styles.clearInputButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.iconSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color={COLORS.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Address"
              placeholderTextColor={COLORS.textPlaceholder}
              value={address}
              onChangeText={setAddress}
              onEndEditing={applyFilters} // Apply filters when editing ends
            />
            {address !== "" && (
              <TouchableOpacity
                onPress={() => {
                  setAddress("");
                  applyFilters();
                }}
                style={styles.clearInputButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.iconSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Google Map */}
          {renderMap()}

          {/* Suggested Pharmacies List */}
          <Text style={styles.suggestedPharmaciesTitle}>
            Suggested Pharmacies
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Searching pharmacies...</Text>
            </View>
          ) : filteredPharmacies.length > 0 ? (
            <FlatList
              data={filteredPharmacies}
              renderItem={renderPharmacyItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Nested FlatList in ScrollView, disable its own scrolling
              ListEmptyComponent={
                <Text style={styles.noPharmaciesText}>
                  No pharmacies found for your search criteria.
                </Text>
              }
            />
          ) : (
            <View style={styles.noPharmaciesContainer}>
              <Text style={styles.noPharmaciesText}>
                No pharmacies found for your search criteria.
              </Text>
            </View>
          )}
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
  clearAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  findPharmacyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearInputButton: {
    padding: 5,
    marginLeft: 10,
  },
  mapContainer: {
    width: "100%",
    height: 200, // Fixed height for the map
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: COLORS.lightBackground, // Fallback background
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  suggestedPharmaciesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  pharmacyListContent: {
    // No extra padding here, handled by scrollViewContent
  },
  pharmacyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "flex-start", // Align items to the top
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pharmacyLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightPrimary, // Light primary background for icon circle
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.primary, // Border matching the icon color
  },
  pharmacyDetails: {
    flex: 1,
    marginRight: 10, // Space for distance
  },
  pharmacyName: {
    fontSize: 16,
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
  distanceContainer: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-end", // Align to bottom right of the card
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
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

export default PharmacyFilterScreen;
