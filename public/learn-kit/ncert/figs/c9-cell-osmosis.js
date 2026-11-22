// Class 9 Cell: osmosis in a plant cell, potato and raisin. Osmosis is the movement of water through a semi-permeable
// membrane from where water is more plentiful (weaker solution outside) to where it is less (stronger solution).
// Slider sets the strength of the outside solution against the cell's own sap (fixed at 3 on this scale). Below 3 the
// cell gains water and swells (turgid; the wall stops bursting); equal: no net movement; above 3 it loses water,
// the cytoplasm shrinks away from the wall (plasmolysis) and a potato strip gets limp (flaccid, shorter).
import { canvas, text, title, dot, line, arrow, row, slider, choice, readout, loop, rng } from '../../kit.js';

const SAP = 3;
export default function (host) {
  let out = 0.5, mode = 'cell', t = 0, fill = 1, R = rng(9);
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 300, label: 'A plant cell, a potato strip and a raisin in water of different strengths showing water moving in or out' });
  const ctl = row(host);
  choice(ctl, 'Show', [['cell', 'Plant cell'], ['potato', 'Potato strip'], ['raisin', 'Raisin']], mode, (v) => { mode = v; cv.redraw(); });
  slider(ctl, { label: 'Solution strength outside', min: 0, max: 6, step: 0.1, value: out, fmt: (v) => v < 0.2 ? 'pure water' : v.toFixed(1), oninput: (v) => { out = v; cv.redraw(); } });
  const rd = readout(host);
  const diff = () => SAP - out; // positive: water goes in
  loop(host, (dt) => {
    t += dt; const target = 1 + Math.max(-0.55, Math.min(0.18, diff() * 0.07)) ; fill += (target - fill) * Math.min(1, dt * 1.2); 
    const d = diff();
    rd.innerHTML = Math.abs(d) < 0.25 ? 'Outside is as strong as inside (<b>isotonic</b>): water goes both ways equally, no net change. Raisin and strip stay as they are.' : d > 0 ? 'Outside is weaker than the sap (<b>hypotonic</b>): water moves <b>in</b>. The plant cell becomes <b>turgid</b> (firm); the wall stops it bursting. The potato strip gets stiff and longer; a raisin swells.' : 'Outside is stronger than the sap (<b>hypertonic</b>): water moves <b>out</b>. The cell membrane pulls away from the wall (<b>plasmolysis</b>); the strip goes <b>flaccid</b> and shorter; a raisin shrivels more.';
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const d = diff();
    title(ctx, d > 0.25 ? 'Water moves IN' : d < -0.25 ? 'Water moves OUT' : 'No net movement', col);
    const X = 10, Y = 40, W = w - 20, H = h - 60, cx = X + W / 2, cy = Y + H / 2;
    ctx.fillStyle = out < 0.2 ? col.panel : col.soft; ctx.fillRect(X, Y, W, H); ctx.strokeStyle = col.line; ctx.strokeRect(X, Y, W, H);
    for (let k = 0; k < 14; k++) { const x = X + 8 + ((k * 53) % (W - 16)), y = Y + 8 + ((k * 37) % (H - 16)); const o = Math.abs(cx - x) < W * 0.3 && Math.abs(cy - y) < H * 0.3; if (!o) dot(ctx, x, y, 1.5 + out * 0.5, col.s[3]); }
    text(ctx, 'solution outside: ' + (out < 0.2 ? 'pure water' : out.toFixed(1) + ' (sap = ' + SAP + ')'), X + 6, Y + H - 10, { color: col.muted, size: 10.5 });
    let rx = Math.min(W, H) * 0.3;
    const f = fill;
    if (mode === 'cell') {
      const wallW = rx * 1.5, wallH = rx * 1.05; // wall is fixed in size: (it only stretches a little)
      const grow = Math.max(0.72, Math.min(1, f * 0.96));
      ctx.lineWidth = 6; ctx.strokeStyle = col.s[2]; ctx.strokeRect(cx - wallW, cy - wallH, wallW * 2, wallH * 2);
      const iw = wallW * grow, ih = wallH * grow;
      ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(cx - iw, cy - ih, iw * 2, ih * 2, 14); ctx.fill(); ctx.stroke();
      dot(ctx, cx - iw * 0.45, cy - ih * 0.1, 11, col.s[0]);
      ctx.fillStyle = col.soft; ctx.beginPath(); ctx.roundRect(cx - iw * 0.1, cy - ih * 0.7, iw * 0.9, ih * 1.4, 10); ctx.fill();
      text(ctx, 'cell wall', cx - wallW, cy - wallH - 8, { color: col.s[2], size: 10.5, weight: 700 });
      text(ctx, 'membrane + cytoplasm', cx, cy + ih + 12, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
      if (grow < 0.93) text(ctx, 'gap = plasmolysis', cx, cy + ih * 0.0, { color: col.bad, size: 10.5, weight: 700, align: 'center' });
      else if (d > 0.25) text(ctx, 'turgid', cx, cy, { color: col.good, size: 12, weight: 700, align: 'center' });
    } else if (mode === 'potato') {
      const len = rx * 2.2 * f, th = rx * 0.5; ctx.fillStyle = col.s[2]; ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
      ctx.save(); ctx.translate(cx, cy); const bend = d < -0.25 ? Math.min(1, (-d - 0.25) / 2) * 0.35 : 0; ctx.rotate(0);
      ctx.beginPath(); for (let i = 0; i <= 20; i++) { const x = -len / 2 + (len * i) / 20; const y = -th / 2 + Math.sin((i / 20) * Math.PI) * len * bend * 0.5; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      for (let i = 20; i >= 0; i--) { const x = -len / 2 + (len * i) / 20; const y = th / 2 + Math.sin((i / 20) * Math.PI) * len * bend * 0.5; ctx.lineTo(x, y); }
      ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
      text(ctx, 'length ' + (4 * f).toFixed(2) + ' cm (was 4.00)', cx, cy - rx * 1.05, { color: col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, d > 0.25 ? 'firm (turgid)' : d < -0.25 ? 'limp (flaccid)' : 'unchanged', cx, cy + rx * 1.15, { color: col.muted, size: 11, align: 'center' });
    } else {
      const rr = rx * 0.5 * (0.7 + 0.3 * f * (d > 0 ? 1.15 : 0.9)) * (d > 0.25 ? 1.0 + Math.min(0.5, d * 0.1) : 1);
      ctx.beginPath(); for (let a = 0; a < 6.3; a += 0.15) { const wob = (d < 0.25 ? 1 - Math.min(0.5, (0.25 - d) * 0.12) : 1) * (1 + 0.08 * Math.sin(a * 7) * (d > 0.25 ? 0.2 : 1)); const x = cx + Math.cos(a) * rr * 1.25 * wob, y = cy + Math.sin(a) * rr * wob; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.closePath(); ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, d > 0.25 ? 'plump' : d < -0.25 ? 'shrivelled' : 'as before', cx, cy + rx * 1.1, { color: col.muted, size: 11, align: 'center' });
    }
    // water arrows
    if (Math.abs(d) > 0.25) {
      const n = 4, mag = Math.min(1, Math.abs(d) / 3);
      for (let k = 0; k < n; k++) {
        const ph = (t * 0.6 + k / n) % 1, a = (k / n) * Math.PI * 2 + 0.6, R1 = Math.min(W, H) * 0.46, R2 = Math.min(W, H) * 0.3;
        const r = d > 0 ? R1 + (R2 - R1) * ph : R2 + (R1 - R2) * ph, x = cx + Math.cos(a) * r * 1.2, y = cy + Math.sin(a) * r * 0.92;
        ctx.globalAlpha = 0.5 + 0.5 * mag; dot(ctx, x, y, 4, col.s[0]); ctx.globalAlpha = 1;
      }
      text(ctx, 'blue dots = water', X + 6, Y + 12, { color: col.s[0], size: 10, weight: 700 });
    }
  };
}
