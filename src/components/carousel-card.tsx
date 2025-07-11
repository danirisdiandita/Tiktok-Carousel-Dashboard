"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Edit, Trash2, Plus, X, Eye, Copy, Check, Upload } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { CarouselImage, Carousel } from "@/stores/carousel-store"
import { getHumanReadableDate } from "@/lib/time_util"
import { useUpload } from "@/hooks/use-upload"
import { useCarousel } from "@/hooks/useCarousel"
import { CarouselViewer } from "./custom/carousel-viewer"
import { toast } from "sonner"

interface CarouselCardProps {
  carousel: Carousel
  onUpdate: (updatedCarousel: Partial<Carousel>) => void
  onDelete: () => void
  layout?: 'grid' | 'horizontal'
}

export function CarouselCard({ carousel, onUpdate, onDelete, layout = 'grid' }: CarouselCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(carousel.title)
  const [editedDescription, setEditedDescription] = useState(carousel.description)
  const [editedImages, setEditedImages] = useState(carousel.images)
  const [copyingState, setCopyingState] = useState<{type: string, copying: boolean}>({type: '', copying: false})
  const uploader = useUpload()
  const carouselOperations = useCarousel()
  const handleSave = async () => {
    // editedImages shown below
    //   [
    //     {
    //         "id": 948633253966,
    //         "url": "blob:http://localhost:3000/f7de81ee-ac46-486a-b64a-2d9efa81c4d9",
    //         "alt": "1751963031888-293258328.jpg",
    //         "createdAt": "2025-07-09T10:14:39.620Z",
    //         "updatedAt": "2025-07-09T10:14:39.620Z", 
    //         "file": "<this is file object>"
    //     },
    //     {
    //         "id": 75819553400,
    //         "url": "blob:http://localhost:3000/00c60cc8-0cae-4906-b43e-e5c17de86411",
    //         "alt": "1689241795050.jpg",
    //         "createdAt": "2025-07-09T10:14:44.215Z",
    //         "updatedAt": "2025-07-09T10:14:44.215Z",
    //         "file": "<this is file object>"
    //     }
    // ]

    // console.log('editedImages', editedImages.length)

    for (let i = 0; i < editedImages.length; i++) {
      if (editedImages[i].file) {
        const uploadedImage = await uploader.uploadImage(editedImages[i].file!, carousel.id)
        editedImages[i].url = uploadedImage.url
        editedImages[i].id = uploadedImage.id
      }
      editedImages[i].carouselOrder = i
    }

    console.log('editedImages', editedImages)
    // carouselOperations.reorderImages(imageReorder)
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

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyingState({type, copying: true})
      toast(`Copied to clipboard`)
      setTimeout(() => setCopyingState({type: '', copying: false}), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error(`Failed to copy. Please try again.`)
    }
  }

  const handleImageUpload = (file: File) => {
    // In a real app, you'd upload to a server
    const newImage: CarouselImage = {
      // id: Math.floor(Date.now() * Math.random()),
      url: URL.createObjectURL(file),
      alt: file.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      file: file
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
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(carousel.title, 'title')
                    }}
                    className="mr-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm p-1 transition-all"
                    aria-label="Copy title"
                  >
                    {copyingState.type === 'title' && copyingState.copying ? 
                      <Check className="h-3 w-3" /> : 
                      <Copy className="h-3 w-3" />}
                  </button>
                  <CardTitle className="line-clamp-2">{carousel.title}</CardTitle>
                </div>
                <div className="flex items-start gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(carousel.description, 'description')
                    }}
                    className="mr-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm p-1 transition-all flex-shrink-0 mt-0.5"
                    aria-label="Copy description"
                  >
                    {copyingState.type === 'description' && copyingState.copying ? 
                      <Check className="h-3 w-3" /> : 
                      <Copy className="h-3 w-3" />}
                  </button>
                  <p className="text-sm text-muted-foreground line-clamp-2">{carousel.description}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsViewing(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>
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
              <div className="relative w-full h-full cursor-pointer" onClick={() => setIsViewing(true)}>
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
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(carousel.title, 'title')
                      }}
                      className="mr-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm p-1 transition-all"
                      aria-label="Copy title"
                    >
                      {copyingState.type === 'title' && copyingState.copying ? 
                        <Check className="h-3 w-3" /> : 
                        <Copy className="h-3 w-3" />}
                    </button>
                    <CardTitle className="text-sm font-medium line-clamp-1">{carousel.title}</CardTitle>
                  </div>
                  <div className="flex items-start gap-1 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(carousel.description, 'description')
                      }}
                      className="mr-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm p-1 transition-all flex-shrink-0"
                      aria-label="Copy description"
                    >
                      {copyingState.type === 'description' && copyingState.copying ? 
                        <Check className="h-3 w-3" /> : 
                        <Copy className="h-3 w-3" />}
                    </button>
                    <p className="text-xs text-muted-foreground line-clamp-2">{carousel.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsViewing(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsPublishing(true)} disabled={carousel.status === "published"}>
                      <Upload className="h-4 w-4 mr-2" />
                      Publish
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
      <CarouselViewer
        isOpen={isViewing}
        onClose={() => setIsViewing(false)}
        images={carousel.images}
        initialIndex={0}
      />
      
      <Dialog open={isPublishing} onOpenChange={setIsPublishing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Carousel</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this carousel? This action will make the carousel publicly available.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPublishing(false)}>Cancel</Button>
            <Button onClick={() => {
              carouselOperations.updateStatusToPublished(carousel.id);
              setIsPublishing(false);
              toast.success("Carousel published successfully");
            }}>Yes, Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
