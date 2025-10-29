import React from "react";

interface LoadingModalProps {
  show: boolean;
  message: string;
}

export default function LoadingModal({ show, message }: LoadingModalProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6  shadow-lg text-center w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Please Wait</h2>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="mt-4">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
}
