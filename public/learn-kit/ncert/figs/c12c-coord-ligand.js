// Class 12 Chemistry, Coordination Compounds: ligands and denticity. A ligand donates one or more lone pairs to the metal ion. Unidentate ligands use one donor atom (Cl-, NH3, H2O),
// bidentate ones two (en, oxalate), hexadentate EDTA six. A polydentate ligand that closes rings with the metal is a chelating ligand; chelate rings make complexes extra stable.
// NO2- is ambidentate: it can bind through N (nitro) or through O (nitrito). Count = the number of donor atoms = the coordination number it uses.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const L = {
  cl: ['chlorido, Cl⁻', ['Cl'], -1, 'unidentate'], nh3: ['ammine, NH₃', ['N'], 0, 'unidentate'], en: ['ethane-1,2-diamine (en)', ['N', 'N'], 0, 'bidentate'], ox: ['oxalato, C₂O₄²⁻', ['O', 'O'], -2, 'bidentate'],
  edta: ['EDTA⁴⁻', ['N', 'N', 'O', 'O', 'O', 'O'], -4, 'hexadentate'], nitro: ['nitrito-N (nitro), NO₂⁻', ['N'], -1, 'unidentate, ambidentate'], nitrito: ['nitrito-O, NO₂⁻', ['O'], -1, 'unidentate, ambidentate'],
};
export default function (host) {
  let key = 'en';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A ligand attaching to a metal ion through one or more donor atoms' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'ligand', [['cl', 'Cl⁻'], ['nh3', 'NH₃'], ['en', 'en'], ['ox', 'ox'], ['edta', 'EDTA'], ['nitro', 'NO₂ (N)'], ['nitrito', 'NO₂ (O)']], key, (v) => { key = v; go(); });
  const go = () => {
    const [nm, d, q, kind] = L[key], rings = d.length > 1 ? d.length - 1 : 0;
    ro.textContent = `${nm}: ${kind}, donor atoms ${d.join(', ')} (${d.length} bond${d.length > 1 ? 's' : ''} to the metal), charge ${q}.` + (rings ? ` It closes ${rings} chelate ring${rings > 1 ? 's' : ''}: a chelating ligand.` : '') + (key.startsWith('nit') ? ' Same ligand, different donor atom: linkage isomers.' : '');
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, L[key][0], col), [, d, , kind] = L[key], cx = w / 2, cy = top + (h - top) * 0.46, R = Math.min(w, h - top) * 0.3;
    const n = d.length, pos = [];
    if (n === 1) pos.push(-Math.PI / 2 + 0.4); else if (n === 2) pos.push(-Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5); else for (let i = 0; i < n; i++) pos.push(-Math.PI / 2 + (i * 2 * Math.PI) / n);
    const pt = (a, r) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    // backbone behind everything
    if (n > 1) { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 4; ctx.beginPath(); pos.forEach((a, i) => { const p = pt(a, R); if (i === 0) ctx.moveTo(p[0], p[1]); else { const prev = pt(pos[i - 1], R), mid = pt((a + pos[i - 1]) / 2, R * (n === 2 ? 1.75 : 1.28)); ctx.quadraticCurveTo(mid[0], mid[1], p[0], p[1]); } }); ctx.stroke(); }
    if (n === 1) { const p = pt(pos[0], R); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 4; const q = pt(pos[0], R * 1.9); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, 7); ctx.fill(); }
    pos.forEach((a, i) => { const p = pt(a, R); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.fillStyle = d[i] === 'O' ? col.s[3] : d[i] === 'N' ? col.s[2] : col.s[1]; ctx.beginPath(); ctx.arc(p[0], p[1], 12, 0, 7); ctx.fill(); text(ctx, d[i], p[0], p[1], { color: col.panel, size: 11, weight: 700, align: 'center' }); });
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 17, 0, 7); ctx.fill(); text(ctx, 'M', cx, cy, { color: col.panel, size: 13, weight: 700, align: 'center' });
    text(ctx, `denticity ${n}`, cx, h - 26, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, kind, cx, h - 9, { color: col.muted, size: 11.5, align: 'center' });
  };
  go();
}
