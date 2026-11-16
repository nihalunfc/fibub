// Canada's most used public curriculum: Ontario (the largest province), Grade 8 to 12 science and maths.
// Education in Canada is set by each province, so Canada's map starts with Ontario; British Columbia and
// Alberta can be added the same way later. Chapters here are the strands (units) of the Ministry of Education
// course outlines, named in our own short words: fibub is not part of the Ontario government and copies no
// curriculum text, textbook text or figures. Course codes are public (Ministry of Education course codes).
// Same shape as src/data/ncert.ts; a tool id that is not live yet is simply left out of the page.
import type { Chapter, SchoolClass } from './ncert';

const c = (n: number, title: string, topics: string, tools: string[] = []): Chapter => ({ n, title, topics, tools });

export const ONTARIO_CLASSES: SchoolClass[] = [
  {
    id: 'ontario-grade-8', n: 8, name: 'Ontario Grade 8', blurb: 'Science and Technology, and Mathematics.',
    subjects: [
      { id: 'science', name: 'Science and Technology', chapters: [
        c(1, 'STEM skills and coding', 'Fair tests, measuring, graphs, coding and design', ['fair-test-planner', 'plot-maker', 'sig-fig-checker', 'flowchart-runner', 'algorithm-stepper']),
        c(2, 'Cells', 'Cells as the units of life, microscopes, cell parts and tissues', ['cell-explorer', 'virtual-microscope', 'microscope-telescope', 'microscope-magnification']),
        c(3, 'Systems in living things', 'Human body systems and how they work together', ['heart-circulation', 'digestion-journey', 'nephron-filter']),
        c(4, 'Fluids', 'Density, viscosity, pressure and buoyancy', ['liquid-pressure', 'hydraulic-lift', 'buoyancy-lab', 'pressure-explorer', 'density-lab']),
        c(5, 'Water systems', 'The water cycle, the Great Lakes, and how people affect water', ['water-cycle-sim']),
      ] },
      { id: 'maths', name: 'Mathematics', chapters: [
        c(1, 'Number', 'Rational numbers, powers, ratios, rates and percents', ['exponent-laws', 'percentage-bar', 'ratio-mixer', 'number-line-zoom']),
        c(2, 'Algebra', 'Variables, equations, patterns and coding', ['balance-scale', 'linear-word-problems', 'algebra-tricks']),
        c(3, 'Data', 'Collecting and showing data, mean, median, probability', ['histogram-builder', 'spread-explorer', 'sample-space', 'spinner-designer']),
        c(4, 'Spatial sense', 'Volume, area, angles, the Pythagorean theorem and transformations', ['pythagoras-proofs', 'combined-solids', 'tessellation-studio', 'similar-triangles']),
        c(5, 'Financial literacy', 'Budgets, simple and compound interest, and saving', ['compound-interest', 'power-bill']),
      ] },
    ],
  },
  {
    id: 'ontario-grade-9', n: 9, name: 'Ontario Grade 9', blurb: 'Science (SNC1W) and Mathematics (MTH1W).',
    subjects: [
      { id: 'science', name: 'Science', book: 'SNC1W', chapters: [
        c(1, 'Scientific investigation skills', 'Questions, fair tests, data, graphs and conclusions', ['fair-test-planner', 'plot-maker', 'sig-fig-checker']),
        c(2, 'Biology: ecosystems and sustainability', 'Food webs, cycles of matter, populations and human impact', ['food-web-builder', 'carbon-cycle', 'nitrogen-cycle', 'population-growth', 'predator-prey', 'biodiversity-indices']),
        c(3, 'Chemistry: atoms, elements and compounds', 'Atoms, the periodic table, chemical and physical properties', ['build-an-atom', 'periodic-table', 'matter-sorter', 'electron-configuration', 'ionic-bond-dots', 'periodic-trends']),
        c(4, 'Physics: electricity', 'Static and current electricity, circuits, Ohm\'s law, power', ['static-charge', 'simple-circuit-lab', 'ohms-law-lab', 'series-parallel', 'power-bill', 'iv-characteristics']),
        c(5, 'Earth and space: the universe', 'Stars, galaxies, the solar system and how we study space', ['kepler-orbits', 'moon-phase-simulator', 'sky-tonight']),
      ] },
      { id: 'maths', name: 'Mathematics', book: 'MTH1W', chapters: [
        c(1, 'Number', 'Rational numbers, exponents, ratios, rates and proportions', ['exponent-laws', 'percentage-bar', 'ratio-mixer', 'proportion-grapher', 'standard-form-ladder']),
        c(2, 'Algebra', 'Expressions, linear equations and relations, graphing lines', ['algebra-tricks', 'linear-explorer', 'two-variable-line', 'linear-word-problems', 'identity-tiles', 'factorise-steps']),
        c(3, 'Data', 'Collecting data, scatter plots, line of best fit, probability', ['histogram-builder', 'spread-explorer', 'regression-workbench', 'sample-space', 'probability-tree']),
        c(4, 'Geometry and measurement', 'Angles, area, volume, circles and the Pythagorean theorem', ['pythagoras-proofs', 'polygon-angle-sum', 'circle-sector', 'combined-solids', 'similar-triangles', 'circle-theorems']),
        c(5, 'Financial literacy', 'Simple and compound interest, borrowing and saving', ['compound-interest', 'loan-payoff-planner']),
      ] },
    ],
  },
  {
    id: 'ontario-grade-10', n: 10, name: 'Ontario Grade 10', blurb: 'Science (SNC2D) and Mathematics (MPM2D).',
    subjects: [
      { id: 'science', name: 'Science', book: 'SNC2D', chapters: [
        c(1, 'Biology: tissues, organs and systems', 'Cell division, tissues, organs and organ systems', ['cell-division', 'tissue-identifier', 'cell-explorer', 'heart-circulation', 'digestion-journey', 'microscope-magnification']),
        c(2, 'Chemistry: chemical reactions', 'Balancing equations, reaction types, acids and bases', ['equation-balancer', 'reaction-type-sorter', 'ph-scale-explorer', 'reactivity-series', 'formula-writer', 'rusting-lab']),
        c(3, 'Earth and space: climate change', 'Greenhouse effect, the energy balance and human impact', ['earth-energy-budget', 'energy-balance-model', 'carbon-footprint', 'carbon-cycle']),
        c(4, 'Physics: light and geometric optics', 'Reflection, refraction, mirrors and lenses', ['mirror-ray-diagram', 'lens-ray-diagram', 'snell-law', 'plane-mirror-lab', 'prism-dispersion', 'eye-defects']),
      ] },
      { id: 'maths', name: 'Mathematics', book: 'MPM2D', chapters: [
        c(1, 'Quadratic relations', 'Factoring, vertex form, solving quadratics and graphing parabolas', ['quadratic-explorer', 'factorise-steps', 'polynomial-zeros', 'identity-tiles']),
        c(2, 'Analytic geometry', 'Distance, midpoint, equations of lines and circles', ['line-forms', 'coord-triangle', 'section-formula', 'conic-explorer']),
        c(3, 'Trigonometry', 'Right triangles, then the sine law and cosine law', ['trig-ratios', 'heights-distances', 'sine-cosine-law', 'unit-circle', 'bearings']),
        c(4, 'Similar triangles', 'Similarity, proportional sides and applications', ['similar-triangles', 'midpoint-theorem']),
      ] },
    ],
  },
  {
    id: 'ontario-grade-11', n: 11, name: 'Ontario Grade 11', blurb: 'Physics (SPH3U), chemistry (SCH3U), biology (SBI3U) and functions (MCR3U).',
    subjects: [
      { id: 'physics', name: 'Physics', book: 'SPH3U', chapters: [
        c(1, 'Kinematics', 'Position, velocity, acceleration and motion graphs', ['motion-graphs', 'equations-of-motion', 'free-fall', 'distance-displacement', 'projectile-launcher']),
        c(2, 'Forces', 'Newton\'s laws, free-body diagrams, friction', ['newtons-laws', 'free-body-diagram', 'friction-ramp', 'vector-adder', 'inertia-demos']),
        c(3, 'Energy and society', 'Work, kinetic and potential energy, efficiency, power', ['energy-track', 'spring-energy', 'simple-machines', 'power-bill', 'fission-chain', 'cooling-curves']),
        c(4, 'Waves and sound', 'Waves, sound, the Doppler effect and resonance', ['travelling-wave', 'sound-wave-visualiser', 'beats-lab', 'resonance-tube', 'echo-sonar', 'hearing-range', 'ripple-tank']),
        c(5, 'Gravitation and electricity', 'Gravity, electric charge, circuits and magnetism', ['kepler-orbits', 'coulomb-forces', 'ohms-law-lab', 'series-parallel', 'kirchhoff-solver', 'iv-characteristics']),
      ] },
      { id: 'chemistry', name: 'Chemistry', book: 'SCH3U', chapters: [
        c(1, 'Matter, chemical trends and bonding', 'Atomic structure, periodic trends, ionic and covalent bonds', ['electron-configuration', 'periodic-trends', 'ionic-bond-dots', 'lewis-structures', 'vsepr-shapes', 'dipole-polarity']),
        c(2, 'Chemical reactions', 'Types of reactions, balancing and predicting products', ['equation-balancer', 'reaction-type-sorter', 'reactivity-series', 'formula-writer']),
        c(3, 'Quantities in chemical reactions', 'The mole, molar mass, stoichiometry, limiting reagents', ['mole-bridge', 'mass-balance-solver', 'constant-proportions', 'reaction-equivalents', 'empirical-formula', 'percent-yield']),
        c(4, 'Solutions and solubility', 'Concentration, dilution, solubility and precipitates', ['solution-calculator', 'concentration-converter', 'ksp-precipitation', 'dissolving-lab', 'ion-tests']),
        c(5, 'Gases and atmospheric chemistry', 'Gas laws, pressure and the atmosphere', ['kinetic-theory', 'henrys-law', 'standard-atmosphere']),
      ] },
      { id: 'biology', name: 'Biology', book: 'SBI3U', chapters: [
        c(1, 'Diversity of living things', 'Classification, taxonomy and evolution', ['classification-tree', 'taxonomy-ladder', 'dichotomous-key', 'natural-selection', 'five-kingdoms']),
        c(2, 'Evolution', 'Natural selection, adaptation and evidence for change', ['natural-selection', 'geological-time']),
        c(3, 'Genetic processes', 'DNA, cell division, inheritance and mutation', ['mendel-peas', 'pedigree-analyser', 'cell-division', 'central-dogma', 'copy-errors']),
        c(4, 'Animals: structure and function', 'Digestion, circulation, respiration and exchange', ['digestion-journey', 'heart-circulation', 'cardiac-cycle', 'oxygen-dissociation']),
        c(5, 'Plants: anatomy, growth and function', 'Transport, photosynthesis, growth and tropisms', ['transpiration-lab', 'photosynthesis-lab', 'phototropism', 'flower-parts']),
      ] },
      { id: 'maths', name: 'Mathematics (Functions)', book: 'MCR3U', chapters: [
        c(1, 'Characteristics of functions', 'Function notation, domain and range, transformations', ['function-gallery', 'function-type', 'relation-checker', 'quadratic-explorer', 'surds']),
        c(2, 'Exponential functions', 'Growth and decay, exponent laws, modelling', ['exponent-laws', 'doubling-power', 'e-and-ln', 'log-exp-explorer']),
        c(3, 'Trigonometric functions', 'Sine and cosine law, radians, sinusoidal functions', ['sine-cosine-law', 'radian-ruler', 'unit-circle', 'trig-ratios', 'ferris-wheel']),
        c(4, 'Discrete functions', 'Sequences, series and financial applications', ['sequence-explorer', 'gp-explorer', 'compound-interest', 'mortgage-calculator']),
      ] },
    ],
  },
  {
    id: 'ontario-grade-12', n: 12, name: 'Ontario Grade 12', blurb: 'Physics (SPH4U), chemistry (SCH4U), biology (SBI4U), advanced functions, calculus and data management.',
    subjects: [
      { id: 'physics', name: 'Physics', book: 'SPH4U', chapters: [
        c(1, 'Dynamics', 'Forces, vectors and motion in two dimensions', ['vector-adder', 'projectile-launcher', 'newtons-laws', 'banked-curve', 'collision-lab']),
        c(2, 'Energy and momentum', 'Work, energy, momentum and collisions', ['collision-carts', 'collision-lab', 'spring-energy', 'centre-of-mass']),
        c(3, 'Gravitational, electric and magnetic fields', 'Fields, potential, magnetic force and induction', ['gauss-law', 'magnetic-field-mapper', 'lorentz-motion', 'faraday-induction', 'capacitor-lab']),
        c(4, 'Circular motion and simple harmonic motion', 'Circular motion, springs, pendulums and orbits', ['pendulum-lab', 'spring-mass', 'shm-circle', 'vertical-circle', 'kepler-orbits']),
        c(5, 'The wave nature of light and quantum mechanics', 'Interference, the photoelectric effect and atoms', ['double-slit', 'photoelectric-lab', 'hydrogen-spectrum', 'huygens-wavelets', 'rutherford-scattering']),
      ] },
      { id: 'chemistry', name: 'Chemistry', book: 'SCH4U', chapters: [
        c(1, 'Organic chemistry', 'Hydrocarbons, functional groups, isomers and reactions', ['carbon-chain-namer', 'isomer-explorer', 'organic-reaction-map', 'esterification', 'markovnikov-addition', 'crude-oil-fractions']),
        c(2, 'Structure and properties of matter', 'Bonding, intermolecular forces and molecular shape', ['vsepr-shapes', 'dipole-polarity', 'hydrogen-bonding', 'lewis-structures']),
        c(3, 'Energy changes and rates of reaction', 'Enthalpy, calorimetry, rates and mechanisms', ['bond-enthalpy', 'bomb-calorimeter', 'heating-curve', 'gibbs-explorer']),
        c(4, 'Chemical systems and equilibrium', 'Equilibrium, Le Chatelier\'s principle and the equilibrium constant', ['le-chatelier', 'ksp-precipitation']),
        c(5, 'Electrochemistry', 'Redox, galvanic cells and electrolysis', ['galvanic-cell', 'oxidation-number', 'rusting-lab', 'chlor-alkali', 'electrolysis-lab']),
      ] },
      { id: 'biology', name: 'Biology', book: 'SBI4U', chapters: [
        c(1, 'Biochemistry', 'Biological molecules, enzymes and metabolism', ['enzyme-activity', 'protein-structure', 'sugar-structures', 'biomolecule-tests']),
        c(2, 'Metabolic processes', 'Cellular respiration and photosynthesis', ['respiration-atp', 'respiration-pathways', 'photosynthesis-lab', 'calvin-c4', 'z-scheme']),
        c(3, 'Molecular genetics', 'DNA replication, transcription, translation and gene control', ['central-dogma', 'meselson-stahl', 'lac-operon', 'recombinant-insulin']),
        c(4, 'Homeostasis', 'Feedback, the nervous system, kidneys and hormones', ['hormone-feedback', 'nephron-filter', 'action-potential', 'brain-map']),
        c(5, 'Population dynamics and sustainability', 'Growth models, interactions and biodiversity', ['population-growth', 'predator-prey', 'biodiversity-indices']),
      ] },
      { id: 'functions', name: 'Advanced Functions', book: 'MHF4U', chapters: [
        c(1, 'Polynomial and rational functions', 'Factoring, zeros, end behaviour, asymptotes', ['polynomial-zeros', 'factorise-steps', 'rational-explorer', 'iteration']),
        c(2, 'Exponential and logarithmic functions', 'Logarithms, laws of logarithms and modelling', ['log-exp-explorer', 'e-and-ln', 'log-scale-calculator']),
        c(3, 'Trigonometric functions', 'Radians, sinusoidal functions, identities', ['radian-ruler', 'unit-circle', 'compound-angle', 'inverse-trig']),
        c(4, 'Characteristics of functions', 'Rates of change, combining and transforming functions', ['function-gallery', 'derivative-slope', 'limit-zoom']),
      ] },
      { id: 'calculus', name: 'Calculus and Vectors', book: 'MCV4U', chapters: [
        c(1, 'Rates of change and limits', 'Average and instantaneous rates, limits', ['limit-zoom', 'derivative-slope']),
        c(2, 'Derivatives and their applications', 'Power, product, quotient and chain rules; optimisation', ['derivative-steps', 'chain-rule', 'maxima-minima', 'related-rates']),
        c(3, 'Geometry and algebra of vectors', 'Vectors in 2D and 3D, dot and cross products, lines and planes', ['vector-adder', 'vector-lab-3d', 'points-3d']),
      ] },
      { id: 'data', name: 'Mathematics of Data Management', book: 'MDM4U', chapters: [
        c(1, 'Counting and probability', 'Permutations, combinations, probability rules', ['probability-tree', 'event-algebra', 'sample-space', 'binomial-expansion']),
        c(2, 'Probability distributions', 'Discrete and normal distributions, expected value', ['random-variable', 'distribution-explorer']),
        c(3, 'Organisation of data for analysis', 'Statistics, correlation, regression and sampling', ['spread-explorer', 'grouped-data-stats', 'regression-workbench', 'histogram-builder', 'cumulative-frequency']),
      ] },
    ],
  },
];
