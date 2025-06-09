import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Remix Icons via CDN (assumed included in the project)
// <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">

// SVG Icons with enhanced dark mode support
const BriefcaseIcon = () => (
  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0h5l-1 12a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h5m0 0v6a2 2 0 002 2h2a2 2 0 002-2V6m-6 4h4"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4 text-white dark:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 text-white dark:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
  </svg>
);

const statusColors = {
  Selected: 'bg-gradient-to-r from-emerald-200 to-green-200 text-emerald-900 border-emerald-300/50 dark:from-emerald-800/40 dark:to-green-800/40 dark:text-emerald-300 dark:border-emerald-700/50',
  Rejected: 'bg-gradient-to-r from-red-200 to-rose-200 text-red-900 border-red-300/50 dark:from-red-800/40 dark:to-rose-800/40 dark:text-red-300 dark:border-red-700/50',
  Pending: 'bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-900 border-amber-300/50 dark:from-amber-800/40 dark:to-yellow-800/40 dark:text-amber-300 dark:border-amber-700/50',
  Applied: 'bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-900 border-blue-300/50 dark:from-blue-800/40 dark:to-indigo-800/40 dark:text-blue-300 dark:border-blue-700/50',
};

const Applications = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  const handleClick = (job) => {
    // Ensure valid status
    const validJob = {
      ...job,
      status: job.status || 'Pending',
    };
    console.log(validJob);
    navigate('/student/applications/jobDetails', { state: validJob });
  };

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetchJobs(user.student.prn);
        if (response.success) {
          // Ensure each job has a valid status
          const validatedJobs = response.jobs.map(job => ({
            ...job,
            status: job.status || 'Pending',
          }));
          setJobs(validatedJobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    getJobs();
  }, [user.student.prn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Track your job applications and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-800/20 dark:to-purple-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-indigo-600 dark:text-indigo-300">
                  {jobs.length}
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">Total Applied</p>
              </div>
              <div className="p-3 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-xl">
                <BriefcaseIcon />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 dark:from-emerald-800/20 dark:to-green-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-emerald-600 dark:text-emerald-300">
                  {jobs.filter(j => j.status === 'Selected').length}
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">Selected</p>
              </div>
              <div className="p-3 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-xl">
                <CheckCircleIcon />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 dark:from-red-800/20 dark:to-rose-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-red-600 dark:text-red-300">
                  {jobs.filter(j => j.status === 'Rejected').length}
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">Rejected</p>
              </div>
              <div className="p-3 bg-red-100/50 dark:bg-red-900/30 rounded-xl">
                <XCircleIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50">
          {/* Mobile Cards View */}
          <div className="block lg:hidden">
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <i className="ri-briefcase-line mr-2 text-indigo-600 dark:text-indigo-300"></i>
                Applications
              </h3>
            </div>
            <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
              {jobs.map((jobApp) => (
                <div key={jobApp._id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {jobApp.jobDetails?.jobTitle || 'N/A'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {jobApp.companyDetails?.companyName || 'N/A'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[jobApp.status] || 'bg-gray-100 text-gray-800 border-gray-200/50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800/50'} flex items-center`}>
                      <i className={`ri-circle-fill mr-1 text-xs ${statusColors[jobApp.status]?.includes('emerald') ? 'text-emerald-600 dark:text-emerald-300' : statusColors[jobApp.status]?.includes('red') ? 'text-red-600 dark:text-red-300' : statusColors[jobApp.status]?.includes('amber') ? 'text-amber-600 dark:text-amber-300' : 'text-blue-600 dark:text-blue-300'}`}></i>
                      {jobApp.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleClick(jobApp)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                  >
                    <i className="ri-eye-line mr-2"></i>
                    View Details
                    <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-800/50">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Job Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Company</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                {jobs.map((jobApp) => (
                  <tr key={jobApp._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {jobApp.jobDetails?.jobTitle || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 dark:text-gray-300">
                        {jobApp.companyDetails?.companyName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[jobApp.status] || 'bg-gray-100 text-gray-800 border-gray-200/50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800/50'} flex items-center`}>
                        <i className={`ri-circle-fill mr-1 text-xs ${statusColors[jobApp.status]?.includes('emerald') ? 'text-emerald-600 dark:text-emerald-300' : statusColors[jobApp.status]?.includes('red') ? 'text-red-600 dark:text-red-300' : statusColors[jobApp.status]?.includes('amber') ? 'text-amber-600 dark:text-amber-300' : 'text-blue-600 dark:text-blue-300'}`}></i>
                        {jobApp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleClick(jobApp)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                      >
                        <i className="ri-eye-line mr-2"></i>
                        View Details
                        <i className="ri-arrow-right-line ml-2"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No applications yet</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-300">Start applying to jobs to see them here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;


// import React, { useEffect, useState } from 'react';
// import { fetchJobs } from '../../api/studentApi';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// // Icons as SVG components
// const BriefcaseIcon = ({ className = "w-6 h-6" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0h5l-1 12a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h5m0 0v6a2 2 0 002 2h2a2 2 0 002-2V6m-6 4h4"/>
//   </svg>
// );

// const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
//   </svg>
// );

// const XCircleIcon = ({ className = "w-6 h-6" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
//   </svg>
// );

// const EyeIcon = ({ className = "w-4 h-4" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
//   </svg>
// );

// const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
//   </svg>
// );

// const SunIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
//   </svg>
// );

// const MoonIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
//   </svg>
// );

// const statusColors = {
//   Selected: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:text-emerald-400 dark:border-emerald-700',
//   Rejected: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-400 dark:border-red-700',
//   Pending: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-400 dark:border-amber-700',
//   Applied: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 dark:border-blue-700',
// };

// const Applications = () => {
//   const navigate = useNavigate();
//   const [jobs, setJobs] = useState([]);
//   const { user } = useAuth();
//   const [isDark, setIsDark] = useState(false);

//   const handleClick = (job) => {
//     console.log(job);
//     navigate('/student/applications/jobDetails', { state: job });
//   };

//   const toggleTheme = () => {
//     setIsDark(!isDark);
//     document.documentElement.classList.toggle('dark');
//   };

//   useEffect(() => {
//     const getJobs = async () => {
//       try {
//         const response = await fetchJobs(user.student.prn);
//         if (response.success) {
//           setJobs(response.jobs);
//         }
//       } catch (error) {
//         console.error('Failed to fetch jobs:', error);
//       }
//     };

//     getJobs();
//   }, [user.student.prn]);

//   return (
//     <div className={isDark ? 'dark' : ''}>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-300">
//         <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
//           {/* Header with Theme Toggle */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//             <div className="mb-4 sm:mb-0">
//               <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
//                 My Applications
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 mt-2">Track your job applications and their status</p>
//             </div>
            
//             {/* Theme Toggle Button */}
//             <button
//               onClick={toggleTheme}
//               className="inline-flex items-center px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
//             >
//               {isDark ? <SunIcon /> : <MoonIcon />}
//               <span className="ml-2 text-sm font-medium">
//                 {isDark ? 'Light' : 'Dark'}
//               </span>
//             </button>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
//             <div className="group relative overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative flex items-center justify-between">
//                 <div>
//                   <p className="text-3xl lg:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
//                     {jobs.length}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">Total Applied</p>
//                 </div>
//                 <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
//                   <BriefcaseIcon className="text-indigo-600 dark:text-indigo-400" />
//                 </div>
//               </div>
//             </div>

//             <div className="group relative overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-400/10 dark:to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative flex items-center justify-between">
//                 <div>
//                   <p className="text-3xl lg:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
//                     {jobs.filter(j => j.status === 'Selected').length}
//                   </p>
//                   <p className=" text-gray-600 dark:text-gray-400 font-medium mt-1">Selected</p>
//                 </div>
//                 <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
//                   <CheckCircleIcon className="text-emerald-600 dark:text-emerald-400" />
//                 </div>
//               </div>
//             </div>

//             <div className="group relative overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//               <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 dark:from-red-400/10 dark:to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative flex items-center justify-between">
//                 <div>
//                   <p className="text-3xl lg:text-4xl font-bold text-red-600 dark:text-red-400">
//                     {jobs.filter(j => j.status === 'Rejected').length}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">Rejected</p>
//                 </div>
//                 <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
//                   <XCircleIcon className="text-red-600 dark:text-red-400" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Job Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//             {jobs.length === 0 ? (
//               <div className="col-span-full text-center py-12">
//                 <p className="text-gray-600 dark:text-gray-400 text-lg">No applications found.</p>
//               </div>
//             ) : (
//               jobs.map((job) => (
//                 <div
//                   key={job._id}
//                   className="group relative overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <div className="relative">
//                     <div className="flex items-center gap-4 mb-4">
//                       <img
//                         src={job.companyDetails?.companyProfile || '/placeholder-logo.png'}
//                         alt="Company Logo"
//                         className="w-12 h-12 rounded-lg object-contain border border-gray-300 dark:border-gray-600"
//                       />
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                           {job.jobDetails?.jobTitle || 'N/A'}
//                         </h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {job.companyDetails?.companyName || 'N/A'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 gap-y-2 mb-4">
//                       <div>
//                         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</span>
//                         <p className="text-sm text-gray-800 dark:text-gray-200">
//                           {job.jobDetails?.workLocation || 'N/A'}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</span>
//                         <p className="text-sm text-gray-800 dark:text-gray-200">
//                           {job.jobDetails?.CTC || 'N/A'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
//                           statusColors[job.status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
//                         }`}
//                       >
//                         {job.status || 'N/A'}
//                       </span>
//                       <button
//                         onClick={() => handleClick(job)}
//                         className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors duration-200"
//                       >
//                         <EyeIcon className="mr-1" />
//                         View Details
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Applications;