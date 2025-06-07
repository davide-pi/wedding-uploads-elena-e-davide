import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-masonry-css';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useMedia } from '../hooks/useMedia';
import { useMediaModal } from '../hooks/useMediaModal';
import EmptyMediaState from './EmptyMediaState';
import MediaCardSkeleton from './MediaCardSkeleton';
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

// Number of skeleton cards to show during loading
const SKELETON_COUNT = 8;

/**
 * MediaGallery component displays a responsive masonry grid of media items with lazy loading
 *
 * Features:
 * - Lazy loading images using Intersection Observer API
 * - Responsive masonry layout with configurable breakpoints
 * - Modal for viewing images in full screen
 * - Optimized performance with memoization
 * - Empty state handling when no media is available
 * - Loading skeletons for initial load
 *
 * @example
 * ```tsx
 * <MediaGallery />
 * ```
 *
 * @returns A responsive media gallery with lazy-loaded images
 */
const MediaGallery: React.FC = () => {
  const { sortedMedia, isLoading } = useMedia();
  const { t } = useTranslation();

  // Use custom hooks for better separation of concerns with enhanced options
  // keepVisible: false - means we track when items leave viewport
  // rootMargin: '400px' - load images when they're within 400px of viewport (preload)
  const { setItemRef, isVisible, wasVisible } = useIntersectionObserver({
    rootMargin: '400px',
    threshold: 0,
    keepVisible: false
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

  // Generate an array of skeleton loaders with varied aspect ratios
  const skeletonLoaders = useMemo(() => {
    return Array.from({ length: SKELETON_COUNT }).map((_, index) => {
      // Create a deterministic but varied set of skeletons
      const aspectRatio = index % 3 === 0 ? 'portrait' : (index % 3 === 1 ? 'square' : 'landscape');
      return (
        <div key={`skeleton-${index}`} className="mb-4 sm:mb-5 animate-slide-up">
          <MediaCardSkeleton aspectRatio={aspectRatio} />
        </div>
      );
    });
  }, []);

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

      {isLoading ? (
        <Masonry
          breakpointCols={BREAKPOINT_COLUMNS}
          className="flex w-auto -ml-3 md:-ml-4"
          columnClassName="pl-3 md:pl-4 bg-clip-padding"
        >
          {skeletonLoaders}
        </Masonry>
      ) : sortedMedia.length === 0 ? (
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
              wasVisible={wasVisible(media.id)}
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