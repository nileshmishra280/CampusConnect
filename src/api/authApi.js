import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000'; // Adjust for production

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