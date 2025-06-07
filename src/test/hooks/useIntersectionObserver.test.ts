import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

// Mock the Intersection Observer API
class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  // Test helper to simulate intersection
  simulateIntersection(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

describe("useIntersectionObserver Hook", () => {
  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    // Store the original implementation
    originalIntersectionObserver = window.IntersectionObserver;

    // Create mock elements
    document.body.innerHTML = `
      <div id="test-1"></div>
      <div id="test-2"></div>
      <div id="test-3"></div>
    `;
  });

  afterEach(() => {
    // Restore original implementation
    window.IntersectionObserver = originalIntersectionObserver;
    document.body.innerHTML = "";
  });
  it("initializes with empty visible items array", () => {
    // Setup mock
    window.IntersectionObserver = vi.fn(() => {
      // Return mock implementation
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        takeRecords: vi.fn().mockReturnValue([]),
        root: null,
        rootMargin: "",
        thresholds: [],
      } as unknown as IntersectionObserver;
    });

    const { result } = renderHook(() => useIntersectionObserver());

    // Initial state should be empty
    expect(result.current.visibleItems).toEqual([]);
    expect(result.current.setItemRef).toBeDefined();
    expect(result.current.unobserveItem).toBeDefined();
    expect(result.current.isVisible).toBeDefined();
  });

  it("tracks visible items correctly", () => {
    // Implementation of mock IntersectionObserver
    let mockObserver: MockIntersectionObserver;
    window.IntersectionObserver = vi.fn((callback) => {
      mockObserver = new MockIntersectionObserver(callback);
      return mockObserver as unknown as IntersectionObserver;
    });

    const { result } = renderHook(() => useIntersectionObserver());

    // Observe a few elements
    const element1 = document.getElementById("test-1")!;
    const element2 = document.getElementById("test-2")!;
    const element3 = document.getElementById("test-3")!;

    act(() => {
      result.current.setItemRef("test-1", element1);
      result.current.setItemRef("test-2", element2);
      result.current.setItemRef("test-3", element3);
    });

    // Simulate intersection for first element
    act(() => {
      mockObserver.simulateIntersection([
        {
          target: element1,
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ]);
    });

    // Check that the first element is visible
    expect(result.current.visibleItems).toContain("test-1");
    expect(result.current.isVisible("test-1")).toBe(true);
    expect(result.current.isVisible("test-2")).toBe(false);

    // Simulate intersection for second element
    act(() => {
      mockObserver.simulateIntersection([
        {
          target: element2,
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ]);
    });

    // Both elements should now be visible
    expect(result.current.visibleItems).toContain("test-1");
    expect(result.current.visibleItems).toContain("test-2");
    expect(result.current.isVisible("test-1")).toBe(true);
    expect(result.current.isVisible("test-2")).toBe(true);
    expect(result.current.isVisible("test-3")).toBe(false);
  });

  it("unobserves items properly", () => {
    // Implementation of mock IntersectionObserver
    const observeMock = vi.fn();
    const unobserveMock = vi.fn();

    window.IntersectionObserver = vi.fn(
      () =>
        ({
          observe: observeMock,
          unobserve: unobserveMock,
          disconnect: vi.fn(),
        } as unknown as IntersectionObserver)
    );

    const { result } = renderHook(() => useIntersectionObserver());

    // Observe an element
    const element = document.getElementById("test-1")!;

    act(() => {
      result.current.setItemRef("test-1", element);
    });

    expect(observeMock).toHaveBeenCalledWith(element);

    // Unobserve the element
    act(() => {
      result.current.unobserveItem("test-1");
    });

    expect(unobserveMock).toHaveBeenCalledWith(element);
  });

  it("cleans up observer on unmount", () => {
    const disconnectMock = vi.fn();

    window.IntersectionObserver = vi.fn(
      () =>
        ({
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: disconnectMock,
        } as unknown as IntersectionObserver)
    );

    const { unmount } = renderHook(() => useIntersectionObserver());

    // Unmount the hook
    unmount();

    // Should have called disconnect
    expect(disconnectMock).toHaveBeenCalled();
  });
});
