// Class 11 Chemistry, Hydrocarbons: why alkenes have cis-trans isomers and alkanes do not. Seen down the C-C axis (Newman view), turning one carbon relative to the other changes the overlap of the two p orbitals
// that make the pi bond. Single bond: only a small barrier (about 12 kJ/mol for ethane, repeating every 120 deg), so groups spin freely. Double bond: the pi bond must break to turn (about 260 kJ/mol at 90 deg,
// E = 260 sin^2(phi)); at room temperature (RT ~ 2.5 kJ/mol) that never happens, so cis (0 deg) and trans (180 deg) but-2-ene are different, separable compounds.
// But-2-ene: cis b.p. 276.9 K, m.p. 134 K; trans b.p. 274.0 K, m.p. 168 K.
import { canvas, text, title, slider, choice, readout, row } from '../../kit.js';

export default function (host) {
  let mode = 'db', phi = 0;
  const cv = canvas(host, { aspect: 1.1, max: 480, min: 340, label: 'Twisting about a single bond and a double bond with the energy needed' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'bond', [['db', 'C=C (but-2-ene)'], ['sb', 'C–C (butane-like)']], mode, (v) => { mode = v; go(); });
  const sl = slider(ctl, { label: 'twist the back carbon (degrees)', min: 0, max: 180, step: 1, value: phi, fmt: (v) => Math.round(v) + '°', oninput: (v) => { phi = v; go(); } });
  const E = (p) => (mode === 'db' ? 260 * Math.pow(Math.sin(p * Math.PI / 180), 2) : 12 * (1 - Math.cos(3 * p * Math.PI / 180)) / 2);
  const go = () => {
    const e = E(phi);
    ro.textContent = mode === 'db' ? `Twist ${Math.round(phi)}°: ${e.toFixed(0)} kJ/mol needed. At 90° the π bond is completely broken (about 260 kJ/mol). Room temperature gives only ~2.5 kJ/mol per molecule, so cis stays cis and trans stays trans: these are two compounds (geometrical isomers).` : `Twist ${Math.round(phi)}°: only ${e.toFixed(1)} kJ/mol at most (12 kJ/mol barrier). Collisions at room temperature easily cross it, so the groups spin freely and there are no separable cis and trans forms.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'db' ? 'Twisting about C=C needs a huge energy' : 'Twisting about C–C is easy', col);
    const cx = w * 0.3, cy = 112, r = 34, rad = (d) => (d * Math.PI) / 180, bk = phi;
    const sub = (a, c, l) => { const x = cx + Math.sin(rad(a)) * (r + 34), y = cy - Math.cos(rad(a)) * (r + 34); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + Math.sin(rad(a)) * r, cy - Math.cos(rad(a)) * r); ctx.lineTo(x, y); ctx.stroke(); text(ctx, l, cx + Math.sin(rad(a)) * (r + 48), cy - Math.cos(rad(a)) * (r + 48), { color: c, size: 11, weight: 700, align: 'center' }); };
    // double bond: two substituents per carbon at -90 and +90 degrees (left and right)
    const A = mode === 'db' ? [[-90, 'CH₃'], [90, 'H']] : [[0, 'CH₃'], [120, 'H'], [240, 'H']];
    A.forEach(([a, l]) => sub(bk + a, col.s[0], l));
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    A.forEach(([a, l]) => { const x = cx + Math.sin(rad(a)) * (r + 34), y = cy - Math.cos(rad(a)) * (r + 34); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); text(ctx, l, cx + Math.sin(rad(a)) * (r + 48), cy - Math.cos(rad(a)) * (r + 48), { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); });
    const lab = mode === 'db' ? (phi < 8 ? 'cis' : phi > 172 ? 'trans' : phi > 80 && phi < 100 ? 'π bond broken' : 'twisted') : 'any twist is allowed';
    text(ctx, lab, w * 0.7, 80, { color: col.ink, size: 14, weight: 700, align: 'center' });
    if (mode === 'db') { text(ctx, phi < 8 ? 'b.p. 277 K, m.p. 134 K' : phi > 172 ? 'b.p. 274 K, m.p. 168 K' : '', w * 0.7, 102, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, phi < 8 ? 'both CH₃ on the same side' : phi > 172 ? 'CH₃ groups on opposite sides' : '', w * 0.7, 120, { color: col.muted, size: 10.5, align: 'center' }); }
    text(ctx, 'front carbon', w * 0.7, 168, { color: col.s[3], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'back carbon', w * 0.7 + 8, 168, { color: col.s[0], size: 10.5, weight: 700 });
    // energy plot
    const L = 44, R = w - 14, T = 214, B = h - 38, mx = mode === 'db' ? 280 : 14, X = (a) => L + (a / 180) * (R - L), Y = (e) => B - (e / mx) * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(L, T, R - L, B - T);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.beginPath(); const save = phi; for (let a = 0; a <= 180; a += 2) { const e = E(a); a ? ctx.lineTo(X(a), Y(e)) : ctx.moveTo(X(a), Y(e)); } ctx.stroke();
    ctx.beginPath(); ctx.arc(X(phi), Y(E(phi)), 6, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill();
    text(ctx, 'energy (kJ/mol)', L + 4, T + 10, { color: col.muted, size: 10 }); text(ctx, mode === 'db' ? 'cis' : '0°', X(0) + 12, B + 10, { color: col.muted, size: 10 }); text(ctx, mode === 'db' ? 'trans' : '180°', X(180) - 12, B + 10, { color: col.muted, size: 10, align: 'right' });
    if (mode === 'db') { ctx.strokeStyle = col.s[0]; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(L, Y(2.5)); ctx.lineTo(R, Y(2.5)); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'room-temperature energy (2.5)', R - 4, Y(2.5) - 8, { color: col.s[0], size: 9.5, align: 'right' }); }
    text(ctx, 'twist angle (degrees)', (L + R) / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
