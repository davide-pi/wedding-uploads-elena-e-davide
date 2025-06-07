import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMediaModal } from "../../hooks/useMediaModal";
import { mockMediaItems } from "../utils";

describe("useMediaModal Hook", () => {
  it("should initialize with closed modal", () => {
    const { result } = renderHook(() => useMediaModal());

    expect(result.current.selectedMedia).toBeNull();
    expect(result.current.isModalOpen).toBe(false);
  });

  it("should open modal with selected media", () => {
    const { result } = renderHook(() => useMediaModal());

    // Open the modal with a media item
    act(() => {
      result.current.openModal(mockMediaItems[0]);
    });

    // Verify modal state
    expect(result.current.selectedMedia).toEqual(mockMediaItems[0]);
    expect(result.current.isModalOpen).toBe(true);
  });

  it("should close modal", () => {
    const { result } = renderHook(() => useMediaModal());

    // First open the modal
    act(() => {
      result.current.openModal(mockMediaItems[0]);
    });

    // Then close it
    act(() => {
      result.current.closeModal();
    });

    // Verify modal closed
    expect(result.current.selectedMedia).toBeNull();
    expect(result.current.isModalOpen).toBe(false);
  });
});
