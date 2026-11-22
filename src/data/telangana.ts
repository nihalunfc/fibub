// Telangana state syllabus (SCERT Telangana, SSC board), Class 8 to 10 science and maths. Same shape as
// src/data/ncert.ts; a tool id that is not live yet is left out of the page.
//
// Telangana writes its own books: each class has separate Physical Science and Biological Science books and
// a Mathematics book (Class 8 maths in two parts). The 2026-27 books are the ones in use since the 2013
// series, reprinted. The state has proposed moving maths and science to the NCERT books from 2027-28
// (Telangana Today, January 2026); if that happens, these pages will point to the NCERT ones instead.
// Sources (checked 2026-11-22): contents pages of the official SCERT Telangana PDFs (scert.telangana.gov.in)
// for Class 8 Maths Part 1, Class 8 Biological Science, Class 9 Physical Science and Class 10 Maths; the rest
// matched across two independent study sites (Embibe with Supertutor, Byju's or Selfstudys) that agree.
// Only chapter titles and our own short topic lines are used: fibub is not part of SCERT Telangana or the
// Government of Telangana and copies no textbook text or figures.
import type { Chapter, SchoolClass } from './ncert';

const c = (n: number, title: string, topics: string, tools: string[] = []): Chapter => ({ n, title, topics, tools });

export const TELANGANA_CLASSES: SchoolClass[] = [
  {
    id: 'telangana-class-8', n: 8, name: 'Telangana Class 8', blurb: 'Physical Science, Biological Science and Mathematics (SCERT Telangana).',
    subjects: [
      { id: 'physical-science', name: 'Physical Science', chapters: [
        c(1, 'Force', 'Pushes and pulls, contact and non-contact forces, pressure', ['newtons-laws', 'tug-of-war-forces', 'pressure-explorer', 'liquid-pressure', 'static-charge']),
        c(2, 'Friction', 'Why surfaces resist sliding, kinds of friction, using and reducing it', ['friction-ramp', 'inertia-demos']),
        c(3, 'Synthetic Fibres and Plastics', 'Man-made fibres and plastics, their uses and their waste', ['carbon-chain-namer', 'molecule-viewer']),
        c(4, 'Metals and Non-Metals', 'Properties, reactions and uses of metals and non-metals', ['reactivity-series', 'periodic-trends', 'alloy-mixer', 'rusting-lab']),
        c(5, 'Sound', 'Vibrations, how sound travels, pitch, loudness, the ear and noise', ['sound-wave-visualiser', 'hearing-range', 'decibel-distance', 'echo-sonar']),
        c(6, 'Reflection of Light at Plane Surfaces', 'Laws of reflection, mirror images, periscopes and kaleidoscopes', ['plane-mirror-lab', 'mirror-ray-diagram']),
        c(7, 'Coal and Petroleum', 'Fossil fuels, how they formed, refining and saving them', ['carbon-cycle', 'carbon-footprint', 'carbon-chain-namer']),
        c(8, 'Combustion, Fuels and Flame', 'What burning needs, kinds of fuel, flame zones, fuel value', ['bomb-calorimeter', 'bond-enthalpy', 'reaction-type-sorter']),
        c(9, 'Electrical Conductivity of Liquids', 'Which liquids conduct, electrolysis and electroplating', ['electrolysis-lab', 'electroplating-calculator', 'simple-circuit-lab']),
        c(10, 'Some Natural Phenomena', 'Lightning, static charge and earthquakes, keeping safe', ['static-charge', 'coulomb-forces', 'faraday-cage']),
        c(11, 'Stars and the Solar System', 'Planets, constellations, Moon phases, the Sun and stars', ['sky-tonight', 'moon-phase-simulator', 'kepler-orbits', 'planet-data-explorer']),
        c(12, 'Graphs of Motion', 'Distance-time graphs and reading speed from them', ['motion-graphs', 'distance-displacement', 'plot-maker']),
      ] },
      { id: 'biology', name: 'Biological Science', chapters: [
        c(1, 'What is Science?', 'Asking questions, observing, testing and recording', ['fair-test-planner', 'plot-maker', 'sig-fig-checker']),
        c(2, 'Cell - The Basic Unit of Life', 'Cell parts, plant and animal cells, seeing cells', ['cell-explorer', 'virtual-microscope', 'microscope-magnification']),
        c(3, 'The World of Microorganisms', 'Bacteria, viruses, fungi and protozoa, useful and harmful', ['microbe-growth', 'gram-stain-key', 'growth-curve-od600', 'antibiotic-zones']),
        c(4, 'Reproduction in Animals', 'Sexual and asexual reproduction, fertilisation, life cycles', ['reproduction-modes', 'life-cycle-wheel', 'cell-division']),
        c(5, 'The Age of Adolescence', 'Body changes, hormones and healthy habits in the teenage years', ['hormone-feedback', 'sex-determination']),
        c(6, 'Biodiversity and its Conservation', 'Variety of life, endangered species, protected areas', ['biodiversity-indices', 'mark-recapture', 'five-kingdoms']),
        c(7, 'Different Ecosystems', 'Ponds, forests and grasslands, food chains and webs', ['food-web-builder', 'predator-prey', 'quadrat-transect-analyser']),
        c(8, 'Production of Food from Plants', 'Crops, irrigation, soil, manure, storage and crop protection', ['soil-texture-triangle', 'fertiliser-blend-calculator', 'nitrogen-cycle', 'seeding-rate-calculator']),
        c(9, 'Production of Food from Animals', 'Dairy, poultry, fish and caring for farm animals', ['feed-ration-balancer', 'population-growth']),
        c(10, 'Not for Breathing Not for Drinking', 'Air and water pollution: causes, effects and fixes', ['air-quality-calculator', 'water-quality-index', 'greenhouse-heating']),
        c(11, 'Why do we fall ill?', 'Causes and spread of disease, prevention and vaccines', ['infection-spread-sim', 'epidemic-model', 'herd-immunity', 'hand-washing']),
      ] },
      { id: 'maths', name: 'Mathematics', book: 'Parts 1 and 2', chapters: [
        c(1, 'Rational Numbers', 'Fractions with signs on the number line, operations and properties', ['rational-explorer', 'number-line-zoom']),
        c(2, 'Linear Equations in One Variable', 'Forming and solving one-unknown equations', ['balance-scale', 'linear-word-problems']),
        c(3, 'Construction of Quadrilaterals', 'Drawing quadrilaterals from given sides, angles and diagonals', ['geometry-construction', 'quadrilateral-explorer']),
        c(4, 'Exponents and Powers', 'Laws of exponents, very large and very small numbers', ['exponent-laws', 'standard-form-ladder', 'scientific-notation-formatter']),
        c(5, 'Comparing Quantities using Proportion', 'Percentages, profit, discount, tax and interest', ['percentage-bar', 'percentage-calculator', 'compound-interest']),
        c(6, 'Square Roots and Cube Roots', 'Perfect squares and cubes and finding their roots', ['square-cube-builder', 'square-root-finder']),
        c(7, 'Frequency Distribution Tables and Graphs', 'Grouping data, tally marks and histograms', ['grouped-data-stats', 'histogram-builder']),
        c(8, 'Exploring Geometrical Figures', 'Polygons, angles and special quadrilaterals', ['polygon-angle-sum', 'quadrilateral-explorer', 'rigid-motions']),
        c(9, 'Area of Plane Figures', 'Areas of triangles, trapeziums, circles and their parts', ['field-area', 'circle-slices', 'circle-sector']),
        c(10, 'Direct and Inverse Proportions', 'Quantities that change together or opposite ways', ['proportion-grapher', 'ratio-mixer']),
        c(11, 'Algebraic Expressions', 'Terms, identities and multiplying expressions', ['identity-tiles', 'multiplication-area']),
        c(12, 'Factorisation', 'Splitting expressions into factors', ['factorise-steps', 'identity-tiles']),
        c(13, 'Visualising 3-D in 2-D', 'Nets and views of solids, faces, edges and vertices', ['polyhedron-viewer', 'points-3d']),
        c(14, 'Surface Areas and Volume (Cube and Cuboid)', 'Outside area and space inside boxes', ['solids-lab']),
        c(15, 'Playing with Numbers', 'Digit puzzles, divisibility tests and patterns', ['divisibility-tests', 'number-theory-toolkit', 'kaprekar-magic-square']),
      ] },
    ],
  },
  {
    id: 'telangana-class-9', n: 9, name: 'Telangana Class 9', blurb: 'Physical Science, Biological Science and Mathematics (SCERT Telangana).',
    subjects: [
      { id: 'physical-science', name: 'Physical Science', chapters: [
        c(1, 'Matter around Us', 'States of matter, particles and changes of state', ['states-of-matter', 'kinetic-theory', 'heating-curve', 'random-walk-diffusion']),
        c(2, 'Motion', 'Distance, displacement, speed, velocity, acceleration and the equations of motion', ['distance-displacement', 'motion-graphs', 'equations-of-motion', 'vertical-circle']),
        c(3, 'Laws of Motion', 'Newton\'s three laws, inertia and momentum', ['newtons-laws', 'inertia-demos', 'collision-carts', 'collision-calculator']),
        c(4, 'Refraction of Light at Plane Surfaces', 'Bending of light, refractive index, glass slabs, total internal reflection', ['snell-law', 'optical-fibre', 'huygens-wavelets']),
        c(5, 'Gravitation', 'Universal gravitation, free fall, mass and weight', ['free-fall', 'kepler-orbits', 'gravity-height-depth', 'planet-data-explorer']),
        c(6, 'Is Matter Pure?', 'Mixtures, solutions and how to separate them', ['separation-lab', 'matter-sorter', 'tyndall-effect', 'solution-calculator']),
        c(7, 'Atoms, Molecules and Chemical Reactions', 'Laws of chemical combination, formulas and the mole', ['constant-proportions', 'formula-writer', 'mole-bridge', 'molar-mass-calculator']),
        c(8, 'Floating Bodies', 'Pressure in liquids, buoyancy, density and floating', ['buoyancy-lab', 'density-lab', 'liquid-pressure']),
        c(9, 'What is inside the Atom?', 'Electrons, protons, neutrons and atomic models', ['build-an-atom', 'rutherford-scattering', 'electron-configuration']),
        c(10, 'Work and Energy', 'Work, kinetic and potential energy, power, conservation', ['energy-track', 'variable-force-work', 'energy-stores', 'pendulum-lab']),
        c(11, 'Heat', 'Temperature, heat flow, specific heat and evaporation', ['temperature-scales', 'calorimetry-lab', 'heat-conduction', 'heating-curve']),
        c(12, 'Sound', 'Sound waves, echo, the speed of sound, hearing range', ['sound-wave-visualiser', 'travelling-wave', 'echo-sonar', 'hearing-range']),
      ] },
      { id: 'biology', name: 'Biological Science', chapters: [
        c(1, 'Cell - Structure and Functions', 'Cell parts and the jobs they do', ['cell-explorer', 'virtual-microscope', 'cell-membrane']),
        c(2, 'Plant Tissues', 'Growing and permanent tissues in plants', ['tissue-identifier', 'virtual-microscope']),
        c(3, 'Animal Tissues', 'Epithelial, connective, muscle and nerve tissue', ['tissue-identifier', 'sliding-filament']),
        c(4, 'Transportation of materials through Plasma Membrane', 'Diffusion, osmosis and active transport', ['osmosis-lab', 'cell-membrane', 'random-walk-diffusion']),
        c(5, 'Diversity in Living Organisms - Classification', 'Grouping living things, kingdoms and naming', ['classification-tree', 'five-kingdoms', 'taxonomy-ladder', 'dichotomous-key']),
        c(6, 'Sense Organs', 'Eye, ear, nose, tongue and skin', ['eye-defects', 'hearing-range', 'reaction-time-test']),
        c(7, 'Animal Behaviour', 'Instinct, learning and social behaviour', ['reaction-time-experiments']),
        c(8, 'Challenges in Improving Agricultural Production', 'Crop yield, manure, fertilisers and better farming', ['fertiliser-blend-calculator', 'soil-texture-triangle', 'nitrogen-cycle', 'plant-growth-analysis']),
        c(9, 'Adaptations in Different Ecosystems', 'How living things suit deserts, water and cold places', ['natural-selection', 'food-web-builder']),
        c(10, 'Soil Pollution', 'Where soil pollution comes from, its effects and prevention', ['soil-test-interpreter', 'bioaccumulation-factor']),
        c(11, 'Biogeochemical Cycles', 'Carbon, nitrogen and water cycles', ['carbon-cycle', 'nitrogen-cycle', 'water-cycle-sim']),
      ] },
      { id: 'maths', name: 'Mathematics', chapters: [
        c(1, 'Real Numbers', 'Rational and irrational numbers, decimals and the number line', ['number-systems', 'root-spiral', 'irrational-proof', 'surds']),
        c(2, 'Polynomials and Factorisation', 'Zeroes, the remainder theorem and factorising', ['polynomial-zeros', 'factorise-steps', 'identity-tiles']),
        c(3, 'The Elements of Geometry', 'Euclid\'s basic terms, axioms and postulates', ['geometry-construction', 'converse-checker']),
        c(4, 'Lines and Angles', 'Angle pairs, parallel lines and the angle sum', ['linear-pair-solver', 'polygon-angle-sum']),
        c(5, 'Co-Ordinate Geometry', 'Plotting points in four quadrants', ['coordinate-hunt']),
        c(6, 'Linear Equations in Two Variables', 'Solutions as points, graphs of straight lines', ['two-variable-line', 'linear-explorer']),
        c(7, 'Triangles', 'Congruence rules and triangle properties', ['triangle-congruence', 'rigid-motions']),
        c(8, 'Quadrilaterals', 'Parallelograms and the mid-point theorem', ['quadrilateral-explorer', 'midpoint-theorem']),
        c(9, 'Statistics', 'Collecting data, mean, median and mode', ['grouped-data-stats', 'spread-explorer', 'histogram-builder']),
        c(10, 'Surface Areas and Volumes', 'Cuboids, cylinders, cones and spheres', ['solids-lab', 'combined-solids']),
        c(11, 'Areas', 'Areas of parallelograms and triangles on the same base', ['area-shear', 'herons-formula']),
        c(12, 'Circles', 'Chords, arcs and angles in a circle', ['circle-theorems']),
        c(13, 'Geometrical Constructions', 'Ruler and compass constructions', ['geometry-construction']),
        c(14, 'Probability', 'Chance from experiments', ['sample-space', 'decay-dice', 'spinner-designer']),
        c(15, 'Proofs in Mathematics', 'Statements, reasoning and writing proofs', ['converse-checker', 'irrational-proof']),
      ] },
    ],
  },
  {
    id: 'telangana-class-10', n: 10, name: 'Telangana Class 10', blurb: 'Physical Science, Biological Science and Mathematics for the SSC exam (SCERT Telangana).',
    subjects: [
      { id: 'physical-science', name: 'Physical Science', chapters: [
        c(1, 'Reflection of Light at Curved Surfaces', 'Concave and convex mirrors, images, the mirror formula', ['mirror-ray-diagram']),
        c(2, 'Chemical Equations', 'Writing and balancing equations, kinds of reactions', ['equation-balancer', 'reaction-type-sorter']),
        c(3, 'Acids, Bases and Salts', 'Indicators, pH, properties and common salts', ['ph-scale-explorer', 'titration-curve', 'acid-base-interpreter']),
        c(4, 'Refraction of Light at Curved Surfaces', 'Lenses, ray diagrams, the lens formula and power', ['lens-ray-diagram', 'lens-ray-tracer', 'snell-law']),
        c(5, 'Human Eye and Colourful World', 'Eye defects, prisms, dispersion and scattering', ['eye-defects', 'prism-dispersion', 'sky-colour']),
        c(6, 'Structure of Atom', 'Atomic models, quantum numbers, electron configuration', ['electron-configuration', 'hydrogen-spectrum', 'hydrogen-orbitals']),
        c(7, 'Classification of Elements - The Periodic Table', 'How elements are arranged, periodic trends', ['periodic-table', 'periodic-trends', 'mendeleev-predictor']),
        c(8, 'Chemical Bonding', 'Ionic and covalent bonds, shapes of molecules', ['ionic-bond-dots', 'lewis-structures', 'vsepr-shapes']),
        c(9, 'Electric Current', 'Ohm\'s law, resistance, circuits, power and heating', ['ohms-law-lab', 'series-parallel', 'circuit-simulator', 'fuse-heating', 'power-bill']),
        c(10, 'Electromagnetism', 'Magnetic fields of currents, motors, induction and generators', ['magnetic-field-mapper', 'fleming-rule', 'faraday-induction', 'electromagnet-builder']),
        c(11, 'Principles of Metallurgy', 'Getting metals from ores, corrosion and alloys', ['reactivity-series', 'rusting-lab', 'alloy-mixer']),
        c(12, 'Carbon and its Compounds', 'Carbon bonding, hydrocarbons, functional groups, soaps', ['carbon-chain-namer', 'isomer-explorer', 'esterification', 'soap-micelle']),
      ] },
      { id: 'biology', name: 'Biological Science', chapters: [
        c(1, 'Nutrition', 'How plants and animals take in and use food', ['photosynthesis-lab', 'digestion-journey', 'pigment-spectra']),
        c(2, 'Respiration', 'Releasing energy from food, breathing organs', ['respiration-atp', 'respiration-pathways', 'respirometry-calculator']),
        c(3, 'Transportation - The Circulatory System', 'Heart, blood and transport in plants', ['heart-circulation', 'cardiac-cycle', 'transpiration-lab']),
        c(4, 'Excretion', 'Removing wastes, kidneys and dialysis', ['nephron-filter', 'osmolarity-calculator']),
        c(5, 'Coordination', 'Nervous system, brain and reflexes', ['brain-map', 'reaction-time-test', 'action-potential']),
        c(6, 'Reproduction', 'Asexual and sexual reproduction in plants and animals', ['reproduction-modes', 'flower-parts', 'cell-division', 'double-fertilisation']),
        c(7, 'Coordination in Life Processes', 'How body systems work together, plant hormones', ['hormone-feedback', 'phototropism', 'digestion-journey']),
        c(8, 'Heredity - Evolution', 'Mendel\'s laws, variation and evolution', ['mendel-peas', 'punnett-square', 'natural-selection', 'sex-determination']),
        c(9, 'Our Environment', 'Ecosystems, food webs, waste and pollution', ['food-web-builder', 'bioaccumulation-factor', 'biodiversity-indices']),
        c(10, 'Natural Resources', 'Using water, forests, minerals and energy wisely', ['carbon-footprint', 'water-quality-index', 'solar-pv-yield']),
      ] },
      { id: 'maths', name: 'Mathematics', chapters: [
        c(1, 'Real Numbers', 'Euclid\'s division, prime factors, irrationals and logarithms', ['number-theory-toolkit', 'hcf-lcm-venn', 'irrational-proof', 'log-exp-explorer']),
        c(2, 'Sets', 'Set notation, union, intersection and Venn diagrams', ['venn-diagram', 'power-set']),
        c(3, 'Polynomials', 'Zeroes and coefficients, graphs, division', ['polynomial-zeros', 'function-grapher']),
        c(4, 'Pair of Linear Equations in Two Variables', 'Solving by graphs, substitution and elimination', ['linear-pair-solver', 'two-variable-line']),
        c(5, 'Quadratic Equations', 'Factors, the formula and the nature of roots', ['quadratic-explorer', 'factorise-steps']),
        c(6, 'Progressions', 'Arithmetic and geometric sequences and their sums', ['ap-explorer', 'gp-explorer', 'sequence-explorer']),
        c(7, 'Coordinate Geometry', 'Distance, the section formula and area of a triangle', ['coord-triangle', 'section-formula']),
        c(8, 'Similar Triangles', 'Similarity rules, proportional sides, Pythagoras', ['similar-triangles', 'pythagoras-proofs']),
        c(9, 'Tangents and Secants to a Circle', 'Tangent properties and lengths', ['circle-theorems', 'geometry-construction']),
        c(10, 'Mensuration', 'Combined solids and the frustum', ['combined-solids', 'solids-lab']),
        c(11, 'Trigonometry', 'Ratios, standard angles and identities', ['trig-ratios', 'unit-circle']),
        c(12, 'Applications of Trigonometry', 'Heights and distances', ['heights-distances', 'phone-clinometer']),
        c(13, 'Probability', 'Probability with coins, dice and cards', ['sample-space', 'probability-tree']),
        c(14, 'Statistics', 'Mean, median and mode of grouped data, ogives', ['grouped-data-stats', 'cumulative-frequency']),
      ] },
    ],
  },
];
