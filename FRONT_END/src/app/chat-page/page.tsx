"use client";

import { ArrowLeft, Send, Mic } from "lucide-react";
import { useState } from "react";
import { BottomNavigation } from "../components/bottom-navigation";
import Image from "next/image";
import useRoomStore from "@/store/useRoomStore";
import { useRouter } from "next/navigation"
import UiButton from "../components/ui/modals/uiButton";

export default function ChatPage() {
  const router = useRouter()
  const { room, members } = useRoomStore();
  const [message, setMessage] = useState("");
  
  function handleBack(){
    router.back()
  }

  function handleVote(){
    router.push("/vote-to-remove")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#E8F0F7] pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={()=>handleBack()}>
            <ArrowLeft size={24} color="#071133" />
          </button>
          <Image src="/onboard.png" alt="user Avatar" width={40} height={40} />
          <div>
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: "'Poppins', Helvetica", color: "#071133" }}
            >
              {room}
            </h2>
            <p
              className="text-xs"
              style={{ fontFamily: "'Poppins', Helvetica", color: "#4CAF50" }}
            >
              ● online: {members}
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
          <UiButton 
            text="vote to remove user"
            onClick={()=>handleVote()}
          />
        </div>
        <div className="sm:hidden">
          <UiButton 
            text="Vote"
            onClick={()=>handleVote()}
            fullWidth
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 md:mx-24 sm:mx-4 mx-2 ">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 ">
          {/* Empty chat area - messages would go here */}
        </div>

        {/* Message Input */}
        <div className="px-2 py-2 bg-white border-t rounded-full border-[#E0E0E0]">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Send Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full bg-[#F5F5F5] text-sm outline-none"
              style={{ fontFamily: "'Poppins', Helvetica", color: "#071133" }}
            />
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Send size={20} color="#999999" />
            </button>
            {/* <button
              className="p-3 rounded-full text-white"
              style={{ backgroundColor: "#071133" }}
            >
              <Mic size={20} />
            </button> */}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
