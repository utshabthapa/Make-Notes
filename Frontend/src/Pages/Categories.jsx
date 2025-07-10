"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Save, X, Tag } from "lucide-react";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/categories`,
        { name: newCategoryName.trim() },
        { withCredentials: true }
      );

      setCategories([...categories, response.data.data]);
      setNewCategoryName("");
      setShowCreateForm(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to create category");
      }
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (!editCategoryName.trim()) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/categories/${categoryId}`,
        { name: editCategoryName.trim() },
        { withCredentials: true }
      );

      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? response.data.data : cat
        )
      );
      setEditingCategory(null);
      setEditCategoryName("");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to update category");
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
        withCredentials: true,
      });

      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to delete category");
      }
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditCategoryName("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-14 sm:mt-14 md:mt-0">
                  Categories
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage your note categories
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Create New Category Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Create New Category
              </h2>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="group flex items-center justify-center sm:justify-start space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl  transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm"
                >
                  <Plus
                    size={16}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <span>Add Category</span>
                </button>
              )}
            </div>

            {showCreateForm && (
              <form
                onSubmit={handleCreateCategory}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="group flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm flex-1 sm:flex-none"
                  >
                    <Save
                      size={14}
                      className="group-hover:scale-110 transition-transform duration-200"
                    />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCategoryName("");
                    }}
                    className="group flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm flex-1 sm:flex-none"
                  >
                    <X
                      size={14}
                      className="group-hover:scale-110 transition-transform duration-200"
                    />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Your Categories ({categories.length})
              </h2>
            </div>

            {categories.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-4">
                  🏷️
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                  No categories yet
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                  Create your first category to organize your notes
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors text-sm sm:text-base font-medium"
                >
                  Create Category
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                  >
                    {editingCategory === category.id ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategory(category.id)}
                            className="group flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm flex-1 sm:flex-none"
                          >
                            <Save
                              size={14}
                              className="group-hover:scale-110 transition-transform duration-200"
                            />
                            <span className="hidden sm:inline">Save</span>
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="group flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm flex-1 sm:flex-none"
                          >
                            <X
                              size={14}
                              className="group-hover:scale-110 transition-transform duration-200"
                            />
                            <span className="hidden sm:inline">Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Created:{" "}
                            {new Date(
                              category.created_at || Date.now()
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(category)}
                            className="group flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm flex-1 sm:flex-none"
                          >
                            <Edit2
                              size={14}
                              className="group-hover:scale-110 transition-transform duration-200"
                            />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="group flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm flex-1 sm:flex-none"
                          >
                            <Trash2
                              size={14}
                              className="group-hover:scale-110 transition-transform duration-200"
                            />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
