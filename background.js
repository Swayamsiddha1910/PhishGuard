const API_KEY = "AIzaSyAkePIzPIygVZmWVBiJRP8uMu4RAhochGE"; // 🔹 Replace this with your actual key
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

chrome.webNavigation.onCompleted.addListener((details) => {
    if (!details.url) return;

    console.log("🔍 Checking URL:", details.url);
    checkPhishingURL(details.url);

    // Inject content.js into the active tab
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["content.js"]
    }).catch(err => console.error("❌ Error injecting content script:", err));
}, { url: [{ schemes: ["http", "https"] }] });

function checkPhishingURL(url) {
    const requestBody = {
        client: {
            clientId: "phishguard-extension",
            clientVersion: "1.1"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.matches) {
            showWarningNotification(url);
        }
    })
    .catch(error => console.error("❌ API Error:", error.message));
}

function showWarningNotification(url) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "⚠️ Phishing Warning!",
        message: `🚨 This site may be a phishing attempt: ${url}`,
        priority: 2
    });
}

// Listen for messages from content.js to check links dynamically
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkPhishing") {
        checkPhishingURL(request.url);
    }
});
