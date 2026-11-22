// Class 12 Biology, Reproductive Health: how prevention interrupts the spread of a sexually transmitted infection (STI) in a group. 60 people make random
// pairs each round; if one is infected the other catches it with a chance that falls when protection (such as condoms) is used. Treatment of the infected
// people (after testing) also ends their chain. A toy model with made-up numbers, to show the idea of prevention and early treatment.
import { canvas, text, title, dot, axes, line, row, slider, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let prot = 0, treat = 0, seed = 5, st, round, hist;
  const N = 60, cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Sixty people as dots, infected ones in red, with a graph of how many are infected over time' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'protection used in contacts', min: 0, max: 1, step: 0.05, value: 0, fmt: (v) => `${Math.round(v * 100)} %`, oninput: (v) => { prot = v; reset(); } });
  slider(ctl, { label: 'infected who get tested and treated each round', min: 0, max: 1, step: 0.05, value: 0, fmt: (v) => `${Math.round(v * 100)} %`, oninput: (v) => { treat = v; reset(); } });
  button(ctl, '↻ New run', () => { seed += 11; reset(); });
  let R;
  const reset = () => { R = rng(seed); st = Array.from({ length: N }, (_, i) => (i < 3 ? 1 : 0)); round = 0; hist = [3]; };
  const step = () => {
    const idx = Array.from({ length: N }, (_, i) => i).sort(() => R() - 0.5), nx = st.slice();
    for (let i = 0; i + 1 < N; i += 2) { const a = idx[i], b = idx[i + 1]; if (st[a] !== st[b] && R() < 0.6 * (1 - prot)) { nx[st[a] ? b : a] = 1; } }
    for (let i = 0; i < N; i++) if (st[i] === 1 && R() < treat) nx[i] = 0;
    st = nx; round++; hist.push(st.reduce((s, v) => s + v, 0));
  };
  reset();
  let acc = 0; loop(host, (dt) => { acc += dt; if (acc > 0.45 && round < 40) { acc = 0; step(); upd(); cv.redraw(); } });
  const upd = () => { const k = hist[hist.length - 1]; ro.textContent = `Round ${round}: ${k} of ${N} people infected. ${prot === 0 && treat === 0 ? 'No protection and no treatment: the infection spreads quickly.' : prot >= 0.8 || treat >= 0.5 ? 'Protection and treatment break the chains of infection: the number stays low or falls.' : 'Some protection or treatment slows the spread. Use both for the best result.'} (Toy model with invented numbers.)`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Spread of an infection in 60 people', col) + 4, gh = (h - top) * 0.5;
    const cols = 12, cw = (w - 20) / cols, ch = (gh - 4) / 5;
    for (let i = 0; i < N; i++) dot(ctx, 10 + (i % cols) * cw + cw / 2, top + 6 + Math.floor(i / cols) * ch + ch / 2, Math.min(cw, ch) * 0.34, st[i] ? col.bad : col.s[2], col.panel);
    const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, N], t: top + gh + 6, l: 46, b: 30, xt: [0, 10, 20, 30, 40], yt: [0, 20, 40, 60], xlabel: 'rounds', ylabel: 'infected' });
    line(ctx, hist.map((v, i) => [A.X(i), A.Y(v)]), col.bad, 2.5);
  };
  upd();
}
