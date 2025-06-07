import { Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const LanguageSelector: React.FC = () => {
  const languages = [
    { code: "it", label: "Italiano" },
    { code: "ro", label: "Română" },
  ];

  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lng", lang);
    document.documentElement.lang = lang;
    setIsMenuOpen(false);
  };

  // Close menu when user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return createPortal(
    <div className="fixed right-4 z-40 pointer-events-none" style={{ top: "calc(70px)" }}>
      <div className="pointer-events-auto" ref={menuRef}>
        <button
          className="bg-gradient-to-r from-sage-50/90 to-beige-50/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-beige-200/50"
          aria-label="Select language"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
        >
          <Languages className="w-5 h-5 text-sage-700" />
        </button>

        <div
          className={`absolute right-0 mt-2 w-36 py-2 bg-gradient-to-br from-sage-50 to-beige-50/30 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-200 border border-beige-200/50
            ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full px-4 py-2 text-left hover:bg-sage-50 transition-colors ${
                i18n.language === lang.code
                  ? "text-sage-800 font-semibold"
                  : "text-sage-600"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LanguageSelector;
