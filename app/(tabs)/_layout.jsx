import { Tabs } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import this hook
import { Platform } from "react-native"; // Import Platform for OS-specific adjustments

// Import your centralized colors
import { COLORS } from "../../constants/helper"; // Adjust path as per your project structure

const TabLayout = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 0,
          elevation: 8, // Increased elevation for a more pronounced modern shadow
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -3 }, // Adjusted shadow for more depth
          shadowOpacity: 0.15, // Slightly increased shadow opacity
          shadowRadius: 6, // Increased shadow radius for a softer look
          height: 65 + insets.bottom, // Dynamically adjust height for safe area + standard height
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 8, // iOS uses insets.bottom, Android a fixed padding
          paddingTop: 8, // Consistent top padding
          // Add a subtle border top for a cleaner separation if shadow isn't enough on some devices
          // borderTopColor: COLORS.secondary,
          // borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 11, // Slightly smaller font size for a cleaner look
          fontFamily: "System", // Use custom font if available
          marginBottom: Platform.OS === "ios" ? 0 : 2, // Fine-tune label position for Android
        },
        tabBarIconStyle: {
          marginTop: 0, // Ensure icons are not pushed down
        },
        tabBarAllowFontScaling: false, // Prevents text scaling based on system settings
      }}
    >
      <Tabs.Screen
        name="home" // Ensure this matches your file name, e.g., app/home.js
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size * 0.95} color={color} /> // Slightly smaller icon
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat" // e.g., app/chat.js
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size * 0.95}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile" // e.g., app/profile.js
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size * 0.95} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="calendar" // e.g., app/calendar.js
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="calendar-outline"
              size={size * 0.95}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
