import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000'; // Adjust for production

export const postJob = async (jobData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/company/addJob`, jobData);
        return response.data;
    } catch (error) {
        console.error('Error posting job:', error);
        throw error.response ? error.response.data : error;
    }
}

export const addCompanydetails = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/company/addInformation`, formData);
        return response.data;
    } catch (error) {
        console.error('Error fetching marks:', error);
        throw error.response ? error.response.data : { message: 'Network error', success: false };
    }
};


export const fetchAvailableJobs = async (companyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/getCreatedJobs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}