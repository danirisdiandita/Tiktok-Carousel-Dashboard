"use client"

import { useEffect, useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { CarouselCard } from "@/components/carousel-card"
import { PaginationComponent } from "@/components/pagination"
import { useCarouselStore, Carousel } from "@/stores/carousel-store"
import { NewCarouselDialog } from "@/components/custom/new-carousel"
import { useCarousel } from "@/hooks/useCarousel"
import { ProductCategorySelect } from "@/components/custom/product-category-select"
import { CarouselStatusSelect } from "@/components/custom/carousel-status-select"
import { DeleteCarousel } from "@/components/custom/delete-carousel"


export default function ContentsPage() {
  useCarousel();
  const [searchQuery, setSearchQuery] = useState("")
  const [carouselToDelete, setCarouselToDelete] = useState<number | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const carouselStore = useCarouselStore();
  const carouselOperations = useCarousel()

  const filteredCarousels = carouselStore.carousels.filter(
    (carousel) =>
      carousel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carousel.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleUpdateCarousel = (id: number, updatedCarousel: Partial<Carousel>) => {
    carouselOperations.updateCarousel(id, updatedCarousel)
  }

  const handleDeleteCarousel = (id: number) => {
    setCarouselToDelete(id)
    setIsDeleteModalOpen(true)
  }
  
  const confirmDeleteCarousel = () => {
    if (carouselToDelete !== null) {
      carouselOperations.deleteCarousel(carouselToDelete)
      setCarouselToDelete(null)
    }
    setIsDeleteModalOpen(false)
  }


  useEffect(() => {
    console.log("carouselStore.status", carouselStore.status)
  }, [carouselStore.status])

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Carousels</h1>
        </div>
        <Button onClick={() => carouselStore.setIsCreateCarouselModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Carousel
        </Button>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search carousels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <ProductCategorySelect />
            <CarouselStatusSelect />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {filteredCarousels.map((carousel) => (
            <CarouselCard
              key={carousel.id}
              carousel={carousel}
              onUpdate={(updatedCarousel) => handleUpdateCarousel(carousel.id, updatedCarousel)}
              onDelete={() => handleDeleteCarousel(carousel.id)}
              layout="horizontal"
            />
          ))}
        </div>
        <PaginationComponent
          currentPage={carouselStore.page}
          totalPages={Math.ceil(carouselStore.totalCount / carouselStore.limit)}
          onPageChange={carouselStore.changePage}
        />
      </div>
      <NewCarouselDialog />
      <DeleteCarousel 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDeleteCarousel}
      />
    </SidebarInset>
  )
}
