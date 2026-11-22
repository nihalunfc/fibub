// Class 12 Chemistry, Alcohols, Phenols and Ethers: the Lucas test (conc. HCl + anhydrous ZnCl2) tells primary, secondary and tertiary alcohols apart by how fast cloudiness (the alkyl chloride) appears.
// The reaction goes through a carbocation (SN1), whose stability is 3 deg > 2 deg > 1 deg. Illustrative times: tertiary at once (under a minute), secondary after about 5 minutes, primary stays clear at room temperature.
import { canvas, text, title, row, choice, slider, readout, loop } from '../../kit.js';

const K = { t: ['tertiary (2-methylpropan-2-ol)', 0.15], s: ['secondary (propan-2-ol)', 4], p: ['primary (propan-1-ol)', 1e9] };
export default function (host) {
  let k = 't', tm = 0;
  const cv = canvas(host, { aspect: 0.78, max: 340, min: 270, label: 'A test tube that turns cloudy at different speeds for tertiary, secondary and primary alcohols in the Lucas reagent' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'alcohol', [['t', '3° alcohol'], ['s', '2° alcohol'], ['p', '1° alcohol']], k, (v) => { k = v; tm = 0; go(); });
  const sl = slider(ctl, { label: 'minutes', min: 0, max: 10, step: 0.05, value: 0, fmt: (v) => v.toFixed(1), oninput: (v) => { tm = v; anim.pause(); go(); } });
  const anim = loop(host, (dt) => { if (!anim.playing) return; tm = tm + dt * 1.2; if (tm > 10) tm = 0; sl.set(tm); go(true); }); anim.button(ctl);
  const turb = () => 1 - Math.exp(-tm * Math.LN2 / K[k][1]);
  const go = (q) => { const tb = turb(); ro.textContent = `${K[k][0]}: after ${tm.toFixed(1)} min the mixture is ${tb < 0.1 ? 'clear' : tb < 0.6 ? 'turning cloudy' : 'cloudy (alkyl chloride has separated)'}. ${k === 'p' ? 'A primary alcohol gives no turbidity at room temperature (a secondary or tertiary carbocation is needed).' : 'The more stable the carbocation, the faster the reaction.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Lucas test: ' + K[k][0], col), tb = turb(), tx = w * 0.3, tw = 62, ty = top + 14, th = h - ty - 20;
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(tx - tw / 2, ty); ctx.lineTo(tx - tw / 2, ty + th - tw / 2); ctx.arc(tx, ty + th - tw / 2, tw / 2, Math.PI, 0, true); ctx.lineTo(tx + tw / 2, ty); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.moveTo(tx - tw / 2 + 2, ty + th * 0.3); ctx.lineTo(tx - tw / 2 + 2, ty + th - tw / 2); ctx.arc(tx, ty + th - tw / 2, tw / 2 - 2, Math.PI, 0, true); ctx.lineTo(tx + tw / 2 - 2, ty + th * 0.3); ctx.closePath(); ctx.clip();
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.18 + 0.4 * tb; ctx.fillRect(tx - tw, ty + th * 0.3, tw * 2, th); ctx.globalAlpha = 1;
    for (let i = 0; i < 90 * tb; i++) { const a = i * 2.399, rr = (i % 7) / 7, x = tx + Math.cos(a) * rr * (tw / 2 - 6), y = ty + th * 0.35 + ((i * 37) % 100) / 100 * (th * 0.6) + 3 * Math.sin(tm * 2 + i); ctx.fillStyle = col.ink; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill(); }
    ctx.restore(); ctx.globalAlpha = 1;
    text(ctx, tb < 0.1 ? 'clear' : tb < 0.6 ? 'cloudy…' : 'turbid', tx, ty + th + 12, { color: col.muted, size: 11, align: 'center' });
    // right: carbocation ladder
    const rx = w * 0.56, rw = w - rx - 14, labs = [['3°', 'carbocation: 3 alkyl groups', 0.92, 't'], ['2°', '2 alkyl groups', 0.6, 's'], ['1°', '1 alkyl group', 0.28, 'p']];
    text(ctx, 'carbocation stability (more stable = faster)', rx, ty + 8, { color: col.muted, size: 10.5 });
    labs.forEach(([a, b, f, id], i) => { const y = ty + 30 + i * 52; ctx.fillStyle = id === k ? col.s[3] : col.soft; ctx.fillRect(rx, y, rw * f, 24); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(rx, y, rw * f, 24); text(ctx, a, rx + 6, y + 12, { color: id === k ? col.panel : col.ink, size: 12, weight: 700 }); text(ctx, b, rx, y + 38, { color: col.muted, size: 10 }); });
  };
  go();
}
