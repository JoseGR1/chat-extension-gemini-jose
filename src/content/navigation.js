/**
 * Navigation and scroll logic for Gemini Navigator
 */
const NavigationManager = {
    isManualScrolling: false,
    currentLockId: 0,

    /**
     * The most robust way to navigate: find the element CURRENTLY at this index in the DOM.
     * @param {number} index 
     * @param {boolean} isLast 
     */
    scrollToIndex(index, isLast = false) {
        this.isManualScrolling = true;
        const lockId = ++this.currentLockId;

        const perform = () => {
            // Cancel if a newer navigation has started
            if (this.currentLockId !== lockId) return;

            // RE-SCAN the DOM for the freshest references
            const messages = GeminiPlatform.getMessages();
            const target = messages[index];

            if (!target || !target.element) {
                this.isManualScrolling = false;
                return;
            }

            const element = target.element;
            const container = GeminiPlatform.getScrollContainer();

            // 1. Initial Highlight (Visual feedback before/during movement)
            this.flashElement(element);

            // 2. Special handling for the absolute bottom
            if (isLast && container) {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }

            // 3. Precise alignment
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        };

        // 1. First attempt (immediate)
        perform();

        // 2. Continuous enforcement (to fight Gemini's own layout/auto-scroll)
        const recheckTimes = [150, 400, 800, 1500];
        recheckTimes.forEach(delay => {
            setTimeout(perform, delay);
        });

        // 3. Unlock scroll-spy once we arrive, but only if no newer nav started
        setTimeout(() => {
            if (this.currentLockId === lockId) {
                this.isManualScrolling = false;
            }
        }, 3000);
    },

    /**
     * Scrolls smoothly to a target element. Optimized for Gemini's dynamic DOM.
     * @param {HTMLElement} element 
     * @param {boolean} isLast Is this the last message in the conversation?
     */
    scrollToElement(element, isLast = false) {
        if (!element || !document.body.contains(element)) return;

        this.isManualScrolling = true;
        const lockId = ++this.currentLockId;

        const container = GeminiPlatform.getScrollContainer();

        // 1. Flash first to give feedback even if scroll is blocked
        this.flashElement(element);

        // 2. Specialized scroll for the last message
        if (isLast && container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });

            setTimeout(() => {
                if (this.currentLockId === lockId) {
                    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
                }
            }, 100);
        } else {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        // 3. Re-scan and re-try just in case (High precision)
        setTimeout(() => {
            if (this.currentLockId === lockId && element && document.body.contains(element)) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);

        // 4. Unlock scroll spy
        setTimeout(() => {
            if (this.currentLockId === lockId) {
                this.isManualScrolling = false;
            }
        }, 2000);
    },

    /**
     * Detects which message is currently being viewed based on scroll position
     * with high precision.
     * @param {Array} messages 
     * @returns {string|null}
     */
    getActiveMessageIdFromScroll(messages) {
        if (this.isManualScrolling || !messages.length) return null;

        // The 'Focus Point' is where the user is likely reading (25% from top)
        const focusPoint = window.innerHeight * 0.25;

        let bestMatch = null;
        let minDistance = Infinity;

        for (const msg of messages) {
            const rect = msg.element.getBoundingClientRect();

            // Check if the focus point is literally INSIDE this message
            if (rect.top <= focusPoint && rect.bottom >= focusPoint) {
                return msg.id;
            }

            // Otherwise, find the one whose TOP is closest to our focus point
            const distance = Math.abs(rect.top - focusPoint);

            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = msg.id;
            }
        }

        return bestMatch;
    },

    /**
     * Highlighting the destination element briefly for visual feedback.
     * Use CSS classes for stability and global cleanup.
     * @param {HTMLElement} element 
     */
    flashElement(element) {
        if (!element) return;

        // 1. Global Cleanup: Remove any existing highlights from ANY element
        // This prevents 'stuck' boxes when clicking fast
        document.querySelectorAll('.gemini-nav-highlight').forEach(el => {
            el.classList.remove('gemini-nav-highlight', 'gemini-nav-highlight-hide');
        });

        // 2. Apply highlight to current target
        element.classList.add('gemini-nav-highlight');

        // 3. Smooth fade out instead of sudden disappearance
        setTimeout(() => {
            if (element) {
                element.classList.add('gemini-nav-highlight-hide');

                // Final cleanup after transition
                setTimeout(() => {
                    element.classList.remove('gemini-nav-highlight', 'gemini-nav-highlight-hide');
                }, 400);
            }
        }, 2000); // Highlight remains for 2 seconds
    },

    /**
     * Finds the index of a message list item in the array of user messages
     * @param {Array} messages 
     * @param {string} id 
     */
    findMessageById(messages, id) {
        return messages.find(m => m.id === id);
    }
};

window.NavigationManager = NavigationManager;
