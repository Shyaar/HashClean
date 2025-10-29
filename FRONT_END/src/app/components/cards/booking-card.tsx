"use client"

import Image from "next/image"

interface BookingCardProps {
  name: string
  date: string
  days: string
  avatarUrl?: string
  onClick?: () => void
}

export default function BookingCard({ name, date, days, avatarUrl, onClick }: BookingCardProps) {
  return (
    <div onClick={onClick} className="bg-white p-5 flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 rounded-full border-3 border-[#FCD34D] bg-[#D1D5DB] flex-shrink-0 overflow-hidden">
          {avatarUrl && (
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-[#071133] text-base tracking-[0]">
            {name}
          </h3>
          <p className="[font-family:'Poppins',Helvetica] font-normal text-[#9CA3AF] text-sm tracking-[0]">
            booked for: {date}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="[font-family:'Poppins',Helvetica] font-semibold text-[#071133] text-2xl tracking-[0]">{days}</p>
        <p className="[font-family:'Poppins',Helvetica] font-normal text-[#D1D5DB] text-xs tracking-[0]">days</p>
      </div>
    </div>
  )
}
