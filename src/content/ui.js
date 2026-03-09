/**
 * UI Renderer for Gemini Navigator
 */
const UIManager = {
    // Shared references
    container: null,
    panel: null,
    listContainer: null,
    messageList: [],
    lastSelectedId: null,
    closeTimeout: null,

    /**
     * Mounts the main container into the page
     */
    mountContainer() {
        if (document.getElementById('gemini-navigator-root')) return;

        // Root container
        this.container = DOMHelper.createElement('div', {
            id: 'gemini-navigator-root',
            className: 'gemini-nav-root collapsed' // Start collapsed
        });

        this._renderBaseStructure();
        document.body.appendChild(this.container);

        this._setupGlobalListeners();
    },

    /**
     * Renders the single unified panel structure
     */
    _renderBaseStructure() {
        // The main bubble/card
        this.panel = DOMHelper.createElement('div', {
            className: 'gemini-nav-panel'
        });

        // The list of messages
        this.listContainer = DOMHelper.createElement('div', {
            id: 'gemini-nav-list',
            className: 'gemini-nav-list'
        });

        this.panel.appendChild(this.listContainer);
        this.container.appendChild(this.panel);
    },

    async _initializeState() {
        // Transient hover-based state
    },

    /**
     * Toggles between collapsed and expanded states
     */
    async toggleState(forceToCollapsed) {
        if (forceToCollapsed) {
            this.container.classList.add('collapsed');
        } else {
            this.container.classList.remove('collapsed');
        }
    },

    /**
     * Entry point for rendering messages
     */
    render(messages) {
        this.messageList = messages;
        this._renderList();
    },

    /**
     * Renders the message items. Each item contains text and its marker.
     */
    _renderList() {
        DOMHelper.removeAllChildren(this.listContainer);

        if (this.messageList.length === 0) {
            const emptyHint = DOMHelper.createElement('div', {
                className: 'gemini-nav-empty',
                text: 'Sin mensajes.'
            });
            this.listContainer.appendChild(emptyHint);
            return;
        }

        this.messageList.forEach((msg) => {
            // Main item container
            const item = DOMHelper.createElement('div', {
                className: `gemini-nav-item ${msg.id === this.lastSelectedId ? 'active' : ''}`,
                id: `nav-item-${msg.id}`
            });

            // Text section (Left)
            const textSpan = DOMHelper.createElement('span', {
                className: 'gemini-nav-item-text',
                text: msg.text
            });

            // Marker section (Right) - Fixed position within item
            const markerWrapper = DOMHelper.createElement('div', {
                className: 'gemini-nav-marker-wrapper'
            });

            const marker = DOMHelper.createElement('div', {
                className: 'gemini-nav-marker'
            });

            markerWrapper.appendChild(marker);
            item.appendChild(textSpan);
            item.appendChild(markerWrapper);

            // Click to navigate
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this._handleNavigation(msg);
            });

            this.listContainer.appendChild(item);
        });
    },

    /**
     * Handles navigation to a specific message by its index.
     * This avoids using stale element references from Gemini's dynamic chat.
     */
    _handleNavigation(msg) {
        this.lastSelectedId = msg.id;

        // 1. Find the index in our current list
        const index = this.messageList.findIndex(m => m.id === msg.id);
        const isLast = (index === this.messageList.length - 1);

        // 2. Delegate to NavigationManager using the INDEX
        // This is the most robust way: re-scan the DOM at the last possible moment
        NavigationManager.scrollToIndex(index, isLast);

        this._updateActiveStates();
    },

    /**
     * Updates visual states for all items and scrolls active into view
     */
    _updateActiveStates() {
        const items = this.listContainer.querySelectorAll('.gemini-nav-item');
        let activeItem = null;

        this.messageList.forEach((msg, index) => {
            const isActive = msg.id === this.lastSelectedId;
            const item = items[index];
            if (item) {
                item.classList.toggle('active', isActive);
                if (isActive) activeItem = item;
            }
        });

        // Auto-scroll the navigator list to show the active marker/item
        if (activeItem) {
            this._scrollActiveIntoView(activeItem);
        }
    },

    /**
     * Ensures the active item is centered in the 10-line view
     * @param {HTMLElement} item 
     */
    _scrollActiveIntoView(item) {
        if (!item || !this.listContainer) return;

        // Use scrollIntoView with block: 'center' to keep the active item 
        // in the middle of our 10-line window
        item.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    },

    /**
     * Hover interactions for the unified panel
     */
    _setupGlobalListeners() {
        // Expand when mouse enters the entire root area (which includes the markers rail)
        this.container.addEventListener('mouseenter', () => {
            clearTimeout(this.closeTimeout);
            this.toggleState(false); // Expand
        });

        // Collapse with delay when mouse leaves
        this.container.addEventListener('mouseleave', () => {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = setTimeout(() => {
                this.toggleState(true); // Collapse
            }, 600);
        });
    }
};

window.UIManager = UIManager;
