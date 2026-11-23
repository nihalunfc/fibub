// Class 11 Biology, Locomotion: the 206 bones of an adult human skeleton. 80 are axial (skull 29, vertebral column 26, sternum 1, ribs 24) and 126 are appendicular (limbs 120,
// pectoral girdle 4, pelvic girdle 2). Pick a group to light up its share of the 206 dots.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'all';
  const G = [['skull', 29, 'Skull (cranial 8, facial 14, hyoid 1, ear ossicles 6)'], ['vert', 26, 'Vertebral column (7 cervical, 12 thoracic, 5 lumbar, sacrum, coccyx)'], ['rib', 25, 'Ribs 24 (12 pairs) and sternum 1'], ['girdle', 6, 'Girdles: pectoral 4 (clavicle and scapula, both sides), pelvic 2 (hip bones)'], ['limb', 120, 'Limbs: 30 bones in each of the four limbs']];
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 290, label: 'A grid of 206 dots, one per bone, coloured by skeleton group' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Show', [['all', 'All'], ['axial', 'Axial'], ['app', 'Appendicular'], ['skull', 'Skull'], ['vert', 'Spine'], ['rib', 'Ribs'], ['girdle', 'Girdles'], ['limb', 'Limbs']], k, (v) => { k = v; go(); });
  const AX = ['skull', 'vert', 'rib'], isOn = (g) => k === 'all' || k === g || (k === 'axial' && AX.includes(g)) || (k === 'app' && !AX.includes(g));
  const go = () => {
    const n = G.filter((g) => isOn(g[0])).reduce((a, g) => a + g[1], 0); const one = G.find((g) => g[0] === k);
    ro.textContent = (one ? one[2] + ': ' : k === 'axial' ? 'Axial skeleton (skull, spine, ribs, sternum): ' : k === 'app' ? 'Appendicular skeleton (limbs and girdles): ' : 'Whole adult skeleton: ') + n + ' of 206 bones.';
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, '206 bones in an adult', col), cols = 18, sz = (w - 28) / cols; let i = 0;
    G.forEach(([g, n], gi) => { for (let j = 0; j < n; j++, i++) { const x = 14 + (i % cols) * sz + sz / 2, y = t0 + 14 + Math.floor(i / cols) * sz; ctx.beginPath(); ctx.arc(x, y, sz * 0.36, 0, 7); ctx.fillStyle = col.s[gi % 8]; ctx.globalAlpha = isOn(g) ? 1 : 0.15; ctx.fill(); } });
    ctx.globalAlpha = 1;
    const ly = t0 + 14 + Math.ceil(206 / cols) * sz + 14;
    G.forEach(([g, n], gi) => { const y = ly + gi * 16; ctx.fillStyle = col.s[gi % 8]; ctx.globalAlpha = isOn(g) ? 1 : 0.3; ctx.fillRect(16, y - 5, 10, 10); ctx.globalAlpha = 1; text(ctx, `${{ skull: 'Skull', vert: 'Vertebral column', rib: 'Ribs and sternum', girdle: 'Girdles', limb: 'Limbs' }[g]}: ${n}`, 32, y, { color: col.ink, size: 10.5 }); });
  };
  go();
}
