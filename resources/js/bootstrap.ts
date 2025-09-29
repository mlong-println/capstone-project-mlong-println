import axios from 'axios';
import { router } from '@inertiajs/react';

// Configure axios
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add route helper
declare global {
    interface Window {
        axios: typeof axios;
        route: any;
    }
}
