import api from "../lib/api.js"

async function uploadFile(file: File, password?: string) {
    const formData = new FormData()
    formData.append('file', file)
    if (password) {
        formData.append('password', password)
    }
    try {
        const response = await api.post('/dashboard', formData);
        return(response.data);
    } catch (error) {
        console.error("Upload failed:", error);
        return null
    }
}

export default uploadFile