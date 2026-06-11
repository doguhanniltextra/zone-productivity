import { ZONE_CONSTANTS } from '../utils/constants.js';

/**
 * Updates declarativeNetRequest dynamic rules.
 */
export const BlockerService = {
    updateRules: async (settings) => {
        try {
            const rules = [];
            let ruleId = 1;

            const addRulesForDomain = (domain) => {
                rules.push({
                    id: ruleId++,
                    priority: 1000,
                    action: { type: 'redirect', redirect: { extensionPath: '/src/blocked/blocked.html' } },
                    condition: { urlFilter: `||${domain}^`, resourceTypes: ['main_frame', 'sub_frame'] }
                });
            };

            if (settings.blockSocial) ZONE_CONSTANTS.BLOCK_LISTS.SOCIAL.forEach(addRulesForDomain);
            if (settings.blockForums) ZONE_CONSTANTS.BLOCK_LISTS.FORUMS.forEach(addRulesForDomain);
            if (settings.blockStreaming) ZONE_CONSTANTS.BLOCK_LISTS.STREAMING.forEach(addRulesForDomain);

            const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
            const currentIds = currentRules.map(r => r.id);
            
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: currentIds,
                addRules: rules
            });

            // Cleanup X.com (formerly Twitter) service workers/cache to ensure blocking
            if (settings.blockSocial) {
                const xOrigins = ["https://x.com", "https://twitter.com"];
                chrome.browsingData.remove({ origins: xOrigins }, { serviceWorkers: true, cacheStorage: true });
            }

            console.log(`Zone: Blocker updated. ${rules.length} rules active.`);
        } catch (error) {
            console.error('Zone: Blocker error:', error);
        }
    }
};
