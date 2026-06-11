# Zone - Browser Focus Extension

Zone is a browser extension built on Manifest V3 designed to mitigate digital distractions and optimize productivity through selective content filtering, automated site blocking, and session management.

## Technical Features

### 1. YouTube Focus Engine
The extension implements dynamic CSS injection to filter specific DOM elements on YouTube:
- Suppression of the homepage feed and related video sidebars.
- Programmatic blocking of the Shorts shelf and navigation entries.
- Optional removal of the comments section to reduce context switching.

### 2. Declarative Site Blocker
Utilizes the `declarativeNetRequest` API for high-performance network request filtering:
- Rule-based blocking for predefined categories: Social Media, Forums, and Streaming.
- Automated cleanup of Service Workers and cache for specific domains (e.g., X.com) to ensure policy enforcement.
- Custom redirect to a local blocked-page fallback.

### 3. Study (Pomodoro) Session Management
A persistent timing service implemented using the `chrome.alarms` API:
- Decoupled state management via `chrome.storage.local` to ensure persistence across sessions and UI closures.
- Phase-based cycling between Work and Break durations.
- Notification integration via `chrome.notifications` API.
- Audio feedback generated through an offscreen document utilizing the Web Audio API for non-blocking playback.

### 4. Tab Switcher
A custom navigation interface injected as a content script:
- Triggered via `Ctrl + Shift + K` or `F9` global key listeners.
- Real-time filtering of active browser tabs via the `chrome.tabs` API.
- Modern light-themed UI implementation for cross-site consistency.

### 5. Pattern Visualization and Analysis
An analytical tool for tracking research trajectories:
- Aggregates last-hour browsing data from the `chrome.history` API.
- Data transformation into a hierarchical tree structure representing root searches and branch navigations.
- UI rendering of navigation chains to identify browsing patterns.

### 6. Tab Interaction Restriction (Freeze)
A visual and functional lock implemented via content scripts:
- Applies CSS filters (blur, grayscale) and disables pointer events on the top-level document.
- Managed via background message passing.

## Installation

1. Clone the repository to your local environment.
2. Navigate to `chrome://extensions/` in a Chromium-based browser.
3. Enable "Developer mode".
4. Select "Load unpacked" and provide the project directory.

## Configuration and Shortcuts
- Default Shortcut: `Ctrl + Shift + K` (Windows/Linux) or `Cmd + Shift + K` (macOS).
- Secondary Shortcut: `F9`.

## Privacy and Data Integrity
Zone operates strictly within the local browser context. No browsing history, configuration data, or analytical patterns are transmitted to external servers.


