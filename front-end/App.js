import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import Logo from './Logo';
import { useState } from 'react';

export default function App() {
    const [showText, setShowText] = useState(false);

    const handleLogoComplete = () => {
        setShowText(true);
    };

    return (
        <View style={styles.container}>
            <Logo onComplete={handleLogoComplete} />
            {showText && (
                <Text style={styles.text}>Open up App.js to start working on your app!</Text>
            )}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        justifyContent: "center",
        fontSize: 16,
        textAlign: 'center',
    },
});
