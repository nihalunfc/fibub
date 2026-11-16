// The United States map for Learn, Grade 8 to 12: the Common Core State Standards for Mathematics (CCSS-M) and
// the Next Generation Science Standards (NGSS), the two most widely used public standards. States adopt and
// adapt them (some have their own, e.g. Texas TEKS, Virginia SOL, New York), and high schools differ in which
// course a grade takes, so each grade shows the usual course for it and the standard codes to match against
// your own state's list. Only chapter-sized topic names and standard codes are used: no standards text is
// copied, and fibub is not part of Common Core, NGSS, Achieve, NSTA or any state. Same shape as src/data/ncert.ts,
// so the pages and the home page totals work the same way. Tool ids not live yet are left out of the page.
import type { SchoolClass, Chapter } from './ncert';

const c = (n: number, title: string, topics: string, tools: string[] = []): Chapter => ({ n, title, topics, tools });

export const USA_GRADES: SchoolClass[] = [
  {
    id: 'us-grade-8', n: 8, name: 'US Grade 8', blurb: 'Middle school: Common Core Grade 8 maths and NGSS middle school science.',
    subjects: [
      { id: 'math', name: 'Maths', book: 'Common Core 8', chapters: [
        c(1, 'The number system', 'Rational and irrational numbers, estimating roots (8.NS)', ['irrational-proof', 'number-line-zoom', 'square-root-finder', 'root-spiral', 'surds']),
        c(2, 'Exponents and scientific notation', 'Integer exponents, square and cube roots, very large and small numbers (8.EE.1-4)', ['exponent-laws', 'standard-form-ladder', 'scientific-notation-formatter', 'doubling-power']),
        c(3, 'Linear equations and proportional relationships', 'Slope, unit rate, y = mx + b, one-variable equations (8.EE.5-7)', ['linear-explorer', 'proportion-grapher', 'two-variable-line', 'balance-scale', 'line-forms']),
        c(4, 'Systems of linear equations', 'Solving two equations by graphing and by algebra (8.EE.8)', ['two-variable-line', 'linear-pair-solver', 'linear-word-problems']),
        c(5, 'Functions', 'Rule, table, graph, linear and non-linear, rate of change (8.F)', ['function-gallery', 'function-type', 'linear-explorer', 'relation-checker']),
        c(6, 'Transformations and congruence', 'Translations, rotations, reflections, dilations, similar figures (8.G.1-4)', ['rigid-motions', 'similar-triangles', 'tessellation-studio', 'triangle-congruence']),
        c(7, 'Angles, the Pythagorean theorem and volume', 'Angle sums, Pythagoras and its converse, distance, cylinders, cones, spheres (8.G.5-9)', ['pythagoras-proofs', 'polygon-angle-sum', 'coord-triangle', 'combined-solids']),
        c(8, 'Statistics and probability: scatter plots', 'Scatter plots, trend lines, two-way tables (8.SP)', ['scatter-best-fit', 'histogram-builder']),
      ] },
      { id: 'science', name: 'Science', book: 'NGSS middle school', chapters: [
        c(1, 'Structure and properties of matter', 'Atoms and molecules, pure substances, states of matter, thermal energy (MS-PS1-1 to 4)', ['states-of-matter', 'build-an-atom', 'matter-sorter', 'heating-curve', 'kinetic-theory', 'density-lab']),
        c(2, 'Chemical reactions', 'Reactants and products, mass conserved, energy released or absorbed (MS-PS1-2, 5, 6)', ['reaction-type-sorter', 'constant-proportions', 'decomposition', 'calorimetry-lab']),
        c(3, 'Forces and motion', 'Newton\'s laws, collisions, speed and kinetic energy (MS-PS2-1, 2, 4; MS-PS3-1, 2)', ['newtons-laws', 'collision-carts', 'motion-graphs', 'friction-ramp', 'energy-track']),
        c(4, 'Electric and magnetic fields', 'Forces between charges and magnets, electromagnets (MS-PS2-3, 5)', ['static-charge', 'coulomb-forces', 'electromagnet-builder', 'magnetic-field-mapper']),
        c(5, 'Waves and light', 'Waves carry energy and information, light and mirrors (MS-PS4)', ['travelling-wave', 'sound-wave-visualiser', 'mirror-ray-diagram', 'prism-dispersion', 'optical-fibre']),
        c(6, 'Energy transfer and heat', 'Thermal energy, heat transfer, specific heat (MS-PS3-3 to 5)', ['calorimetry-lab', 'heating-curve', 'thermal-expansion', 'cooling-curves']),
        c(7, 'Cells, body systems and heredity', 'Cell structure, body systems, genes and variation, reproduction (MS-LS1, MS-LS3)', ['cell-explorer', 'virtual-microscope', 'heart-circulation', 'digestion-journey', 'mendel-peas', 'reproduction-modes', 'microscope-magnification']),
        c(8, 'Ecosystems and natural selection', 'Food webs, matter and energy flow, populations, selection and fossils (MS-LS2, MS-LS4)', ['food-web-builder', 'population-growth', 'predator-prey', 'natural-selection', 'carbon-cycle']),
        c(9, 'Earth and space systems', 'Seasons, moon phases, gravity in the solar system, plate tectonics, weather and water (MS-ESS1 to 3)', ['earth-seasons', 'moon-phase-simulator', 'kepler-orbits', 'water-cycle-sim', 'geological-time', 'cyclone-builder', 'plate-boundaries']),
        c(10, 'Climate and human impact', 'Human activity and Earth\'s systems, global temperature (MS-ESS3-3 to 5)', ['earth-energy-budget', 'carbon-footprint', 'carbon-cycle']),
      ] },
    ],
  },
  {
    id: 'us-grade-9', n: 9, name: 'US Grade 9', blurb: 'Usually Algebra 1 and a first high school science course (physical science or biology).',
    subjects: [
      { id: 'math', name: 'Maths', book: 'Algebra 1 (Common Core HS)', chapters: [
        c(1, 'Seeing structure in expressions', 'Terms, factors, equivalent forms, the number system with radicals (A-SSE, N-RN)', ['identity-tiles', 'factorise-steps', 'exponent-laws', 'rationalise-denominator', 'algebra-tricks', 'surds']),
        c(2, 'Creating and solving equations', 'Linear equations and inequalities in one variable, rearranging formulas (A-CED, A-REI.1-3)', ['balance-scale', 'linear-word-problems', 'inequality-shader']),
        c(3, 'Systems of equations and inequalities', 'Graphing and solving systems, half-planes (A-REI.5-7, 12)', ['two-variable-line', 'linear-pair-solver', 'inequality-shader', 'lpp-solver']),
        c(4, 'Linear, exponential and quadratic functions', 'Modelling with functions, growth and decay, vertex form (F-IF, F-LE, F-BF)', ['linear-explorer', 'function-gallery', 'doubling-power', 'quadratic-explorer', 'sequence-explorer']),
        c(5, 'Quadratics: factoring, completing the square, the formula', 'Zeros, factors, vertex and the quadratic formula (A-APR.3, A-REI.4)', ['quadratic-explorer', 'factorise-steps', 'polynomial-zeros']),
        c(6, 'Describing data', 'Dot plots, histograms, box plots, mean and spread, outliers (S-ID.1-3)', ['histogram-builder', 'box-plot-lab', 'spread-explorer', 'grouped-data-stats', 'cumulative-frequency']),
        c(7, 'Bivariate data', 'Scatter plots, fitted lines, residuals and correlation (S-ID.6-9)', ['scatter-best-fit']),
      ] },
      { id: 'science', name: 'Science', book: 'NGSS high school, physical science', chapters: [
        c(1, 'Structure and patterns of the periodic table', 'Electron arrangement and periodic trends, bonding (HS-PS1-1, 2, 3)', ['periodic-table', 'electron-configuration', 'periodic-trends', 'ionic-bond-dots', 'lewis-structures']),
        c(2, 'Chemical reactions and conservation of mass', 'Balancing equations, reaction types, amounts of reactants (HS-PS1-2, 5, 7)', ['equation-balancer', 'mole-bridge', 'limiting-reagent', 'reaction-type-sorter', 'ion-tests']),
        c(3, 'Motion and forces', 'Newton\'s second law, momentum conservation, gravity and electric forces (HS-PS2-1 to 6)', ['newtons-laws', 'free-body-diagram', 'collision-lab', 'motion-graphs', 'projectile-launcher', 'coulomb-forces']),
        c(4, 'Energy', 'Conservation of energy, energy in systems, energy transfer (HS-PS3-1 to 5)', ['energy-track', 'spring-energy', 'calorimetry-lab', 'heating-curve', 'cooling-curves']),
        c(5, 'Waves and technology', 'Wave properties, electromagnetic radiation, information transfer (HS-PS4-1 to 5)', ['travelling-wave', 'em-spectrum', 'echo-sonar', 'photoelectric-lab', 'ripple-tank']),
        c(6, 'Structure and function of cells', 'Cells, organs and systems that keep conditions stable (HS-LS1-2, 3)', ['cell-explorer', 'cell-membrane', 'osmosis-lab', 'hormone-feedback', 'microscope-magnification']),
        c(7, 'Energy and matter in cells', 'Photosynthesis, cellular respiration, building biomolecules (HS-LS1-5 to 7)', ['photosynthesis-lab', 'respiration-atp', 'biomolecule-tests', 'enzyme-activity']),
      ] },
    ],
  },
  {
    id: 'us-grade-10', n: 10, name: 'US Grade 10', blurb: 'Usually Geometry and Biology or Chemistry.',
    subjects: [
      { id: 'math', name: 'Maths', book: 'Geometry (Common Core HS)', chapters: [
        c(1, 'Congruence and rigid motions', 'Transformations as functions, congruence, constructions (G-CO)', ['rigid-motions', 'geometry-construction', 'midpoint-theorem', 'linear-pair-solver', 'triangle-congruence']),
        c(2, 'Similarity, right triangles and trigonometry', 'Dilations, similar triangles, trig ratios, Pythagoras (G-SRT)', ['similar-triangles', 'trig-ratios', 'heights-distances', 'pythagoras-proofs', 'unit-circle', 'bearings']),
        c(3, 'Circles', 'Arcs, angles, chords, sector area, radians (G-C)', ['circle-sector', 'radian-ruler', 'circle-slices', 'circle-theorems']),
        c(4, 'Coordinate geometry', 'Distance, midpoint, slope, equations of circles and parabolas (G-GPE)', ['coordinate-hunt', 'section-formula', 'coord-triangle', 'conic-explorer', 'two-variable-line']),
        c(5, 'Area, volume and modelling', 'Cross-sections, volume formulas, density, design problems (G-GMD, G-MG)', ['herons-formula', 'combined-solids', 'polygon-angle-sum', 'field-area']),
        c(6, 'Probability', 'Sample spaces, conditional probability, independence, rules (S-CP)', ['sample-space', 'venn-diagram', 'probability-tree', 'counting-machine']),
      ] },
      { id: 'science', name: 'Science', book: 'NGSS high school, life science and chemistry', chapters: [
        c(1, 'Heredity: inheritance and variation', 'DNA, genes, proteins, how traits pass on, mutation (HS-LS3-1 to 3)', ['central-dogma', 'mendel-peas', 'punnett-square', 'pedigree-analyser', 'polygenic-traits', 'copy-errors']),
        c(2, 'Cell division and growth', 'Mitosis, differentiation, DNA copying (HS-LS1-4)', ['cell-division', 'meselson-stahl']),
        c(3, 'Evolution: unity and diversity', 'Common ancestry, natural selection, adaptation, speciation (HS-LS4-1 to 6)', ['natural-selection', 'hardy-weinberg-tester', 'taxonomy-ladder', 'geological-time', 'classification-tree']),
        c(4, 'Ecosystems: interactions, energy and dynamics', 'Carrying capacity, energy flow, cycles of matter, ecosystem stability (HS-LS2-1 to 8)', ['population-growth', 'predator-prey', 'food-web-builder', 'carbon-cycle', 'nitrogen-cycle']),
        c(5, 'Chemical bonding and structure', 'Bond types, polarity, shapes, forces between molecules (HS-PS1-3)', ['vsepr-shapes', 'dipole-polarity', 'hydrogen-bonding', 'ionic-bond-dots']),
        c(6, 'Stoichiometry and the mole', 'Molar mass, mole ratios, limiting reagent, yield (HS-PS1-7)', ['molar-mass-calculator', 'mole-bridge', 'limiting-reagent', 'constant-proportions', 'percent-yield', 'empirical-formula']),
        c(7, 'Nuclear processes', 'Fission, fusion, radioactive decay and half-life (HS-PS1-8)', ['decay-dice', 'binding-energy', 'radiometric-age-calculator', 'fission-chain']),
      ] },
    ],
  },
  {
    id: 'us-grade-11', n: 11, name: 'US Grade 11', blurb: 'Usually Algebra 2 and Chemistry or Physics.',
    subjects: [
      { id: 'math', name: 'Maths', book: 'Algebra 2 (Common Core HS)', chapters: [
        c(1, 'Complex numbers and polynomials', 'Complex plane, polynomial identities, zeros and the remainder theorem (N-CN, A-APR)', ['argand-plane', 'polynomial-zeros', 'binomial-expansion', 'factorise-steps']),
        c(2, 'Exponential and logarithmic functions', 'Growth and decay, logs as inverses, compound interest, e (F-LE, F-BF)', ['e-and-ln', 'doubling-power', 'function-gallery', 'population-growth']),
        c(3, 'Trigonometric functions', 'Unit circle, radians, graphs of sine and cosine, modelling periodic data (F-TF)', ['unit-circle', 'radian-ruler', 'trig-ratios', 'shm-circle', 'ferris-wheel']),
        c(4, 'Rational, radical and other functions', 'Transformations, inverse, rational expressions and equations (A-REI.2, F-BF.3-4)', ['function-gallery', 'function-type', 'relation-checker', 'rationalise-denominator']),
        c(5, 'Sequences and series', 'Arithmetic and geometric sequences, sums (F-BF.2, A-SSE.4)', ['sequence-explorer', 'gp-explorer', 'iteration']),
        c(6, 'Normal distribution', 'Mean, standard deviation, z-scores, the empirical rule (S-ID.4)', ['normal-curve-lab', 'spread-explorer', 'random-variable']),
        c(7, 'Sampling and margin of error', 'Samples, surveys, experiments and simulations (S-IC)', ['margin-of-error-sim', 'normal-curve-lab', 'hypothesis-tests']),
      ] },
      { id: 'science', name: 'Science', book: 'NGSS high school, chemistry', chapters: [
        c(1, 'Reaction rates and chemical equilibrium', 'Rate factors, Le Chatelier, equilibrium (HS-PS1-4, 5, 6)', ['le-chatelier', 'equilibrium-solver', 'gibbs-explorer', 'ksp-precipitation']),
        c(2, 'Energy in chemical processes', 'Bond energy, enthalpy, calorimetry (HS-PS1-4, HS-PS3-4)', ['bond-enthalpy', 'calorimetry-lab', 'bomb-calorimeter', 'thermochemistry-calculator']),
        c(3, 'Acids, bases and solutions', 'pH, strength, concentration, titration (HS-PS1-5)', ['ph-scale-explorer', 'titration-curve', 'acid-base-interpreter', 'solution-calculator', 'concentration-converter']),
        c(4, 'Gases and the kinetic theory', 'Pressure, volume, temperature, moles (HS-PS1-3, HS-PS3-2)', ['gas-law-calculator', 'kinetic-theory', 'mean-free-path']),
        c(5, 'Electrochemistry', 'Redox, galvanic cells, corrosion (HS-PS1-2, 4)', ['oxidation-number', 'galvanic-cell', 'reactivity-series', 'rusting-lab', 'electrolysis-lab']),
        c(6, 'Organic chemistry and the molecules of life', 'Carbon chains, functional groups, polymers, biomolecules (HS-PS1-3, HS-LS1-6)', ['carbon-chain-namer', 'isomer-explorer', 'sugar-structures', 'protein-structure', 'organic-reaction-map', 'crude-oil-fractions']),
      ] },
    ],
  },
  {
    id: 'us-grade-12', n: 12, name: 'US Grade 12', blurb: 'Usually Precalculus, Statistics or AP Calculus, and Physics or Earth and space science.',
    subjects: [
      { id: 'math', name: 'Maths', book: 'Precalculus, Statistics, Calculus', chapters: [
        c(1, 'Advanced functions and trigonometry', 'Compound angles, inverse trig, polar and complex form (F-TF, N-CN)', ['compound-angle', 'inverse-trig', 'argand-plane', 'unit-circle']),
        c(2, 'Vectors and matrices', 'Vectors, matrix operations and transformations (N-VM)', ['vector-adder', 'vector-lab-3d', 'matrix-transform', 'points-3d']),
        c(3, 'Limits and derivatives', 'Limits, slope of a curve, differentiation rules, applications (AP Calculus AB)', ['limit-zoom', 'derivative-slope', 'derivative-steps', 'chain-rule', 'related-rates', 'maxima-minima']),
        c(4, 'Integrals', 'Area under a curve, Riemann sums, antiderivatives (AP Calculus AB)', ['riemann-sums', 'integration-coach', 'integral-properties', 'slope-field']),
        c(5, 'Statistics: distributions and inference', 'Normal curve, sampling, margin of error, hypothesis tests (AP Statistics)', ['normal-curve-lab', 'margin-of-error-sim', 'hypothesis-tests', 'box-plot-lab']),
        c(6, 'Regression and modelling', 'Fitting lines and curves to data, residuals (S-ID.6, AP Statistics)', ['scatter-best-fit', 'regression-workbench', 'curve-fitter']),
      ] },
      { id: 'science', name: 'Science', book: 'NGSS high school, physics and Earth and space science', chapters: [
        c(1, 'Forces, momentum and gravitation', 'Newton\'s laws, orbits, impulse (HS-PS2, HS-ESS1-4)', ['newtons-laws', 'collision-lab', 'kepler-orbits', 'banked-curve', 'vertical-circle']),
        c(2, 'Electricity and magnetism', 'Circuits, fields, induction (HS-PS2-4, 5; HS-PS3-5)', ['ohms-law-lab', 'series-parallel', 'kirchhoff-solver', 'capacitor-lab', 'faraday-induction', 'electromagnet-builder', 'iv-characteristics']),
        c(3, 'Waves, light and modern physics', 'Interference, the photoelectric effect, the spectrum, wave-particle ideas (HS-PS4)', ['double-slit', 'photoelectric-lab', 'hydrogen-spectrum', 'rutherford-scattering', 'em-spectrum']),
        c(4, 'Stars and the universe', 'Stellar life cycle, fusion, light from stars, the expanding universe (HS-ESS1-1 to 3)', ['hr-diagram', 'redshift-calculator', 'kepler-orbits', 'hydrogen-spectrum', 'binding-energy']),
        c(5, 'Earth\'s history and systems', 'Radiometric dating, plate tectonics, feedbacks between Earth systems (HS-ESS1-5, 6; HS-ESS2)', ['radiometric-age-calculator', 'geological-time', 'earthquake-locator', 'earth-energy-budget', 'plate-boundaries']),
        c(6, 'Climate, resources and human impact', 'Energy balance, carbon, natural resources, sustainability (HS-ESS2-4, HS-ESS3)', ['energy-balance-model', 'carbon-cycle', 'carbon-footprint', 'earth-energy-budget', 'wind-energy-yield']),
      ] },
    ],
  },
];
