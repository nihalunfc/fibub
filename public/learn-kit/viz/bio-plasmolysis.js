// Osmosis in a plant cell. Slide the strength of the solution outside from pure water (0) to very salty (2 MPa of
// solute potential). Water moves toward the lower water potential: in weak solutions the cell fills (turgid, wall pushes
// back with pressure Ψp); in strong ones it loses water and the membrane pulls away from the wall (plasmolysis).
import { canvas, loop, row, slider, readout, rng, text, title, clamp } from '../kit.js';

const Vmin = 0.55;
// protoplast volume V (1 = fully turgid). Psi_s = -1/V (MPa), Psi_p = (V - 0.9)/0.1 when V > 0.9
const psiS = (V) => -1 / V, psiP = (V) => (V > 0.9 ? (V - 0.9) / 0.1 : 0);
function equilibrium(c) { // outside psi = -c
  const f = (V) => psiS(V) + psiP(V) + c;
  if (f(0.9) >= 0) { return Math.max(Vmin, 1 / c); } // plasmolysed: psiP = 0, -1/V = -c
  let a = 0.9, b = 1; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; f(m) < 0 ? (a = m) : (b = m); } return (a + b) / 2;
}

export default function (host) {
  let c = 0.3, V = equilibrium(0.3), t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 380, min: 300, label: 'A plant cell gaining or losing water depending on the solution around it' });
  const ctl = row(host);
  slider(ctl, { label: 'Outside solution', min: 0, max: 2, step: 0.05, value: c, fmt: (v) => v === 0 ? 'pure water' : `${v.toFixed(2)} MPa solute`, oninput: (v) => { c = v; show(); } });
  loop(host, (dt) => { t += dt; const target = equilibrium(c); V += (target - V) * Math.min(1, dt * 2.2); cv.redraw(); show(); });
  const out = readout(host);
  function show() {
    const ps = psiS(V), pp = psiP(V), win = ps + pp, state = V > 0.99 ? 'fully turgid' : V > 0.9 ? 'turgid (wall stretched)' : V > 0.88 ? 'flaccid (just at incipient plasmolysis)' : 'plasmolysed';
    out.innerHTML = `Cell: Ψs = <b>${ps.toFixed(2)}</b>, Ψp = <b>${pp.toFixed(2)}</b>, so Ψw = Ψs + Ψp = <b>${win.toFixed(2)} MPa</b>. Outside: Ψw = <b>${(-c).toFixed(2)} MPa</b>. Water moves <b>${win < -c - 0.02 ? 'IN (endosmosis)' : win > -c + 0.02 ? 'OUT (exosmosis)' : 'neither way (equilibrium)'}</b>. State: <b>${state}</b>.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Plant cell in a solution', col);
    const cx = w / 2, cy = h * 0.5, W = Math.min(w * 0.33, 105), H = W * 0.78;
    // outside solution tint grows with c
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.05 + 0.2 * c / 2; ctx.fillRect(8, 40, w - 16, h - 72); ctx.globalAlpha = 1;
    const R = rng(5); for (let i = 0; i < 28; i++) { const px = 14 + R() * (w - 28), py = 48 + R() * (h - 100); if (i < Math.round(c * 14)) { ctx.beginPath(); ctx.arc(px, py, 2.5, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); } }
    // wall (fixed size)
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(cx - W - 6, cy - H - 6, 2 * W + 12, 2 * H + 12, 12); ctx.stroke();
    // protoplast scaled by sqrt(V) in each direction, mapped so V = 0.9 just touches the wall
    const s = clamp(Math.sqrt((V - Vmin * 0.5) / (1 - Vmin * 0.5)), 0.5, 1) ;
    const sw = (0.5 + 0.5 * (V - 0.55) / 0.45), pw = W * (0.55 + 0.45 * clamp((V - 0.55) / 0.35, 0, 1) ) , ph = H * (0.55 + 0.45 * clamp((V - 0.55) / 0.35, 0, 1));
    ctx.beginPath(); ctx.roundRect(cx - pw, cy - ph, 2 * pw, 2 * ph, 16); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, pw * 0.62, ph * 0.6, 0, 0, 7); ctx.fillStyle = col.panel; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'vacuole', cx, cy, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'cell wall', cx - W - 4, cy - H - 16, { color: col.s[2], size: 10.5, weight: 700, fit: false });
    text(ctx, 'membrane', cx + 4, cy - ph + 12, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    if (V < 0.89) text(ctx, 'gap (outside solution fills it)', cx, cy + ph + 14, { color: col.bad, size: 10.5, weight: 700, align: 'center' });
    // water arrows
    const win = psiS(V) + psiP(V), dir = win < -c - 0.02 ? 1 : win > -c + 0.02 ? -1 : 0;
    if (dir) for (let i = 0; i < 4; i++) { const f = (t * 0.7 + i / 4) % 1, y = cy - H + (i + 0.5) * H / 2, x = dir > 0 ? cx - W - 40 + f * 50 : cx - W + 10 - f * 50; ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill(); }
    text(ctx, dir > 0 ? 'water in' : dir < 0 ? 'water out' : 'no net movement', cx - W - 4, cy + H + 24, { color: col.s[4], size: 11, weight: 700, align: 'left' });
    // turgor bar
    const bx = w - 26, bh = h - 100; ctx.strokeStyle = col.line; ctx.strokeRect(bx, 50, 12, bh); ctx.fillStyle = col.s[2]; const pf = psiP(V); ctx.fillRect(bx, 50 + bh * (1 - pf), 12, bh * pf);
    text(ctx, 'Ψp', bx + 6, 42, { color: col.s[2], size: 10, weight: 700, align: 'center', fit: false });
  };
  show();
}
