// "Solve my numbers" for clock problems (Class 8 to 10): the angle between the hands at a given time, and the times
// after a given hour when the hands make a given angle (0 degrees: together, 90: right angle, 180: opposite). No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const sf = (x: number, n = 5) => sf3(x, n);
const DEG: [string, number][] = [['degrees', 1], ['radians', 180 / Math.PI]];
const pad = (x: number) => String(x).padStart(2, '0');

/** Minutes as "21 9/11" when it is a whole number of elevenths, otherwise a decimal. */
function mixed(m: number): string {
  const e = m * 11;
  if (Math.abs(e - Math.round(e)) < 1e-3) {
    const r = Math.round(e), w = Math.floor(r / 11), rem = r - w * 11;
    return rem === 0 ? String(w) : `${w} ${rem}/11`;
  }
  return sf(m, 4);
}

export function solveClock(i: Record<string, SIn>, c: { find: string }): SOut {
  const h = i.h.v;
  if (!Number.isInteger(h) || h < 0 || h > 24) return { error: 'The hour is a whole number from 0 to 24 (1 to 12 on a clock face).' };
  const h12 = h % 12;
  if (c.find === 'angle') {
    const m = i.m.v;
    if (!(m >= 0 && m < 60)) return { error: 'Minutes must be from 0 up to (but not including) 60.' };
    const hh = 30 * h12 + 0.5 * m, mm = 6 * m, d = Math.abs(hh - mm), small = d > 180 ? 360 - d : d, large = 360 - small;
    const t = `${h12 === 0 ? 12 : h12}:${pad(Math.floor(m))}${Number.isInteger(m) ? '' : '+'}`;
    return { answer: `At ${t} the angle between the hands is ${sf(small)}° (${sf(large)}° the other way round).`, lines: ['The hour hand turns 30° each hour, which is 0.5° each minute. The minute hand turns 6° each minute.', `Hour hand from 12: 30 × ${h12} + 0.5 × ${sf(m)} = ${sf(hh)}°`, `Minute hand from 12: 6 × ${sf(m)} = ${sf(mm)}°`, `Difference = |${sf(hh)} − ${sf(mm)}| = ${sf(d)}°${d > 180 ? ', which is more than 180°, so the angle between the hands is 360° − ' + sf(d) + '° = ' + sf(small) + '°' : ''}`, `Shortcut: angle = |30h − 5.5m| = |${30 * h12} − ${sf(5.5 * m)}| = ${sf(Math.abs(30 * h12 - 5.5 * m))}°`], tip: 'Common mistake: forgetting that the hour hand moves between the numbers. At 3:40 it is well past the 3, not on it. If your answer is over 180°, subtract it from 360°.' };
  }
  if (h < 1) return { error: 'For "when are the hands at an angle", use an hour from 1 to 12.' };
  const th = i.t.v;
  if (!(th >= 0 && th <= 180)) return { error: 'The angle between the hands is from 0° to 180°. Check the units.' };
  const hr = h === 12 || h === 24 ? 12 : h % 12 || 12, hv = hr === 12 ? 0 : hr;
  const sols: number[] = [];
  for (const k of [-1, 0, 1]) for (const sgn of [1, -1]) {
    const m = (30 * hv + sgn * th + 360 * k) / 5.5;
    if (m >= -1e-9 && m < 60 - 1e-9 && !sols.some((s) => Math.abs(s - m) < 1e-7)) sols.push(Math.max(0, m));
  }
  sols.sort((a, b) => a - b);
  const lab = (m: number) => (m < 1e-7 ? `${hr} o'clock exactly` : `${mixed(m)} minutes past ${hr}`);
  const hms = (m: number) => { let mi = Math.floor(m + 1e-9), se = Math.round((m - mi) * 60); if (se === 60) { mi += 1; se = 0; } return `${hr}:${pad(mi)}:${pad(se)}`; };
  const lines = ['The minute hand gains 5.5° a minute on the hour hand (6° − 0.5°). At m minutes past the hour, the gap is 5.5m − 30h degrees (with h the hour).', `Set the gap to ±${sf(th)}° (the minute hand can be ahead or behind), allowing a full turn of 360° too: 5.5m = ${30 * hv} ± ${sf(th)}, and so on.`];
  for (const m of sols) lines.push(`m = ${mixed(m)} minutes (${sf(m, 4)}), so at about ${hms(m)} the hands are ${sf(th)}° apart`);
  if (!sols.length) return { error: `The hands never make exactly ${sf(th)}° in the ${hr} o'clock hour. Try another angle or hour.` };
  const kind = th < 1e-3 ? ' (together)' : Math.abs(th - 90) < 1e-3 ? ' (a right angle)' : Math.abs(th - 180) < 1e-3 ? ' (opposite)' : '';
  return { answer: `Between ${hr} and ${hr === 12 ? 1 : hr + 1} the hands are ${sf(th)}° apart${kind} at ${sols.map(lab).join(' and ')}.`, lines, tip: 'Common mistake: assuming the hour hand stays on the hour number. It keeps moving, which is why the hands meet at 65 5/11 minutes, not at 60.' };
}

export const CLOCK_SPEC: SSpec = {
  id: 'clock',
  finds: [['angle', 'Angle between the hands at a time'], ['when', 'Time when the hands make an angle']],
  fields: [
    { k: 'h', label: 'Hour (1 to 12)', ph: 'e.g. 3', show: () => true },
    { k: 'm', label: 'Minutes', ph: 'e.g. 40', show: (c) => c.find === 'angle' },
    { k: 't', label: 'Angle between the hands', units: DEG, ph: 'e.g. 90 (0 = together, 180 = opposite)', show: (c) => c.find === 'when' },
  ],
  presets: [
    { name: 'Angle at 3:40', find: 'angle', vals: { h: '3', m: '40' } },
    { name: 'Angle at 9:15', find: 'angle', vals: { h: '9', m: '15' } },
    { name: 'When do the hands meet after 4 o\'clock?', find: 'when', vals: { h: '4', t: '0' } },
    { name: 'Right angle after 3 o\'clock', find: 'when', vals: { h: '3', t: '90' } },
    { name: 'Opposite hands after 2 o\'clock', find: 'when', vals: { h: '2', t: '180' } },
  ],
  solve: (i, c) => solveClock(i, c),
};
