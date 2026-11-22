// 6.4 The first second, in five scenes for the step player. Schematic (not to scale): (1) quark-gluon plasma,
// quarks of three "colours" moving freely; (2) about 10 microseconds, near 2 × 10¹² K, quarks lock into protons
// and neutrons; (3) matter meets antimatter and both turn into light, leaving about one extra particle of matter
// per billion pairs; (4) neutrons and protons swap back and forth through weak reactions with electrons and
// neutrinos, so they stay about equal while kT ≫ 1.3 MeV; (5) by about 1 second the swaps stop: roughly 1 neutron
// for every 6 protons, frozen in.
import { canvas, text, title, dot, line, loop, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'Scenes from the first second: quarks, protons and neutrons, annihilation and the neutron-proton balance' });
  let step = 0, t = 0;
  const r = rng(7);
  const N = 48;
  const P = Array.from({ length: N }, () => ({ x: r(), y: r(), vx: r() - 0.5, vy: r() - 0.5, c: Math.floor(r() * 3), anti: r() < 0.5, n: r() < 0.5, flip: r() * 10 }));
  loop(host, (dt) => {
    t += dt;
    for (const p of P) {
      const s = step === 0 ? 0.35 : step === 1 ? 0.12 : 0.18;
      p.x += p.vx * s * dt; p.y += p.vy * s * dt;
      if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1;
      p.x = Math.min(1, Math.max(0, p.x)); p.y = Math.min(1, Math.max(0, p.y));
      if (step === 3) { p.flip -= dt * 2; if (p.flip < 0) { p.n = !p.n; p.flip = r() * 2; } }
    }
    cv.redraw();
  });
  const heads = ['1. Quark soup (before 10 µs, above 2×10¹² K)', '2. Quarks lock into protons and neutrons', '3. Matter and antimatter annihilate', '4. Neutrons ⇄ protons, back and forth', '5. About 1 second: the swaps stop'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, heads[step], col) + 4;
    const bx = 10, by = top, bw = w - 20, bh = h - top - 40;
    const X = (x) => bx + 8 + x * (bw - 16), Y = (y) => by + 8 + y * (bh - 16);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
    const qc = [col.s[7], col.s[2], col.s[0]];
    const cap = (a, b = '') => { text(ctx, a, w / 2, h - (b ? 24 : 14), { color: col.muted, size: 11.5, align: 'center' }); if (b) text(ctx, b, w / 2, h - 9, { color: col.muted, size: 11.5, align: 'center' }); };
    if (step === 0) {
      for (const p of P) {
        dot(ctx, X(p.x), Y(p.y), 4, qc[p.c]);
        if (p.c === 0) { const pts = []; for (let k = 0; k <= 12; k++) pts.push([X(p.x) + 7 + k, Y(p.y) + 3 * Math.sin(k * 1.6 + t * 6 + p.flip)]); line(ctx, pts, col.muted, 1.2); }
      }
      cap('Coloured dots: quarks. Wiggles: gluons,', 'which carry the strong force between them.');
    } else if (step === 1) {
      for (let i = 0; i + 2 < N; i += 3) {
        const p = P[i], cx = X(p.x), cy = Y(p.y), neutron = i % 2 === 0;
        ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2); ctx.strokeStyle = neutron ? col.muted : col.ink; ctx.lineWidth = 1.5; ctx.stroke();
        for (let k = 0; k < 3; k++) { const a = t * 2 + (k * 2 * Math.PI) / 3; dot(ctx, cx + 6 * Math.cos(a), cy + 6 * Math.sin(a), 3, qc[k]); }
        text(ctx, neutron ? 'n' : 'p', cx, cy + 21, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false });
      }
      cap('Three quarks, one of each colour,', 'make a proton (p) or a neutron (n).');
    } else if (step === 2) {
      const ph = (t % 3) / 3;
      for (let i = 0; i < N; i += 2) {
        const a = P[i], b = P[i + 1], keep = i === 0;
        const ax = X(a.x), ay = Y(a.y), bxx = X(b.x), byy = Y(b.y);
        if (keep || ph < 0.5) {
          const m = keep ? 0 : ph * 2;
          const x1 = ax + (bxx - ax) * m / 2, y1 = ay + (byy - ay) * m / 2, x2 = bxx + (ax - bxx) * m / 2, y2 = byy + (ay - byy) * m / 2;
          dot(ctx, x1, y1, 5, col.ink);
          if (!keep) { ctx.beginPath(); ctx.arc(x2, y2, 5, 0, Math.PI * 2); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); }
        } else {
          const mx = (ax + bxx) / 2, my = (ay + byy) / 2, rr = 4 + (ph - 0.5) * 40;
          for (let k = 0; k < 2; k++) { const ang = k * Math.PI + i; line(ctx, [[mx + Math.cos(ang) * rr * 0.4, my + Math.sin(ang) * rr * 0.4], [mx + Math.cos(ang) * rr, my + Math.sin(ang) * rr]], col.s[3], 2); }
        }
      }
      text(ctx, 'for every 1,000,000,000 antiparticles', w / 2, by + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
      text(ctx, 'there were 1,000,000,001 particles', w / 2, by + 30, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
      cap('Filled: matter. Rings: antimatter.', 'Pairs meet and become light (yellow).');
    } else {
      const frozen = step === 4;
      // a tidy grid of 28 nucleons
      const cols = 7, rows = 4;
      for (let i = 0; i < cols * rows; i++) {
        const cx = bx + bw * ((i % cols) + 0.5) / cols, cy = by + bh * (Math.floor(i / cols) + 0.5) / rows;
        const n = frozen ? i % 7 === 3 : P[i].n;
        dot(ctx, cx, cy, 11, n ? col.s[1] : col.s[0]);
        text(ctx, n ? 'n' : 'p', cx, cy + 1, { color: '#fff', size: 11, weight: 700, align: 'center', fit: false });
      }
      const nn = frozen ? 4 : P.slice(0, 28).filter((p) => p.n).length;
      cap(frozen ? `${nn} neutrons, ${28 - nn} protons:` : `${nn} neutrons, ${28 - nn} protons,`, frozen ? 'about 1 to 6, now fixed' : 'swapping all the time');
    }
  };
  cv.redraw();
  return { step(i) { step = i; cv.redraw(); } };
}
