/**
 * Zone Switcher - Background Logic
 */

export const initSwitcherListeners = () => {
    // Handle Keyboard Shortcut
    chrome.commands.onCommand.addListener((command) => {
        console.log('Zone: Command received:', command);
        if (command === 'toggle-switcher') {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    console.log('Zone: Sending toggle message to tab:', tabs[0].id);
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'ZONE_TOGGLE_SWITCHER' })
                        .catch((err) => {
                            console.warn('Zone: Message failed. Is content script loaded?', err);
                        });
                }
            });
        }
    });

    // Handle Messages from Content Script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'ZONE_GET_TABS') {
            chrome.tabs.query({}, (tabs) => {
                // Filter out non-http/s tabs if needed, or just send all
                sendResponse({ tabs });
            });
            return true; // Keep channel open for async
        }

        if (message.type === 'ZONE_SWITCH_TAB') {
            chrome.tabs.update(message.tabId, { active: true });
            chrome.windows.update(message.windowId, { focused: true });
        }
    });
};
