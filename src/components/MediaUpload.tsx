import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useMedia } from '../hooks/useMedia';
import { FileWithPreview, MediaType } from '../types';
import FloatingActionButton from './buttons/FloatingActionButton';
import DropZone from './upload/DropZone';
import MediaUploadForm from './upload/MediaUploadForm';

// Storage key constant for submitter name
const SUBMITTER_NAME_STORAGE_KEY = 'wedding_media_submitter_name';

/**
 * Main media upload component that orchestrates the upload workflow
 */
const MediaUpload: React.FC = () => {
  const { t } = useTranslation();
  const { uploadMedia, uploadMultipleFiles, uploadState, progress } = useMedia();
  const [caption, setCaption] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const photoCameraInputRef = useRef<HTMLInputElement>(null);
  const videoCameraInputRef = useRef<HTMLInputElement>(null);

  // Load submitter name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem(SUBMITTER_NAME_STORAGE_KEY);
    if (savedName) {
      setSubmitterName(savedName);
    }
  }, []);

  // Save submitter name to localStorage when it changes
  const handleSubmitterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setSubmitterName(newName);
    // Only save non-empty names to localStorage
    if (newName.trim()) {
      localStorage.setItem(SUBMITTER_NAME_STORAGE_KEY, newName);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up the previews to avoid memory leaks
      selectedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [selectedFiles]);

  // Handle file selection from the native device camera
  const handleMediaCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const capturedFile = files[0];

      // Create preview URL for the captured media
      const fileWithPreview = Object.assign(capturedFile, {
        preview: URL.createObjectURL(capturedFile)
      });

      setSelectedFiles([fileWithPreview]);
      setShowForm(true);

      // Reset the input value to allow capturing again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Launch the native camera app based on the selected mode
  const launchNativeCamera = (type: MediaType) => {
    if (type === 'image' && photoCameraInputRef.current) {
      photoCameraInputRef.current.click();
    } else if (type === 'video' && videoCameraInputRef.current) {
      videoCameraInputRef.current.click();
    }
  };

  // Handle file drop and selection
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      // Create preview URLs for all accepted files
      const filesWithPreviews = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      // If the form is already open, append the files to the existing selection
      if (showForm) {
        setSelectedFiles(prevFiles => [...prevFiles, ...filesWithPreviews]);
      } else {
        // Otherwise, set the selected files and open the form
        setSelectedFiles(filesWithPreviews);
        setShowForm(true);
      }
    }
  }, [showForm]);

  // Create dropzone configuration
  const dropzone = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi']
    },
    multiple: true,
    noClick: false // Allow clicking on the dropzone area on desktop
  });

  // Handle direct file selection through the upload button
  const handleFileSelect = () => {
    // Manually trigger the file input dialog
    dropzone.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length > 0) {
      // If there's only one file, use uploadMedia, otherwise use uploadMultipleFiles
      if (selectedFiles.length === 1) {
        await uploadMedia(selectedFiles[0], caption, submitterName);
      } else {
        await uploadMultipleFiles(selectedFiles, caption, submitterName);
      }

      // Reset form but keep the submitter name for future uploads
      setCaption('');
      setSelectedFiles([]);
      setShowForm(false);
      // Note: We don't reset submitterName here to keep it for next time
    }
  };

  const handleCancel = () => {
    setCaption('');
    // Don't reset submitterName to keep it for future uploads

    // Clean up preview URLs
    selectedFiles.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });

    setSelectedFiles([]);
    setShowForm(false);
  };

  // Remove a file from the selected files list
  const removeFile = (index: number) => {
    setSelectedFiles(files => {
      const newFiles = [...files];
      // Clean up the preview URL
      if (newFiles[index]?.preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);

      // If no files remain, close the form
      if (newFiles.length === 0) {
        setShowForm(false);
      }

      return newFiles;
    });
  };

  // We need to use the t function to avoid the TypeScript error
  // This is needed for translations throughout the component's child components
  t('upload.selectFiles'); // This ensures t is used

  return (
    <>
      {/* Hidden inputs for file selection */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={photoCameraInputRef}
        onChange={handleMediaCapture}
        className="hidden"
      />
      <input
        type="file"
        accept="video/*"
        capture="environment"
        ref={videoCameraInputRef}
        onChange={handleMediaCapture}
        className="hidden"
      />
      <input {...dropzone.getInputProps()} />

      {/* Desktop Drag and Drop Area - Always visible on desktop */}
      <DropZone
        rootProps={dropzone.getRootProps()}
      />

      {/* Mobile Floating Action Button - Always visible on mobile */}
      <FloatingActionButton
        onTakePhoto={() => launchNativeCamera('image')}
        onRecordVideo={() => launchNativeCamera('video')}
        onSelectFiles={handleFileSelect}
      />

      {/* Media Upload Form */}
      {showForm && (
        <MediaUploadForm
          selectedFiles={selectedFiles}
          caption={caption}
          submitterName={submitterName}
          isUploading={uploadState === 'uploading'}
          progress={progress}
          onCaptionChange={(e) => setCaption(e.target.value)}
          onSubmitterNameChange={handleSubmitterNameChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onRemoveFile={removeFile}
        />
      )}
    </>
  );
};

export default MediaUpload;
