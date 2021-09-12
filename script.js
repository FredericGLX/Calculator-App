'use strict';

class Calculator {
  constructor(previousOperationTxtEl, currentOperationTxtEl) {
    this.previousOperationTxtEl = previousOperationTxtEl;
    this.currentOperationTxtEl = currentOperationTxtEl;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  addNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  changeSign() {
    let data = Number(this.currentOperand);
    data *= -1;
    this.currentOperand = data.toString();
  }

  computePercentage() {
    let data = parseFloat(this.currentOperand);
    data *= 0.01;
    this.currentOperand = data.toString();
  }

  selectOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.currentOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = prev / current;
        break;
      default:
        return;
    }
    if (!Number.isInteger(computation)) computation = computation.toFixed(2);

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperationTxtEl.innerText = this.getDisplayNumber(
      this.currentOperand
    );

    if (this.currentOperationTxtEl.innerText.length > 14) {
      this.currentOperationTxtEl.innerText = 'error: \n too many digits';
      throw new Error('Number too long');
    }
    if (this.operation != null) {
      this.previousOperationTxtEl.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperationTxtEl.innerText = '';
    }
  }
}

// Select all number button and all operator buttons
const numberBtn = document.querySelectorAll('[data-number]');
const operatorBtn = document.querySelectorAll('.math-op');

// Select buttons individually
const allClearBtn = document.querySelector('.all-clear');
const clearBtn = document.querySelector('.clear');
const plusMinusBtn = document.querySelector('.plus-minus');
const percentageBtn = document.querySelector('.percentage');
const equalBtn = document.querySelector('.equal-sign');
const decimalBtn = document.querySelector('.decimal');

// Select screen outputs
const previousOperationTxtEl = document.querySelector(
  '[data-previous-operand]'
);
const currentOperationTxtEl = document.querySelector('[data-current-operand]');

// Create new object
const calculator = new Calculator(
  previousOperationTxtEl,
  currentOperationTxtEl
);

// Append each number to input fields
numberBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    calculator.addNumber(btn.innerText);
    calculator.updateDisplay();
  });
});

// Select operator sign
operatorBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    calculator.selectOperation(btn.value);
    calculator.updateDisplay();
  });
});

// Computes
equalBtn.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

// Clear all input fields
allClearBtn.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

// Delete last digit/operator
clearBtn.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

// Percentage button (* 0.01)
percentageBtn.addEventListener('click', () => {
  calculator.computePercentage();
  calculator.updateDisplay();
});

// Make integer postive or negative
plusMinusBtn.addEventListener('click', () => {
  calculator.changeSign();
  calculator.updateDisplay();
});

// For Light/Dark mode
const darkModeBtn = document.querySelector('.icon');
const icon = document.getElementById('toggle');
const mystylesheet = document.getElementById('mystylesheet');
let setTheme = localStorage.getItem('theme');

// Swap light/dark mode and update local storage
icon.onclick = function () {
  icon.classList.toggle('darkTheme');
  icon.classList.contains('darkTheme')
    ? (icon.src = 'img/dark.svg') &&
      (mystylesheet.href = 'dark.css') &&
      localStorage.setItem('theme', 'dark.css')
    : (icon.src = 'img/light.svg') &&
      (mystylesheet.href = 'light.css') &&
      localStorage.setItem('theme', 'light.css');
};

// Keep mode when refreshing
window.addEventListener('load', function () {
  if (setTheme === null) {
    mystylesheet.href = 'light.css';
  } else {
    mystylesheet.href = setTheme;
    // icon.src = `img/${setTheme.slice(0, -4)}.svg`;
  }
});
