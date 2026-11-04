/**
 * Vishwanath P Hesamani - Portfolio Main Script
 * Handles Interactive Background Canvas, ScrollSpy Navigation, and Custom Cursor Effects.
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Dynamic Light Particle Constellation Background
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
      const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 1,
          color: i % 3 === 0 ? 'rgba(37, 99, 235, ' : (i % 3 === 1 ? 'rgba(79, 70, 229, ' : 'rgba(5, 150, 105, '),
          baseAlpha: Math.random() * 0.35 + 0.15
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

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.baseAlpha + ')';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          const mAlpha = (1 - mdist / 140) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${mAlpha})`;
          ctx.lineWidth = 1;
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
