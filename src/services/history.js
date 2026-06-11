import { ZONE_CONSTANTS } from '../utils/constants.js';

export const PatternService = {
    /**
     * Seeds the Pattern data from existing browser history
     */
    seedFromHistory: async () => {
        try {
            const { [ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA]: existing } = await chrome.storage.local.get(ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA);
            if (existing && existing.length > 0) return;

            const startTime = Date.now() - (60 * 60 * 1000);
            const historyItems = await chrome.history.search({ text: '', startTime, maxResults: 100 });
            
            if (historyItems.length === 0) return;

            historyItems.sort((a, b) => (a.lastVisitTime || 0) - (b.lastVisitTime || 0));

            const seededPattern = [];
            let prevNode = null;

            for (const item of historyItems) {
                try {
                    const url = new URL(item.url);
                    let title = item.title || url.hostname;
                    let isRoot = false;

                    const params = new URLSearchParams(url.search);
                    for (const p of ZONE_CONSTANTS.PATTERN.SEARCH_PARAMS) {
                        if (params.has(p)) {
                            title = `🔍 ${params.get(p)}`;
                            isRoot = true;
                            break;
                        }
                    }

                    if (item.typedCount > 0) isRoot = true;

                    if (prevNode && 
                        prevNode.hostname === url.hostname && 
                        (item.lastVisitTime - prevNode.timestamp) < ZONE_CONSTANTS.PATTERN.MERGE_THRESHOLD_MS) {
                        prevNode.visitCount = (prevNode.visitCount || 1) + 1;
                        prevNode.title = title;
                        prevNode.url = item.url;
                        prevNode.timestamp = item.lastVisitTime || prevNode.timestamp;
                        continue;
                    }

                    const node = {
                        id: item.lastVisitTime || Date.now() + seededPattern.length,
                        url: item.url,
                        title: title,
                        hostname: url.hostname,
                        timestamp: item.lastVisitTime || Date.now(),
                        isRoot: isRoot,
                        visitCount: item.visitCount || 1,
                        transition: item.typedCount > 0 ? 'typed' : 'link'
                    };

                    if (prevNode && !isRoot) {
                        const timeDiff = (node.timestamp - prevNode.timestamp);
                        if (timeDiff < 5 * 60 * 1000) {
                            node.parentId = prevNode.id;
                        }
                    }

                    seededPattern.push(node);
                    prevNode = node;
                } catch (e) {}
            }

            await chrome.storage.local.set({ [ZONE_CONSTANTS.STORAGE_KEYS.PATTERN_DATA]: seededPattern });
            console.log(`Zone: Seeded ${seededPattern.length} items from history.`);
        } catch (e) {
            console.error('Zone: History Seeding Error:', e);
        }
    }
};
