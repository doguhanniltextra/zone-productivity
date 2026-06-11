import { TreeBuilder } from '../../../core/pattern/tree-builder.js';

/**
 * PatternRenderer - Handles the DOM creation for Your Pattern visualization
 */
export const PatternRenderer = {
    render: (container, rawData) => {
        container.innerHTML = '';
        const aggregatedData = TreeBuilder.buildAggregatedChain(rawData);

        if (aggregatedData.length === 0) {
            container.innerHTML = `
                <div class="pattern-empty">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <p>No activity in the last hour.</p>
                </div>`;
            return;
        }

        const chainEl = document.createElement('div');
        chainEl.className = 'node-chain';

        aggregatedData.forEach((node, index) => {
            if (index > 0) {
                const connector = document.createElement('div');
                connector.className = 'chain-connector';
                connector.innerHTML = `
                    <div class="connector-line"></div>
                    <div class="connector-arrow"></div>
                `;
                chainEl.appendChild(connector);
            }

            const chainNode = document.createElement('div');
            chainNode.className = 'chain-node';

            const isRoot = node.isRoot;
            const size = PatternRenderer._getBubbleSize(node.visitCount);
            const isHighFreq = node.visitCount >= 3;
            const timeStr = new Date(node.timestamp || node.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const bubble = document.createElement('div');
            bubble.className = `node-bubble ${isRoot ? 'root-bubble' : 'branch-bubble'}${isHighFreq ? ' freq-high' : ''}`;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';

            const hostFontSize = Math.max(7, Math.min(10, size * 0.14));
            const countFontSize = Math.max(12, Math.min(20, size * 0.28));

            bubble.innerHTML = `
                <span class="bubble-count" style="font-size:${countFontSize}px">×${node.visitCount}</span>
                <span class="bubble-hostname" style="font-size:${hostFontSize}px">${PatternRenderer._shortHostname(node.hostname)}</span>
            `;

            chainNode.appendChild(bubble);

            const label = document.createElement('div');
            label.className = 'node-label';
            label.innerHTML = `
                <span class="node-label-title" title="${node.title}">${node.title}</span>
                <div class="node-label-meta">
                    <span class="node-badge ${isRoot ? 'root-badge' : 'branch-badge'}">${isRoot ? 'Root' : 'Branch'}</span>
                    <span>${timeStr} • ${node.hostname}</span>
                </div>
            `;
            chainNode.appendChild(label);

            if (node.pages.length > 1) {
                const drawer = document.createElement('div');
                drawer.className = 'branch-drawer';
                const drawerInner = document.createElement('div');
                drawerInner.className = 'branch-drawer-inner';
                
                const drawerHeader = document.createElement('div');
                drawerHeader.className = 'branch-drawer-header';
                drawerHeader.textContent = `${node.pages.length} pages visited`;
                drawerInner.appendChild(drawerHeader);

                node.pages.forEach(page => {
                    const pageTimeStr = new Date(page.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const item = document.createElement('div');
                    item.className = 'branch-drawer-item';
                    item.innerHTML = `
                        <span class="branch-drawer-dot"></span>
                        <span class="branch-drawer-title" title="${page.title}">${page.title}</span>
                        <span class="branch-drawer-time">${pageTimeStr}</span>
                    `;
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        chrome.tabs.create({ url: page.url });
                    });
                    drawerInner.appendChild(item);
                });

                drawer.appendChild(drawerInner);
                chainNode.appendChild(drawer);

                bubble.addEventListener('click', (e) => {
                    e.stopPropagation();
                    container.querySelectorAll('.branch-drawer.open').forEach(d => {
                        if (d !== drawer) d.classList.remove('open');
                    });
                    drawer.classList.toggle('open');
                });
            } else {
                bubble.addEventListener('click', (e) => {
                    e.stopPropagation();
                    chrome.tabs.create({ url: node.url });
                });
            }

            chainEl.appendChild(chainNode);
        });

        container.appendChild(chainEl);
    },

    _getBubbleSize: (visitCount) => {
        const minSize = 48;
        const maxSize = 80;
        const scale = Math.min(Math.log2(visitCount + 1) / 3, 1);
        return Math.round(minSize + (maxSize - minSize) * scale);
    },

    _shortHostname: (hostname) => {
        return hostname.replace(/^www\./, '').split('.')[0];
    }
};
