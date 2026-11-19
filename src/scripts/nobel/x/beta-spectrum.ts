// Pauli's puzzle (1930): in beta decay the electron comes out with any energy up to a maximum, not one
// fixed energy. Decay nuclei one by one and watch the histogram grow; switch to "no neutrino" to see the
// single sharp line that energy conservation would demand if only two bodies came out.
// Spectrum shape: the allowed shape N(T) ∝ p·E·(Q − T)² (Fermi function left out), for bismuth-210
// ("radium E", the nucleus of the 1920s puzzle), Q ≈ 1.16 MeV.
import { stage, clear, text, dot, line, plot, rng, type Stage } from '../kit';

const Q = 1.16, ME = 0.511, BINS = 29;
const shape = (T: number) => { const E = T + ME, p = Math.sqrt(Math.max(0, E * E - ME * ME)); return p * E * (Q - T) ** 2; };
const PEAK = Math.max(...Array.from({ length: 200 }, (_, i) => shape((i / 200) * Q)));

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: Pauli\'s puzzle', title: 'Decay nuclei one at a time and record the electron\'s energy', h: 380, alt: 'A nucleus decays and sends out an electron; a histogram of electron energies builds up into a broad hump, not a single line.' , caption: 'Shape: the allowed beta spectrum for bismuth-210 (Q ≈ 1.16 MeV) without the small Coulomb correction. Each decay is drawn at random from it.' });
  const r = rng(7);
  let mode = 'real', counts = new Array(BINS).fill(0), n = 0, flash = 0, lastT = 0, auto = 0;
  const sample = () => { if (mode === 'none') return Q; for (;;) { const T = r() * Q; if (r() * PEAK < shape(T)) return T; } };
  const decay = (k: number) => { for (let i = 0; i < k; i++) { const T = sample(); lastT = T; counts[Math.min(BINS - 1, Math.floor((T / Q) * BINS))]++; n++; } flash = 1; };
  s.choice([['real', 'Real world'], ['none', 'If no neutrino existed']], mode, (v) => { mode = v; counts.fill(0); n = 0; });
  s.button('Decay 1', () => decay(1));
  s.button('Decay 500', () => decay(500));
  s.button('Clear', () => { counts.fill(0); n = 0; });
  s.play((dt) => {
    auto += dt; if (auto > 0.12) { auto = 0; decay(1); }
    flash = Math.max(0, flash - dt * 2);
    clear(s); const c = s.col;
    // The nucleus and its products.
    const nx = 110, ny = 120;
    dot(s, nx, ny, 26, c.amber, 0.85); text(s, 'Bi-210', nx, ny + 4, { align: 'center', size: 12, bold: true, colour: c.bg });
    const L = 30 + 70 * (lastT / Q);
    line(s, [[nx + 26, ny], [nx + 26 + L, ny - L * 0.5]], c.blue, 3);
    text(s, `electron ${lastT.toFixed(2)} MeV`, nx + 30 + L, ny - L * 0.5 - 6, { size: 12, colour: c.blue });
    if (mode === 'real') {
      const Ln = 30 + 70 * ((Q - lastT) / Q);
      line(s, [[nx + 26, ny + 4], [nx + 26 + Ln, ny + 4 + Ln * 0.45]], c.muted, 2, [5, 4]);
      text(s, `neutrino ${(Q - lastT).toFixed(2)} MeV (unseen)`, nx + 30 + Ln, ny + 18 + Ln * 0.45, { size: 12, colour: c.muted });
    }
    if (flash > 0) dot(s, nx, ny, 26 + 20 * (1 - flash), c.amber, flash * 0.4);
    text(s, `${n} decays recorded`, 20, 26, { bold: true });
    // Histogram.
    const box = { x: 330, y: 40, w: 290, h: 250 };
    const max = Math.max(5, ...counts);
    const P = plot(s, box, [0, Q], [0, max * 1.1], { xLabel: 'Electron energy (MeV)', yLabel: 'Number of decays', xTicks: [0, 0.4, 0.8, 1.16], xf: (v) => v.toFixed(2) });
    const bw = box.w / BINS;
    s.c.fillStyle = c.blue;
    counts.forEach((k, i) => { const h = P.Y(0) - P.Y(k); s.c.fillRect(box.x + i * bw + 1, P.Y(k), bw - 2, h); });
    if (n > 30 && mode === 'real') { const pts: [number, number][] = []; for (let i = 0; i <= 60; i++) { const T = (i / 60) * Q; pts.push([P.X(T), P.Y((shape(T) / PEAK) * max)]); } line(s, pts, c.amber, 2); }
    text(s, 'Q = 1.16 MeV: the energy the decay releases', 20, 330, { size: 12, colour: c.muted });
    s.mark();
    s.out(mode === 'real'
      ? `The electron takes <b>${lastT.toFixed(2)} MeV</b>. Energy is still conserved: the missing <b>${(Q - lastT).toFixed(2)} MeV</b> leaves with a particle no detector of 1930 could see. Pauli called it a "neutron"; Fermi renamed it the neutrino.`
      : 'With only two bodies flying apart, momentum and energy fix the electron\'s energy: every decay would land in the last bar. Experiments in the 1920s saw the broad hump instead.');
  });
}
