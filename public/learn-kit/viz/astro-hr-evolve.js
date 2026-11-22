// A star's life as a path across the Hertzsprung-Russell diagram (hot to the left, bright up). Pick a mass and step or play
// along its track: main sequence, red giant, helium burning, then the end (white dwarf or supernova). Heavier stars
// start higher and hotter and finish far sooner. The tracks are schematic, in the ranges real models give.
import { canvas, text, row, choice, readout, loop, title, dot, axes, line, button, slider } from '../kit.js';

// [logT, logL, label, age Myr]
const TRACK = {
  m05: ['0.5 M☉', [[3.55, -1.4, 'Main sequence begins', 0], [3.56, -1.1, 'Slow hydrogen burning: far longer than the universe is old', 5e4], [3.6, -0.6, 'Hydrogen runs out after about 100 billion years (so none have yet)', 1e5]], 'Red dwarfs end as helium white dwarfs, but none exist yet.'],
  m1: ['1 M☉', [[3.76, -0.15, 'Zero-age main sequence', 0], [3.75, 0.0, 'Sun today (4.6 billion years)', 4600], [3.73, 0.3, 'Hydrogen core used up (10 billion years)', 10000], [3.66, 0.5, 'Subgiant: core shrinks, shell burns', 11000], [3.58, 1.5, 'Red giant branch', 11800], [3.52, 3.3, 'Tip of the red giant branch: helium flash', 12100], [3.68, 1.7, 'Helium burning in the core (horizontal branch)', 12200], [3.52, 3.6, 'Asymptotic giant branch', 12300], [4.9, 3.3, 'Planetary nebula: the shell is blown off', 12310], [4.6, -1.0, 'White dwarf, cooling for ever', 12400]], 'The core left behind is a white dwarf of about 0.55 M☉.'],
  m5: ['5 M☉', [[4.2, 2.9, 'Zero-age main sequence', 0], [4.1, 3.3, 'Main sequence ends (about 100 million years)', 90], [3.85, 3.4, 'Rapid crossing of the gap', 95], [3.6, 3.5, 'Red giant', 98], [3.78, 3.5, 'Helium burning (blue loop)', 100], [3.5, 4.0, 'Asymptotic giant branch', 105], [5.0, 3.7, 'Planetary nebula', 106], [4.7, -1.5, 'White dwarf', 110]], 'About a 1 M☉ white dwarf remains.'],
  m20: ['20 M☉', [[4.5, 4.8, 'Zero-age main sequence (O star)', 0], [4.45, 5.1, 'Main sequence ends (about 8 million years)', 8], [3.9, 5.3, 'Rapid crossing', 8.3], [3.55, 5.5, 'Red supergiant', 8.6], [3.7, 5.5, 'Helium burning, then heavier fuels', 9], [3.6, 5.6, 'Iron core collapses: supernova', 10]], 'It leaves a neutron star or black hole.'],
};
export default function (host) {
  let key = 'm1', s = 0;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 310, label: 'Hertzsprung-Russell diagram with the track of a star changing as it ages' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Mass', Object.entries(TRACK).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; s = 0; sl.set(0); show(); });
  const sl = slider(c2, { label: 'Stage', min: 0, max: 1, step: 0.002, value: 0, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { s = v; show(); } });
  const anim = loop(host, (dt) => { s += dt * 0.08; if (s > 1) s = 0; sl.set(s); show(); }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  const where = () => { const T = TRACK[key][1], f = s * (T.length - 1), i = Math.min(T.length - 2, Math.floor(f)), u = f - i; const a = T[i], b = T[i + 1]; return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, name: u < 0.5 ? a[2] : b[2], age: a[3] + (b[3] - a[3]) * u, T }; };
  function show() {
    const p = where(), L = Math.pow(10, p.y), Tk = Math.pow(10, p.x), R = Math.sqrt(L) * Math.pow(5772 / Tk, 2);
    out.innerHTML = `<b>${p.name}.</b> Temperature ${Math.round(Tk / 10) * 10} K, luminosity ${L < 10 ? L.toPrecision(2) : Math.round(L).toLocaleString()} L☉, radius about ${R < 10 ? R.toFixed(1) : Math.round(R)} R☉ (from L = 4πR²σT⁴). ${TRACK[key][2]}`;
    cv.redraw();
  }
  const step = (i, n) => { s = n > 1 ? i / (n - 1) : 0; sl.set(s); show(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `HR diagram: the life of a ${TRACK[key][0]} star`, col);
    const A = axes(ctx, w, h, col, { x: [4.7, 3.45], y: [-2.2, 6], xlabel: 'surface temperature (hotter ←)', ylabel: 'log luminosity (L☉)', t: 40, xt: [4.6, 4.2, 3.8, 3.5], fx: (v) => ({ 4.6: '40,000 K', 4.2: '16,000', 3.8: '6,300', 3.5: '3,200' }[v] || v), yt: [-2, 0, 2, 4, 6], fy: (v) => v });
    // main sequence band
    ctx.save(); A.clip(); ctx.globalAlpha = 0.18; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(A.X(4.55), A.Y(5.2)); ctx.lineTo(A.X(4.0), A.Y(2.0)); ctx.lineTo(A.X(3.76), A.Y(0)); ctx.lineTo(A.X(3.55), A.Y(-1.5)); ctx.stroke(); ctx.globalAlpha = 1; ctx.restore();
    text(ctx, 'main sequence', A.X(4.1), A.Y(2.4), { color: col.s[0], size: 10.5 });
    text(ctx, 'giants', A.X(3.6), A.Y(3.2) - 18, { color: col.muted, size: 10.5 }); text(ctx, 'white dwarfs', A.X(4.45), A.Y(-1.7), { color: col.muted, size: 10.5 });
    const T = TRACK[key][1], p = where();
    line(ctx, T.map((q) => [A.X(q[0]), A.Y(q[1])]), col.muted, 2, [5, 4]);
    // the part already travelled
    const f = s * (T.length - 1), pts = []; for (let i = 0; i < T.length && i <= f; i++) pts.push([A.X(T[i][0]), A.Y(T[i][1])]); pts.push([A.X(p.x), A.Y(p.y)]);
    line(ctx, pts, col.s[1], 3);
    dot(ctx, A.X(p.x), A.Y(p.y), 7, col.s[5], col.panel);
  };
  show();
  return { step };
}
