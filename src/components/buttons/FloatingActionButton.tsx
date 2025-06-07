import { Camera, Plus, Upload, Video } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import ActionButton from './ActionButton';

interface FloatingActionButtonProps {
  onTakePhoto: () => void;
  onRecordVideo: () => void;
  onSelectFiles: () => void;
}

/**
 * Floating Action Button with an expandable menu
 * Used for media upload options on mobile
 */
const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onTakePhoto,
  onRecordVideo,
  onSelectFiles
}) => {
  const { t } = useTranslation();
  const [menuExpanded, setMenuExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuExpanded(false);
      }
    };

    if (menuExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuExpanded]);

  // Handler functions that close the menu after action
  const handleTakePhoto = () => {
    onTakePhoto();
    setMenuExpanded(false);
  };

  const handleRecordVideo = () => {
    onRecordVideo();
    setMenuExpanded(false);
  };

  const handleSelectFiles = () => {
    onSelectFiles();
    setMenuExpanded(false);
  };
  // Use portals to ensure the button is always on top but doesn't block interaction
  return createPortal(
    <div className="fixed bottom-6 right-6 md:hidden pointer-events-none" style={{ zIndex: 40 }}>
      {/* Menu items container with pointer events enabled */}
      <div className="pointer-events-auto" ref={menuRef}>
        {/* Expanded menu buttons */}
        <div className={`flex flex-col-reverse items-center gap-3 mb-3 transition-all duration-300 ${menuExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <ActionButton
            onClick={handleTakePhoto}
            icon={Camera}
            label={t('upload.takePhoto')}
          />

          <ActionButton
            onClick={handleRecordVideo}
            icon={Video}
            label={t('upload.recordVideo')}
          />

          <ActionButton
            onClick={handleSelectFiles}
            icon={Upload}
            label={t('upload.uploadFiles')}
          />
        </div>

        {/* Main FAB button */}
        <button
          onClick={() => setMenuExpanded(!menuExpanded)}
          aria-label={menuExpanded ? t('upload.closeMenu') : t('upload.openMenu')}
          aria-expanded={menuExpanded}
          className={`w-14 h-14 rounded-full bg-sage-600 text-white flex items-center justify-center shadow-lg hover:bg-sage-700 hover:scale-105 active:scale-95 focus:outline-none transition-all duration-300 transform ${menuExpanded ? 'rotate-45' : 'rotate-0'}`}
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default FloatingActionButton;
