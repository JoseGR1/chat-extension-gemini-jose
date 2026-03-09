/**
 * Entry Point for Gemini Navigator
 */
const GeminiNavigator = {
    messagesCount: 0,
    observer: null,
    refreshScheduled: false,
    scrollListener: null,
    messages: [],

    /**
     * Initializes the extension
     */
    async init() {
        if (!GeminiPlatform.isActive()) return;

        console.log('Gemini Navigator: Initializing...');

        UIManager.mountContainer();
        this.refresh();
        this.setupObserver();
        this.setupMessageListener();
        this.setupScrollSpy();

        console.log('Gemini Navigator: Ready.');
    },

    /**
     * Scans the page for messages and updates the UI
     */
    refresh() {
        this.messages = GeminiPlatform.getMessages();

        if (this.messages.length !== this.messagesCount || this.messagesCount === 0) {
            this.messagesCount = this.messages.length;
            UIManager.render(this.messages);
        }

        this.refreshScheduled = false;
    },

    /**
     * Schedules a refresh with a slight debounce to avoid excessive re-renders
     */
    scheduleRefresh() {
        if (this.refreshScheduled) return;
        this.refreshScheduled = true;
        setTimeout(() => this.refresh(), 1000);
    },

    /**
     * Observes DOM changes to detect new messages
     */
    setupObserver() {
        if (this.observer) this.observer.disconnect();
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        this.observer = new MutationObserver((mutations) => {
            let shouldRefresh = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldRefresh = true;
                    break;
                }
            }
            if (shouldRefresh) this.scheduleRefresh();
        });

        this.observer.observe(targetNode, config);
    },

    /**
     * Listens for messages from the popup or background
     */
    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'refresh_navigator') {
                this.refresh();
                sendResponse({ status: 'refreshed' });
            }
        });
    },

    /**
     * Listens for scroll events to track which message is in view
     */
    setupScrollSpy() {
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener, true);
        }

        // Throttled scroll listener for performance
        this.scrollListener = DOMHelper.throttle(() => {
            this.updateActiveOnScroll();
        }, 150);

        // Attach to window with capture to ensure we catch scrolls from containers
        window.addEventListener('scroll', this.scrollListener, true);
    },

    /**
     * Checks scroll position and updates UIManager active state
     */
    updateActiveOnScroll() {
        const activeId = NavigationManager.getActiveMessageIdFromScroll(this.messages);

        if (activeId && activeId !== UIManager.lastSelectedId) {
            UIManager.lastSelectedId = activeId;
            UIManager._updateActiveStates();
        }
    }
};

// Start the extension when the script is loaded
// We use a small delay or check for body presence
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GeminiNavigator.init());
} else {
    GeminiNavigator.init();
}
