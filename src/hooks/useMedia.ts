import { useContext } from "react";
import { MediaContext } from "../context/MediaContext";

/**
 * Custom hook to access media context
 * @returns Media context values
 */
export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
