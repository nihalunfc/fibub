// Class 12 Biology, Reproductive Health: medical termination of pregnancy (MTP) in India is legal under the MTP Act, 1971, amended in 2021. This figure summarises
// the rule by weeks of pregnancy: safest in the first trimester (up to 12 weeks); up to 20 weeks with the opinion of one registered doctor; 20 to 24 weeks for
// certain categories of women with two doctors; later only by a Medical Board for serious foetal abnormalities. Rules change: always check the official source.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let wk = 8;
  const cv = canvas(host, { aspect: 0.55, max: 420, min: 220, label: 'A timeline of pregnancy weeks showing which rule of the MTP Act applies' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'weeks of pregnancy', min: 1, max: 30, step: 1, value: wk, fmt: (v) => String(Math.round(v)), oninput: (v) => { wk = Math.round(v); go(); } });
  const info = () => wk <= 12 ? 'Up to 12 weeks (first trimester): the safest time. One registered medical practitioner’s opinion is enough.' : wk <= 20 ? 'Up to 20 weeks: allowed on the opinion of one registered medical practitioner, if continuing the pregnancy risks the woman’s health or the child would have serious abnormalities, or in other conditions the Act lists.' : wk <= 24 ? '20 to 24 weeks: allowed for certain categories of women (for example survivors of rape or minors), on the opinion of two registered medical practitioners.' : 'After 24 weeks: allowed only on the decision of a State Medical Board when there are substantial foetal abnormalities, or to save the woman’s life.';
  const go = () => { ro.textContent = info() + ' Risk rises as the pregnancy advances. Rules can change: check the official source (MTP Act, 1971, as amended in 2021).'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'MTP by weeks of pregnancy', col) + 16, x0 = 14, x1 = w - 14, X = (v) => x0 + (v / 30) * (x1 - x0), by = top + 20, bh = 40;
    [[0, 12, col.s[2], 'safest: 1 doctor'], [12, 20, col.s[3], '1 doctor'], [20, 24, col.s[5], '2 doctors'], [24, 30, col.s[1], 'Medical Board']].forEach(([a, b, c, s]) => { ctx.fillStyle = c; ctx.globalAlpha = wk > a && wk <= b || (a === 0 && wk === 0) ? 1 : 0.4; ctx.fillRect(X(a), by, X(b) - X(a), bh); ctx.globalAlpha = 1; text(ctx, s, (X(a) + X(b)) / 2, by + bh / 2, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false }); });
    [0, 12, 20, 24, 30].forEach((v) => text(ctx, String(v), X(v), by + bh + 12, { color: col.muted, size: 10.5, align: 'center' }));
    text(ctx, 'weeks', (x0 + x1) / 2, by + bh + 28, { color: col.muted, size: 10.5, align: 'center' });
    ctx.beginPath(); ctx.moveTo(X(wk), by - 4); ctx.lineTo(X(wk) - 6, by - 14); ctx.lineTo(X(wk) + 6, by - 14); ctx.closePath(); ctx.fillStyle = col.ink; ctx.fill();
    text(ctx, `${wk} weeks`, X(wk), by - 22, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  go();
}
