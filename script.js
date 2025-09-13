// ================================
// 1) Fill skill bars when section visible
// ================================
function animateSkillBars() {
  const skillsSection = document.getElementById('skills');
  const barFills = document.querySelectorAll('.bar-fill');
  if (!skillsSection) return;

  function onScroll() {
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      barFills.forEach(el => {
        const val = el.getAttribute('data-fill') || '80%';
        el.style.width = val;
      });
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
}

// ================================
// 2) Preview + persist uploaded project screenshots
// ================================
function setupProjectUploads() {
  document.querySelectorAll('.proj-upload').forEach(input => {
    const targetId = input.dataset.target;
    const previewWrap = document.getElementById(targetId);
    const storageKey = 'proj-' + targetId;

    // Load saved image if available
    const savedImg = localStorage.getItem(storageKey);
    if (savedImg && previewWrap) {
      const img = document.createElement('img');
      img.src = savedImg;
      img.alt = 'saved screenshot';
      previewWrap.innerHTML = '';
      previewWrap.appendChild(img);
    }

    // Handle new uploads
    input.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;

        // Save to LocalStorage
        localStorage.setItem(storageKey, dataUrl);

        // Update preview
        if (previewWrap) {
          const img = document.createElement('img');
          img.src = dataUrl;
          img.alt = 'uploaded screenshot';
          previewWrap.innerHTML = '';
          previewWrap.appendChild(img);
        }
      };
      reader.readAsDataURL(f);
    });
  });
}

// ================================
// 3) Set copyright year
// ================================
function setYear() {
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if (el) el.textContent = y;
}

// ================================
// 4) Fade-in on scroll for sections & cards
// ================================
function revealOnScroll() {
  const items = document.querySelectorAll(
    '.section, .project-card, .vision-card, .skill-block, .edu-card'
  );
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.opacity = '1';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(it => {
    it.style.opacity = '0';
    it.style.transform = 'translateY(18px)';
    it.style.transition = 'all 600ms cubic-bezier(.2,.9,.2,1)';
    obs.observe(it);
  });
}

// ================================
// 5) Floating particle balls in hero
// ================================
function heroParticles() {
  const canvas = document.getElementById("hero-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    const hero = document.querySelector(".hero");
    canvas.height = hero ? hero.offsetHeight : 400;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const colors = ["#6c5ce7", "#00cec9", "#ff7675", "#74b9ff"];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 2,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = p.color;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ================================
// Run all after DOM ready
// ================================
document.addEventListener('DOMContentLoaded', () => {
  animateSkillBars();
  setupProjectUploads();
  setYear();
  revealOnScroll();
  heroParticles();
});
