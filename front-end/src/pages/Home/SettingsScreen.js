import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

// Actions
import { logout } from "../../services/actions/authActions";
import { setReadingMode, setFontSize, toggleNotifications, setDataUsage, toggleAutoUpdate } from "../../services/actions/settingsActions";

// Components
import Button from "../../components/common/Button";

const SettingsScreen = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.settings);
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
    };

    const renderSwitch = (value, onValueChange) => (
        <Switch
            trackColor={{ false: "#333333", true: "#007AFF" }}
            thumbColor={value ? "#FFFFFF" : "#F5F5F5"}
            ios_backgroundColor="#333333"
            onValueChange={onValueChange}
            value={value}
        />
    );

    const renderSettingItem = (icon, title, rightComponent, onPress = null) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.settingLeftSection}>
                <Ionicons
                    name={icon}
                    size={24}
                    color="#007AFF"
                    style={styles.settingIcon}
                />
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            <View>{rightComponent}</View>
        </TouchableOpacity>
    );

    const renderRadioOption = (options, selectedValue, onSelect) => (
        <View style={styles.radioOptionsContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={styles.radioOption}
                    onPress={() => onSelect(option.value)}
                >
                    <View style={[styles.radioButton, selectedValue === option.value && styles.radioButtonSelected]}>
                        {selectedValue === option.value && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Ionicons
                            name="person-circle"
                            size={80}
                            color="#007AFF"
                        />
                    </View>
                    <Text style={styles.userName}>{user?.name || "User"}</Text>
                    <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
                </View>

                {/* Account Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    {renderSettingItem(
                        "person-outline",
                        "Profile Settings",
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#BDBDBD"
                        />
                    )}
                    {renderSettingItem(
                        "notifications-outline",
                        "Notifications",
                        renderSwitch(settings.notifications, () => dispatch(toggleNotifications()))
                    )}
                    {renderSettingItem(
                        "log-out-outline",
                        "Log Out",
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#BDBDBD"
                        />,
                        handleLogout
                    )}
                </View>

                {/* Reading Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reading Preferences</Text>

                    {/* Reading Mode */}
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeftSection}>
                            <Ionicons
                                name="book-outline"
                                size={24}
                                color="#007AFF"
                                style={styles.settingIcon}
                            />
                            <Text style={styles.settingTitle}>Reading Mode</Text>
                        </View>
                    </TouchableOpacity>
                    {renderRadioOption(
                        [
                            { label: "Right to Left", value: "rightToLeft" },
                            { label: "Left to Right", value: "leftToRight" },
                            { label: "Vertical Scroll", value: "vertical" },
                        ],
                        settings.readingMode,
                        (value) => dispatch(setReadingMode(value))
                    )}

                    {/* Font Size */}
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeftSection}>
                            <Ionicons
                                name="text-outline"
                                size={24}
                                color="#007AFF"
                                style={styles.settingIcon}
                            />
                            <Text style={styles.settingTitle}>Font Size</Text>
                        </View>
                    </TouchableOpacity>
                    {renderRadioOption(
                        [
                            { label: "Small", value: "small" },
                            { label: "Medium", value: "medium" },
                            { label: "Large", value: "large" },
                        ],
                        settings.fontSize,
                        (value) => dispatch(setFontSize(value))
                    )}
                </View>

                {/* App Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>
                    {renderSettingItem(
                        "refresh-outline",
                        "Auto Update Chapters",
                        renderSwitch(settings.autoUpdateChapters, () => dispatch(toggleAutoUpdate()))
                    )}

                    {/* Data Usage */}
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeftSection}>
                            <Ionicons
                                name="cellular-outline"
                                size={24}
                                color="#007AFF"
                                style={styles.settingIcon}
                            />
                            <Text style={styles.settingTitle}>Data Usage</Text>
                        </View>
                    </TouchableOpacity>
                    {renderRadioOption(
                        [
                            { label: "Low", value: "low" },
                            { label: "Normal", value: "normal" },
                            { label: "High", value: "high" },
                        ],
                        settings.dataUsage,
                        (value) => dispatch(setDataUsage(value))
                    )}
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    {renderSettingItem(
                        "information-circle-outline",
                        "About MangaVaani",
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#BDBDBD"
                        />
                    )}
                    {renderSettingItem(
                        "help-circle-outline",
                        "Help & Support",
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#BDBDBD"
                        />
                    )}
                    {renderSettingItem(
                        "document-text-outline",
                        "Terms of Service",
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#BDBDBD"
                        />
                    )}
                    {renderSettingItem(
                        "shield-checkmark-outline",
                        "Privacy Policy",
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#BDBDBD"
                        />
                    )}
                </View>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    scrollContent: {
        padding: 16,
    },
    profileSection: {
        alignItems: "center",
        padding: 20,
        marginBottom: 20,
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
    },
    avatarContainer: {
        marginBottom: 12,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: "#BBBBBB",
    },
    section: {
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    settingLeftSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    settingIcon: {
        marginRight: 12,
    },
    settingTitle: {
        fontSize: 16,
        color: "#FFFFFF",
    },
    radioOptionsContainer: {
        marginLeft: 36,
        marginBottom: 8,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#555555",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    radioButtonSelected: {
        borderColor: "#4a9eff",
    },
    radioButtonInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: "#4a9eff",
    },
    radioLabel: {
        fontSize: 16,
        color: "#DDDDDD",
    },
    versionContainer: {
        alignItems: "center",
        padding: 16,
    },
    versionText: {
        color: "#888888",
        fontSize: 14,
    },
});

export default SettingsScreen;
