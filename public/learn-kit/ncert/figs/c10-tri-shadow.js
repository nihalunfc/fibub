// Class 10 Triangles: the shadow method for measuring a height. At any moment the sun's rays are parallel, so a person and a tree
// each make a right triangle with their shadow, and the two triangles have the same angles: they are similar (AA). So
// tree height / person height = tree shadow / person shadow, at every time of day. Slide the sun or press Play: the shadows
// change but the ratio does not.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let el = 40;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'A person and a tree casting shadows in the same sunlight' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'sun height above horizon', min: 20, max: 70, step: 1, value: el, fmt: (v) => Math.round(v) + '°', oninput: (v) => { el = v; anim.pause(); go(); } });
  let dir = 1;
  const anim = loop(host, (dt) => { el += dir * dt * 6; if (el > 70) dir = -1; if (el < 20) dir = 1; sl.set(el); go(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  const HP = 1.6, HT = 8;
  function go() {
    const t = Math.tan(el * Math.PI / 180), sp = HP / t, st = HT / t;
    out.innerHTML = `Person's shadow ${sp.toFixed(2)} m, tree's shadow ${st.toFixed(2)} m. Tree ÷ person shadow = <b>${(st / sp).toFixed(2)}</b>, and tree ÷ person height = ${(HT / HP).toFixed(2)}: the same. So tree = ${HP} × ${st.toFixed(2)} / ${sp.toFixed(2)} = <b>${(HP * st / sp).toFixed(1)} m</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Same sunlight, similar triangles', col);
    const t = Math.tan(el * Math.PI / 180), g = h - 36, u = Math.min((h - 90) / HT, (w - 140) / (HT / Math.tan(20 * Math.PI / 180)));
    const px = 40, tx = px + 75, sp = (HP / t) * u, st = (HT / t) * u;
    line(ctx, [[8, g], [w - 8, g]], col.muted, 2);
    // tree
    ctx.fillStyle = col.s[2]; ctx.fillRect(tx - 3, g - HT * u, 6, HT * u); ctx.globalAlpha = 0.75; ctx.beginPath(); ctx.arc(tx, g - HT * u, 15, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    // person
    dot(ctx, px, g - HP * u - 4, 4, col.s[0]); line(ctx, [[px, g - HP * u], [px, g]], col.s[0], 3);
    // shadows and rays
    line(ctx, [[tx, g], [tx + st, g]], col.ink, 4); line(ctx, [[px, g], [px + sp, g]], col.ink, 4);
    line(ctx, [[tx, g - HT * u], [tx + st, g]], col.s[3], 1.5, [5, 4]); line(ctx, [[px, g - HP * u], [px + sp, g]], col.s[3], 1.5, [5, 4]);
    // similar triangles tints
    ctx.beginPath(); ctx.moveTo(tx, g); ctx.lineTo(tx, g - HT * u); ctx.lineTo(tx + st, g); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.12; ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'tree shadow ' + (HT / t).toFixed(1) + ' m', tx + Math.min(st, w - tx - 20) / 2, g + 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, el.toFixed(0) + '°', tx + st - 8, g - 6, { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
    text(ctx, 'person 1.6 m', px, g - HP * u - 14, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'tree 8 m', tx + 22, g - HT * u + 4, { color: col.s[2], size: 10.5, weight: 700 });
  };
  go();
}
