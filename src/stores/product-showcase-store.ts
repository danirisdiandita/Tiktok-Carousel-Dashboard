import { create } from 'zustand'

export interface ProductShowcase {
  id: number
  name: string
  description: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

interface ProductShowcaseState {
  productShowcases: ProductShowcase[]
  isLoading: boolean
  page: number
  limit: number
  totalCount: number
  changeProductShowcases: (productShowcases: ProductShowcase[]) => void
  setPage: (page: number) => void
  setTotalCount: (count: number) => void
}

export const useProductShowcaseStore = create<ProductShowcaseState>((set) => ({
  productShowcases: [],
  isLoading: false,
  page: 1,
  limit: 12,
  totalCount: 0,
  changeProductShowcases: (productShowcases) => set({ productShowcases }),
  setPage: (page) => set({ page }),
  setTotalCount: (totalCount) => set({ totalCount })
}))
