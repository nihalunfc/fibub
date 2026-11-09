// APGAR score (Apgar 1953) and Glasgow Coma Scale (Teasdale & Jennett 1974; 15-point form from 1976), with the
// paediatric verbal and motor wording for children too young to talk. Item wording is our own short description.

export type Choice = { v: number; text: string };
export type Item = { key: string; name: string; what: string; choices: Choice[] };

export const APGAR: Item[] = [
  { key: 'A', name: 'Appearance', what: 'Skin colour', choices: [
    { v: 2, text: 'Pink all over, hands and feet too' },
    { v: 1, text: 'Body pink, hands and feet blue' },
    { v: 0, text: 'Blue or pale all over' } ] },
  { key: 'P', name: 'Pulse', what: 'Heart rate', choices: [
    { v: 2, text: '100 beats a minute or more' },
    { v: 1, text: 'Fewer than 100 beats a minute' },
    { v: 0, text: 'No heartbeat' } ] },
  { key: 'G', name: 'Grimace', what: 'Response when stimulated (for example a catheter in the nose or a flick to the foot)', choices: [
    { v: 2, text: 'Cries, coughs, sneezes or pulls away' },
    { v: 1, text: 'Grimaces or makes a weak face' },
    { v: 0, text: 'No response' } ] },
  { key: 'Ac', name: 'Activity', what: 'Muscle tone', choices: [
    { v: 2, text: 'Moves actively, limbs well bent' },
    { v: 1, text: 'Some bending of arms and legs' },
    { v: 0, text: 'Limp, floppy' } ] },
  { key: 'R', name: 'Respiration', what: 'Breathing', choices: [
    { v: 2, text: 'Breathing well, strong cry' },
    { v: 1, text: 'Slow, weak or irregular breathing' },
    { v: 0, text: 'Not breathing' } ] },
];

export function apgar(scores: number[]): { total: number; band: 'low' | 'moderate' | 'reassuring'; label: string } {
  if (scores.length !== 5 || scores.some((s) => !Number.isInteger(s) || s < 0 || s > 2)) throw new Error('Each of the five APGAR signs scores 0, 1 or 2.');
  const total = scores.reduce((a, b) => a + b, 0);
  const band = total >= 7 ? 'reassuring' : total >= 4 ? 'moderate' : 'low';
  const label = band === 'reassuring' ? '7 to 10: reassuring' : band === 'moderate' ? '4 to 6: moderately abnormal' : '0 to 3: low';
  return { total, band, label };
}

// NT = not testable (eyes swollen shut, tube in the airway, paralysed): the component is written NT and no total is given.
export const NT = -1;
export const GCS_EYE: Choice[] = [
  { v: 4, text: 'Open by themselves' },
  { v: 3, text: 'Open when spoken to' },
  { v: 2, text: 'Open only to pressure (a firm squeeze)' },
  { v: 1, text: 'Do not open' },
  { v: NT, text: 'Not testable (for example swollen shut)' },
];
export const GCS_VERBAL_ADULT: Choice[] = [
  { v: 5, text: 'Orientated: knows name, place and date' },
  { v: 4, text: 'Confused: talks in sentences but muddled' },
  { v: 3, text: 'Words: single words that make no conversation' },
  { v: 2, text: 'Sounds: moans or groans, no words' },
  { v: 1, text: 'No sound' },
  { v: NT, text: 'Not testable (for example a breathing tube)' },
];
export const GCS_VERBAL_CHILD: Choice[] = [
  { v: 5, text: 'Coos, babbles or chats as usual for age' },
  { v: 4, text: 'Cries but can be comforted, or irritable' },
  { v: 3, text: 'Cries only to pain, or cannot be comforted' },
  { v: 2, text: 'Moans or grunts to pain' },
  { v: 1, text: 'No sound' },
  { v: NT, text: 'Not testable (for example a breathing tube)' },
];
export const GCS_MOTOR_ADULT: Choice[] = [
  { v: 6, text: 'Obeys a simple command' },
  { v: 5, text: 'Localises: moves a hand towards the pressure' },
  { v: 4, text: 'Normal flexion: bends the arm away quickly' },
  { v: 3, text: 'Abnormal flexion: slow bend, wrist curled' },
  { v: 2, text: 'Extension: straightens the arm' },
  { v: 1, text: 'No movement' },
  { v: NT, text: 'Not testable (for example paralysed)' },
];
export const GCS_MOTOR_CHILD: Choice[] = [
  { v: 6, text: 'Moves on their own as usual for age' },
  { v: 5, text: 'Pulls away from touch' },
  { v: 4, text: 'Pulls away from pain' },
  { v: 3, text: 'Abnormal flexion: slow bend, wrist curled' },
  { v: 2, text: 'Extension: straightens the arm' },
  { v: 1, text: 'No movement' },
  { v: NT, text: 'Not testable (for example paralysed)' },
];

export type GcsResult = { total: number | null; notation: string; band: '' | 'mild' | 'moderate' | 'severe'; label: string };

export function gcs(e: number, v: number, m: number): GcsResult {
  const ok = (x: number, hi: number) => x === NT || (Number.isInteger(x) && x >= 1 && x <= hi);
  if (!ok(e, 4) || !ok(v, 5) || !ok(m, 6)) throw new Error('Eyes score 1 to 4, verbal 1 to 5 and motor 1 to 6 (or not testable).');
  const part = (k: string, x: number) => `${k}${x === NT ? 'NT' : x}`;
  const notation = part('E', e) + part('V', v) + part('M', m);
  if (e === NT || v === NT || m === NT) return { total: null, notation, band: '', label: 'No total: a part could not be tested. Report the parts.' };
  const total = e + v + m;
  const band = total >= 13 ? 'mild' : total >= 9 ? 'moderate' : 'severe';
  const label = band === 'mild' ? '13 to 15: mild' : band === 'moderate' ? '9 to 12: moderate' : '3 to 8: severe';
  return { total, notation, band, label };
}
