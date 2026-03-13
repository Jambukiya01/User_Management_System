import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
    ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { deleteUserApi, getUserById } from "../api/userApi";
import { User } from "../types/user";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteUser } from "../store/userSlice";
import { useFocusEffect } from "@react-navigation/native";
import { showSuccess, showError } from "../utils/toast";
import { addToQueue } from "../services/offlineQueue";
import NetInfo from "@react-native-community/netinfo";
import { avatarPlaceholder } from "../assets";
import PrimaryButton from "../components/PrimaryButton";
import colors from "../utils/colors";
import { Strings } from "../utils/Strings";

type Props = NativeStackScreenProps<RootStackParamList, "UserDetail">;

const UserDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const dispatch = useAppDispatch();
    const { users } = useAppSelector(state => state.users);
    const { userId } = route.params;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchUser = async () => {
        try {
            const data = await getUserById(userId);
            setUser(data);
        } catch (error) {
            console.log(Strings.errorFetchingUser, error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const reduxUser = users.find(u => u.id === userId);
            if (reduxUser) {
                setUser(reduxUser);
                setLoading(false);
                return;
            }
            fetchUser();
        }, [userId, users])
    );

    const handleDelete = () => {
        //MARK: Delete User
        Alert.alert(Strings.deleteUser, Strings.areYouSureYouWantToDeleteThisUser, [
            { text: Strings.cancel, style: "cancel" },
            {
                text: Strings.deleteUser,
                style: "destructive",
                onPress: async () => {
                    setDeleteLoading(true);
                    try {
                        const state = await NetInfo.fetch();
                        if (!state.isConnected) {
                            dispatch(deleteUser(userId));
                            await addToQueue({
                                type: "DELETE_USER",
                                id: userId
                            });
                            showSuccess(Strings.deleteSavedOffline);
                            navigation.goBack();
                            return;
                        }
                        await deleteUserApi(userId);
                        dispatch(deleteUser(userId));
                        showSuccess(Strings.userDeletedSuccessfully);
                        navigation.goBack();
                    } catch (error) {
                        showError(Strings.failedToDeleteUser);
                    } finally {
                        setDeleteLoading(false);
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.loader}>
                <Text>{Strings.userNotFound}</Text>
            </View>
        );
    }

    return (
        //MARK: UI
        <ScrollView style={styles.container}>
            <Image
                source={user.image ? { uri: user.image } : avatarPlaceholder}
                style={styles.avatar}
            />
            <Text style={styles.name}>
                {user.first_name} {user.last_name}
            </Text>

            <View style={styles.card}>
                <InfoRow label={Strings.email} value={user.email} />
                <InfoRow
                    label={Strings.mobile}
                    value={`${user.dial_code} ${user.phone_number}`}
                />
                <InfoRow
                    label={Strings.birthDate}
                    value={user.birth_date}
                />
                <InfoRow
                    label={Strings.gender}
                    value={user.gender}
                />
                <InfoRow
                    label={Strings.address}
                    value={user.address}
                />
            </View>

            <View style={styles.buttons}>

                <PrimaryButton
                    title={Strings.editUser}
                    onPress={() =>
                        navigation.navigate("AddEditUser", { userId: user.id })
                    }
                />

                <PrimaryButton
                    title={Strings.deleteUser}
                    onPress={handleDelete}
                    variant="danger"
                    loading={deleteLoading}
                />

            </View>

        </ScrollView>
    );

};

export default UserDetailScreen;

const InfoRow = ({ label, value }: { label: string; value: string }) => (

    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
    </View>

);


const styles = StyleSheet.create({
    //MARK: Styles
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: "center",
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
        color: colors.textPrimary
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 16,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    rowLabel: {
        fontSize: 14,
        color: colors.textSecondary
    },
    rowValue: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.textPrimary,
        maxWidth: "60%",
        textAlign: "right"
    },
    buttons: {
        marginTop: 30,
        gap: 12
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

});