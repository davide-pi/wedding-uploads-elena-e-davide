import { useCallback, useState } from "react";
import { Media } from "../types";

/**
 * Custom hook for managing media selection and modal state
 *
 * @returns Hook state and functions for media modal management
 */
export const useMediaModal = () => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const openModal = useCallback((media: Media) => {
    setSelectedMedia(media);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMedia(null);
  }, []);

  return {
    selectedMedia,
    openModal,
    closeModal,
    isModalOpen: Boolean(selectedMedia),
  };
};
