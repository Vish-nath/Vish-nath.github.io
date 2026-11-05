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
      const particleCount = Math.min(Math.floor((width * height) / 8000), 200); // More particles for space field
      const types = ['star', 'star', 'star', 'distant_star', 'distant_star', 'sparkle'];

      for (let i = 0; i < particleCount; i++) {
        // Space colors matching light theme: deeply saturated deep blues, indigos, purples, and bright whites
        const colorBase = i % 4 === 0 ? '79, 70, 229' : (i % 4 === 1 ? '124, 58, 237' : (i % 4 === 2 ? '37, 99, 235' : '15, 23, 42'));
        const type = types[Math.floor(Math.random() * types.length)];

        let size, zIndex;
        if (type === 'distant_star') {
          size = Math.random() * 1.5 + 0.5;
          zIndex = 0.2; // Slow parallax
        } else if (type === 'sparkle') {
          size = Math.random() * 2 + 1;
          zIndex = 0.8;
        } else {
          size = Math.random() * 3 + 1.5;
          zIndex = Math.random() * 0.5 + 0.5; // Depth factor for parallax
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // True space drift
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          phase: Math.random() * Math.PI * 2,
          size: size,
          type: type,
          zIndex: zIndex,
          colorStr: colorBase,
          baseAlpha: Math.random() * 0.5 + 0.2
        });
      }
    }

    // Need to track previous mouse position for velocity (wind effect)
    let prevMouse = { x: -1000, y: -1000 };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    }, { passive: true });

    function animateCanvas(time) {
      ctx.clearRect(0, 0, width, height);

      if (prefersReducedMotion) {
        const grad = ctx.createRadialGradient(width * 0.2, height * 0.2, 50, width * 0.2, height * 0.2, width * 0.6);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Track exact mouse velocity for wake/wind effect
      const actualMouseVx = mouse.targetX - prevMouse.x;
      const actualMouseVy = mouse.targetY - prevMouse.y;
      prevMouse.x = mouse.targetX;
      prevMouse.y = mouse.targetY;

      // Smooth mouse interpolation for fluid aura movement
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // 1. Interactive Ambient Radial Glow around mouse (Nebula Glow)
      if (mouse.x > 0 && mouse.y > 0) {
        // Deep purple/indigo space nebula glow blending into the light slate theme
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 450);
        mouseGlow.addColorStop(0, 'rgba(99, 102, 241, 0.12)'); // Indigo core
        mouseGlow.addColorStop(0.4, 'rgba(168, 85, 247, 0.05)'); // Purple mid
        mouseGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      const tSec = time * 0.001;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // --- Interaction: Parallax space reaction to mouse movement ---
        // Instead of blowing particles away, mouse movement shifts the camera viewpoint
        // Deeper stars (lower zIndex) move less, closer stars move more.

        // Calculate raw shift based on actual mouse movement
        const parallaxShiftX = -actualMouseVx * p.zIndex * 0.15;
        const parallaxShiftY = -actualMouseVy * p.zIndex * 0.15;

        // Add momentum to the particle from the parallax shift to create a "warp/drift" trailing effect
        p.vx += parallaxShiftX * 0.1;
        p.vy += parallaxShiftY * 0.1;

        // Apply velocities + natural drift
        p.x += p.vx;
        p.y += p.vy;

        // Apply a very slow orbital rotation to the entire starfield for a cosmic feel
        const cx = width / 2;
        const cy = height / 2;
        const dxCenter = p.x - cx;
        const dyCenter = p.y - cy;
        const distCenter = Math.sqrt(dxCenter*dxCenter + dyCenter*dyCenter);
        if (distCenter > 0) {
            // Very slow rotation
            const rotSpeed = 0.0001 * p.zIndex;
            p.x += -dyCenter * rotSpeed;
            p.y += dxCenter * rotSpeed;
        }

        // Wrap around screen boundaries seamlessly
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        // Twinkling effect (alpha pulsing based on time and individual phase)
        const twinkleSpeed = p.type === 'distant_star' ? 1.5 : 3;
        const currentAlpha = Math.max(0.1, p.baseAlpha + Math.sin(tSec * twinkleSpeed + p.phase) * 0.3);

        // Draw particle (Star)
        ctx.beginPath();
        if (p.type === 'sparkle') {
            // Draw 4-point star/sparkle
            ctx.fillStyle = `rgba(${p.colorStr}, ${currentAlpha + 0.3})`;
            ctx.moveTo(p.x, p.y - p.size);
            ctx.lineTo(p.x + p.size/3, p.y - p.size/3);
            ctx.lineTo(p.x + p.size, p.y);
            ctx.lineTo(p.x + p.size/3, p.y + p.size/3);
            ctx.lineTo(p.x, p.y + p.size);
            ctx.lineTo(p.x - p.size/3, p.y + p.size/3);
            ctx.lineTo(p.x - p.size, p.y);
            ctx.lineTo(p.x - p.size/3, p.y - p.size/3);
            ctx.fill();
        } else {
            // Draw standard round star / distant star
            const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5);
            glow.addColorStop(0, `rgba(${p.colorStr}, ${currentAlpha + 0.4})`);
            glow.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = glow;
            ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Connect only the closest layer of stars into constellations (very subtly)
        if (p.zIndex > 0.6) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (p2.zIndex <= 0.6) continue; // Only connect same depth layer

            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 15000) { // roughly 122px
              const dist = Math.sqrt(distSq);
              const lineAlpha = (1 - dist / 122) * 0.1;
              // Subtle indigo constellation lines
              ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // --- Gravity Well Effect (Black Hole / Singularity near mouse) ---
        const mdx = mouse.targetX - p.x;
        const mdy = mouse.targetY - p.y;
        const mdistSq = mdx * mdx + mdy * mdy;

        if (mdistSq < 90000) { // roughly 300px radius
          const mdist = Math.sqrt(mdistSq);

          // Gentle orbital pull - stars circle the cursor
          // Calculate tangent vector
          const tx = -mdy / mdist;
          const ty = mdx / mdist;

          const force = (300 - mdist) / 300;

          // Pull inwards slightly, but mostly push tangentially (orbit)
          p.vx += (mdx / mdist * 0.005 * force) + (tx * 0.02 * force);
          p.vy += (mdy / mdist * 0.005 * force) + (ty * 0.02 * force);
        }

        // Space friction (vacuum) - mostly maintain momentum but slow down huge spikes
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Cap maximum particle speed (Warp speed limit)
        const maxSpeed = 8 * p.zIndex; // Closer stars can move much faster
        if (p.vx > maxSpeed) p.vx = maxSpeed;
        if (p.vx < -maxSpeed) p.vx = -maxSpeed;
        if (p.vy > maxSpeed) p.vy = maxSpeed;
        if (p.vy < -maxSpeed) p.vy = -maxSpeed;
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

    // Custom Smooth Scrolling for Navigation Links
    const allNavLinks = [...desktopLinks, ...mobileLinks];
    allNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default instant jump

        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // Adjust offset to account for fixed header (approx 100px)
          const headerOffset = 100;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

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

  // 3. Custom 3D Dynamic Cursor with State Animations
  const customCursor = document.getElementById('custom-cursor');
  const cursorShape = document.getElementById('cursor-shape');

  if (customCursor) {
    document.body.classList.add('has-custom-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    // State tracking
    let isHovering = false;
    let isMouseDown = false;
    let isDragging = false;
    let dragThreshold = 3;
    let startX = 0;
    let startY = 0;

    // Show cursor when mouse moves
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (customCursor.classList.contains('opacity-0')) {
        customCursor.classList.remove('opacity-0');
        customCursor.classList.add('opacity-100');
      }

      // Drag detection
      if (isMouseDown && !isDragging) {
        if (Math.abs(mouseX - startX) > dragThreshold || Math.abs(mouseY - startY) > dragThreshold) {
          isDragging = true;
          updateCursorState();
        }
      }
    }, { passive: true });

    // Click and Drag event listeners
    window.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
      updateCursorState();

      // Emit Light Wave Animation
      const wave = document.createElement('div');
      wave.className = 'light-wave';
      customCursor.appendChild(wave);
      setTimeout(() => {
        if (wave.parentNode) {
          wave.parentNode.removeChild(wave);
        }
      }, 600);
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
      isDragging = false;
      updateCursorState();
    });

    const interactiveTags = 'a, button, input, textarea, select, label, .project-card, .frosted-glass-panel, .cursor-pointer';

    window.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveTags)) {
        isHovering = true;
        updateCursorState();
      }
    }, { passive: true });

    window.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveTags)) {
        isHovering = false;
        updateCursorState();
      }
    }, { passive: true });

    function updateCursorState() {
      // Base classes to remove
      customCursor.classList.remove('cursor-idle', 'cursor-moving', 'cursor-hover', 'cursor-click', 'cursor-drag');

      if (isDragging) {
        customCursor.classList.add('cursor-drag');
      } else if (isMouseDown) {
        customCursor.classList.add('cursor-click');
      } else if (isHovering) {
        customCursor.classList.add('cursor-hover');
      }
      // Note: Idle and Moving are dynamically added in the loop based on velocity
    }

    // Initialize state
    updateCursorState();

    // Smooth GPU-accelerated translate3d loop
    function animateCursor() {
      // Calculate velocity for squash/stretch effect and idle/moving states
      let dx = mouseX - cursorX;
      let dy = mouseY - cursorY;
      let velocity = Math.sqrt(dx * dx + dy * dy);

      // Interpolate position
      cursorX += dx * 0.2;
      cursorY += dy * 0.2;

      const cursorTail = document.getElementById('cursor-tail');

      // Handle idle vs moving states if not in an interaction state
      if (!isHovering && !isMouseDown && !isDragging) {
        if (velocity < 0.5) {
          if (!customCursor.classList.contains('cursor-idle')) {
            customCursor.classList.remove('cursor-moving');
            customCursor.classList.add('cursor-idle');
            cursorShape.style.transform = ''; // Clear dynamic transform
            if(cursorTail) cursorTail.style.transform = `translate(-50%, -50%)`;
          }
        } else {
          if (!customCursor.classList.contains('cursor-moving')) {
            customCursor.classList.remove('cursor-idle');
            customCursor.classList.add('cursor-moving');
          }
          // Dynamic stretch based on velocity
          let angle = Math.atan2(dy, dx) * 180 / Math.PI;
          let squeeze = Math.min(velocity * 0.02, 0.4); // max squeeze 0.4
          let scaleX = 1 + squeeze;
          let scaleY = 1 - squeeze;
          cursorShape.style.transform = `rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;

          // Enhanced Comet Tail logic
          if(cursorTail) {
              // Tail stretches significantly more based on speed (up to 120px)
              let tailStretch = Math.min(velocity * 4, 120);

              // Shift the tail backwards (-tailStretch/2) so it originates from the sun
              // and scale it up to create a glowing comet tail effect.
              cursorTail.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateX(-${tailStretch/2}px) scaleX(${1 + tailStretch/10}) scaleY(${1 - squeeze/2})`;

              // Increase opacity of tail based on speed, max at 1.0 for brighter glow
              cursorTail.style.opacity = Math.min(velocity * 0.1, 1);
          }
        }
      } else {
        // Reset transform when interacting (CSS classes handle the specific transforms)
        cursorShape.style.transform = '';
        if(cursorTail) {
            cursorTail.style.transform = `translate(-50%, -50%)`;
            cursorTail.style.opacity = 0;
        }
      }

      // Translate by center
      customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
  }
});
