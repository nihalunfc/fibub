// Geometrical and optical isomers of octahedral complexes in 3D. Pick MA₄B₂ (cis, trans), MA₃B₃ (fac, mer) or MA₂B₂C₂ (five
// geometrical isomers, one of which has a mirror image), drag to turn, and press "Mirror image" to flip the whole molecule in a
// mirror. If the mirror image is the same molecule (it can be turned to match) the complex is achiral; if not, it is optically active.
import { canvas, text, row, choice, button, readout, loop, title } from '../kit.js';
import { orbit } from './_3d.js';

// positions in order +x, -x, +y, -y, +z, -z
const ISO = {
  cis: ['cis-[MA₄B₂]', [], false],
  trans: ['trans-[MA₄B₂]', 'BBAAAA'.split(''), false],
  fac: ['fac-[MA₃B₃] (three B on one face)', 'BABABA'.split(''), false],
  mer: ['mer-[MA₃B₃] (three B in a plane)', 'BBBAAA'.split(''), false],
  ttt: ['[MA₂B₂C₂] all trans', 'AABBCC'.split(''), false],
  tcc: ['[MA₂B₂C₂] A trans; B, C cis', 'AABCBC'.split(''), false],
  ctc: ['[MA₂B₂C₂] B trans; A, C cis', 'ABBACC'.split(''), false],
  cct: ['[MA₂B₂C₂] C trans; A, B cis', 'ABABCC'.split(''), false],
  ccc: ['[MA₂B₂C₂] all cis (chiral)', 'ACBACB'.split(''), true],
};
ISO.cis[1] = ['B', 'A', 'B', 'A', 'A', 'A'];
ISO.fac[1] = ['B', 'A', 'B', 'A', 'B', 'A'];
ISO.ccc[1] = ['A', 'B', 'A', 'C', 'B', 'C']; // +x A, -x B, +y A, -y C, +z B, -z C
ISO.tcc[1] = ['A', 'A', 'B', 'C', 'B', 'C'];
ISO.ctc[1] = ['B', 'B', 'A', 'C', 'A', 'C'];
ISO.cct[1] = ['A', 'B', 'A', 'B', 'C', 'C'];
const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const INFO = { cis: 'MA₄B₂ has 2 geometrical isomers; the cis form is polar (B ligands 90° apart).', trans: 'The two B ligands are opposite, so their pulls cancel: dipole moment zero. Achiral.', fac: 'MA₃B₃ has 2 geometrical isomers: fac (facial) and mer (meridional). Neither is chiral.', mer: 'Three B ligands lie in a plane (a "meridian").', ttt: 'MA₂B₂C₂ has 5 geometrical isomers, 6 stereoisomers in all.', tcc: 'One pair trans, the other two pairs cis.', ctc: 'One pair trans, the other two pairs cis.', cct: 'One pair trans, the other two pairs cis.', ccc: 'No pair is trans. It has no mirror plane, so it exists as a pair of enantiomers: press "Mirror image" and try to match them.' };
export default function (host) {
  let id = 'cis', mir = false;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'An octahedral complex with different ligands that can be turned in 3D and reflected in a mirror' });
  const cam = orbit(cv, { yaw: 0.6, pitch: 0.35 });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Isomer', Object.entries(ISO).map(([k, v]) => [k, k === 'ttt' ? 't,t,t' : k === 'tcc' ? 'A-trans' : k === 'ctc' ? 'B-trans' : k === 'cct' ? 'C-trans' : k === 'ccc' ? 'all cis' : k]), id, (v) => { id = v; mir = false; set(); });
  button(c2, 'Mirror image', () => { mir = !mir; set(); });
  loop(host, (dt) => { if (!cam.dragging) { cam.yaw += dt * 0.3; cv.redraw(); } });
  const out = readout(host);
  function set() {
    const [nm, , ch] = ISO[id];
    out.innerHTML = `<b>${nm}</b>${mir ? ' shown as its <b>mirror image</b>' : ''}. ${ch ? (mir ? 'This is the other enantiomer: it cannot be turned to look like the original.' : 'Chiral: it has an enantiomer (a non-superimposable mirror image).') : 'It has a plane of symmetry, so its mirror image is the same molecule: achiral, no optical activity.'} ${INFO[id]} Colours: A blue, B orange, C green.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const [nm, L] = ISO[id], P = cam.proj(w, h, Math.min(w, h) * 0.24, w / 2, h / 2 + 8), c0 = P([0, 0, 0]), colr = { A: col.s[0], B: col.s[1], C: col.s[2] };
    title(ctx, nm, col);
    const items = DIRS.map((d, k) => ({ q: P([mir ? -d[0] : d[0], d[1], d[2]].map((x) => x * 1.4)), l: L[k] })).sort((a, b) => a.q[2] - b.q[2]);
    let drawn = false;
    const metal = () => { ctx.beginPath(); ctx.arc(c0[0], c0[1], 12, 0, 7); ctx.fillStyle = col.muted; ctx.fill(); text(ctx, 'M', c0[0], c0[1], { color: col.bg, size: 11, weight: 700, align: 'center', fit: false }); };
    items.forEach((it) => {
      if (!drawn && it.q[2] > c0[2]) { metal(); drawn = true; }
      ctx.strokeStyle = col.muted; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(it.q[0], it.q[1]); ctx.stroke();
      const r = 13 + it.q[2] * 1.5; ctx.beginPath(); ctx.arc(it.q[0], it.q[1], r, 0, 7); ctx.fillStyle = colr[it.l]; ctx.fill();
      text(ctx, it.l, it.q[0], it.q[1], { color: col.bg, size: 12, weight: 800, align: 'center', fit: false });
    });
    if (!drawn) metal();
    text(ctx, 'Drag to turn', w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  set();
}
