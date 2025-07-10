"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Notes from "./Pages/Notes";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import axios from "axios";
import { API_BASE_URL } from "./Pages/API";
import CreateNotes from "./Pages/CreateNotes";
import SingleNote from "./Pages/SingleNote";
import EditNote from "./Pages/EditNote";
import Categories from "./Pages/Categories";
import Archives from "./Pages/Archives";
import Bookmarks from "./Pages/Bookmarks";

const AuthLayout = ({ children, isAuthenticated, setIsAuthenticated }) => {
  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {children}
    </>
  );
};

const AppLayout = ({ children, setIsAuthenticated }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex">
      <Sidebar setIsAuthenticated={setIsAuthenticated} />
      <div className={`flex-1 ${isMobile ? "" : "ml-64"}`}>{children}</div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      return response.status === 200;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuthStatus();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };
    verifyAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/notes" replace />} />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <AuthLayout
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              >
                <Signup setIsAuthenticated={setIsAuthenticated} />
              </AuthLayout>
            ) : (
              <Navigate to="/notes" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <AuthLayout
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              >
                <Login setIsAuthenticated={setIsAuthenticated} />
              </AuthLayout>
            ) : (
              <Navigate to="/notes" />
            )
          }
        />
        <Route
          path="/notes"
          element={
            isAuthenticated ? (
              <AppLayout setIsAuthenticated={setIsAuthenticated}>
                <Notes />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/create-note"
          element={
            isAuthenticated ? (
              <AppLayout setIsAuthenticated={setIsAuthenticated}>
                <CreateNotes />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/note/:id"
          element={
            isAuthenticated ? (
              <AppLayout setIsAuthenticated={setIsAuthenticated}>
                <SingleNote />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit-note/:id"
          element={
            isAuthenticated ? (
              <AppLayout setIsAuthenticated={setIsAuthenticated}>
                <EditNote />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/categories"
          element={
            isAuthenticated ? (
              <AppLayout setIsAuthenticated={setIsAuthenticated}>
                <Categories />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/archives"
          element={
            isAuthenticated ? (
              <AppLayout setIsAuthenticated={setIsAuthenticated}>
                <Archives />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/bookmarks"
          element={
            isAuthenticated ? (
              <AppLayout setIsAuthenticated={setIsAuthenticated}>
                <Bookmarks />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
