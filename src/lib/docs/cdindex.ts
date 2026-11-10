// Hospital CD viewer: read the headers of many DICOM files and group them into studies and series.
// Uses the DICOM reader in src/lib/sci/dicom.ts (the same one the DICOM viewer uses). Plain TypeScript, no page code.
import * as D from '../sci/dicom';

export type Inst = {
  file: File; name: string; study: string; series: string; date: string; studyDesc: string; seriesDesc: string; modality: string;
  body: string; seriesNo: number; instNo: number; patient: string; info: D.ImageInfo;
};
export type Series = { uid: string; desc: string; no: number; modality: string; body: string; insts: Inst[] };
export type Study = { uid: string; date: string; desc: string; patient: string; series: Series[]; modalities: string[]; bodies: string[] };

/** True when the first bytes say "DICM" at offset 128 (the standard DICOM file mark). */
export async function looksDicom(f: File): Promise<boolean> {
  if (f.size < 140) return false;
  const b = new Uint8Array(await f.slice(128, 132).arrayBuffer());
  return String.fromCharCode(...b) === 'DICM';
}

/** Read one file: the index entry, or null when it is not a DICOM image file (DICOMDIR, programs, text and so on). */
export async function readInst(f: File): Promise<Inst | null> {
  if (/^dicomdir$/i.test(f.name) || !(await looksDicom(f))) return null;
  try {
    const d = D.parse(new Uint8Array(await f.arrayBuffer())), g = D.getter(d), info = D.imageInfo(d);
    if (g.s(0x00080016) === '1.2.840.10008.1.3.10') return null; // the DICOMDIR itself
    return {
      file: f, name: f.name, study: g.s(0x0020000d) || 'unknown-study', series: g.s(0x0020000e) || 'unknown-series', date: g.s(0x00080020),
      studyDesc: g.s(0x00081030), seriesDesc: g.s(0x0008103e), modality: g.s(0x00080060), body: g.s(0x00180015), seriesNo: g.n1(0x00200011) ?? 0,
      instNo: g.n1(0x00200013) ?? 0, patient: g.s(0x00100010).replace(/\^+/g, ' ').trim(), info,
    };
  } catch { return null; }
}

/** Group instances into studies (newest date first) and series (by series number). */
export function group(list: Inst[]): Study[] {
  const studies = new Map<string, Study>();
  for (const i of list) {
    let s = studies.get(i.study);
    if (!s) studies.set(i.study, (s = { uid: i.study, date: i.date, desc: i.studyDesc, patient: i.patient, series: [], modalities: [], bodies: [] }));
    if (!s.date) s.date = i.date; if (!s.desc) s.desc = i.studyDesc; if (!s.patient) s.patient = i.patient;
    let r = s.series.find((x) => x.uid === i.series);
    if (!r) s.series.push((r = { uid: i.series, desc: i.seriesDesc, no: i.seriesNo, modality: i.modality, body: i.body, insts: [] }));
    r.insts.push(i);
  }
  for (const s of studies.values()) {
    s.series.sort((a, b) => a.no - b.no);
    for (const r of s.series) {
      const order = r.insts.length > 1 ? D.sortSlices(r.insts.map((i) => i.info)).order : [0];
      r.insts = order.map((k) => r.insts[k]);
      if (r.modality && !s.modalities.includes(r.modality)) s.modalities.push(r.modality);
      if (r.body && !s.bodies.includes(r.body)) s.bodies.push(r.body);
    }
  }
  return [...studies.values()].sort((a, b) => b.date.localeCompare(a.date));
}

/** 20240315 as 15 March 2024. */
export function niceDate(da: string): string {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(da.trim());
  return m ? new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : da || 'No date';
}
