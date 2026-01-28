import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login if not logged in, otherwise redirect to Dashboard */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />

        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard → protected route */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />

        {/* About page */}
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
