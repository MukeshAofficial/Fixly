chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ Grammar-Lite extension installed!');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'correctionMade') {
    console.log('Correction was made on tab:', sender.tab.id);
    // You could update the icon here, for example
    chrome.action.setBadgeText({ text: '✅', tabId: sender.tab.id });
    // Clear the badge after a few seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '', tabId: sender.tab.id });
    }, 3000);
  }
});

chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked!');
    // This is a good place for logic that should run when the user clicks the icon,
    // like opening a settings page or manually triggering a grammar check.
});
let correctionCount = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'correctionMade') {
    correctionCount++;
    chrome.action.setBadgeText({ text: correctionCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#76e8a6' }); // Green color
  }
});