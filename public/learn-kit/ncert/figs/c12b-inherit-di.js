// Class 12 Biology, Principles of Inheritance and Variation: the dihybrid cross. Each parent makes gametes with one allele of each gene (independent
// assortment). RrYy x RrYy gives 4 x 4 = 16 equally likely offspring and the 9 : 3 : 3 : 1 ratio of round yellow, round green, wrinkled yellow, wrinkled green.
// R = round, r = wrinkled; Y = yellow, y = green (Mendel's pea seeds). Pick a cross and highlight a class.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let cross = 'RrYy|RrYy', hi = 'all';
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'A 16-square dihybrid Punnett square coloured by seed shape and colour' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Cross', [['RrYy|RrYy', 'RrYy × RrYy'], ['RrYy|rryy', 'Test cross'], ['RRYY|rryy', 'RRYY × rryy'], ['RrYY|RrYy', 'RrYY × RrYy']], cross, (v) => { cross = v; go(); });
  choice(ctl, 'Highlight', [['all', 'All'], ['RY', 'Round yellow'], ['Ry', 'Round green'], ['rY', 'Wrinkled yellow'], ['ry', 'Wrinkled green']], 'all', (v) => { hi = v; go(); });
  const NM = { RY: 'round yellow', Ry: 'round green', rY: 'wrinkled yellow', ry: 'wrinkled green' };
  const gametes = (g) => { const R = g.slice(0, 2).split(''), Y = g.slice(2).split(''), o = []; for (const a of new Set(R)) for (const b of new Set(Y)) o.push(a + b); return o; };
  const ph = (a, b) => (/R/.test(a[0] + b[0]) ? 'R' : 'r') + (/Y/.test(a[1] + b[1]) ? 'Y' : 'y');
  const sorted = (x, y) => [x, y].sort((p, q) => (p === 'R' || p === 'Y' ? -1 : 1)).join('');
  const go = () => {
    const [p, q] = cross.split('|'), A = gametes(p), B = gametes(q), n = {}; let tot = 0;
    A.forEach((a) => B.forEach((b) => { const k = ph(a, b); n[k] = (n[k] || 0) + 1; tot++; }));
    const parts = Object.keys(NM).filter((k) => n[k]).map((k) => `${n[k]} ${NM[k]}`);
    ro.textContent = `${p} makes ${A.length} gamete type${A.length > 1 ? 's' : ''} (${A.join(', ')}); ${q} makes ${B.length} (${B.join(', ')}). ${tot} equally likely offspring: ${parts.join(' : ')}.${cross === 'RrYy|RrYy' ? ' The famous 9 : 3 : 3 : 1.' : cross === 'RrYy|rryy' ? ' A test cross gives 1 : 1 : 1 : 1 and shows the genes assort independently.' : ''}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const [p, q] = cross.split('|'), A = gametes(p), B = gametes(q), top = title(ctx, `${p} × ${q}`, col) + 4;
    const m = Math.max(A.length, B.length), S = Math.min((w - 70) / A.length, (h - top - 40) / B.length, 70), x0 = (w - S * A.length) / 2 + 18, y0 = top + 26;
    const colour = { RY: col.s[3], Ry: col.s[2], rY: col.s[4], ry: col.s[0] };
    A.forEach((a, i) => text(ctx, a, x0 + S * i + S / 2, y0 - 10, { color: col.s[0], size: 11.5, weight: 700, align: 'center' }));
    B.forEach((b, j) => text(ctx, b, x0 - 10, y0 + S * j + S / 2, { color: col.s[3], size: 11.5, weight: 700, align: 'right' }));
    B.forEach((b, j) => A.forEach((a, i) => {
      const k = ph(a, b), g = [sorted(a[0], b[0]), sorted(a[1], b[1])], on = hi === 'all' || hi === k, x = x0 + i * S, y = y0 + j * S;
      ctx.globalAlpha = on ? 1 : 0.18; ctx.fillStyle = colour[k]; ctx.fillRect(x + 1, y + 1, S - 2, S - 2); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x + 1, y + 1, S - 2, S - 2); ctx.globalAlpha = 1;
      if (on) text(ctx, g[0] + g[1], x + S / 2, y + S / 2, { color: col.ink, size: Math.min(12, S / 4.6), weight: 700, align: 'center', fit: false, halo: colour[k] });
    }));
    const ly = y0 + S * B.length + 14; let lx = 10;
    Object.keys(NM).forEach((k) => { ctx.fillStyle = colour[k]; ctx.fillRect(lx, ly - 5, 10, 10); text(ctx, NM[k], lx + 14, ly, { color: col.ink, size: 10 }); lx += 16 + NM[k].length * 5.6; });
  };
  go();
}
