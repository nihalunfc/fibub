// Assign R or S in three moves: rank the four groups by CIP priority (1 highest), turn the molecule so the lowest (4) points
// away, then read 1 → 2 → 3: clockwise = R, anticlockwise = S. Pick a molecule, drag to turn it, press "H at the back"
// to do the turning for you, and "Swap 1 and 2" to make the mirror image (R becomes S). The call is worked out from the
// 3D positions, not from the picture.
import { canvas, text, row, choice, button, readout, loop, title } from '../kit.js';
import { orbit } from './_3d.js';

const TET = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => v.map((x) => x / Math.sqrt(3)));
const MOL = {
  chfclbr: ['CHFClBr', ['Br', 'Cl', 'F', 'H'], 'Br (Z = 35) > Cl (17) > F (9) > H'],
  lactic: ['Lactic acid', ['OH', 'COOH', 'CH₃', 'H'], 'OH (O) > COOH (O,O,O) > CH₃ (H,H,H) > H'],
  alanine: ['Alanine', ['NH₂', 'COOH', 'CH₃', 'H'], 'NH₂ (N) > COOH (O,O,O) > CH₃ > H'],
  glyceraldehyde: ['Glyceraldehyde', ['OH', 'CHO', 'CH₂OH', 'H'], 'OH > CHO (O,O,H) > CH₂OH (O,H,H) > H'],
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dotp = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export default function (host) {
  let id = 'lactic', swap = false, pos = TET.slice();
  const cv = canvas(host, { aspect: 0.85, max: 430, min: 300, label: 'A chiral carbon with four groups that can be turned in 3D to assign R or S' });
  const cam = orbit(cv, { yaw: 0.5, pitch: 0.3 });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Molecule', Object.entries(MOL).map(([k, v]) => [k, v[0]]), id, (v) => { id = v; set(); });
  button(c2, 'H at the back', () => { let best = [9, 0, 0]; for (let y = -3.14; y < 3.14; y += 0.05) for (let p = -1.3; p <= 1.3; p += 0.05) { const d = depth(pos[3], y, p); if (d < best[0]) best = [d, y, p]; } cam.yaw = best[1]; cam.pitch = best[2]; cv.redraw(); });
  button(c2, 'Swap 1 and 2 (mirror image)', () => { swap = !swap; set(); });
  loop(host, (dt) => { if (!cam.dragging) { cam.yaw += dt * 0.2; cv.redraw(); } });
  const out = readout(host);
  const depth = (v, yaw, pitch) => { const z1 = -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw); return v[1] * Math.sin(pitch) + z1 * Math.cos(pitch); };
  function arrangement() { const p = TET.slice(); if (swap) { [p[0], p[1]] = [p[1], p[0]]; } return p; }
  function call() { const [a, b, c, d] = pos; const n = [0, 1, 2].map((i) => cross(a, b)[i] + cross(b, c)[i] + cross(c, a)[i]); return dotp(n, d) > 0 ? 'R' : 'S'; }
  function set() { pos = arrangement(); const [nm, g, why] = MOL[id]; out.innerHTML = `<b>${nm}</b> (as drawn): priorities ${why}. Looking with group 4 (${g[3]}) pointing away, 1 → 2 → 3 turns <b>${call() === 'R' ? 'clockwise' : 'anticlockwise'}</b>, so the centre is <b>${call()}</b>. ${swap ? 'Swapping two groups made the mirror image, so the label flipped.' : 'Press "Swap 1 and 2" to see the enantiomer.'} Note: R/S is a label from priorities, not a property that says which way it rotates light.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const g = MOL[id][1], P = cam.proj(w, h, Math.min(w, h) * 0.3, w / 2, h / 2 + 6), c0 = P([0, 0, 0]);
    title(ctx, `${MOL[id][0]}: ${call()}`, col);
    const items = pos.map((p, i) => ({ q: P(p.map((x) => x * 1.15)), i })).sort((a, b) => a.q[2] - b.q[2]);
    const drawC = () => { ctx.beginPath(); ctx.arc(c0[0], c0[1], 11, 0, 7); ctx.fillStyle = col.muted; ctx.fill(); text(ctx, 'C*', c0[0], c0[1], { color: col.bg, size: 10, weight: 700, align: 'center', fit: false }); };
    let drawnC = false;
    items.forEach(({ q, i }) => {
      if (!drawnC && q[2] > c0[2]) { drawC(); drawnC = true; }
      ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      const r = 15 + q[2] * 2; ctx.beginPath(); ctx.arc(q[0], q[1], r, 0, 7); ctx.fillStyle = col.s[[0, 1, 2, 7][i]]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
      text(ctx, String(i + 1), q[0], q[1] - 1, { color: col.bg, size: 14, weight: 800, align: 'center', fit: false });
      text(ctx, g[i], q[0], q[1] + r + 9, { color: col.ink, size: 11, weight: 700, align: 'center' });
    });
    if (!drawnC) drawC();
    // arc 1→2→3 on screen
    const q = pos.slice(0, 3).map((p) => P(p.map((x) => x * 0.7)));
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.quadraticCurveTo(q[1][0] * 1.0 + (c0[0] - q[1][0]) * 0.1, q[1][1] + (c0[1] - q[1][1]) * 0.1, q[1][0], q[1][1]); ctx.quadraticCurveTo(q[2][0] + (c0[0] - q[2][0]) * 0.1, q[2][1] + (c0[1] - q[2][1]) * 0.1, q[2][0], q[2][1]); ctx.stroke(); ctx.restore();
    text(ctx, '1 → 2 → 3', 10, h - 24, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, `Drag to turn · 4 = ${g[3]}`, w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  set();
}
