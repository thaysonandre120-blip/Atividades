let numAtual = '0';
let numAnterior = null;
let operador = null;
let acabouDeCalcular = false;

const display = document.getElementById('display');
const expr = document.getElementById('expr');

function atualizarDisplay() {
  let valor = numAtual;
  if (valor.length > 12) valor = parseFloat(valor).toExponential(4);
  display.textContent = valor;

  display.classList.remove('blink');
  void display.offsetWidth;
  display.classList.add('blink');

  if (numAnterior !== null && operador) {
    expr.textContent = numAnterior + ' ' + operador;
  } else {
    expr.textContent = '';
  }
}

function digitarNumero(n) {
  if (acabouDeCalcular) {
    numAtual = n;
    acabouDeCalcular = false;
  } else {
    if (numAtual === '0') {
      numAtual = n;
    } else if (numAtual.length < 12) {
      numAtual += n;
    }
  }
  atualizarDisplay();
}

function digitarPonto() {
  if (acabouDeCalcular) {
    numAtual = '0.';
    acabouDeCalcular = false;
    atualizarDisplay();
    return;
  }
  if (!numAtual.includes('.')) {
    numAtual += '.';
    atualizarDisplay();
  }
}

function escolherOperador(op) {
  if (operador && !acabouDeCalcular) {
    calcular(false);
  }
  numAnterior = numAtual;
  operador = op;
  numAtual = '0';
  acabouDeCalcular = false;
  atualizarDisplay();
}

function calcular(terminou = true) {
  if (!operador || numAnterior === null) return;

  const a = parseFloat(numAnterior);
  const b = parseFloat(numAtual);
  let resultado;

  if (operador === '+') resultado = a + b;
  else if (operador === '−') resultado = a - b;
  else if (operador === '×') resultado = a * b;
  else if (operador === '÷') {
    if (b === 0) {
      numAtual = 'Erro';
      numAnterior = null;
      operador = null;
      atualizarDisplay();
      return;
    }
    resultado = a / b;
  }

  resultado = parseFloat(resultado.toPrecision(12));

  const exprFinal = a + ' ' + operador + ' ' + b + ' =';
  numAtual = String(resultado);
  numAnterior = null;
  operador = null;

  if (terminou) acabouDeCalcular = true;

  atualizarDisplay();
  expr.textContent = exprFinal;
}

function limpar() {
  numAtual = '0';
  numAnterior = null;
  operador = null;
  acabouDeCalcular = false;
  expr.textContent = '';
  atualizarDisplay();
}

function inverterSinal() {
  numAtual = String(parseFloat(numAtual) * -1);
  atualizarDisplay();
}

function porcentagem() {
  numAtual = String(parseFloat(numAtual) / 100);
  atualizarDisplay();
}

document.querySelector('.buttons').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === 'number') digitarNumero(value);
  else if (action === 'decimal') digitarPonto();
  else if (action === 'operator') escolherOperador(value);
  else if (action === 'calculate') calcular();
  else if (action === 'clear') limpar();
  else if (action === 'sign') inverterSinal();
  else if (action === 'percent') porcentagem();
});

document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') digitarNumero(e.key);
  else if (e.key === '.') digitarPonto();
  else if (e.key === '+') escolherOperador('+');
  else if (e.key === '-') escolherOperador('−');
  else if (e.key === '*') escolherOperador('×');
  else if (e.key === '/') { e.preventDefault(); escolherOperador('÷'); }
  else if (e.key === 'Enter' || e.key === '=') calcular();
  else if (e.key === 'Escape') limpar();
  else if (e.key === 'Backspace') {
    if (numAtual.length > 1) numAtual = numAtual.slice(0, -1);
    else numAtual = '0';
    atualizarDisplay();
  }
});
