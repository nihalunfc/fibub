// No chiral help at all: a racemic mixture is never exactly 50:50. Its chance excess is about 1/√N.
// Run many flasks, each starting from its own random excess, and amplify: almost every flask ends nearly
// pure, but which hand wins is a coin toss (as in Soai's 2003 runs without any chiral additive).
import { stage, clear, text, dot, line, rng, gauss, type Stage } from '../kit';
import { soaiRounds } from '../../../lib/sci/chiralamp';

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: chance decides', title: 'Flasks with no chiral starter at all', h: 340, alt: 'A row of flasks; each starts with a random tiny excess shown as a short bar, then amplifies to nearly all teal (R) or all amber (S). A tally counts R and S winners.', caption: 'Starting excess drawn from a normal distribution with width 1/√N (the binomial chance excess of N molecules); then three batches of the same amplification model. Real molecules counted in a flask are around 10^20, so the chance excess there is around 10^-10.' });
  const r = rng(13);
  let lgN = 12, flasks: { e0: number; ef: number }[] = [], t = 0;
  s.slider('Molecules in the first seed, N', 4, 20, 1, lgN, (v) => `10^${v}`, (v) => { lgN = v; run(); });
  s.button('Run 24 new flasks', () => run());
  function run() { flasks = Array.from({ length: 24 }, () => { const e0 = gauss(r) / Math.sqrt(10 ** lgN); const sign = Math.sign(e0) || 1; const ef = sign * soaiRounds(Math.max(1e-12, Math.abs(e0)), 4, 0.05, 50).at(-1)!; return { e0, ef }; }); t = 0; }
  run();
  s.play((dt) => {
    t = Math.min(1, t + dt * 0.5);
    clear(s); const c = s.col;
    const cols = 12, w = (s.W - 40) / cols;
    flasks.forEach((f, i) => {
      const x = 20 + (i % cols) * w + w / 2, y = 90 + Math.floor(i / cols) * 120;
      const e = t < 0.3 ? f.e0 : f.ef * Math.min(1, (t - 0.3) / 0.7) + f.e0 * (1 - Math.min(1, (t - 0.3) / 0.7));
      s.c.strokeStyle = c.line; s.c.lineWidth = 1.5; s.c.strokeRect(x - 16, y - 40, 32, 80);
      const pR = (1 + e) / 2;
      s.c.fillStyle = c.teal; s.c.fillRect(x - 15, y + 39 - 78 * pR, 30, 78 * pR);
      s.c.fillStyle = c.amber; s.c.fillRect(x - 15, y - 39, 30, 78 * (1 - pR));
    });
    const nR = flasks.filter((f) => f.ef > 0).length;
    text(s, t < 1 ? 'Amplifying…' : `R won in ${nR} flasks, S in ${flasks.length - nR}`, 20, 26, { bold: true });
    text(s, `Typical chance excess at the start: ${(100 / Math.sqrt(10 ** lgN)).toExponential(0)}%`, 20, 44, { size: 12, colour: c.muted });
    line(s, [[20, 310], [s.W - 20, 310]], c.line, 1);
    dot(s, 30, 324, 5, c.teal); text(s, 'R', 40, 328, { size: 12 }); dot(s, 70, 324, 5, c.amber); text(s, 'S', 80, 328, { size: 12 });
    s.mark();
    s.out(`Each flask ends almost pure (about ${Math.round(Math.abs(flasks[0].ef) * 1000) / 10}% ee), yet R and S win about equally often. That is what <b>absolute asymmetric synthesis</b> looks like: symmetry broken by chance, then locked in by autocatalysis.`);
  });
}
