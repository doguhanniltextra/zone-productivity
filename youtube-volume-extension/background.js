// background.js
// This service worker handles the shortcut that opens the popup.
chrome.commands.onCommand.addListener((command) => {
  if (command === '_execute_action') {
    // Open the extension popup for the active tab.
    chrome.action.openPopup();
  }
});

