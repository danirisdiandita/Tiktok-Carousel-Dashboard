"use client";
import { useCurrentCarousel } from "@/hooks/useCurrentCarousel";
import { useCarouselStore, Carousel } from "@/stores/carousel-store";
import React, { use, useEffect, useState } from "react";
import CarouselEditor from "@/components/image-canvas/CarouselEditor";
import styles from "./page.module.css";

const CarouselPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  useCurrentCarousel(parseInt(id));
  const carouselStore = useCarouselStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (carouselStore.currentCarousel) {
      setIsLoading(false);
    }
  }, [carouselStore.currentCarousel]);

  const handleCarouselUpdate = (updatedCarousel: Carousel) => {
    // Here you could implement the update to the backend if needed
    // For now we just update the local state
    carouselStore.changeCurrentCarousel(updatedCarousel);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading carousel...</div>;
  }

  return (
    <div className={styles.carouselPageContainer}>
      <h1 className={styles.title}>{carouselStore.currentCarousel?.title}</h1>
      <div className={styles.editorWrapper}>
        {carouselStore.currentCarousel && (
          <CarouselEditor 
            carousel={carouselStore.currentCarousel} 
            onUpdate={handleCarouselUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default CarouselPage;
