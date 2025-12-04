import axios from 'axios';
import { router } from '@inertiajs/react';

// Configure axios
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Function to update CSRF token
const updateCsrfToken = () => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        const csrfToken = token.getAttribute('content');
        if (csrfToken) {
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
            console.log('CSRF token updated:', csrfToken.substring(0, 10) + '...');
        }
    } else {
        console.error('CSRF token not found');
    }
};

// Set initial CSRF token
updateCsrfToken();

// Update CSRF token after each Inertia page visit (success event)
router.on('success', () => {
    updateCsrfToken();
});

// Also update on finish (covers all navigation types)
router.on('finish', () => {
    updateCsrfToken();
});

// Add route helper
declare global {
    interface Window {
        axios: typeof axios;
        route: any;
    }
}
