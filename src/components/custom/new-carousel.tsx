import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCarouselStore } from "@/stores/carousel-store"
import { useCarousel } from "@/hooks/useCarousel"
import { useProductCategoryStore } from "@/stores/product-category"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ImageUpload } from "@/components/image-upload"
import { CarouselImage } from "@/stores/carousel-store"
import { useUpload } from "@/hooks/use-upload"
import { Plus, X } from "lucide-react"
import Image from "next/image"

export function NewCarouselDialog() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [productCategoryId, setProductCategoryId] = useState<number | undefined>(undefined)
    const [images, setImages] = useState<CarouselImage[]>([])
    const carouselStore = useCarouselStore();
    const carouselOperations = useCarousel();
    const uploader = useUpload();
    
    const handleSubmit = async () => {
        // Upload images if needed
        const processedImages = [...images];
        for (let i = 0; i < processedImages.length; i++) {
            if (processedImages[i].file) {
                const uploadedImage = await uploader.uploadImageOnlyUrl(processedImages[i].file!)
                processedImages[i].url = uploadedImage.url
                processedImages[i].id = uploadedImage.id
            }
            processedImages[i].carouselOrder = i
        }
        
        carouselOperations.createCarousel(title, description, productCategoryId, processedImages)
        setTitle("")
        setDescription("")
        setImages([])
        carouselStore.setIsCreateCarouselModalOpen(false)
    }

    const productCategoryStore = useProductCategoryStore()

    const handleImageUpload = (file: File) => {
        const newImage: CarouselImage = {
            url: URL.createObjectURL(file),
            alt: file.name,
            createdAt: new Date(),
            updatedAt: new Date(),
            file: file
        }
        setImages([...images, newImage])
    }

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    return (
        <Dialog open={carouselStore.isCreateCarouselModalOpen} onOpenChange={carouselStore.setIsCreateCarouselModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Carousel</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="carousel-title" className="text-sm font-medium">
                            Carousel Name
                        </label>
                        <Input
                            id="carousel-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter carousel name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="carousel-description" className="text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            id="carousel-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter carousel description"
                            rows={4}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="carousel-product-category" className="text-sm font-medium">
                            Product Category
                        </label>
                        <Select
                            value={productCategoryId?.toString() || "all"}
                            onValueChange={(value) => setProductCategoryId(value ? Number(value) : undefined)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Product Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">None</SelectItem>
                                {productCategoryStore.productCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Images ({images.length})</label>
                            <ImageUpload onUpload={handleImageUpload}>
                                <Button size="sm" variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Image
                                </Button>
                            </ImageUpload>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-square relative overflow-hidden rounded-lg border">
                                        <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Button size="sm" variant="destructive" onClick={() => handleRemoveImage(index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1 rounded">{index + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => carouselStore.setIsCreateCarouselModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!title.trim()}>
                        Create
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
