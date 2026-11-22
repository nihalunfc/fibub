// 4.7 Faraday and Lenz you can watch. A bar magnet moves along the axis of a coil. The graph underneath plots the
// flux through the coil and the induced EMF (−dΦ/dt) as time runs. The coil's arrow shows the induced current, and
// the readout says which pole its near face becomes. Flux model: a small magnet (dipole) on the axis of a loop of
// radius a gives Φ ∝ 1/(1 + z²/a²)^{3/2}.
import { canvas, text, arrow, row, choice, slider, readout, fmt, line, loop } from '../../kit.js';

const ZB = 4; // magnet positions from −4a to +4a
const phi = (z) => Math.pow(1 + z * z, -1.5);
const dphi = (z) => -3 * z * Math.pow(1 + z * z, -2.5);

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 300, label: 'A magnet moving through a coil, with graphs of flux and induced EMF' });
  let mode = 'through', pole = 1, speed = 1.5, t = 0, z = -ZB, v = 0;
  const hist = []; // [t, flux, emf]
  const ctl = row(host);
  choice(ctl, 'Motion', [['through', 'Push through'], ['inout', 'In and out'], ['still', 'Hold still']], mode, (m) => { mode = m; t = 0; hist.length = 0; step(0); });
  choice(ctl, 'Leading pole', [['1', 'N first'], ['-1', 'S first']], '1', (p) => { pole = +p; hist.length = 0; step(0); });
  const ctl2 = row(host);
  slider(ctl2, { label: 'Speed', min: 0.25, max: 3, step: 0.25, value: speed, fmt: (x) => fmt(x, 2) + ' a/s', oninput: (x) => { speed = x; } });
  const anim = loop(host, (dt) => step(dt));
  anim.button(ctl2);
  const out = readout(host);

  function position(tt) {
    if (mode === 'through') { const span = 2 * ZB, d = (speed * tt) % span; return [-ZB + d, speed]; }
    if (mode === 'inout') { const w = speed * 1.2; return [-2.2 + 1.5 * Math.sin(w * tt), 1.5 * w * Math.cos(w * tt)]; }
    return [-1.2, 0];
  }
  function step(dt) {
    t += dt || 0;
    [z, v] = position(t);
    const F = pole * phi(z), E = -pole * dphi(z) * v;
    hist.push([t, F, E]);
    while (hist.length && t - hist[0][0] > 6) hist.shift();
    cv.redraw(); say(E, F);
  }
  function say(E, F) {
    const s = Math.abs(E) < 0.02 ? 0 : Math.sign(E);
    out.innerHTML = `Flux through the coil (to the right) = <b>${fmt(F, 2)}</b> Φ<sub>max</sub>, EMF = <b>${fmt(E, 2)}</b> (units Φ<sub>max</sub>/s). ` + (s === 0
      ? 'The flux is not changing, so there is no EMF and no current, however strong the field.'
      : `Induced current: <b>${s < 0 ? 'anticlockwise' : 'clockwise'}</b> seen from the left, so the coil's left face acts as a <b>${s < 0 ? 'north' : 'south'}</b> pole. It always pushes against the change: ${(z < 0) === (v > 0) ? 'it opposes the approach' : 'it pulls back on the retreat'} (Lenz).`);
  }

  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.46, sx = (zz) => w / 2 + (zz / ZB) * (w / 2 - 20), cy = top * 0.55, a = (w / 2 - 20) / ZB;
    text(ctx, 'magnet and coil', 10, 14, { color: col.muted, size: 11 });
    // axis
    ctx.save(); ctx.strokeStyle = col.line; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(8, cy); ctx.lineTo(w - 8, cy); ctx.stroke(); ctx.restore();
    // coil: a few turns drawn as ellipses at z = 0
    const ch = Math.min(a * 1.0, top * 0.42);
    const E = hist.length ? hist[hist.length - 1][2] : 0;
    for (let k = -2; k <= 2; k++) { ctx.save(); ctx.strokeStyle = Math.abs(E) > 0.02 ? col.s[2] : col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx(0) + k * 4, cy, ch * 0.28, ch, 0, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
    if (Math.abs(E) > 0.02) { // current arrow on the near (front) side of the coil, as seen from the left
      const up = E < 0; // anticlockwise seen from the left = current going up on the front of the coil (towards you)
      const x0 = sx(0) - ch * 0.28 - 10;
      arrow(ctx, x0, up ? cy + ch * 0.5 : cy - ch * 0.5, x0, up ? cy - ch * 0.5 : cy + ch * 0.5, col.s[2], 2.5, 9);
      text(ctx, 'I (front)', x0 - 26, cy, { color: col.s[2], size: 13, weight: 700, align: 'center' });
    }
    // magnet: rectangle 1.2a long, leading end is the right end while moving right
    const L = 1.2 * a, mh = Math.min(0.5 * a, top * 0.3), mx = sx(z);
    const rightIsN = pole > 0;
    ctx.save();
    ctx.fillStyle = rightIsN ? col.s[0] : col.s[3]; ctx.fillRect(mx - L / 2, cy - mh / 2, L / 2, mh);
    ctx.fillStyle = rightIsN ? col.s[3] : col.s[0]; ctx.fillRect(mx, cy - mh / 2, L / 2, mh);
    ctx.restore();
    text(ctx, rightIsN ? 'S' : 'N', mx - 0.25 * L, cy, { color: '#fff', size: 13, weight: 700, align: 'center', fit: false });
    text(ctx, rightIsN ? 'N' : 'S', mx + 0.25 * L, cy, { color: '#fff', size: 13, weight: 700, align: 'center', fit: false });
    // graph: last 6 s of flux and EMF
    const g0 = top + 18, g1 = h - 22, gm = (g0 + g1) / 2, gx0 = 34, gx1 = w - 12;
    ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx0, g0); ctx.lineTo(gx0, g1); ctx.moveTo(gx0, gm); ctx.lineTo(gx1, gm); ctx.stroke(); ctx.restore();
    const tNow = hist.length ? hist[hist.length - 1][0] : 0, Emax = 3 * 0.8587;
    const tx = (tt) => gx1 - ((tNow - tt) / 6) * (gx1 - gx0);
    const yF = (f) => gm - f * (gm - g0) * 0.9, yE = (e) => gm - (e / Emax) * (gm - g0) * 0.9;
    line(ctx, hist.map(([tt, f]) => [tx(tt), yF(f)]), col.s[0], 2);
    line(ctx, hist.map(([tt, , e]) => [tx(tt), yE(e)]), col.s[3], 2);
    text(ctx, 'flux Φ', gx0 + 6, g0 + 8, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'EMF = −dΦ/dt', gx0 + 60, g0 + 8, { color: col.s[3], size: 11, weight: 700 });
    text(ctx, 'time →  (last 6 s)', gx1, h - 8, { color: col.muted, size: 11, align: 'right', base: 'bottom' });
  };
  step(0);
}
