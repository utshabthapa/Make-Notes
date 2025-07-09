"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Trash2, Eye } from "lucide-react";

export default function Archives() {
  const navigate = useNavigate();
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

          {archivedNotes.length === 0 ? (
            <div className="text-center py-12">
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
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {archivedNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 h-64 flex flex-col relative"
                  style={{
                    backgroundColor: note.background_color || "#ffffff",
                    backgroundImage: "none",
                  }}
                >
                  {/* Archived indicator */}
                  <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
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
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                            >
                              {category.name}
                            </span>
                          ))}
                          {note.categories.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
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
                          className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs transition-colors"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleRestore(note.id)}
                          className="flex items-center space-x-1 px-2 py-1 text-green-600 hover:bg-green-50 rounded text-xs transition-colors"
                        >
                          <RotateCcw size={12} />
                          <span>Restore</span>
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(note.id)}
                          className="flex items-center space-x-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs transition-colors"
                        >
                          <Trash2 size={12} />
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
