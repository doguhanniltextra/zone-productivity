import { ZONE_CONSTANTS } from '../utils/constants.js';

const tabLastNodeId = new Map();

export const initNavigationListeners = () => {
    chrome.webNavigation.onCommitted.addListener(async (details) => {
        if (details.frameId !== 0 || details.url.startsWith('chrome')) return;

        try {
            const { [ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA]: patternData = [] } = await chrome.storage.local.get(ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA);
            
            const url = new URL(details.url);
            const transition = details.transitionType;
            const isRoot = ['typed', 'generated', 'keyword', 'auto_bookmark'].includes(transition);
            
            const tab = await chrome.tabs.get(details.tabId);
            let title = tab.title || url.hostname;

            const params = new URLSearchParams(url.search);
            for (const p of ZONE_CONSTANTS.PATTERN.SEARCH_PARAMS) {
                if (params.has(p)) {
                    title = `🔍 ${params.get(p)}`;
                    break;
                }
            }

            const existingNode = patternData.find(n => 
                n.hostname === url.hostname && 
                (Date.now() - n.timestamp) < ZONE_CONSTANTS.PATTERN.MERGE_THRESHOLD_MS
            );

            if (existingNode) {
                existingNode.visitCount = (existingNode.visitCount || 1) + 1;
                existingNode.title = title;
                existingNode.url = details.url;
                existingNode.timestamp = Date.now();
                
                await chrome.storage.local.set({ [ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA]: patternData });
                tabLastNodeId.set(details.tabId, existingNode.id);
                return;
            }

            const newNode = {
                id: Date.now(),
                tabId: details.tabId,
                url: details.url,
                title: title,
                hostname: url.hostname,
                timestamp: Date.now(),
                isRoot: isRoot,
                visitCount: 1,
                transition: transition
            };

            const lastNodeIdInTab = tabLastNodeId.get(details.tabId);
            if (!isRoot && lastNodeIdInTab) {
                newNode.parentId = lastNodeIdInTab;
            }

            tabLastNodeId.set(details.tabId, newNode.id);

            const updatedPattern = [newNode, ...patternData].slice(0, ZONE_CONSTANTS.PATTERN.MAX_NODES);
            await chrome.storage.local.set({ [ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA]: updatedPattern });
            
        } catch (e) {
            console.error('Zone: Pattern Engine Error:', e);
        }
    });

    chrome.tabs.onRemoved.addListener((tabId) => {
        tabLastNodeId.delete(tabId);
    });
};
