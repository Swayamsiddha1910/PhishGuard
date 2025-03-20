document.addEventListener("DOMContentLoaded", () => {
    const scanButton = document.getElementById("scan");
    const resultText = document.getElementById("result");

    scanButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const currentUrl = tabs[0].url;
                checkPhishingURL(currentUrl);
            } else {
                resultText.innerText = "❌ No active tab found!";
            }
        });
    });

    function checkPhishingURL(url) {
        const API_KEY = "AIzaSyAkePIzPIygVZmWVBiJRP8uMu4RAhochGE"; // Replace with your key
        const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

        const requestBody = {
            client: { clientId: "phishguard-extension", clientVersion: "1.0" },
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
                resultText.innerHTML = `⚠️ <span style="color: red;">Warning!</span> This site is flagged as unsafe.`;
            } else {
                resultText.innerHTML = `✅ <span style="color: green;">Safe</span>: No threats detected.`;
            }
        })
        .catch(error => {
            resultText.innerText = "❌ Error checking URL.";
            console.error("API Error:", error);
        });
    }
});
