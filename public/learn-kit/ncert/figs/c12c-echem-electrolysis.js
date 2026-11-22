// Class 12 Chemistry, Electrochemistry: Faraday's laws of electrolysis. The charge passed is Q = I t. One mole of electrons carries F = 96485 C.
// A metal ion M^(n+) needs n electrons: mass deposited m = (Q / (n F)) x M = (I t M) / (n F). More current or more time: proportionally more metal; a higher charge on the ion: less metal for the same charge.
// Cathode (-): M^(n+) + n e- -> M. Press play: electrons run in the wire, ions drift to the electrodes and the metal grows on the cathode.
import { canvas, text, title, row, slider, choice, readout, loop, button, rng } from '../../kit.js';

const M = { cu: ['Cu²⁺', 2, 63.5, 'copper', 'CuSO₄'], ag: ['Ag⁺', 1, 107.9, 'silver', 'AgNO₃'], al: ['Al³⁺', 3, 27, 'aluminium', 'Al₂O₃ (molten, in cryolite)'] };
export default function (host) {
  let k = 'cu', I = 2, tmin = 20, prog = 0, run = true, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'An electrolysis cell with electrons in the wire, ions moving and metal growing on the cathode' });
  const ctl = row(host), ro = readout(host), R = rng(5);
  choice(ctl, 'metal', [['cu', 'copper'], ['ag', 'silver'], ['al', 'aluminium']], k, (v) => { k = v; go(); });
  slider(ctl, { label: 'current (A)', min: 0.5, max: 10, step: 0.5, value: I, fmt: (v) => v.toFixed(1), oninput: (v) => { I = v; go(); } });
  slider(ctl, { label: 'time (minutes)', min: 5, max: 120, step: 5, value: tmin, fmt: (v) => v.toFixed(0), oninput: (v) => { tmin = v; go(); } });
  const anim = { run: true }; button(ctl, '↺ Replay', () => { prog = 0; });
  const mass = (f = 1) => { const [, n, Mm] = M[k], Q = I * tmin * 60 * f; return { Q, mol: Q / 96485, g: Q * Mm / (n * 96485) }; };
  const go = () => { const r = mass(); ro.textContent = `Q = It = ${I} × ${tmin * 60} = ${r.Q.toFixed(0)} C = ${r.mol.toFixed(4)} mol of electrons. ${M[k][3]} deposited = Q × M / (nF) = ${r.g.toFixed(2)} g  (n = ${M[k][1]} electrons per ion).`; };
  const ions = Array.from({ length: 14 }, () => ({ x: R(), y: R(), s: 0.04 + R() * 0.05 }));
  loop(host, (dt) => { t += dt; prog = Math.min(1, prog + dt / 7); for (const q of ions) { q.x += q.s * dt * (I / 5 + 0.3) * (k === 'cu' || k === 'ag' ? 1 : 1); if (q.x > 1) { q.x = 0; q.y = R(); } } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Electrolysis of ${M[k][4]}`, col) + 6, L = 30, W = w - 60, top = t0 + 70, B = h - 70;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.16; ctx.fillRect(L, top + 20, W, B - top - 20); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, top, W, B - top);
    const ex1 = L + 36, ex2 = L + W - 36;
    ctx.fillStyle = col.muted; ctx.fillRect(ex1 - 5, top - 24, 10, B - top - 10); ctx.fillRect(ex2 - 5, top - 24, 10, B - top - 10);
    const g = mass(prog).g, grow = Math.min(14, 1 + 13 * Math.sqrt(g / 1 / Math.max(1, mass().g)) * (mass().g > 0 ? 1 : 0)) * (prog > 0 ? 1 : 0);
    ctx.fillStyle = col.s[2]; ctx.fillRect(ex2 - 5 - grow * Math.min(1, 0.4 + mass().g / 40), top - 6, grow * Math.min(1, 0.4 + mass().g / 40), B - top - 28);
    text(ctx, '+ anode', ex1, B + 12, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, '− cathode', ex2, B + 12, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    text(ctx, `${M[k][3]} grows here`, ex2 - 14, B - 22, { color: col.s[2], size: 10.5, weight: 700, align: 'right' });
    // wire with battery and electrons
    const wy = top - 24, wire = [[ex1, wy], [ex1, wy - 18], [ex2, wy - 18], [ex2, wy]]; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); wire.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    ctx.fillStyle = col.panel; ctx.fillRect(w / 2 - 14, wy - 28, 28, 20); ctx.strokeRect(w / 2 - 14, wy - 28, 28, 20); text(ctx, '⎓', w / 2, wy - 18, { color: col.ink, size: 14, align: 'center' });
    for (let i = 0; i < 6; i++) { const u = ((t * (0.2 + I / 12) + i / 6) % 1) * (ex2 - ex1), px = ex1 + u; ctx.beginPath(); ctx.arc(px, wy - 18, 3.5, 0, 7); ctx.fillStyle = col.s[4]; ctx.fill(); }
    text(ctx, 'e⁻ → cathode', w / 2, wy - 38, { color: col.s[4], size: 10.5, align: 'center' });
    // ions drifting to the cathode
    ions.forEach((q) => { const x = ex1 + 10 + q.x * (ex2 - ex1 - 20), y = top + 30 + q.y * (B - top - 60); ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); });
    text(ctx, `${M[k][0]} ions drift to the cathode`, w / 2, top + 14, { color: col.s[2], size: 10.5, align: 'center' });
    const r = mass(prog); text(ctx, `Charge so far ${(r.Q).toFixed(0)} C  →  ${r.g.toFixed(2)} g`, w / 2, h - 20, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
  };
  go();
}
