// A to Z of cosmology (nihal, 2026-11-22): the story of the universe from the first star maps to today's open
// questions, for anyone curious. Plan: /mnt/project-files/cosmology-course/plan.md (12 modules, built over 7 PRs).
// No repeats with the astronomy course (agreed 2026-11-22): light, telescopes, orbits, parallax and Cepheids are
// taught there (fibub /learn/courses/astronomy/), and these lessons link to them instead of teaching them again.
//
// How it works: the same engine as ML foundations (src/courses/types.ts), plus the lesson kit (`kit: true`):
// figures and animations are JS modules in public/learn-kit/cosmology/figs/<name>.js placed in the text as
// <figure class="fig" data-fig="name">, "watch it happen" players are <div class="steps"> blocks, live problems
// are <div class="problem" data-problem="id"> (public/learn-kit/cosmology/problems.js). The physics behind
// every figure and problem is public/learn-kit/cosmology/phys.js, checked by tests/cosmo.mjs.
import type { CourseSyllabus } from '../types';

export const COSMOLOGY: CourseSyllabus = {
  id: 'cosmology',
  name: 'Cosmology A to Z',
  title: 'Cosmology from A to Z: the story of the universe, explained simply',
  text: 'How we learned the size, age and history of the universe, from ancient sky watchers to the James Webb telescope. Distances to galaxies, Einstein, the expanding universe, the Big Bang, the cosmic microwave background, dark matter, dark energy, inflation and today\'s open questions, each with animations you can step through, live problems and the maths explained gently.',
  audience: 'For anyone curious, from Class 9 up. No physics needed: every idea starts from everyday experience, and the maths is optional and explained step by step.',
  updated: '2026-11-22',
  kit: true,
  footnote: 'Numbers are rounded for teaching; measured values come from the sources listed in each lesson. Simulations run in your browser; nothing you type is sent anywhere.',
  parts: [
    { name: 'Part A: Looking up', modules: [
      { n: 1, name: 'The oldest questions', lessons: [
        ['1.1', 'what-is-cosmology', 'What is cosmology?'],
        ['1.2', 'ancient-cosmologies', 'Ancient cosmologies: Babylon, Greece, India and the Islamic world'],
        ['1.3', 'measuring-earth-moon-sun', 'Measuring the Earth, Moon and Sun with shadows'],
        ['1.4', 'copernican-revolution', 'The Copernican revolution: we are not the centre'],
        ['1.5', 'newtons-universe', 'Newton\'s universe: endless, and in trouble'],
        ['1.6', 'olbers-paradox', 'Why is the night sky dark? Olbers\' paradox'],
        ['1.7', 'great-debate', 'Is the Milky Way the whole universe? The Great Debate'],
        ['1.8', 'powers-of-ten', 'A tour of the universe in powers of ten'],
      ] },
      { n: 2, name: 'Distances beyond the stars', lessons: [
        ['2.1', 'lookback-time', 'Looking far is looking back'],
        ['2.2', 'standard-candles', 'Standard candles: distance from brightness'],
        ['2.3', 'hubble-andromeda', 'Hubble proves Andromeda is another galaxy'],
        ['2.4', 'type-ia-supernovae', 'Type Ia supernovae: candles across the universe'],
        ['2.5', 'galaxy-rulers', 'Galaxy rulers: Tully-Fisher, masers and lenses'],
        ['2.6', 'distance-ladder', 'The cosmic distance ladder, rung by rung'],
      ] },
    ] },
    { name: 'Part B: Gravity and spacetime', modules: [
      { n: 3, name: 'Einstein\'s universe', lessons: [
        ['3.1', 'speed-of-light', 'The speed of light is the same for everyone'],
        ['3.2', 'time-dilation', 'Time dilation and length contraction'],
        ['3.3', 'e-equals-mc2', 'E = mc²: mass is energy'],
        ['3.4', 'equivalence-principle', 'The equivalence principle: falling is floating'],
        ['3.5', 'curved-spacetime', 'Curved spacetime: gravity as geometry'],
        ['3.6', 'tests-of-relativity', 'How we know Einstein was right: Mercury, eclipses and GPS'],
        ['3.7', 'black-holes', 'Black holes'],
        ['3.8', 'gravitational-lensing', 'Gravitational lensing: the universe\'s magnifying glass'],
        ['3.9', 'gravitational-waves', 'Gravitational waves: ripples in spacetime'],
      ] },
    ] },
    { name: 'Part C: The expanding universe', modules: [
      { n: 4, name: 'Discovering expansion', lessons: [
        ['4.1', 'redshift-galaxies', 'Slipher\'s discovery: galaxies are rushing away'],
        ['4.2', 'hubble-law', 'Hubble\'s law: the farther, the faster'],
        ['4.3', 'expanding-universe', 'What does "the universe is expanding" really mean?'],
        ['4.4', 'not-an-explosion', 'The Big Bang was not an explosion in space'],
        ['4.5', 'cosmological-redshift', 'Cosmological redshift: stretched light'],
        ['4.6', 'lemaitre', 'Lemaître and the primeval atom'],
        ['4.7', 'age-of-universe', 'How old is the universe?'],
        ['4.8', 'cosmological-principle', 'The cosmological principle: no centre, no edge'],
      ] },
      { n: 5, name: 'The equations of the universe, gently', lessons: [
        ['5.1', 'scale-factor', 'The scale factor: one number for the size of the universe'],
        ['5.2', 'friedmann-equation', 'The Friedmann equation, from a thrown ball'],
        ['5.3', 'critical-density', 'Critical density and Omega'],
        ['5.4', 'shape-of-space', 'The shape of space: flat, closed or open?'],
        ['5.5', 'matter-radiation-dark-energy', 'How matter, radiation and dark energy thin out'],
        ['5.6', 'acceleration-equation', 'Speeding up or slowing down: the acceleration equation'],
        ['5.7', 'classic-models', 'The classic universes: Einstein, de Sitter and Einstein-de Sitter'],
        ['5.8', 'cosmological-distances', 'Distances in an expanding universe'],
        ['5.9', 'cosmic-horizons', 'Horizons: how far can we ever see?'],
        ['5.10', 'build-a-universe', 'Build your own universe'],
      ] },
    ] },
    { name: 'Part D: The hot Big Bang', modules: [
      { n: 6, name: 'The first three minutes and after', lessons: [
        ['6.1', 'gamow-alpher-herman', 'Gamow, Alpher and Herman: a hot beginning'],
        ['6.2', 'big-bang-vs-steady-state', 'Big Bang or Steady State? The great argument'],
        ['6.3', 'temperature-and-time', 'Hotter in the past: temperature and time'],
        ['6.4', 'first-second', 'The first second: from quarks to protons'],
        ['6.5', 'cosmic-neutrinos', 'Neutrinos let go'],
        ['6.6', 'big-bang-nucleosynthesis', 'Big Bang nucleosynthesis: cooking the first elements'],
        ['6.7', 'lithium-problem', 'The lithium problem'],
        ['6.8', 'matter-radiation-equality', 'When matter took over from light'],
        ['6.9', 'recombination', 'Recombination: the universe becomes transparent'],
      ] },
      { n: 7, name: 'The cosmic microwave background', lessons: [
        ['7.1', 'cmb-discovery', 'Penzias and Wilson hear the Big Bang'],
        ['7.2', 'cmb-blackbody', 'The most perfect blackbody: COBE'],
        ['7.3', 'cmb-dipole', 'The CMB dipole: our motion through the universe'],
        ['7.4', 'cmb-anisotropies', 'Tiny ripples in the first light'],
        ['7.5', 'acoustic-peaks', 'Sound waves in the early universe'],
        ['7.6', 'wmap-planck', 'WMAP and Planck: mapping the baby universe'],
        ['7.7', 'cmb-polarisation', 'CMB polarisation'],
        ['7.8', 'universe-recipe', 'Reading the universe\'s recipe from the CMB'],
      ] },
    ] },
    { name: 'Part E: The dark universe', modules: [
      { n: 8, name: 'Dark matter', lessons: [
        ['8.1', 'zwicky-missing-mass', 'Zwicky\'s missing mass'],
        ['8.2', 'rotation-curves', 'Vera Rubin and galaxy rotation curves'],
        ['8.3', 'bullet-cluster', 'Lensing and the Bullet Cluster'],
        ['8.4', 'dark-matter-cmb', 'Dark matter in the first light'],
        ['8.5', 'dark-matter-candidates', 'What could dark matter be?'],
        ['8.6', 'dark-matter-searches', 'Hunting for dark matter'],
        ['8.7', 'mond', 'Could gravity be wrong instead? MOND and friends'],
        ['8.8', 'dark-matter-today', 'Dark matter: what we know and what we don\'t'],
      ] },
      { n: 9, name: 'Dark energy', lessons: [
        ['9.1', 'accelerating-universe', '1998: the expansion is speeding up'],
        ['9.2', 'cosmological-constant', 'Einstein\'s cosmological constant returns'],
        ['9.3', 'vacuum-energy', 'The vacuum energy puzzle'],
        ['9.4', 'equation-of-state', 'Is dark energy changing? The equation of state w'],
        ['9.5', 'fate-of-universe', 'How will the universe end?'],
        ['9.6', 'desi-dark-energy', 'DESI and new hints about dark energy'],
        ['9.7', 'coincidence-problem', 'Why now? The coincidence problem'],
      ] },
    ] },
    { name: 'Part F: Building structure', modules: [
      { n: 10, name: 'From smooth to lumpy', lessons: [
        ['10.1', 'seeds-of-structure', 'The seeds of structure'],
        ['10.2', 'gravitational-instability', 'Gravity makes lumps: the Jeans scale'],
        ['10.3', 'dark-matter-halos', 'Dark matter halos'],
        ['10.4', 'cosmic-web', 'The cosmic web'],
        ['10.5', 'first-stars-reionisation', 'The first stars and reionisation'],
        ['10.6', 'galaxy-formation', 'How galaxies form'],
        ['10.7', 'baryon-acoustic-oscillations', 'Baryon acoustic oscillations: a ruler in the sky'],
        ['10.8', 'galaxy-surveys', 'Mapping millions of galaxies'],
        ['10.9', 'cosmological-simulations', 'Universes in a computer'],
      ] },
    ] },
    { name: 'Part G: The very beginning', modules: [
      { n: 11, name: 'Inflation and the first instant', lessons: [
        ['11.1', 'horizon-flatness-problems', 'The horizon and flatness problems'],
        ['11.2', 'cosmic-inflation', 'Cosmic inflation'],
        ['11.3', 'quantum-seeds', 'Quantum jitters become galaxies'],
        ['11.4', 'primordial-gravitational-waves', 'Primordial gravitational waves and the BICEP2 lesson'],
        ['11.5', 'matter-antimatter', 'Why is there matter at all?'],
        ['11.6', 'planck-era', 'The Planck era and quantum gravity'],
        ['11.7', 'multiverse', 'The multiverse: science or speculation?'],
      ] },
    ] },
    { name: 'Part H: Frontiers', modules: [
      { n: 12, name: 'Cosmology today', lessons: [
        ['12.1', 'lambda-cdm', 'ΛCDM: the standard model of cosmology'],
        ['12.2', 'hubble-tension', 'The Hubble tension'],
        ['12.3', 's8-tension', 'The S8 tension: is the universe too smooth?'],
        ['12.4', 'jwst-early-galaxies', 'JWST and the surprisingly early galaxies'],
        ['12.5', 'new-surveys', 'Euclid, Rubin and Roman: the next maps'],
        ['12.6', 'standard-sirens', 'Standard sirens: measuring with gravitational waves'],
        ['12.7', 'dark-ages-21cm', 'The dark ages and 21 cm cosmology'],
        ['12.8', 'india-in-cosmology', 'India in cosmology, and how to become a cosmologist'],
      ] },
    ] },
  ],
};
