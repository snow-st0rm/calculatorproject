const display = document.getElementById('display');
let lastResult = 0;
let justCalculated = false;


// APPEND + RESULT SAVING
function appendValue(value) {
    if (display.value.startsWith('Error')) display.value = '';

    if (justCalculated) {
        display.value = '';
        justCalculated = false;
    }

    if (value === 'π') {
        display.value += Math.PI.toFixed(8);
    } else if (value === 'Ans') {
        display.value += lastResult;
    } else {
        display.value += value;
    }
}

// CLEAR BUTTONS
function clearDisplay() {
    display.value = '';
}

function clearEntry() {
    display.value = display.value.slice(0, -1);
}

// ROOT FUNCTION
function processNthRoots(expr) {
    return expr.replace(/(\d*)√\s*(\([^)]+\)|\d+)/g, (_, n, value) => {
        if (value.startsWith('(') && value.endsWith(')')) {
            value = value.slice(1, -1);
        }
        if (!n) n = 2;
        return `Math.pow(${value},1/${n})`;
    });
}

// CALCULATIONS
function calculate() {
    let expression = display.value;

    try {
        // roots
        expression = processNthRoots(expression);

        // ^
        expression = expression.replace(
            /([0-9.]+|\([^()]+\))\^([0-9.]+|\([^()]+\))/g,
            'Math.pow($1,$2)'
        );

        // π
        expression = expression.replace(/π/g, Math.PI);

        // module
        expression = expression.replace(/\bmod\b/g, '%');

        // n% and %n
        expression = expression
            .replace(/([0-9.]+)%/g, '($1/100)')
            .replace(/%([0-9.]+)/g, '($1/100)');

        const result = eval(expression);

        // division by 0
        if (!isFinite(result)) {
            display.value = 'Error (división por 0)';
            return;
        }

        lastResult = +result.toFixed(8);
        display.value = lastResult;
        justCalculated = true;

    } catch (error) {
        display.value = 'Error de Sintaxis';
    }
}

// ADD EVENT LISTENER
document.getElementById('btn-clear').addEventListener('click', clearDisplay);
document
    .getElementById('btn-clear-entry')
    .addEventListener('click', clearEntry);

// ANIMATION
window.addEventListener('DOMContentLoaded', () => {
    const calculator = document.querySelector('.calculator');
    calculator.classList.add('animate');
});
