// ---------------------------------------------------------------
// Sourcefield: generative poster maker (v3, fully manual control)
// Generation only decides shape placement and, if Procedural color
// mode is on, the base hue. Every other value on screen is a direct
// override you set yourself. 100% client-side canvas.
// ---------------------------------------------------------------

const CURATED_PALETTES = {
  neon:   { bg: '#0b0014', colors: ['#ff2ec4', '#22d3ee', '#a78bfa', '#ffffff'] },
  sunset: { bg: '#1a0b2e', colors: ['#ff6b6b', '#ffa63d', '#ff2ec4', '#f4d35e'] },
  mono:   { bg: '#05070a', colors: ['#e6f7ff', '#7dd3fc', '#38bdf8', '#0ea5e9'] },
  acid:   { bg: '#0a1505', colors: ['#d4f857', '#7cff6b', '#22d3ee', '#ffffff'] },
  ember:  { bg: '#12060a', colors: ['#ff4d4d', '#ff9f4d', '#ffd166', '#ff2ec4'] },
};

// Deterministic PRNG (mulberry32), so a seed always reproduces the same output.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Procedural color harmony -------------------------------------------------

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function generateProceduralPalette(rand) {
  const baseHue = rand() * 360;
  const scheme = Math.floor(rand() * 4);
  let hues;
  if (scheme === 0) hues = [baseHue, baseHue + 180, baseHue + 30, baseHue - 30];
  else if (scheme === 1) hues = [baseHue, baseHue + 25, baseHue + 50, baseHue - 25];
  else if (scheme === 2) hues = [baseHue, baseHue + 120, baseHue + 240, baseHue + 60];
  else hues = [baseHue, baseHue + 150, baseHue + 210, baseHue + 30];

  const colors = hues.map(h => hslToHex(h, 70 + rand() * 25, 55 + rand() * 15));
  const bg = hslToHex(baseHue, 45 + rand() * 20, 5 + rand() * 4);
  return { bg, colors };
}

// --- Value noise (for the flow field), seeded and deterministic ---------------

function makeNoise(rand) {
  const gridSize = 64;
  const grid = new Float32Array(gridSize * gridSize);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();
  function smooth(t) { return t * t * (3 - 2 * t); }
  return function noise2D(x, y) {
    const gx = ((x % gridSize) + gridSize) % gridSize;
    const gy = ((y % gridSize) + gridSize) % gridSize;
    const x0 = Math.floor(gx), y0 = Math.floor(gy);
    const x1 = (x0 + 1) % gridSize, y1 = (y0 + 1) % gridSize;
    const sx = smooth(gx - x0), sy = smooth(gy - y0);
    const v00 = grid[y0 * gridSize + x0];
    const v10 = grid[y0 * gridSize + x1];
    const v01 = grid[y1 * gridSize + x0];
    const v11 = grid[y1 * gridSize + x1];
    const top = v00 + (v10 - v00) * sx;
    const bottom = v01 + (v11 - v01) * sx;
    return top + (bottom - top) * sy;
  };
}

const canvas = document.getElementById('poster-canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// Offscreen layers, composited with independent blur amounts.
const bgLayer = document.createElement('canvas');
bgLayer.width = W; bgLayer.height = H;
const bgCtx = bgLayer.getContext('2d');

const fgLayer = document.createElement('canvas');
fgLayer.width = W; fgLayer.height = H;
const fgCtx = fgLayer.getContext('2d');

// --- Control refs -------------------------------------------------

const el = id => document.getElementById(id);
const ctrlTitle = el('ctrl-title');
const ctrlSubtitle = el('ctrl-subtitle');
const ctrlStyle = el('ctrl-style');
const ctrlDensity = el('ctrl-density');
const ctrlScale = el('ctrl-scale');
const ctrlLinewidth = el('ctrl-linewidth');
const ctrlRotation = el('ctrl-rotation');
const ctrlOpacity = el('ctrl-opacity');
const ctrlPalette = el('ctrl-palette');
const customColorBlock = el('custom-color-block');
const ctrlColorBg = el('ctrl-color-bg');
const ctrlColor1 = el('ctrl-color-1');
const ctrlColor2 = el('ctrl-color-2');
const ctrlColor3 = el('ctrl-color-3');
const ctrlColor4 = el('ctrl-color-4');
const ctrlBgBlur = el('ctrl-bgblur');
const ctrlFgBlur = el('ctrl-fgblur');
const ctrlGrain = el('ctrl-grain');
const ctrlVignette = el('ctrl-vignette');
const seedDisplay = el('seed-display');
const generateBtn = el('generate-btn');
const downloadBtn = el('download-btn');

let currentSeed = Math.floor(Math.random() * 1e9);
let posterCount = 1;

function triggerOutputPanelAnimation() {
  const panel = document.querySelector('.canvas-panel');
  if (!panel || window.innerWidth > 880) return;
  panel.classList.remove('mobile-output-enter');
  void panel.offsetWidth;
  panel.classList.add('mobile-output-enter');
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// --- Live value labels -------------------------------------------------

function bindLiveLabel(input, labelId, formatter) {
  const label = el(labelId);
  const update = () => { label.textContent = formatter(input.value); };
  input.addEventListener('input', update);
  update();
}
bindLiveLabel(ctrlDensity, 'val-density', v => v);
bindLiveLabel(ctrlScale, 'val-scale', v => `${v}%`);
bindLiveLabel(ctrlLinewidth, 'val-linewidth', v => `${v}%`);
bindLiveLabel(ctrlRotation, 'val-rotation', v => `${v}\u00B0`);
bindLiveLabel(ctrlOpacity, 'val-opacity', v => `${v}%`);
bindLiveLabel(ctrlBgBlur, 'val-bgblur', v => `${v}px`);
bindLiveLabel(ctrlFgBlur, 'val-fgblur', v => `${v}px`);
bindLiveLabel(ctrlGrain, 'val-grain', v => `${v}%`);
bindLiveLabel(ctrlVignette, 'val-vignette', v => `${v}%`);

ctrlPalette.addEventListener('change', () => {
  customColorBlock.style.display = ctrlPalette.value === 'custom' ? 'flex' : 'none';
});

// --- Background wash -------------------------------------------------

function drawBackgroundWash(bgCtx, rand, palette) {
  bgCtx.clearRect(0, 0, W, H);
  bgCtx.fillStyle = palette.bg;
  bgCtx.fillRect(0, 0, W, H);

  bgCtx.globalCompositeOperation = 'screen';
  const washCount = 3 + Math.floor(rand() * 2);
  for (let i = 0; i < washCount; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 300 + rand() * 400;
    const color = palette.colors[Math.floor(rand() * palette.colors.length)];
    const g = bgCtx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hexToRgba(color, 0.18));
    g.addColorStop(1, hexToRgba(color, 0));
    bgCtx.fillStyle = g;
    bgCtx.fillRect(0, 0, W, H);
  }
  bgCtx.globalCompositeOperation = 'source-over';
}

// --- Style generators, each draws onto fgCtx using the shared opts ------------

function drawFlowField(c, rand, palette, opts) {
  const noise = makeNoise(rand);
  const lineCount = Math.floor(90 * opts.density);
  const steps = 140;
  const noiseScale = 0.055;

  c.globalCompositeOperation = 'lighten';
  for (let i = 0; i < lineCount; i++) {
    let x = rand() * W;
    let y = rand() * H;
    const color = palette.colors[Math.floor(rand() * palette.colors.length)];
    c.strokeStyle = hexToRgba(color, (0.5 + rand() * 0.3) * opts.opacity);
    c.lineWidth = (1 + rand() * 2.5) * opts.lineWidth;
    c.beginPath();
    c.moveTo(x, y);
    for (let s = 0; s < steps; s++) {
      const angle = noise(x * noiseScale, y * noiseScale) * Math.PI * 4;
      x += Math.cos(angle) * 4;
      y += Math.sin(angle) * 4;
      if (x < 0 || x > W || y < 0 || y > H) break;
      c.lineTo(x, y);
    }
    c.stroke();
  }
  c.globalCompositeOperation = 'source-over';
}

function drawFractalCircles(c, rand, palette, opts) {
  const maxDepth = opts.density >= 1.5 ? 5 : opts.density >= 0.8 ? 4 : 3;

  function subdivide(x, y, r, depth) {
    if (depth <= 0 || r < 14) {
      const color = palette.colors[Math.floor(rand() * palette.colors.length)];
      c.fillStyle = hexToRgba(color, (0.55 + rand() * 0.35) * opts.opacity);
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
      if (rand() < 0.4) {
        c.strokeStyle = hexToRgba(palette.colors[Math.floor(rand() * palette.colors.length)], 0.6 * opts.opacity);
        c.lineWidth = 1.5 * opts.lineWidth;
        c.stroke();
      }
      return;
    }
    const childCount = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < childCount; i++) {
      const angle = (i / childCount) * Math.PI * 2 + rand() * 0.6;
      const dist = r * (0.45 + rand() * 0.25);
      const childR = r * (0.35 + rand() * 0.2);
      subdivide(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, childR, depth - 1);
    }
  }

  const clusters = Math.max(1, Math.floor((2 + Math.floor(rand() * 2)) * opts.density));
  for (let i = 0; i < clusters; i++) {
    subdivide(W * (0.15 + rand() * 0.7), H * (0.15 + rand() * 0.6), (90 + rand() * 90) * opts.scale, maxDepth);
  }
}

function drawBlobs(c, rand, palette, opts) {
  const count = Math.max(1, Math.floor((5 + rand() * 4) * opts.density));
  c.globalCompositeOperation = 'lighten';
  for (let i = 0; i < count; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const radius = (120 + rand() * 260) * opts.scale;
    const color = palette.colors[Math.floor(rand() * palette.colors.length)];
    const gradient = c.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, hexToRgba(color, 0.65 * opts.opacity));
    gradient.addColorStop(1, hexToRgba(color, 0));
    c.fillStyle = gradient;
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2);
    c.fill();
  }
  c.globalCompositeOperation = 'source-over';
}

function drawGrid(c, rand, palette, opts) {
  const cellSize = Math.max(12, 34 / Math.max(0.3, opts.density));
  for (let y = cellSize / 2; y < H; y += cellSize) {
    for (let x = cellSize / 2; x < W; x += cellSize) {
      if (rand() < 0.35) continue;
      const color = palette.colors[Math.floor(rand() * palette.colors.length)];
      const maxR = cellSize * 0.38 * opts.scale;
      const r = maxR * (0.3 + rand() * 0.7);
      c.fillStyle = hexToRgba(color, 0.85 * opts.opacity);
      c.beginPath();
      c.arc(x + (rand() - 0.5) * 6, y + (rand() - 0.5) * 6, r, 0, Math.PI * 2);
      c.fill();
    }
  }
}

function drawStripes(c, rand, palette, opts) {
  const density = Math.max(0.3, opts.density);
  let x = -W * 0.4;
  while (x < W * 1.4) {
    const width = (20 + rand() * 90) / density;
    if (rand() < 0.6) {
      const color = palette.colors[Math.floor(rand() * palette.colors.length)];
      c.fillStyle = hexToRgba(color, (0.5 + rand() * 0.4) * opts.opacity);
      c.fillRect(x, -H * 0.4, width, H * 1.8);
    }
    x += width;
  }
}

function drawRings(c, rand, palette, opts) {
  const clusterCount = opts.density >= 1.5 ? 3 : opts.density >= 0.8 ? 2 : 1;
  for (let cl = 0; cl < clusterCount; cl++) {
    const cx = W * (0.2 + rand() * 0.6);
    const cy = H * (0.2 + rand() * 0.5);
    const ringCount = 6 + Math.floor(rand() * 6);
    let radius = (30 + rand() * 40) * opts.scale;
    for (let i = 0; i < ringCount; i++) {
      const color = palette.colors[Math.floor(rand() * palette.colors.length)];
      c.strokeStyle = hexToRgba(color, 0.5 * opts.opacity);
      c.lineWidth = (3 + rand() * 12) * opts.lineWidth;
      c.beginPath();
      c.arc(cx, cy, radius, 0, Math.PI * 2);
      c.stroke();
      radius += (26 + rand() * 50) * opts.scale;
    }
  }
}

const STYLE_FNS = {
  flowfield: drawFlowField,
  fractal: drawFractalCircles,
  blobs: drawBlobs,
  grid: drawGrid,
  stripes: drawStripes,
  rings: drawRings,
};

// --- Post-processing -------------------------------------------------

function drawGrain(targetCtx, rand, intensityAlpha) {
  if (intensityAlpha <= 0) return;
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = W; grainCanvas.height = H;
  const gctx = grainCanvas.getContext('2d');
  const imageData = gctx.createImageData(W, H);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = rand() * 255;
    imageData.data[i] = v; imageData.data[i + 1] = v; imageData.data[i + 2] = v;
    imageData.data[i + 3] = intensityAlpha;
  }
  gctx.putImageData(imageData, 0, 0);
  targetCtx.globalCompositeOperation = 'overlay';
  targetCtx.drawImage(grainCanvas, 0, 0);
  targetCtx.globalCompositeOperation = 'source-over';
}

function drawVignette(targetCtx, intensity) {
  if (intensity <= 0) return;
  const g = targetCtx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(0,0,0,${intensity})`);
  targetCtx.fillStyle = g;
  targetCtx.fillRect(0, 0, W, H);
}

// --- Text overlay -------------------------------------------------

function drawText(targetCtx, palette, title, subtitle) {
  const margin = 60;
  const scrim = targetCtx.createLinearGradient(0, H - 320, 0, H);
  scrim.addColorStop(0, 'rgba(0,0,0,0)');
  scrim.addColorStop(1, 'rgba(0,0,0,0.6)');
  targetCtx.fillStyle = scrim;
  targetCtx.fillRect(0, H - 320, W, 320);

  targetCtx.fillStyle = palette.colors[0];
  targetCtx.fillRect(margin, H - 210, 70, 6);

  targetCtx.fillStyle = '#ffffff';
  targetCtx.font = '700 64px "Space Grotesk", sans-serif';
  targetCtx.textBaseline = 'alphabetic';
  wrapText(targetCtx, title.toUpperCase(), margin, H - 140, W - margin * 2, 66);

  targetCtx.fillStyle = 'rgba(255,255,255,0.75)';
  targetCtx.font = '400 22px "IBM Plex Mono", monospace';
  targetCtx.fillText(subtitle, margin, H - 60);
}

function wrapText(c, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (c.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const startY = y - (lines.length - 1) * lineHeight;
  lines.forEach((l, i) => c.fillText(l, x, startY + i * lineHeight));
}

// --- Orchestration -------------------------------------------------

function resolvePalette(rand) {
  if (ctrlPalette.value === 'custom') {
    return {
      bg: ctrlColorBg.value,
      colors: [ctrlColor1.value, ctrlColor2.value, ctrlColor3.value, ctrlColor4.value],
    };
  }
  if (ctrlPalette.value === 'procedural') return generateProceduralPalette(rand);
  return CURATED_PALETTES[ctrlPalette.value];
}

function generate(seed) {
  currentSeed = seed;
  seedDisplay.textContent = String(seed);

  const rand = mulberry32(seed);
  const palette = resolvePalette(rand);
  const styleFn = STYLE_FNS[ctrlStyle.value];

  const opts = {
    density: Math.max(0.02, Number(ctrlDensity.value) / 50),
    scale: Number(ctrlScale.value) / 100,
    lineWidth: Number(ctrlLinewidth.value) / 100,
    opacity: Number(ctrlOpacity.value) / 100,
    rotation: Number(ctrlRotation.value),
  };
  const bgBlur = Number(ctrlBgBlur.value);
  const fgBlur = Number(ctrlFgBlur.value);
  const grainAlpha = Number(ctrlGrain.value) / 100 * 40; // scaled to a sane pixel-alpha range
  const vignetteIntensity = Number(ctrlVignette.value) / 100 * 0.8;

  // Background layer
  drawBackgroundWash(bgCtx, rand, palette);

  // Foreground layer, drawn with optional global rotation around center
  fgCtx.clearRect(0, 0, W, H);
  fgCtx.save();
  fgCtx.translate(W / 2, H / 2);
  fgCtx.rotate((opts.rotation * Math.PI) / 180);
  fgCtx.translate(-W / 2, -H / 2);
  styleFn(fgCtx, rand, palette, opts);
  fgCtx.restore();

  // Composite onto the main canvas with independent blur per layer
  ctx.clearRect(0, 0, W, H);
  ctx.filter = bgBlur > 0 ? `blur(${bgBlur}px)` : 'none';
  ctx.drawImage(bgLayer, 0, 0);
  ctx.filter = 'none';

  ctx.filter = fgBlur > 0 ? `blur(${fgBlur}px)` : 'none';
  ctx.drawImage(fgLayer, 0, 0);
  ctx.filter = 'none';

  drawVignette(ctx, vignetteIntensity);
  drawGrain(ctx, rand, grainAlpha);
  drawText(ctx, palette, ctrlTitle.value || 'UNTITLED', ctrlSubtitle.value || '');
}

// Any control change re-renders using the SAME seed, so tweaking a slider
// never randomizes the composition, only "Randomize" changes the seed.
[
  ctrlTitle, ctrlSubtitle, ctrlStyle, ctrlDensity, ctrlScale, ctrlLinewidth,
  ctrlRotation, ctrlOpacity, ctrlPalette, ctrlColorBg, ctrlColor1, ctrlColor2,
  ctrlColor3, ctrlColor4, ctrlBgBlur, ctrlFgBlur, ctrlGrain, ctrlVignette,
].forEach(input => {
  input.addEventListener('input', () => generate(currentSeed));
  input.addEventListener('change', () => generate(currentSeed));
});

generateBtn.addEventListener('click', () => {
  posterCount += 1;
  if (!ctrlSubtitle.dataset.userEdited) {
    ctrlSubtitle.value = `Generated Composition No. ${String(posterCount).padStart(2, '0')}`;
  }
  generate(Math.floor(Math.random() * 1e9));
  triggerOutputPanelAnimation();
});

ctrlSubtitle.addEventListener('input', () => { ctrlSubtitle.dataset.userEdited = 'true'; });

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `sourcefield-${currentSeed}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Initial render
generate(currentSeed);
triggerOutputPanelAnimation();
window.addEventListener('resize', triggerOutputPanelAnimation);
