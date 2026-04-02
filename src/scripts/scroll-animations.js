import { animate, inView, stagger } from 'motion';

// --- SCROLL REVEAL WITH VARIED ANIMATIONS ---
document.querySelectorAll('[data-animate]').forEach(el => {
  const type = el.dataset.animate || 'fade-up';
  const delay = parseFloat(el.dataset.delay) || 0;
  el.style.opacity = '0';

  const presets = {
    'fade-up':    { opacity: [0,1], transform: ['translateY(40px)','translateY(0)'] },
    'fade-left':  { opacity: [0,1], transform: ['translateX(-50px)','translateX(0)'] },
    'fade-right': { opacity: [0,1], transform: ['translateX(50px)','translateX(0)'] },
    'scale-in':   { opacity: [0,1], transform: ['scale(0.9)','scale(1)'] },
    'rotate-in':  { opacity: [0,1], transform: ['rotate(-2deg) translateY(30px)','rotate(0) translateY(0)'] },
  };

  inView(el, () => {
    animate(el, presets[type] || presets['fade-up'], {
      duration: 0.7, delay, easing: [0.25, 1, 0.5, 1]
    });
  }, { margin: '-10%' });
});

// --- STAGGER CASCADE FOR GROUPED ELEMENTS ---
document.querySelectorAll('[data-stagger]').forEach(group => {
  const children = group.children;
  Array.from(children).forEach(c => c.style.opacity = '0');

  inView(group, () => {
    animate(children,
      { opacity: [0,1], transform: ['translateY(15px)','translateY(0)'] },
      { duration: 0.4, delay: stagger(0.06), easing: [0.25, 1, 0.5, 1] }
    );
  });
});

// --- SCALE-ON-SCROLL FOR PROJECT CARDS ---
document.querySelectorAll('.project-card').forEach(card => {
  card.style.opacity = '0';
  inView(card, () => {
    animate(card,
      { opacity: [0,1], transform: ['scale(0.95)','scale(1)'] },
      { duration: 0.6, easing: [0.25, 1, 0.5, 1] }
    );
  }, { margin: '-15%' });
});

// --- HOVER TILT ON CARDS (desktop only) ---
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x*4}deg) rotateX(${-y*4}deg)`;
      card.style.transition = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}

// --- MOCKUP CROSSFADE ON SCROLL ---
const mockupTriggers = document.querySelectorAll('[data-mockup-trigger]');
const mockupFrames = document.querySelectorAll('[data-mockup]');

if (mockupTriggers.length && mockupFrames.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.dataset.mockupTrigger;
        mockupFrames.forEach(m => {
          m.style.opacity = m.dataset.mockup === id ? '1' : '0';
          m.style.transition = 'opacity 0.5s ease';
        });
      }
    });
  }, { threshold: 0.5 });

  mockupTriggers.forEach(t => obs.observe(t));
}
