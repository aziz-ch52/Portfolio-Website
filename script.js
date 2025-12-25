/**
 * script.js
 * Main JavaScript file for Aziz's Portfolio
 * Handles: Navbar Toggling, Smooth Scroll, Animations, and Canvas Chart
 */

document.addEventListener('DOMContentLoaded', () => {
  /* =========================================
       1. MOBILE NAVIGATION TOGGLE
       ========================================= */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  /* =========================================
       2. SMOOTH SCROLLING FOR ANCHOR LINKS
       ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* =========================================
       3. SCROLL REVEAL ANIMATION
       ========================================= */
  // Selects elements with class 'scroll-reveal' and adds 'active' when they scroll into view
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 150; // Offset

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load in case elements are already visible

  /* =========================================
       4. HERO CANVAS CHART (INTERACTIVE)
       ========================================= */
  const initHeroChart = () => {
    const canvas = document.getElementById('heroChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('chartTooltip');

    // Mock Data for the visualization
    const data = [
      { label: 'Jan', value: 40, detail: '₹12k Revenue' },
      { label: 'Feb', value: 70, detail: '₹18k Revenue' },
      { label: 'Mar', value: 50, detail: '₹14k Revenue' },
      { label: 'Apr', value: 90, detail: '₹24k Revenue' },
      { label: 'May', value: 60, detail: '₹15k Revenue' },
      { label: 'Jun', value: 80, detail: '₹21k Revenue' },
    ];

    // Chart Configuration
    const barSpacing = 15;
    const cornerRadius = 4;
    let bars = [];
    let animationProgress = 0;

    // Resize function to handle high-DPI screens and window resizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Utility to draw rounded rectangles
    const drawRoundedRect = (x, y, w, h, radius) => {
      if (h < radius) radius = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    // Main Drawing Function
    const draw = (hoveredIndex = -1) => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      const totalSpacing = (data.length - 1) * barSpacing;
      const barWidth = (width - totalSpacing) / data.length;

      bars = [];

      data.forEach((item, index) => {
        const x = index * (barWidth + barSpacing);
        const targetHeight = (item.value / 100) * height;
        const currentHeight = targetHeight * animationProgress;
        const y = height - currentHeight;

        // Store coordinates for hover detection
        bars.push({ x, y, w: barWidth, h: currentHeight, data: item });

        // Create Gradient
        const gradient = ctx.createLinearGradient(x, height, x, 0);

        // Highlight color on hover
        if (index === hoveredIndex) {
          gradient.addColorStop(0, '#2F80ED');
          gradient.addColorStop(1, '#FFFFFF');
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
        } else {
          gradient.addColorStop(0, '#2F80ED');
          gradient.addColorStop(1, '#00F0FF');
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = gradient;
        drawRoundedRect(x, y, barWidth, currentHeight, cornerRadius);
        ctx.fill();
      });
    };

    // Animation Loop
    const animate = () => {
      if (animationProgress < 1) {
        animationProgress += 0.02;
        draw();
        requestAnimationFrame(animate);
      } else {
        draw();
      }
    };

    // Mouse Move Event for Tooltip
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      let hoveredIndex = -1;

      bars.forEach((bar, index) => {
        if (
          mouseX >= bar.x &&
          mouseX <= bar.x + bar.w &&
          mouseY >= bar.y &&
          mouseY <= bar.y + bar.h + (canvas.height - (bar.y + bar.h))
        ) {
          hoveredIndex = index;
        }
      });

      draw(hoveredIndex);

      if (hoveredIndex !== -1) {
        const dataPoint = data[hoveredIndex];
        tooltip.style.opacity = '1';
        // Center tooltip over bar
        tooltip.style.left = `${bars[hoveredIndex].x + bars[hoveredIndex].w / 2}px`;
        tooltip.style.top = `${bars[hoveredIndex].y}px`;
        tooltip.innerHTML = `<span>${dataPoint.value}%</span>${dataPoint.detail}`;
        canvas.style.cursor = 'pointer';
      } else {
        tooltip.style.opacity = '0';
        canvas.style.cursor = 'default';
      }
    });

    // Hide tooltip on mouse leave
    canvas.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      draw(-1);
    });

    // Start Animation
    animate();
  };

  // Initialize Chart
  initHeroChart();
});
