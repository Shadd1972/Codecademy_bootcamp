// ===================================================================
// DO NOT MODIFY THE CODE BELOW - Call or reference them in your code as needed
// ===================================================================

function updateDisplay(value) {
  const display = document.getElementById("display");
  display.value = String(parseFloat(value));
}

function setDisplay(value) {
  const display = document.getElementById("display");
  display.value = String(value);
}

function getDisplay(value) {
  const display = document.getElementById("display");
  display.value = value;
}

//Set up display to show zero when starting
updateDisplay(0);

// ===================================================================
// DO NOT MODIFY THE CODE Above - Call or reference them in your code as needed
// ===================================================================

// Configuration
const MAX_DISPLAY_LENGTH = 12;

// State variables
let firstOperand = null;
let operator = null;
let shouldResetDisplay = false;

// For repeated-equals behavior
let lastOperator = null;
let lastSecondOperand = null;

/**
 * Main input handler called from HTML buttons
 * This function receives ALL button clicks and routes them to the appropriate handler
 * @param {string} input - The input value from button clicks
 */
function handleInput(input) {
  console.log(`Button clicked: ${input}`);

  // Number?
  if (/^[0-9]$/.test(input)) {
    handleNumber(input);
    maybeNormalizeDisplayAfterTyping();
    return;
  }

  // Decimal
  if (input === ".") {
    handleDecimal();
    // Preserve trailing decimal while typing; normalization helper will decide
    maybeNormalizeDisplayAfterTyping();
    return;
  }

  // Operators
  if (["+", "-", "*", "/"].includes(input)) {
    handleOperator(input);
    maybeNormalizeDisplayAfterTyping();
    return;
  }

  // Equals
  if (input === "=") {
    executeOperation();
    // After equals we want normalized numeric display (unless "Error")
    maybeNormalizeDisplayAfterTyping(true);
    return;
  }

  // Clear all
  if (input === "C") {
    resetCalculator();
    updateDisplay(0);
    return;
  }

  // Clear Entry (CE) - clears only current display entry
  if (input === "CE") {
    setDisplay(0);
    shouldResetDisplay = true;
    console.log("Clear Entry pressed");
    maybeNormalizeDisplayAfterTyping();
    return;
  }

  console.warn(`Unhandled input: ${input}`);
  maybeNormalizeDisplayAfterTyping();
}

// Helper: if the current display is numeric AND not a user-editing-in-progress (like trailing '.' or single '-'),
// normalize it using updateDisplay. Optionally force normalization after equals.
function maybeNormalizeDisplayAfterTyping(forceNormalize = false) {
  const val = document.getElementById("display").value;
  if (val === "Error") {
    return;
  }

  // If user is mid-typing a decimal (ends with '.') or a lone '-' we should not normalize,
  // unless forceNormalize is true (e.g., after equals)
  const endsWithDot = val.endsWith(".");
  const loneMinus = val === "-";

  if (
    !forceNormalize &&
    (endsWithDot ||
      loneMinus ||
      (val.includes(".") && !/^\-?\d+(\.\d+)?$/.test(val)))
  ) {
    // preserve user-typed form
    return;
  }

  // If string parses to a number, normalize it, but respect max length by formatting
  if (!isNaN(parseFloat(val))) {
    const num = parseFloat(val);
    const formatted = formatNumberToMax(num);
    // If formatting returns "Error" (e.g. overflow/infinite), setDisplay("Error")
    if (formatted === "Error") {
      setDisplay("Error");
    } else {
      updateDisplay(formatted);
    }
  }
}

// Format numeric results to fit the display max length
function formatNumberToMax(num) {
  let s = String(num);

  // If 'NaN' or 'Infinity' treat as error
  if (!isFinite(num) || isNaN(num)) {
    console.error("Invalid numeric result");
    return "Error";
  }

  // If short enough, return the number as-is (number)
  if (s.length <= MAX_DISPLAY_LENGTH) {
    return num;
  }

  // Try to fit by using toPrecision for significant digits
  const isNegative = num < 0;
  const reserve = isNegative ? 1 : 0;
  const maxSig = Math.max(1, MAX_DISPLAY_LENGTH - reserve);

  const p = Number(num).toPrecision(maxSig);
  if (p.length <= MAX_DISPLAY_LENGTH) {
    // Return as Number so updateDisplay will parseFloat and format
    return Number(p);
  }

  // Fallback to exponential with enough digits to fit
  const expDigits = Math.max(0, MAX_DISPLAY_LENGTH - 5); // rough room for e+NN
  const exp = Number(num).toExponential(Math.max(0, expDigits));
  if (exp.length <= MAX_DISPLAY_LENGTH) {
    return exp;
  }

  // As a last resort, truncate string representation (warn)
  console.warn("Result truncated to fit display");
  return s.slice(0, MAX_DISPLAY_LENGTH);
}

// Arithmetic functions
function add(a, b) {
  const res = a + b;
  console.log(`Adding ${a} + ${b} = ${res}`);
  return res;
}

function subtract(a, b) {
  const res = a - b;
  console.log(`Subtracting ${a} - ${b} = ${res}`);
  return res;
}

function multiply(a, b) {
  const res = a * b;
  console.log(`Multiplying ${a} * ${b} = ${res}`);
  return res;
}

function divide(a, b) {
  if (b === 0) {
    console.error("Division by zero attempted");
    return "Error";
  }
  const res = a / b;
  console.log(`Dividing ${a} / ${b} = ${res}`);
  return res;
}

/**
 * Handles number input (0-9)
 * @param {string} number - The number that was clicked
 */
function handleNumber(number) {
  const displayEl = document.getElementById("display");
  let current = displayEl.value;

  // If current display is "Error", start fresh
  if (current === "Error") {
    setDisplay(number);
    shouldResetDisplay = false;
    return;
  }

  // Respect max length (count characters including '-' and '.')
  if (!shouldResetDisplay && current.length >= MAX_DISPLAY_LENGTH) {
    console.warn("Max display length reached; additional digits ignored");
    return;
  }

  // If starting fresh (after operator or equals), replace display
  if (shouldResetDisplay || current === "" || current === "0") {
    setDisplay(number);
    shouldResetDisplay = false;
    // Preserve lastOperator/lastSecondOperand for repeated-equals chain (do not clear)
    return;
  }

  // If the display currently is just '-' (user started negative), append digit
  if (current === "-") {
    setDisplay(current + number);
    return;
  }

  // Normal append
  setDisplay(current + number);
}

/**
 * Handles decimal point input
 */
function handleDecimal() {
  const displayEl = document.getElementById("display");
  let current = displayEl.value;

  // If current display is "Error", start fresh with 0.
  if (current === "Error") {
    setDisplay("0.");
    shouldResetDisplay = false;
    return;
  }

  // If starting fresh (after operator or equals), start new "0."
  if (shouldResetDisplay) {
    setDisplay("0.");
    shouldResetDisplay = false;
    return;
  }

  // If current is lone '-', allow "-0." for negative decimals
  if (current === "-") {
    setDisplay("-0.");
    return;
  }

  // Prevent multiple decimals in one number
  if (current.includes(".")) {
    console.warn("Attempted to add second decimal point to a number");
    return;
  }

  // Respect max length
  if (current.length + 1 > MAX_DISPLAY_LENGTH) {
    console.warn("Cannot add decimal - would exceed display limit");
    return;
  }

  setDisplay(current + ".");
}

/**
 * Handles operator input (+, -, *, /)
 * @param {string} nextOperator - The operator that was clicked
 */
function handleOperator(nextOperator) {
  const displayEl = document.getElementById("display");
  const currentDisplay = displayEl.value;

  // Special case: allow negative number as first input by pressing '-' when no operand yet
  if (
    nextOperator === "-" &&
    firstOperand === null &&
    !shouldResetDisplay &&
    (currentDisplay === "0" || currentDisplay === "" || currentDisplay === "0.")
  ) {
    // Start negative number entry
    setDisplay("-");
    console.log("Starting negative number entry");
    return;
  }

  // If there is already an operator and user pressed a new operator without entering a new number,
  // just switch the operator.
  if (operator && shouldResetDisplay) {
    operator = nextOperator;
    console.log(`Operator changed to ${operator}`);
    return;
  }

  // If display currently shows '-', user hasn't typed digits — treat that as -0
  let currentValue = parseFloat(currentDisplay);
  if (currentDisplay === "-") {
    currentValue = -0;
  }
  if (isNaN(currentValue)) {
    currentValue = 0;
  }

  if (firstOperand === null) {
    firstOperand = currentValue;
  } else if (operator) {
    // Compute intermediate result for chaining operations like 2 + 3 + ...
    const result = operate(firstOperand, operator, currentValue);
    if (result === "Error") {
      setDisplay("Error");
      firstOperand = null;
      operator = null;
      lastOperator = null;
      lastSecondOperand = null;
      shouldResetDisplay = true;
      return;
    }
    // Set the intermediate result as the firstOperand for next operation
    firstOperand = result;
    // Format the intermediate result to fit display
    const formatted = formatNumberToMax(result);
    if (formatted === "Error") {
      setDisplay("Error");
    } else {
      setDisplay(formatted);
    }
  }

  // When user explicitly selects an operator, clear the repeated-equals chain
  lastOperator = null;
  lastSecondOperand = null;

  operator = nextOperator;
  shouldResetDisplay = true;
  console.log(`Operator set to ${operator}, firstOperand = ${firstOperand}`);
}

/**
 * Helper to pick operation function
 */
function operate(a, op, b) {
  if (op === "+") return add(a, b);
  if (op === "-") return subtract(a, b);
  if (op === "*") return multiply(a, b);
  if (op === "/") return divide(a, b);
  console.error(`Unknown operator: ${op}`);
  return "Error";
}

/**
 * Executes the calculation when = is pressed
 */
function executeOperation() {
  const displayEl = document.getElementById("display");
  const currentDisplay = displayEl.value;

  // If display is '-' treat as -0
  let currentValue = parseFloat(currentDisplay);
  if (currentDisplay === "-") {
    currentValue = -0;
  }
  if (isNaN(currentValue)) {
    currentValue = 0;
  }

  // Standard case: operator pending, perform it and remember for repeated equals
  if (operator !== null && firstOperand !== null) {
    const result = operate(firstOperand, operator, currentValue);
    if (result === "Error") {
      setDisplay("Error");
      firstOperand = null;
      operator = null;
      lastOperator = null;
      lastSecondOperand = null;
      shouldResetDisplay = true;
      return;
    }

    // Save last operation for repeated-equals
    lastOperator = operator;
    lastSecondOperand = currentValue;

    // Format and display result
    const formatted = formatNumberToMax(result);
    if (formatted === "Error") {
      setDisplay("Error");
      firstOperand = null;
    } else {
      setDisplay(formatted);
      firstOperand = parseFloat(formatted);
    }
    console.log(`Operation result: ${result}`);

    // Prepare for repeated equals: clear current operator
    operator = null;
    shouldResetDisplay = true;
    return;
  }

  // If no operator is present, but we have a lastOperator/lastSecondOperand from a previous equals,
  // apply repeated-equals behavior.
  if (lastOperator !== null && firstOperand !== null) {
    const result = operate(firstOperand, lastOperator, lastSecondOperand);
    if (result === "Error") {
      setDisplay("Error");
      firstOperand = null;
      operator = null;
      lastOperator = null;
      lastSecondOperand = null;
      shouldResetDisplay = true;
      return;
    }

    const formatted = formatNumberToMax(result);
    if (formatted === "Error") {
      setDisplay("Error");
      firstOperand = null;
    } else {
      setDisplay(formatted);
      firstOperand = parseFloat(formatted);
    }
    console.log(`Repeated equals result: ${result}`);

    shouldResetDisplay = true;
    return;
  }

  console.warn("No operation to execute");
}

/**
 * Resets the calculator (C button)
 */
function resetCalculator() {
  firstOperand = null;
  operator = null;
  shouldResetDisplay = false;
  lastOperator = null;
  lastSecondOperand = null;
  setDisplay(0);
  console.log("Calculator reset");
  console.warn("State cleared");
}
