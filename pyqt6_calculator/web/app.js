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
    input = input.replace(/['"]/g, '').toLowerCase().trim();
    
    // More robust regex
    const regex = /(\d+)\s*(?:ft|feet|'|\s)?\s*(\d+(?:\s*\d+\/\d+)?)?\s*(?:in|inch|")?/;
    const match = input.match(regex);
    
    if (!match) {
        showError('feetInchesResult', 'Invalid format. Please use format like "5ft 6 1/2in" or "5\' 6 1/2""');
        throw new Error('Invalid format');
    }
    
    let feet = parseInt(match[1]);
    let inchesStr = match[2];
    let inches = 0;

    if (inchesStr) {
        try {
            inches = math.evaluate(inchesStr);
        } catch (e) {
            showError('feetInchesResult', 'Invalid inches format.  Use a number or fraction.');
            throw new Error('Invalid inches format');
        }
    }
    
    if (isNaN(feet) || isNaN(inches)) {
        showError('feetInchesResult', 'Could not parse feet or inches.');
        throw new Error('Could not parse feet or inches.');
    }

    return `${feet}' ${inches.toFixed(2)}"`;
}

function solveEquation() {
    const input = document.getElementById('algebraInput').value;

    // Sanitize input (very basic example)
    const sanitizedInput = input.replace(/[^0-9x+\-*/=().\s]/g, ''); // Allow only numbers, x, operators, parentheses, equals, and spaces

    try {
        const result = math.evaluate(sanitizedInput);
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
