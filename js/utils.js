/**
 * Utility functions for Haunted Vinyl Diary
 */

/**
 * Generate a unique ID based on timestamp
 * @returns {string} Unique identifier
 */
function generateId() {
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format a timestamp into a human-readable date string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format duration in seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert a Blob to Base64 string
 * @param {Blob} blob - Audio blob
 * @returns {Promise<string>} Base64 encoded string
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Convert Base64 string to Blob
 * @param {string} base64 - Base64 encoded string
 * @returns {Blob} Audio blob
 */
function base64ToBlob(base64) {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
}

/**
 * Get a random scary phrase for recording stop
 * @returns {string} Random scary phrase
 */
function getRandomScaryPhrase() {
    const phrases = [
        "your voice is trapped forever",
        "the vinyl remembers everything",
        "your memories are now haunted",
        "the record spins with your soul",
        "darkness has captured your words",
        "your echo will never fade",
        "the spirits have heard you",
        "your voice belongs to the void now"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Sanitize text to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Debounce function to limit rapid function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Lazy load an image
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source URL
 */
function lazyLoadImage(img, src) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = src;
                    observer.unobserve(img);
                }
            });
        });
        observer.observe(img);
    } else {
        // Fallback for browsers without IntersectionObserver
        img.src = src;
    }
}

/**
 * Compress audio blob for more efficient storage
 * @param {Blob} audioBlob - Original audio blob
 * @returns {Promise<Blob>} Compressed audio blob
 */
async function compressAudioBlob(audioBlob) {
    // For now, return original blob
    // In production, could use Web Audio API to reduce quality/bitrate
    return audioBlob;
}

/**
 * Create object URL with automatic cleanup
 * @param {Blob} blob - Blob to create URL for
 * @param {number} cleanupDelay - Delay before cleanup in ms (default 60000)
 * @returns {string} Object URL
 */
function createManagedObjectURL(blob, cleanupDelay = 60000) {
    const url = URL.createObjectURL(blob);
    
    // Schedule cleanup
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, cleanupDelay);
    
    return url;
}
