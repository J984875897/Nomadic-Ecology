// ============================================================
//  Nomadic Ecology — main.js
//  Navigation logic, section switching, keyboard support
// ============================================================

let current = 0;
const TOTAL = 9;
const chartsReady = {};

// ---- Navigate to a section ----
function goTo(index) {
  if (index < 0 || index >= TOTAL) return;

  // Hide current section
  const prev = document.querySelector('.section.active');
  if (prev) prev.classList.remove('active');

  // Show target section
  const next = document.getElementById('sec-' + index);
  if (next) {
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.sec) === index);
  });

  current = index;

  // Lazy-init charts when entering section 1
  if (index === 1 && !chartsReady[1]) {
    chartsReady[1] = true;
    // Small delay so the section animation has started
    setTimeout(initSection1Charts, 120);
  }
}

// ---- Scale sub-tabs (section 5, Tab 2) ----
function switchScaleTab(key) {
  document.querySelectorAll('.scale-stab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scale === key);
  });
  document.querySelectorAll('.scale-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.scale === key);
  });
}

// ---- Tab switching (for sections with tabs) ----
function switchTab(secIndex, tabKey) {
  const section = document.getElementById('sec-' + secIndex);
  if (!section) return;

  // Deactivate all tab buttons in this section
  section.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  // Deactivate all tab contents in this section
  section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  // Activate the matching button
  const btn = document.getElementById('tab' + secIndex + '-' + tabKey);
  if (btn) btn.classList.add('active');

  // Activate the matching content pane
  const pane = document.getElementById('sec' + secIndex + '-' + tabKey);
  if (pane) pane.classList.add('active');

  // Lazy-init Sankey when section 5 / flow tab is first shown
  if (secIndex === 5 && tabKey === 'flow' && typeof initSankey === 'function') {
    setTimeout(initSankey, 80);
  }
}

// ---- Keyboard navigation ----
document.addEventListener('keydown', function (e) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      goTo(Math.min(current + 1, TOTAL - 1));
      break;
    case 'ArrowUp':
      e.preventDefault();
      goTo(Math.max(current - 1, 0));
      break;
    case 'ArrowRight':
    case 'ArrowLeft': {
      e.preventDefault();
      const section = document.getElementById('sec-' + current);
      if (!section) break;
      const tabs = Array.from(section.querySelectorAll('.tab-btn'));
      if (tabs.length === 0) break;
      const activeIdx = tabs.findIndex(btn => btn.classList.contains('active'));
      const delta = e.key === 'ArrowRight' ? 1 : -1;
      const nextIdx = Math.min(Math.max(activeIdx + delta, 0), tabs.length - 1);
      if (nextIdx !== activeIdx) tabs[nextIdx].click();
      break;
    }
  }
});

// ---- Init ----
goTo(0);

// ---- QR Code (sec-0 cover) ----
QRCode.toCanvas(document.getElementById('qr-canvas'), window.location.href, {
  width: 96, margin: 1,
  color: { dark: '#1A1A2E', light: '#FFFFFF' }
});
