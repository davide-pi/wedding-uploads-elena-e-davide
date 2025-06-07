import React from 'react';

interface MediaCardSkeletonProps {
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

/**
 * Skeleton loader component for media cards
 * This maintains the exact same dimensions and general structure as MediaCard
 * to prevent layout shifts during loading
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
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-beige-100">
      {/* Image placeholder with aspect ratio */}
      <div className="relative overflow-hidden">
        <div className={`w-full ${getPaddingBottom()} bg-gradient-to-r from-sage-100/60 to-beige-100/60 animate-pulse`}></div>
      </div>

      {/* Info bar placeholder */}
      <div className="p-3 bg-gradient-to-br from-sage-50/50 to-beige-50/30">
        <div className="flex items-center justify-between">
          {/* Username placeholder */}
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-beige-200 animate-pulse mr-1"></div>
            <div className="w-24 h-4 bg-sage-100 animate-pulse rounded"></div>
          </div>

          {/* Date placeholder */}
          <div className="flex items-center">
            <div className="w-16 h-3 bg-sage-100 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCardSkeleton;
