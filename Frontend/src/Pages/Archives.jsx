"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate } from "react-router-dom";
import {
  BsArrowClockwise,
  BsTrash,
  BsEye,
  BsSearch,
  BsSortAlphaUp,
  BsSortAlphaDown,
  BsCalendar3,
  BsSortDown,
} from "react-icons/bs";

export default function Archives() {
  const navigate = useNavigate();
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deleted_at");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const fetchArchivedNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes/archived`, {
        withCredentials: true,
      });
      setArchivedNotes(response.data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to fetch archived notes");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (noteId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/notes/${noteId}/unarchive`,
        {},
        {
          withCredentials: true,
        }
      );
      setArchivedNotes(archivedNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to restore note");
      }
    }
  };

  const handlePermanentDelete = async (noteId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this note? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/notes/${noteId}/permanent`, {
        withCredentials: true,
      });
      setArchivedNotes(archivedNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to permanently delete note");
      }
    }
  };

  const handleViewNote = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  // Search functionality
  const filteredNotes = archivedNotes.filter((note) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower)
    );
  });

  // Sort functionality
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "created_at":
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case "updated_at":
        aValue = new Date(a.updated_at);
        bValue = new Date(b.updated_at);
        break;
      case "deleted_at":
        aValue = new Date(a.deleted_at);
        bValue = new Date(b.deleted_at);
        break;
      default:
        aValue = new Date(a.deleted_at);
        bValue = new Date(b.deleted_at);
    }
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Archived Notes
            </h1>
            <p className="text-gray-600">
              {archivedNotes.length} archived notes
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Search and Sort Controls */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <BsSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search archived notes by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Sort Options */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSortChange("title")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  sortBy === "title"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BsSortDown size={16} />
                Title
                {sortBy === "title" &&
                  (sortOrder === "asc" ? (
                    <BsSortAlphaUp size={16} />
                  ) : (
                    <BsSortAlphaDown size={16} />
                  ))}
              </button>
              <button
                onClick={() => handleSortChange("created_at")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  sortBy === "created_at"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BsCalendar3 size={16} />
                Created
                {sortBy === "created_at" &&
                  (sortOrder === "asc" ? (
                    <BsSortAlphaUp size={16} />
                  ) : (
                    <BsSortAlphaDown size={16} />
                  ))}
              </button>
              <button
                onClick={() => handleSortChange("deleted_at")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  sortBy === "deleted_at"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BsTrash size={16} />
                Archived
                {sortBy === "deleted_at" &&
                  (sortOrder === "asc" ? (
                    <BsSortAlphaUp size={16} />
                  ) : (
                    <BsSortAlphaDown size={16} />
                  ))}
              </button>
            </div>
          </div>

          {sortedNotes.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <>
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    No archived notes found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search terms
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <div className="text-gray-400 text-6xl mb-4">🗃️</div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    No archived notes
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Notes you archive will appear here
                  </p>
                  <button
                    onClick={() => navigate("/notes")}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Go to Notes
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 h-64 flex flex-col relative"
                  style={{
                    backgroundColor: note.background_color || "#ffffff",
                    backgroundImage: "none",
                  }}
                >
                  {/* Archived indicator */}
                  <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                    Archived
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2">
                        {note.title}
                      </h3>
                    </div>

                    <div className="flex-1 mb-3">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {truncateContent(note.content)}
                      </p>
                    </div>

                    <div className="mt-auto">
                      {note.categories && note.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {note.categories.slice(0, 2).map((category) => (
                            <span
                              key={category.id}
                              className="px-2 py-1 text-xs bg-black text-white rounded-full"
                            >
                              {category.name}
                            </span>
                          ))}
                          {note.categories.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-black text-white rounded-full">
                              +{note.categories.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-400 mb-3">
                        Archived:{" "}
                        {new Date(note.deleted_at).toLocaleDateString()}
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-between space-x-2">
                        <button
                          onClick={() => handleViewNote(note.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded text-xs transition-colors"
                        >
                          <BsEye size={12} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleRestore(note.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded text-xs transition-colors"
                        >
                          <BsArrowClockwise size={12} />
                          <span>Restore</span>
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(note.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded text-xs transition-colors"
                        >
                          <BsTrash size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
