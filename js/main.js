/**
 * Vishwanath P Hesamani - Portfolio Main Script
 * Handles Dynamic Background Canvas, ScrollSpy Navigation, and Hardware-Accelerated Cursor Effects.
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Dynamic Interactive Background (Calm Tech / Gamer Node Network)
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
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

    function drawHexagon(x, y, size) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i - 30;
        const angle_rad = Math.PI / 180 * angle_deg;
        const vx = x + size * Math.cos(angle_rad);
        const vy = y + size * Math.sin(angle_rad);
        if (i === 0) {
          ctx.moveTo(vx, vy);
        } else {
          ctx.lineTo(vx, vy);
        }
      }
      ctx.closePath();
    }

    function initParticles() {
      particles = [];
      // Lower density for a calming effect
      const particleCount = Math.min(Math.floor((width * height) / 25000), 50);
      const types = ['hex', 'hex', 'node', 'bracket'];
      const devStrings = ['{ }', '< >', '</>', '[]'];

      for (let i = 0; i < particleCount; i++) {
        // Soft calming colors matching the light slate/blue background (#f8fafc)
        // Slate 400 (148, 163, 184), Slate 300 (203, 213, 225), Soft Blue (147, 197, 253)
        const colorBase = i % 3 === 0 ? '148, 163, 184' : (i % 3 === 1 ? '203, 213, 225' : '147, 197, 253');

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Very slow, fluid drift
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          phase: Math.random() * Math.PI * 2,
          size: Math.random() * 4 + 3, // radius for nodes/hex
          type: types[Math.floor(Math.random() * types.length)],
          text: devStrings[Math.floor(Math.random() * devStrings.length)],
          colorStr: colorBase,
          baseAlpha: Math.random() * 0.15 + 0.05
        });
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    }, { passive: true });

    function animateCanvas(time) {
      ctx.clearRect(0, 0, width, height);

      if (prefersReducedMotion) {
        const grad = ctx.createRadialGradient(width * 0.2, height * 0.2, 50, width * 0.2, height * 0.2, width * 0.6);
        grad.addColorStop(0, 'rgba(147, 197, 253, 0.05)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Smooth mouse interpolation for fluid aura movement
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 1. Interactive Ambient Radial Glow around mouse (Soft Light on Slate)
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 350);
        mouseGlow.addColorStop(0, 'rgba(147, 197, 253, 0.15)'); // Soft blue glow
        mouseGlow.addColorStop(0.5, 'rgba(148, 163, 184, 0.05)'); // Soft slate
        mouseGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Render & Animate Floating Developer/Gamer Nodes
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const tSec = time * 0.001;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Extremely smooth, organic floating oscillation
        p.x += p.vx + Math.sin(tSec * 0.3 + p.phase) * 0.1;
        p.y += p.vy + Math.cos(tSec * 0.2 + p.phase) * 0.1;

        // Gentle wrap around screen boundaries
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        // Dynamic pulsing alpha for a calm breathing effect
        const currentAlpha = p.baseAlpha + Math.sin(tSec * 1.5 + p.phase) * 0.05;

        ctx.fillStyle = `rgba(${p.colorStr}, ${currentAlpha})`;
        ctx.strokeStyle = `rgba(${p.colorStr}, ${currentAlpha})`;

        // Draw particle based on type
        if (p.type === 'hex') {
          // Gamer vibe: Tech Hexagons
          ctx.lineWidth = 1;
          drawHexagon(p.x, p.y, p.size * 1.5);
          ctx.stroke();
        } else if (p.type === 'node') {
          // Tech/Network Node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'bracket') {
          // Developer vibe: Subtle code brackets
          ctx.fillText(p.text, p.x, p.y);
        }

        // Draw mesh network connections (Neural/Graph vibe)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          // Connect if close (using squared distance for performance)
          if (distSq < 15000) { // roughly 122px
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 122) * 0.15; // Subtle mesh lines
            // Soft slate-blue connection lines matching the theme
            ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Very soft magnetic pull to mouse (Calm interaction)
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mdistSq = mdx * mdx + mdy * mdy;

        if (mdistSq < 40000) { // roughly 200px
          const mdist = Math.sqrt(mdistSq);
          // Gently pull particles toward mouse
          p.x += mdx * 0.0005;
          p.y += mdy * 0.0005;

          // Softly highlight the connection to the user's cursor
          const mAlpha = (1 - mdist / 200) * 0.15;
          ctx.strokeStyle = `rgba(${p.colorStr}, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
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
