import { beforeEach, describe, expect, it, vi } from 'vitest';
import Notification from '../../components/Notification';
import { Notification as NotificationType } from '../../context/NotificationContext';
import { fireEvent, render, screen } from '../utils';

describe('Notification Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders success notification correctly', () => {
    const notification: NotificationType = {
      id: '1',
      type: 'success',
      message: 'Upload successful!'
    };

    render(
      <Notification
        notification={notification}
        onClose={mockOnClose}
      />
    );

    // Check for message
    expect(screen.getByText('Upload successful!')).toBeInTheDocument();    // Check for success styling
    const notificationElement = screen.getByText('Upload successful!').closest('div.flex');
    expect(notificationElement).toHaveClass('bg-green-100');
    expect(notificationElement).toHaveClass('text-green-800');
  });

  it('renders error notification correctly', () => {
    const notification: NotificationType = {
      id: '2',
      type: 'error',
      message: 'Upload failed!'
    };

    render(
      <Notification
        notification={notification}
        onClose={mockOnClose}
      />
    );

    // Check for message
    expect(screen.getByText('Upload failed!')).toBeInTheDocument();    // Check for error styling
    const notificationElement = screen.getByText('Upload failed!').closest('div.flex');
    expect(notificationElement).toHaveClass('bg-red-100');
    expect(notificationElement).toHaveClass('text-red-800');
  });

  it('renders info notification correctly', () => {
    const notification: NotificationType = {
      id: '3',
      type: 'info',
      message: 'Uploading in progress...'
    };

    render(
      <Notification
        notification={notification}
        onClose={mockOnClose}
      />
    );

    // Check for message
    expect(screen.getByText('Uploading in progress...')).toBeInTheDocument();    // Check for info styling
    const notificationElement = screen.getByText('Uploading in progress...').closest('div.flex');
    expect(notificationElement).toHaveClass('bg-blue-100');
    expect(notificationElement).toHaveClass('text-blue-800');
  });

  it('calls onClose when close button is clicked', () => {
    const notification: NotificationType = {
      id: '1',
      type: 'success',
      message: 'Upload successful!'
    };

    render(
      <Notification
        notification={notification}
        onClose={mockOnClose}
      />
    );

    // Find and click the close button (it has an SVG icon)
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    // Check that onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
