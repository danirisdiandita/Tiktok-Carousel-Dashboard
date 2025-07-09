import { useCarouselStore } from '@/stores/carousel-store'
import useSWR from 'swr'
export function useCarousel() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json())
    const carouselStore = useCarouselStore()
    const { data, error, isLoading, mutate } = useSWR(
        `/api/carousel?page=${carouselStore.page}&limit=${carouselStore.limit}`,
        fetcher,
        {
            onSuccess: (data) => {
                carouselStore.setCarousels(data.carousels || [])
            }
        }
    )


    const createCarousel = async (title: string, description: string) => {
        const newCarousel = {
            title,
            description,
            images: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "draft",
        }
        const response = await fetch(`/api/carousel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCarousel),
        })
        if (!response.ok) {
            throw new Error('Failed to create carousel')
        }
        await response.json()
        mutate()
    }

    return {
        carousels: data?.carousels || [],
        totalCount: data?.count || 0,
        isLoading,
        isError: error,
        mutate,
        createCarousel
    }
}
