"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCarouselStore } from "@/stores/carousel-store"

export function CarouselStatusSelect() {
    const carouselStore = useCarouselStore()

    // Status options available for carousels
    const statusOptions = [
        { value: "all", label: "All Statuses" },
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" }
    ]
    

    return (
        <Select value={carouselStore.status} onValueChange={carouselStore.changeStatus}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
                {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                        {status.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
