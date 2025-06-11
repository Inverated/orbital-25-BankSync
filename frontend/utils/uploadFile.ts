import api from "../lib/api.js"

async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await api.post('/dashboard', formData);
        return(response.data);
    } catch (error) {
        console.error("Upload failed:", error);
        return null
    }
}

export default uploadFile