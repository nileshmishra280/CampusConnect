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


import React from 'react'

const studentDashboard = () => {
  return (
    <div>studentDashboard</div>
  )
}

export default studentDashboard