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
 * 2. Study (Pomodoro) Logic
 */
const setupStudyFeature = () => {
    const setupView = document.getElementById('study-setup');
    const activeView = document.getElementById('study-active');
    const workInput = document.getElementById('work-duration');
    const breakInput = document.getElementById('break-duration');
    const startBtn = document.getElementById('start-study');
    const stopBtn = document.getElementById('stop-study');
    const timerDisplay = document.getElementById('study-timer');
    const phaseLabel = document.getElementById('study-phase');

    let timerInterval = null;

    const updateUI = async () => {
        const { [ZONE_CONSTANTS.STORAGE_KEYS.STUDY_STATE]: state } = await chrome.storage.local.get(ZONE_CONSTANTS.STORAGE_KEYS.STUDY_STATE);

        if (state && state.isActive) {
            setupView.classList.add('hidden');
            activeView.classList.remove('hidden');
            phaseLabel.textContent = state.phase;
            startCountdown(state.endTime);
        } else {
            setupView.classList.remove('hidden');
            activeView.classList.add('hidden');
            clearInterval(timerInterval);
        }
    };

    const startCountdown = (endTime) => {
        clearInterval(timerInterval);
        const tick = () => {
            const remaining = Math.max(0, endTime - Date.now());
            const minutes = Math.floor(remaining / 1000 / 60);
            const seconds = Math.floor((remaining / 1000) % 60);
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (remaining <= 0) {
                clearInterval(timerInterval);
                setTimeout(updateUI, 1000); // Re-sync after alarm triggers
            }
        };
        tick();
        timerInterval = setInterval(tick, 1000);
    };

    startBtn.addEventListener('click', async () => {
        const work = parseInt(workInput.value) || 25;
        const breakTime = parseInt(breakInput.value) || 5;
        
        // Import StudyService dynamically to avoid background-only constraints if any
        const { StudyService } = await import('../../services/study.js');
        await StudyService.start(work, breakTime);
        updateUI();
    });

    stopBtn.addEventListener('click', async () => {
        const { StudyService } = await import('../../services/study.js');
        await StudyService.stop();
        updateUI();
    });

    // Listen for storage changes to sync across multiple popup instances
    chrome.storage.onChanged.addListener((changes) => {
        if (changes[ZONE_CONSTANTS.STORAGE_KEYS.STUDY_STATE]) {
            updateUI();
        }
    });

    updateUI();
};

/**
 * 3. Main Logic (Async)
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
    setupStudyFeature();

    // Storage listeners for auto-refresh
    chrome.storage.onChanged.addListener((changes) => {
        if (changes[ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA]) refreshPattern();
    });
};

// Execution
setupSectionToggles();
setupCloseButton();
initPopup();
