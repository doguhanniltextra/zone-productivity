/**
 * Zone - Popup Script (Modular Orchestrator)
 */

import { ZONE_CONSTANTS } from '../../utils/constants.js';
import { ZoneStorage } from '../../services/storage.js';
import { PatternRenderer } from './renderers/pattern.renderer.js';
import { TabRenderer } from './renderers/tabs.renderer.js';

/**
 * 1. Immediate UI Setup (Non-blocking)
 */

// Section Toggles
const setupSectionToggles = () => {
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            const isOpen = section.classList.contains('open');
            
            // Close all other sections
            document.querySelectorAll('.section').forEach(s => s.classList.remove('open'));
            
            // Toggle current
            if (!isOpen) {
                section.classList.add('open');
            }
        });
    });
};

// Close Button
const setupCloseButton = () => {
    const closeBtn = document.getElementById('close-panel');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => window.close());
    }
};

/**
 * 2. Main Logic (Async)
 */
const initPopup = async () => {
    // Selectors
    const switches = {
        hideHomeAndRecommendations: document.getElementById('hideHomeAndRecommendations'),
        hideComments: document.getElementById('hideComments'),
        hideShorts: document.getElementById('hideShorts'),
        blockSocial: document.getElementById('blockSocial'),
        blockForums: document.getElementById('blockForums'),
        blockStreaming: document.getElementById('blockStreaming')
    };
    
    const tabListContainer = document.getElementById('tab-list');
    const patternContainer = document.getElementById('pattern-container');

    // Load settings & set initial states
    try {
        const settings = await ZoneStorage.getSettings();
        Object.keys(switches).forEach(key => {
            if (switches[key]) switches[key].checked = settings[key];
        });
    } catch (e) {
        console.error('Zone: Settings load error:', e);
    }

    // Settings persistence listeners
    Object.keys(switches).forEach(key => {
        if (!switches[key]) return;
        switches[key].addEventListener('change', async () => {
            const currentSettings = await ZoneStorage.getSettings();
            const newSettings = { ...currentSettings, [key]: switches[key].checked };
            await ZoneStorage.setSettings(newSettings);
            
            // Notify ALL YouTube tabs for instant update
            chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'ZONE_SETTINGS_UPDATED',
                        settings: newSettings
                    }).catch(() => {
                        // Silence errors for inactive tabs
                    });
                });
            });
        });
    });

    // Initial Renders
    const refreshPattern = async () => {
        const { [ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA]: patternData = [] } = 
            await chrome.storage.local.get(ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA);
        PatternRenderer.render(patternContainer, patternData);
    };

    const refreshTabs = () => TabRenderer.render(tabListContainer);

    refreshPattern();
    refreshTabs();

    // Storage listeners for auto-refresh
    chrome.storage.onChanged.addListener((changes) => {
        if (changes[ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA]) refreshPattern();
    });
};

// Execution
setupSectionToggles();
setupCloseButton();
initPopup();
