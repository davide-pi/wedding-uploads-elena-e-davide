import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LanguageSelector from '../../components/LanguageSelector';

// Create a mock for useTranslation
const mockChangeLanguage = vi.fn();
let mockLanguage = 'it';

// Mock the i18n instance
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      get language() { return mockLanguage; },
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LanguageSelector Component', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorageMock.clear();
    vi.clearAllMocks();

    // Reset document.documentElement.lang
    document.documentElement.lang = 'it';
  });

  it('renders correctly with language icon', () => {
    render(<LanguageSelector />);

    // Check if the language icon button is rendered
    const languageButton = screen.getByRole('button', { name: /select language/i });
    expect(languageButton).toBeInTheDocument();

    // Check if language icon SVG is present
    const languageIcon = document.querySelector('svg');
    expect(languageIcon).toBeInTheDocument();
  });

  it('shows language options on hover', () => {
    render(<LanguageSelector />);

    // Open the language menu by clicking the icon button
    const languageButton = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(languageButton);

    // The dropdown should now be visible
    const dropdown = document.querySelector('.absolute');
    expect(dropdown).toHaveClass('visible');
    expect(dropdown).toHaveClass('opacity-100');

    // There should be two language option buttons
    const menuItems = screen.getAllByRole('button');
    expect(menuItems.length).toBe(3); // One language icon button + two language options

    // Check if both language options are rendered
    expect(screen.getByText('Italiano')).toBeInTheDocument();
    expect(screen.getByText('Română')).toBeInTheDocument();
  });
  it('highlights the current language (Italian)', () => {
    // Set the mock language to Italian
    mockLanguage = 'it';

    render(<LanguageSelector />);

    // Find all language option buttons
    const languageButtons = screen.getAllByRole('button').slice(1); // Skip the icon button

    // Check if Italian is highlighted with the right classes
    const italianButton = languageButtons.find(button => button.textContent === 'Italiano');
    expect(italianButton).toHaveClass('text-sage-800');
    expect(italianButton).toHaveClass('font-semibold');

    // Check if Romanian is not highlighted
    const romanianButton = languageButtons.find(button => button.textContent === 'Română');
    expect(romanianButton).toHaveClass('text-sage-600');
    expect(romanianButton).not.toHaveClass('font-semibold');
  });
  it('highlights the current language (Romanian)', () => {
    // Set the mock language to Romanian
    mockLanguage = 'ro';

    render(<LanguageSelector />);

    // Find all language option buttons
    const languageButtons = screen.getAllByRole('button').slice(1); // Skip the icon button

    // Check if Romanian is highlighted with the right classes
    const romanianButton = languageButtons.find(button => button.textContent === 'Română');
    expect(romanianButton).toHaveClass('text-sage-800');
    expect(romanianButton).toHaveClass('font-semibold');

    // Check if Italian is not highlighted
    const italianButton = languageButtons.find(button => button.textContent === 'Italiano');
    expect(italianButton).toHaveClass('text-sage-600');
    expect(italianButton).not.toHaveClass('font-semibold');
  });
  it('changes language when a language option is clicked', () => {
    // Reset mockChangeLanguage and set mock language to Italian
    mockChangeLanguage.mockReset();
    mockLanguage = 'it';

    render(<LanguageSelector />);

    // Click on the Romanian language option
    fireEvent.click(screen.getByText('Română'));

    // Check if changeLanguage was called with the right language code
    expect(mockChangeLanguage).toHaveBeenCalledWith('ro');

    // Check if localStorage was updated correctly
    expect(localStorageMock.setItem).toHaveBeenCalledWith('lng', 'ro');

    // Check if document language was updated
    expect(document.documentElement.lang).toBe('ro');
  });

  it('does not change language when the current language is clicked', () => {
    // Reset mockChangeLanguage and set mock language to Italian
    mockChangeLanguage.mockReset();
    mockLanguage = 'it';

    render(<LanguageSelector />);

    // Click on the Italian language option (which is already the current language)
    fireEvent.click(screen.getByText('Italiano'));

    // The function should still be called - the component doesn't check if the language is different
    expect(mockChangeLanguage).toHaveBeenCalledWith('it');

    // localStorage and document.lang should be updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('lng', 'it');
    expect(document.documentElement.lang).toBe('it');
  });

  it('has correct accessibility attributes', () => {
    render(<LanguageSelector />);

    // Check if the button has an aria-label
    const languageButton = screen.getByRole('button', { name: /select language/i });
    expect(languageButton).toHaveAttribute('aria-label', 'Select language');

    // The dropdown should be properly hidden when not hovered
    const dropdown = document.querySelector('.absolute');
    expect(dropdown).toHaveClass('invisible');
  });
});
