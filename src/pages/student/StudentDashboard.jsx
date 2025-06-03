// import { jwtDecode } from 'jwt-decode';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import StudentApplicationtable from './StudentApplicationtable';
// const StudentDashboard = () => {
//   const [applications, setApplications] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       const token = localStorage.getItem('studentToken');
//       const decoded = jwtDecode(token);
//       const prn = decoded.student.prn;
//       try {
//         const response = await fetch('https://loacalhost:5000/student/allApplications', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ prn })
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch student details');
//         }

//         const data = await response.json();
//         setApplications(data); 
//       } catch (error) {
//         console.error(error.message);
//         navigate('/login');
//       }
//     };

//     fetchStudentDetails();
//   }, [navigate]);

//   if (!applications) {
//     return <div className="text-center mt-8 text-gray-500">Ypu haven't applied yet!</div>;
//   }

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
//       <StudentApplicationtable applications={applications} />
//     </div>
//   );
// };

// export default StudentDashboard;


// import React from 'react'
// import { useAuth } from '../../context/AuthContext'
// import UploadMarksheet from './UploadMarksheet'
// import AvailableJobs from './AvailableJobs'

// const studentDashboard = () => {
//   return (
//     <div>

//       <AvailableJobs />

//       <UploadMarksheet />
      
//     </div>
//   )
// }

// export default studentDashboard





import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UploadMarksheet from './UploadMarksheet';
import AvailableJobs from './AvailableJobs';

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
    </div>
  );
};

export default StudentDashboard;
