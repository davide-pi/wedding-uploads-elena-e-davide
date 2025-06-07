import { Upload } from 'lucide-react';
import React from 'react';
import { DropzoneRootProps } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

interface DropZoneProps {
  rootProps: DropzoneRootProps;
}

/**
 * Drag and drop zone component for desktop file uploads
 */
const DropZone: React.FC<DropZoneProps> = ({ rootProps }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block mb-8">      <div
        {...rootProps}
        className="border-2 border-dashed border-beige-300 bg-gradient-to-br from-sage-50 to-beige-50/30 rounded-lg p-8 cursor-pointer hover:border-beige-500 transition-all hover:shadow-md text-center"
      >
        <Upload className="w-12 h-12 mx-auto text-beige-600 mb-4 group-hover:scale-110 transition-transform" />
        <p className="text-sage-800 mb-2 text-lg font-medium font-serif">
          {t('upload.dragAndDrop')}
        </p>
        <p className="text-beige-700 mb-4 italic">
          {t('upload.orClickToUpload')}
        </p>
      </div>
    </div>
  );
};

export default DropZone;
