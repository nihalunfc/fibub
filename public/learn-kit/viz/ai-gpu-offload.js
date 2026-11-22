// Running a model that does not fit in graphics memory: llama.cpp can put some layers on the GPU and leave the rest on
// the CPU and ordinary RAM. Pick a model size, quantisation and the GPU memory you have. Each box is one layer; blue sits
// on the GPU, orange on the CPU. The curve shows speed against layers on the GPU (every token must read ALL layers, and
// the slow part dominates). Bandwidths are illustrative: GPU 400 GB/s, RAM 50 GB/s.
import { canvas, text, row, slider, choice, readout, title, axes, line, dot } from '../kit.js';

const MODELS = { 3: [26, '3B'], 7: [32, '7B'], 13: [40, '13B'], 32: [64, '32B'], 70: [80, '70B'] };
const BITS = { 4: 4.5, 8: 8.5, 16: 16 };
const BG = 400, BC = 50, RAM = 32, RESERVE = 1.5;
export default function (host) {
  let m = 13, q = 4, vram = 8;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Model layers split between GPU and CPU with the resulting speed' });
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Model', Object.entries(MODELS).map(([k, v]) => [+k, v[1]]), m, (v) => { m = v; show(); });
  choice(ctl, 'Quantisation', [[4, '4-bit'], [8, '8-bit'], [16, '16-bit']], q, (v) => { q = v; show(); });
  slider(ctl2, { label: 'GPU memory', min: 0, max: 48, step: 1, value: 8, fmt: (v) => (v === 0 ? 'none' : v + ' GB'), oninput: (v) => { vram = v; show(); } });
  const out = readout(host);
  const info = () => {
    const L = MODELS[m][0], size = (m * BITS[q]) / 8, per = size / L, g = Math.max(0, Math.min(L, Math.floor((vram - RESERVE) / per)));
    const speed = (gl) => 1 / ((gl * per) / BG + ((L - gl) * per) / BC), cpuGB = (L - g) * per;
    return { L, size, per, g, speed, cpuGB, fits: cpuGB <= RAM - 4 };
  };
  function show() {
    const s = info();
    out.innerHTML = `The ${MODELS[m][1]} model at ${q}-bit is <b>${s.size.toFixed(1)} GB</b> (${s.L} layers, ${(s.per * 1000).toFixed(0)} MB each). ${vram} GB of GPU memory holds <b>${s.g}</b> layers (1.5 GB is kept for the cache). ${s.fits ? `Speed ≈ <b>${s.speed(s.g).toFixed(1)}</b> tokens per second${s.g === s.L ? ' (all on the GPU)' : s.g === 0 ? ' (all on the CPU)' : ''}.` : `<b>${s.cpuGB.toFixed(0)} GB</b> would stay in RAM, more than a 32 GB computer has free. It will not run; pick a smaller model or fewer bits.`}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const s = info(); title(ctx, `${MODELS[m][1]} · ${q}-bit: layers on GPU (blue) or CPU (orange)`, col);
    const cols = Math.ceil(Math.sqrt(s.L * 2.4)), rows = Math.ceil(s.L / cols), cw = Math.min(20, (w - 24) / cols), top = 48;
    for (let i = 0; i < s.L; i++) { const r = Math.floor(i / cols), c = i % cols; ctx.fillStyle = i < s.g ? col.s[0] : col.s[1]; ctx.globalAlpha = s.fits || i < s.g ? 1 : 0.4; ctx.fillRect(12 + c * cw, top + r * (cw * 0.7), cw - 2, cw * 0.7 - 2); } ctx.globalAlpha = 1;
    const y0 = top + rows * cw * 0.7 + 12, hh = h - y0;
    ctx.save(); ctx.translate(0, y0);
    const ax = axes(ctx, w, hh, col, { x: [0, s.L], y: [0, Math.max(10, s.speed(s.L) * 1.1)], xlabel: 'layers on the GPU', ylabel: 'tokens / s', t: 10, b: 34, l: 46, r: 14, fy: (v) => Math.round(v) });
    ax.clip(); const pts = []; for (let g = 0; g <= s.L; g++) pts.push([ax.X(g), ax.Y(s.speed(g))]); line(ctx, pts, col.muted, 2);
    dot(ctx, ax.X(s.g), ax.Y(s.speed(s.g)), 6, s.fits ? col.s[2] : col.bad, col.ink);
    ctx.restore();
  };
  show();
}
