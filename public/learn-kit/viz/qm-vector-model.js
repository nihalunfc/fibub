// The vector model of an atom in 3D (drag to turn): orbital L and spin S add to a total J, L and S precess quickly about J,
// and J precesses slowly about the field B (z). Pick l, s, j and m_j; switch B on or off. Readout gives the lengths √(x(x+1)),
// the angle between L and S, the angle of J to B and the Landé factor g_J that sets the Zeeman splitting g_J m_j μ_B B.
import { canvas, text, title, arrow, row, choice, readout, loop, line } from '../kit.js';
import { orbit } from './_3d.js';

const fr = (x) => (Number.isInteger(x) ? String(x) : `${2 * x}/2`);
export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 480, min: 360, label: 'Orbital and spin angular momentum adding to a total angular momentum, precessing about a field' });
  const cam = orbit(cv, { yaw: 0.8, pitch: 0.35 });
  let l = 1, s = 0.5, j = 1.5, mj = 1.5, field = true, a1 = 0, a2 = 0;
  const ctl = row(host), ctl2 = row(host), ctl3 = row(host), out = readout(host);
  const js = () => { const o = []; for (let x = Math.abs(l - s); x <= l + s + 1e-9; x++) o.push(x); return o; };
  const mjs = () => { const o = []; for (let m = -j; m <= j + 1e-9; m++) o.push(m); return o; };
  let gl, gs, gj, gm;
  const build = () => {
    ctl.innerHTML = ''; ctl2.innerHTML = ''; ctl3.innerHTML = '';
    choice(ctl, 'l', [[1, '1 (p)'], [2, '2 (d)'], [3, '3 (f)']], l, (v) => { l = v; j = js().slice(-1)[0]; mj = j; build(); show(); });
    choice(ctl, 's', [[0.5, '½'], [1, '1']], s, (v) => { s = v; j = js().slice(-1)[0]; mj = j; build(); show(); });
    choice(ctl2, 'j', js().map((x) => [x, fr(x)]), j, (v) => { j = v; mj = j; build(); show(); });
    choice(ctl2, 'm_j', mjs().map((x) => [x, fr(x)]), mj, (v) => { mj = v; show(); });
    choice(ctl3, 'Field B', [[true, 'On (J precesses)'], [false, 'Off']], field, (v) => { field = v; show(); });
    anim.button(ctl3);
  };
  const anim = loop(host, (dt) => { a1 += dt * 7; a2 += dt * 1.1; cv.redraw(); });
  const mag = (x) => Math.sqrt(x * (x + 1));
  function show() {
    const gJ = j === 0 ? 0 : 1 + (j * (j + 1) + s * (s + 1) - l * (l + 1)) / (2 * j * (j + 1));
    const LS = (j * (j + 1) - l * (l + 1) - s * (s + 1)) / 2, cosLS = LS / (mag(l) * mag(s));
    out.innerHTML = `|L| = √${l * (l + 1)} = ${mag(l).toFixed(2)}ħ, |S| = ${mag(s).toFixed(2)}ħ, |J| = ${mag(j).toFixed(2)}ħ. L·S = ½[j(j+1) − l(l+1) − s(s+1)] = <b>${LS.toFixed(2)}ħ²</b> (angle between L and S ≈ ${(Math.acos(Math.max(-1, Math.min(1, cosLS))) * 180 / Math.PI).toFixed(0)}°). J makes cos⁻¹(m_j/|J|) = <b>${j ? (Math.acos(mj / mag(j)) * 180 / Math.PI).toFixed(0) : '–'}°</b> with B. Landé g_J = <b>${gJ.toFixed(3)}</b>, so E = g_J m_j μ_B B = ${(gJ * mj).toFixed(3)} μ_B B.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `L + S = J  (l = ${l}, s = ${fr(s)}, j = ${fr(j)})`, col);
    const Jm = mag(j), Lm = mag(l), Sm = mag(s), sc = Math.min(w, h) * 0.17, P = cam.proj(w, h, sc, w * 0.5, h * 0.5);
    const cosT = Jm ? mj / Jm : 1, sinT = Math.sqrt(Math.max(0, 1 - cosT * cosT)), pj = field ? a2 : 0.6;
    const uj = Jm ? [sinT * Math.cos(pj), cosT, sinT * Math.sin(pj)] : [0, 1, 0];
    const J = uj.map((x) => x * Jm);
    // basis perpendicular to uj
    let e1 = [-Math.sin(pj), 0, Math.cos(pj)]; if (!Jm) e1 = [1, 0, 0];
    const e2 = [uj[1] * e1[2] - uj[2] * e1[1], uj[2] * e1[0] - uj[0] * e1[2], uj[0] * e1[1] - uj[1] * e1[0]];
    const cosA = Jm ? (Jm * Jm + Lm * Lm - Sm * Sm) / (2 * Jm * Lm) : 0, sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    const Lv = [0, 1, 2].map((i) => Lm * ((Jm ? cosA : 0) * uj[i] + sinA * (Math.cos(a1) * e1[i] + Math.sin(a1) * e2[i])));
    const Sv = J.map((x, i) => x - Lv[i]);
    const o = P([0, 0, 0]), pB = P([0, 3.8, 0]), pb0 = P([0, -3.4, 0]);
    if (field) { arrow(ctx, pb0[0], pb0[1], pB[0], pB[1], col.muted, 1.5, 7); text(ctx, 'B', pB[0] + 6, pB[1], { color: col.muted, size: 11, weight: 700 }); }
    // cone of J
    if (field && Jm) line(ctx, Array.from({ length: 61 }, (_, i) => { const p = P([J[1] === 0 ? 0 : Jm * sinT * Math.cos(i / 60 * 6.283), Jm * cosT, Jm * sinT * Math.sin(i / 60 * 6.283)]); return [p[0], p[1]]; }), col.line, 1, [3, 3]);
    const pJ = P(J), pL = P(Lv), pS = P(Sv), pLJ = P(Lv);
    arrow(ctx, o[0], o[1], pL[0], pL[1], col.s[0], 2.4, 8);
    arrow(ctx, pL[0], pL[1], pJ[0], pJ[1], col.s[1], 2.4, 8);
    arrow(ctx, o[0], o[1], pJ[0], pJ[1], col.s[2], 3.4, 10);
    text(ctx, 'L', (o[0] + pL[0]) / 2 - 9, (o[1] + pL[1]) / 2, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'S', (pL[0] + pJ[0]) / 2 + 9, (pL[1] + pJ[1]) / 2, { color: col.s[1], size: 12, weight: 700 }); text(ctx, 'J', pJ[0] + 9, pJ[1] - 6, { color: col.s[2], size: 13, weight: 700 });
    text(ctx, 'Drag to turn', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' });
  };
  build(); show();
}
