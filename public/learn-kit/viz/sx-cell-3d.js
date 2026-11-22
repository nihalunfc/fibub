// Six crystal structures in 3D: simple, body-centred and face-centred cubic, hexagonal close-packed, diamond and rock salt.
// Drag to turn the cell. Switch between "Small atoms" (bonds show who is next to whom) and "Touching" (hard spheres),
// and read the atoms per cell, the coordination number and the packing fraction in the readout.
import { canvas, row, choice, readout, title, text, line } from '../kit.js';
import { orbit, wire, shapes } from './_3d.js';

const S3 = Math.sqrt(3), S2 = Math.sqrt(2);
const cube = (pts) => pts.map(([x, y, z]) => [x - 0.5, y - 0.5, z - 0.5]);
const corners = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
const faces = [[0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]];
const dia = [[0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]];
// hexagonal cell: a = 1, c = 1.633; model coordinates (x, up, z), centred
const hexC = 1.633, hc = [];
for (let i = 0; i < 6; i++) { const t = (i * Math.PI) / 3; hc.push([Math.cos(t), -hexC / 2, Math.sin(t)], [Math.cos(t), hexC / 2, Math.sin(t)]); }
const hexMid = [0, 1, 2].map((i) => { const t = Math.PI / 6 + (i * 2 * Math.PI) / 3; return [Math.cos(t) / S3, 0, Math.sin(t) / S3]; });
const hexFace = [[0, -hexC / 2, 0], [0, hexC / 2, 0]];

const T = {
  sc: { name: 'Simple cubic', at: cube(corners).map((p) => ({ p, k: 'c' })), r: 0.5, nn: 1, cn: 6, n: '8 corners × ⅛ = 1', pf: Math.PI / 6, rel: 'atoms touch along the edge: 4r = 2a, so r = a/2', cube: true },
  bcc: { name: 'Body-centred cubic', at: [...cube(corners).map((p) => ({ p, k: 'c' })), { p: [0, 0, 0], k: 'i' }], r: S3 / 4, nn: S3 / 2, cn: 8, n: '8 × ⅛ + 1 centre = 2', pf: (S3 * Math.PI) / 8, rel: 'atoms touch along the body diagonal: 4r = √3 a', cube: true },
  fcc: { name: 'Face-centred cubic', at: [...cube(corners).map((p) => ({ p, k: 'c' })), ...cube(faces).map((p) => ({ p, k: 'f' }))], r: S2 / 4, nn: S2 / 2, cn: 12, n: '8 × ⅛ + 6 × ½ = 4', pf: Math.PI / (3 * S2), rel: 'atoms touch along the face diagonal: 4r = √2 a', cube: true },
  hcp: { name: 'Hexagonal close-packed', at: [...hc.map((p) => ({ p, k: 'c' })), ...hexFace.map((p) => ({ p, k: 'f' })), ...hexMid.map((p) => ({ p, k: 'i' }))], r: 0.5, nn: 1, cn: 12, n: '12 × ⅙ + 2 × ½ + 3 = 6', pf: Math.PI / (3 * S2), rel: 'a = 2r and c = 1.633 a (ideal)', hex: true },
  dia: { name: 'Diamond', at: [...cube(corners).map((p) => ({ p, k: 'c' })), ...cube(faces).map((p) => ({ p, k: 'f' })), ...cube(dia).map((p) => ({ p, k: 'i' }))], r: S3 / 8, nn: S3 / 4, cn: 4, n: '8 × ⅛ + 6 × ½ + 4 = 8', pf: (S3 * Math.PI) / 16, rel: 'touching along the bond: 2r = (√3/4) a', cube: true },
};
// rock salt: Na+ (small) and Cl- (large), r(Na)=102 pm, r(Cl)=181 pm, touching along the edge
const rn = 102, rc = 181, aN = 2 * (rn + rc);
const salt = [];
for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) {
  const s = (i + j + k) % 2; // 0 = Cl at even sums, 1 = Na
  const p = [i / 2, j / 2, k / 2], edge = [i, j, k].filter((v) => v !== 1).length; // 3 corner, 2 edge-centre, 1 face, 0 body
  salt.push({ p: [p[0] - 0.5, p[1] - 0.5, p[2] - 0.5], k: edge === 3 ? 'c' : edge === 2 ? 'e' : edge === 1 ? 'f' : 'i', na: s === 1 });
}
T.nacl = { name: 'Rock salt (NaCl)', at: salt, r: rc / aN, rn: rn / aN, nn: 0.5, cn: 6, n: 'Cl⁻: 8 × ⅛ + 6 × ½ = 4; Na⁺: 12 × ¼ + 1 = 4', pf: (4 * (4 / 3) * Math.PI * (rn ** 3 + rc ** 3)) / aN ** 3, rel: 'ions touch along the edge: a = 2(r₊ + r₋) = 566 pm', cube: true };
const SHARE = { c: 'corner', f: 'face', i: 'inside', e: 'edge' };

export default function (host) {
  let kind = 'fcc', mode = 'small';
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 290, label: 'A crystal unit cell in 3D that can be turned' });
  const cam = orbit(cv, { yaw: 0.7, pitch: 0.4 });
  const ctl = row(host);
  choice(ctl, 'Structure', Object.entries(T).map(([k, v]) => [k, v.name]), kind, (v) => { kind = v; cv.redraw(); show(); });
  choice(ctl, 'Atoms', [['small', 'Small atoms'], ['touch', 'Touching']], mode, (v) => { mode = v; cv.redraw(); });
  const out = readout(host);
  function show() {
    const t = T[kind];
    out.innerHTML = `<b>${t.name}.</b> Atoms per cell: ${t.n}. Coordination number ${t.cn}. Packing fraction ${t.pf.toFixed(3)} (${(t.pf * 100).toFixed(1)}% of space is filled). ${t.rel.charAt(0).toUpperCase() + t.rel.slice(1)}.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const t = T[kind], sc = Math.min(w, h) * (t.hex ? (mode === "touch" ? 0.2 : 0.28) : mode === "touch" ? 0.3 : 0.45), P = cam.proj(w, h, sc, w / 2, h / 2 + 12);
    const edges = t.hex
      ? [0, 1].map((u) => hc.filter((_, i) => i % 2 === u).concat([hc[u]])).concat(hc.reduce((a, p, i) => (i % 2 ? a : [...a, [p, hc[i + 1]]]), []))
      : shapes.box(1, 1, 1);
    wire(ctx, P, edges, col.muted, 1.2);
    const pts = t.at.map((a) => ({ a, q: P(a.p) }));
    // bonds between nearest neighbours (small-atom view)
    if (mode === 'small') {
      const bonds = [];
      for (let i = 0; i < t.at.length; i++) for (let j = i + 1; j < t.at.length; j++) {
        const A = t.at[i], B = t.at[j], d = Math.hypot(A.p[0] - B.p[0], A.p[1] - B.p[1], A.p[2] - B.p[2]);
        if (Math.abs(d - t.nn) < 0.02 && !(kind === 'nacl' && A.na === B.na)) bonds.push([A.p, B.p]);
      }
      wire(ctx, P, bonds, col.s[1], 1.6);
    }
    pts.sort((x, y) => x.q[2] - y.q[2]).forEach(({ a, q }) => {
      const f = 1 / (1 - q[2] * 0.08), rr = (mode === 'touch' ? (a.na ? t.rn : t.r) : 0.09) * sc * f;
      const inside = a.k === 'i', c = kind === 'nacl' ? (a.na ? col.s[1] : col.s[2]) : inside ? col.s[5] : a.k === 'f' ? col.s[2] : col.s[0];
      ctx.globalAlpha = mode === "touch" ? 0.6 : 1;
      ctx.beginPath(); ctx.arc(q[0], q[1], Math.max(3, rr), 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
      ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.stroke();
    });
    title(ctx, t.name, col);
    const leg = kind === 'nacl' ? [['Cl⁻', col.s[2]], ['Na⁺', col.s[1]]] : [['corner', col.s[0]], ...(kind === 'sc' || kind === 'bcc' ? [] : [['face', col.s[2]]]), ...(kind === 'sc' || kind === 'fcc' ? [] : [['inside', col.s[5]]])];
    leg.forEach(([n, c], i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(16, h - 14 - i * 16, 5, 0, 7); ctx.fill(); text(ctx, n, 26, h - 14 - i * 16, { color: col.muted, size: 11 }); });
    text(ctx, 'Drag to turn', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' });
  };
  show();
}
