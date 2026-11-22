// Class 10 How do Organisms Reproduce?: fission. Binary fission (Amoeba, bacteria): the nucleus divides, then the cell
// pinches into two equal daughters. Multiple fission (Plasmodium, Amoeba in a cyst): the nucleus divides many times and the
// cytoplasm splits around each nucleus, releasing many small cells at once.
import { canvas, text, title, line, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'bin', u = 0, hold = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'A cell dividing by binary or multiple fission' });
  const ctl = row(host);
  choice(ctl, 'Type', [['bin', 'Binary (Amoeba)'], ['mul', 'Multiple (Plasmodium)']], mode, (v) => { mode = v; u = 0; say(); });
  const sl = slider(ctl, { label: 'Progress', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { u = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { if (hold > 0) { hold -= dt; if (hold <= 0) u = 0; } else { u += dt * 0.16; if (u >= 1) { u = 1; hold = 1.2; } } sl.set(u); cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function say() { out.textContent = mode === 'bin' ? 'Binary fission: 1 cell becomes 2 equal cells. Repeat every 20 minutes (bacteria) and 1 becomes 2, 4, 8, 16...' : 'Multiple fission: the nucleus divides again and again inside a protective cyst, then each nucleus takes some cytoplasm. One cell can give 8 or more at once.'; cv.redraw(); }
  const ell = (ctx, x, y, rx, ry, f, s, lw = 2) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'bin' ? 'Binary fission' : 'Multiple fission', col) + 6, cx = w / 2, cy = top + (h - top - 40) / 2, r = Math.min(w * 0.15, (h - top - 70) / 3.1);
    ctx.save(); ctx.globalAlpha = 0.35;
    if (mode === 'bin') {
      const d = u < 0.3 ? 0 : (u - 0.3) / 0.7 * 1.55 * r, nd = u < 0.2 ? 0 : Math.min(1, (u - 0.2) / 0.4) * 0.9 * d + (u < 0.3 ? Math.max(0, (u - 0.2) / 0.1) * r * 0.25 : 0);
      const pts = [], N = 60, x1 = cx - d, x2 = cx + d;
      for (let i = 0; i <= N; i++) { const x = x1 - r + (i / N) * (x2 - x1 + 2 * r), a = r * r - (x - x1) ** 2, b = r * r - (x - x2) ** 2, hh = Math.sqrt(Math.max(0, a, b)); pts.push([x, hh]); }
      ctx.beginPath(); pts.forEach(([x, hh], i) => (i ? ctx.lineTo(x, cy - hh) : ctx.moveTo(x, cy - hh))); for (let i = N; i >= 0; i--) ctx.lineTo(pts[i][0], cy + pts[i][1]); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
      if (d > r) { ctx.globalAlpha = 1; }
      const nx = u < 0.2 ? 0 : nd;
      ell(ctx, cx - nx, cy, r * 0.3, r * 0.3, col.s[0], col.ink, 1.5);
      if (u >= 0.2) ell(ctx, cx + nx, cy, r * 0.3, r * 0.3, col.s[0], col.ink, 1.5);
      ctx.globalAlpha = 1;
      text(ctx, u < 0.2 ? '1 cell, 1 nucleus' : u < 0.6 ? 'nucleus divides first' : u < 0.95 ? 'cytoplasm pinches in two' : '2 daughter cells', cx, cy + r * 1.6 + 6, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    } else {
      const cyst = u < 0.8 ? 1 : Math.max(0, 1 - (u - 0.8) / 0.2), n = u < 0.12 ? 1 : u < 0.25 ? 2 : u < 0.4 ? 4 : 8;
      ctx.globalAlpha = 1; ell(ctx, cx, cy, r * 1.35, r * 1.35, null, col.muted, 4 * cyst);
      ctx.globalAlpha = 0.3 * (u < 0.55 ? 1 : Math.max(0, 1 - (u - 0.55) / 0.35)); ell(ctx, cx, cy, r * 1.3, r * 1.3, col.s[2], null);
      const spread = u < 0.55 ? 1 : 1 + Math.min(1, (u - 0.55) / 0.45) * 0.9;
      const place = (i, n) => { if (n === 1) return [0, 0]; if (n === 2) return [(i ? 1 : -1) * r * 0.45, 0]; if (n === 4) return [(i % 2 ? 1 : -1) * r * 0.45, (i < 2 ? -1 : 1) * r * 0.45]; const a = i / 8 * 6.2832 + 0.4; return [Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8]; };
      for (let i = 0; i < n; i++) { const [px, py] = place(i, n); const k = u > 0.55 ? 1 : 0; ctx.globalAlpha = 1;
        if (k) ell(ctx, cx + px * spread, cy + py * spread, r * 0.33, r * 0.33, col.s[2], col.ink, 1.5);
        ell(ctx, cx + px * spread, cy + py * spread, r * 0.14, r * 0.14, col.s[0], col.ink, 1.2); }
      ctx.globalAlpha = 1;
      text(ctx, u < 0.55 ? `${n} nucle${n === 1 ? 'us' : 'i'} inside a cyst` : u < 0.95 ? 'each nucleus takes cytoplasm' : '8 small cells released', cx, h - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    }
    ctx.restore();
  };
  say();
}
