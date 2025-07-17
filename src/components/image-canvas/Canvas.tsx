import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Canvas.module.css';
import EditableCaption from '@/components/image-canvas/EditableCaption';
import { CarouselImage, parseDate } from '@/components/image-canvas/types';

interface CanvasProps {
  image: CarouselImage;
  onImageChange?: (updatedImage: CarouselImage) => void;
}

const Canvas: React.FC<CanvasProps> = ({ image, onImageChange }) => {
  // State for image position and size
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 1080, height: 1920 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isResizingImage, setIsResizingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

  // Caption state
  const [captionText, setCaptionText] = useState(image.alt);

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle image drag
  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    e.stopPropagation();
    setIsDraggingImage(true);
    setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
  };

  // Handle image resize
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    e.stopPropagation();
    e.preventDefault();
    setIsResizingImage(true);
    setResizeStart({
      width: imageSize.width,
      height: imageSize.height,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Handle caption update
  const handleCaptionChange = (text: string) => {
    setCaptionText(text);
    if (onImageChange) {
      onImageChange({
        ...image,
        alt: text
      });
    }
  };

  // Update caption position when image size changes
  useEffect(() => {
    if (onImageChange) {
      // When image size changes, ensure caption stays in the right relative position
      setCaptionText(image.alt); // Refresh caption text
    }
  }, [imageSize, image.alt, onImageChange]);

  // Effect for handling mouse move and up events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingImage) {
        setImagePosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (isResizingImage) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        // Maintain aspect ratio
        const aspectRatio = resizeStart.width / resizeStart.height;
        const newWidth = Math.max(100, resizeStart.width + deltaX);
        const newHeight = Math.max(100, newWidth / aspectRatio);
        
        setImageSize({
          width: newWidth,
          height: newHeight
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingImage(false);
      setIsResizingImage(false);
    };

    if (isDraggingImage || isResizingImage) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingImage, isResizingImage, dragStart, resizeStart]);

  return (
    <div className={styles.canvasContainer} ref={canvasRef}>
      <div className={styles.canvas} style={{ width: '1080px', height: '1920px' }}>
        <div
          className={styles.imageContainer}
          style={{
            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)`,
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
          }}
          onMouseDown={handleImageMouseDown}
        >
          <div className={styles.image}>
            <Image
              src={image.url}
              alt="Carousel image"
              fill
              style={{ objectFit: 'contain' }}
              draggable={false}
            />
            
            {/* Positioned caption overlaying bottom part of image */}
            <EditableCaption
              text={captionText}
              onChange={handleCaptionChange}
              initialPosition={{ x: imageSize.width * 0.05, y: imageSize.height * 0.7 }}
              maxWidth={imageSize.width * 0.9}
            />
          </div>
          
          {/* Resize handle */}
          <div 
            className={styles.resizeHandle}
            onMouseDown={handleResizeMouseDown}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="white" d="M22,22H20V20H22V22M22,18H20V16H22V18M18,22H16V20H18V22M18,18H16V16H18V18M14,22H12V20H14V22M22,14H20V12H22V14Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
