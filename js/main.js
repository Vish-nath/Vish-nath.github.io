/**
 * Vishwanath P Hesamani - Portfolio Main Script
 * Handles Dynamic Background Canvas, ScrollSpy Navigation, and Hardware-Accelerated Cursor Effects.
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Dynamic Interactive Retro Pixel & Energy Grid Background
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let canvasRipples = [];
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 22000), 60);
      const types = ['pixel', 'pixel', 'dev_text', 'binary'];
      const devStrings = ['{ }', '< />', '0x01', 'sudo', '=>', 'npm run', 'async', 'await', 'git push', '===', 'var'];

      for (let i = 0; i < particleCount; i++) {
        // Randomly assign one of the 3 theme colors directly mapping to your CSS palette
        const colorVal = i % 3 === 0 ? 'rgba(37, 99, 235, ' : (i % 3 === 1 ? 'rgba(79, 70, 229, ' : 'rgba(5, 150, 105, ');

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Upward drift to simulate 2D platformer parallax or scrolling terminal
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(Math.random() * 0.6 + 0.2),
          phase: Math.random() * Math.PI * 2,
          size: Math.floor(Math.random() * 2 + 1) * 6, // 6px or 12px retro blocks
          type: types[Math.floor(Math.random() * types.length)],
          text: devStrings[Math.floor(Math.random() * devStrings.length)],
          color: colorVal,
          baseAlpha: Math.random() * 0.3 + 0.1,
          pulseSpeed: Math.random() * 0.05 + 0.02
        });
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    }, { passive: true });

    // Canvas click ripple effect
    window.addEventListener('click', (e) => {
      if (!prefersReducedMotion) {
        canvasRipples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 10,
          maxRadius: Math.min(width, height) * 0.35,
          alpha: 0.6,
          speed: 6
        });
      }
    }, { passive: true });

    let lastTime = 0;
    function animateCanvas(time) {
      ctx.clearRect(0, 0, width, height);

      if (prefersReducedMotion) {
        const grad = ctx.createRadialGradient(width * 0.2, height * 0.2, 50, width * 0.2, height * 0.2, width * 0.6);
        grad.addColorStop(0, 'rgba(37, 99, 235, 0.03)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Smooth mouse interpolation for fluid aura movement
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // 1. Scrolling Retro 2D Game Grid (Blueprint Style)
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.04)'; // Subtle blue tint matching background
      ctx.lineWidth = 1;
      const gridSize = 40;
      // Calculate scroll offset based on time to simulate 2D camera movement (moving up)
      const scrollY = (time * 0.02) % gridSize;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
      }
      for (let y = -gridSize; y < height; y += gridSize) {
        // Apply vertical scroll offset
        const drawY = y + scrollY;
        ctx.moveTo(0, drawY); ctx.lineTo(width, drawY);
      }
      ctx.stroke();

      // 2. Interactive Ambient Radial Glow around mouse
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 220);
        mouseGlow.addColorStop(0, 'rgba(37, 99, 235, 0.06)');
        mouseGlow.addColorStop(0.5, 'rgba(79, 70, 229, 0.02)');
        mouseGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Render Canvas Shockwave Ripples
      for (let r = canvasRipples.length - 1; r >= 0; r--) {
        const rip = canvasRipples[r];
        rip.radius += rip.speed;
        rip.alpha -= 0.015;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          canvasRipples.splice(r, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(79, 70, 229, ${rip.alpha * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

        // Render & Animate Retro Game / Developer Elements
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const tSec = time * 0.001;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid floating with subtle horizontal sine wave
        p.x += p.vx + Math.sin(tSec + p.phase) * 0.3;
        p.y += p.vy;

        // Wrap around screen boundaries cleanly
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        ctx.fillStyle = p.color + p.baseAlpha + ')';

        // Draw retro entities snapped to virtual pixel grid (gives an 8-bit rendering feel)
        const renderX = Math.floor(p.x / 4) * 4;
        const renderY = Math.floor(p.y / 4) * 4;

        if (p.type === 'pixel') {
          // Draw standard retro pixel blocks
          ctx.fillRect(renderX, renderY, p.size, p.size);
        } else if (p.type === 'dev_text') {
          // Draw developer syntax strings like floating retro coins with blinking terminal cursor
          const showCursor = Math.floor(time * p.pulseSpeed) % 2 === 0;
          ctx.fillText(p.text + (showCursor ? '_' : ''), renderX, renderY);
        } else if (p.type === 'binary') {
          // Matrix-style falling binary strings
          const bin = Math.floor(time * p.pulseSpeed * 0.5) % 2 === 0 ? '1' : '0';
          ctx.fillText(bin, renderX, renderY);
        }

        // Mouse Repulsion & Interaction (The cursor acts like a player dodging elements)
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          // Push particles away smoothly
          p.x += mdx * 0.02;
          p.y += mdy * 0.02;

          // Draw interaction link
          const mAlpha = (1 - mdist / 100) * 0.25;
          ctx.strokeStyle = p.color + mAlpha + ')';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(renderX, renderY);
          // Snap lines to 90 degrees for tech/retro look
          ctx.lineTo(renderX, mouse.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      requestAnimationFrame(animateCanvas);
    }

    resize();
    requestAnimationFrame(animateCanvas);
  }

  // 2. Active Section Navigation Observer (ScrollSpy) & Animated Indicators
  const sections = document.querySelectorAll('section[id]');

  const desktopNav = document.getElementById('main-nav');
  const desktopLinks = desktopNav ? desktopNav.querySelectorAll('a[href^="#"]') : [];
  const desktopIndicator = document.getElementById('nav-indicator');

  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a[href^="#"]') : [];
  const mobileIndicator = document.getElementById('mobile-nav-indicator');

  function updateIndicator(links, indicator, activeId) {
    if (!indicator || links.length === 0) return;

    let activeLink = Array.from(links).find(link => link.getAttribute('href').replace('#', '') === activeId);
    if (!activeLink) activeLink = links[0]; // fallback to first tab

    links.forEach(link => {
      if (link === activeLink) {
        link.classList.add('active-nav');
        link.classList.remove('text-slate-700');
        link.classList.add('text-blue-600');
      } else {
        link.classList.remove('active-nav');
        link.classList.add('text-slate-700');
        link.classList.remove('text-blue-600');
      }
    });

    const navRect = indicator.parentElement.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translate3d(${linkRect.left - navRect.left}px, 0, 0)`;
  }

  if (sections.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          requestAnimationFrame(() => {
            updateIndicator(desktopLinks, desktopIndicator, activeId);
            updateIndicator(mobileLinks, mobileIndicator, activeId);
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));

    window.addEventListener('resize', () => {
      requestAnimationFrame(() => {
        const activeDesktop = Array.from(desktopLinks).find(l => l.classList.contains('active-nav'));
        if (activeDesktop && desktopIndicator) {
          updateIndicator(desktopLinks, desktopIndicator, activeDesktop.getAttribute('href').replace('#', ''));
        }
        const activeMobile = Array.from(mobileLinks).find(l => l.classList.contains('active-nav'));
        if (activeMobile && mobileIndicator) {
          updateIndicator(mobileLinks, mobileIndicator, activeMobile.getAttribute('href').replace('#', ''));
        }
      });
    }, { passive: true });
  }

  // 3. New Popular Cursor Follow Up Animation (Ring)
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorRing && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    // Show cursor ring when mouse moves
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRing.classList.contains('opacity-0')) {
        cursorRing.classList.remove('opacity-0');
        cursorRing.classList.add('opacity-100');
      }
    }, { passive: true });

    const interactiveTags = 'a, button, input, textarea, select, label, .project-card, .frosted-glass-panel';
    window.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveTags)) {
        cursorRing.classList.add('hover-active');
      }
    }, { passive: true });

    window.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveTags)) {
        cursorRing.classList.remove('hover-active');
      }
    }, { passive: true });

    // Smooth GPU-accelerated translate3d follower loop
    function animateCursorRing() {
      // Smooth linear interpolation for the trailing effect
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      // Translate by center
      cursorRing.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      requestAnimationFrame(animateCursorRing);
    }
    requestAnimationFrame(animateCursorRing);
  }
});
