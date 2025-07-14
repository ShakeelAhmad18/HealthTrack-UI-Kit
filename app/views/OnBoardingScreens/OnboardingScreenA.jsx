import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform, 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, SIZES, FONT, SHADOWS } from "../../../constants/helper";

const { width, height } = Dimensions.get("window");

const OnboardingScreenA = ({ onSkip, onNext }) => {
  const insets = useSafeAreaInsets();

  return (
   
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
          <Text style={[styles.skipText, { marginLeft: 5 }]}>{">"}</Text>
        </TouchableOpacity>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../../assets/images/A1.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        {/* Title */}
        <Text style={styles.title}>Choose Your Doctor</Text>
        {/* Description */}
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.activeDot]} />
          <View style={[styles.paginationDot, styles.inactiveDot]} />
          <View style={[styles.paginationDot, styles.inactiveDot]} />
        </View>
        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButtonTouchable,
            { marginBottom: insets.bottom + SIZES.medium }, 
          ]}
          onPress={onNext}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0.5 }} 
            end={{ x: 1, y: 0.5 }} 
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.large, // General horizontal padding
    paddingVertical: SIZES.medium,
    alignItems: "center", // Center content horizontally
  },
  skipButton: {
    flexDirection: "row",
    alignSelf: "flex-end", // Align to right
    padding: SIZES.small, // Touchable area
    marginTop: SIZES.small, // Space from top status bar
    // Consider Platform.OS === 'ios' ? SIZES.small : SIZES.medium for Android status bar
  },
  skipText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  illustrationContainer: {
    flex: 1, // Allows it to take available vertical space
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: SIZES.xLarge, // Pushes illustration slightly in
  },
  illustration: {
    width: "100%", // Take full width of its container
    aspectRatio: 1.2, // Adjust this ratio based on your actual illustration's aspect
    maxWidth: 350, // Max width for larger screens
    maxHeight: height * 0.4, // Max height relative to screen height
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: SIZES.large, // Adjusted slightly for overall balance
    marginBottom: SIZES.medium,
    lineHeight: SIZES.xxLarge * 1.2, // Adjust line height for better readability
  },
  description: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: SIZES.xLarge, // Ensures text doesn't hit edges
    marginBottom: SIZES.xxLarge, // Space before dots
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.xxLarge, // Slightly adjusted for button padding
  },
  paginationDot: {
    width: SIZES.small, // Inactive dot size
    height: SIZES.small,
    borderRadius: SIZES.small / 2,
    marginHorizontal: SIZES.xSmall / 2, // Spacing between dots
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: SIZES.small + 2, // Slightly larger
    height: SIZES.small + 2,
    borderRadius: (SIZES.small + 2) / 2,
  },
  inactiveDot: {
    backgroundColor: COLORS.secondary, 
  },
  nextButtonTouchable: {
    width: "90%", 
    maxWidth: 400, 
    borderRadius: 50,
    overflow: "hidden", 
    ...SHADOWS.medium, 
  },
  nextButtonGradient: {
    paddingVertical: SIZES.medium + 5, // Adjust vertical padding for button height
    paddingHorizontal: SIZES.xLarge,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.textLight,
  },
});

export default OnboardingScreenA;
