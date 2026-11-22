// Respiration in plants: the ATP ledger for one glucose. Bars show the ATP made at each stage (directly, and from
// NADH and FADH2 in the electron transport system). Switch between the NCERT count (3 ATP per NADH, 2 per FADH2)
// and the modern estimate (about 2.5 and 1.5), or see fermentation, where only glycolysis pays.
import { canvas, axes, text, row, choice, readout, fmt } from '../../kit.js';

const STAGES = [
  { name: 'Glycolysis', where: 'cytoplasm', atp: 2, nadh: 2, fad: 0, co2: 0 },
  { name: 'Link reaction', where: 'mitochondrial matrix', atp: 0, nadh: 2, fad: 0, co2: 2 },
  { name: 'Krebs cycle', where: 'mitochondrial matrix', atp: 2, nadh: 6, fad: 2, co2: 4 },
];
export default function (host) {
  let cnt = 'ncert', mode = 'aer';
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'ATP made at each stage of respiration of one glucose' });
  const ctl = row(host);
  choice(ctl, 'Count', [['ncert', 'NCERT (3 / 2)'], ['modern', 'Modern (2.5 / 1.5)']], cnt, (v) => { cnt = v; cv.redraw(); show(); });
  choice(ctl, 'Oxygen', [['aer', 'Aerobic'], ['fer', 'Fermentation']], mode, (v) => { mode = v; cv.redraw(); show(); });
  const out = readout(host);
  const per = () => (cnt === 'ncert' ? [3, 2] : [2.5, 1.5]);
  const rows = () => STAGES.map((s, i) => (mode === 'fer' && i > 0 ? { ...s, atp: 0, nadh: 0, fad: 0, co2: 0 } : s)).map((s) => {
    const [a, b] = per(), viaETS = mode === 'fer' ? 0 : s.nadh * a + s.fad * b;
    return { ...s, ets: viaETS, total: s.atp + viaETS };
  });
  const show = () => {
    const R = rows(), tot = R.reduce((t, s) => t + s.total, 0);
    if (mode === 'fer') { out.innerHTML = `<b>Fermentation: net 2 ATP per glucose</b>, all from glycolysis. The 2 NADH are used to reduce pyruvic acid to ethanol + CO₂ (yeast) or lactic acid (muscle), so NAD⁺ is freed for glycolysis to go on. Less than 7% of the energy in glucose is released.`; return; }
    out.innerHTML = R.map((s) => `${s.name} (${s.where}): ${s.atp} ATP direct + ${s.nadh} NADH${s.fad ? ` + ${s.fad} FADH₂` : ''} → ${fmt(s.total, 3)} ATP; ${s.co2} CO₂`).join(' · ') + `. <b>Total ${fmt(tot, 3)} ATP</b> per glucose. ${cnt === 'ncert' ? 'NCERT assumes every NADH gives 3 ATP and every FADH₂ 2.' : 'Measured values are lower: about 30 to 32 ATP, because of proton leaks and the cost of moving NADH and ATP across membranes.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const R = rows();
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 3], y: [0, 40], xt: [], ylabel: 'ATP per glucose', b: 30 });
    let run = 0;
    R.forEach((s, i) => {
      const x0 = X(i + 0.18), x1 = X(i + 0.82);
      ctx.fillStyle = col.s[0]; ctx.fillRect(x0, Y(run + s.atp), x1 - x0, Y(run) - Y(run + s.atp));
      ctx.fillStyle = col.s[1]; ctx.fillRect(x0, Y(run + s.total), x1 - x0, Y(run + s.atp) - Y(run + s.total));
      run += s.total;
      text(ctx, s.name, (x0 + x1) / 2, h - 14, { color: col.muted, size: 10, align: 'center' });
      text(ctx, fmt(run, 3), (x0 + x1) / 2, Y(run) - 9, { color: col.ink, size: 11, weight: 700, align: 'center' });
    });
    text(ctx, '■ direct ATP', X(0.1), Y(38), { color: col.s[0], size: 11 });
    text(ctx, '■ via ETS (NADH, FADH₂)', X(0.1), Y(34.5), { color: col.s[1], size: 11 });
  };
  cv.redraw(); show();
}
