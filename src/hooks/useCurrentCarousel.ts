import { useCarouselStore } from "@/stores/carousel-store"
import useSWR from "swr"
const fetcher = (url: string) => fetch(url).then((res) => res.json())
export function useCurrentCarousel(id: number) {
    const carouselStore = useCarouselStore()
    const { data, error, isLoading, mutate } = useSWR(`/api/carousel/${id}`, fetcher, {
        onSuccess: (data) => {
            const id = data.carousel.id
            const title = data.carousel.title
            const description = data.carousel.description
            const images = data.carousel.images.map((image: {
                id: number,
                url: string,
                alt: string,
                created_at: string,
                updated_at: string,
                carousel_order: number
            }) => {
                return {
                    id: image.id,
                    url: image.url,
                    alt: image.alt,
                    createdAt: new Date(image.created_at),
                    updatedAt: new Date(image.updated_at),
                    carouselOrder: image.carousel_order
                }
            })
            const createdAt = data.carousel.created_at
            const updatedAt = data.carousel.updated_at
            const status = data.carousel.status

            const carousel = {
                id,
                title,
                description,
                images,
                createdAt,
                updatedAt,
                status
            }

            carouselStore.changeCurrentCarousel(carousel)
        }
    })

    return {
        data, 
        error,
        isLoading,
        mutate
    }

}
