// LSAT: an argument drawn as a map. Used inside a "Watch it happen" player; the player's steps carry the parts:
//   <div class="steps" data-fig="arg-map" data-p1="..." data-p2="..." data-c="..." data-a="...">
//     <div class="step" data-show="p1">...</div> <div class="step" data-show="p1 p2 c">...</div> ...
// p1, p2 = premises (evidence), c = conclusion (claim), a = the gap or assumption, x = an extra fact that
// strengthens (data-xs="+") or weakens (data-xs="-") the link. Plain canvas; nothing is sent anywhere.
import { canvas, text, arrow } from '../../kit.js';

function wrap(ctx, s, maxW) {
  const words = String(s || '').split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur);
  return lines;
}

export default function (host) {
  const box = host.parentElement;
  const D = box?.dataset || {};
  const steps = [...(box?.querySelectorAll('.step') || [])].map((s) => (s.dataset.show || '').split(/\s+/));
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 280, label: 'An argument map: premises lead to a conclusion, with the unstated assumption in the gap' });
  let i = 0;
  cv.draw = (ctx, w, h, col) => {
    const on = new Set(steps[i] || ['p1', 'p2', 'c', 'a']);
    const card = (x, y, W, label, body, color, show, dashed) => {
      ctx.save(); ctx.globalAlpha = show ? 1 : 0.18;
      ctx.font = '13px system-ui, sans-serif';
      const lines = wrap(ctx, body, W - 18).slice(0, 4), H = 28 + lines.length * 17;
      ctx.fillStyle = col.panel; ctx.strokeStyle = color; ctx.lineWidth = 2;
      if (dashed) ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.roundRect(x, y, W, H, 8); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, label, x + 9, y + 13, { color, size: 11, weight: 700, fit: false });
      lines.forEach((l, k) => text(ctx, l, x + 9, y + 31 + k * 17, { color: col.ink, size: 13, fit: false }));
      ctx.restore();
      return { x, y, W, H };
    };
    const two = !!D.p2, cw = two ? (w - 36) / 2 : Math.min(w - 24, 420);
    const P1 = card(12, 28, cw, two ? 'PREMISE 1 (evidence)' : 'PREMISE (evidence)', D.p1, col.s[0], on.has('p1'));
    const P2 = two ? card(24 + cw, 28, cw, 'PREMISE 2 (evidence)', D.p2, col.s[0], on.has('p2')) : null;
    const top = Math.max(P1.y + P1.H, P2 ? P2.y + P2.H : 0);
    const cy = h - 96, CW = Math.min(w - 24, 440), cx = (w - CW) / 2;
    if (D.a) {
      const A = card(w - Math.min(w * 0.46, 260) - 12, top + 14, Math.min(w * 0.46, 260), 'GAP: UNSTATED ASSUMPTION', D.a, col.s[3], on.has('a'), true);
      void A;
    }
    if (D.x) card(12, top + 14, Math.min(w * 0.42, 240), D.xs === '-' ? 'NEW FACT: WEAKENS' : 'NEW FACT: STRENGTHENS', D.x, D.xs === '-' ? col.bad || col.s[1] : col.good || col.s[2], on.has('x'));
    const C = card(cx, cy, CW, 'CONCLUSION (claim)', D.c, col.s[1], on.has('c'));
    ctx.save(); ctx.globalAlpha = on.has('c') ? 1 : 0.18;
    arrow(ctx, P1.x + P1.W / 2, P1.y + P1.H + 2, C.x + C.W * (two ? 0.35 : 0.5), C.y - 4, col.muted, 2);
    if (P2) arrow(ctx, P2.x + P2.W / 2, P2.y + P2.H + 2, C.x + C.W * 0.65, C.y - 4, col.muted, 2);
    ctx.restore();
  };
  cv.redraw();
  return { step(k) { i = k; cv.redraw(); } };
}
