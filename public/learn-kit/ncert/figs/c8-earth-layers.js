// Class 8 Earth: the four spheres. A landscape where each part belongs to one sphere: the lithosphere (rocks, mountains, soil: the solid
// Earth), the hydrosphere (all the water: sea, rivers, ice), the atmosphere (the layer of air) and the biosphere (all living things). They
// overlap and exchange matter and energy all the time. Choose one to highlight it.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

const INFO = {
  all: 'Four spheres share one small place: the rock under your feet, the water in rivers and clouds, the air you breathe and every living thing. Pick one to highlight it.',
  litho: '<b>Lithosphere</b>: the solid, rocky outer layer of the Earth (crust and top of the mantle): mountains, rocks, soil, minerals. It gives plants a place to grow.',
  hydro: '<b>Hydrosphere</b>: all the water: oceans, rivers, lakes, ice, groundwater and the water vapour in air. About 71% of Earth\'s surface is covered by water, and most of it is salty.',
  atmo: '<b>Atmosphere</b>: the blanket of air around Earth, about 78% nitrogen and 21% oxygen. It gives us air to breathe, weather, and protection from harmful rays and cold space.',
  bio: '<b>Biosphere</b>: every living thing, from microbes in soil to trees, birds and people. It is a thin shell where the other three spheres meet.',
};
export default function (host) {
  let sel = 'all';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'A landscape with rock, water, air and living things, each belonging to one of the four spheres' });
  const ctl = row(host);
  choice(ctl, 'Highlight', [['all', 'All'], ['litho', 'Lithosphere'], ['hydro', 'Hydrosphere'], ['atmo', 'Atmosphere'], ['bio', 'Biosphere']], sel, (v) => { sel = v; say(); });
  const out = readout(host);
  const say = () => { out.innerHTML = INFO[sel]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Where the four spheres meet', col);
    const gy = h * 0.66, A = (k) => (sel === 'all' || sel === k ? 1 : 0.18);
    // atmosphere: sky band + clouds
    ctx.save(); ctx.globalAlpha = A('atmo') * 0.16; ctx.fillStyle = col.s[0]; ctx.fillRect(0, 30, w, gy - 30); ctx.restore();
    ctx.save(); ctx.globalAlpha = A('atmo') * 0.4; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(w * 0.78, 56, 14, 0, 7); ctx.fill(); ctx.restore();
    // lithosphere: ground and hills
    ctx.save(); ctx.globalAlpha = A('litho'); ctx.fillStyle = col.warn; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w * 0.15, gy - 50); ctx.lineTo(w * 0.3, gy - 14); ctx.lineTo(w * 0.45, gy - 72); ctx.lineTo(w * 0.62, gy); ctx.lineTo(w, gy); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill(); ctx.restore();
    text(ctx, 'rocks, soil, mountains', w * 0.04, h - 12, { color: sel === 'all' || sel === 'litho' ? col.panel : col.muted, size: 10.5, weight: 700 });
    // hydrosphere: lake and rain
    ctx.save(); ctx.globalAlpha = A('hydro'); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.ellipse(w * 0.74, gy + 14, w * 0.2, 14, 0, 0, 7); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = A('hydro'); ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; [[0.22, 74], [0.36, 62]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(w * x, y, 12, 0, 7); ctx.arc(w * x + 14, y + 3, 10, 0, 7); ctx.fill(); ctx.stroke(); }); [0.2, 0.25, 0.34, 0.38].forEach((x) => line(ctx, [[w * x, 92], [w * x - 3, 106]], col.s[0], 2)); ctx.restore();
    text(ctx, 'lake, rain, clouds', w * 0.74, gy + 36, { color: sel === 'hydro' || sel === 'all' ? col.ink : col.muted, size: 10.5, weight: 700, align: 'center' });
    // biosphere: tree, bird, person
    ctx.save(); ctx.globalAlpha = A('bio'); line(ctx, [[w * 0.52, gy - 4], [w * 0.52, gy - 38]], col.ink, 4); dot(ctx, w * 0.52, gy - 52, 18, col.good, col.ink);
    line(ctx, [[w * 0.9, gy - 4], [w * 0.9, gy - 26]], col.ink, 3); dot(ctx, w * 0.9, gy - 34, 7, col.ink); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w * 0.6, 62); ctx.quadraticCurveTo(w * 0.62, 54, w * 0.64, 62); ctx.quadraticCurveTo(w * 0.66, 54, w * 0.68, 62); ctx.stroke(); ctx.restore();
    text(ctx, 'trees, birds, people', w * 0.62, gy - 82, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'air and sky', w * 0.5, 44, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
  };
  say();
}
