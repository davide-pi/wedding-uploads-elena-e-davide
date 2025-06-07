import React, { memo, useRef } from 'react';
import { Media } from '../types';
import MediaCard from './MediaCard';

interface MediaItemProps {
  media: Media;
  isVisible: boolean;
  onClick: (media: Media) => void;
  setItemRef: (id: string, element: HTMLDivElement | null) => void;
}

/**
 * Renders an individual media item in the gallery
 */
const MediaItem: React.FC<MediaItemProps> = ({
  media,
  isVisible,
  onClick,
  setItemRef
}) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  return (    <div
      key={media.id}
      id={media.id}
      className="mb-4 sm:mb-5 animate-slide-up transform transition-transform duration-300 hover:translate-y-[-2px]"
      ref={(el) => {
        itemRef.current = el;
        setItemRef(media.id, el);
      }}
    >
      {isVisible ? (
        <MediaCard
          media={media}
          onClick={() => onClick(media)}
        />
      ) : (
        <div className="bg-gradient-to-r from-sage-100/40 to-beige-100/40 animate-pulse rounded-lg h-48 md:h-56"></div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MediaItem);
