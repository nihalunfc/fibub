// 12.1 The six knobs of ΛCDM and what each one controls. Left: the six fitted numbers (Planck 2018 values,
// Planck Collaboration 2020, A&A 641, A6, Table 2). Right: things we measure. Lines show which measurements each
// knob mainly sets; the readout says which way each one moves when the knob is turned up (standard results, e.g.
// Hu & Dodelson 2002). Qualitative by design: the 5.10 universe builder does the quantitative version.
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';

const OBS = [
  'CMB peak positions', 'Odd vs even peaks', 'Peak heights', 'Deuterium, helium',
  'BAO ruler in galaxies', 'Polarisation, big angles', 'Ripple strength', 'Clumpiness today (σ₈)',
  'Big vs small ripples', 'H₀ and the age',
];
const K = [
  { k: 'b', short: 'atoms', sym: 'Ωbh²', val: '0.0224', what: 'the density of ordinary matter (atoms)', obs: [1, 3, 4],
    up: 'odd peaks grow compared with even ones (heavier "balls" on the springs); less deuterium is left over from the first minutes; the sound horizon shrinks a little (sound is slower in a heavier fluid).',
    les: [['6.6', 'big-bang-nucleosynthesis'], ['7.5', 'acoustic-peaks']] },
  { k: 'c', short: 'dark matter', sym: 'Ωch²', val: '0.120', what: 'the density of cold dark matter', obs: [2, 4, 7, 9],
    up: 'the first peaks get lower (deeper, steadier wells give less extra push); matter takes over from radiation earlier; lumps grow faster, so σ₈ rises; with the peak angle fixed, the inferred H₀ falls.',
    les: [['8.4', 'dark-matter-cmb'], ['6.8', 'matter-radiation-equality']] },
  { k: 't', short: 'θ*', sym: '100θ*', val: '1.0411', what: 'the angle the sound horizon covers on the sky (0.5965°)', obs: [0, 9],
    up: 'all the peaks slide to larger angles (smaller ℓ); with the densities fixed, that means we are closer to the CMB, so H₀ comes out higher and the universe younger.',
    les: [['7.5', 'acoustic-peaks'], ['7.8', 'universe-recipe']] },
  { k: 'r', short: 'τ', sym: 'τ', val: '0.054', what: 'the chance a CMB photon was scattered again after the first stars ionised the gas', obs: [5, 6],
    up: 'the bump in polarisation on the largest angles grows; the small-angle ripples are dimmed by e^(−2τ); reionisation happened earlier.',
    les: [['7.7', 'cmb-polarisation'], ['10.5', 'first-stars-reionisation']] },
  { k: 'a', short: 'Aₛ', sym: 'Aₛ', val: '2.1 × 10⁻⁹', what: 'the strength of the first ripples, from inflation', obs: [6, 7],
    up: 'every ripple in the CMB is stronger; galaxies and clusters grow sooner; σ₈ rises (it goes as √Aₛ); CMB lensing is stronger.',
    les: [['11.3', 'quantum-seeds'], ['10.1', 'seeds-of-structure']] },
  { k: 'n', short: 'nₛ', sym: 'nₛ', val: '0.965', what: 'the tilt: how the ripple strength changes from big scales to small', obs: [8, 7],
    up: 'small ripples get stronger compared with big ones (nₛ = 1 would be equal on every scale); the damping tail rises; σ₈ rises a little.',
    les: [['11.2', 'cosmic-inflation'], ['7.8', 'universe-recipe']] },
];

export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 470, min: 400, label: 'The six numbers of the standard model of cosmology and the measurements each one controls' });
  let sel = 0, boxes = [];
  const ctl = row(host);
  const ch = choice(ctl, 'Knob', K.map((k, i) => [i, k.short]), 0, (i) => { sel = i; upd(); });
  const out = readout(host);
  cv.c.addEventListener('click', (e) => {
    const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    const hit = boxes.findIndex(([x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1);
    if (hit >= 0) { sel = hit; ctl.querySelectorAll('button').forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === sel))); upd(); }
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Six knobs, and what each one sets', col) + 6;
    const bot = h - 40;
    const lw = Math.min(150, w * 0.33), rx = Math.max(lw + 40, w * 0.46);
    const ry = (j) => top + 12 + (j * (bot - top - 24)) / (OBS.length - 1);
    const ky = (i) => top + 24 + (i * (bot - top - 48)) / (K.length - 1);
    const on = new Set(K[sel].obs);
    // links: faint for other knobs, strong for the chosen one
    K.forEach((k, i) => k.obs.forEach((j) => { if (i !== sel) line(ctx, [[10 + lw, ky(i)], [rx - 6, ry(j)]], col.line, 1); }));
    K[sel].obs.forEach((j) => line(ctx, [[10 + lw, ky(sel)], [rx - 6, ry(j)]], col.s[0], 2.5));
    boxes = [];
    K.forEach((k, i) => {
      const y = ky(i), hh = 30, s = i === sel;
      ctx.fillStyle = s ? col.s[0] : col.soft; ctx.strokeStyle = s ? col.s[0] : col.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(10, y - hh / 2, lw, hh, 6) : ctx.rect(10, y - hh / 2, lw, hh); ctx.fill(); ctx.stroke();
      text(ctx, `${k.sym} = ${k.val}`, 18, y - 6, { color: s ? col.panel : col.ink, size: 11.5, weight: 700, fit: false });
      text(ctx, k.short === 'θ*' ? 'sound angle' : k.short === 'τ' ? 'reionisation' : k.short === 'Aₛ' ? 'ripple strength' : k.short === 'nₛ' ? 'ripple tilt' : k.short, 18, y + 7, { color: s ? col.panel : col.muted, size: 10.5, fit: false });
      boxes.push([10, y - hh / 2, 10 + lw, y + hh / 2]);
    });
    OBS.forEach((o, j) => {
      const y = ry(j), s = on.has(j);
      ctx.beginPath(); ctx.arc(rx - 2, y, 3.5, 0, Math.PI * 2); ctx.fillStyle = s ? col.s[0] : col.line; ctx.fill();
      text(ctx, o, rx + 6, y, { color: s ? col.ink : col.muted, size: 11.5, weight: s ? 700 : 400 });
    });
    const fx = 'Fixed by assumption: flat space, w = −1,', fy = '3 light neutrinos, no primordial gravitational waves';
    if (w < 560) { text(ctx, fx, w / 2, h - 24, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, fy, w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' }); }
    else text(ctx, fx + ' ' + fy, w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  const upd = () => {
    const k = K[sel];
    out.innerHTML = `<b>${k.sym} = ${k.val}</b>: ${k.what}.<br><b>Turn it up and</b> ${k.up}<br>Learn more: ${k.les.map(([n, s]) => `<a href="/learn/courses/cosmology/${s}/">Lesson ${n}</a>`).join(', ')}. To turn the knobs yourself, use the <a href="/learn/courses/cosmology/build-a-universe/">universe builder (5.10)</a>.`;
    cv.redraw();
  };
  void ch;
  upd();
}
