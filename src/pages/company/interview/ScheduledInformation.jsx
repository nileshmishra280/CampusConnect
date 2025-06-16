import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography } from "@material-tailwind/react";
import 'react-toastify/dist/ReactToastify.css';

const ScheduledInformation = () => {
    const location = useLocation();
    const students = location.state?.res || [];
    const jobId = location.state?.jobId;
    const navigate = useNavigate();

    const handleViewMore = (student) => {
        const transformedStudent = {
            name: student.basicDetails.name,
            profilePhoto: student.basicDetails.profilePhoto,
            email:student.basicDetails.email,
            phone:student.basicDetails.phone,
            address:student.basicDetails.address,
            prn: student.prn,
            additionalData: {
                department:student.educationDetails.department,
                education: student.educationDetails.education,
                resume: student.resume,
            },
        };
        navigate('/company/applicantDetails', { state: { student:transformedStudent } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-4 sm:p-6 md:p-8 transition-all duration-500">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Selected Applicants for Interview
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Main Table Card */}
                <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 transition-all duration-300">
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 border-b border-blue-200/50 dark:border-blue-700/50">
                                        {['Profile', 'Candidate Details', 'PRN', 'Schedule', 'Actions'].map((header, index) => (
                                            <th key={index} className="p-6 border-b border-gray-200/50 dark:border-gray-600/50">
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
                                            className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 border-b border-gray-100/50 dark:border-gray-700/30"
                                        >
                                            <td className="p-6">
                                                <div className="relative">
                                                    <img
                                                        src={student.basicDetails.profilePhoto}
                                                        alt={student.basicDetails.name}
                                                        className="w-16 h-16 rounded-full object-cover border-3 border-white dark:border-gray-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div>
                                                    <Typography variant="small" className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                                                        {student.basicDetails.name}
                                                    </Typography>
                                                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-1">
                                                        Candidate Profile
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 px-3 py-2 rounded-full inline-block">
                                                    <Typography variant="small" className="font-mono font-bold text-blue-700 dark:text-blue-300">
                                                        {student.prn}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <Typography variant="small" className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                                                    {new Date(student.scheduledAt).toLocaleString('en-GB', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    }).replace(',', '')}
                                                </Typography>
                                            </td>

                                            <td className="p-6">
                                                <button
                                                    onClick={() => handleViewMore(student)}
                                                    className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105"
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


            </div>
        </div>
    );
};

export default ScheduledInformation;

