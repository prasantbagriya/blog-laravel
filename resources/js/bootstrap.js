import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.BASE_PATH = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';

const originalFetch = window.fetch;
window.fetch = async function () {
    let [resource, config] = arguments;
    
    if (typeof resource === 'string' && resource.startsWith('/api/')) {
        const basePath = window.BASE_PATH;
        resource = basePath + resource;
    }

    // Ensure config exists
    config = config || {};
    config.headers = config.headers || {};
    
    // Add Accept JSON by default to prevent HTML redirects on error
    if (!config.headers['Accept']) {
        config.headers['Accept'] = 'application/json';
    }

    // Add CSRF token for non-GET requests
    if (config.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'));
        const xsrfToken = match ? decodeURIComponent(match[3]) : null;
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = xsrfToken;
        }
    }

    return originalFetch(resource, config);
};
