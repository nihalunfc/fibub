// LSAT: logic you can see. data-mode="cond": "If P, then Q" drawn as the P circle inside the Q circle; pick a fact
// and see what must follow (and what does not). data-mode="quant": all, most, some and none drawn as two groups.
import { canvas, text, dot, row, choice, readout } from '../../kit.js';

export default function (host, { data }) {
  const mode = data.mode || 'cond';
  const P = data.p || 'it rains', Q = data.q || 'the ground is wet';
  const cv = canvas(host, { aspect: 0.56, max: 330, min: 240, label: mode === 'cond' ? 'A small circle P inside a big circle Q' : 'Two groups and how they overlap' });
  const ctl = row(host), out = readout(host);
  let fact = 'P', q = 'all';
  if (mode === 'cond') choice(ctl, 'We learn', [['P', 'P is true'], ['notQ', 'Q is false'], ['Q', 'Q is true'], ['notP', 'P is false']], fact, (v) => { fact = v; cv.redraw(); show(); });
  else choice(ctl, 'Statement', [['all', 'All A are B'], ['most', 'Most A are B'], ['some', 'Some A are B'], ['none', 'No A are B']], q, (v) => { q = v; cv.redraw(); show(); });

  cv.draw = (ctx, w, h, col) => {
    const cy = h / 2 + 8;
    if (mode === 'cond') {
      const R = Math.min(h * 0.42, w * 0.3), r = R * 0.45, cx = w / 2;
      ctx.save(); ctx.globalAlpha = 0.14; dot(ctx, cx, cy, R, col.s[1]); ctx.globalAlpha = 0.22; dot(ctx, cx - R * 0.25, cy, r, col.s[0]); ctx.restore();
      ctx.lineWidth = 2; ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(cx - R * 0.25, cy, r, 0, 7); ctx.stroke();
      text(ctx, `Q: ${Q}`, cx, cy - R - 10, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, 'P', cx - R * 0.25, cy, { color: col.ink, size: 14, weight: 700, align: 'center' });
      // where can "we" be? mark possible zones
      const zones = { inP: [cx - R * 0.25, cy + r * 0.5], inQnotP: [cx + R * 0.55, cy], outside: [cx + R * 1.25, cy + R * 0.6] };
      const allowed = { P: ['inP'], notQ: ['outside'], Q: ['inP', 'inQnotP'], notP: ['inQnotP', 'outside'] }[fact];
      for (const [k, [x, y]] of Object.entries(zones)) {
        const ok = allowed.includes(k);
        dot(ctx, x, y, 8, ok ? col.ink : col.panel, ok ? col.panel : col.line);
      }
      text(ctx, `P: ${P}`, 10, h - 12, { color: col.muted, size: 11 });
    } else {
      const R = Math.min(h * 0.36, w * 0.22), gap = { all: 0, most: R * 0.55, some: R * 1.35, none: R * 2.3 }[q];
      const bx = w / 2 + R * 0.35, ax = q === 'all' ? bx - R * 0.35 : bx - gap, rA = q === 'all' ? R * 0.55 : R * 0.8;
      ctx.save(); ctx.globalAlpha = 0.16; dot(ctx, bx, cy, R * 1.05, col.s[1]); dot(ctx, ax, cy, rA, col.s[0]); ctx.restore();
      ctx.lineWidth = 2; ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.arc(bx, cy, R * 1.05, 0, 7); ctx.stroke();
      ctx.strokeStyle = col.s[0]; ctx.setLineDash(q === 'some' ? [6, 4] : []); ctx.beginPath(); ctx.arc(ax, cy, rA, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, 'A', ax - rA * 0.45, cy - rA - 8, { color: col.ink, size: 14, weight: 700, align: 'center' });
      text(ctx, 'B', bx + R * 0.6, cy - R * 1.05 - 8, { color: col.ink, size: 14, weight: 700, align: 'center' });
    }
  };
  const show = () => {
    if (mode === 'cond') {
      out.innerHTML = {
        P: `P is true, so we are inside the small circle, which is inside Q: <b>Q must be true</b>.`,
        notQ: `Q is false, so we are outside the big circle, and so outside P too: <b>P must be false</b> (the contrapositive).`,
        Q: `Q is true, so we are somewhere in the big circle: maybe inside P, maybe not. <b>Nothing follows about P</b> (the converse error).`,
        notP: `P is false, so we are outside the small circle: maybe still in Q, maybe not. <b>Nothing follows about Q</b> (the inverse error).`,
      }[fact];
    } else {
      out.innerHTML = {
        all: '<b>All A are B</b>: the A group sits wholly inside B. It does not say all B are A.',
        most: '<b>Most A are B</b>: more than half of A is inside B. Some A may be outside; it says nothing about how much of B is A.',
        some: '<b>Some A are B</b>: at least one A is a B (maybe all of them; the dashed edge means we do not know how far the overlap goes). It works both ways: some B are A.',
        none: '<b>No A are B</b>: the groups do not touch. It works both ways: no B are A.',
      }[q];
    }
  };
  cv.redraw(); show();
}
