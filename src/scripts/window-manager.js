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
    if ((id.endsWith('-detail') || id === 'duckgame' || id === 'films' || id === 'showcase') && !win.classList.contains('maximized')) {
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
  if (id === 'showcase' || id === 'showcase-dl' || ID_TO_SLUG[id] === location.hash.replace('#', '')) clearHash();
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

// --- Project detail "back" arrow → close detail, reopen projects grid ---
document.addEventListener('click', (e) => {
  const back = e.target.closest('[data-proj-back]');
  if (back) {
    const win = back.closest('.os-window');
    if (win) closeWindow(win.dataset.windowId);
    openWindow('projects');
  }
});

// --- Project card single-click → open project detail window ---
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-open-project]');
  if (card) {
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

// --- Lightbox (shared): fullscreen for #films videos, windowed browser-frame for RANDOM ---
// Size the windowed frame to the media so it hugs the content (both axes, no letterbox).
function fitFrameToMedia(mw, mh) {
  const overlay = document.getElementById('igFullscreen');
  const frame = overlay && overlay.querySelector('.ig-fs-frame');
  if (!frame || !overlay.classList.contains('ig-fs-windowed') || !mw || !mh) return;
  const bar = frame.querySelector('.ig-fs-bar');
  const barH = bar ? bar.getBoundingClientRect().height : 0;
  const maxW = Math.min(window.innerWidth * 0.9, 960);
  const maxBodyH = Math.min(window.innerHeight * 0.8, 720) - barH;
  const aspect = mw / mh;
  let w = maxW, h = w / aspect;
  if (h > maxBodyH) { h = maxBodyH; w = h * aspect; }
  frame.style.width = Math.round(w) + 'px';
  frame.style.height = Math.round(h + barH) + 'px';
}

function showLightbox({ image, video, poster, title, windowed }) {
  const overlay = document.getElementById('igFullscreen');
  const fsVideo = document.getElementById('igFullscreenVideo');
  const fsImg = document.getElementById('igFullscreenImg');
  const fsTitle = document.getElementById('igFullscreenTitle');
  const frame = overlay && overlay.querySelector('.ig-fs-frame');
  if (!overlay) return;
  overlay.classList.toggle('ig-fs-windowed', !!windowed);
  if (frame) { frame.style.width = ''; frame.style.height = ''; } // reset; recomputed on media load
  if (fsTitle) fsTitle.textContent = title || '';
  if (video) {
    if (fsImg) { fsImg.src = ''; fsImg.style.display = 'none'; }
    if (fsVideo) {
      fsVideo.style.display = 'block';
      fsVideo.poster = poster || '';               // show the cover while the video loads
      fsVideo.onerror = () => { if (poster && fsImg) { fsVideo.style.display = 'none'; fsImg.src = poster; fsImg.style.display = 'block'; } };
      fsVideo.onloadedmetadata = () => fitFrameToMedia(fsVideo.videoWidth, fsVideo.videoHeight);
      fsVideo.src = video;
      fsVideo.muted = false;
      fsVideo.play().catch(() => {});
      if (fsVideo.videoWidth) fitFrameToMedia(fsVideo.videoWidth, fsVideo.videoHeight);
    }
  } else {
    if (fsVideo) { fsVideo.pause(); fsVideo.src = ''; fsVideo.style.display = 'none'; }
    if (fsImg) {
      fsImg.onload = () => fitFrameToMedia(fsImg.naturalWidth, fsImg.naturalHeight);
      fsImg.src = image;
      fsImg.style.display = 'block';
      if (fsImg.complete && fsImg.naturalWidth) fitFrameToMedia(fsImg.naturalWidth, fsImg.naturalHeight);
    }
  }
  overlay.style.display = windowed ? 'flex' : 'block';
}

function closeLightbox() {
  const overlay = document.getElementById('igFullscreen');
  const fsVideo = document.getElementById('igFullscreenVideo');
  const fsImg = document.getElementById('igFullscreenImg');
  const frame = overlay && overlay.querySelector('.ig-fs-frame');
  if (overlay) { overlay.style.display = 'none'; overlay.classList.remove('ig-fs-windowed'); }
  if (frame) { frame.style.width = ''; frame.style.height = ''; }
  if (fsVideo) { fsVideo.pause(); fsVideo.src = ''; }
  if (fsImg) { fsImg.src = ''; fsImg.style.display = 'none'; }
}

// #films post → fullscreen video
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-ig-fullscreen-btn]');
  if (!btn) return;
  const media = btn.closest('.ig-post-media');
  const video = media && media.querySelector('video');
  if (!video) return;
  showLightbox({ video: video.src || video.dataset.lazySrc, windowed: false });
});

// RANDOM cards → windowed, browser-framed viewer
window.openScreenshotFullscreen = (src, title) => showLightbox({ image: src, title, windowed: true });
window.openRecordingFullscreen = (src, title, poster) => showLightbox({ video: src, poster, title, windowed: true });

// Close via the × button or by clicking the backdrop
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('igFullscreen');
  if (!overlay || overlay.style.display === 'none') return;
  if (e.target.id === 'igFullscreenClose' || e.target === overlay) closeLightbox();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

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
  if (id === 'showcase') return; // secret token hash is managed by the showcase opener
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
  const raw = location.hash.replace('#', '');
  // Secret per-viewer showcase: #showcase-<token> -> /showcase/<token>.json
  if (raw.indexOf('showcase-') === 0) {
    openShowcase(raw.slice('showcase-'.length));
    return;
  }
  const id = SLUG_TO_ID[raw];
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

// ================= Secret showcase ("For You" feed) =================
// Opens ONLY via #showcase-<token>. The <token> names a manifest fetched from
// /showcase/<token>.json, so each viewer can get their own link + curated feed,
// and nothing about any showcase ships in the public page HTML.
let showcaseSoundOn = true; // showcase opens with sound on
let showcaseLoadedToken = null;

let showcaseTokenWindow = null; // which window a token uses: 'showcase' or 'showcase-dl'

async function openShowcase(token) {
  // Only allow simple slugs — no slashes/dots — so the token can't walk the filesystem.
  if (!token || !/^[a-z0-9-]+$/i.test(token)) return;
  dismissLockForDeepLink();

  // Re-opening the same link just re-shows its window (no re-fetch, no re-download).
  if (showcaseLoadedToken === token && showcaseTokenWindow) { openWindow(showcaseTokenWindow); return; }

  let data = null, ok = false;
  try {
    const res = await fetch('/showcase/' + token + '.json', { cache: 'no-store' });
    if (res.ok) { data = await res.json(); ok = true; }
  } catch (e) { /* handled below */ }

  // Downloads open as a small resume-style pop-up, not the big showcase window.
  if (ok && data && data.type === 'download') {
    showcaseLoadedToken = token; showcaseTokenWindow = 'showcase-dl';
    openShowcaseDownloadWindow(data);
    return;
  }

  showcaseTokenWindow = 'showcase';
  openWindow('showcase');
  if (!ok || !data) {
    document.querySelectorAll('.js-showcase-feed').forEach(f => { f.innerHTML = '<div class="tok-empty">This showcase link isn\'t available.</div>'; });
    document.querySelectorAll('.js-showcase-title').forEach(t => { t.textContent = 'FOR YOU'; });
    return;
  }
  renderShowcase(data);
  showcaseLoadedToken = token;
}

// Page showcases: a manifest of standalone HTML documents shown one at a time
// in an iframe, with prev/next navigation. { "type": "pages", "pages": [{src,label}] }
function renderShowcasePages(data) {
  const pages = (data && Array.isArray(data.pages)) ? data.pages : [];
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  document.querySelectorAll('.js-showcase-title').forEach(t => { t.textContent = (data && data.title) ? data.title : 'SHOWCASE'; });
  if (!pages.length) {
    document.querySelectorAll('.js-showcase-feed').forEach(f => { f.innerHTML = '<div class="tok-empty">Nothing here yet.</div>'; });
    return;
  }
  const total = String(pages.length).padStart(2, '0');
  // Nav bar only makes sense with more than one page.
  const bar = pages.length > 1 ? `<div class="scp-bar">
      <button class="scp-arrow" data-scp-prev aria-label="Previous page">&#8249;</button>
      <div class="scp-meta">
        <span class="scp-count"><b class="scp-cur">01</b> / ${total}</span>
        <span class="scp-label">${esc(pages[0].label || '')}</span>
      </div>
      <button class="scp-arrow" data-scp-next aria-label="Next page">&#8250;</button>
    </div>` : '';
  const html = `<div class="scp" data-scp>${bar}
    <iframe class="scp-frame" src="${esc(pages[0].src)}" title="${esc(pages[0].label || '')}" loading="lazy"></iframe>
  </div>`;
  document.querySelectorAll('.js-showcase-feed').forEach(feed => {
    feed.innerHTML = html;
    setupShowcasePages(feed, pages);
  });
}

function setupShowcasePages(feed, pages) {
  const scp = feed.querySelector('[data-scp]');
  if (!scp) return;
  const frame = scp.querySelector('.scp-frame');
  const curEl = scp.querySelector('.scp-cur');
  const labelEl = scp.querySelector('.scp-label');
  let cur = 0;
  const go = (n) => {
    cur = (n + pages.length) % pages.length;
    frame.src = pages[cur].src;
    frame.title = pages[cur].label || '';
    if (curEl) curEl.textContent = String(cur + 1).padStart(2, '0');
    if (labelEl) labelEl.textContent = pages[cur].label || '';
  };
  const prev = scp.querySelector('[data-scp-prev]');
  const next = scp.querySelector('[data-scp-next]');
  if (prev) prev.addEventListener('click', () => go(cur - 1));
  if (next) next.addEventListener('click', () => go(cur + 1));
}

// Download showcase: a simple file preview that auto-downloads on open, like
// the resume window. { "type": "download", "file": "...", "name": "..." }
function openShowcaseDownloadWindow(data) {
  const file = (data && data.file) || '';
  const name = (data && data.name) || (file ? decodeURIComponent(file.split('/').pop()) : 'file');
  // Not offered on mobile — if somehow reached there, just hand off to the browser.
  if (typeof isDesktop === 'function' && !isDesktop()) {
    if (file) { const a = document.createElement('a'); a.href = file; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
    return;
  }
  const win = document.querySelector('[data-window-id="showcase-dl"]');
  if (win) {
    const titleEl = win.querySelector('.os-window-title');
    if (titleEl) titleEl.textContent = name + ' — Downloading...';
    const nameEl = win.querySelector('[data-scd-name]'); if (nameEl) nameEl.textContent = name;
    const statusEl = win.querySelector('[data-scd-status]'); if (statusEl) statusEl.textContent = 'Downloading...';
    const barWrap = win.querySelector('.scd-bar');
    if (barWrap) { barWrap.classList.remove('indeterminate'); barWrap.querySelectorAll('.scd-block').forEach(b => b.classList.remove('on', 'blink')); }
    const link = win.querySelector('[data-scd-link]'); if (link && file) { link.setAttribute('href', file); link.setAttribute('download', name); }
  }
  openWindow('showcase-dl');
  if (file) setTimeout(() => startShowcaseDownload(file, name), 400);
}

// Fetch the file as a stream so the bar reflects real bytes (0 -> 100%), then
// save it. On phones we hand off to the browser's own downloader instead of
// holding a large file in memory. Any failure falls back to a plain download.
function startShowcaseDownload(url, name) {
  const win = document.querySelector('[data-window-id="showcase-dl"]');
  const barWrap = win && win.querySelector('.scd-bar');
  const blocks = barWrap ? [...barWrap.querySelectorAll('.scd-block')] : [];
  const statusEl = win && win.querySelector('[data-scd-status]');
  const titleEl = win && win.querySelector('.os-window-title');
  const setBar = (pct) => {
    const n = blocks.length; if (!n) return;
    const filled = Math.round(pct / 100 * n);
    blocks.forEach((b, i) => { b.classList.toggle('on', i < filled); b.classList.toggle('blink', i === filled && filled < n); });
  };
  const setStatus = (t) => { if (statusEl) statusEl.textContent = t; };
  const setIndeterminate = (on) => { if (barWrap) barWrap.classList.toggle('indeterminate', on); };
  const nativeDownload = () => {
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  setStatus('Downloading...');
  setBar(0);
  (async () => {
    try {
      const resp = await fetch(url);
      if (!resp.ok || !resp.body) throw new Error('bad response');
      const total = +(resp.headers.get('content-length') || 0);
      if (!total) setIndeterminate(true);
      const reader = resp.body.getReader();
      const chunks = [];
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) setBar(Math.min(100, Math.round(received / total * 100)));
      }
      setIndeterminate(false); setBar(100);
      const obj = URL.createObjectURL(new Blob(chunks));
      const a = document.createElement('a');
      a.href = obj; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(obj), 8000);
      setStatus('Downloaded ✓');
      if (titleEl) titleEl.textContent = name + ' — Done';
    } catch (e) {
      // Streaming failed (network/memory/CORS) — let the browser handle it.
      setIndeterminate(false); setBar(100); setStatus('Downloading...');
      nativeDownload();
    }
  })();
}

function renderShowcase(data) {
  if (data && (data.type === 'pages' || Array.isArray(data.pages))) { renderShowcasePages(data); return; }
  const items = (data && Array.isArray(data.items)) ? data.items : [];
  document.querySelectorAll('.js-showcase-title').forEach(t => {
    t.textContent = (data && data.title) ? data.title : 'FOR YOU';
  });

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const defaultProfile = (data && data.profile) ? data.profile : 'showcase';

  // Same pixel-face avatar the #films IG posts use.
  const FACE =
    `<div></div><div></div><div style="background:#222"></div><div style="background:#222"></div><div style="background:#222"></div><div style="background:#222"></div><div></div><div></div>` +
    `<div></div><div style="background:#222"></div><div style="background:#F4C89A"></div><div style="background:#F4C89A"></div><div style="background:#F4C89A"></div><div style="background:#F4C89A"></div><div style="background:#222"></div><div></div>` +
    `<div></div><div style="background:#F4C89A"></div><div style="background:#222"></div><div style="background:#F4C89A"></div><div style="background:#F4C89A"></div><div style="background:#222"></div><div style="background:#F4C89A"></div><div></div>` +
    `<div></div><div style="background:#F4C89A"></div><div style="background:#F4C89A"></div><div style="background:#FF6B00"></div><div style="background:#FF6B00"></div><div style="background:#F4C89A"></div><div style="background:#F4C89A"></div><div></div>`;

  // Overlays that sit on top of the video (For You / AI badge / sound).
  const overlays = (it) => {
    const sound = it.type === 'video' ? `<button class="tok-sound">SOUND ON</button>` : '';
    return `<div class="tok-fyp">For You</div>${sound}`;
  };

  const stageHtml = (it, i) => {
    if (it.type === 'image') return `<img src="${esc(it.src)}" alt="${esc(it.caption || '')}" />${overlays(it)}`;
    if (it.type === 'gallery') {
      const slides = (Array.isArray(it.slides) && it.slides.length)
        ? it.slides
        : (it.images || []).map(s => ({ type: 'image', src: s }));
      const loop = slides.length > 1 ? '' : 'loop';
      const slideHtml = slides.map((sl, gi) => {
        const media = sl.type === 'video'
          ? `<video class="tok-galvideo" data-tok-galvideo ${loop} playsinline muted preload="${gi === 0 ? 'auto' : 'metadata'}" src="${esc(sl.src)}"></video>`
          : `<img src="${esc(sl.src)}" alt="" />`;
        return `<div class="tok-slide">${media}</div>`;
      }).join('');
      const dots = slides.map((_, gi) => `<button class="tok-dot${gi === 0 ? ' on' : ''}" data-tok-dot="${gi}" aria-label="Slide ${gi + 1}"></button>`).join('');
      const hint = slides.length > 1 ? `<div class="tok-swipe-hint" aria-label="Drag to swipe">
        <svg class="th-svg" viewBox="0 0 96 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g class="th-arrow" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="84" y1="34" x2="18" y2="34"/>
            <polyline points="28,27 14,34 28,41"/>
          </g>
          <g class="th-hand-grp">
            <circle class="th-ring" cx="60" cy="13" r="9"/>
            <circle class="th-ring th-ring2" cx="60" cy="13" r="9"/>
            <g class="th-hand" transform="translate(51 -1) scale(0.9)">
              <rect x="0" y="0" width="3" height="3" fill="#111"/><rect x="3" y="0" width="3" height="3" fill="#111"/><rect x="6" y="0" width="3" height="3" fill="#111"/>
              <rect x="0" y="3" width="3" height="3" fill="#111"/><rect x="3" y="3" width="3" height="3" fill="#FFF"/><rect x="6" y="3" width="3" height="3" fill="#111"/>
              <rect x="0" y="6" width="3" height="3" fill="#111"/><rect x="3" y="6" width="3" height="3" fill="#FFF"/><rect x="6" y="6" width="3" height="3" fill="#111"/>
              <rect x="0" y="9" width="3" height="3" fill="#111"/><rect x="3" y="9" width="3" height="3" fill="#FFF"/><rect x="6" y="9" width="3" height="3" fill="#111"/><rect x="9" y="9" width="3" height="3" fill="#111"/><rect x="12" y="9" width="3" height="3" fill="#111"/><rect x="15" y="9" width="3" height="3" fill="#111"/>
              <rect x="0" y="12" width="3" height="3" fill="#111"/><rect x="3" y="12" width="3" height="3" fill="#FFF"/><rect x="6" y="12" width="3" height="3" fill="#FFF"/><rect x="9" y="12" width="3" height="3" fill="#FFF"/><rect x="12" y="12" width="3" height="3" fill="#FFF"/><rect x="15" y="12" width="3" height="3" fill="#111"/>
              <rect x="0" y="15" width="3" height="3" fill="#111"/><rect x="3" y="15" width="3" height="3" fill="#FFF"/><rect x="6" y="15" width="3" height="3" fill="#FFF"/><rect x="9" y="15" width="3" height="3" fill="#FFF"/><rect x="12" y="15" width="3" height="3" fill="#FFF"/><rect x="15" y="15" width="3" height="3" fill="#111"/>
              <rect x="3" y="18" width="3" height="3" fill="#111"/><rect x="6" y="18" width="3" height="3" fill="#FFF"/><rect x="9" y="18" width="3" height="3" fill="#FFF"/><rect x="12" y="18" width="3" height="3" fill="#111"/>
              <rect x="3" y="21" width="3" height="3" fill="#111"/><rect x="6" y="21" width="3" height="3" fill="#111"/><rect x="9" y="21" width="3" height="3" fill="#111"/><rect x="12" y="21" width="3" height="3" fill="#111"/>
            </g>
          </g>
        </svg>
        <span class="th-label">drag to scroll</span>
      </div>` : '';
      return `<div class="tok-gallery" data-tok-gallery><div class="tok-track">${slideHtml}</div>${hint}<div class="tok-dots">${dots}</div></div>${overlays(it)}`;
    }
    if (it.type === 'link') {
      const thumb = it.thumb ? `<img class="tok-linkthumb" src="${esc(it.thumb)}" alt="" />` : '';
      return `<div class="tok-linkcard">${thumb}</div>`;
    }
    return `<video data-tok-video loop muted playsinline preload="${i === 0 ? 'auto' : 'metadata'}" src="${esc(it.src)}"></video>
        ${overlays(it)}
        <div class="tok-progress"><i></i></div>`;
  };

  const itemHtml = (it, i, arr) => {
    const total = arr ? arr.length : 1;
    const name = it.profile || defaultProfile;
    const loc = it.loc || '';
    const brief = it.caption || it.desc || it.title || '';
    const likes = (it.likes | 0) || 0;
    const openAct = it.type === 'link'
      ? `<a class="tok-open" href="${esc(it.url)}" target="_blank" rel="noopener">OPEN ↗</a>` : '';
    const aiInline = it.ai ? `<span class="tok-ai-inline">AI-GENERATED</span>` : '';
    // Prev/next post arrows (only when there's more than one post).
    const nav = total > 1
      ? `${i > 0 ? '<button class="tok-nav tok-nav-prev" data-tok-prev aria-label="Previous post">&#8249;</button>' : ''}${i < total - 1 ? '<button class="tok-nav tok-nav-next" data-tok-next aria-label="Next post">&#8250;</button>' : ''}`
      : '';
    return `<div class="tok-item" data-idx="${i}">
      <div class="tok-stage">${stageHtml(it, i)}${nav}</div>
      <div class="tok-side">
        <div class="tok-textcol">
          <div class="tok-profile">
            <div class="tok-avatar"><div class="ig-pixel-face">${FACE}</div></div>
            <div class="tok-user"><span class="tok-name">${esc(name)}</span>${loc ? `<span class="tok-loc">${esc(loc)}</span>` : ''}</div>
            ${aiInline}
          </div>
          ${brief ? `<div class="tok-caption"><div class="tok-brief">${esc(brief)}</div><button class="tok-more" data-tok-more>…more</button></div>` : ''}
        </div>
        <div class="tok-actions">
          <button class="tok-like"><span class="tok-glyph">&#9829;</span><span class="tok-likecount">${likes}</span></button>
          <button class="tok-share"><span class="tok-glyph">&#8599;</span></button>
          ${openAct}
        </div>
      </div>
    </div>`;
  };

  document.querySelectorAll('.js-showcase-feed').forEach(feed => {
    feed.innerHTML = items.length
      ? items.map(itemHtml).join('')
      : '<div class="tok-empty">Nothing here yet.</div>';
    setupShowcaseFeed(feed);
  });
}

function setupShowcaseFeed(feed) {
  const itemEls = [...feed.querySelectorAll('.tok-item')];
  if (!itemEls.length) return;
  const root = feed.closest('.mobile-panel-body') || feed.closest('.showcase-detail') || feed;

  const applyShowcaseSound = (video) => {
    if (!video) return;
    video.muted = !showcaseSoundOn;
    const btn = video.closest('.tok-item') && video.closest('.tok-item').querySelector('.tok-sound');
    if (btn) { btn.classList.toggle('on', showcaseSoundOn); btn.textContent = showcaseSoundOn ? 'SOUND OFF' : 'SOUND ON'; }
  };

  // Progress bars.
  itemEls.forEach(el => {
    const v = el.querySelector('video[data-tok-video]');
    const bar = el.querySelector('.tok-progress > i');
    if (v && bar) v.addEventListener('timeupdate', () => { if (v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%'; });
  });

  // Media galleries (video + stills): a horizontal swipe carousel with dots.
  // Auto-advances through the slides; a video slide holds until it ends, and any
  // manual swipe / dot tap stops the auto-advance. Videos play only while the
  // gallery post is the one on screen (driven by the vertical observer below).
  feed.querySelectorAll('[data-tok-gallery]').forEach(gal => {
    const track = gal.querySelector('.tok-track');
    const slides = [...gal.querySelectorAll('.tok-slide')];
    const dots = [...gal.querySelectorAll('.tok-dot')];
    if (!track || !slides.length) return;
    let cur = 0, auto = true, inView = false, advTimer = null, scrollTimer = null;
    const hideHint = () => gal.classList.add('swiped'); // drop the "drag to swipe" hint

    const clearAdv = () => { if (advTimer) { clearTimeout(advTimer); advTimer = null; } };
    const curVideo = () => slides[cur] && slides[cur].querySelector('video[data-tok-galvideo]');
    const pauseVids = () => slides.forEach(s => { const v = s.querySelector('video[data-tok-galvideo]'); if (v) { v.pause(); v.muted = true; } });
    const playCur = () => {
      pauseVids();
      if (!inView) return;
      const v = curVideo();
      if (v) { try { v.currentTime = 0; } catch (e) {} v.muted = !showcaseSoundOn; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); }
    };
    const scheduleAdv = () => {
      clearAdv();
      if (!auto || !inView || slides.length < 2 || curVideo()) return; // video slides advance on 'ended'
      advTimer = setTimeout(() => goTo(cur + 1), 3200);
    };
    const setCur = (idx) => {
      idx = ((idx % slides.length) + slides.length) % slides.length;
      if (idx === cur) { scheduleAdv(); return; }
      cur = idx;
      dots.forEach((d, k) => d.classList.toggle('on', k === cur));
      playCur();
      scheduleAdv();
    };
    const goTo = (n) => {
      const idx = ((n % slides.length) + slides.length) % slides.length;
      track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
      setCur(idx);
    };

    slides.forEach(s => { const v = s.querySelector('video[data-tok-galvideo]'); if (v) v.addEventListener('ended', () => { if (auto && inView) goTo(cur + 1); }); });
    track.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(() => setCur(Math.round(track.scrollLeft / track.clientWidth)), 90); });
    dots.forEach((d, k) => d.addEventListener('click', () => { auto = false; hideHint(); goTo(k); }));

    // Mouse drag-to-swipe (desktop has no touch; touch/trackpad pan natively).
    let dragOn = false, dragX = 0, dragLeft = 0;
    track.addEventListener('pointerdown', (e) => {
      auto = false; clearAdv(); hideHint();
      if (e.pointerType === 'touch') return; // native touch scrolling handles swipes
      dragOn = true; dragX = e.clientX; dragLeft = track.scrollLeft;
      track.classList.add('dragging');
      try { track.setPointerCapture(e.pointerId); } catch (_) {}
    });
    track.addEventListener('pointermove', (e) => { if (dragOn) track.scrollLeft = dragLeft - (e.clientX - dragX); });
    const endDrag = (e) => {
      if (!dragOn) return;
      dragOn = false;
      track.classList.remove('dragging');
      try { track.releasePointerCapture(e.pointerId); } catch (_) {}
      goTo(Math.round(track.scrollLeft / track.clientWidth));
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    // Called by the vertical observer when this gallery post enters/leaves view.
    gal._enter = () => { inView = true; playCur(); scheduleAdv(); };
    gal._leave = () => { inView = false; clearAdv(); pauseVids(); };
  });

  // One post is "on screen" at a time — the one filling the viewport. Videos in
  // any other post (or in the hidden desktop/mobile duplicate feed) stay paused.
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const active = e.isIntersecting && e.intersectionRatio >= 0.6;
      const item = e.target;
      const gal = item.querySelector('[data-tok-gallery]');
      if (gal) { if (active) { gal._enter && gal._enter(); } else { gal._leave && gal._leave(); } return; }
      const v = item.querySelector('video[data-tok-video]');
      if (!v) return;
      if (active) { applyShowcaseSound(v); v.play().catch(() => {}); }
      else { v.pause(); v.muted = true; }
    });
  }, { root, threshold: [0.6] });
  itemEls.forEach(el => io.observe(el));

  // Autoplay the first post — but only for the feed that's actually visible
  // (desktop window vs mobile panel both render; the hidden one must stay silent).
  setTimeout(() => {
    if (!feed.offsetParent) return;
    const first = itemEls[0];
    if (!first) return;
    const gal0 = first.querySelector('[data-tok-gallery]');
    if (gal0) { gal0._enter && gal0._enter(); return; }
    const v0 = first.querySelector('video[data-tok-video]');
    if (!v0) return;
    applyShowcaseSound(v0); // unmuted (sound on by default)
    v0.play().catch(() => {
      // Browser blocked unmuted autoplay: play muted so it isn't frozen,
      // then unmute on the viewer's first interaction.
      v0.muted = true;
      v0.play().catch(() => {});
      const unlock = () => {
        if (showcaseSoundOn) { applyShowcaseSound(v0); v0.play().catch(() => {}); }
        document.removeEventListener('pointerdown', unlock);
      };
      document.addEventListener('pointerdown', unlock, { once: true });
    });
  }, 200);
}

// Showcase interactions: sound / like / share / expand (delegated).
document.addEventListener('click', (e) => {
  const soundBtn = e.target.closest('.tok-sound');
  if (soundBtn) {
    showcaseSoundOn = !showcaseSoundOn;
    const v = soundBtn.closest('.tok-item') && soundBtn.closest('.tok-item').querySelector('video[data-tok-video]');
    if (v) { v.muted = !showcaseSoundOn; if (showcaseSoundOn) v.play().catch(() => {}); }
    soundBtn.classList.toggle('on', showcaseSoundOn);
    soundBtn.textContent = showcaseSoundOn ? 'SOUND OFF' : 'SOUND ON';
    return;
  }
  const navPrev = e.target.closest('[data-tok-prev]');
  if (navPrev) {
    const item = navPrev.closest('.tok-item');
    const p = item && item.previousElementSibling;
    if (p) p.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const navNext = e.target.closest('[data-tok-next]');
  if (navNext) {
    const item = navNext.closest('.tok-item');
    const n = item && item.nextElementSibling;
    if (n) n.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const likeBtn = e.target.closest('.tok-like');
  if (likeBtn) {
    const countEl = likeBtn.querySelector('.tok-likecount');
    const liked = likeBtn.classList.toggle('liked');
    const n = parseInt(countEl.textContent, 10) || 0;
    countEl.textContent = liked ? n + 1 : Math.max(0, n - 1);
    return;
  }
  const shareBtn = e.target.closest('.tok-share');
  if (shareBtn) {
    const glyph = shareBtn.querySelector('.tok-glyph');
    const flash = () => { if (glyph) { const t = glyph.textContent; glyph.textContent = '✓'; setTimeout(() => glyph.textContent = t, 1200); } };
    if (navigator.share) navigator.share({ url: location.href }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(flash).catch(flash);
    else flash();
    return;
  }
  const moreBtn = e.target.closest('[data-tok-more]');
  if (moreBtn) {
    const cap = moreBtn.closest('.tok-caption');
    const brief = cap && cap.querySelector('.tok-brief');
    if (brief) {
      const expanded = brief.classList.toggle('expanded');
      moreBtn.textContent = expanded ? 'less' : '…more';
    }
    return;
  }
});

// Expose globally
window.openWindow = openWindow;

// Honour a deep link on first load and whenever the hash changes.
openFromHash();
window.addEventListener('hashchange', openFromHash);
