import axios from "axios";
import api from "../lib/FastAPI.js"
import { uploadReturnData } from "./types.js";

export async function uploadNewFile(file: File, password?: string): Promise<{ status: number, data: uploadReturnData | null, error: Error | null }> {
    const formData = new FormData()
    formData.append('file', file)
    if (password) {
        formData.append('password', password)
    }
    try {
        const response = await api.post('/dashboard', formData);
        return { status: 200, data: (response.data), error: null }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Upload failed:", error.message);
            return { status: 404, data: null, error: new Error("Upload failed: " + error.message) }
        }
        console.error("Upload failed:", error);
        return { status: 404, data: null, error: error as Error }
    }
}

export async function uploadFileToEncrypt(file: File, password: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('password', password)

    try {
        const response = await api.post('/encryptFile', formData, { responseType: 'blob' })
        return { status: 200, data: response.data as Blob, error: null }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Upload failed:", error.message);
            return { status: 404, data: null, error: new Error("Upload failed: " + error.message) }
        }
        console.error("Upload failed:", error);
        return { status: 404, data: null, error: error as Error }
    }
}