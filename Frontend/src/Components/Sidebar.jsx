"use client";

import { useNavigate, useLocation } from "react-router-dom";
import {
  BsPlus,
  BsArchive,
  BsTag,
  BsBoxArrowRight,
  BsBookmark,
  BsJournalText,
  BsList,
  BsX,
} from "react-icons/bs";
import axios from "axios";
import { API_BASE_URL } from "../Pages/API";
import { useState, useEffect } from "react";

export default function Sidebar({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        event.target.closest(".mobile-sidebar") === null &&
        event.target.closest(".mobile-menu-button") === null
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) => {
    if (path === "/notes") {
      return location.pathname === "/notes" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      path: "/notes",
      icon: BsJournalText,
      label: "Notes",
    },
    {
      path: "/create-note",
      icon: BsPlus,
      label: "New Note",
      isSpecial: true,
    },
    {
      path: "/bookmarks",
      icon: BsBookmark,
      label: "Bookmarks",
    },
    {
      path: "/categories",
      icon: BsTag,
      label: "Categories",
    },
    {
      path: "/archives",
      icon: BsArchive,
      label: "Archives",
    },
  ];

  const handleMenuItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile Menu Button (always visible on mobile)
  const mobileMenuButton = (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="mobile-menu-button fixed top-4 left-4 z-50 w-12 h-12 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
    >
      {isMobileMenuOpen ? (
        <BsX size={24} className="text-gray-700" />
      ) : (
        <BsList size={24} className="text-gray-700" />
      )}
    </button>
  );

  // Mobile Sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        {mobileMenuButton}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0   z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Mobile Sidebar */}
            <div className="mobile-sidebar fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-300 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Make Notes
                </h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <BsX size={24} className="text-gray-700" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  if (item.isSpecial) {
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleMenuItemClick(item.path)}
                        className="w-full flex items-center space-x-3 px-3 py-3 text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200 font-medium"
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleMenuItemClick(item.path)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 font-medium relative ${
                        active
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                      {active && (
                        <div className="absolute right-3 w-1.5 h-1.5 bg-black rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="absolute bottom-6 left-4 right-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  <BsBoxArrowRight size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop Sidebar (default behavior)
  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-sm border-r border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-300">
        <h1 className="text-2xl font-semibold text-gray-900">Make Notes</h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isSpecial) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200 font-medium"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 font-medium relative ${
                active
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {active && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-black rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          <BsBoxArrowRight size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
