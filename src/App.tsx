import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LanguageSelector from "./components/LanguageSelector";
import MediaGallery from "./components/MediaGallery";
import MediaUpload from "./components/MediaUpload";
import NotificationContainer from "./components/NotificationContainer";
import { MediaProvider } from "./context/MediaContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = t("app.title");
  }, [t]);

  // Fade in background
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NotificationProvider>
      <MediaProvider>
        <div className="min-h-screen font-serif text-sage-800">
          {/* Fixed background with fade-in effect */}
          <div
            className={`fixed inset-0 bg-cover bg-center bg-mountains bg-no-repeat z-[0] transition-opacity duration-1000 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundAttachment: "fixed",
              backgroundBlendMode: "soft-light",
              backgroundColor: "rgba(246, 247, 245, 0.75)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-beige-50/90 via-transparent to-sage-50/90"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 transition-opacity duration-1000 min-h-screen backdrop-blur-[1px]">
            <Header />
            <LanguageSelector />
            <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
              <section id="upload-section" className="max-w-3xl mx-auto md:mb-12 scroll-mt-20">
                <MediaUpload />
              </section>
              <section className="max-w-6xl mx-auto">
                <MediaGallery />
              </section>
            </main>
            <Footer />
            <NotificationContainer />
          </div>
        </div>
      </MediaProvider>
    </NotificationProvider>
  );
}

export default App;
