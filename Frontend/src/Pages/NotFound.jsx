import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="text-6xl sm:text-8xl font-bold text-gray-300 mb-4">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/notes")}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium"
        >
          <BsArrowLeft size={18} />
          Back to Notes
        </button>
      </div>
    </div>
  );
}
