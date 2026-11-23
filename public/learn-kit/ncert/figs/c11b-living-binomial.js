// Class 11 Biology, The Living World: binomial nomenclature (Carolus Linnaeus). A scientific name has two words, genus then species epithet.
// Printed names are in italics; handwritten names are underlined word by word. The genus starts with a capital letter and the epithet with a small one.
// Choose a name, a style and (optionally) a mistake; the four rule checks are worked out from the text itself.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { rr } from '../c11b-lib.js';

const NAMES = { mango: ['Mangifera', 'indica', 'mango'], human: ['Homo', 'sapiens', 'human'], lion: ['Panthera', 'leo', 'lion'], tiger: ['Panthera', 'tigris', 'tiger'], potato: ['Solanum', 'tuberosum', 'potato'], brinjal: ['Solanum', 'melongena', 'brinjal'] };
export default function (host) {
  let nm = 'mango', style = 'print', bad = 'none', author = false;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A scientific name built from a genus and a species epithet with four rule checks' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Organism', Object.entries(NAMES).map(([v, a]) => [v, a[2]]), nm, (v) => { nm = v; cv.redraw(); upd(); });
  choice(ctl, 'Writing', [['print', 'Printed (italic)'], ['hand', 'Handwritten (underline)']], style, (v) => { style = v; cv.redraw(); upd(); });
  choice(ctl, 'Mistake', [['none', 'None'], ['cap', 'Capital on species'], ['low', 'Small genus letter'], ['plain', 'Not set apart']], bad, (v) => { bad = v; cv.redraw(); upd(); });
  choice(ctl, 'Author', [[false, 'Hide'], [true, 'Show (Linn.)']], author, (v) => { author = v; cv.redraw(); upd(); });
  const parts = () => { let [g, s] = NAMES[nm]; if (bad === 'cap') s = s[0].toUpperCase() + s.slice(1); if (bad === 'low') g = g.toLowerCase(); return [g, s]; };
  const checks = () => { const [g, s] = parts(); const set = bad !== 'plain'; return [['Genus starts with a capital', /^[A-Z]/.test(g)], ['Species starts with a small letter', /^[a-z]/.test(s)], ['Two words only (genus + species)', true], [style === 'print' ? 'Printed in italics' : 'Handwritten and underlined', set]]; };
  const upd = () => { const c = checks(), n = c.filter((x) => x[1]).length; ro.textContent = n === 4 ? 'All four rules are met: this is a correct binomial.' : `${4 - n} rule(s) broken: ${c.filter((x) => !x[1]).map((x) => x[0]).join('; ')}.`; };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, 'Binomial nomenclature', col) + 6, [g, s] = parts(), it = bad !== 'plain' && style === 'print', ul = bad !== 'plain' && style === 'hand';
    rr(ctx, 10, y0 + 4, w - 20, 92, 10, col.soft, col.line);
    const fs = Math.min(26, (w - 40) / 13);
    ctx.save(); ctx.font = `${it ? 'italic ' : ''}700 ${fs}px system-ui,sans-serif`;
    const gw = ctx.measureText(g + ' ').width, sw = ctx.measureText(s).width, aw = author ? ctx.measureText(' Linn.').width : 0, total = gw + sw + aw, x = (w - total) / 2, y = y0 + 52;
    ctx.fillStyle = col.ink; ctx.textBaseline = 'middle'; ctx.fillText(g, x, y); ctx.fillText(s, x + gw, y);
    if (ul) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + fs * 0.62); ctx.lineTo(x + gw - 6, y + fs * 0.62); ctx.moveTo(x + gw, y + fs * 0.62); ctx.lineTo(x + gw + sw, y + fs * 0.62); ctx.stroke(); }
    if (author) { ctx.font = `400 ${fs * 0.75}px system-ui,sans-serif`; ctx.fillText(' Linn.', x + gw + sw, y); }
    ctx.restore();
    text(ctx, 'genus', x + gw / 2, y0 + 84, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, 'species epithet', x + gw + sw / 2, y0 + 84, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    const C = checks(); C.forEach(([t, ok], i) => { const yy = y0 + 122 + i * 30; ctx.beginPath(); ctx.arc(24, yy, 9, 0, 7); ctx.fillStyle = ok ? col.s[1] : col.s[3]; ctx.fill(); text(ctx, ok ? '✓' : '✗', 24, yy + 1, { color: col.panel, size: 12, weight: 700, align: 'center' }); text(ctx, t, 42, yy, { color: col.ink, size: 12 }); });
    text(ctx, 'The author name (Linn. = Linnaeus) goes after the name, in plain type.', 12, h - 12, { color: col.muted, size: 10.5 });
  };
  upd(); cv.redraw();
}
