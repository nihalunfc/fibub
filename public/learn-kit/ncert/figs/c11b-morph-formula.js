// Class 11 Biology, Morphology of Flowering Plants: a floral formula builder. A floral formula is a short code for a flower: symmetry (⊕ actinomorphic or % zygomorphic), sex (⚥ bisexual),
// K calyx, C corolla, A androecium, G gynoecium with the number of parts; a number in brackets means the parts are fused; a line under G means a superior ovary, a line over G an inferior ovary.
// The floral diagram (top view) is drawn from the same numbers. Load a preset or build your own.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';
import { ell, rr, note } from '../c11b-lib.js';

const PRE = { mus: ['Mustard', 'act', 4, false, 4, false, 6, false, 2, true, 'sup', 'Brassicaceae: sepals 2 + 2, four petals in a cross, 6 stamens (2 short + 4 long), two fused carpels.'], tom: ['Tomato', 'act', 5, true, 5, true, 5, false, 2, true, 'sup', 'Solanaceae: five fused sepals, five fused petals, five stamens attached to the petals, two fused carpels.'], pea: ['Pea', 'zyg', 5, true, 5, false, 10, true, 1, false, 'sup', 'Fabaceae: the real formula is K(5) C1+2+(2) A(9)+1 G1. Here the stamens are shown simply as ten joined stamens.'] };
export default function (host) {
  let sym = 'act', K = 4, Kf = false, C = 4, Cf = false, A = 6, Af = false, G = 2, Gf = true, ov = 'sup', note0 = PRE.mus[11];
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 300, label: 'A floral formula built from symmetry, sepals, petals, stamens, carpels and ovary position, with a top-view floral diagram' });
  const ctl = row(host), ro = readout(host);
  const set = {};
  choice(ctl, 'Preset', [['mus', 'Mustard'], ['tom', 'Tomato'], ['pea', 'Pea'], ['own', 'My own']], 'mus', (v) => { if (v === 'own') return; const p = PRE[v]; sym = p[1]; K = p[2]; Kf = p[3]; C = p[4]; Cf = p[5]; A = p[6]; Af = p[7]; G = p[8]; Gf = p[9]; ov = p[10]; note0 = p[11]; set.K.set(K); set.C.set(C); set.A.set(A); set.G.set(G); go(); });
  choice(ctl, 'Symmetry', [['act', 'Actinomorphic ⊕'], ['zyg', 'Zygomorphic %']], sym, (v) => { sym = v; go(); });
  set.K = slider(ctl, { label: 'sepals (K)', min: 0, max: 5, step: 1, value: K, oninput: (v) => { K = v; go(); } });
  choice(ctl, 'Sepals', [[false, 'free'], [true, 'fused']], Kf, (v) => { Kf = v; go(); });
  set.C = slider(ctl, { label: 'petals (C)', min: 0, max: 5, step: 1, value: C, oninput: (v) => { C = v; go(); } });
  choice(ctl, 'Petals', [[false, 'free'], [true, 'fused']], Cf, (v) => { Cf = v; go(); });
  set.A = slider(ctl, { label: 'stamens (A)', min: 0, max: 10, step: 1, value: A, oninput: (v) => { A = v; go(); } });
  choice(ctl, 'Stamens', [[false, 'free'], [true, 'fused']], Af, (v) => { Af = v; go(); });
  set.G = slider(ctl, { label: 'carpels (G)', min: 1, max: 5, step: 1, value: G, oninput: (v) => { G = v; go(); } });
  choice(ctl, 'Carpels', [[false, 'free (apocarpous)'], [true, 'fused (syncarpous)']], Gf, (v) => { Gf = v; go(); });
  choice(ctl, 'Ovary', [['sup', 'Superior'], ['inf', 'Inferior']], ov, (v) => { ov = v; go(); });
  const part = (l, n, f) => n === 0 ? l + '0' : f ? `${l}(${n})` : `${l}${n}`;
  const formula = () => `${sym === 'act' ? '⊕' : '%'} ⚥ ${part('K', K, Kf)} ${part('C', C, Cf)} ${part('A', A, Af)} ${ov === 'sup' ? 'G̲' : 'G̅'}${Gf && G > 1 ? '(' + G + ')' : G}`;
  const go = () => { ro.textContent = `Formula: ${formula()}.  ${note0 || ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, 'Floral formula and floral diagram', col), cx = w / 2, fy = y0 + 22;
    rr(ctx, 10, y0 + 4, w - 20, 40, 8, col.soft, col.line); text(ctx, formula(), cx, fy + 1, { color: col.ink, size: Math.min(22, (w - 40) / 11), weight: 700, align: 'center' });
    const cy = y0 + 150, R = Math.min(w / 2 - 20, 92);
    const ring = (n, r, f, fn) => { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; fn(a, i); } if (f && n > 1) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.stroke(); } };
    // axis (top) mark
    ell(ctx, cx, cy - R - 10, 3, 3, col.muted, null, 0); text(ctx, 'axis', cx + 8, cy - R - 10, { color: col.muted, size: 9.5 });
    ring(K, R, Kf, (a) => { ctx.beginPath(); ctx.arc(cx, cy, R, a - 0.38, a + 0.38); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 7; ctx.stroke(); });
    ring(C, R * 0.72, Cf, (a, i) => { const big = sym === 'zyg' && i === 0 ? 1.45 : 1; ell(ctx, cx + Math.cos(a) * R * 0.72 * (sym === 'zyg' && i === 0 ? 1.12 : 1), cy + Math.sin(a) * R * 0.72 * (sym === 'zyg' && i === 0 ? 1.12 : 1), 14 * big, 14 * big, col.s[5], col.ink, 1.5, 0.75); });
    ring(A, R * 0.45, Af, (a) => ell(ctx, cx + Math.cos(a) * R * 0.45, cy + Math.sin(a) * R * 0.45, 5, 5, col.s[4], col.ink, 1.2, 0.95));
    if (G > 0) { if (Gf) { ell(ctx, cx, cy, R * 0.22, R * 0.22, col.s[2], col.ink, 1.8, 0.55); for (let i = 0; i < G; i++) { const a = i * 2 * Math.PI / G; ell(ctx, cx + (G > 1 ? Math.cos(a) * R * 0.11 : 0), cy + (G > 1 ? Math.sin(a) * R * 0.11 : 0), 3, 3, col.ink, null, 0); } } else for (let i = 0; i < G; i++) { const a = i * 2 * Math.PI / G; ell(ctx, cx + (G > 1 ? Math.cos(a) * R * 0.14 : 0), cy + (G > 1 ? Math.sin(a) * R * 0.14 : 0), 7, 7, col.s[2], col.ink, 1.4, 0.7); } }
    text(ctx, 'sepals', 12, cy - R * 0.6, { color: col.s[1], size: 10, weight: 700 }); text(ctx, 'petals', 12, cy - R * 0.3, { color: col.s[5], size: 10, weight: 700 }); text(ctx, 'stamens', 12, cy, { color: col.s[4], size: 10, weight: 700 }); text(ctx, 'carpels', 12, cy + R * 0.3, { color: col.s[2], size: 10, weight: 700 });
    note(ctx, 'Ring joined = fused. Line under G = superior ovary; line over G = inferior ovary.', 12, h - 30, w - 24, col, { size: 10.5, color: col.muted });
  };
  go();
}
