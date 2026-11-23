// Class 11 Biology, Respiration in Plants: the fate of pyruvate depends on oxygen. With enough O2 pyruvate goes into the mitochondria (about 38 ATP per glucose); with little O2 it is fermented
// in the cytoplasm to ethanol and CO2 (yeast, plant roots in flooded soil) or lactic acid (muscles, some bacteria), giving only 2 ATP. Teaching model: share of glucose respired aerobically = O2 / (O2 + 2).
import { canvas, text, title, arrow, row, slider, choice, readout } from '../../kit.js';
import { rr } from '../c11b-lib.js';

export default function (host) {
  let o2 = 21, who = 'yeast';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Pyruvate routes: aerobic respiration or fermentation depending on the oxygen level, with the ATP made' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Cell', [['yeast', 'Yeast or root'], ['muscle', 'Muscle']], who, (v) => { who = v; go(); });
  slider(ctl, { label: 'Oxygen', min: 0, max: 21, step: 0.5, value: o2, fmt: (v) => v.toFixed(1) + ' %', oninput: (v) => { o2 = v; go(); } });
  const f = () => o2 / (o2 + 2), atp = () => 38 * f() + 2 * (1 - f());
  const go = () => { ro.textContent = `Oxygen ${o2.toFixed(1)} %: about ${Math.round(f() * 100)} % of the pyruvate goes the aerobic way. Average ATP per glucose = ${atp().toFixed(0)}. ${f() < 0.3 ? 'The cell is mostly fermenting: fast but wasteful, and the end product (' + (who === 'yeast' ? 'ethanol' : 'lactic acid') + ') builds up.' : 'The mitochondria are doing most of the work.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Where does pyruvate go?', col), cx = w / 2, fr = f();
    rr(ctx, cx - 50, t0 + 10, 100, 26, 6, col.s[4], null); text(ctx, 'pyruvate', cx, t0 + 23, { color: col.bg, size: 11.5, weight: 700, align: 'center' });
    const yb = t0 + 120;
    ctx.globalAlpha = 0.25 + 0.75 * fr; arrow(ctx, cx - 20, t0 + 38, w * 0.25, yb - 4, col.s[2], 2 + 5 * fr, 9); ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.25 + 0.75 * (1 - fr); arrow(ctx, cx + 20, t0 + 38, w * 0.75, yb - 4, col.s[3], 2 + 5 * (1 - fr), 9); ctx.globalAlpha = 1;
    rr(ctx, 10, yb, w / 2 - 15, 70, 8, col.soft, col.s[2], 2); rr(ctx, w / 2 + 5, yb, w / 2 - 15, 70, 8, col.soft, col.s[3], 2);
    text(ctx, 'Mitochondrion', w * 0.25, yb + 14, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'CO₂ + H₂O', w * 0.25, yb + 34, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, '38 ATP', w * 0.25, yb + 54, { color: col.ink, size: 12, align: 'center' });
    text(ctx, 'Cytoplasm', w * 0.75, yb + 14, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, who === 'yeast' ? 'ethanol + 2 CO₂' : 'lactic acid', w * 0.75, yb + 34, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, '2 ATP', w * 0.75, yb + 54, { color: col.ink, size: 12, align: 'center' });
    const by = yb + 100, bw = w - 40; ctx.fillStyle = col.s[2]; ctx.fillRect(20, by, bw * fr, 18); ctx.fillStyle = col.s[3]; ctx.fillRect(20 + bw * fr, by, bw * (1 - fr), 18);
    text(ctx, `${Math.round(fr * 100)} % aerobic`, 24, by + 36, { color: col.s[2], size: 11, weight: 700 }); text(ctx, `${Math.round((1 - fr) * 100)} % fermentation`, w - 24, by + 36, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    text(ctx, `average ATP per glucose: ${atp().toFixed(0)}`, cx, by + 62, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  go();
}
