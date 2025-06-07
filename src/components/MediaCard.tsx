import { formatDistanceToNow } from 'date-fns';
import { it, ro } from 'date-fns/locale';
import { FileVideo, Play, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import i18next from '../i18n/config';
import { Media } from '../types';

interface MediaCardProps {
  media: Media;
  onClick: () => void;
  lazyLoad?: boolean;
  isVisible?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onClick,
  lazyLoad = true,
  isVisible = true
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad);

  // Determine if the media is loaded based on its type
  const isMediaLoaded = media.mediaType === 'video' ? videoLoaded : imageLoaded;

  // Generate a low quality thumbnail URL for Cloudinary images (used for initial quick loading)
  const getThumbUrl = () => {
    if (!media.url.includes('cloudinary')) return '';

    // Extract base URL and file parts from the Cloudinary URL
    const parts = media.url.split('/upload/');
    if (parts.length < 2) return '';

    const baseUrl = parts[0];
    const filePart = parts[1];

    // Generate a tiny placeholder for quick loading
    return `${baseUrl}/upload/w_20,h_20,c_fill,q_auto:low,e_blur:1000/${filePart}`;
  };

  // Get placeholder poster URL for videos
  const getPosterUrl = () => {
    if (!media.url.includes('/upload/')) return '';

    try {
      return `${media.url.split('/upload/')[0]}/upload/c_fill,h_300,w_400/so_auto/${media.url.split('/upload/')[1].split('.')[0]}.jpg`;
    } catch {
      // Return empty string if there's any error
      return '';
    }
  };

  // Load the actual image/video when component becomes visible
  useEffect(() => {
    if (isVisible && lazyLoad && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isVisible, lazyLoad, shouldLoad]);

  // Get the low-res thumbnail URL
  const thumbnailUrl = getThumbUrl();

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden cursor-pointer group border border-beige-100 transition-all transform
        ${isVisible ? 'animate-pop-in opacity-100 scale-100' : 'opacity-0 scale-95'}
        hover:shadow-xl hover:scale-[1.01]`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        {/* Enhanced loading placeholder - shows until media is loaded */}
        {!isMediaLoaded && (
          <div className="absolute inset-0 z-10">
            {/* Shimmer background */}
            <div className="absolute inset-0 bg-gradient-to-r from-sage-100/60 via-beige-200/70 to-sage-100/60 bg-[length:400%_100%] animate-shimmer"></div>

            {/* Loading spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-beige-200 border-t-sage-400 animate-spin"></div>
            </div>
          </div>
        )}

        {media.mediaType === 'video' ? (
          <div className="relative pb-[56.25%]">
            {/* Low-res placeholder for videos */}
            {!videoLoaded && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-5 overflow-hidden"
                style={{ backgroundImage: getPosterUrl() ? `url(${getPosterUrl()})` : undefined }}
              >
                {/* Video loading animation overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-beige-50/30 to-sage-100/40 animate-photo-loading"></div>
              </div>
            )}

            {shouldLoad && (
              <video
                src={media.url}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${!videoLoaded ? 'opacity-0 scale-[1.03] blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                poster={getPosterUrl()}
                preload="metadata"
                controls={false}
                onLoadedData={() => setVideoLoaded(true)}
              />
            )}

            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-beige-600/80 to-beige-700/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:from-beige-500/90 group-hover:to-beige-600/90 shadow-lg group-hover:shadow-xl">
                <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1 transition-transform group-hover:scale-110" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ paddingBottom: `${(media.height / media.width * 100) || 75}%` }}>
            {/* Low-res blur-up image as placeholder */}
            {thumbnailUrl && !imageLoaded && (
              <img
                src={thumbnailUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
                loading="eager"
              />
            )}

            {shouldLoad && (
              <img
                src={media.url}
                alt={media.caption}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${!imageLoaded ? 'opacity-0 scale-[1.03] blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end transform translate-y-1 group-hover:translate-y-0 z-30">
          <div className="p-3 text-white w-full backdrop-blur-sm bg-gradient-to-r from-beige-800/30 to-sage-900/30">
            {media.caption && (
              <p className="font-medium text-sm md:text-base line-clamp-2 font-serif">{media.caption}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 bg-gradient-to-br from-sage-50/50 to-beige-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-4 h-4 text-beige-600 mr-1" />
            <span className="text-sm text-sage-700 font-medium truncate">
              {media.submitterName ? media.submitterName : ''}
            </span>
          </div>

          <div className="flex items-center">
            {media.mediaType === 'video' && (
              <FileVideo className="w-3.5 h-3.5 text-beige-600 mr-1" />
            )}
            <span className="text-xs text-sage-600">
              {formatDistanceToNow(media.createdAt, { addSuffix: true, locale: i18next.language == "ro" ? ro : it })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;