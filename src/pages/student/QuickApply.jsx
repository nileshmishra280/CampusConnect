import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { applyForJob } from '../../api/studentApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuickApply = () => {
    const { user, setUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { jobId, jobTitle } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'image/jpeg')) {
            setResumeFile(file);
        } else {
            toast.error('Please upload a valid PDF or JPG file.', {
                position: "top-right",
                autoClose: 3000,
            });
            setResumeFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!user?.student?.prn || !user?.student?.email) {
            toast.error('User PRN or email not found. Please log in again.', {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);
            return;
        }

        if (!jobId) {
            toast.error('Job ID not provided.', {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('prn', user.student.prn);
        formData.append('email', user.student.email);
        formData.append('jobId', jobId);
        if (resumeFile) {
            formData.append('resume', resumeFile);
        } else {
            formData.append('resumeUrl', user.student.resume || '');
        }

        try {
            const response = await applyForJob(formData);
            if (response.success) {
                setUser({
                    ...user,
                    student: {
                        ...user.student,
                        appliedJobs: [
                            ...user.student.appliedJobs,
                            { jobId, status: 'pending', _id: response.applicationId || `temp_${jobId}` }
                        ]
                    }
                });
                toast.success(`Quick Apply submitted for ${jobTitle}!`, {
                    position: "top-right",
                    autoClose: 3000,
                    onClose: () => navigate('/student/dashboard')
                });
            } else {
                toast.error(response.message || 'Failed to submit application.', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.error('Error submitting application:', err);
            toast.error(err.message || 'Something went wrong.', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const IdCardIcon = () => (
        <svg className="w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18m-6 4h6m-9-8a3 3 0 110-6 3 3 0 010 6z" />
        </svg>
    );

    const MailIcon = () => (
        <svg className="w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6m-18 0v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
        </svg>
    );

    const BriefcaseIcon = () => (
        <svg className="w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );

    const FileIcon = () => (
        <svg className="w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const SendIcon = () => (
        <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-teal-50 to-blue-100 dark:from-gray-900 dark:via-teal-900 dark:to-blue-900 flex items-center justify-center p-4">
            <ToastContainer />
            <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 transition-all duration-300">
                <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Quick Apply for {jobTitle || 'Job'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">PRN</label>
                        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm">
                            <IdCardIcon />
                            <span className="ml-2">{user?.student?.prn || 'Not available'}</span>
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm">
                            <MailIcon />
                            <span className="ml-2">{user?.student?.email || 'Not available'}</span>
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Job ID</label>
                        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm">
                            <BriefcaseIcon />
                            <span className="ml-2">{jobId || 'Not provided'}</span>
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Current Resume</label>
                        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm">
                            <FileIcon />
                            {user?.student?.resume ? (
                                <a
                                    href={user.student.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-teal-600 dark:text-teal-400 hover:underline truncate flex-1"
                                    title={user.student.resume}
                                >
                                    {user.student.resume}
                                </a>
                            ) : (
                                <span className="ml-2">No resume uploaded.</span>
                            )}
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Upload New Resume (Optional, PDF or JPG)</label>
                        <input
                            type="file"
                            accept="application/pdf,image/jpeg"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-600 file:text-white hover:file:bg-teal-700 transition-all duration-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-700 to-green-400 hover:from-green-600 hover:to-green-900 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <SendIcon />
                                Submit Application
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickApply;