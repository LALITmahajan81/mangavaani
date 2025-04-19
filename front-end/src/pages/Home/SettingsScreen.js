import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

// Actions
import { logout } from "../../services/actions/authActions";
import { setTheme, setReadingMode, setFontSize, toggleNotifications, setDataUsage, toggleAutoUpdate } from "../../services/actions/settingsActions";

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
            trackColor={{ false: "#E0E0E0", true: "#6C63FF" }}
            thumbColor={value ? "#FFFFFF" : "#F5F5F5"}
            ios_backgroundColor="#E0E0E0"
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
                    color="#6C63FF"
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
                            color="#6C63FF"
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
                                color="#6C63FF"
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
                                color="#6C63FF"
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
                        "moon-outline",
                        "Dark Mode",
                        renderSwitch(settings.theme === "dark", () => dispatch(setTheme(settings.theme === "dark" ? "light" : "dark")))
                    )}
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
                                color="#6C63FF"
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
        backgroundColor: "#F5F5F5",
    },
    scrollContent: {
        padding: 16,
    },
    profileSection: {
        alignItems: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 24,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#212121",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: "#757575",
    },
    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 24,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#212121",
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
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
        color: "#212121",
    },
    radioOptionsContainer: {
        paddingLeft: 36,
        marginBottom: 8,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#BDBDBD",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    radioButtonSelected: {
        borderColor: "#6C63FF",
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#6C63FF",
    },
    radioLabel: {
        fontSize: 14,
        color: "#424242",
    },
    versionContainer: {
        alignItems: "center",
        marginVertical: 16,
    },
    versionText: {
        fontSize: 14,
        color: "#9E9E9E",
    },
});

export default SettingsScreen;
