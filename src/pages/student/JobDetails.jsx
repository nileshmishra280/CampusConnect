import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const statusColors = {
  Selected: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Applied: 'bg-blue-100 text-blue-800',
};

const JobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state;

  if (!job)
    return (
      <div className="flex justify-center items-center min-h-screen p-8 bg-gray-100 text-gray-600">
        No job data available.
      </div>
    );

  const { jobDetails, companyDetails, status } = job;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium"
      >
        &larr; Back to Applications
      </button>

      <div className="bg-white rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center gap-6 border-b border-gray-200 pb-6 mb-6">
          <img
            src={companyDetails?.companyProfile || '/placeholder-logo.png'}
            alt="Company Logo"
            className="w-24 h-24 rounded-lg object-contain border border-gray-300"
          />
          <div className="flex-grow">
            <h1 className="text-3xl font-extrabold text-gray-900">{jobDetails?.jobTitle}</h1>
            <p className="mt-1 text-xl text-gray-700">{companyDetails?.companyName}</p>
            {status && (
              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full font-semibold text-sm ${
                  statusColors[status] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {status}
              </span>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-gray-700 mb-8">
          <InfoBlock label="Location" value={jobDetails?.workLocation} />
          <InfoBlock label="Salary" value={jobDetails?.CTC} />
          <InfoBlock label="Work mode" value={jobDetails?.workMode} />
          <InfoBlock label="Work days" value={jobDetails?.workDays} />
          <InfoBlock label="Working time" value={jobDetails?.workTime} />
          <InfoBlock label="Work place" value={jobDetails?.workModel} />
          <InfoBlock
            label="Application Deadline"
            value={
              jobDetails?.lastDateForApplication
                ? new Date(jobDetails.lastDateForApplication).toLocaleDateString()
                : 'N/A'
            }
          />
        </div>

        {/* Description */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {jobDetails?.jobDescription || 'No description available.'}
          </p>
        </section>
      </div>
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-500">{label}</h4>
    <p className="mt-1 text-base text-gray-800">{value || 'N/A'}</p>
  </div>
);

export default JobDetails;
