"use client"

import type React from "react"

import { useRef } from "react"

interface ImageUploadProps {
  onUpload: (file: File) => void
  children: React.ReactNode
  accept?: string
}

export function ImageUpload({ onUpload, children, accept = "image/*" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }
    // Reset the input
    event.target.value = ""
  }

  return (
    <>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    </>
  )
}
