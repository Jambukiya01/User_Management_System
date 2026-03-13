import { Strings } from "./Strings";

export const validateEmail = (email: string): string | null => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return Strings.emailError;
    }
    if (!regex.test(email)) {
        return Strings.emailInvalidError;
    }
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) {
        return Strings.passwordError;
    }
    if (password.length < 6) {
        return Strings.passwordLengthError;
    }
    const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!regex.test(password)) {
        return Strings.passwordInvalidError;
    }
    return null;
};

export const validateMobile = (mobile: string): string | null => {
    if (!mobile) {
        return Strings.mobileError;
    }
    const regex = /^[0-9]{8,15}$/;
    if (!regex.test(mobile)) {
        return Strings.mobileInvalidError;
    }
    return null;
};