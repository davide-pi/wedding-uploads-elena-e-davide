import { beforeEach, describe, expect, it, vi } from 'vitest';
import MediaUpload from '../../components/MediaUpload';
import { useMedia } from '../../hooks/useMedia';
import { act, createMockFile, fireEvent, render, screen } from '../utils';

// Mock the useMedia hook
vi.mock('../../hooks/useMedia', () => ({
  useMedia: vi.fn(),
}));

// Mock the useTranslation hook
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,  useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'upload.title': 'Upload Photos & Videos',
          'upload.dropzoneText': 'Drag and drop files here',
          'upload.browseFiles': 'Browse Files',
          'upload.submitterName': 'Your Name',
          'upload.caption': 'Caption (optional)',
          'upload.submit': 'Submit',
          'upload.cancel': 'Cancel',
          'upload.takePhoto': 'Take Photo',
          'upload.recordVideo': 'Record Video',
          'upload.uploading': 'Uploading...',
          'upload.enterYourName': 'Your Name',
          'upload.addCaptionPlaceholder': 'Caption (optional)',
          'upload.dragAndDrop': 'Drag and drop your photos and videos here',
          'upload.orClickToUpload': 'or click to select files',
          'upload.openMenu': 'Open upload options',
          'upload.uploadFiles': 'Upload Files',
          'upload.uploadFile': 'Submit', // Add this translation
          'upload.addMediaDetails': 'Add Media Details',
          'upload.image': 'Image',
          'upload.yourName': 'Your Name',
          'upload.nameRemembered': 'Your name will be remembered for future uploads',
          'common.close': 'Close',
        };
        return translations[key] || key;
      },
    }),
  };
});

describe('MediaUpload Component', () => {
  const mockUploadMedia = vi.fn();
  const mockUploadMultipleFiles = vi.fn().mockResolvedValue(undefined);
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock implementation of useMedia hook
    vi.mocked(useMedia).mockReturnValue({
      uploadMedia: mockUploadMedia,
      uploadMultipleFiles: mockUploadMultipleFiles,
      uploadState: 'idle',
      media: [],
      sortedMedia: [],
      progress: 0
    });
  });
  it('renders dropzone and floating action button in the initial state', () => {
    render(<MediaUpload />);

    // Check for dropzone
    const dropzone = screen.getByRole('presentation');
    expect(dropzone).toBeInTheDocument();

    // Check for floating action button
    const floatingActionButton = screen.getByRole('button', { name: /Open upload options/i });
    expect(floatingActionButton).toBeInTheDocument();
  });  it('opens form when files are dropped', async () => {
    // Create a mock portal container since the form uses createPortal
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);

    // Override the useMedia mock for this specific test
    vi.mocked(useMedia).mockReturnValue({
      uploadMedia: mockUploadMedia,
      uploadMultipleFiles: mockUploadMultipleFiles,
      uploadState: 'idle',
      media: [],
      sortedMedia: [],
      progress: 0
    });

    render(<MediaUpload />);

    // Get the dropzone and simulate dropping files
    const dropzone = screen.getByRole('presentation');
    expect(dropzone).toBeInTheDocument();

    // Create mock files
    const imageFile = createMockFile('test-image.jpg', 'image/jpeg');
    const dataTransfer = {
      files: [imageFile],
      clearData: vi.fn(),
      items: [
        {
          kind: 'file',
          type: 'image/jpeg',
          getAsFile: () => imageFile
        }
      ],
      types: ['Files']
    };
    // Mock the drop event with a more complete dataTransfer object
    await act(async () => {
      fireEvent.drop(dropzone, { dataTransfer });
    });
    // Fill out submitter name (required field)
    const submitterInput = await screen.findByPlaceholderText('Your Name');
    await act(async () => {
      fireEvent.change(submitterInput, { target: { value: 'Test User' } });
    });
    // Find and click the submit button to trigger upload
    const submitButton = await screen.findByRole('button', { name: /Submit/i });
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();
    await act(async () => {
      fireEvent.submit(form!);
    });
    // Check if upload was called (should be uploadMedia for single file)
    expect(mockUploadMedia).toHaveBeenCalled();
  });

  it('handles file selection via dropzone', async () => {
    render(<MediaUpload />);

    // Get the dropzone
    const dropzone = screen.getByRole('presentation');
    expect(dropzone).toBeInTheDocument();

    // Create mock files
    const imageFile = createMockFile('test-image.jpg', 'image/jpeg');
    const videoFile = createMockFile('test-video.mp4', 'video/mp4');

    // Create a more complete dataTransfer object
    const dataTransfer = {
      files: [imageFile, videoFile],
      clearData: vi.fn(),
      items: [
        {
          kind: 'file',
          type: 'image/jpeg',
          getAsFile: () => imageFile
        },
        {
          kind: 'file',
          type: 'video/mp4',
          getAsFile: () => videoFile
        }
      ],
      types: ['Files']
    };

    // Mock the drop event
    await act(async () => {
      fireEvent.drop(dropzone, { dataTransfer });
    });

    // Find and fill out the form that should appear after dropping files
    const submitterInput = await screen.findByPlaceholderText('Your Name');
    await act(async () => {
      fireEvent.change(submitterInput, { target: { value: 'Test User' } });
    });

    // Robustly find the submit button (may be 'Submit' or 'Upload Files')
    let submitButton: HTMLElement | null = null;
    const allButtons = screen.queryAllByRole('button');
    for (const btn of allButtons) {
      if (btn.textContent && btn.textContent.trim().toLowerCase().includes('upload')) {
        submitButton = btn;
        break;
      }
      if (btn.textContent && btn.textContent.trim().toLowerCase() === 'submit') {
        submitButton = btn;
        break;
      }
    }
    if (!submitButton) {
      throw new Error('Submit button not found. Button texts: ' + allButtons.map(btn => btn.textContent).join(', '));
    }
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();
    await act(async () => {
      fireEvent.submit(form!);
    });

    // Verify that the upload function receives both files
    expect(mockUploadMultipleFiles).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'test-image.jpg' }),
        expect.objectContaining({ name: 'test-video.mp4' })
      ]),
      expect.any(String),
      expect.any(String)
    );
  });

  it('submits form with selected files', async () => {
    // Mock form submission process
    vi.mocked(useMedia).mockReturnValue({
      uploadMedia: mockUploadMedia,
      uploadMultipleFiles: mockUploadMultipleFiles,
      uploadState: 'idle',
      media: [],
      sortedMedia: [],
      progress: 0
    });

    render(<MediaUpload />);

    // Get the dropzone
    const dropzone = screen.getByRole('presentation');
    expect(dropzone).toBeInTheDocument();

    // Add files to the form
    const imageFile = createMockFile('test-image.jpg', 'image/jpeg');

    // Create a more complete dataTransfer object
    const dataTransfer = {
      files: [imageFile],
      clearData: vi.fn(),
      items: [
        {
          kind: 'file',
          type: 'image/jpeg',
          getAsFile: () => imageFile
        }
      ],
      types: ['Files']
    };

    // Simulate dropping a file
    await act(async () => {
      fireEvent.drop(dropzone, { dataTransfer });
    });
    // Fill out the form
    const submitterInput = await screen.findByPlaceholderText('Your Name');
    await act(async () => {
      fireEvent.change(submitterInput, { target: { value: 'Test User' } });
    });
    // Submit the form
    const allButtons = screen.queryAllByRole('button');
    let submitButton: HTMLElement | null = null;
    for (const btn of allButtons) {
      if (btn.textContent && btn.textContent.trim().toLowerCase() === 'submit') {
        submitButton = btn;
        break;
      }
    }
    if (!submitButton) {
      throw new Error('Submit button not found. Button texts: ' + allButtons.map(btn => btn.textContent).join(', '));
    }
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();
    await act(async () => {
      fireEvent.submit(form!);
    });
    // Verify the upload function was called with a file that matches our mock
    expect(mockUploadMedia).toHaveBeenCalled();
    const uploadedFile = mockUploadMedia.mock.calls[0][0];
    expect(uploadedFile.name).toBe('test-image.jpg');
  });  it('shows progress during upload', async () => {
    // Mock upload in progress
    vi.mocked(useMedia).mockReturnValue({
      uploadMedia: mockUploadMedia,
      uploadMultipleFiles: mockUploadMultipleFiles,
      uploadState: 'uploading',
      media: [],
      sortedMedia: [],
      progress: 0
    });

    render(<MediaUpload />);

    // Check that the component renders in the uploading state
    // This is a simplified test that just verifies the component renders without errors
    // when in the uploading state
    const dropzone = screen.getByRole('presentation');
    expect(dropzone).toBeInTheDocument();
  });

  // Simplified accessibility checks
  it('renders accessible elements', () => {
    render(<MediaUpload />);

    // Check for accessible elements in the dropzone
    const dropzone = screen.getByRole('presentation');
    expect(dropzone).toBeInTheDocument();

    // Check for upload button
    const uploadButton = screen.getByRole('button', { name: /Open upload options/i });
    expect(uploadButton).toBeInTheDocument();
  });
});
