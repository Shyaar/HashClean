"use client";

import React from "react";
import UiButton from "./uiButton";

interface CounselorBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  counselorName: string;
  fee: string;
  date: string;
  time: string;
}

const CounselorBookingModal: React.FC<CounselorBookingModalProps> = ({
  isOpen,
  onClose,
  counselorName,
  date,
  time,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6  shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-[#071133]">
          Booking Confirmed
        </h2>

        <div className="mb-4 text-gray-700 space-y-2">
          <p>
            Counselor:{" "}
            <span className="font-semibold text-[#071133]">
              {counselorName}
            </span>
          </p>
          <p>
            Date: <span className="font-semibold text-[#071133]">{date}</span>
          </p>
          <p>
            Time: <span className="font-semibold text-[#071133]">{time}</span>
          </p>
        </div>

        <UiButton text="close" />
      </div>
    </div>
  );
};

export default CounselorBookingModal;
