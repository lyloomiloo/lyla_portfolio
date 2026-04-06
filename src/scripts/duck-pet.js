// Pet duck — walks around the meadow (desktop) or above dock (mobile)
const isMobileView = window.innerWidth <= 768;
const duck = isMobileView
  ? document.getElementById('mobileDuck')
  : document.getElementById('deskDuck');
if (duck) {
  let duckX = 5 + Math.random() * 85; // % from left
  let duckY = isMobileView ? 0 : (26 + Math.random() * 12); // mobile: fixed bottom via CSS
  let duckDir = 1; // 1=right, -1=left
  const mobileScale = '';
  function duckTransform(base) { return base; }
  let duckState = 'walking'; // walking, idle, clicked, grabbed
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  // Drag detection — need movement threshold to distinguish click vs drag
  let mouseDownPos = null;
  let mouseIsDown = false;
  const DRAG_THRESHOLD = 5;

  // Walk target — random waypoint in the meadow
  let targetX = 20 + Math.random() * 60;
  let targetY = 28 + Math.random() * 8;
  const duckSpeed = 0.03; // % per frame

  // Frame animation
  let frameToggle = false;
  let frameTimer = 0;
  const FRAME_INTERVAL = 200; // ms per frame swap
  let lastTime = performance.now();

  // Position the duck
  duck.style.left = duckX + '%';
  if (!isMobileView) {
    duck.style.bottom = duckY + '%';
  }

  function pickNewTarget() {
    targetX = 8 + Math.random() * 80;
    targetY = 26 + Math.random() * 10;
  }

  // --- QUACK SOUND via Web Audio API ---
  function playQuack() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t = ctx.currentTime;

      // Noise source — gives the breathy/raspy quack texture
      const bufferSize = ctx.sampleRate * 0.2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      // Bandpass filter — shapes noise into a nasal quack tone
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1200, t);
      bandpass.frequency.exponentialRampToValueAtTime(600, t + 0.12);
      bandpass.Q.value = 5;

      // Tone — adds pitched duck quality
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(380, t + 0.12);

      // Envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
      gain.gain.setValueAtTime(0.2, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

      noise.connect(bandpass);
      bandpass.connect(gain);
      osc.connect(gain);
      gain.connect(ctx.destination);

      noise.start(t);
      osc.start(t);
      noise.stop(t + 0.2);
      osc.stop(t + 0.2);

      setTimeout(() => ctx.close(), 400);
    } catch (e) {
      // Audio not available — silent fallback
    }
  }

  // --- WALK LOOP ---
  function duckLoop(now) {
    const dt = now - lastTime;
    lastTime = now;

    if (duckState === 'walking') {
      const dx = targetX - duckX;
      const dy = targetY - duckY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.5) {
        pauseDuck();
      } else {
        const moveX = (dx / dist) * duckSpeed * (dt / 16);
        const moveY = (dy / dist) * duckSpeed * 0.5 * (dt / 16);

        duckX += moveX;
        duckX = Math.max(2, Math.min(95, duckX));
        duck.style.left = duckX + '%';
        if (!isMobileView) {
          duckY += moveY;
          duckY = Math.max(26, Math.min(38, duckY));
          duck.style.bottom = duckY + '%';
        }

        if (Math.abs(dx) > 0.1) {
          duckDir = dx > 0 ? 1 : -1;
          duck.style.transform = duckTransform(duckDir === -1 ? 'scaleX(-1)' : 'scaleX(1)');
        }

        // Walk frame toggle
        frameTimer += dt;
        if (frameTimer >= FRAME_INTERVAL) {
          frameTimer = 0;
          frameToggle = !frameToggle;
          duck.classList.toggle('frame-2', frameToggle);
        }
      }

      if (Math.random() < 0.001) {
        pauseDuck();
      }
    }

    requestAnimationFrame(duckLoop);
  }

  function pauseDuck() {
    duckState = 'idle';
    duck.classList.remove('walking', 'frame-2');
    duck.classList.add('idle');
    frameToggle = false;

    setTimeout(() => {
      if (duckState === 'idle') {
        pickNewTarget();
        duckState = 'walking';
        duck.classList.remove('idle');
        duck.classList.add('walking');
      }
    }, 1500 + Math.random() * 2500);
  }

  function resumeWalk() {
    duckState = 'walking';
    duck.classList.remove('idle', 'struggling', 'frame-2');
    duck.classList.add('walking');
    duck.style.transform = duckTransform(duckDir === -1 ? 'scaleX(-1)' : 'scaleX(1)');
    duck.querySelectorAll('.duck-frame').forEach(f => {
      f.style.animation = '';
      f.style.filter = '';
    });
    frameToggle = false;
    pickNewTarget();
  }

  // --- CLICK COUNTER ---
  let duckClicks = 0;
  const countNum = document.getElementById('duckCountNum');

  function updateCounter() {
    duckClicks++;
    const counterEl = document.getElementById('duckCounter');
    if (countNum) {
      countNum.textContent = String(duckClicks).padStart(3, '0');
    }
    if (counterEl) {
      counterEl.style.color = '#FF6B00';
      setTimeout(() => counterEl.style.color = '', 200);
    }
    // Milestones
    if (duckClicks === 10) showBubble('...really?', '#999');
    if (duckClicks === 25) showBubble("I'm getting dizzy", '#999');
    if (duckClicks === 50) showBubble("you know I'm not real right?", '#999');
    if (duckClicks === 100) {
      showBubble('🏆 ACHIEVEMENT UNLOCKED', '#FFE600');
      duckState = 'clicked';
      duck.classList.remove('walking', 'idle', 'frame-2');
      let flips = 0;
      const danceInterval = setInterval(() => {
        duck.style.transform = duckTransform(flips % 2 === 0 ? 'scaleX(-1)' : 'scaleX(1)');
        flips++;
        if (flips > 20) { clearInterval(danceInterval); resumeWalk(); }
      }, 100);
    }
  }


  // --- CLICK REACTIONS ---
  const reactions = ['jump', 'spin', 'shake', 'dead', 'peck', 'heart', 'zap', 'dance',
    'nap', 'sneeze', 'wave', 'moonwalk', 'dizzy', 'angry', 'sing', 'shrink', 'duplicate', 'rainbow'];

  function showBubble(text, color) {
    color = color || '#FF6B00';
    const rect = duck.getBoundingClientRect();
    const bubble = document.createElement('div');
    bubble.textContent = text;
    bubble.style.cssText =
      'position:fixed;' +
      'left:' + (rect.left + rect.width / 2 - 10) + 'px;' +
      'top:' + (rect.top - 10) + 'px;' +
      'font-family:var(--font-mono);' +
      'font-size:0.75rem;' +
      'font-weight:700;' +
      'color:' + color + ';' +
      'pointer-events:none;' +
      'z-index:9;' +
      'transition:all 0.8s ease;' +
      'white-space:nowrap;';
    document.body.appendChild(bubble);
    requestAnimationFrame(() => {
      bubble.style.top = (rect.top - 50) + 'px';
      bubble.style.opacity = '0';
    });
    setTimeout(() => bubble.remove(), 1000);
  }

  function handleClick() {
    if (duckState === 'grabbed') return;

    updateCounter();
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    duckState = 'clicked';
    duck.classList.remove('walking', 'idle', 'frame-2');

    const frames = duck.querySelectorAll('.duck-frame');

    switch (reaction) {
      case 'jump':
        playQuack();
        showBubble('QUACK!');
        duck.style.transition = 'bottom 0.15s steps(2)';
        duckY += 3;
        duck.style.bottom = duckY + '%';
        setTimeout(() => {
          duckY -= 3;
          duck.style.bottom = duckY + '%';
          setTimeout(() => {
            duck.style.transition = '';
            resumeWalk();
          }, 200);
        }, 250);
        break;

      case 'spin':
        playQuack();
        frames.forEach(f => f.style.animation = 'duck-spin 0.3s steps(6) forwards');
        setTimeout(resumeWalk, 500);
        break;

      case 'shake':
        frames.forEach(f => f.style.animation = 'duck-shake 0.15s steps(4) 3');
        setTimeout(resumeWalk, 500);
        break;

      case 'dead':
        duck.style.transform = duckTransform(duck.style.transform.replace(mobileScale, '') + ' rotate(90deg)');
        setTimeout(() => {
          duck.style.transform = duckTransform(duckDir === -1 ? 'scaleX(-1)' : 'scaleX(1)');
          resumeWalk();
        }, 1500);
        break;

      case 'peck':
        frames.forEach(f => f.style.animation = 'duck-peck 0.15s steps(2) 3');
        setTimeout(resumeWalk, 600);
        break;

      case 'heart':
        showBubble('\u2665', '#FF2D8A');
        setTimeout(resumeWalk, 400);
        break;

      case 'zap':
        frames.forEach(f => {
          f.style.animation = 'duck-shake 0.05s steps(2) 2';
          f.style.filter = 'brightness(2)';
        });
        setTimeout(() => {
          frames.forEach(f => f.style.filter = '');
          resumeWalk();
        }, 200);
        break;

      case 'dance': {
        let flips = 0;
        const danceInterval = setInterval(() => {
          duck.style.transform = duckTransform(flips % 2 === 0 ? 'scaleX(-1)' : 'scaleX(1)');
          flips++;
          if (flips > 6) { clearInterval(danceInterval); resumeWalk(); }
        }, 150);
        break;
      }

      case 'nap':
        duck.style.transition = 'transform 0.5s steps(3)';
        duck.style.transform = duckTransform(duck.style.transform.replace(mobileScale, '') + ' rotate(30deg)');
        showBubble('zzZ', '#999');
        setTimeout(() => {
          duck.style.transform = duckTransform(duckDir === -1 ? 'scaleX(-1)' : 'scaleX(1)');
          duck.style.transition = '';
          resumeWalk();
        }, 2500);
        break;

      case 'sneeze':
        frames.forEach(f => f.style.animation = 'duck-sneeze 0.3s steps(3)');
        showBubble('achoo!', '#FF6B00');
        setTimeout(resumeWalk, 500);
        break;

      case 'wave':
        frames.forEach(f => f.style.animation = 'duck-wave 0.15s steps(2) 5');
        showBubble('hi!', '#00CC55');
        setTimeout(resumeWalk, 800);
        break;

      case 'moonwalk': {
        duck.style.transition = 'left 0.8s linear';
        const moonDist = duckDir * 4;
        duckX -= moonDist;
        duckX = Math.max(2, Math.min(95, duckX));
        duck.style.left = duckX + '%';
        showBubble('♪', '#9B59B6');
        setTimeout(() => { duck.style.transition = ''; resumeWalk(); }, 1000);
        break;
      }

      case 'dizzy':
        frames.forEach(f => f.style.animation = 'duck-dizzy 0.6s steps(8)');
        showBubble('*_*', '#FFE600');
        setTimeout(resumeWalk, 800);
        break;

      case 'angry':
        frames.forEach(f => f.style.animation = 'duck-angry 0.05s steps(2) 10');
        showBubble('!!!', '#FF2020');
        setTimeout(resumeWalk, 600);
        break;

      case 'sing':
        ['♪', '♫', '♬'].forEach((note, i) => {
          setTimeout(() => showBubble(note, '#9B59B6'), i * 300);
        });
        setTimeout(resumeWalk, 1200);
        break;

      case 'shrink':
        duck.style.transition = 'transform 0.15s steps(2)';
        duck.style.transform = duckTransform('scale(0.3)');
        setTimeout(() => {
          duck.style.transform = duckTransform('scale(1.2)');
          setTimeout(() => {
            duck.style.transform = duckTransform(duckDir === -1 ? 'scaleX(-1)' : 'scaleX(1)');
            duck.style.transition = '';
            resumeWalk();
          }, 150);
        }, 600);
        break;

      case 'duplicate': {
        const ghost = duck.cloneNode(true);
        ghost.style.opacity = '0.4';
        ghost.style.left = (parseFloat(duck.style.left) + 3) + '%';
        ghost.style.pointerEvents = 'none';
        ghost.id = '';
        duck.parentElement.appendChild(ghost);
        showBubble('??', '#0038FF');
        setTimeout(() => {
          ghost.style.transition = 'opacity 0.3s';
          ghost.style.opacity = '0';
          setTimeout(() => ghost.remove(), 400);
          resumeWalk();
        }, 800);
        break;
      }

      case 'rainbow': {
        let ci = 0;
        const rainbowInterval = setInterval(() => {
          duck.style.filter = `hue-rotate(${ci * 51}deg)`;
          ci++;
          if (ci >= 14) {
            clearInterval(rainbowInterval);
            duck.style.filter = '';
            resumeWalk();
          }
        }, 80);
        showBubble('✨', '#FFE600');
        break;
      }
    }
  }

  // --- MOUSE/TOUCH HANDLING with drag threshold ---
  function onPointerDown(clientX, clientY, e) {
    mouseIsDown = true;
    mouseDownPos = { x: clientX, y: clientY };
    isDragging = false;
    const rect = duck.getBoundingClientRect();
    dragOffsetX = clientX - rect.left;
    dragOffsetY = clientY - rect.top;
    e.preventDefault();
  }

  function onPointerMove(clientX, clientY) {
    if (!mouseIsDown) return;

    if (!isDragging) {
      // Check threshold
      const dx = clientX - mouseDownPos.x;
      const dy = clientY - mouseDownPos.y;
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;

      // Start drag
      isDragging = true;
      duckState = 'grabbed';
      duck.classList.remove('walking', 'idle', 'frame-2');
      duck.classList.add('struggling');
      const rect = duck.getBoundingClientRect();
      duck.style.position = 'fixed';
      duck.style.left = rect.left + 'px';
      duck.style.top = rect.top + 'px';
      duck.style.bottom = 'auto';
    }

    duck.style.left = (clientX - dragOffsetX) + 'px';
    duck.style.top = (clientY - dragOffsetY) + 'px';
  }

  function onPointerUp() {
    if (!mouseIsDown) return;
    mouseIsDown = false;

    if (!isDragging) {
      // It was a click, not a drag
      handleClick();
      mouseDownPos = null;
      return;
    }

    // End drag — drop back to meadow
    isDragging = false;
    duck.classList.remove('struggling');

    const rect = duck.getBoundingClientRect();
    const desktop = document.querySelector('.desktop');
    if (desktop) {
      const dRect = desktop.getBoundingClientRect();
      duckX = ((rect.left - dRect.left) / dRect.width) * 100;
      duckY = ((dRect.bottom - rect.bottom) / dRect.height) * 100;
      duckX = Math.max(2, Math.min(95, duckX));
      duckY = Math.max(26, Math.min(38, duckY));
    }

    duck.style.position = 'absolute';
    duck.style.top = 'auto';
    duck.style.left = duckX + '%';
    duck.style.bottom = duckY + '%';

    duck.querySelectorAll('.duck-frame').forEach(f => {
      f.style.animation = 'duck-land 0.2s steps(3)';
    });
    setTimeout(resumeWalk, 300);
    mouseDownPos = null;
  }

  // Mouse events
  duck.addEventListener('mousedown', (e) => {
    onPointerDown(e.clientX, e.clientY, e);
  });
  document.addEventListener('mousemove', (e) => {
    onPointerMove(e.clientX, e.clientY);
  });
  document.addEventListener('mouseup', onPointerUp);

  // Touch events
  duck.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    onPointerDown(t.clientX, t.clientY, e);
  }, { passive: false });
  document.addEventListener('touchmove', (e) => {
    if (!mouseIsDown) return;
    const t = e.touches[0];
    onPointerMove(t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener('touchend', onPointerUp);

  // Start walking
  requestAnimationFrame(duckLoop);
}
