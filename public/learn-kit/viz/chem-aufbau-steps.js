// Aufbau, Hund and the exceptions: drag Z from 1 to 36 (or press Play) and watch the newest electron drop into its
// orbital box. Up arrows go into separate boxes first (Hund's rule), then pair up; Cr and Cu borrow a 4s electron
// to make a half-full or full 3d subshell. The readout gives the configuration and the number of unpaired electrons.
import { canvas, text, row, slider, button, readout, loop, title } from '../kit.js';

const ORDER = [['1s', 1], ['2s', 1], ['2p', 3], ['3s', 1], ['3p', 3], ['4s', 1], ['3d', 5], ['4p', 3]];
const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr'.split(' ');
const EXC = { 24: { '4s': 1, '3d': 5 }, 29: { '4s': 1, '3d': 10 } };
function fill(Z) {
  const n = {}; let left = Z;
  for (const [k, b] of ORDER) { const c = Math.min(left, 2 * b); n[k] = c; left -= c; }
  if (EXC[Z]) Object.assign(n, EXC[Z]);
  return n;
}
function boxes(c, b) { // c electrons in b boxes by Hund: [up, down] per box
  const a = Array.from({ length: b }, () => [0, 0]);
  for (let i = 0; i < c; i++) { if (i < b) a[i][0] = 1; else a[i - b][1] = 1; }
  return a;
}
export default function (host) {
  let Z = 6, last = '2p';
  const cv = canvas(host, { aspect: 0.95, max: 470, min: 330, label: 'Orbital boxes filled with electron arrows for the chosen element' });
  const ctl = row(host);
  const zs = slider(ctl, { label: 'Atomic number Z', min: 1, max: 36, step: 1, value: Z, fmt: (v) => `${v} ${SYM[v - 1]}`, oninput: (v) => { Z = Math.round(v); set(); } });
  const anim = loop(host, (dt, t) => { if (t - (anim.lastT || 0) > 0.7) { anim.lastT = t; Z = Z >= 36 ? 1 : Z + 1; zs.set(Z); set(); } }, { autoplay: false });
  anim.button(ctl);
  button(ctl, 'Cr (24)', () => { Z = 24; zs.set(Z); set(); });
  button(ctl, 'Cu (29)', () => { Z = 29; zs.set(Z); set(); });
  const out = readout(host);
  function set() {
    const prev = fill(Z - 1), now = fill(Z); last = ORDER.map(([k]) => k).find((k) => now[k] !== (prev[k] || 0)) || '1s';
    const cfg = ORDER.slice().sort((a, b) => (a[0][0] - b[0][0]) || 'spdf'.indexOf(a[0][1]) - 'spdf'.indexOf(b[0][1])).filter(([k]) => now[k]).map(([k]) => k + (now[k] === 1 ? '¹' : '²³⁴⁵⁶⁷⁸⁹'[now[k] - 2] || '¹⁰')).join(' ');
    const sup = (v) => String(v).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    const cfg2 = ORDER.slice().sort((a, b) => (a[0][0] - b[0][0]) || 'spdf'.indexOf(a[0][1]) - 'spdf'.indexOf(b[0][1])).filter(([k]) => now[k]).map(([k]) => k + sup(now[k])).join(' ');
    let un = 0; ORDER.forEach(([k, b]) => boxes(now[k], b).forEach(([u, d]) => { if (u + d === 1) un++; }));
    out.innerHTML = `<b>${SYM[Z - 1]} (Z = ${Z}):</b> ${cfg2}. Unpaired electrons: <b>${un}</b> (${un ? 'paramagnetic' : 'diamagnetic'}).${EXC[Z] ? ' <b>Exception:</b> one 4s electron moves into 3d for a half-full or full d subshell.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const now = fill(Z), prev = fill(Z - 1);
    title(ctx, `${SYM[Z - 1]}: filling in order of energy`, col);
    const rows = ORDER.length, top = 44, bot = h - 14, dy = (bot - top) / (rows - 1), bw = Math.min(34, (w - 110) / 5);
    // energy axis
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(24, bot + 4); ctx.lineTo(24, top - 8); ctx.stroke(); text(ctx, 'Energy', 8, top - 16, { color: col.muted, size: 10 });
    ORDER.forEach(([k, b], i) => {
      const y = bot - i * dy, x0 = 52, bxs = boxes(now[k], b), pb = boxes(prev[k] || 0, b);
      text(ctx, k, x0 - 4, y, { color: col.ink, size: 13, weight: 700, align: 'right', fit: false });
      bxs.forEach(([u, d], j) => {
        const x = x0 + j * (bw + 4);
        ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - 14, bw, 28);
        const isNew = (k === last) && ((u && !pb[j][0]) || (d && !pb[j][1]));
        [[u, -bw * 0.28, 1], [d, bw * 0.28, -1]].forEach(([has, dx, dir]) => {
          if (!has) return;
          const nw = isNew && ((dir === 1 && !pb[j][0]) || (dir === -1 && !pb[j][1]));
          const c = nw ? col.s[1] : col.s[0], px = x + bw / 2 + dx;
          ctx.strokeStyle = c; ctx.lineWidth = nw ? 3 : 2; ctx.beginPath(); ctx.moveTo(px, dir === 1 ? y + 10 : y - 10); ctx.lineTo(px, dir === 1 ? y - 10 : y + 10);
          ctx.lineTo(px - 4, dir === 1 ? y - 4 : y + 4); ctx.moveTo(px, dir === 1 ? y - 10 : y + 10); ctx.lineTo(px + 4, dir === 1 ? y - 4 : y + 4); ctx.stroke();
        });
      });
      text(ctx, `${now[k]} e⁻`, x0 + b * (bw + 4) + 4, y, { color: k === last ? col.s[1] : col.muted, size: 11, weight: k === last ? 700 : 400, fit: false });
    });
    text(ctx, 'orange = the newest electron', w - 8, h - 8, { color: col.s[1], size: 10, align: 'right' });
  };
  set();
}
