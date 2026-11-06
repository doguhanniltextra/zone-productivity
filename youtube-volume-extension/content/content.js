// content/content.js
// Listen for messages from the popup/background and set the YouTube player volume.

function setYouTubeVolume(value) {
  const video = document.querySelector('video');
  if (video) {
    video.volume = Math.min(1, Math.max(0, value));
  }
}

// Apply saved volume on page load.
chrome.storage.sync.get(['youtubeVolume'], ({ youtubeVolume }) => {
  if (typeof youtubeVolume === 'number') {
    setYouTubeVolume(youtubeVolume);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.cmd === 'setVolume') {
    setYouTubeVolume(msg.value);
    // Persist the new volume.
    chrome.storage.sync.set({ youtubeVolume: msg.value });
    sendResponse({ ok: true });
  }
  // Return true to indicate we will respond asynchronously if needed.
  return true;
});

