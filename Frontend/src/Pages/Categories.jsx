"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

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
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Categories
            </h1>
            <p className="text-gray-600">Manage your note categories</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Create New Category Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Category
              </h2>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              )}
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreateCategory} className="flex space-x-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewCategoryName("");
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </form>
            )}
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Categories ({categories.length})
              </h2>
            </div>

            {categories.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-4xl mb-4">🏷️</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No categories yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first category to organize your notes
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Category
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    {editingCategory === category.id ? (
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditCategory(category.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Save size={14} />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Created:{" "}
                            {new Date(
                              category.created_at || Date.now()
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(category)}
                            className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
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
