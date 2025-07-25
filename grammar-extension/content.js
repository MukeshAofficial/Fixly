// --- 1. Configuration & Debouncing ---
console.log("✅ Grammar-Lite content script loaded!");
const API_URL = "http://127.0.0.1:8000/correct";

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// --- 2. Core Logic: API Call and Suggestion Display ---
async function checkGrammar(event) {
    const targetElement = event.target;
    const originalText = targetElement.value || targetElement.innerText;

    if (!originalText || originalText.trim().length < 10) {
        removeSuggestion();
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: originalText })
        });

        if (!response.ok) return;

        const data = await response.json();
        const correctedText = data.corrected_text;

        if (originalText.trim() === correctedText.trim()) {
            removeSuggestion();
            return;
        }
        
        displaySuggestion(targetElement, originalText, correctedText);

    } catch (error) {
        console.error("Grammar-Lite Error:", error);
    }
}

function createDiffHTML(original, corrected) {
    const originalWords = original.split(/\s+/);
    const correctedWords = corrected.split(/\s+/);
    let html = '';

    correctedWords.forEach(word => {
        if (!originalWords.includes(word)) {
            html += `<ins>${word}</ins> `;
        } else {
            html += `${word} `;
        }
    });
    return html.trim();
}

function displaySuggestion(target, original, corrected) {
    chrome.runtime.sendMessage({ type: 'correctionMade' });
    removeSuggestion();

    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'grammar-suggestion-box';
    suggestionBox.innerHTML = createDiffHTML(original, corrected);

    suggestionBox.dataset.targetId = target.id || (target.id = `gl-target-${Date.now()}`);

    suggestionBox.addEventListener('click', () => {
        if (target.value !== undefined) {
            target.value = corrected;
        } else {
            target.innerText = corrected;
        }
        removeSuggestion();
    });
    
    document.body.appendChild(suggestionBox);
}

function removeSuggestion() {
    const existingSuggestion = document.querySelector('.grammar-suggestion-box');
    if (existingSuggestion) {
        existingSuggestion.remove();
    }
}

// --- 3. Event Listeners ---
const debouncedCheckGrammar = debounce(checkGrammar, 1500);

document.addEventListener('keyup', (event) => {
    if (event.target.matches('textarea, [contenteditable="true"]')) {
        debouncedCheckGrammar(event);
    }
});
