// Class 10 Metals and Non-metals: ionic bond formation by electron transfer. A metal atom gives its outer electrons
// away and becomes a positive ion; a non-metal atom takes them to complete its outer shell (the octet) and becomes a
// negative ion. The opposite charges attract. Examples: NaCl, MgO, MgCl2, Na2O. Outer-shell electrons are drawn as dots.
import { canvas, text, title, line, dot, row, choice, readout, loop, ease, clamp, lerp } from '../../kit.js';

const CASES = {
  nacl: { name: 'NaCl', M: { s: 'Na', cfg: '2,8,1', ion: '2,8', e: 1, n: 1 }, N: { s: 'Cl', cfg: '2,8,7', ion: '2,8,8', need: 1, n: 1, out: 7 } },
  mgo: { name: 'MgO', M: { s: 'Mg', cfg: '2,8,2', ion: '2,8', e: 2, n: 1 }, N: { s: 'O', cfg: '2,6', ion: '2,8', need: 2, n: 1, out: 6 } },
  mgcl2: { name: 'MgCl₂', M: { s: 'Mg', cfg: '2,8,2', ion: '2,8', e: 2, n: 1 }, N: { s: 'Cl', cfg: '2,8,7', ion: '2,8,8', need: 1, n: 2, out: 7 } },
  na2o: { name: 'Na₂O', M: { s: 'Na', cfg: '2,8,1', ion: '2,8', e: 1, n: 2 }, N: { s: 'O', cfg: '2,6', ion: '2,8', need: 2, n: 1, out: 6 } },
};
export default function (host) {
  let k = 'nacl', t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Electrons moving from metal atoms to non-metal atoms to make ions that attract' });
  const ctl = row(host);
  choice(ctl, 'Compound', Object.entries(CASES).map(([v, o]) => [v, o.name]), k, (v) => { k = v; t = 0; say(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  function say() {
    const C = CASES[k], { M, N } = C;
    out.innerHTML = `<b>${C.name}</b>: each ${M.s} atom (${M.cfg}) gives away ${M.e} electron${M.e > 1 ? 's' : ''} and becomes ${M.s}${M.e > 1 ? '²' : ''}⁺ (${M.ion}); each ${N.s} atom (${N.cfg}) takes ${N.need} and becomes ${N.s}${N.need > 1 ? '²' : ''}⁻ (${N.ion}). Both now have a full outer shell. ${M.n} ${M.s} : ${N.n} ${N.s} gives a neutral compound, since ${M.n * M.e} plus charge = ${N.n * N.need} minus charge.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const C = CASES[k], { M, N } = C, top = title(ctx, `${C.name}: electron transfer`, col) + 8, c = (t % 8) / 8, mv = ease(clamp((c - 0.2) / 0.35, 0, 1)), att = ease(clamp((c - 0.6) / 0.25, 0, 1));
    const cy = top + (h - top - 40) / 2, R0 = Math.min(34, w * 0.09);
    const mx = lerp(w * 0.22, w * 0.36, att), nx = lerp(w * 0.78, w * 0.64, att);
    const place = (n, x) => Array.from({ length: n }, (_, i) => [x, n === 1 ? cy : cy + (i - (n - 1) / 2) * (2 * R0 + 12)]);
    const ms = place(M.n, mx).map(([x, y]) => [x - (M.n === 2 && N.n === 1 ? 0 : 0), y]), ns = place(N.n, nx);
    // atoms
    const atom = (x, y, sym, ion, charge, filled) => {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, R0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, R0 * 0.55, 0, 7); ctx.strokeStyle = col.line; ctx.stroke();
      text(ctx, sym, x, y, { color: col.ink, size: 13, weight: 700, align: 'center' });
      if (charge) text(ctx, charge, x + R0 * 0.75, y - R0 * 0.85, { color: charge[0] === '+' || charge.includes('⁺') ? col.s[7] : col.s[0], size: 13, weight: 700 });
    };
    const slots = (x, y, n0, extra) => { for (let i = 0; i < n0 + extra.length; i++) { const a = i * (Math.PI / 4) - Math.PI / 2; const px = x + Math.cos(a) * R0, py = y + Math.sin(a) * R0; if (i < n0) dot(ctx, px, py, 3.2, col.s[1]); } };
    // metal atoms: outer electrons (not yet moved are drawn on the ring; moved ones fly)
    const flights = []; let target = 0;
    ms.forEach(([x, y], mi) => {
      for (let j = 0; j < M.e; j++) {
        const a = j * (Math.PI / 4) - Math.PI / 2, sx = x + Math.cos(a) * R0, sy = y + Math.sin(a) * R0;
        const ni = Math.floor(target / N.need), nj = target % N.need; target++;
        const [tx0, ty0] = ns[ni]; const ta = (N.out + nj) * (Math.PI / 4) - Math.PI / 2, ex = tx0 + Math.cos(ta) * R0, ey = ty0 + Math.sin(ta) * R0;
        flights.push([sx, sy, ex, ey]);
      }
    });
    ms.forEach(([x, y]) => { atom(x, y, M.s, M.ion, mv > 0.99 ? `${M.e > 1 ? M.e : ''}+` : ''); });
    ns.forEach(([x, y]) => { atom(x, y, N.s, N.ion, mv > 0.99 ? `${N.need > 1 ? N.need : ''}−` : ''); for (let i = 0; i < N.out; i++) { const a = i * (Math.PI / 4) - Math.PI / 2; dot(ctx, x + Math.cos(a) * R0, y + Math.sin(a) * R0, 3.2, col.s[2]); } });
    flights.forEach(([sx, sy, ex, ey]) => { const f = mv; const x = lerp(sx, ex + (nx - w * 0.64) * 0, f), y = lerp(sy, ey, f) - Math.sin(f * Math.PI) * 18; dot(ctx, x, y, 3.4, col.s[3], col.ink); });
    // static metal electrons before they leave
    ms.forEach(([x, y]) => { if (mv < 0.01) for (let j = 0; j < M.e; j++) { const a = j * (Math.PI / 4) - Math.PI / 2; dot(ctx, x + Math.cos(a) * R0, y + Math.sin(a) * R0, 3.2, col.s[3], col.ink); } });
    // attraction
    if (att > 0.1) { ms.forEach(([x, y]) => ns.forEach(([x2, y2]) => { line(ctx, [[x + R0, y], [x2 - R0, y2]], col.s[2], 1.5, [4, 3]); })); text(ctx, 'opposite charges attract', w / 2, cy + (M.n === 2 || N.n === 2 ? 2 * R0 + 22 : R0 + 22), { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    text(ctx, mv < 0.05 ? `before: ${M.s} ${M.cfg}   ${N.s} ${N.cfg}` : mv < 0.99 ? 'electrons move to the non-metal...' : `after: ${M.s}⁺ ${M.ion}   ${N.s}⁻ ${N.ion}`, w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  say();
}
