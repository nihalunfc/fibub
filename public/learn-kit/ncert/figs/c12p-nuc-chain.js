// Class 12 Nuclei: a fission chain reaction. Each fission of U-235 frees about 2.5 neutrons; the multiplication factor k is the number of those that go on to cause another fission
// (the rest are absorbed or escape). k < 1: the chain dies; k = 1: steady (a reactor); k > 1: it grows out of control (a bomb). Moderator slows neutrons (raising k); control rods absorb them (lowering k).
// The bars show the neutrons in each generation, ten generations from one starting neutron.
import { canvas, text, title, axes, line, dot, row, slider, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let kbase = 1.0, rods = 0, g = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'Neutrons in each generation of a chain reaction for a chosen multiplication factor' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'fuel and moderator: k with rods out', min: 0.5, max: 1.6, step: 0.05, value: kbase, fmt: (v) => v.toFixed(2), oninput: (v) => { kbase = v; go(); } });
  slider(ctl, { label: 'control rods pushed in', min: 0, max: 100, step: 5, value: rods, fmt: (v) => v + ' %', oninput: (v) => { rods = v; go(); } });
  const anim = loop(host, (dt) => { t += dt; if (t > 0.5) { t = 0; g = (g + 1) % 11; cv.redraw(); } });
  anim.button(ctl);
  const k = () => kbase * (1 - rods / 100 * 0.5);
  const go = () => { const K = k(); ro.textContent = `Effective k = ${K.toFixed(2)}: ${K < 0.995 ? 'SUBCRITICAL, the chain fizzles out' : K <= 1.005 ? 'CRITICAL, a steady chain (power station)' : 'SUPERCRITICAL, the neutron count grows ' + (K ** 10).toFixed(0) + '-fold in 10 generations'}. Each fission frees about 200 MeV.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Neutrons in each generation', col), K = k(), n = (i) => K ** i;
    const mx = Math.max(2, ...Array.from({ length: 11 }, (_, i) => n(i)));
    const A = axes(ctx, w, h, col, { x: [0, 10.8], y: [0, mx * 1.1], xlabel: 'generation', ylabel: 'neutrons', l: 44, t: top + 8, b: 40, fx: (v) => String(Math.round(v)), fy: (v) => String(+v.toFixed(1)) });
    for (let i = 0; i <= 10; i++) { const x0 = A.X(i) - 9, y = A.Y(n(i)); ctx.fillStyle = i <= g ? (K > 1.005 ? col.s[3] : K < 0.995 ? col.s[0] : col.s[2]) : col.line; ctx.fillRect(x0, y, 18, A.B - y); }
    const cur = n(g);
    text(ctx, `generation ${g}: ${cur < 100 ? cur.toFixed(1) : cur.toFixed(0)} neutrons`, A.R - 4, A.T + 12, { color: col.ink, size: 11.5, weight: 700, align: 'right', halo: col.panel });
  };
  go();
}
