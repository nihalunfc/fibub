// 2.2 Words on a scale: synonyms are not all equal. Pick a word family and see words placed from weak to strong,
// with the antonyms on the other side of zero.
import { canvas, text, row, choice, readout } from '../../kit.js';

export const FAMILIES = {
  'happy / sad': [['devastated', -3], ['miserable', -2.3], ['sad', -1.4], ['glum', -0.8], ['content', 0.8], ['happy', 1.4], ['delighted', 2.2], ['ecstatic', 3]],
  'big / small': [['minuscule', -3], ['tiny', -2.2], ['small', -1.2], ['modest', -0.5], ['sizeable', 0.7], ['large', 1.3], ['enormous', 2.3], ['colossal', 3]],
  'angry / calm': [['serene', -3], ['tranquil', -2.2], ['calm', -1.3], ['composed', -0.6], ['irritated', 0.8], ['angry', 1.5], ['furious', 2.3], ['livid', 2.9]],
  'praise / criticise': [['condemn', -3], ['denounce', -2.4], ['criticise', -1.5], ['question', -0.6], ['approve', 0.7], ['praise', 1.5], ['acclaim', 2.3], ['extol', 2.9]],
};
export default function (host) {
  const cv = canvas(host, { aspect: 0.42, max: 260, min: 190, label: 'A line from strongly negative to strongly positive with words placed along it' });
  let fam = 'happy / sad';
  const ctl = row(host);
  choice(ctl, 'Word family', Object.keys(FAMILIES), fam, (v) => { fam = v; go(); });
  const out = readout(host);
  const go = () => {
    cv.redraw(); const f = FAMILIES[fam];
    out.innerHTML = `Closest synonym of <b>${f[5][0]}</b>: a word on the same side and about the same strength (<b>${f[6][0]}</b> is stronger, <b>${f[4][0]}</b> weaker). Antonym: the mirror word on the other side (<b>${f[2][0]}</b>).`;
  };
  cv.draw = (ctx, w, h, col) => {
    const f = FAMILIES[fam], x = (v) => 20 + ((v + 3.3) / 6.6) * (w - 40), y = h / 2;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(14, y); ctx.lineTo(w - 14, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x(0), y - 8); ctx.lineTo(x(0), y + 8); ctx.stroke();
    f.forEach(([word, v], i) => {
      const up = i % 2 === 0, yy = up ? y - 30 : y + 30;
      ctx.fillStyle = v < 0 ? col.s[1] : col.s[2]; ctx.beginPath(); ctx.arc(x(v), y, 5, 0, 7); ctx.fill();
      ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x(v), y); ctx.lineTo(x(v), yy + (up ? 6 : -6)); ctx.stroke();
      text(ctx, word, x(v), yy, { color: col.ink, size: 12, weight: 600, align: 'center' });
    });
    text(ctx, '← stronger negative', 14, h - 10, { color: col.muted, size: 11 });
    text(ctx, 'stronger positive →', w - 14, h - 10, { color: col.muted, size: 11, align: 'right' });
  };
  go();
}
