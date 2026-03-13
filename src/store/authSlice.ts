import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
    loginType: "email" | "mobile" | null;
    email: string | null;
    mobile: string | null;

}

const initialState: AuthState = {
    isLoggedIn: false,
    loginType: null,
    email: null,
    mobile: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { type, email, mobile } = action.payload;
            state.isLoggedIn = true;
            state.loginType = type;
            state.email = email ?? null;
            state.mobile = mobile ?? null;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.loginType = null;
            state.email = null;
            state.mobile = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;