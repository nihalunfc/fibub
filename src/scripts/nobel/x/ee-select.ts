// A chiral catalyst lowers the hill to one mirror-image product a little more than to the other.
// Molecules hop over the two hills at rates set by the Boltzmann factor; the product mixture shows the
// enantiomeric ratio er = exp(ΔΔG‡/RT) and excess ee = (er − 1)/(er + 1). Cooling the flask sharpens it.
import { stage, clear, text, dot, line, rng, type Stage } from '../kit';

const R = 8.314462618;
export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: a handed catalyst', title: 'How a small energy gap picks one hand', h: 350, alt: 'An energy diagram with two hills from one start to two products, R and S. Dots hop over the lower hill more often; counts of R and S grow.', caption: 'The heights are free energies of activation. Rates follow the Eyring/Boltzmann factor, so the product ratio depends only on the gap between the hills and the temperature (the same constants as the Reaction kinetics fitter).' });
  const r = rng(4);
  let dG = 8, T = 25, nR = 0, nS = 0, acc = 0;
  type M = { x: number; side: number; p: number };
  let ms: M[] = [];
  s.slider('Energy gap ΔΔG‡', 0, 16, 0.5, dG, (v) => `${v} kJ/mol`, (v) => { dG = v; nR = nS = 0; });
  s.slider('Temperature', -78, 80, 1, T, (v) => `${v} °C`, (v) => { T = v; nR = nS = 0; });
  s.button('Reset counts', () => { nR = nS = 0; });
  s.play((dt) => {
    const er = Math.exp((dG * 1000) / (R * (T + 273.15))), pR = er / (1 + er);
    acc += dt; while (acc > 0.04) { acc -= 0.04; ms.push({ x: 0, side: r() < pR ? 1 : -1, p: 0 }); }
    for (const m of ms) m.p += dt * 0.9;
    ms = ms.filter((m) => { if (m.p >= 1) { if (m.side > 0) nR++; else nS++; return false; } return true; });
    clear(s); const c = s.col;
    const cx = s.W / 2, base = s.H - 70, hR = 150, hS = 150 - dG * 6;
    const path = (sg: number, h: number) => { const pts: [number, number][] = []; for (let i = 0; i <= 50; i++) { const u = i / 50; pts.push([cx + sg * u * (s.W * 0.4), base - h * Math.sin(Math.PI * u) - (u > 0.5 ? -20 * (u - 0.5) * 2 : 0)]); } return pts; };
    line(s, path(1, hS), c.teal, 3); line(s, path(-1, hR), c.amber, 3);
    text(s, 'R product', cx + s.W * 0.4, base + 34, { align: 'center', colour: c.teal, bold: true });
    text(s, 'S product', cx - s.W * 0.4, base + 34, { align: 'center', colour: c.amber, bold: true });
    text(s, 'start', cx, base + 22, { align: 'center', size: 12, colour: c.muted });
    if (dG > 0) { line(s, [[cx + s.W * 0.2, base - hS], [cx - s.W * 0.2, base - hS]], c.muted, 1, [4, 4]); text(s, `ΔΔG‡ = ${dG} kJ/mol`, cx, base - hR - 8, { align: 'center', size: 12 }); line(s, [[cx - s.W * 0.2, base - hR], [cx - s.W * 0.2, base - hS]], c.ink, 1.5); }
    for (const m of ms) { const u = m.p; const h = m.side > 0 ? hS : hR; dot(s, cx + m.side * u * s.W * 0.4, base - h * Math.sin(Math.PI * u) - (u > 0.5 ? -20 * (u - 0.5) * 2 : 0) - 6, 4, m.side > 0 ? c.teal : c.amber); }
    const tot = nR + nS, ee = tot ? (nR - nS) / tot : 0, eeT = (er - 1) / (er + 1);
    text(s, `Made: R ${nR} · S ${nS} · counted ee ${(100 * ee).toFixed(0)}%`, 14, 24, { bold: true });
    s.mark();
    s.out(`At ${T} °C a gap of <b>${dG} kJ/mol</b> gives R:S = <b>${er.toFixed(er < 10 ? 2 : 0)} : 1</b>, an enantiomeric excess of <b>${(100 * eeT).toFixed(1)}%</b>. About 11 kJ/mol (the energy of a weak hydrogen bond) is enough for 98% ee at room temperature. Cooling helps: the same gap gives a bigger ratio when molecules have less heat energy.`);
  });
}
