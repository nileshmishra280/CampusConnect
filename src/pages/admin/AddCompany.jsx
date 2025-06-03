import React, { useState } from 'react';
import { addCompany } from '../../api/adminApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// FormSection component using RemixIcon classes directly
const FormSection = ({ title, isOpen, toggle, icon, children }) => (
  <div className="mb-4 border dark:border-gray-700 rounded-lg">
    <button
      type="button"
      onClick={toggle}
      className="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center space-x-2">
        <i className={`${icon} w-5 h-5 text-blue-500`} />
        <span className="font-medium text-gray-700 dark:text-gray-200">{title}</span>
      </div>
      {isOpen ? (
        <i className="ri-arrow-up-s-line w-5 h-5 text-gray-500 dark:text-gray-400" />
      ) : (
        <i className="ri-arrow-down-s-line w-5 h-5 text-gray-500 dark:text-gray-400" />
      )}
    </button>
    {isOpen && (
      <div className="p-4 bg-white dark:bg-gray-900">
        {children}
      </div>
    )}
  </div>
);

const AddCompany = () => {
  const [formData, setFormData] = useState({
    companyId: '',
    // companyName: '',
    password: '',
    // hasAdded: false,
    // description: '',
  });

  // const [companyPhoto, setCompanyPhoto] = useState(null); // State for the file
  const [isFormOpen, setIsFormOpen] = useState(true); // Top-level collapse state
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    security: true,
    additional: true,
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // const handleFileChange = (e) => {
  //   setCompanyPhoto(e.target.files[0]);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Create FormData object to handle file upload
    // const data = new FormData();
    // data.append('companyId', formData.companyId);
    // data.append('companyName', formData.companyName);
    // data.append('password', formData.password);
    // data.append('hasAdded', formData.hasAdded);
    // data.append('description', formData.description);
    // if (companyPhoto) {
    //   data.append('companyPhoto', companyPhoto); // Append the file
    // }
    const data = {
      companyId: formData.companyId,
      password: formData.password,
    };

    try {
      const response = await addCompany(data);
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormData({
          companyId: '',
          // companyName: '',
          password: '',
          // hasAdded: false,
          // description: '',
        });
        // setCompanyPhoto(null); // Reset the file input
      }
    } catch (err) {
      toast.error(err.error || 'Failed to add company', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-full p-4 sm:p-6">
      <ToastContainer />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <button
          type="button"
          onClick={toggleForm}
          className="w-full p-6 flex items-center justify-between border-b dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Add New Company
          </h2>
          {isFormOpen ? (
            <i className="ri-arrow-up-s-line w-6 h-6 text-gray-500 dark:text-gray-400" />
          ) : (
            <i className="ri-arrow-down-s-line w-6 h-6 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        {isFormOpen && (
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormSection
                title="Basic Information"
                isOpen={openSections.basicInfo}
                toggle={() => toggleSection('basicInfo')}
                icon="ri-building-line"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company ID
                    </label>
                    <input
                      type="text"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleChange}
                      className="block w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="block w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div> */}
                </div>
              </FormSection>

              {/* <FormSection
                title="Security"
                isOpen={openSections.security}
                toggle={() => toggleSection('security')}
                icon="ri-key-line"
              >
                <div className="space-y-4">
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasAdded"
                      checked={formData.hasAdded}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Has Added
                    </label>
                  </div>
                </div>
              </FormSection>

              <FormSection
                title="Additional Information"
                isOpen={openSections.additional}
                toggle={() => toggleSection('additional')}
                icon="ri-file-text-line"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Photo
                    </label>
                    <input
                      type="file"
                      name="companyPhoto"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/jpg"
                      className="block w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="block w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </FormSection> */}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Adding Company...
                  </>
                ) : (
                  'Add Company'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCompany;