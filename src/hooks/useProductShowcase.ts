import useSWR from "swr"
import { useProductShowcaseStore } from "../stores/product-showcase-store"
import { useEffect } from "react"
import { useCarouselStore } from "@/stores/carousel-store"

export const useProductShowcase = () => {
    const productShowCaseStore = useProductShowcaseStore()
    const carouselStore = useCarouselStore() 

    const { data, error, isLoading: isLoadingData, mutate } = useSWR(`/api/product-showcase?page=${productShowCaseStore.page}&limit=${productShowCaseStore.limit}&product_category_id=${carouselStore.productCategoryId}`,
        async (url: string) => {
            const response = await fetch(url)
            const data = await response.json()
            return data
        }, {
        onSuccess: (data) => {
            const productShowcase_ = data.productShowcases.map((productShowcase: any) => {
                return {
                    id: productShowcase.id,
                    name: productShowcase.name,
                    description: productShowcase.description,
                    imageUrl: productShowcase.image_url,
                    createdAt: productShowcase.created_at,
                    updatedAt: productShowcase.updated_at,
                    productCategoryId: productShowcase.product_category_id
                }
            })
            productShowCaseStore.changeProductShowcases(productShowcase_)

        },
    }
    )

    useEffect(() => {
        mutate()
    }, [productShowCaseStore.page, carouselStore.productCategoryId])

    const createProductShowcase = async (name: string, description: string, product_category_id: number | undefined, image_url: string) => {
        const response = await fetch('/api/product-showcase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, product_category_id, image_url }),
        })
        if (!response.ok) {
            throw new Error('Failed to create product showcase')
        }
        mutate()
        return response.json()
    }

    return {
        data,
        error,
        isLoading: isLoadingData,
        mutate,
        createProductShowcase
    }
}
