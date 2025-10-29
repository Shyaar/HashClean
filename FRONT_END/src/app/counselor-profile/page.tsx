"use client";

import { Header } from "../components/header";
import { BottomNavigation } from "../components/bottom-navigation";
import Image from "next/image";
import UiButton from "../components/ui/modals/uiButton";
import { useState } from "react";
import EditCounselorProfileModal from "../components/edit-counselor-profile-modal";
import { Counselor } from "../types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CounselorProfilePage() {
  const router = useRouter();
  function handleBack() {
    router.back();
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counselorData, setCounselorData] = useState<Counselor>({
    name: "Tewlve",
    description:
      "welcome to novana",
    specialization: "Counselor",
    licenseNumber: "123456",
    fee: "1.5 Eth",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (newData: Counselor) => {
    setCounselorData(newData);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header title="My Profile" />

      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex w-full justify-between my-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => handleBack()}
          >
            <ArrowLeft size={24} color="#071133" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex gap-4 mb-4">
            <Image
              src="/counselor-profile-photo.jpg"
              alt="Profile"
              width={120}
              height={120}
              className="rounded-xl"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                {counselorData.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {counselorData.description}
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">fee/hour:</p>
                <p className="font-semibold text-foreground">
                  {counselorData.fee}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Personal Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Specialization
              </label>
              <div className="mt-2 bg-white rounded-lg px-4 py-3 text-foreground">
                {counselorData.specialization}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                License Number
              </label>
              <div className="mt-2 bg-white rounded-lg px-4 py-3 text-foreground">
                {counselorData.licenseNumber}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Fee/hour
              </label>
              <div className="mt-2 bg-white rounded-lg px-4 py-3 text-foreground">
                {counselorData.fee}
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="w-full flex justify-center items-center">
          <UiButton text="Edit info" onClick={openModal} />
        </div>
      </div>

      <BottomNavigation />

      <EditCounselorProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        counselorData={counselorData}
        onSave={handleSave}
      />
    </div>
  );
}
