/**
 * Zone Switcher - Content Script
 * Neovim/Telescope style tab switcher UI
 */

(function() {
    let overlay = null;
    let listElement = null;
    let inputElement = null;
    let tabs = [];
    let filteredTabs = [];
    let selectedIndex = 0;

    console.log('Zone Debug: Content Script Starting...');

    // Direct Key Listener for Ctrl/Cmd+Shift+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            if (overlay) {
                closeSwitcher();
            } else {
                chrome.runtime.sendMessage({ type: 'ZONE_GET_TABS' }, (response) => {
                    if (response && response.tabs) {
                        tabs = response.tabs;
                        filteredTabs = [...tabs];
                        selectedIndex = 0;
                        createUI();
                        renderList();
                    }
                });
            }
        }
    });

    const createUI = () => {
        if (overlay) return;
        
        // Ensure body exists before appending
        if (!document.body) {
            console.warn('Zone Debug: Document body not ready, retrying in 100ms...');
            setTimeout(createUI, 100);
            return;
        }

        overlay = document.createElement('div');
        overlay.id = 'zone-switcher-overlay';
        overlay.innerHTML = `
            <div id="zone-switcher-container">
                <div class="zone-switcher-search-box">
                    <span class="zone-switcher-prompt">❯</span>
                    <input type="text" id="zone-switcher-input" placeholder="Search tabs..." autocomplete="off">
                </div>
                <div id="zone-switcher-list"></div>
                <div class="zone-switcher-footer">
                    <div>
                        <span class="zone-key-hint">j/k</span> <span class="zone-key-hint">↑↓</span> navigate
                        <span class="zone-key-hint">Enter</span> go to
                    </div>
                    <div>
                        <span class="zone-key-hint">Esc</span> close
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        listElement = overlay.querySelector('#zone-switcher-list');
        inputElement = overlay.querySelector('#zone-switcher-input');

        inputElement.addEventListener('input', (e) => filterTabs(e.target.value));
        inputElement.addEventListener('keydown', handleKeydown);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSwitcher();
        });

        setTimeout(() => inputElement.focus(), 50);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            closeSwitcher();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveSelection(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveSelection(-1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const tab = filteredTabs[selectedIndex];
            if (tab) {
                chrome.runtime.sendMessage({ type: 'ZONE_SWITCH_TAB', tabId: tab.id, windowId: tab.windowId });
                closeSwitcher();
            }
        }
        
        if (e.ctrlKey) {
            if (e.key === 'j') { e.preventDefault(); moveSelection(1); }
            if (e.key === 'k') { e.preventDefault(); moveSelection(-1); }
        }
    };

    const moveSelection = (direction) => {
        if (filteredTabs.length === 0) return;
        selectedIndex = (selectedIndex + direction + filteredTabs.length) % filteredTabs.length;
        renderList();
        scrollToSelected();
    };

    const filterTabs = (query) => {
        const q = query.toLowerCase();
        filteredTabs = tabs.filter(tab => 
            tab.title.toLowerCase().includes(q) || 
            tab.url.toLowerCase().includes(q)
        );
        selectedIndex = 0;
        renderList();
    };

    const renderList = () => {
        if (!listElement) return;
        listElement.innerHTML = '';
        filteredTabs.forEach((tab, index) => {
            const item = document.createElement('div');
            item.className = `zone-tab-item ${index === selectedIndex ? 'selected' : ''}`;
            item.innerHTML = `
                <img class="zone-tab-icon" src="${tab.favIconUrl || 'https://www.google.com/s2/favicons?domain=' + (new URL(tab.url).hostname)}">
                <div class="zone-tab-content">
                    <span class="zone-tab-title">${escapeHtml(tab.title)}</span>
                    <span class="zone-tab-url">${escapeHtml(tab.url)}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                chrome.runtime.sendMessage({ type: 'ZONE_SWITCH_TAB', tabId: tab.id, windowId: tab.windowId });
                closeSwitcher();
            });
            listElement.appendChild(item);
        });
    };

    const scrollToSelected = () => {
        const selected = listElement.querySelector('.selected');
        if (selected) {
            selected.scrollIntoView({ block: 'nearest' });
        }
    };

    const closeSwitcher = () => {
        if (overlay) {
            overlay.remove();
            overlay = null;
        }
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const toggleSwitcher = () => {
        if (overlay) {
            closeSwitcher();
        } else {
            chrome.runtime.sendMessage({ type: 'ZONE_GET_TABS' }, (response) => {
                if (response && response.tabs) {
                    tabs = response.tabs;
                    filteredTabs = [...tabs];
                    selectedIndex = 0;
                    createUI();
                    renderList();
                }
            });
        }
    };

    // Global Key Listener for F9
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F9') {
            console.log('Zone Debug: F9 key pressed');
            e.preventDefault();
            toggleSwitcher();
        }
    });

    // Message Listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Zone Debug: Message received in content script:', message.type);
        if (message.type === 'ZONE_TOGGLE_SWITCHER') {
            toggleSwitcher();
        }
    });

    console.log('Zone Debug: Switcher Script Ready');
})();
