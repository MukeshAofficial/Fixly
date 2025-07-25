// --- 1. Configuration & Debouncing ---

// The URL of your local FastAPI backend
const API_URL = "http://127.0.0.1:8000/correct";

// Debounce function to prevent API calls on every keystroke
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

    // Don't process empty text
    if (!originalText || originalText.trim().length < 10) {
        removeSuggestion(targetElement);
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

        // If the correction is the same as the original, do nothing
        if (originalText.trim() === correctedText.trim()) {
            removeSuggestion(targetElement);
            return;
        }
        
        displaySuggestion(targetElement, originalText, correctedText);

    } catch (error) {
        console.error("Grammar-Lite Error:", error);
    }
}

// Simple diffing logic to highlight changes
function createDiffHTML(original, corrected) {
    const originalWords = original.split(/\s+/);
    const correctedWords = corrected.split(/\s+/);
    let html = '';

    // This is a basic diff; more advanced libraries exist but this works for simple cases.
    correctedWords.forEach(word => {
        if (!originalWords.includes(word)) {
            html += `<ins>${word}</ins> `; // Inserted word
        } else {
            html += `${word} `;
        }
    });
    return html.trim();
}


function displaySuggestion(target, original, corrected) {
    // Remove any existing suggestion for this target
    removeSuggestion(target);

    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'grammar-suggestion-box';
    suggestionBox.innerHTML = createDiffHTML(original, corrected);

    // Position the suggestion box near the input field
    const rect = target.getBoundingClientRect();
    suggestionBox.style.top = `${window.scrollY + rect.bottom + 5}px`;
    suggestionBox.style.left = `${window.scrollX + rect.left}px`;
    
    // Store a reference to the target element
    suggestionBox.dataset.targetId = target.id || (target.id = `gl-target-${Date.now()}`);

    // Add click event to accept the suggestion
    suggestionBox.addEventListener('click', () => {
        if (target.value) {
            target.value = corrected;
        } else {
            target.innerText = corrected;
        }
        removeSuggestion(target);
    });
    
    document.body.appendChild(suggestionBox);
}

function removeSuggestion(targetElement) {
    const targetId = targetElement.id;
    if (targetId) {
        const existingSuggestion = document.querySelector(`.grammar-suggestion-box[data-target-id="${targetId}"]`);
        if (existingSuggestion) {
            existingSuggestion.remove();
        }
    }
}


// --- 3. Event Listeners ---

// Create a debounced version of our grammar check function
const debouncedCheckGrammar = debounce(checkGrammar, 1500); // 1.5-second delay

// Attach listeners to the document
document.addEventListener('keyup', (event) => {
    // Listen to textareas and content-editable divs
    if (event.target.matches('textarea, [contenteditable="true"]')) {
        debouncedCheckGrammar(event);
    }
});

// Clean up suggestions when the user clicks away
document.addEventListener('focusout', (event) => {
     if (event.target.matches('textarea, [contenteditable="true"]')) {
        // We add a small delay to allow a click on the suggestion box
        setTimeout(() => {
           const suggestionBox = document.querySelector(`.grammar-suggestion-box[data-target-id="${event.target.id}"]`);
           if (suggestionBox && !suggestionBox.matches(':hover')) {
             removeSuggestion(event.target);
           }
        }, 200);
    }
});
console.log("✅ Grammar-Lite content script loaded!"); 
