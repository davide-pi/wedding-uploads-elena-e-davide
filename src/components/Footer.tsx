import { Trees } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-8 mt-8 border-t border-beige-200 bg-gradient-to-r from-sage-50/70 to-beige-50/70">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-2">
          <span className="text-sage-700 mr-1">{t('footer.captured')}</span>
          <Trees className="w-4 h-4 text-beige-600" />
          <span className="text-beige-700 ml-1 font-serif italic">{t('footer.wild')}</span>
        </div>
        <p className="text-sage-600 text-sm font-sans">
          {t('footer.shareWithUs')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;