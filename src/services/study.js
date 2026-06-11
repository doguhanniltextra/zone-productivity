import { ZONE_CONSTANTS } from '../utils/constants.js';

/**
 * StudyService - Handles Pomodoro timer logic using chrome.alarms
 */
export const StudyService = {
    /**
     * Starts the Pomodoro timer
     */
    start: async (workDurationMin, breakDurationMin) => {
        const state = {
            isActive: true,
            phase: ZONE_CONSTANTS.STUDY.PHASES.WORK,
            workDuration: workDurationMin,
            breakDuration: breakDurationMin,
            endTime: Date.now() + (workDurationMin * 60 * 1000)
        };

        await chrome.storage.local.set({ [ZONE_CONSTANTS.STORAGE_KEYS.STUDY_STATE]: state });
        
        await chrome.alarms.create(ZONE_CONSTANTS.STUDY.ALARM_NAME, {
            delayInMinutes: workDurationMin
        });

        console.log(`Zone Study: Started. Phase: WORK, Duration: ${workDurationMin} min`);
    },

    /**
     * Stops the Pomodoro timer
     */
    stop: async () => {
        await chrome.alarms.clear(ZONE_CONSTANTS.STUDY.ALARM_NAME);
        await chrome.storage.local.remove(ZONE_CONSTANTS.STORAGE_KEYS.STUDY_STATE);
        console.log('Zone Study: Stopped');
    },

    /**
     * Handles alarm trigger (phase completion)
     */
    handleAlarm: async () => {
        const { [ZONE_CONSTANTS.STORAGE_KEYS.STUDY_STATE]: state } = await chrome.storage.local.get(ZONE_CONSTANTS.STORAGE_KEYS.STUDY_STATE);
        
        if (!state || !state.isActive) return;

        let nextPhase;
        let nextDuration;
        let notificationTitle;
        let notificationMessage;

        if (state.phase === ZONE_CONSTANTS.STUDY.PHASES.WORK) {
            nextPhase = ZONE_CONSTANTS.STUDY.PHASES.BREAK;
            nextDuration = state.breakDuration;
            notificationTitle = 'Pomodoro Finished!';
            notificationMessage = 'Your pomodoro has finished! The break is started';
        } else {
            nextPhase = ZONE_CONSTANTS.STUDY.PHASES.WORK;
            nextDuration = state.workDuration;
            notificationTitle = 'Break Finished!';
            notificationMessage = 'Your another pomodoro has finished! Let\'s Go';
        }

        // Update State
        const newState = {
            ...state,
            phase: nextPhase,
            endTime: Date.now() + (nextDuration * 60 * 1000)
        };
        await chrome.storage.local.set({ [ZONE_CONSTANTS.STORAGE_KEYS.STUDY_STATE]: newState });

        // Create Next Alarm
        await chrome.alarms.create(ZONE_CONSTANTS.STUDY.ALARM_NAME, {
            delayInMinutes: nextDuration
        });

        // Show Notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '/static/logo.png',
            title: notificationTitle,
            message: notificationMessage,
            priority: 2
        });

        // Play Sound via Offscreen Document
        StudyService.playNotificationSound();

        console.log(`Zone Study: Phase changed to ${nextPhase}. Next alarm in ${nextDuration} min`);
    },

    /**
     * Triggers the chill notification sound using an offscreen document
     */
    playNotificationSound: async () => {
        try {
            const offscreenPath = 'src/offscreen/offscreen.html';
            
            // Check if offscreen document already exists
            const contexts = await chrome.runtime.getContexts({
                contextTypes: ['OFFSCREEN_DOCUMENT']
            });

            if (contexts.length === 0) {
                await chrome.offscreen.createDocument({
                    url: offscreenPath,
                    reasons: ['AUDIO_PLAYBACK'],
                    justification: 'Play notification sounds for Pomodoro timer phases.'
                });
                // Give it a tiny bit of time to initialize listeners
                await new Promise(r => setTimeout(r, 100));
            }

            chrome.runtime.sendMessage({ type: 'ZONE_PLAY_NOTIFICATION_SOUND' });
        } catch (error) {
            console.error('Zone Study: Sound playback error:', error);
        }
    }
};
