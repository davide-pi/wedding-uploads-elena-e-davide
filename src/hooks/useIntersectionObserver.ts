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

  /**
   * Whether to keep items visible once they've been observed
   * @default true
   */
  keepVisible?: boolean;
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
  // Keep track of items that were visible but aren't anymore
  const [previouslyVisibleItems, setPreviouslyVisibleItems] = useState<
    string[]
  >([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Merge options with defaults
  const { rootMargin = "200px", threshold = 0, keepVisible = true } = options;

  // Set up the intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisible: string[] = [];
        const newInvisible: string[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            newVisible.push(entry.target.id);
          } else if (!keepVisible) {
            // Only track items becoming invisible if keepVisible is false
            newInvisible.push(entry.target.id);
          }
        });

        if (newVisible.length > 0) {
          setVisibleItems((prev) => [...new Set([...prev, ...newVisible])]);
        }

        if (!keepVisible && newInvisible.length > 0) {
          setVisibleItems((prev) =>
            prev.filter((id) => !newInvisible.includes(id))
          );

          // Move items to previouslyVisible when they go out of view
          setPreviouslyVisibleItems((prev) => [
            ...new Set([...prev, ...newInvisible]),
          ]);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    // Clean up observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [rootMargin, threshold, keepVisible]);

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
    previouslyVisibleItems,
    setItemRef,
    unobserveItem,
    isVisible: useCallback(
      (id: string) => visibleItems.includes(id),
      [visibleItems]
    ),
    wasVisible: useCallback(
      (id: string) => previouslyVisibleItems.includes(id),
      [previouslyVisibleItems]
    ),
  };
};
