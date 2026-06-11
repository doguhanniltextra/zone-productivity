/**
 * Zone Switcher - Background Logic
 */

export const initSwitcherListeners = () => {
    // Handle Keyboard Shortcut
    chrome.commands.onCommand.addListener((command) => {
        console.log('Zone Debug: Command received from browser:', command);
        if (command === 'toggle-switcher') {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    console.log('Zone Debug: Target tab found:', tabs[0].id, tabs[0].url);
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'ZONE_TOGGLE_SWITCHER' })
                        .then(() => {
                            console.log('Zone Debug: Message sent successfully to tab:', tabs[0].id);
                        })
                        .catch((err) => {
                            console.error('Zone Debug: FAILED to send message to tab. Is it a protected page (chrome://)? Error:', err);
                        });
                } else {
                    console.warn('Zone Debug: No active tab found in current window.');
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
