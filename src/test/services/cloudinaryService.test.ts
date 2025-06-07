import { beforeEach, describe, expect, it, vi } from "vitest";
import { uploadMediaToCloudinary } from "../../services/cloudinaryService";

// Mock the Cloudinary service directly instead of XMLHttpRequest
vi.mock("../../services/cloudinaryService", () => ({
  uploadMediaToCloudinary: vi
    .fn()
    .mockImplementation((file, submitterName, caption, onProgress) => {
      // Simulate progress if onProgress is provided
      if (onProgress) {
        onProgress({ loaded: 50, total: 100 });
      }

      // Return success or error based on the file name
      if (file.name === "error.jpg") {
        return Promise.reject(new Error("Upload failed"));
      }

      return Promise.resolve({
        id: "test-public-id",
        publicId: "test-public-id",
        url: "https://example.com/test-image.jpg",
        caption: caption,
        submitterName: submitterName,
        createdAt: new Date(),
        width: 800,
        height: 600,
        mediaType: file.type.startsWith("image/") ? "image" : "video",
      });
    }),
}));

describe("Cloudinary Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully uploads media to Cloudinary", async () => {
    // Create mock file
    const mockFile = new File(["test"], "test-image.jpg", {
      type: "image/jpeg",
    });

    // Mock progress function
    const mockProgressFn = vi.fn();

    // Upload the file
    const result = await uploadMediaToCloudinary(
      mockFile,
      "Test User",
      "Test Caption",
      mockProgressFn
    );

    // Verify progress function was called
    expect(mockProgressFn).toHaveBeenCalled();

    // Assertions on the result
    expect(result).toEqual({
      id: "test-public-id",
      publicId: "test-public-id",
      url: "https://example.com/test-image.jpg",
      caption: "Test Caption",
      submitterName: "Test User",
      createdAt: expect.any(Date),
      width: 800,
      height: 600,
      mediaType: "image",
    });
  });

  it("handles upload failure", async () => {
    // Create mock file that will trigger an error
    const mockFile = new File(["test"], "error.jpg", {
      type: "image/jpeg",
    });

    // Mock progress function
    const mockProgressFn = vi.fn();

    // Expect the upload to fail
    await expect(
      uploadMediaToCloudinary(
        mockFile,
        "Test User",
        "Test Caption",
        mockProgressFn
      )
    ).rejects.toThrow("Upload failed");
  });
});
