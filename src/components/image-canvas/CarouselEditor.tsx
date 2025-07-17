import React, { useState } from 'react';
import { Carousel, CarouselImage } from '@/components/image-canvas/types';
import Canvas from '@/components/image-canvas/Canvas';
import styles from './CarouselEditor.module.css';

interface CarouselEditorProps {
  carousel: Carousel;
  onUpdate?: (updatedCarousel: Carousel) => void;
}

const CarouselEditor: React.FC<CarouselEditorProps> = ({ carousel, onUpdate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<CarouselImage[]>(carousel?.images || []);

  if (!carousel || !carousel.images || carousel.images.length === 0) {
    return <div className={styles.noImages}>No images available in this carousel</div>;
  }

  const handleImageChange = (updatedImage: CarouselImage) => {
    const newImages = [...images];
    const index = newImages.findIndex(img => img.id === updatedImage.id);
    
    if (index !== -1) {
      newImages[index] = updatedImage;
      setImages(newImages);
      
      if (onUpdate) {
        onUpdate({
          ...carousel,
          images: newImages
        });
      }
    }
  };

  const handlePrevious = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.canvasWrapper}>
        <Canvas 
          image={images[currentImageIndex]}
          onImageChange={(updatedImage) => handleImageChange(updatedImage)}
        />
      </div>
      
      <div className={styles.controls}>
        <button 
          className={styles.navButton}
          onClick={handlePrevious}
          disabled={currentImageIndex === 0}
        >
          Previous
        </button>
        
        <div className={styles.pagination}>
          {currentImageIndex + 1} / {images.length}
        </div>
        
        <button 
          className={styles.navButton}
          onClick={handleNext}
          disabled={currentImageIndex === images.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CarouselEditor;
