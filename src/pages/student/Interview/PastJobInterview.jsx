import { useState, useEffect, use } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { fetchPastScheduledJobs, getStudentsSelectedForInterview } from '../../../api/companyApi';
import { fetchScheduledJobsForStudent } from '../../../api/studentApi';
import { Card, Typography } from '@material-tailwind/react';


const PastJobInterview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            // Introduce a 1-second delay before starting the fetch
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                const response = await fetchPastScheduledJobs(user.student.prn);
                console.log('Fetched jobs:', response); // Debugging line

                if (Array.isArray(response)) {
                    setJobs(response);
                } else {
                    toast.error('Invalid response from server.', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                    setJobs([]);
                }
            } catch (error) {
                toast.error(error.message || 'Error fetching jobs. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, []);

    const handleViewMore = (job) => {
        console.log(job.companyDetails);
        const validJob = {
            ...job,
            status: job.status || 'Pending',
        };
        console.log(validJob);
        navigate('/student/applications/jobDetails', { state: validJob });
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-4 sm:p-6 md:p-8 transition-all duration-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Jobs for which you were selected for Interview!
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {
                    jobs.length !== 0 && (
                        <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 transition-all duration-300">
                            <div className="p-4 sm:p-8">
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full table-fixed text-left break-words text-sm sm:text-base">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 border-b border-blue-200/50 dark:border-blue-700/50">
                                                {['Job', 'Schedule', 'Actions'].map((header, index) => (
                                                    <th
                                                        key={index}
                                                        className="p-4 sm:p-6 break-words border-b border-gray-200/50 dark:border-gray-600/50 w-[33.33%]"
                                                    >
                                                        <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider text-xs sm:text-sm break-words">
                                                            {header}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.map((job, index) => (
                                                <tr
                                                    key={index}
                                                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 border-b border-gray-100/50 dark:border-gray-700/30"
                                                >
                                                    <td className="p-4 sm:p-6 break-words w-[33.33%]">
                                                        <Typography variant="small" className="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base break-words">
                                                            {job.jobDetails.jobTitle}
                                                        </Typography>
                                                    </td>
                                                    <td className="p-4 sm:p-6 break-words w-[33.33%]">
                                                        <Typography variant="small" className="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base break-words">
                                                            {new Date(job.scheduledAt).toLocaleString('en-GB', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                            }).replace(',', '')}
                                                        </Typography>
                                                    </td>
                                                    <td className="p-4 sm:p-6 break-words w-[33.33%]">
                                                        <button
                                                            onClick={() => handleViewMore(job)}
                                                            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                        >
                                                            <span className="relative flex items-center">
                                                                <svg className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                View Details
                                                            </span>
                                                            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card>

                    )
                }

                {
                    jobs.length === 0 && (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                                    You don't have any past interviews!
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                    Once you complete interviews, they'll appear here.
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default PastJobInterview;