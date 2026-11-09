// #186 Ramachandran plot. Reference angles from Biopython 1.8x (Bio.PDB internal coordinates: phi, psi and omega
// from atom_to_internal_coordinates, with IC_Chain.MaxPeptideBond set to the page's 2.0 Å) and from an independent
// NumPy dihedral, on the page's made-up example and on a noisy copy with a chain break, an insertion code, two
// alternative locations (the first, A, is used, as in Biopython's angles), a second model and a water; the same copy as mmCIF read by Bio.PDB.MMCIFParser.
import { exampleStructure, parseStructure, parsePdb, parseMmcif, backbone, summarise, dihedral, wrap, regionOf, parseRegions, regionsText, anglesCsv, buildChain, GUIDE_REGIONS } from '../../src/lib/sci/ramachandran.ts';

// The noisy copy of the example (kept here so Python can be run on exactly the same text).
export function variant() {
  let seed = 186;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 - 0.5; };
  const fmt = (v) => v.toFixed(3).padStart(8);
  const out = [];
  const atoms = exampleStructure().split('\n').filter((l) => l.startsWith('ATOM'));
  const moved = (l, s) => l.slice(0, 30) + fmt(Number(l.slice(30, 38)) + s * rnd()) + fmt(Number(l.slice(38, 46)) + s * rnd()) + fmt(Number(l.slice(46, 54)) + s * rnd()) + l.slice(54);
  out.push('HEADER    NOISY COPY                              09-NOV-26   XNSY', 'MODEL        1');
  for (const l0 of atoms) {
    const ch = l0[21], seq = Number(l0.slice(22, 26)), name = l0.slice(12, 16).trim();
    if (ch === 'A' && seq === 10) continue; // chain break
    let l = moved(l0, 0.3);
    if (ch === 'A' && seq === 20) l = l.slice(0, 22) + '  19A' + l.slice(27); // insertion code
    if (ch === 'A' && seq === 5 && name === 'CA') {
      out.push(l.slice(0, 16) + 'A' + l.slice(17, 54) + '  0.40' + l.slice(60));
      out.push(l.slice(0, 16) + 'B' + l.slice(17, 30) + fmt(Number(l.slice(30, 38)) + 0.5) + l.slice(38, 54) + '  0.60' + l.slice(60));
      continue;
    }
    out.push(l);
  }
  out.push('HETATM  999  O   HOH W   1       5.000   5.000   5.000  1.00 30.00           O', 'ENDMDL', 'MODEL        2');
  for (const l of atoms) out.push(moved(l, 2));
  out.push('ENDMDL', 'END');
  return out.join('\n') + '\n';
}

// The noisy copy's first model written as mmCIF (author numbers and chains, quoted fields, ? for no insertion code).
export function variantCif() {
  const s = parsePdb(variant());
  const rows = ['data_XNSY', '#', 'loop_', ...['group_PDB', 'id', 'type_symbol', 'label_atom_id', 'label_alt_id', 'label_comp_id', 'label_asym_id', 'label_seq_id', 'pdbx_PDB_ins_code', 'Cartn_x', 'Cartn_y', 'Cartn_z', 'occupancy', 'B_iso_or_equiv', 'auth_seq_id', 'auth_comp_id', 'auth_asym_id', 'auth_atom_id', 'pdbx_PDB_model_num'].map((c) => '_atom_site.' + c)];
  let id = 1;
  s.residues.forEach((r, k) => { for (const a of r.atoms.values()) rows.push(['ATOM', id++, a.el, `"${a.name}"`, '.', r.name, r.chain, k + 1, r.icode || '?', a.x.toFixed(3), a.y.toFixed(3), a.z.toFixed(3), a.occ.toFixed(2), '20.00', r.seq, r.name, r.chain, `'${a.name}'`, 1].join(' ')); });
  return rows.join('\n') + '\n#\n';
}

// Biopython phi, psi (degrees, 3 decimals) for the example in file order; null where Biopython gives none.
const BIO_EX = {
  phi: [null, -66.378, -61.826, -64.313, -62.033, -66.836, -63.479, -60.165, -67.875, -65.246, -62.766, -70.432, -92.552, 78.424, -101.255, -68.904, -118.763, -126.281, -112.791, -131.54, -119.392, -108.581, 62.544, -80.3, -85.094, null, -122.603, -128.87, 101.721, -134.201, -116.305, -76.371, -90.027],
  psi: [149.987, -38.192, -40.579, -42.924, -39.69, -41.279, -44.15, -42.475, -37.426, -40.792, -43.538, -36.102, 8.229, 21.734, 152.617, 148.36, 131.41, 128.89, 137.202, 142.815, 126.464, 134.074, -118.391, 168.198, null, 145.006, 133.765, 125.191, -168.435, 146.685, 129.488, -21.922, null],
};
// Biopython (phi, psi, omega; omega given to the earlier residue here), NumPy and Biopython-on-mmCIF for the noisy copy.
const BIO_VAR = {
  phi: [null, -59.181, -66.217, -58.403, -50.958, -70.871, -55.248, -68.252, -62.142, null, -72.234, -82.498, 74.773, -103.989, -77.079, -126.791, -114.243, -121.702, -128.666, -122.255, -91.243, 60.205, -82.549, -86.085, null, -116.087, -127.001, 97.963, -149.407, -116.674, -71.218, -78.838],
  psi: [147.72, -40.271, -43.056, -43.224, -47.047, -43.91, -44.295, -35.043, null, -43.956, -41.483, 13.899, 22.417, 145.139, 159.022, 135.355, 125.069, 142.34, 153.484, 119.378, 128.021, -126.347, 167.818, null, 141.458, 131.737, 138.63, -161.139, 143.509, 124.778, -24.475, null],
  omega: [-174.362, 178.608, 176.012, 175.061, -169.598, -178.254, -177.253, 166.507, null, -179.425, 174.934, 172.032, -179.222, 2.139, 175.415, 169.84, -178.511, 175.129, 176.672, 178.723, 178.76, -173.733, -177.492, null, -177.718, 172.405, 178.374, -173.993, 175.112, -166.561, 178.617, null],
  npPhi: [null, -59.181, -66.217, -58.403, -50.958, -70.871, -55.248, -68.252, -62.142, null, -72.234, -82.498, 74.773, -103.989, -77.079, -126.791, -114.243, -121.702, -128.666, -122.255, -91.243, 60.205, -82.549, -86.085, null, -116.087, -127.001, 97.963, -149.407, -116.674, -71.218, -78.838],
  npPsi: [147.72, -40.271, -43.056, -43.224, -47.047, -43.91, -44.295, -35.043, null, -43.956, -41.483, 13.899, 22.417, 145.139, 159.022, 135.355, 125.069, 142.34, 153.484, 119.378, 128.021, -126.347, 167.818, null, 141.458, 131.737, 138.63, -161.139, 143.509, 124.778, -24.475, null],
  cifPhi: [null, -59.181, -66.217, -58.403, -50.958, -70.871, -55.248, -68.252, -62.142, null, -72.234, -82.498, 74.773, -103.989, -77.079, -126.791, -114.243, -121.702, -128.666, -122.255, -91.243, 60.205, -82.549, -86.085, null, -116.087, -127.001, 97.963, -149.407, -116.674, -71.218, -78.838],
  cifPsi: [147.72, -40.271, -43.056, -43.224, -47.047, -43.91, -44.295, -35.043, null, -43.956, -41.483, 13.899, 22.417, 145.139, 159.022, 135.355, 125.069, 142.34, 153.484, 119.378, 128.021, -126.347, 167.818, null, 141.458, 131.737, 138.63, -161.139, 143.509, 124.778, -24.475, null],
};

export default async (check) => {
  const near = (a, b, tol) => (a === null || b === null ? a === b : Math.abs(wrap(a - b)) <= tol);
  const all = (xs, ys, tol) => xs.length === ys.length && xs.every((x, i) => near(x, ys[i], tol));
  // Dihedral basics, worked by hand: a planar cis arrangement is 0°, trans is 180°, a right angle is ±90°.
  check('ramachandran: dihedral of cis, trans and right-angle points (0, 180, -90, +90: IUPAC sign)', Math.abs(dihedral([1, 1, 0], [1, 0, 0], [0, 0, 0], [0, 1, 0])) < 1e-12 && Math.abs(Math.abs(dihedral([1, 1, 0], [1, 0, 0], [0, 0, 0], [0, -1, 0])) - 180) < 1e-12 && Math.abs(dihedral([1, 1, 0], [1, 0, 0], [0, 0, 0], [0, 0, 1]) + 90) < 1e-12 && Math.abs(dihedral([1, 1, 0], [1, 0, 0], [0, 0, 0], [0, 0, -1]) - 90) < 1e-12);
  check('ramachandran: wrap to -180..180', wrap(190) === -170 && wrap(-190) === 170 && wrap(540) === -180 && wrap(-45) === -45);
  // A chain built from chosen angles gives the same angles back.
  { const want = [[-60, -45], [-120, 130], [75, 25], [-150, 160], [-70, 140]];
    const bb = buildChain(want.map(([phi, psi]) => ({ name: 'ALA', phi, psi, omega: 180 })));
    const ok = want.every(([phi, psi], i) => (i === 0 || Math.abs(wrap(dihedral(bb[i - 1][2], bb[i][0], bb[i][1], bb[i][2]) - phi)) < 1e-9) && (i === want.length - 1 || Math.abs(wrap(dihedral(bb[i][0], bb[i][1], bb[i][2], bb[i + 1][0]) - psi)) < 1e-9));
    check('ramachandran: a chain built from angles gives them back (to 1e-9°)', ok); }
  const ex = parseStructure(exampleStructure()), rows = backbone(ex);
  check('ramachandran: example has 2 chains, 33 residues, 132 atoms, id XMPL', ex.residues.length === 33 && ex.atoms === 132 && ex.title === 'XMPL' && ex.format === 'pdb' && summarise(rows, GUIDE_REGIONS).chains.join() === 'A,B');
  check('ramachandran: example phi matches Biopython (0.001°)', all(rows.map((r) => r.phi), BIO_EX.phi, 0.0011));
  check('ramachandran: example psi matches Biopython (0.001°)', all(rows.map((r) => r.psi), BIO_EX.psi, 0.0011));
  const S = summarise(rows, GUIDE_REGIONS);
  check('ramachandran: example counts (29 plotted: 13 α, 13 β, 1 αL, 2 outside; 3 Gly, 2 Pro, 1 cis)', S.plotted === 29 && S.byRegion.map((b) => b.n).join() === '13,13,1' && S.outside === 2 && S.gly === 3 && S.pro === 2 && S.cis === 1);
  check('ramachandran: the outliers are A ASP 23 and B GLY 4', rows.filter((r) => r.phi !== null && r.psi !== null && !r.region).map((r) => r.label).join() === 'A ASP 23,B GLY 4');
  check('ramachandran: cis peptide before Pro 16 found (ω about -4.5°)', rows[14].cis && Math.abs(rows[14].omega + 4.5) < 0.05 && rows[14].note.includes('cis peptide'));
  // The noisy copy.
  const v = parsePdb(variant()), vr = backbone(v);
  check('ramachandran: noisy copy reads the first model only, skips water, 2 models', v.models === 2 && v.residues.length === 32 && v.residues.every((r) => r.name !== 'HOH'));
  check('ramachandran: the first alternative location is kept (A, 0.40)', v.residues[4].atoms.get('CA').occ === 0.4);
  check('ramachandran: insertion code read (A 19A)', vr.some((r) => r.label === 'A VAL 19A'));
  check('ramachandran: chain break leaves psi of A 9 and phi of A 11 blank', vr[8].psi === null && vr[9].phi === null && vr[8].note === 'chain break after' && vr[9].note === 'chain break before');
  check('ramachandran: noisy copy phi matches Biopython (0.001°)', all(vr.map((r) => r.phi), BIO_VAR.phi, 0.0011));
  check('ramachandran: noisy copy psi matches Biopython (0.001°)', all(vr.map((r) => r.psi), BIO_VAR.psi, 0.0011));
  check('ramachandran: noisy copy omega matches Biopython (next residue, 0.001°)', all(vr.map((r) => r.omega), BIO_VAR.omega, 0.0011));
  check('ramachandran: noisy copy angles match an independent NumPy dihedral (0.001°)', all(vr.map((r) => r.phi), BIO_VAR.npPhi, 0.0011) && all(vr.map((r) => r.psi), BIO_VAR.npPsi, 0.0011));
  const c = parseMmcif(variantCif()), cr = backbone(c);
  check('ramachandran: mmCIF copy (detected, quoted atom names) gives the same angles as Biopython MMCIFParser', parseStructure(variantCif()).format === 'mmcif' && c.title === 'XNSY' && all(cr.map((r) => r.phi), BIO_VAR.cifPhi, 0.0011) && all(cr.map((r) => r.psi), BIO_VAR.cifPsi, 0.0011));
  // Guide regions.
  check('ramachandran: guide regions (α at -60,-45; β at -120,130 and wrapped -130,-175; αL at 60,45; none at 60,-120)', regionOf(GUIDE_REGIONS, -60, -45)?.id === 'alpha' && regionOf(GUIDE_REGIONS, -120, 130)?.id === 'beta' && regionOf(GUIDE_REGIONS, -130, -175)?.id === 'beta' && regionOf(GUIDE_REGIONS, 60, 45)?.id === 'alphaL' && regionOf(GUIDE_REGIONS, 60, -120) === null);
  { const p = parseRegions(regionsText(GUIDE_REGIONS));
    check('ramachandran: guide regions survive a round trip through text', p.errors.length === 0 && p.regions.length === 3 && p.regions.every((r, i) => r.name === GUIDE_REGIONS[i].name && r.phi === GUIDE_REGIONS[i].phi && r.rpsi === GUIDE_REGIONS[i].rpsi));
    const bad = parseRegions('Helix, a, -60, -45, 40\nWide, w, 0, 0, 0, 10\n# note\nPPII, P, -75, 145, 20, 20');
    check('ramachandran: bad region lines give messages, good ones are kept', bad.errors.length === 2 && bad.regions.length === 1 && bad.regions[0].short === 'P'); }
  { const csv = anglesCsv(rows).trim().split('\n');
    check('ramachandran: CSV has a header and one row per residue', csv.length === 34 && csv[0].startsWith('chain,residue_number') && csv[23] === 'A,23,,ASP,D,62.5,-118.4,-180.0,other,outside the guides,outside the guides' && csv[1].startsWith('A,1,,MET,M,,150.0,')); }
};
