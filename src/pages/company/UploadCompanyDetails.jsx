import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import axios from 'axios';


const UploadCompanyDetails = () => {
    const API_BASE_URL = "http://localhost:5000"
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



// import React, { useState } from 'react';
// import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
// import axios from 'axios';

// const UploadCompanyDetails = () => {
//     const API_BASE_URL = "http://localhost:5000";
//     const { user } = useAuth();
//     const [images, setImages] = useState({
//         profilePhoto: null
//     });
//     const [companyName, setCompanyName] = useState("");
//     const [description, setDescription] = useState("");
//     const [response, setResponse] = useState(null);
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     // Handle file selection
//     const handleFileChange = async (e) => {
//         const { name, files } = e.target;
//         if (files.length !== 1) {
//             setError(`Please select exactly one file for ${name}.`);
//             return;
//         }

//         setImages((prev) => ({ ...prev, [name]: files[0] }));
//         setError('');
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setResponse(null);
//         setLoading(true);

//         if (!images.profilePhoto) {
//             setLoading(false);
//             setError('Please upload a profile photo.');
//             return;
//         }

//         if (!companyName) {
//             setLoading(false);
//             setError('Please enter a company name.');
//             return;
//         }

//         if (!user?.company?.companyId) {
//             setLoading(false);
//             setError('Company ID not found. Please log in again.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('profilePhoto', images.profilePhoto);
//         formData.append('companyName', companyName);
//         formData.append('description', description);
//         formData.append('companyId', user.company.companyId);

//         try {
//             const response = await axios.post(
//                 `${API_BASE_URL}/company/addInformation`,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );
//             setResponse(response.data);
//             if (response.data.success) {
//                 setImages({ profilePhoto: null });
//                 setCompanyName('');
//                 setDescription('');
//                 window.location.reload();
//             }
//         } catch (err) {
//             console.error('Error uploading company details:', err);
//             setError(err.response?.data?.message || 'Something went wrong.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//             <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 transition-all duration-300">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6 sm:mb-8">
//                     Company Details
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Company ID
//                         </label>
//                         <p className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
//                             {user?.company?.companyId || 'Not available'}
//                         </p>
//                     </div>

//                     <div>
//                         <label
//                             htmlFor="companyName"
//                             className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
//                         >
//                             Company Name
//                         </label>
//                         <input
//                             type="text"
//                             id="companyName"
//                             name="companyName"
//                             value={companyName}
//                             onChange={(e) => setCompanyName(e.target.value)}
//                             className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
//                             placeholder="Enter company name"
//                         />
//                     </div>

//                     <div>
//                         <label
//                             htmlFor="description"
//                             className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
//                         >
//                             Company Description
//                         </label>
//                         <textarea
//                             id="description"
//                             name="description"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             rows="4"
//                             className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
//                             placeholder="Enter company description"
//                         />
//                     </div>

//                     <div>
//                         <label
//                             htmlFor="profilePhoto"
//                             className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
//                         >
//                             Profile Photo
//                         </label>
//                         <div className="relative inline-flex w-full items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
//                             <input
//                                 id="profilePhoto"
//                                 name="profilePhoto"
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="peer order-2 [&::file-selector-button]:hidden"
//                             />
//                             <label
//                                 htmlFor="profilePhoto"
//                                 className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-emerald-500 px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300"
//                             >
//                                 <span className="order-2">Upload Profile Photo</span>
//                                 <span className="relative">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         aria-label="File input icon"
//                                         role="graphics-symbol"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         strokeWidth="1.5"
//                                         stroke="currentColor"
//                                         className="h-5 w-5"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
//                                         />
//                                     </svg>
//                                 </span>
//                             </label>
//                         </div>
//                         {images.profilePhoto && (
//                             <p className="mt-2 text-sm text-green-600 dark:text-green-400">
//                                 {images.profilePhoto.name}
//                             </p>
//                         )}
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <span className="flex items-center justify-center gap-2">
//                                 <svg
//                                     className="animate-spin h-5 w-5 text-white"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                     ></circle>
//                                     <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                     ></path>
//                                 </svg>
//                                 Uploading...
//                             </span>
//                         ) : (
//                             'Upload Details'
//                         )}
//                     </button>
//                 </form>

//                 {/* Error Message */}
//                 {error && (
//                     <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg animate-fade-in">
//                         <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
//                     </div>
//                 )}

//                 {/* Success Message */}
//                 {response?.success && (
//                     <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg animate-fade-in">
//                         <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
//                             Upload Successful
//                         </h3>
//                         <p className="text-sm text-gray-800 dark:text-gray-200">
//                             Company details uploaded successfully.
//                         </p>
//                         {response.companyId && (
//                             <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">
//                                 Company ID: {response.companyId}
//                             </p>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UploadCompanyDetails;