// Class 12 Chemistry, Aldehydes, Ketones and Carboxylic Acids: how substituents change the strength of carboxylic acids.
// Electron-withdrawing groups (Cl, F, NO2) pull the electrons of the O-H bond and spread the negative charge of the carboxylate, so Ka rises (pKa falls); each extra Cl adds a lot. Electron-donating groups (CH3, OCH3) do the opposite.
// pKa values at 25 deg C (CRC Handbook): CH3COOH 4.76, ClCH2COOH 2.86, Cl2CHCOOH 1.29, Cl3CCOOH 0.65, FCH2COOH 2.59, HCOOH 3.75, C2H5COOH 4.87; benzoic 4.20, p-nitro 3.44, p-chloro 3.98, p-methyl 4.34, p-methoxy 4.47.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';

const AC = [['H', 'CH₃COOH', 4.76], ['Cl', 'ClCH₂COOH', 2.86], ['Cl₂', 'Cl₂CHCOOH', 1.29], ['Cl₃', 'Cl₃CCOOH', 0.65]];
const BZ = { H: ['benzoic acid', 4.2], Me: ['4-methylbenzoic acid', 4.34], OMe: ['4-methoxybenzoic acid', 4.47], Cl: ['4-chlorobenzoic acid', 3.98], NO2: ['4-nitrobenzoic acid', 3.44] };
export default function (host) {
  let mode = 'chain', nCl = 1, sub = 'NO2';
  const cv = canvas(host, { aspect: 0.82, max: 360, min: 290, label: 'pKa of carboxylic acids as chlorine atoms are added to the chain or substituents are added to the benzene ring' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'acid', [['chain', 'ethanoic acid + Cl'], ['ring', 'benzoic acid + group']], mode, (v) => { mode = v; go(); });
  const s1 = slider(ctl, { label: 'chlorine atoms on the α carbon', min: 0, max: 3, step: 1, value: nCl, fmt: (v) => String(v), oninput: (v) => { nCl = v; go(); } });
  const c2 = choice(ctl, 'group at para position', [['H', 'H'], ['Me', 'CH₃'], ['OMe', 'OCH₃'], ['Cl', 'Cl'], ['NO2', 'NO₂']], sub, (v) => { sub = v; go(); });
  const cur = () => (mode === 'chain' ? [AC[nCl][1], AC[nCl][2]] : BZ[sub]);
  const go = () => { ctl.querySelector('.lk-slider').style.display = mode === 'chain' ? '' : 'none'; ctl.querySelectorAll('.lk-choice')[1].style.display = mode === 'ring' ? '' : 'none'; const [n, p] = cur(), ref = mode === 'chain' ? 4.76 : 4.2; ro.textContent = `${n}: pKa = ${p}, Ka = ${Math.pow(10, -p).toExponential(2)}. That is ${(Math.pow(10, ref - p)).toFixed(p < ref ? 1 : 2)} × the strength of ${mode === 'chain' ? 'ethanoic acid' : 'benzoic acid'}. ${mode === 'chain' ? 'Cl pulls electron density along the chain (−I effect), so the carboxylate is more stable; more Cl, stronger acid.' : (sub === 'H' ? 'Benzoic acid itself.' : sub === 'Me' || sub === 'OMe' ? 'An electron-donating group pushes density towards the COO⁻ and weakens the acid.' : 'An electron-withdrawing group stabilises COO⁻ and strengthens the acid.')}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const [name, p] = cur(), top = title(ctx, name, col), L = 20, R = w - 20, Y = top + 30, X = (v) => L + (5 - v) / 5.4 * (R - L);
    text(ctx, 'pKa (lower = stronger acid)', w / 2, top + 8, { color: col.muted, size: 10.5, align: 'center' });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, Y); ctx.lineTo(R, Y); ctx.stroke();
    for (let v = 0; v <= 5; v++) { ctx.beginPath(); ctx.moveTo(X(v), Y - 3); ctx.lineTo(X(v), Y + 3); ctx.stroke(); text(ctx, String(v), X(v), Y + 13, { color: col.muted, size: 9.5, align: 'center' }); }
    const all = mode === 'chain' ? AC.map((a) => a[2]) : Object.values(BZ).map((b) => b[1]); all.forEach((v) => { ctx.fillStyle = col.muted; ctx.beginPath(); ctx.arc(X(v), Y, 3.5, 0, 7); ctx.fill(); });
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(X(p), Y, 7, 0, 7); ctx.fill();
    // molecule picture
    const cy = Y + (h - Y) * 0.5 + 4, mid = w / 2; const atom = (s, x, y, c) => { ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(x, y, 13, 0, 7); ctx.fill(); text(ctx, s, x, y, { color: c || col.ink, size: 12, weight: 700, align: 'center' }); };
    const ln = (a, b, c, d) => { ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); };
    if (mode === 'chain') {
      const cx = mid - 20; ln(cx, cy, cx + 54, cy); atom('C', cx, cy); atom('C', cx + 54, cy); ln(cx + 54, cy, cx + 54 + 28, cy - 24); ln(cx + 54, cy, cx + 54 + 28, cy + 24); atom('O', cx + 84, cy - 26); atom('O', cx + 84, cy + 26, col.s[3]); text(ctx, 'H', cx + 106, cy + 26, { color: col.s[3], size: 11, align: 'center' });
      const subs = ['H', 'H', 'H']; for (let i = 0; i < nCl; i++) subs[i] = 'Cl'; [[-26, -30], [-34, 6], [-20, 34]].forEach(([dx, dy], i) => { ln(cx, cy, cx + dx, cy + dy); atom(subs[i], cx + dx, cy + dy, subs[i] === 'Cl' ? col.s[1] : col.muted); if (subs[i] === 'Cl') ctxArrow(ctx, cx + dx + 10, cy + dy, cx + 8, cy + 0, col.s[1]); });
      text(ctx, nCl ? 'Cl pulls electrons toward itself (arrows)' : 'CH₃ pushes electrons slightly (+I): the reference', mid, h - 34, { color: col.muted, size: 11, align: 'center' });
    } else {
      const rr = 30, cx = mid - 46; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; ctx[i ? 'lineTo' : 'moveTo'](cx + rr * Math.cos(a - Math.PI / 6), cy + rr * Math.sin(a - Math.PI / 6)); } ctx.closePath(); ctx.stroke();
      ln(cx + rr, cy, cx + rr + 22, cy); atom('C', cx + rr + 22, cy); ln(cx + rr + 22, cy, cx + rr + 44, cy - 20); ln(cx + rr + 22, cy, cx + rr + 44, cy + 20); atom('O', cx + rr + 50, cy - 22); atom('O', cx + rr + 50, cy + 22, col.s[3]); text(ctx, 'H', cx + rr + 72, cy + 22, { color: col.s[3], size: 11, align: 'center' });
      ln(cx - rr, cy, cx - rr - 24, cy); const lab = { H: 'H', Me: 'CH₃', OMe: 'OCH₃', Cl: 'Cl', NO2: 'NO₂' }[sub]; ctx.font = '700 12px system-ui'; ctx.fillStyle = col.panel; ctx.fillRect(cx - rr - 56, cy - 11, 34, 22); text(ctx, lab, cx - rr - 38, cy, { color: sub === 'Me' || sub === 'OMe' ? col.s[2] : sub === 'H' ? col.muted : col.s[1], size: 12, weight: 700, align: 'center' });
      text(ctx, sub === 'H' ? 'reference: benzoic acid, pKa 4.2' : sub === 'Me' || sub === 'OMe' ? 'donating group: weaker acid' : 'withdrawing group: stronger acid', mid, h - 34, { color: col.muted, size: 11, align: 'center' });
    }
    text(ctx, `Ka = 10^(−pKa) = ${Math.pow(10, -p).toExponential(2)}`, mid, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  function ctxArrow(ctx, x0, y0, x1, y1, c) { ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); const a = Math.atan2(y1 - y0, x1 - x0); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 6 * Math.cos(a - 0.5), y1 - 6 * Math.sin(a - 0.5)); ctx.lineTo(x1 - 6 * Math.cos(a + 0.5), y1 - 6 * Math.sin(a + 0.5)); ctx.fill(); }
  go();
}
