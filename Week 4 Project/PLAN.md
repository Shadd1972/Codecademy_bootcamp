# Calculator Project Development Plan

## Project Overview

Build a functional JavaScript calculator that performs basic arithmetic operations. This project focuses on using if statements, variables, operators, and proper function implementation.

Note: Consider supplementing your knowledge on these topics using the courses and resources available on the resourcs.md file

## Important: HTML Button Connections

**CRITICAL:** All HTML buttons are connected to a single function:

- **ALL buttons** call `handleInput(value)` where value is the button's text
- **Examples:**

  - Number button "7" calls `handleInput('7')`
  - Operator button "+" calls `handleInput('+')`
  - Clear button "C" calls `handleInput('C')`
  - Equals button "=" calls `handleInput('=')`
  - CE button calls `handleInput('CE')`

- The value from the display will be updated, set, and grabbed by using the following functions:
  - updateDisplay(value)
  - setDisplay(value)
  - getDisplay(value)

**Your handleInput() function must route these inputs to the appropriate helper functions!**

Hint: parseFloat() may help you with changing the string values that come in to the handle input
if you need to check if they are a number or not

## Essential State Variables

**IMPORTANT:** Your calculator will need to track state between button clicks. Consider creating these variables to manage calculator state:

- `firstOperand`: When user enters "5 + 3", you need to remember the "5"
- `operator`: When user enters "5 + 3", you need to remember the "+"
- `shouldResetDisplay`: After pressing "=" or an operator, the next number should start fresh

## Development Tips

1. **Start Simple:** Implement one function at a time
2. **Test Early:** Test each function as you complete it
3. **Use Console Logs:** Add detailed logging to track your code's behavior
4. **Handle Edge Cases:** Test with unusual inputs
5. **Follow Requirements:** Pay attention to MUST USE requirements (loops, if statements)

## Debugging Strategy

1. **Read Error Messages:** Check the console for JavaScript errors
2. **Use Console Logs:** Add logs to see what values your functions receive
3. **Use Debugger:** Set breakpoints to step through your code
4. **Validate Inputs:** Make sure your functions receive the expected data types

## Testing Your Functions

### Method 1: Chrome Developer Tools Console

1. Open `index.html` in Chrome
2. Press `F12` or right-click → "Inspect" to open Developer Tools
3. Go to the "Console" tab
4. Test your functions directly by typing them in the console

**Example Console Tests:**

```javascript
// Test handleInput function (main router)
// adding logs will make it easier to know what is happeing
handleInput("7"); // Should handle number input
handleInput("+"); // Should handle operator input
handleInput("3"); // Should handle second number
handleInput("="); // Should execute operation

// Test arithmetic functions
add(5, 3); // Should return 8
subtract(10, 4); // Should return 6
multiply(6, 7); // Should return 42
divide(15, 3); // Should return 5
divide(10, 0); // Should return "Error"

// Test helper functions
handleNumber("5"); // Should update display
handleOperator("+"); // Should store operator
executeOperation(); // Should calculate result
resetCalculator(); // Should clear all state

// Test complete operations
handleInput("5");
handleInput("+");
handleInput("3");
handleInput("="); // Should display 8
```

### Method 2: Chrome Debugger

1. Open Chrome Developer Tools (F12)
2. Go to the "Sources" tab
3. Find and open your `script.js` file
4. Set breakpoints by clicking on line numbers
5. Use the calculator or refresh the page to trigger your functions
6. Step through your code line by line

**Learn more about Chrome Debugger:** [Chrome DevTools JavaScript Debugging](https://developer.chrome.com/docs/devtools/javascript/)
