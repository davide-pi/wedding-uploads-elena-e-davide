import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationProvider } from '../../context/NotificationContext';
import { useNotification } from '../../hooks/useNotification';

describe('NotificationContext', () => {
  // Set up the mocks
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // Clean up after tests
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show and auto-hide notifications', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: ({ children }) => <NotificationProvider>{children}</NotificationProvider>,
    });

    // Initial state should have no notifications
    expect(result.current.notifications).toEqual([]);

    // Show a notification
    let notificationId: string;
    act(() => {
      notificationId = result.current.showNotification('success', 'Test notification', 3000);
    });

    // Should have one notification
    expect(result.current.notifications.length).toBe(1);
    expect(result.current.notifications[0].message).toBe('Test notification');
    expect(result.current.notifications[0].type).toBe('success');
    expect(result.current.notifications[0].id).toBe(notificationId);

    // Fast-forward time to trigger auto-dismiss
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Notification should be removed after timeout
    expect(result.current.notifications.length).toBe(0);
  });

  it('should manually hide notifications', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: ({ children }) => <NotificationProvider>{children}</NotificationProvider>,
    });

    // Show a notification without auto-dismiss
    let notificationId: string;
    act(() => {
      notificationId = result.current.showNotification('error', 'Error message', 0);
    });

    // Verify notification was added
    expect(result.current.notifications.length).toBe(1);

    // Manually hide the notification
    act(() => {
      result.current.hideNotification(notificationId);
    });

    // Notification should be removed
    expect(result.current.notifications.length).toBe(0);
  });

  it('should handle multiple notifications', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: ({ children }) => <NotificationProvider>{children}</NotificationProvider>,
    });

    // Show multiple notifications
    act(() => {
      result.current.showNotification('success', 'First notification');
      result.current.showNotification('info', 'Second notification');
      result.current.showNotification('error', 'Third notification');
    });

    // Should have three notifications
    expect(result.current.notifications.length).toBe(3);
    expect(result.current.notifications[0].type).toBe('success');
    expect(result.current.notifications[1].type).toBe('info');
    expect(result.current.notifications[2].type).toBe('error');

    // Fast-forward time to trigger auto-dismiss for all
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // All notifications should be removed
    expect(result.current.notifications.length).toBe(0);
  });
});
