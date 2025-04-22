# Food_ordering_web

![WhatsApp Image 2024-07-31 at 12 14 34_7f6a556a](https://github.com/user-attachments/assets/06f6422f-2fa0-4b6f-a6b1-ff1fce770392)

# Food Ordering Web App with Service Worker

This project has been enhanced with Progressive Web App (PWA) capabilities through the addition of a service worker.

## Service Worker Implementation

The following files were added/modified to implement PWA functionality:

1. `js/sw.js` - Service worker script that handles:

   - Caching static assets
   - Providing offline functionality
   - Cache management

2. `manifest.json` - Web App Manifest that defines:

   - App name and description
   - Icons
   - Theme colors
   - Display preferences

3. `offline.html` - Offline fallback page when network is unavailable

4. Service worker registration in `index.html`

## How It Works

The service worker provides the following functionality:

- **Offline Access**: Caches key resources so the app works without an internet connection
- **Faster Load Times**: Serves cached content for repeat visitors
- **Reliable Experience**: Falls back to offline.html when network requests fail

## PWA Benefits

- **Installable**: Users can add to home screen
- **Reliable**: Works offline or with poor connectivity
- **Engaging**: Feels like a native app

## Testing the Offline Capability

To test the offline functionality:

1. Load the website normally
2. Turn off your network connection
3. Refresh the page
4. The app should still load using cached resources
5. When accessing non-cached pages, you'll see the offline fallback page

## Icons

This implementation requires two icon files for PWA functionality:

- `img/icon-192.png` (192x192px)
- `img/icon-512.png` (512x512px)

These should be added to complete the PWA implementation.

## Browser Support

Service workers are supported in all modern browsers including:

- Chrome
- Firefox
- Safari
- Edge
- Opera
