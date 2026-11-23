// Class 11 Chemistry, Classification of Elements: the periodic table by block (s, p, d, f), by metal / non-metal / metalloid, or by period.
// Position follows the long form of the table (18 groups, 7 periods, lanthanoids and actinoids drawn below). Tap an element: the readout gives
// its period, group, block and the last subshell filled by the (n + l) rule. (Real exceptions such as Cr and Cu are noted in the lesson.)
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
const pos = (Z) => {
  if (Z === 1) return [1, 1]; if (Z === 2) return [1, 18];
  if (Z <= 4) return [2, Z - 2]; if (Z <= 10) return [2, Z + 8]; if (Z <= 12) return [3, Z - 10]; if (Z <= 18) return [3, Z];
  if (Z <= 36) return [4, Z - 18]; if (Z <= 54) return [5, Z - 36];
  if (Z <= 56) return [6, Z - 54]; if (Z <= 71) return [8, Z - 54]; if (Z <= 86) return [6, Z - 68];
  if (Z <= 88) return [7, Z - 86]; if (Z <= 103) return [9, Z - 86]; return [7, Z - 100];
};
const blockOf = (Z) => { const [r, c] = pos(Z); return r >= 8 ? 'f' : (c <= 2 || Z === 2) ? 's' : c <= 12 ? 'd' : 'p'; };
const cls = (Z) => [5, 14, 32, 33, 51, 52].includes(Z) ? 'metalloid' : [1, 6, 7, 8, 9, 15, 16, 17, 34, 35, 53, 2, 10, 18, 36, 54, 86].includes(Z) ? 'non-metal' : 'metal';
const ORD = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6], ['5s', 2], ['4d', 10], ['5p', 6], ['6s', 2], ['4f', 14], ['5d', 10], ['6p', 6], ['7s', 2], ['5f', 14], ['6d', 10], ['7p', 6]];
const last = (Z) => { let l = Z; for (const [s, c] of ORD) { if (l <= c) return `${s}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.floor(l / 10) ? 0 : l] ? '' : ''}${s.slice(0)} with ${l} electron${l > 1 ? 's' : ''}`; l -= c; } return ''; };
export default function (host) {
  let mode = 'block', sel = 26;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 230, label: 'The long form periodic table coloured by block, metal character or period' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'colour by', [['block', 'block'], ['class', 'metal or not'], ['period', 'period']], mode, (v) => { mode = v; go(); });
  const geo = (w, h, t0) => { const cw = (w - 8) / 18, ch = Math.min(cw * 1.1, (h - t0 - 8) / 9.6); return { cw, ch }; };
  const go = () => {
    const [r, c] = pos(sel), g = r >= 8 ? 'f-block (no group number)' : `group ${c}`, per = r === 8 ? 6 : r === 9 ? 7 : r;
    ro.textContent = `Z = ${sel}, ${SYM[sel - 1]}: period ${per}, ${g}, ${blockOf(sel)}-block, ${cls(sel)}. Tap another element.`; cv.redraw();
  };
  let lay = null;
  cv.c.addEventListener('pointerdown', (e) => { if (!lay) return; const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; for (let z = 1; z <= 118; z++) { const [r, c] = pos(z), gy = r >= 8 ? 0.5 : 0, X = 4 + (c - 1) * lay.cw, Y = lay.t0 + 4 + (r - 1 + gy) * lay.ch; if (x >= X && x < X + lay.cw && y >= Y && y < Y + lay.ch) { sel = z; go(); break; } } });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'tap an element', col) + 12, { cw, ch } = geo(w, h, t0 + 8), P = ['s', 'p', 'd', 'f'], CL = ['metal', 'metalloid', 'non-metal'];
    lay = { cw, ch, t0 };
    for (let z = 1; z <= 118; z++) {
      const [r, c] = pos(z), gy = r >= 8 ? 0.5 : 0, X = 4 + (c - 1) * cw, Y = t0 + 4 + (r - 1 + gy) * ch, per = r === 8 ? 6 : r === 9 ? 7 : r;
      const k = mode === 'block' ? P.indexOf(blockOf(z)) : mode === 'class' ? CL.indexOf(cls(z)) : (per - 1) % 7;
      ctx.fillStyle = col.s[k % 8]; ctx.globalAlpha = z === sel ? 1 : 0.45; ctx.fillRect(X + 0.5, Y + 0.5, cw - 1, ch - 1); ctx.globalAlpha = 1;
      if (z === sel) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(X + 1, Y + 1, cw - 2, ch - 2); }
      text(ctx, SYM[z - 1], X + cw / 2, Y + ch / 2, { color: col.ink, size: cw < 18 ? 10 : 11, weight: z === sel ? 700 : 400, align: 'center', fit: false });
    }
    text(ctx, '*', 4 + 2 * cw + cw / 2, t0 + 4 + 5 * ch + ch / 2 + 2, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false }); text(ctx, '†', 4 + 2 * cw + cw / 2, t0 + 4 + 6 * ch + ch / 2, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false }); text(ctx, '*', 4 + cw, t0 + 4 + 8 * ch, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false }); text(ctx, '†', 4 + cw, t0 + 4 + 9 * ch, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false });
    const names = mode === 'block' ? P.map((p) => p + '-block') : mode === 'class' ? CL : [];
    names.forEach((n, i) => { ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.6; ctx.fillRect(10 + i * (w / 4.3), h - 16, 10, 10); ctx.globalAlpha = 1; text(ctx, n, 24 + i * (w / 4.3), h - 11, { color: col.ink, size: 10.5 }); });
    text(ctx, '* lanthanoids, † actinoids; rows = periods, columns = groups', 10, h - 26, { color: col.muted, size: 10.5 });
  };
  go();
}
