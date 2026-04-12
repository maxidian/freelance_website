// Nav scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Hamburger menu
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
const navBackdrop = document.getElementById('navBackdrop');
let menuOpen = false;

function setMenuOpen(open) {
  menuOpen = open;
  navToggle.setAttribute('aria-expanded', open);
  navMobile.classList.toggle('open', open);
  navBackdrop.hidden = !open;
  navBackdrop.classList.toggle('open', open);
  // iOS Safari ignores body overflow:hidden — use position:fixed trick
  if (open) {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.width = '100%';
  } else {
    const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach((s) => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  }
}

navToggle.addEventListener('click', () => setMenuOpen(!menuOpen));
navBackdrop.addEventListener('click', () => setMenuOpen(false));

// Close mobile menu on link click or outside click
navMobile.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('click', (e) => {
  if (menuOpen && !navMobile.contains(e.target) && !navToggle.contains(e.target)) {
    setMenuOpen(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && menuOpen) {
    setMenuOpen(false);
  }
});

// Scroll reveal
const revEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('up'), i * 60);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
revEls.forEach((el) => ro.observe(el));

// Cookie consent
const COOKIE_KEY = 'maxidian_cookie_consent';

function loadGoogleFonts() {
  if (document.getElementById('gfonts')) return;
  const link = document.createElement('link');
  link.id = 'gfonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap';
  document.head.appendChild(link);
}

function hideBanner() {
  document.getElementById('cookie-banner').classList.remove('visible');
}

function saveCookies(acceptAll) {
  const consent = { necessary: true, fonts: acceptAll, ts: Date.now() };
  localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
  if (acceptAll) loadGoogleFonts();
  hideBanner();
  closeCookieModal();
}

function saveModalCookies() {
  const fontsChecked = document.getElementById('toggle-fonts').checked;
  const consent = { necessary: true, fonts: fontsChecked, ts: Date.now() };
  localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
  if (fontsChecked) loadGoogleFonts();
  hideBanner();
  closeCookieModal();
}

function openCookieModal() {
  const modal = document.getElementById('cookie-modal');
  modal.classList.add('open');
  try {
    const stored = JSON.parse(localStorage.getItem(COOKIE_KEY) || '{}');
    document.getElementById('toggle-fonts').checked = stored.fonts || false;
  } catch (e) {}
  modal.addEventListener('click', function onModalClick(e) {
    if (e.target === modal) closeCookieModal();
  }, { once: true });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') {
      closeCookieModal();
      document.removeEventListener('keydown', esc);
    }
  });
}

function closeCookieModal() {
  document.getElementById('cookie-modal').classList.remove('open');
}

(function init() {
  try {
    const stored = JSON.parse(localStorage.getItem(COOKIE_KEY));
    if (stored && stored.necessary) {
      if (stored.fonts) loadGoogleFonts();
      return;
    }
  } catch (e) {}
  setTimeout(() => document.getElementById('cookie-banner').classList.add('visible'), 800);
})();
