import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'

const StudentProfile = () => {

  const { user } = useAuth();
  const student = user;
  // Sync theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    console.log('Current theme:', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user.student?.profilePhoto || 'https://via.placeholder.com/150'}
              alt={`${user.student.name}'s profile`}
              onError={(e) => (e.target.src = '')}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.student.name}</h1>
              <p className="text-sm sm:text-base text-blue-100 mt-2">PRN: {user.student.prn}</p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Profile Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
              <p className="mt-1 text-base text-gray-800 dark:text-gray-200 truncate" title={student.email}>
                {user.student.email}
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
              <p className="mt-1 text-base text-gray-800 dark:text-gray-200">{user.student.phone}</p>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
              <p className="mt-1 text-base text-gray-800 dark:text-gray-200">{user.student.address}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/profile/edit"
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;