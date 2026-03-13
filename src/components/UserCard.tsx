import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { User } from "../types/user";
import { avatarPlaceholder } from "../assets";
import colors from "../utils/colors";

interface Props {
    user: User;
    onPress: () => void;
}

const UserCard: React.FC<Props> = ({ user, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image
                source={user.image ? { uri: user.image } : avatarPlaceholder}
                style={styles.avatar}
            />

            <View style={styles.info}>
                <Text style={styles.name}>
                    {user.first_name} {user.last_name}
                </Text>

                <Text style={styles.email}>{user.email}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default UserCard;

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        padding: 12,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: "center",
        elevation: 2,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },

    info: {
        flex: 1
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },

    email: {
        color: colors.textSecondary,
        marginTop: 2
    },
});