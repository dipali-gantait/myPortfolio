/**
 * Dipali Gantait Portfolio - Interactive Behavior Script
 * Handles navigation, active link tracking, mobile menu,
 * email copy toast, and offline-resilient image fallbacks.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle & Overlay
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMobileNav() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    if (mobileToggle) {
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (navOverlay) {
      navOverlay.classList.remove('open');
    }
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (!navMenu) return;
    navMenu.classList.add('open');
    if (mobileToggle) {
      mobileToggle.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    if (navOverlay) {
      navOverlay.classList.add('open');
    }
    document.body.style.overflow = 'hidden';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileNav);
    }

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // 2. Sticky Header Elevation on Scroll
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. ScrollSpy: Highlight Active Nav Link
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));

  // 4. Copy Email to Clipboard & Toast
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  if (copyBtn) {
    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'bultigayen332@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email address copied to clipboard!');
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email copied: ' + email);
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 5. Dark Mode / Light Mode Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const prefersDarkScheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function updateToggleAccessibility(isDark) {
    if (!themeToggleBtn) return;
    const label = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    themeToggleBtn.setAttribute('aria-label', label);
    themeToggleBtn.setAttribute('title', label);
  }

  function applyTheme(theme, save = true) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateToggleAccessibility(true);
      if (save) localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      updateToggleAccessibility(false);
      if (save) localStorage.setItem('theme', 'light');
    }
  }

  // Set initial accessibility labels based on current theme attribute
  const initialTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  updateToggleAccessibility(initialTheme === 'dark');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, true);
      showToast(newTheme === 'dark' ? 'Switched to Dark Mode 🌙' : 'Switched to Light Mode ☀️');
    });
  }

  // React to OS theme changes if user hasn't explicitly set a preference in localStorage
  if (prefersDarkScheme && prefersDarkScheme.addEventListener) {
    prefersDarkScheme.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  // 6. Download Resume Action
  const resumeBtn = document.getElementById('downloadResumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      // Prompt notes: "Do not invent a resume download URL."
      // Offer direct friendly action without broken link
      showToast('Resume ready: Connect directly or contact via email to request full CV!');
    });
  }

  // 7. Online / Offline Resilient Stock Image Loader
  const stockImages = document.querySelectorAll('img[data-stock-src]');
  stockImages.forEach(img => {
    const stockUrl = img.getAttribute('data-stock-src');
    if (stockUrl && navigator.onLine) {
      const tester = new Image();
      tester.src = stockUrl;
      tester.onload = () => {
        img.src = stockUrl;
      };
      tester.onerror = () => {
        // Keep existing local fallback svg/webp
      };
    }
  });

});

