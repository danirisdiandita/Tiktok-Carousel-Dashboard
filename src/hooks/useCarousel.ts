import { Carousel, CarouselImage, useCarouselStore } from '@/stores/carousel-store'
import { useEffect } from 'react'
import useSWR from 'swr'
export function useCarousel() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json())
    const carouselStore = useCarouselStore()
    const { data, error, isLoading, mutate } = useSWR(
        `/api/carousel?page=${carouselStore.page}&limit=${carouselStore.limit}&product_category_id=${carouselStore.productCategoryId}`,
        fetcher,
        {
            onSuccess: (data) => {
                const carousels_ = data.carousels.map((carousel: {
                    id: number,
                    title: string,
                    description: string,
                    created_at: string,
                    updated_at: string,
                    status: string,
                    images: [
                        {
                            id: number,
                            url: string,
                            alt: string,
                            created_at: string,
                            updated_at: string,
                            carousel_order: number
                        }
                    ]
                }) => {
                    return {
                        id: carousel.id,
                        title: carousel.title,
                        description: carousel.description,
                        createdAt: new Date(carousel.created_at),
                        updatedAt: new Date(carousel.updated_at),
                        images: carousel.images
                            .sort((a, b) => a.carousel_order - b.carousel_order)
                            .map((image) => ({
                                ...image,
                                createdAt: new Date(image.created_at),
                                updatedAt: new Date(image.updated_at),
                                carouselOrder: image.carousel_order
                            })),
                        status: carousel.status,
                    }
                })
                carouselStore.changeTotalCount(data.count)
                // {
                //     "id": 2,
                //     "title": "Instagram",
                //     "description": "",
                //     "created_at": "2025-07-09T09:20:17.581Z",
                //     "updated_at": "2025-07-09T09:20:17.581Z",
                //     "status": "draft",
                //     "images": []
                // }
                carouselStore.setCarousels(carousels_)
            }
        }
    )

    useEffect(() => {
        mutate()
    }, [carouselStore.page, carouselStore.productCategoryId])

    const createCarousel = async (title: string, description: string, productCategoryId?: number, images?: CarouselImage[]) => {
        const newCarousel = {
            title,
            description,
            product_category_id: productCategoryId,
            images: images || [],
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
    const updateCarousel = async (id: number, updatedCarousel: Partial<Carousel>) => {
        updatedCarousel.images = updatedCarousel.images?.map((image) => {
            const { carouselOrder, ...rest } = image;
            return {
                ...rest,
                carousel_order: carouselOrder
            };
        })
        
        const response = await fetch(`/api/carousel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...updatedCarousel }),
        })
        if (!response.ok) {
            throw new Error('Failed to update carousel')
        }
        await response.json()
        mutate()
    }

    const deleteCarousel = async (id: number) => {
        const response = await fetch(`/api/carousel`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        if (!response.ok) {
            throw new Error('Failed to delete carousel')
        }
        await response.json()
        mutate()
    }


    const updateStatusToPublished = async (id: number) => {
        const response = await fetch(`/api/carousel/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
        if (!response.ok) {
            throw new Error('Failed to update status to published')
        }
        await response.json()
        mutate()
    }


    const reorderImages = async (imageOrder: {
        id: number,
        order: number
    }[]) => {
        console.log('imageOrder from useCarousel', imageOrder)
        const response = await fetch(`/api/carousel/reorder`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ images: imageOrder }),
        })
        if (!response.ok) {
            throw new Error('Failed to reorder images')
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
        createCarousel,
        updateCarousel,
        deleteCarousel,
        updateStatusToPublished,
        reorderImages
    }
}
