import { useCallback, useEffect, useRef, useState } from "react";

interface IntersectionObserverOptions {
  /**
   * Margin around the root element
   * @default '200px'
   */
  rootMargin?: string;

  /**
   * Threshold at which the observer callback is invoked
   * @default 0
   */
  threshold?: number | number[];
}

/**
 * Custom hook for handling intersection observer logic for lazy loading
 *
 * @param options - Intersection observer configuration options
 * @returns Hook state and functions for intersection observer management
 */
export const useIntersectionObserver = (
  options: IntersectionObserverOptions = {}
) => {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Set up the intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id);

        if (newVisible.length > 0) {
          setVisibleItems((prev) => [...new Set([...prev, ...newVisible])]);
        }
      },
      {
        rootMargin: options.rootMargin || "200px",
        threshold: options.threshold || 0,
      }
    );

    // Clean up observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options.rootMargin, options.threshold]);

  // Handle observing new elements
  const setItemRef = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (!element || !id) return;

      // Only observe if the element isn't already visible
      if (observerRef.current && !visibleItems.includes(id)) {
        // Store reference to the element
        itemRefs.current.set(id, element);
        observerRef.current.observe(element);
      }
    },
    [visibleItems]
  );

  // Unobserve an item that's no longer needed
  const unobserveItem = useCallback((id: string) => {
    const element = itemRefs.current.get(id);
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
      itemRefs.current.delete(id);
    }
  }, []);

  return {
    visibleItems,
    setItemRef,
    unobserveItem,
    isVisible: useCallback(
      (id: string) => visibleItems.includes(id),
      [visibleItems]
    ),
  };
};
