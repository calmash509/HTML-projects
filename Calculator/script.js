// Display
const display = document.getElementById('display');

// Functions
const btnClear = document.getElementById('btn-clear');
const btnToggle = document.getElementById('btn-toggle');
const btnPercent = document.getElementById('btn-percent');

// Operators
const btnDivide = document.getElementById('btn-divide');
const btnMultiply = document.getElementById('btn-multiply');
const btnSubtract = document.getElementById('btn-subtract');
const btnAdd = document.getElementById('btn-add');
const btnEquals = document.getElementById('btn-equals');

// Numbers
const btn0 = document.getElementById('btn-0');
const btn1 = document.getElementById('btn-1');
const btn2 = document.getElementById('btn-2');
const btn3 = document.getElementById('btn-3');
const btn4 = document.getElementById('btn-4');
const btn5 = document.getElementById('btn-5');
const btn6 = document.getElementById('btn-6');
const btn7 = document.getElementById('btn-7');
const btn8 = document.getElementById('btn-8');
const btn9 = document.getElementById('btn-9');
const btnDecimal = document.getElementById('btn-decimal');
const container = document.querySelector('.grid');
let isDec = false;
// Display Functions
function setDisplay(text) {
  display.value = text;
}
function addDisplay(text) {
  display.value = display.value + text;
}

function clearDisplay() {
  display.value = '';
}
function getDisplay() {
  return display.value;
}
// Logic
function solveLogic() {
  let display2 = display.value.replaceAll('%', '/100');
  let str = display2.replaceAll('x', '*')

  let ops = ['+', '-', '*', '/'];
  if (!ops.some((ops) => str.endsWith(ops) === true)) {
    let answer = eval(str);
    setDisplay(answer);
  }
}
function plusMinus() {
  let str = display.value;
  let ops = ['+', '-', '*', '/'];
  if (!ops.some((ops) => str.endsWith(ops) === true)) {
    let num = display.value;
    let answer = -num
    if(Number.isNaN(answer)){
      return
    } else {
      setDisplay(answer);
    }
  } 
}
function decimal() {
  if(isDec === false) {
    isDec = true
    addDisplay(".")
  }
}
// Button Event Listener
container.addEventListener('click', () => {
  const button = event.target.closest('button');
  if (!button) return;
  let str = display.value
  const ops = ['+', '-', '*', '/'];
  const invalidEnding = ops.some(op => str.endsWith(op)) || str.endsWith(".") 
  const correctPercent = !str.endsWith("%")
  const action = button.dataset.action;
  switch (action) {
    case '0': case '1': case '2': case '3': case '4': 
    case '5': case '6': case '7': case '8': case '9':
      if(str.endsWith("%")){
        addDisplay(" x")
        addDisplay(" " + action)
      } else {
        addDisplay(action);
      }
      break;
    case '+/-':
      plusMinus();
      break;
    case 'c':
      clearDisplay();
      break;
    case '/':
      if (display.value !== '' && invalidEnding === false)  {
        isDec = false
        addDisplay(' / ');
      }
      break;
    case 'x':
      if (display.value !== '' && invalidEnding === false) {
        isDec = false
        addDisplay(' x ');
      }
      break;
    case '-':
      if (invalidEnding === false) {
        isDec = false
        addDisplay(' - ');
      }
      break;
    case '+':
      if (display.value !== '' && invalidEnding === false) {
        isDec = false
        addDisplay(' + ');
      }
      break;
    case '=':
      solveLogic();
      break;
    case '.':
      decimal()
    case '%':
      if(display.value !== '' && correctPercent) {
        addDisplay("%");
      }
    }
});
