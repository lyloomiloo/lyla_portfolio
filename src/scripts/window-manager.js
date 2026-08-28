let zCounter = 10;
let openCount = 0;
const isDesktop = () => window.innerWidth > 768;
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

function scatterWindow(win) {
  const offsetX = (openCount % 4) * 15 + Math.round((Math.random() - 0.5) * 10);
  const offsetY = (openCount % 4) * 12 + Math.round((Math.random() - 0.5) * 8);
  const baseTop = parseInt(win.style.top) || 5;
  const baseLeft = parseInt(win.style.left) || 5;

  // Parse width — handle vw units
  const widthStr = win.style.width || '50vw';
  const widthVw = widthStr.includes('vw') ? parseInt(widthStr) : (parseInt(widthStr) / window.innerWidth * 100);
  const maxLeft = Math.max(2, 95 - widthVw);
  const maxTop = 25; // never push lower than ~25vh

  win.style.top = Math.max(1, Math.min(baseTop + offsetY, maxTop)) + 'vh';
  win.style.left = Math.max(1, Math.min(baseLeft + offsetX, maxLeft)) + 'vw';
  openCount++;
}

function openWindow(id) {
  if (isDesktop()) {
    const win = document.querySelector(`[data-window-id="${id}"]`);
    if (!win) return;
    // Projects window opens maximized with expand-from-icon animation
    if (id === 'projects' && !win.classList.contains('maximized')) {
      const icon = document.querySelector('[data-icon-id="projects"]');
      if (icon) {
        const rect = icon.getBoundingClientRect();
        win.style.transition = 'none';
        win.style.top = rect.top + 'px';
        win.style.left = rect.left + 'px';
        win.style.width = rect.width + 'px';
        win.style.height = rect.height + 'px';
        win.style.display = 'flex';
        win.classList.add('open');
        win.offsetHeight;
        win.style.transition = '';
        win.classList.add('maximized');
        focusWindow(id);
        updateTaskbar(id);
        syncHash(id);
        return;
      }
    }
    // Project detail windows and duck game open maximized directly
    if ((id.endsWith('-detail') || id === 'duckgame' || id === 'films') && !win.classList.contains('maximized')) {
      win.classList.add('maximized');
    }
    // Only scatter if not already maximized, and skip detail windows (they have staggered positions)
    if (!win.classList.contains('maximized') && !id.endsWith('-detail')) {
      scatterWindow(win);
    }
    win.style.display = 'flex';
    requestAnimationFrame(() => {
      win.classList.add('open');
      focusWindow(id);
    });
  } else {
    document.querySelectorAll('.mobile-panel.open').forEach(p => {
      p.classList.remove('open');
      setTimeout(() => p.style.display = 'none', 250);
    });
    const panel = document.querySelector(`[data-panel-id="${id}"]`);
    if (!panel) return;
    panel.style.display = 'flex';
    requestAnimationFrame(() => panel.classList.add('open'));
  }
  updateTaskbar(id);
  syncHash(id);

  // Fetch weather when weather panel opens
  if (id === 'weather') {
    loadWeather();
  }

  // Lazy-load film videos when films window opens
  if (id === 'films') {
    if (isDesktop()) {
      // Desktop: only load active tab's video
      const container = document.querySelector('[data-window-id="films"]');
      if (container) {
        const activeFrame = container.querySelector('.films-frame.active');
        if (activeFrame) {
          const v = activeFrame.querySelector('video[data-lazy-src]');
          if (v && !v.src) { v.preload = 'auto'; v.src = v.dataset.lazySrc; }
          if (v) {
            if (v.readyState >= 2) v.play().catch(() => {});
            else v.addEventListener('loadeddata', () => v.play().catch(() => {}), { once: true });
          }
        }
      }
    } else {
      // Mobile: only ONE video plays at a time — the one occupying the top half of the
      // viewport. Everything else is paused and muted so there's never overlapping audio.
      const panel = document.querySelector('[data-panel-id="films"]');
      const scroller = panel && panel.querySelector('.mobile-panel-body');
      if (scroller) {
        const videos = [...panel.querySelectorAll('video[data-lazy-src]')];

        const updateActive = () => {
          const root = scroller.getBoundingClientRect();
          const bandTop = root.top;
          const bandBottom = root.top + root.height / 2; // top half of the viewport
          // Active = the video covering the most of the top-half band.
          let active = null, best = 0;
          videos.forEach(v => {
            const r = v.getBoundingClientRect();
            const overlap = Math.min(r.bottom, bandBottom) - Math.max(r.top, bandTop);
            if (overlap > best) { best = overlap; active = v; }
          });
          // The last clip(s) can't scroll up into the top half — at the bottom of the
          // feed, hand off to the last video that's actually visible so it still plays.
          if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4) {
            for (let i = videos.length - 1; i >= 0; i--) {
              const r = videos[i].getBoundingClientRect();
              if (r.bottom > root.top && r.top < root.bottom) { active = videos[i]; break; }
            }
          }
          videos.forEach(v => {
            if (v === active) {
              if (!v.src) { v.preload = 'auto'; v.src = v.dataset.lazySrc; }
              applySoundPref(v.closest('.ig-post-media')); // honor the sound preference
              v.play().catch(() => {});
            } else {
              v.pause();
              v.muted = true; // silence off-screen videos
            }
          });
        };

        let ticking = false;
        scroller.addEventListener('scroll', () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => { updateActive(); ticking = false; });
        });
        // Re-evaluate after the open animation settles so the first video starts playing
        setTimeout(updateActive, 350);
      }
    }
  }

  // Auto-download resume PDF when resume window opens
  if (id === 'resume') {
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = '/Lyla_Huang_Resume_2026.pdf';
      a.download = 'Lyla_Huang_Resume_2026.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 500);
  }
}

function closeWindow(id) {
  if (isDesktop()) {
    const win = document.querySelector(`[data-window-id="${id}"]`);
    if (!win) return;
    win.classList.remove('open');
    setTimeout(() => win.style.display = 'none', 200);
  } else {
    const panel = document.querySelector(`[data-panel-id="${id}"]`);
    if (!panel) return;
    panel.classList.remove('open');
    setTimeout(() => panel.style.display = 'none', 250);
  }
  updateTaskbar(null);
  // If the section we just closed owned the URL, drop the deep-link hash.
  if (ID_TO_SLUG[id] === location.hash.replace('#', '')) clearHash();
}

function focusWindow(id) {
  zCounter++;
  const win = document.querySelector(`[data-window-id="${id}"]`);
  if (win) win.style.zIndex = zCounter;
}

function closeAllWindows() {
  document.querySelectorAll('.os-window.open').forEach(w => {
    w.classList.remove('open');
    setTimeout(() => w.style.display = 'none', 200);
  });
  document.querySelectorAll('.mobile-panel.open').forEach(p => {
    p.classList.remove('open');
    setTimeout(() => p.style.display = 'none', 250);
  });
  updateTaskbar(null);
  document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
  clearHash();
}

function updateTaskbar(activeId) {
  // If opening a project detail, also highlight the projects tab
  const isDetail = activeId && activeId.endsWith('-detail');
  document.querySelectorAll('[data-tab]').forEach(tab => {
    const isActive = tab.dataset.tab === activeId ||
      (isDetail && tab.dataset.tab === 'projects');
    tab.classList.toggle('active', isActive);
  });
}

// --- Icon click ---
document.addEventListener('click', (e) => {
  // Close buttons (red dot)
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) { closeWindow(closeBtn.dataset.close); return; }

  // Minimize (yellow dot) — same as close for now
  const minBtn = e.target.closest('[data-minimize]');
  if (minBtn) { closeWindow(minBtn.dataset.minimize); return; }

  // Maximize (green dot) — toggle fullscreen
  const maxBtn = e.target.closest('[data-maximize]');
  if (maxBtn) {
    const win = maxBtn.closest('.os-window');
    if (win) win.classList.toggle('maximized');
    return;
  }

  const panelClose = e.target.closest('[data-panel-close]');
  if (panelClose) { closeWindow(panelClose.dataset.panelClose); return; }

  // Taskbar tabs
  const tab = e.target.closest('[data-tab]');
  if (tab) {
    const id = tab.dataset.tab;
    if (id === 'home') { closeAllWindows(); return; }
    openWindow(id);
    return;
  }

  // Desktop icons — single click opens
  const icon = e.target.closest('.desktop-icon');
  if (icon) {
    const id = icon.dataset.iconId;
    document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    openWindow(id);
    return;
  }

  // Click on desktop background — deselect all icons
  if (e.target.closest('.desktop')) {
    document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
    return;
  }

  // Focus window on click
  const win = e.target.closest('.os-window');
  if (win) focusWindow(win.dataset.windowId);
});

window.addEventListener('resize', () => closeAllWindows());

// Log off — show lock screen again
const logoffBtn = document.getElementById('logoffBtn');
if (logoffBtn) {
  logoffBtn.addEventListener('click', () => {
    closeAllWindows();
    const lock = document.getElementById('lockScreen');
    if (lock) {
      lock.style.display = 'flex';
      lock.classList.remove('dismissing');
      sessionStorage.removeItem('lyla-visited');
      // Re-attach lock screen listeners so login works again
      if (typeof window.__setupLockListeners === 'function') {
        window.__setupLockListeners();
      }
    }
  });
}

// --- Draggable desktop icons ---
let dragIcon = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragStartX = 0;
let dragStartY = 0;
let hasDragged = false;

document.addEventListener('mousedown', (e) => {
  const icon = e.target.closest('.desktop-icon');
  if (!icon) return;
  dragIcon = icon;
  const rect = icon.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  hasDragged = false;
  icon.style.zIndex = '6';
  icon.style.transition = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!dragIcon) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged = true;
  if (!hasDragged) return;
  dragIcon.style.position = 'absolute';
  dragIcon.style.top = (e.clientY - dragOffsetY) + 'px';
  dragIcon.style.left = (e.clientX - dragOffsetX) + 'px';
});

document.addEventListener('mouseup', () => {
  if (dragIcon) {
    dragIcon.style.transition = '';
    dragIcon.style.zIndex = '5';
    // Log position so user can show me
    const t = ((parseInt(dragIcon.style.top) / window.innerHeight) * 100).toFixed(1);
    const l = ((parseInt(dragIcon.style.left) / window.innerWidth) * 100).toFixed(1);
    console.log(`${dragIcon.dataset.iconId}: top="${t}%" left="${l}%"`);
  }
  dragIcon = null;
});

// --- Draggable windows (by title bar) ---
let dragWin = null;
let dragWinOffsetX = 0;
let dragWinOffsetY = 0;

document.addEventListener('mousedown', (e) => {
  const titlebar = e.target.closest('.os-window-titlebar');
  if (!titlebar) return;
  // Don't drag if clicking a button
  if (e.target.closest('.os-btn')) return;
  const win = titlebar.closest('.os-window');
  if (!win || win.classList.contains('maximized')) return;
  dragWin = win;
  const rect = win.getBoundingClientRect();
  dragWinOffsetX = e.clientX - rect.left;
  dragWinOffsetY = e.clientY - rect.top;
  win.style.transition = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!dragWin) return;
  dragWin.style.top = (e.clientY - dragWinOffsetY) + 'px';
  dragWin.style.left = (e.clientX - dragWinOffsetX) + 'px';
});

document.addEventListener('mouseup', () => {
  if (dragWin) {
    dragWin.style.transition = '';
    dragWin = null;
  }
});

// --- Instagram like ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-ig-like]');
  if (!btn) return;
  const post = btn.closest('.ig-post');
  const countEl = post.querySelector('[data-ig-like-count]');
  const liked = btn.classList.toggle('liked');
  let count = parseInt(countEl.textContent) || 0;
  count = liked ? count + 1 : Math.max(0, count - 1);
  countEl.textContent = count + (count === 1 ? ' like' : ' likes');
});

// --- Instagram comment ---
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('[data-ig-comment-toggle]');
  if (toggle) {
    const post = toggle.closest('.ig-post');
    const box = post.querySelector('.ig-comment-box');
    box.style.display = box.style.display === 'none' ? 'flex' : 'none';
    if (box.style.display === 'flex') box.querySelector('input').focus();
    return;
  }
  const postBtn = e.target.closest('[data-ig-comment-post]');
  if (postBtn) {
    const post = postBtn.closest('.ig-post');
    const input = post.querySelector('[data-ig-comment-input]');
    const text = input.value.trim();
    if (!text) return;
    const comments = post.querySelector('[data-ig-comments]');
    const comment = document.createElement('div');
    comment.className = 'ig-comment';
    comment.innerHTML = '<strong>visitor</strong>' + text;
    comments.appendChild(comment);
    input.value = '';
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('[data-ig-comment-input]')) {
    e.target.closest('.ig-post').querySelector('[data-ig-comment-post]').click();
  }
});

// --- Instagram share ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-ig-share]');
  if (!btn) return;
  if (navigator.share) {
    navigator.share({ title: 'Lyla Huang — Portfolio', url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = '↗'; }, 1500);
    });
  }
});

// --- Per-video sound toggle (preference persists to next video) ---
let soundOn = false;

// Apply the current sound preference to a video frame and sync its button label
function applySoundPref(frame) {
  if (!frame) return;
  const video = frame.querySelector('video');
  const btn = frame.querySelector('[data-sound-toggle]');
  if (video) video.muted = !soundOn;
  if (btn) btn.textContent = soundOn ? 'SOUND OFF' : 'SOUND ON';
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-sound-toggle]');
  if (!btn) return;
  const frame = btn.closest('.films-frame') || btn.closest('.ig-post-media');
  if (!frame) return;
  const video = frame.querySelector('video');
  if (!video) return;
  video.muted = !video.muted;
  soundOn = !video.muted; // remember so the next video the user navigates to inherits it
  btn.textContent = video.muted ? 'SOUND ON' : 'SOUND OFF';
});

// --- Project card double-click → open project detail window ---
// Cards in the projects grid require double-click (retro OS feel)
// Nav tabs inside project details stay single-click
document.addEventListener('dblclick', (e) => {
  const card = e.target.closest('.pw-card[data-open-project]');
  if (card) {
    const id = card.dataset.openProject;
    const currentWindow = card.closest('.os-window');
    if (currentWindow) {
      closeWindow(currentWindow.dataset.windowId);
    }
    openWindow(id);
  }
});
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-open-project]');
  if (card && !card.classList.contains('pw-card')) {
    const id = card.dataset.openProject;
    const currentWindow = card.closest('.os-window');
    if (currentWindow) {
      closeWindow(currentWindow.dataset.windowId);
    }
    openWindow(id);
  }
});

// --- Film nav scroll arrows ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-films-scroll]');
  if (!btn) return;
  const nav = btn.closest('.films-nav-wrap').querySelector('.films-nav-scroll');
  const amount = 200;
  nav.scrollBy({ left: btn.dataset.filmsScroll === 'next' ? amount : -amount, behavior: 'smooth' });
});

// --- Film tabs ---
document.addEventListener('click', (e) => {
  const tab = e.target.closest('[data-film-tab]');
  if (!tab) return;
  const id = tab.dataset.filmTab;
  const container = tab.closest('.films-detail');
  // Pause previous video
  const prevFrame = container.querySelector('.films-frame.active');
  if (prevFrame) {
    const prevVideo = prevFrame.querySelector('video');
    if (prevVideo) prevVideo.pause();
  }
  container.querySelectorAll('.proj-nav-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  container.querySelectorAll('.films-frame').forEach(f => f.classList.remove('active'));
  const newFrame = container.querySelector(`[data-film-panel="${id}"]`);
  newFrame.classList.add('active');
  applySoundPref(newFrame); // carry the sound preference to the newly shown film
  // Load and play new video on demand
  const video = newFrame.querySelector('video');
  if (video) {
    if (!video.src && video.dataset.lazySrc) {
      video.preload = 'auto';
      video.src = video.dataset.lazySrc;
    }
    if (video.readyState >= 2) video.play().catch(() => {});
    else video.addEventListener('loadeddata', () => video.play().catch(() => {}), { once: true });
  }
});

// --- Instagram fullscreen video ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-ig-fullscreen-btn]');
  if (!btn) return;
  const media = btn.closest('.ig-post-media');
  if (!media) return;
  const video = media.querySelector('video');
  if (!video) return;
  const overlay = document.getElementById('igFullscreen');
  const fsVideo = document.getElementById('igFullscreenVideo');
  if (!overlay || !fsVideo) return;
  fsVideo.src = video.src || video.dataset.lazySrc;
  fsVideo.muted = false;
  overlay.style.display = 'block';
  fsVideo.play().catch(() => {});
});
document.addEventListener('click', (e) => {
  if (e.target.id === 'igFullscreenClose') {
    const overlay = document.getElementById('igFullscreen');
    const fsVideo = document.getElementById('igFullscreenVideo');
    if (overlay) overlay.style.display = 'none';
    if (fsVideo) { fsVideo.pause(); fsVideo.src = ''; }
  }
});

// --- Mobile home screen app buttons ---
document.addEventListener('click', (e) => {
  const appBtn = e.target.closest('[data-open-app]');
  if (appBtn) {
    openWindow(appBtn.dataset.openApp);
  }
});

// --- Swipe-down to close fullscreen mobile panels ---
let swipeStartY = 0;
let swipePanel = null;

document.addEventListener('touchstart', (e) => {
  const header = e.target.closest('.mobile-panel--fullscreen .mobile-panel-header');
  if (!header) return;
  swipeStartY = e.touches[0].clientY;
  swipePanel = header.closest('.mobile-panel');
});

document.addEventListener('touchmove', (e) => {
  if (!swipePanel) return;
  const deltaY = e.touches[0].clientY - swipeStartY;
  if (deltaY > 0) {
    swipePanel.style.transform = `translateY(${deltaY}px)`;
  }
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!swipePanel) return;
  const deltaY = e.changedTouches[0].clientY - swipeStartY;
  if (deltaY > 80) {
    const id = swipePanel.dataset.panelId;
    swipePanel.style.transform = '';
    if (id) closeWindow(id);
  } else {
    swipePanel.style.transform = '';
  }
  swipePanel = null;
});


// --- Weather fetch for weather.app ---
async function loadWeather() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.39&longitude=2.17&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Europe/Madrid');
    const data = await res.json();
    const c = data.current;

    const tempEl = document.getElementById('weatherTemp');
    const descEl = document.getElementById('weatherDesc');
    const humEl = document.getElementById('weatherHumidity');
    const windEl = document.getElementById('weatherWind');
    const sceneEl = document.getElementById('weatherScene');

    if (tempEl) tempEl.textContent = Math.round(c.temperature_2m) + '°C';
    if (humEl) humEl.textContent = c.relative_humidity_2m + '% humidity';
    if (windEl) windEl.textContent = Math.round(c.wind_speed_10m) + ' km/h wind';

    const code = c.weather_code;
    let desc = 'Clear sky';
    let scene = 'sunny';
    if (code <= 1) { desc = 'Clear sky'; scene = 'sunny'; }
    else if (code <= 3) { desc = 'Partly cloudy'; scene = 'cloudy'; }
    else if (code <= 48) { desc = 'Foggy'; scene = 'cloudy'; }
    else if (code <= 67) { desc = 'Rainy'; scene = 'rainy'; }
    else if (code <= 77) { desc = 'Snowy'; scene = 'rainy'; }
    else if (code <= 99) { desc = 'Stormy'; scene = 'rainy'; }

    if (descEl) descEl.textContent = desc;
    if (sceneEl) sceneEl.className = 'weather-scene weather-' + scene;
  } catch (e) {
    const descEl = document.getElementById('weatherDesc');
    if (descEl) descEl.textContent = "Probably sunny (it's Barcelona)";
  }
}

// ================= Deep links (shareable section URLs) =================
// Each main section gets its own URL hash so it can be linked to / shared directly,
// e.g. lylahuang.com/#reroute opens the (RE)ROUTE case study straight away.
const SLUG_TO_ID = {
  films: 'films',
  projects: 'projects',
  reroute: 'reroute-detail',
  'reroute-2': 'reroute2-detail',
  snapp: 'snapp-detail',
  planmytrip: 'planmytrip-detail',
  jobhunter: 'jobhunter-detail',
};
const ID_TO_SLUG = {
  films: 'films',
  projects: 'projects',
  'reroute-detail': 'reroute',
  'reroute2-detail': 'reroute-2',
  'snapp-detail': 'snapp',
  'planmytrip-detail': 'planmytrip',
  'jobhunter-detail': 'jobhunter',
};

// Keep the URL in step with what's open. Mapped sections set their slug;
// anything else (easter eggs, etc.) leaves a clean URL.
function syncHash(id) {
  const slug = ID_TO_SLUG[id];
  if (slug) {
    if ('#' + slug !== location.hash) history.replaceState(null, '', '#' + slug);
  } else {
    clearHash();
  }
}

function clearHash() {
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
}

// A shared link should land straight on the content, past the lock screen.
function dismissLockForDeepLink() {
  document.documentElement.classList.add('skip-lock');
  try { sessionStorage.setItem('lyla-visited', 'true'); } catch (e) {}
  const lock = document.getElementById('lockScreen');
  if (lock) { lock.classList.remove('dismissing'); lock.style.display = 'none'; }
  const phoneLock = document.querySelector('.phone-lock');
  if (phoneLock) phoneLock.style.display = 'none';
}

function openFromHash() {
  const id = SLUG_TO_ID[location.hash.replace('#', '')];
  if (!id) return;
  dismissLockForDeepLink();
  // Mobile has no "projects" panel — it uses the home-screen folder popup instead.
  if (id === 'projects' && !isDesktop()) {
    const overlay = document.getElementById('phoneFolderOverlay');
    if (overlay) overlay.style.display = 'flex';
    return;
  }
  openWindow(id);
}

// Expose globally
window.openWindow = openWindow;

// Honour a deep link on first load and whenever the hash changes.
openFromHash();
window.addEventListener('hashchange', openFromHash);
