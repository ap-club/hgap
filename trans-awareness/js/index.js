const main = document.querySelector('main');
const canvas = {
  width: 1920,
  height: 7241,
};

function resize() {
  const width = Math.min(window.innerWidth, window.screen.width);
  console.log(width, window.screen.width, window.devicePixelRatio);
  const scale = width / canvas.width;
  const height = width * (canvas.height / canvas.width);
  main.style.height = `${height}px`;

  for (const el of main.children) {
    el.style.left = `${el.dataset.x * scale}px`;
    el.style.top = `${el.dataset.y * scale}px`;

    for (const prop in el.dataset) {
      if (prop !== 'x' && prop !== 'y') {
        el.style[prop] = `${el.dataset[prop] * scale}px`;
      }
    }
  }
}

resize();
window.addEventListener('resize', resize);
