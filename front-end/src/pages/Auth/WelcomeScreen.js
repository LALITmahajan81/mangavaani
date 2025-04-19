import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";

const { width } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Text style={styles.appName}>MangaVaani</Text>
                    <Text style={styles.tagline}>A Cleaner & Simpler Way to Read Manga and Webtoons</Text>
                </View>

                <View style={styles.illustrationContainer}>
                    {/* Placeholder for an illustration image */}
                    <Image
                        source={{ uri: "https://via.placeholder.com/400x300" }}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureTitle}>Clean Reading Experience</Text>
                        <Text style={styles.featureDescription}>Enjoy manga without ads or distractions</Text>
                    </View>

                    <View style={styles.featureItem}>
                        <Text style={styles.featureTitle}>Customizable View Modes</Text>
                        <Text style={styles.featureDescription}>Read in the style that suits you best</Text>
                    </View>

                    <View style={styles.featureItem}>
                        <Text style={styles.featureTitle}>Offline Reading</Text>
                        <Text style={styles.featureDescription}>Download chapters to read anywhere</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Get Started"
                        onPress={() => navigation.navigate("Register")}
                        variant="primary"
                        size="large"
                        style={styles.button}
                    />

                    <Button
                        title="Login"
                        onPress={() => navigation.navigate("Login")}
                        variant="outline"
                        size="large"
                        style={styles.button}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "space-between",
    },
    logoContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    appName: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#007AFF",
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: "#BDBDBD",
        textAlign: "center",
        maxWidth: "80%",
    },
    illustrationContainer: {
        width: width * 0.8,
        height: 200,
        marginVertical: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    illustration: {
        width: "100%",
        height: "100%",
    },
    featuresContainer: {
        width: "100%",
        marginBottom: 40,
    },
    featureItem: {
        marginBottom: 16,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: "#BDBDBD",
    },
    buttonContainer: {
        width: "100%",
        marginBottom: 24,
    },
    button: {
        width: "100%",
        marginBottom: 16,
    },
});

export default WelcomeScreen;
