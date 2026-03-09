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
            // Clean up the text
            let text = el.innerText.trim();

            // Remove Gemini's internal "Tú dijiste" or "You said" etc. if they appear
            // This handles cases where Gemini includes these as labels inside the query node
            text = text.replace(/^(Tú dijiste|You said|You)\s+/i, '');

            // Truncate for the navigation list
            const displayText = text.length > 50 ? text.substring(0, 47) + '...' : text;

            return {
                text: displayText,
                fullText: text,
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
