import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import colors from "../utils/colors";

import { useAppDispatch } from "../store/hooks";
import { loginSuccess } from "../store/authSlice";
import { validateEmail, validateMobile, validatePassword } from "../utils/validators";
import { Strings } from "../utils/Strings";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {

    const dispatch = useAppDispatch();

    const [mode, setMode] = useState<"email" | "mobile">("email");

    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [dialCode, setDialCode] = useState("+91");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<{ email?: string; mobile?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        //MARK: Handle Login
        setLoading(true);
        if (mode === "email") {

            const emailError = validateEmail(email);
            if (emailError) {
                setError({ email: emailError });
                setLoading(false);
                return;
            }
        } else {
            const mobileError = validateMobile(mobile);
            if (mobileError) {
                setError({ mobile: mobileError });
                setLoading(false);
                return;
            }
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError({ password: passwordError });
            setLoading(false);
            return;
        }
        dispatch(
            loginSuccess({
                type: mode,
                email: mode === "email" ? email : null,
                mobile: mode === "mobile" ? `${dialCode} ${mobile}` : null
            })
        );
        navigation.replace("UserList");
    };

    return (
        //MARK: UI
        <View style={styles.container}>
            <Text style={styles.title}>{Strings.userManagement}</Text>
            <View style={styles.switchContainer}>
                <TouchableOpacity
                    style={[
                        styles.switchButton,
                        mode === "email" && styles.switchActive
                    ]}
                    onPress={() => setMode("email")}
                >
                    <Text style={mode === "email" ? styles.switchActiveText : styles.switchButtonText}>{Strings.email}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.switchButton,
                        mode === "mobile" && styles.switchActive
                    ]}
                    onPress={() => setMode("mobile")}
                >
                    <Text style={mode === "mobile" ? styles.switchActiveText : styles.switchButtonText}>{Strings.mobile}</Text>
                </TouchableOpacity>
            </View>
            {mode === "email" && (
                <CustomInput
                    placeholder={Strings.email}
                    value={email}
                    onChangeText={setEmail}
                    error={error.email}
                />
            )}
            {mode === "mobile" && (
                <CustomInput
                    placeholder={Strings.mobile}
                    value={mobile}
                    onChangeText={setMobile}
                    phoneNumber
                    dialCode={dialCode}
                    onDialCodeChange={setDialCode}
                    error={error.mobile}
                />
            )}
            <CustomInput
                placeholder={Strings.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={error.password}
            />
            <PrimaryButton
                title={Strings.login}
                onPress={handleLogin}
                loading={loading}
            />
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    //MARK: Styles
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: colors.background,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 40,
        textAlign: "center",
        color: colors.textPrimary,
    },
    switchContainer: {
        flexDirection: "row",
        marginBottom: 20
    },

    switchButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        borderRadius: 8
    },

    switchActive: {
        backgroundColor: colors.primary
    },

    switchActiveText: {
        color: colors.white,
        fontWeight: "600"
    },

    switchButtonText: {
        color: colors.textPrimary
    }
});