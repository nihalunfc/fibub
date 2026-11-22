// Class 10 Carbon: functional groups and IUPAC naming. Pick a group and a chain length n: the zigzag shows the carbon
// chain with the group coloured; the name is built from the root (meth, eth, prop...) plus a prefix (chloro-) or an
// ending (ol, al, one, oic acid), dropping the final 'e' of the alkane name before an ending that starts with a vowel.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

const NM = ['meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct'];
const G = {
  cl: { n: 'Halo (–Cl)', min: 1, label: 'Cl', hint: 'Prefix chloro- (or bromo-) with the alkane name.', name: (r) => `chloro${r}ane`, formula: (n) => `CH₃${'CH₂'.repeat(n - 1)}Cl`.replace(/CH₃CH₂/, 'CH₃CH₂') },
  ol: { n: 'Alcohol (–OH)', min: 1, label: 'OH', hint: 'Drop the final e of the alkane and add -ol.', name: (r) => `${r}anol`, formula: (n) => `${'CH₂'.repeat(n - 1)}`.length ? `CH₃${'CH₂'.repeat(n - 1)}OH` : 'CH₃OH' },
  al: { n: 'Aldehyde (–CHO)', min: 1, label: 'CHO', hint: 'Drop the final e and add -al. The CHO carbon is carbon 1.', name: (r) => `${r}anal`, formula: (n) => (n === 1 ? 'HCHO' : `CH₃${'CH₂'.repeat(n - 2)}CHO`) },
  one: { n: 'Ketone (>C=O)', min: 3, label: 'O', hint: 'Drop the final e and add -one. The C=O is inside the chain.', name: (r) => `${r}anone`, formula: (n) => `CH₃CO${n > 3 ? 'CH₂'.repeat(n - 3) : ''}CH₃`.replace(/CO(CH₂)+CH₃/, (m) => m) },
  acid: { n: 'Carboxylic acid (–COOH)', min: 1, label: 'COOH', hint: 'Drop the final e and add -oic acid. The COOH carbon is carbon 1.', name: (r) => `${r}anoic acid`, formula: (n) => (n === 1 ? 'HCOOH' : `CH₃${'CH₂'.repeat(n - 2)}COOH`) },
};
export default function (host) {
  let g = 'ol', n = 3;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'A carbon chain with a functional group and the name built from its parts' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Carbons n', min: 1, max: 8, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; fix(); } });
  choice(ctl, 'Group', Object.entries(G).map(([v, o]) => [v, o.n.split(' (')[0]]), g, (v) => { g = v; fix(); });
  const out = readout(host);
  function fix() { if (n < G[g].min) { n = G[g].min; sl.set(n); } say(); }
  const root = () => NM[n - 1];
  const nm = () => G[g].name(root());
  function say() {
    out.innerHTML = `<b>${nm()}</b>: ${G[g].formula(n)}. ${G[g].hint}${g === 'one' ? ' (A ketone needs at least 3 carbons.)' : ''}`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${G[g].n} on a ${n}-carbon chain`, col) + 12;
    const step = Math.min(40, (w - 80) / Math.max(1, n - 1 || 1)), x0 = (w - step * (n - 1)) / 2, cy = top + 70;
    const P = Array.from({ length: n }, (_, i) => [x0 + i * step, cy + (i % 2 ? -16 : 16)]);
    for (let i = 0; i < n - 1; i++) line(ctx, [P[i], P[i + 1]], col.ink, 2.4);
    P.forEach(([x, y], i) => { dot(ctx, x, y, 9, col.panel, col.s[0]); text(ctx, String(i + 1), x, y, { color: col.muted, size: 9, align: 'center', fit: false }); });
    const grp = (x, y, dx, dy, lab) => { line(ctx, [[x, y], [x + dx, y + dy]], col.s[1], 2.6); dot(ctx, x + dx, y + dy, 9, col.s[1]); text(ctx, lab, x + dx, y + dy + (dy > 0 ? 24 : -24), { color: col.s[1], size: 12, weight: 700, align: 'center' }); };
    const last = P[n - 1], dirY = (n - 1) % 2 ? -1 : 1;
    if (g === 'one') { const m = P[1]; line(ctx, [[m[0] - 3, m[1]], [m[0] - 3, m[1] - 28]], col.s[1], 2.6); line(ctx, [[m[0] + 3, m[1]], [m[0] + 3, m[1] - 28]], col.s[1], 2.6); dot(ctx, m[0], m[1] - 28, 13, col.s[1]); text(ctx, 'O', m[0], m[1] - 28, { color: col.panel, size: 11, weight: 700, align: 'center', fit: false }); text(ctx, 'carbonyl C=O on carbon 2', m[0], m[1] - 52, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
    else if (g === 'cl') grp(last[0], last[1], 42, -dirY * 8, 'Cl');
    else grp(last[0], last[1], 42, -dirY * 8, G[g].label);
    // name builder
    const by = cy + 62;
    const boxes = g === 'cl' ? [['chloro', 'prefix: the group'], [root() + 'ane', 'alkane name']] : [[root(), 'root: ' + n + ' carbon' + (n > 1 ? 's' : '')], [g === 'ol' ? 'an + ol' : g === 'al' ? 'an + al' : g === 'one' ? 'an + one' : 'an + oic acid', 'ending for the group']];
    const bw = Math.min(150, (w - 40) / 2);
    boxes.forEach(([a, b], i) => { const x = w / 2 - bw - 6 + i * (bw + 12); ctx.fillStyle = col.soft; ctx.fillRect(x, by, bw, 46); ctx.strokeStyle = i ? col.s[1] : col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(x, by, bw, 46); text(ctx, a, x + bw / 2, by + 16, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, b, x + bw / 2, by + 35, { color: col.muted, size: 10, align: 'center' }); });
    text(ctx, '→  ' + nm(), w / 2, by + 74, { color: col.s[2], size: 20, weight: 700, align: 'center' });
    text(ctx, G[g].formula(n), w / 2, by + 100, { color: col.ink, size: 13, align: 'center' });
  };
  say();
}
