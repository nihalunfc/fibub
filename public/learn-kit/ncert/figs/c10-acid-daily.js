// Class 10 Acids, Bases and Salts: pH in everyday life. (1) Tooth decay: after sugary food, bacteria in the mouth make
// acid; below about pH 5.5 the enamel (calcium hydroxyapatite) starts to dissolve; saliva and brushing bring pH back.
// (2) Acidity: stomach acid is about pH 1.5; an antacid (a mild base such as magnesium hydroxide) neutralises some of it.
// (3) Soil: crops grow best in their own pH range; lime (a base) raises an acidic soil's pH.
import { canvas, text, title, line, dot, row, slider, choice, readout, clamp, lerp } from '../../kit.js';

const CROP = [['Tea', 4.5, 5.5], ['Potato', 4.8, 6.5], ['Rice', 5.0, 6.5], ['Wheat', 6.0, 7.5], ['Sugarcane', 6.0, 7.5], ['Cotton', 6.0, 8.0]];
export default function (host) {
  let mode = 'tooth', v = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'pH in the mouth after sweets, the stomach with an antacid, and farm soil' });
  const ctl = row(host);
  choice(ctl, 'Where', [['tooth', 'Teeth'], ['gut', 'Stomach'], ['soil', 'Soil']], mode, (m) => { mode = m; v = 0; sl.set(0); setR(); say(); });
  let sl;
  const mk = () => ({ tooth: { label: 'Minutes after sweets', min: 0, max: 60, step: 1, fmt: (x) => `${x} min` }, gut: { label: 'Antacid tablets', min: 0, max: 4, step: 1, fmt: (x) => `${x}` }, soil: { label: 'Soil pH', min: 4, max: 9, step: 0.1, fmt: (x) => x.toFixed(1) } })[mode];
  const wrap = document.createElement('div'); ctl.appendChild(wrap);
  function setR() { wrap.innerHTML = ''; const o = mk(); sl = slider(wrap, { ...o, value: mode === 'soil' ? 6.5 : 0, oninput: (x) => { v = x; say(); } }); if (mode === 'soil') v = 6.5; }
  setR();
  const out = readout(host);
  const mouth = (m) => 6.8 - 1.9 * Math.exp(-Math.pow((m - 12) / 11, 2)) - 0.2 * Math.min(1, m / 6);
  const gut = (n) => 1.5 + 0.55 * n + (n >= 3 ? 0.3 : 0);
  function say() {
    out.innerHTML = mode === 'tooth' ? `After ${v} min the mouth pH is <b>${mouth(v).toFixed(1)}</b>. ${mouth(v) < 5.5 ? 'Below 5.5: the acid is dissolving enamel. Rinse your mouth or brush, and avoid sipping sweets all day.' : 'Above 5.5: enamel is safe, and saliva is slowly neutralising the acid.'}`
      : mode === 'gut' ? `${v} antacid tablet(s): stomach pH about <b>${gut(v).toFixed(1)}</b>. Stomach acid (HCl, pH 1.5) does a useful job digesting food, but too much causes indigestion. A mild base like milk of magnesia, Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O, neutralises the extra. Too many tablets would stop digestion.`
        : `Soil pH ${v.toFixed(1)}. ${CROP.filter(([, a, b]) => v >= a && v <= b).map((c) => c[0]).join(', ') || 'few crops'} grow well here. Acidic soil is limed (a base, CaO or CaCO₃ is added); alkaline soil gets organic manure or gypsum.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { tooth: 'Mouth pH after eating sweets', gut: 'Stomach acid and an antacid', soil: 'Which crop likes which soil?' }[mode], col) + 10;
    const gx = 38, gy = top + 8, gw = w - gx - 14, gh = h - gy - 70;
    if (mode === 'tooth') {
      line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.line, 1.5);
      const Y = (p) => gy + gh - ((p - 4) / 4) * gh, X = (m) => gx + (m / 60) * gw;
      [4, 5.5, 7, 8].forEach((p) => text(ctx, String(p), gx - 6, Y(p), { color: col.muted, size: 9.5, align: 'right' }));
      line(ctx, [[gx, Y(5.5)], [gx + gw, Y(5.5)]], col.bad, 1.5, [5, 4]); text(ctx, 'enamel dissolves below 5.5', gx + gw, Y(5.5) + 11, { color: col.bad, size: 10, align: 'right' });
      const pts = []; for (let m = 0; m <= v; m += 1) pts.push([X(m), Y(mouth(m))]); line(ctx, pts, col.s[1], 3);
      dot(ctx, X(v), Y(mouth(v)), 5, col.s[7]);
      [0, 20, 40, 60].forEach((m) => text(ctx, String(m), X(m), gy + gh + 11, { color: col.muted, size: 9.5, align: 'center' }));
      // tooth
      const dmg = clamp((5.5 - mouth(v)) / 0.8, 0, 1) * Math.min(1, v / 12), tx = w * 0.5, ty = h - 40;
      ctx.fillStyle = '#f4f1e8'; ctx.beginPath(); ctx.moveTo(tx - 20, ty - 14); ctx.quadraticCurveTo(tx - 18, ty + 12, tx - 8, ty + 22); ctx.lineTo(tx - 4, ty + 4); ctx.lineTo(tx + 4, ty + 4); ctx.lineTo(tx + 8, ty + 22); ctx.quadraticCurveTo(tx + 18, ty + 12, tx + 20, ty - 14); ctx.quadraticCurveTo(tx, ty - 24, tx - 20, ty - 14); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
      if (dmg > 0.05) { ctx.fillStyle = `rgba(90,60,30,${dmg})`; ctx.beginPath(); ctx.arc(tx - 6, ty - 6, 3 + 5 * dmg, 0, 7); ctx.fill(); }
      text(ctx, dmg > 0.3 ? 'enamel eroding' : 'tooth is safe', tx + 30, ty, { color: col.ink, size: 11, weight: 700 });
    } else if (mode === 'gut') {
      const p = gut(v), bw = gw * 0.9;
      for (let i = 0; i < bw; i++) { const q = (i / bw) * 7; ctx.fillStyle = q < 2 ? '#d62228' : q < 4 ? '#f08a2a' : q < 5.5 ? '#ecdc46' : '#50b45a'; ctx.fillRect(gx + i, gy + 20, 1.3, 30); }
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(gx, gy + 20, bw, 30);
      for (let k = 0; k <= 7; k++) text(ctx, String(k), gx + (k / 7) * bw, gy + 62, { color: col.muted, size: 9.5, align: 'center' });
      const mx = gx + (p / 7) * bw; ctx.beginPath(); ctx.moveTo(mx, gy + 52); ctx.lineTo(mx - 6, gy + 70); ctx.lineTo(mx + 6, gy + 70); ctx.fillStyle = col.ink; ctx.fill();
      text(ctx, `stomach pH ${p.toFixed(1)}`, mx, gy + 82, { color: col.ink, size: 11, weight: 700, align: 'center' });
      ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.25; ctx.fillRect(gx + (1.5 / 7) * bw, gy + 14, (2 / 7) * bw, 42); ctx.globalAlpha = 1;
      text(ctx, 'digestion works best at pH 1.5 to 3.5', gx, gy + 104, { color: col.muted, size: 10 });
      for (let i = 0; i < v; i++) { ctx.fillStyle = '#f6f6f6'; ctx.beginPath(); ctx.arc(gx + 20 + i * 30, gy + gh - 4, 11, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); }
    } else {
      CROP.forEach(([nm, a, b], i) => {
        const y = gy + 10 + i * ((gh + 40) / CROP.length), X = (p) => gx + 20 + ((p - 4) / 5) * (gw - 24);
        text(ctx, nm, gx - 26, y + 6, { color: col.ink, size: 10.5 });
        const on = v >= a && v <= b; ctx.fillStyle = on ? col.s[2] : col.soft; ctx.fillRect(X(a), y, X(b) - X(a), 12);
      });
      const mx = gx + 20 + ((v - 4) / 5) * (gw - 24); line(ctx, [[mx, gy + 2], [mx, gy + gh + 36]], col.ink, 2);
      [4, 5, 6, 7, 8, 9].forEach((p) => text(ctx, String(p), gx + 20 + ((p - 4) / 5) * (gw - 24), gy + gh + 48, { color: col.muted, size: 9.5, align: 'center' }));
    }
  };
  say();
}
