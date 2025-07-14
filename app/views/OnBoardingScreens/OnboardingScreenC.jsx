import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 

import { COLORS, SIZES, FONT, SHADOWS } from "../../../constants/helper";

const { width, height } = Dimensions.get("window");

const OnboardingScreenC = ({ onSkip, onGetStarted }) => {
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
            source={require("../../../assets/images/C1.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        {/* Title */}
        <Text style={styles.title}>Check Your Medical History</Text>
        {/* Description */}
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.inactiveDot]} />
          <View style={[styles.paginationDot, styles.inactiveDot]} />
          <View style={[styles.paginationDot, styles.activeDot]} />
        </View>
        {/* Get Started Button */}
        <TouchableOpacity
          style={[
            styles.getStartedButtonTouchable,
            { marginBottom: insets.bottom + SIZES.medium }, // Apply dynamic bottom margin
          ]}
          onPress={onGetStarted}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.getStartedButtonGradient}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
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
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    alignItems: "center",
  },
  skipButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    padding: SIZES.small,
    marginTop: SIZES.small,
  },
  skipText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: SIZES.xLarge,
  },
  illustration: {
    width: "100%",
    aspectRatio: 1.2, // Adjust this ratio based on your actual illustration's aspect
    maxWidth: 350,
    maxHeight: height * 0.4,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: SIZES.large, // Adjusted slightly for consistency and balance
    marginBottom: SIZES.medium,
    lineHeight: SIZES.xxLarge * 1.2,
  },
  description: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: SIZES.xLarge,
    marginBottom: SIZES.xxLarge,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.xxLarge, // Adjusted slightly for button padding
  },
  paginationDot: {
    width: SIZES.small,
    height: SIZES.small,
    borderRadius: SIZES.small / 2,
    marginHorizontal: SIZES.xSmall / 2,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: SIZES.small + 2,
    height: SIZES.small + 2,
    borderRadius: (SIZES.small + 2) / 2,
  },
  inactiveDot: {
    backgroundColor: COLORS.secondary, // Consistent with previous screens for inactive
  },
  // Reusing the same button styles, just renaming for clarity for "Get Started"
  getStartedButtonTouchable: {
    // Renamed from nextButtonTouchable
    width: "90%",
    maxWidth: 400,
    borderRadius: 50,
    overflow: "hidden",
    ...SHADOWS.medium,
    // The marginBottom is now applied inline in the component to use `insets.bottom`
  },
  getStartedButtonGradient: {
    // Renamed from nextButtonGradient
    paddingVertical: SIZES.medium + 5,
    paddingHorizontal: SIZES.xLarge,
    justifyContent: "center",
    alignItems: "center",
  },
  getStartedButtonText: {
    // Renamed from nextButtonText
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.textLight,
  },
});

export default OnboardingScreenC;
