"use client";

import Image from "next/image";
import { Star } from "lucide-react";

interface CounselorCardProps {
  name: string;
  rating: number;
  fee: string;
  description: string;
  imageUrl?: string;
  onBook?: () => void;
  buttonText?: string;
  onViewDetails?: () => void;
}

export default function CounselorCard({
  name,
  rating,
  fee,
  description,
  imageUrl,
  onBook,
  buttonText = "Book a session",
  onViewDetails,
}: CounselorCardProps) {
  return (
    <div className="bg-white r overflow-hidden" onClick={onViewDetails}>
      <div className="relative h-56 bg-[#D1D5DB]">
        {imageUrl && (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-lg [font-family:'Poppins',Helvetica] font-bold">
              {fee}
            </span>
            <div className="flex items-center gap-1 bg-white/20 text-white text-xs px-3 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-[#FCD34D] text-[#FCD34D]" />
              <span className="[font-family:'Poppins',Helvetica] font-bold">
                {rating}
              </span>
            </div>
          </div>
          <h3 className="text-white [font-family:'Poppins',Helvetica] font-semibold text-lg">
            {name}
          </h3>
        </div>
      </div>
      <div className="p-5">
        <p className="[font-family:'Poppins',Helvetica] font-normal text-[#6B7280] text-sm tracking-[0] mb-4">
          {description}
        </p>
        <button
          onClick={onBook}
          className="w-full bg-[#071133] text-white py-3 rounded-lg [font-family:'Poppins',Helvetica] font-semibold text-sm tracking-[0]"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
