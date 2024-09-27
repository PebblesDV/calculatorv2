function showOnDisplay(value) {
  document.getElementById("result").value += value;
}

function clearDisplay() {
  document.getElementById("result").value = "";
}

function deleteLast() {
  let display = document.getElementById("result").value;
  document.getElementById("result").value = display.slice(0, -1);
}

function flip() {
  document.getElementById("calculator").style.transform = "rotate(180deg)";

  window.setTimeout(() => {
    document.getElementById("calculator").style.transform = "rotate(360deg)";
  }, 3000);
}

function nice() {
  document.getElementById("result").value += " nice";
}

function checkForEasterEggs(result) {
  if (result === 69) {
    nice();
  }

  if (result === 1414) {
    flip();
  }
}

function calculateResult() {
  // Get the expression from the display
  const expression = document.getElementById("result").value;

  try {
    const result = calculate(expression);
    document.getElementById("result").value = result;

    checkForEasterEggs(result);
  } catch (error) {
    document.getElementById("result").value = "Error";
  }
}

// Function to evaluate the expression without using eval
function calculate(expression) {
  const operators = [];
  const values = [];

  let i = 0;
  while (i < expression.length) {
    let currentChar = expression[i];

    // If it's a whitespace, ignore it
    if (currentChar === " ") {
      i++;
      continue;
    }

    // If it's a number, push it to the values stack
    if (isDigit(currentChar)) {
      let number = "";
      // There might be multiple digits in the number
      while (
        i < expression.length &&
        (isDigit(expression[i]) || expression[i] === ".")
      ) {
        number += expression[i];
        i++;
      }
      values.push(parseFloat(number));
      continue; // Skip further checks for this iteration
    }

    // If it's an opening parenthesis, push it to the operator stack
    if (currentChar === "(") {
      operators.push(currentChar);
    }
    // If it's a closing parenthesis, solve the expression inside the parentheses
    else if (currentChar === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
      }
      operators.pop(); // Remove the opening parenthesis
    } else if (isOperator(currentChar)) {
      while (
        operators.length &&
        hasPrecedence(currentChar, operators[operators.length - 1])
      ) {
        values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
      }
      operators.push(currentChar);
    }
    i++;
  }

  // Apply remaining operators
  while (operators.length) {
    values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
  }

  // The last value in the values stack is the result
  return values.pop();
}

// Helper function to check if the character is a digit
function isDigit(char) {
  return /\d/.test(char);
}

// Helper function to check if the character is an operator
function isOperator(char) {
  return char === "+" || char === "-" || char === "*" || char === "/";
}

// Helper function to check precedence of operators
function hasPrecedence(op1, op2) {
  if (op2 === "(" || op2 === ")") {
    return false;
  }
  if ((op1 === "*" || op1 === "/") && (op2 === "+" || op2 === "-")) {
    return false;
  }
  return true;
}

// Helper function to apply an operator to two values
function applyOperator(operator, b, a) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        throw new Error("Cannot divide by zero");
      }
      return a / b;
  }
  return 0;
}

document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (!isNaN(key) || ["+", "-", "*", "/", "(", ")", "."].includes(key)) {
    showOnDisplay(key);
  } else if (key === "Enter") {
    calculateResult();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
