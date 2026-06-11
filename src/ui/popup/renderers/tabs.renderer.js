/**
 * TabRenderer - Handles the DOM creation for Active Tabs management
 */
export const TabRenderer = {
    render: async (container) => {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        container.innerHTML = '';
        
        tabs.forEach(tab => {
            if (tab.url.startsWith('chrome://')) return;
            
            const item = document.createElement('div');
            item.className = 'tab-item';
            item.innerHTML = `
                <div class="tab-info">
                    <img class="tab-favicon" src="${tab.favIconUrl || '../assets/icons/icon-16.png'}">
                    <span class="tab-name">${tab.title}</span>
                </div>
                <label class="switch">
                    <input type="checkbox" ${tab.mutedInfo.muted ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
            `;
            
            const input = item.querySelector('input');
            input.addEventListener('change', async () => {
                await chrome.tabs.update(tab.id, { muted: input.checked });
                chrome.tabs.sendMessage(tab.id, { 
                    type: input.checked ? 'ZONE_FREEZE_TAB' : 'ZONE_UNFREEZE_TAB' 
                }).catch(() => {});
            });
            
            container.appendChild(item);
        });
    }
};
