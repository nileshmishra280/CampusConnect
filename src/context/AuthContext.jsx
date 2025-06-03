import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStudentData, fetchCompanyData } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load user data based on role and token
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const role = localStorage.getItem('role');
      setUserType(role);

      let token;
      if (role === 'student') {
        token = localStorage.getItem('studentToken');
      } else if (role === 'company') {
        token = localStorage.getItem('companyToken');
      } else if (role === 'admin') {
        token = localStorage.getItem('adminToken');
      }

      if (!token) {
        console.warn('No token found for role:', role);
        setUser(null);
        setUserType(null);
        setLoading(false);
        return;
      }

      let userData = null;
      if (role === 'student') {
        userData = await fetchStudentData();
      } else if (role === 'company') {
        userData = await fetchCompanyData();
      } else if (role === 'admin') {
        // Admin data fetch can be added if needed
        userData = { role: 'admin' }; // Placeholder for admin data
      }
      setUser(userData);
    } catch (err) {
      console.error('Error loading user:', err);
      setError(err.error || 'Failed to load user data');
      setUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    loadData();
  }, []);

  // Listen for changes to the role in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newRole = localStorage.getItem('role');
      if (newRole !== userType) {
        loadData(); // Reload user data when role changes
      }
    };

    // Listen for storage events (triggered by other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Also check manually for changes in the same tab
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userType]); // Re-run when userType changes

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setUserType(null);
  };

  const value = {
    user,
    userType,
    loading,
    error,
    setUser,
    setUserType,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};