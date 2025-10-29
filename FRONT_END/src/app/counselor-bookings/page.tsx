"use client"

import { useState } from "react"
import { Header } from "../components/header"
import { BottomNavigation } from "../components/bottom-navigation"
import BookingCard from "../components/cards/booking-card"


type TabType = "active" | "completed" | "cancelled"

export default function CounselorBookingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("active")

  const bookings = [
    { id: 1, name: "calm onion", date: "28-11-2025", days: "2:23" },
    { id: 2, name: "calm onion", date: "28-11-2025", days: "2:23" },
    { id: 3, name: "calm onion", date: "28-11-2025", days: "2:23" },
    { id: 4, name: "calm onion", date: "28-11-2025", days: "2:23" },
    { id: 5, name: "calm onion", date: "28-11-2025", days: "2:23" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header title="My bookings" />

      <div className="px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-border mb-6 overflow-x-auto">
          {(["active", "completed", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-2 text-sm font-medium transition-colors capitalize whitespace-nowrap",
                activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
              )}
            >
              {tab === "active" ? "Active Bookings" : tab === "completed" ? "Completed sessions" : "Cancelled sessions"}
            </button>
          ))}
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              name={booking.name}
              date={booking.date}
              days={booking.days}
              onClick={() => console.log(`Clicked booking: ${booking.name}`)}
            />
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
