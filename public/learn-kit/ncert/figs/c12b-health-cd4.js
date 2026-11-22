// Class 12 Human Health and Disease: course of an HIV infection (illustrative curve, not patient data). Helper T (CD4) cells fall slowly over years; below about 200 cells per microlitre the body
// cannot fight common infections: AIDS. Antiretroviral treatment (ART), started at the chosen year, lowers the virus and lets the CD4 count recover. Slide the year ART starts.
import { canvas, text, title, axes, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let art = 11;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'CD4 helper T cell count over years of HIV infection, with and without treatment' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Start treatment (ART) in year', min: 1, max: 11, step: 1, value: art, fmt: (v) => (v > 10 ? 'never' : String(v)), oninput: (v) => { art = v; go(); } });
  const base = (t) => (t < 0.4 ? 800 - 250 * (t / 0.4) : 550 * Math.exp(-0.2 * (t - 0.4)) + 20);
  const cd4 = (t) => { if (t <= art) return base(t); const b = base(art), tgt = 650; return tgt - (tgt - b) * Math.exp(-0.6 * (t - art)); };
  const go = () => {
    let yr = null; for (let t = 0; t <= 12; t += 0.05) if (cd4(t) < 200) { yr = t; break; }
    ro.textContent = art > 10 ? `Without treatment the count falls below 200 (AIDS) around year ${yr.toFixed(0)}. Early on, the person looks well, and can pass the virus on.` : (yr ? `Treatment starts too late to prevent AIDS: the count dips below 200 near year ${yr.toFixed(0)}, then recovers.` : `Treatment from year ${art} keeps the count above 200 and the person stays well. ART does not cure HIV but controls it.`) + ' Curves are illustrative.';
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Helper T cells (CD4) during HIV infection', col);
    const A = axes(ctx, w, h, col, { x: [0, 12], y: [0, 900], xlabel: 'years after infection', ylabel: 'CD4 cells per µL', l: 58, t: t0 + 6, b: 40, xt: [0, 3, 6, 9, 12], yt: [0, 200, 400, 600, 800] });
    ctx.save(); A.clip(); ctx.fillStyle = col.bad; ctx.globalAlpha = 0.12; ctx.fillRect(A.L, A.Y(200), A.R - A.L, A.B - A.Y(200)); ctx.globalAlpha = 1; ctx.restore();
    text(ctx, 'AIDS (below 200)', A.L + 6, A.Y(100), { color: col.bad, size: 10.5, weight: 700 });
    const pts = (f) => { const o = []; for (let t = 0; t <= 12; t += 0.1) o.push([A.X(t), A.Y(f(t))]); return o; };
    line(ctx, pts(base), art > 10 ? col.s[3] : col.line, art > 10 ? 3 : 2, art > 10 ? null : [5, 3]);
    if (art <= 10) { line(ctx, pts(cd4), col.s[2], 3); line(ctx, [[A.X(art), A.T], [A.X(art), A.B]], col.muted, 1, [3, 3]); text(ctx, 'ART starts', A.X(art) + 4, A.T + 10, { color: col.muted, size: 10.5 }); }
    text(ctx, art > 10 ? 'no treatment' : 'dashed: no treatment', A.R - 6, A.T + 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  go();
}
