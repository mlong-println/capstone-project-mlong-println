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
        }
    } else {
        console.error('CSRF token not found');
    }
};

// Set initial CSRF token
updateCsrfToken();

// Update CSRF token after each Inertia navigation
router.on('navigate', () => {
    updateCsrfToken();
});

// Add route helper
declare global {
    interface Window {
        axios: typeof axios;
        route: any;
    }
}
