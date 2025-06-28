import axios, { AxiosError } from "axios";
import api from "../lib/FastAPI.js"

async function uploadFile(file: File, password?: string) {
    const formData = new FormData()
    formData.append('file', file)
    if (password) {
        formData.append('password', password)
    }
    try {
        const response = await api.post('/dashboard', formData);
        return (response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Upload failed:", error.message);
            return null
        }
        console.error("Upload failed:", error);
        return error
    }
}

export default uploadFile