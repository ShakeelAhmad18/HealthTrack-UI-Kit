// app/reviews/add.js (or app/review-screen.js)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/helper"; // Adjust path as needed

const ReviewScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams(); // To potentially get doctor ID/name

  // Dummy Doctor Data (replace with actual data passed via params or fetched)
  const doctor = {
    id: "doc1",
    name: params.doctorName || "Dr. Emma Hall, M.D.",
    specialty: params.doctorSpecialty || "General Doctor",
    profileImage:
      params.doctorImage ||
      "https://images.unsplash.com/photo-1645066928295-2506defde470?q=80&w=379&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isFavorite: true, // Dummy favorite status
  };

  const [selectedRating, setSelectedRating] = useState(0); // User's selected rating (1-5)
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state on button

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSubmitReview = async () => {
    if (selectedRating === 0) {
      Alert.alert("Rating Required", "Please select a star rating.");
      return;
    }
    if (comment.trim() === "") {
      Alert.alert("Comment Required", "Please enter your comment.");
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      doctorId: doctor.id,
      rating: selectedRating,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
    };


    try {
      // Simulate API call to submit review
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Review Submitted",
        `Thank you for your review for ${doctor.name}!`
      );
      // Optionally navigate back or to a confirmation screen
      navigation.goBack();
    } catch (error) {
      console.error("Failed to submit review:", error);
      Alert.alert("Error", "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          <Text style={styles.headerTitle}>Review</Text>
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
          <Text style={styles.introText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>

          {/* Doctor Profile Section */}
          <View style={styles.doctorProfileCard}>
            <Image
              source={{ uri: doctor.profileImage }}
              style={styles.doctorImage}
            />
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            <View style={styles.doctorActions}>
              <Ionicons
                name={doctor.isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={doctor.isFavorite ? COLORS.error : COLORS.iconSecondary}
                style={styles.favoriteIcon}
              />
              {/* Star Rating Input */}
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setSelectedRating(star)}
                  >
                    <Ionicons
                      name={selectedRating >= star ? "star" : "star-outline"}
                      size={28}
                      color={
                        selectedRating >= star
                          ? COLORS.starYellow
                          : COLORS.iconSecondary
                      }
                      style={styles.starIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="Enter Your Comment Here..."
              placeholderTextColor={COLORS.textPlaceholder}
              multiline
              numberOfLines={6} // Provide ample space for comment
              value={comment}
              onChangeText={setComment}
            />
          </View>

          {/* Add Review Button */}
          <TouchableOpacity
            style={styles.addReviewButton}
            onPress={handleSubmitReview}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addReviewButtonGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.addReviewButtonText}>Add Review</Text>
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
  introText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center", // Center align as per image
  },
  doctorProfileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: COLORS.separator,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  doctorActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  favoriteIcon: {
    marginRight: 15,
    padding: 5, // Make it easier to tap
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    paddingHorizontal: 3, // Smaller padding between stars
  },
  commentInputContainer: {
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
  commentTextInput: {
    minHeight: 120, // Ample space for comments
    textAlignVertical: "top",
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  addReviewButton: {
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
  addReviewButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addReviewButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default ReviewScreen;
