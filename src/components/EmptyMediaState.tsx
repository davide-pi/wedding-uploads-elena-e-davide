import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Component displayed when no media is available
 */
const EmptyMediaState: React.FC = () => {
  const { t } = useTranslation();

  return (    <div className="text-center py-12 px-6 bg-gradient-to-br from-sage-50/90 to-beige-50/90 backdrop-blur-sm rounded-lg shadow-md animate-fade-in border border-beige-200/50">
      <p className="text-sage-700 font-serif text-lg">{t('gallery.noMedia')}</p>
      <p className="text-beige-700 font-sans text-sm mt-3 italic">{t('gallery.beFirst')}</p>
    </div>
  );
};

export default React.memo(EmptyMediaState);
