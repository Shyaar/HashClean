"use client";

import { Header } from "../components/header";
import { BottomNavigation } from "../components/bottom-navigation";
import RoomCard from "../components/cards/room-card";
import { useReadMyRooms, useJoinRoom } from "../../hooks/usePlatformHook";
import { useEffect, useState } from "react";
import LoadingModal from "../components/ui/modals/LoadingModal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UserRoomsPage() {
  const router = useRouter();
  const { rooms, isLoading, isError, refetch } = useReadMyRooms();
  const { joinRoom, isPending, isConfirming, isConfirmed, error: joinError } = useJoinRoom();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (isLoading) {
      setShowModal(true);
      setModalMessage("Getting your rooms");
    } else if (isConfirming) {
      setModalMessage("Your Rooms are ready");
    } else if (rooms) {
      setShowModal(false);
      toast.info("rooms are ready");
      console.log("rooms :", rooms)
      
    } else if (isError) {
      setShowModal(false);
      toast.error("Failed to join room.");
    }
  }, [isLoading, isConfirming, rooms, isError, isConfirmed, joinError]);


  const handleJoinRoom = async (roomId: number) => {
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header title="My rooms" />

      <div className="px-4 py-6">
        {/* Room List */}
        {rooms.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 mt-8">
            You have not joined any rooms.
          </p>
        )}
        <div className="space-y-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              title={room.topic}
              members={room.memberCount}
              onClick={() => handleJoinRoom(room.id)}
            />
          ))}
        </div>
      </div>

      <BottomNavigation />

      <LoadingModal show={showModal} message={modalMessage} />
    </div>
  );
}
