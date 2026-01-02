import '../css/app.css';
import './bootstrap';
import 'leaflet/dist/leaflet.css';

import { createInertiaApp, router } from '@inertiajs/react';

// Make route helper available globally
declare global {
    interface Window {
        route: any;
    }
}
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './Components/ThemeSelector';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Global error handler for CSRF token expiration (419 errors)
router.on('error', (event) => {
    const error = event.detail as any;
    
    // Check if it's a 419 error (CSRF token mismatch/expiration)
    if (error.response && error.response.status === 419) {
        console.log('CSRF token expired, reloading page...');
        window.location.reload();
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
