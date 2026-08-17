
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
const themeToggle = document.getElementById('themeToggle');
function syncThemeLabel(){ if(themeToggle) themeToggle.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark'; }
syncThemeLabel();
if (themeToggle) themeToggle.addEventListener('click', () => { const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', next); localStorage.setItem('theme', next); syncThemeLabel(); });
function updateCountdown() {
    const expirationDate =
        new Date("2027-01-08T05:59:00");

    const now = new Date();
    const difference = expirationDate - now;

    if (difference <= 0) {
        document.getElementById("countdown").innerHTML =
            "Contract Expired";
        return;
    }

    const days =
        Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours =
        Math.floor((difference / (1000 * 60 * 60)) % 24);

    const minutes =
        Math.floor((difference / (1000 * 60)) % 60);

    const seconds =
        Math.floor((difference / 1000) % 60);

    document.getElementById("countdown").innerHTML =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();
