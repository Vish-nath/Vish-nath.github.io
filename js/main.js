/**
 * Vishwanath P Hesamani - Portfolio Main Script
 * Handles Interactive Background Canvas, ScrollSpy Navigation, and Custom Cursor Effects.
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Dynamic Retro Pixel / Developer Background
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

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
      const particleCount = Math.min(Math.floor((width * height) / 20000), 60);
      const types = ['square', 'square', 'square', 'char', 'char'];
      const chars = ['{', '}', '<', '>', '/', '0', '1', ';'];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.floor(Math.random() * 3 + 1) * 4, // 4, 8, 12 pixel blocks
          type: types[Math.floor(Math.random() * types.length)],
          char: chars[Math.floor(Math.random() * chars.length)],
          color: i % 3 === 0 ? 'rgba(37, 99, 235, ' : (i % 3 === 1 ? 'rgba(79, 70, 229, ' : 'rgba(5, 150, 105, '),
          baseAlpha: Math.random() * 0.4 + 0.1
        });
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      if (prefersReducedMotion) {
        const grad = ctx.createRadialGradient(width * 0.2, height * 0.2, 50, width * 0.2, height * 0.2, width * 0.6);
        grad.addColorStop(0, 'rgba(37, 99, 235, 0.03)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Draw light retro pixel grid background
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      ctx.beginPath();
      for(let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
      }
      for(let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(width, y);
      }
      ctx.stroke();

      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.fillStyle = p.color + p.baseAlpha + ')';

        // Draw retro pixel block or developer char
        if (p.type === 'square') {
          // Snap to a grid to make it look like retro 2D pixel movement
          const px = Math.floor(p.x / 4) * 4;
          const py = Math.floor(p.y / 4) * 4;
          ctx.fillRect(px, py, p.size, p.size);
        } else {
          ctx.fillText(p.char, p.x, p.y);
        }

        // Draw orthogonal connections (staircase line) for tech/retro feel
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            // Draw an orthogonal L-shape connection instead of straight line
            ctx.lineTo(p.x, p2.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Mouse hover interaction (orthogonal lines)
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          const mAlpha = (1 - mdist / 140) * 0.3;
          ctx.strokeStyle = `rgba(37, 99, 235, ${mAlpha})`;
          ctx.lineWidth = 2;
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

  // 2. Active Section Navigation Observer (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === activeId) {
              link.classList.add('active-nav');
            } else {
              link.classList.remove('active-nav');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));
  }

  // 3. Custom Cursor Follower & Click Ripple Effect
  const follower = document.getElementById('cursor-follower');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (follower && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const interactiveTags = 'a, button, input, textarea, select, label';
    window.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveTags)) {
        follower.classList.add('bg-blue-500/10', 'scale-150', 'border-indigo-500/60');
        follower.classList.remove('border-blue-500/40');
      }
    });
    window.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveTags)) {
        follower.classList.remove('bg-blue-500/10', 'scale-150', 'border-indigo-500/60');
        follower.classList.add('border-blue-500/40');
      }
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    }
    requestAnimationFrame(animateFollower);

    window.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'pointer-events-none fixed z-[9999] rounded-full border-2 border-indigo-500/80';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.left = `${e.clientX - 10}px`;
      ripple.style.top = `${e.clientY - 10}px`;
      ripple.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      ripple.style.opacity = '1';
      document.body.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.width = '70px';
        ripple.style.height = '70px';
        ripple.style.left = `${e.clientX - 35}px`;
        ripple.style.top = `${e.clientY - 35}px`;
        ripple.style.opacity = '0';
      });

      setTimeout(() => {
        ripple.remove();
      }, 400);
    });
  }
});
