const menu = document.getElementById('menu');
const hamburger = document.getElementById('hamburger');
const main = document.querySelector('main');
const loading = document.getElementById('loadOverlay');

menu.style.left = `-${menu.clientWidth + 20}px`;
menu.classList.add('smooth');
let menuOpen = false;

function toggleMenu(e) {
  if (menuOpen || (e.target.id !== 'hamburger')) {
    if (!menuOpen) return;
    menuOpen = false;
    menu.style.left = `-${menu.clientWidth + 20}px`;
  } else {
    menuOpen = true;
    menu.style.left = 0;
  }
}

hamburger.addEventListener('click', toggleMenu);
main.addEventListener('click', toggleMenu);

for (const link of menu.getElementsByTagName('a')) {
  link.addEventListener('click', toggleMenu);
}

window.onload = () => {
  setTimeout(() => {
    loading.style.opacity = 0;
    setTimeout(() => {
      loading.style.display = 'none';
    }, 400);
  }, 200);
};
