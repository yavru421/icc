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
    // Normalize input - support for math operations
    input = input.replace(/['"]/g, '').toLowerCase().trim()
        .replace(/feet/g, 'ft')
        .replace(/inches/g, 'in')
        .replace(/\s*\+\s*/g, ' + ')
        .replace(/\s*\-\s*/g, ' - ')
        .replace(/\s*\*\s*/g, ' * ')
        .replace(/\s*\/\s*/g, ' / ');

    // Split on math operators
    const parts = input.split(/(\s*[\+\-\*\/]\s*)/);
    let totalInches = 0;
    let operation = '+';

    for(let part of parts) {
        part = part.trim();
        
        // Handle operators
        if(['+', '-', '*', '/'].includes(part)) {
            operation = part;
            continue;
        }
        
        if(!part) continue;

        // Parse individual measurement
        const measurement = parseSingleMeasurement(part);
        
        // Perform math operation
        switch(operation) {
            case '+': totalInches += measurement; break;
            case '-': totalInches -= measurement; break;
            case '*': totalInches *= parseFloat(measurement); break;
            case '/': totalInches /= parseFloat(measurement); break;
        }
    }

    // Convert back to feet and inches
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    
    return `${feet}' ${inches.toFixed(2)}"`;
}

function parseSingleMeasurement(text) {
    // Match: 5ft, 5' 6", 5 feet 6.5 inches, 6in, 1/2", etc
    const regex = /(?:(\d*\.?\d+)\s*(?:ft|feet|')\s*)?(?:(\d*\.?\d+(?:\s*\d+\/\d+)?)\s*(?:in|inch|"|inches)?)?/i;
    const match = text.match(regex);

    if (!match || (!match[1] && !match[2])) {
        throw new Error(`Invalid measurement format: ${text}`);
    }

    let inches = 0;

    // Handle feet
    if (match[1]) {
        inches += parseFloat(match[1]) * 12;
    }

    // Handle inches
    if (match[2]) {
        let inchPart = match[2];
        
        // Handle fractions
        if (inchPart.includes('/')) {
            inchPart = inchPart.split(/\s+/).map(part => {
                if (part.includes('/')) {
                    const [num, den] = part.split('/');
                    return parseFloat(num) / parseFloat(den);
                }
                return parseFloat(part);
            }).reduce((a, b) => a + b, 0);
        }
        
        inches += parseFloat(inchPart);
    }

    if (isNaN(inches)) {
        throw new Error('Invalid number format');
    }

    return inches;
}

function solveEquation() {
    try {
        const input = document.getElementById('algebraInput').value.trim();
        
        // Handle equation format
        if (!input.includes('=')) {
            throw new Error('Equation must contain equals sign (=)');
        }

        // Split and solve equation
        const [leftSide, rightSide] = input.split('=').map(s => s.trim());
        
        // Create equation in the form: expression = 0
        const equation = `${leftSide} - (${rightSide})`;
        
        // Solve for x
        const solution = math.solve(equation, 'x');
        
        // Format and display result
        document.getElementById('algebraResult').textContent = 
            Array.isArray(solution) ? `x = ${solution.join(' or x = ')}` : `x = ${solution}`;
            
    } catch (error) {
        showError('algebraResult', `Error: ${error.message}`);
        console.error('Equation error:', error);
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
