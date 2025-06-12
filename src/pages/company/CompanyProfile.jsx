import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyProfile = () => {
  const { user } = useAuth();
  const company = user;

  // Sync theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={company.company?.companyProfile || 'https://via.placeholder.com/150'}
              alt={`${company.company.companyName}'s profile`}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{company.company.companyName}</h1>
              <p className="text-sm sm:text-base text-blue-100 mt-2">ID: {company.company.companyId}</p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Company's description</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex flex-col">
              <p className="mt-1 text-base text-gray-800 dark:text-gray-200 truncate" title={company.company.description}>
                {company.company.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;