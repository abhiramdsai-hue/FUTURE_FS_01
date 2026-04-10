/* =============================================
   PORTFOLIO SCRIPT - Abhiram Datla
   ============================================= */

'use strict';

/* ─── DOM References ─── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const backToTop  = document.getElementById('back-to-top');
const navLinkEls = document.querySelectorAll('.nav-link');
const canvas     = document.getElementById('particle-canvas');

/* ============================================================
   1. NAVBAR – Scroll effect + hamburger
   ============================================================ */
const SECTIONS = document.querySelectorAll('section[id]');

function updateNavbar() {
  const scrolled = window.scrollY > 40;
  navbar.classList.toggle('scrolled', scrolled);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
}

// On inner pages (no hero canvas), always show the scrolled navbar style
if (!canvas) {
  navbar.classList.add('scrolled');
}

function updateActiveLink() {
  let current = '';
  SECTIONS.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    const href = link.getAttribute('href');
    // Skip links that point to separate pages (not anchors)
    if (!href.startsWith('#')) return;
    link.classList.remove('active');
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
  revealElements();
  animateTimeline();
}, { passive: true });

updateNavbar();

/* Hamburger toggle */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

/* Close mobile menu on link click */
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   2. BACK TO TOP
   ============================================================ */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   3. SCROLL REVEAL ANIMATION (data-aos attributes)
   ============================================================ */
const aosElements = document.querySelectorAll('[data-aos]');

function revealElements() {
  aosElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      const delay = parseFloat(el.style.animationDelay || el.style['--delay'] || 0) * 1000;
      setTimeout(() => el.classList.add('visible'), delay);
    }
  });
}

// Initial check
setTimeout(revealElements, 100);

/* ============================================================
   4. SKILL CARD LOGO POP ON ENTER
   ============================================================ */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  skillObserver.observe(card);
});

/* ============================================================
   5. TIMELINE PROGRESS BARS ANIMATION
   ============================================================ */
const tlBars   = document.querySelectorAll('.tl-progress-bar');
let tlAnimated = false;

function animateTimeline() {
  if (tlAnimated) return;
  if (!tlBars.length) return;

  const eduSection = document.getElementById('education');

  if (eduSection) {
    // Check if section is visible
    const rect = eduSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      tlAnimated = true;
      tlBars.forEach((bar, idx) => {
        setTimeout(() => bar.classList.add('animated'), idx * 200 + 400);
      });
    }
  } else if (document.querySelector('.timeline')) {
    // Standalone education.html: animate immediately
    tlAnimated = true;
    tlBars.forEach((bar, idx) => {
      setTimeout(() => bar.classList.add('animated'), idx * 200 + 400);
    });
  }
}

/* ============================================================
   6. PARTICLE CANVAS (home page only)
   ============================================================ */
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  if (!canvas) return;
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 14000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      r:     Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }
}

function drawParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(138, 100, 255, ${p.alpha})`;
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(62, 207, 255, ${0.12 * (1 - dist / 100)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

if (canvas) {
  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  }, { passive: true });
}

/* ============================================================
   7. SMOOTH HOVER PARALLAX ON HERO CONTENT (home only)
   ============================================================ */
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  document.addEventListener('mousemove', (e) => {
    const xFactor = (e.clientX / window.innerWidth - 0.5) * 12;
    const yFactor = (e.clientY / window.innerHeight - 0.5) * 8;
    heroContent.style.transform = `translate(${xFactor}px, ${yFactor}px)`;
  });
}

/* ============================================================
   8. PROJECT CARD TILT EFFECT
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) *  6;
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s ease';
    setTimeout(() => { card.style.transition = ''; }, 400);
  });
});

/* ============================================================
   8b. GITHUB ICON TOOLTIP – shows on hover AND on cursor-drag
   ============================================================ */
(function () {
  const ghLink = document.getElementById('github-portfolio');
  if (!ghLink) return;

  let dragTimer = null;

  // Show when cursor enters the element while a mouse button is held down
  ghLink.addEventListener('mouseenter', (e) => {
    // e.buttons > 0 means at least one mouse button is pressed (dragging)
    if (e.buttons > 0) {
      ghLink.classList.add('tooltip-visible');
      clearTimeout(dragTimer);
      dragTimer = setTimeout(() => ghLink.classList.remove('tooltip-visible'), 2200);
    }
  });

  // Also respond to mousemove while dragging over the icon
  ghLink.addEventListener('mousemove', (e) => {
    if (e.buttons > 0 && !ghLink.classList.contains('tooltip-visible')) {
      ghLink.classList.add('tooltip-visible');
      clearTimeout(dragTimer);
      dragTimer = setTimeout(() => ghLink.classList.remove('tooltip-visible'), 2200);
    }
  });

  ghLink.addEventListener('mouseleave', () => {
    clearTimeout(dragTimer);
    ghLink.classList.remove('tooltip-visible');
  });
})();

/* ============================================================
   9. SKILL CARD GLOW FOLLOW
   ============================================================ */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.backgroundImage =
      `radial-gradient(circle at ${x}% ${y}%, rgba(138,100,255,0.1) 0%, transparent 65%),
       linear-gradient(rgba(255,255,255,0.04), rgba(255,255,255,0.04))`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.backgroundImage = '';
  });
});

/* ============================================================
   10. ACHIEVEMENT CARDS – ripple on click
   ============================================================ */
document.querySelectorAll('.achievement-card').forEach(card => {
  card.addEventListener('click', e => {
    const rect   = card.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-anim 0.5s linear;
      background: rgba(138,100,255,0.3);
      width: 60px; height: 60px;
      left: ${e.clientX - rect.left - 30}px;
      top:  ${e.clientY - rect.top  - 30}px;
      pointer-events: none;
    `;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframes dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple-anim { to { transform: scale(4); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

/* ============================================================
   11. INTERSECTION OBSERVER for sections
   ============================================================ */
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealElements();
          animateTimeline();
        }
      });
    },
    { threshold: 0.1 }
  );

  SECTIONS.forEach(s => sectionObserver.observe(s));
}

/* ============================================================
   12. INITIAL PAGE LOAD
   ============================================================ */
window.addEventListener('load', () => {
  updateNavbar();
  revealElements();
  animateTimeline();
});
