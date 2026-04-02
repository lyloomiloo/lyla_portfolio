if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {

  // --- BEHAVIOR A: Artifact scatter ---
  const artifacts = document.querySelectorAll('.artifact');
  const RADIUS = 100;
  const PUSH = 25;

  document.addEventListener('mousemove', (e) => {
    artifacts.forEach(a => {
      const rect = a.getBoundingClientRect();
      const ax = rect.left + rect.width / 2;
      const ay = rect.top + rect.height / 2;
      const dx = ax - e.clientX;
      const dy = ay - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const angle = Math.atan2(dy, dx);
        const force = (1 - dist / RADIUS) * PUSH;
        a.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`;
        a.style.transition = 'transform 0.1s ease-out';
      } else {
        a.style.transform = 'translate(0, 0)';
        a.style.transition = 'transform 1.5s ease';
      }
    });
  });

  // --- BEHAVIOR B: Pixel trail ---
  const trailSections = document.querySelectorAll('#hero, #contact');
  const colors = ['#39FF14', '#FF6B00'];

  trailSections.forEach(section => {
    section.style.position = section.style.position || 'relative';
    let lastTrail = 0;

    section.addEventListener('mousemove', (e) => {
      if (Date.now() - lastTrail < 50) return;
      lastTrail = Date.now();

      const dot = document.createElement('div');
      const rect = section.getBoundingClientRect();
      Object.assign(dot.style, {
        position: 'absolute',
        left: (e.clientX - rect.left) + 'px',
        top: (e.clientY - rect.top) + 'px',
        width: '4px',
        height: '4px',
        background: colors[Math.floor(Math.random() * colors.length)],
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        zIndex: '50',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
      });
      section.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0)';
      });

      setTimeout(() => dot.remove(), 600);
    });
  });
}
