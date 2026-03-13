import { apiClient } from "./apiClient";
import { User } from "../types/user";
import { Strings } from "../utils/Strings";

const API_URL = "/usersList";

export const getUsers = async (
    page: number,
    limit: number
): Promise<User[]> => {
    try {
        const res = await apiClient.get(API_URL, {
            params: {
                page,
                limit
            },
        });
        console.log("---Get user list for ", page, limit, res.data)
        return res.data;
    } catch (error: any) {
        throw new Error(error.message || Strings.failedToFetchUser)
    }
};

export const getUserById = async (id: string): Promise<User> => {
    try {
        const res = await apiClient.get(`${API_URL}/${id}`);
        console.log("---Get user by id for ", id, res.data)
        return res.data;
    } catch (error: any) {
        throw new Error(error.message || Strings.failedToFetchUser)
    }
};

export const deleteUserApi = async (id: string) => {
    try {
        const res = await apiClient.delete(`${API_URL}/${id}`);
        console.log("---Delete user for ", id, res.data)
        return res.data;
    } catch (error: any) {
        throw new Error(error.message || Strings.failedToFetchUser)
    }
};

export const createUser = async (data: any) => {
    try {
        const res = await apiClient.post(API_URL, data);
        console.log("---Create user for ", data, res.data)
        return res.data;
    } catch (error: any) {
        throw new Error(error.message || Strings.failedToFetchUser)
    }
};

export const updateUser = async (id: string, data: any) => {
    console.log("---Update user for ", id, data)
    try {
        const res = await apiClient.put(`${API_URL}/${id}`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.message || Strings.failedToFetchUser)
    }
};