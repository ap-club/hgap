const nSides = document.getElementById('nSides');
const slider = document.getElementById('archimedesSlider');
const canvas = document.getElementById('archimedesCanvas');
const ctx = canvas.getContext('2d');
const piCheck = '3.141592653589793';

const makeFriendly = (num) => num.toLocaleString('en-US');

function setArchimedesScale() {
  canvas.height = Math.min(500, window.innerHeight, canvas.parentNode.clientWidth - 60);
  canvas.width = canvas.height;
}

function drawPolygon(centerXY, r, n, change) {
  // For visuals only. No part in calculation
  const arcAngle = (2 * Math.PI) / n;
  const correction = change ? -Math.PI / n : 0;

  ctx.beginPath();
  ctx.moveTo(centerXY + r * Math.cos(correction), centerXY + r * Math.sin(correction));

  for (let i = 1; i <= n; i += 1) {
    ctx.lineTo(
      centerXY + r * Math.cos(i * arcAngle + correction),
      centerXY + r * Math.sin(i * arcAngle + correction),
    );
  }

  ctx.stroke();
}

function drawDiagram(n) {
  // For visuals only. No part in calculation
  const r = canvas.height / 4;
  const centerXY = canvas.width / 2;

  ctx.strokeStyle = '#000000';
  ctx.beginPath();
  ctx.arc(centerXY, centerXY, r, 0, 2 * Math.PI);
  ctx.stroke();

  // Inscribed n-gon
  ctx.strokeStyle = '#EA5353';
  drawPolygon(centerXY, r, n);
  // Circumscribed n-gon
  ctx.strokeStyle = '#3F6FFD';
  const rOuter = r / Math.cos(Math.PI / n);
  drawPolygon(centerXY, rOuter, n, true);
}

slider.oninput = (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDiagram(e.target.value);
  nSides.textContent = e.target.value;
};

window.addEventListener('resize', setArchimedesScale);
setArchimedesScale();

const nIters = document.getElementById('nIters');
const calcSlider = document.getElementById('archCalcIters');
const calcSides = document.getElementById('calcSides');
const calcForm = document.getElementById('archimedesCalculator');
const calcResult = document.getElementById('archResult');

calcSlider.oninput = (e) => {
  nIters.textContent = e.target.value;
  calcSides.textContent = makeFriendly(6 * (2) ** (e.target.value - 1));
};

function archimedesMethodCalculate(iterations) {
  const n = 6 * 2 ** (iterations - 1);
  const diameter = 2;
  let side = 1;

  for (let i = 1; i < iterations; i += 1) {
    const halfSide = side / 2;
    const b = 1 - Math.sqrt(1 - halfSide ** 2);
    side = Math.sqrt(b ** 2 + halfSide ** 2);
  }

  const p = (side * n) / diameter;
  return [p, p / Math.sqrt(1 - (side / 2) ** 2)];
}

calcForm.onsubmit = (e) => {
  e.preventDefault();
  const [lower, upper] = archimedesMethodCalculate(calcSlider.value);
  const strLower = String(lower).slice(0, 18);
  const strUpper = String(upper).slice(0, 18);
  let lowerMarked;
  let upperMarked;
  for (let i = 0; i < piCheck.length; i += 1) {
    if (piCheck[i] !== strLower[i] && !lowerMarked) {
      lowerMarked = `<mark>${strLower.slice(0, i)}</mark>${strLower.slice(i)}`;
    }

    if (piCheck[i] !== strUpper[i] && !upperMarked) {
      upperMarked = `<mark>${strUpper.slice(0, i)}</mark>${strUpper.slice(i)}`;
    }
  }

  calcResult.innerHTML = `
<p>The inscribed polygon's perimeter is <span class="red">${lowerMarked || `<mark>${strLower}</mark>`}</span> (lower bound of the approximation).</p>
<p>The circumscribed polygon's perimeter is <span class="blue">${upperMarked || `<mark>${strUpper}</mark>`}</span> (upper bound).</p>
<p>The correct digits are highlighted.</p>`;
};
