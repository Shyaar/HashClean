"use client"
import { ChevronRight } from "lucide-react"

interface RoomCardProps {
  title: string
  members: number
  onClick?: () => void
}

export default function RoomCard({ title, members, onClick }: RoomCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white  p-5 flex items-center justify-between cursor-pointer w-full"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-20 h-20 bg-[#071133] rounded-2xl flex-shrink-0" />
        <div className="flex-1">
          <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-[#071133] text-lg tracking-[0]">
            {title}
          </h3>
          <p className="[font-family:'Poppins',Helvetica] font-normal text-[#071133] text-sm tracking-[0]">
            {members} people
          </p>
        </div>
      </div>
      <ChevronRight className="w-6 h-6 text-[#071133] flex-shrink-0" />
    </div>
  )
}
