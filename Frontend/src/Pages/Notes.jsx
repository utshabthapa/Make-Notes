"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate } from "react-router-dom";
import {
  BsPinFill,
  BsPin,
  BsBookmarkFill,
  BsBookmark,
  BsSearch,
  BsSortAlphaDown,
  BsSortAlphaUp,
  BsCalendar3,
  BsClock,
  BsSortDown,
  BsTag,
  BsX,
  BsFunnel,
} from "react-icons/bs";

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [notesResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/notes`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/categories`, { withCredentials: true }),
      ]);
      setNotes(notesResponse.data?.data || []);
      setCategories(categoriesResponse.data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to fetch data");
        setNotes([]);
        setCategories([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const handleTogglePin = async (e, noteId) => {
    e.stopPropagation();
    try {
      await axios.patch(
        `${API_BASE_URL}/notes/${noteId}/pin`,
        {},
        { withCredentials: true }
      );
      fetchData();
    } catch (err) {
      console.error("Failed to toggle pin");
    }
  };

  const handleToggleBookmark = async (e, noteId) => {
    e.stopPropagation();
    try {
      await axios.patch(
        `${API_BASE_URL}/notes/${noteId}/bookmark`,
        {},
        { withCredentials: true }
      );
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, bookmarked: !note.bookmarked } : note
        )
      );
    } catch (err) {
      console.error("Failed to toggle bookmark");
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Enhanced filtering with categories
  const filteredNotes = notes.filter((note) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategories.length === 0 ||
      (note.categories &&
        note.categories.some((cat) => selectedCategories.includes(cat.id)));

    return matchesSearch && matchesCategory;
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
      default:
        aValue = new Date(a.updated_at);
        bValue = new Date(b.updated_at);
    }
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const pinnedNotes = sortedNotes.filter((note) => note.pinned);
  const regularNotes = sortedNotes.filter((note) => !note.pinned);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const activeFiltersCount = selectedCategories.length + (searchTerm ? 1 : 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          <div className="text-sm sm:text-base text-gray-600 font-medium">
            Loading notes...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  const NoteCard = ({ note }) => (
    <div
      key={note.id}
      onClick={() => handleNoteClick(note.id)}
      className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 h-48 sm:h-56 md:h-64 flex flex-col relative"
      style={{
        backgroundColor: note.background_color || "#ffffff",
        backgroundImage: "none",
      }}
    >
      {/* Pin and Bookmark icons */}
      <div className="absolute top-2 right-2 flex space-x-1">
        <button
          onClick={(e) => handleTogglePin(e, note.id)}
          className={`p-1 sm:p-1.5 rounded-full transition-colors ${
            note.pinned
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {note.pinned ? (
            <BsPinFill size={12} className="sm:w-3.5 sm:h-3.5" />
          ) : (
            <BsPin size={12} className="sm:w-3.5 sm:h-3.5" />
          )}
        </button>
        <button
          onClick={(e) => handleToggleBookmark(e, note.id)}
          className={`p-1 sm:p-1.5 rounded-full transition-colors ${
            note.bookmarked
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {note.bookmarked ? (
            <BsBookmarkFill size={11} className="sm:w-3 sm:h-3" />
          ) : (
            <BsBookmark size={11} className="sm:w-3 sm:h-3" />
          )}
        </button>
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="mb-2 sm:mb-3">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg leading-tight line-clamp-2 pr-10 sm:pr-12">
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
          <div className="text-xs text-black">
            {new Date(note.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 sm:mt-14 md:mt-0 mt-16">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Your Notes
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {notes.length} notes total
                  {activeFiltersCount > 0 &&
                    ` • ${filteredNotes.length} filtered`}
                </p>
              </div>
              {categories.length > 0 && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                    showFilters || activeFiltersCount > 0
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <BsFunnel size={14} />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative">
              <BsSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            {(showFilters || activeFiltersCount > 0) &&
              categories.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <BsTag size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Filter by Categories
                      </span>
                      {selectedCategories.length > 0 && (
                        <span className="text-xs text-gray-500">
                          ({selectedCategories.length} selected)
                        </span>
                      )}
                    </div>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryFilter(category.id)}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                          selectedCategories.includes(category.id)
                            ? "bg-black text-white border border-black"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <span>{category.name}</span>
                        {selectedCategories.includes(category.id) && (
                          <BsX size={12} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                onClick={() => handleSortChange("updated_at")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap text-sm ${
                  sortBy === "updated_at"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BsClock size={14} />
                <span className="hidden sm:inline">Modified</span>
                <span className="sm:hidden">Modified</span>
                {sortBy === "updated_at" &&
                  (sortOrder === "asc" ? (
                    <BsSortAlphaUp size={14} />
                  ) : (
                    <BsSortAlphaDown size={14} />
                  ))}
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">
                Active filters:
              </span>
              {searchTerm && (
                <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-blue-900"
                  >
                    <BsX size={12} />
                  </button>
                </span>
              )}
              {selectedCategories.map((categoryId) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId
                );
                return (
                  <span
                    key={categoryId}
                    className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                  >
                    <span>{category?.name}</span>
                    <button
                      onClick={() => handleCategoryFilter(categoryId)}
                      className="hover:text-gray-900"
                    >
                      <BsX size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {sortedNotes.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              {activeFiltersCount > 0 ? (
                <>
                  <div className="text-gray-400 text-4xl sm:text-6xl mb-4">
                    🔍
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                    No notes found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </>
              ) : (
                <>
                  <div className="text-gray-400 text-4xl sm:text-6xl mb-4">
                    📝
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                    No notes yet
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                    Create your first note to get started
                  </p>
                  <button
                    onClick={() => navigate("/create-note")}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    Create Note
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Pinned Notes Section */}
              {pinnedNotes.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <BsPinFill
                      size={18}
                      className="sm:w-5 sm:h-5 text-gray-800"
                    />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                      Pinned Notes
                    </h2>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({pinnedNotes.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                    {pinnedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Notes Section */}
              {regularNotes.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {pinnedNotes.length > 0 ? "Other Notes" : "All Notes"}
                    </h2>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({regularNotes.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                    {regularNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={() => navigate("/create-note")}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 hover:scale-105 active:scale-95"
        aria-label="Create new note"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
