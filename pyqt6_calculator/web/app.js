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
    // Special preprocessing for quotes and fractions
    let processedInput = input
        // Handle "5ft 6 1/2in" format - this is the key fix we need
        .replace(/(\d+(?:\.\d+)?)\s*ft\s+(\d+)\s+(\d+\/\d+)\s*in/i, "$1ft $2.$3in")
        // Other replacements
        .replace(/(\d+(?:\.\d+)?)[''](\d+(?:\.\d+)?)\s+(\d+\/\d+)[""]?/, "$1ft $2 $3in")
        .replace(/(\d+(?:\.\d+)?)[''](\d+(?:\.\d+)?)[""]?/, "$1ft $2in")
        .replace(/(\d+(?:\.\d+)?)['']/, "$1ft")
        .replace(/(\d+(?:\.\d+)?)[""]/, "$1in")
        .toLowerCase().trim();
    
    console.log("Preprocessed input:", processedInput); // Debug output
    
    // Check for math operations
    if (/[\+\-\*\/]/.test(processedInput)) {
        // Split by operators but keep them in results
        const tokens = processedInput.split(/(\s*[\+\-\*\/]\s*)/);
        let result = 0;
        let operation = '+'; // Default operation
        
        for (let token of tokens) {
            token = token.trim();
            
            // Skip empty tokens
            if (!token) continue;
            
            // If it's an operator, save it for next calculation
            if (/^[\+\-\*\/]$/.test(token)) {
                operation = token;
                continue;
            }
            
            // Otherwise, it's a measurement - calculate its inches
            const inches = measurementToInches(token);
            
            // Apply the operation
            switch (operation) {
                case '+': result += inches; break;
                case '-': result -= inches; break;
                case '*': result *= parseFloat(inches); break;
                case '/': result /= parseFloat(inches); break;
            }
        }
        
        // Convert back to feet and inches
        const feet = Math.floor(result / 12);
        const inches = result % 12;
        return `${feet}' ${inches.toFixed(2)}"`;
    }
    
    // Direct measurement
    const totalInches = measurementToInches(processedInput);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}' ${inches.toFixed(2)}"`;
}

function measurementToInches(text) {
    console.log("Parsing measurement:", text); // Debug output
    
    // Cleanup and normalization
    text = text.trim()
        .replace(/feet/g, 'ft')
        .replace(/inches/g, 'in');
    
    // Fix for "5ft 6 1/2in" format - we need to calculate this correctly
    const mixedFractionWithFeet = /^(\d+(?:\.\d+)?)\s*ft\s+(\d+\s+\d+\/\d+|\d+\.\d+)\s*in$/i.exec(text);
    if (mixedFractionWithFeet) {
        console.log("Mixed fraction with feet match:", mixedFractionWithFeet); // Debug
        
        const feet = parseFloat(mixedFractionWithFeet[1]);
        let inches = 0;
        
        // Check if it contains a fraction or decimal
        const inchPart = mixedFractionWithFeet[2];
        if (inchPart.includes('/')) {
            // Format: "6 1/2"
            const [whole, fraction] = inchPart.trim().split(/\s+/);
            const [num, den] = fraction.split('/');
            inches = parseInt(whole) + parseInt(num) / parseInt(den);
        } else {
            // Format: "6.5"
            inches = parseFloat(inchPart);
        }
        
        console.log(`Parsed ${feet} feet and ${inches} inches = ${feet * 12 + inches} total inches`);
        return feet * 12 + inches;
    }
    
    // Handle mixed fraction inches with feet: "5ft 6 1/2in"
    const mixedWithFeetMatch = /^(\d+(?:\.\d+)?)\s*ft\s+(\d+)\s+(\d+)\/(\d+)\s*in$/i.exec(text);
    if (mixedWithFeetMatch) {
        const feet = parseFloat(mixedWithFeetMatch[1]);
        const wholeInches = parseInt(mixedWithFeetMatch[2]);
        const numerator = parseInt(mixedWithFeetMatch[3]);
        const denominator = parseInt(mixedWithFeetMatch[4]);
        return feet * 12 + wholeInches + numerator / denominator;
    }
    
    // First check for mixed format without spaces: 5ft6in
    const compactMatch = /^(\d+(?:\.\d+)?)\s*ft\s*(\d+(?:\.\d+)?)\s*in$/i.exec(text);
    if (compactMatch) {
        return parseFloat(compactMatch[1]) * 12 + parseFloat(compactMatch[2]);
    }
    
    // Check for mixed fraction with inch unit: "1 1/2in"
    const mixedFractionInchMatch = /^(\d+)\s+(\d+)\/(\d+)\s*in$/i.exec(text);
    if (mixedFractionInchMatch) {
        const wholeNumber = parseInt(mixedFractionInchMatch[1]);
        const numerator = parseInt(mixedFractionInchMatch[2]);
        const denominator = parseInt(mixedFractionInchMatch[3]);
        return wholeNumber + numerator / denominator;
    }
    
    // Extract feet part if present
    let totalInches = 0;
    const feetMatch = /(\d+(?:\.\d+)?)\s*ft/.exec(text);
    if (feetMatch) {
        totalInches += parseFloat(feetMatch[1]) * 12;
        // Remove the feet part for further processing
        text = text.replace(/\d+(?:\.\d+)?\s*ft/, '').trim();
    }
    
    // Extract decimal inches
    const decimalInchMatch = /(\d+(?:\.\d+)?)\s*in/.exec(text);
    if (decimalInchMatch) {
        totalInches += parseFloat(decimalInchMatch[1]);
        // Remove the decimal inch part for further processing
        text = text.replace(/\d+(?:\.\d+)?\s*in/, '').trim();
    }

    // Extract fractional inches with 'in' unit
    const fractionInchMatch = /(\d+)\/(\d+)\s*in/.exec(text);
    if (fractionInchMatch) {
        totalInches += parseInt(fractionInchMatch[1]) / parseInt(fractionInchMatch[2]);
        // Remove the fraction part
        text = text.replace(/\d+\/\d+\s*in/, '').trim();
    }

    // Pure fraction (assume inches if no unit specified)
    const pureFractionMatch = /(\d+)\/(\d+)/.exec(text);
    if (pureFractionMatch) {
        totalInches += parseInt(pureFractionMatch[1]) / parseInt(pureFractionMatch[2]);
    }
    
    // Pure number (assume inches if no unit)
    const pureNumberMatch = /^\d+(?:\.\d+)?$/.exec(text);
    if (pureNumberMatch && totalInches === 0) {
        totalInches += parseFloat(text);
    }
    
    return totalInches;
}

function solveEquation() {
    try {
        const input = document.getElementById('algebraInput').value.trim();
        
        // Basic validation
        if (!input.includes('=')) {
            throw new Error('Equation must contain equals sign (=)');
        }
        
        // Process quadratic equations
        if (input.includes('^2') || input.includes('x*x') || input.includes('x²')) {
            // Special handling for quadratic equations
            const [leftSide, rightSide] = input.split('=').map(s => s.trim());
            
            // Move all terms to left side: ax² + bx + c = 0
            const processedEquation = input
                .replace(/\^2/g, '²')           // Normalize power notation
                .replace(/x\*x/g, 'x²');        // Replace x*x with x²
            
            // Extract coefficients
            let a = 0, b = 0, c = 0;
            
            // Parse left and right sides
            const leftCoeffs = extractCoefficients(leftSide);
            const rightCoeffs = extractCoefficients(rightSide);
            
            // Combine coefficients (left - right)
            a = (leftCoeffs.a || 0) - (rightCoeffs.a || 0);
            b = (leftCoeffs.b || 0) - (rightCoeffs.b || 0);
            c = (leftCoeffs.c || 0) - (rightCoeffs.c || 0);
            
            // Solve using quadratic formula
            if (Math.abs(a) < 1e-10) {
                // Linear equation (ax = -c)
                if (Math.abs(b) < 1e-10) {
                    throw new Error("Not a valid equation (all coefficients are zero)");
                }
                const x = -c / b;
                document.getElementById('algebraResult').textContent = `x = ${Math.round(x * 1000) / 1000}`;
            } else {
                const discriminant = b*b - 4*a*c;
                if (discriminant < 0) {
                    throw new Error("No real solutions");
                }
                
                const sqrtDiscriminant = Math.sqrt(discriminant);
                const x1 = (-b + sqrtDiscriminant) / (2*a);
                const x2 = (-b - sqrtDiscriminant) / (2*a);
                
                // Format results with fixed precision
                const x1Rounded = Math.round(x1 * 1000) / 1000;
                const x2Rounded = Math.round(x2 * 1000) / 1000;
                
                if (Math.abs(x1 - x2) < 1e-10) {
                    document.getElementById('algebraResult').textContent = `x = ${x1Rounded}`;
                } else {
                    document.getElementById('algebraResult').textContent = `x = ${x1Rounded} or x = ${x2Rounded}`;
                }
            }
            return;
        }
        
        // Linear equation solver
        const [leftSide, rightSide] = input.split('=').map(s => s.trim());
        
        // Get coefficient of x and constant term from both sides
        const leftCoeffs = extractLinearCoefficients(leftSide);
        const rightCoeffs = extractLinearCoefficients(rightSide);
        
        // Solve: ax + b = cx + d ==> (a-c)x = d-b ==> x = (d-b)/(a-c)
        const a = leftCoeffs.x || 0;
        const b = leftCoeffs.constant || 0;
        const c = rightCoeffs.x || 0;
        const d = rightCoeffs.constant || 0;
        
        const coefficientOfX = a - c;
        const constantTerm = d - b;
        
        if (Math.abs(coefficientOfX) < 1e-10) {
            throw new Error("Cannot solve: coefficient of x is zero");
        }
        
        const x = constantTerm / coefficientOfX;
        const roundedX = Math.round(x);
        
        // If result is very close to an integer, show integer
        if (Math.abs(x - roundedX) < 1e-10) {
            document.getElementById('algebraResult').textContent = `x = ${roundedX}`;
        } else {
            document.getElementById('algebraResult').textContent = `x = ${x}`;
        }
    } catch (error) {
        showError('algebraResult', error.message);
        console.error('Equation error:', error);
    }
}

// Helper function to extract coefficients from linear expression
function extractLinearCoefficients(expr) {
    // Initialize coefficients
    const coeffs = { x: 0, constant: 0 };
    
    // Normalize expression
    expr = expr.replace(/\s+/g, '')           // Remove spaces
                .replace(/(\d)([a-zA-Z])/g, '$1*$2')  // Add * between number and variable
                .replace(/\-\-/g, '+')         // Double negative becomes positive
                .replace(/\+\-/g, '-')         // +- becomes -
                .replace(/^\+/g, '');          // Remove leading +
    
    // Split into terms
    const terms = expr.match(/[+-]?[^+-]*/g) || [];
    
    for (const term of terms) {
        if (!term) continue;
        
        if (term.includes('x')) {
            // Term with x
            let coef = 1;
            if (term === 'x') coef = 1;
            else if (term === '-x') coef = -1;
            else {
                const match = term.match(/([+-]?\d*\.?\d*)\*?x/);
                if (match && match[1]) {
                    coef = match[1] === '-' ? -1 : match[1] === '+' ? 1 : parseFloat(match[1]);
                }
            }
            coeffs.x += coef;
        } else if (term.match(/[+-]?\d+\.?\d*/)) {
            // Constant term
            coeffs.constant += parseFloat(term);
        }
    }
    
    return coeffs;
}

// Helper function to extract quadratic coefficients (ax² + bx + c)
function extractCoefficients(expr) {
    const coeffs = { a: 0, b: 0, c: 0 };
    
    // Normalize expression with synthetic multiplication symbols
    expr = expr.replace(/\s+/g, '')          // Remove spaces
               .replace(/(\d)([a-zA-Z])/g, '$1*$2')  // Add * between number and variable
               .replace(/\^2/g, '²');         // Standardize square notation
    
    // Split into terms
    const terms = expr.match(/[+-]?[^+-]*/g) || [];
    
    for (const term of terms) {
        if (!term) continue;
        
        if (term.includes('x²')) {
            // x² term
            if (term === 'x²') coeffs.a += 1;
            else if (term === '-x²') coeffs.a -= 1;
            else {
                const match = term.match(/([+-]?\d*\.?\d*)\*?x²/);
                if (match && match[1]) {
                    const coef = match[1] === '-' ? -1 : match[1] === '+' ? 1 : 
                                match[1] === '' ? 1 : parseFloat(match[1]);
                    coeffs.a += coef;
                }
            }
        } else if (term.includes('x')) {
            // x term
            if (term === 'x') coeffs.b += 1;
            else if (term === '-x') coeffs.b -= 1;
            else {
                const match = term.match(/([+-]?\d*\.?\d*)\*?x/);
                if (match && match[1]) {
                    const coef = match[1] === '-' ? -1 : match[1] === '+' ? 1 : 
                                match[1] === '' ? 1 : parseFloat(match[1]);
                    coeffs.b += coef;
                }
            }
        } else if (term.match(/[+-]?\d+\.?\d*/)) {
            // Constant term
            coeffs.c += parseFloat(term);
        }
    }
    
    return coeffs;
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
