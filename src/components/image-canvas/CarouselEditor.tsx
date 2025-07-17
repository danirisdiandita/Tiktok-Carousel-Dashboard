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

  // Function to download the current canvas as a PNG image
  const downloadCanvasAsImage = () => {
    console.log(`Preparing to download canvas image`);
    // Get the canvas element
    const canvasElement = document.querySelector(`#image_canvas`) as HTMLElement;
    
    if (!canvasElement) {
      console.error('Canvas element not found');
      return;
    }

    try {
      // Import and use html-to-image library
      import('html-to-image').then((htmlToImage) => {
        // Show loading state
        const downloadBtn = document.querySelector(`.${styles.downloadButton}`) as HTMLButtonElement;
        if (!downloadBtn) return;
        
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = 'Processing...';
        downloadBtn.disabled = true;

        // Process the canvas after a brief timeout to ensure DOM is fully updated
        setTimeout(() => {
          try {
            // Fix Next.js images by replacing src with currentSrc (the actual rendered image)
            const images = canvasElement.querySelectorAll('img');
            const imageMap = new Map();
            
            // Save original sources and replace with rendered sources
            images.forEach((img) => {
              if (img.currentSrc) {
                imageMap.set(img, img.getAttribute('src'));
                img.setAttribute('src', img.currentSrc);
              }
            });
            
            // Wait for any image loading to complete
            const imagePromises = Array.from(images).map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            });
            
            Promise.all(imagePromises).then(() => {
              // Use toPng for better compatibility
              htmlToImage.toPng(canvasElement, {
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                canvasWidth: canvasElement.offsetWidth,
                canvasHeight: canvasElement.offsetHeight
              })
              .then((dataUrl) => {
                // Create download link
                const link = document.createElement('a');
                link.download = `carousel-${carousel.id}-slide-${currentImageIndex + 1}.png`;
                link.href = dataUrl;
                link.click();
                
                // Restore original image sources
                imageMap.forEach((originalSrc, img) => {
                  if (originalSrc) img.setAttribute('src', originalSrc);
                });
                
                // Restore button
                downloadBtn.innerText = originalText;
                downloadBtn.disabled = false;
              })
              .catch((error) => {
                console.error('Failed to generate PNG:', error);
                downloadBtn.innerText = originalText;
                downloadBtn.disabled = false;
              });
            });
          } catch (error) {
            console.error('Error during image processing:', error);
            downloadBtn.innerText = originalText;
            downloadBtn.disabled = false;
          }
        }, 100);
      }).catch((error) => {
        console.error('Error loading html-to-image library:', error);
      });
    } catch (error) {
      console.error('Error in download process:', error);
    }
  };

  return (
    <>
    <div className={styles.downloadButtonContainer}>
        <button 
          className={styles.downloadButton + " w-full"}
          onClick={downloadCanvasAsImage}
          title="Download as PNG"
        >
          Download as PNG
        </button>
      </div>
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
    </>
  );
};

export default CarouselEditor;
