// Spectral line identification: a list of common lines (stars, nebulae, galaxies, quasars, lamps, light
// pollution and the atmosphere), matching measured wavelengths, and finding a redshift from several lines.

export type LineSet = 'stellar' | 'nebular' | 'quasar' | 'lamp' | 'pollution' | 'telluric';
/** Rest wavelengths in ångströms: in air above 2000 Å, in vacuum below (the usual convention). */
export type SpecLine = { name: string; aa: number; set: LineSet; strong?: boolean; to?: number };
// `to` marks a band: absorption from the head at `aa` to `to`. Anything measured inside the band matches it.

// NIST Atomic Spectra Database values (rounded to 0.01 Å); molecular bands give the band head.
export const SPEC_LINES: SpecLine[] = [
  // Hydrogen
  { name: 'Lyman β', aa: 1025.72, set: 'quasar' }, { name: 'Lyman α', aa: 1215.67, set: 'quasar', strong: true },
  { name: 'Hα', aa: 6562.8, set: 'stellar', strong: true }, { name: 'Hβ', aa: 4861.33, set: 'stellar', strong: true },
  { name: 'Hγ', aa: 4340.47, set: 'stellar', strong: true }, { name: 'Hδ', aa: 4101.74, set: 'stellar' },
  { name: 'Hε', aa: 3970.07, set: 'stellar' }, { name: 'H8', aa: 3889.05, set: 'stellar' }, { name: 'H9', aa: 3835.38, set: 'stellar' },
  { name: 'Paschen δ', aa: 10049.37, set: 'stellar' }, { name: 'Paschen γ', aa: 10938.09, set: 'stellar' },
  { name: 'Paschen β', aa: 12818.08, set: 'stellar' }, { name: 'Paschen α', aa: 18751.01, set: 'stellar' }, { name: 'Brackett γ', aa: 21655.29, set: 'stellar' },
  // Helium
  { name: 'He I', aa: 3888.65, set: 'stellar' }, { name: 'He I', aa: 4026.19, set: 'stellar' }, { name: 'He I', aa: 4471.48, set: 'stellar' },
  { name: 'He I', aa: 4921.93, set: 'stellar' }, { name: 'He I', aa: 5015.68, set: 'stellar' }, { name: 'He I', aa: 5875.62, set: 'stellar', strong: true },
  { name: 'He I', aa: 6678.15, set: 'stellar' }, { name: 'He I', aa: 7065.19, set: 'stellar' }, { name: 'He I', aa: 10830.25, set: 'stellar' },
  { name: 'He II', aa: 4685.71, set: 'stellar' }, { name: 'He II', aa: 5411.52, set: 'stellar' },
  // Metals in stars
  { name: 'Ca II K', aa: 3933.66, set: 'stellar', strong: true }, { name: 'Ca II H', aa: 3968.47, set: 'stellar', strong: true },
  { name: 'Ca I', aa: 4226.73, set: 'stellar' }, { name: 'G band (CH)', aa: 4300.3, set: 'stellar' }, { name: 'CN band head', aa: 3883.0, set: 'stellar' },
  { name: 'Fe I', aa: 4045.81, set: 'stellar' }, { name: 'Fe I', aa: 4383.55, set: 'stellar' }, { name: 'Fe I', aa: 5269.54, set: 'stellar' }, { name: 'Fe I', aa: 5328.04, set: 'stellar' },
  { name: 'Mg I b₄', aa: 5167.32, set: 'stellar' }, { name: 'Mg I b₂', aa: 5172.68, set: 'stellar', strong: true }, { name: 'Mg I b₁', aa: 5183.6, set: 'stellar' },
  { name: 'Na I D₂', aa: 5889.95, set: 'stellar', strong: true }, { name: 'Na I D₁', aa: 5895.92, set: 'stellar', strong: true }, { name: 'Na I D (blended)', aa: 5892.94, set: 'stellar' },
  { name: 'TiO band head', aa: 7054.0, set: 'stellar' },
  { name: 'Ca II triplet', aa: 8498.02, set: 'stellar' }, { name: 'Ca II triplet', aa: 8542.09, set: 'stellar', strong: true }, { name: 'Ca II triplet', aa: 8662.14, set: 'stellar' },
  { name: 'Mg II', aa: 2795.53, set: 'quasar' }, { name: 'Mg II', aa: 2802.7, set: 'quasar' },
  // Nebulae and galaxies (forbidden lines in brackets)
  { name: '[O II]', aa: 3726.03, set: 'nebular' }, { name: '[O II]', aa: 3728.82, set: 'nebular' }, { name: '[O II] doublet (blended)', aa: 3727.42, set: 'nebular', strong: true },
  { name: '[Ne III]', aa: 3868.76, set: 'nebular' }, { name: '[Ne III]', aa: 3967.47, set: 'nebular' },
  { name: '[O III]', aa: 4363.21, set: 'nebular' }, { name: '[O III]', aa: 4958.91, set: 'nebular', strong: true }, { name: '[O III]', aa: 5006.84, set: 'nebular', strong: true },
  { name: '[N I]', aa: 5199.0, set: 'nebular' }, { name: '[N II]', aa: 5754.64, set: 'nebular' },
  { name: '[O I]', aa: 6300.3, set: 'nebular' }, { name: '[O I]', aa: 6363.78, set: 'nebular' },
  { name: '[N II]', aa: 6548.05, set: 'nebular', strong: true }, { name: '[N II]', aa: 6583.45, set: 'nebular', strong: true },
  { name: '[S II]', aa: 6716.44, set: 'nebular', strong: true }, { name: '[S II]', aa: 6730.82, set: 'nebular', strong: true },
  { name: '[Ar III]', aa: 7135.79, set: 'nebular' }, { name: '[S III]', aa: 9068.6, set: 'nebular' }, { name: '[S III]', aa: 9530.6, set: 'nebular' },
  { name: 'Hα (nebular)', aa: 6562.8, set: 'nebular', strong: true }, { name: 'Hβ (nebular)', aa: 4861.33, set: 'nebular', strong: true },
  // Quasars (vacuum, ultraviolet)
  { name: 'N V', aa: 1240.14, set: 'quasar' }, { name: 'Si II', aa: 1260.42, set: 'quasar' }, { name: 'O I', aa: 1304.35, set: 'quasar' },
  { name: 'C II', aa: 1335.3, set: 'quasar' }, { name: 'Si IV + O IV]', aa: 1399.8, set: 'quasar' }, { name: 'C IV', aa: 1549.06, set: 'quasar', strong: true },
  { name: 'He II', aa: 1640.42, set: 'quasar' }, { name: 'C III]', aa: 1908.73, set: 'quasar', strong: true },
  { name: 'Hβ (broad)', aa: 4861.33, set: 'quasar', strong: true }, { name: 'Hα (broad)', aa: 6562.8, set: 'quasar', strong: true },
  { name: '[O III] (quasar)', aa: 5006.84, set: 'quasar' },
  // Calibration lamps
  { name: 'Hg I', aa: 3650.15, set: 'lamp' }, { name: 'Hg I', aa: 4046.56, set: 'lamp' }, { name: 'Hg I', aa: 4077.83, set: 'lamp' },
  { name: 'Hg I', aa: 4358.33, set: 'lamp', strong: true }, { name: 'Hg I', aa: 5460.74, set: 'lamp', strong: true }, { name: 'Hg I', aa: 5769.6, set: 'lamp' }, { name: 'Hg I', aa: 5790.66, set: 'lamp' },
  ...[5852.49, 5881.9, 5944.83, 6074.34, 6096.16, 6143.06, 6217.28, 6266.5, 6334.43, 6382.99, 6402.25, 6506.53, 6598.95, 6678.28, 6717.04, 6929.47, 7032.41, 7173.94, 7245.17]
    .map((aa) => ({ name: 'Ne I', aa, set: 'lamp' as const, strong: aa === 5852.49 || aa === 6402.25 || aa === 6929.47 || aa === 7032.41 })),
  ...[6965.43, 7067.22, 7383.98, 7503.87, 7635.11, 7948.18, 8115.31, 8424.65, 9122.97].map((aa) => ({ name: 'Ar I', aa, set: 'lamp' as const, strong: aa === 7635.11 || aa === 8115.31 })),
  // Light pollution and night sky glow
  { name: 'Hg I (street lights)', aa: 4358.33, set: 'pollution', strong: true }, { name: 'Hg I (street lights)', aa: 5460.74, set: 'pollution', strong: true },
  { name: 'Hg I (street lights)', aa: 5769.6, set: 'pollution' }, { name: 'Hg I (street lights)', aa: 5790.66, set: 'pollution' },
  { name: 'Na I (sodium lamps)', aa: 5682.63, set: 'pollution' }, { name: 'Na I (sodium lamps)', aa: 5688.19, set: 'pollution' },
  { name: 'Na I D (sodium lamps)', aa: 5892.9, set: 'pollution', strong: true }, { name: 'Na I (sodium lamps)', aa: 6154.23, set: 'pollution' },
  { name: 'Na I (sodium lamps)', aa: 6160.75, set: 'pollution' }, { name: 'Na I (sodium lamps)', aa: 8183.26, set: 'pollution' }, { name: 'Na I (sodium lamps)', aa: 8194.82, set: 'pollution' },
  { name: '[O I] airglow', aa: 5577.34, set: 'pollution', strong: true }, { name: '[O I] airglow', aa: 6300.3, set: 'pollution' }, { name: '[O I] airglow', aa: 6363.78, set: 'pollution' },
  // Earth's atmosphere (absorption band heads)
  { name: 'O₂ B band', aa: 6867.2, to: 6884, set: 'telluric', strong: true }, { name: 'H₂O band', aa: 7160, to: 7340, set: 'telluric' },
  { name: 'O₂ A band', aa: 7593.7, to: 7621, set: 'telluric', strong: true }, { name: 'H₂O band', aa: 8120, to: 8350, set: 'telluric' }, { name: 'H₂O band', aa: 8950, to: 9800, set: 'telluric' },
];

/** Refractive index of standard air at a vacuum wavelength (Å), Morton (2000), as used by the IAU and SDSS. */
export function airIndex(vacAA: number) {
  const s2 = (1e4 / vacAA) ** 2;
  return 1 + 8.34254e-5 + 2.406147e-2 / (130 - s2) + 1.5998e-4 / (38.9 - s2);
}
export const vacToAir = (vac: number) => (vac < 2000 ? vac : vac / airIndex(vac));
export function airToVac(air: number) {
  if (air < 2000) return air;
  let v = air; for (let k = 0; k < 5; k++) v = air * airIndex(v);
  return v;
}
/** Rest wavelength of a line in the medium the user measures in (air or vacuum). */
export const restIn = (l: SpecLine, medium: 'air' | 'vac') => (l.aa < 2000 ? (medium === 'air' ? l.aa : l.aa) : medium === 'air' ? l.aa : airToVac(l.aa));

export type Match = { line: SpecLine; rest: number; expected: number; diff: number; kms: number };

/** For each measured wavelength (Å), the lines within `tol` Å once shifted by redshift z, closest first. */
export function identify(obs: number[], z: number, tol: number, sets: LineSet[], medium: 'air' | 'vac' = 'air') {
  const pool = SPEC_LINES.filter((l) => sets.includes(l.set));
  return obs.map((o) => {
    const m: Match[] = [];
    for (const l of pool) {
      const rest = restIn(l, medium), exp = rest * (1 + z);
      // Bands match anywhere from head to end; the offset is to the nearer edge.
      const end = l.to ? restIn({ ...l, aa: l.to }, medium) * (1 + z) : exp, d = o < exp ? o - exp : o > end ? o - end : 0;
      if (Math.abs(d) <= tol && !m.some((x) => x.line.name === l.name && Math.abs(x.rest - rest) < 0.05)) m.push({ line: l, rest, expected: l.to ? Math.min(Math.max(o, exp), end) : exp, diff: d, kms: (d / exp) * 299792.458 });
    }
    // Closest first, but a strong line wins over a weak one that is less than half the tolerance closer.
    const score = (x: Match) => Math.abs(x.diff) - (x.line.strong ? tol / 2 : 0);
    return { obs: o, matches: m.sort((a, b) => score(a) - score(b)) };
  });
}

/** Redshifts at which several measured lines line up with known strong lines at once.
 *  Every pairing of a measured line with a known line proposes a z; proposals that agree within `dz` are grouped. */
export function findRedshift(obs: number[], sets: LineSet[], zmin = -0.01, zmax = 7, dz = 5e-4, medium: 'air' | 'vac' = 'air') {
  const pool = SPEC_LINES.filter((l) => sets.includes(l.set) && l.strong);
  const props: { z: number; i: number; line: SpecLine }[] = [];
  obs.forEach((o, i) => { for (const l of pool) { const z = o / restIn(l, medium) - 1; if (z >= zmin && z <= zmax) props.push({ z, i, line: l }); } });
  props.sort((a, b) => a.z - b.z);
  const out: { z: number; n: number; lines: string[] }[] = [];
  for (let a = 0; a < props.length; a++) {
    // A window of width dz × (1 + z) starting at this proposal; count distinct measured lines in it.
    const w = dz * (1 + props[a].z), grp = [] as typeof props;
    for (let b = a; b < props.length && props[b].z - props[a].z <= w; b++) grp.push(props[b]);
    const used = new Map<number, (typeof props)[number]>(); for (const g of grp) if (!used.has(g.i)) used.set(g.i, g);
    if (used.size < 2) continue;
    const zs = [...used.values()].map((g) => g.z), zm = zs.reduce((s, x) => s + x, 0) / zs.length;
    if (out.some((x) => Math.abs(x.z - zm) < w)) { const x = out.find((y) => Math.abs(y.z - zm) < w)!; if (used.size > x.n) Object.assign(x, { z: zm, n: used.size, lines: [...used.values()].map((g) => g.line.name) }); continue; }
    out.push({ z: zm, n: used.size, lines: [...used.values()].map((g) => g.line.name) });
  }
  return out.sort((a, b) => b.n - a.n || a.z - b.z).slice(0, 8);
}

/** A simulated emission-line galaxy spectrum (Å, arbitrary flux) at redshift z, for the example. */
export function simulatedSpectrum(z: number, from = 3800, to = 9200, step = 2, seed = 3) {
  const em: [number, number][] = [[3727.4, 3], [4340.47, 0.9], [4861.33, 2], [4958.91, 2.4], [5006.84, 7], [6548.05, 1.2], [6562.8, 6.5], [6583.45, 3.6], [6716.44, 1.5], [6730.82, 1.1]];
  const ab: [number, number][] = [[3933.66, 0.35], [3968.47, 0.3], [5172.68, 0.2], [5892.9, 0.25]];
  let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647 - 0.5; };
  const lam: number[] = [], f: number[] = [];
  for (let x = from; x <= to; x += step) {
    let y = 1 + 0.15 * Math.sin(x / 1400);
    for (const [r, a] of em) { const c = r * (1 + z), sg = 3 * (1 + z); y += a * Math.exp(-0.5 * ((x - c) / sg) ** 2); }
    for (const [r, a] of ab) { const c = r * (1 + z), sg = 5 * (1 + z); y -= a * Math.exp(-0.5 * ((x - c) / sg) ** 2); }
    // Earth's atmosphere absorbs at the O₂ A and B bands whatever the redshift.
    y *= 1 - 0.5 * Math.exp(-0.5 * ((x - 7600) / 8) ** 2) - 0.25 * Math.exp(-0.5 * ((x - 6875) / 6) ** 2);
    lam.push(x); f.push(+(y + 0.06 * rnd()).toFixed(4));
  }
  return { lam, f };
}

/** Running median of f over ±w samples: the continuum under the lines. */
export function continuum(f: number[], w = 40) {
  const n = f.length, out = new Array<number>(n);
  for (let i = 0; i < n; i++) { const win = f.slice(Math.max(0, i - w), Math.min(n, i + w + 1)).sort((a, b) => a - b); out[i] = win[Math.floor(win.length / 2)]; }
  return out;
}

/** Peaks (or dips) in a spectrum: local extremes above (or below) the running-median continuum by `k` times the scatter. */
export function findPeaks(lam: number[], f: number[], k = 5, absorption = false, w = 40) {
  const n = f.length;
  if (n < 7) return [];
  const cont = continuum(f, w), r = f.map((x, i) => (absorption ? cont[i] - x : x - cont[i]));
  const mad = r.map(Math.abs).sort((a, b) => a - b)[Math.floor(n / 2)] * 1.4826 || 1e-9;
  const out: { aa: number; height: number }[] = [];
  for (let i = 2; i < n - 2; i++) {
    const y = r[i];
    if (y > k * mad && y >= r[i - 1] && y >= r[i + 1] && y > r[i - 2] && y > r[i + 2]) {
      // Parabolic refinement of the centre.
      const a = r[i - 1], b = r[i], c = r[i + 1], den = a - 2 * b + c, off = den !== 0 ? (0.5 * (a - c)) / den : 0;
      const aa = lam[i] + off * (lam[i + 1] - lam[i]), prev = out[out.length - 1];
      if (prev && aa - prev.aa < 2 * (lam[i + 1] - lam[i])) { if (y > prev.height) Object.assign(prev, { aa, height: y }); continue; }
      out.push({ aa, height: y });
    }
  }
  return out;
}
