// app/help-center/index.js (or app/help-center-screen.js)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  ActivityIndicator,
  Linking, // For opening URLs/WhatsApp/etc.
  Alert, // Ensure Alert is explicitly imported here
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/helper"; // Adjust path as needed

// Dummy FAQ Data
const DUMMY_FAQS = [
  {
    id: "1",
    category: "Popular Topic",
    question: "Lorem Ipsum Dolor Sit Amet?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.",
  },
  {
    id: "2",
    category: "General",
    question: "How do I reset my password?",
    answer:
      "You can reset your password by going to the Profile screen, clicking on 'Settings', and then selecting 'Password Manager'. There you will find an option to reset your password.",
  },
  {
    id: "3",
    category: "Services",
    question: "What services do you offer?",
    answer:
      "We offer a wide range of medical services including Cardiology, Dermatology, General Medicine, Gynecology, Odontology, and Oncology. You can find more details in the 'Favorite Services' section of your app.",
  },
  {
    id: "4",
    category: "Popular Topic",
    question: "Is my data secure?",
    answer:
      "Yes, we prioritize your data security. All your personal and medical information is encrypted and stored securely. Please refer to our Privacy Policy for more details.",
  },
  {
    id: "5",
    category: "General",
    question: "How can I contact support?",
    answer:
      "You can contact our support team via email, phone, or WhatsApp. Visit the 'Contact Us' tab in the Help Center for more information.",
  },
  {
    id: "6",
    category: "Services",
    question: "Can I book appointments online?",
    answer:
      "Yes, you can easily book and manage your appointments directly through the app. Simply find your desired doctor or service and follow the booking prompts.",
  },
];

// Dummy Contact Options Data
const DUMMY_CONTACT_OPTIONS = [
  {
    id: "customer_service",
    icon: "headset",
    label: "Customer Service",
    type: "phone",
    value: "+1234567890",
  },
  {
    id: "website",
    icon: "web",
    label: "Website",
    type: "url",
    value: "https://www.example.com",
  },
  {
    id: "whatsapp",
    icon: "whatsapp",
    label: "Whatsapp",
    type: "whatsapp",
    value: "+1234567890",
  },
  {
    id: "facebook",
    icon: "facebook",
    label: "Facebook",
    type: "url",
    value: "https://www.facebook.com/example",
  },
  {
    id: "instagram",
    icon: "instagram",
    label: "Instagram",
    type: "url",
    value: "https://www.instagram.com/example",
  },
];

const HelpCenterScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState("faq"); // 'faq' or 'contactUs'
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Popular Topic"); // For FAQ filtering
  const [expandedFAQId, setExpandedFAQId] = useState(null); // For FAQ accordion
  const [loadingFAQs, setLoadingFAQs] = useState(true); // Loading state for FAQs

  // Simulate fetching FAQs on component mount
  useEffect(() => {
    const fetchFAQs = async () => {
      setLoadingFAQs(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        // In a real app: fetch DUMMY_FAQS from an API
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoadingFAQs(false);
      }
    };
    fetchFAQs();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Filter FAQs based on search query and active category
  const filteredFAQs = DUMMY_FAQS.filter(
    (faq) =>
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeCategory === "All" || faq.category === activeCategory)
  );

  // Toggle FAQ accordion
  const toggleFAQ = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFAQId(expandedFAQId === id ? null : id);
  };

  // Handle contact option press
  const handleContactOptionPress = async (type, value) => {
    let url;
    switch (type) {
      case "phone":
        url = `tel:${value}`;
        break;
      case "whatsapp":
        url = `whatsapp://send?phone=${value}`; // For WhatsApp
        break;
      case "url":
      default:
        url = value;
        break;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Cannot open this link: ${url}`);
      }
    } catch (error) {
      console.error("Failed to open link:", error);
      Alert.alert("Error", "Could not open the requested application/link.");
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
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.headerSubtitle}>How Can We Help You?</Text>

        {/* Search Bar */}
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

        {/* Tab Buttons (FAQ / Contact Us) */}
        <View style={styles.tabButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "faq" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("faq")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "faq" && styles.tabButtonTextActive,
              ]}
            >
              FAQ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "contactUs" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("contactUs")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "contactUs" && styles.tabButtonTextActive,
              ]}
            >
              Contact Us
            </Text>
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
        {activeTab === "faq" ? (
          // FAQ Tab Content
          <View>
            {/* Category Filter Buttons */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryButtonsContainer}
            >
              {["Popular Topic", "General", "Services", "All"].map(
                (category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      activeCategory === category &&
                        styles.categoryButtonActive,
                    ]}
                    onPress={() => setActiveCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        activeCategory === category &&
                          styles.categoryButtonTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            {loadingFAQs ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading FAQs...</Text>
              </View>
            ) : filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity
                    onPress={() => toggleFAQ(faq.id)}
                    style={styles.faqHeader}
                  >
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons
                      name={
                        expandedFAQId === faq.id
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      size={20}
                      color={COLORS.iconSecondary}
                    />
                  </TouchableOpacity>
                  {expandedFAQId === faq.id && (
                    <View style={styles.faqBody}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noResultsText}>
                No FAQs found for your search/filter.
              </Text>
            )}
          </View>
        ) : (
          // Contact Us Tab Content
          <View>
            {DUMMY_CONTACT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactOptionItem}
                onPress={() =>
                  handleContactOptionPress(option.type, option.value)
                }
              >
                <View style={styles.contactOptionLeft}>
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={24}
                    color={COLORS.primary}
                    style={styles.contactOptionIcon}
                  />
                  <Text style={styles.contactOptionText}>{option.label}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.iconSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 20, // Adjusted padding to accommodate search and tabs
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
    paddingBottom: 10, // Space between title and subtitle
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
    fontSize: 16,
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
  tabButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 5, // Inner padding to give space around buttons
    marginBottom: 10, // Space between tabs and content below
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20, // Rounded corners for active tab
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  tabButtonTextActive: {
    color: COLORS.white,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20, // Space from the bottom of the gradient header
  },
  // FAQ Specific Styles
  categoryButtonsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingVertical: 5, // Add some vertical padding for scrollable categories
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: COLORS.white,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    overflow: "hidden", // Ensures content respects border radius
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  faqBody: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 150, // Ensure it takes up some space
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontSize: 16,
  },

  // Contact Us Specific Styles
  contactOptionItem: {
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
  contactOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactOptionIcon: {
    marginRight: 15,
    width: 24, // Consistent icon spacing
    textAlign: "center",
  },
  contactOptionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});

export default HelpCenterScreen;
