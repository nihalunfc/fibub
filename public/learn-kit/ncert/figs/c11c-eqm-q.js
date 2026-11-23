// Class 11 Chemistry, Equilibrium: the reaction quotient Q against K for H2 + I2 <=> 2HI (K = 50 at about 700 K). Set the three concentrations (mol/L).
// Q = [HI]^2 / ([H2][I2]). Q < K: the forward reaction runs. Q > K: the reverse runs. Q = K: equilibrium. "Run to equilibrium" solves (HI + 2x)^2 = K (H2 - x)(I2 - x) for x and moves the mixture there.
import { canvas, text, title, row, slider, button, readout, loop, lerp, ease } from '../../kit.js';

const K = 50;
export default function (host) {
  let c = { h: 1.0, i: 1.0, hi: 0.2 }, from = null, to = null, p = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Reaction quotient compared with the equilibrium constant with concentration bars' });
  const ctl = row(host), ro = readout(host);
  const S = ['h', 'i', 'hi'].map((k, i) => slider(ctl, { label: ['[H₂]', '[I₂]', '[HI]'][i] + ' (mol/L)', min: 0.05, max: 2, step: 0.05, value: c[k], fmt: (v) => v.toFixed(2), oninput: (v) => { c[k] = v; p = 1; go(); } }));
  button(ctl, 'Run to equilibrium', () => { from = { ...c }; const a = 4 - K, b = 4 * c.hi + K * (c.h + c.i), d = c.hi * c.hi - K * c.h * c.i; const disc = Math.sqrt(b * b - 4 * a * d); const rs = [(-b + disc) / (2 * a), (-b - disc) / (2 * a)]; const x = rs.find((r) => c.h - r > 0 && c.i - r > 0 && c.hi + 2 * r > 0); to = { h: c.h - x, i: c.i - x, hi: c.hi + 2 * x }; p = 0; anim.play(); });
  const anim = loop(host, (dt) => { if (p < 1) { p = Math.min(1, p + dt / 1.6); const e = ease(p); c = { h: lerp(from.h, to.h, e), i: lerp(from.i, to.i, e), hi: lerp(from.hi, to.hi, e) }; S[0].set(c.h); S[1].set(c.i); S[2].set(c.hi); go(); } }, { autoplay: false });
  const Q = () => c.hi * c.hi / (c.h * c.i);
  const go = () => { const q = Q(); ro.textContent = `Q = ${c.hi.toFixed(2)}² / (${c.h.toFixed(2)} × ${c.i.toFixed(2)}) = ${q.toFixed(2)} against K = ${K}: ${Math.abs(q - K) / K < 0.03 ? 'at equilibrium.' : q < K ? 'Q < K, so the mixture makes more HI (forward).' : 'Q > K, so HI turns back into H₂ and I₂ (reverse).'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'H₂ + I₂ ⇌ 2HI: which way will it go?', col), q = Q();
    const bx = 24, bw = (w - 48 - 40) / 3, base = t0 + 130, sc = 90;
    [['H₂', c.h, col.s[0]], ['I₂', c.i, col.s[3]], ['HI', c.hi, col.s[2]]].forEach(([n, v, cl], i) => { const x = bx + i * (bw + 20), hh = Math.min(v, 2.2) * sc * 0.6; ctx.fillStyle = cl; ctx.fillRect(x, base - hh, bw, hh); text(ctx, n + ' ' + v.toFixed(2), x + bw / 2, base + 14, { color: cl, size: 11.5, weight: 700, align: 'center' }); });
    const ly = base + 70, lx0 = 24, lx1 = w - 24, pos = (v) => lx0 + (Math.log10(Math.max(0.01, Math.min(1e4, v))) + 2) / 6 * (lx1 - lx0);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx0, ly); ctx.lineTo(lx1, ly); ctx.stroke();
    [0.01, 1, 100, 10000].forEach((v) => { text(ctx, String(v), pos(v), ly + 16, { color: col.muted, size: 10, align: 'center' }); });
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(pos(K), ly - 14); ctx.lineTo(pos(K) - 6, ly - 24); ctx.lineTo(pos(K) + 6, ly - 24); ctx.fill(); text(ctx, 'K = 50', pos(K), ly - 34, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
    ctx.beginPath(); ctx.arc(pos(q), ly, 7, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); text(ctx, 'Q = ' + (q < 100 ? q.toFixed(2) : q.toFixed(0)), pos(q), ly + 34, { color: col.s[3], size: 11.5, weight: 700, align: 'center' });
    const dir = Math.abs(q - K) / K < 0.03 ? 'equilibrium' : q < K ? '→ forward: makes more HI' : '← reverse: makes more H₂ and I₂';
    text(ctx, dir, w / 2, h - 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  go();
}
