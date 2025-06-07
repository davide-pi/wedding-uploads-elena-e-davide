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
  setItemRef
}) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  // If the item is visible or was previously visible, show the media card
  // This prevents images from unloading when scrolling away
  const shouldShowMedia = isVisible || wasVisible;

  return (
    <div
      key={media.id}
      id={media.id}
      className="mb-4 sm:mb-5 animate-slide-up transform transition-transform duration-300 hover:translate-y-[-2px]"
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
