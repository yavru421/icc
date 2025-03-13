// Initialize mathjs parser
const parser = math.parser();

function showError(elementId, message) {
    document.getElementById(elementId).innerHTML = `<span class="error">${message}</span>`;
}

function calculateFeetInches() {
    try {
        const input = document.getElementById('feetInchesInput').value;
        const result = parseFeetInches(input);
        document.getElementById('feetInchesResult').textContent = result;
    } catch (error) {
        showError('feetInchesResult', 'Invalid input format. Please use format like "5ft 6 1/2in"');
    }
}

function parseFeetInches(input) {
    // Remove quotes and normalize format
    input = input.replace(/['"]/g, '').toLowerCase();
    const regex = /(\d+)\s*(?:ft|feet|'|\s)\s*(\d+\s*(?:\d+\/\d+|\d*))?\s*(?:in|inch|")?/;
    const match = input.match(regex);
    
    if (!match) throw new Error('Invalid format');
    
    const feet = parseInt(match[1]);
    const inches = match[2] ? math.evaluate(match[2]) : 0;
    
    return `${feet}' ${inches.toFixed(2)}"`;
}

function solveEquation() {
    try {
        const input = document.getElementById('algebraInput').value;
        const result = math.evaluate(input);
        document.getElementById('algebraResult').textContent = result;
    } catch (error) {
        showError('algebraResult', 'Invalid equation. Please check your input.');
    }
}

// Add input validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.nextElementSibling.click();
            }
        });
    });
});
