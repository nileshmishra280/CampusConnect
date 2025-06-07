import React, {  useEffect, useState } from 'react';
import { fetchJobs } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const statusColors = {
  Selected: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Pending: 'bg-yellow-100 text-yellow-800'
};

const Applications = () => {
    const navigate=useNavigate();
  const [jobs, setJobs] = useState([]);
  const {user} = useAuth();

  const handleClick=(job)=>{
    console.log(job);
    navigate('/student/applications/jobDetails',{state:job})
  }

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetchJobs(user.student.prn); // assuming it returns { success, jobs }
        if (response.success) {
          setJobs(response.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    getJobs();
  }, [user.prn]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{jobs.length}</p>
          <p className="text-gray-600">Total Applied</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{jobs.filter(j => j.status === 'Selected').length}</p>
          <p className="text-gray-600">Selected</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{jobs.filter(j => j.status === 'Rejected').length}</p>
          <p className="text-gray-600">Rejected</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Job Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map((jobApp) => (
              <tr key={jobApp._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {jobApp.jobDetails?.jobTitle || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {jobApp.companyDetails?.companyName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[jobApp.status] || 'bg-gray-100 text-gray-800'}`}>
                    {jobApp.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium" onClick={()=>handleClick(jobApp)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;
