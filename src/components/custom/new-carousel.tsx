import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCarouselStore } from "@/stores/carousel-store"
import { useCarousel } from "@/hooks/useCarousel"

export function NewCarouselDialog() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const carouselStore = useCarouselStore();
    const carouselOperations = useCarousel();
    const handleSubmit = () => {
        carouselOperations.createCarousel(title, description)
        setTitle("")
        setDescription("")
        carouselStore.setIsCreateCarouselModalOpen(false)
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
