import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchApplicationDetails, fetchAvailableJobs, retrieveApplication } from '../../api/studentApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import { HiOutlineArrowCircleLeft } from 'react-icons/hi';

const AppliedJobs = () => {
    const { user, setUser } = useAuth();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [retrieving, setRetrieving] = useState(false);
    const navigate=useNavigate();
    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                const response = await fetchAvailableJobs({ department: user?.student?.department });
                const eligibleJobs = response.filter(job => {
                    const requiredCgpa = job.education?.college;
                    const requiredDept = job.department;
                    const requiredStd12OrDipMks = job.education.std12_or_diploma;
                    const requiredStd10mks = job.education.std10;
                    return (
                        user.student.education.college.cmks * 10 >= requiredCgpa && 
                        user.student.education.std12_or_diploma.mks12 >= requiredStd12OrDipMks &&
                        user.student.education.std10.mks10 >= requiredStd10mks &&
                        user.student.department === requiredDept
                    );
                });
                const appliedJobIds = user?.student?.appliedJobs?.map(job => job.jobId) || [];
                const appliedJobsDetails = eligibleJobs
                    .filter(job => appliedJobIds.includes(job._id.toString()))
                    .map(job => {
                        const application = user.student.appliedJobs.find(app => app.jobId === job._id.toString());
                        return { ...job, applicationId: application?._id, status: application?.status };
                    });
                if (Array.isArray(appliedJobsDetails)) {
                    setAppliedJobs(appliedJobsDetails);
                } else {
                    throw new Error('Invalid response format for applied jobs.');
                }
            } catch (error) {
                toast.error(error.message || 'Error fetching applied jobs.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setAppliedJobs([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, [user]);

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

    const isApplicationExpired = (lastDate) => {
        try {
            const today = new Date();
            const deadline = new Date(lastDate);
            return today > deadline;
        } catch {
            return true;
        }
    };

    const getDaysLeftForRetrieval = (lastDate) => {
        try {
            const today = new Date();
            const deadline = new Date(lastDate);
            const diffTime = deadline.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { days: diffDays < 0 ? 0 : diffDays, expired: diffDays < 0 };
        } catch {
            return { days: 0, expired: true };
        }
    };

    const handleRetrieveClick = (jobId) => {
        setSelectedJob({ jobId, prn: user.student.prn });
        setShowModal(true);
    };


    const handleViewApplication=async (jobId)=>{
        const student=await fetchApplicationDetails(user.student.prn,jobId);
        navigate('/student/applicationDetails',{state:{student}});
    }

    const handleConfirmRetrieve = async () => {
        setRetrieving(true);
        try {
            const { prn, jobId } = selectedJob;
            const response = await retrieveApplication(prn, jobId);
            if (response.success) {
                const updatedAppliedJobs = user.student.appliedJobs.filter(app => app.jobId !== jobId);
                setUser({ ...user, student: { ...user.student, appliedJobs: updatedAppliedJobs } });
                setAppliedJobs(appliedJobs.filter(job => job._id !== jobId));
                toast.success('Application retrieved successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } else {
                throw new Error(response.error || 'Failed to retrieve application.');
            }
        } catch (error) {
            toast.error(error.message || 'Error retrieving application.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setRetrieving(false);
            setShowModal(false);
            setSelectedJob(null);
        }
    };

    const handleCancelRetrieve = () => {
        setShowModal(false);
        setSelectedJob(null);
    };

    const BriefcaseIcon = () => (
        <svg className="w-5 h-5 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );

    const CompanyIcon = () => (
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );

    const FileTextIcon = () => (
        <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const CodeIcon = () => (
        <svg className="w-4 h-4 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    );

    const LocationIcon = () => (
        <svg className="w-4 h-4 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const MoneyIcon = () => (
        <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const CalendarIcon = () => (
        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const WorkModelIcon = () => (
        <svg className="w-4 h-4 text-teal-600 dark:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v2a2 2 0 002 2h4a2 2 0 002-2V6" />
        </svg>
    );

    const StatusIcon = () => (
        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const ClockIcon = () => (
        <svg className="w-4 h-4 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-teal-50 to-blue-100 dark:from-gray-900 dark:via-teal-900 dark:to-blue-900">
            <div className="container mx-auto p-4">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-1">
                        Applied Jobs
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Track your job applications</p>
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
                ) : appliedJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                            <BriefcaseIcon />
                        </div>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">No Applications Yet</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">You haven't applied for any jobs.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appliedJobs.map((job) => {
                            const retrievalInfo = getDaysLeftForRetrieval(job.lastDateForApplication);
                            return (
                                <div
                                    key={job._id}
                                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white">
                                        <div className="flex items-center gap-2 mb-1">
                                            <BriefcaseIcon />
                                            <h3 className="text-lg font-bold truncate">{job.jobTitle || 'Untitled Job'}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-teal-100">
                                            <ClockIcon />
                                            <span className="text-xs">
                                                {retrievalInfo.expired ? 'Deadline passed' : `${retrievalInfo.days} days left`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <CompanyIcon />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Company</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">{job.companyDetails.companyName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CompanyIcon />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Department</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">{job.department || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <FileTextIcon />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Description</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">{truncateDescription(job.jobDescription)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CodeIcon />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Skills</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">{formatSkills(job.skills)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <MoneyIcon />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">CTC</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">{job.CTC || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CalendarIcon />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Apply By</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">{formatDate(job.lastDateForApplication)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <WorkModelIcon />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Work Model</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">{job.workModel || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <StatusIcon />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Status</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                                            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                                                job.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                                job.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                                job.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                            }`}>
                                                                {job.status || 'N/A'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleViewApplication(job._id)}
                                            className="w-full my-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-md hover:shadow-lg"

                                        >
                                            <IoEyeOutline className="w-4 h-4" />
                                            View application details
                                        </button>
                                        <button
                                            onClick={() => handleRetrieveClick(job._id)}
                                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                                                isApplicationExpired(job.lastDateForApplication)
                                                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg'
                                            }`}
                                            disabled={isApplicationExpired(job.lastDateForApplication)}
                                        >
                                            <HiOutlineArrowCircleLeft className="w-4 h-4"/>
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Confirm Retrieval</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                Are you sure you want to retrieve your application? This action cannot be undone.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancelRetrieve}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 text-sm font-medium"
                                    disabled={retrieving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmRetrieve}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                                    disabled={retrieving}
                                >
                                    {retrieving ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Retrieving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                                            </svg>
                                            Retrieve
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppliedJobs;