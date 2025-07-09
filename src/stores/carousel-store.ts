import { create } from 'zustand'

export interface CarouselImage {
    id: number;
    url: string;
    alt: string;
    createdAt: Date;
    updatedAt: Date;
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
}

export const useCarouselStore = create<CarouselState>((set) => ({
    carousels: [],
    setCarousels: (carousel: Carousel[]) => set({ carousels: carousel }),
    isCreateCarouselModalOpen: false,
    setIsCreateCarouselModalOpen: (open: boolean) => set({ isCreateCarouselModalOpen: open }),
    page: 1,
    limit: 12,
    setPage: (page: number) => set({ page }),
    setLimit: (limit: number) => set({ limit }),
}))