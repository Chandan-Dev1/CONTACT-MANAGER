import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000/api/contact",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});




export function getErrorMessage(
    error,
    fallback = "Something went wrong. Please try again."
) {

    if (error?.code === "ERR_NETWORK") {
        return "Cannot reach the server. Check that the backend is running.";
    }

    if (error?.code === "ECONNABORTED") {
        return "The request timed out. Please try again.";
    }

    return error?.response?.data?.message || fallback;
}




export async function fetchContacts(search = "") {

    const params = search.trim()
        ? { q: search.trim() }
        : {};

    const { data } = await api.get("/get", {
        params
    });

    return data.contact ?? [];
}




export async function createContact(contactData) {

    const { data } = await api.post(
        "/create",
        contactData
    );

    return data.contact;
}




export async function updateContact(id, contactData) {

    const { data } = await api.patch(
        `/update/${id}`,
        contactData
    );

    return data.contact;
}


// ========================================
// DELETE CONTACT
// ========================================

export async function deleteContact(id) {

    const { data } = await api.delete(
        `/delete/${id}`
    );

    return data;
}