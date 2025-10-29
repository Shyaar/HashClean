"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/header";
import { BottomNavigation } from "../components/bottom-navigation";
import UiButton from "../components/ui/modals/uiButton";
import { ArrowLeft } from "lucide-react";
import { useAccount } from "wagmi";
import { useCreateRoom } from "../../hooks/usePlatformHook"
import { toast } from "react-toastify";

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const { address, isConnected } = useAccount();
  const { createRoom, isPending, isConfirming, isConfirmed } = useCreateRoom();

  function handleBack() {
    router.back();
  }

  async function handleCreateRoom() {
    if(!isConnected){
      toast.error("Connect Wallet")
    }
    if (!roomName) return alert("Room name is required");

    try {
      const tx = await createRoom(roomName, isPrivate);
      console.log("Transaction sent:", tx);

      router.push("/discover");
    } catch (err) {
      console.error("Error creating room:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header title="Create a Room" />
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex w-full justify-between my-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={handleBack}
            >
              <ArrowLeft size={24} color="#071133" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="roomName"
              className="block text-sm font-medium text-gray-700"
            >
              Room Name
            </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="isPrivate"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              Private Room
            </label>
          </div>
          <UiButton text="Create Room" onClick={handleCreateRoom} />
          {isPending && <p>Creating room...</p>}
          {isConfirming && <p>Waiting for confirmation...</p>}
          {isConfirmed && <p>Room created successfully!</p>}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
