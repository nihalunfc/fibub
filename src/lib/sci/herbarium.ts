// Herbarium specimen labels from Darwin Core records. Plain text logic; no DOM.
// Darwin Core terms: Biodiversity Information Standards (TDWG), https://dwc.tdwg.org/terms/ (CC BY 4.0).
import { parseCsv, toCsv } from '../convert/table.ts';

export const FIELDS: { term: string; label: string; hint?: string }[] = [
  { term: 'institutionCode', label: 'Institution code', hint: 'e.g. the herbarium acronym' },
  { term: 'catalogNumber', label: 'Catalogue number' },
  { term: 'family', label: 'Family' },
  { term: 'scientificName', label: 'Scientific name', hint: 'genus, species and any infraspecific name' },
  { term: 'scientificNameAuthorship', label: 'Authorship' },
  { term: 'country', label: 'Country' },
  { term: 'stateProvince', label: 'State or province' },
  { term: 'county', label: 'County or district' },
  { term: 'locality', label: 'Locality' },
  { term: 'decimalLatitude', label: 'Latitude (decimal degrees)', hint: 'north positive' },
  { term: 'decimalLongitude', label: 'Longitude (decimal degrees)', hint: 'east positive' },
  { term: 'coordinateUncertaintyInMeters', label: 'Coordinate uncertainty (m)' },
  { term: 'minimumElevationInMeters', label: 'Elevation (m)' },
  { term: 'habitat', label: 'Habitat' },
  { term: 'occurrenceRemarks', label: 'Remarks (plant description)' },
  { term: 'recordedBy', label: 'Collector(s)' },
  { term: 'recordNumber', label: 'Collector number' },
  { term: 'eventDate', label: 'Date collected', hint: 'YYYY-MM-DD' },
  { term: 'identifiedBy', label: 'Identified by' },
  { term: 'dateIdentified', label: 'Date identified', hint: 'YYYY-MM-DD' },
];
export const TERMS = FIELDS.map((f) => f.term);
export type Rec = Record<string, string>;

const ALIASES: Record<string, string> = {
  collector: 'recordedBy', collectors: 'recordedBy', collectornumber: 'recordNumber', number: 'recordNumber', fieldnumber: 'recordNumber',
  date: 'eventDate', collectiondate: 'eventDate', datecollected: 'eventDate', latitude: 'decimalLatitude', lat: 'decimalLatitude',
  longitude: 'decimalLongitude', lon: 'decimalLongitude', long: 'decimalLongitude', lng: 'decimalLongitude', elevation: 'minimumElevationInMeters',
  altitude: 'minimumElevationInMeters', elevationm: 'minimumElevationInMeters', species: 'scientificName', taxon: 'scientificName', name: 'scientificName',
  author: 'scientificNameAuthorship', authority: 'scientificNameAuthorship', state: 'stateProvince', province: 'stateProvince', district: 'county',
  determiner: 'identifiedBy', detby: 'identifiedBy', remarks: 'occurrenceRemarks', notes: 'occurrenceRemarks', description: 'occurrenceRemarks',
  herbarium: 'institutionCode', accession: 'catalogNumber', barcode: 'catalogNumber', uncertainty: 'coordinateUncertaintyInMeters',
};
const key = (s: string) => s.toLowerCase().replace(/^dwc:/, '').replace(/[^a-z]/g, '');
const BY_KEY = Object.fromEntries(TERMS.map((t) => [key(t), t]));
/** The Darwin Core term a column header stands for, or null. Accepts dwc: prefixes, any case and a few common names. */
export const termFor = (h: string): string | null => BY_KEY[key(h)] ?? ALIASES[key(h)] ?? null;

/** Read a table (CSV with quotes, or tab-separated) whose first row names the columns. */
export function readRecords(text: string): { records: Rec[]; unknown: string[]; error?: string } {
  const t = parseCsv(text.replace(/\r\n?/g, '\n').replace(/\n+$/, '')).filter((r) => r.some((c) => c.trim() !== ''));
  if (!t.length) return { records: [], unknown: [], error: 'Add a header row of Darwin Core field names, then one row per specimen.' };
  const head = t[0].map((h) => termFor(h.trim()));
  if (!head.some((h) => h)) return { records: [], unknown: [], error: 'The first row must name the columns with Darwin Core terms, such as scientificName, recordedBy, eventDate, locality.' };
  const unknown = t[0].filter((_, i) => !head[i]).map((h) => h.trim()).filter(Boolean);
  const records = t.slice(1).map((r) => { const o: Rec = {}; head.forEach((h, i) => { if (h && (r[i] ?? '').trim()) o[h] = (o[h] ? o[h] + ' ' : '') + r[i].trim(); }); return o; }).filter((o) => Object.keys(o).length);
  return { records, unknown };
}

/** Records back to CSV with Darwin Core column names (only terms used by at least one record, in FIELDS order). */
export function recordsCsv(records: Rec[]): string {
  const used = TERMS.filter((t) => records.some((r) => (r[t] ?? '') !== ''));
  return toCsv([used, ...records.map((r) => used.map((t) => r[t] ?? ''))]);
}

const ISO = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii'];
export type DateStyle = 'long' | 'short' | 'roman' | 'iso';
/** True for an ISO 8601 date (YYYY, YYYY-MM or YYYY-MM-DD) that exists, or a range of two joined by "/". */
export function validDate(s: string): boolean {
  return s.split('/').length <= 2 && s.split('/').every((p) => { const m = ISO.exec(p.trim()); if (!m) return false; const y = +m[1], mo = m[2] ? +m[2] : 1, d = m[3] ? +m[3] : 1; if (mo < 1 || mo > 12) return false; const dim = new Date(Date.UTC(y, mo, 0)).getUTCDate(); return d >= 1 && d <= dim; });
}
/** A date for the label: "12 March 2026", "12 Mar 2026", "12.iii.2026" (the herbarium convention) or ISO. Text that is not ISO is kept as typed. */
export function formatDate(s: string, style: DateStyle): string {
  if (!s || style === 'iso' || !validDate(s)) return s;
  return s.split('/').map((p) => {
    const m = ISO.exec(p.trim())!, y = m[1], mo = m[2] ? +m[2] - 1 : -1, d = m[3] ? String(+m[3]) : '';
    if (mo < 0) return y;
    if (style === 'roman') return [d, ROMAN[mo], y].filter(Boolean).join('.');
    const name = style === 'long' ? MONTHS[mo] : MONTHS[mo].slice(0, 3);
    return [d, name, y].filter(Boolean).join(' ');
  }).join(' to ');
}

/** Decimal degrees to degrees, minutes and seconds, e.g. 45.5042 → 45°30'15.1"N. */
export function dms(v: number, isLat: boolean, secDecimals = 1): string {
  const hemi = isLat ? (v >= 0 ? 'N' : 'S') : v >= 0 ? 'E' : 'W';
  const f = 10 ** secDecimals;
  let total = Math.round(Math.abs(v) * 3600 * f); // in 1/f seconds, so rounding never gives 60"
  const deg = Math.floor(total / (3600 * f)); total -= deg * 3600 * f;
  const min = Math.floor(total / (60 * f)); total -= min * 60 * f;
  return `${deg}°${String(min).padStart(2, '0')}'${(total / f).toFixed(secDecimals).padStart(secDecimals ? 3 + secDecimals : 2, '0')}"${hemi}`;
}

/** Problems worth flagging before printing. */
export function checkRecord(r: Rec): string[] {
  const out: string[] = [];
  if (!r.scientificName) out.push('no scientific name');
  const lat = r.decimalLatitude, lon = r.decimalLongitude;
  if ((lat ?? '') !== '' || (lon ?? '') !== '') {
    if (!(Number(lat) >= -90 && Number(lat) <= 90)) out.push('latitude must be a number from −90 to 90');
    if (!(Number(lon) >= -180 && Number(lon) <= 180)) out.push('longitude must be a number from −180 to 180');
  }
  if (r.eventDate && !validDate(r.eventDate)) out.push('date collected is not YYYY-MM-DD');
  if (r.dateIdentified && !validDate(r.dateIdentified)) out.push('date identified is not YYYY-MM-DD');
  for (const t of ['minimumElevationInMeters', 'coordinateUncertaintyInMeters']) if (r[t] && !Number.isFinite(Number(r[t]))) out.push(`${t} is not a number`);
  return out;
}

export type Style = 'r' | 'i' | 'b' | 'bi';
export type Run = { text: string; style: Style };
export type Line = { runs: Run[]; align: 'l' | 'c' | 'r'; size: number; gap?: number };
export type LabelOpts = { heading: string; dateStyle: DateStyle; coords: 'decimal' | 'dms' | 'both'; feet: boolean };

const RANKS = new Set(['subsp.', 'ssp.', 'var.', 'f.', 'forma', 'cf.', 'aff.', 'sp.', 'spp.', 'nothosubsp.', 'nothovar.', '×', 'x', 'agg.', 's.l.', 's.str.', 'sensu', 'lato', 'stricto']);
/** A scientific name in italics, with rank words (subsp., var., cf.) and the authorship in roman. */
export function nameRuns(name: string, author = ''): Run[] {
  const runs: Run[] = [];
  name.trim().split(/\s+/).filter(Boolean).forEach((w) => runs.push({ text: w, style: RANKS.has(w.toLowerCase()) ? 'b' : 'bi' }));
  if (author.trim()) runs.push({ text: author.trim(), style: 'r' });
  return runs;
}

/** Fill {term} placeholders and tidy the separators left by empty ones. */
export function fillTemplate(tpl: string, r: Rec): string {
  // A list of placeholders joined by commas keeps only the filled ones: "{county}, {country}" → "Canada".
  return tpl.replace(/\{\w+\}(?:\s*,\s*\{\w+\})+/g, (m) => m.match(/\w+/g)!.map((t) => (r[t] ?? '').trim()).filter(Boolean).join(', '))
    .replace(/\{(\w+)\}/g, (_, t) => (r[t] ?? '').trim()).replace(/^[\s,;:-]+|[\s,;:-]+$/g, '').replace(/\s{2,}/g, ' ');
}

const sentence = (s: string) => (s && !/[.!?]$/.test(s) ? `${s}.` : s);

/** The label as lines of styled text, used for the page preview, printing and the PDF. */
export function labelLines(r: Rec, o: LabelOpts): Line[] {
  const L: Line[] = [];
  const add = (text: string, style: Style = 'r', align: Line['align'] = 'l', size = 1, gap = 0) => { if (text.trim()) L.push({ runs: [{ text: text.trim(), style }], align, size, gap }); };
  const ph = o.heading.match(/\{\w+\}/g) ?? [];
  if (!ph.length || ph.some((p) => (r[p.slice(1, -1)] ?? '').trim())) add(fillTemplate(o.heading, r).toUpperCase(), 'b', 'c', 1.05);
  if (r.family) add(r.family.toUpperCase(), 'r', 'c', 0.95, 0.2);
  if (r.scientificName) L.push({ runs: nameRuns(r.scientificName, r.scientificNameAuthorship), align: 'c', size: 1.2, gap: 0.3 });
  const place = [r.locality, r.county, r.stateProvince, r.country].filter(Boolean).join(', ');
  add(sentence(place), 'r', 'l', 1, 0.5);
  const geo: string[] = [];
  const lat = Number(r.decimalLatitude), lon = Number(r.decimalLongitude);
  if ((r.decimalLatitude ?? '') !== '' && (r.decimalLongitude ?? '') !== '' && Number.isFinite(lat) && Number.isFinite(lon)) {
    const dec = `${lat.toFixed(5).replace(/0+$/, '').replace(/\.$/, '')}, ${lon.toFixed(5).replace(/0+$/, '').replace(/\.$/, '')}`;
    const d = `${dms(lat, true)} ${dms(lon, false)}`;
    let c = o.coords === 'decimal' ? dec : o.coords === 'dms' ? d : `${d} (${dec})`;
    if (r.coordinateUncertaintyInMeters) c += ` ±${r.coordinateUncertaintyInMeters} m`;
    geo.push(c);
  }
  if (r.minimumElevationInMeters && Number.isFinite(Number(r.minimumElevationInMeters))) {
    const m = Number(r.minimumElevationInMeters);
    geo.push(`Elev. ${m} m${o.feet ? ` (${Math.round(m / 0.3048)} ft)` : ''}`);
  }
  add(geo.join('. ') + (geo.length ? '.' : ''), 'r', 'l', 0.95);
  add(sentence(r.habitat ?? ''), 'r', 'l', 1, 0.3);
  add(sentence(r.occurrenceRemarks ?? ''), 'r', 'l');
  const coll = [r.recordedBy, r.recordNumber ? `${r.recordNumber}` : ''].filter(Boolean).join(' ');
  L.push({ runs: [{ text: coll || ' ', style: 'b' }, ...(r.eventDate ? [{ text: '   ' + formatDate(r.eventDate, o.dateStyle), style: 'r' as Style }] : [])], align: 'l', size: 1, gap: 0.6 });
  if (r.identifiedBy) add(`Det. ${r.identifiedBy}${r.dateIdentified ? `, ${formatDate(r.dateIdentified, o.dateStyle)}` : ''}`, 'r', 'l', 0.9);
  if (r.catalogNumber) add([r.institutionCode, r.catalogNumber].filter(Boolean).join(' '), 'r', 'r', 0.85, 0.3);
  return L;
}

/** Greedy word wrap of styled runs to a width, given a measuring function for a word in a style. */
export function wrapRuns(runs: Run[], width: number, measure: (s: string, st: Style) => number): Run[][] {
  const words: Run[] = [];
  runs.forEach((r) => r.text.split(/(\s+)/).forEach((w) => { if (w) words.push({ text: w, style: r.style }); }));
  const lines: Run[][] = [[]];
  let x = 0;
  for (const w of words) {
    const space = /^\s+$/.test(w.text), wd = measure(w.text, w.style);
    const cur = lines[lines.length - 1];
    if (space) { if (cur.length) { cur.push(w); x += wd; } continue; }
    if (x + wd > width && cur.length) {
      while (cur.length && /^\s+$/.test(cur[cur.length - 1].text)) cur.pop();
      lines.push([w]); x = wd;
    } else { cur.push(w); x += wd; }
  }
  return lines.filter((l) => l.length);
}

/** Labels per page laid out as 2 columns (or 1 for a single label). */
export const PAPERS = { a4: { w: 595.28, h: 841.89, name: 'A4' }, letter: { w: 612, h: 792, name: 'US Letter' } } as const;
export function grid(perPage: number) { return perPage === 1 ? { cols: 1, rows: 1 } : { cols: 2, rows: perPage / 2 }; }
