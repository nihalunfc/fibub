// Class 12 Biology, Reproductive Health: assisted reproductive technologies (ART) compared by where fertilisation takes place and where the gametes or embryo
// are placed: IVF + embryo transfer (fertilised in a dish; embryo into the uterus, IUT, or into the fallopian tube, ZIFT), GIFT (eggs transferred into the tube,
// fertilisation inside the body), ICSI (a sperm injected into an egg in the lab) and IUI (sperm placed in the uterus; artificial insemination).
import { canvas, text, title, row, choice, readout, arrow, dot } from '../../kit.js';

export default function (host) {
  let k = 'ivf';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A diagram of the uterus and tubes with the place where fertilisation happens and the place where eggs, sperm or embryo are put' });
  const ctl = row(host), ro = readout(host);
  const D = {
    ivf: { n: 'IVF + IUT', lab: true, put: 'uterus', what: 'embryo', info: 'IVF-ET: egg and sperm meet in a dish. An embryo of more than 8 blastomeres is placed in the uterus (intra-uterine transfer, IUT). Tubes may be blocked, and it still works.' },
    zift: { n: 'ZIFT', lab: true, put: 'tube', what: 'zygote or early embryo', info: 'ZIFT (zygote intra-fallopian transfer): the zygote or an early embryo of up to 8 blastomeres is placed in the fallopian tube, where it moves on to the uterus.' },
    gift: { n: 'GIFT', lab: false, put: 'tube', what: 'eggs and sperm', info: 'GIFT (gamete intra-fallopian transfer): eggs collected from a donor or the woman are placed in her fallopian tube, and fertilisation happens there, inside the body. It needs a working tube.' },
    icsi: { n: 'ICSI', lab: true, put: 'uterus', what: 'embryo', info: 'ICSI (intra-cytoplasmic sperm injection): a single sperm is injected into an egg in the laboratory, then the embryo is transferred as in IVF. It is used when the male has very few or weak sperm.' },
    iui: { n: 'IUI / AI', lab: false, put: 'uterus', what: 'semen (sperm)', info: 'IUI (intra-uterine insemination): sperm are put into the uterus (or the vagina in artificial insemination, AI), and fertilisation takes place inside the body. Used when the male cannot inseminate, or has low sperm count.' },
  };
  choice(ctl, 'Method', Object.entries(D).map(([v, d]) => [v, d.n]), 'ivf', (v) => { k = v; go(); });
  const go = () => { ro.textContent = D[k].info; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = D[k], top = title(ctx, d.n + ': where do the cells go?', col) + 10, cx = w * 0.64, cy = top + (h - top) * 0.45, u = Math.min(w / 380, (h - top) / 240);
    const L = (s, x, y, al = 'center', c = col.ink) => text(ctx, s, x, y, { color: c, size: 10.5, weight: 600, align: al, halo: col.panel });
    ctx.beginPath(); ctx.moveTo(cx - 44 * u, cy - 30 * u); ctx.lineTo(cx + 44 * u, cy - 30 * u); ctx.lineTo(cx + 10 * u, cy + 50 * u); ctx.lineTo(cx - 10 * u, cy + 50 * u); ctx.closePath(); ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.4; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + sg * 44 * u, cy - 30 * u); ctx.quadraticCurveTo(cx + sg * 80 * u, cy - 50 * u, cx + sg * 90 * u, cy - 10 * u); ctx.lineWidth = 6; ctx.strokeStyle = col.s[0]; ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx + sg * 90 * u, cy + 4 * u, 14 * u, 10 * u, 0, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke(); }
    L('uterus', cx, cy + 66 * u, 'center', col.muted); L('tube', cx - 92 * u, cy - 50 * u, 'center', col.muted);
    const tx = d.put === 'tube' ? cx - 80 * u : cx, ty = d.put === 'tube' ? cy - 28 * u : cy - 6 * u;
    dot(ctx, tx, ty, 7, col.s[3], col.ink); arrow(ctx, cx - 140 * u, cy - 80 * u, tx - 8, ty - 4, col.s[3], 2, 7);
    L(d.what, cx - 118 * u, cy - 96 * u, 'center', col.s[3]);
    if (d.lab) { ctx.fillStyle = col.soft; ctx.fillRect(8, cy + 20, w * 0.3, 34); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(8, cy + 20, w * 0.3, 34); L('fertilised in the lab (in vitro)', 8 + w * 0.15, cy + 37, 'center', col.ink); }
    else { L('fertilised inside the body', cx, cy - 2 * u, 'center', col.s[1]); }
  };
  go();
}
