// Class 12 Nuclei: isotopes, isobars and isotones. A nuclide is fixed by its proton number Z and neutron number N (mass number A = Z + N).
// Same Z, different N: isotopes (same element, same chemistry). Same A: isobars. Same N: isotones. Pick a reference nuclide and build your own to compare.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const SYM = 'n H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn'.split(' ');
const REF = { c12: [6, 6], o16: [8, 8], na23: [11, 12] };

export default function (host) {
  let Z = 6, N = 8, ref = 'c12';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'Two nuclei drawn as clusters of protons and neutrons, with the relation between them named' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Reference', [['c12', 'C-12'], ['o16', 'O-16'], ['na23', 'Na-23']], ref, (v) => { ref = v; go(); });
  slider(ctl, { label: 'protons Z', min: 1, max: 20, step: 1, value: Z, fmt: (v) => String(v), oninput: (v) => { Z = Math.round(v); go(); } });
  slider(ctl, { label: 'neutrons N', min: 0, max: 30, step: 1, value: N, fmt: (v) => String(v), oninput: (v) => { N = Math.round(v); go(); } });
  const rel = () => {
    const [z0, n0] = REF[ref], a0 = z0 + n0, a = Z + N;
    if (Z === z0 && N === n0) return 'the same nuclide';
    if (Z === z0) return 'ISOTOPES (same Z, different N and A)';
    if (a === a0) return 'ISOBARS (same A, different Z)';
    if (N === n0) return 'ISOTONES (same N, different Z)';
    return 'no special relation';
  };
  const go = () => { const [z0, n0] = REF[ref]; ro.textContent = `Reference ${SYM[z0]}-${z0 + n0} (Z = ${z0}, N = ${n0}). Yours: ${SYM[Z]}-${Z + N} (Z = ${Z}, N = ${N}, A = ${Z + N}). Relation: ${rel()}.`; cv.redraw(); };
  const cluster = (ctx, col, cx, cy, z, n, lab) => {
    const A = z + n, sp = 7.6, ph = Math.PI * (3 - Math.sqrt(5)), order = [];
    for (let i = 0; i < A; i++) order.push(i < z ? 'p' : 'n');
    for (let i = order.length - 1; i > 0; i--) { const j = (i * 7 + 3) % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
    for (let i = 0; i < A; i++) { const r = sp * Math.sqrt(i + 0.5), a = i * ph; ctx.beginPath(); ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 4.2, 0, 7); ctx.fillStyle = order[i] === 'p' ? col.s[3] : col.s[0]; ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.stroke(); }
    text(ctx, lab, cx, cy + 70, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, `${z} p + ${n} n`, cx, cy + 87, { color: col.muted, size: 11, align: 'center' });
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Nuclides: protons orange, neutrons blue', col), cy = top + 64;
    const [z0, n0] = REF[ref];
    cluster(ctx, col, w * 0.27, cy, z0, n0, `reference: ${z0 + n0}${SYM[z0]}`); cluster(ctx, col, w * 0.73, cy, Z, N, `yours: ${Z + N}${SYM[Z]}`);
    ctx.fillStyle = col.ink; text(ctx, rel(), w / 2, h - 30, { color: col.s[2], size: 13, weight: 700, align: 'center' });
    text(ctx, 'Clusters are only a sketch of the count.', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
