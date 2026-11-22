// Class 9 Earth as a system: the four spheres (atmosphere, hydrosphere, lithosphere, biosphere) drawn in one
// landscape. Pick a sphere to light it up and read its facts; "Links" shows how matter and energy pass
// between them (rain, roots, wind, sea spray...). The point: no sphere works alone.
import { canvas, text, title, line, dot, arrow, row, choice, readout } from '../../kit.js';

const INFO = {
  all: 'Earth is one system: four spheres that keep exchanging energy and matter. Pick one to look closer.',
  atm: '<b>Atmosphere</b>: the layer of gases, 78% nitrogen and 21% oxygen. Most of its mass is in the lowest 15 km or so. It holds weather, spreads heat and blocks harmful rays.',
  hyd: '<b>Hydrosphere</b>: all the water. About 97% is salty ocean; most fresh water is frozen in glaciers or hidden underground. Oceans cover about 71% of the surface.',
  lit: '<b>Lithosphere</b>: the solid rock crust and soil. It gives minerals to plants, holds fossil fuels and moves slowly as plates (earthquakes, volcanoes).',
  bio: '<b>Biosphere</b>: all living things, from bacteria in soil to birds in the sky. It is a thin skin that lives in the other three spheres.',
  link: '<b>Links</b>: rain moves water from air to land and sea; roots pull minerals from rock; fish breathe air dissolved in water; wind carries sea moisture inland. Change one sphere and the others respond.',
};

export default function (host) {
  let sel = 'all';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 270, label: 'A landscape with sky, sea, land and living things showing the four spheres of the Earth' });
  const ctl = row(host);
  const out = readout(host);
  const show = () => { out.innerHTML = INFO[sel]; cv.redraw(); };
  choice(ctl, 'Sphere', [['all', 'All'], ['atm', 'Air'], ['hyd', 'Water'], ['lit', 'Rock'], ['bio', 'Life'], ['link', 'Links']], 'all', (v) => { sel = v; show(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Four spheres, one system', col) + 6;
    const hz = top + (h - top) * 0.45, mid = w * 0.5;
    const on = (k) => sel === 'all' || sel === 'link' || sel === k;
    const A = (k) => (on(k) ? 1 : 0.18);
    // atmosphere
    ctx.save(); ctx.globalAlpha = A('atm') * 0.35; ctx.fillStyle = col.s[0]; ctx.fillRect(0, top, w, hz - top); ctx.restore();
    ctx.save(); ctx.globalAlpha = A('atm');
    dot(ctx, 34, top + 30, 12, col.s[2]);
    for (const [cx, cy] of [[w * 0.45, top + 30], [w * 0.6, top + 48]]) { for (const [dx, r] of [[-14, 11], [0, 15], [15, 11]]) dot(ctx, cx + dx, cy, r, col.panel, col.line); }
    ctx.restore();
    text(ctx, 'Atmosphere', 10, hz - 10, { color: col.ink, size: 11.5, weight: 700 });
    // sea
    ctx.save(); ctx.globalAlpha = A('hyd') * 0.6; ctx.fillStyle = col.s[0]; ctx.fillRect(0, hz, mid, h - hz); ctx.restore();
    ctx.save(); ctx.globalAlpha = A('hyd'); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; for (let x = 6; x < mid - 10; x += 4) ctx.lineTo(x, hz + 8 + k * 12 + Math.sin(x / 7 + k) * 2); ctx.stroke(); } ctx.restore();
    text(ctx, 'Hydrosphere', 10, h - 12, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
    // land
    ctx.save(); ctx.globalAlpha = A('lit'); ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(mid, hz + 6); ctx.lineTo(mid + (w - mid) * 0.45, hz - 28); ctx.lineTo(w, hz + 6); ctx.lineTo(w, h); ctx.lineTo(mid, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke();
    for (let k = 1; k <= 3; k++) line(ctx, [[mid + 4, hz + 6 + k * (h - hz) / 4], [w, hz + 6 + k * (h - hz) / 4 - 6]], col.line, 1, [5, 4]);
    ctx.restore();
    text(ctx, 'Lithosphere', w - 10, h - 12, { color: col.ink, size: 11.5, weight: 700, align: 'right' });
    // biosphere: tree, fish, bird
    ctx.save(); ctx.globalAlpha = A('bio');
    const tx = mid + (w - mid) * 0.72, ty = hz + 4;
    line(ctx, [[tx, ty], [tx, ty - 26]], col.muted, 4); dot(ctx, tx, ty - 36, 15, col.s[2]);
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(mid * 0.45, hz + 34, 14, 7, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(mid * 0.45 + 12, hz + 34); ctx.lineTo(mid * 0.45 + 22, hz + 27); ctx.lineTo(mid * 0.45 + 22, hz + 41); ctx.fill();
    line(ctx, [[w * 0.3, top + 70], [w * 0.3 + 9, top + 64], [w * 0.3 + 18, top + 70]], col.ink, 2);
    ctx.restore();
    text(ctx, 'Biosphere: fish, trees, birds', 10, hz + 54, { color: col.ink, size: 10.5, weight: 700, halo: col.panel });
    if (sel === 'link') {
      const C = col.s[1];
      arrow(ctx, w * 0.6, top + 68, w * 0.6, hz - 6, C, 2); text(ctx, 'rain', w * 0.6 + 6, top + 84, { color: C, size: 10.5, weight: 700 });
      arrow(ctx, mid * 0.5, hz + 4, mid * 0.5, top + 90, C, 2); text(ctx, 'evaporation', mid * 0.5 + 6, hz - 18, { color: C, size: 10.5, weight: 700, halo: col.panel });
      arrow(ctx, mid + 30, h - 30, tx - 6, hz + 10, C, 2); text(ctx, 'roots take minerals', mid + 10, h - 44, { color: C, size: 10.5, weight: 700 });
      arrow(ctx, tx + 20, hz - 52, tx + 20, top + 30, C, 2); text(ctx, 'plants: O₂, vapour', w - 6, hz - 64, { color: C, size: 10, weight: 700, align: 'right' });
    }
  };
  show();
}
