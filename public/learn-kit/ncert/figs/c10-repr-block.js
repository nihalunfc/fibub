// Class 10 How do Organisms Reproduce?: methods of birth control and where each acts on the path from sperm to pregnancy.
// Barrier methods (condom, diaphragm) stop sperm reaching the egg and a condom also reduces the spread of sexually
// transmitted infections (STIs). Oral pills (hormonal) stop the release of an egg. A copper-T (IUD) stops implantation.
// Surgical methods (vasectomy, tubectomy) block the tubes. Only the barrier methods protect against STIs.
import { canvas, text, title, line, dot, row, choice, readout, loop } from '../../kit.js';

const M = {
  barrier: ['Barrier methods', 'A condom (worn by the man) or a diaphragm (worn by the woman) physically stops sperm meeting the egg. A condom is the only method of these that also helps to prevent infections such as HIV and hepatitis B.', 'protects against STIs too'],
  pill: ['Oral pills (hormonal)', 'Pills change the body\'s hormone balance so that no egg is released. They are taken on a doctor\'s advice and can have side effects. They do not protect against infections.', 'no STI protection'],
  iud: ['Copper-T / IUD', 'A small device placed in the uterus by a doctor. It makes the uterus unwelcoming, so a fertilised egg does not implant. It can stay for years. No STI protection.', 'no STI protection'],
  surg: ['Surgical methods', 'Vasectomy blocks the vas deferens so semen has no sperm. Tubectomy blocks the oviducts so the egg cannot meet sperm. Very effective and meant to be permanent. No STI protection.', 'no STI protection'],
};
export default function (host) {
  let m = 'barrier', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Where each birth control method blocks the path of sperm and egg' });
  const ctl = row(host);
  choice(ctl, 'Method', [['barrier', 'Barrier'], ['pill', 'Pill'], ['iud', 'Copper-T'], ['surg', 'Surgical']], m, (v) => { m = v; say(); });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function say() { out.innerHTML = `<b>${M[m][0]}.</b> ${M[m][1]}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, M[m][0] + ': where it acts', col) + 10, H = h - top - 40, X = (f) => f * w, Y = (f) => top + f * H, bad = col.bad || col.ink;
    const cross = (x, y) => { line(ctx, [[x - 8, y - 8], [x + 8, y + 8]], bad, 3.5); line(ctx, [[x - 8, y + 8], [x + 8, y - 8]], bad, 3.5); };
    // male tube
    const vas = [[X(0.05), Y(0.8)], [X(0.46), Y(0.8)]];
    line(ctx, vas, col.s[4], 5); text(ctx, 'vas deferens: sperm path (male)', X(0.04), Y(0.93), { color: col.muted, size: 10 });
    // female tract
    const ut = X(0.74); line(ctx, [[X(0.45), Y(0.8)], [ut - 20, Y(0.8)], [ut - 20, Y(0.55)]], col.s[2], 6); line(ctx, [[ut - 30, Y(0.55)], [ut - 40, Y(0.18)], [X(0.9), Y(0.1)]], col.s[2], 5);
    ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.ellipse(ut, Y(0.55), 38, 38, 0, 0, 7); ctx.fill(); ctx.restore(); ctx.beginPath(); ctx.ellipse(ut, Y(0.55), 38, 38, 0, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.stroke();
    text(ctx, 'uterus', ut, Y(0.55), { color: col.muted, size: 10, align: 'center' }); text(ctx, 'oviduct', X(0.9), Y(0.04), { color: col.muted, size: 10, align: 'right' });
    ctx.beginPath(); ctx.ellipse(X(0.92), Y(0.22), 12, 9, 0, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); text(ctx, 'ovary', X(0.92), Y(0.34), { color: col.muted, size: 10, align: 'center' });
    // moving sperm
    const blockX = { barrier: X(0.5), surg: X(0.25), iud: Infinity, pill: Infinity }[m];
    for (let i = 0; i < 6; i++) { const f = (t * 0.14 + i / 6) % 1, x = X(0.1) + f * (X(0.72) - X(0.1)); if (x < blockX) dot(ctx, x, Y(0.8), 3, col.s[7]); }
    // block marks
    if (m === 'barrier') { line(ctx, [[X(0.5), Y(0.7)], [X(0.5), Y(0.9)]], col.ink, 5); cross(X(0.5), Y(0.8)); text(ctx, 'condom / diaphragm', X(0.5), Y(0.66), { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }
    if (m === 'surg') { cross(X(0.25), Y(0.8)); text(ctx, 'vasectomy: tube cut', X(0.25), Y(0.68), { color: col.ink, size: 10.5, weight: 700, align: 'center' }); cross(ut - 40, Y(0.3)); text(ctx, 'tubectomy: tube cut', ut - 44, Y(0.22), { color: col.ink, size: 10.5, weight: 700, align: 'right' }); }
    if (m === 'pill') { cross(X(0.92), Y(0.22)); text(ctx, 'no egg released', X(0.82), Y(0.22), { color: col.ink, size: 10.5, weight: 700, align: 'right' }); }
    if (m === 'iud') { line(ctx, [[ut, Y(0.5)], [ut, Y(0.62)]], col.ink, 3); line(ctx, [[ut - 10, Y(0.5)], [ut + 10, Y(0.5)]], col.ink, 3); cross(ut + 30, Y(0.4)); text(ctx, 'no implantation', ut, Y(0.88), { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }
    text(ctx, M[m][2], w / 2, h - 14, { color: m === 'barrier' ? (col.good || col.ink) : col.muted, size: 11, weight: 700, align: 'center' });
  };
  say();
}
