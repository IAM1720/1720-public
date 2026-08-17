async function loadSharedLayout() {
  try {
    const [headerResponse, footerResponse] = await Promise.all([
      fetch('/assets/includes/header.html', { cache: 'no-store' }),
      fetch('/assets/includes/footer.html', { cache: 'no-store' })
    ]);

    if (!headerResponse.ok || !footerResponse.ok) {
      throw new Error('Shared layout files could not be loaded.');
    }

    const [headerHtml, footerHtml] = await Promise.all([
      headerResponse.text(),
      footerResponse.text()
    ]);

    const currentHeader = document.querySelector('.site-header');
    const currentFooter = document.querySelector('.site-footer');

    if (currentHeader) {
      currentHeader.outerHTML = headerHtml;
    } else {
      document.body.insertAdjacentHTML('afterbegin', headerHtml);
    }

    if (currentFooter) {
      currentFooter.outerHTML = footerHtml;
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHtml);
    }
  } catch (error) {
    console.error(error);
  }

  initializeNavigation();
}

function initializeNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function updateCountdown() {
  const countdown = document.getElementById('countdown');
  if (!countdown) return;

  const expirationDate = new Date('2027-01-08T05:59:00');
  const difference = expirationDate - new Date();

  if (difference <= 0) {
    countdown.textContent = 'Contract Expired';
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  countdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

loadSharedLayout();

if (document.getElementById('countdown')) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}
