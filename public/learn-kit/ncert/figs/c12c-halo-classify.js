// Class 12 Chemistry, Haloalkanes and Haloarenes: classifying halogen compounds by the carbon that holds the halogen (the alpha carbon).
// Alkyl halides have X on an sp3 carbon: methyl, primary (1 C attached), secondary (2), tertiary (3). Allylic and benzylic halides have X on an sp3 carbon next to C=C or a ring.
// Vinylic and aryl halides have X directly on an sp2 carbon. Reactivity in nucleophilic substitution: benzylic, allylic and alkyl are reactive; vinylic and aryl are very unreactive.
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';

const C = {
  me: { n: 'CH₃Br, bromomethane', sub: ['H', 'H', 'H'], type: 'methyl halide (sp³ carbon, 0 carbon groups)', sp: 3, re: 'reactive: SN2 is fastest here' },
  p: { n: 'CH₃CH₂Br, bromoethane', sub: ['H', 'H', 'CH₃'], type: 'primary (1°) alkyl halide', sp: 3, re: 'reactive: mostly SN2' },
  s: { n: '(CH₃)₂CHBr, 2-bromopropane', sub: ['H', 'CH₃', 'CH₃'], type: 'secondary (2°) alkyl halide', sp: 3, re: 'reactive: SN1 and SN2 both possible' },
  t: { n: '(CH₃)₃CBr, 2-bromo-2-methylpropane', sub: ['CH₃', 'CH₃', 'CH₃'], type: 'tertiary (3°) alkyl halide', sp: 3, re: 'reactive: SN1 (SN2 blocked)' },
  al: { n: 'CH₂=CH–CH₂Cl, allyl chloride', sub: ['H', 'H', 'CH=CH₂'], type: 'allylic halide (X on sp³ C next to C=C)', sp: 3, re: 'very reactive: the allyl cation is stabilised' },
  bz: { n: 'C₆H₅CH₂Cl, benzyl chloride', sub: ['H', 'H', 'C₆H₅'], type: 'benzylic halide (X on sp³ C next to a ring)', sp: 3, re: 'very reactive: the benzyl cation is stabilised' },
  vi: { n: 'CH₂=CHCl, vinyl chloride', sub: ['=CH₂', 'H', ''], type: 'vinylic halide (X on an sp² C of C=C)', sp: 2, re: 'very unreactive: C–Cl is short, partly double bond' },
  ar: { n: 'C₆H₅Cl, chlorobenzene', sub: ['ring', '', ''], type: 'aryl halide (X on a ring carbon)', sp: 2, re: 'very unreactive: lone pair of Cl joins the ring' },
};
export default function (host) {
  let k = 'p';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'The carbon bearing the halogen with its neighbours, to classify the halide' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'compound', [['me', 'CH₃X'], ['p', '1°'], ['s', '2°'], ['t', '3°'], ['al', 'allyl'], ['bz', 'benzyl'], ['vi', 'vinyl'], ['ar', 'aryl']], k, (v) => { k = v; go(); });
  const go = () => { const c = C[k]; ro.textContent = `${c.n}: ${c.type}. C–X carbon is sp${c.sp}. ${c.re}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const c = C[k], top = title(ctx, c.n, col), cx = w / 2, cy = top + (h - top) * 0.5, R = Math.min(w, h) * 0.2;
    const node = (x, y, s, fill, r = 15) => { ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); text(ctx, s, x, y, { color: col.panel, size: s.length > 3 ? 9 : 11.5, weight: 700, align: 'center' }); };
    const ring = (x, y, r) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, 7); ctx.stroke(); };
    const X = k === 'vi' || k === 'ar' || k === 'al' || k === 'bz' ? 'Cl' : 'Br';
    if (k === 'ar') { ring(cx, cy + 4, R * 0.95); line(ctx, [[cx, cy + 4 - R * 0.95], [cx, cy - R * 1.9]], col.ink, 2); node(cx, cy - R * 1.9, 'Cl', col.s[2]); text(ctx, 'ring carbon (sp²)', cx + R * 1.1, cy + 4 - R * 0.8, { color: col.muted, size: 10.5 }); return; }
    const sp = [[-R * 1.25, -R * 0.9], [-R * 1.25, R * 0.9], [R * 1.25, R * 0.9]], posX = [[0, -R * 1.5], null];
    const subs = c.sub;
    // alpha carbon
    line(ctx, [[cx, cy], [cx, cy - R * 1.5]], col.ink, 2.5); node(cx, cy - R * 1.5, X, col.s[2], 17);
    const dirs = k === 'vi' ? [[-R * 1.15, R * 0.9], [R * 1.15, R * 0.9]] : [[-R * 1.25, R * 0.8], [R * 1.25, R * 0.8], [0, R * 1.5]];
    dirs.forEach(([dx, dy], i) => {
      const s = subs[i]; if (!s) return;
      if (k === 'vi' && i === 1) { line(ctx, [[cx, cy], [cx + dx, cy + dy]], col.ink, 2.5); node(cx + dx, cy + dy, 'H', col.muted, 12); return; }
      if (s === 'C₆H₅') { line(ctx, [[cx, cy], [cx + dx, cy + dy]], col.ink, 2.5); ring(cx + dx * 1.7, cy + dy * 1.25 + 4, R * 0.6); return; }
      line(ctx, [[cx, cy], [cx + dx, cy + dy]], col.ink, 2.5 + (s === '=CH₂' ? 0 : 0));
      if (s === '=CH₂') line(ctx, [[cx + 4, cy + 3], [cx + dx + 4, cy + dy + 3]], col.ink, 2.5);
      node(cx + dx, cy + dy, s === 'CH=CH₂' ? 'C=C' : s === '=CH₂' ? 'CH₂' : s, s.startsWith('H') ? col.muted : col.s[3], s === 'H' ? 12 : 16);
    });
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.fill(); text(ctx, 'C', cx, cy, { color: col.panel, size: 12, weight: 700, align: 'center' });
    text(ctx, `α carbon, sp${c.sp}`, cx + 22, cy + 4, { color: col.muted, size: 10.5 });
    if (c.sp === 3) { const nC = subs.filter((s) => s && s !== 'H').length; text(ctx, `${nC} carbon group${nC === 1 ? '' : 's'} attached`, w / 2, h - 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
  };
  go();
}
