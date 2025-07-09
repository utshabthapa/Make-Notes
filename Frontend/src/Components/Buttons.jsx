import React from "react";
import {
  FiTrash2,
  FiArchive,
  FiSave,
  FiEdit,
  FiPlus,
  FiX,
  FiCheck,
} from "react-icons/fi";

const BaseButton = ({
  children,
  variant = "primary",
  size = "medium",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    outline:
      "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500",
  };

  const sizes = {
    small: "py-1 px-3 text-sm",
    medium: "py-2 px-4 text-sm",
    large: "py-3 px-6 text-base",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="mr-2" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="ml-2" />}
        </>
      )}
    </button>
  );
};

export const DeleteButton = ({ children = "Delete", ...props }) => (
  <BaseButton variant="danger" icon={FiTrash2} {...props}>
    {children}
  </BaseButton>
);

export const ArchiveButton = ({ children = "Archive", ...props }) => (
  <BaseButton variant="secondary" icon={FiArchive} {...props}>
    {children}
  </BaseButton>
);

export const SaveButton = ({ children = "Save", ...props }) => (
  <BaseButton variant="success" icon={FiSave} {...props}>
    {children}
  </BaseButton>
);

export const EditButton = ({ children = "Edit", ...props }) => (
  <BaseButton variant="outline" icon={FiEdit} {...props}>
    {children}
  </BaseButton>
);

export const AddButton = ({ children = "Add New", ...props }) => (
  <BaseButton variant="primary" icon={FiPlus} {...props}>
    {children}
  </BaseButton>
);

export const CancelButton = ({ children = "Cancel", ...props }) => (
  <BaseButton variant="outline" icon={FiX} {...props}>
    {children}
  </BaseButton>
);

export const ConfirmButton = ({ children = "Confirm", ...props }) => (
  <BaseButton variant="success" icon={FiCheck} {...props}>
    {children}
  </BaseButton>
);

export const IconButton = ({ icon, ...props }) => (
  <BaseButton variant="ghost" size="small" icon={icon} {...props} />
);

export default BaseButton;
