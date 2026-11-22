// A heat engine at work: gas in a cylinder with a piston goes round a cycle (Carnot or the petrol-engine Otto cycle). The
// dot on the P-V loop and the piston move together; the shaded loop area is the net work per cycle. Change the hot
// temperature (Carnot) or the compression ratio (Otto) and watch the loop and the efficiency change. 1 mole of
// a diatomic gas (gamma = 1.4), temperatures in kelvin.
import { canvas, axes, line, dot, text, title, arrow, row, slider, choice, readout, loop } from '../kit.js';

const G = 1.4, R = 8.314, CV = 2.5 * R, TCOLD = 300;
// A cycle is a list of segments, each sampled as [V (L), P (kPa), phase]; V from the model in litres, P = nRT/V.
function build(kind, p) {
  const seg = [], add = (name, f, n = 40) => { const pts = []; for (let i = 0; i <= n; i++) pts.push(f(i / n)); seg.push({ name, pts }); };
  const PV = (T, V) => [V, (R * T) / V]; // V in L → P in kPa (R T / V(L) = kPa)
  if (kind === 'carnot') {
    const Th = p, Va = 2, Vb = 6, Vc = Vb * Math.pow(Th / TCOLD, 1 / (G - 1)), Vd = Va * Math.pow(Th / TCOLD, 1 / (G - 1));
    add('Isothermal expansion (heat in)', (u) => PV(Th, Va + (Vb - Va) * u)); add('Adiabatic expansion', (u) => { const V = Vb * Math.pow(Vc / Vb, u); return PV(Th * Math.pow(Vb / V, G - 1), V); });
    add('Isothermal compression (heat out)', (u) => PV(TCOLD, Vc + (Vd - Vc) * u)); add('Adiabatic compression', (u) => { const V = Vd * Math.pow(Va / Vd, u); return PV(TCOLD * Math.pow(Vd / V, G - 1), V); });
    const Qh = R * Th * Math.log(Vb / Va), Qc = R * TCOLD * Math.log(Vc / Vd);
    return { seg, Qh, Qc, W: Qh - Qc, eta: 1 - TCOLD / Th, heat: [1, 0, -1, 0], Vmax: Vd * 1.05 };
  }
  const r = p, V2 = 1, V1 = r, T1 = TCOLD, T2 = T1 * Math.pow(r, G - 1), T3 = 1800, T4 = T3 * Math.pow(r, 1 - G);
  add('Adiabatic compression', (u) => { const V = V1 * Math.pow(V2 / V1, u); return PV(T1 * Math.pow(V1 / V, G - 1), V); });
  add('Heat in at constant volume (spark)', (u) => PV(T2 + (T3 - T2) * u, V2)); add('Adiabatic power stroke', (u) => { const V = V2 * Math.pow(V1 / V2, u); return PV(T3 * Math.pow(V2 / V, G - 1), V); });
  add('Heat out at constant volume', (u) => PV(T4 + (T1 - T4) * u, V1));
  const Qh = CV * (T3 - T2), Qc = CV * (T4 - T1);
  return { seg, Qh, Qc, W: Qh - Qc, eta: 1 - Math.pow(r, 1 - G), heat: [0, 1, 0, -1], Vmax: V1 * 1.05 };
}
export default function (host) {
  let kind = 'otto', Th = 600, r = 8, s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A piston and cylinder going round a heat-engine cycle, with the P-V loop' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Cycle', [['otto', 'Petrol (Otto)'], ['carnot', 'Carnot']], kind, (v) => { kind = v; vis(); upd(); });
  const sT = slider(c2, { label: 'T hot', min: 400, max: 800, step: 25, value: Th, fmt: (v) => `${v} K`, oninput: (v) => { Th = v; upd(); } }), sR = slider(c2, { label: 'Compression ratio', min: 4, max: 14, step: 0.5, value: r, fmt: (v) => `${v}`, oninput: (v) => { r = v; upd(); } });
  const vis = () => { sT && (c2.children[0].style.display = kind === 'carnot' ? '' : 'none'); c2.children[1].style.display = kind === 'otto' ? '' : 'none'; };
  const lp = loop(host, (dt) => { s = (s + dt * 0.16) % 4; cv.redraw(); show(); }); lp.button(ctl);
  const out = readout(host);
  let C = build(kind, kind === 'carnot' ? Th : r);
  function upd() { C = build(kind, kind === 'carnot' ? Th : r); cv.redraw(); show(); }
  const pos = () => { const i = Math.floor(s) % 4, u = s - Math.floor(s), pts = C.seg[i].pts, k = Math.min(pts.length - 1, Math.round(u * (pts.length - 1))); return { i, pt: pts[k] }; };
  function show() {
    const { i } = pos(), h = C.heat[i];
    out.innerHTML = `<b>${C.seg[i].name}.</b> Heat in Q<sub>h</sub> = ${(C.Qh / 1000).toFixed(2)} kJ, heat out Q<sub>c</sub> = ${(C.Qc / 1000).toFixed(2)} kJ, so net work W = Q<sub>h</sub> − Q<sub>c</sub> = <b>${(C.W / 1000).toFixed(2)} kJ</b> per cycle = area of the loop. Efficiency W/Q<sub>h</sub> = <b>${(C.W / C.Qh * 100).toFixed(1)} %</b> (formula ${kind === 'carnot' ? '1 − T<sub>c</sub>/T<sub>h</sub>' : '1 − r<sup>1−γ</sup>'} = ${(C.eta * 100).toFixed(1)} %).`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, kind === 'carnot' ? 'Carnot cycle' : 'Otto cycle (petrol engine)', col);
    const all = C.seg.flatMap((q) => q.pts), pmax = Math.max(...all.map((p) => p[1])) * 1.1, vmax = C.Vmax;
    const cw = Math.min(90, w * 0.26);
    // cylinder
    const cx = 12, cy = 62, ch = h - 96, cyl = (V) => cy + ch * (1 - V / vmax) * 0.85 + 6;
    const { i, pt } = pos(); const py = cyl(pt[0]);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + ch); ctx.lineTo(cx + cw, cy + ch); ctx.lineTo(cx + cw, cy); ctx.stroke();
    ctx.globalAlpha = 0.18; ctx.fillStyle = C.heat[i] > 0 ? col.bad : C.heat[i] < 0 ? col.s[0] : col.s[1]; ctx.fillRect(cx + 2, py, cw - 4, cy + ch - py - 2); ctx.globalAlpha = 1;
    ctx.fillStyle = col.ink; ctx.fillRect(cx + 1, py - 8, cw - 2, 8); ctx.fillRect(cx + cw / 2 - 3, cy - 14, 6, py - cy + 8 - 0);
    if (C.heat[i] > 0) { arrow(ctx, cx + cw / 2, cy + ch + 28, cx + cw / 2, cy + ch + 4, col.bad, 3); text(ctx, 'heat in', cx + cw / 2, cy + ch + 40 > h - 6 ? h - 6 : cy + ch + 38, { color: col.bad, size: 10, align: 'center' }); }
    else if (C.heat[i] < 0) { arrow(ctx, cx + cw / 2, cy + ch + 4, cx + cw / 2, cy + ch + 28, col.s[0], 3); text(ctx, 'heat out', cx + cw / 2, cy + ch + 38, { color: col.s[0], size: 10, align: 'center' }); }
    // PV
    ctx.save(); ctx.translate(cw + 22, 0);
    const A = axes(ctx, w - cw - 22, h, col, { x: [0, vmax], y: [0, pmax], xlabel: 'V (L)', ylabel: 'P (kPa)', l: 46, t: 30, b: 36, fx: (v) => v.toFixed(0), fy: (v) => v.toFixed(0) });
    ctx.beginPath(); C.seg.forEach((q) => q.pts.forEach(([V, P], k) => ctx.lineTo(A.X(V), A.Y(P)))); ctx.closePath(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[2]; ctx.fill(); ctx.globalAlpha = 1;
    C.seg.forEach((q, k) => line(ctx, q.pts.map(([V, P]) => [A.X(V), A.Y(P)]), k === i ? col.s[3] : col.s[0], k === i ? 4 : 2.2));
    dot(ctx, A.X(pt[0]), A.Y(pt[1]), 6.5, col.s[3], col.panel);
    text(ctx, 'W = area', A.X(vmax * 0.5), A.Y(pmax * 0.5), { color: col.ink, size: 11, weight: 600, align: 'center' });
    ctx.restore();
  };
  vis(); upd();
  return { step(i, n) { lp.pause(); s = (i % 4) + 0.5; cv.redraw(); show(); } };
}
