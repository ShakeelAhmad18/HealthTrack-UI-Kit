// app/notification-settings/index.js (or app/notification-settings-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming you are using Expo Router
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

const NotificationSettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [settings, setSettings] = useState({
    generalNotification: true,
    sound: true,
    soundCall: true,
    vibrate: false,
    specialOffers: false,
    payments: true,
    promoAndDiscount: false,
    cashback: true,
  });
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false); 

  // Simulate fetching settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error("Failed to fetch notification settings:", error);
        Alert.alert("Error", "Could not load settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Function to handle toggle changes and persist them
  const toggleSwitch = async (settingKey) => {
    const newSettings = {
      ...settings,
      [settingKey]: !settings[settingKey],
    };
    setSettings(newSettings); // Optimistically update UI

    setSaving(true); // Indicate saving process
    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Failed to save setting '${settingKey}':`, error);
      Alert.alert(
        "Error",
        `Failed to save setting: ${
          error.message || "Please check your connection."
        }`
      );
      // Revert UI if save fails
      setSettings((prev) => ({ ...prev, [settingKey]: !prev[settingKey] }));
    } finally {
      setSaving(false); // End saving process
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Render a single notification setting item
  const NotificationItem = ({ label, settingKey }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>{label}</Text>
      <Switch
        trackColor={{ false: COLORS.mediumGrey, true: COLORS.primary }}
        thumbColor={COLORS.white}
        ios_backgroundColor={COLORS.mediumGrey}
        onValueChange={() => toggleSwitch(settingKey)}
        value={settings[settingKey]}
        disabled={saving} // Disable switch while another setting is saving
      />
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
          <Text style={styles.headerTitle}>Notification Setting</Text>
          <View style={{ width: 28 }} />
          {/* Placeholder for right icon if needed, currently empty to balance back button */}
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* General Notification */}
          <NotificationItem
            label="General Notification"
            settingKey="generalNotification"
          />

          {/* Sound */}
          <NotificationItem label="Sound" settingKey="sound" />

          {/* Sound Call */}
          <NotificationItem label="Sound Call" settingKey="soundCall" />

          {/* Vibrate */}
          <NotificationItem label="Vibrate" settingKey="vibrate" />

          {/* Special Offers */}
          <NotificationItem label="Special Offers" settingKey="specialOffers" />

          {/* Payments */}
          <NotificationItem label="Payments" settingKey="payments" />

          {/* Promo And Discount */}
          <NotificationItem
            label="Promo And Discount"
            settingKey="promoAndDiscount"
          />

          {/* Cashback */}
          <NotificationItem label="Cashback" settingKey="cashback" />

          {saving && (
            <View style={styles.savingIndicator}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.savingText}>Saving...</Text>
            </View>
          )}
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  settingText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1, // Allows text to take available space
  },
  savingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  savingText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default NotificationSettingsScreen;
