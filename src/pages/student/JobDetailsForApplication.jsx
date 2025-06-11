import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Remix Icons via CDN (assumed included in the project)
// <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">

// Enhanced Decorative Background
const ModernBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-300/20 to-pink-300/20 dark:from-violet-500/20 dark:to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/20 to-cyan-300/20 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300/10 to-purple-300/10 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-3xl"></div>
    </div>
);

// Floating Shapes
const FloatingShapes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-gradient-to-r from-violet-300 to-pink-300 dark:from-violet-500 to-pink-500 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-500 to-cyan-500 rounded-lg opacity-15 rotate-45"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-500 to-teal-500 rounded-full opacity-25"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-gradient-to-r from-orange-300 to-red-300 dark:from-orange-500 to-red-500 rounded-lg opacity-20 rotate-12"></div>
    </div>
);




const jobForApplication = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const job = location.state;
    if (!job)
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                <ModernBackground />
                <div className="relative backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
                    <FloatingShapes />
                    <div className="text-center">
                        <i className="ri-file-unknow-line text-4xl sm:text-5xl text-gray-600 dark:text-gray-300 mb-4 block"></i>
                        <p className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-200">No job data available</p>
                    </div>
                </div>
            </div>
        );

    const handleQuickApply = (jobId, jobTitle) => {
        navigate('/student/quickapply', { state: { jobId, jobTitle } });
    }

    const { companyDetails } = job;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden transition-colors duration-500">
            <ModernBackground />
            <FloatingShapes />
            <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center px-4 py-2 mb-8 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-800/50 text-indigo-600 dark:text-indigo-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        <i className="ri-arrow-left-line mr-2 text-lg group-hover:-translate-x-1 transition-transform duration-300"></i>
                        <span className="text-sm font-semibold tracking-wide">Back to Applications</span>
                    </button>

                    {/* Main Card */}
                    <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:shadow-3xl transition-all duration-300">
                        {/* Header */}
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-b border-gray-200/50 dark:border-gray-800/50 pb-6 mb-6">
                            <img
                                src={companyDetails?.companyProfile || '/placeholder-logo.png'}
                                alt="Company Logo"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-contain border border-gray-300/50 dark:border-gray-700/50 shadow-sm transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="flex-grow">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                    {job?.jobTitle}
                                </h1>
                                <p className="mt-1 text-lg sm:text-xl text-gray-700 dark:text-gray-300">
                                    {companyDetails?.companyName}
                                </p>

                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                            <ModernInfoCard
                                label="Location"
                                value={job?.workLocation}
                                icon="ri-map-pin-2-line"
                                gradient="from-blue-300 to-cyan-300 dark:from-blue-500 dark:to-cyan-500"
                            />
                            <ModernInfoCard
                                label="Salary"
                                value={job?.CTC}
                                icon="ri-money-dollar-circle-line"
                                gradient="from-green-300 to-emerald-300 dark:from-green-500 dark:to-emerald-500"
                            />
                            <ModernInfoCard
                                label="Work Mode"
                                value={job?.workMode}
                                icon="ri-briefcase-line"
                                gradient="from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500"
                            />
                            <ModernInfoCard
                                label="Work Days"
                                value={job?.workDays}
                                icon="ri-calendar-line"
                                gradient="from-violet-300 to-pink-300 dark:from-violet-500 dark:to-pink-500"
                            />
                            <ModernInfoCard
                                label="Working Time"
                                value={job?.workTime}
                                icon="ri-time-line"
                                gradient="from-teal-300 to-green-300 dark:from-teal-500 dark:to-green-500"
                            />
                            <ModernInfoCard
                                label="Work Place"
                                value={job?.workModel}
                                icon="ri-building-line"
                                gradient="from-orange-300 to-red-300 dark:from-orange-500 dark:to-red-500"
                            />
                            <ModernInfoCard
                                label="Application Deadline"
                                value={
                                    job?.lastDateForApplication
                                        ? new Date(job.lastDateForApplication).toLocaleDateString()
                                        : 'N/A'
                                }
                                icon="ri-calendar-check-line"
                                gradient="from-purple-300 to-indigo-300 dark:from-purple-500 dark:to-indigo-500"
                                className="sm:col-span-2 lg:col-span-1"
                            />
                            <ModernInfoCard
                                label="Bond"
                                value={job?.bond}
                                icon="ri-team-line"
                                gradient="from-orange-300 to-red-300 dark:from-orange-500 dark:to-red-500"
                            />
                        </div>

                        {/* Description */}
                        <div className="backdrop-blur-lg bg-white/50 dark:bg-slate-900/50 rounded-2xl p-6 sm:p-8 border border-gray-200/30 dark:border-gray-800/30">
                            <div className="flex items-center mb-4">
                                <i className="ri-file-text-line text-2xl sm:text-3xl text-indigo-600 dark:text-indigo-400 mr-3"></i>
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Job Description</h2>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-sm sm:text-base lg:text-lg">
                                {job?.jobDescription || 'No description available.'}
                            </p>
                        </div>

                        <div className="backdrop-blur-lg bg-white/50 dark:bg-slate-900/50 rounded-2xl p-6 sm:p-8 border border-gray-200/30 dark:border-gray-800/30">
                            <div className="flex items-center mb-4">
                                <i className="ri-tools-line text-2xl sm:text-3xl text-indigo-600 dark:text-indigo-400 mr-3"></i>
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Preferred Skills</h2>
                            </div>

                            {job?.skills ? (
                                <div className="flex flex-wrap gap-2">
                                    {job.skills
                                        .split(/\r?\n|,\s?/) // splits by commas or newlines
                                        .filter(skill => skill.trim() !== '')
                                        .map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-200 text-sm font-medium shadow-sm hover:scale-105 transition-transform duration-200"
                                            >
                                                {skill.trim()}
                                            </span>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 italic text-sm sm:text-base">No preferred skills mentioned.</p>
                            )}
                        </div>

                        <div className="flex justify-center mt-10">
                            <button
                                onClick={() => handleQuickApply(job._id, job.jobTitle)}
                                className="px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                            >
                                <i className="ri-send-plane-line mr-2"></i> Quick Apply
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

const ModernInfoCard = ({ label, value, icon, gradient, className = "" }) => (
    <div className={`group relative p-4 sm:p-5 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-gray-200/30 dark:border-gray-800/30 hover:bg-white/70 dark:hover:bg-slate-900/70 hover:shadow-md transform hover:scale-105 transition-all duration-300 ${className}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
        <div className="flex items-center gap-3">
            <i className={`${icon} text-lg sm:text-xl text-indigo-600 dark:text-indigo-400`}></i>
            <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {label}
                </h4>
                <p className="mt-1 text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">
                    {value || 'N/A'}
                </p>
            </div>
        </div>
    </div>
);

export default jobForApplication;