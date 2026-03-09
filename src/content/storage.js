/**
 * Storage management for Gemini Navigator
 */
const StorageManager = {
    async getSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.get({
                isCollapsed: true, // Default to collapsed
                lastRefresh: 0
            }, (settings) => {
                resolve(settings);
            });
        });
    },

    async setSettings(settings) {
        return new Promise((resolve) => {
            chrome.storage.local.set(settings, () => {
                resolve(true);
            });
        });
    },

    async isCollapsed() {
        const settings = await this.getSettings();
        return settings.isCollapsed;
    },

    async toggleCollapse(state) {
        const settings = await this.getSettings();
        const newState = state !== undefined ? state : !settings.isCollapsed;
        await this.setSettings({ ...settings, isCollapsed: newState });
        return newState;
    }
};

// Export to window if not in a module environment
window.StorageManager = StorageManager;
