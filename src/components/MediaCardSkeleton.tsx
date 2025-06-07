import React from 'react';

interface MediaCardSkeletonProps {
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

/**
 * Skeleton loader component for media cards
 * This maintains the exact same dimensions and general structure as MediaCard
 * to prevent layout shifts during loading
 *
 * Features:
 * - Shimmer effect for a more visually appealing loading state
 * - Maintains aspect ratio to prevent layout shifts
 * - Mimics the structure of the actual media card
 *
 * @param aspectRatio - Optional aspect ratio for the skeleton (default varies randomly)
 */
const MediaCardSkeleton: React.FC<MediaCardSkeletonProps> = ({
  aspectRatio = Math.random() > 0.5 ? 'landscape' : Math.random() > 0.5 ? 'portrait' : 'square',
}) => {
  // Generate different padding bottom values based on aspect ratio
  const getPaddingBottom = () => {
    switch (aspectRatio) {
      case 'portrait':
        return 'pb-[125%]';
      case 'square':
        return 'pb-[100%]';
      case 'landscape':
      default:
        return 'pb-[75%]';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-beige-100 transform transition-all">
      {/* Image placeholder with aspect ratio and shimmer effect */}
      <div className="relative overflow-hidden">
        <div
          className={`w-full ${getPaddingBottom()} bg-gradient-to-r from-sage-100/60 via-beige-200/70 to-sage-100/60 bg-[length:400%_100%] animate-shimmer`}
        >
          {/* Photo loading animation overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-sage-200/20 animate-photo-loading"></div>

          {/* Center loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-beige-200 border-t-sage-400 animate-spin"></div>
          </div>
        </div>
      </div>

      {/* Info bar placeholder with shimmer effect */}
      <div className="p-3 bg-gradient-to-br from-sage-50/50 to-beige-50/30">
        <div className="flex items-center justify-between">
          {/* Username placeholder */}
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-beige-200 animate-skeleton-pulse mr-1"></div>
            <div className="w-24 h-4 bg-gradient-to-r from-sage-100/80 via-sage-50/80 to-sage-100/80 bg-[length:400%_100%] animate-shimmer rounded"></div>
          </div>

          {/* Date placeholder */}
          <div className="flex items-center">
            <div className="w-16 h-3 bg-gradient-to-r from-sage-100/80 via-sage-50/80 to-sage-100/80 bg-[length:400%_100%] animate-shimmer rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCardSkeleton;
