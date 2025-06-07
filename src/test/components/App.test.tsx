import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';

// Mock all the child components
vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

vi.mock('../../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer Component</div>,
}));

vi.mock('../../components/LanguageSelector', () => ({
  default: () => <div data-testid="language-selector">Language Selector Component</div>,
}));

vi.mock('../../components/MediaGallery', () => ({
  default: () => <div data-testid="media-gallery">Media Gallery Component</div>,
}));

vi.mock('../../components/MediaUpload', () => ({
  default: () => <div data-testid="media-upload">Media Upload Component</div>,
}));

vi.mock('../../components/NotificationContainer', () => ({
  default: () => <div data-testid="notification-container">Notification Container</div>,
}));

// Mock the translation hook
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'app.title': 'Elena & Davide - Wedding Gallery',
        };
        return translations[key] || key;
      },
      i18n: {
        changeLanguage: vi.fn(),
        language: 'it',
      },
    }),
  };
});

describe('App Component', () => {
  beforeEach(() => {
    // Mock the console.log to prevent test output clutter
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock document title
    document.title = '';

    // Reset timer mocks
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders all main components', () => {
    render(<App />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    expect(screen.getByTestId('media-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('media-upload')).toBeInTheDocument();
    expect(screen.getByTestId('notification-container')).toBeInTheDocument();
  });

  it('sets document title correctly', () => {
    render(<App />);

    expect(document.title).toBe('Elena & Davide - Wedding Gallery');
  });

  it('fades in the background after timeout', () => {
    render(<App />);

    // Background should initially have opacity-0 class
    const background = document.querySelector('.fixed.inset-0.bg-cover');
    expect(background).toHaveClass('opacity-0');

    // After timeout, it should have opacity-100 class
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(background).toHaveClass('opacity-100');
  });

  it('provides MediaProvider and NotificationProvider context', () => {
    const { container } = render(<App />);

    // Just check that we have the main structure with providers
    // The actual provider testing is done in their specific test files
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId('media-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('notification-container')).toBeInTheDocument();
  });
});
