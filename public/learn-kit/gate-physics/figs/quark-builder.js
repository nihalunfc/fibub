// 8.6 Quark content builder. Add quarks and antiquarks (up to three). The figure adds up charge, baryon number,
// strangeness, charm and bottomness, says whether the combination can be a colour singlet (q qbar, qqq or three
// antiquarks), and names the lightest known hadron with that content when there is one.
import { canvas, row, button, readout, text } from '../../kit.js';

const Q = { u: 2 / 3, d: -1 / 3, s: -1 / 3, c: 2 / 3, b: -1 / 3 };
const NAMES = {
  'ud̄': 'π⁺', 'dū': 'π⁻', 'uū': 'π⁰ / η (mixed with dd̄)', 'dd̄': 'π⁰ / η (mixed with uū)', 'us̄': 'K⁺', 'ds̄': 'K⁰', 'sū': 'K⁻', 'sd̄': 'K̄⁰', 'ss̄': 'η′ / φ (mostly)',
  'cd̄': 'D⁺', 'cū': 'D⁰', 'cs̄': 'D_s⁺', 'cc̄': 'η_c, J/ψ', 'ub̄': 'B⁺', 'db̄': 'B⁰', 'bb̄': 'Υ (and η_b)', 'dc̄': 'D⁻', 'uc̄': 'D̄⁰', 'bū': 'B⁻',
  'uud': 'proton (spin ½) or Δ⁺', 'udd': 'neutron or Δ⁰', 'uuu': 'Δ⁺⁺ (spin 3/2 only)', 'ddd': 'Δ⁻ (spin 3/2 only)', 'uds': 'Λ⁰ or Σ⁰', 'uus': 'Σ⁺', 'dds': 'Σ⁻',
  'uss': 'Ξ⁰', 'dss': 'Ξ⁻', 'sss': 'Ω⁻ (spin 3/2 only)', 'udc': 'Λ_c⁺', 'udb': 'Λ_b⁰', 'ūūd̄': 'antiproton', 'ūd̄d̄': 'antineutron', 'ūd̄s̄': 'anti-Λ',
};
const ORDER = 'udscb';

export default function (host) {
  const cv = canvas(host, { aspect: 0.42, max: 470, min: 160, label: 'Quarks chosen so far, drawn as coloured circles' });
  let qs = [];
  const r1 = row(host), r2 = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  for (const f of ORDER) button(r1, f, () => { if (qs.length < 3) qs.push(f); re(); });
  for (const f of ORDER) button(r2, f + '̄', () => { if (qs.length < 3) qs.push('-' + f); re(); });
  button(r2, 'Clear', () => { qs = []; re(); });
  const key = () => {
    const q = qs.filter((x) => x[0] !== '-').sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    const a = qs.filter((x) => x[0] === '-').map((x) => x[1]).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    return q.join('') + a.map((x) => x + '̄').join('');
  };
  const sums = () => {
    let ch = 0, B = 0, S = 0, C = 0, Bt = 0;
    for (const x of qs) { const anti = x[0] === '-', f = anti ? x[1] : x, sg = anti ? -1 : 1; ch += sg * Q[f]; B += sg / 3; if (f === 's') S -= sg; if (f === 'c') C += sg; if (f === 'b') Bt -= sg; }
    return { ch, B, S, C, Bt };
  };
  const frac = (x) => { const t = Math.round(x * 3); return t % 3 === 0 ? String(t / 3) : `${t < 0 ? '−' : ''}${Math.abs(t)}/3`; };
  const show = () => {
    if (!qs.length) { out.innerHTML = 'Press quark buttons (top row) or antiquark buttons (second row) to build a hadron.'; return; }
    const s = sums(), nq = qs.filter((x) => x[0] !== '-').length, na = qs.length - nq;
    const singlet = (nq === 1 && na === 1) || (nq === 3 && na === 0) || (na === 3 && nq === 0);
    const k = key(), nm = NAMES[k];
    out.innerHTML = `Charge ${frac(s.ch)}, baryon number ${frac(s.B)}, strangeness ${s.S}, charm ${s.C}, bottomness ${s.Bt}. ` +
      (singlet ? `${nq === 1 ? 'A meson' : 'A baryon'} (colour singlet).${nm ? ` Known as: <b>${nm}</b>.` : ''}` : qs.length < 3 && !(nq === 1 && na === 1) ? 'Not a colour singlet yet: add more.' : 'Not a colour singlet: no free hadron has this content (charge would not be a whole number, or colour cannot cancel).');
  };
  cv.draw = (ctx, W, H, col) => {
    const cs = [col.s[0], col.s[1], col.s[2]];
    text(ctx, qs.length ? 'quarks in the hadron (dashed circle: antiquark)' : 'empty', 10, 14, { color: col.muted, size: 11 });
    qs.forEach((x, i) => {
      const anti = x[0] === '-', f = anti ? x[1] : x, cx = W / 2 + (i - (qs.length - 1) / 2) * Math.min(110, W / 3.4), cy = H / 2 + 8, r = Math.min(34, H / 3);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = cs[i % 3]; if (anti) ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, anti ? f + '̄' : f, cx, cy - 4, { color: col.ink, size: 22, weight: 700, align: 'center' });
      text(ctx, `${(anti ? -1 : 1) * Q[f] > 0 ? '+' : '−'}${Math.abs(Math.round(Q[f] * 3))}/3`, cx, cy + 18, { color: col.muted, size: 11, align: 'center' });
    });
  };
  re();

}
