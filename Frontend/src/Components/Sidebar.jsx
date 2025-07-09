"use client";

import { useNavigate } from "react-router-dom";
import { Plus, Archive, Tag, LogOut, Bookmark } from "lucide-react";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Make Notes</h1>
      </div>

      <nav className="space-y-4">
        <button
          onClick={() => navigate("/notes")}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span>📝</span>
          <span>All Notes</span>
        </button>

        <button
          onClick={() => navigate("/create-note")}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add New Note</span>
        </button>

        <button
          onClick={() => navigate("/bookmarks")}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bookmark size={20} />
          <span>Bookmarks</span>
        </button>

        <button
          onClick={() => navigate("/categories")}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Tag size={20} />
          <span>Categories</span>
        </button>

        <button
          onClick={() => navigate("/archives")}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Archive size={20} />
          <span>Archives</span>
        </button>
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
