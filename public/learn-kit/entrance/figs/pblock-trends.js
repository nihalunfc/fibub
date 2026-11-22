// Trends down groups 15, 16 and 17: pick a group and a property and see the bars, with the reason for any break
// in the trend. Values are rounded textbook data (CRC Handbook); boiling points in °C at 1 atm.
import { canvas, axes, text, row, choice, readout, fmt } from '../../kit.js';

const G = {
  15: { name: 'Group 15', props: {
    bp: { name: 'Hydride b.p.', unit: '°C', items: [['NH₃', -33], ['PH₃', -88], ['AsH₃', -62], ['SbH₃', -18], ['BiH₃', 17]], why: 'NH₃ is out of line because of hydrogen bonding. From PH₃ down, b.p. rises with size (stronger London forces).' },
    ang: { name: 'H-E-H angle', unit: '°', items: [['NH₃', 107.8], ['PH₃', 93.6], ['AsH₃', 91.8], ['SbH₃', 91.3], ['BiH₃', 90]], why: 'Bigger central atom, less electronegative: bond pairs sit farther apart and repel less, and the lone pair spreads; angles fall towards 90°.' },
    bde: { name: 'E-H bond enthalpy', unit: 'kJ/mol', items: [['N-H', 389], ['P-H', 322], ['As-H', 297], ['Sb-H', 255]], why: 'Longer bonds are weaker, so thermal stability falls and reducing power rises down the group: BiH₃ is the strongest reducing agent.' },
  } },
  16: { name: 'Group 16', props: {
    bp: { name: 'Hydride b.p.', unit: '°C', items: [['H₂O', 100], ['H₂S', -60], ['H₂Se', -41], ['H₂Te', -2]], why: 'Water is far above the trend line because of strong hydrogen bonding; without it water would boil near −80 °C.' },
    ang: { name: 'H-E-H angle', unit: '°', items: [['H₂O', 104.5], ['H₂S', 92.1], ['H₂Se', 91], ['H₂Te', 90]], why: 'Same reason as group 15: larger, less electronegative central atoms give angles near 90°.' },
    pka: { name: 'pKa of H₂E', unit: '', items: [['H₂O', 14], ['H₂S', 7], ['H₂Se', 3.9], ['H₂Te', 2.6]], why: 'Acid strength rises down the group (pKa falls) because the E-H bond gets longer and weaker, even though electronegativity falls.' },
  } },
  17: { name: 'Group 17', props: {
    bp: { name: 'HX b.p.', unit: '°C', items: [['HF', 20], ['HCl', -85], ['HBr', -67], ['HI', -35]], why: 'HF is anomalous: hydrogen bonds make it a liquid near room temperature.' },
    hx: { name: 'H-X bond enthalpy', unit: 'kJ/mol', items: [['HF', 574], ['HCl', 432], ['HBr', 366], ['HI', 299]], why: 'Weaker bonds down the group make HI the strongest acid in water and the best reducing agent; HF is a weak acid.' },
    xx: { name: 'X-X bond enthalpy', unit: 'kJ/mol', items: [['F₂', 158], ['Cl₂', 242], ['Br₂', 193], ['I₂', 151]], why: 'F₂ breaks the trend: the tiny F atoms have lone pairs so close that they repel, weakening the F-F bond. Cl₂ has the strongest bond.' },
    eg: { name: 'Electron gain enthalpy', unit: 'kJ/mol', items: [['F', -333], ['Cl', -349], ['Br', -325], ['I', -296]], why: 'Chlorine, not fluorine, releases the most energy: an incoming electron is crowded in fluorine\'s small 2p shell.' },
  } },
};
export default function (host) {
  let g = '17', p = 'xx';
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 250, label: 'Bar chart of a property down a p-block group' });
  const ctl = row(host);
  let propBox = row(host);
  const out = readout(host);
  const propChoice = () => {
    propBox.innerHTML = '';
    if (!G[g].props[p]) p = Object.keys(G[g].props)[0];
    choice(propBox, 'Property', Object.entries(G[g].props).map(([k, v]) => [k, v.name]), p, (v) => { p = v; upd(); });
  };
  choice(ctl, 'Group', Object.entries(G).map(([k, v]) => [k, v.name]), g, (v) => { g = v; propChoice(); upd(); });
  const upd = () => { if (!G[g].props[p]) p = Object.keys(G[g].props)[0]; cv.redraw(); const P = G[g].props[p]; out.innerHTML = `${P.items.map(([a, b]) => `${a} ${b}`).join(', ')}${P.unit ? ' ' + P.unit : ''}. <b>Why:</b> ${P.why}`; };
  cv.draw = (ctx, w, h, col) => {
    const P = G[g].props[p], vs = P.items.map((x) => x[1]);
    let lo = Math.min(0, ...vs), hi = Math.max(0, ...vs); const pad = (hi - lo) * 0.15 || 1; lo = lo < 0 ? lo - pad : 0; hi = hi > 0 ? hi + pad : 0;
    const k = P.items.length;
    const { X, Y } = axes(ctx, w, h, col, { x: [0, k], y: [lo, hi], xt: [], ylabel: `${P.name}${P.unit ? ' (' + P.unit + ')' : ''}`, t: 30, b: 30 });
    P.items.forEach(([lab, v], i) => {
      const x0 = X(i + 0.18), x1 = X(i + 0.82), y0 = Y(0), y1 = Y(v);
      ctx.fillStyle = col.s[i % 8]; ctx.fillRect(x0, Math.min(y0, y1), x1 - x0, Math.abs(y1 - y0));
      text(ctx, lab, (x0 + x1) / 2, h - 18, { color: col.ink, size: 12, weight: 600, align: 'center' });
      text(ctx, fmt(v), (x0 + x1) / 2, v >= 0 ? y1 - 9 : y1 + 9, { color: col.ink, size: 11, align: 'center', halo: col.panel });
    });
    text(ctx, `${G[g].name}: ${P.name}`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
  };
  propChoice(); upd();
}
