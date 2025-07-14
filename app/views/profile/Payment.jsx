// app/payment-method/index.js (or app/payment-method-screen.js)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator, // For simulating loading/saving
  Modal, // For the custom add payment method modal
  TextInput, // For input fields in the modal
  KeyboardAvoidingView, // To adjust for keyboard
  Platform, // For KeyboardAvoidingView and specific styling
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons"; // Import FontAwesome5
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming you are using Expo Router
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Dummy Payment Method Data
const DUMMY_PAYMENT_METHODS = [
  {
    id: "card_1",
    type: "Visa",
    last4: "4242",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: "card_2",
    type: "MasterCard",
    last4: "5555",
    expiry: "08/25",
    isDefault: false,
  },
  {
    id: "card_3",
    type: "Amex",
    last4: "1001",
    expiry: "03/27",
    isDefault: false,
  },
];

// Custom Add Payment Method Modal Component
const AddPaymentMethodModal = ({ isVisible, onClose, onSave }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // MM/YY format
  const [cvv, setCvv] = useState("");
  const [savingCard, setSavingCard] = useState(false);

  const handleSaveCard = async () => {
    setSavingCard(true);

    // Basic validation
    if (!cardNumber || !cardHolderName || !expiryDate || !cvv) {
      Alert.alert("Error", "Please fill in all card details.");
      setSavingCard(false);
      return;
    }
    if (
      cardNumber.replace(/\s/g, "").length !== 16 ||
      !/^\d+$/.test(cardNumber.replace(/\s/g, ""))
    ) {
      Alert.alert("Error", "Please enter a valid 16-digit card number.");
      setSavingCard(false);
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      Alert.alert(
        "Error",
        "Please enter expiry date in MM/YY format (e.g., 12/26)."
      );
      setSavingCard(false);
      return;
    }
    if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
      Alert.alert("Error", "Please enter a valid 3 or 4 digit CVV.");
      setSavingCard(false);
      return;
    }

    try {
      // Simulate API call to save card
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newCard = {
        id: `card_${Date.now()}`, // Unique ID
        type: "Visa", // You might infer this from card number or have user select
        last4: cardNumber.slice(-4),
        expiry: expiryDate,
        isDefault: false, // New cards typically not default
      };
      onSave(newCard); // Pass the new card data to the parent
      onClose(); // Close modal on success
      // Clear fields
      setCardNumber("");
      setCardHolderName("");
      setExpiryDate("");
      setCvv("");
    } catch (error) {
      console.error("Failed to save card:", error);
      Alert.alert("Error", "Could not save payment method. Please try again.");
    } finally {
      setSavingCard(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, ""); // Remove existing spaces
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (text) => {
    let cleaned = text.replace(/\D/g, ""); // Remove non-digits
    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    setExpiryDate(cleaned);
  };

  if (!isVisible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={modalStyles.overlay}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Add New Card</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Ionicons
                name="close-circle-outline"
                size={30}
                color={COLORS.iconSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={modalStyles.modalScrollView}
          >
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Card Number</Text>
              <TextInput
                style={modalStyles.textInput}
                value={cardNumber}
                onChangeText={formatCardNumber}
                keyboardType="numeric"
                maxLength={19} // 16 digits + 3 spaces
                placeholder="XXXX XXXX XXXX XXXX"
                placeholderTextColor={COLORS.textPlaceholder}
              />
            </View>

            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Card Holder Name</Text>
              <TextInput
                style={modalStyles.textInput}
                value={cardHolderName}
                onChangeText={setCardHolderName}
                placeholder="Name on Card"
                placeholderTextColor={COLORS.textPlaceholder}
                autoCapitalize="words"
              />
            </View>

            <View style={modalStyles.rowInputGroup}>
              <View style={modalStyles.halfInput}>
                <Text style={modalStyles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={modalStyles.textInput}
                  value={expiryDate}
                  onChangeText={formatExpiryDate}
                  keyboardType="numeric"
                  maxLength={5} // MM/YY
                  placeholder="MM/YY"
                  placeholderTextColor={COLORS.textPlaceholder}
                />
              </View>
              <View style={modalStyles.halfInput}>
                <Text style={modalStyles.inputLabel}>CVV</Text>
                <TextInput
                  style={modalStyles.textInput}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  placeholder="***"
                  placeholderTextColor={COLORS.textPlaceholder}
                />
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={modalStyles.saveButton}
            onPress={handleSaveCard}
            disabled={savingCard}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={modalStyles.saveButtonGradient}
            >
              {savingCard ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={modalStyles.saveButtonText}>Save Card</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for better focus
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.background, // Use background color for modal body
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 0 : 20, // Adjust padding for iOS keyboard avoiding
    maxHeight: "80%", // Limit modal height
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  modalScrollView: {
    flexGrow: 0, // Allow content to shrink if keyboard appears
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rowInputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInput: {
    width: "48%", // Roughly half, with space in between
  },
  saveButton: {
    marginTop: 20,
    marginBottom: Platform.OS === "ios" ? 20 : 0, // Adjust for iOS keyboard avoiding
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

const PaymentMethodScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [paymentMethods, setPaymentMethods] = useState(DUMMY_PAYMENT_METHODS);
  const [loading, setLoading] = useState(false); // For simulating API calls for list actions
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false); // State for modal visibility

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentModal(true); // Show the custom modal
  };

  const handleSaveNewPaymentMethod = (newCard) => {
    // Add the new card to the list and potentially set it as default
    setPaymentMethods((prevMethods) => {
      const updatedMethods = prevMethods.map((method) => ({
        ...method,
        isDefault: false,
      })); // Unset previous default
      return [newCard, ...updatedMethods]; // Add new card to the top
    });
    Alert.alert("Success", "New payment method added successfully!");
  };

  const handleSetDefault = async (id) => {
    setLoading(true);
    try {
      // Simulate API call to set default
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }));
      setPaymentMethods(updatedMethods);
      Alert.alert("Success", "Default payment method updated.");
    } catch (error) {
      console.error("Failed to set default:", error);
      Alert.alert("Error", "Could not set default payment method.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = (id) => {
    Alert.alert(
      "Delete Payment Method",
      "Are you sure you want to delete this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // Simulate API call to delete
              await new Promise((resolve) => setTimeout(resolve, 1000));
              setPaymentMethods(
                paymentMethods.filter((method) => method.id !== id)
              );
              Alert.alert("Success", "Payment method deleted.");
            } catch (error) {
              console.error("Failed to delete:", error);
              Alert.alert("Error", "Could not delete payment method.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Helper to get card icon based on type
  const getCardIcon = (type) => {
    switch (type.toLowerCase()) {
      case "visa":
        return "cc-visa";
      case "mastercard":
        return "cc-mastercard";
      case "amex":
        return "cc-amex";
      default:
        return "credit-card"; // Changed to a generic FontAwesome5 icon
    }
  };

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
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.cardInfo}>
                {/* Use FontAwesome5 for card type icons */}
                <FontAwesome5
                  name={getCardIcon(method.type)}
                  size={40}
                  color={COLORS.iconPrimary}
                  style={styles.cardIcon}
                  solid // Use solid version for filled icons
                />
                <View>
                  <Text style={styles.cardType}>
                    {method.type} **** {method.last4}
                  </Text>
                  <Text style={styles.cardExpiry}>Expires {method.expiry}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                {method.isDefault ? (
                  <View style={styles.defaultTag}>
                    <Text style={styles.defaultTagText}>Default</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(method.id)}
                    style={styles.setDefaultButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                      <Text style={styles.setDefaultButtonText}>
                        Set Default
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDeletePaymentMethod(method.id)}
                  style={styles.deleteButton}
                  disabled={loading}
                >
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={COLORS.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noPaymentMethods}>
            <Text style={styles.noPaymentMethodsText}>
              No payment methods added yet.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addPaymentButton}
          onPress={handleAddPaymentMethod} // This now opens the custom modal
          disabled={loading}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addPaymentButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.addPaymentButtonText}>
                Add New Payment Method
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Add Payment Method Modal */}
      <AddPaymentMethodModal
        isVisible={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onSave={handleSaveNewPaymentMethod}
      />
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Allows info to take available space
  },
  cardIcon: {
    marginRight: 15,
  },
  cardType: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  cardExpiry: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultTag: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  defaultTagText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.white,
  },
  setDefaultButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70, // Ensure button has consistent width
  },
  setDefaultButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  deleteButton: {
    padding: 5,
  },
  noPaymentMethods: {
    alignItems: "center",
    paddingVertical: 50,
  },
  noPaymentMethodsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  addPaymentButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addPaymentButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addPaymentButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default PaymentMethodScreen;
