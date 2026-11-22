// Class 12 Biology, Biotechnology and its Applications: early detection of an infection by PCR and by ELISA (illustrative curves, not real patient data).
// PCR amplifies a trace of the pathogen's nucleic acid, so it can detect it long before symptoms. ELISA detects antigens or the antibodies
// made against the pathogen (antigen-antibody reaction with an enzyme-linked second antibody giving a colour), so it turns positive later.
import { canvas, axes, line, text, title, row, slider, readout, dot } from '../../kit.js';

export default function (host) {
  let d = 10;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Pathogen amount and antibody level after an infection, with the thresholds at which PCR and ELISA turn positive' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'days since infection', min: 0, max: 40, step: 1, value: 10, fmt: (v) => v.toFixed(0), oninput: (v) => { d = v; go(); } });
  const path = (t) => 1e2 * Math.exp(0.45 * t) / (1 + Math.exp(0.45 * t) / 3e4 * 1e2 / 1e2 * 0 + (Math.exp(0.45 * (t - 14)) * 0.02));
  const anti = (t) => 1e1 + 1e5 / (1 + Math.exp(-(t - 22) * 0.45));
  const PCRT = 1e3, ELT = 1e5 / 2;
  const first = (f, th) => { for (let t = 0; t <= 40; t += 0.5) if (f(t) >= th) return t; return null; };
  const go = () => {
    const pc = path(d) >= PCRT, el = anti(d) >= ELT, tp = first(path, PCRT), te = first(anti, ELT);
    ro.textContent = `Day ${d}: PCR ${pc ? 'positive' : 'negative'}, ELISA ${el ? 'positive' : 'negative'}. In this model PCR turns positive from about day ${tp}, ELISA from about day ${te}: PCR finds the infection ${te - tp} days earlier, before the body has made enough antibody.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'PCR finds it first, ELISA later', col);
    const a = axes(ctx, w, h, col, { x: [0, 40], y: [1, 1e7], ylog: true, xlabel: 'days since infection', ylabel: 'amount (log scale)', l: 62, t: 36, fy: (v) => '10^' + Math.round(Math.log10(v)), yt: [1, 1e2, 1e4, 1e6], xt: [0, 10, 20, 30, 40] });
    const P = [], A = []; for (let t = 0; t <= 40; t += 0.5) { P.push([a.X(t), a.Y(Math.max(1, path(t)))]); A.push([a.X(t), a.Y(Math.max(1, anti(t)))]); }
    line(ctx, P, col.s[2], 2.5); line(ctx, A, col.s[0], 2.5);
    ctx.setLineDash([5, 4]); line(ctx, [[a.L, a.Y(PCRT)], [a.R, a.Y(PCRT)]], col.s[2], 1.2); line(ctx, [[a.L, a.Y(ELT)], [a.R, a.Y(ELT)]], col.s[0], 1.2); ctx.setLineDash([]);
    text(ctx, 'pathogen DNA/RNA (PCR can see it above the dashed line)', a.L + 4, a.T + 8, { color: col.s[2], size: 10, weight: 700 }); text(ctx, 'antibody (ELISA needs a higher level)', a.L + 4, a.T + 22, { color: col.s[0], size: 10, weight: 700 });
    line(ctx, [[a.X(d), a.T], [a.X(d), a.B]], col.ink, 1.5);
    dot(ctx, a.X(d), a.Y(Math.max(1, path(d))), 5, col.s[2], col.panel); dot(ctx, a.X(d), a.Y(Math.max(1, anti(d))), 5, col.s[0], col.panel);
    const bx = a.R - 6;
    [['PCR', path(d) >= PCRT, col.s[2]], ['ELISA', anti(d) >= ELT, col.s[0]]].forEach(([n, on, c], i) => { text(ctx, `${n}: ${on ? '+ positive' : '− negative'}`, bx, a.B - 40 + i * 16, { color: on ? col.good : col.muted, size: 11, weight: 700, align: 'right', halo: col.panel }); void c; });
  };
  go();
}
