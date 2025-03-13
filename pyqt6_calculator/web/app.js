function parseFeetInches(expression) {
    expression = expression.replace(/'/g, " ft ");
    expression = expression.replace(/"/g, " in");

    const regex = /(\d+)\s*ft\s*(\d+)?\s*(\d+\/\d+)?\s*in?/g;
    return expression.replace(regex, (match, feet, inches = "0", fraction = "0") => {
        feet = parseFloat(feet);
        inches = parseFloat(inches);
        
        if (fraction) {
            const [num, denom] = fraction.split('/');
            inches += parseFloat(num) / parseFloat(denom);
        }
        
        return `(${feet * 12 + inches})`;
    });
}

function calculateFeetInches() {
    const input = document.getElementById('feetInchesInput').value;
    try {
        const parsed = parseFeetInches(input);
        const result = eval(parsed);
        const feet = Math.floor(result / 12);
        const inches = (result % 12).toFixed(3);
        document.getElementById('feetInchesResult').textContent = 
            `${result.toFixed(3)} inches (${feet} ft ${inches} in)`;
    } catch (e) {
        document.getElementById('feetInchesResult').textContent = `Error: ${e.message}`;
    }
}

function solveEquation() {
    const input = document.getElementById('algebraInput').value;
    try {
        // Use math.js to properly solve equations
        const solution = math.solve(input, 'x');
        document.getElementById('algebraResult').textContent = 
            `Solution: x = ${solution}`;
    } catch (e) {
        document.getElementById('algebraResult').textContent = `Error: Invalid equation`;
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
