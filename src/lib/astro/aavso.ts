// Variable star observations in the AAVSO formats: Visual File Format and Extended File Format (CCD/DSLR/PEP),
// with Julian Date conversion. Spec: aavso.org/aavso-visual-file-format and aavso.org/aavso-extended-file-format.

export const jd = (ms: number) => ms / 86400000 + 2440587.5;
export const msFromJd = (j: number) => (j - 2440587.5) * 86400000;

export type Obs = {
  name: string; jd: number; mag: number; fainter: boolean; // fainter = "fainter than" (not seen)
  err?: number; filter: string; // Vis., V, B, TG, ...
  comp1?: string; comp2?: string; chart?: string; comment?: string; notes?: string;
  cmag?: number; kname?: string; kmag?: number; airmass?: number; trans?: boolean; mtype?: 'ABS' | 'DIF';
};

export const FILTERS = ['Vis.', 'V', 'B', 'R', 'I', 'TG', 'TB', 'TR', 'CV', 'CR', 'SG', 'SR', 'SI'];
/** Visual comment codes (one letter each), from the AAVSO Visual File Format. */
export const COMMENT_CODES: [string, string][] = [
  ['B', 'Sky bright: moon, twilight, light pollution, aurora'], ['U', 'Clouds, dust, smoke, haze'], ['W', 'Poor seeing'],
  ['L', 'Low in the sky, near the horizon, in trees'], ['D', 'Unusual activity (fading, flare, odd behaviour)'], ['Y', 'Outburst'],
  ['K', 'Non-AAVSO chart'], ['S', 'Comparison sequence problem'], ['Z', 'Magnitude of questionable accuracy'], ['I', 'Identification of star uncertain'],
  ['V', 'Faint star, near the observing limit'],
];

const clean = (s: string | undefined) => (s ?? '').replace(/[,\r\n]/g, ' ').trim();
const na = (s: string | undefined) => (clean(s) || 'na');

/** The AAVSO Visual File Format text for visual estimates. */
export function toVisual(obs: Obs[], obscode: string, software = 'fibub.com variable star log') {
  const head = [`#TYPE=VISUAL`, `#OBSCODE=${clean(obscode).toUpperCase() || 'XXXX'}`, `#SOFTWARE=${software}`, `#DELIM=,`, `#DATE=JD`, `#OBSTYPE=Visual`];
  const rows = obs.filter((o) => o.filter === 'Vis.').sort((a, b) => a.jd - b.jd).map((o) => [clean(o.name).toUpperCase(), o.jd.toFixed(4), `${o.fainter ? '<' : ''}${o.mag.toFixed(1)}`, na(o.comment), na(o.comp1), na(o.comp2), na(o.chart), na(o.notes)].join(','));
  return head.concat(rows).join('\n') + '\n';
}

/** The AAVSO Extended File Format text for instrumental (CCD, DSLR, PEP) measurements. */
export function toExtended(obs: Obs[], obscode: string, obstype: 'CCD' | 'DSLR' | 'PEP' = 'DSLR', software = 'fibub.com variable star log') {
  const head = [`#TYPE=EXTENDED`, `#OBSCODE=${clean(obscode).toUpperCase() || 'XXXX'}`, `#SOFTWARE=${software}`, `#DELIM=,`, `#DATE=JD`, `#OBSTYPE=${obstype}`, `#NAME,DATE,MAG,MERR,FILT,TRANS,MTYPE,CNAME,CMAG,KNAME,KMAG,AMASS,GROUP,CHART,NOTES`];
  const n = (x: number | undefined, d: number) => (x === undefined || !Number.isFinite(x) ? 'na' : x.toFixed(d));
  const rows = obs.filter((o) => o.filter !== 'Vis.').sort((a, b) => a.jd - b.jd).map((o) => [clean(o.name).toUpperCase(), o.jd.toFixed(5), `${o.fainter ? '<' : ''}${o.mag.toFixed(3)}`, n(o.err, 3), o.filter, o.trans ? 'YES' : 'NO', o.mtype ?? 'ABS', na(o.comp1), n(o.cmag, 3), na(o.kname), n(o.kmag, 3), n(o.airmass, 3), 'na', na(o.chart), na(o.notes)].join(','));
  return head.concat(rows).join('\n') + '\n';
}

/** Read an AAVSO Visual or Extended file (or a plain CSV with name, JD, magnitude columns) back into observations. */
export function parseAavso(text: string): { obs: Obs[]; obscode: string; skipped: number } {
  let delim = ',', type = '', obscode = '', skipped = 0;
  const obs: Obs[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(); if (!line) continue;
    if (line.startsWith('#')) {
      const m = /^#\s*([A-Z]+)\s*=\s*(.*)$/i.exec(line);
      if (m) { const k = m[1].toUpperCase(), v = m[2].trim(); if (k === 'DELIM') delim = v.toLowerCase() === 'tab' ? '\t' : v.toLowerCase() === 'comma' ? ',' : v || ','; if (k === 'TYPE') type = v.toUpperCase(); if (k === 'OBSCODE') obscode = v; }
      continue;
    }
    const f = line.split(delim).map((s) => s.trim());
    if (/^name$/i.test(f[0])) continue;
    const date = Number(f[1]), magS = f[2] ?? '', fainter = magS.startsWith('<'), mag = Number(magS.replace(/^</, ''));
    if (!f[0] || !Number.isFinite(date) || !Number.isFinite(mag)) { skipped++; continue; }
    const v = (s: string | undefined) => (s && s.toLowerCase() !== 'na' ? s : undefined), num = (s: string | undefined) => (v(s) === undefined ? undefined : Number(s));
    const j = date < 100000 ? date + 2400000 : date; // allow reduced JD
    if (type === 'EXTENDED' || (f.length >= 15 && !type)) obs.push({ name: f[0], jd: j, mag, fainter, err: num(f[3]), filter: f[4] || 'V', trans: f[5]?.toUpperCase() === 'YES', mtype: f[6]?.toUpperCase() === 'DIF' ? 'DIF' : 'ABS', comp1: v(f[7]), cmag: num(f[8]), kname: v(f[9]), kmag: num(f[10]), airmass: num(f[11]), chart: v(f[13]), notes: v(f[14]) });
    else obs.push({ name: f[0], jd: j, mag, fainter, filter: 'Vis.', comment: v(f[3]), comp1: v(f[4]), comp2: v(f[5]), chart: v(f[6]), notes: v(f.slice(7).join(' ')) });
  }
  return { obs, obscode, skipped };
}

/** Visual estimate by Argelander's step method between two comparison stars: V = C1 + (C2 − C1) × a / (a + b),
 *  where the variable is a steps fainter than C1 and b steps brighter than C2. */
export const fractionEstimate = (c1: number, c2: number, a: number, b: number) => c1 + ((c2 - c1) * a) / (a + b || 1);

/** Differential instrumental photometry: V = Ccat + (v − c), with instrumental magnitudes from fluxes. */
export const differential = (fluxVar: number, fluxComp: number, compMag: number) => compMag - 2.5 * Math.log10(fluxVar / fluxComp);
