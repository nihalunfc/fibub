// Class 12 Biology, Human Reproduction: pregnancy month by month. Typical size (crown-rump length to about week 16, crown-heel after that) and milestones:
// heart forms in month 1, limbs and digits by month 2, major organs by the end of the first trimester (week 12), first movements and hair in month 5,
// eyelids separate by week 24, full term at about 9 months (38 weeks after fertilisation, 40 weeks from the last period). Values are typical, not exact.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let mth = 1;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'A growing foetus drawn to scale beside a ruler with milestones for each month of pregnancy' });
  const ctl = row(host), ro = readout(host);
  const D = [null, [4, 0.4, 'Embryo is a few millimetres long. The heart has formed and begins to beat (heart sounds can be heard). Placenta starts to form.'], [8, 1.6, 'Limbs and digits appear; the embryo has a face. It is now called a foetus from week 9.'], [12, 5.4, 'End of the first trimester: major organ systems and external genitalia are formed. Morning sickness is common.'], [16, 12, 'Growth is fast; the skeleton hardens. The mother may feel the first fluttering soon.'], [20, 25, 'First movements felt and hair appears on the head. Mother’s belly begins to show.'], [24, 30, 'End of the second trimester soon; eyelids separate and eyelashes form. Body is covered with fine hair.'], [28, 37, 'Third trimester: the lungs mature, the foetus can respond to sound and light.'], [32, 42, 'Fat is laid down under the skin; the head usually turns down.'], [36, 47, 'Nearly ready: about 9 months. Birth (parturition) comes at about 38 weeks after fertilisation (40 weeks from the last period). Length is about 50 cm.']];
  slider(ctl, { label: 'month of pregnancy', min: 1, max: 9, step: 1, value: 1, fmt: (v) => String(Math.round(v)), oninput: (v) => { mth = Math.round(v); go(); } });
  const go = () => { ro.textContent = `Month ${mth} (about week ${D[mth][0]}): ${D[mth][2]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Month ${mth}: length about ${D[mth][1]} cm`, col) + 8, base = h - 30, ht = base - top - 10;
    const [wk, len] = D[mth], S = ht / 52;
    if (D[mth][1] * S < 50) { ctx.beginPath(); ctx.arc(34 + 0, base - len * S, 3, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); text(ctx, 'true size', 46, base - len * S - 8, { color: col.s[3], size: 10, weight: 700 }); text(ctx, `drawn ${Math.round(50 / (len * S))} times bigger`, w * 0.46, base - 8, { color: col.muted, size: 10, align: 'center' }); }
    // ruler
    line(ctx, [[34, top + 4], [34, base]], col.muted, 1.5);
    for (let cm = 0; cm <= 50; cm += 10) { const y = base - cm * S; line(ctx, [[28, y], [40, y]], col.muted, 1.5); text(ctx, String(cm), 24, y, { color: col.muted, size: 10, align: 'right' }); }
    text(ctx, 'cm', 34, top - 2, { color: col.muted, size: 10, align: 'center', fit: false });
    // foetus: head circle and body, curled
    const mag = len * S < 50 ? 50 / (len * S) : 1, L = len * S * mag, cx = w * 0.46, head = Math.max(2, L * (mth <= 2 ? 0.45 : 0.22)), bodyL = L - head * 2;
    ctx.beginPath(); ctx.ellipse(cx, base - L + head, head * 0.95, head, 0, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke();
    if (bodyL > 0) { ctx.beginPath(); ctx.ellipse(cx, base - L + head * 2 + bodyL / 2, head * 0.8 * (mth <= 2 ? 0.7 : 1), bodyL / 2, 0, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); ctx.stroke(); }
    if (mth >= 2) { for (const sg of [-1, 1]) { line(ctx, [[cx + sg * head * 0.6, base - L + head * 2.4], [cx + sg * head * (mth > 2 ? 1.8 : 1.3), base - L + head * 3.5]], col.ink, 2); } }
    // placenta/week marker and trimester bar
    const tx = w * 0.62; text(ctx, `week ${wk}`, tx, top + 14, { color: col.ink, size: 13, weight: 700 });
    const tri = mth <= 3 ? 1 : mth <= 6 ? 2 : 3; text(ctx, `trimester ${tri} of 3`, tx, top + 34, { color: col.s[3], size: 11.5, weight: 700 });
    for (let k = 1; k <= 9; k++) { ctx.fillStyle = k <= mth ? col.s[3] : col.line; ctx.fillRect(tx + (k - 1) * 14, top + 50, 11, 8); }
    text(ctx, 'months 1 to 9', tx, top + 70, { color: col.muted, size: 10 });
    text(ctx, 'drawn to scale, simplified', w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  go();
}
