// filepath: c:\__Workspaces\git\wedding-uploads-elena-e-davide\src\test\utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MediaProvider } from '../context/MediaContext';
import { NotificationProvider } from '../context/NotificationContext';
import i18n from '../i18n/config';

/**
 * Set up a mock document body for tests that need it
 */
// Ensure we have a valid document.body for testing
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // This is a workaround for Happy DOM issues with document.body
  if (!document.body) {
    const body = document.createElement('body');
    document.documentElement.appendChild(body);
  }

  // Create portal root element for components that use portals
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal-root');
  document.body.appendChild(portalRoot);
}

/**
 * Custom render method that includes global providers
 */
const customRender = (
  ui: ReactNode,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const AllProviders = ({ children }: { children: ReactNode }) => (
    <I18nextProvider i18n={i18n}>
      <NotificationProvider>
        <MediaProvider>
          {children}
        </MediaProvider>
      </NotificationProvider>
    </I18nextProvider>
  );

  return render(ui, { wrapper: AllProviders, ...options });
};

// Mock data for testing
export const mockMediaItems = [
  {
    id: 'media-1',
    publicId: 'media-1',
    url: 'https://example.com/image1.jpg',
    caption: 'Test image 1',
    submitterName: 'Test User 1',
    createdAt: new Date('2025-06-01T12:00:00Z'),
    width: 800,
    height: 600,
    mediaType: 'image' as const
  },
  {
    id: 'media-2',
    publicId: 'media-2',
    url: 'https://example.com/video1.mp4',
    caption: 'Test video 1',
    submitterName: 'Test User 2',
    createdAt: new Date('2025-06-02T12:00:00Z'),
    width: 1280,
    height: 720,
    mediaType: 'video' as const
  },
  {
    id: 'media-3',
    publicId: 'media-3',
    url: 'https://example.com/image2.jpg',
    caption: 'Test image 2',
    submitterName: 'Test User 3',
    createdAt: new Date('2025-06-03T12:00:00Z'),
    width: 1200,
    height: 800,
    mediaType: 'image' as const
  }
];

// Mock file factory
export const createMockFile = (
  name: string,
  type: string,
  size = 1024
): File => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', {
    get() { return size; }
  });
  return file;
};

// Export testing utilities
export * from '@testing-library/react';
export { customRender as render };
