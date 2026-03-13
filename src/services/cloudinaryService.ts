import Config from "react-native-config";
import { Strings } from "../utils/Strings";

export const uploadImage = async (imageUri: string): Promise<string> => {
    try {
        console.log("---Upload image for ", imageUri)
        const data = new FormData();
        data.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "photo.jpg",
        } as any);

        data.append("upload_preset", Config.CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${Config.CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        if (!res.ok) {
            throw new Error(Strings.imageUploadFailed);
        }

        const json = await res.json();
        if (!json.secure_url) {
            throw new Error(Strings.invalidUploadResponse);
        }

        return json.secure_url;
    } catch (error: any) {
        throw new Error(error.message || Strings.imageUploadFailed);
    } finally {
        console.log("---Upload image for ", imageUri)
    }
};