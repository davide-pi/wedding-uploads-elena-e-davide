import { formatDistanceToNow } from 'date-fns';
import { it, ro } from 'date-fns/locale';
import { FileVideo, Play, User } from 'lucide-react';
import React from 'react';
import i18next from '../i18n/config';
import { Media } from '../types';

interface MediaCardProps {
  media: Media;
  onClick: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
  return (
    <div
      className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl hover:scale-[1.01] cursor-pointer group border border-beige-100"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        {media.mediaType === 'video' ? (
          <div className="relative pb-[56.25%]">
            <video
              src={media.url}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              poster={`${media.url.split('/upload/')[0]}/upload/c_fill,h_300,w_400/so_auto/${media.url.split('/upload/')[1].split('.')[0]}.jpg`}
              preload="metadata"
              controls={false}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-beige-600/80 to-beige-700/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:from-beige-500/90 group-hover:to-beige-600/90 shadow-lg group-hover:shadow-xl">
                <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1 transition-transform group-hover:scale-110" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={media.url}
            alt={media.caption}
            className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end transform translate-y-1 group-hover:translate-y-0">
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