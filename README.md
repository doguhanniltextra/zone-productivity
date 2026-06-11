# Zone - Distraction-Free Experience

**Zone** is a powerful browser extension designed to help you regain focus by eliminating digital distractions and visualizing your browsing patterns. It transforms your browser into a productivity-first environment.

---

## 🚀 Key Features

### 1. Focus Engine (YouTube Optimization)
Take control of your YouTube experience. Zone surgically removes the most addictive elements:
- **Hide Home Feed:** No more infinite scrolling on the homepage.
- **Hide Recommendations:** Stay focused on the video you came for.
- **Block Shorts:** Eliminate the short-form content loop.
- **Hide Comments:** Focus on the content, not the noise.

### 2. Strict Site Blocker
Effortlessly block entire categories of time-consuming websites using Chrome's `declarativeNetRequest` for high performance:
- **Social Media:** Instagram, Facebook, X (Twitter), etc.
- **Forums:** Reddit, 9gag, Hacker News.
- **Streaming:** Netflix, Twitch, Disney+, and more.
- *Includes automatic cleanup of service workers for blocked sites to ensure strict enforcement.*

### 3. Zone Switcher (Neovim-Inspired)
A keyboard-centric tab switcher designed for power users. Press `Ctrl+Shift+K` (or `Cmd+Shift+K` on Mac) to:
- Search through all open tabs instantly.
- Navigate using `j/k` or arrow keys.
- Swiftly switch between windows and tabs without touching the mouse.

### 4. Tab Freezing
Need a temporary break or want to lock a tab?
- **Freeze Mode:** Applies a high-quality blur and grayscale filter over the current page, preventing interaction and visual distractions while keeping the tab open.

### 5. Pattern Visualization
Understand your digital habits. Zone tracks and visualizes your navigation chains:
- **History Aggregation:** See which hostnames you visit most.
- **Path Analysis:** Visualize how you move between sites (Roots vs. Branches).
- **Time-Based Filtering:** Focus on your recent activity to identify rabbit holes.

---

## 🛠 Installation

1. Clone or download this repository.
2. Open your browser and navigate to the Extensions page (`chrome://extensions`).
3. Enable **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"** and select the project folder.

---

## ⌨️ Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl+Shift+K` | Open/Close Zone Switcher |
| `j` / `k` | Navigate Down/Up (in Switcher) |
| `Enter` | Switch to selected tab |
| `Esc` | Close Switcher |

---

## 🏗 Technical Architecture

Zone is built with a modern Manifest V3 architecture:
- **Background Service Worker:** Manages navigation, tab switching, and site blocking logic.
- **Declarative Net Request:** Efficient, privacy-respecting site blocking.
- **Content Scripts:** Dynamic CSS injection for UI customization and the Focus Engine.
- **Side Panel & Popup:** Clean UI for settings and pattern visualization.
- **Storage API:** Syncs your preferences across devices.

---

## 🔒 Privacy
Zone operates entirely on your local machine. It does not upload your browsing history or personal data to any external servers.

---

*Stay in the Zone.*
