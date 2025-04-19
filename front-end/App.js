import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StyleSheet } from "react-native";

// Redux store
import store from "./src/services/index";

// Navigation
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <StatusBar style="light" />
                        <RootNavigator />
                    </View>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212", // Dark background for the entire app
    },
});
