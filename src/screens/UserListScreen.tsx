import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Modal,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { User } from "../types/user";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers } from "../store/userSlice";
import { showError } from "../utils/toast";
import NetInfo from "@react-native-community/netinfo";
import { syncOfflineQueue } from "../services/syncService";
import colors from "../utils/colors";
import { avatarPlaceholder } from "../assets";
import { logout } from "../store/authSlice";
import PrimaryButton from "../components/PrimaryButton";
import { Strings } from "../utils/Strings";

type Props = NativeStackScreenProps<RootStackParamList, "UserList">;

const LIMIT = 15;

const UserListScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { users, loading, hasMore, syncing } = useAppSelector(state => state.users);
    const { email, mobile } = useAppSelector(state => state.auth);

    const [page, setPage] = useState(1);

    const [refreshing, setRefreshing] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => setProfileVisible(true)}
                    style={{ marginRight: 12 }}
                >
                    <Image
                        source={avatarPlaceholder}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18
                        }}
                    />
                </TouchableOpacity>
            ),
        });

    }, [navigation]);

    useEffect(() => {
        //MARK: Sync Offline Queue
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                syncOfflineQueue(dispatch);
            }
        });
        loadUsers();
        return unsubscribe;

    }, []);

    const loadUsers = async () => {

        const state = await NetInfo.fetch();

        if (state.isConnected) {
            dispatch(fetchUsers({ page: 1, limit: LIMIT }));
        } else {
            showError("Offline mode - showing cached users");
        }

    };

    const loadMore = async () => {
        //MARK: Load More
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            showError("No internet connection");
            return;
        }
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(fetchUsers({ page: nextPage, limit: LIMIT }));
    };

    const onRefresh = async () => {
        //MARK: On Refresh
        setRefreshing(true);
        setPage(1);
        dispatch({ type: "users/resetUsers" });
        await dispatch(fetchUsers({ page: 1, limit: LIMIT }));
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: User }) => (
        <UserCard
            user={item}
            onPress={() =>
                navigation.navigate("UserDetail", { userId: item.id! })
            }
        />
    );

    const handleLogout = () => {
        //MARK: Handle Logout
        dispatch(logout());
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });

    };
    return (
        //MARK: UI
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id!}
                renderItem={renderItem}
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                initialNumToRender={10}
                ListFooterComponent={loading ? <Loader /> : null}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />

            {users.length === 0 && !loading && (
                <Text style={styles.empty}>{Strings.noUsersFound}</Text>
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("AddEditUser", {})}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
            {syncing && (
                <View style={styles.syncOverlay}>
                    <ActivityIndicator size="large" color={colors.white} />
                    <Text style={styles.syncText}>{Strings.syncingOfflineChanges}</Text>
                </View>
            )}

            <Modal
                visible={profileVisible}
                animationType="slide"
                transparent
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Image
                            source={avatarPlaceholder}
                            style={styles.profileAvatar}
                        />
                        <Text style={styles.profileTitle}>
                            {Strings.loggedInUser}
                        </Text>
                        <Text style={styles.profileValue}>
                            {email ?? mobile}
                        </Text>
                        <View style={styles.buttonContainer}>
                            <PrimaryButton
                                title={Strings.logout}
                                onPress={handleLogout}
                                variant="danger"
                            />
                            <PrimaryButton
                                title={Strings.close}
                                onPress={() => setProfileVisible(false)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default UserListScreen;

const styles = StyleSheet.create({
    //MARK: Styles
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
    },

    empty: {
        textAlign: "center",
        marginTop: 40,
        color: colors.textSecondary,
    },

    fab: {
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },

    fabText: {
        color: colors.white,
        fontSize: 30,
        fontWeight: "bold",
    },

    syncOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },

    syncText: {
        color: colors.white,
        marginTop: 10,
        fontSize: 16
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        width: "80%",
        backgroundColor: colors.white,
        padding: 24,
        borderRadius: 10,
        alignItems: "center",
    },

    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10
    },

    profileTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8
    },

    profileValue: {
        fontSize: 16,
        marginBottom: 20
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20
    }
});