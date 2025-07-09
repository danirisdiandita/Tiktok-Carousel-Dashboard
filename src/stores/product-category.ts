import { create } from 'zustand'

interface ProductCategory {
    id: number
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
}

interface ProductCategoryState {
    productCategories: ProductCategory[]
    changeProductCategories: (productCategories: ProductCategory[]) => void
}

export const useProductCategoryStore = create<ProductCategoryState>((set) => ({
    productCategories: [],
    changeProductCategories: (productCategories) => set({ productCategories }),
}))
