import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import colors from "../utils/colors";

interface Props {
    title: string;
    onPress: () => void;
    variant?: "primary" | "danger" | "outline";
    loading?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ title, onPress, variant = "primary", loading = false }) => {

    const buttonStyle = [
        styles.button,
        variant === "danger" && styles.danger,
        variant === "outline" && styles.outline,
        loading && styles.disabled
    ];

    const textStyle = [
        styles.text,
        variant === "outline" && styles.outlineText,
    ];

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={loading}>
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === "outline" ? colors.primary : colors.white}
                />
            ) : (
                <Text style={textStyle}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default PrimaryButton;

const styles = StyleSheet.create({

    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: colors.primary
    },

    danger: {
        backgroundColor: colors.error
    },

    outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary
    },

    text: {
        color: colors.white,
        fontWeight: "600",
        fontSize: 16
    },

    outlineText: {
        color: colors.primary
    },
    disabled: {
        opacity: 0.7
    },
});