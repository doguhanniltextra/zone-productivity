import { ZONE_CONSTANTS } from '../utils/constants.js';

export const ZoneStorage = {
  getSettings: () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([ZONE_CONSTANTS.STORAGE_KEYS.SETTINGS], (result) => {
        const stored = result[ZONE_CONSTANTS.STORAGE_KEYS.SETTINGS] || {};
        resolve({ ...ZONE_CONSTANTS.DEFAULT_SETTINGS, ...stored });
      });
    });
  },
  
  setSettings: (settings) => {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [ZONE_CONSTANTS.STORAGE_KEYS.SETTINGS]: settings }, () => {
        resolve();
      });
    });
  }
};
