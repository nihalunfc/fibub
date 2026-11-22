// Class 9 Journey Inside the Atom: three models of the same atom (lithium: 3 protons, 4 neutrons, 3 electrons).
// Thomson (1904): a ball of positive charge with electrons stuck in it like plums in a pudding.
// Rutherford (1911): a tiny dense positive nucleus with electrons circling far outside it.
// Bohr (1913): electrons only in fixed circular shells with fixed energy; they do not spiral in. Use the buttons to
// compare, and see what each model could and could not explain.
import { canvas, text, title, dot, row, choice, readout, loop } from '../../kit.js';

const M = {
  thom: { name: 'Thomson', year: 1904, ok: 'Atoms are neutral overall; electrons are inside atoms.', no: 'Cannot explain the big bends in the gold-foil experiment.' },
  ruth: { name: 'Rutherford', year: 1911, ok: 'Explains the gold-foil result: a tiny, dense, positive nucleus.', no: 'A circling electron should lose energy and spiral into the nucleus, so atoms should collapse. They do not.' },
  bohr: { name: 'Bohr', year: 1913, ok: 'Electrons stay in fixed shells with fixed energies, so atoms are stable. Explains why chemistry repeats in a pattern.', no: 'Works well for hydrogen; needs quantum mechanics later for bigger atoms.' },
};
export default function (host) {
  let m = 'thom', t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 300, label: 'The Thomson Rutherford and Bohr models of a lithium atom' });
  const ctl = row(host);
  choice(ctl, 'Model', Object.entries(M).map(([v, d]) => [v, `${d.name} ${d.year}`]), m, (v) => { m = v; upd(); });
  const out = readout(host);
  function upd() { out.innerHTML = `<b>Good:</b> ${M[m].ok}<br><b>Problem:</b> ${M[m].no}`; cv.redraw(); }
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${M[m].name} model of lithium (3 p, 4 n, 3 e⁻)`, col);
    const cx = w / 2, cy = h * 0.56, R = Math.min(w, h) * 0.38;
    if (m === 'thom') {
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, '+ + + + (spread-out positive charge)', cx, cy - R - 10, { color: col.s[1], size: 11, weight: 700, align: 'center' });
      [[-0.45, -0.2], [0.4, -0.35], [0.05, 0.5]].forEach(([a, b], i) => { const j = Math.sin(t * 2 + i * 2) * 3; dot(ctx, cx + a * R + j, cy + b * R + j * 0.7, 7, col.s[2]); text(ctx, '−', cx + a * R + j, cy + b * R + j * 0.7, { color: col.panel, size: 11, weight: 700, align: 'center', fit: false }); });
    } else if (m === 'ruth') {
      ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.line; ctx.stroke(); ctx.setLineDash([]);
      dot(ctx, cx, cy, 11, col.s[1]); text(ctx, '7 particles', cx, cy + 24, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
      text(ctx, 'tiny dense nucleus', cx, cy - 20, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
      for (let i = 0; i < 3; i++) { const a = t * 1.4 + i * 2.09, rr = R * (0.55 + 0.3 * (i % 2)); dot(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 6, col.s[2]); }
      text(ctx, 'electrons circle far away…', cx, cy + R + 18, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, '…and should spiral in (problem)', cx, cy + R + 32, { color: col.bad, size: 10.5, weight: 700, align: 'center' });
    } else {
      const rs = [R * 0.5, R * 0.95];
      rs.forEach((r) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.stroke(); });
      dot(ctx, cx, cy, 11, col.s[1]);
      [[0, 0], [1, 3.1], [2, 0]].forEach(([shell, ph0], i) => { const sh = i < 2 ? 0 : 1; const a = t * (sh ? 0.8 : 1.5) + ph0; dot(ctx, cx + Math.cos(a) * rs[sh], cy + Math.sin(a) * rs[sh], 6, col.s[2]); });
      text(ctx, 'shell 1 (max 2 e⁻)', cx, cy - rs[0] - 6, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'shell 2 (max 8 e⁻)', cx, cy - rs[1] - 6, { color: col.muted, size: 10, align: 'center' });
      text(ctx, 'electrons only in fixed shells: no spiral', cx, cy + R + 22, { color: col.good, size: 10.5, weight: 700, align: 'center' });
    }
  };
  upd();
}
