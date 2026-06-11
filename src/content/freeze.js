/**
 * Zone - Global Script (Freeze + Manual Redirect)
 */

(function() {
    // Only run in top frame
    if (window !== window.top) return;

    const OVERLAY_ID = 'zone-freeze-overlay-global';
    
    // Check for Blocked Sites (Manual Fallback)
    const checkBlocking = async () => {
        try {
            const settings = await ZoneStorage.getSettings();
            const host = window.location.host;
            const isMatch = (list) => list.some(d => host.includes(d));

            if ((settings.blockSocial && isMatch(ZONE_CONSTANTS.BLOCK_LISTS.SOCIAL)) ||
                (settings.blockForums && isMatch(ZONE_CONSTANTS.BLOCK_LISTS.FORUMS)) ||
                (settings.blockStreaming && isMatch(ZONE_CONSTANTS.BLOCK_LISTS.STREAMING))) {
                
                window.location.href = chrome.runtime.getURL('src/blocked/blocked.html');
            }
        } catch(e) {}
    };

    // Kill X.com Service Workers
    if (window.location.host.includes('x.com') || window.location.host.includes('twitter.com')) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let reg of registrations) reg.unregister();
            });
        }
    }

    checkBlocking();

    // Listeners for Tab Freeze
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === 'ZONE_FREEZE_TAB') createOverlay();
        else if (msg.type === 'ZONE_UNFREEZE_TAB') removeOverlay();
    });

    const createOverlay = () => {
        if (document.getElementById(OVERLAY_ID)) return;
        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.style.cssText = `
            position: fixed !important; top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            background-color: rgba(255, 255, 255, 0.3) !important;
            backdrop-filter: blur(15px) grayscale(50%) !important;
            -webkit-backdrop-filter: blur(15px) grayscale(50%) !important;
            z-index: 2147483647 !important; pointer-events: all !important;
            cursor: not-allowed !important; display: flex !important;
            align-items: center !important; justify-content: center !important;
        `;
        const msg = document.createElement('div');
        msg.style.cssText = `padding: 20px 40px !important; background: #000 !important; color: #fff !important; border-radius: 50px !important; font: bold 20px sans-serif !important;`;
        msg.textContent = '❄️ Frozen by Zone';
        overlay.appendChild(msg);
        (document.body || document.documentElement).appendChild(overlay);
    };

    const removeOverlay = () => {
        const el = document.getElementById(OVERLAY_ID);
        if (el) el.remove();
    };
})();
