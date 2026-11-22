// Nucleophilic addition to C=O in four steps. The carbonyl carbon is δ+ and flat; the nucleophile attacks from the side at about
// 107° (the Bürgi-Dunitz angle), the C=O π pair moves onto O, the carbon becomes tetrahedral (sp³), and O⁻ picks up H⁺. Pick the
// nucleophile and the carbonyl compound; the bars compare reactivity (methanal > ethanal > propanone: fewer alkyl groups means
// less crowding and more δ+). Works as a step player or on its own with Back and Next.
import { canvas, text, row, choice, button, readout, title } from '../kit.js';
import { mol, curved } from './_chem.js';

const NU = { cn: ['CN⁻ (HCN, trace base)', 'CN', 'cyanohydrin'], h: ['H⁻ (NaBH₄ or LiAlH₄)', 'H', 'alcohol'], me: ['CH₃⁻ (CH₃MgBr, then H₃O⁺)', 'CH₃', 'alcohol with one more carbon'] };
const CO = { hcho: ['Methanal', 'H', 'H', 1], cho: ['Ethanal', 'H', 'CH₃', 0.6], ket: ['Propanone', 'CH₃', 'CH₃', 0.25] };
const S = ['The carbonyl carbon is electron-poor', 'The nucleophile attacks the carbon', 'Tetrahedral alkoxide intermediate', 'Protonation gives the product'];
export default function (host) {
  let i = 0, nu = 'cn', co = 'cho';
  const cv = canvas(host, { aspect: 0.78, max: 380, min: 290, label: 'Nucleophilic addition to a carbonyl group drawn step by step with a reactivity bar chart' });
  choice(row(host), 'Nucleophile', Object.entries(NU).map(([k, v]) => [k, v[1] + '⁻']), nu, (v) => { nu = v; go(i); });
  choice(row(host), 'Carbonyl', Object.entries(CO).map(([k, v]) => [k, v[0]]), co, (v) => { co = v; go(i); });
  const own = !host.classList.contains('lk-stage');
  if (own) { const c = row(host); button(c, '◀ Back', () => go(i - 1)); button(c, 'Next ▶', () => go(i + 1)); }
  const out = readout(host);
  function go(k) {
    i = Math.max(0, Math.min(3, k));
    const t = [
      `In ${CO[co][0].toLowerCase()} the oxygen pulls the C=O electrons toward itself (O is more electronegative), so C is δ+ and O is δ−. Fewer or smaller groups on C make it more reactive (bars below).`,
      `The nucleophile ${NU[nu][0]} uses its lone pair to bond to C. The C=O π electrons are pushed onto O. The carbon is attacked from above or below the plane at about 107°.`,
      `C now has four groups: sp³, tetrahedral. O carries the negative charge (alkoxide). This step is reversible for weak nucleophiles such as CN⁻.`,
      `H⁺ (from HCN or water or dilute acid) adds to O⁻, giving the ${NU[nu][2]} product${co === 'hcho' && nu === 'h' ? ' (methanol, a 1° alcohol)' : co === 'cho' && nu === 'h' ? ' (ethanol, 1°)' : co === 'ket' && nu === 'h' ? ' (propan-2-ol, 2°)' : ''}. Aldehydes give 1° (2° with Grignard) and ketones give 2° (3° with Grignard) alcohols.`,
    ][i];
    out.innerHTML = `<b>Step ${i + 1}: ${S[i]}.</b> ${t}`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, S[i], col);
    const u = Math.min(w / 6.5, 52), ox = w * 0.5, oy = h * 0.34 + 14, sz = Math.max(11, Math.min(14, u * 0.28)), P = (a) => [ox + a.x * u, oy + a.y * u];
    const [, r1, r2] = CO[co], nuL = NU[nu][1];
    let A, B;
    if (i === 0) { A = [{ x: 0, y: 0, l: 'C', c: col.s[1] }, { x: 0, y: -1.3, l: 'O', c: col.s[0] }, { x: -1.15, y: 0.7, l: r1 }, { x: 1.15, y: 0.7, l: r2 }]; B = [{ a: 0, b: 1, o: 2 }, { a: 0, b: 2 }, { a: 0, b: 3 }]; text(ctx, 'δ+', ox + 0.35 * u, oy + 0.1 * u, { color: col.s[1], size: 11, weight: 700 }); text(ctx, 'δ−', ox + 0.45 * u, oy - 1.45 * u, { color: col.s[0], size: 11, weight: 700 }); ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(...P({ x: -2.7, y: -1.9 })); ctx.lineTo(...P({ x: -0.3, y: -0.2 })); ctx.stroke(); ctx.restore(); text(ctx, 'Nu⁻ path', ox - 2.9 * u, oy - 1.65 * u, { color: col.muted, size: 10 }); text(ctx, '≈107° to C=O', ox - 2.6 * u, oy - 0.85 * u, { color: col.muted, size: 10 }); }
    if (i === 1) { A = [{ x: 0, y: 0, l: 'C', c: col.s[1] }, { x: 0, y: -1.3, l: 'O', c: col.s[0] }, { x: -1.15, y: 0.7, l: r1 }, { x: 1.15, y: 0.7, l: r2 }, { x: -2.4, y: -1.5, l: nuL + '⁻', c: col.s[2] }]; B = [{ a: 0, b: 1, o: 2 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 4, b: 0, dash: true }]; const n = P(A[4]), c = P(A[0]), o = P(A[1]); curved(ctx, n[0] + 12, n[1] + 4, c[0] - 8, c[1] - 6, col.s[2], 14); curved(ctx, c[0] + 4, (c[1] + o[1]) / 2 + 4, o[0] + 16, o[1] + 2, col.s[1], -16); }
    if (i === 2) { A = [{ x: 0, y: 0, l: 'C' }, { x: 0, y: -1.3, l: 'O⁻', c: col.s[0] }, { x: -1.15, y: 0.7, l: r1 }, { x: 1.15, y: 0.7, l: r2 }, { x: -1.4, y: -0.75, l: nuL, c: col.s[2] }]; B = [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }]; text(ctx, 'sp³', ox + 0.4 * u, oy + 0.35 * u, { color: col.muted, size: 11, weight: 700 }); }
    if (i === 3) { A = [{ x: 0, y: 0, l: 'C' }, { x: 0, y: -1.3, l: 'OH', c: col.s[0] }, { x: -1.15, y: 0.7, l: r1 }, { x: 1.15, y: 0.7, l: r2 }, { x: -1.4, y: -0.75, l: nuL, c: col.s[2] }]; B = [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }]; text(ctx, 'H⁺ added to O⁻', ox + 1.6 * u, oy - 1.3 * u, { color: col.s[1], size: 11, weight: 700 }); }
    mol(ctx, A, B, col, u, ox, oy, { size: sz });
    // reactivity bars
    const by = h - 62; text(ctx, 'relative reactivity toward Nu⁻', 10, by - 4, { color: col.muted, size: 10 });
    Object.entries(CO).forEach(([k, v], j) => { const y = by + 8 + j * 14, bw = (w - 150) * v[3]; ctx.fillStyle = k === co ? col.s[1] : col.s[0]; ctx.globalAlpha = k === co ? 1 : 0.4; ctx.fillRect(84, y - 5, Math.max(3, bw), 9); ctx.globalAlpha = 1; text(ctx, v[0], 10, y, { color: k === co ? col.ink : col.muted, size: 10, weight: k === co ? 700 : 400 }); });
  };
  go(0);
  return { step: (k) => go(k) };
}
