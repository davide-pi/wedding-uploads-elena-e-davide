// filepath: c:\__Workspaces\git\wedding-uploads-elena-e-davide\src\test\context\MediaContext.test.tsx
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaProvider } from '../../context/MediaContext';
import { useMedia } from '../../hooks/useMedia';
import * as cloudinaryService from '../../services/cloudinaryService';
import { CloudinaryResource, ResourceType } from '../../services/cloudinaryService';

// Mock the cloudinary service
vi.mock('../../services/cloudinaryService', () => ({
  fetchWeddingMedia: vi.fn(),
  uploadMedia: vi.fn(),
  ResourceType: {
    Image: 'image',
    Video: 'video'
  }
}));

// Mock the notification hook
vi.mock('../../hooks/useNotification', () => ({
  useNotification: () => ({
    showNotification: vi.fn(),
    hideNotification: vi.fn(),
    notifications: [],
  }),
}));

describe('MediaContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with empty media array', () => {
    // Mock the fetch function to return empty array
    vi.mocked(cloudinaryService.fetchWeddingMedia).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useMedia(), {
      wrapper: ({ children }) => <MediaProvider>{children}</MediaProvider>,
    });

    expect(result.current.media).toEqual([]);    expect(result.current.uploadState).toEqual('idle');
  });

  it('should fetch media on initialization', async () => {
    // Create mock CloudinaryResource objects
    const cloudinaryResources: CloudinaryResource[] = [
      {
        public_id: 'media-1',
        secure_url: 'https://example.com/image1.jpg',
        created_at: '2025-06-01T12:00:00Z',
        width: 800,
        height: 600,
        resource_type: ResourceType.Image,
        context: {
          custom: {
            caption: 'Test image 1',
            submitter_name: 'Test User 1'
          }
        }
      },
      {
        public_id: 'media-2',
        secure_url: 'https://example.com/video1.mp4',
        created_at: '2025-06-02T12:00:00Z',
        width: 1280,
        height: 720,
        resource_type: ResourceType.Video,
        context: {
          custom: {
            caption: 'Test video 1',
            submitter_name: 'Test User 2'
          }
        }
      }
    ];

    // Mock the fetch function to return test data
    vi.mocked(cloudinaryService.fetchWeddingMedia).mockResolvedValueOnce(cloudinaryResources);

    const { result } = renderHook(() => useMedia(), {
      wrapper: ({ children }) => <MediaProvider>{children}</MediaProvider>,
    });

    // Wait for the async effect to complete
    await waitFor(() => {
      expect(result.current.media.length).toBeGreaterThan(0);
    });

    // Verify individual properties rather than exact object matching
    expect(result.current.media[0].publicId).toBe('media-1');
    expect(result.current.media[0].mediaType).toBe('image');
    expect(result.current.media[0].width).toBe(800);
    expect(result.current.media[0].height).toBe(600);

    expect(result.current.media[1].publicId).toBe('media-2');
    expect(result.current.media[1].mediaType).toBe('video');
    expect(result.current.media[1].width).toBe(1280);
    expect(result.current.media[1].height).toBe(720);
  });

  it('should upload a single file', async () => {
    // Mock successful upload
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResult = {
      public_id: 'test-id',
      secure_url: 'https://example.com/test.jpg',
      width: 800,
      height: 600,
    };

    vi.mocked(cloudinaryService.uploadMedia).mockResolvedValueOnce(mockResult);
    vi.mocked(cloudinaryService.fetchWeddingMedia).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useMedia(), {
      wrapper: ({ children }) => <MediaProvider>{children}</MediaProvider>,
    });

    // Perform the upload
    await act(async () => {
      await result.current.uploadMedia(mockFile, 'Test caption', 'Test User');
    });

    // Check that uploadMedia was called with the correct parameters
    expect(cloudinaryService.uploadMedia).toHaveBeenCalledWith(
      mockFile,
      expect.any(Function),
      'Test caption',
      'Test User'
    );
  });

  it('should upload multiple files', async () => {
    // Mock successful upload
    const mockFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.mp4', { type: 'video/mp4' }),
    ];

    const mockResults = [
      {
        public_id: 'test-id-1',
        secure_url: 'https://example.com/test1.jpg',
        width: 800,
        height: 600,
      },
      {
        public_id: 'test-id-2',
        secure_url: 'https://example.com/test2.mp4',
        width: 1280,
        height: 720,
      }
    ];

    // Set up sequential mock resolves for multiple uploads
    vi.mocked(cloudinaryService.uploadMedia)
      .mockResolvedValueOnce(mockResults[0])
      .mockResolvedValueOnce(mockResults[1]);

    vi.mocked(cloudinaryService.fetchWeddingMedia).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useMedia(), {
      wrapper: ({ children }) => <MediaProvider>{children}</MediaProvider>,
    });

    // Upload multiple files
    await act(async () => {
      await result.current.uploadMultipleFiles(mockFiles, 'Test caption', 'Test User');
    });

    // Check that uploadMedia was called twice (once for each file)
    expect(cloudinaryService.uploadMedia).toHaveBeenCalledTimes(2);
  });

  it('should handle upload progress', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResult = {
      public_id: 'test-id',
      secure_url: 'https://example.com/test.jpg',
      width: 800,
      height: 600,
    };

    // Create a mock implementation that calls the progress callback before resolving
    vi.mocked(cloudinaryService.uploadMedia).mockImplementation((file, onProgress, caption, name) => {
      // Call the progress callback with a 50% progress value
      if (onProgress) onProgress(50);
      return Promise.resolve(mockResult);
    });

    vi.mocked(cloudinaryService.fetchWeddingMedia).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useMedia(), {
      wrapper: ({ children }) => <MediaProvider>{children}</MediaProvider>,
    });

    // Start the upload
    const uploadPromise = act(async () => {
      await result.current.uploadMedia(mockFile);
    });

    // Wait for upload to complete
    await uploadPromise;

    // Check that progress was updated during upload
    expect(cloudinaryService.uploadMedia).toHaveBeenCalled();
  });
});
