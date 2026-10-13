/* ═══════════════════════════════
   main.js — Portfolio JS
   ═══════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────
     1. AOS
  ────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, offset: 50, duration: 680, easing: 'ease-out-quad' });
  }

  /* ──────────────────────────────
     2. DARK MODE
  ────────────────────────────── */
  const html       = document.documentElement;
  const toggleBtn  = document.getElementById('themeToggle');
  const themeIcon  = document.getElementById('themeIcon');

  const THEME_KEY  = 'ht-portfolio-theme';

  // Resolve stored or system preference
  const storedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initTheme   = storedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initTheme);

  toggleBtn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  function applyTheme(theme) {
    html.dataset.theme = theme;
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
      toggleBtn.title = 'Switch to light mode';
    } else {
      themeIcon.className = 'fas fa-moon';
      toggleBtn.title = 'Switch to dark mode';
    }
  }

  /* ──────────────────────────────
     3. NAVBAR — scroll + active
  ────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link')];

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function onScroll() {
    // Scrolled shadow
    navbar.classList.toggle('scrolled', window.scrollY > 24);

    // Active nav link via intersection
    const scrollMid = window.scrollY + window.innerHeight * 0.42;
    let active = sections[0];
    for (const sec of sections) {
      if (sec.offsetTop <= scrollMid) active = sec;
    }
    if (active) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${active.id}`);
      });
    }
  }

  /* ──────────────────────────────
     4. HAMBURGER
  ────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });

  /* ──────────────────────────────
     5. TYPEWRITER (custom)
  ────────────────────────────── */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const words = [
      'MarTech Consultant',
      'Marketing Automation Expert',
      'Software Developer',
      'Android Developer',
      'Problem Solver',
    ];
    let wi = 0, ci = 0, deleting = false;

    (function type() {
      const word = words[wi];
      typedEl.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);

      let delay = deleting ? 48 : 88;
      if (!deleting && ci === word.length) { delay = 1800; deleting = true; }
      else if (deleting && ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        delay = 360;
      }
      setTimeout(type, delay);
    })();
  }

  /* ──────────────────────────────
     6. COUNTER ANIMATION
  ────────────────────────────── */
  const counters = document.querySelectorAll('.stat-val[data-count]');

  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      counterIO.unobserve(target);
      const end = +target.dataset.count;
      let cur = 0;
      const step = Math.ceil(end / 35);
      const id = setInterval(() => {
        cur = Math.min(cur + step, end);
        target.textContent = cur;
        if (cur >= end) clearInterval(id);
      }, 38);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => counterIO.observe(el));

  /* ──────────────────────────────
     7. SKILL BAR ANIMATION
  ────────────────────────────── */
  const barContainer = document.querySelector('.proficiency-block');

  if (barContainer) {
    const barIO = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      barIO.unobserve(barContainer);
      barContainer.querySelectorAll('.bar-fill[data-w]').forEach(fill => {
        // Stagger each bar slightly
        const i = [...barContainer.querySelectorAll('.bar-fill')].indexOf(fill);
        setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, i * 120);
      });
    }, { threshold: 0.3 });

    barIO.observe(barContainer);
  }

  /* ──────────────────────────────
     8. CONTACT FORM VALIDATION
  ────────────────────────────── */
  const form = document.getElementById('contactForm');

  if (form) {
    const fields = [
      { id: 'cf-name',    errId: 'err-name',    msg: 'Please enter your full name.' },
      { id: 'cf-email',   errId: 'err-email',   msg: 'Please enter a valid email.',   email: true },
      { id: 'cf-subject', errId: 'err-subject', msg: 'Please enter a subject.' },
      { id: 'cf-message', errId: 'err-message', msg: 'Please write your message.' },
    ];

    // Live clear on input
    fields.forEach(({ id, errId }) => {
      document.getElementById(id)?.addEventListener('input', () => {
        document.getElementById(id).classList.remove('err');
        document.getElementById(errId).textContent = '';
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;

      fields.forEach(({ id, errId, msg, email }) => {
        const el  = document.getElementById(id);
        const err = document.getElementById(errId);
        const val = el.value.trim();
        const valid = val && (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));

        if (!valid) {
          el.classList.add('err');
          err.textContent = msg;
          ok = false;
        } else {
          el.classList.remove('err');
          err.textContent = '';
        }
      });

      if (!ok) return;

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';

      // Simulate send (replace with EmailJS / Formspree)
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        const success = document.getElementById('form-success');
        success.classList.remove('hidden');
        setTimeout(() => success.classList.add('hidden'), 5000);
      }, 1600);
    });
  }

  /* ──────────────────────────────
     9. YEAR IN FOOTER
  ────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ──────────────────────────────
     10. SMOOTH SCROLL (fallback)
  ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
