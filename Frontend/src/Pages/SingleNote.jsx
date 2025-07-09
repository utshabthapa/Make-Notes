import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./API";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Archive, ArrowLeft, Trash2, RotateCcw } from "lucide-react";

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

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

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
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          {error || "Note not found"}
        </div>
      </div>
    );
  }

  const isArchived = note.is_deleted;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate(isArchived ? "/archives" : "/notes")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to {isArchived ? "Archives" : "Notes"}</span>
            </button>

            <div className="flex space-x-3">
              {isArchived ? (
                <>
                  <button
                    onClick={handleRestore}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>Restore</span>
                  </button>

                  <button
                    onClick={handlePermanentDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={handleArchive}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Archive size={16} />
                    <span>Archive</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Show archived indicator if note is archived */}
          {isArchived ? (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Archive size={16} className="text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  This note is archived
                </span>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div
            className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
            style={{ backgroundColor: note.background_color || "#ffffff" }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {note.title}
              </h1>

              {note.categories && note.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-500 space-x-4">
                <span>
                  Created: {new Date(note.created_at).toLocaleDateString()}
                </span>
                <span>
                  Updated: {new Date(note.updated_at).toLocaleDateString()}
                </span>
                {isArchived && note.deleted_at && (
                  <span>
                    Archived: {new Date(note.deleted_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
