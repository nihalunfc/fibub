// Class 10 Light: why mirrors are shaped the way they are, in three everyday uses. (1) Torch or car headlamp: a bulb at
// the focus of a (parabolic) concave mirror sends out a parallel beam; move it off the focus and the beam spreads or
// squeezes. (2) Solar cooker: parallel sunlight meets at the focus, so the pot goes there; tilt the sun and the spot shifts.
// (3) Rear-view mirror: a convex mirror shows a much wider field of view than a flat one, with smaller images.
// Rays are traced with the real law of reflection at each point of the mirror.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let scene = 'lamp', shift = 0, tilt = 0, rv = 'convex', t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Everyday uses of mirrors: headlamp, solar cooker and rear-view mirror' });
  const ctl = row(host);
  choice(ctl, 'Use', [['lamp', 'Headlamp'], ['solar', 'Solar cooker'], ['rear', 'Rear-view mirror']], scene, (v) => { scene = v; vis(); update(); });
  const s1 = slider(ctl, { label: 'Bulb position (0 = at focus)', min: -4, max: 4, step: 0.5, value: shift, fmt: (v) => `${v > 0 ? '+' : ''}${v} cm`, oninput: (v) => { shift = v; update(); } });
  const s2 = slider(ctl, { label: 'Sun’s direction (tilt)', min: 0, max: 12, step: 1, value: tilt, fmt: (v) => `${v}°`, oninput: (v) => { tilt = v; update(); } });
  const c3 = choice(ctl, 'Mirror', [['convex', 'Convex'], ['plane', 'Plane']], rv, (v) => { rv = v; update(); });
  const kids = [...ctl.children]; const w1 = kids[kids.length - 3], w2 = kids[kids.length - 2], w3 = kids[kids.length - 1];
  const vis = () => { w1.style.display = scene === 'lamp' ? '' : 'none'; w2.style.display = scene === 'solar' ? '' : 'none'; w3.style.display = scene === 'rear' ? '' : 'none'; };
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  function update() {
    out.innerHTML = scene === 'lamp' ? (shift === 0 ? 'Bulb at the focus: every ray leaves <b>parallel</b>, so the beam stays narrow and travels far. That is why headlamps and torches have a concave reflector.' : shift > 0 ? 'Bulb is nearer the mirror than the focus: the beam <b>spreads out</b>.' : 'Bulb is beyond the focus: the rays <b>cross</b> and spread.')
      : scene === 'solar' ? (tilt === 0 ? 'Sunlight is parallel, so the mirror brings it all to <b>one spot, the focus</b>. Put the pot there and it gets very hot.' : 'As the Sun moves across the sky the bright spot slides away, which is why solar cookers must be turned during the day.')
      : (rv === 'convex' ? 'A <b>convex</b> mirror curves outwards, so it takes in light from a wide angle: the driver sees more of the road, though the cars look smaller and farther than they are.' : 'A <b>plane</b> mirror shows only a narrow strip of the road behind.');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    if (scene === 'rear') return rear(ctx, w, h, col);
    title(ctx, scene === 'lamp' ? 'Headlamp: light from the focus goes out parallel' : 'Solar cooker: parallel sunlight meets at the focus', col);
    const cy = Math.round(h * 0.52), xp = w - 30, fp = Math.min(110, w * 0.3), half = h * 0.32;
    // parabola x = xp - y^2/(4 fp)
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3.5; ctx.beginPath(); for (let y = -half; y <= half; y += 3) { const x = xp - (y * y) / (4 * fp); y === -half ? ctx.moveTo(x, cy + y) : ctx.lineTo(x, cy + y); } ctx.stroke();
    line(ctx, [[6, cy], [w - 6, cy]], col.line, 1); dot(ctx, xp - fp, cy, 3, col.ink); text(ctx, 'F', xp - fp, cy + 14, { color: col.muted, size: 11, weight: 700, align: 'center' });
    const rays = [-0.9, -0.6, -0.3, 0.3, 0.6, 0.9].map((q) => q * half), pulses = [];
    const src = scene === 'lamp' ? [xp - fp + shift * (fp / 10) * 2, cy] : null, a = tilt * Math.PI / 180;
    for (const y of rays) {
      let o, d, hit;
      if (scene === 'lamp') { o = src; hit = [xp - y * y / (4 * fp), cy + y]; const dx = hit[0] - o[0], dy = hit[1] - o[1], L = Math.hypot(dx, dy); d = [dx / L, dy / L]; }
      else { d = [Math.cos(a), Math.sin(a)]; hit = [xp - y * y / (4 * fp), cy + y]; o = [hit[0] - d[0] * (w - 60), hit[1] - d[1] * (w - 60)]; if (o[0] < 8) o = [8, hit[1] - d[1] * (hit[0] - 8) / d[0]]; }
      const nrm = [1, y / (2 * fp)], nl = Math.hypot(...nrm), nn = [nrm[0] / nl, nrm[1] / nl], dd = d[0] * nn[0] + d[1] * nn[1], r = [d[0] - 2 * dd * nn[0], d[1] - 2 * dd * nn[1]];
      const Lr = scene === 'lamp' ? hit[0] - 8 : Math.hypot(hit[0] - (xp - fp), 90) * 1.0;
      let tEnd = r[0] < 0 ? (hit[0] - 8) / -r[0] : 0; if (scene === 'solar') tEnd = Math.min(tEnd, fp * 1.6);
      const E = [hit[0] + r[0] * tEnd, hit[1] + r[1] * tEnd];
      arrow(ctx, o[0], o[1], hit[0], hit[1], col.s[0], 1.4, 6); line(ctx, [hit, E], col.s[1], 1.6);
      pulses.push([o, hit, E]);
    }
    if (scene === 'lamp') { dot(ctx, src[0], src[1], 7, col.s[3], col.panel); text(ctx, 'bulb', src[0] - 4, cy - 14, { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
    else { dot(ctx, xp - fp + Math.sin(a) * 0, cy + Math.tan(a) * fp * 0.55, 5, col.s[3], col.panel); text(ctx, 'hot spot', xp - fp, cy - 14, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'sunlight comes in from the left →', 8, h - 10, { color: col.s[0], size: 11, weight: 700 }); }
    for (const [o, hit, E] of pulses) {
      const l1 = Math.hypot(hit[0] - o[0], hit[1] - o[1]), l2 = Math.hypot(E[0] - hit[0], E[1] - hit[1]), d = ((t * 0.4) % 1) * (l1 + l2 + 1);
      if (d < l1) dot(ctx, o[0] + (hit[0] - o[0]) * d / l1, o[1] + (hit[1] - o[1]) * d / l1, 3.5, col.s[3]); else dot(ctx, hit[0] + (E[0] - hit[0]) * (d - l1) / l2, hit[1] + (E[1] - hit[1]) * (d - l1) / l2, 3.5, col.s[3]);
    }
  };
  function rear(ctx, w, h, col) {
    title(ctx, 'Rear-view mirror: how much road can you see?', col);
    const roadT = 70, roadB = h - 40, mx = 40, my = (roadT + roadB) / 2, lanes = 3, lh = (roadB - roadT) / lanes;
    ctx.fillStyle = col.soft; ctx.globalAlpha = 0.6; ctx.fillRect(0, roadT, w, roadB - roadT); ctx.globalAlpha = 1;
    for (let k = 1; k < lanes; k++) line(ctx, [[0, roadT + k * lh], [w, roadT + k * lh]], col.line, 1.5, [10, 8]);
    const ha = rv === 'convex' ? 38 : 13, a = ha * Math.PI / 180, L = w - mx - 6;
    ctx.save(); ctx.beginPath(); ctx.rect(0, roadT, w, roadB - roadT); ctx.clip(); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + L, my - Math.tan(a) * L); ctx.lineTo(mx + L, my + Math.tan(a) * L); ctx.closePath(); ctx.fill(); ctx.restore();
    // your car and mirror
    ctx.fillStyle = col.ink; ctx.fillRect(4, my - 12, 24, 24); text(ctx, 'you', 16, my + 24, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    line(ctx, [[mx - 3, my - 14], [mx - 3, my + 14]], col.s[1], 4);
    // cars behind in three lanes, moving
    [0, 1, 2].forEach((lane) => {
      const cy2 = roadT + lh * (lane + 0.5), x = 70 + ((t * 40 + lane * 120) % (w - 100)), inside = Math.abs(cy2 - my) <= Math.tan(a) * (x - mx) - 6;
      ctx.fillStyle = inside ? col.s[3] : col.muted; ctx.globalAlpha = inside ? 1 : 0.55; ctx.fillRect(x - 13, cy2 - 8, 26, 16); ctx.globalAlpha = 1;
    });
    text(ctx, rv === 'convex' ? 'convex: wide view, all lanes seen' : 'plane: narrow view, side lanes missed', 8, h - 12, { color: col.ink, size: 11, weight: 700 });
    text(ctx, 'orange car = visible, grey = hidden', 8, h - 28, { color: col.muted, size: 10.5 });
  }
  vis(); update();
}
