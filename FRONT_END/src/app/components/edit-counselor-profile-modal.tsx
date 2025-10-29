"use client"

import React, { useState, useEffect } from "react"
import UiButton from "./ui/modals/uiButton"
import { Counselor } from "../types"

interface EditCounselorProfileModalProps {
  isOpen: boolean
  onClose: () => void
  counselorData: Counselor
  onSave: (newData: Counselor) => void
}

export default function EditCounselorProfileModal({ isOpen, onClose, counselorData, onSave }: EditCounselorProfileModalProps) {
  const [formData, setFormData] = useState(counselorData)

  useEffect(() => {
    setFormData(counselorData)
  }, [counselorData])

  if (!isOpen) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white  p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-4">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              name="name"
              className="mt-2 bg-gray-100  px-4 py-3 text-foreground w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Specialization</label>
            <input
              type="text"
              name="specialization"
              className="mt-2 bg-gray-100  px-4 py-3 text-foreground w-full"
              value={formData.specialization}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              className="mt-2 bg-gray-100  px-4 py-3 text-foreground w-full"
              value={formData.licenseNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Fee/hour</label>
            <input
              type="text"
              name="fee"
              className="mt-2 bg-gray-100  px-4 py-3 text-foreground w-full"
              value={formData.fee}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <UiButton text="Cancel" onClick={onClose} />
          <UiButton text="Save" onClick={handleSave} />
        </div>
      </div>
    </div>
  )
}
