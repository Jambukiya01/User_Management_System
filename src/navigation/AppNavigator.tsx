import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import UserListScreen from "../screens/UserListScreen";
import UserDetailScreen from "../screens/UserDetailScreen";
import AddEditUserScreen from "../screens/AddEditUserScreen";
import { useAppSelector } from "../store/hooks";
import { Strings } from "../utils/Strings";

export type RootStackParamList = {
    Login: undefined;
    UserList: undefined;
    UserDetail: { userId: string };
    AddEditUser: { userId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {

    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={isLoggedIn ? "UserList" : "Login"}
                screenOptions={{
                    headerTitleAlign: "center",
                }}
            >
                <Stack.Screen name="UserList"
                    component={UserListScreen}
                    options={{ title: Strings.userList }} />
                <Stack.Screen name="UserDetail"
                    component={UserDetailScreen}
                    options={{ title: Strings.userDetail }} />
                <Stack.Screen name="AddEditUser"
                    component={AddEditUserScreen}
                    options={{ title: Strings.addEditUser }} />
                <Stack.Screen name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;