import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../api/userApi";
import { User } from "../types/user";
import { showError } from "../utils/toast";

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    syncing: boolean;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
    hasMore: true,
    syncing: false
};

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async ({ page, limit }: { page: number; limit: number }) => {
        try {
            const data = await getUsers(page, limit);
            return { data, limit, page };
        } catch (error: any) {
            showError(error.message);
            return { data: [], limit, page };
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.users.unshift(action.payload);
        },

        updateUser: (state, action) => {

            const index = state.users.findIndex(
                user => user.id === action.payload.id
            );
            if (index !== -1) {
                state.users[index] = {
                    ...state.users[index],
                    ...action.payload
                };
            }
        },

        deleteUser: (state, action) => {
            state.users = state.users.filter(
                user => user.id !== action.payload
            );
        },
        resetUsers: (state) => {
            state.users = [];
            state.hasMore = true;
        },
        startSync: (state) => {
            state.syncing = true;
        },

        finishSync: (state) => {
            state.syncing = false;
        },
        setLoadMore: (state, action) => {
            state.hasMore = action.payload;
        }
    },

    extraReducers: builder => {
        builder
            .addCase(fetchUsers.pending, state => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                const { data, limit, page } = action.payload;
                if (page === 1) {
                    state.users = data;
                } else {
                    state.users = [...state.users, ...data];
                }
                if (data.length < limit) {
                    state.hasMore = false;
                } else {
                    state.hasMore = true;
                }
            })
            .addCase(fetchUsers.rejected, state => {
                state.loading = false;
                state.error = "Failed to fetch users";
            });
    },
});

export const { addUser, updateUser, deleteUser, resetUsers, startSync, finishSync, setLoadMore } = userSlice.actions;

export default userSlice.reducer;