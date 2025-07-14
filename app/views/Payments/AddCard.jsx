// app/payment-method/add-card.js (or app/add-card-screen.js)
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

const AddCardScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router=useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // MM/YY format
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false); // For Save Card button

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatCardNumber = (text) => {
    // Remove all non-digit characters
    let cleanedText = text.replace(/\D/g, "");
    // Insert spaces every 4 digits
    let formattedText = cleanedText.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formattedText;
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digit characters
    let cleanedText = text.replace(/\D/g, "");
    // Add a slash after the second digit if not already present
    if (cleanedText.length > 2 && !cleanedText.includes("/")) {
      cleanedText =
        cleanedText.substring(0, 2) + "/" + cleanedText.substring(2);
    }
    // Limit to 5 characters (MM/YY)
    if (cleanedText.length > 5) {
      cleanedText = cleanedText.substring(0, 5);
    }
    return cleanedText;
  };

  const handleSaveCard = async () => {
    setLoading(true);

    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      Alert.alert("Error", "Please enter a valid 16-digit card number.");
      setLoading(false);
      return;
    }
    if (!cardHolderName) {
      Alert.alert("Error", "Please enter the card holder's name.");
      setLoading(false);
      return;
    }
    if (!expiryDate || expiryDate.length !== 5 || !expiryDate.includes("/")) {
      Alert.alert("Error", "Please enter a valid expiry date (MM/YY).");
      setLoading(false);
      return;
    }
    if (!cvv || cvv.length < 3) {
      Alert.alert("Error", "Please enter a valid CVV (3 or 4 digits).");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call to save card
      await new Promise((resolve) => setTimeout(resolve, 2000));


      router.push("views/Payments/PaymentSummary");
      
    } catch (error) {
      console.error("Save card error:", error);
      Alert.alert(
        "Error",
        `Failed to save card: ${error.message || "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Extract last 4 digits of card number for display on the virtual card
  const lastFourDigits = cardNumber.replace(/\s/g, "").slice(-4);
  const displayedCardNumber = lastFourDigits
    ? `**** **** **** ${lastFourDigits}`
    : "0000 0000 0000 0000";

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
          <Text style={styles.headerTitle}>Add Card</Text>
          <View style={{ width: 28 }} />
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
          {/* Virtual Card Display */}
          <LinearGradient
            colors={["#00BBD3", "#8CF1E9"]} // Greenish gradient for the card
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.virtualCard}
          >
            <View style={styles.cardChipPlaceholder} />
            <Text style={styles.virtualCardNumber}>{displayedCardNumber}</Text>
            <View style={styles.cardInfoRow}>
              <View>
                <Text style={styles.cardLabel}>Card Holder Name</Text>
                <Text style={styles.cardValue}>
                  {cardHolderName || "John Doe"}
                </Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expiry Date</Text>
                <Text style={styles.cardValue}>{expiryDate || "MM/YY"}</Text>
              </View>
              <MaterialCommunityIcons
                name="credit-card-scan-outline"
                size={35}
                color={COLORS.white}
              />
            </View>
          </LinearGradient>

          {/* Input Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Holder Name</Text>
            <TextInput
              style={styles.textInput}
              value={cardHolderName}
              onChangeText={setCardHolderName}
              placeholder="John Doe"
              placeholderTextColor={COLORS.textPlaceholder}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.textInput}
              value={formatCardNumber(cardNumber)}
              onChangeText={(text) => setCardNumber(text)}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={COLORS.textPlaceholder}
              keyboardType="numeric"
              maxLength={19} // 16 digits + 3 spaces
            />
          </View>

          <View style={styles.expiryCvvRow}>
            <View style={[styles.inputGroup, styles.flexHalf]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.textInput}
                value={formatExpiryDate(expiryDate)}
                onChangeText={(text) => setExpiryDate(text)}
                placeholder="MM/YY"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                maxLength={5} // MM/YY
              />
            </View>
            <View style={[styles.inputGroup, styles.flexHalf, styles.cvvInput]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.textInput}
                value={cvv}
                onChangeText={setCvv}
                placeholder="000"
                placeholderTextColor={COLORS.textPlaceholder}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry // Hide CVV for security
              />
            </View>
          </View>

          {/* Save Card Button */}
          <TouchableOpacity
            style={styles.saveCardButton}
            onPress={handleSaveCard}
            disabled={loading}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveCardButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveCardButtonText}>Save Card</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  virtualCard: {
    width: "100%",
    aspectRatio: 1.6, // Standard card aspect ratio
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    justifyContent: "space-between",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardChipPlaceholder: {
    width: 40,
    height: 30,
    backgroundColor: COLORS.white,
    borderRadius: 5,
    alignSelf: "flex-end", // Position top right
    opacity: 0.7,
  },
  virtualCardNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 10,
  },
  cardInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardLabel: {
    fontSize: 12,
    color: COLORS.lightGrey,
    opacity: 0.8,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.white,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  expiryCvvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  flexHalf: {
    flex: 0.48, // Slightly less than half to account for spacing
  },
  cvvInput: {
    marginLeft: 10, // Space between expiry and CVV
  },
  saveCardButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveCardButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveCardButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default AddCardScreen;
