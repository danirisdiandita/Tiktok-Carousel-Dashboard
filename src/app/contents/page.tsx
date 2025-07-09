"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { CarouselCard } from "@/components/carousel-card"
import { PaginationComponent } from "@/components/pagination"
import { useCarouselStore, Carousel } from "@/stores/carousel-store"
import { NewCarouselDialog } from "@/components/custom/new-carousel"
import { useCarousel } from "@/hooks/useCarousel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


// Mock data for carousels
// const mockCarousels = Array.from({ length: 50 }, (_, i) => ({
//   id: i + 1,
//   title: `Carousel ${i + 1}`,
//   description: `Description for carousel ${i + 1}`,
//   images: Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, j) => ({
//     id: j + 1,
//     url: `/placeholder.svg?height=400&width=300&text=Image ${j + 1}`,
//     alt: `Image ${j + 1} for carousel ${i + 1}`,
//     createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
//     updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
//   })),
//   createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
//   updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
//   status: Math.random() > 0.5 ? "published" : "draft",
// }))


export default function ContentsPage() {
  useCarousel();
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const carouselStore = useCarouselStore();
  const carouselOperations = useCarousel()

  const filteredCarousels = carouselStore.carousels.filter(
    (carousel) =>
      (filterCategory === "all" || carousel.status === filterCategory) &&
      carousel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carousel.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleUpdateCarousel = (id: number, updatedCarousel: Partial<Carousel>) => {
    carouselOperations.updateCarousel(id, updatedCarousel)
    // carouselStore.setCarousels(carouselStore.carousels.map((carousel) => (carousel.id === id ? { ...carousel, ...updatedCarousel } : carousel)))
  }

  const handleDeleteCarousel = (id: number) => {
    carouselStore.setCarousels(carouselStore.carousels.filter((carousel) => carousel.id !== id))
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Contents</h1>
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
            <Select defaultValue="all" onValueChange={(value) => setFilterCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
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
    </SidebarInset>
  )
}
