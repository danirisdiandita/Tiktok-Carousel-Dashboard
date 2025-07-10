import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCarouselStore } from "@/stores/carousel-store"
import { useCarousel } from "@/hooks/useCarousel"
import { useProductCategoryStore } from "@/stores/product-category"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function NewCarouselDialog() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [productCategoryId, setProductCategoryId] = useState<number | undefined>(undefined)
    const carouselStore = useCarouselStore();
    const carouselOperations = useCarousel();
    const handleSubmit = () => {
        carouselOperations.createCarousel(title, description, productCategoryId)
        setTitle("")
        setDescription("")
        carouselStore.setIsCreateCarouselModalOpen(false)
    }

    const productCategoryStore = useProductCategoryStore()

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
