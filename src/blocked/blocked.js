/**
 * Zone - Blocked Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // In Chrome extensions, we can use chrome.tabs to close the current tab
            chrome.tabs.getCurrent((tab) => {
                if (tab) {
                    chrome.tabs.remove(tab.id);
                } else {
                    // Fallback if not running as a proper tab
                    window.close();
                }
            });
        });
    }
});
