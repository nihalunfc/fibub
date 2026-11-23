// Class 11 Biology, Plant Growth and Development: plant growth regulators. Choose a hormone and set the dose; the sketched plant shows what it does
// (auxin: apical dominance and rooting; gibberellin: tall stem; cytokinin: side buds and fresh leaves; ethylene: ripening and leaf fall; abscisic acid: closed stomata and dormancy).
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';
import { ell } from '../c11b-lib.js';

export default function (host) {
  let hh = 'aux', dose = 0.7;
  const D = { aux: 'Auxin (IAA, made in shoot tips): cell elongation, apical dominance (the tip stops side buds), rooting of cuttings, parthenocarpy, weed killer 2,4-D in high dose.', gib: 'Gibberellin (GA₃): stem elongation and bolting (sugarcane, cabbage), seeds germinate, malting of barley, longer grape stalks.', cyt: 'Cytokinin (from root tips): cell division, side buds grow (breaks apical dominance), fresh leaves, delays senescence (leaves stay green).', eth: 'Ethylene (a gas): ripens fruit, makes leaves and fruit fall, promotes flowering in pineapple; raw mangoes ripen faster next to a ripe one.', aba: 'Abscisic acid (ABA): the stress hormone: closes stomata in drought, keeps seeds and buds dormant, slows growth.' };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A sketched plant changing with the chosen plant hormone and dose' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Hormone', [['aux', 'Auxin'], ['gib', 'Gibberellin'], ['cyt', 'Cytokinin'], ['eth', 'Ethylene'], ['aba', 'ABA']], hh, (v) => { hh = v; go(); });
  slider(ctl, { label: 'Dose', min: 0, max: 1, step: 0.05, value: dose, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { dose = v; go(); } });
  const go = () => { ro.textContent = D[hh]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, { aux: 'Auxin', gib: 'Gibberellin', cyt: 'Cytokinin', eth: 'Ethylene', aba: 'Abscisic acid (ABA)' }[hh], col), cx = w / 2, ground = h - 28, d = dose;
    const H = (hh === 'gib' ? 0.4 + 0.55 * d : hh === 'aba' ? 0.7 - 0.3 * d : 0.7) * (ground - t0 - 30);
    ctx.fillStyle = col.line; ctx.fillRect(0, ground, w, 3);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = hh === 'gib' ? 3 : 5; ctx.beginPath(); ctx.moveTo(cx, ground); ctx.lineTo(cx, ground - H); ctx.stroke();
    const top = ground - H, n = 4;
    for (let i = 0; i < n; i++) {
      const y = ground - H * (0.2 + 0.18 * i), s = i % 2 ? 1 : -1;
      let leaf = hh === 'eth' ? 1 - d : hh === 'cyt' ? 0.8 + 0.4 * d : 1, len = 22 * leaf;
      let bud = hh === 'cyt' ? 0.3 + 0.9 * d : hh === 'aux' ? 0.9 * (1 - d) : 0.45;
      if (len > 2) ell(ctx, cx + s * (len / 2 + 4), y - 2, len / 2, 6, hh === 'aba' ? col.muted : col.s[2], null, 1, 0.9 - (hh === 'cyt' ? 0 : 0));
      if (bud > 0.05) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + s * 26 * bud, y - 20 * bud); ctx.stroke(); }
      if (hh === 'eth' && d > 0.3) ell(ctx, cx + s * (30 + 14 * i * d), ground - 6 - i * 4 * d, 5, 3, col.s[2], null, 1, 0.8);
    }
    if (hh === 'eth') { const c = d > 0.5 ? col.s[3] : col.s[2]; ell(ctx, cx - 40, top + 34, 11, 11, c, col.ink, 1); ell(ctx, cx + 40, top + 44, 11, 11, c, col.ink, 1); text(ctx, d > 0.5 ? 'ripe' : 'unripe', cx + 40, top + 62, { color: col.muted, size: 10, align: 'center' }); }
    if (hh === 'aux') { const rl = 8 + 40 * d; for (let k = -2; k <= 2; k++) line(ctx, [[cx, ground], [cx + k * rl / 3, ground + 22 * (d + 0.3)]], col.s[1], 1.5); text(ctx, 'more roots', cx + 30, ground + 14, { color: col.s[1], size: 10 }); ell(ctx, cx, top - 4, 5, 5, col.s[3], null, 1); text(ctx, 'tip: auxin', cx + 12, top - 8, { color: col.s[3], size: 10.5 }); }
    if (hh === 'aba') { const o = 5 * (1 - d); ell(ctx, cx - 34, top + 26, 8, Math.max(0.6, o), col.panel, col.s[0], 2); text(ctx, d > 0.5 ? 'stoma shut' : 'stoma open', cx - 34, top + 44, { color: col.s[0], size: 10, align: 'center' }); }
    if (hh === 'gib') text(ctx, 'height ' + Math.round(20 + 80 * d) + ' %', cx + 18, top + 6, { color: col.ink, size: 11 });
    text(ctx, `dose ${Math.round(d * 100)} %`, 10, t0 + 14, { color: col.muted, size: 11 });
  };
  go();
}
