import { beforeEach, describe, expect, it, vi } from 'vitest';
import MediaModal from '../../components/MediaModal';
import { fireEvent, mockMediaItems, render, screen } from '../utils';

// Mock the date-fns format function
vi.mock('date-fns', () => ({
  format: () => 'June 1, 2025'
}));

describe('MediaModal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders an image correctly', () => {
    const imageMedia = mockMediaItems[0];

    render(
      <MediaModal
        media={imageMedia}
        onClose={mockOnClose}
      />
    );

    // Check for image
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBe(imageMedia.url);

    // Check for caption and metadata
    expect(screen.getByText(imageMedia.caption)).toBeInTheDocument();
    expect(screen.getByText(imageMedia.submitterName)).toBeInTheDocument();

    // Check for formatted date
    expect(screen.getByText('June 1, 2025')).toBeInTheDocument();
  });
  it('renders a video correctly', () => {
    const videoMedia = mockMediaItems[1]; // This should be a video in the mock data

    render(
      <MediaModal
        media={videoMedia}
        onClose={mockOnClose}
      />
    );

    // Check for video element - video is not a standard ARIA role, so we query by tag name
    const video = screen.getByTestId('media-video');
    expect(video).toBeInTheDocument();
    expect(video.getAttribute('src')).toBe(videoMedia.url);

    // Check for controls
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('autoplay');
  });

  it('calls onClose when the close button is clicked', () => {
    const imageMedia = mockMediaItems[0];

    render(
      <MediaModal
        media={imageMedia}
        onClose={mockOnClose}
      />
    );

    // Find and click the close button (X button)
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    // Check that onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const imageMedia = mockMediaItems[0];

    render(
      <MediaModal
        media={imageMedia}
        onClose={mockOnClose}
      />
    );

    // Find the first div with the backdrop properties (the outer container)
    const backdrop = document.querySelector('.fixed.inset-0.z-50');
    expect(backdrop).not.toBeNull();

    // Click on the backdrop (this is the div with handleBackdropClick)
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    // Check that onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', () => {
    const imageMedia = mockMediaItems[0];

    render(
      <MediaModal
        media={imageMedia}
        onClose={mockOnClose}
      />
    );

    // Simulate ESC key press
    fireEvent.keyDown(window, { key: 'Escape' });

    // Check that onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
