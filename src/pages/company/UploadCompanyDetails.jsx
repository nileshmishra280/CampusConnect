import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import axios from 'axios';


const UploadCompanyDetails = () => {
    const API_BASE_URL = "http://localhost:4000"
    const { user } = useAuth();
    const [images, setImages] = useState({
        profilePhoto: null
    });
    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");

    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle file selection
    const handleFileChange = async (e) => {
        const { name, files } = e.target;
        if (files.length !== 1) {
            setError(`Please select exactly one file for ${name}.`);
            return;
        }

        setImages((prev) => ({ ...prev, [name]: files[0] }));
        setError('');
    };

    // Handle form submission to fetch marks
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResponse(null);
        setLoading(true);

        if (!images.profilePhoto) {
            setLoading(false);
            setError('Please upload profile photo.');
            return;
        }

        if (!user?.company?.companyId) {
            setLoading(false);
            setError('Company Id not found. Please log in again.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePhoto', images.profilePhoto);  // <=== Changed here
        formData.append('companyName', companyName);
        formData.append('description', description);
        formData.append('companyId', user.company.companyId);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/company/addInformation`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setResponse(response.data);
            setLoading(false);
            if (response.data.success) {
                window.location.reload();
            }
        } catch (err) {
            setLoading(false);
            console.error('Error uploading company details:', err);
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-md sm:max-w-lg lg:max-w-xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 transition-all duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6 sm:mb-8">
                    Company Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >Company id:</label>
                        <p>
                            {user.company.companyId}
                        </p>
                    </div>

                    <div key="companyName">
                        <label
                            htmlFor="companyName"
                            className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Company name:
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="block w-full text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div key="description">
                        <label
                            htmlFor="description"
                            className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Company description:
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />

                    </div>

                    <div key="profilePhoto">
                        <label
                            htmlFor="profilePhoto"
                            className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Profile Photo
                        </label>
                        <input
                            type="file"
                            id="profilePhoto"
                            name="profilePhoto"
                            accept='image/*'
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800 transition-all"
                        />
                        {images["profilePhoto"] && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                {images["profilePhoto"].name}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload details'}
                    </button>
                </form>


                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg animate-fadeIn">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UploadCompanyDetails;