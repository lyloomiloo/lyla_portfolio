if (typeof window !== 'undefined' && window.innerWidth > 768) {
  let ticking = false;

  function updateParallax() {
    const slow = document.querySelectorAll('[data-parallax="slow"]');
    const fast = document.querySelectorAll('[data-parallax="fast"]');

    slow.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * 0.15}px)`;
    });

    fast.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * -0.05}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}
