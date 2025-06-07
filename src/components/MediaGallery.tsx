import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-masonry-css';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useMedia } from '../hooks/useMedia';
import { useMediaModal } from '../hooks/useMediaModal';
import EmptyMediaState from './EmptyMediaState';
import MediaItem from './MediaItem';
import MediaModal from './MediaModal';

/**
 * Masonry breakpoints configuration for responsive layout
 */
const BREAKPOINT_COLUMNS = {
  default: 4,
  768: 3,
  480: 2,
  320: 1
};

/**
 * MediaGallery component displays a responsive masonry grid of media items with lazy loading
 *
 * Features:
 * - Lazy loading images using Intersection Observer API
 * - Responsive masonry layout with configurable breakpoints
 * - Modal for viewing images in full screen
 * - Optimized performance with memoization
 * - Empty state handling when no media is available
 *
 * @example
 * ```tsx
 * <MediaGallery />
 * ```
 *
 * @returns A responsive media gallery with lazy-loaded images
 */
const MediaGallery: React.FC = () => {
  const { sortedMedia } = useMedia();
  const { t } = useTranslation();

  // Use custom hooks for better separation of concerns
  const { setItemRef, isVisible } = useIntersectionObserver({
    rootMargin: '200px'
  });

  const { selectedMedia, openModal, closeModal } = useMediaModal();

  // Render the modal with portal for better accessibility and styling
  const renderModal = useMemo(() => {
    if (!selectedMedia) return null;

    return createPortal(
      <MediaModal media={selectedMedia} onClose={closeModal} />,
      document.body
    );
  }, [selectedMedia, closeModal]);

  return (
    <div className="animate-fade-in">
      <div className="relative font-serif text-sage-800 mb-6 text-center flex flex-col items-center ">
        <span className="relative inline-block text-2xl md:text-3xl">
          {t('gallery.mediaGallery.line1')}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-beige-300 to-beige-500"></span>
        </span>
        <span className="relative inline-block text-lg md:text-xl">
          {t('gallery.mediaGallery.line2')}
        </span>
      </div>

      {sortedMedia.length === 0 ? (
        <EmptyMediaState />
      ) : (
        <Masonry
          breakpointCols={BREAKPOINT_COLUMNS}
          className="flex w-auto -ml-3 md:-ml-4"
          columnClassName="pl-3 md:pl-4 bg-clip-padding"
        >
          {sortedMedia.map((media) => (
            <MediaItem
              key={media.id}
              media={media}
              isVisible={isVisible(media.id)}
              onClick={openModal}
              setItemRef={setItemRef}
            />
          ))}
        </Masonry>
      )}

      {renderModal}
    </div>
  );
};

export default React.memo(MediaGallery);