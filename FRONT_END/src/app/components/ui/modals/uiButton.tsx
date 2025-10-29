'use client'

import React from "react";

interface UiButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean; 
}

const UiButton: React.FC<UiButtonProps> = ({ text, onClick, disabled, loading, type = "button", fullWidth }) => {
  return (
    <button
      type={type} 
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-fit inline-flex justify-center py-2 px-4 border border-white shadow-sm text-sm font-medium text-white bg-[#071133] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${fullWidth ? "w-full" : ""}`}>
      {loading ? "Loading..." : text}
    </button>
  );
};

export default UiButton;
