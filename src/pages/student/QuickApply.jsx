import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { applyForJob } from '../../api/studentApi';
import { ToastContainer,toast } from 'react-toastify';

const QuickApply = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const { jobId, jobTitle } = location.state || {};

    const [loading, setLoading] = useState(false);

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

        const applicationData = {
            prn: user.student.prn,
            email: user.student.email,
            jobId,
            resume: user.student.resume || ''
        };

        try {
            const response = await applyForJob(applicationData);

            if (response.success) {
                toast.success(`Quick Apply submitted for ${jobTitle}!`, {
                    position: "top-right",
                    autoClose: 3000,
                    onClose: () => navigate('/student/dashboard') // Navigate after toast closes
                });
            } else {
                toast.error(response.message || 'Failed to submit application.', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.error('Error submitting application:', err);
            toast.error(err.message || 'Something went wrong. Please try again.', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <ToastContainer/>
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 transition-all duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800 dark:text-gray-200">
                    Quick Apply for {jobTitle || 'Job'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PRN (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            PRN
                        </label>
                        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2">
                            <i className="ri-id-card-line mr-2 text-lg text-gray-500"></i>
                            <span>{user?.student?.prn || 'Not available'}</span>
                        </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2">
                            <i className="ri-mail-line mr-2 text-lg text-gray-500"></i>
                            <span>{user?.student?.email || 'Not available'}</span>
                        </div>
                    </div>

                    {/* Job ID (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Job ID
                        </label>
                        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2">
                            <i className="ri-briefcase-line mr-2 text-lg text-gray-500"></i>
                            <span>{jobId || 'Not provided'}</span>
                        </div>
                    </div>

                    {/* Resume URL (Read-only with clickable link) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Resume URL
                        </label>
                        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2">
                            <i className="ri-file-line mr-2 text-lg text-gray-500"></i>
                            {user?.student?.resume ? (
                                <a
                                    href={user.student.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 dark:text-emerald-400 hover:underline truncate flex-1"
                                    title={user.student.resume}
                                >
                                    {user.student.resume}
                                </a>
                            ) : (
                                <span>No resume uploaded yet.</span>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-emerald-500"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="ri-loader-4-line animate-spin text-lg"></i>
                                Submitting...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <i className="ri-send-plane-line"></i>
                                Submit Application
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickApply;