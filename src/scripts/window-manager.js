let zCounter = 10;
const isDesktop = () => window.innerWidth > 768;

function openWindow(id) {
  if (isDesktop()) {
    const win = document.querySelector(`[data-window-id="${id}"]`);
    if (!win) return;
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
}

function updateTaskbar(activeId) {
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === activeId);
  });
}

document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) { closeWindow(closeBtn.dataset.close); return; }

  const panelClose = e.target.closest('[data-panel-close]');
  if (panelClose) { closeWindow(panelClose.dataset.panelClose); return; }

  const tab = e.target.closest('[data-tab]');
  if (tab) {
    const id = tab.dataset.tab;
    if (id === 'home') { closeAllWindows(); return; }
    openWindow(id);
    return;
  }

  const win = e.target.closest('.os-window');
  if (win) focusWindow(win.dataset.windowId);
});

window.addEventListener('resize', () => closeAllWindows());
