// Human health and disease: primary and secondary immune responses. The first meeting with an antigen gives a slow,
// small antibody rise (mostly IgM); memory cells make the second response fast, large and long (mostly IgG). Move
// the second exposure and switch vaccination on to see why vaccines work. Curves are schematic.
import { canvas, axes, line, text, row, slider, choice, readout } from '../../kit.js';

const bump = (t, t0, lag, peak, rise, fall) => (t < t0 + lag ? 0 : (() => { const s = t - t0 - lag; return peak * (s < rise ? s / rise : Math.exp(-(s - rise) / fall)); })());
export default function (host) {
  let second = 40, vacc = 'no';
  const cv = canvas(host, { aspect: 0.58, max: 340, min: 240, mark: 'bl', label: 'Antibody level after a first and a second exposure to the same antigen' });
  const ctl = row(host);
  slider(ctl, { label: 'Second exposure', min: 20, max: 80, step: 1, value: second, fmt: (v) => `day ${v}`, oninput: (v) => { second = v; cv.redraw(); show(); } });
  choice(ctl, 'First exposure', [['no', 'Infection'], ['yes', 'Vaccine']], vacc, (v) => { vacc = v; cv.redraw(); show(); });
  const out = readout(host);
  const level = (t) => bump(t, 0, 7, vacc === 'yes' ? 0.18 : 0.25, 7, 12) + bump(t, second, 2, 1, 5, 30);
  const show = () => {
    out.innerHTML = `${vacc === 'yes' ? 'A vaccine (weakened or killed germ, or its protein) gives the first, primary response without the illness.' : 'The first infection gives a slow primary response: about a week before antibodies appear, while the germ multiplies.'} At day ${second} the same antigen meets memory B and T cells, so the <b>secondary (anamnestic) response</b> starts within a day or two and rises several times higher and lasts longer. That is active immunity.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, T } = axes(ctx, w, h, col, { x: [0, 100], y: [0, 1.15], yt: [], xlabel: 'Days after first exposure', ylabel: 'Antibody level', l: 30 });
    const pts = []; for (let t = 0; t <= 100; t += 0.5) pts.push([X(t), Y(level(t))]);
    line(ctx, pts, col.s[0], 2.5);
    for (const [t, lab] of [[0, vacc === 'yes' ? 'vaccine' : '1st'], [second, '2nd']]) {
      ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(t), Y(0)); ctx.lineTo(X(t), T); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, lab, X(t) + 4, T + 8, { color: col.muted, size: 11 });
    }
    text(ctx, 'primary', X(14), Y(0.32), { color: col.s[0], size: 11, align: 'center' });
    text(ctx, 'secondary', X(second + 9), Y(1.06), { color: col.s[0], size: 11 });
  };
  cv.redraw(); show();
}
