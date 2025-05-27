import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../public/css/remixicon.css'; // Import Remix Icon CSS


const RegisterPage = () => {
  const [prn, setPrn] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!prn || !name || !email || !password || !phone) {
      toast.error('Please fill all required fields!', { position: 'top-right' });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('prn', prn);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      if (address) formData.append('address', address);
      if (profilePhoto) formData.append('profilePhoto', profilePhoto);

      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success('Registration successful! Redirecting to login...', { position: 'top-right' });
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      toast.error('An error occurred. Please try again!', { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className={`min-h-screen flex items-center justify-center font-poppins transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'}`}>
        <div className={`w-full max-w-sm rounded-lg p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-purple-100'}`}>
          {/* Header with Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              <i className="ri-user-add-line mr-1 align-middle"></i> Register
            </h1>
            <button onClick={toggleDarkMode} className={`p-1 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'}`} aria-label="Toggle dark mode">
              {isDarkMode ? <i className="ri-sun-line text-yellow-300"></i> : <i className="ri-moon-line text-purple-600"></i>}
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-id-card-line"></i> PRN
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-id-card-line"></i>
                </span>
                <input
                  type="text"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                  placeholder="Enter your PRN"
                  className={`w-full p-2 pl-8 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-user-line"></i> Name
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-user-line"></i>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full p-2 pl-8 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-mail-line"></i> Email
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-mail-line"></i>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full p-2 pl-8 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-lock-line"></i> Password
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-lock-line"></i>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full p-2 pl-8 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-phone-line"></i> Phone
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-phone-line"></i>
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone"
                  className={`w-full p-2 pl-8 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-home-line"></i> Address
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-home-line"></i>
                </span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address (optional)"
                  className={`w-full p-2 pl-8 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <i className="ri-image-line"></i> Profile Photo
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-image-line"></i>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                  className={`w-full p-2 pl-8 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center p-2 rounded-md font-medium text-white text-sm transition-colors duration-300 ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line mr-1 animate-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="ri-user-add-line mr-1"></i> Register
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className={`text-center mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <a href="/login" className={`flex items-center justify-center text-sm ${isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'} font-medium hover:underline`}>
              <i className="ri-login-box-line mr-1"></i> Login here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;