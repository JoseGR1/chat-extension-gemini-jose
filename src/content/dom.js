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
    }
};

window.DOMHelper = DOMHelper;
