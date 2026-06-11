import { ZONE_CONSTANTS } from '../../utils/constants.js';

/**
 * TreeBuilder - Handles data transformation for Pattern Visualization
 */
export const TreeBuilder = {
    /**
     * Aggregates raw nodes by hostname and identifies roots/branches
     */
    buildAggregatedChain: (rawData) => {
        const now = Date.now();
        // Filter last 1 hour
        const filtered = rawData.filter(node => {
            const nodeTime = node.timestamp || node.id;
            return (now - nodeTime) < (60 * 60 * 1000);
        });

        if (filtered.length === 0) return [];

        const sorted = [...filtered].sort((a, b) => (a.timestamp || a.id) - (b.timestamp || b.id));
        const hostnameMap = new Map();
        const orderedAggregated = [];

        sorted.forEach(node => {
            const existing = hostnameMap.get(node.hostname);
            if (existing) {
                existing.visitCount = (existing.visitCount || 1) + (node.visitCount || 1);
                existing.pages.push({ title: node.title, url: node.url, timestamp: node.timestamp });
                existing.timestamp = Math.max(existing.timestamp, node.timestamp);
                existing.title = node.title;
                if (node.isRoot) existing.isRoot = true;
            } else {
                const agg = {
                    ...node,
                    visitCount: node.visitCount || 1,
                    pages: [{ title: node.title, url: node.url, timestamp: node.timestamp }]
                };
                hostnameMap.set(node.hostname, agg);
                orderedAggregated.push(agg);
            }
        });

        // Sort: roots first, then by timestamp
        orderedAggregated.sort((a, b) => {
            if (a.isRoot && !b.isRoot) return -1;
            if (!a.isRoot && b.isRoot) return 1;
            return (a.pages[0].timestamp || a.timestamp) - (b.pages[0].timestamp || b.timestamp);
        });

        return orderedAggregated;
    }
};
