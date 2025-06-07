import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FileWithPreview } from '../../types';

interface MediaUploadFormProps {
  selectedFiles: FileWithPreview[];
  caption: string;
  submitterName: string;
  isUploading: boolean;
  progress: number;
  onCaptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitterNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onRemoveFile: (index: number) => void;
}

/**
 * Modal form for adding details to media before uploading
 * Behaves similarly to MediaModal with backdrop and keyboard events
 */
const MediaUploadForm: React.FC<MediaUploadFormProps> = ({
  selectedFiles,
  caption,
  submitterName,
  isUploading,
  progress,
  onCaptionChange,
  onSubmitterNameChange,
  onSubmit,
  onCancel,
  onRemoveFile
}) => {
  const { t } = useTranslation();

  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isUploading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCancel, isUploading]);

  // Close modal when clicking outside the form
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isUploading) {
      onCancel();
    }
  };

  // Check if a file is a video
  const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
  };
  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-sage-950/80 flex items-center justify-center p-4 md:p-6 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-2xl w-full max-h-[90vh] flex flex-col bg-sage-50 rounded-lg overflow-hidden animate-slide-up shadow-md border border-beige-200">
        {/* Header with title and close button */}
        <div className="sticky top-0 z-10 bg-sage-100 px-4 py-3 flex justify-between items-center border-b border-beige-200">
          <h2 className="font-serif text-xl text-sage-800">
            {t('upload.addMediaDetails')}
          </h2>
          {!isUploading && (
            <button
              onClick={onCancel}
              className="md:bg-sage-200 md:hover:bg-sage-300 text-sage-700 p-2 rounded-full"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content area with media previews and form */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Media preview grid */}
          {selectedFiles.length > 0 && (
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden border border-beige-200 group">
                  {isVideoFile(file) ? (
                    <video
                      src={file.preview}
                      className="w-full h-24 object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={file.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => onRemoveFile(index)}
                      className="bg-white/90 text-sage-700 p-1 rounded-full"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs p-1 truncate">
                    {isVideoFile(file) ? t('upload.video') : t('upload.image')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="caption" className="block text-sage-800 text-sm font-medium mb-1 font-serif">
                {t('upload.caption')}
              </label>
              <input
                type="text"
                id="caption"
                value={caption}
                onChange={onCaptionChange}
                disabled={isUploading}
                className={`w-full px-3 py-2 border ${
                  isUploading ? 'border-beige-200 bg-beige-50 text-beige-400' : 'border-beige-300'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-beige-400 text-sm bg-white`}
                placeholder={t('upload.addCaptionPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="submitterName" className="block text-sage-800 text-sm font-medium mb-1 font-serif">
                {t('upload.yourName')}
              </label>
              <input
                type="text"
                id="submitterName"
                value={submitterName}
                onChange={onSubmitterNameChange}
                disabled={isUploading}
                className={`w-full px-3 py-2 border ${
                  isUploading ? 'border-beige-200 bg-beige-50 text-beige-400' : 'border-beige-300'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-beige-400 text-sm bg-white`}
                placeholder={t('upload.enterYourName')}
              />
              {submitterName && (
                <p className="text-xs text-sage-500 mt-1">
                  {t('upload.nameRemembered')}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || selectedFiles.length === 0}
              className={`w-full py-2 px-4 rounded-md font-medium text-sm ${
                isUploading || selectedFiles.length === 0
                  ? 'bg-sage-300 text-white cursor-not-allowed'
                  : 'bg-beige-600 text-white hover:bg-beige-500'
              }`}
            >
              {isUploading
                ? `${t('upload.uploading')} (${selectedFiles.length})`
                : selectedFiles.length > 1
                  ? t('upload.uploadFiles')
                  : t('upload.uploadFile')
              }
            </button>

            {/* Progress Bar */}
            {isUploading && (
              <div className="mt-3">
                <div className="h-1.5 bg-sage-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-beige-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sage-500 text-xs mt-1">
                  {progress}% {t('upload.uploaded')}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MediaUploadForm;
