// Class 11 Cell: how big are cells and what can we see? Sizes on a log scale from an atom to a blue whale, with the smallest thing that the eye (about 0.1 mm), a light microscope
// (about 0.2 µm) and an electron microscope (about 0.2 nm in practice for cells, 1 nm used here) can resolve. Objects smaller than the limit are greyed out.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { ellipse } from '../c11b-ex-util.js';

const OBJ = [
  ['hydrogen atom', 1e-10], ['glucose', 1e-9], ['haemoglobin', 6.5e-9], ['ribosome', 2.5e-8], ['virus (HIV)', 1.2e-7], ['mycoplasma', 3e-7], ['E. coli', 2e-6],
  ['mitochondrion', 1e-6], ['red blood cell', 7e-6], ['human cheek cell', 6e-5], ['human egg', 1.2e-4], ['ostrich egg cell', 0.15], ['neuron (length)', 1],
];
const LIM = { eye: [1e-4, 'the naked eye (about 0.1 mm)'], lm: [2e-7, 'a light microscope (about 0.2 µm)'], em: [1e-9, 'an electron microscope (about 1 nm)'] };
export default function (host) {
  let ins = 'eye';
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A logarithmic scale of sizes from atoms to a neuron, showing which objects each instrument can resolve' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Look with', [['eye', 'Eye'], ['lm', 'Light microscope'], ['em', 'Electron microscope']], ins, (v) => { ins = v; go(); });
  const go = () => { const lim = LIM[ins][0], seen = OBJ.filter((o) => o[1] >= lim).map((o) => o[0]); ro.textContent = `With ${LIM[ins][1]} you can see: ${seen.join(', ')}. Cell structure and organelles need a light microscope; ribosomes and membranes need an electron microscope.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Sizes on a log scale: each step is 10 times', col);
    const L = 70, R = w - 16, T = t0 + 14, B = h - 30, lo = -10.5, hi = 0.5, Y = (v) => B - ((Math.log10(v) - lo) / (hi - lo)) * (B - T);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.stroke();
    const U = { '-10': '0.1 nm', '-9': '1 nm', '-8': '10 nm', '-7': '100 nm', '-6': '1 µm', '-5': '10 µm', '-4': '100 µm', '-3': '1 mm', '-2': '1 cm', '-1': '10 cm', '0': '1 m' };
    for (let e = -10; e <= 0; e++) { const y = Y(10 ** e); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); text(ctx, U[e], L - 6, y, { color: col.muted, size: 10, align: 'right', fit: false }); }
    const ly = Y(LIM[ins][0]); ctx.fillStyle = col.s[2] + '33'; ctx.fillRect(L, T, R - L, ly - T); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(L, ly); ctx.lineTo(R, ly); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'visible', R - 4, ly - 9, { color: col.s[2], size: 10.5, weight: 700, align: 'right', fit: false });
    OBJ.forEach(([n, s], i) => { const y = Y(s), vis = s >= LIM[ins][0], x = L + 26 + (i % 2) * ((R - L) * 0.34) + (i % 3) * 8; ellipse(ctx, x, y, 4.5, 4.5, vis ? col.s[0] : col.muted, null); text(ctx, `${n}`, x + 9, y, { color: vis ? col.ink : col.muted, size: 10.5, weight: vis ? 700 : 400, fit: false }); });
  };
  go();
}
