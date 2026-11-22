// Class 9 Diversity: the animal kingdom in outline. Invertebrates (no backbone): sponges (Porifera), Cnidaria (Hydra,
// jellyfish), flatworms, roundworms, annelids (earthworm), arthropods (insects, spiders, crabs: jointed legs), molluscs
// (snail, octopus) and echinoderms (starfish). Vertebrates (backbone, in the phylum Chordata) in five classes: fishes,
// amphibians, reptiles, birds, mammals. Choose a group to see a simple drawing, its key features and Indian examples.
import { canvas, text, title, dot, line, row, choice, loop, readout } from '../../kit.js';

const G = {
  por: ['Porifera (sponges)', 'invert', 'Body full of pores; no organs; fixed to rocks in water.', 'Sponges in the sea'],
  cni: ['Cnidaria', 'invert', 'Water animals with a hollow body and stinging tentacles.', 'Hydra, jellyfish, sea anemone'],
  pla: ['Flatworms', 'invert', 'Flat, soft, leaf-like body; many are parasites.', 'Planaria, tapeworm, liver fluke'],
  nem: ['Roundworms', 'invert', 'Long, thin, round body with a gut that has two openings.', 'Ascaris, hookworm'],
  ann: ['Annelida', 'invert', 'Body divided into many ring-like segments.', 'Earthworm, leech'],
  art: ['Arthropoda', 'invert', 'Jointed legs and a hard outer skeleton; the largest animal group.', 'Butterfly, spider, crab, prawn'],
  mol: ['Mollusca', 'invert', 'Soft body, usually with a hard shell and a muscular foot.', 'Snail, octopus, mussel'],
  ech: ['Echinodermata', 'invert', 'Spiny skin; five-armed body; live in the sea.', 'Starfish, sea urchin'],
  fis: ['Fishes', 'vert', 'Live in water, breathe with gills, have fins and scales.', 'Rohu, hilsa, shark'],
  amp: ['Amphibians', 'vert', 'Moist skin, no scales; lay eggs in water; young breathe with gills.', 'Frog, toad, salamander'],
  rep: ['Reptiles', 'vert', 'Dry scaly skin; lay eggs with leathery shells on land.', 'Snake, lizard, turtle, crocodile'],
  ave: ['Birds', 'vert', 'Feathers, wings, beak; warm-blooded; lay hard-shelled eggs.', 'Crow, peacock, sparrow'],
  mam: ['Mammals', 'vert', 'Hair or fur, milk for the young, warm-blooded; most give birth to live young.', 'Cow, tiger, bat, humans'],
};
export default function (host) {
  let k = 'art', t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 320, label: 'A simple drawing of each major animal group with its key features' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  choice(ctl, 'Group', Object.entries(G).map(([a, v]) => [a, v[0].split(' ')[0]]), k, (v) => { k = v; upd(); });
  const out = readout(host);
  function upd() { const d = G[k]; out.innerHTML = `<b>${d[0]}</b>: ${d[2]} Examples: ${d[3]}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const d = G[k]; title(ctx, d[0], col);
    text(ctx, d[1] === 'vert' ? 'has a backbone' : 'no backbone', w - 12, 40, { color: d[1] === 'vert' ? col.s[1] : col.s[3], size: 10.5, weight: 700, align: 'right' });
    const cx = w / 2, cy = h * 0.46, s = Math.min(1.3, w / 330), c = col.s[2], sw = Math.sin(t * 2);
    ctx.lineCap = 'round';
    const F = (fn) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); fn(); ctx.restore(); };
    F(() => {
      ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineWidth = 3;
      if (k === 'por') { ctx.beginPath(); ctx.moveTo(-30, 60); ctx.quadraticCurveTo(-50, -10, -26, -50); ctx.lineTo(26, -50); ctx.quadraticCurveTo(50, -10, 30, 60); ctx.closePath(); ctx.fill(); ctx.fillStyle = col.panel; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-18 + (i % 3) * 18, -20 + Math.floor(i / 3) * 24, 4, 0, 7); ctx.fill(); } }
      if (k === 'cni') { ctx.beginPath(); ctx.arc(0, -10, 44, Math.PI, 0); ctx.fill(); for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 12, -8); for (let y = 0; y < 60; y += 6) ctx.lineTo(i * 12 + Math.sin(t * 3 + y * 0.2 + i) * 4, -8 + y); ctx.stroke(); } }
      if (k === 'pla') { ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-20, -30, 30, -14); ctx.quadraticCurveTo(70, 0, 30, 14); ctx.quadraticCurveTo(-20, 30, -70, 0); ctx.fill(); dot(ctx, 40, -4, 3, col.panel); dot(ctx, 40, 4, 3, col.panel); }
      if (k === 'nem') { ctx.lineWidth = 8; ctx.beginPath(); for (let x = -80; x <= 80; x += 4) ctx.lineTo(x, Math.sin(x * 0.07 + t * 3) * 14); ctx.stroke(); }
      if (k === 'ann') { for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.ellipse(-66 + i * 12, Math.sin(i * 0.5 + t * 2) * 5, 6, 14, 0, 0, 7); ctx.fillStyle = i < 3 ? col.s[0] : c; ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.stroke(); } }
      if (k === 'art') { [-30, 0, 30].forEach((x, i) => { ctx.beginPath(); ctx.ellipse(x, 0, i === 1 ? 20 : 16, 14, 0, 0, 7); ctx.fill(); line(ctx, [[x, 8], [x - 10, 36 + sw * 2], [x - 12, 44]], col.ink, 2.5); line(ctx, [[x, 8], [x + 10, 36 - sw * 2], [x + 12, 44]], col.ink, 2.5); }); line(ctx, [[-44, -6], [-60, -24]], col.ink, 2); line(ctx, [[-44, -2], [-62, -12]], col.ink, 2); }
      if (k === 'mol') { ctx.beginPath(); ctx.ellipse(0, 28, 60, 12, 0, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); for (let a = 0; a < 11; a += 0.2) { const r = 6 + a * 4; ctx.lineTo(8 + Math.cos(a) * r * 1.0, -8 + Math.sin(a) * r * 0.9); } ctx.stroke(); line(ctx, [[-60, 24], [-72, -8 + sw * 2]], col.s[3], 3); line(ctx, [[-56, 22], [-62, -12]], col.s[3], 3); }
      if (k === 'ech') { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 66; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; dot(ctx, Math.cos(a) * 40, Math.sin(a) * 40, 3, col.panel); } }
      if (k === 'fis') { ctx.beginPath(); ctx.ellipse(0, 0, 54, 26, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(48, 0); ctx.lineTo(80, -20 + sw * 3); ctx.lineTo(80, 20 - sw * 3); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-10, -22); ctx.lineTo(10, -40); ctx.lineTo(26, -22); ctx.closePath(); ctx.fill(); dot(ctx, -34, -6, 4, col.panel); line(ctx, [[-22, -14], [-18, 14]], col.panel, 2); for (let i = 0; i < 4; i++) { ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(6 + i * 10, 4, 7, -1, 1); ctx.stroke(); } }
      if (k === 'amp') { ctx.beginPath(); ctx.ellipse(0, 0, 40, 24, 0, 0, 7); ctx.fill(); dot(ctx, -22, -20, 8, c); dot(ctx, 4, -20, 8, c); dot(ctx, -22, -20, 3, col.ink); dot(ctx, 4, -20, 3, col.ink); ctx.strokeStyle = c; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(24, 14); ctx.lineTo(54, 32); ctx.lineTo(70, 20 + sw * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-26, 18); ctx.lineTo(-48, 34); ctx.lineTo(-30, 40); ctx.stroke(); }
      if (k === 'rep') { ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-76, 6); for (let x = -76; x <= 60; x += 4) ctx.lineTo(x, 6 + Math.sin(x * 0.1 + t * 3) * 8); ctx.stroke(); ctx.beginPath(); ctx.ellipse(70, 8, 16, 11, 0, 0, 7); ctx.fill(); dot(ctx, 74, 4, 2.5, col.panel); line(ctx, [[84, 8], [96, 8 + sw * 2]], col.bad, 1.6); ctx.strokeStyle = col.panel; ctx.lineWidth = 1.2; for (let x = -70; x < 56; x += 10) { ctx.beginPath(); ctx.arc(x, 8 + Math.sin(x * 0.1 + t * 3) * 8, 4, 0, Math.PI); ctx.stroke(); } }
      if (k === 'ave') { ctx.beginPath(); ctx.ellipse(0, 6, 44, 28, -0.2, 0, 7); ctx.fill(); dot(ctx, 40, -22, 15, c); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(52, -24); ctx.lineTo(74, -18); ctx.lineTo(52, -14); ctx.fill(); dot(ctx, 44, -26, 2.5, col.ink); ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.quadraticCurveTo(-10, -50 + sw * 8, 18, -4); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-40, 14); ctx.lineTo(-76, 30); ctx.lineTo(-40, 24); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); line(ctx, [[0, 30], [0, 52]], col.ink, 2.5); line(ctx, [[14, 30], [14, 52]], col.ink, 2.5); }
      if (k === 'mam') { ctx.beginPath(); ctx.ellipse(0, 0, 50, 26, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(56, -14, 18, 15, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(52, -26); ctx.lineTo(56, -40); ctx.lineTo(64, -26); ctx.fill(); dot(ctx, 62, -16, 2.5, col.ink); [-34, -18, 22, 38].forEach((x, i) => line(ctx, [[x, 18], [x + (i % 2 ? 2 : -2) + sw * (i % 2 ? 2 : -2), 50]], c, 7)); line(ctx, [[-48, -6], [-72, -16 + sw * 3]], c, 5); ctx.strokeStyle = col.panel; ctx.lineWidth = 1.2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-30 + i * 14, -22); ctx.lineTo(-28 + i * 14, -14); ctx.stroke(); } }
    });
    text(ctx, 'Key feature', 12, h * 0.74, { color: col.muted, size: 10 });
    const words = d[2].split(' '); const L = []; let cur = ''; ctx.font = '11px system-ui'; words.forEach((wd) => { const s2 = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s2).width > w - 24) { L.push(cur); cur = wd; } else cur = s2; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h * 0.74 + 16 + i * 14, { color: col.ink, size: 11, weight: 700 }));
    text(ctx, `e.g. ${d[3]}`, 12, h - 12, { color: col.s[3], size: 10.5 });
  };
  upd();
}
