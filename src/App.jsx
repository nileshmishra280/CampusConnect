import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPAge';
import Register from './pages/Register';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< LandingPage/>} />
        {/* Add additional routes as needed, e.g., for registration */}
      <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes for other pages like Dashboard, Profile, etc. */}
      </Routes>
    </Router>
  );
};

export default App;