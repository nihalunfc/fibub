// Is it a source or luck? Background neutrinos land all over the sky; a weak source adds a few extra
// in one spot each year. Run the years and watch the count in the circle against what background alone
// would give, with the Poisson chance of a fluke (the same maths as the Counting statistics tool).
import { stage, clear, text, dot, rng, gauss, type Stage } from '../kit';
import { gammaP } from '../../../lib/sci/phcount';
import { normInv } from '../../../lib/sci/stats';

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: source or fluke?', title: 'Collect years of neutrinos and test one spot of sky', h: 360, alt: 'A rectangle of sky fills with grey dots each year; a circle marks a candidate source; the count inside and the significance are shown.', caption: 'Background: neutrinos spread evenly (most are atmospheric). Source: extra neutrinos smeared by a 1° pointing error. Significance from the Poisson chance of at least the observed count, given the expected background.' });
  const r = rng(5);
  let srcPerYr = 3, bgPerYr = 900, year = 0, acc = 0, pts: { x: number; y: number; s: boolean }[] = [];
  const CX = 0.62, CY = 0.45, RAD = 0.035; // circle in sky units (fraction of width)
  s.slider('Source neutrinos per year', 0, 10, 0.5, srcPerYr, (v) => `${v}`, (v) => { srcPerYr = v; restart(); });
  s.slider('Background per year (whole map)', 200, 3000, 100, bgPerYr, (v) => `${v}`, (v) => { bgPerYr = v; restart(); });
  s.button('Restart', () => restart());
  function restart() { year = 0; acc = 0; pts = []; }
  const poisson = (m: number) => { let k = 0, p = Math.exp(-m), u = r(), c = p; while (u > c && k < 500) { k++; p *= m / k; c += p; } return k; };
  const addYear = () => {
    year++;
    for (let i = 0, n = poisson(bgPerYr); i < n; i++) pts.push({ x: r(), y: r(), s: false });
    for (let i = 0, n = poisson(srcPerYr); i < n; i++) pts.push({ x: CX + gauss(r) * RAD * 0.5, y: CY + gauss(r) * RAD * 0.5 * 2, s: true });
  };
  s.play((dt) => {
    acc += dt; if (acc > 0.8 && year < 20) { acc = 0; addYear(); }
    clear(s); const c = s.col, W = s.W - 20, H = s.H - 70;
    s.c.strokeStyle = c.line; s.c.strokeRect(10, 40, W, H);
    for (const p of pts) dot(s, 10 + p.x * W, 40 + p.y * H, 1.4, p.s ? c.amber : c.muted, 0.7);
    // Circle (radius in pixels from width; sky drawn 2:1 so y-radius in sky units is double).
    const R = RAD * W;
    s.c.strokeStyle = c.ink; s.c.lineWidth = 2; s.c.beginPath(); s.c.arc(10 + CX * W, 40 + CY * H, R, 0, Math.PI * 2); s.c.stroke();
    const inside = pts.filter((p) => Math.hypot((p.x - CX) * W, (p.y - CY) * H) < R).length;
    const area = (Math.PI * R * R) / (W * H), b = bgPerYr * year * area;
    const pv = inside > 0 && b > 0 ? gammaP(inside, b) : 1; // P(N ≥ n | b) for a Poisson count
    const sig = pv < 0.5 ? normInv(1 - pv) : 0;
    text(s, `Year ${year} · in circle: ${inside} · background expected: ${b.toFixed(1)} · ${sig.toFixed(1)}σ`, 10, 26, { bold: true });
    s.mark();
    s.out(year === 0 ? 'Press Play to collect a year at a time.' : `After ${year} year${year > 1 ? 's' : ''} the circle holds <b>${inside}</b> neutrinos where background alone gives <b>${b.toFixed(1)}</b> on average. The chance of that many or more by luck is <b>${pv < 1e-4 ? pv.toExponential(1) : pv.toFixed(4)}</b> (about <b>${sig.toFixed(1)}σ</b>). Physicists want 5σ (about 1 in 3.5 million), and they also pay for every other spot they looked at: the "look-elsewhere" cost.`);
  });
}
