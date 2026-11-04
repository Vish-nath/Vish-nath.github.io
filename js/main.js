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
      const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
      const types = ['square', 'square', 'square', 'char', 'char'];
      const chars = ['{', '}', '<', '>', '/', '0', '1', ';', '#'];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          originY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          phase: Math.random() * Math.PI * 2,
          size: Math.floor(Math.random() * 3 + 1) * 4, // 4, 8, 12 px block
          type: types[Math.floor(Math.random() * types.length)],
          char: chars[Math.floor(Math.random() * chars.length)],
          color: i % 3 === 0 ? 'rgba(37, 99, 235, ' : (i % 3 === 1 ? 'rgba(79, 70, 229, ' : 'rgba(5, 150, 105, '),
          baseAlpha: Math.random() * 0.35 + 0.15
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

      // 1. Draw Subtle Light Retro Grid
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(width, y);
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

      // 4. Render & Animate Retro Pixel Elements
      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const tSec = time * 0.001;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid floating oscillation
        p.x += p.vx;
        p.y += p.vy + Math.sin(tSec * 1.5 + p.phase) * 0.2;

        // Wrap around screen boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.fillStyle = p.color + p.baseAlpha + ')';

        // Draw pixelated elements
        if (p.type === 'square') {
          const px = Math.floor(p.x / 4) * 4;
          const py = Math.floor(p.y / 4) * 4;
          ctx.fillRect(px, py, p.size, p.size);
        } else {
          ctx.fillText(p.char, p.x, p.y);
        }

        // Draw orthogonal circuit lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p2.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Mouse circuit line interaction
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 150) {
          const mAlpha = (1 - mdist / 150) * 0.35;
          ctx.strokeStyle = `rgba(37, 99, 235, ${mAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, mouse.y);
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
    indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
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

  // 3. Hardware-Accelerated Cursor Follower & Ripple Effect
  const follower = document.getElementById('cursor-follower');

  if (follower && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const interactiveTags = 'a, button, input, textarea, select, label, .project-card';
    window.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveTags)) {
        follower.classList.add('bg-blue-500/10', 'scale-150', 'border-indigo-500/60');
        follower.classList.remove('border-blue-500/40');
      }
    }, { passive: true });

    window.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveTags)) {
        follower.classList.remove('bg-blue-500/10', 'scale-150', 'border-indigo-500/60');
        follower.classList.add('border-blue-500/40');
      }
    }, { passive: true });

    // Smooth GPU-accelerated translate3d follower loop (no layout reflows)
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateFollower);
    }
    requestAnimationFrame(animateFollower);

    // Hardware Accelerated Click Shockwave Ripple
    window.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple-element';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 450);
    }, { passive: true });
  }
});
