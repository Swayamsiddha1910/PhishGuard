document.querySelectorAll("a").forEach(link => {
    const url = link.href;
    
    if (!url.startsWith("http")) return; // Ignore non-URL links

    chrome.runtime.sendMessage({ action: "checkPhishing", url: url }, response => {
        if (response && response.isPhishing) {
            link.style.color = "red";
            link.style.fontWeight = "bold";
            link.title = "⚠️ Warning! This link may be a phishing attempt.";
            link.insertAdjacentHTML("afterend", " <span style='color: red;'>⚠️</span>");
        }
    });
});
