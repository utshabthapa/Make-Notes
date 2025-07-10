"use client";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Pages/API";
import { LogOut, UserPlus, LogIn } from "lucide-react";

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? "/notes" : "/login"}
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            <span>Make Notes</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut
                  size={16}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <LogIn
                    size={16}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="hidden sm:inline">Sign in</span>
                </Link>
                <Link
                  to="/signup"
                  className="group flex items-center space-x-2 px-3 sm:px-4 py-2  bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-sm font-medium"
                >
                  <UserPlus
                    size={16}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="hidden sm:inline">Sign up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
