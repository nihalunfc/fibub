// The inductive effect on acid strength, from measured pKa values in water at 25 °C. Choose a comparison: more chlorine
// atoms, a different halogen, or the same chlorine further from the COOH group. Lower pKa = stronger acid; each step
// of 1 in pKa is a tenfold change in Ka.
import { canvas, text, row, choice, readout, fmt, button } from '../../kit.js';

const SETS = {
  count: { name: 'Number of Cl', items: [['CH₃COOH', 4.76], ['ClCH₂COOH', 2.87], ['Cl₂CHCOOH', 1.35], ['Cl₃CCOOH', 0.66]],
    note: 'Each extra chlorine pulls more electron density away from the O-H bond and spreads the negative charge of the anion. The first Cl makes the acid about 80 times stronger; trichloroacetic acid is over 10 000 times stronger than acetic acid.' },
  halogen: { name: 'Which halogen', items: [['FCH₂COOH', 2.59], ['ClCH₂COOH', 2.87], ['BrCH₂COOH', 2.90], ['ICH₂COOH', 3.18], ['CH₃COOH', 4.76]],
    note: 'The −I effect follows electronegativity, F > Cl > Br > I, so fluoroacetic acid is the strongest. Every halogen beats hydrogen.' },
  distance: { name: 'Distance of Cl', items: [['2-chloro (α)', 2.86], ['3-chloro (β)', 4.05], ['4-chloro (γ)', 4.52], ['butanoic acid', 4.82]],
    note: 'The inductive effect dies away quickly along a chain of σ bonds: strong on the next carbon, small two carbons away, almost gone after three.' },
};

export default function (host) {
  let set = 'count', sel = 1;
  const cv = canvas(host, { aspect: 0.6, max: 330, min: 250, label: 'Bar chart of pKa values showing the inductive effect on acid strength' });
  const ctl = row(host);
  choice(ctl, 'Compare', Object.entries(SETS).map(([k, s]) => [k, s.name]), set, (v) => { set = v; sel = 0; cv.redraw(); show(); });
  const step = (d) => { const k = SETS[set].items.length; sel = (sel + d + k) % k; cv.redraw(); show(); };
  button(ctl, '◀ Previous', () => step(-1));
  button(ctl, 'Next ▶', () => step(1));
  const out = readout(host);
  const show = () => {
    const s = SETS[set], [nm, pk] = s.items[sel], ref = s.items.reduce((a, b) => (b[1] > a[1] ? b : a));
    out.innerHTML = `${s.note} Tap a bar or use the arrows: <b>${nm}</b> has pK<sub>a</sub> ${pk}, so it is about <b>${fmt(10 ** (ref[1] - pk), 3)} times</b> as strong as ${ref[0]}.`;
  };
  let geo = [];
  cv.draw = (ctx, w, h, col) => {
    const items = SETS[set].items, L = 12, R = w - 12, T = 40, B = h - 46, max = 5.2, bw = (R - L) / items.length;
    text(ctx, 'pKa (lower = stronger acid)', 10, 14, { color: col.ink, size: 12.5, weight: 700 });
    geo = [];
    items.forEach(([nm, pk], i) => {
      const x = L + i * bw + bw * 0.14, wd = bw * 0.72, y = B - (pk / max) * (B - T);
      ctx.fillStyle = i === sel ? col.s[2] : col.s[0];
      ctx.fillRect(x, y, wd, B - y);
      text(ctx, String(pk), x + wd / 2, y - 9, { color: col.ink, size: 11, weight: 600, align: 'center' });
      text(ctx, nm, x + wd / 2, B + 14, { color: col.ink, size: 10, align: 'center' });
      geo.push([x, x + wd]);
    });
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    text(ctx, 'shorter bar = lower pKa = stronger acid', L, h - 12, { color: col.muted, size: 10.5 });
  };
  cv.c.style.cursor = 'pointer';
  cv.c.addEventListener('click', (e) => {
    const rc = cv.c.getBoundingClientRect(), x = e.clientX - rc.left;
    const i = geo.findIndex(([a, b]) => x >= a - 6 && x <= b + 6);
    if (i >= 0) { sel = i; cv.redraw(); show(); }
  });
  cv.redraw(); show();
}
