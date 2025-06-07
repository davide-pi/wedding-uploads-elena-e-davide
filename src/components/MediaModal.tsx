import { format } from "date-fns";
import { Calendar, User, X } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Media } from "../types";

interface MediaModalProps {
  media: Media;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ media, onClose }) => {
  const { t } = useTranslation();

  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Close modal when clicking outside the image
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-sage-950/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-sage-50 rounded-lg overflow-hidden animate-slide-up shadow-2xl border border-beige-200">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={onClose}
            className="bg-sage-500/30 hover:bg-sage-600/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-sage-900">
          {media.mediaType === "video" ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-sage-900/80 to-sage-950/80 w-full p-1">
              <video
                data-testid="media-video"
                src={media.url}
                className="w-full h-auto max-h-[70vh] rounded-sm"
                controls
                autoPlay
                controlsList="nodownload"
                playsInline
                onContextMenu={(e) => e.preventDefault()} // Prevent right-click on videos
              />
            </div>
          ) : (
            <img
              src={media.url}
              alt={media.caption || t("gallery.weddingMedia")}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}
        </div>

        <div className="p-4 md:p-6 bg-gradient-to-br from-sage-50 to-beige-50/50">
          {media.caption && (
            <p className="text-sage-800 font-serif font-medium text-lg mb-3 border-b border-beige-200 pb-2">
              {media.caption}
            </p>
          )}

          <div className="flex flex-wrap gap-y-2 items-center justify-between text-sm">
            <div className="flex items-center mr-4">
              <User className="w-4 h-4 text-beige-600 mr-1.5" />
              <span className="text-sage-700 font-medium">
                {media.submitterName || ''}
              </span>
            </div>

            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-beige-600 mr-1.5" />
              <span className="text-sage-600 italic">
                {format(media.createdAt, "PPP")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
