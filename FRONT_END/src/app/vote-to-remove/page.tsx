"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/header";
import { BottomNavigation } from "../components/bottom-navigation";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import VoteConfirmationModal from "../components/ui/modals/vote-confirmation-modal";
import UiButton from "../components/ui/modals/uiButton";

export default function VoteToRemovePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([0]);
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const counselors = [
    { id: 1, name: "calm onions" },
    { id: 2, name: "calm onions" },
    { id: 3, name: "calm onions" },
    { id: 4, name: "calm onions" },
    { id: 5, name: "calm onions" },
    { id: 6, name: "calm onions" },
    { id: 7, name: "calm onions" },
    { id: 8, name: "calm onions" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header
        showSearch={false}
        showMenu={false}
        title="Select user to Remove from this room"
      />
      <div className="mx-24">
        <div className="flex w-full justify-end my-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => handleBack()}
          >
            <div className="flex">
              <ArrowLeft size={24} color="#071133" />
              <p>Back</p>
            </div>
          </button>
        </div>

        <div className="px-4 py-6">
          {/* Search Bar */}
          <div className="mb-6 flex items-center gap-2 bg-white rounded-full px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none"
            />
          </div>

          {/* Counselor List */}
          <div className="space-y-3">
            {counselors.map((counselor, index) => (
              <div
                key={counselor.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/counselor-avatar.jpg"
                    alt={counselor.name}
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-yellow-300"
                  />
                  <span className="font-medium text-foreground">
                    {counselor.name}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setSelected((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index]
                    )
                  }
                  className={cn(
                    "h-6 w-6 rounded border-2 transition-colors",
                    selected.includes(index)
                      ? "bg-primary border-primary"
                      : "border-border bg-white"
                  )}
                />
              </div>
            ))}
          </div>

          {/* Vote Button */}
          <div className="mt-8 w-full flex items-center justify-center">
            <UiButton text="Vote" onClick={handleOpenModal} />
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* Modal */}
      <VoteConfirmationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
