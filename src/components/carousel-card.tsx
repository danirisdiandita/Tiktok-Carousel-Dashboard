"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Edit, Trash2, Plus, X } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { CarouselImage, Carousel } from "@/stores/carousel-store"
import { getHumanReadableDate } from "@/lib/time_util"

interface CarouselCardProps {
  carousel: Carousel
  onUpdate: (updatedCarousel: Partial<Carousel>) => void
  onDelete: () => void
  layout?: 'grid' | 'horizontal'
}

export function CarouselCard({ carousel, onUpdate, onDelete, layout = 'grid' }: CarouselCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(carousel.title)
  const [editedDescription, setEditedDescription] = useState(carousel.description)
  const [editedImages, setEditedImages] = useState(carousel.images)

  console.log('carousel_', carousel)

  const handleSave = () => {
    //   [
    //     {
    //         "id": 948633253966,
    //         "url": "blob:http://localhost:3000/f7de81ee-ac46-486a-b64a-2d9efa81c4d9",
    //         "alt": "1751963031888-293258328.jpg",
    //         "createdAt": "2025-07-09T10:14:39.620Z",
    //         "updatedAt": "2025-07-09T10:14:39.620Z"
    //     },
    //     {
    //         "id": 75819553400,
    //         "url": "blob:http://localhost:3000/00c60cc8-0cae-4906-b43e-e5c17de86411",
    //         "alt": "1689241795050.jpg",
    //         "createdAt": "2025-07-09T10:14:44.215Z",
    //         "updatedAt": "2025-07-09T10:14:44.215Z"
    //     }
    // ]

    console.log('editedImages', editedImages)
    onUpdate({
      title: editedTitle,
      description: editedDescription,
      images: editedImages,
    })
    setIsEditing(false)
  }

  const handleAddImage = (newImage: CarouselImage) => {
    setEditedImages([...editedImages, newImage])
  }

  const handleInsertImage = (index: number, newImage: CarouselImage) => {
    const newImages = [...editedImages]
    newImages.splice(index + 1, 0, newImage)
    setEditedImages(newImages)
  }

  const handleRemoveImage = (imageId: number) => {
    setEditedImages(editedImages.filter((img) => img.id !== imageId))
  }

  const handleImageUpload = (file: File) => {
    // In a real app, you'd upload to a server
    const newImage: CarouselImage = {
      id: Math.floor(Date.now() * Math.random()),
      url: URL.createObjectURL(file),
      alt: file.name,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return newImage
  }

  return (
    <Card className={`group hover:shadow-md transition-shadow ${layout === 'horizontal' ? 'overflow-hidden' : ''}`}>
      {layout === 'grid' ? (
        // Original Grid Layout
        <>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-sm font-medium line-clamp-1">{carousel.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{carousel.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="grid grid-cols-3 gap-1 mb-2">
              {carousel.images.slice(0, 6).map((image, index) => (
                <div key={`image-${image.id}`} className="aspect-square relative overflow-hidden rounded">
                  <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                  {index === 5 && carousel.images.length > 6 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">+{carousel.images.length - 6}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{carousel.images.length} images</span>
              <Badge variant={carousel.status === "published" ? "default" : "secondary"}>{carousel.status}</Badge>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <p className="text-xs text-muted-foreground">{getHumanReadableDate(carousel.createdAt)}</p>
          </CardFooter>
        </>
      ) : (
        // Horizontal Layout
        <div className="flex">
          {/* Left side - Images preview */}
          <div className="w-48 h-40 relative border-r">
            {carousel.images.length > 0 ? (
              <div className="relative w-full h-full">
                <Image
                  src={carousel.images[0].url || "/placeholder.svg"}
                  alt={carousel.images[0].alt}
                  fill
                  className="object-cover"
                />
                {carousel.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    +{carousel.images.length - 1}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-xs text-muted-foreground">No images</span>
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="flex-1 flex flex-col">
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium line-clamp-1">{carousel.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{carousel.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pb-1 pt-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{carousel.images.length} images</span>
                <Badge variant={carousel.status === "published" ? "default" : "secondary"}>
                  {carousel.status}
                </Badge>
              </div>
            </CardContent>

            <CardFooter className="pt-1 mt-auto">
              <p className="text-xs text-muted-foreground">{getHumanReadableDate(new Date(carousel.createdAt))}</p>
            </CardFooter>
          </div>
        </div>
      )}

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Carousel</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Carousel title"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Carousel description"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Images ({editedImages.length})</label>
                <ImageUpload onUpload={(file) => handleAddImage(handleImageUpload(file))}>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </ImageUpload>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {editedImages.map((image, index) => (
                  <div key={`edit-image-${image.id}`} className="relative group">
                    <div className="aspect-square relative overflow-hidden rounded-lg border">
                      <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <ImageUpload onUpload={(file) => handleInsertImage(index, handleImageUpload(file))}>
                            <Button size="sm" variant="secondary">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </ImageUpload>
                          <Button size="sm" variant="destructive" onClick={() => handleRemoveImage(image.id as number)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1 rounded">{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
