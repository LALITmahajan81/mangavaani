import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

// Components
import Button from "../../components/common/Button";

// Actions
import { login } from "../../services/actions/authActions";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleLogin = () => {
        if (email && password) {
            dispatch(login(email, password));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Login to continue reading your favorite manga</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#BDBDBD"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#888888"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#BDBDBD"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Password"
                                placeholderTextColor="#888888"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#BDBDBD"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Login"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.loginButton}
                        />

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text style={styles.registerLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#BDBDBD",
    },
    formContainer: {
        width: "100%",
    },
    errorText: {
        color: "#F50057",
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333333",
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 56,
        backgroundColor: "#252525",
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: "100%",
        fontSize: 16,
        color: "#FFFFFF",
    },
    passwordInput: {
        paddingRight: 40,
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        height: "100%",
        justifyContent: "center",
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: "#007AFF",
        fontSize: 14,
    },
    loginButton: {
        width: "100%",
        marginBottom: 24,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    registerText: {
        fontSize: 14,
        color: "#BDBDBD",
    },
    registerLink: {
        fontSize: 14,
        color: "#007AFF",
        fontWeight: "bold",
    },
});

export default LoginScreen;
