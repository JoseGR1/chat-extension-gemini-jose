document.getElementById('refresh-navigator').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url.includes('gemini.google.com')) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'refresh_navigator' });
        }
    });

    // Provide feedback to the user
    const button = document.getElementById('refresh-navigator');
    const originalText = button.textContent;
    button.textContent = 'Actualizando...';
    button.disabled = true;
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
});
