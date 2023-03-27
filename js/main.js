const loading = document.getElementById('loadOverlay');
const splash = document.querySelector('.splash');
const splashCenter = splash.querySelector('.center');
const main = document.querySelector('main');

function resizeSplash() {
  let maxX = 0;
  let maxY = 0;

  const parentWidth = splash.clientWidth;
  const parentHeight = splash.clientWidth * (9/16);
  for (const img of splash.getElementsByTagName('img')) {
    const width = img.dataset.width * parentWidth;
    const height = (img.height / img.width) * width;
    const top = img.dataset.y * parentHeight;
    const left = img.dataset.x * parentWidth;

    img.style.width = `${width}px`;
    img.style.top = `${top}px`;
    img.style.left = `${left}px`;

    if (height + top > maxY) maxY = height + top;
    if (width + left > maxX) maxX = width + left;

    img.draggable = false;
  }

  splashCenter.style.left = `${(window.innerWidth - maxX) / 2}px`;
  splashCenter.style.top = `${(splash.clientHeight - maxY) / 2}px`;
}

window.onresize = resizeSplash;

function animateIn(delay) {
  const glitch = document.getElementById('glitch');
  glitch.style.top = '-30px';

  const logo = document.getElementById('logo');
  logo.style.left = '-80px';
  const lc = document.getElementById('lc');
  const lcOrig = Number.parseFloat(lc.style.top.slice(0, -2));
  lc.style.top = `${lcOrig - 30}px`;
  const rc = document.getElementById('rc');
  const rcOrig = Number.parseFloat(rc.style.top.slice(0, -2));
  rc.style.top = `${rcOrig + 30}px`;
  const star = document.getElementById('star');
  main.style.top = '20vh';

  setTimeout(() => {
    glitch.style.transition = '0.4s ease-out';
    glitch.style.top = 0;
    glitch.style.opacity = 1;

    logo.style.transition = '0.8s ease-out 0.4s';
    logo.style.left = 0;
    logo.style.opacity = 1;

    lc.style.transition = '0.9s ease-in-out 0.6s';
    lc.style.top = `${lcOrig}px`;
    lc.style.opacity = 1;

    rc.style.transition = '0.9s ease-in-out 0.6s';
    rc.style.top = `${rcOrig}px`;
    rc.style.opacity = 1;

    star.style.transition = 'opacity 0.4s linear 1.3s, transform 0.7s ease-in-out 1.3s';
    star.style.opacity = 1;
    star.style.transform = 'rotate(360deg)';

    main.style.transition = 'top 0.5s ease-out 1s, opacity 0.1s ease-out 1s';
    main.style.top = '0px';
    main.style.opacity = 1;
  }, delay);
}

window.onload = () => {
  resizeSplash();
  animateIn(500);
  setTimeout(() => {
    loading.style.opacity = 0;
    setTimeout(() => {
      loading.style.display = 'none';
    }, 400);
  }, 200);
};
