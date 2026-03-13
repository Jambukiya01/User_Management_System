import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Platform,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import { createUser, updateUser, getUserById } from "../api/userApi";
import { uploadImage } from "../services/cloudinaryService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import DatePicker from "react-native-date-picker";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addUser, updateUser as updateUserState } from "../store/userSlice";
import { showSuccess, showError } from "../utils/toast";
import NetInfo from "@react-native-community/netinfo";
import { addToQueue } from "../services/offlineQueue";
import { avatarPlaceholder, pencilIcon } from "../assets";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import colors from "../utils/colors";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { validateEmail, validateMobile } from "../utils/validators";
import { Strings } from "../utils/Strings";

type Props = NativeStackScreenProps<RootStackParamList, "AddEditUser">;

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    gender?: string;
    image?: string;
}
const AddEditUserScreen: React.FC<Props> = ({ route, navigation }) => {
    const dispatch = useAppDispatch();
    const { users } = useAppSelector(state => state.users);

    const userId = route.params?.userId;
    const reduxUser = users.find(u => u.id === userId);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [dialCode, setDialCode] = useState("+91");
    const [birthDate, setBirthDate] = useState(new Date());
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [gender, setGender] = useState("Male");
    const [error, setError] = useState<FormErrors>({});
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        if (reduxUser) {
            populateForm(reduxUser);
        } else {
            loadUser();
        }
    }, [userId, reduxUser]);

    const populateForm = (data: any) => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setPhone(data.phone_number);
        setAddress(data.address);
        setBirthDate(new Date(data.birth_date));
        setGender(data.gender);
        setImage(data.image);
    };

    const loadUser = async () => {
        try {
            const data = await getUserById(userId!);
            populateForm(data);
        } catch (error) {
            showError(Strings.failedToFetchUser);
        }
    };

    const openCamera = async () => {
        //MARK: Camera
        const permission =
            Platform.OS === "android"
                ? PERMISSIONS.ANDROID.CAMERA
                : PERMISSIONS.IOS.CAMERA;

        const result = await check(permission);

        if (result !== RESULTS.GRANTED) {
            const requestResult = await request(permission);

            if (requestResult !== RESULTS.GRANTED) {
                return;
            }
        }

        launchCamera(
            {
                mediaType: "photo",
                cameraType: "front",
            },
            response => {
                if (response.assets) {
                    setImage(response.assets[0].uri!);
                }
            }
        );
    };

    const validateForm = () => {
        //MARK: Validation
        const errors: FormErrors = {};
        if (!firstName) errors.firstName = Strings.firstNameError;
        if (!lastName) errors.lastName = Strings.lastNameError;
        if (!address) errors.address = Strings.addressError;
        if (!gender) errors.gender = Strings.genderError;
        const emailError = validateEmail(email);
        if (emailError) {
            setError({ email: emailError });
            return;
        }
        const phoneError = validateMobile(phone);
        if (phoneError) {
            setError({ phone: phoneError });
            return;
        }
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        //MARK: Handle Submit
        if (!validateForm()) return;
        setLoading(true);
        try {
            const state = await NetInfo.fetch();
            let imageUrl = image;
            if (state.isConnected) {
                if (image && !image.startsWith("http")) {
                    imageUrl = await uploadImage(image);
                }
            }
            const id = userId ?? `user_${Date.now()}`;
            const payload = {
                id,
                first_name: firstName,
                last_name: lastName,
                email,
                phone_number: phone,
                dial_code: dialCode,
                address,
                birth_date: birthDate.toISOString().split("T")[0],
                gender,
                image: imageUrl,
            };
            console.log("---User Data to be sent---", payload);
            if (userId) {
                //MARK: Update User
                if (!state.isConnected) {
                    dispatch(updateUserState({
                        ...payload
                    }));
                    await addToQueue({
                        type: "UPDATE_USER",
                        id: userId,
                        payload
                    });
                    showSuccess(Strings.updateSavedOffline);
                    navigation.goBack();
                    return;
                }

                const updatedUser = await updateUser(userId, payload);
                dispatch(updateUserState(updatedUser));
                showSuccess(Strings.userUpdatedSuccessfully);

            } else {
                //MARK: Create User
                if (!state.isConnected) {
                    dispatch(addUser(payload));
                    await addToQueue({
                        type: "CREATE_USER",
                        payload: payload
                    });
                    showSuccess(Strings.userSavedOffline);
                    navigation.goBack();
                    return;
                }
                const newUser = await createUser(payload);
                dispatch(addUser(newUser));
                showSuccess(Strings.userAddedSuccessfully);
            }

            navigation.goBack();
        } catch (error) {
            showError(Strings.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    return (
        //MARK: UI
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>
                {userId ? Strings.editUser : Strings.addUser}
            </Text>
            <View style={styles.avatarContainer}>
                <Image
                    source={image ? { uri: image } : avatarPlaceholder}
                    style={styles.avatar} />
                <TouchableOpacity style={styles.editButton} onPress={openCamera}>
                    <Image source={pencilIcon} style={styles.editIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.card}>

                <CustomInput
                    placeholder={Strings.firstName}
                    value={firstName}
                    onChangeText={setFirstName}
                    error={error.firstName}
                />

                <CustomInput
                    placeholder={Strings.lastName}
                    value={lastName}
                    onChangeText={setLastName}
                    error={error.lastName}
                />

                <CustomInput
                    placeholder={Strings.email}
                    value={email}
                    onChangeText={setEmail}
                    error={error.email}
                />

                <CustomInput
                    placeholder={Strings.mobile}
                    value={phone}
                    onChangeText={setPhone}
                    phoneNumber
                    dialCode={dialCode}
                    onDialCodeChange={setDialCode}
                    error={error.phone}
                />

                <View style={styles.dateRow}>

                    <Text style={styles.inputLabel}>
                        {Strings.birthDate}
                    </Text>

                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setDatePickerOpen(true)}
                    >
                        <Text style={styles.dateText}>
                            {birthDate.toDateString()}
                        </Text>
                    </TouchableOpacity>

                </View>
                <DatePicker
                    modal
                    open={datePickerOpen}
                    date={birthDate}
                    mode="date"
                    maximumDate={new Date()}
                    onConfirm={(date) => {
                        setDatePickerOpen(false);
                        setBirthDate(date);
                    }}
                    onCancel={() => {
                        setDatePickerOpen(false);
                    }}
                />

                <View style={styles.genderContainer}>

                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            gender === "Male" && styles.genderSelected
                        ]}
                        onPress={() => setGender("Male")}
                    >
                        <Text style={gender === "Male" ? styles.genderTextSelected : styles.genderText}>
                            {Strings.male}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            gender === "Female" && styles.genderSelected
                        ]}
                        onPress={() => setGender("Female")}
                    >
                        <Text style={gender === "Female" ? styles.genderTextSelected : styles.genderText}>
                            {Strings.female}
                        </Text>
                    </TouchableOpacity>

                </View>
                <CustomInput
                    placeholder={Strings.address}
                    value={address}
                    onChangeText={setAddress}
                    error={error.address}
                />
            </View>

            <View style={{ marginTop: 24 }}>
                <PrimaryButton
                    title={userId ? Strings.updateUser : Strings.createUser}
                    onPress={handleSubmit}
                    loading={loading}
                />
            </View>

        </ScrollView>
    );
};

export default AddEditUserScreen;

const styles = StyleSheet.create({
    //MARK: Styles
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
        color: colors.textPrimary
    },

    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 16,
        elevation: 2
    },

    avatarContainer: {
        alignSelf: "center",
        marginBottom: 20,
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },

    editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },

    editIcon: {
        width: 18,
        height: 18,
        tintColor: colors.white
    },

    genderContainer: {
        flexDirection: "row",
        marginVertical: 16
    },

    genderButton: {
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 10
    },

    genderSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary
    },

    genderText: {
        color: colors.textPrimary
    },

    genderTextSelected: {
        color: colors.white,
        fontWeight: "600"
    },
    dateContainer: {
        marginTop: 12,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12
    },

    inputLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: "500",
        width: 100
    },

    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
    },

    dateText: {
        color: colors.textPrimary
    },

});