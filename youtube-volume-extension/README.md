# YouTube Precise Volume Extension

A tiny Chrome/Edge (Manifest V3) extension that lets you set the YouTube video volume with fine‑grained control (step 0.001). The UI is a simple slider in the extension popup, and the chosen value is persisted across tabs and sessions.

## Features
- Slider UI ranging from `0` (mute) to `1` (full volume) with a step of `0.001`.
- Persists the last used volume using `chrome.storage.sync`.
- Works on any YouTube page (`https://www.youtube.com/*`).
- Keyboard shortcut `Ctrl+Shift+U` to open the popup quickly.

## File Structure
```
youtube-volume-extension/
├─ manifest.json
├─ background.js                # Handles the shortcut command
├─ content/
│   └─ content.js               # Sets/gets the volume on the page
├─ popup/
│   ├─ popup.html               # Slider UI
│   ├─ popup.js                 # UI logic, messaging to content script
│   └─ popup.css                # Simple styling
└─ icons/
    ├─ icon16.png               # Replace with real icons
    ├─ icon48.png
    └─ icon128.png
```

## Installation / Testing
1. Open **chrome://extensions/** (or **edge://extensions/**).
2. Enable **Developer mode** (top‑right toggle).
3. Click **Load unpacked** and select the `youtube-volume-extension` folder.
4. Navigate to YouTube. Click the extension icon – the popup shows a slider.
5. Move the slider; the video volume changes instantly. The value is saved and reapplied on page reload or when opening a new YouTube tab.

## Customisation
- **Icons** – replace the placeholder PNG files in `icons/` with your own 16 × 16, 48 × 48, and 128 × 128 PNGs.
- **Default volume** – change the fallback value `0.025` in `popup/popup.js` if you prefer a different starting point.
- **Keyboard shortcuts** – modify `manifest.json` → `commands` to bind other keys (e.g., increase/decrease volume).

## Publishing (optional)
If you wish to publish the extension to the Chrome Web Store or Microsoft Edge Add‑ons:
- Add a proper **privacy statement** (the extension only reads/writes the video volume and sync storage).
- Supply screenshots and a detailed description.
- Follow the store’s packaging and submission guidelines.

---
Feel free to ask for further tweaks, such as adding +/- buttons, hotkeys for stepping the volume, or integrating with other media sites.

