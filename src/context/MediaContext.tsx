import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useNotification } from '../hooks/useNotification';
import { CloudinaryResource, fetchWeddingMedia, uploadMedia } from '../services/cloudinaryService';
import { Media, UploadState } from '../types';

interface MediaContextType {
  media: Media[];
  uploadState: UploadState;
  uploadMedia: (file: File, caption?: string, submitterName?: string) => Promise<void>;
  uploadMultipleFiles: (files: File[], caption?: string, submitterName?: string) => Promise<void>;
  sortedMedia: Media[];
  progress: number; // <-- Add progress to context type
}

// Export the context for use in the hook file
export const MediaContext = createContext<MediaContextType | undefined>(undefined);

interface MediaProviderProps {
  children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState<number>(0); // <-- Add progress state
  const { showNotification } = useNotification();

  // Transform CloudinaryResource to Media
  const createMediaFromCloudinaryResource = (resource: CloudinaryResource): Media => ({
    id: resource.public_id,
    url: resource.secure_url,
    publicId: resource.public_id,
    caption: resource.context?.custom?.caption,
    submitterName: resource.context?.custom?.submitter_name,
    createdAt: new Date(resource.created_at),
    width: resource.width,
    height: resource.height,
    mediaType: resource.resource_type === 'video' ? 'video' : 'image',
  });

  // Create Media from upload result
  const createMediaFromUploadResult = (
    result: {
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      resource_type?: "image" | "video";
    },
    caption?: string,
    submitterName?: string
  ): Media => ({
    id: result.public_id,
    url: result.secure_url,
    publicId: result.public_id,
    caption,
    submitterName,
    createdAt: new Date(),
    width: result.width,
    height: result.height,
    mediaType: result.resource_type === 'video' ? 'video' : 'image',
  });

  // Fetch media directly from Cloudinary
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const resources = await fetchWeddingMedia();
        const fetchedMedia = resources.map(createMediaFromCloudinaryResource);
        setMedia(fetchedMedia);
      } catch (error) {
        console.error('Error loading media:', error);
        showNotification('error', error instanceof Error ? error.message : 'Failed to load media', 3000);
      }
    };

    loadMedia();
  }, [showNotification]);

  // Handle upload error
  const handleUploadError = useCallback((error: unknown, errorMessage: string) => {
    const message = error instanceof Error ? error.message : errorMessage;
    setUploadState('error');
    showNotification('error', message, 3000);
  }, [showNotification]);

  // Upload a single file
  const uploadSingle = async (file: File, caption?: string, submitterName?: string) => {
    try {
      setUploadState('uploading');
      setProgress(0); // Reset progress
      const onProgress = (progressValue: number) => {
        setProgress(progressValue);
      };
      const result = await uploadMedia(file, onProgress, caption, submitterName);
      const newMedia = createMediaFromUploadResult(result, caption, submitterName);
      setMedia(prevMedia => [newMedia, ...prevMedia]);
      setUploadState('completed');
      setProgress(100); // Complete
    } catch (error) {
      handleUploadError(error, 'Failed to upload media');
      setUploadState('error');
      setProgress(0);
    }
  };

  // Upload multiple files
  const uploadMultipleFiles = async (files: File[], caption?: string, submitterName?: string) => {
    try {
      setUploadState('uploading');
      setProgress(0); // Reset progress
      const newMedia: Media[] = [];
      const totalFiles = files.length;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const onProgress = (fileProgress: number) => {
          // Calculate overall progress for multiple files
          const overall = Math.round(((i + fileProgress / 100) / totalFiles) * 100);
          setProgress(overall);
        };
        const result = await uploadMedia(file, onProgress, caption, submitterName);
        newMedia.push(createMediaFromUploadResult(result, caption, submitterName));
      }
      setMedia(prevMedia => [...newMedia, ...prevMedia]);
      setUploadState('completed');
      setProgress(100); // Complete
    } catch (error) {
      handleUploadError(error, 'Failed to upload files');
      setUploadState('error');
      setProgress(0);
    }
  };

  const sortedMedia = [...media].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <MediaContext.Provider
      value={{
        media,
        uploadState,
        uploadMedia: uploadSingle,
        uploadMultipleFiles,
        sortedMedia,
        progress, // <-- Provide progress
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};