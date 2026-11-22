// Class 9 Atomic Foundations of Matter: formula maker. Pick a positive ion and a negative ion. The figure shows the
// ions as charged blocks (+ and - tokens) and joins as many of each as it takes for the total charge to be zero (the
// smallest whole-number ratio, found from the lowest common multiple of the two charges). It prints the formula and
// the name, with brackets for polyatomic ions, so the criss-cross rule is seen as balancing charges.
import { canvas, text, title, row, choice, readout, dot } from '../../kit.js';

const CAT = { Na: ['Na', 1, 'sodium'], K: ['K', 1, 'potassium'], Ca: ['Ca', 2, 'calcium'], Mg: ['Mg', 2, 'magnesium'], Al: ['Al', 3, 'aluminium'], NH4: ['NH₄', 1, 'ammonium'] };
const ANI = { Cl: ['Cl', 1, 'chloride'], O: ['O', 2, 'oxide'], OH: ['OH', 1, 'hydroxide'], SO4: ['SO₄', 2, 'sulphate'], CO3: ['CO₃', 2, 'carbonate'], N: ['N', 3, 'nitride'], NO3: ['NO₃', 1, 'nitrate'] };
const SUB = (n) => (n === 1 ? '' : String(n).split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[+d]).join(''));
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export default function (host) {
  let c = 'Al', a = 'O';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Positive and negative ions combined in the ratio that makes the total charge zero with the formula' });
  const ctl = row(host);
  choice(ctl, 'Positive ion', Object.keys(CAT).map((k) => [k, CAT[k][0] + '⁺'.replace('⁺', ['', '⁺', '²⁺', '³⁺'][CAT[k][1]] || '⁺')]), c, (v) => { c = v; upd(); });
  choice(ctl, 'Negative ion', Object.keys(ANI).map((k) => [k, ANI[k][0] + ['', '⁻', '²⁻', '³⁻'][ANI[k][1]]]), a, (v) => { a = v; upd(); });
  const out = readout(host);
  const calc = () => { const [cs, cq, cn] = CAT[c], [as, aq, an] = ANI[a], g = gcd(cq, aq), nc = aq / g, na = cq / g; return { cs, cq, cn, as, aq, an, nc, na }; };
  function upd() {
    const r = calc(), wrap = (s, n) => (/[₄₃]/.test(s) || s.length > 2) && n > 1 ? `(${s})${SUB(n)}` : s + SUB(n);
    r.formula = wrap(r.cs, r.nc) + wrap(r.as, r.na);
    out.innerHTML = `${r.nc} × (+${r.cq}) + ${r.na} × (−${r.aq}) = ${r.nc * r.cq - r.na * r.aq}. Formula: <b>${r.formula}</b> (${r.cn} ${r.an}).`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const r = calc(); title(ctx, `${r.cn} ${r.an}: charges must add to zero`, col);
    const tok = (x, y, s, q, pos) => { ctx.fillStyle = pos ? col.s[1] : col.s[0]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(x, y, 18, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = pos ? col.s[1] : col.s[0]; ctx.lineWidth = 2; ctx.stroke(); text(ctx, s, x, y - 3, { color: col.ink, size: 11, weight: 700, align: 'center', fit: false }); text(ctx, (pos ? '+' : '−') + q, x, y + 9, { color: col.ink, size: 9.5, align: 'center', fit: false }); };
    const per = Math.max(r.nc, r.na), gap = Math.min(44, (w - 40) / per), x0 = w / 2 - ((per - 1) * gap) / 2;
    for (let i = 0; i < r.nc; i++) tok(x0 + i * gap, 68, r.cs, r.cq, true);
    for (let i = 0; i < r.na; i++) tok(x0 + i * gap, 138, r.as, r.aq, false);
    text(ctx, `${r.nc} × ${r.cs} (+${r.cq} each) = +${r.nc * r.cq}`, w / 2, 103, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    text(ctx, `${r.na} × ${r.as} (−${r.aq} each) = −${r.na * r.aq}`, w / 2, 168, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    dot(ctx, w / 2, 196, 3, col.ink);
    text(ctx, `total = ${r.nc * r.cq - r.na * r.aq}`, w / 2, 214, { color: col.good, size: 13, weight: 700, align: 'center' });
    const wrap = (s, n) => (/[₄₃]/.test(s) || s.length > 2) && n > 1 ? `(${s})${SUB(n)}` : s + SUB(n);
    text(ctx, wrap(r.cs, r.nc) + wrap(r.as, r.na), w / 2, h - 50, { color: col.ink, size: 30, weight: 700, align: 'center', fit: false });
    text(ctx, 'criss-cross: the charge of each ion becomes the count of the other (then cancel)', w / 2, h - 14, { color: col.muted, size: 10, align: 'center' });
  };
  upd();
}
