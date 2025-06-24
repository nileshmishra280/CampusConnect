import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import '../../public/css/remixicon.css'; // Import Remix Icon CSS
import { StudentRegister, VerifyEmail } from '../api/authApi';

const RegisterPage = () => {
  const [prn, setPrn] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dept, setDept] = useState('');
  const [passOutYear, setPassOutYear] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
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

      // Log form data for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Call the registration API
      const response = await StudentRegister(formData);
      if (!response.success) {
        toast.error(response.error || 'Registration failed. Please try again!', { position: 'top-right' });
        setIsLoading(false);
        return;
      }

      toast.success('Verification code sent to your email!', { position: 'top-right' });
      setVerificationSent(true);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.error || 'An error occurred. Please try again!', { position: 'top-right' });
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error('Please enter the verification code!', { position: 'top-right' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await VerifyEmail(email, verificationCode);
      if (!response.success) {
        toast.error(response.message || 'Invalid verification code!', { position: 'top-right' });
        setIsLoading(false);
        return;
      }

      toast.success('Email verified successfully! Redirecting to login...', { position: 'top-right' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.message || 'An error occurred during verification!', { position: 'top-right' });
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={`min-h-screen flex items-center justify-center font-poppins transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'}`}>
        <div className={`w-full max-w-xl md:max-w-2xl lg:max-w-3xl rounded-lg p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-purple-100'}`}>
          {/* Header with Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              <i className="ri-user-add-line mr-1 align-middle"></i> {verificationSent ? 'Verify Email' : 'Register'}
            </h1>
            <button
              onClick={toggleDarkMode}
              className={`p-1 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <i className="ri-sun-line text-yellow-300"></i> : <i className="ri-moon-line text-purple-600"></i>}
            </button>
          </div>

          {/* Registration or Verification Form */}
          {!verificationSent ? (
            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="mb-3">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-profile-line"></i> PRN
                  </label>
                  <div className="relative">

                    <input
                      type="text"
                      value={prn}
                      onChange={(e) => setPrn(e.target.value)}
                      placeholder="Enter your PRN"
                      className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-building-line"></i> Department
                  </label>
                  <div className="relative">
                    <select
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className={`w-full p-2 pl-3 rounded-md text-sm appearance-none transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                      required
                    >
                      <option value="" disabled>Select your department</option>
                      <option value="CSE">Computer Science & Engineering</option>
                      <option value="IT">Information Technology</option>
                      <option value="ECE">Electronics & Communication Engineering</option>
                      <option value="EEE">Electrical & Electronics Engineering</option>
                      <option value="MECH">Mechanical Engineering</option>
                      <option value="CIVIL">Civil Engineering</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-user-line"></i> Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-mail-line"></i> Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-lock-line"></i> Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-lock-line"></i>Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Enter your confirm password"
                      className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-phone-line"></i> Phone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone"
                      className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-home-line"></i> Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address (optional)"
                      className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-image-line"></i> Profile Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePhoto(e.target.files[0])}
                      className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-calendar-line"></i> Pass Out Year
                  </label>
                  <div className="relative">
                    <select
                      value={passOutYear}
                      onChange={(e) => setPassOutYear(e.target.value)}
                      className={`w-full p-2 pl-3 rounded-md text-sm appearance-none transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                      required
                    >
                      <option value="" disabled>Select your pass out year</option>
                      {
                        Array.from({ length: 8 }).map((_, i) => {
                          const year = new Date().getFullYear() - i + 3;
                          return <option key={year} value={year}>{year}</option>;
                        })
                      }
                    </select>
                  </div>
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
          ) : (
            <form onSubmit={handleVerifyCode}>
              <p className={`text-center mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                A verification code has been sent to {email}
              </p>
              <div className="mb-3">
                <label className={`flex items-center gap-1 mb-1 font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <i className="ri-key-2-line"></i> Verification Code
                </label>
                <div className="relative">
                  <span className={`absolute top-1/2 left-2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="ri-key-2-line"></i>
                  </span>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className={`w-full p-2 pl-3 rounded-md text-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-400'}`}
                    required
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
                    <i className="ri-loader-4-line mr-1 animate-spin"></i> Verifying...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line mr-1"></i> Verify
                  </>
                )}
              </button>
            </form>
          )}

          {/* Login Link */}
          <p className={`text-center mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <a
              href="/login"
              className={`flex items-center justify-center text-sm ${isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'} font-medium hover:underline`}
            >
              <i className="ri-login-box-line mr-1"></i> Login here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;