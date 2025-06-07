import { beforeEach, describe, expect, it, vi } from 'vitest';
import MediaGallery from '../../components/MediaGallery';
import { useMedia } from '../../hooks/useMedia';
import { useMediaModal } from '../../hooks/useMediaModal';
import { Media } from '../../types';
import { fireEvent, render, screen } from '../utils';

// Mock the hooks
vi.mock('../../hooks/useMedia', () => ({
  useMedia: vi.fn(),
}));

vi.mock('../../hooks/useMediaModal', () => ({
  useMediaModal: vi.fn(),
}));

// Mock the translation
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({    t: (key: string) => {
        const translations: Record<string, string> = {
          'gallery.empty': 'No photos or videos yet',
          'gallery.uploadPrompt': 'Be the first to share a memory',
          'gallery.title': 'Gallery',
          'gallery.subtitle': 'Shared Memories',
          'gallery.mediaGallery.line1': 'Gallery',
          'gallery.mediaGallery.line2': 'Shared Memories',
          'gallery.noMedia': 'No photos or videos yet',
          'gallery.beFirst': 'Be the first to share a memory',
        };
        return translations[key] || key;
      },
    }),
  };
});

// Define the MediaItem type to match what's used in the component
type MediaItemType = {
  id: string;
  mediaType: 'video' | 'image';
  url: string;
  caption?: string;
};

// Mock the MediaItem component instead of lazy components
vi.mock('../../components/MediaItem', () => ({
  default: ({ media, onClick }: { media: MediaItemType; onClick?: (media: MediaItemType) => void }) => (
    media.mediaType === 'video' ?
      <div onClick={() => onClick && onClick(media)} data-testid="lazy-video">
        <video src={media.url} data-testid="video-element">Video: {media.caption}</video>
      </div> :
      <div onClick={() => onClick && onClick(media)} data-testid="lazy-image">
        <img src={media.url} data-testid="image-element" alt={media.caption} />
        Image: {media.caption}
      </div>
  )
}));

// Explicitly type mock data to conform to Media interface
describe('MediaGallery Component', () => {
  const mockMediaItems: Media[] = [
    {
      id: '1',
      mediaType: 'image',
      url: 'https://example.com/image1.jpg',
      caption: 'Image 1',
      publicId: 'public-id-1',
      createdAt: new Date(),
      width: 800,
      height: 600,
    },
    {
      id: '2',
      mediaType: 'video',
      url: 'https://example.com/video1.mp4',
      caption: 'Video 1',
      publicId: 'public-id-2',
      createdAt: new Date(),
      width: 1920,
      height: 1080,
    },
  ];

  const mockOpenModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock implementation of useMedia hook
    vi.mocked(useMedia).mockReturnValue({
      media: mockMediaItems,
      sortedMedia: mockMediaItems,
      uploadState: 'idle',
      uploadMedia: vi.fn(),
      uploadMultipleFiles: vi.fn(),
    });

    // Mock implementation of useMediaModal hook
    vi.mocked(useMediaModal).mockReturnValue({
      selectedMedia: null,
      openModal: mockOpenModal,
      closeModal: vi.fn(),
      isModalOpen: false,
    });
  });

  it('renders empty state when no media items', () => {
    // Mock empty media array
    vi.mocked(useMedia).mockReturnValue({
      media: [],
      sortedMedia: [],
      uploadMedia: vi.fn(),
      uploadMultipleFiles: vi.fn(),
      uploadState: 'idle',
    });

    vi.mocked(useMediaModal).mockReturnValue({
      isModalOpen: false,
      selectedMedia: null,
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<MediaGallery />);

    // Check for gallery title and subtitle
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Shared Memories')).toBeInTheDocument();

    // Check for empty state message
    expect(screen.getByText('No photos or videos yet')).toBeInTheDocument();
    expect(screen.getByText('Be the first to share a memory')).toBeInTheDocument();
  });

  it('renders media items in a grid', () => {
    // Mock media items
    vi.mocked(useMedia).mockReturnValue({
      media: mockMediaItems,
      sortedMedia: mockMediaItems,
      uploadMedia: vi.fn(),
      uploadMultipleFiles: vi.fn(),
      uploadState: 'idle',
    });

    vi.mocked(useMediaModal).mockReturnValue({
      isModalOpen: false,
      selectedMedia: null,
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<MediaGallery />);

    // Check for rendered media items
    const images = screen.getAllByTestId('lazy-image');
    const videos = screen.getAllByTestId('lazy-video');

    // We should have 1 image and 1 video based on our mock data
    expect(images.length).toBe(1);
    expect(videos.length).toBe(1);

    // Verify image sources are set correctly using the img element inside the container
    const imgElements = screen.getAllByTestId('image-element');
    const videoElements = screen.getAllByTestId('video-element');
    expect(imgElements[0]).toHaveAttribute('src', mockMediaItems[0].url);
    expect(videoElements[0]).toHaveAttribute('src', mockMediaItems[1].url);
  });

  it('opens modal when media item is clicked', () => {
    render(<MediaGallery />);

    // Click on the first image
    const firstImage = screen.getAllByTestId('lazy-image')[0];
    fireEvent.click(firstImage);

    // Check that openModal was called with the correct media item
    expect(mockOpenModal).toHaveBeenCalled();

    // Check the media item being passed has the expected ID
    const calledWithMedia = mockOpenModal.mock.calls[0][0];
    expect(calledWithMedia.id).toBe(mockMediaItems[0].id);
  });

  it('renders media items correctly', () => {
    render(<MediaGallery />);

    // Check image rendering
    const imageElement = screen.getByTestId('lazy-image');
    expect(imageElement).toBeInTheDocument();

    // Check img tag inside the container has the src attribute
    const imgElement = screen.getByTestId('image-element');
    expect(imgElement).toHaveAttribute('src', mockMediaItems[0].url);

    // Check video rendering
    const videoElement = screen.getByTestId('lazy-video');
    expect(videoElement).toBeInTheDocument();

    const videoSrcElement = screen.getByTestId('video-element');
    expect(videoSrcElement).toHaveAttribute('src', mockMediaItems[1].url);
  });

  it('calls openModal with correct media', () => {
    render(<MediaGallery />);

    // Simulate click on media item
    const imageElement = screen.getByTestId('lazy-image');
    fireEvent.click(imageElement);

    // Verify openModal is called with correct media
    expect(mockOpenModal).toHaveBeenCalled();
    const calledWithMedia = mockOpenModal.mock.calls[0][0];
    expect(calledWithMedia).toEqual(mockMediaItems[0]);
  });
});
