import { getQueue, clearQueue } from "./offlineQueue";

import { createUser, updateUser, deleteUserApi } from "../api/userApi";
import { fetchUsers, finishSync, resetUsers, startSync } from "../store/userSlice";
import { uploadImage } from "./cloudinaryService";
let isSyncing = false;

export const syncOfflineQueue = async (dispatch: any) => {

    if (isSyncing) return;
    console.log("Syncing offline queue...");

    isSyncing = true;
    dispatch(startSync());

    const queue = await getQueue();

    if (queue.length === 0) {
        dispatch(finishSync());
        isSyncing = false;
        return;
    }

    for (const action of queue) {
        try {
            if (action.type === "CREATE_USER") {
                let payload = { ...action.payload };
                if (payload.image && payload.image.startsWith("file")) {
                    try {
                        const uploadedUrl = await uploadImage(payload.image);
                        payload.image = uploadedUrl;
                    } catch (e) {
                        console.log("Image upload failed", e);
                    }
                }
                await createUser(payload);
            }

            if (action.type === "UPDATE_USER") {
                let payload = { ...action.payload };
                if (payload.image && payload.image.startsWith("file")) {
                    try {
                        const uploadedUrl = await uploadImage(payload.image);
                        payload.image = uploadedUrl;
                    } catch (e) {
                        console.log("Image upload failed", e);
                    }
                }
                await updateUser(action.id, payload);
            }

            if (action.type === "DELETE_USER") {
                await deleteUserApi(action.id);
            }

        } catch (error) {
            console.log("Sync error", error);
        }
    }

    await clearQueue();
    dispatch(resetUsers());
    dispatch(fetchUsers({ page: 1, limit: 15 }));

    dispatch(finishSync());

    isSyncing = false;
    console.log("Sync completed");
};