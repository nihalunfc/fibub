// A made-up CT-like phantom series for the DICOM tools' sample (synthetic: not a real patient or scan). Values are
// round, illustrative Hounsfield units: air -1000, lung -800, fat -90, soft tissue 40, contrast vessel 180, bone 650.
import { makeElement as E, write, TS, type Dicom } from './dicom.ts';

/** A tiny seeded random number generator, so the sample is the same every time. */
function rng(seed: number) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }

/** The value at (x, y, z) of the phantom, x and y from -1 to 1 across the slice, z from 0 (feet) to 1 (head). */
export function phantom(x: number, y: number, z: number): number {
  const inE = (cx: number, cy: number, rx: number, ry: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  if (!inE(0, 0, 0.86, 0.62)) return -1000;
  if (!inE(0, 0, 0.8, 0.56)) return -90;
  if (inE(0, 0.36, 0.1, 0.1)) return 650; // spine
  if (inE(0.1, 0.12, 0.06, 0.06)) return 180; // vessel
  const lr = 0.24 + 0.08 * Math.sin(Math.PI * z); // lungs grow then shrink along the stack
  if (z > 0.3 && (inE(-0.38, -0.02, lr, 0.36) || inE(0.38, -0.02, lr, 0.36))) return -800;
  if (z <= 0.3 && inE(-0.3, -0.05, 0.36, 0.3)) return 60; // a liver-like organ low down
  return 40;
}

/** The sample series as DICOM files (explicit VR little endian, stored = HU + 1024, intercept -1024). */
export function sampleSeries(n = 24, size = 128, spacing = 2.5, gap = 5): Uint8Array[] {
  const r = rng(482), out: Uint8Array[] = [];
  const root = '2.25.290510347820916402364802451932281', study = `${root}.1`, series = `${root}.2`, frame = `${root}.3`;
  for (let k = 0; k < n; k++) {
    const px = new Uint16Array(size * size), z = k / (n - 1);
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
      const v = phantom((2 * i + 1) / size - 1, (2 * j + 1) / size - 1, z);
      px[j * size + i] = Math.max(0, Math.round(v + 1024 + (v > -1000 ? (r() + r() + r() - 1.5) * 16 : 0)));
    }
    const half = (size * spacing) / 2;
    const els = [
      E(0x00080016, 'UI', '1.2.840.10008.5.1.4.1.1.2'), E(0x00080018, 'UI', `${root}.4.${k + 1}`), E(0x00080020, 'DA', '20240101'),
      E(0x00080060, 'CS', 'CT'), E(0x00080070, 'LO', 'fibub synthetic phantom'), E(0x00081030, 'LO', 'Sample phantom (synthetic, not a patient)'),
      E(0x0008103e, 'LO', 'Made-up CT-like stack'), E(0x00100010, 'PN', 'Sample^Phantom'), E(0x00100020, 'LO', 'SAMPLE-0001'),
      E(0x00100030, 'DA', '20000101'), E(0x00100040, 'CS', 'O'), E(0x00180050, 'DS', String(gap)),
      E(0x0020000d, 'UI', study), E(0x0020000e, 'UI', series), E(0x00200013, 'IS', String(k + 1)),
      E(0x00200032, 'DS', `${-half}\\${-half}\\${(k * gap).toFixed(1)}`), E(0x00200037, 'DS', '1\\0\\0\\0\\1\\0'), E(0x00200052, 'UI', frame),
      E(0x00201041, 'DS', (k * gap).toFixed(1)), E(0x00280002, 'US', [1]), E(0x00280004, 'CS', 'MONOCHROME2'),
      E(0x00280010, 'US', [size]), E(0x00280011, 'US', [size]), E(0x00280030, 'DS', `${spacing}\\${spacing}`),
      E(0x00280100, 'US', [16]), E(0x00280101, 'US', [16]), E(0x00280102, 'US', [15]), E(0x00280103, 'US', [0]),
      E(0x00281050, 'DS', '40\\-600'), E(0x00281051, 'DS', '400\\1500'), E(0x00281052, 'DS', '-1024'), E(0x00281053, 'DS', '1'),
      E(0x00281054, 'LO', 'HU'), E(0x00281055, 'LO', 'SOFT TISSUE\\LUNG'),
      E(0x7fe00010, 'OW', new Uint8Array(px.buffer)),
    ];
    const d: Dicom = { meta: [], elements: els, ts: TS.explicitLE, explicit: true, little: true, deflated: false, preamble: true, charset: 'latin1', warnings: [] };
    out.push(write(d));
  }
  return out;
}
