import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000'; 

export const fetchAvailableJobs = async ({ department }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/student/availableJobs`, {
            params: { department }, // Send department as a query parameter
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
};

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


export const fetchInterviewQuestions = async (resumeUrl, numQuestions) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/student/getQuestionFromResume`, {
      resumeUrl,
      numQuestions
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch questions');
  }
};

export const applyForJob = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/student/applyForJob`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error applying for job:', error);
        throw error.response ? error.response.data : error;
    }
};

export const retrieveApplication = async (prn, jobId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/student/retrieveApplication`, {
            prn,
            jobId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error retrieving application:', error);
        throw error.response ? error.response.data : error;
    }
}

export const updateProfile = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/student/updateProfile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response ? error.response.data : error;
  }
};

export const fetchJobs = async (prn) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/getJobs?prn=${prn}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch questions');
  }
};

export const fetchApplicationDetails = async (prn,jobId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/getApplicationDetails?prn=${prn}&jobId=${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch questions');
  }
};
