import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography } from "@material-tailwind/react";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectApplicantsForInterview } from '../../api/companyApi';

// Enhanced custom CSS to override DateTimePicker styles
const dateTimePickerStyles = `
    /* Main container of the DateTimePicker */
    .react-datetime-picker {
        display: inline-block;
        position: relative;
        width: 100%;
    }

    /* Wrapper for the input area */
    .react-datetime-picker__wrapper {
        background: #ffffff !important; /* Solid white background */
        border: 1px solid #e2e8f0 !important; /* Light gray border */
        border-radius: 0.75rem !important; /* Rounded corners */
        padding: 0.5rem 0.75rem !important; /* Padding */
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important; /* Shadow */
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 0.875rem !important;
        transition: all 0.3s ease !important;
    }

    .react-datetime-picker__wrapper:hover {
        border-color: #3b82f6 !important; /* Blue border on hover */
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.15) !important; /* Enhanced shadow */
        transform: translateY(-2px) !important; /* Slight lift */
    }

    /* Input group */
    .react-datetime-picker__inputGroup {
        background: transparent !important;
        color: #1e293b !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.25rem !important;
    }

    .react-datetime-picker__inputGroup__input {
        color: #1e293b !important;
        font-weight: 500 !important;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        padding: 0.25rem !important;
        min-width: 1.5rem !important;
        text-align: center !important;
    }

    .react-datetime-picker__inputGroup__input:focus {
        background: rgba(59, 130, 246, 0.05) !important;
        border-radius: 0.25rem !important;
    }

    .react-datetime-picker__inputGroup__divider {
        color: #64748b !important;
        margin: 0 0.25rem !important;
        font-weight: 600 !important;
    }

    /* Buttons (calendar and clock icons) */
    .react-datetime-picker__button {
        padding: 0.25rem !important;
        border-radius: 0.375rem !important;
        transition: all 0.3s ease !important;
    }

    .react-datetime-picker__button:hover {
        background: rgba(59, 130, 246, 0.1) !important;
    }

    .react-datetime-picker__button svg {
        stroke: #4a5568 !important;
        width: 1.25rem !important;
        height: 1.25rem !important;
        transition: stroke 0.3s ease !important;
    }

    .react-datetime-picker__button:hover svg {
        stroke: #3b82f6 !important;
    }

    /* Calendar and Clock popups */
    .react-datetime-picker__calendar,
    .react-datetime-picker__clock {
        background: #ffffff !important; /* Solid white background */
        border: 1px solid #e2e8f0 !important; /* Light gray border */
        border-radius: 0.75rem !important; /* Rounded corners */
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important; /* Shadow */
        font-family: 'Inter', sans-serif !important;
        margin-top: 0.5rem !important;
        z-index: 50 !important; /* Ensure it appears above other elements */
    }

    /* Calendar navigation */
    .react-calendar__navigation {
        background: #f8fafc !important;
        border-bottom: 1px solid #e2e8f0 !important;
        padding: 0.75rem !important;
    }

    .react-calendar__navigation__label,
    .react-calendar__navigation__arrow {
        font-size: 0.875rem !important;
        font-weight: 600 !important;
        padding: 0.5rem 1rem !important;
        color: #1e293b !important;
        border-radius: 0.375rem !important;
        transition: all 0.3s ease !important;
    }

    .react-calendar__navigation__arrow:hover,
    .react-calendar__navigation__label:hover {
        background: #e2e8f0 !important;
        color: #3b82f6 !important;
    }

    .react-calendar__month-view__weekdays {
        background: #f8fafc !important;
        padding: 0.5rem 0 !important;
    }

    .react-calendar__month-view__weekdays__weekday {
        font-size: 0.75rem !important;
        font-weight: 600 !important;
        color: #64748b !important;
        text-transform: uppercase !important;
    }

    .react-calendar__tile {
        padding: 0.75rem !important;
        border-radius: 0.375rem !important;
        transition: all 0.3s ease !important;
        color: #374151 !important;
    }

    .react-calendar__tile:hover {
        background: #e2e8f0 !important;
        color: #3b82f6 !important;
    }

    .react-calendar__tile--active {
        background: #3b82f6 !important;
        color: #ffffff !important;
        border-radius: 0.375rem !important;
    }

    .react-calendar__tile--now {
        background: #fbbf24 !important;
        color: #ffffff !important;
    }

    /* Clock styles */
    .react-clock__face {
        border: 2px solid #e2e8f0 !important;
        background: #f8fafc !important;
    }

    .react-clock__hand__tip {
        background: #3b82f6 !important;
    }

    .react-clock__hand__body {
        background: #3b82f6 !important;
    }

    .react-clock__mark__number {
        color: #4a5568 !important;
        font-size: 0.75rem !important;
        font-weight: 600 !important;
    }

    /* Dark mode styles */
    .dark .react-datetime-picker__wrapper {
        background: #1e293b !important;
        border-color: #475569 !important;
    }

    .dark .react-datetime-picker__wrapper:hover {
        border-color: #60a5fa !important;
        box-shadow: 0 6px 20px rgba(96, 165, 250, 0.2) !important;
    }

    .dark .react-datetime-picker__inputGroup__input {
        color: #e2e8f0 !important;
    }

    .dark .react-datetime-picker__inputGroup__divider {
        color: #94a3b8 !important;
    }

    .dark .react-datetime-picker__button svg {
        stroke: #94a3b8 !important;
    }

    .dark .react-datetime-picker__button:hover svg {
        stroke: #60a5fa !important;
    }

    .dark .react-datetime-picker__calendar,
    .dark .react-datetime-picker__clock {
        background: #1e293b !important;
        border-color: #475569 !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
    }

    .dark .react-calendar__navigation {
        background: #334155 !important;
        border-bottom-color: #475569 !important;
    }

    .dark .react-calendar__navigation__label,
    .dark .react-calendar__navigation__arrow {
        color: #e2e8f0 !important;
    }

    .dark .react-calendar__navigation__arrow:hover,
    .dark .react-calendar__navigation__label:hover {
        background: #4a5568 !important;
        color: #60a5fa !important;
    }

    .dark .react-calendar__month-view__weekdays {
        background: #334155 !important;
    }

    .dark .react-calendar__month-view__weekdays__weekday {
        color: #94a3b8 !important;
    }

    .dark .react-calendar__tile {
        color: #e2e8f0 !important;
    }

    .dark .react-calendar__tile:hover {
        background: #4a5568 !important;
        color: #60a5fa !important;
    }

    .dark .react-calendar__tile--active {
        background: #60a5fa !important;
    }

    .dark .react-calendar__tile--now {
        background: #fbbf24 !important;
    }

    .dark .react-clock__face {
        border-color: #475569 !important;
        background: #334155 !important;
    }

    .dark .react-clock__hand__tip,
    .dark .react-clock__hand__body {
        background: #60a5fa !important;
    }

    .dark .react-clock__mark__number {
        color: #94a3b8 !important;
    }
`;

const SelectApplicantsForInterview = () => {
    const location = useLocation();
    const students = location.state?.res || [];
    const jobId = location.state?.jobId;
    const navigate = useNavigate();
    const [selectedPRNs, setSelectedPRNs] = useState([]);
    const [interviewSchedules, setInterviewSchedules] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckboxChange = (prn) => {
        setSelectedPRNs((prev) =>
            prev.includes(prn) ? prev.filter((id) => id !== prn) : [...prev, prn]
        );
    };

    const handleDateTimeChange = (prn, date) => {
        setInterviewSchedules((prev) => ({
            ...prev,
            [prn]: date,
        }));
    };

    const handleViewMore = (student) => {
        navigate('/company/applicantDetails', { state: { student } });
    };

    const handleSubmit = async () => {
        try {
            const missingSchedules = selectedPRNs.filter((prn) => !interviewSchedules[prn]);
            if (missingSchedules.length > 0) {
                toast.error('Please select a date and time for all selected students.', {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }

            setIsLoading(true);

            const selectedStudents = selectedPRNs.map((prn) => ({
                prn,
                scheduledAt: interviewSchedules[prn].toISOString(),
            }));

            await selectApplicantsForInterview(jobId, selectedStudents);

            toast.success('Interviews scheduled successfully!', {
                position: "top-right",
                autoClose: 3000,
                onClose: () => {
                    navigate('/company/dashboard', {
                        state: { message: 'Interviews scheduled successfully!' },
                    });
                },
            });

        } catch (error) {
            toast.error('Failed to schedule interviews. Please try again.', {
                position: "top-right",
                autoClose: 3000,
            });
            console.error('Error submitting:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-4 sm:p-6 md:p-8 transition-all duration-500">
            <ToastContainer />
            <style>{dateTimePickerStyles}</style>

            <div className="w-full max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Select Applicants for Interview
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Review and select the best candidates for taking Interview
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{students.length}</div>
                            <div className="text-gray-600 dark:text-gray-300 font-medium">Total Applicants</div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{selectedPRNs.length}</div>
                            <div className="text-gray-600 dark:text-gray-300 font-medium">Selected</div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{students.length - selectedPRNs.length}</div>
                            <div className="text-gray-600 dark:text-gray-300 font-medium">Remaining</div>
                        </div>
                    </Card>
                </div>

                {/* Main Table Card */}
                <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 transition-all duration-300">
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 border-b border-blue-200/50 dark:border-blue-700/50">
                                        {['Profile', 'Candidate Details', 'PRN', 'Interview Schedule', 'Actions', 'Select'].map((header, index) => (
                                            <th key={index} className="p-6 border-b border-gray-200/50 dark:border-gray-600/50 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-gray-300/30 after:via-gray-300/80 after:to-gray-300/30 after:opacity-50 last:after:hidden">
                                                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                                                    {header}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr
                                            key={index}
                                            className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 border-b border-gray-100/50 dark:border-gray-700/30"
                                        >
                                            <td className="p-6 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-gray-300/30 after:via-gray-300/80 after:to-gray-300/30 after:opacity-50 last:after:hidden">
                                                <div className="relative">
                                                    <img
                                                        src={student.profilePhoto}
                                                        alt={student.name}
                                                        className="w-16 h-16 rounded-full object-cover border-3 border-white dark:border-gray-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                                </div>
                                            </td>
                                            <td className="p-6 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-gray-300/30 after:via-gray-300/80 after:to-gray-300/30 after:opacity-50 last:after:hidden">
                                                <div>
                                                    <Typography variant="small" className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                                                        {student.name}
                                                    </Typography>
                                                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-1">
                                                        Candidate Profile
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className="p-6 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-gray-300/30 after:via-gray-300/80 after:to-gray-300/30 after:opacity-50 last:after:hidden">
                                                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 px-3 py-2 rounded-full inline-block">
                                                    <Typography variant="small" className="font-mono font-bold text-blue-700 dark:text-blue-300">
                                                        {student.prn}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className="p-6 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-gray-300/30 after:via-gray-300/80 after:to-gray-300/30 after:opacity-50 last:after:hidden">
                                                <div className="inline-block w-full max-w-[280px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                                    <DateTimePicker
                                                        onChange={(date) => handleDateTimeChange(student.prn, date)}
                                                        value={interviewSchedules[student.prn] || null}
                                                        minDate={new Date()} // Prevent past dates
                                                        className="w-full text-gray-800 dark:text-gray-100 font-medium"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-6 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-gray-300/30 after:via-gray-300/80 after:to-gray-300/30 after:opacity-50 last:after:hidden">
                                                <button
                                                    onClick={() => handleViewMore(student)}
                                                    className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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
                                            <td className="p-6 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-gray-300/30 after:via-gray-300/80 after:to-gray-300/30 after:opacity-50 last:after:hidden">
                                                <label className="relative inline-flex items-center cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPRNs.includes(student.prn)}
                                                        onChange={() => handleCheckboxChange(student.prn)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 shadow-inner group-hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
                                                    </div>
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>

                {/* Submit Button with Loading State */}
                <div className="flex justify-center mt-10">
                    <button
                        onClick={handleSubmit}
                        disabled={selectedPRNs.length === 0 || isLoading}
                        className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 shadow-2xl hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-2xl transition-all duration-500"
                    >
                        <span className="relative flex items-center">
                            {isLoading ? (
                                <>
                                    <svg
                                        className="w-6 h-6 mr-3 animate-spin"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                                            opacity="0.25"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 12a8 8 0 014-6.928"
                                            opacity="1"
                                        />
                                    </svg>
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Submit {selectedPRNs.length > 0 && `(${selectedPRNs.length})`} Selected Applicants
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                        {selectedPRNs.length > 0 && !isLoading && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center animate-pulse shadow-md group-hover:scale-110 transition-transform duration-300">
                                {selectedPRNs.length}
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectApplicantsForInterview;