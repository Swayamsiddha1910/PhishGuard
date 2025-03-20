document.addEventListener("DOMContentLoaded", () => {
    const scanButton = document.getElementById("scan");
    const resultText = document.getElementById("result");
    const lastUrlText = document.getElementById("lastUrl");

    scanButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const currentUrl = tabs[0].url;
                lastUrlText.textContent = currentUrl;
                checkPhishingURL(currentUrl);
            } else {
                resultText.innerText = "❌ No active tab found!";
            }
        });
    });

    function checkPhishingURL(url) {
        const API_KEY = "AIzaSyAkePIzPIygVZmWVBiJRP8uMu4RAhochGE"; // Replace with your API key
        const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

        fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                client: { clientId: "phishguard-extension", clientVersion: "1.1" },
                threatInfo: {
                    threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                    platformTypes: ["ANY_PLATFORM"],
                    threatEntryTypes: ["URL"],
                    threatEntries: [{ url }]
                }
            }),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.matches) {
                resultText.innerHTML = `⚠️ <span style="color: red;">Warning!</span> This site is unsafe.`;
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
