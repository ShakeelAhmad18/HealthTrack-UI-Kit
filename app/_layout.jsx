import { Slot, SplashScreen, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import SafeScreen from '../components/SafeScreen'

export default function RootLayout() {

    const [appIsReady, setAppIsReady] = useState(false);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  
useEffect(() => {
    async function prepare() {
      try {
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


    if (!appIsReady || isFirstLaunch === null ) {
      return (
        <View style={styles.container}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      );
    }

  return (
    <View style={{flex:1}} onLayout={onLayoutRootView}>
     <SafeScreen>
        <Slot initialRouteName="(tabs)"/>
     </SafeScreen>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#33E4DB",
  },
  image: {
    width: "40%",
    height: "40%",
  },
});