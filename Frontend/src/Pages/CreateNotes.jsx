"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, PlusCircle, Palette, Tag } from "lucide-react";

const colorOptions = [
  { name: "White", value: "#f8fafc" },
  { name: "Light Blue", value: "#dbeafe" },
  { name: "Light Green", value: "#dcfce7" },
  { name: "Light Yellow", value: "#fef3c7" },
  { name: "Light Orange", value: "#fed7aa" },
  { name: "Light Pink", value: "#fce7f3" },
  { name: "Light Purple", value: "#e9d5ff" },
  { name: "Light Coral", value: "#fecaca" },
  { name: "Light Gray", value: "#f1f5f9" },
];

export default function CreateNotes() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categories: [],
    background_color: "#f8fafc",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`, {
          withCredentials: true,
        });
        setCategories(response.data?.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to fetch categories");
        }
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, background_color: color }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await axios.post(`${API_BASE_URL}/notes`, formData, {
        withCredentials: true,
      });

      navigate("/notes");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to create note. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate("/notes")}
              className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-100  sm:mb-3  mt-14 sm:mt-14 md:mt-0"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span className="font-medium ">Back to Notes</span>
            </button>

            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Create New Note
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Write your thoughts and ideas
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm sm:text-base font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Note Content Card */}
            <div
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 transition-all duration-300"
              style={{ backgroundColor: formData.background_color }}
            >
              <div className="space-y-4 sm:space-y-6">
                {/* Title Field */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-base sm:text-lg font-medium bg-white/70 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400"
                    placeholder="Enter note title..."
                    required
                  />
                </div>

                {/* Content Field */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={window.innerWidth < 640 ? 8 : 12}
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none bg-white/70 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 text-sm sm:text-base"
                    placeholder="Start writing your note..."
                  />
                </div>
              </div>
            </div>

            {/* Customization Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
              <div className="space-y-4 sm:space-y-6">
                {/* Background Color Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Palette size={18} className="text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">
                      Background Color
                    </label>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-9 gap-2 sm:gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => handleColorSelect(color.value)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          formData.background_color === color.value
                            ? "border-gray-800 ring-2 ring-gray-300 shadow-md"
                            : "border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Categories Section */}
                {categories.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag size={18} className="text-gray-600" />
                      <label className="text-sm font-medium text-gray-700">
                        Categories
                      </label>
                      <span className="text-xs text-gray-500">
                        ({formData.categories.length} selected)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryToggle(category.id)}
                          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                            formData.categories.includes(category.id)
                              ? "bg-gray-800 text-white border border-gray-800 shadow-md"
                              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 shadow-sm hover:shadow-md"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                    {formData.categories.length === 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Select categories to organize your note
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/notes")}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base order-1 sm:order-2"
              >
                <Save
                  size={16}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span>{isLoading ? "Saving..." : "Save Note"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
