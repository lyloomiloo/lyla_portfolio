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
        return;
      }
    }
    // Project detail windows open maximized directly
    if (id.endsWith('-detail') && !win.classList.contains('maximized')) {
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

  // Fetch weather when weather panel opens
  if (id === 'weather') {
    loadWeather();
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

// --- Icon double-click / single-tap ---
let clickTimer = null;
let lastClickedIcon = null;

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

  // Desktop icons
  const icon = e.target.closest('.desktop-icon');
  if (icon) {
    const id = icon.dataset.iconId;

    // Mobile: single tap opens
    if (isTouchDevice()) {
      document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      openWindow(id);
      return;
    }

    // Desktop: double-click
    if (lastClickedIcon === id && clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
      lastClickedIcon = null;
      openWindow(id);
    } else {
      document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      lastClickedIcon = id;
      clickTimer = setTimeout(() => {
        clickTimer = null;
        lastClickedIcon = null;
      }, 400);
    }
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

// --- Project card click → open project detail window ---
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-open-project]');
  if (card) {
    const id = card.dataset.openProject;
    // If navigating from inside a project detail, close the current one
    const currentWindow = card.closest('.os-window');
    if (currentWindow) {
      closeWindow(currentWindow.dataset.windowId);
    }
    openWindow(id);
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

// Expose globally
window.openWindow = openWindow;
