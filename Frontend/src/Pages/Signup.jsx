"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Signup({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      navigate("/notes");
    } catch (err) {
      if (err.response?.data?.error) {
        setErrors({ server: err.response.data.error });
      } else {
        setErrors({ server: "Something went wrong. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create account
          </h1>
          <p className="text-sm text-gray-600">
            Join and start organizing your thoughts
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
          {errors.server && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.server}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-sm ${
                    errors.username
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-sm ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-sm ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-sm ${
                    errors.passwordConfirm
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-sm"
            >
              <span>
                {isLoading ? "Creating account..." : "Create account"}
              </span>
              {!isLoading && (
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-gray-800 hover:text-gray-900 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <button className="text-gray-700 hover:text-gray-900 transition-colors">
              Terms
            </button>{" "}
            and{" "}
            <button className="text-gray-700 hover:text-gray-900 transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
