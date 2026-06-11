/**
 * Zone - Background Service Worker (Modular)
 */

import { ZONE_CONSTANTS } from './utils/constants.js';
import { ZoneStorage } from './services/storage.js';
import { BlockerService } from './services/blocker.api.js';
import { PatternService } from './services/history.js';
import { initNavigationListeners } from './background/navigation.js';
import { initSwitcherListeners } from './background/switcher.js';

// Initialize Listeners
initNavigationListeners();
initSwitcherListeners();

// Handle Install
chrome.runtime.onInstalled.addListener(async () => {
    const settings = await ZoneStorage.getSettings();
    await BlockerService.updateRules(settings);
    await PatternService.seedFromHistory();

    // Set side panel behavior
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
});

// Handle Storage Changes
chrome.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === 'sync' && changes[ZONE_CONSTANTS.STORAGE_KEYS.SETTINGS]) {
        await BlockerService.updateRules(changes[ZONE_CONSTANTS.STORAGE_KEYS.SETTINGS].newValue);
    }
});

// Generic Message Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    return true;
});
