import { Slot, SplashScreen, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import SafeScreen from "../components/SafeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomSplashScreen from "./views/SplashScreen/SplashScreen";
import OnboardingScreenA from "./views/OnBoardingScreens/OnboardingScreenA";
import OnboardingScreenB from "./views/OnBoardingScreens/OnboardingScreenB";
import OnboardingScreenC from "./views/OnBoardingScreens/OnboardingScreenC";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    async function prepare() {
      try {
        SplashScreen.preventAutoHideAsync();

        const hasLaunched = await SecureStore.getItemAsync("hasLaunched");
        setIsFirstLaunch(!hasLaunched); 

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn("Error in prepare:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleNextOnboarding = () => {
    if (onboardingStep < 2) {
      setOnboardingStep((prevStep) => prevStep + 1);
    } else {
      handleOnboardingComplete();
    }
  };

  const handleOnboardingComplete = async () => {
    await SecureStore.setItemAsync("hasLaunched", "true");
    setIsFirstLaunch(false); // Set to false to render the main app
  };

  if (!appIsReady || isFirstLaunch === null) {
    return <CustomSplashScreen />; 
  }

  return (
    <SafeAreaProvider>
      {isFirstLaunch ? (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          {(() => {
            switch (onboardingStep) {
              case 0:
                return (
                  <OnboardingScreenA
                    onSkip={handleOnboardingComplete}
                    onNext={handleNextOnboarding}
                  />
                );
              case 1:
                return (
                  <OnboardingScreenB
                    onSkip={handleOnboardingComplete}
                    onNext={handleNextOnboarding}
                  />
                );
              case 2:
                return (
                  <OnboardingScreenC
                    onSkip={handleOnboardingComplete}
                    onGetStarted={handleOnboardingComplete} 
                  />
                );
              default:
                return null;
            }
          })()}
        </View>
      ) : (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <SafeScreen>
            <Slot initialRouteName="views/(tabs)" />
          </SafeScreen>
        </View>
      )}
    </SafeAreaProvider>
  );
}
