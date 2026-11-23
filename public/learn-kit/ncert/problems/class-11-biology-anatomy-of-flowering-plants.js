// Class 11 Biology, Anatomy of Flowering Plants: live problems (original fibub questions). Ids start with c11b-anat-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-anat-stomata': {
    title: 'stomatal density from a microscope field',
    make(r) {
      const count = pick(r, 12, 40), d = choose(r, [0.4, 0.5, 0.6, 0.8]), area = Math.PI * (d / 2) ** 2;
      return { count, d, q: `<p>Under the microscope a leaf peel shows a circular field of view of diameter ${d} mm. You count ${count} stomata inside it. What is the stomatal density in stomata per mm²?</p>`, answer: count / area, unit: 'per mm²', tol: 0.02,
        hint: 'Area of the field = π (d/2)². Density = number ÷ area.',
        solution: steps(`Area = π × (${d} ÷ 2)² = ${n(area, 3)} mm².`, `Density = ${count} ÷ ${n(area, 3)} = <b>${n(count / area, 3)} per mm²</b>.`, 'Count in 5 different fields and take the mean for a reliable value.') };
    },
    verify: (x) => x.count / (3.141592653589793 * x.d * x.d / 4),
  },
  'c11b-anat-rings': {
    title: 'age of a tree from its annual rings',
    make(r) {
      const rings = pick(r, 20, 80, 5), w = choose(r, [2, 2.5, 3, 4]);
      return { rings, w, q: `<p>A cut tree trunk shows ${rings} annual rings, each ring about ${w} mm wide on average. (a) How old was the tree? Give (b) the radius of its wood in mm. Type the radius.</p>`, answer: rings * w, unit: 'mm', tol: 0.02,
        hint: 'One ring forms each year, so rings = age in years. Radius = number of rings × width of one ring.',
        solution: steps(`Age = number of rings = <b>${rings} years</b>.`, `Radius = ${rings} × ${w} mm = <b>${n(rings * w)} mm</b> (diameter ${n(2 * rings * w)} mm).`) };
    },
    verify: (x) => x.w * x.rings,
  },
  'c11b-anat-actual': {
    title: 'real size from a magnified drawing',
    make(r) {
      const drawn = pick(r, 20, 90, 5), mag = choose(r, [100, 200, 400, 500]);
      return { drawn, mag, q: `<p>In a photograph magnified ${mag} times, a xylem vessel looks ${drawn} mm wide. What is its real width in micrometres (1 mm = 1000 µm)?</p>`, answer: drawn / mag * 1000, unit: 'µm', tol: 0.02,
        hint: 'Real size = image size ÷ magnification. Then convert mm to µm.',
        solution: steps(`Real width = ${drawn} mm ÷ ${mag} = ${n(drawn / mag, 3)} mm.`, `In µm: ${n(drawn / mag, 3)} × 1000 = <b>${n(drawn / mag * 1000)} µm</b>.`) };
    },
    verify: (x) => (x.drawn * 1000) / x.mag,
  },
  'c11b-anat-bundles': {
    title: 'number of vascular bundles in a stem',
    make(r) {
      const dens = pick(r, 4, 12), dia = choose(r, [4, 6, 8, 10]);
      return { dens, dia, q: `<p>A section of a maize stem has ${dens} vascular bundles per mm². The section is a circle of diameter ${dia} mm. About how many bundles does it have in all?</p>`, answer: dens * Math.PI * (dia / 2) ** 2, unit: 'bundles', tol: 0.02,
        hint: 'Area = π r². Multiply by the bundles per mm².',
        solution: steps(`Area = π × (${dia} ÷ 2)² = ${n(Math.PI * (dia / 2) ** 2, 4)} mm².`, `Bundles = ${dens} × ${n(Math.PI * (dia / 2) ** 2, 4)} = <b>${n(dens * Math.PI * (dia / 2) ** 2)}</b>.`) };
    },
    verify: (x) => x.dens * 3.141592653589793 * x.dia * x.dia / 4,
  },
};
