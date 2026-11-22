// Body cross-sections of animals. Pick the kind of body cavity (acoelomate, pseudocoelomate, coelomate) or the symmetry, and
// the drawing shows the three germ layers: ectoderm outside, endoderm lining the gut, and mesoderm in between. The key
// question is whether the cavity is completely lined by mesoderm (a true coelom), only partly (pseudocoelom) or absent.
import { canvas, row, choice, readout, text, title } from '../kit.js';

const PLANS = {
  acoel: { n: 'Acoelomate', ex: 'flatworms (Platyhelminthes)', t: 'No body cavity: mesoderm fills the space between ectoderm and gut.' },
  pseudo: { n: 'Pseudocoelomate', ex: 'roundworms (Aschelminthes)', t: 'A cavity exists, but mesoderm lines only the outside of it; the gut wall has endoderm only.' },
  coel: { n: 'Coelomate', ex: 'annelids, arthropods, molluscs, chordates', t: 'Cavity fully lined by mesoderm (a true coelom): organs sit in it and can move independently.' },
};
export default function (host) {
  let plan = 'coel', sym = 'bilateral';
  const cv = canvas(host, { aspect: 0.85, max: 360, min: 290, label: 'Cross-section of an animal body showing germ layers and body cavity' });
  const c = row(host), c2 = row(host);
  choice(c, 'Body cavity', Object.entries(PLANS).map(([k, v]) => [k, v.n]), plan, (v) => { plan = v; show(); });
  choice(c2, 'Symmetry lines', [['bilateral', 'Bilateral'], ['radial', 'Radial'], ['none', 'Asymmetric']], sym, (v) => { sym = v; show(); });
  const out = readout(host);
  function show() { const p = PLANS[plan]; out.innerHTML = `<b>${p.n}</b> (${p.ex}). ${p.t} Symmetry: ${sym === 'bilateral' ? 'bilateral (one plane splits the body into mirror halves; most animals, with a head end)' : sym === 'radial' ? 'radial (any plane through the centre; cnidarians and echinoderm adults)' : 'asymmetric (no plane; many sponges)'}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, PLANS[plan].n + ' body (cross-section)', col);
    const cx = w / 2, cy = h * 0.44, R = Math.min(w * 0.34, h * 0.32), ry = R * (sym === 'bilateral' ? 0.8 : 1);
    const ell = (rx, ryy, c, a = 1, stroke) => { ctx.beginPath(); ctx.ellipse(cx, cy, rx, ryy, 0, 0, 7); ctx.fillStyle = c; ctx.globalAlpha = a; ctx.fill(); ctx.globalAlpha = 1; if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); } };
    ell(R, ry, col.s[0], 0.55, col.s[0]);
    const mR = R * 0.92, mRy = ry * 0.92;
    ell(mR, mRy, col.s[1], 0.5);
    if (plan === 'acoel') { ell(R * 0.3, ry * 0.3, col.s[2], 0.7, col.s[2]); }
    if (plan === 'pseudo') { ell(R * 0.6, ry * 0.6, col.panel, 1); ell(R * 0.3, ry * 0.3, col.s[2], 0.7, col.s[2]); }
    if (plan === 'coel') { ell(R * 0.6, ry * 0.6, col.panel, 1, col.s[1]); ell(R * 0.3, ry * 0.3, col.s[2], 0.7, col.s[2]); ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.34, ry * 0.34, 0, 0, 7); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.stroke(); }
    if (plan === 'pseudo') { ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.6, ry * 0.6, 0, 0, 7); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.setLineDash([6, 4]); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
    const ln = (a) => { ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * (R + 12), cy - Math.sin(a) * (ry + 12)); ctx.lineTo(cx + Math.cos(a) * (R + 12), cy + Math.sin(a) * (ry + 12)); ctx.stroke(); };
    if (sym === 'bilateral') ln(Math.PI / 2); else if (sym === 'radial') [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4].forEach(ln); ctx.setLineDash([]);
    const lab = (s, x, y, c, al = 'left') => text(ctx, s, x, y, { color: c, size: 10.5, weight: 700, align: al, fit: true });
    lab('ectoderm', 10, h - 34, col.s[0]); lab('mesoderm', w * 0.36, h - 34, col.s[1]); lab('endoderm (gut)', w * 0.64, h - 34, col.s[2]);
    text(ctx, plan === 'acoel' ? 'solid mesoderm, no cavity' : plan === 'pseudo' ? 'pseudocoelom: mesoderm on the outer side only' : 'coelom: mesoderm on both sides', cx, h - 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, 'gut', cx, cy, { color: '#fff', size: 10, weight: 700, align: 'center', fit: false });
  };
  show();
}
