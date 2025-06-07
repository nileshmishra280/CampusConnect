import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/studentApi'; // Import the new API function
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentProfile = () => {
  const { user } = useAuth();
  const student = user;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: student.student.name,
    profilePhoto: student.student?.profilePhoto || '',
    resume: student.student?.resume || '',
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [preview, setPreview] = useState(formData.profilePhoto);
  const [isLoading, setIsLoading] = useState(false);

  // Sync theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    setProfilePhotoFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleResumeChange = (e) => {
    const selectedFile = e.target.files[0];
    setResumeFile(selectedFile);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (profilePhotoFile) {
        formDataToSend.append('profilePhoto', profilePhotoFile);
      }
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      } else {
        formDataToSend.append('resumeUrl', formData.resume); // Keep existing resume URL if no new file
      }
      formDataToSend.append('prn', student.student.prn);

      const response = await updateProfile(formDataToSend);
      toast.success(response.message || 'Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsModalOpen(false);
      window.location.reload(); // Refresh to reflect changes
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={student.student?.profilePhoto || 'https://via.placeholder.com/150'}
              alt={`${student.student.name}'s profile`}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{student.student.name}</h1>
              <p className="text-sm sm:text-base text-blue-100 mt-2">PRN: {student.student.prn}</p>
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
              <p className="mt-1 text-base text-gray-800 dark:text-gray-200 truncate" title={student.student.email}>
                {student.student.email}
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
              <p className="mt-1 text-base text-gray-800 dark:text-gray-200">{student.student.phone}</p>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">пекиAddress</label>
              <p className="mt-1 text-base text-gray-800 dark:text-gray-200">{student.student.address}</p>
            </div>

            {/* Resume */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Resume</label>
              {student.student?.resume ? (
                <a
                  href={student.student.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-base text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Resume
                </a>
              ) : (
                <p className="mt-1 text-base text-gray-800 dark:text-gray-200">No resume uploaded</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="mt-2 w-24 h-24 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Resume</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
                />
                {formData.resume && !resumeFile && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Current resume: <a href={formData.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">View</a>
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;