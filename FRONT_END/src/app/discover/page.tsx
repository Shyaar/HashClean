"use client";

import { Header } from "../components/header";
import { BottomNavigation } from "../components/bottom-navigation";
import DiscoverRoomCard from "../components/cards/discover-room-card";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useRoomStore from "../../store/useRoomStore";
import UiButton from "../components/ui/modals/uiButton";
import { ArrowLeft } from "lucide-react";
import { useReadRooms, useJoinRoom } from "../../hooks/usePlatformHook";
import { useEffect, useState } from "react"; // Import useEffect and useState
import LoadingModal from "../components/ui/modals/LoadingModal";

export default function DiscoverPage() {
  const router = useRouter();
  const { setRoom } = useRoomStore();
  const { rooms, isLoading, isError, refetch } = useReadRooms();
  const {
    joinRoom,
    isPending,
    isConfirming,
    isConfirmed,
    error: joinError,
  } = useJoinRoom(); // Destructure more states

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  function handleBack() {
    router.back();
  }

  function handleCreate() {
    router.push("/create-room");
  }

  useEffect(() => {
    if (isPending) {
      setShowModal(true);
      setModalMessage("Almost ready");
    } else if (isConfirming) {
      setModalMessage("Your journey to connection begins now");
    } else if (isConfirmed) {
      setShowModal(false);
      toast.success("Successfully joined room!");
      // Optionally navigate to the room page or update UI
    } else if (joinError) {
      setShowModal(false);
      toast.error("Failed to join room.");
    }
  }, [isPending, isConfirming, isConfirmed, joinError]);

  async function handleJoin(
    roomTopic: string,
    roomMembers: number,
    roomId: number
  ) {
    try {
      await joinRoom(roomId);
      setRoom(roomTopic, roomMembers);
      router.push("/chat-page");
      toast.success(`Now entering ${roomTopic}`);
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-gray-500">Loading rooms...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col justify-center items-center">
        <p className="text-red-500">Failed to load rooms.</p>
        <UiButton text="Retry" onClick={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header title="Discover rooms" />
      <div className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex w-full justify-between my-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={handleBack}
            >
              <ArrowLeft size={24} color="#071133" />
            </button>
            <UiButton text="Create room" onClick={handleCreate} />
          </div>
        </div>
      </div>
      <div className="px-4 py-4 grid gap-4">
        {rooms.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No rooms available yet. Be the first to create one!
          </p>
        ) : (
          rooms.map((room) => (
            <DiscoverRoomCard
              key={room.id}
              title={room.topic}
              description={
                room.isPrivate ? "Private conversation" : "Public discussion"
              }
              members={`${room.memberCount} members`}
              onJoin={() => handleJoin(room.topic, room.memberCount, room.id)}
            />
          ))
        )}
      </div>
      <BottomNavigation />
      <LoadingModal show={showModal} message={modalMessage} />{" "}
      {/* Render the modal */}
    </div>
  );
}
