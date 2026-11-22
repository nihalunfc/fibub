// Class 12 Chemistry, Electrochemistry: rusting as a tiny galvanic cell. In a drop of water on iron, one spot is the anode (Fe -> Fe2+ + 2e-) and the metal carries the electrons to the edge,
// the cathode, where dissolved O2 is reduced (O2 + 4H+ + 4e- -> 2H2O). Fe2+ is then oxidised to Fe3+ and appears as rust, Fe2O3.xH2O. Salt in the water makes the electrolyte conduct better (faster).
// A zinc coating (E0 -0.76 V, lower than iron -0.44 V) is oxidised instead of iron (sacrificial protection); paint keeps water and oxygen away.
import { canvas, text, title, row, choice, readout, loop, button } from '../../kit.js';

const OPT = { none: ['bare iron in water', 1, 'iron'], salt: ['iron in salty water', 3, 'iron'], zinc: ['iron with a zinc coating', 0.8, 'zinc'], paint: ['painted iron', 0.02, 'iron'] };
export default function (host) {
  let k = 'none', rust = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 310, label: 'A water drop on iron showing the anode, cathode and growing rust, with protections' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'surface', [['none', 'bare iron'], ['salt', 'salty water'], ['zinc', 'zinc coat'], ['paint', 'painted']], k, (v) => { k = v; rust = 0; go(); });
  button(ctl, '↺ Reset', () => { rust = 0; go(); });
  const NOTE = { none: 'Iron is the anode: Fe → Fe²⁺ + 2e⁻. Oxygen is reduced at the cathode. Fe²⁺ turns to rust.', salt: 'Salt ions let current flow more easily in the water, so the cell works faster: ships and coastal bridges rust quickly.', zinc: 'Zinc has the lower reduction potential, so zinc is oxidised and iron stays safe, even where the coat is scratched (galvanising).', paint: 'Paint stops water and oxygen reaching the metal, so the cell cannot form (until it chips).' };
  const go = () => { ro.textContent = NOTE[k]; };
  loop(host, (dt) => { t += dt; rust = Math.min(1, rust + dt * 0.08 * OPT[k][1]); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Corrosion: ${OPT[k][0]}`, col) + 10, L = 20, W = w - 40, iy = h - 112, cy = iy - 150;
    // iron plate
    ctx.fillStyle = col.muted; ctx.fillRect(L, iy, W, 36); text(ctx, 'iron', L + 8, iy + 18, { color: col.panel, size: 11, weight: 700 });
    if (k === 'zinc') { ctx.fillStyle = col.s[4]; ctx.fillRect(L, iy - 8, W, 8); text(ctx, 'zinc coat on top', L + W - 6, iy + 18, { color: col.panel, size: 10.5, weight: 700, align: 'right' }); }
    if (k === 'paint') { ctx.fillStyle = col.s[3]; ctx.fillRect(L, iy - 8, W, 8); text(ctx, 'paint on top', L + W - 6, iy + 18, { color: col.panel, size: 10.5, weight: 700, align: 'right' }); }
    // drop
    ctx.beginPath(); ctx.moveTo(L + 20, iy - (k === 'none' || k === 'salt' ? 0 : 8)); ctx.quadraticCurveTo(L + W / 2, cy, L + W - 20, iy - (k === 'none' || k === 'salt' ? 0 : 8)); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = k === 'paint' ? 0.08 : 0.25; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, k === 'salt' ? 'water + dissolved salt' : 'water drop with O₂ dissolved', L + W / 2, iy - 30, { color: col.ink, size: 11, align: 'center' });
    const ax = L + W * 0.5, bx = L + W * 0.15, anodeIsZn = OPT[k][2] === 'zinc', act = OPT[k][1];
    if (act > 0.1) {
      text(ctx, anodeIsZn ? 'anode: Zn → Zn²⁺ + 2e⁻' : 'anode: Fe → Fe²⁺ + 2e⁻', ax, iy + 52, { color: col.s[2], size: 11, weight: 700, align: 'center' });
      text(ctx, 'cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O', bx + 10, iy - 62, { color: col.s[3], size: 10.5, weight: 700 });
      for (let i = 0; i < 4; i++) { const u = (t * 0.25 * Math.min(2, act) + i / 4) % 1, x = ax + u * (bx - ax); ctx.beginPath(); ctx.arc(x, iy + 24, 3.5, 0, 7); ctx.fillStyle = col.s[4]; ctx.fill(); }
      text(ctx, 'e⁻ flow through the metal', (ax + bx) / 2, iy + 36 + 14, { color: col.s[4], size: 10, align: 'center' });
    } else text(ctx, 'no electrolyte contact: no cell', w / 2, iy + 52, { color: col.muted, size: 11, align: 'center' });
    // rust / consumed metal bar
    const label = anodeIsZn ? 'zinc used up' : 'rust formed';
    ctx.fillStyle = col.line; ctx.fillRect(L, h - 24, W, 10); ctx.fillStyle = anodeIsZn ? col.s[4] : col.s[2]; ctx.fillRect(L, h - 24, W * rust, 10); text(ctx, `${label}: ${Math.round(rust * 100)} %`, L, h - 32, { color: col.ink, size: 10.5, weight: 700 });
    if (!anodeIsZn && rust > 0.05) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.8; ctx.fillRect(ax - 22, iy - 2, 44, 3 + 10 * rust); ctx.globalAlpha = 1; }
  };
  go();
}
