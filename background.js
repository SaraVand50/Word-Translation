// background.js
let userPreferences = {};

chrome.runtime.onInstalled.addListener(() => {
    // Default preferences on installation
    userPreferences = {
        translationLanguage: 'en',
    };

    // Saving preferences
    chrome.storage.sync.set({ userPreferences });
});

// Changes in user preferences
chrome.storage.onChanged.addListener((changes) => {
    if (changes.userPreferences) {
        userPreferences = changes.userPreferences.newValue;
    }
});

// Exposing user preferences to other scripts
function getUserPreferences() {
    return userPreferences;
}

// External requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getUserPreferences') {
        sendResponse(getUserPreferences());
    }
});

