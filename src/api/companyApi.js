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