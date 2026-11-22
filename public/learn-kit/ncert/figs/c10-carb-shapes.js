// Class 10 Carbon: carbon atoms join in straight chains, branched chains and rings, and with double bonds. Pick a
// structure: each carbon is labelled CHn, where n = 4 minus the bonds it already uses (valency 4). Three different
// molecules share the formula C5H12 (isomers); their boiling points differ because branched molecules pack less tightly.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

const S = {
  pen: { n: 'Pentane (chain)', bp: '36 °C', xy: [[0.1, 0.6], [0.3, 0.4], [0.5, 0.6], [0.7, 0.4], [0.9, 0.6]], e: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1]], note: 'A straight chain of 5 carbons. Boils at 36 °C.' },
  iso: { n: '2-Methylbutane (one branch)', bp: '28 °C', xy: [[0.1, 0.6], [0.3, 0.4], [0.5, 0.6], [0.7, 0.4], [0.3, 0.12]], e: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [1, 4, 1]], note: 'Same C₅H₁₂, but the chain has a side branch. A different substance: boils at 28 °C.' },
  neo: { n: '2,2-Dimethylpropane (two branches)', bp: '10 °C', xy: [[0.5, 0.5], [0.5, 0.15], [0.5, 0.85], [0.18, 0.5], [0.82, 0.5]], e: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], note: 'Same C₅H₁₂ again, now a compact ball. Boils at only 10 °C. Three isomers of one formula.' },
  hex: { n: 'Cyclohexane (ring)', bp: '81 °C', ring: 6, e: 'ring', dbl: [], note: 'Six carbons closed into a ring: C₆H₁₂, two H fewer than the chain hexane C₆H₁₄ because the ring uses two valencies to close.' },
  ben: { n: 'Benzene (ring, double bonds)', bp: '80 °C', ring: 6, dbl: [0, 2, 4], note: 'Benzene C₆H₆: a ring with alternating double bonds. Each carbon has only one H.' },
  but: { n: 'But-1-ene (double bond)', bp: '−6 °C', xy: [[0.1, 0.6], [0.37, 0.4], [0.63, 0.6], [0.9, 0.4]], e: [[0, 1, 2], [1, 2, 1], [2, 3, 1]], note: 'A double bond uses 2 of carbon’s 4 valencies: C₄H₈ instead of C₄H₁₀. This chain is unsaturated.' },
  but2: { n: 'But-1-yne (triple bond)', bp: '8 °C', xy: [[0.1, 0.6], [0.37, 0.4], [0.63, 0.6], [0.9, 0.4]], e: [[0, 1, 3], [1, 2, 1], [2, 3, 1]], note: 'A triple bond uses 3 valencies: C₄H₆. Unsaturated, more reactive than the single-bonded chain.' },
};
export default function (host) {
  let k = 'pen';
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'Skeletons of carbon chains, branched chains, rings and multiple bonds with hydrogen counts' });
  const ctl = row(host);
  choice(ctl, 'Structure', Object.entries(S).map(([v, o]) => [v, o.n.split(' (')[0]]), k, (v) => { k = v; say(); });
  const out = readout(host);
  function build() {
    const s = S[k]; let xy, e;
    if (s.ring) { xy = []; e = []; for (let i = 0; i < s.ring; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / s.ring; xy.push([0.5 + 0.3 * Math.cos(a) * 0.9, 0.5 + 0.3 * Math.sin(a) * 1.25]); e.push([i, (i + 1) % s.ring, s.dbl.includes(i) ? 2 : 1]); } }
    else { xy = s.xy; e = s.e; }
    const used = xy.map(() => 0); e.forEach(([a, b, o]) => { used[a] += o; used[b] += o; });
    return { xy, e, H: used.map((u) => 4 - u) };
  }
  function say() { const { H } = build(), nC = H.length, nH = H.reduce((a, b) => a + b, 0); out.innerHTML = `<b>${S[k].n}</b>: C<sub>${nC}</sub>H<sub>${nH}</sub>, boiling point ${S[k].bp}. ${S[k].note}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[k].n, col) + 10, ph = h - top - 36, { xy, e, H } = build();
    const P = xy.map(([x, y]) => [x * w, top + y * ph]);
    e.forEach(([a, b, o]) => {
      const [x0, y0] = P[a], [x1, y1] = P[b], L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
      for (let i = 0; i < o; i++) { const off = (i - (o - 1) / 2) * 5; line(ctx, [[x0 + nx * off, y0 + ny * off], [x1 + nx * off, y1 + ny * off]], col.ink, 2.2); }
    });
    const cx = P.reduce((s, p) => s + p[0], 0) / P.length, cy = P.reduce((s, p) => s + p[1], 0) / P.length;
    P.forEach(([x, y], i) => {
      dot(ctx, x, y, 12, col.panel, col.s[0]); text(ctx, 'C', x, y, { color: col.ink, size: 11, weight: 700, align: 'center', fit: false });
      const a = Math.atan2(y - cy, x - cx), lx = x + Math.cos(a) * 27, ly = y + Math.sin(a) * 22;
      if (H[i] > 0) text(ctx, 'H' + (H[i] > 1 ? ['', '', '₂', '₃'][H[i]] : ''), lx, ly, { color: col.s[7], size: 11.5, weight: 700, align: 'center' });
    });
    text(ctx, `${H.length} C, ${H.reduce((a, b) => a + b, 0)} H: every carbon has exactly 4 bonds`, w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  say();
}
