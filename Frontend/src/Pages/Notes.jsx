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
} from "react-icons/bs";

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        withCredentials: true,
      });
      setNotes(response.data?.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to fetch notes");
        setNotes([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
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
      fetchNotes();
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

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Search functionality
  const filteredNotes = notes.filter((note) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
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
      className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 h-64 flex flex-col relative"
      style={{
        backgroundColor: note.background_color || "#ffffff",
        backgroundImage: "none",
      }}
    >
      {/* Pin and Bookmark icons */}
      <div className="absolute top-2 right-2 flex space-x-1">
        <button
          onClick={(e) => handleTogglePin(e, note.id)}
          className={`p-1.5 rounded-full transition-colors ${
            note.pinned
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {note.pinned ? <BsPinFill size={14} /> : <BsPin size={14} />}
        </button>
        <button
          onClick={(e) => handleToggleBookmark(e, note.id)}
          className={`p-1.5 rounded-full transition-colors ${
            note.bookmarked
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {note.bookmarked ? (
            <BsBookmarkFill size={13} />
          ) : (
            <BsBookmark size={13} />
          )}
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2 pr-12">
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
                  className="px-3 py-2 text-xs bg-black text-white rounded-full"
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Notes
            </h1>
            <p className="text-gray-600">{notes.length} notes total</p>
          </div>
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
                placeholder="Search notes by title or content..."
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
                onClick={() => handleSortChange("updated_at")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  sortBy === "updated_at"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BsClock size={16} />
                Modified
                {sortBy === "updated_at" &&
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
                    No notes found
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
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    No notes yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create your first note to get started
                  </p>
                  <button
                    onClick={() => navigate("/create-note")}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create Note
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pinned Notes Section */}
              {pinnedNotes.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <BsPinFill size={20} className="text-gray-800" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Pinned Notes
                    </h2>
                    <span className="text-sm text-gray-500">
                      ({pinnedNotes.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pinnedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}
              {/* Regular Notes Section */}
              {regularNotes.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {pinnedNotes.length > 0 ? "Other Notes" : "All Notes"}
                    </h2>
                    <span className="text-sm text-gray-500">
                      ({regularNotes.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}
