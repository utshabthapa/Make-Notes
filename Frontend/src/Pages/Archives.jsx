"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate } from "react-router-dom";
import {
  BsArrowClockwise,
  BsTrash,
  BsSearch,
  BsSortAlphaUp,
  BsSortAlphaDown,
  BsCalendar3,
  BsSortDown,
  BsArchive,
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
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-14 sm:mt-14 md:mt-0">
                  Archived Notes
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {archivedNotes.length} archived notes
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Search and Sort Controls */}
          <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative">
              <BsSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search archived notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort Options */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => handleSortChange("title")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap text-sm ${
                  sortBy === "title"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BsSortDown size={14} />
                <span className="hidden sm:inline">Title</span>
                <span className="sm:hidden">A-Z</span>
                {sortBy === "title" &&
                  (sortOrder === "asc" ? (
                    <BsSortAlphaUp size={14} />
                  ) : (
                    <BsSortAlphaDown size={14} />
                  ))}
              </button>
              <button
                onClick={() => handleSortChange("created_at")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap text-sm ${
                  sortBy === "created_at"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BsCalendar3 size={14} />
                <span className="hidden sm:inline">Created</span>
                <span className="sm:hidden">New</span>
                {sortBy === "created_at" &&
                  (sortOrder === "asc" ? (
                    <BsSortAlphaUp size={14} />
                  ) : (
                    <BsSortAlphaDown size={14} />
                  ))}
              </button>
              <button
                onClick={() => handleSortChange("deleted_at")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap text-sm ${
                  sortBy === "deleted_at"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BsTrash size={14} />
                <span className="hidden sm:inline">Archived</span>
                <span className="sm:hidden">Archived</span>
                {sortBy === "deleted_at" &&
                  (sortOrder === "asc" ? (
                    <BsSortAlphaUp size={14} />
                  ) : (
                    <BsSortAlphaDown size={14} />
                  ))}
              </button>
            </div>
          </div>

          {sortedNotes.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              {searchTerm ? (
                <>
                  <div className="text-gray-400 text-4xl sm:text-6xl mb-4">
                    🔍
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                    No archived notes found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                    Try adjusting your search terms
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <div className="text-gray-400 text-4xl sm:text-6xl mb-4">
                    🗃️
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                    No archived notes
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                    Notes you archive will appear here
                  </p>
                  <button
                    onClick={() => navigate("/notes")}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    Go to Notes
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleViewNote(note.id)}
                  className="rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 h-48 sm:h-56 md:h-64 flex flex-col relative cursor-pointer group"
                  style={{
                    backgroundColor: note.background_color || "#ffffff",
                    backgroundImage: "none",
                  }}
                >
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <div className="mb-2 sm:mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg leading-tight line-clamp-2 pr-10 sm:pr-12">
                        {note.title}
                      </h3>
                    </div>

                    <div className="flex-1 mb-2 sm:mb-3">
                      <p className="text-gray-900 tracking-wide text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
                        {truncateContent(note.content, 80)}
                      </p>
                    </div>

                    <div className="mt-auto">
                      {note.categories && note.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
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

                      <div className="text-xs text-gray-500 mb-2">
                        Archived:{" "}
                        {new Date(note.deleted_at).toLocaleDateString()}
                      </div>

                      {/* Floating Action Buttons */}
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(note.id);
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-sm hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-emerald-200 hover:border-emerald-500"
                          title="Restore note"
                        >
                          <BsArrowClockwise
                            size={12}
                            className="sm:w-3.5 sm:h-3.5"
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePermanentDelete(note.id);
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-sm hover:bg-red-500 hover:text-white text-red-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-red-200 hover:border-red-500"
                          title="Delete permanently"
                        >
                          <BsTrash size={12} className="sm:w-3.5 sm:h-3.5" />
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
