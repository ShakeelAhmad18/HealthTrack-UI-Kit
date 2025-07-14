import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router"; // Assuming expo-router
import { COLORS } from "../../../../constants/helper"; // Adjust path as needed
import useGeminiApi from "../../../../lib/useGeminiApi"; // Import the custom hook
import AsyncStorage from "@react-native-async-storage/async-storage"; // <--- ADD THIS IMPORT

const { width } = Dimensions.get("window");

// --- MOCK DATA ---
const MOCK_WELLNESS_CATEGORIES = [
  { name: "All", icon: "infinity" }, // Represents all categories
  { name: "Mindfulness", icon: "brain" },
  { name: "Nutrition", icon: "food-apple-outline" },
  { name: "Fitness", icon: "dumbbell" },
  { name: "Sleep", icon: "sleep" },
  { name: "Stress Relief", icon: "spa-outline" },
  { name: "Hydration", icon: "water-outline" },
  { name: "Digital Detox", icon: "monitor-off" }, // Corrected icon: "tablet-off-outline" -> "monitor-off"
];

// Mock daily tip for initial load (will be replaced by AI)
const MOCK_INITIAL_DAILY_TIP = {
  title: "Embrace Mindful Moments",
  content:
    "Take a few minutes today to simply focus on your breath. Notice the sensation of air entering and leaving your body. This simple practice can reduce stress and increase clarity.",
  icon: "meditation",
};

// Mock articles for initial display (will be replaced/augmented by AI)
const MOCK_ARTICLES_PREVIEWS = [
  {
    id: "art1",
    title: "The Power of Deep Breathing",
    category: "Mindfulness",
    preview:
      "Discover how conscious breathing can significantly impact your mental and physical well-being.",
    icon: "human-greeting",
    fullContent: null, // Will be fetched by AI
  },
  {
    id: "art2",
    title: "Simple Steps to Better Sleep",
    category: "Sleep",
    preview:
      "Improve your sleep quality with these easy-to-implement evening routines.",
    icon: "sleep-off",
    fullContent: null,
  },
  {
    id: "art3",
    title: "Fuel Your Body Right: Healthy Snacks",
    category: "Nutrition",
    preview:
      "Quick and nutritious snack ideas to keep your energy levels stable throughout the day.",
    icon: "carrot",
    fullContent: null,
  },
  {
    id: "art4",
    title: "Beginner's Guide to Home Workouts",
    category: "Fitness",
    preview:
      "Start your fitness journey with effective exercises you can do without leaving your home.",
    icon: "home-lightning-bolt-outline",
    fullContent: null,
  },
];

const WellnessTipsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  // State for daily tip
  const [dailyTip, setDailyTip] = useState(MOCK_INITIAL_DAILY_TIP);
  const [loadingDailyTip, setLoadingDailyTip] = useState(false);

  // State for articles/tips library
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState(MOCK_ARTICLES_PREVIEWS);
  const [expandedArticleId, setExpandedArticleId] = useState(null); // ID of the currently expanded article
  const [loadingArticleContent, setLoadingArticleContent] = useState(false);
  const [articleContentError, setArticleContentError] = useState(null);

  // State for search
  const [searchInput, setSearchInput] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(
    MOCK_ARTICLES_PREVIEWS
  );
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

  // Gemini API hooks for daily tip and general content
  const {
    response: dailyTipResponse,
    loading: dailyTipLoading,
    error: dailyTipError,
    generateContent: generateDailyTip,
  } = useGeminiApi();
  const {
    response: articleResponse,
    loading: articleLoading,
    error: articleError,
    generateContent: generateArticleContent,
  } = useGeminiApi();

  // --- Effects for AI Responses ---

  // Effect for Daily Tip
  useEffect(() => {
    const fetchAndSetDailyTip = async () => {
      const today = new Date().toDateString();
      const storageKey = "dailyTip_" + today;
      try {
        const storedDailyTip = await AsyncStorage.getItem(storageKey); // <--- USE AsyncStorage.getItem

        if (storedDailyTip) {
          setDailyTip(JSON.parse(storedDailyTip));
        } else {
          setLoadingDailyTip(true);
          const prompt = `Provide a concise, inspiring, and actionable wellness tip for today (${today}). Give it a catchy title and a brief content body.
          Format:
          Title: [Your catchy title]
          Content: [The tip content, concise]
          Icon: [A relevant MaterialCommunityIcons name, e.g., 'meditation', 'leaf', 'heart']`;
          await generateDailyTip(prompt); // <--- AWAIT THE GENERATION
        }
      } catch (e) {
        console.error("Error accessing AsyncStorage for daily tip:", e);
        // Fallback to mock tip on storage error
        setDailyTip(MOCK_INITIAL_DAILY_TIP);
      }
    };

    fetchAndSetDailyTip();
  }, [generateDailyTip]); // Added generateDailyTip to dependencies

  useEffect(() => {
    if (dailyTipResponse) {
      const parsedTip = parseDailyTipResponse(dailyTipResponse);
      if (parsedTip) {
        setDailyTip(parsedTip);
        const today = new Date().toDateString();
        AsyncStorage.setItem("dailyTip_" + today, JSON.stringify(parsedTip)) // <--- USE AsyncStorage.setItem
          .catch((e) =>
            console.error("Error saving daily tip to AsyncStorage:", e)
          );
      }
      setLoadingDailyTip(false);
    }
    if (dailyTipError) {
      console.error("Error fetching daily tip from AI:", dailyTipError); // Clarify error source
      setLoadingDailyTip(false);
      // Fallback to mock tip on AI error
      setDailyTip(MOCK_INITIAL_DAILY_TIP);
    }
  }, [dailyTipResponse, dailyTipError, parseDailyTipResponse]);

  // Effect for Article Content
  useEffect(() => {
    if (articleResponse && expandedArticleId) {
      const parsedArticle = parseArticleResponse(articleResponse);
      if (parsedArticle) {
        setArticles((prev) =>
          prev.map((art) =>
            art.id === expandedArticleId
              ? { ...art, fullContent: parsedArticle.fullContent }
              : art
          )
        );
      }
      setLoadingArticleContent(false);
    }
    if (articleError) {
      console.error("Error fetching article content:", articleError);
      setLoadingArticleContent(false);
      setArticleContentError(
        "Failed to load article content. Please try again."
      );
    }
  }, [articleResponse, articleError, expandedArticleId, parseArticleResponse]); // Added parseArticleResponse to deps

  // --- Parsing AI Responses ---

  const parseDailyTipResponse = useCallback((rawResponse) => {
    const lines = rawResponse
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    let title = "Daily Wellness Tip";
    let content = "No tip found today, but remember to stay hydrated!";
    let icon = "lightbulb-on-outline";

    lines.forEach((line) => {
      if (line.startsWith("Title:")) {
        title = line.substring("Title:".length).trim();
      } else if (line.startsWith("Content:")) {
        content = line.substring("Content:".length).trim();
      } else if (line.startsWith("Icon:")) {
        icon = line.substring("Icon:".length).trim();
      }
    });
    return { title, content, icon };
  }, []);

  const parseArticleResponse = useCallback((rawResponse) => {
    const lines = rawResponse
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    let title = "Article";
    let preview = "No preview available.";
    let fullContent = "Content could not be loaded.";

    let inContent = false;
    const contentLines = [];

    lines.forEach((line) => {
      if (line.startsWith("### Title:")) {
        title = line.substring("### Title:".length).trim();
      } else if (line.startsWith("### Preview:")) {
        preview = line.substring("### Preview:".length).trim();
      } else if (line.startsWith("### Content:")) {
        inContent = true;
        // Start accumulating content from here
        contentLines.push(line.substring("### Content:".length).trim());
      } else if (inContent) {
        contentLines.push(line);
      }
    });

    fullContent = contentLines.join("\n").trim();

    return { title, preview, fullContent };
  }, []);

  // --- Handlers ---

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    filterAndDisplayArticles(categoryName, searchInput);
  };

  const handleSearchInputChange = (text) => {
    setSearchInput(text);
    filterAndDisplayArticles(selectedCategory, text);
  };

  const filterAndDisplayArticles = useCallback((category, searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = MOCK_ARTICLES_PREVIEWS.filter((article) => {
      const matchesCategory =
        category === "All" || article.category === category;
      const matchesSearch =
        article.title.toLowerCase().includes(lowerSearchTerm) ||
        article.preview.toLowerCase().includes(lowerSearchTerm);
      return matchesCategory && matchesSearch;
    });
    setFilteredArticles(filtered);
  }, []);

  const toggleArticleExpand = async (articleId, currentContent) => {
    if (expandedArticleId === articleId) {
      setExpandedArticleId(null); // Collapse
    } else {
      setExpandedArticleId(articleId); // Expand
      if (!currentContent) {
        // Fetch full content if not already loaded
        setLoadingArticleContent(true);
        setArticleContentError(null);
        const articleToFetch = articles.find((art) => art.id === articleId);
        if (articleToFetch) {
          const prompt = `Provide a detailed article on "${articleToFetch.title}" (Category: ${articleToFetch.category}). Include an overview, key points (can be bulleted), and a conclusion.
          Format:
          ### Title: ${articleToFetch.title}
          ### Preview: ${articleToFetch.preview}
          ### Content:
          [Detailed article content here, use paragraphs and bullet points as appropriate. Focus on actionable insights.]`;
          await generateArticleContent(prompt);
        }
      }
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to expanded article
      }, 300);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All",
      "Are you sure you want to clear your search and reset views?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setSelectedCategory("All");
            setSearchInput("");
            setFilteredArticles(MOCK_ARTICLES_PREVIEWS); // Reset to original mock data
            setExpandedArticleId(null);
            setLoadingArticleContent(false);
            setArticleContentError(null);
          },
        },
      ]
    );
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
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wellness Insights</Text>
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerButton}
          >
            <Ionicons
              name="refresh-circle-outline"
              size={28}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Daily tips & articles for a healthier you
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Daily Wellness Tip */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Daily Wellness Tip</Text>
            {loadingDailyTip ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingTextSmall}>
                  Loading today's tip...
                </Text>
              </View>
            ) : (
              <LinearGradient
                colors={[COLORS.accentLight, COLORS.accent]}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
                style={styles.dailyTipCard}
              >
                <View style={styles.dailyTipHeader}>
                  <MaterialCommunityIcons
                    name={dailyTip.icon || "lightbulb-on-outline"}
                    size={30}
                    color={COLORS.white}
                  />
                  <Text style={styles.dailyTipTitle}>{dailyTip.title}</Text>
                </View>
                <Text style={styles.dailyTipContent}>{dailyTip.content}</Text>
              </LinearGradient>
            )}
          </View>

          {/* Categories */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {MOCK_WELLNESS_CATEGORIES.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.name &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => handleCategorySelect(category.name)}
                >
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={22}
                    color={
                      selectedCategory === category.name
                        ? COLORS.white
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category.name &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Input */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Search Articles</Text>
            <View
              style={[
                styles.searchInputContainer,
                isSearchInputFocused && {
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                },
              ]}
            >
              <Ionicons
                name="search"
                size={24}
                color={COLORS.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search wellness topics..."
                placeholderTextColor={COLORS.textPlaceholder}
                value={searchInput}
                onChangeText={handleSearchInputChange}
                onFocus={() => setIsSearchInputFocused(true)}
                onBlur={() => setIsSearchInputFocused(false)}
                returnKeyType="search"
              />
              {searchInput.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchInput("")}
                  style={styles.clearSearchButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Articles/Tips List */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Articles & Tips</Text>
            {articleContentError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{articleContentError}</Text>
              </View>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <View key={article.id} style={styles.articleCard}>
                  <TouchableOpacity
                    onPress={() =>
                      toggleArticleExpand(article.id, article.fullContent)
                    }
                    style={styles.articleHeader}
                  >
                    <MaterialCommunityIcons
                      name={article.icon || "book-outline"}
                      size={26}
                      color={COLORS.primary}
                      style={styles.articleIcon}
                    />
                    <View style={styles.articleHeaderText}>
                      <Text style={styles.articleTitle}>{article.title}</Text>
                      <Text style={styles.articleCategory}>
                        {article.category}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        expandedArticleId === article.id
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={24}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>

                  {expandedArticleId === article.id && (
                    <View style={styles.articleContentContainer}>
                      {loadingArticleContent ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator
                            size="small"
                            color={COLORS.primary}
                          />
                          <Text style={styles.loadingTextSmall}>
                            Loading full article...
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.articlePreview}>
                            {article.preview}
                          </Text>
                          {article.fullContent && (
                            <Text style={styles.articleFullContent}>
                              {article.fullContent}
                            </Text>
                          )}
                          {/* Future: Favorite/Share buttons */}
                          <TouchableOpacity style={styles.favoriteButton}>
                            <Ionicons
                              name="heart-outline"
                              size={20}
                              color={COLORS.textSecondary}
                            />
                            <Text style={styles.favoriteButtonText}>
                              Add to Favorites
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="book-open-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  No articles found for your criteria.
                </Text>
                <Text style={styles.placeholderSubText}>
                  Try a different category or search term.
                </Text>
              </View>
            )}
          </View>

          {/* Disclaimer Section */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Disclaimer:</Text>
            <Text style={styles.disclaimerText}>
              The wellness tips and articles provided are for general
              informational purposes only and do not constitute medical,
              psychological, or nutritional advice. Always consult with a
              qualified professional for personalized guidance.
            </Text>
          </View>
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
    paddingBottom: 10,
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  dailyTipCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  dailyTipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dailyTipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 10,
    flexShrink: 1,
  },
  dailyTipContent: {
    fontSize: 15,
    color: COLORS.white,
    lineHeight: 22,
  },
  categoriesContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  categoryButtonTextSelected: {
    color: COLORS.white,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 0, // No extra margin if search is the only thing in card
    borderWidth: 1,
    borderColor: COLORS.separator,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearSearchButton: {
    padding: 5,
  },
  articleCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator + "50",
  },
  articleIcon: {
    marginRight: 10,
  },
  articleHeaderText: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  articleCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  articleContentContainer: {
    padding: 15,
  },
  articlePreview: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
    fontStyle: "italic",
  },
  articleFullContent: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "10",
  },
  favoriteButtonText: {
    marginLeft: 5,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingTextSmall: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "20",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.error,
    flexShrink: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    opacity: 0.7,
  },
  placeholderSubText: {
    marginTop: 5,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    opacity: 0.5,
    fontStyle: "italic",
  },
  disclaimerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.warningDark,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default WellnessTipsScreen;
