// DNA replication at one fork. The fork travels right: the top daughter strand (leading) is made in one piece toward
// the fork; the bottom (lagging) is made backwards in short Okazaki fragments, each started by an RNA primer.
// Try: slow the fork, then switch ligase off to see the gaps it normally seals.
import { canvas, loop, row, slider, choice, readout, text, title, button } from '../kit.js';

export default function (host) {
  let xf = 210, ligase = 'on', speed = 40;
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 270, label: 'A replication fork with a continuous leading strand and Okazaki fragments on the lagging strand' });
  const ctl = row(host);
  const anim = loop(host, (dt) => { xf += speed * dt; if (xf > cv.w - 20) xf = 60; cv.redraw(); show(); });
  anim.button(ctl);
  slider(ctl, { label: 'Fork speed', min: 10, max: 90, step: 1, value: speed, fmt: (v) => `${v}`, oninput: (v) => { speed = v; } });
  const ctl2 = row(host);
  choice(ctl2, 'DNA ligase', [['on', 'Present'], ['off', 'Missing']], ligase, (v) => { ligase = v; cv.redraw(); });
  button(ctl2, 'Restart', () => { xf = 60; cv.redraw(); });
  const out = readout(host);
  const geo = () => { const w = cv.w, F = w * 0.16; return { F, e: xf - 46 }; };
  function show() {
    const { F, e } = geo(); const n = Math.max(0, Math.floor((xf - 46) / F));
    out.innerHTML = `Fork has opened <b>${Math.round(xf)}</b> units. Leading strand: <b>1 continuous piece</b>. Lagging strand: <b>${n}</b> Okazaki fragment${n === 1 ? '' : 's'} started so far. ${ligase === 'off' ? 'Without ligase the fragments stay separate, with nicks between them.' : 'Ligase seals the nicks between fragments.'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    const yt = h * 0.2, yb = h * 0.8, cy = h * 0.5, { F, e } = geo();
    title(ctx, 'Replication fork (moves to the right)', col);
    const strand = (pts, c, wd = 3) => { ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
    strand([[0, yt], [xf - 40, yt], [xf, cy - 6], [w, cy - 6]], col.muted, 3);
    strand([[0, yb], [xf - 40, yb], [xf, cy + 6], [w, cy + 6]], col.muted, 3);
    // leading strand (continuous)
    if (e > 4) strand([[0, yt + 9], [e, yt + 9]], col.s[2], 3);
    // lagging: fragments j cover [jF, (j+1)F], built leftwards from the primer at the right end
    for (let j = 0; (j + 1) * F <= e; j++) {
      const x1 = (j + 1) * F, g = Math.min(F, (e - x1) * 2), gap = ligase === 'off' ? 3 : 0;
      if (g > 1) strand([[x1 - g + gap, yb - 9], [x1 - gap, yb - 9]], col.s[1], 3);
      ctx.fillStyle = col.bad; ctx.fillRect(x1 - 7 - gap, yb - 12, 7, 6);
    }
    // helicase and polymerase
    ctx.beginPath(); ctx.arc(xf, cy, 10, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill();
    text(ctx, 'helicase', xf - 14, cy, { color: col.ink, size: 11, weight: 600, align: 'right' });
    ctx.fillStyle = col.s[2]; ctx.fillRect(e - 4, yt + 11, 14, 12);
    text(ctx, 'DNA pol III', Math.max(12, e - 62), yt + 30, { color: col.ink, size: 10.5 });
    text(ctx, "leading strand: made 5'→3' toward the fork, continuous", 10, yt - 14, { color: col.s[2], size: 10.5, weight: 600 });
    text(ctx, "lagging strand: 5'→3' away from the fork, in fragments", 10, yb + 30, { color: col.s[1], size: 10.5, weight: 600 });
    text(ctx, 'red = RNA primer', 10, yb + 46, { color: col.bad, size: 10.5 });
    text(ctx, "3'", 4, yt - 4, { color: col.muted, size: 10 }); text(ctx, "5'", 4, yb + 12, { color: col.muted, size: 10 });
    text(ctx, 'parent DNA', w - 8, cy + 22, { color: col.muted, size: 10.5, align: 'right' });
  };
  cv.redraw(); show();
}
