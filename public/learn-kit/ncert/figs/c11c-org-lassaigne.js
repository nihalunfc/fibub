// Class 11 Chemistry, Organic Chemistry basics: Lassaigne's test. Fuse the organic compound with sodium: N, S and halogens become NaCN, Na2S and NaX (X = Cl, Br, I). Boil with water and filter: the "sodium extract".
// N: FeSO4 + NaOH, boil, acidify with H2SO4 -> Prussian blue (Fe4[Fe(CN)6]3). S: sodium nitroprusside -> violet, or lead acetate + acetic acid -> black PbS.
// N and S together: acidified FeCl3 -> blood-red Fe(SCN)2+. Halogens: boil with HNO3 (removes CN- and S2-), add AgNO3 -> white AgCl (dissolves in NH3), pale yellow AgBr (partly), yellow AgI (insoluble).
import { canvas, text, title, choice, button, readout, row, loop, clamp } from '../../kit.js';

const E = {
  n: { n: 'Nitrogen', rg: 'FeSO₄ + NaOH, boil, then conc. H₂SO₄ / FeCl₃', c: [226, 232, 200, 20, 40, 160], res: 'Prussian blue colour: nitrogen present', eq: 'Na + C + N → NaCN; 6CN⁻ + Fe²⁺ → [Fe(CN)₆]⁴⁻; 3[Fe(CN)₆]⁴⁻ + 4Fe³⁺ → Fe₄[Fe(CN)₆]₃' },
  s: { n: 'Sulphur', rg: 'sodium nitroprusside', c: [226, 232, 200, 120, 40, 150], res: 'violet colour: sulphur present', eq: '2Na + S → Na₂S; S²⁻ + [Fe(CN)₅NO]²⁻ → [Fe(CN)₅NOS]⁴⁻ (violet)' },
  s2: { n: 'Sulphur (lead acetate)', rg: 'acetic acid + lead acetate', c: [226, 232, 200, 30, 30, 30], res: 'black precipitate of PbS: sulphur present', eq: 'S²⁻ + Pb²⁺ → PbS (black)' },
  ns: { n: 'N and S together', rg: 'acidified FeCl₃', c: [226, 232, 200, 190, 30, 40], res: 'blood-red colour: both N and S present', eq: 'Na + C + N + S → NaSCN; SCN⁻ + Fe³⁺ → [Fe(SCN)]²⁺ (blood red)' },
  cl: { n: 'Chlorine', rg: 'HNO₃, then AgNO₃', c: [226, 232, 200, 245, 245, 245], res: 'white curdy precipitate of AgCl, soluble in NH₃', eq: 'Cl⁻ + Ag⁺ → AgCl (white)' },
  br: { n: 'Bromine', rg: 'HNO₃, then AgNO₃', c: [226, 232, 200, 240, 230, 150], res: 'pale yellow precipitate of AgBr, partly soluble in NH₃', eq: 'Br⁻ + Ag⁺ → AgBr (pale yellow)' },
  i: { n: 'Iodine', rg: 'HNO₃, then AgNO₃', c: [226, 232, 200, 245, 215, 40], res: 'yellow precipitate of AgI, insoluble in NH₃', eq: 'I⁻ + Ag⁺ → AgI (yellow)' },
};
export default function (host) {
  let k = 'n', p = 0, run = false;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A test tube of sodium extract changing colour when the test reagent is added' });
  loop(host, (dt) => { if (run) { p = clamp(p + dt * 0.5, 0, 1); if (p >= 1) run = false; cv.redraw(); } });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'element tested', Object.entries(E).map(([a, d]) => [a, d.n]), k, (v) => { k = v; p = 0; run = false; go(); });
  button(ctl, 'Add the reagent', () => { p = 0; run = true; });
  const go = () => { ro.textContent = `${E[k].n}: add ${E[k].rg}. ${E[k].eq}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = E[k], top = title(ctx, `Lassaigne's test for ${d.n.toLowerCase()}`, col) + 10, cx = w / 2, ty = top + 34, th = 120, tw = 54;
    const c0 = d.c.slice(0, 3), c1 = d.c.slice(3), mix = (i) => Math.round(c0[i] + (c1[i] - c0[i]) * p), rgb = `rgb(${mix(0)},${mix(1)},${mix(2)})`;
    // tube
    ctx.beginPath(); ctx.moveTo(cx - tw / 2, ty); ctx.lineTo(cx - tw / 2, ty + th); ctx.arc(cx, ty + th, tw / 2, Math.PI, 0, true); ctx.lineTo(cx + tw / 2, ty); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx - tw / 2, ty + 36); ctx.lineTo(cx - tw / 2, ty + th); ctx.arc(cx, ty + th, tw / 2, Math.PI, 0, true); ctx.lineTo(cx + tw / 2, ty + 36); ctx.closePath(); ctx.clip(); ctx.fillStyle = rgb; ctx.fillRect(cx - tw / 2, ty + 36, tw, th + 30);
    if (['cl', 'br', 'i', 's2'].includes(k) && p > 0.2) { ctx.fillStyle = rgb; ctx.fillRect(cx - tw / 2, ty + th - 10 * p, tw, 28); }
    ctx.restore();
    if (run && p < 0.3) { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(cx, ty - 8 + p * 140, 4, 0, 7); ctx.fill(); }
    text(ctx, 'sodium extract', cx - tw / 2 - 10, ty + 70, { color: col.muted, size: 10.5, align: 'right' });
    text(ctx, '+ ' + d.rg, cx, ty + th + tw / 2 + 22, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, p >= 1 ? d.res : p > 0 ? 'reacting…' : 'press “Add the reagent”', cx, ty + th + tw / 2 + 46, { color: p >= 1 ? col.s[3] : col.muted, size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
