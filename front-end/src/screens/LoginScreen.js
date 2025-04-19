import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

export default function LoginScreen({ navigation, onClose }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                >
                    <Ionicons
                        name="close"
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Welcome to MangaVaani</Text>
                <Text style={styles.subtitle}>Please login to continue</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={theme.colors.text + "80"}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={theme.colors.text + "80"}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signupButton}>
                        <Text style={styles.signupButtonText}>Don't have an account? Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.md,
        alignItems: "flex-end",
    },
    closeButton: {
        padding: theme.spacing.xs,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.text + "80",
        marginBottom: theme.spacing.xl,
    },
    form: {
        gap: theme.spacing.md,
    },
    input: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        color: theme.colors.text,
    },
    loginButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: "center",
        marginTop: theme.spacing.lg,
    },
    loginButtonText: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: "bold",
    },
    signupButton: {
        alignItems: "center",
        marginTop: theme.spacing.md,
    },
    signupButtonText: {
        color: theme.colors.primary,
        fontSize: 14,
    },
});
