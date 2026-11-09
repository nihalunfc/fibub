// #858 nanoparticle calculator: magic-number counts checked against clusters built atom by atom in NumPy (fcc
// cuboctahedra with surface atoms found by coordination below 12, and Mackay icosahedra built shell by shell from
// subdivided faces), and the sphere numbers against an independent NumPy calculation in other units.
import { NA, sphere, specificSurface, betDiameter, particleMass, atomVolume, sphereAtoms, magic, shellsFor, numberConc } from '../../src/lib/sci/nano.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  // NumPy-built clusters: [N, surface, vertex, edge, face] for n = 1..5.
  const cubo = [[13, 12, 12, 0, 0], [55, 42, 12, 24, 6], [147, 92, 12, 48, 32], [309, 162, 12, 72, 78], [561, 252, 12, 96, 144]];
  const ico = [[13, 12, 12, 0, 0], [55, 42, 12, 30, 0], [147, 92, 12, 60, 20], [309, 162, 12, 90, 60], [561, 252, 12, 120, 120]];
  const row = (m) => [m.N, m.surface, m.vertex, m.edge, m.face].join();
  check('nano: cuboctahedral counts match fcc clusters built in numpy', cubo.every((r, i) => row(magic(i + 1, 'cubo')) === r.join()));
  check('nano: icosahedral counts match Mackay clusters built in numpy', ico.every((r, i) => row(magic(i + 1, 'ico')) === r.join()));
  check('nano: magic numbers 1, 13, 55, 147, 309, 561, 923, 1415', [0, 1, 2, 3, 4, 5, 6, 7].map((n) => magic(n, 'ico').N).join() === '1,13,55,147,309,561,923,1415');
  check('nano: surface fraction of the 55-atom cluster is 42/55', near(magic(2, 'cubo').fraction, 42 / 55, 1e-15) && magic(3, 'ico').edgeAtoms === 4);
  check('nano: shells for a diameter of (2n + 1) atoms', shellsFor(7 * 0.288, 0.288) === 3 && shellsFor(0.1, 0.288) === 0);
  // Gold sphere, 20 nm (numpy reference).
  const s = sphereAtoms(20, 19.3, 196.96657);
  check('nano: atoms in a 20 nm gold sphere match numpy', near(s.N, 247174.86098657476, 1e-13));
  check('nano: surface-shell fraction matches numpy', near(s.fraction, 0.09259111829432931, 1e-13) && near(s.da, 0.31868520086983154, 1e-13));
  check('nano: volume per atom M/(ρ NA)', near(atomVolume(19.3, 196.96657).v, 0.016946667586126018, 1e-13) && NA === 6.02214076e23);
  check('nano: S/V = 6/d and sphere volume', near(sphere(20).SV, 0.3, 1e-15) && near(sphere(20).S / sphere(20).V, 0.3, 1e-14) && near(sphere(2).V, 4.1887902047863905, 1e-14));
  check('nano: specific surface area 6/(ρd) in m²/g', near(specificSurface(20, 19.3), 15.544041450777202, 1e-14));
  check('nano: BET diameter inverts the specific surface', near(betDiameter(specificSurface(37, 2.2), 2.2), 37, 1e-14) && near(betDiameter(15, 19.3), 20.72538860103627, 1e-14));
  check('nano: particle mass, number and molar concentration match numpy', near(particleMass(20, 19.3), 8.084365095237734e-17, 1e-13) && near(numberConc(0.05, particleMass(20, 19.3)).perML, 618477758129.127, 1e-13) && near(numberConc(0.05, particleMass(20, 19.3)).molar, 1.0270064795515126e-9, 1e-13));
  check('nano: a particle thinner than two atoms is all surface', sphereAtoms(0.5, 19.3, 196.96657).fraction === 1);
  check('nano: a typed atom diameter replaces the estimate', near(sphereAtoms(10, 19.3, 196.96657, 0.288).fraction, 1 - (1 - 0.0576) ** 3, 1e-13));
};
