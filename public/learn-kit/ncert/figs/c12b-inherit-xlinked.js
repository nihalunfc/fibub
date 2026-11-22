// Class 12 Biology, Principles of Inheritance and Variation: X-linked recessive inheritance (haemophilia, red-green colour blindness). The gene is on the X chromosome.
// A son gets his only X from his mother, so a carrier mother passes the condition to half of her sons; a daughter is affected only if both X carry it.
// X^H normal, X^h affected. Pick the mother and father.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let mom = 'carrier', dad = 'normal';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A Punnett square of an X-linked recessive cross with each child labelled normal, carrier or affected' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Mother', [['normal', 'Normal'], ['carrier', 'Carrier'], ['affected', 'Affected']], 'carrier', (v) => { mom = v; go(); });
  choice(ctl, 'Father', [['normal', 'Normal'], ['affected', 'Affected']], 'normal', (v) => { dad = v; go(); });
  const MG = { normal: ['H', 'H'], carrier: ['H', 'h'], affected: ['h', 'h'] }, DG = { normal: ['H', 'Y'], affected: ['h', 'Y'] };
  const kid = (m, d) => { if (d === 'Y') return [`X${m}Y`, m === 'h' ? 'affected son' : 'normal son', m === 'h' ? 2 : 0]; const g = [m, d].sort().join(''); return [`X${g[0]}X${g[1]}`.replace(/Xh/, 'Xh'), g === 'hh' ? 'affected daughter' : g === 'Hh' ? 'carrier daughter' : 'normal daughter', g === 'hh' ? 2 : g === 'Hh' ? 1 : 0]; };
  const kids = () => { const o = []; for (const m of MG[mom]) for (const d of DG[dad]) o.push(kid(m, d)); return o; };
  const go = () => { const k = kids(), cnt = (s) => k.filter((x) => x[1] === s).length, sons = k.filter((x) => /son/.test(x[1])), dau = k.filter((x) => /daughter/.test(x[1])); ro.textContent = `Of the sons, ${sons.filter((x) => /affected/.test(x[1])).length} in ${sons.length} (${Math.round(100 * sons.filter((x) => /affected/.test(x[1])).length / sons.length)} %) are affected. Of the daughters, ${cnt('affected daughter')} in ${dau.length} are affected and ${cnt('carrier daughter')} in ${dau.length} are carriers. ${dad === 'affected' && mom === 'normal' ? 'An affected father passes his X to every daughter (all carriers) and never to a son.' : mom === 'carrier' && dad === 'normal' ? 'The classic pattern: half the sons affected, half the daughters carriers.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'X-linked recessive: mother × father', col) + 6, S = Math.min(88, (w - 130) / 2), x0 = w / 2 - S + 16, y0 = top + 38, ks = kids();
    DG[dad].forEach((g, i) => text(ctx, g === 'Y' ? 'Y' : 'X' + g, x0 + S * i + S / 2, y0 - 10, { color: col.s[0], size: 13, weight: 700, align: 'center' }));
    MG[mom].forEach((g, j) => text(ctx, 'X' + g, x0 - 20, y0 + S * j + S / 2, { color: col.s[3], size: 13, weight: 700, align: 'center' }));
    text(ctx, 'father', x0 + S, top + 8, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'mother', x0 - 20, y0 + S * 2 + 12, { color: col.muted, size: 10, align: 'center' });
    ks.forEach(([g, d, st], k) => { const i = k % 2, j = Math.floor(k / 2), x = x0 + i * S, y = y0 + j * S; ctx.fillStyle = st === 2 ? col.bad : st === 1 ? col.s[3] : col.s[2]; ctx.globalAlpha = 0.5; ctx.fillRect(x, y, S, S); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, S, S); text(ctx, g, x + S / 2, y + S / 2 - 9, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, d.replace(' ', '\n').split('\n')[0], x + S / 2, y + S / 2 + 9, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, d.split(' ')[1], x + S / 2, y + S / 2 + 22, { color: col.ink, size: 10.5, align: 'center' }); });
    const ly = y0 + S * 2 + 34; [[col.s[2], 'normal'], [col.s[3], 'carrier'], [col.bad, 'affected']].forEach(([c, s], i) => { ctx.globalAlpha = 0.6; ctx.fillStyle = c; ctx.fillRect(20 + i * 100, ly - 5, 11, 11); ctx.globalAlpha = 1; text(ctx, s, 36 + i * 100, ly, { color: col.ink, size: 10.5 }); });
  };
  go();
}
