import { useState, useEffect, use } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { fetchPastScheduledJobs,  getStudentsSelectedForInterview } from '../../../api/companyApi';


const JobsForPastInterviews = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            // Introduce a 1-second delay before starting the fetch
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                const response = await fetchPastScheduledJobs(user.company.companyId);
                console.log('Fetched jobs:', response); // Debugging line

                if (Array.isArray(response)) {
                    setJobs(response);
                    setFilteredJobs(response);
                } else {
                    toast.error('Invalid response from server.', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                    setJobs([]);
                    setFilteredJobs([]);
                }
            } catch (error) {
                toast.error(error.message || 'Error fetching jobs. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setJobs([]);
                setFilteredJobs([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, []);

    // Handle search by companyId
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

    // Truncate job description to 60 characters (shorter for compact card)
    const truncateDescription = (desc) => {
        return desc?.length > 100 ? desc.substring(0, 100) + '...' : desc || '';
    };

    // Format date to a readable format (e.g., "30 Jun 2025")
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

    // Format skills (split by newline and filter out empty lines)
    const formatSkills = (skills) => {
        return skills?.split('\n').filter(skill => skill.trim()).join(', ') || 'N/A';
    };

    const getStudents = async (jobId) => {
        console.log(jobId);
        const res=await getStudentsSelectedForInterview(jobId);
        console.log(res);
        navigate('/company/interviews/pastScheduledInformation', { state: { res ,jobId} });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    Scheduled Jobs
                </h2>

                {/* Search Bar */}
                <div className="mb-6 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 text-lg"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by Company ID (e.g., 2025CSE01)"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300 dark:border-gray-600"
                        />
                    </div>
                </div>

                {/* Jobs Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex w-full flex-col gap-4">
                                <div className="skeleton h-32 w-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="skeleton h-4 w-28 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="skeleton h-4 w-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="skeleton h-4 w-full bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No jobs found for this company ID.' : 'No jobs available at the moment.'}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {filteredJobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg text-gray-700 dark:text-gray-300 overflow-hidden transform transition duration-300 hover:shadow-xl"
                            >
                                {/* Header with Job Title */}
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-briefcase-line text-emerald-500 dark:text-emerald-400 text-xl"></i>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            {job.jobTitle || 'Untitled Job'}
                                        </h3>
                                    </div>
                                </div>

                                {/* Job Details - Two Columns */}
                                <div className="p-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                                    {/* Left Column */}
                                    <div className="flex-1 space-y-2">


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

                                    {/* Right Column */}
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


                                    </div>
                                </div>

                                <div className="p-4 pt-0">
                                    <button
                                        onClick={() => getStudents(job._id)}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-1.5 
    ${new Date(job.lastDateForApplication) > new Date()
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 cursor-pointer"
                                            } 
    text-white rounded-lg transition-colors duration-300 text-sm`}
                                    >
                                        <i className="ri-send-plane-line text-base"></i>
                                        Get scheduled inofrmation
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

export default JobsForPastInterviews;