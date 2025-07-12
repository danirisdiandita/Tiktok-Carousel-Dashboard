import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CarouselImage {
    id?: number;
    url: string;
    alt: string;
    createdAt: Date;
    updatedAt: Date;
    file?: File;
    carouselOrder?: number;
}

export interface Carousel {
    id: number;
    title: string;
    description: string;
    images: CarouselImage[];
    createdAt: Date;
    updatedAt: Date;
    status: string;
}

interface CarouselState {
    carousels: Carousel[];
    setCarousels: (carousel: Carousel[]) => void;
    isCreateCarouselModalOpen: boolean;
    setIsCreateCarouselModalOpen: (open: boolean) => void;
    page: number;
    limit: number;
    changePage: (page: number) => void;
    setLimit: (limit: number) => void;
    totalCount: number;
    changeTotalCount: (totalCount: number) => void;
    productCategoryId?: number | undefined;
    changeProductCategoryId: (productCategoryId: number | undefined) => void;
    status: string;
    changeStatus: (status: string) => void;
}

// Define the shape of the persisted state
type PersistedState = {
  status: string;
};

export const useCarouselStore = create<CarouselState>()(
  persist(
    (set) => ({
      carousels: [],
      setCarousels: (carousel: Carousel[]) => set({ carousels: carousel }),
      isCreateCarouselModalOpen: false,
      setIsCreateCarouselModalOpen: (open: boolean) => set({ isCreateCarouselModalOpen: open }),
      page: 1,
      limit: 12,
      changePage: (page: number) => set({ page }),
      setLimit: (limit: number) => set({ limit }),
      totalCount: 0,
      changeTotalCount: (totalCount: number) => set({ totalCount }),
      productCategoryId: undefined,
      changeProductCategoryId: (productCategoryId: number | undefined) => set({ productCategoryId }),
      status: "all",
      changeStatus: (status: string) => set({ status }),
    }),
    {
      name: 'carousel-status-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        status: state.status
      }) as PersistedState,
    }
  )
)