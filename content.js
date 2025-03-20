console.log("🔍 Content script active...");

// === Highlight Suspicious Links ===
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

// === Detect Suspicious Login Forms ===
document.querySelectorAll("form").forEach(form => {
    let passwordInputs = form.querySelectorAll("input[type='password']");
    
    if (passwordInputs.length > 0) {
        let formText = form.innerText.toLowerCase();
        if (formText.includes("login") || formText.includes("signin") || formText.includes("password")) {
            form.style.border = "2px solid red";
            console.warn("⚠️ Potential phishing login form detected!");
            alert("🚨 Warning: This page has a suspicious login form!");
        }
    }
});

// === Detect Hidden or Suspicious Input Fields ===
document.querySelectorAll("input").forEach(input => {
    let style = window.getComputedStyle(input);
    if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) < 0.1) {
        let parentForm = input.closest("form");
        if (parentForm) {
            parentForm.style.border = "2px solid orange";
            console.warn("⚠️ Hidden input field detected in a form.");
        }
    }
});

// === Detect Clipboard Copy Behavior ===
document.addEventListener("copy", function() {
    alert("🚨 Caution: This site might be trying to capture your copied data!");
});
