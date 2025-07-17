import { Carousel as StoreCarousel, CarouselImage as StoreCarouselImage } from "@/stores/carousel-store";

// Re-export the types from the store to use them in the canvas components
export type CarouselImage = StoreCarouselImage;
export type Carousel = StoreCarousel;

// Type utilities to handle data conversions between string dates and Date objects
export const parseDate = (dateStr: string | Date): Date => {
  return typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};
