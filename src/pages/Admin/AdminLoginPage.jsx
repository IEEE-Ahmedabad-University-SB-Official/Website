import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem('ieee-login-userId', result.userId);
        navigate('/admin/dashboard'); // Redirect to the dashboard page
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-[rgb(1,8,21)] p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Admin Login</h1>
        <form id="loginForm" onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              id="username"
              placeholder="Username"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="space-y-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1 text-gray-400 hover:text-gray-200 
                transition duration-200"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={24} />
              ) : (
                <AiOutlineEye size={24} />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 
              focus:ring-offset-gray-800 transition duration-200 font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
