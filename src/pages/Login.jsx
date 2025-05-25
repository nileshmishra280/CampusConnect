import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check system preference for dark mode on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields!', { position: 'top-right' });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success('Login successful! Redirecting...', { position: 'top-right' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch {
      toast.error('Invalid email or password!', { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      <ToastContainer />

      <div className={`min-h-screen flex items-center justify-center font-poppins transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'}`}>
        <div className={`w-full max-w-md rounded-xl p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-purple-100'}`}>
          {/* Header with Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              <i className="ri-login-circle-line mr-2 align-middle"></i> Login
            </h1>
            <button onClick={toggleDarkMode} className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'}`} aria-label="Toggle dark mode">
              {isDarkMode ? <i className="ri-sun-line text-yellow-300"></i> : <i className="ri-moon-line text-purple-600"></i>}
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className={`flex items-center gap-1 mb-1 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-mail-line"></i> Email
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-3 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-mail-line"></i>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full p-2 pl-9 rounded-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className={`flex items-center gap-1 mb-1 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-lock-line"></i> Password
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-3 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-lock-line"></i>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full p-2 pl-9 rounded-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center p-3 rounded-lg font-medium text-white transition-colors duration-300 ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line mr-2 animate-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line mr-2"></i> Login
                </>
              )}
            </button>

            <div className={`flex items-center justify-between mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              
              <a href="/forgot-password" className={`flex items-center ${isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'} hover:underline`}>
                <i className="ri-question-line mr-1"></i> Forgot password?
              </a>
            </div>
          </form>

          {/* Register Link */}
          <p className={`text-center mt-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <a href="/register" className={`flex items-center justify-center ${isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'} font-medium hover:underline`}>
              <i className="ri-user-add-line mr-1"></i> Register here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;