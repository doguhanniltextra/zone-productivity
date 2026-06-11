/**
 * Zone Offscreen Document - Handles Audio Playback
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ZONE_PLAY_NOTIFICATION_SOUND') {
        playChillBeep().catch(err => console.error('Audio Playback Error:', err));
        sendResponse({ success: true });
    }
});

/**
 * Generates a soft, chill "bip bip bip" sound using Web Audio API
 */
async function playChillBeep() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Resume context if suspended (Chrome requirement)
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    const createBeep = (startTime) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, startTime); 

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
    };

    createBeep(now);
    createBeep(now + 0.4);
    createBeep(now + 0.8);

    setTimeout(() => {
        if (audioCtx.state !== 'closed') audioCtx.close();
    }, 1500);
}
