/**
 * Gemini-specific selectors and logic
 */
const GeminiPlatform = {
    selectors: {
        // Selector to find all user message containers
        userMessages: 'user-query, .user-query, .query-content, [role="article"] h2 + div', // fallback to common patterns
        // More specific list for Gemini current layout (March 2026)
        queryContainer: 'user-query',
        messageList: 'main, .conversation-container, .chat-history',
        // Scroll target - can be window or a specific container
        scrollContainer: 'main, .chat-view, .chat-content'
    },

    /**
     * Finds and extracts all user messages from the current DOM
     * Looks for human-sent messages only
     * @returns {Array<{text: string, element: HTMLElement, id: string}>}
     */
    getMessages() {
        // Most reliable way in Gemini is looking for 'user-query' element
        const queryElements = document.querySelectorAll(this.selectors.queryContainer);

        if (queryElements.length === 0) {
            // Fallback: search for elements that look like user queries if selector fails
            // This is a safety measure
            return this._findFallbackMessages();
        }

        return Array.from(queryElements).map((el, index) => {
            // 1. Get raw text
            const rawText = el.innerText || '';
            let text = rawText;

            // 2. Remove Gemini-specific labels if they are at the start
            text = text.replace(/^(Tú dijiste|You said|You)\s+/i, '');

            // 3. Detect specialized content (HTML, CSS, JS, Python, C++, Java)
            let typePrefix = '';
            const lowerText = text.toLowerCase();

            // Language heuristics
            if (lowerText.includes('<!doctype html>') || (lowerText.includes('<html') && lowerText.includes('</html>'))) {
                typePrefix = 'HTML: ';
            } else if (lowerText.includes('{') && lowerText.includes(':') && (lowerText.includes('background-') || lowerText.includes('margin:') || lowerText.includes('padding:'))) {
                typePrefix = 'CSS: ';
            } else if (lowerText.includes('import ') && lowerText.includes('def ') || lowerText.includes('print(') && !lowerText.includes(';') && !lowerText.includes('{')) {
                typePrefix = 'Python: ';
            } else if (lowerText.includes('#include') || lowerText.includes('std::') || lowerText.includes('iostream')) {
                typePrefix = 'C++: ';
            } else if (lowerText.includes('public class') || lowerText.includes('system.out.print') || lowerText.includes('public static void main')) {
                typePrefix = 'Java: ';
            } else if (lowerText.includes('function') || lowerText.includes('const ') || lowerText.includes('let ') || lowerText.includes('var ') || (lowerText.includes('=>') && lowerText.includes('{'))) {
                typePrefix = 'JS: ';
            }

            // 4. Try to find a "name" (title)
            let name = '';
            const firstLine = text.split('\n')[0].trim();
            if (firstLine.includes('<title>')) {
                const titleMatch = firstLine.match(/<title>(.*?)<\/title>/i);
                if (titleMatch) name = titleMatch[1];
            } else if (firstLine.startsWith('/*') || firstLine.startsWith('//') || firstLine.startsWith('# ')) {
                // Remove comment markers from names (supports JS, C++, Java, CSS AND Python/Shell)
                name = firstLine.replace(/[\/\*\!\#]/g, '').trim();
            }

            // 5. Sanitize for display
            text = DOMHelper.sanitize(text);

            // 6. Build display text
            let displayText = name || text;
            if (displayText.length > 50) {
                displayText = displayText.substring(0, 47) + '...';
            }

            // Add prefix if detected
            displayText = typePrefix + displayText;

            return {
                text: displayText,
                fullText: rawText,
                element: el,
                id: `gemini-nav-msg-${index}`
            };
        });
    },

    _findFallbackMessages() {
        // Placeholder for more complex selector logic if needed
        // For now, return empty or try a more generic search
        return [];
    },

    /**
     * Checks if the current page is a Gemini chat page
     * @returns {boolean}
     */
    isActive() {
        return window.location.hostname.includes('gemini.google.com');
    },

    getScrollContainer() {
        // Gemini scrolls 'main' or the window
        return document.querySelector('main') || document.documentElement;
    }
};

window.GeminiPlatform = GeminiPlatform;
