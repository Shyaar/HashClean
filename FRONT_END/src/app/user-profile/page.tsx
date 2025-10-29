"use client";

import { Header } from "../components/header";
import { BottomNavigation } from "../components/bottom-navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const router = useRouter();
  function handleBack() {
    router.back();
  }

  const userData = {
    name: "Jane Doe",
    image: "/user-profile-photo.jpg",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header title="My Profile" />

      <div className="sticky top-0 z-40 bg-background border-b border-border">
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
      </div>

      <div className="px-4 py-6 flex flex-col items-center">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-md flex flex-col items-center text-center">
          <Image
            src={userData.image}
            alt="User Profile"
            width={120}
            height={120}
            className="rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold text-foreground">
            {userData.name}
          </h2>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
