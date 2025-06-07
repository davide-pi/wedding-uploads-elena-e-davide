import { Mountain } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-sage-50/95 to-beige-50/95 backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-sage-800 text-center flex items-center gap-2">
          <Mountain className="w-8 h-8 text-beige-600" />
          {t('gallery.title')}
        </h1>
        <div className="flex items-center mt-1">
          <span className="text-beige-700 text-sm md:text-base font-sans italic">{t('gallery.subtitle')}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;