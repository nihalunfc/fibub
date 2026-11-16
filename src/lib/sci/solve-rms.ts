// "Solve my numbers" for AC waveforms: rms, peak, peak-to-peak and average from any one of them, for six waveforms, with the
// heating power in a resistor. Standard exact factors (see rms-waveform.ts). No DOM.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { EXACT, type Wave } from './rms-waveform.ts';

const NAME: Record<Wave, string> = { sine: 'sine wave', square: 'square wave', triangle: 'triangle wave', saw: 'sawtooth wave', half: 'half-wave rectified sine', full: 'full-wave rectified sine' };
const FAC: Record<Wave, string> = { sine: '1/√2 = 0.7071', square: '1', triangle: '1/√3 = 0.5774', saw: '1/√3 = 0.5774', half: '1/2 = 0.5', full: '1/√2 = 0.7071' };
const UNITS: [string, number][] = [['V', 1], ['mV', 1e-3], ['kV', 1e3]];
const conv = (i: SIn | undefined, base: string, what: string) => (i && !i.blank && i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);

export function rms(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const w = (c.ch.wave ?? 'sine') as Wave, ex = EXACT[w], unit = c.ch.kind === 'I' ? 'A' : 'V', find = c.find;
  const given = find === 'peak' ? i.vr : find === 'rms' ? i.v0 : find === 'pp' ? i.vpp : i.v0;
  if (!(given.v > 0)) return { error: 'Type a value above zero. A waveform that never moves has nothing to measure.' };
  let V0: number;
  const lines: string[] = [];
  lines.push(`Waveform: ${NAME[w]}. Exact factors for a peak of 1: rms = ${FAC[w]}.`);
  if (find === 'peak') {
    V0 = i.vr.v / ex.rms;
    lines.push(...conv(i.vr, unit, 'the rms value'), `Peak = rms ÷ factor = ${sf(i.vr.v)} ÷ ${sf(ex.rms, 4)} = ${sf(V0)} ${unit}`);
  } else if (find === 'pp') {
    const lo = w === 'half' || w === 'full' ? 0 : -1;
    V0 = i.vpp.v / (1 - lo);
    lines.push(...conv(i.vpp, unit, 'the peak-to-peak value'), `${lo === 0 ? 'This waveform never goes below zero, so peak-to-peak = peak' : 'Peak-to-peak = 2 × peak, so peak = half of it'}: ${sf(V0)} ${unit}`);
  } else {
    V0 = i.v0.v;
    lines.push(...conv(i.v0, unit, 'the peak value'));
  }
  const Vr = V0 * ex.rms, pp = w === 'half' || w === 'full' ? V0 : 2 * V0, avg = w === 'sine' ? (2 / Math.PI) * V0 : w === 'square' ? V0 : ex.absMean * V0;
  if (find !== 'peak') lines.push(`rms = factor × peak = ${sf(ex.rms, 4)} × ${sf(V0)} = ${sf(Vr)} ${unit}`);
  lines.push(`Peak-to-peak = ${sf(pp)} ${unit}`);
  if (w === 'sine') lines.push(`Average over a half cycle = 2/π × peak = ${sf(avg)} ${unit} (over a whole cycle the average is zero)`);
  else if (w === 'half' || w === 'full') lines.push(`Average over a cycle (what a DC meter reads) = ${sf(ex.mean * V0)} ${unit}`);
  else lines.push(`Average size |v| over a cycle = ${sf(avg)} ${unit} (the plain average over a whole cycle is zero)`);
  const R = i.R && !i.R.blank ? i.R.v : NaN;
  let tail = '';
  if (Number.isFinite(R)) {
    if (!(R > 0)) return { error: 'The resistance must be above zero.' };
    const P = unit === 'V' ? (Vr * Vr) / R : Vr * Vr * R;
    lines.push(unit === 'V' ? `Average power in ${sf(R)} Ω: P = V_rms² / R = ${sf(Vr)}² ÷ ${sf(R)} = ${eng(P, 'W')}` : `Average power in ${sf(R)} Ω: P = I_rms² R = ${sf(Vr)}² × ${sf(R)} = ${eng(P, 'W')}`);
    tail = ` It heats a ${sf(R)} Ω resistor at ${eng(P, 'W')}.`;
  }
  const sym = unit === 'V' ? 'V' : 'I';
  const answer = find === 'peak' ? `The peak value is ${sf(V0)} ${unit} (peak-to-peak ${sf(pp)} ${unit}) for an rms of ${sf(i.vr.v)} ${unit}.${tail}` : `The rms value is ${sf(Vr)} ${unit} for a ${NAME[w]} of peak ${sf(V0)} ${unit}.${tail}`;
  void sym;
  return { answer, lines, tip: 'Common mistake: using 0.707 for every waveform. 1/√2 is only for the sine wave (and full-wave rectified sine). A square wave has rms equal to its peak, a triangle or sawtooth V₀/√3, a half-wave V₀/2. An oscilloscope shows peak-to-peak, which is twice the peak for a wave that swings both ways.' };
}

export const RMS_SPEC: SSpec = {
  id: 'rms',
  finds: [['rms', 'rms from the peak'], ['peak', 'Peak from the rms'], ['pp', 'rms from peak-to-peak (scope)']],
  fields: [
    { k: 'kind', kind: 'choice', label: 'Voltage or current?', def: 'V', options: [['V', 'Voltage (V)'], ['I', 'Current (A)']] },
    { k: 'wave', kind: 'choice', label: 'Waveform', def: 'sine', options: [['sine', 'Sine'], ['square', 'Square'], ['triangle', 'Triangle'], ['saw', 'Sawtooth'], ['half', 'Half-wave rectified'], ['full', 'Full-wave rectified']] },
    { k: 'v0', label: 'Peak value', units: UNITS, show: (c) => c.find === 'rms', ph: 'e.g. 325' },
    { k: 'vr', label: 'rms value', units: UNITS, show: (c) => c.find === 'peak', ph: 'e.g. 230' },
    { k: 'vpp', label: 'Peak-to-peak value', units: UNITS, show: (c) => c.find === 'pp', ph: 'e.g. 12' },
    { k: 'R', label: 'Load resistance (optional, for power)', units: [['Ω', 1], ['kΩ', 1e3]], optional: true, ph: 'optional' },
  ],
  presets: [
    { name: 'India mains: 230 V rms, find the peak', find: 'peak', vals: { vr: '230' }, ch: { wave: 'sine', kind: 'V' } },
    { name: 'A sine wave peaks at 325 V', find: 'rms', vals: { v0: '325' }, ch: { wave: 'sine', kind: 'V' } },
    { name: 'Scope shows 12 V peak-to-peak (sine)', find: 'pp', vals: { vpp: '12' }, ch: { wave: 'sine', kind: 'V' } },
    { name: 'Square wave of peak 5 V across 100 Ω', find: 'rms', vals: { v0: '5', R: '100' }, ch: { wave: 'square', kind: 'V' } },
    { name: 'Half-wave rectified, peak 10 V', find: 'rms', vals: { v0: '10' }, ch: { wave: 'half', kind: 'V' } },
  ],
  solve: (i, c) => rms(i, c),
};
