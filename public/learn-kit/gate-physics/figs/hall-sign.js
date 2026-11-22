// 7.8 Semiconductors and the Hall effect. A bar carries current I along +x in a field B out of the page (+z).
// Electrons (n-type) drift along -x, holes (p-type) along +x; the Lorentz force pushes both towards the same
// (bottom) edge, so the sign of the charge piled there, and of the Hall voltage, tells the carrier sign.
// A third choice adds both carriers (intrinsic, mobility ratio b) and shows R_H ∝ (p - b²n).
import { canvas, line, text, arrow, dot, row, slider, choice, readout, fmt, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 280, label: 'Hall bar: carriers deflected by a magnetic field and the sign of the Hall voltage for n-type and p-type samples' });
  let kind = 'n', B = 0.5, nexp = 21;
  const ctl = row(host);
  const out = readout(host);
  const I = 1e-3, tk = 1e-4, e = 1.602176634e-19;
  const show = () => {
    const n = 10 ** nexp, VH = I * B / (n * e * tk);
    if (kind === 'both') {
      out.innerHTML = 'Electrons and holes in equal numbers with μ<sub>e</sub> = 3μ<sub>h</sub>: both are pushed to the bottom edge, but the electrons are deflected more strongly, so the bottom ends up negative. R<sub>H</sub> = (p − b²n)/e(p + bn)² is <b>negative</b> and smaller than for electrons alone.';
      return;
    }
    out.innerHTML = `${kind === 'n' ? 'Electrons' : 'Holes'}, ${fmt(n, 2)} m⁻³, I = 1 mA, thickness 0.1 mm, B = ${fmt(B, 2)} T: V<sub>H</sub> = IB/(net) = <b>${fmt(VH * 1000, 3)} mV</b>, with the top edge ${kind === 'n' ? '<b>positive</b>' : '<b>negative</b>'} (R<sub>H</sub> ${kind === 'n' ? '< 0' : '> 0'}).`;
  };
  choice(ctl, 'Carriers', [['n', 'n-type'], ['p', 'p-type'], ['both', 'both (b = 3)']], kind, (v) => { kind = v; show(); cv.redraw(); });
  slider(ctl, { label: 'B (T)', min: 0, max: 1.5, step: 0.05, value: B, fmt: (v) => fmt(v, 2), oninput: (v) => { B = v; show(); cv.redraw(); } });
  slider(ctl, { label: 'log₁₀ n (m⁻³)', min: 19, max: 24, step: 0.5, value: nexp, fmt: (v) => fmt(v, 3), oninput: (v) => { nexp = v; show(); } });

  let phase = 0;
  const lp = loop(host, (dt) => { phase = (phase + dt * 0.25) % 1; cv.redraw(); });
  lp.button(ctl);

  cv.draw = (ctx, w, h, col) => {
    const L = 50, R = w - 50, T = h * 0.28, Bt = h * 0.72;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, T, R - L, Bt - T);
    // current arrow
    arrow(ctx, L - 40, (T + Bt) / 2, L - 4, (T + Bt) / 2, col.ink, 2);
    arrow(ctx, R + 4, (T + Bt) / 2, R + 40, (T + Bt) / 2, col.ink, 2);
    text(ctx, 'I', L - 30, (T + Bt) / 2 - 12, { color: col.ink, size: 13, weight: 700 });
    // B out of page symbols
    for (let i = 0; i < 6; i++) { const x = L + (R - L) * (i + 0.5) / 6; dot(ctx, x, T - 22, 5, col.panel, col.muted); dot(ctx, x, T - 22, 1.6, col.muted); }
    text(ctx, `B out of the page (${fmt(B, 2)} T)`, L, T - 42, { color: col.muted, size: 12 });
    const kinds = kind === 'both' ? ['n', 'p'] : [kind];
    const defl = Math.min(1, B / 1.0);
    kinds.forEach((k, j) => {
      const c = k === 'n' ? col.s[0] : col.s[2], dir = k === 'n' ? -1 : 1, mob = kind === 'both' ? (k === 'n' ? 1 : 0.33) : 1;
      for (let i = 0; i < 7; i++) {
        const f = ((i / 7 + phase * (k === 'n' ? -1 : 1) * mob) % 1 + 1) % 1;
        const x = L + 20 + (R - L - 40) * f, y = (T + Bt) / 2 + (j - (kinds.length - 1) / 2) * 22 + defl * mob * (Bt - T) * 0.18;
        dot(ctx, x, y, 7, c);
        text(ctx, k === 'n' ? '−' : '+', x, y + 0.5, { color: col.panel, size: 12, weight: 700, align: 'center', fit: false });
        if (i === 3) {
          arrow(ctx, x, y - 14, x + dir * 28, y - 14, c, 1.6, 6);
          if (B > 0) arrow(ctx, x + 14, y, x + 14, y + 22 * defl * mob + 6, c, 1.6, 6);
        }
      }
    });
    // accumulated edge charge
    const sgnBottom = kind === 'p' ? '+' : '−', sgnTop = kind === 'p' ? '−' : '+';
    const nCh = Math.round(8 * Math.min(1, B));
    for (let i = 0; i < nCh; i++) {
      const x = L + (R - L) * (i + 0.5) / nCh;
      text(ctx, sgnBottom, x, Bt + 12, { color: kind === 'p' ? col.s[2] : col.s[0], size: 15, weight: 700, align: 'center' });
      text(ctx, sgnTop, x, T + 10, { color: col.muted, size: 13, weight: 700, align: 'center' });
    }
    text(ctx, kind === 'p' ? 'top edge negative: V_H < 0, R_H > 0' : 'top edge positive: V_H > 0, R_H < 0', L, h - 14, { color: col.ink, size: 12.5, weight: 700 });
    text(ctx, 'arrows: drift velocity and magnetic force', R, h - 14, { color: col.muted, size: 11, align: 'right' });
  };
  show(); cv.redraw();
}
