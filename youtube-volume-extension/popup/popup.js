// popup/popup.js
const slider = document.getElementById('vol');
const output = document.getElementById('val');

// Load saved volume from storage
chrome.storage.sync.get(['youtubeVolume'], ({ youtubeVolume }) => {
  const val = typeof youtubeVolume === 'number' ? youtubeVolume : 0.025;
  slider.value = val;
  output.textContent = val.toFixed(3);
});

// When user moves the slider, send the new volume to the active YouTube tab
slider.addEventListener('input', () => {
  const v = parseFloat(slider.value);
  output.textContent = v.toFixed(3);
  // Find the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    chrome.tabs.sendMessage(tabs[0].id, { cmd: 'setVolume', value: v });
  });
});

