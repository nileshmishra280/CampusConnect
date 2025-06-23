import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { fetchScheduledJobsForStudent } from '../../../api/studentApi';
import { Card, Typography } from '@material-tailwind/react';

const UpcomingJobInterview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                const response = await fetchScheduledJobsForStudent(user.student.prn);
                console.log('Fetched jobs:', response);

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

    const joinInterview = (job) => {
        navigate('/company/interviews', { state: { roomCode: job.code } });
    };

    const handleViewMore = (job) => {
        const validJob = {
            ...job,
            status: job.status || 'Pending',
        };
        navigate('/student/applications/jobDetails', { state: validJob });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 px-4 py-6 sm:px-6 md:px-8 transition-all duration-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Jobs for which you are selected for Interview!
                    </h1>
                    <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                </div>


                {
                    jobs.length !== 0 && (
                        <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 transition-all duration-300">
                            <div className="p-4 sm:p-8">
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full table-fixed text-left text-sm sm:text-base break-words">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 border-b border-blue-200/50 dark:border-blue-700/50">
                                                {['Job', 'Schedule', 'Actions', 'Join Interview'].map((header, index) => (
                                                    <th
                                                        key={index}
                                                        className="p-4 sm:p-6 break-words border-b border-gray-200/50 dark:border-gray-600/50 w-[25%]"
                                                    >
                                                        <Typography className="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider text-xs sm:text-sm">
                                                            {header}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.map((job, index) => {
                                                const now = new Date();
                                                const scheduledAt = new Date(job.scheduledAt);
                                                const oneDayAfter = new Date(scheduledAt);
                                                oneDayAfter.setDate(oneDayAfter.getDate() + 1);
                                                const isDisabled = now < scheduledAt || now > oneDayAfter;

                                                return (
                                                    <tr
                                                        key={index}
                                                        className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 border-b border-gray-100/50 dark:border-gray-700/30"
                                                    >
                                                        <td className="p-4 sm:p-6 break-words w-[25%]">
                                                            <Typography className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base break-words">
                                                                {job.jobDetails.jobTitle}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4 sm:p-6 break-words w-[25%]">
                                                            <Typography className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base break-words">
                                                                {new Date(job.scheduledAt).toLocaleString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                }).replace(',', '')}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4 sm:p-6 break-words w-[25%]">
                                                            <button
                                                                onClick={() => handleViewMore(job)}
                                                                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                            >
                                                                <span className="relative flex items-center">
                                                                    <svg
                                                                        className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                        />
                                                                    </svg>
                                                                    View Details
                                                                </span>
                                                                <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                                            </button>
                                                        </td>
                                                        <td className="p-4 sm:p-6 break-words w-[25%]">
                                                            <button
                                                                onClick={() => joinInterview(job)}
                                                                disabled={isDisabled}
                                                                className={`w-full sm:w-auto group relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-white transition-all duration-300 rounded-full shadow-lg transform ${isDisabled
                                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800'
                                                                    }`}
                                                            >
                                                                <span className="relative flex items-center">
                                                                    <svg
                                                                        className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                                                                    </svg>
                                                                    Join
                                                                </span>
                                                                <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
                                    You don't have any upcoming interviews!
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                    Once you're selected for interviews, they'll appear here.
                                </p>
                            </div>
                        </div>

                    )
                }
            </div>
        </div>
    );
};

export default UpcomingJobInterview;
