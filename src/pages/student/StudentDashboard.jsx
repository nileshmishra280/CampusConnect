
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UploadMarksheet from './UploadMarksheet';
import AvailableJobs from './AvailableJobs';
import QuesFromResume from './QuesFromResume';


const StudentDashboard = () => {
  const { user } = useAuth(); 
  const [hasUploadedDetails, setHasUploadedDetails] = useState(false);

  useEffect(() => {
    if (user.student.hasAdded) {
      setHasUploadedDetails(true);
    }
  }, [user]);

  // Still loading state
  if (hasUploadedDetails === null) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="relative">
      {/* Blur and disable background if not uploaded */}
      <div className={hasUploadedDetails ? '' : 'blur-sm pointer-events-none select-none'}>
        <AvailableJobs />
      </div>

      {/* Modal-style overlay for uploading */}
      {!hasUploadedDetails && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <UploadMarksheet onSuccess={() => setHasUploadedDetails(true)} />
          </div>
        </div>
      )}

      <QuesFromResume />
    </div>

    
  );
};

export default StudentDashboard;
