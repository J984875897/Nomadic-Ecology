// ============================================================
//  section3.js — β/γ fold angle interactive SVG
// ============================================================

// sliderVal: 0 = fully folded (β=90°, γ=0°)
//            50 = fully deployed (β=40°, γ=100°)
// beta = 90 - sliderVal  →  always: 2β + γ = 180°
function updateFoldSVG(sliderVal) {
  const beta    = 90 - sliderVal;          // 0→90°, 50→40°
  const betaRad = beta * Math.PI / 180;
  const gamma   = 180 - 2 * beta;          // 0→0°, 50→100°

  const cx        = 240;
  const baseY     = 108;
  const L         = 70;                    // fixed arm length (SVG px)
  const frameW    = 20;
  const frameTopY = 32;

  // Geometry: base corners MOVE, apex MOVES — arm length stays constant
  const rise    = L * Math.sin(betaRad);   // β=90°→70,  β=40°→45.0
  const halfGap = L * Math.cos(betaRad);   // β=90°→0,   β=40°→53.6

  const apexY = baseY - rise;              // β=90°→38,  β=40°→63
  const botY  = baseY + rise;              // β=90°→178, β=40°→153
  const lx    = cx - halfGap;             // left  base corner
  const rx    = cx + halfGap;             // right base corner
  const lox   = lx - frameW;
  const rox   = rx + frameW;
  const frameH = botY - frameTopY;

  const set = (id, attrs) => {
    const el = document.getElementById(id);
    if (!el) return;
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  };
  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  // ---- Frames ----
  set('svg-frame-l', { x: lox, y: frameTopY, height: frameH });
  set('svg-frame-r', { x: rx,  y: frameTopY, height: frameH });

  // ---- Baseline ----
  set('svg-baseline', { x1: lox - 14, y1: baseY, x2: rox + 14, y2: baseY });

  // ---- Central drive column ----
  set('svg-column', { x1: cx, y1: apexY, x2: cx, y2: botY });

  // ---- Arms ----
  set('svg-arm-l',     { x1: lx, y1: baseY, x2: cx, y2: apexY });
  set('svg-arm-r',     { x1: rx, y1: baseY, x2: cx, y2: apexY });
  set('svg-arm-l-bot', { x1: lx, y1: baseY, x2: cx, y2: botY });
  set('svg-arm-r-bot', { x1: rx, y1: baseY, x2: cx, y2: botY });

  // ---- Dots ----
  set('svg-apex-dot',   { cx: cx, cy: apexY });
  set('svg-base-dot-l', { cx: lx, cy: baseY });
  set('svg-base-dot-r', { cx: rx, cy: baseY });

  // ---- γ arc at apex (degenerate when β≈90°) ----
  const arcRg = 14;
  if (halfGap < arcRg) {
    set('svg-gamma-arc', { d: `M${cx},${apexY} L${cx},${apexY}` });
  } else {
    const angToL = Math.atan2(baseY - apexY, lx - cx);
    const angToR = Math.atan2(baseY - apexY, rx - cx);
    const gx1 = cx + arcRg * Math.cos(angToL);
    const gy1 = apexY + arcRg * Math.sin(angToL);
    const gx2 = cx + arcRg * Math.cos(angToR);
    const gy2 = apexY + arcRg * Math.sin(angToR);
    set('svg-gamma-arc', {
      d: `M${gx1.toFixed(1)},${gy1.toFixed(1)} A${arcRg},${arcRg} 0 0,1 ${gx2.toFixed(1)},${gy2.toFixed(1)}`
    });
  }

  // ---- β arcs at base corners (hide when gap too small) ----
  const arcRb = 16;
  if (halfGap < arcRb) {
    set('svg-beta-arc-l', { d: `M${cx},${baseY} L${cx},${baseY}` });
    set('svg-beta-arc-r', { d: `M${cx},${baseY} L${cx},${baseY}` });
  } else {
    const armAngL = Math.atan2(apexY - baseY, cx - lx);
    const armAngR = Math.atan2(apexY - baseY, cx - rx);

    // Left β: from horizontal-right, sweep CW → curves up to arm direction
    const bx1L = lx + arcRb, by1L = baseY;
    const bx2L = lx + arcRb * Math.cos(armAngL);
    const by2L = baseY + arcRb * Math.sin(armAngL);
    set('svg-beta-arc-l', {
      d: `M${bx1L.toFixed(1)},${by1L.toFixed(1)} A${arcRb},${arcRb} 0 0,1 ${bx2L.toFixed(1)},${by2L.toFixed(1)}`
    });

    // Right β: from horizontal-left, sweep CCW → curves up to arm direction
    const bx1R = rx - arcRb, by1R = baseY;
    const bx2R = rx + arcRb * Math.cos(armAngR);
    const by2R = baseY + arcRb * Math.sin(armAngR);
    set('svg-beta-arc-r', {
      d: `M${bx1R.toFixed(1)},${by1R.toFixed(1)} A${arcRb},${arcRb} 0 0,0 ${bx2R.toFixed(1)},${by2R.toFixed(1)}`
    });
  }

  // ---- β labels (hide when corners too close) ----
  const showLabels = halfGap >= arcRb;
  const labelOffset = Math.max(6, rise * 0.25);
  set('svg-beta-l', { x: lx + 22, y: baseY - labelOffset - 8, opacity: showLabels ? 1 : 0 });
  set('svg-beta-r', { x: rx - 30, y: baseY - labelOffset - 8, opacity: showLabels ? 1 : 0 });

  // ---- γ label at apex ----
  set('svg-gamma-label', { x: cx, y: apexY - 7 });

  // ---- H span dimension line ----
  set('svg-h-line',  { x1: lox, y1: 20, x2: rox, y2: 20 });
  set('svg-tick-l',  { x1: lox, y1: 14, x2: lox, y2: 26 });
  set('svg-tick-r',  { x1: rox, y1: 14, x2: rox, y2: 26 });
  set('svg-h-label', { x: cx });
  setText('svg-h-label', 'H');

  // ---- Parameter readout ----
  const t = sliderVal / 50;              // 0 = folded, 1 = deployed
  const lambda = 1 + 2.2 * t;
  setText('param-beta',   beta   + '°');
  setText('param-gamma',  gamma  + '°');
  setText('param-lambda', lambda.toFixed(1) + '×');

  // ---- Slider fill track ----
  const pct = t * 100;
  const slider = document.getElementById('beta-slider');
  if (slider) {
    slider.style.background =
      `linear-gradient(to right, #E85A1A ${pct}%, rgba(62,119,195,0.3) ${pct}%)`;
  }
}

function revealConcept(id) {
  const inner = document.getElementById(id);
  if (inner) inner.classList.toggle('revealed');
}

document.addEventListener('DOMContentLoaded', function () {
  const slider = document.getElementById('beta-slider');
  if (!slider) return;

  updateFoldSVG(parseInt(slider.value, 10));

  slider.addEventListener('input', function () {
    updateFoldSVG(parseInt(this.value, 10));
  });
});
