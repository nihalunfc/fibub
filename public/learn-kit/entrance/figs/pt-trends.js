// Periodic trends: pick a property and a row or column of the table; the bars show how it changes and the readout
// explains the pattern and its exceptions. Data: covalent radii (Cordero et al. 2008), first ionisation enthalpies
// (NIST), Pauling electronegativities, electron gain enthalpies (positive values for Be, N, Mg and noble gases are estimates).
import { canvas, text, row, choice, readout, fmt } from '../../kit.js';

const D = {
  //        radius pm, IE1 kJ/mol, EN Pauling, EGE kJ/mol
  Li: [128, 520, 1.0, -60], Be: [96, 899, 1.5, 48], B: [84, 801, 2.0, -27], C: [76, 1086, 2.5, -122], N: [71, 1402, 3.0, 7], O: [66, 1314, 3.5, -141], F: [57, 1681, 4.0, -328], Ne: [58, 2081, null, 116],
  Na: [166, 496, 0.9, -53], Mg: [141, 738, 1.2, 40], Al: [121, 578, 1.5, -43], Si: [111, 787, 1.8, -134], P: [107, 1012, 2.1, -72], S: [105, 1000, 2.5, -200], Cl: [102, 1251, 3.0, -349], Ar: [106, 1521, null, 96],
  K: [203, 419, 0.8, -48], Rb: [220, 403, 0.8, -47], Cs: [244, 376, 0.7, -46], Br: [120, 1140, 2.8, -325], I: [139, 1008, 2.5, -295],
};
const SETS = {
  p2: { name: 'Period 2', els: ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'] },
  p3: { name: 'Period 3', els: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'] },
  g1: { name: 'Group 1', els: ['Li', 'Na', 'K', 'Rb', 'Cs'] },
  g17: { name: 'Group 17', els: ['F', 'Cl', 'Br', 'I'] },
};
const PROPS = [
  { name: 'Atomic radius', unit: 'pm', i: 0 },
  { name: 'Ionisation enthalpy', unit: 'kJ/mol', i: 1 },
  { name: 'Electronegativity', unit: '', i: 2 },
  { name: 'Electron gain enthalpy', unit: 'kJ/mol', i: 3 },
];
const NOTE = {
  0: { p: 'Across a period the nuclear charge rises while new electrons enter the same shell, so the atom shrinks. (Noble gas radii are not comparable: they have no covalent bonds.)', g: 'Down a group each element adds a whole new shell, so the atom grows.' },
  1: { p: 'Across a period IE rises as electrons are held more tightly. Two dips: B is below Be (its 2p electron is easier to take than a paired 2s one) and O is below N (O loses one of a paired 2p set, which repel each other; N has a stable half-filled 2p³).', g: 'Down a group the outer electron is further out and better shielded, so IE falls.' },
  2: { p: 'Across a period electronegativity rises to fluorine, the highest of all (4.0). Noble gases have no Pauling value here.', g: 'Down a group electronegativity falls as atoms get bigger.' },
  3: { p: 'Electron gain enthalpy becomes more negative (more energy released) across a period, peaking at the halogens. Be, Mg, N and the noble gases have positive or near-zero values: the extra electron goes into a new subshell or a half-filled one.', g: 'Down a group it usually becomes less negative, but Cl is more negative than F: fluorine is so small that the incoming electron is repelled by the crowded 2p electrons.' },
};

export default function (host) {
  let set = 'p2', prop = 1;
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 230, label: 'Bar chart of a periodic property across a period or down a group' });
  const ctl = row(host);
  choice(ctl, 'Show', Object.entries(SETS).map(([k, s]) => [k, s.name]), set, (v) => { set = v; cv.redraw(); show(); });
  choice(ctl, 'Property', PROPS.map((p, i) => [i, p.name]), prop, (v) => { prop = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const kind = set.startsWith('p') ? 'p' : 'g';
    out.innerHTML = `<b>${PROPS[prop].name}, ${SETS[set].name}.</b> ${NOTE[prop][kind]}${prop === 3 ? ' Bars below the line mean energy is released.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const P = PROPS[prop], els = SETS[set].els, vals = els.map((e) => D[e][P.i]);
    const nums = vals.filter((v) => v != null), hi = Math.max(0, ...nums), lo = Math.min(0, ...nums);
    const L = 12, R = w - 12, T = 36, B = h - 44, span = hi - lo || 1;
    const Y = (v) => B - ((v - lo) / span) * (B - T);
    text(ctx, `${P.name}${P.unit ? ' (' + P.unit + ')' : ''}`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(R, Y(0)); ctx.stroke();
    const bw = (R - L) / els.length;
    els.forEach((e, k) => {
      const v = vals[k], x = L + k * bw + bw * 0.15, wd = bw * 0.7;
      if (v == null) { text(ctx, 'n/a', x + wd / 2, Y(0) - 10, { color: col.muted, size: 11, align: 'center' }); }
      else {
        const y0 = Y(0), y1 = Y(v);
        ctx.fillStyle = v < 0 ? col.s[1] : col.s[0];
        ctx.fillRect(x, Math.min(y0, y1), wd, Math.max(2, Math.abs(y1 - y0)));
        text(ctx, fmt(v, 3), x + wd / 2, v < 0 ? y1 + 10 : y1 - 9, { color: col.ink, size: 11, align: 'center' });
      }
      text(ctx, e, x + wd / 2, h - 13, { color: col.ink, size: 12, weight: 600, align: 'center' });
    });
  };
  cv.redraw(); show();
}
