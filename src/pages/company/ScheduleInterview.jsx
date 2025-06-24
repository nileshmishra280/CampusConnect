import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography } from "@material-tailwind/react";
import { selectApplicantsForInterview } from '../../api/companyApi';

const ScheduleInterviews = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPRNs = [], jobId } = location.state || {};
    const [interviewDetails, setInterviewDetails] = useState(() => {
        const obj = {};
        selectedPRNs.forEach(prn => {
            obj[prn] = { date: '', time: '' };
        });
        return obj;
    });

    const handleChange = (prn, field, value) => {
        setInterviewDetails(prev => ({
            ...prev,
            [prn]: {
                ...prev[prn],
                [field]: value
            }
        }));
    };

    const setSameDateTimeForAll = () => {
        const first = interviewDetails[selectedPRNs[0]];
        const updated = {};
        selectedPRNs.forEach(prn => {
            updated[prn] = { ...first };
        });
        setInterviewDetails(updated);
    };

    const handleSubmit = async () => {
        const prnS = Object.entries(interviewDetails).map(([prn, { date, time }]) => ({
            prn,
            scheduledAt: `${date}T${time}`
        }));

        try {
            const res = await selectApplicantsForInterview(jobId, prnS);
        } catch (error) {
            console.error('Error scheduling interview:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-6">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Schedule Interviews
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Set date and time for each selected applicant</p>
                </div>

                <div className="mb-6 text-center">
                    <button
                        onClick={setSameDateTimeForAll}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
                    >
                        Set Same Date & Time for All
                    </button>
                </div>

                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-2xl">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-left border-b border-gray-300 dark:border-gray-600">
                                <th className="p-4">PRN</th>
                                <th className="p-4">Interview Date</th>
                                <th className="p-4">Interview Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPRNs.map(prn => (
                                <tr key={prn} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4 font-mono font-semibold text-blue-700 dark:text-blue-300">{prn}</td>
                                    <td className="p-4">
                                        <input
                                            type="date"
                                            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                            value={interviewDetails[prn]?.date || ''}
                                            onChange={e => handleChange(prn, 'date', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="time"
                                            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                            value={interviewDetails[prn]?.time || ''}
                                            onChange={e => handleChange(prn, 'time', e.target.value)}
                                        />
                                    </td>

                                    <DateTimePicker
  onChange={(val) => {
    const date = val?.toISOString().split('T')[0];
    const time = val?.toTimeString().split(' ')[0].slice(0, 5); // HH:mm
    handleChange(prn, 'date', date);
    handleChange(prn, 'time', time);
  }}
  value={
    interviewDetails[prn]?.date && interviewDetails[prn]?.time
      ? new Date(`${interviewDetails[prn].date}T${interviewDetails[prn].time}`)
      : null
  }
/>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:scale-105 transition-transform"
                    >
                        Finalize Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleInterviews;
