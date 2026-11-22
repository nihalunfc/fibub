// Reproductive health: where each method of contraception acts. The chain from gametes to pregnancy has five
// links; choose a method and the link it breaks is marked. Information follows the NCERT Class 12 chapter and the
// WHO family planning handbook; this figure is for learning, not medical advice.
import { canvas, text, row, choice, readout, arrow } from '../../kit.js';

const LINKS = ['Sperm in semen', 'Egg released', 'Sperm meet egg', 'Fertilisation', 'Implantation'];
const M = {
  periodic: { name: 'Periodic abstinence', at: [2], how: 'avoid intercourse from about day 10 to day 17 of the cycle, when ovulation is likely', kind: 'natural' },
  withdrawal: { name: 'Withdrawal', at: [2], how: 'the penis is withdrawn before ejaculation; unreliable', kind: 'natural' },
  lam: { name: 'Lactational amenorrhoea', at: [1], how: 'intense breastfeeding delays ovulation; reliable only up to about six months after birth', kind: 'natural' },
  condom: { name: 'Condom', at: [2], how: 'a barrier stops semen entering the vagina; also protects against STIs and HIV', kind: 'barrier' },
  diaphragm: { name: 'Diaphragm, cap, vault', at: [2], how: 'rubber barriers that cover the cervix; reusable, often used with spermicide', kind: 'barrier' },
  cuiud: { name: 'Copper IUD (CuT, Multiload 375)', at: [2, 3], how: 'copper ions lower sperm movement and their ability to fertilise; IUDs also raise phagocytosis of sperm in the uterus', kind: 'IUD' },
  hiud: { name: 'Hormone IUD (LNG-20, Progestasert)', at: [2, 4], how: 'releases a progestogen: makes the uterus unsuitable for implantation and the cervix hostile to sperm', kind: 'IUD' },
  pill: { name: 'Oral pill (or Saheli)', at: [1, 2, 4], how: 'progestogen or progestogen-estrogen pills stop ovulation and implantation and thicken cervical mucus; Saheli is a once-a-week non-steroidal pill', kind: 'hormonal' },
  emergency: { name: 'Emergency pill or IUD', at: [1, 3, 4], how: 'progestogen pills or an IUD within 72 hours of unprotected intercourse', kind: 'hormonal' },
  vasectomy: { name: 'Vasectomy', at: [0], how: 'a small part of each vas deferens is cut or tied, so no sperm reach the semen; very hard to reverse', kind: 'surgical' },
  tubectomy: { name: 'Tubectomy', at: [2], how: 'a small part of each fallopian tube is cut or tied, so egg and sperm cannot meet; very hard to reverse', kind: 'surgical' },
};
export default function (host) {
  let cur = 'cuiud';
  const cv = canvas(host, { aspect: 0.42, max: 240, min: 200, label: 'The chain from gametes to pregnancy with the steps a contraceptive method blocks' });
  const ctl = row(host);
  choice(ctl, 'Method', Object.entries(M).map(([k, m]) => [k, m.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { const m = M[cur]; out.innerHTML = `<b>${m.name}</b> (${m.kind}): ${m.how}. Blocks: ${m.at.map((i) => LINKS[i].toLowerCase()).join(', ')}.`; };
  cv.draw = (ctx, w, h, col) => {
    const m = M[cur], k = LINKS.length, gap = w / k, y = h * 0.52, bw = Math.min(gap - 12, 110);
    text(ctx, 'Chain to pregnancy', 10, 16, { color: col.ink, size: 12, weight: 700 });
    LINKS.forEach((l, i) => {
      const x = gap * (i + 0.5), hit = m.at.includes(i);
      ctx.fillStyle = hit ? col.soft : col.panel; ctx.strokeStyle = hit ? col.bad || col.s[1] : col.muted; ctx.lineWidth = hit ? 3 : 1.5;
      ctx.beginPath(); ctx.roundRect(x - bw / 2, y - 26, bw, 52, 8); ctx.fill(); ctx.stroke();
      const words = l.split(' ');
      words.forEach((wd, j) => text(ctx, wd, x, y - (words.length - 1) * 7 + j * 14, { color: col.ink, size: w < 420 ? 9.5 : 11, align: 'center', weight: hit ? 700 : 400 }));
      if (hit) { text(ctx, '✕ blocked', x, y + 42, { color: col.bad || col.s[1], size: w < 420 ? 9.5 : 11, weight: 700, align: 'center' }); }
      if (i < k - 1) arrow(ctx, x + bw / 2 + 1, y, x + gap - bw / 2 - 1, y, col.muted, 1.5, 6);
    });
  };
  cv.redraw(); show();
}
