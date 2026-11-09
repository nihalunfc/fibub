// De-identify DICOM files on the device, following the principles of the DICOM basic application level
// confidentiality profile (PS3.15 Annex E): remove or blank what names or identifies a person, replace UIDs with
// new ones that stay consistent across a set of files, remove private tags, and record that it was done. The tag
// list below is our own selection and wording, not a copy of the standard's table. Plain TypeScript, no DOM.
import { type Dicom, type Element, str, tagStr, lookup, words, isPrivate, textValue, display, IMPL_UID, IMPL_NAME } from './dicom.ts';

export type DateMode = 'shift' | 'blank' | 'keep';
export type AnonOptions = { name: string; id: string; dates: DateMode; shiftDays: number; keepPatient: boolean; keepDescriptions: boolean };
export const DEFAULTS: AnonOptions = { name: 'ANONYMOUS', id: 'ANON-0001', dates: 'shift', shiftDays: -100, keepPatient: false, keepDescriptions: false };
export type Change = { tag: string; name: string; action: string; before: string; after: string };

// What happens to each listed attribute: X remove, Z blank (keep the tag, empty value).
const X = 'remove', Z = 'blank';
type Rule = { tags: number[]; act: string; why: string; when?: 'patient' | 'desc' };
export const RULES: Rule[] = [
  { act: Z, why: 'Birth date (blanked even when other dates are shifted)', tags: [0x00100030] },
  { act: X, why: 'Other names, IDs and family details of the patient', tags: [0x00101000, 0x00101002, 0x00101001, 0x00101005, 0x00101060, 0x00100021, 0x00100022, 0x00100032, 0x00100050, 0x00101090, 0x00081120] },
  { act: X, why: 'Address, phone numbers, country and region of residence', tags: [0x00101040, 0x00102154, 0x00102150, 0x00102152] },
  { act: X, why: 'Background, history and notes about the patient (ethnic group, occupation, religion, military service, smoking, pregnancy, alerts, allergies, comments, responsible person)', tags: [0x00102160, 0x00102180, 0x001021f0, 0x00101080, 0x00101081, 0x001021a0, 0x001021b0, 0x001021c0, 0x001021d0, 0x00102000, 0x00102110, 0x00104000, 0x00102297, 0x00102299] },
  { act: Z, why: 'Sex (kept with "Keep sex, age, size and weight")', tags: [0x00100040], when: 'patient' },
  { act: X, why: 'Age, height and weight (kept with "Keep sex, age, size and weight")', tags: [0x00101010, 0x00101020, 0x00101030], when: 'patient' },
  { act: X, why: 'Hospital or clinic: name, address, department, code', tags: [0x00080080, 0x00080081, 0x00080082, 0x00081040] },
  { act: Z, why: 'Referring physician (name blanked; address, phone and IDs removed)', tags: [0x00080090] },
  { act: X, why: 'Other staff: referring physician details, physicians of record, performing and reading physicians, operators, requesting physician and service', tags: [0x00080092, 0x00080094, 0x00080096, 0x00081048, 0x00081049, 0x00081050, 0x00081052, 0x00081060, 0x00081062, 0x00081070, 0x00081072, 0x00321032, 0x00321033, 0x00400006, 0x0040a075, 0x0040a073] },
  { act: Z, why: 'Accession number and study ID (they link back to hospital records)', tags: [0x00080050, 0x00200010] },
  { act: X, why: 'Request and procedure records that may hold IDs or names', tags: [0x00080051, 0x0040a370, 0x00400275, 0x00401001, 0x00400009, 0x00400253, 0x00400243, 0x00400011] },
  { act: X, why: 'Machine and station identity: station name, serial number, plate, cassette and detector IDs', tags: [0x00081010, 0x00181000, 0x00181004, 0x00181007, 0x0018700a, 0x00400010, 0x00020016] },
  { act: X, why: 'Free-text comments that may name someone (image, study, admitting diagnosis, text values, content sequence)', tags: [0x00204000, 0x00324000, 0x00081080, 0x0040a160, 0x0040a730] },
  { act: X, why: 'Study, series, protocol and procedure descriptions (kept with "Keep descriptions")', tags: [0x00081030, 0x0008103e, 0x00181030, 0x00321060, 0x00400254, 0x00082111, 0x00400007], when: 'desc' },
  { act: X, why: 'Copies of original values and signatures (original, modified and encrypted attributes, digital signatures)', tags: [0x04000561, 0x04000550, 0x04000500, 0xfffafffa] },
  { act: X, why: 'Overlay pictures and comments (they can hold text), and old curve data', tags: [] },
];
const RULE_BY_TAG = new Map<number, Rule>();
for (const r of RULES) for (const t of r.tags) RULE_BY_TAG.set(t >>> 0, r);
/** The rules applied by value type, anywhere in the file (also inside sequences). */
export const TYPE_RULES = [
  "Patient's name: replaced by your label. Patient ID: replaced by your pseudonym.",
  'Every other person name (PN), anywhere in the file: blanked.',
  'Every date (DA) and date-time (DT): shifted by the same number of days, blanked, or kept, as you choose. Times (TM) are blanked when dates are blanked.',
  'Every UID that is not a standard DICOM UID (study, series, instance, frame of reference, references): replaced by a new random UID; the same old UID always gets the same new one, so a series stays a series.',
  'Every private (maker-specific) tag: removed.',
  'Added: Patient Identity Removed = YES, the method used, and whether dates were changed.',
];

const STANDARD_UID = /^1\.2\.840\.10008\./;
/** A new random UID under the 2.25 root (a 128-bit random number, as for UUIDs). */
export function randomUid(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80; // version 4 UUID bits
  let n = 0n; for (const x of b) n = (n << 8n) | BigInt(x);
  return `2.25.${n}`;
}
/** Shift a DICOM date (YYYYMMDD) by whole days; returns '' if it cannot be read. */
export function shiftDate(s: string, days: number): string {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(s.trim());
  if (!m) return '';
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3]) + days * 86400000, d = new Date(t);
  if (Number.isNaN(t) || +m[2] < 1 || +m[2] > 12) return '';
  return `${d.getUTCFullYear().toString().padStart(4, '0')}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
}
function shiftDT(s: string, days: number): string {
  const m = /^(\d{8})(.*)$/.exec(s.trim());
  if (!m) return '';
  const d = shiftDate(m[1], days);
  return d ? d + m[2] : '';
}
const isOverlayOrCurve = (tag: number) => { const g = tag >>> 16; return ((g & 0xff00) === 0x5000 || ((g & 0xff00) === 0x6000 && ((tag & 0xffff) === 0x3000 || (tag & 0xffff) === 0x4000 || (tag & 0xffff) === 0x0022))) && (g & 1) === 0; };

/** De-identify one file. uids maps old UIDs to new ones and is shared by every file of a set. */
export function anonymise(d: Dicom, opt: AnonOptions, uids: Map<string, string>, newUid: () => string = randomUid): { out: Dicom; changes: Change[]; burned: string } {
  const changes: Change[] = [];
  const name = (t: number) => words(lookup(t)[1]) || (isPrivate(t) ? 'Private' : 'Unknown');
  const note = (e: Element, action: string, after: string) => changes.push({ tag: tagStr(e.tag), name: name(e.tag), action, before: display(e, d, 80), after });
  const mapUid = (u: string) => { if (!u || STANDARD_UID.test(u)) return u; let v = uids.get(u); if (!v) { v = newUid(); uids.set(u, v); } return v; };
  const setText = (e: Element, s: string): Element => ({ tag: e.tag, vr: e.vr, value: textValue(s, e.vr) });
  const days = Math.round(opt.shiftDays);
  let burned = '';

  const clean = (els: Element[], top: boolean, meta: boolean): Element[] => {
    const out: Element[] = [];
    for (const e of els) {
      const t = e.tag >>> 0;
      if (t === 0x00280301) burned = str(e, d.charset).toUpperCase();
      if (isPrivate(t)) { note(e, 'removed (private)', ''); continue; }
      if (isOverlayOrCurve(t)) { note(e, 'removed', ''); continue; }
      if (meta && t === 0x00020012) { out.push({ tag: t, vr: 'UI', value: textValue(IMPL_UID, 'UI') }); continue; }
      if (meta && t === 0x00020013) { out.push({ tag: t, vr: 'SH', value: textValue(IMPL_NAME, 'SH') }); continue; }
      if (top && t === 0x00100010) { const v = setText(e, opt.name); note(e, 'replaced', opt.name); out.push(v); continue; }
      if (top && t === 0x00100020) { const v = setText(e, opt.id); note(e, 'replaced', opt.id); out.push(v); continue; }
      const r = RULE_BY_TAG.get(t);
      if (r && !(r.when === 'patient' && opt.keepPatient) && !(r.when === 'desc' && opt.keepDescriptions)) {
        if (r.act === X) { note(e, 'removed', ''); continue; }
        if (e.value.length || e.items) note(e, 'blanked', '');
        out.push(e.items ? { tag: t, vr: 'SQ', value: new Uint8Array(0), items: [] } : { tag: t, vr: e.vr, value: new Uint8Array(0) });
        continue;
      }
      if (e.items) { out.push({ ...e, items: e.items.map((it) => clean(it, false, false)) }); continue; }
      if (e.vr === 'PN') { if (e.value.length) note(e, 'blanked', ''); out.push({ tag: t, vr: 'PN', value: new Uint8Array(0) }); continue; }
      if (e.vr === 'UI') {
        const parts = str(e, 'latin1').split('\\'), next = parts.map(mapUid).join('\\');
        if (next !== parts.join('\\')) { const v = setText(e, next); note(e, 'new UID', next); out.push(v); } else out.push(e);
        continue;
      }
      if (e.vr === 'DA' || e.vr === 'DT') {
        const s = str(e, 'latin1');
        if (!s || opt.dates === 'keep') { out.push(e); continue; }
        if (opt.dates === 'blank') { note(e, 'blanked', ''); out.push({ tag: t, vr: e.vr, value: new Uint8Array(0) }); continue; }
        const v = s.split('\\').map((x) => (e.vr === 'DA' ? shiftDate(x, days) : shiftDT(x, days))).join('\\');
        note(e, v.replace(/\\/g, '') ? `shifted ${days} days` : 'blanked', v); out.push(setText(e, v)); continue;
      }
      if (e.vr === 'TM' && opt.dates === 'blank' && e.value.length) { note(e, 'blanked', ''); out.push({ tag: t, vr: 'TM', value: new Uint8Array(0) }); continue; }
      out.push(e);
    }
    return out;
  };
  const meta = clean(d.meta, false, true);
  const elements = clean(d.elements, true, false).filter((e) => ![0x00120062, 0x00120063, 0x00280303].includes(e.tag));
  const method = `fibub basic profile${opt.dates === 'shift' ? `, dates shifted ${days} days` : opt.dates === 'blank' ? ', dates removed' : ''}`.slice(0, 64);
  const add: Element[] = [
    { tag: 0x00120062, vr: 'CS', value: textValue('YES', 'CS') },
    { tag: 0x00120063, vr: 'LO', value: textValue(method, 'LO') },
    { tag: 0x00280303, vr: 'CS', value: textValue(opt.dates === 'shift' ? 'MODIFIED' : opt.dates === 'blank' ? 'REMOVED' : 'UNMODIFIED', 'CS') },
  ];
  for (const e of add) changes.push({ tag: tagStr(e.tag), name: name(e.tag), action: 'added', before: '', after: str(e) });
  elements.push(...add);
  elements.sort((a, b) => a.tag - b.tag);
  return { out: { ...d, meta, elements }, changes, burned };
}
