// Read Gaussian (.log/.out) and ORCA (.out) output files: energies at every geometry, optimisation convergence,
// orbital energies (HOMO, LUMO), dipole moment, vibrational frequencies with IR intensities, thermochemistry and the
// final geometry; plus a Lorentzian-broadened IR spectrum, XYZ and CSV text. Pure functions, no DOM.
import { ELEMENTS, BY_SYMBOL } from './chem.ts';

export const EH_EV = 27.211386245988;       // CODATA 2018
export const EH_KJ = 2625.4996394799;        // kJ/mol
export const EH_KCAL = 627.5094740631;       // kcal/mol
export const AU_DEBYE = 2.541746473;          // 1 e·a0 in debye

export type Atom = { z: number; x: number; y: number; zc: number };
export type ConvItem = { name: string; value: number; threshold: number; ok: boolean };
export type Freq = { freq: number; ir: number | null; mode: number };
export type Orbitals = { alpha: number[]; nAlpha: number; beta?: number[]; nBeta?: number };
export type Thermo = { zpe?: number; eth?: number; h?: number; g?: number; eel?: number; temperature?: number };
export type QcResult = {
  program: 'Gaussian' | 'ORCA'; version: string; route: string; method: string;
  charge: number | null; mult: number | null;
  energies: number[];           // Eh, the energy at each geometry (Gaussian SCF Done; ORCA FINAL SINGLE POINT ENERGY)
  geometries: Atom[][];
  steps: ConvItem[][];          // optimisation convergence tables, one per step
  optimisation: boolean; converged: boolean | null;
  normal: boolean;
  orbitals: Orbitals | null;
  dipole: { x: number; y: number; z: number; total: number } | null;   // debye
  freqs: Freq[]; irNote: string;
  thermo: Thermo;
  notes: string[];
};

export class QcError extends Error {}

const num = (s: string) => Number(s.replace(/D/i, 'E'));
const FLOAT = /-?\d+\.\d+(?:[DE][+-]?\d+)?/g;

/** Which program wrote the text, or null. */
export function detect(text: string): 'Gaussian' | 'ORCA' | null {
  const head = text.slice(0, 200000);
  if (/\*\s*O\s+R\s+C\s+A\s*\*/.test(head) || /Program Version \d/.test(head) && /ORCA/.test(head)) return 'ORCA';
  if (/Gaussian, Inc\.|Entering Gaussian System|^ SCF Done:/m.test(head)) return 'Gaussian';
  return null;
}

export function parseOutput(text: string): QcResult {
  const prog = detect(text);
  if (!prog) throw new QcError('This does not look like a Gaussian or ORCA output file. Open the .log or .out file the program wrote (not the input file).');
  return prog === 'Gaussian' ? parseGaussian(text) : parseOrca(text);
}

const empty = (program: 'Gaussian' | 'ORCA'): QcResult => ({ program, version: '', route: '', method: '', charge: null, mult: null, energies: [], geometries: [], steps: [], optimisation: false, converged: null, normal: false, orbitals: null, dipole: null, freqs: [], irNote: '', thermo: {}, notes: [] });

export function parseGaussian(text: string): QcResult {
  const r = empty('Gaussian');
  const L = text.split(/\r?\n/);
  const hasStd = text.includes('Standard orientation:');
  let alpha: number[] = [], beta: number[] = [], nA = 0, nB = 0, inEig = false;
  let fr: number[] = [], ir: (number | null)[] = [];
  for (let i = 0; i < L.length; i++) {
    const l = L[i];
    let m: RegExpExecArray | null;
    const eig = /^ (Alpha|Beta)\s+(occ\.|virt\.) eigenvalues --(.*)$/.exec(l);
    if (inEig && !eig) { inEig = false; r.orbitals = beta.length ? { alpha, nAlpha: nA, beta, nBeta: nB } : { alpha, nAlpha: nA }; }
    if (!r.version && (m = /^ Gaussian (\d+):\s+(\S+)/.exec(l))) r.version = `${m[1]} (${m[2]})`;
    if (!r.route && /^ #/.test(l)) { r.route = l.trim(); for (let k = i + 1; k < L.length && !/^ -{5,}/.test(L[k]); k++) r.route += ' ' + L[k].trim(); }
    if (r.charge === null && (m = /^ Charge\s*=\s*(-?\d+)\s+Multiplicity\s*=\s*(\d+)/.exec(l))) { r.charge = Number(m[1]); r.mult = Number(m[2]); }
    if (l.trim() === (hasStd ? 'Standard orientation:' : 'Input orientation:')) {
      const atoms: Atom[] = [];
      let k = i + 5;
      for (; k < L.length && !/^ -{10,}/.test(L[k]); k++) {
        const t = L[k].trim().split(/\s+/);
        if (t.length < 5) break;
        const n = t.length;
        atoms.push({ z: Number(t[1]), x: Number(t[n - 3]), y: Number(t[n - 2]), zc: Number(t[n - 1]) });
      }
      if (atoms.length) r.geometries.push(atoms);
      i = k; continue;
    }
    if ((m = /^ SCF Done:\s+E\(([^)]+)\)\s*=\s*(-?\d+\.\d+)/.exec(l))) { r.energies.push(Number(m[2])); r.method = m[1]; continue; }
    if (/^\s+Item\s+Value\s+Threshold\s+Converged\?/.test(l)) {
      const items: ConvItem[] = [];
      for (let k = i + 1; k < L.length && k <= i + 4; k++) {
        const mm = /^ (.+?)\s+(-?\d*\.\d+)\s+(\d*\.\d+)\s+(YES|NO)\s*$/.exec(L[k]);
        if (!mm) break;
        items.push({ name: mm[1].replace(/\s+/g, ' '), value: Number(mm[2]), threshold: Number(mm[3]), ok: mm[4] === 'YES' });
      }
      r.steps.push(items); r.optimisation = true; continue;
    }
    if (/^ Optimization completed/.test(l)) { r.converged = true; continue; }
    if (/^ Optimization stopped/.test(l)) { r.converged = false; continue; }
    if ((m = eig)) {
      if (!inEig) { alpha = []; beta = []; nA = 0; nB = 0; inEig = true; }
      // Fixed 10-character fields that can run together ("-100.12345-10.23456"), so read numbers by pattern.
      const v = (m[3].match(FLOAT) ?? []).map(num);
      if (m[1] === 'Alpha') { alpha.push(...v); if (m[2] === 'occ.') nA += v.length; }
      else { beta.push(...v); if (m[2] === 'occ.') nB += v.length; }
      continue;
    }
    if (/^ Dipole moment \(field-independent basis, Debye\):/.test(l) && (m = /X=\s*(\S+)\s+Y=\s*(\S+)\s+Z=\s*(\S+)\s+Tot=\s*(\S+)/.exec(L[i + 1] ?? ''))) {
      r.dipole = { x: Number(m[1]), y: Number(m[2]), z: Number(m[3]), total: Number(m[4]) }; continue;
    }
    if (/^ Harmonic frequencies \(cm\*\*-1\)/.test(l)) { fr = []; ir = []; continue; }
    if ((m = /^ Frequencies --\s(.*)$/.exec(l))) { fr.push(...(m[1].match(FLOAT) ?? []).map(num)); continue; }
    if ((m = /^ IR Inten\s+--\s(.*)$/.exec(l))) { ir.push(...m[1].trim().split(/\s+/).map((s) => (/^-?\d/.test(s) ? Number(s) : null))); continue; }
    if ((m = /^ Zero-point correction=\s*(-?\d+\.\d+)/.exec(l))) { r.thermo.zpe = Number(m[1]); continue; }
    if ((m = /^ Sum of electronic and thermal Energies=\s*(-?\d+\.\d+)/.exec(l))) { r.thermo.eth = Number(m[1]); continue; }
    if ((m = /^ Sum of electronic and thermal Enthalpies=\s*(-?\d+\.\d+)/.exec(l))) { r.thermo.h = Number(m[1]); continue; }
    if ((m = /^ Sum of electronic and thermal Free Energies=\s*(-?\d+\.\d+)/.exec(l))) { r.thermo.g = Number(m[1]); continue; }
    if ((m = /^ Temperature\s+(\d+\.\d+) Kelvin/.exec(l))) { r.thermo.temperature = Number(m[1]); continue; }
    if (/^ Normal termination of Gaussian/.test(l)) { r.normal = true; continue; }
    if (/^ Error termination/.test(l)) { r.normal = false; r.notes.push('The job ended with an error termination.'); continue; }
  }
  if (inEig) r.orbitals = beta.length ? { alpha, nAlpha: nA, beta, nBeta: nB } : { alpha, nAlpha: nA };
  r.freqs = fr.map((f, k) => ({ freq: f, ir: ir[k] ?? null, mode: k + 1 }));
  r.irNote = fr.length ? 'IR intensities in km/mol, as printed by Gaussian.' : '';
  if (r.thermo.zpe !== undefined && r.energies.length) r.thermo.eel = r.energies[r.energies.length - 1];
  if (r.optimisation && r.converged === null) r.converged = false;
  return finish(r);
}

export function parseOrca(text: string): QcResult {
  const r = empty('ORCA');
  const L = text.split(/\r?\n/);
  const freqByMode = new Map<number, number>(), irByMode = new Map<number, number>();
  let irHeader = '';
  for (let i = 0; i < L.length; i++) {
    const l = L[i];
    let m: RegExpExecArray | null;
    if (!r.version && (m = /Program Version (\S+)/.exec(l))) r.version = m[1];
    if ((m = /^\|\s*\d+>\s*!\s*(.*)$/.exec(l))) { r.route = (r.route ? r.route + ' ' : '! ') + m[1].trim(); continue; }
    if (r.charge === null && (m = /^\|\s*\d+>\s*\*\s*xyz(?:file)?\s+(-?\d+)\s+(\d+)/i.exec(l))) { r.charge = Number(m[1]); r.mult = Number(m[2]); continue; }
    if ((m = /^\s*Total Charge\s+Charge\s+\.\.\.\.\s+(-?\d+)/.exec(l))) { r.charge = Number(m[1]); continue; }
    if ((m = /^\s*Multiplicity\s+Mult\s+\.\.\.\.\s+(\d+)/.exec(l))) { r.mult = Number(m[1]); continue; }
    if (l.startsWith('CARTESIAN COORDINATES (ANGSTROEM)')) {
      const atoms: Atom[] = [];
      let k = i + 2;
      for (; k < L.length && L[k].trim(); k++) {
        const t = L[k].trim().split(/\s+/);
        if (t.length < 4) break;
        const sym = t[0].replace(/[^A-Za-z]/g, '');
        const el = BY_SYMBOL.get(sym[0].toUpperCase() + sym.slice(1).toLowerCase());
        if (!el || t[0].endsWith('>')) continue; // ghost or point-charge centres
        atoms.push({ z: el.z, x: Number(t[1]), y: Number(t[2]), zc: Number(t[3]) });
      }
      if (atoms.length) r.geometries.push(atoms);
      i = k; continue;
    }
    if ((m = /^FINAL SINGLE POINT ENERGY\s+(-?\d+\.\d+)/.exec(l))) { r.energies.push(Number(m[1])); continue; }
    if (/\|Geometry convergence\|/.test(l)) {
      const items: ConvItem[] = [];
      for (let k = i + 3; k < L.length; k++) {
        const mm = /^\s+([A-Za-z][A-Za-z ()]*?)\s+(-?\d*\.\d+(?:[eE][+-]?\d+)?)\s+(\d*\.\d+(?:[eE][+-]?\d+)?)\s+(YES|NO)\s*$/.exec(L[k]);
        if (!mm) break;
        items.push({ name: mm[1], value: Number(mm[2]), threshold: Number(mm[3]), ok: mm[4] === 'YES' });
      }
      r.steps.push(items); r.optimisation = true; continue;
    }
    if (/THE OPTIMIZATION HAS CONVERGED/.test(l)) { r.converged = true; continue; }
    if (/The optimization did not converge/.test(l)) { r.converged = false; continue; }
    if (l.startsWith('ORBITAL ENERGIES')) {
      const read = (from: number) => {
        const e: number[] = []; let occ = 0, k = from;
        while (k < L.length && !/^\s*NO\s+OCC/.test(L[k])) k++;
        for (k++; k < L.length; k++) {
          const mm = /^\s*(\d+)\s+(\d+\.\d+)\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)/.exec(L[k]);
          if (!mm) break;
          e.push(Number(mm[3])); if (Number(mm[2]) > 0) occ = Number(mm[1]) + 1;
        }
        return { e, occ, end: k };
      };
      const a = read(i + 1);
      let k = a.end;
      while (k < L.length && !L[k].trim()) k++;
      if (/SPIN DOWN ORBITALS/.test(L[k] ?? '')) { const b = read(k + 1); r.orbitals = { alpha: a.e, nAlpha: a.occ, beta: b.e, nBeta: b.occ }; i = b.end; }
      else { r.orbitals = { alpha: a.e, nAlpha: a.occ }; i = a.end; }
      continue;
    }
    if ((m = /^Total Dipole Moment\s*:\s*(\S+)\s+(\S+)\s+(\S+)/.exec(l))) {
      const [x, y, z] = [m[1], m[2], m[3]].map((s) => Number(s) * AU_DEBYE);
      r.dipole = { x, y, z, total: Math.hypot(x, y, z) }; continue;
    }
    if ((m = /^Magnitude \(Debye\)\s*:\s*(\S+)/.exec(l)) && r.dipole) { r.dipole.total = Number(m[1]); continue; }
    if (l.startsWith('VIBRATIONAL FREQUENCIES')) {
      freqByMode.clear(); irByMode.clear();
      for (let k = i + 1; k < L.length; k++) {
        const mm = /^\s*(\d+):\s+(-?\d+\.\d+)\s+cm\*\*-1/.exec(L[k]);
        if (mm) freqByMode.set(Number(mm[1]), Number(mm[2]));
        else if (freqByMode.size && !L[k].trim()) { i = k; break; }
      }
      continue;
    }
    if (l.startsWith('IR SPECTRUM')) {
      for (let k = i + 1; k < L.length; k++) {
        if (/Mode\s+freq/.test(L[k])) irHeader = L[k];
        const mm = /^\s*(\d+):\s+(-?\d+\.\d+)\s+(\S+)\s+(\S+)/.exec(L[k]);
        if (mm) irByMode.set(Number(mm[1]), Number(/Int/.test(irHeader) ? mm[4] : mm[3]));
        else if (irByMode.size && !L[k].trim()) { i = k; break; }
      }
      continue;
    }
    if ((m = /^Electronic energy\s+\.\.\.\s+(-?\d+\.\d+) Eh/.exec(l))) { r.thermo.eel = Number(m[1]); continue; }
    if ((m = /^Zero point energy\s+\.\.\.\s+(-?\d+\.\d+) Eh/.exec(l))) { r.thermo.zpe = Number(m[1]); continue; }
    if ((m = /^Total thermal energy\s+(-?\d+\.\d+) Eh/.exec(l))) { r.thermo.eth = Number(m[1]); continue; }
    if ((m = /^Total Enthalpy\s+\.\.\.\s+(-?\d+\.\d+) Eh/.exec(l))) { r.thermo.h = Number(m[1]); continue; }
    if ((m = /^Final Gibbs free (?:energy|enthalpy)\s+\.\.\.\s+(-?\d+\.\d+) Eh/.exec(l))) { r.thermo.g = Number(m[1]); continue; }
    if ((m = /^Temperature\s+\.\.\.\s+(\d+\.\d+) K/.exec(l))) { r.thermo.temperature = Number(m[1]); continue; }
    if (/ORCA TERMINATED NORMALLY/.test(l)) { r.normal = true; continue; }
  }
  // Leave out the zero modes (translations and rotations), as ORCA prints them as 0.00.
  r.freqs = [...freqByMode].filter(([, f]) => f !== 0).map(([mode, f]) => ({ freq: f, ir: irByMode.get(mode) ?? (irByMode.size ? 0 : null), mode }));
  r.irNote = !r.freqs.length ? '' : /Int/.test(irHeader) ? 'IR intensities in km/mol (the "Int" column of ORCA 5 and later).' : irByMode.size ? 'ORCA 4 prints T² rather than km/mol; the T² column is shown as the intensity, which keeps the relative heights.' : 'No IR intensities in the file.';
  if (r.optimisation && r.converged === null) r.converged = false;
  return finish(r);
}

function finish(r: QcResult): QcResult {
  if (!r.energies.length && !r.geometries.length) throw new QcError(`This ${r.program} file has no energies or geometries yet. Is it complete, or did the job stop at the start?`);
  if (!r.normal && !r.notes.length) r.notes.push(`No "normal termination" line: the job may still be running, or it stopped early.`);
  return r;
}

/** HOMO, LUMO (Eh) and gap; for open shells the highest occupied and lowest empty of either spin. */
export function frontier(o: Orbitals | null): { homo: number; lumo: number; gapEV: number; homoIndex: number } | null {
  if (!o || !o.alpha.length || !o.nAlpha) return null;
  let homo = o.alpha[o.nAlpha - 1], lumo = o.alpha[o.nAlpha] ?? NaN;
  if (o.beta && o.nBeta) { homo = Math.max(homo, o.beta[o.nBeta - 1]); const lb = o.beta[o.nBeta] ?? NaN; lumo = Number.isFinite(lumo) ? Math.min(lumo, Number.isFinite(lb) ? lb : lumo) : lb; }
  return { homo, lumo, gapEV: (lumo - homo) * EH_EV, homoIndex: o.nAlpha };
}

/** IR spectrum: each band a Lorentzian of the given full width at half maximum (cm⁻¹) whose area is its intensity
 *  (km/mol), at the frequency times the scale factor. Imaginary modes are left out. y is in km/mol per cm⁻¹. */
export function irSpectrum(freqs: Freq[], opts: { fwhm: number; scale: number; from: number; to: number; step: number }): { x: number[]; y: number[] } {
  const g = opts.fwhm / 2, x: number[] = [], y: number[] = [];
  const bands = freqs.filter((f) => f.freq > 0 && f.ir !== null && f.ir > 0);
  for (let v = opts.from; v <= opts.to + 1e-9; v += opts.step) {
    let s = 0;
    for (const b of bands) { const d = v - b.freq * opts.scale; s += (b.ir! * g / Math.PI) / (d * d + g * g); }
    x.push(+v.toFixed(6)); y.push(s);
  }
  return { x, y };
}

/** XYZ text of a geometry. */
export function toXyz(atoms: Atom[], comment = ''): string {
  return `${atoms.length}\n${comment.replace(/\n/g, ' ')}\n` + atoms.map((a) => `${(ELEMENTS[a.z - 1]?.symbol ?? 'X').padEnd(2)} ${a.x.toFixed(6).padStart(12)} ${a.y.toFixed(6).padStart(12)} ${a.zc.toFixed(6).padStart(12)}`).join('\n') + '\n';
}

/** Hill-order formula of a geometry. */
export function formulaOf(atoms: Atom[]): string {
  const c = new Map<string, number>();
  for (const a of atoms) { const s = ELEMENTS[a.z - 1]?.symbol ?? 'X'; c.set(s, (c.get(s) ?? 0) + 1); }
  const keys = [...c.keys()].sort((a, b) => (c.has('C') ? (a === 'C' ? -1 : b === 'C' ? 1 : a === 'H' ? -1 : b === 'H' ? 1 : 0) : 0) || (a < b ? -1 : a > b ? 1 : 0));
  return keys.map((k) => k + (c.get(k)! > 1 ? c.get(k) : '')).join('');
}
