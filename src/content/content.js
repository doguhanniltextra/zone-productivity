/**
 * Zone - Content Engine
 * Orchestrates features and applies dynamic styles.
 * Note: This script is NOT a module (Chrome content script constraint),
 * so it relies on ZONE_SELECTORS and constants being pre-loaded via manifest.
 */

(function() {
    let styleElement = null;
    let currentSettings = null;
    
    // Feature instances
    const features = [
        new HomeFeature(),
        new CommentsFeature(),
        new ShortsFeature()
    ];

    /**
     * Collects CSS from all enabled features.
     */
    const generateGlobalCss = (settings) => {
        if (!settings) return '';
        return features
            .map(feature => {
                feature.update(settings);
                return feature.generateCss();
            })
            .join('\n');
    };

    /**
     * Updates the injected style tag.
     */
    const updateStyles = (settings) => {
        if (!settings) return;
        currentSettings = settings;

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'zone-dynamic-styles';
            const target = document.head || document.documentElement;
            if (target) {
                target.appendChild(styleElement);
            } else {
                const observer = new MutationObserver(() => {
                    const head = document.head || document.documentElement;
                    if (head) {
                        head.appendChild(styleElement);
                        observer.disconnect();
                    }
                });
                observer.observe(document.documentElement, { childList: true });
            }
        }
        
        if (styleElement) {
            styleElement.textContent = generateGlobalCss(settings);
        }
    };

    // Initial load - Using direct chrome.storage.sync.get to avoid module dependency
    const SETTINGS_KEY = 'zone_settings';
    chrome.storage.sync.get([SETTINGS_KEY], (result) => {
        const settings = result[SETTINGS_KEY] || {
            hideHomeAndRecommendations: true,
            hideComments: true,
            hideShorts: true
        };
        updateStyles(settings);
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes[SETTINGS_KEY]) {
            updateStyles(changes[SETTINGS_KEY].newValue);
        }
    });

    // Listen for direct messages from popup for instant feedback
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'ZONE_SETTINGS_UPDATED') {
            updateStyles(message.settings);
            sendResponse({ success: true });
        }
        return true; // Keep channel open for async
    });
})();
