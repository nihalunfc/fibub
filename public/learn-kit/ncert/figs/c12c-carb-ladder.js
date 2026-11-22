// Class 12 Chemistry, Aldehydes, Ketones and Carboxylic Acids: the oxidation ladder between alcohol, aldehyde and carboxylic acid, with the reagent for each rung.
// Carbon oxidation number of the carbonyl/carbinol carbon: primary alcohol -1, aldehyde +1, carboxylic acid +3; going up is oxidation, going down is reduction.
// Up: PCC (alcohol to aldehyde); KMnO4 or K2Cr2O7 (to acid); Tollens or Fehling (aldehyde to acid, mild). Down: NaBH4 or LiAlH4 (C=O to CH-OH); DIBAL-H (acid derivative to aldehyde); Clemmensen or Wolff-Kishner (C=O to CH2); Rosenmund (acid chloride to aldehyde).
import { canvas, text, title, arrow, row, choice, button, readout } from '../../kit.js';

const RUNG = [['carboxylic acid', 'RCOOH', '+3'], ['aldehyde', 'RCHO', '+1'], ['primary alcohol', 'RCH₂OH', '−1'], ['alkane', 'RCH₃', '−3']];
export default function (host) {
  let pos = 2, dir = 'up';
  const cv = canvas(host, { aspect: 0.9, max: 380, min: 310, label: 'A ladder of oxidation states from alkane to primary alcohol, aldehyde and carboxylic acid with the reagent for each step' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'direction', [['up', 'oxidise (go up)'], ['down', 'reduce (go down)']], dir, (v) => { dir = v; go(); });
  choice(ctl, 'start at', RUNG.map((r, i) => [i, r[0]]), pos, (v) => { pos = v; go(); });
  const go = () => {
    const steps = { up: { 3: 'An alkane is not oxidised to an alcohol in the school syllabus.', 2: 'Primary alcohol → aldehyde with PCC (or Cu, 573 K); → acid with acidified KMnO₄ or K₂Cr₂O₇.', 1: 'Aldehyde → acid with Tollens, Fehling, or any common oxidant. This is why aldehydes are easily oxidised and ketones are not.', 0: 'Already at the top of the ladder: a carboxylic acid is not oxidised further (it burns to CO₂).' }, down: { 3: 'Nothing lower: an alkane is the bottom rung.', 2: 'Alcohol → alkane needs conversion to a halide, then reduction (outside this ladder).', 1: 'Aldehyde → primary alcohol with NaBH₄, LiAlH₄ or H₂/Ni; → alkane with Clemmensen or Wolff–Kishner.', 0: 'Acid → alcohol with LiAlH₄ (NaBH₄ is too weak); via acid chloride and Rosenmund (H₂/Pd–BaSO₄) → aldehyde.' } };
    ro.textContent = steps[dir][pos]; cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Oxidation ladder: carbon oxidation number', col), x0 = w * 0.1, rw = w * 0.52, y0 = top + 16, rh = (h - y0 - 14) / 4;
    RUNG.forEach((r, i) => {
      const y = y0 + rh * i, act = i === pos; ctx.fillStyle = act ? col.s[3] : col.soft; ctx.globalAlpha = act ? 0.9 : 1; ctx.fillRect(x0, y + 6, rw, rh - 14); ctx.globalAlpha = 1; ctx.strokeStyle = act ? col.s[3] : col.line; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y + 6, rw, rh - 14);
      text(ctx, r[0], x0 + 8, y + rh / 2 - 6, { color: act ? col.panel : col.ink, size: 11.5, weight: 700 }); text(ctx, r[1] + '   (C ' + r[2] + ')', x0 + 8, y + rh / 2 + 10, { color: act ? col.panel : col.muted, size: 11 });
    });
    const tgt = dir === 'up' ? pos - 1 : pos + 1;
    if (tgt >= 0 && tgt < 4 && !(dir === 'up' && pos === 3) && !(dir === 'down' && pos === 2)) { const ya = y0 + rh * pos + rh / 2, yb = y0 + rh * tgt + rh / 2; arrow(ctx, x0 + rw + 18, ya, x0 + rw + 18, yb, col.s[1], 3, 10); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.15; ctx.fillRect(x0, y0 + rh * tgt + 6, rw, rh - 14); ctx.globalAlpha = 1; }
    text(ctx, dir === 'up' ? 'oxidation ↑' : 'reduction ↓', x0 + rw + 28, y0 + rh * 2, { color: col.s[1], size: 11, weight: 700 });
    if (dir === 'up') { text(ctx, 'alcohol → aldehyde:', x0 + rw + 28, y0 + rh * 1.2, { color: col.muted, size: 10 }); text(ctx, 'PCC', x0 + rw + 28, y0 + rh * 1.2 + 14, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'aldehyde → acid:', x0 + rw + 28, y0 + rh * 0.45, { color: col.muted, size: 10 }); text(ctx, 'Tollens, KMnO₄', x0 + rw + 28, y0 + rh * 0.45 + 14, { color: col.ink, size: 11, weight: 700 }); }
    else { text(ctx, 'C=O → CH–OH:', x0 + rw + 28, y0 + rh * 1.2, { color: col.muted, size: 10 }); text(ctx, 'NaBH₄, LiAlH₄', x0 + rw + 28, y0 + rh * 1.2 + 14, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'C=O → CH₂:', x0 + rw + 28, y0 + rh * 2.7, { color: col.muted, size: 10 }); text(ctx, 'Clemmensen,', x0 + rw + 28, y0 + rh * 2.7 + 14, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'Wolff–Kishner', x0 + rw + 28, y0 + rh * 2.7 + 28, { color: col.ink, size: 11, weight: 700 }); }
  };
  go();
}
