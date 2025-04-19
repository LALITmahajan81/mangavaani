import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";

const Button = ({
    title,
    onPress,
    variant = "primary", // primary, secondary, outline
    size = "medium", // small, medium, large
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const getButtonStyles = () => {
        let buttonStyle = [styles.button];

        // Variant styles
        if (variant === "primary") {
            buttonStyle.push(styles.primaryButton);
        } else if (variant === "secondary") {
            buttonStyle.push(styles.secondaryButton);
        } else if (variant === "outline") {
            buttonStyle.push(styles.outlineButton);
        }

        // Size styles
        if (size === "small") {
            buttonStyle.push(styles.smallButton);
        } else if (size === "large") {
            buttonStyle.push(styles.largeButton);
        }

        // Disabled style
        if (disabled || loading) {
            buttonStyle.push(styles.disabledButton);
        }

        // Custom style
        if (style) {
            buttonStyle.push(style);
        }

        return buttonStyle;
    };

    const getTextStyles = () => {
        let textStyles = [styles.buttonText];

        // Variant text styles
        if (variant === "primary") {
            textStyles.push(styles.primaryButtonText);
        } else if (variant === "secondary") {
            textStyles.push(styles.secondaryButtonText);
        } else if (variant === "outline") {
            textStyles.push(styles.outlineButtonText);
        }

        // Size text styles
        if (size === "small") {
            textStyles.push(styles.smallButtonText);
        } else if (size === "large") {
            textStyles.push(styles.largeButtonText);
        }

        // Custom text style
        if (textStyle) {
            textStyles.push(textStyle);
        }

        return textStyles;
    };

    return (
        <TouchableOpacity
            style={getButtonStyles()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? <ActivityIndicator color={variant === "outline" ? "#007AFF" : "#FFFFFF"} /> : <Text style={getTextStyles()}>{title}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    primaryButton: {
        backgroundColor: "#007AFF",
    },
    secondaryButton: {
        backgroundColor: "#F50057",
    },
    outlineButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#007AFF",
    },
    disabledButton: {
        opacity: 0.6,
    },
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    largeButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    buttonText: {
        fontWeight: "600",
        fontSize: 16,
    },
    primaryButtonText: {
        color: "#FFFFFF",
    },
    secondaryButtonText: {
        color: "#FFFFFF",
    },
    outlineButtonText: {
        color: "#007AFF",
    },
    smallButtonText: {
        fontSize: 14,
    },
    largeButtonText: {
        fontSize: 18,
    },
});

export default Button;
