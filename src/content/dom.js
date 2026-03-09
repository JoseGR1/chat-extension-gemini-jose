/**
 * DOM Utils for Gemini Navigator
 */
const DOMHelper = {
    /**
     * Creates an HTML element with optional properties
     * @param {string} tag
     * @param {Object} options 
     */
    createElement(tag, { className = '', id = '', attributes = {}, children = [], text = '', html = '' } = {}) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (id) el.id = id;

        Object.keys(attributes).forEach(key => {
            el.setAttribute(key, attributes[key]);
        });

        if (text) el.innerText = text;
        if (html) el.innerHTML = html;

        children.forEach(child => {
            if (child) el.appendChild(child);
        });

        return el;
    },

    removeAllChildren(element) {
        if (!element) return;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    removeIfExists(selector) {
        const el = document.querySelector(selector);
        if (el) el.remove();
    },

    throttle(func, amount) {
        let lastCalled = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCalled > amount) {
                lastCalled = now;
                return func(...args);
            }
        };
    },

    debounce(func, amount) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, amount);
        };
    },

    /**
     * Sanitizes a string by stripping HTML tags and normalizing whitespace.
     * Useful for creating clean text previews from potential HTML/Code content.
     * @param {string} text 
     * @returns {string}
     */
    sanitize(text) {
        if (!text) return '';

        return text
            .replace(/<[^>]*>?/gm, ' ') // Strip HTML tags
            .replace(/\s+/g, ' ')      // Normalize whitespace
            .trim();
    }
};

window.DOMHelper = DOMHelper;
