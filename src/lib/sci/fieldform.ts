// Field data forms: a form definition (fields of a few types), checks for a filled record, and exports of the
// records as CSV (RFC 4180) and GeoJSON (RFC 7946: longitude first, WGS 84). Plain TypeScript, no DOM.

export type FieldType = 'text' | 'number' | 'choice' | 'date' | 'time' | 'datetime' | 'photo' | 'gps';
export type Field = { key: string; label: string; type: FieldType; required?: boolean; help?: string; min?: number | null; max?: number | null; unit?: string; options?: string[]; multi?: boolean };
export type Form = { title: string; description?: string; fields: Field[] };
export type Gps = { lat: number; lon: number; acc: number | null; at?: string };
export type Value = string | string[] | Gps | null;
export type Rec = { no: number; values: Record<string, Value>; saved?: string };

export const TYPES: { id: FieldType; name: string; help: string }[] = [
  { id: 'text', name: 'Text', help: 'Any words, such as a site name or notes.' },
  { id: 'number', name: 'Number', help: 'A number, with an optional unit and allowed range.' },
  { id: 'choice', name: 'Choice', help: 'Pick from a list; tick "more than one" for a checklist.' },
  { id: 'date', name: 'Date', help: 'A calendar date.' },
  { id: 'time', name: 'Time', help: 'A time of day.' },
  { id: 'datetime', name: 'Date and time', help: 'A date with a time.' },
  { id: 'photo', name: 'Photo note', help: 'The number or file name of a photo you took, and what it shows. The photo itself stays in your camera.' },
  { id: 'gps', name: 'Location (GPS)', help: 'Latitude and longitude from the device, only when you tap the button, with its accuracy. Can also be typed.' },
];
export const isType = (t: unknown): t is FieldType => TYPES.some((x) => x.id === t);

/** A column-safe key from a label: lower case letters, digits and underscores. */
export function slugKey(label: string, taken: string[] = []): string {
  let k = label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'field';
  if (/^\d/.test(k)) k = 'f_' + k;
  let out = k, n = 2;
  while (taken.includes(out)) out = `${k}_${n++}`;
  return out;
}

export function formProblems(f: Form): string[] {
  const out: string[] = [];
  if (!f.fields.length) out.push('Add at least one field.');
  const seen = new Set<string>();
  f.fields.forEach((x, i) => {
    const name = x.label.trim() || `Field ${i + 1}`;
    if (!x.label.trim()) out.push(`Field ${i + 1} needs a label.`);
    if (!/^[a-z][a-z0-9_]*$/.test(x.key)) out.push(`${name}: the column name may use only lower-case letters, digits and _ and must start with a letter.`);
    else if (seen.has(x.key)) out.push(`${name}: the column name "${x.key}" is used twice.`);
    seen.add(x.key);
    if (x.type === 'choice' && !(x.options ?? []).filter((o) => o.trim()).length) out.push(`${name}: add at least one option.`);
    if (x.type === 'choice' && new Set((x.options ?? []).map((o) => o.trim()).filter(Boolean)).size !== (x.options ?? []).filter((o) => o.trim()).length) out.push(`${name}: an option is listed twice.`);
    if (x.type === 'number' && x.min != null && x.max != null && x.min > x.max) out.push(`${name}: the smallest allowed value is above the largest.`);
  });
  return out;
}

/** Read a typed number: plain decimal, optional sign, optional exponent. */
export const readNum = (s: string): number => (/^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/.test(s) ? Number(s) : NaN);
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/, TIME = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
export function validDate(s: string): boolean {
  const m = s.match(DATE); if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}
export const validTime = (s: string) => TIME.test(s);
export const validDateTime = (s: string) => { const [d, t] = s.split('T'); return !!t && validDate(d) && validTime(t); };
export const isGps = (v: unknown): v is Gps => !!v && typeof v === 'object' && !Array.isArray(v) && Number.isFinite((v as Gps).lat) && Number.isFinite((v as Gps).lon);

const empty = (v: Value | undefined) => v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length);

/** Problems with one filled record, by field key. */
export function recordErrors(f: Form, values: Record<string, Value>): Record<string, string> {
  const e: Record<string, string> = {};
  for (const x of f.fields) {
    const v = values[x.key];
    if (empty(v)) { if (x.required) e[x.key] = 'Required.'; continue; }
    if (x.type === 'number') {
      const n = readNum(String(v));
      if (!Number.isFinite(n)) e[x.key] = 'Type a number, such as 12.5 or -3.';
      else if (x.min != null && n < x.min) e[x.key] = `The smallest allowed value is ${x.min}${x.unit ? ' ' + x.unit : ''}.`;
      else if (x.max != null && n > x.max) e[x.key] = `The largest allowed value is ${x.max}${x.unit ? ' ' + x.unit : ''}.`;
    } else if (x.type === 'choice') {
      const opts = (x.options ?? []).map((o) => o.trim());
      const vs = Array.isArray(v) ? v : [String(v)];
      if (!x.multi && vs.length > 1) e[x.key] = 'Pick one.';
      else if (vs.some((o) => !opts.includes(o))) e[x.key] = 'Pick from the list.';
    } else if (x.type === 'date' && !validDate(String(v))) e[x.key] = 'Use a real date, as 2026-11-09.';
    else if (x.type === 'time' && !validTime(String(v))) e[x.key] = 'Use a time, as 14:30.';
    else if (x.type === 'datetime' && !validDateTime(String(v))) e[x.key] = 'Use a date and time, as 2026-11-09T14:30.';
    else if (x.type === 'gps') {
      if (!isGps(v)) e[x.key] = 'Get the location or type latitude and longitude.';
      else if (v.lat < -90 || v.lat > 90) e[x.key] = 'Latitude runs from -90 to 90.';
      else if (v.lon < -180 || v.lon > 180) e[x.key] = 'Longitude runs from -180 to 180.';
      else if (v.acc != null && !(v.acc >= 0)) e[x.key] = 'Accuracy is a distance in metres, 0 or more.';
    }
  }
  return e;
}

// ---------- CSV ----------
export const csvCell = (s: string) => (/[",\r\n]/.test(s) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
export function csvHeader(f: Form): string[] {
  return ['record', ...f.fields.flatMap((x) => (x.type === 'gps' ? [`${x.key}_lat`, `${x.key}_lon`, `${x.key}_accuracy_m`, `${x.key}_time`] : [x.type === 'number' && x.unit ? `${x.key}_${slugKey(x.unit)}` : x.key])), 'saved'];
}
function cells(x: Field, v: Value | undefined): string[] {
  if (x.type === 'gps') return isGps(v) ? [String(v.lat), String(v.lon), v.acc == null ? '' : String(v.acc), v.at ?? ''] : ['', '', '', ''];
  if (v == null) return [''];
  if (Array.isArray(v)) return [v.join('; ')];
  if (x.type === 'number') { const n = readNum(String(v)); return [Number.isFinite(n) ? String(n) : String(v)]; }
  return [String(v)];
}
export function toCSV(f: Form, recs: Rec[]): string {
  const rows = [csvHeader(f), ...recs.map((r) => [String(r.no), ...f.fields.flatMap((x) => cells(x, r.values[x.key])), r.saved ?? ''])];
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

// ---------- GeoJSON ----------
export type GeoOpts = { gpsKey?: string; keepUnlocated?: boolean };
export function toGeoJSON(f: Form, recs: Rec[], o: GeoOpts = {}): { text: string; located: number; unlocated: number } {
  const g = f.fields.find((x) => x.type === 'gps' && (!o.gpsKey || x.key === o.gpsKey));
  let located = 0, unlocated = 0;
  const features = [];
  for (const r of recs) {
    const loc = g ? r.values[g.key] : null;
    const props: Record<string, unknown> = { record: r.no };
    for (const x of f.fields) {
      const v = r.values[x.key];
      if (x === g) { if (isGps(v)) { props[`${x.key}_accuracy_m`] = v.acc; props[`${x.key}_time`] = v.at ?? null; } continue; }
      if (x.type === 'gps') { props[`${x.key}_lat`] = isGps(v) ? v.lat : null; props[`${x.key}_lon`] = isGps(v) ? v.lon : null; continue; }
      if (x.type === 'number') { const n = v == null || v === '' ? NaN : readNum(String(v)); props[x.key] = Number.isFinite(n) ? n : null; continue; }
      props[x.key] = v == null || v === '' ? null : v;
    }
    if (r.saved) props.saved = r.saved;
    if (isGps(loc)) { located++; features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [round(loc.lon), round(loc.lat)] }, properties: props }); }
    else { unlocated++; if (o.keepUnlocated) features.push({ type: 'Feature', geometry: null, properties: props }); }
  }
  return { text: JSON.stringify({ type: 'FeatureCollection', name: f.title, features }, null, 1) + '\n', located, unlocated };
}
/** 7 decimal places is about 1 cm; more is noise. */
const round = (x: number) => Math.round(x * 1e7) / 1e7;

// ---------- form files ----------
export const formJson = (f: Form) => JSON.stringify({ fibub: 'field-form', version: 1, ...f }, null, 2) + '\n';
export function readForm(text: string): Form {
  let j: any;
  try { j = JSON.parse(text); } catch { throw new Error('This is not JSON. Open a form saved from this page (.json).'); }
  if (!j || typeof j !== 'object' || !Array.isArray(j.fields)) throw new Error('This JSON has no "fields" list, so it is not a form saved from this page.');
  if (j.fields.length > 60) throw new Error('This form has more than 60 fields; the page takes up to 60.');
  const str = (x: unknown, n: number) => (typeof x === 'string' ? x.slice(0, n) : '');
  const nn = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : null);
  const taken: string[] = [];
  const fields: Field[] = j.fields.map((x: any, i: number) => {
    if (!x || typeof x !== 'object') throw new Error(`Field ${i + 1} is not an object.`);
    if (!isType(x.type)) throw new Error(`Field ${i + 1} has an unknown type "${String(x.type).slice(0, 20)}". Types: ${TYPES.map((t) => t.id).join(', ')}.`);
    const label = str(x.label, 120) || `Field ${i + 1}`;
    const key = typeof x.key === 'string' && /^[a-z][a-z0-9_]*$/.test(x.key) && !taken.includes(x.key) ? x.key.slice(0, 40) : slugKey(label, taken);
    taken.push(key);
    const out: Field = { key, label, type: x.type, required: !!x.required };
    if (str(x.help, 300)) out.help = str(x.help, 300);
    if (x.type === 'number') { out.min = nn(x.min); out.max = nn(x.max); if (str(x.unit, 20)) out.unit = str(x.unit, 20); }
    if (x.type === 'choice') { out.options = (Array.isArray(x.options) ? x.options : []).slice(0, 100).map((o: unknown) => str(o, 120)).filter(Boolean); out.multi = !!x.multi; }
    return out;
  });
  return { title: str(j.title, 120) || 'Field form', description: str(j.description, 600), fields };
}

export const EXAMPLE: Form = {
  title: 'Roadside pollinator count',
  description: 'A made-up example: a 10-minute count of pollinators on a flowering verge.',
  fields: [
    { key: 'site', label: 'Site name', type: 'text', required: true, help: 'A short name you will recognise later.' },
    { key: 'when', label: 'Date and time', type: 'datetime', required: true },
    { key: 'location', label: 'Location', type: 'gps', required: false },
    { key: 'temperature', label: 'Air temperature', type: 'number', unit: '°C', min: -10, max: 45, required: false },
    { key: 'sky', label: 'Sky', type: 'choice', options: ['Sunny', 'Partly cloudy', 'Overcast'], required: true },
    { key: 'groups', label: 'Groups seen', type: 'choice', multi: true, options: ['Bumblebees', 'Honeybees', 'Solitary bees', 'Hoverflies', 'Butterflies', 'Beetles'] },
    { key: 'count', label: 'Total insects counted', type: 'number', min: 0, max: 500, required: true },
    { key: 'photo', label: 'Photo note', type: 'photo', help: 'Photo number and what it shows, such as "IMG_2041: bumblebee on clover".' },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
};
