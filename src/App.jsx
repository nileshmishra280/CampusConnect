import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Layout from './components/Layout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
[{
	"resource": "/C:/Users/niles/Desktop/TNP/client/src/App.jsx",
	"owner": "typescript",
	"code": "1149",
	"severity": 8,
	"message": "File name 'c:/Users/niles/Desktop/TNP/client/src/pages/admin/AdminDashboard.jsx' differs from already included file name 'c:/Users/niles/Desktop/TNP/client/src/pages/admin/adminDashboard.jsx' only in casing.\n  The file is in the program because:\n    Root file specified for compilation\n    Imported via './pages/admin/AdminDashboard' from file 'c:/Users/niles/Desktop/TNP/client/src/App.jsx'",
	"source": "ts",
	"startLineNumber": 7,
	"startColumn": 28,
	"endLineNumber": 7,
	"endColumn": 58
}]
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< LandingPage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />} />


        <Route element={<Layout />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        </Route>

 
      </Routes>
    </Router>
  );
};

export default App;