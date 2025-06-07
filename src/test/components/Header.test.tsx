import { describe, expect, it, vi } from 'vitest';
import Header from '../../components/Header';
import { render, screen } from '../utils';

// Mock the i18n translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({      t: (key: string) => {
        const translations: Record<string, string> = {
          'gallery.title': 'Elena & Davide',
          'gallery.subtitle': 'Galleria del matrimonio'
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

describe('Header Component', () => {
  it('renders header with title and subtitle', () => {
    render(<Header />);

    // Check for title and subtitle
    expect(screen.getByText('Elena & Davide')).toBeInTheDocument();
    expect(screen.getByText('Galleria del matrimonio')).toBeInTheDocument();

    // Check for mountain icon (can verify it exists by role)
    const mountainIcon = document.querySelector('svg');
    expect(mountainIcon).toBeInTheDocument();
  });
});
