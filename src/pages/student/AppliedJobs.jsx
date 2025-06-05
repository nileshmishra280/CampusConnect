import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAvailableJobs, retrieveApplication } from '../../api/studentApi';
import { toast } from 'react-toastify';

const AppliedJobs = () => {
    const { user, setUser } = useAuth();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null); // Store jobId and prn
    const [retrieving, setRetrieving] = useState(false);

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                const response = await fetchAvailableJobs();
                console.log('Fetched jobs:', response);

                // Step 1: Filter eligible jobs based on CGPA, department, etc.
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
                console.log('Eligible jobs:', eligibleJobs);

                // Step 2: Filter applied jobs from eligible jobs
                const appliedJobIds = user?.student?.appliedJobs?.map(job => job.jobId) || [];
                const appliedJobsDetails = eligibleJobs
                    .filter(job => appliedJobIds.includes(job._id.toString()))
                    .map(job => {
                        const application = user.student.appliedJobs.find(app => app.jobId === job._id.toString());
                        return {
                            ...job,
                            applicationId: application?._id,
                            status: application?.status
                        };
                    });

                console.log('Applied jobs with details:', appliedJobsDetails);

                if (Array.isArray(appliedJobsDetails)) {
                    setAppliedJobs(appliedJobsDetails);
                } else {
                    throw new Error('Invalid response format for applied jobs.');
                }
            } catch (error) {
                toast.error(error.message || 'Error fetching applied jobs. Please try again.', {
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
        return desc?.length > 100 ? desc.substring(0, 100) + '...' : desc || '';
    };

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return 'N/A';
        }
    };

    const formatSkills = (skills) => {
        return skills?.split('\n').filter(skill => skill.trim()).join(', ') || 'N/A';
    };

    const handleRetrieveClick = (jobId) => {
        setSelectedJob({ jobId, prn: user.student.prn });
        setShowModal(true);
    };

    const handleConfirmRetrieve = async () => {
        setRetrieving(true);
        try {
            const { prn, jobId } = selectedJob;
            const response = await retrieveApplication(prn, jobId);
            if (response.success) {
                // Update user.student.appliedJobs in AuthContext
                const updatedAppliedJobs = user.student.appliedJobs.filter(
                    app => app.jobId !== jobId
                );
                setUser({
                    ...user,
                    student: {
                        ...user.student,
                        appliedJobs: updatedAppliedJobs
                    }
                });

                // Update local state
                setAppliedJobs(appliedJobs.filter(job => job._id !== jobId));

                toast.success('Application retrieved successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } else {
                throw new Error(response.error || 'Failed to retrieve application.');
            }
        } catch (error) {
            toast.error(error.message || 'Error retrieving application. Please try again.', {
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    Applied Jobs
                </h2>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex w-full flex-col gap-4">
                                <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                ) : appliedJobs.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        You have not applied for any jobs yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {appliedJobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg text-gray-700 dark:text-gray-300 overflow-hidden transform transition duration-300 hover:shadow-xl"
                            >
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-briefcase-line text-emerald-500 dark:text-emerald-400 text-xl"></i>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            {job.jobTitle || 'Untitled Job'}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start gap-2">
                                            <i className="ri-building-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Company name:</p>
                                                <p className="text-xs">{job.companyDetails.companyName || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <i className="ri-building-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Department:</p>
                                                <p className="text-xs">{job.department || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <i className="ri-file-text-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Job description:</p>
                                                <p className="text-xs">{truncateDescription(job.jobDescription)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <i className="ri-code-s-slash-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Skills:</p>
                                                <p className="text-xs">{formatSkills(job.skills)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <i className="ri-map-pin-2-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Location:</p>
                                                <p className="text-xs">{job.workLocation || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start gap-2">
                                            <i className="ri-money-dollar-circle-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">CTC:</p>
                                                <p className="text-xs">{job.CTC || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <i className="ri-calendar-check-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Apply By:</p>
                                                <p className="text-xs">{formatDate(job.lastDateForApplication)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <i className="ri-building-4-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Work Model:</p>
                                                <p className="text-xs">{job.workModel || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <i className="ri-check-double-line text-emerald-500 dark:text-emerald-400 text-lg mt-0.5"></i>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Status:</p>
                                                <p className="text-xs">{job.status || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 pt-0">
                                    <button
                                        onClick={() => handleRetrieveClick(job._id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full transition-colors duration-300"
                                    >
                                        <i className="ri-arrow-go-back-line text-base"></i>
                                        Retrieve Application
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Confirm Retrieval
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Are you sure you want to retrieve your application? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelRetrieve}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-300"
                                disabled={retrieving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRetrieve}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 flex items-center gap-2"
                                disabled={retrieving}
                            >
                                {retrieving ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin text-base"></i>
                                        Retrieving...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-arrow-go-back-line text-base"></i>
                                        Retrieve
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppliedJobs;