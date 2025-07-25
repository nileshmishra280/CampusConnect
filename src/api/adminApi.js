import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const addCompany = async (companyData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/addCompany`, companyData);
        return response.data;
    } catch (error) {
        console.error('Error adding company:', error);
        throw error.response ? error.response.data : error;
    }
}

export const fetchAllStudents = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/allStudents`);
        return response.data;
    } catch (error) {
        console.error('Error adding company:', error);
        throw error.response ? error.response.data : error;
    }
}


export const fetchAllCompanies = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/allCompanies`);
        return response.data;
    } catch (error) {
        console.error('Error adding company:', error);
        throw error.response ? error.response.data : error;
    }
}

export const fetchPlacementAnalytics = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/analytics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching placement analytics:', error);
        throw error.response ? error.response.data : error;
    }
};


export const fetchPendingVerifications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/pendingVerifications`);
        return response.data;
    } catch (error) {
        console.error('Error fetching placement analytics:', error);
        throw error.response ? error.response.data : error;
    }
};


export const verifyPRN = async (prn) => {
    console.log("Verifying PRN:", prn);
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/verifyPRN`, { prn });
        return response.data;
    } catch (error) {
        console.error('Error verifying PRN:', error);
        throw error.response ? error.response.data : error;
    }
};