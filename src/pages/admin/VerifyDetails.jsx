import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Required for toast styling
import { verifyPRN } from '../../api/adminApi';

const VerifyDetails = () => {
    const location = useLocation();
    const student = location.state?.student;

    if (!student) {
        return <div className="text-center text-gray-600 dark:text-gray-300">No student data available</div>;
    }

    const handleVerify = async (prn) => {
        console.log("Verifying PRN:", prn);
        try {
            const result = await verifyPRN(prn);
            if (result.success) {
                toast.success("Student verified successfully", { position: 'top-right' });
            } else {
                toast.error("Verification failed", { position: 'top-right' });
            }
        } catch (error) {
            toast.error(error.message || "Error verifying student", { position: 'top-right' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-4 sm:p-6 md:p-8 transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Verify Details
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Detailed information and academic records</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:shadow-3xl">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <img
                                        src={student.profilePhoto || 'https://via.placeholder.com/150'}
                                        alt="Student"
                                        className="w-40 h-40 object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-2xl transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{student.name}</h2>

                                <div className="flex space-x-4 mb-6">
                                    {student.email && (
                                        <a
                                            href={`mailto:${student.email}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative inline-flex items-center justify-center w-14 h-14 text-white transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-600 rounded-full hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                                            title="Send Email"
                                        >
                                            <MdEmail className="text-2xl" />
                                            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                        </a>
                                    )}
                                    {student.linkedIn && (
                                        <a
                                            href={student.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative inline-flex items-center justify-center w-14 h-14 text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                                            title="View LinkedIn Profile"
                                        >
                                            <FaLinkedin className="text-2xl" />
                                            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                        </a>
                                    )}
                                </div>

                                <div className="w-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-2xl p-4 border border-blue-200/30 dark:border-blue-700/30">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Quick Contact</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{student.email}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{student.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Cards */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Information */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:shadow-3xl">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Personal Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{student.name}</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200/30 dark:border-green-700/30">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{student.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200/30 dark:border-orange-700/30">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{student.email}</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{student.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Educational Information */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:shadow-3xl">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Educational Information</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Department */}
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-200/30 dark:border-indigo-700/30">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Department</label>
                                    <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{student.data?.department || 'N/A'}</p>
                                </div>

                                {/* Academic Records Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* College CGPA */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                        <div className="text-center mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-gray-700 dark:text-gray-200">College CGPA</h4>
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">{student.data?.education?.college?.cmks || 'N/A'}</p>
                                        </div>
                                        {student.data?.education?.college?.cimage && (
                                            <a
                                                href={student.data.education.college.cimage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <span className="relative flex items-center">
elves                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    View Result
                                                </span>
                                                <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                            </a>
                                        )}
                                    </div>

                                    {/* 12th Marks */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-2xl border border-green-200/50 dark:border-green-700/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                        <div className="text-center mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-gray-700 dark:text-gray-200">12th Grade</h4>
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">{student.data?.education?.std12_or_diploma?.mks12 ? `${student.data.education.std12_or_diploma.mks12}%` : 'N/A'}</p>
                                        </div>
                                        {student.data?.education?.std12_or_diploma?.image12 && (
                                            <a
                                                href={student.data.education.std12_or_diploma.image12}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <span className="relative flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    View Result
                                                </span>
                                                <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                            </a>
                                        )}
                                    </div>

                                    {/* 10th Marks */}
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-2xl border border-orange-200/50 dark:border-orange-700/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                        <div className="text-center mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-gray-700 dark:text-gray-200">10th Grade</h4>
                                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-3">{student.data?.education?.std10?.mks10 ? `${student.data.education.std10.mks10}%` : 'N/A'}</p>
                                        </div>
                                        {student.data?.education?.std10?.image10 && (
                                            <a
                                                href={student.data.education.std10.image10}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <span className="relative flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    View Result
                                                </span>
                                                <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                            </a>
                                        )}
                                    </div>

                                    {/* Resume */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                        <div className="text-center mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-gray-700 dark:text-gray-200">Resume</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">View full resume details</p>
                                        </div>
                                        {student.data?.resume && (
                                            <a
                                                href={student.data.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <span className="relative flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                                    </svg>
                                                    View Resume
                                                </span>
                                                <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center pt-8">
                    <button
                        onClick={() => handleVerify(student.prn)}
                        className="relative inline-flex items-center px-6 py-3 overflow-hidden text-sm font-semibold text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition-all duration-300 group"
                    >
                        <span className="absolute left-0 w-0 h-full transition-all duration-300 ease-out bg-white opacity-10 group-hover:w-full"></span>
                        <span className="relative z-10">Verify Details</span>
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VerifyDetails;