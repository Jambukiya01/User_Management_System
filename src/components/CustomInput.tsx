import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import colors from "../utils/colors";

interface Props {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;

    phoneNumber?: boolean;
    dialCode?: string;
    onDialCodeChange?: (code: string) => void;
}

const CustomInput: React.FC<Props> = ({
    placeholder,
    value,
    onChangeText,
    error,
    secureTextEntry,
    phoneNumber,
    dialCode = "+91",
    onDialCodeChange
}) => {

    const [countryCode, setCountryCode] = useState<CountryCode>("IN");

    const onSelectCountry = (country: Country) => {
        const code = "+" + country.callingCode[0];
        setCountryCode(country.cca2);
        onDialCodeChange?.(code);
    };

    return (
        <View style={styles.container}>

            <View style={styles.inputWrapper}>

                {phoneNumber && (
                    <View style={styles.countryButton}>
                        <CountryPicker
                            countryCode={countryCode}
                            withFilter
                            withCallingCode
                            withFlag
                            onSelect={onSelectCountry}
                        />
                        <Text style={styles.dialCode}>{dialCode}</Text>
                    </View>
                )}

                <TextInput
                    style={[styles.input, phoneNumber && styles.phoneInput]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={phoneNumber ? "phone-pad" : "default"}
                    placeholderTextColor={colors.textSecondary}
                />

            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

        </View>
    );
};

export default CustomInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.white,
    },

    countryButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },

    dialCode: {
        marginLeft: 4,
        fontSize: 14,
        color: colors.textPrimary,
    },

    input: {
        flex: 1,
        padding: 12,
        color: colors.textPrimary,
    },

    phoneInput: {
        borderLeftWidth: 1,
        borderLeftColor: colors.border,
    },

    error: {
        color: colors.error,
        marginTop: 4,
    },
});