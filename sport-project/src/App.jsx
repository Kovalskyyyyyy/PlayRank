import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProfileForm from './pages/ProfileForm';
import ProfileView from './pages/ProfileView';
import ProfilePublicView from './pages/ProfilePublicView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/edit" element={<ProfileForm />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/:id" element={<ProfilePublicView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;