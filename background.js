const API_KEY = "AIzaSyAkePIzPIygVZmWVBiJRP8uMu4RAhochGE"; // 🔹 Replace this with your actual key
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        console.log("Checking URL:", tab.url);
        checkPhishingURL(tab.url);
    }
});

function checkPhishingURL(url) {
    const requestBody = {
        client: {
            clientId: "phishguard-extension",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }]
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
        message: `This site may be a phishing attempt: ${url}`,
        priority: 2
    });
}
