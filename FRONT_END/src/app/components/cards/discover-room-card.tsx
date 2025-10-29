"use client"

interface DiscoverRoomCardProps {
  title: string
  description: string
  members: string
  onJoin?: () => void
}

export default function DiscoverRoomCard({ title, description, members, onJoin }: DiscoverRoomCardProps) {
  return (
    <div className="bg-white border-2 border-[#071133]  p-5">
      <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-[#071133] text-lg tracking-[0] mb-2">
        {title}
      </h3>
      <p className="[font-family:'Poppins',Helvetica] font-normal text-[#6B7280] text-sm tracking-[0] mb-4">
        {description}
      </p>
      <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
        <span className="[font-family:'Poppins',Helvetica] font-normal text-[#6B7280] text-sm tracking-[0]">
          members: {members}
        </span>
        <button
          onClick={onJoin}
          className="bg-[#071133] text-white px-6 py-2 rounded-lg [font-family:'Poppins',Helvetica] font-semibold text-sm tracking-[0]"
        >
          Join
        </button>
      </div>
    </div>
  )
}
