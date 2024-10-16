const circles = document.getElementsByClassName('circle');
const events = document.getElementsByClassName('event');
const markers = document.getElementsByClassName('marker');
const line = document.getElementById('line');
const aboveOverlay = document.querySelector('.above-overlay');
const belowOverlay = document.querySelector('.below-overlay');
const timeline = document.getElementById('timeline');
const circlesById = {};
const eventsById = {};

let active = null;
let animating = false;

const yearToFraction = (year) => ((Number(year) + 2022) / 4044);
// Timeline years go from -2022 to 2022

function setTimelineScale() {
  const lineLength = line.clientWidth;
  const circleWidth = 20;

  for (const circle of circles) {
    circle.style.left = `${yearToFraction(circle.dataset.year) * lineLength - circleWidth / 2}px`;
    circlesById[circle.dataset.id] = circle;

    const tooltip = circle.querySelector('.tooltip');
    if (tooltip) {
      tooltip.style.left = `${(circleWidth - tooltip.clientWidth) / 2}px`;
      tooltip.style.display = 'none';
      tooltip.style.opacity = 1;
    }
  }

  for (const event of events) {
    eventsById[event.dataset.id] = event;
    if (event.classList.contains('right')) {
      event.style.right = `${(1 - yearToFraction(circlesById[event.dataset.id].dataset.year)) * lineLength}px`;
    } else {
      event.style.left = `${yearToFraction(circlesById[event.dataset.id].dataset.year) * lineLength}px`;
    }
  }

  for (const marker of markers) {
    marker.style.left = `${yearToFraction(marker.dataset.year) * lineLength - marker.clientWidth / 2}px`;
    marker.style.top = `${timeline.offsetHeight / 2 - marker.offsetHeight / 2}px`;
  }
}

async function animateSlide(eventElement, aboveOffsetTop, belowOffsetBottom) {
  const el = eventElement;

  if (el.classList.contains('above')) {
    aboveOverlay.style.zIndex = 1;
    belowOverlay.style.zIndex = 3;
    el.style.top = `${aboveOffsetTop}px`;
  } else {
    aboveOverlay.style.zIndex = 3;
    belowOverlay.style.zIndex = 1;
    el.style.bottom = `${belowOffsetBottom}px`;
  }

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}

async function open(e) {
  if (window.innerWidth < 1000 || animating) return;
  const isToggleClose = e.target.dataset.id === active?.dataset.id;
  const halfHeight = timeline.offsetHeight / 2;

  if (active !== null) {
    animating = true;
    await animateSlide(active, halfHeight, halfHeight);
    animating = false;
    active.style.display = 'none';
    circlesById[active.dataset.id].classList.remove('active');
    active = null;
  }

  if (!isToggleClose) {
    const event = eventsById[e.target.dataset.id];
    if (!event) return;

    animating = true;
    event.style.display = 'block';
    circlesById[event.dataset.id].classList.add('active');
    active = event;
    await animateSlide(event, halfHeight - event.offsetHeight, halfHeight - event.offsetHeight);
    animating = false;
  }
}

function openTooltip(e) {
  const tooltip = e.target.querySelector('.tooltip');
  if (!tooltip) return;

  tooltip.style.display = 'block';
}

function closeTooltip(e) {
  const tooltip = e.target.querySelector('.tooltip');
  if (!tooltip) return;

  tooltip.style.display = 'none';
}

for (const button of circles) {
  button.addEventListener('click', open);
  button.addEventListener('mouseover', openTooltip);
  button.addEventListener('mouseout', closeTooltip);
}

window.addEventListener('resize', setTimelineScale);
setTimelineScale();
