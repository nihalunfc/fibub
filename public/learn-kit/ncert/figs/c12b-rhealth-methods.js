// Class 12 Biology, Reproductive Health: contraceptive methods by type, with how each works and how often it fails in ordinary use. Bars are the typical-use
// number of pregnancies per 100 women in the first year (Trussell, Contraceptive Technology; US CDC summary), so lower is better; real-life numbers vary with
// the user, the place and the product. Take advice from a doctor before choosing a method.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let cat = 'barrier';
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 250, label: "Bars showing pregnancies per 100 women per year for different contraceptive methods of the chosen type" });
  const ctl = row(host), ro = readout(host);
  const D = {
    natural: { name: 'Natural methods', how: 'Natural methods avoid the meeting of sperm and egg without drugs or devices: periodic abstinence (avoiding intercourse around ovulation, about day 10 to 17), withdrawal (coitus interruptus), and lactational amenorrhea (no ovulation in the first six months after birth, if the mother breast-feeds fully). Chances of failure are high.', m: [['no method', 85], ['withdrawal', 20], ['periodic abstinence', 15], ['lactational amenorrhea*', 2]] },
    barrier: { name: 'Barrier methods', how: 'Barriers stop the sperm reaching the egg: condoms for males and females, diaphragms, cervical caps and vaults. Condoms also lower the risk of sexually transmitted infections. Spermicidal creams and jellies are often used with them.', m: [['female condom', 21], ['diaphragm', 17], ['male condom', 13]] },
    iud: { name: 'Intrauterine devices (IUDs)', how: 'Inserted into the uterus by a doctor. Copper-releasing IUDs (CuT, Cu7, Multiload 375) make the uterus unfriendly to sperm; hormone-releasing IUDs make the lining unsuitable for implantation and the cervix hostile to sperm. They are long-acting and ideal for women who want to delay or space children.', m: [['copper IUD', 0.8], ['hormonal IUD', 0.2]] },
    hormonal: { name: 'Hormonal methods', how: 'Pills, injections and implants release progestogen alone or with oestrogen. They stop ovulation, and thicken cervical mucus so sperm cannot enter, and make the uterus unsuitable for implantation. The common pill is taken daily for 21 days; Saheli, developed in India, is a non-steroidal pill taken once a week. Side effects vary; see a doctor.', m: [['pill, patch or ring', 7], ['injection (3-monthly)', 4], ['implant (3 years)', 0.05]] },
    surgical: { name: 'Surgical sterilisation', how: 'For people who do not want more children. Vasectomy cuts and ties the vas deferens in males; tubectomy cuts and ties the fallopian tubes in females. Both are very effective and meant to be permanent, though reversal is sometimes possible.', m: [['vasectomy', 0.15], ['tubectomy', 0.5]] },
  };
  choice(ctl, 'Type', [['natural', 'Natural'], ['barrier', 'Barrier'], ['iud', 'IUD'], ['hormonal', 'Hormonal'], ['surgical', 'Surgical']], 'barrier', (v) => { cat = v; go(); });
  const go = () => { ro.textContent = D[cat].how + (cat === 'natural' ? ' (* with full breast-feeding in the first six months.)' : ''); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, D[cat].name + ': pregnancies per 100 women a year', col) + 12, rows = D[cat].m, rh = Math.min(48, (h - top - 28) / rows.length), lw = Math.min(140, w * 0.38), mx = 100;
    rows.forEach(([nm, v], i) => { const y = top + i * rh + rh / 2, bl = lw + 14, len = Math.max(2, (w - bl - 50) * Math.sqrt(v / mx)); text(ctx, nm, 8, y, { color: col.ink, size: 11, weight: 600 }); ctx.fillStyle = v > 10 ? col.s[3] : v > 3 ? col.s[2] : col.s[0]; ctx.fillRect(bl, y - rh * 0.28, len, rh * 0.56); text(ctx, v < 1 ? '< 1' : String(v), bl + len + 5, y, { color: col.ink, size: 11, weight: 700 }); });
    text(ctx, 'typical use (bar length stretched so small values show)', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
