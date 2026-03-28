import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

function App() {
  // Website vs Admin View control
  const [showAdminView, setShowAdminView] = useState(false);
  
  // Login status control
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if admin is already logged in (Token check)
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setShowAdminView(false);
  };

  return (
    <main className="min-h-screen relative font-sans">
      <Toaster position="top-right" />
      
      {/* Admin Toggle Button (Hidden in bottom corner) */}
      <button 
        onClick={() => setShowAdminView(!showAdminView)}
        className="fixed bottom-4 right-4 z-[100] bg-gray-200 p-2 rounded text-[10px] opacity-20 hover:opacity-100 transition-opacity"
      >
        {showAdminView ? "Go to Website" : "Admin Panel"}
      </button>

      {showAdminView ? (
        /* Check if logged in, otherwise show Login Page */
        isLoggedIn ? (
          <div className="relative">
            <button 
              onClick={handleLogout}
              className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-700 z-[110]"
            >
              Logout
            </button>
            <AdminDashboard />
          </div>
        ) : (
          <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />
        )
      ) : (
        /* Regular Website View */
        <div className="flex flex-col md:flex-row">
          <div className="md:w-[45%] lg:w-[40%]">
            <Hero />
          </div>
          <div className="md:w-[55%] lg:w-[60%]">
            <MenuSection />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;