import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAvailableJobs } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AvailableJobs = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                console.log('Fetching jobs for department:', user.student.department);
                const response = await fetchAvailableJobs({ department: user.student.department });
                const validJobs = response.filter(job => 
                    new Date(job.lastDateForApplication) >= new Date()
                );
                const eligibleJobs = validJobs.filter(job => {
                    const requiredCgpa = job.education?.college;
                    const requiredStd12OrDipMks = job.education.std12_or_diploma;
                    const requiredStd10mks = job.education.std10;
                    return (
                        user.student.education.college.cmks * 10 >= requiredCgpa &&
                        user.student.education.std12_or_diploma.mks12 >= requiredStd12OrDipMks &&
                        user.student.education.std10.mks10 >= requiredStd10mks
                    );
                });
                const appliedJobIds = user.student.appliedJobs.map(job => job.jobId);
                const availableJobs = eligibleJobs.filter(job => !appliedJobIds.includes(job._id.toString()));
                if (Array.isArray(availableJobs)) {
                    setJobs(availableJobs);
                    setFilteredJobs(availableJobs);
                } else {
                    toast.error('Invalid response from server.', { position: 'top-right', autoClose: 3000 });
                    setJobs([]);
                    setFilteredJobs([]);
                }
            } catch (error) {
                toast.error(error.message || 'Error fetching jobs.', { position: 'top-right', autoClose: 3000 });
                setJobs([]);
                setFilteredJobs([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, [user]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        if (term.trim() === '') {
            setFilteredJobs(jobs);
        } else {
            const filtered = jobs.filter((job) =>
                job.companyId.toLowerCase().includes(term)
            );
            setFilteredJobs(filtered);
        }
    };

    const truncateDescription = (desc) => {
        return desc?.length > 80 ? desc.substring(0, 80) + '...' : desc || '';
    };

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return 'N/A';
        }
    };

    const formatSkills = (skills) => {
        return skills?.split('\n').filter(skill => skill.trim()).join(', ') || 'N/A';
    };

    const getDaysLeft = (dateStr) => {
        try {
            const targetDate = new Date(dateStr);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return '1 day left';
            if (diffDays > 1) return `${diffDays} days left`;
            return 'Expired';
        } catch {
            return 'N/A';
        }
    };

    const getDaysLeftColor = (dateStr) => {
        try {
            const targetDate = new Date(dateStr);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
            if (diffDays <= 3) return 'text-red-600 dark:text-red-300';
            if (diffDays <= 7) return 'text-orange-600 dark:text-orange-300';
            return 'text-green-600 dark:text-green-300';
        } catch {
            return 'text-gray-600 dark:text-gray-300';
        }
    };

    const handleViewDetails = (job) => {
        const validJob = {
      ...job,
      status: job.status || 'Pending',
    };
    navigate('/student/vewDetailsForApplication', { state: validJob });
    };

    const SearchIcon = () => (
        <svg className="w-5 h-5 text-gray-400 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    const BriefcaseIcon = () => (
        <svg className="w-5 h-5 text-teal-500 dark:text-teal-400 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );

    const BuildingIcon = () => (
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );

    const DocumentIcon = () => (
        <svg className="w-4 h-4 text-green-600 dark:text-green-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const CodeIcon = () => (
        <svg className="w-4 h-4 text-purple-600 dark:text-purple-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    );

    const LocationIcon = () => (
        <svg className="w-4 h-4 text-red-600 dark:text-red-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const MoneyIcon = () => (
        <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
    );

    const CalendarIcon = () => (
        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const WorkIcon = () => (
        <svg className="w-4 h-4 text-teal-600 dark:text-teal-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0h.01M8 6h.01" />
        </svg>
    );

    const ClockIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const SendIcon = () => (
        <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-teal-50 to-blue-100 dark:from-gray-900 dark:via-teal-900 dark:to-blue-900">
            <div className="container mx-auto p-4">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full mb-4">
                        <BriefcaseIcon />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-1">
                        Available Jobs
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Discover career opportunities tailored to your profile</p>
                </div>

                <div className="mb-6 flex justify-center">
                    <div className="relative w-full max-w-md group">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by Company ID (e.g., 2025CSE01)"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300 dark:border-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4">
                                <div className="animate-pulse">
                                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 mb-3"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>
                                        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                            <BriefcaseIcon />
                        </div>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">
                            {searchTerm ? 'No jobs found for this company ID.' : 'No jobs available.'}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Check back later for new opportunities.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                            <div
                                key={job._id}
                                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BriefcaseIcon />
                                            <div>
                                                <h3 className="text-lg font-bold truncate">{job.jobTitle || 'Untitled Job'}</h3>
                                                <p className="text-xs text-teal-100">{job.companyDetails.companyName || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getDaysLeftColor(job.lastDateForApplication)} bg-white/80 dark:bg-gray-800/80`}>
                                            <ClockIcon />
                                            {getDaysLeft(job.lastDateForApplication)}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2 group">
                                                <BuildingIcon />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Department</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">{job.department || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 group">
                                                <DocumentIcon />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Description</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">{truncateDescription(job.jobDescription)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 group">
                                                <CodeIcon />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Skills</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">{formatSkills(job.skills)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2 group">
                                                <LocationIcon />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Location</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">{job.workLocation || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 group">
                                                <MoneyIcon />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">CTC</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">{job.CTC || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 group">
                                                <CalendarIcon />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Apply By</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">{formatDate(job.lastDateForApplication)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 group">
                                                <WorkIcon />
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Work Model</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">{job.workModel || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewDetails(job)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-green-700 to-green-400 hover:from-green-600 hover:to-green-900 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <SendIcon />
                                        View more details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailableJobs;