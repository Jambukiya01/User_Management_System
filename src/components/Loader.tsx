import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import colors from "../utils/colors";

const Loader = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center"
    },
});