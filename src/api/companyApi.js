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

export const fetchAllJobs = async (companyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/getAllCreatedJobs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}



export const getAllAppliedStudents = async (jobId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/interestedStudents?jobId=${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

export const selectApplicants = async (jobId, selectedPRNs) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/company/selectStudents`, {jobId,selectedPRNs});
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

export const selectedStudentDetails = async (jobId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/selectedStudents?jobId=${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

export const rejectedStudentDetails = async (jobId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/rejectedStudents?jobId=${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

export const allocatedJobs = async (companyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/allocatedJobs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

export const fetchAvailableJobsForInterview = async (companyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/getJobsForInterview?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

// API function to schedule interviews
export const selectApplicantsForInterview = async (jobId, prnS) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/company/scheduleInterview`, { jobId, prnS });
        return response.data;
    } catch (error) {
        console.error('Error scheduling interviews:', error);
        throw error.response ? error.response.data : error;
    }
};

//API function to get jobs which are already scheduled
export const fetchScheduledJobs = async (companyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/scheduledJobs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

export const getStudentsSelectedForInterview = async (jobId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/studentsSelectedForInterview?jobId=${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}

//API function to get jobs which were scheduled and are now over
export const fetchPastScheduledJobs = async (companyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/company/pastScheduledJobs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error.response ? error.response.data : error;
    }
}
