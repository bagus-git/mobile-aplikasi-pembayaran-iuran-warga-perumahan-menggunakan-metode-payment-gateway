import "react-native-gesture-handler";
import React, { useState } from "react";
import { cacheFonts, cacheImages } from "./src/helpers/AssetsCaching";
import vectorFonts from "./src/helpers/vector-fonts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { createTheme, ThemeProvider } from "@rneui/themed";
import RootNavigator from "./src/navigation/RootNavigator";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  React.useEffect(() => {
    loadAssetsAsync();
  }, []);

  const loadAssetsAsync = async () => {
    const imageAssets = cacheImages([
      require("./assets/images/logo.png"),
      require("./assets/images/logo-wa.png"),
    ]);

    const fontAssets = cacheFonts([
      ...vectorFonts,
      { georgia: require("./assets/fonts/Georgia.ttf") },
      { regular: require("./assets/fonts/Montserrat-Regular.ttf") },
      { light: require("./assets/fonts/Montserrat-Light.ttf") },
      { bold: require("./assets/fonts/Montserrat-Bold.ttf") },
      { UbuntuLight: require("./assets/fonts/Ubuntu-Light.ttf") },
      { UbuntuBold: require("./assets/fonts/Ubuntu-Bold.ttf") },
      { UbuntuLightItalic: require("./assets/fonts/Ubuntu-Light-Italic.ttf") },
    ]);
    await Promise.all([...imageAssets, ...fontAssets]);
    setIsReady(true);
  };

  const onLayoutRootView = React.useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <RootNavigator />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

const theme = createTheme({
  lightColors: {
    primary: "#3d5afe",
  },
  darkColors: {
    primary: "#3d5afe",
  },
  mode: "dark",
  components: {
    Text: {
      h1Style: {
        fontSize: 80,
      },
    },
  },
});
