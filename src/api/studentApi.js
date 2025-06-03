import axios from 'axios';
const API_BASE_URL = 'http://localhost:4000'; 

export const fetchAvailableJobs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/student/availableJobs`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

export const fetchPercentage = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/student/fetchMarks`, formData);
        return response.data;
    } catch (error) {
        console.error('Error fetching marks:', error);
        throw error.response ? error.response.data : { message: 'Network error', success: false };
    }
};

export const uploadConfirmedMarks = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/student/uploadDetails`, formData);
        return response.data;
    } catch (error) {
        console.error('Error uploading confirmed marks:', error);
        throw error.response ? error.response.data : { message: 'Network error', success: false };
    }
};

export const uploadManualMarks = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/student/uploadDetails`, formData);
        return response.data;
    } catch (error) {
        console.error('Error uploading manual marks:', error);
        throw error.response ? error.response.data : { message: 'Network error', success: false };
    }
};

// export const fetchJobs = async (token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/company/jobs`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching jobs:', error);
//     throw error.response ? error.response.data : { message: 'Network error', success: false };
//   }
// };