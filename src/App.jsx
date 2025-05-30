import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import CompanyDashboard from './pages/company/CompanyDashboard';
import UploadMarksheet from './pages/student/UploadMarksheet';
import JobInfo from './pages/JobInfo';
const App = () => {
 // localStorage.clear(); // Clear localStorage for testing purposes
  return (
    <Router>
      <Routes>
        <Route path="/" element={< LandingPage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />} />


        <Route element={<Navigation />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/upload-marksheet" element={<UploadMarksheet />} />
        <Route path="/jobInfo" element={<JobInfo />} />
        </Route>

 
      </Routes>
    </Router>
  );
};

export default App;