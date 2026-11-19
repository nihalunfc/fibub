// Three messengers leave the same distant source. Light (gamma rays) is blocked by gas and dust or soaked
// up by background light on long trips; charged cosmic rays are bent by magnetic fields and arrive from
// everywhere; neutrinos fly straight through everything and point back home.
import { stage, clear, text, dot, line, rng, gauss, type Stage } from '../kit';

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Watch: three messengers', title: 'What reaches Earth from a cosmic accelerator?', h: 320, alt: 'A source at the left sends out three kinds of particle. Gamma rays stop in a cloud, cosmic rays wander along curved paths, and neutrinos go straight to Earth on the right.', caption: 'A cartoon, not to scale: real cosmic-ray paths bend over millions of light-years, and very high-energy gamma rays are lost by colliding with starlight and the cosmic microwave background.' });
  const r = rng(3);
  type P = { x: number; y: number; vx: number; vy: number; k: 'g' | 'p' | 'n'; alive: boolean };
  let ps: P[] = [], acc = 0, got = { g: 0, p: 0, n: 0 }, sent = { g: 0, p: 0, n: 0 }, show = 'all';
  s.choice([['all', 'All three'], ['g', 'Gamma rays'], ['p', 'Cosmic rays'], ['n', 'Neutrinos']], show, (v) => { show = v; });
  const SX = 60, SY = s.H / 2, EX = s.W - 50, EY = s.H / 2, CLX = s.W * 0.45;
  s.play((dt) => {
    acc += dt;
    while (acc > 0.05) { acc -= 0.05; for (const k of ['g', 'p', 'n'] as const) { const a = gauss(r) * 0.08; ps.push({ x: SX, y: SY, vx: 220 * Math.cos(a), vy: 220 * Math.sin(a), k, alive: true }); sent[k]++; } }
    for (const p of ps) {
      if (!p.alive) continue;
      if (p.k === 'p') { const turn = gauss(r) * 2.6 * dt; const c = Math.cos(turn), sn = Math.sin(turn); [p.vx, p.vy] = [p.vx * c - p.vy * sn, p.vx * sn + p.vy * c]; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.k === 'g' && Math.abs(p.x - CLX) < 40 && Math.abs(p.y - SY) < 90 && r() < 0.12) p.alive = false;
      if (Math.hypot(p.x - EX, p.y - EY) < 22) { got[p.k]++; p.alive = false; }
      if (p.x < 0 || p.x > s.W || p.y < 0 || p.y > s.H) p.alive = false;
    }
    ps = ps.filter((p) => p.alive);
    clear(s); const c = s.col;
    s.c.fillStyle = c.soft; s.c.beginPath(); s.c.ellipse(CLX, SY, 40, 90, 0, 0, Math.PI * 2); s.c.fill();
    text(s, 'gas and dust', CLX, SY + 108, { align: 'center', size: 12, colour: c.muted });
    dot(s, SX, SY, 16, c.violet, 0.9); text(s, 'source', SX, SY + 34, { align: 'center', size: 12 });
    dot(s, EX, EY, 20, c.teal, 0.9); text(s, 'Earth', EX, EY + 38, { align: 'center', size: 12 });
    const col = { g: c.blue, p: c.bad, n: c.amber };
    for (const p of ps) if (show === 'all' || show === p.k) dot(s, p.x, p.y, 2.4, col[p.k]);
    const pc = (k: 'g' | 'p' | 'n') => `${((100 * got[k]) / Math.max(1, sent[k])).toFixed(0)}%`;
    text(s, `Reach Earth: gamma rays ${pc('g')}`, 14, 22, { colour: c.blue, size: 12, bold: true });
    text(s, `cosmic rays ${pc('p')} (and from the wrong direction)`, 14, 40, { colour: c.bad, size: 12, bold: true });
    text(s, `neutrinos ${pc('n')}, straight from the source`, 14, 58, { colour: c.amber, size: 12, bold: true });
    s.mark();
  });
  s.out('Gamma rays tell us a source is bright, but can be blocked or made by other means; cosmic rays carry the most energy but forget where they came from. Neutrinos are made only when protons or nuclei are accelerated and smash into gas or light, so they are a clean sign of a cosmic-ray factory, and they <b>point straight back</b>. That is why a neutrino telescope can name the sources of cosmic rays.');
}
