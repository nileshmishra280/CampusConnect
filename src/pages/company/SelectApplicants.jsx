import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography } from "@material-tailwind/react";
import { selectApplicants } from '../../api/companyApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SelectApplicants = () => {
  const location = useLocation();
  const students = location.state?.res || [];
  const jobId = location.state?.jobId;
  const navigate = useNavigate();
  const [selectedPRNs, setSelectedPRNs] = useState([]);

  const handleCheckboxChange = (prn) => {
    setSelectedPRNs((prev) =>
      prev.includes(prn) ? prev.filter((id) => id !== prn) : [...prev, prn]
    );
  };

  const handleViewMore = (student) => {
    navigate('/company/applicantDetails', { state: { student } });
  };

  const handleSubmit = async () => {
    try {
      const response = await selectApplicants(jobId, selectedPRNs);
      console.log('Server response:', response);
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error(error.message || 'Something went wrong while selecting applicants.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-4 sm:p-6 md:p-8 transition-all duration-500">
      <ToastContainer />
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Select Applicants
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Review and select the best candidates for your position
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{students.length}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Total Applicants</div>
            </div>
          </Card>
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{selectedPRNs.length}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Selected</div>
            </div>
          </Card>
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{students.length - selectedPRNs.length}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Remaining</div>
            </div>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="shadow-2xl rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 transition-all duration-300">
          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 border-b border-blue-200/50 dark:border-blue-700/50">
                    {['Profile', 'Candidate Details', 'PRN', 'Actions', 'Select'].map((header, index) => (
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
                            src={student.profilePhoto}
                            alt={student.name}
                            className="w-16 h-16 rounded-full object-cover border-3 border-white dark:border-gray-600 shadow-lg group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <Typography variant="small" className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                            {student.name}
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
                      <td className="p-6">
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedPRNs.includes(student.prn)}
                            onChange={() => handleCheckboxChange(student.prn)}
                            className="sr-only peer"
                          />
                          <div className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 shadow-inner group-hover:shadow-lg transition-all duration-300">
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

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            disabled={selectedPRNs.length === 0}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white transition-all duration-500 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-2xl"
          >
            <span className="relative flex items-center">
              <svg className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Submit {selectedPRNs.length > 0 && `(${selectedPRNs.length})`} Selected Applicants
            </span>
            <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            {selectedPRNs.length > 0 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center animate-pulse">
                {selectedPRNs.length}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectApplicants;