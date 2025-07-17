import React, { useState, useRef, useEffect } from 'react';
import styles from './EditableCaption.module.css';

interface EditableCaptionProps {
  text: string;
  onChange: (text: string) => void;
  initialPosition?: { x: number; y: number };
  maxWidth?: number;
}

const EditableCaption: React.FC<EditableCaptionProps> = ({ 
  text, 
  onChange, 
  initialPosition = { x: 40, y: 40 },
  maxWidth = 300 
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: maxWidth, height: 'auto' });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, x: 0 });
  
  const captionRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Handle caption drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isEditing) return; // Only respond to left mouse button and not when editing
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle caption resize
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      width: size.width as number,
      x: e.clientX,
    });
  };

  // Toggle edit mode on double click
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  // Handle content editing
  const handleContentChange = () => {
    if (editorRef.current) {
      const newText = editorRef.current.innerHTML;
      onChange(newText);
    }
  };

  // Handle blur event to exit edit mode
  const handleBlur = () => {
    setIsEditing(false);
  };

  // Effect for handling mouse move and up events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const newWidth = Math.max(100, resizeStart.width + deltaX);
        
        setSize({
          ...size,
          width: newWidth
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart]);

  // Focus editor when editing starts
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      className={styles.captionContainer}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: typeof size.width === 'number' ? `${size.width}px` : size.width,
        opacity: isEditing ? 1 : 0.9, // Slightly transparent when not editing
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        ref={captionRef}
        className={`${styles.caption} ${isEditing ? styles.editing : ''}`}
      >
        {isEditing ? (
          <div
            ref={editorRef}
            className={styles.editor}
            contentEditable
            dangerouslySetInnerHTML={{ __html: text }}
            onBlur={handleBlur}
            onInput={handleContentChange}
          />
        ) : (
          <div
            className={styles.textContent}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}
      </div>
      
      {/* Resize handle */}
      <div 
        className={styles.resizeHandle}
        onMouseDown={handleResizeMouseDown}
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="white" d="M22,22H20V20H22V22M22,18H20V16H22V18M18,22H16V20H18V22M18,18H16V16H18V18M14,22H12V20H14V22M22,14H20V12H22V14Z" />
        </svg>
      </div>
    </div>
  );
};

export default EditableCaption;
