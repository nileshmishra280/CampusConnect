import axios from 'axios';
const API_BASE_URL =import.meta.env.VITE_API_URL; // Adjust for production

export const StudentLogin = async (prn, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/student/logIn`, { prn, password });
    return response.data;
  } catch (error) {
    console.error('Error during student login:', error);
    throw error.response ? error.response.data : error;
  }
};

export const StudentRegister = async (studentData) => {
  try {
    console.log('Registering student with data:');
    const response = await axios.post(`${API_BASE_URL}/student/signUp`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error during student registration:', error);
    throw error.response ? error.response.data : error;
  }
};

export const VerifyEmail = async (email, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/student/verify-email`, { email, code });
    return response.data;
  } catch (error) {
    console.error('Error during email verification:', error);
    throw error.response ? error.response.data : error;
  }
};

export const CompanyLogin = async (companyId, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/company/logIn`, { companyId, password });
    return response.data;
  } catch (error) {
    console.error('Error during company login:', error);
    throw error.response ? error.response.data : error;
  }
};

export const AdminLogin = async (password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/logIn`, { password });
    return response.data;
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error.response ? error.response.data : error;
  }
};

export const AdminRegister = async (adminData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/register`, adminData);
    return response.data;
  } catch (error) {
    console.error('Error during admin registration:', error);
    throw error.response ? error.response.data : error;
  }
};

export const sendMarksheets = async (marksheetData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/student/uploadDetails`, marksheetData);
    return response.data;
  } catch (error) {
    console.error('Error sending marksheets:', error);
    throw error.response ? error.response.data : error;
  }
};


// Fetch student data
export const fetchStudentData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/studentData`, {
      headers: {
        Authorization: `${localStorage.getItem('studentToken')}`,
      },
    });
    console.log('Student data fetched:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error.response ? error.response.data : error;
  }
};

// Fetch company data
export const fetchCompanyData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/company/companyData`, {
      headers: {
        Authorization: `${localStorage.getItem('companyToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error.response ? error.response.data : error;
  }
};