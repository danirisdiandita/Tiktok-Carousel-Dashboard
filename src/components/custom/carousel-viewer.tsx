"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { CarouselImage } from "@/stores/carousel-store"

interface CarouselViewerProps {
  isOpen: boolean
  onClose: () => void
  images: CarouselImage[]
  initialIndex?: number
}

export function CarouselViewer({ isOpen, onClose, images, initialIndex = 0 }: CarouselViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  
  // Reset the current index when images change or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, images])

  if (!images.length) {
    return null
  }

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const currentImage = images[currentIndex]
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0 bg-black/90 text-white border-none">
        <div className="relative w-full h-full flex flex-col">
          {/* Close button */}
          {/* <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-50 text-white hover:bg-white/20" 
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button> */}

          {/* Main image display */}
          <div className="flex-1 flex items-center justify-center py-12 px-4 relative">
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-10 w-10" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-10 w-10" />
                </Button>
              </>
            )}

            {/* Current image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative max-h-[70vh] max-w-full">
                <Image 
                  src={currentImage.url || "/placeholder.svg"}
                  alt={currentImage.alt || `Image ${currentIndex + 1}`}
                  width={800}
                  height={800}
                  className="object-contain max-h-[70vh] max-w-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <div className="p-4 bg-black/50">
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <button
                    key={`thumbnail-${image.id || index}`}
                    className={`relative w-16 h-16 overflow-hidden rounded-md transition-all ${currentIndex === index ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || `Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="text-center text-sm text-white/70 mt-2">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
