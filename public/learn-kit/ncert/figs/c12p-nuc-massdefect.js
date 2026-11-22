// Class 12 Nuclei (step player): mass defect and binding energy of helium-4. The separate parts (2 hydrogen atoms + 2 neutrons) have mass 4.032980 u, the helium-4 atom only
// 4.002603 u. The missing 0.030377 u is the mass defect; E = (delta m) c^2 with 1 u = 931.5 MeV gives 28.3 MeV, which is 7.07 MeV per nucleon.
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, tilt = 0, tgt = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A balance weighing the separate parts of helium-4 against the helium-4 atom, then the mass difference turned into energy' });
  const TITLES = ['Weigh the loose parts', 'Weigh the nucleus', 'The mass is missing', 'Turn mass into energy', 'Binding energy per nucleon'];
  loop(host, (dt) => { if (Math.abs(tgt - tilt) > 0.002) { tilt += (tgt - tilt) * Math.min(1, dt * 5); cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8, cx = w / 2, by = top + 46, L = Math.min(150, w * 0.36);
    const ang = tilt * 0.14, lx = cx - L * Math.cos(ang), ly = by - L * Math.sin(ang), rx = cx + L * Math.cos(ang), ry = by + L * Math.sin(ang);
    line(ctx, [[cx, by + 70], [cx, by]], col.ink, 4); line(ctx, [[cx - 30, by + 70], [cx + 30, by + 70]], col.ink, 4);
    line(ctx, [[lx, ly], [rx, ry]], col.ink, 4);
    const pan = (x, y, c, lab) => { line(ctx, [[x, y], [x - 30, y + 36], [x + 30, y + 36]], col.muted, 1); ctx.fillStyle = c; ctx.globalAlpha = 0.25; ctx.fillRect(x - 40, y + 36, 80, 8); ctx.globalAlpha = 1; line(ctx, [[x - 40, y + 36], [x + 40, y + 36]], col.ink, 3); text(ctx, lab, x, y + 56, { color: col.ink, size: 11, weight: 700, align: 'center' }); };
    const nuc = (x, y, n, s) => { for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.7; ctx.beginPath(); ctx.arc(x + s * Math.cos(a), y - 14 + s * Math.sin(a) * 0.9, 6, 0, 7); ctx.fillStyle = i < 2 ? col.s[3] : col.s[0]; ctx.fill(); } };
    nuc(lx, ly + 20, 4, 14); pan(lx, ly, col.s[0], step === 1 ? '' : 'parts');
    if (step >= 1) { nuc(rx, ry + 24, 4, 5); pan(rx, ry, col.s[2], 'He-4 nucleus'); } else pan(rx, ry, col.s[2], '(empty)');
    if (step === 1) text(ctx, '2 H atoms + 2 n', lx, ly + 56, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const y0 = by + 128, T = (s, i, c = col.ink, wt = 400, sz = 12) => text(ctx, s, w / 2, y0 + i * 18, { color: c, size: sz, weight: wt, align: 'center' });
    if (step === 0) { T('2 × 1.007825 u (H atom) + 2 × 1.008665 u (n)', 0); T('= 4.032980 u', 1, col.s[7], 700); }
    if (step === 1) { T('Helium-4 atom: 4.002603 u', 0); T('The nucleus pan rises: it is lighter!', 1, col.s[2], 700); }
    if (step === 2) { T('4.032980 − 4.002603', 0); T('Δm = 0.030377 u (mass defect)', 1, col.s[2], 700); T('That mass did not vanish: it left as energy when the nucleus formed.', 2, col.muted, 400, 11); }
    if (step === 3) { T('E = Δm c²  and  1 u = 931.5 MeV/c²', 0); T('0.030377 × 931.5 = 28.3 MeV', 1, col.s[2], 700, 13); T('This is the binding energy of He-4.', 2, col.muted, 400, 11); }
    if (step === 4) { T('28.3 MeV ÷ 4 nucleons', 0); T('= 7.07 MeV per nucleon', 1, col.s[2], 700, 13); T('Supply 28.3 MeV to tear He-4 into 4 free nucleons.', 2, col.muted, 400, 11); }
    if (step >= 3) arrow(ctx, cx, y0 - 14, cx, y0 - 6, col.s[2], 2, 6);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); tgt = -1; cv.redraw(); } };
}
