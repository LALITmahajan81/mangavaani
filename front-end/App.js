import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Redux store
import store from "./src/services/index";

// Navigation
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <StatusBar style="auto" />
                    <RootNavigator />
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </Provider>
    );
}
