// Class 11 Biology, Plant Growth and Development: phases of growth in a root tip. Cells near the tip divide (meristematic phase), then grow bigger by taking in water (elongation phase),
// then become specialised (maturation phase). Choose a zone to see its cells and what happens there.
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';
import { rr } from '../c11b-lib.js';

export default function (host) {
  let z = 'm';
  const Z = { c: ['Root cap', 'Protects the tip like a helmet as it pushes through soil; cells are shed and replaced.'], m: ['Meristematic zone', 'Small, thin-walled, dense cells with large nuclei divide again and again (mitosis). New cells for the root come from here.'], e: ['Elongation zone', 'Cells stop dividing and take in water, so each cell grows longer: this is where most of the lengthening of the root happens. The vacuole gets large.'], t: ['Maturation zone', 'Cells differentiate into xylem, phloem and root hairs and take on their final job. Their walls get thicker.'] };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A root tip divided into root cap, meristematic, elongation and maturation zones with cell sizes' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Zone', [['c', 'Root cap'], ['m', 'Divide'], ['e', 'Elongate'], ['t', 'Mature']], z, (v) => { z = v; go(); });
  const go = () => { ro.textContent = Z[z][0] + ': ' + Z[z][1]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Zones of a growing root', col), x0 = w * 0.1, rw = w * 0.34, top = t0 + 12, bot = h - 20, hh = bot - top;
    const bands = [['c', 0.0, 0.12], ['m', 0.12, 0.3], ['e', 0.3, 0.6], ['t', 0.6, 1.0]].map(([k, a, b]) => [k, bot - hh * b, bot - hh * a]);
    // bands: root cap at the bottom (tip)
    const cells = { c: [18, 16], m: [14, 12], e: [10, 26], t: [18, 20] };
    bands.forEach(([k, y0, y1]) => {
      const [cw, ch] = cells[k], on = z === k;
      for (let y = y0; y + ch <= y1 + 0.5; y += ch) for (let x = x0; x + cw <= x0 + rw + 0.5; x += cw) { ctx.fillStyle = on ? col.soft : col.panel; ctx.fillRect(x, y, cw, ch); ctx.strokeStyle = on ? col.s[2] : col.line; ctx.lineWidth = on ? 1.5 : 1; ctx.strokeRect(x, y, cw, ch); if (k === 'm') { ctx.fillStyle = col.s[4]; ctx.fillRect(x + cw * 0.3, y + ch * 0.3, cw * 0.4, ch * 0.4); } if (k === 'e') { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fillRect(x + 2, y + 3, cw - 4, ch - 6); ctx.globalAlpha = 1; } if (k === 't' && x === x0) { ctx.fillStyle = col.s[2]; ctx.fillRect(x - 6, y + 4, 6, 3); } }
      const mid = (y0 + y1) / 2; line(ctx, [[x0 + rw + 6, y0 + 1], [x0 + rw + 6, y1 - 1]], on ? col.s[2] : col.muted, on ? 3 : 1.5);
      text(ctx, Z[k][0], x0 + rw + 16, mid, { color: on ? col.ink : col.muted, size: on ? 12 : 11, weight: on ? 700 : 400 });
    });
    text(ctx, 'tip', x0 + rw / 2, bot + 10, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
