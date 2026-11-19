// Why high energy is the key: neutrinos made in our own atmosphere fall off steeply with energy
// (about E^-3.7); a cosmic source with a flatter spectrum (about E^-2.5) takes over above a crossover.
// Slide the energy cut and the cosmic index and watch which wins. Amounts are illustrative, matched at 100 TeV.
import { stage, clear, text, line, plot, type Stage } from '../kit';

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: find the needle', title: 'Atmospheric neutrinos against cosmic ones', h: 360, alt: 'A log-log plot: the atmospheric line falls steeply, the cosmic line less steeply; they cross. A shaded region above the energy cut shows which kind dominates.', caption: 'Slopes: atmospheric about −3.7 (conventional neutrinos from pion and kaon decays), cosmic about −2.5 (near IceCube\'s measured values, which range from about −2.3 to −2.9 by sample). The heights are set to match at 100 TeV for illustration.' });
  let cut = 4.5, gam = 2.5, sweep = 0, touched = false;
  const cutS = s.slider('Energy cut', 3, 6.5, 0.05, cut, (v) => `${fmtE(10 ** v)} and up`, (v) => { cut = v; touched = true; });
  s.slider('Cosmic slope', 2, 3.2, 0.05, gam, (v) => `E^-${v.toFixed(2)}`, (v) => { gam = v; });
  s.play((dt) => {
    sweep += dt; if (!touched) { cut = 3 + 3.5 * (0.5 - 0.5 * Math.cos(sweep * 0.4)); cutS.set(+cut.toFixed(2)); }
    clear(s); const c = s.col;
    const box = { x: 70, y: 30, w: s.W - 100, h: s.H - 90 };
    const P = plot(s, box, [3, 7], [-12, 0], { xLabel: 'Neutrino energy', yLabel: 'Events (log scale)', xTicks: [3, 4, 5, 6, 7], xf: (v) => fmtE(10 ** v), yTicks: [-12, -9, -6, -3, 0], yf: (v) => `10^${v}` });
    const atm = (lg: number) => -3.7 * (lg - 5) - 3, cos = (lg: number) => -gam * (lg - 5) - 3;
    s.c.fillStyle = c.soft; s.c.fillRect(P.X(cut), box.y, P.X(7) - P.X(cut), box.h);
    const pts = (f: (x: number) => number) => Array.from({ length: 41 }, (_, i) => { const x = 3 + i * 0.1; return [P.X(x), P.Y(Math.max(-12, Math.min(0, f(x))))] as [number, number]; });
    line(s, pts(atm), c.muted, 2.5); line(s, pts(cos), c.amber, 2.5);
    text(s, 'made in our atmosphere', P.X(3.2), P.Y(atm(3.2)) + 18, { size: 12, colour: c.muted });
    text(s, 'from cosmic sources', P.X(6.1), P.Y(cos(6.1)) - 10, { size: 12, colour: c.amber, align: 'center' });
    line(s, [[P.X(cut), box.y], [P.X(cut), box.y + box.h]], c.ink, 1.5, [5, 4]);
    // Integrals above the cut (power laws): ∫ E^-g dE ∝ E^(1-g)/(g-1).
    const integ = (g: number, lg0: number) => { const E0 = 10 ** (lg0 - 5); return E0 ** (1 - g) / (g - 1); };
    const A = integ(3.7, cut), C = integ(gam, cut), f = C / (A + C);
    text(s, `Above ${fmtE(10 ** cut)}: ${(100 * f).toFixed(0)}% cosmic`, box.x + 10, box.y + 18, { bold: true });
    s.mark();
    s.out(`Above <b>${fmtE(10 ** cut)}</b> about <b>${(100 * f).toFixed(0)}%</b> of the neutrinos in this toy model are cosmic. A steeper atmospheric spectrum is why IceCube\'s 2013 search kept only the highest-energy events, starting inside the detector.`);
  });
}
function fmtE(gev: number) { return gev >= 1e6 ? `${+(gev / 1e6).toPrecision(2)} PeV` : gev >= 1e3 ? `${+(gev / 1e3).toPrecision(2)} TeV` : `${+gev.toPrecision(2)} GeV`; }
