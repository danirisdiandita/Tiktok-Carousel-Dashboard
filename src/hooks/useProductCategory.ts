
import { useProductCategoryStore } from '@/stores/product-category'
import useSWR from 'swr'

export function useProductCategory() {
    const { productCategories, changeProductCategories } = useProductCategoryStore()
    const fetcher = (url: string) => fetch(url).then((res) => res.json())

    const { error, isLoading, mutate } = useSWR('/api/product-category', fetcher, {
        onSuccess: (data) => {
            const productCategories = data.map((item: {
                id: number;
                name: string;
                description: string;
                created_at: Date;
                updated_at: Date;
            }) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
            }))
            changeProductCategories(productCategories)
        }
    })


    const createProductCategory = async (name: string, description: string) => {
        const response = await fetch('/api/product-category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        })
        if (!response.ok) {
            throw new Error('Failed to create product category')
        }
        mutate()
    }

    return {
        productCategories,
        isLoading,
        error,
        mutate,
        createProductCategory
    }
}
