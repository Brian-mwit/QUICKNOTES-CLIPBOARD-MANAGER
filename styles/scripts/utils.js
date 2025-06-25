// utils.js - Robust Utility Functions

/**
 * Detect URLs in text and convert them to clickable links
 * @param {string} text - Input text containing URLs
 * @returns {string} Text with URLs converted to anchor tags
 */
function linkify(text) {
    if (typeof text !== 'string') {
        console.warn('linkify: Expected string input, received:', typeof text);
        return text;
    }

    try {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => {
            try {
                // Validate URL before creating link
                new URL(url);
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            } catch (e) {
                return url; // Return original text if invalid URL
            }
        });
    } catch (error) {
        console.error('Error in linkify:', error);
        return text;
    }
}

/**
 * Extract domain name from URL
 * @param {string} url - The URL to process
 * @returns {string|null} The domain name or null if invalid
 */
function getDomain(url) {
    if (typeof url !== 'string') return null;

    try {
        const domainObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return domainObj.hostname.replace('www.', '');
    } catch (e) {
        console.debug('Could not parse domain from URL:', url);
        return null;
    }
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300, immediate = false) {
    if (typeof func !== 'function') {
        throw new Error('Debounce requires a function as first argument');
    }

    let timeout;
    return function(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
    if (typeof func !== 'function') {
        throw new Error('Throttle requires a function as first argument');
    }

    let lastFunc;
    let lastRan;
    return function(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Generate a unique ID
 * @param {number} length - Desired ID length (default: 16)
 * @returns {string} Generated unique ID
 */
function generateId(length = 16) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2);
    const id = (timestamp + randomStr).substr(0, length);
    
    return length <= 9 ? id.substr(0, length) : id;
}

export { linkify, getDomain, debounce, throttle, generateId };