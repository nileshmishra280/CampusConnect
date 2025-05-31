import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { StudentLogin, CompanyLogin, AdminLogin, fetchStudentData, fetchCompanyData } from '../api/authApi'; // Import missing API functions
import { useAuth } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [role, setRole] = useState('student'); // Default role
  const [prn, setPrn] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then fall back to system preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const navigate = useNavigate();
  const { setUser, setUserType } = useAuth();

  // Apply dark mode and persist preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogin = async (e, role, prn, companyId, password) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Logging in with role:', role);
      const response = role === 'student' ? await StudentLogin(prn, password) : role === 'company' ? await CompanyLogin(companyId, password) : await AdminLogin(password);

      console.log('Login response:', response);

      const data = role === 'student' ? response.studentToken : role === 'company' ? response.companyToken : response.adminToken;
      if (!data) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const tokenKey = data;

      // Clear localStorage before setting new items
      localStorage.clear();

      // Set new values in localStorage
      localStorage.setItem(`${role}Token`, tokenKey);
      localStorage.setItem('role', role);

      // Fetch the full user data based on role
      let userData = null;
      if (role === 'student') {
        userData = await fetchStudentData();
      } else if (role === 'company') {
        userData = await fetchCompanyData();
      } else if (role === 'admin') {
        userData = { role: 'admin' }; // Placeholder; replace with fetchAdminData if available
      } else {
        throw new Error('Invalid role detected.');
      }

      // Update AuthContext state with the full user data
      setUserType(role);
      setUser(userData);

      toast.success(data.message || 'Login successful! Redirecting...', { position: 'top-right' });

      // Redirect to role-specific dashboard
      const redirectPath = role === 'student' ? '/student/dashboard' : role === 'company' ? '/company/dashboard' : '/admin/dashboard';

      setTimeout(() => {
        navigate(redirectPath);
      }, 1000); // Redirect after a short delay to allow toast to display
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || error.code === 'ERR_NETWORK' ? 'Network error. Please check your connection and try again.' : 'An error occurred during login. Please try again!';
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />

      <div className={`min-h-screen flex items-center justify-center font-poppins transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'}`}>
        <div className={`w-full max-w-2xl rounded-xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_5px] ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700 shadow-purple-500/50' : 'bg-white text-gray-800 border border-purple-200 shadow-purple-400/50'}`}>
          {/* Header with Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              <i className="ri-login-circle-line mr-1 align-middle"></i> Login
            </h1>
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <i className="ri-sun-line text-yellow-300 text-lg"></i> : <i className="ri-moon-line text-purple-600 text-lg"></i>}
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={(e) => handleLogin(e, role, prn, companyId, password)}>
            {/* Role Selection */}
            <div className="mb-3">
              <label htmlFor="role" className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-user-settings-line"></i> Role
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-user-settings-line"></i>
                </span>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full p-2 pl-8 rounded-md text-sm transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50'}`}
                  aria-label="Select your role"
                >
                  <option value="student">Student</option>
                  <option value="company">Company</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Dynamic Fields */}
            {role !== 'admin' ? (
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 mb-3">
                <div>
                  <label htmlFor={role === 'student' ? 'prn' : 'companyId'} className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-id-card-line"></i> {role === 'student' ? 'PRN' : 'Company ID'}
                  </label>
                  <div className="relative">
                    <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <i className="ri-id-card-line"></i>
                    </span>
                    <input
                      id={role === 'student' ? 'prn' : 'companyId'}
                      type="text"
                      value={role === 'student' ? prn : companyId}
                      onChange={(e) => (role === 'student' ? setPrn(e.target.value) : setCompanyId(e.target.value))}
                      placeholder={`Enter your ${role === 'student' ? 'PRN' : 'Company ID'}`}
                      className={`w-full p-2 pl-8 rounded-md text-sm transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50'}`}
                      required
                      aria-label={role === 'student' ? 'Enter your PRN' : 'Enter your Company ID'}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-lock-line"></i> Password
                  </label>
                  <div className="relative">
                    <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <i className="ri-lock-line"></i>
                    </span>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full p-2 pl-8 rounded-md text-sm transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50'}`}
                      required
                      aria-label="Enter your password"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <label htmlFor="password" className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <i className="ri-lock-line"></i> Password
                </label>
                <div className="relative">
                  <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="ri-lock-line"></i>
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className={`w-full p-2 pl-8 rounded-md text-sm transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50'}`}
                    required
                    aria-label="Enter admin password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center p-2 rounded-md font-medium text-white text-sm transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line mr-1 animate-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line mr-1"></i> Login
                </>
              )}
            </button>

            <div className={`flex items-center justify-end mt-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <a
                href="/forgot-password"
                className={`flex items-center ${isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'} hover:underline transition-colors duration-200`}
              >
                <i className="ri-question-line mr-1"></i> Forgot password?
              </a>
            </div>
          </form>

          {/* Register Link */}
          <p className={`text-center mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <a
              href="/register"
              className={`flex items-center justify-center text-sm ${isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'} font-medium hover:underline transition-colors duration-200`}
            >
              <i className="ri-user-add-line mr-1"></i> Register here
            </a>
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginPage;