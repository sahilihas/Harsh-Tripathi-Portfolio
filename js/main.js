/**
 * Harsh Tripathi — Minimalist Dynamic Portfolio Engine
 * Features:
 * 1. Dark / Light Theme Persistence
 * 2. Command Palette (⌘K / Ctrl+K) with Keyboard Navigation & Search
 * 3. Live New Delhi (IST) Clock
 * 4. Dynamic Role Focus Lens Switcher
 * 5. Interactive Timeline Filter
 * 6. Interactive Skill Context Inspector & Stack Filter
 * 7. Project Architecture Case Study Modal
 * 8. One-Click Clipboard Copy with Toast Notification
 * 9. Mouse-Tracking Subtle Spotlight Cards & Scroll Progress
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ── 1. THEME TOGGLE (DARK / LIGHT) ── */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const THEME_KEY = 'ht_portfolio_theme';

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  function toggleTheme() {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    showToast(`Switched to ${next} mode`);
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }


  /* ── 2. TOAST NOTIFICATION & CLIPBOARD COPY ── */
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyToClipboard(text, label = 'Copied to clipboard') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`${label}: ${text}`);
      }).catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  }

  function fallbackCopy(text, label) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`${label}: ${text}`);
  }

  const copyHeroBtn = document.getElementById('copyEmailHeroBtn');
  if (copyHeroBtn) {
    copyHeroBtn.addEventListener('click', () => {
      copyToClipboard('harsh21tripathi@gmail.com', 'Email copied');
    });
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-copy');
      copyToClipboard(val, 'Copied');
    });
  });


  /* ── 3. LIVE NEW DELHI CLOCK (IST) ── */
  const liveClock = document.getElementById('liveClock');
  function updateClock() {
    if (!liveClock) return;
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      liveClock.textContent = `${timeStr} IST`;
    } catch {
      liveClock.textContent = 'UTC+5:30 IST';
    }
  }
  updateClock();
  setInterval(updateClock, 1000);


  /* ── 4. HERO ROLE FOCUS LENS SWITCHER ── */
  const lensData = {
    martech: 'Delivering end-to-end campaign operations in Adobe Marketo Engage & HubSpot, lead scoring models, Salesforce CRM synchronization, A/B testing, and Marketo-to-Iterable migration architecture.',
    engineering: 'Building type-safe front-end interfaces (React.js, TypeScript, Vite), native Android safety apps in Kotlin, Solidity smart contracts, and automated E2E QA suites with Playwright & Provar.',
    automation: 'Designing cross-departmental workflow pipelines with Microsoft Power Automate, SharePoint, REST APIs, webhooks, n8n, Zapier, and SQL data validation.'
  };

  const focusTabs = document.querySelectorAll('.focus-tab');
  const focusContent = document.getElementById('focusLensContent');

  focusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      focusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-lens');
      if (focusContent && lensData[key]) {
        focusContent.style.opacity = '0';
        setTimeout(() => {
          focusContent.textContent = lensData[key];
          focusContent.style.opacity = '1';
        }, 120);
      }
    });
  });


  /* ── 5. INTERACTIVE TIMELINE FILTER ── */
  const tlFilterBtns = document.querySelectorAll('#timelineFilters .seg-btn');
  const tlCards = document.querySelectorAll('#timelineList .timeline-card');

  tlFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tlFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      tlCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden-item');
        } else {
          card.classList.add('hidden-item');
        }
      });
    });
  });


  /* ── 6. INTERACTIVE COMPETENCIES INSPECTOR & FILTER ── */
  const skillChips = document.querySelectorAll('.skill-chip');
  const inspectorName = document.getElementById('inspectorSkillName');
  const inspectorDesc = document.getElementById('inspectorSkillDesc');

  function inspectSkill(chip) {
    skillChips.forEach(c => c.classList.remove('active-chip'));
    chip.classList.add('active-chip');
    const name = chip.getAttribute('data-skill');
    const context = chip.getAttribute('data-context');
    if (inspectorName && inspectorDesc) {
      inspectorName.textContent = name;
      inspectorDesc.textContent = context;
    }
  }

  skillChips.forEach(chip => {
    chip.addEventListener('mouseenter', () => inspectSkill(chip));
    chip.addEventListener('click', () => inspectSkill(chip));
  });

  const skillFilterBtns = document.querySelectorAll('#skillFilters .seg-btn');
  const matrixBoxes = document.querySelectorAll('.matrix-box');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-skill-filter');

      matrixBoxes.forEach(box => {
        const group = box.getAttribute('data-skill-group');
        if (filter === 'all' || group === filter) {
          box.classList.remove('hidden-item');
        } else {
          box.classList.add('hidden-item');
        }
      });
    });
  });


  /* ── 7. PROJECT ARCHITECTURE CASE STUDY MODAL ── */
  const projectSpecs = {
    yathartha: {
      type: 'ANDROID APPLICATION · KOTLIN',
      title: 'Yathartha Connect',
      subtitle: 'Real-Time Personal Safety & Emergency Dispatch Application',
      problem: 'Individuals in distress require an immediate, low-latency mechanism to broadcast live location coordinates and emergency SOS alerts to trusted contacts with high reliability.',
      architecture: [
        'Engineered native Android client in Kotlin adhering to clean UI and lifecycle management practices.',
        'Integrated Google Maps SDK & FusedLocationProviderClient for continuous real-time GPS coordinate telemetry.',
        'Configured Firebase Realtime Database & Authentication for secure user sessions and live location syncing.',
        'Implemented automated SOS distress dispatch triggers over network requests.'
      ],
      outcome: 'Demonstrated end-to-end proficiency in native Android development, asynchronous network requests, cloud database handling, and responsive mobile UI design.',
      stack: ['Kotlin', 'Android Studio', 'Google Maps API', 'Firebase Auth', 'Realtime DB', 'REST APIs'],
      link: 'https://www.github.com/sahilihas'
    },
    qsamriddhi: {
      type: 'BLOCKCHAIN & WEB3 GOVERNANCE',
      title: 'Q Samriddhi',
      subtitle: 'Decentralized Gaming Ecosystem & Governance Platform',
      problem: 'Traditional gaming platforms suffer from opaque centralized control, where players have zero governance rights or verifiable ownership over in-game digital assets.',
      architecture: [
        'Authored deterministic smart contracts in Solidity governing voting proposals and asset state transitions.',
        'Utilized Truffle and Hardhat development environments for local blockchain compilation, deployment, and automated contract testing.',
        'Designed decentralized governance logic enabling transparent, tamper-proof community voting.',
        'Built Web3 interface integration for wallet connection and transaction signing.'
      ],
      outcome: 'Established a transparent, decentralized governance model addressing centralization and restoring user control in gaming ecosystems.',
      stack: ['Solidity', 'Truffle', 'Hardhat', 'Ethereum / EVM', 'Web3.js', 'Smart Contracts'],
      link: 'https://www.github.com/sahilihas'
    },
    sentiment: {
      type: 'PUBLISHED AI & NLP RESEARCH',
      title: 'Sentiment Analysis of Users on "X"',
      subtitle: 'Published Research Paper in College Academic Journal',
      problem: 'Social media platforms generate massive volumes of unstructured text, making it challenging to accurately quantify public sentiment polarity and emotional trends.',
      architecture: [
        'Constructed an end-to-end text preprocessing pipeline in Python (tokenization, stop-word removal, lemmatization).',
        'Applied Natural Language Processing (NLP) feature extraction and sentiment classification models to user posts on "X" (Twitter).',
        'Evaluated polarity distributions (positive, negative, neutral) across topical datasets.',
        'Authored and peer-reviewed findings for formal publication in the college technical journal.'
      ],
      outcome: 'Successfully published in the college journal, demonstrating strong analytical capabilities in AI, NLP, and data-driven research.',
      stack: ['Python', 'NLP', 'Machine Learning', 'Text Classification', 'Data Analysis', 'Academic Research'],
      link: 'https://www.github.com/sahilihas'
    }
  };

  const caseOverlay = document.getElementById('caseOverlay');
  const caseCloseBtn = document.getElementById('caseCloseBtn');
  const caseDismissBtn = document.getElementById('caseDismissBtn');

  function openProjectModal(key) {
    const data = projectSpecs[key];
    if (!data || !caseOverlay) return;

    document.getElementById('caseType').textContent = data.type;
    document.getElementById('caseTitle').textContent = data.title;
    document.getElementById('caseSubtitle').textContent = data.subtitle;
    document.getElementById('caseProblem').textContent = data.problem;
    document.getElementById('caseOutcome').textContent = data.outcome;

    const archList = document.getElementById('caseArchitecture');
    archList.innerHTML = data.architecture.map(item => `<li>${item}</li>`).join('');

    const stackRow = document.getElementById('caseStack');
    stackRow.innerHTML = data.stack.map(s => `<span>${s}</span>`).join('');

    const linkBtn = document.getElementById('caseLinkBtn');
    if (linkBtn) linkBtn.href = data.link;

    caseOverlay.classList.add('open');
    caseOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeProjectModal() {
    if (!caseOverlay) return;
    caseOverlay.classList.remove('open');
    caseOverlay.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.proj-inspect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openProjectModal(btn.getAttribute('data-project'));
    });
  });

  if (caseCloseBtn) caseCloseBtn.addEventListener('click', closeProjectModal);
  if (caseDismissBtn) caseDismissBtn.addEventListener('click', closeProjectModal);
  if (caseOverlay) {
    caseOverlay.addEventListener('click', (e) => {
      if (e.target === caseOverlay) closeProjectModal();
    });
  }


  /* ── 8. COMMAND PALETTE (⌘K / Ctrl+K) ── */
  const cmdOverlay = document.getElementById('cmdOverlay');
  const cmdInput = document.getElementById('cmdInput');
  const cmdTrigger = document.getElementById('cmdTrigger');
  const footerCmdBtn = document.getElementById('footerCmdBtn');
  const cmdCloseBtn = document.getElementById('cmdCloseBtn');
  const cmdItems = Array.from(document.querySelectorAll('.cmd-item'));
  let selectedCmdIdx = 0;

  function openCmdPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.add('open');
    cmdOverlay.setAttribute('aria-hidden', 'false');
    if (cmdInput) {
      cmdInput.value = '';
      filterCmdItems('');
      setTimeout(() => cmdInput.focus(), 40);
    }
  }

  function closeCmdPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.remove('open');
    cmdOverlay.setAttribute('aria-hidden', 'true');
  }

  function getVisibleCmdItems() {
    return cmdItems.filter(item => item.style.display !== 'none');
  }

  function updateCmdSelection() {
    const visible = getVisibleCmdItems();
    cmdItems.forEach(i => i.classList.remove('selected'));
    if (visible.length > 0) {
      selectedCmdIdx = ((selectedCmdIdx % visible.length) + visible.length) % visible.length;
      visible[selectedCmdIdx].classList.add('selected');
      visible[selectedCmdIdx].scrollIntoView({ block: 'nearest' });
    }
  }

  function filterCmdItems(query) {
    const q = query.toLowerCase().trim();
    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
    selectedCmdIdx = 0;
    updateCmdSelection();
  }

  function executeCmdItem(item) {
    if (!item) return;
    const action = item.getAttribute('data-action');
    closeCmdPalette();

    if (action === 'copy-email') {
      copyToClipboard('harsh21tripathi@gmail.com', 'Email copied');
    } else if (action === 'download-resume') {
      const a = document.createElement('a');
      a.href = 'assets/Harsh_Tripathi_Resume.docx';
      a.download = 'Harsh_Tripathi_Resume.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Downloading Resume...');
    } else if (action === 'toggle-theme') {
      toggleTheme();
    } else if (action === 'nav') {
      const target = document.querySelector(item.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'link') {
      window.open(item.getAttribute('data-url'), '_blank', 'noopener');
    }
  }

  if (cmdTrigger) cmdTrigger.addEventListener('click', openCmdPalette);
  if (footerCmdBtn) footerCmdBtn.addEventListener('click', openCmdPalette);
  if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closeCmdPalette);

  if (cmdOverlay) {
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closeCmdPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', () => filterCmdItems(cmdInput.value));
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => executeCmdItem(item));
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdOverlay && cmdOverlay.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
      return;
    }

    if (e.key === 'Escape') {
      closeCmdPalette();
      closeProjectModal();
      return;
    }

    if (cmdOverlay && cmdOverlay.classList.contains('open')) {
      const visible = getVisibleCmdItems();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCmdIdx++;
        updateCmdSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCmdIdx--;
        updateCmdSelection();
      } else if (e.key === 'Enter' && visible[selectedCmdIdx]) {
        e.preventDefault();
        executeCmdItem(visible[selectedCmdIdx]);
      }
    }
  });


  /* ── 9. SUBTLE MOUSE SPOTLIGHT ON BENTO CARDS ── */
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });


  /* ── 10. SCROLL PROGRESS BAR & ACTIVE NAV SPY ── */
  const scrollProgress = document.getElementById('scrollProgress');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && docHeight > 0) {
      scrollProgress.style.width = `${(scrollTop / docHeight) * 100}%`;
    }

    const spyPos = scrollTop + 130;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (spyPos >= top && spyPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── 11. MOBILE DRAWER ── */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const open = mobileDrawer.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', open);
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        hamburgerBtn.classList.remove('open');
      });
    });
  }


  /* ── 12. CONTACT FORM VALIDATION ── */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    const fields = [
      { id: 'name', errId: 'nameError', check: v => v.trim().length >= 2, msg: 'Name is required.' },
      { id: 'email', errId: 'emailError', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Valid email is required.' },
      { id: 'subject', errId: 'subjectError', check: v => v.trim().length >= 3, msg: 'Subject is required.' },
      { id: 'message', errId: 'messageError', check: v => v.trim().length >= 10, msg: 'Message must be at least 10 characters.' }
    ];

    fields.forEach(({ id, errId }) => {
      const input = document.getElementById(id);
      const err = document.getElementById(errId);
      if (input && err) {
        input.addEventListener('input', () => {
          input.classList.remove('err');
          err.textContent = '';
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      fields.forEach(({ id, errId, check, msg }) => {
        const input = document.getElementById(id);
        const err = document.getElementById(errId);
        if (input && err) {
          if (!check(input.value)) {
            input.classList.add('err');
            err.textContent = msg;
            ok = false;
          } else {
            input.classList.remove('err');
            err.textContent = '';
          }
        }
      });

      if (!ok) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        const orig = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Transmitting...</span>';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = orig;
          showToast('Message transmitted successfully');
          if (formStatus) {
            formStatus.classList.remove('hidden');
            setTimeout(() => formStatus.classList.add('hidden'), 5000);
          }
        }, 1000);
      }
    });
  }


  /* ── 13. FOOTER YEAR ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
