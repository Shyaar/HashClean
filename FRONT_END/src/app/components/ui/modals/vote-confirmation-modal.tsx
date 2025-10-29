"use client";

import { useState } from "react";
import UiButton from "./uiButton";

interface VoteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoteConfirmationModal: React.FC<VoteConfirmationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Hardcoded data
  const votedFor = "Counselor A";
  const numberOfVotes = 15;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6  shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Vote Confirmation</h2>
        <p className="mb-2">
          You voted for: <span className="font-semibold">{votedFor}</span>
        </p>
        <p className="mb-4">
          Total votes for this counselor:{" "}
          <span className="font-semibold">{numberOfVotes}</span>
        </p>
        <UiButton text="close" />
      </div>
    </div>
  );
};

export default VoteConfirmationModal;
