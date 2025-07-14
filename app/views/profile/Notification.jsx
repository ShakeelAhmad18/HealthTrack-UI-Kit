// app/notifications/index.js (or app/notification-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList, // More efficient for lists
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy Notification Data
const DUMMY_NOTIFICATIONS = [
  {
    id: "n1",
    type: "Scheduled Appointment",
    icon: "calendar-check",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    time: "2 M", // 2 minutes ago
    date: "Today",
    read: false,
  },
  {
    id: "n2",
    type: "Scheduled Change",
    icon: "calendar-edit",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    time: "2 H", // 2 hours ago
    date: "Today",
    read: false,
  },
  {
    id: "n3",
    type: "Medical Notes",
    icon: "note-text",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    time: "3 H", // 3 hours ago
    date: "Today",
    read: true,
  },
  {
    id: "n4",
    type: "Scheduled Appointment",
    icon: "calendar-check",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    time: "1 D", // 1 day ago
    date: "Yesterday",
    read: false,
  },
  {
    id: "n5",
    type: "Medical History Update",
    icon: "clipboard-text",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    time: "5 D", // 5 days ago
    date: "15 April",
    read: true,
  },
  {
    id: "n6",
    type: "Reminder",
    icon: "bell-ring",
    description: "Your annual check-up is due next week.",
    time: "6 D",
    date: "15 April",
    read: false,
  },
];

const NotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate fetching notifications from an API
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setNotifications(DUMMY_NOTIFICATIONS); // Set dummy data
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        Alert.alert("Error", "Could not load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
      "Mark All as Read",
      "Are you sure you want to mark all notifications as read?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark All",
          onPress: () => {
            setNotifications(
              notifications.map((notif) => ({ ...notif, read: true }))
            );
            Alert.alert("Success", "All notifications marked as read.");
          },
        },
      ]
    );
  };

  const handleNotificationPress = (id) => {
    // Mark notification as read when pressed
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // In a real app, you would navigate to a detail screen for the notification
    Alert.alert("Notification Details", `You tapped on notification ID: ${id}`);
  };

  // Group notifications by date for rendering
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = notification.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {});

  // Filter notifications based on search query
  const filteredGroupedNotifications = Object.keys(groupedNotifications).reduce(
    (acc, date) => {
      const filtered = groupedNotifications[date].filter(
        (notif) =>
          notif.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notif.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[date] = filtered;
      }
      return acc;
    },
    {}
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
          <Text style={styles.headerTitle}>Notification</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar and Mark All */}
        <View style={styles.searchAndMarkAllContainer}>
          <View style={styles.searchBarWrapper}>
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
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Mark all</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {Object.keys(filteredGroupedNotifications).length > 0 ? (
            Object.keys(filteredGroupedNotifications).map((date) => (
              <View key={date}>
                <View style={styles.dateHeaderContainer}>
                  <Text style={styles.dateHeaderText}>{date}</Text>
                </View>
                {filteredGroupedNotifications[date].map((notif) => (
                  <TouchableOpacity
                    key={notif.id}
                    style={[
                      styles.notificationItem,
                      !notif.read && styles.unreadNotification,
                    ]}
                    onPress={() => handleNotificationPress(notif.id)}
                  >
                    <View style={styles.notificationIconContainer}>
                      <MaterialCommunityIcons
                        name={notif.icon}
                        size={24}
                        color={COLORS.primary}
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationType}>{notif.type}</Text>
                      <Text
                        style={styles.notificationDescription}
                        numberOfLines={2}
                      >
                        {notif.description}
                      </Text>
                    </View>
                    <Text style={styles.notificationTime}>{notif.time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.noNotificationsText}>
              No notifications found.
            </Text>
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
  searchAndMarkAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
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
  markAllText: {
    fontSize: 14,
    fontWeight: "600",
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dateHeaderContainer: {
    backgroundColor: COLORS.lightBackground, // A subtle background for date headers
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignSelf: "flex-start", // Fit content
  },
  dateHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
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
  unreadNotification: {
    backgroundColor: COLORS.unreadBackground, // Slightly different background for unread
    borderLeftWidth: 4, // Visual indicator for unread
    borderLeftColor: COLORS.primary,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightPrimary, // Light primary background for icon
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationType: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  noNotificationsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default NotificationScreen;
