import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

// Components
import Button from "../../components/common/Button";

// Actions
import { register } from "../../services/actions/authActions";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) errors.name = "Name is required";
        if (!email) errors.email = "Email is required";
        else if (!emailRegex.test(email)) errors.email = "Email is invalid";
        if (!password) errors.password = "Password is required";
        else if (password.length < 6) errors.password = "Password must be at least 6 characters";
        if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
        else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = () => {
        if (validateForm()) {
            dispatch(register(name, email, password));
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to access all features</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#BDBDBD"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#888888"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        {formErrors.name && <Text style={styles.fieldError}>{formErrors.name}</Text>}

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
                        {formErrors.email && <Text style={styles.fieldError}>{formErrors.email}</Text>}

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
                        {formErrors.password && <Text style={styles.fieldError}>{formErrors.password}</Text>}

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#BDBDBD"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Confirm Password"
                                placeholderTextColor="#888888"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#BDBDBD"
                                />
                            </TouchableOpacity>
                        </View>
                        {formErrors.confirmPassword && <Text style={styles.fieldError}>{formErrors.confirmPassword}</Text>}

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={loading}
                            style={styles.registerButton}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.loginLink}>Sign In</Text>
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
        marginBottom: 8,
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
    fieldError: {
        color: "#F50057",
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 4,
    },
    registerButton: {
        width: "100%",
        marginTop: 16,
        marginBottom: 24,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    loginText: {
        fontSize: 14,
        color: "#BDBDBD",
    },
    loginLink: {
        fontSize: 14,
        color: "#007AFF",
        fontWeight: "bold",
    },
});

export default RegisterScreen;
