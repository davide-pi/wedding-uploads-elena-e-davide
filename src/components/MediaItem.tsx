import React, { memo, useRef } from 'react';
import { Media } from '../types';
import MediaCard from './MediaCard';
import MediaCardSkeleton from './MediaCardSkeleton';

interface MediaItemProps {
  media: Media;
  isVisible: boolean;
  wasVisible?: boolean;
  onClick: (media: Media) => void;
  setItemRef: (id: string, element: HTMLDivElement | null) => void;
  index?: number; // Added for staggered animations
}

/**
 * Renders an individual media item in the gallery
 * Uses lazy loading to avoid downloading high-res images until they're visible
 */
const MediaItem: React.FC<MediaItemProps> = ({
  media,
  isVisible,
  wasVisible = false,
  onClick,
  setItemRef,
  index = 0
}) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  // If the item is visible or was previously visible, show the media card
  // This prevents images from unloading when scrolling away
  const shouldShowMedia = isVisible || wasVisible;

  // Calculate staggered animation delay based on index
  const getAnimationDelay = () => {
    const baseDelay = 100; // Base delay in milliseconds
    const staggerDelay = (index % 12) * baseDelay; // Stagger up to 12 items
    return `${staggerDelay}ms`;
  };

  return (
    <div
      key={media.id}
      id={media.id}
      className="mb-4 sm:mb-5 transform"
      style={{ animationDelay: getAnimationDelay() }}
      ref={(el) => {
        itemRef.current = el;
        setItemRef(media.id, el);
      }}
    >
      {shouldShowMedia ? (
        <MediaCard
          media={media}
          onClick={() => onClick(media)}
          lazyLoad={true}
          isVisible={isVisible}
        />
      ) : (
        <MediaCardSkeleton aspectRatio={media.width && media.height ? (media.height / media.width > 1 ? 'portrait' : 'landscape') : undefined} />
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MediaItem);
