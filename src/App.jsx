import React, { useState } from 'react';
import "./App.css"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import HomePage from './pages/Home/HomePage';
import EventPage from './pages/Events/EventPage';
import AchievementPage from './pages/Achievements/AchievementPage';
import CommitteePage from './pages/Committee/CommitteePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import AdminDashboardPage from './pages/Admin/Admin Dashboard/AdminDashboardPage';
import AdminEventPage from './pages/Admin/AdminEventPage';
import AdminCommitteePage from './pages/Admin/AdminCommitteePage';
import AdminAchievementPage from './pages/Admin/AdminAchievementPage';
import AdminContactUsPage from './pages/Admin/AdminContactUs';
import AdminGetUpdatesPage from './pages/Admin/AdminGetUpdates';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is logged in by checking sessionStorage on each page load
  const checkAuthentication = () => {
    const userId = sessionStorage.getItem('ieee-login-userId');
    return userId !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ element }) => {
    return checkAuthentication() ? element : <Navigate to="/admin" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/committee" element={<CommitteePage />} />
        <Route path="/achievements" element={<AchievementPage />} />
        
        <Route path="*" element={<NotFoundPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsersPage />} />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboardPage />} />} />
        <Route path="/admin/events" element={<ProtectedRoute element={<AdminEventPage />} />} />
        <Route path="/admin/committee" element={<ProtectedRoute element={<AdminCommitteePage />} />} />
        <Route path="/admin/achievements" element={<ProtectedRoute element={<AdminAchievementPage />} />} />
        <Route path="/admin/contact-us" element={<ProtectedRoute element={<AdminContactUsPage />} />} />
        <Route path="/admin/get-updates" element={<ProtectedRoute element={<AdminGetUpdatesPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;
