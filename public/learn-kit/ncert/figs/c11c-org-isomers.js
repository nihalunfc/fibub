// Class 11 Chemistry, Organic Chemistry basics: structural isomers. Same molecular formula, different structure. Chain isomers differ in the carbon skeleton; position isomers in where the group sits;
// functional isomers in the functional group (alcohol and ether, aldehyde and ketone); ring-chain isomers (alkene and cycloalkane). Pick a formula, then highlight one kind of relationship to the first isomer.
import { canvas, text, title, choice, readout, row } from '../../kit.js';

const F = {
  c4h10: { n: 'C₄H₁₀', l: [['butane', 'CH₃CH₂CH₂CH₃', ''], ['2-methylpropane', '(CH₃)₂CHCH₃', 'chain']] },
  c5h12: { n: 'C₅H₁₂', l: [['pentane', 'CH₃(CH₂)₃CH₃', ''], ['2-methylbutane', '(CH₃)₂CHCH₂CH₃', 'chain'], ['2,2-dimethylpropane', '(CH₃)₄C', 'chain']] },
  c3h8o: { n: 'C₃H₈O', l: [['propan-1-ol', 'CH₃CH₂CH₂OH', ''], ['propan-2-ol', 'CH₃CH(OH)CH₃', 'position'], ['methoxyethane', 'CH₃OCH₂CH₃', 'functional']] },
  c4h10o: { n: 'C₄H₁₀O', l: [['butan-1-ol', 'CH₃CH₂CH₂CH₂OH', ''], ['butan-2-ol', 'CH₃CH₂CH(OH)CH₃', 'position'], ['2-methylpropan-1-ol', '(CH₃)₂CHCH₂OH', 'chain'], ['2-methylpropan-2-ol', '(CH₃)₃COH', 'chain'], ['ethoxyethane', 'CH₃CH₂OCH₂CH₃', 'functional'], ['1-methoxypropane', 'CH₃OCH₂CH₂CH₃', 'functional']] },
  c3h6o: { n: 'C₃H₆O', l: [['propanal', 'CH₃CH₂CHO', ''], ['propanone', 'CH₃COCH₃', 'functional']] },
  c4h8: { n: 'C₄H₈', l: [['but-1-ene', 'CH₂=CHCH₂CH₃', ''], ['but-2-ene', 'CH₃CH=CHCH₃', 'position'], ['2-methylpropene', '(CH₃)₂C=CH₂', 'chain'], ['cyclobutane', '(CH₂)₄ ring', 'ring']] },
};
const KIND = [['all', 'all'], ['chain', 'chain'], ['position', 'position'], ['functional', 'functional'], ['ring', 'ring-chain']];
export default function (host) {
  let f = 'c4h10o', kd = 'all';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Cards of structural isomers for a chosen molecular formula coloured by the kind of isomerism' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'formula', Object.entries(F).map(([a, d]) => [a, d.n]), f, (v) => { f = v; go(); });
  choice(ctl, 'highlight relation to the first isomer', KIND, kd, (v) => { kd = v; go(); });
  const go = () => { const d = F[f], c = (k) => d.l.filter((x) => x[2] === k).length; ro.textContent = `${d.n} has ${d.l.length} structural isomers shown here` + (c('chain') ? `; ${c('chain')} differ in the carbon chain` : '') + (c('position') ? `; ${c('position')} in the position of the group` : '') + (c('functional') ? `; ${c('functional')} in the functional group` : '') + (c('ring') ? '; 1 has a ring instead of a double bond' : '') + '.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = F[f], top = title(ctx, `Isomers of ${d.n}`, col) + 14, ch = Math.min(52, (h - top - 20) / d.l.length - 6), colr = { '': col.ink, chain: col.s[3], position: col.s[0], functional: col.s[4], ring: col.s[2] };
    d.l.forEach(([nm, fm, k], i) => {
      const y = top + i * (ch + 6), on = kd === 'all' || k === kd || k === '';
      ctx.fillStyle = on ? col.soft : col.panel; ctx.globalAlpha = on ? 1 : 0.45; ctx.fillRect(10, y, w - 20, ch); ctx.strokeStyle = k ? colr[k] : col.line; ctx.lineWidth = on && k ? 2.5 : 1.2; ctx.strokeRect(10, y, w - 20, ch);
      text(ctx, nm, 20, y + ch * 0.33, { color: col.ink, size: 12, weight: 700 }); text(ctx, fm, 20, y + ch * 0.7, { color: col.muted, size: 11.5 });
      text(ctx, k ? k + ' isomer' : 'first isomer (reference)', w - 18, y + ch * 0.5, { color: k ? colr[k] : col.muted, size: 10.5, weight: 700, align: 'right' });
      ctx.globalAlpha = 1;
    });
  };
  go();
}
