"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit3,
  Archive,
  ArrowLeft,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Calendar,
  Clock,
  Eye,
} from "lucide-react";

export default function SingleNote() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notes/${id}`, {
          withCredentials: true,
        });
        setNote(response.data?.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to fetch note");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id, navigate]);

  const handleArchive = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/notes/${id}`, {
        withCredentials: true,
      });
      navigate("/notes");
    } catch (err) {
      setError("Failed to archive note");
    }
  };

  const handlePermanentDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this note? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/notes/${id}/permanent`, {
        withCredentials: true,
      });
      navigate("/archives");
    } catch (err) {
      setError("Failed to permanently delete note");
    }
  };

  const handleRestore = async () => {
    try {
      await axios.patch(
        `${API_BASE_URL}/notes/${id}/unarchive`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/notes");
    } catch (err) {
      setError("Failed to restore note");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-note/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          <div className="text-sm sm:text-base text-gray-600 font-medium">
            Loading note...
          </div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {error || "Note not found"}
          </p>
          <button
            onClick={() => navigate("/notes")}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  const isArchived = note.is_deleted;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(isArchived ? "/archives" : "/notes")}
            className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 mb-2 sm:mb-6 mt-14 sm:mt-14 md:mt-0"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="font-medium text-sm sm:text-base">
              Back to {isArchived ? "Archives" : "Notes"}
            </span>
          </button>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {isArchived ? (
              <>
                <button
                  onClick={handleRestore}
                  className="group w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
                >
                  <RotateCcw
                    size={16}
                    className="group-hover:rotate-180 transition-transform duration-300"
                  />
                  <span>Restore Note</span>
                </button>

                <button
                  onClick={handlePermanentDelete}
                  className="group w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
                >
                  <Trash2
                    size={16}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <span>Delete Forever</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="group w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
                >
                  <Edit3
                    size={16}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <span>Edit Note</span>
                </button>

                <button
                  onClick={handleArchive}
                  className="group w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm sm:text-base"
                >
                  <Archive
                    size={16}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <span>Archive</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Archived Indicator */}
        {isArchived ? (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle
                  size={16}
                  className="sm:w-5 sm:h-5 text-amber-600"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-amber-800 font-semibold text-sm sm:text-base block">
                  This note is archived
                </span>
                <p className="text-amber-700 text-xs sm:text-sm mt-1">
                  Archived on {new Date(note.deleted_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {/* Note Content */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          style={{ backgroundColor: note.background_color || "#ffffff" }}
        >
          {/* Note Header */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-200/50">
            <div className="flex items-start space-x-3 mb-4 sm:mb-6">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">
                  {note.title}
                </h1>
              </div>
            </div>

            {/* Categories */}
            {note.categories && note.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {note.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1.5 text-xs sm:text-sm bg-gray-800 text-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm text-black">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <Calendar size={14} className="text-black" />
                <span>
                  Created {new Date(note.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <Clock size={14} className="text-black" />
                <span>
                  Updated {new Date(note.updated_at).toLocaleDateString()}
                </span>
              </div>
              {isArchived && note.deleted_at ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <Archive size={14} className="text-black" />
                  <span>
                    Archived {new Date(note.deleted_at).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          {/* Note Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {note.content ? (
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <div className="text-black leading-relaxed whitespace-pre-wrap break-words text-sm sm:text-base">
                  {note.content}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
                  📝
                </div>
                <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                  This note has no content yet.
                </p>
                {!isArchived && (
                  <button
                    onClick={handleEdit}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm sm:text-base font-medium"
                  >
                    Add Content
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm sm:text-base font-medium">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
