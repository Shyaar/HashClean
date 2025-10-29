"use client";

import Image from "next/image";
import React from "react";
import UiButton from "../components/ui/modals/uiButton";
import useUserStore from "@/store/userUserStore";
import { useRouter } from "next/navigation";

export default function RegisteredScreen() {
  const router = useRouter();
  const { name, avatar } = useUserStore();
  const handleClick = () => {
    router.push("/discover");
  };

  return (
    <main className="bg-white w-full min-h-screen relative flex flex-col items-center justify-center px-8">
      <div className="flex flex-col items-center w-full max-w-md">
        <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#071133] text-xl tracking-[0] leading-normal mb-12">
          Welcome to Novana
        </h1>

        <div className="relative mb-8">
          {/* <div className="w-[240px] h-[240px] rounded-full bg-[#C4B5FD] border-[3px] border-[#071133] flex items-center justify-center shadow-[0px_8px_16px_rgba(7,17,51,0.15)]">
            <div className="text-6xl">👨‍🦰</div>
          </div> */}

          <div className="rounded-full border-2 border-green-400 overflow-hidden">
            <img
              src={avatar}
              alt={name}
              width={200}
              height={200}
            />
            {/* <img src={avatar} alt="user Avatar" width={250} height={250} /> */}
          </div>
        </div>

        <div className="flex flex-col items-center text-center mb-16">
          <p className="[font-family:'Poppins',Helvetica] font-normal text-[#D1D5DB] text-lg tracking-[0] leading-normal mb-2">
            Your novana name is:
          </p>
          <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-[#071133] text-[32px] tracking-[0] leading-normal">
            {name}
          </h2>
        </div>

        <div className="border mb-20 border-3">
          <UiButton
            text="Continue to Novana"
            onClick={() => handleClick()}
            loading={false}
          />
        </div>

        <div className="flex flex-col items-center">
          <p className="[font-family:'Poppins',Helvetica] font-semibold text-[#D1D5DB] text-xl tracking-[0] leading-normal">
            Talk. Heal. Grow.
          </p>
        </div>
      </div>
    </main>
  );
}
