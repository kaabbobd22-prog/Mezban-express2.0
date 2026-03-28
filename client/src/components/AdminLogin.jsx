import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminLogin = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Live server URL setup
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.post(`${API_URL}/api/admin/login`, credentials);
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        onLoginSuccess();
        toast.success("Welcome back, Admin!");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Access Denied! Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mezban-maroon p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-mezban-gold opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-md text-center z-10 border border-gray-100">
        <div className="mb-6 inline-block p-4 bg-mezban-maroon/5 rounded-full">
           <span className="text-4xl">🔐</span>
        </div>
        
        <h2 className="text-3xl font-black text-mezban-maroon mb-2 font-serif">Admin Access</h2>
        <p className="text-gray-500 text-sm mb-8 italic">Authorized personal only</p>
        
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Username</label>
            <input 
              type="text" placeholder="Enter username" required
              className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-mezban-gold focus:bg-orange-50/30 transition-all"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Password</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-mezban-gold focus:bg-orange-50/30 transition-all"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-mezban-maroon text-white py-4 rounded-2xl font-bold text-lg hover:bg-black hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>

        <p className="mt-8 text-xs text-gray-400">
          Mezban Express &copy; 2024 Admin Panel
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;