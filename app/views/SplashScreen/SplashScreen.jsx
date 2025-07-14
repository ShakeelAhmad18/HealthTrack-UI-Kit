import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, FONT } from "../../../constants/helper";

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }} 
    >
      <Image
        source={require("../../../assets/images/logo.png")} 
        style={styles.logo}
        resizeMode="contain" 
      />
      <Text style={styles.appName}>HealthTrack</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120, 
    height: 120,
    marginBottom: SIZES.large, 
  },
  appName: {
    fontFamily: FONT.regular, // Use your defined font
    fontSize: SIZES.xxLarge,
    color: COLORS.textLight,
    fontWeight: "bold", // For a bolder look, similar to the image
  },
});

export default SplashScreen;
