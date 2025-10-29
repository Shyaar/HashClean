"use client";
import { useState } from "react";
import { BottomNavigation } from "../components/bottom-navigation";
import CounselorCard from "../components/cards/counselor-card";
import { Header } from "../components/header";
import UiButton from "../components/ui/modals/uiButton";
import { useRouter } from "next/navigation";
import CounselorBookingModal from "../components/ui/modals/bookingModal";
import { ArrowLeft } from "lucide-react";
import { useReadAllCounselors } from "@/hooks/useCounselorHooks";

export default function FindCounselorsPage() {

  const { counselors, isLoading, isError, refetch } =useReadAllCounselors();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<{
    name: string;
    fee: string;
  } | null>(null);

  const router = useRouter();

  const handleViewDetails = (id: number) => {
  router.push(`/counselor-description/${id}`);
  console.log(counselors)
};

   function handleBack(){
    router.back()
  }

  function handleRoute() {
    router.push("/register-counselor");
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCounselor(null);
  };

  const handleBook = (name: string, fee: string) => {
    setSelectedCounselor({ name, fee });
    setIsModalOpen(true);
  };


  return (
    <>
      <Header title="Find a counselor" />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex w-full justify-between my-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => handleBack()}
              >
                <ArrowLeft size={24} color="#071133" />
              </button>
              <UiButton
                text="Become a counselor"
                onClick={() => handleRoute()}
              />
            </div>
          </div>
        </div>

        {/* Counselor List */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counselors.map((counselor) => (
              <CounselorCard
                key={counselor.id}
                name={counselor.name}
                rating= {4}
                description={"counselor"}
                fee={"4.5Eth"}
                onBook={() => handleBook(counselor.name, "4.5")}
                onViewDetails={() => handleViewDetails(counselor.id)}
              />
            ))}
          </div>
        </div>

        <BottomNavigation />
      </div>

      {/* Booking Modal */}
      {selectedCounselor && (
        <CounselorBookingModal
          isOpen={isModalOpen}
          counselorName={selectedCounselor.name}
          fee={selectedCounselor.fee}
          date="Wednesday, 25th October 2025"
          time="3:00 PM"
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
