// app/payment-method/index.js (or app/payment-method-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons"; // Added FontAwesome5 for PayPal
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy Payment Methods Data
const DUMMY_PAYMENT_METHODS = [
  {
    id: "card",
    label: "Add New Card",
    icon: "credit-card-outline",
    type: "credit_debit",
  },
  { id: "apple_pay", label: "Apple Pay", icon: "apple", type: "more_options" },
  { id: "paypal", label: "Paypal", icon: "paypal", type: "more_options" },
  {
    id: "google_pay",
    label: "Google Pay",
    icon: "google-play",
    type: "more_options",
  },
];

const PaymentMethodScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router=useRouter();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null); // Stores the ID of the selected payment method

  useEffect(() => {
    // Simulate fetching payment methods
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setPaymentMethods(DUMMY_PAYMENT_METHODS);
        // Optionally pre-select a default method
        setSelectedMethod("card"); // Pre-select "Add New Card"
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        Alert.alert(
          "Error",
          "Could not load payment methods. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMethods();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    // In a real app, you might trigger an action based on selection,
    // e.g., navigate to a card input screen if "Add New Card" is selected.
  
   const method = DUMMY_PAYMENT_METHODS.find((m) => m.id === methodId)?.label;

   if(method === "Add New Card"){
    router.push("views/Payments/AddCard")
   }

    Alert.alert(
      "Payment Method Selected",
      `You selected: ${
        DUMMY_PAYMENT_METHODS.find((m) => m.id === methodId)?.label
      }`
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading payment methods...</Text>
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
          <Text style={styles.headerTitle}>Payment Method</Text>
          <View style={{ width: 28 }} />
          {/* Placeholder for right icon if needed */}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Credit & Debit Card Section */}
        <Text style={styles.sectionTitle}>Credit & Debit Card</Text>
        {paymentMethods
          .filter((method) => method.type === "credit_debit")
          .map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentOptionCard}
              onPress={() => handleSelectMethod(method.id)}
            >
              <MaterialCommunityIcons
                name={method.icon}
                size={28}
                color={COLORS.primary}
                style={styles.paymentIcon}
              />
              <Text style={styles.paymentLabel}>{method.label}</Text>
              <MaterialCommunityIcons
                name={
                  selectedMethod === method.id
                    ? "radiobox-marked"
                    : "radiobox-blank"
                }
                size={24}
                color={
                  selectedMethod === method.id
                    ? COLORS.primary
                    : COLORS.iconSecondary
                }
              />
            </TouchableOpacity>
          ))}

        {/* More Payment Option Section */}
        <Text style={styles.sectionTitle}>More Payment Option</Text>
        {paymentMethods
          .filter((method) => method.type === "more_options")
          .map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentOptionCard}
              onPress={() => handleSelectMethod(method.id)}
            >
              {method.id === "paypal" ? (
                <FontAwesome5
                  name={method.icon}
                  size={24}
                  color={COLORS.primary}
                  style={styles.paymentIcon}
                />
              ) : (
                <MaterialCommunityIcons
                  name={method.icon}
                  size={28}
                  color={COLORS.primary}
                  style={styles.paymentIcon}
                />
              )}
              <Text style={styles.paymentLabel}>{method.label}</Text>
              <MaterialCommunityIcons
                name={
                  selectedMethod === method.id
                    ? "radiobox-marked"
                    : "radiobox-blank"
                }
                size={24}
                color={
                  selectedMethod === method.id
                    ? COLORS.primary
                    : COLORS.iconSecondary
                }
              />
            </TouchableOpacity>
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
    flex: 1,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
    marginTop: 10, // Spacing between sections
  },
  paymentOptionCard: {
    flexDirection: "row",
    alignItems: "center",
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
  paymentIcon: {
    marginRight: 15,
    width: 30, // Fixed width for icons to ensure alignment
    textAlign: "center",
  },
  paymentLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1, // Allows label to take available space
  },
});

export default PaymentMethodScreen;
