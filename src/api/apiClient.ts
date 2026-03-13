import axios from "axios";
import Config from "react-native-config";
import { Strings } from "../utils/Strings";

export const apiClient = axios.create({
    baseURL: Config.API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.log("Error response:", error.response);

        if (!error.response) {
            return Promise.reject(new Error(Strings.networkError));
        }

        if (error.response.status === 500) {
            return Promise.reject(new Error(Strings.serverError));
        }

        return Promise.reject(error);
    }
);