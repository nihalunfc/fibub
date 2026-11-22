// Tamil Nadu state syllabus (Samacheer Kalvi, TNSCERT; State Board), Class 8 to 10 science and maths. Same
// shape as src/data/ncert.ts; a tool id that is not live yet is left out of the page.
//
// Tamil Nadu writes its own books: one Science book per class (physics, chemistry, biology and a computer
// chapter) and one Mathematics book with a few long chapters. The computer chapters (office software,
// visual communication) are left out here, as fibub's school pages cover science and maths.
// Sources (checked 2026-11-22): the official files on textbooksonline.tn.nic.in could not be opened from
// here, so the chapter lists were matched across independent study sites (Shaalaa, Selfstudys, Careers360,
// StudiesToday), which agree with each other. Class 9 science chapter order differs a little between sources.
// Only chapter titles and our own short topic lines are used: fibub is not part of TNSCERT or the Government
// of Tamil Nadu and copies no textbook text or figures.
import type { Chapter, SchoolClass } from './ncert';

const c = (n: number, title: string, topics: string, tools: string[] = []): Chapter => ({ n, title, topics, tools });

export const TN_CLASSES: SchoolClass[] = [
  {
    id: 'tn-class-8', n: 8, name: 'Tamil Nadu Class 8', blurb: 'Science and Mathematics (Samacheer Kalvi, TNSCERT).',
    subjects: [
      { id: 'science', name: 'Science', chapters: [
        c(1, 'Measurement', 'Units, measuring length, mass and time, accuracy', ['si-unit-converter', 'parallax-reading', 'sig-fig-checker', 'uncertainty-calculator']),
        c(2, 'Force and Pressure', 'Kinds of force, pressure in solids, liquids and air', ['newtons-laws', 'friction-ramp', 'pressure-explorer', 'liquid-pressure', 'barometer-altitude']),
        c(3, 'Light', 'Reflection, mirrors and how images form', ['plane-mirror-lab', 'mirror-ray-diagram', 'prism-dispersion']),
        c(4, 'Heat', 'Temperature, heat transfer, expansion and thermometers', ['temperature-scales', 'heat-conduction', 'thermal-expansion']),
        c(5, 'Electricity', 'Circuits, cells, conductors, effects of current, safety', ['simple-circuit-lab', 'ohms-law-lab', 'fuse-heating', 'electrolysis-lab']),
        c(6, 'Sound', 'How sound is made and travels, pitch, loudness and noise', ['sound-wave-visualiser', 'hearing-range', 'decibel-distance']),
        c(7, 'Magnetism', 'Magnets, poles, magnetic materials and fields', ['magnetic-field-mapper', 'magnetic-materials', 'electromagnet-builder']),
        c(8, 'Universe and Space Science', 'Stars, planets, the solar system and space travel', ['sky-tonight', 'kepler-orbits', 'planet-data-explorer', 'rocket-equation']),
        c(9, 'Matter around us', 'States of matter, particles, mixtures and separation', ['states-of-matter', 'matter-sorter', 'separation-lab']),
        c(10, 'Changes around us', 'Physical and chemical changes, reversible and not', ['reaction-type-sorter', 'rusting-lab', 'heating-curve']),
        c(11, 'Air', 'What air is made of, oxygen and pollution', ['air-quality-calculator', 'gas-law-calculator', 'standard-atmosphere']),
        c(12, 'Atomic Structure', 'Atoms, electrons, protons, neutrons and early models', ['build-an-atom', 'rutherford-scattering', 'electron-configuration']),
        c(13, 'Water', 'Sources, hardness, cleaning and saving water', ['water-quality-index', 'water-cycle-sim', 'hydrogen-bonding']),
        c(14, 'Acids and Bases', 'Properties, indicators and neutralisation', ['ph-scale-explorer', 'titration-curve']),
        c(15, 'Chemistry in Everyday Life', 'Soaps, fuels, plastics and household chemicals', ['soap-micelle', 'bomb-calorimeter', 'carbon-chain-namer']),
        c(16, 'Microorganisms', 'Bacteria, viruses and fungi, useful and harmful', ['microbe-growth', 'gram-stain-key', 'virtual-microscope']),
        c(17, 'Plant Kingdom', 'Groups of plants and their features', ['classification-tree', 'five-kingdoms', 'dichotomous-key']),
        c(18, 'Organisation of Life', 'Cells, tissues, organs and organ systems', ['cell-explorer', 'tissue-identifier', 'microscope-magnification']),
        c(19, 'Movements in Animals', 'Skeleton, joints, muscles and how animals move', ['sliding-filament', 'moments-lab']),
        c(20, 'Reaching the Age of Adolescence', 'Body changes, hormones, hygiene and health', ['hormone-feedback', 'sex-determination']),
        c(21, 'Crop Production and Management', 'Soil, irrigation, manure, harvesting and storage', ['soil-texture-triangle', 'fertiliser-blend-calculator', 'nitrogen-cycle', 'seeding-rate-calculator']),
        c(22, 'Conservation of Plants and Animals', 'Biodiversity, endangered species and protected areas', ['biodiversity-indices', 'mark-recapture', 'food-web-builder']),
      ] },
      { id: 'maths', name: 'Mathematics', chapters: [
        c(1, 'Numbers', 'Rational numbers, squares, cubes, roots and exponents', ['rational-explorer', 'square-cube-builder', 'square-root-finder', 'exponent-laws']),
        c(2, 'Measurements', 'Sectors and arcs, combined shapes, solids and nets', ['circle-sector', 'field-area', 'polyhedron-viewer', 'solids-lab']),
        c(3, 'Algebra', 'Expressions, identities, factorising, linear equations and graphs', ['identity-tiles', 'factorise-steps', 'balance-scale', 'two-variable-line']),
        c(4, 'Life Mathematics', 'Profit and loss, compound interest, proportion, time and work', ['percentage-bar', 'compound-interest', 'proportion-grapher', 'linear-word-problems']),
        c(5, 'Geometry', 'Congruence, similarity, quadrilateral constructions, Pythagoras', ['triangle-congruence', 'similar-triangles', 'geometry-construction', 'pythagoras-proofs']),
        c(6, 'Statistics', 'Frequency tables, histograms, polygons and pie charts', ['grouped-data-stats', 'histogram-builder', 'plot-maker']),
        c(7, 'Information Processing', 'Counting, HCF, Fibonacci numbers, codes and puzzles', ['counting-machine', 'hcf-lcm-venn', 'sequence-explorer', 'number-theory-toolkit']),
      ] },
    ],
  },
  {
    id: 'tn-class-9', n: 9, name: 'Tamil Nadu Class 9', blurb: 'Science and Mathematics (Samacheer Kalvi, TNSCERT).',
    subjects: [
      { id: 'science', name: 'Science', chapters: [
        c(1, 'Measurement', 'Units, measuring instruments and accuracy', ['si-unit-converter', 'parallax-reading', 'sig-fig-checker', 'dimensional-analysis']),
        c(2, 'Motion', 'Speed, velocity, acceleration, graphs and equations of motion', ['motion-graphs', 'equations-of-motion', 'distance-displacement', 'vertical-circle']),
        c(3, 'Fluids', 'Pressure, buoyancy, density and floating', ['liquid-pressure', 'buoyancy-lab', 'density-lab', 'hydraulic-lift', 'capillary-rise']),
        c(4, 'Electric Charge and Electric Current', 'Charge, current, potential difference and Ohm\'s law', ['static-charge', 'coulomb-forces', 'ohms-law-lab', 'series-parallel']),
        c(5, 'Magnetism and Electromagnetism', 'Magnetic fields, effects of current and induction', ['magnetic-field-mapper', 'electromagnet-builder', 'fleming-rule', 'faraday-induction']),
        c(6, 'Light', 'Reflection, refraction and lenses', ['mirror-ray-diagram', 'snell-law', 'lens-ray-diagram']),
        c(7, 'Heat', 'Expansion, heat capacity and calorimetry', ['thermal-expansion', 'calorimetry-lab', 'heating-curve']),
        c(8, 'Sound', 'Waves, reflection, echo and ultrasound', ['sound-wave-visualiser', 'echo-sonar', 'travelling-wave', 'hearing-range']),
        c(9, 'Universe', 'Galaxies, stars and the solar system', ['kepler-orbits', 'sky-tonight', 'planet-data-explorer', 'blackbody-calculator']),
        c(10, 'Matter Around Us', 'States, mixtures, solutions and separation', ['states-of-matter', 'separation-lab', 'tyndall-effect', 'solution-calculator']),
        c(11, 'Atomic Structure', 'Particles in the atom, models, isotopes and shells', ['build-an-atom', 'rutherford-scattering', 'electron-configuration']),
        c(12, 'Periodic Classification of Elements', 'History of the periodic table and its trends', ['periodic-table', 'periodic-trends', 'mendeleev-predictor']),
        c(13, 'Chemical Bonding', 'Ionic and covalent bonds', ['ionic-bond-dots', 'lewis-structures', 'dipole-polarity']),
        c(14, 'Acids, Bases and Salts', 'Properties, pH, salts and their uses', ['ph-scale-explorer', 'titration-curve', 'acid-base-interpreter']),
        c(15, 'Carbon and its Compounds', 'Carbon bonding, hydrocarbons and functional groups', ['carbon-chain-namer', 'isomer-explorer', 'molecule-viewer']),
        c(16, 'Applied Chemistry', 'Chemistry at work in industry and daily life', ['electrolysis-lab', 'galvanic-cell', 'electroplating-calculator']),
        c(17, 'Animal Kingdom', 'Classifying animals and the features of each group', ['animal-key', 'classification-tree', 'five-kingdoms']),
        c(18, 'Organisation of Tissues', 'Plant and animal tissues', ['tissue-identifier', 'virtual-microscope']),
        c(19, 'Plant Physiology', 'Photosynthesis, transport and respiration in plants', ['photosynthesis-lab', 'transpiration-lab', 'phototropism', 'osmosis-lab']),
        c(20, 'Organ Systems in Animals', 'Digestive, circulatory, breathing and other systems', ['digestion-journey', 'heart-circulation', 'nephron-filter', 'brain-map']),
        c(21, 'Nutrition and Health', 'Nutrients, a balanced diet, hygiene and disease', ['nutrient-planner', 'biomolecule-tests', 'hand-washing']),
        c(22, 'World of Microbes', 'Kinds of microbes and what they do', ['microbe-growth', 'gram-stain-key', 'infection-spread-sim', 'growth-curve-od600']),
        c(23, 'Economic Biology', 'Useful plants and animals: bees, poultry, fish and dairy', ['feed-ration-balancer', 'population-growth']),
        c(24, 'Environmental Science', 'Ecosystems, pollution and conservation', ['food-web-builder', 'carbon-cycle', 'air-quality-calculator', 'water-quality-index']),
      ] },
      { id: 'maths', name: 'Mathematics', chapters: [
        c(1, 'Set Language', 'Sets, set operations and Venn diagrams', ['venn-diagram', 'power-set']),
        c(2, 'Real Numbers', 'Rational and irrational numbers, surds and decimals', ['number-systems', 'root-spiral', 'surds', 'rationalise-denominator']),
        c(3, 'Algebra', 'Polynomials, factorising, identities and equations', ['polynomial-zeros', 'factorise-steps', 'identity-tiles', 'linear-pair-solver']),
        c(4, 'Geometry', 'Angles, triangles, quadrilaterals and circles', ['linear-pair-solver', 'quadrilateral-explorer', 'midpoint-theorem', 'circle-theorems']),
        c(5, 'Coordinate Geometry', 'Plotting points, distance and the section formula', ['coordinate-hunt', 'coord-triangle', 'section-formula']),
        c(6, 'Trigonometry', 'Trigonometric ratios and simple identities', ['trig-ratios', 'unit-circle']),
        c(7, 'Mensuration', 'Area of triangles (Heron) and surface area and volume of solids', ['herons-formula', 'solids-lab']),
        c(8, 'Statistics', 'Mean, median and mode', ['grouped-data-stats', 'spread-explorer', 'histogram-builder']),
        c(9, 'Probability', 'Chance, events and simple calculations', ['sample-space', 'probability-tree', 'decay-dice']),
      ] },
    ],
  },
  {
    id: 'tn-class-10', n: 10, name: 'Tamil Nadu Class 10', blurb: 'Science and Mathematics for the SSLC exam (Samacheer Kalvi, TNSCERT).',
    subjects: [
      { id: 'science', name: 'Science', chapters: [
        c(1, 'Laws of Motion', 'Newton\'s laws, momentum and gravitation', ['newtons-laws', 'collision-carts', 'collision-calculator', 'free-fall', 'gravity-height-depth']),
        c(2, 'Optics', 'Refraction, lenses, the eye and optical instruments', ['snell-law', 'lens-ray-diagram', 'eye-defects', 'microscope-telescope', 'prism-dispersion']),
        c(3, 'Thermal Physics', 'Heat, thermal expansion and the gas laws', ['thermal-expansion', 'gas-law-calculator', 'kinetic-theory']),
        c(4, 'Electricity', 'Current, resistance, circuits and power', ['ohms-law-lab', 'series-parallel', 'circuit-simulator', 'power-bill']),
        c(5, 'Acoustics', 'Sound waves, reflection, echo and the Doppler effect', ['sound-wave-visualiser', 'echo-sonar', 'doppler-beats', 'travelling-wave']),
        c(6, 'Nuclear Physics', 'Radioactivity, fission and fusion', ['decay-calculator', 'decay-dice', 'binding-energy', 'fission-chain']),
        c(7, 'Atoms and Molecules', 'Atomic mass, the mole and formulas', ['mole-bridge', 'molar-mass-calculator', 'constant-proportions']),
        c(8, 'Periodic Classification of Elements', 'The modern periodic law, trends, metallurgy and alloys', ['periodic-table', 'periodic-trends', 'reactivity-series', 'alloy-mixer']),
        c(9, 'Solutions', 'Concentration, solubility and kinds of solution', ['solution-calculator', 'concentration-converter', 'dissolving-lab', 'water-of-crystallisation']),
        c(10, 'Types of Chemical Reactions', 'Combination, decomposition, displacement, rates and pH', ['reaction-type-sorter', 'equation-balancer', 'rate-of-reaction-lab', 'ph-scale-explorer']),
        c(11, 'Carbon and its Compounds', 'Naming carbon compounds, ethanol, ethanoic acid, soaps', ['carbon-chain-namer', 'isomer-explorer', 'esterification', 'soap-micelle']),
        c(12, 'Plant Anatomy and Plant Physiology', 'Plant tissues, photosynthesis and respiration', ['tissue-identifier', 'photosynthesis-lab', 'respiration-atp']),
        c(13, 'Structural Organisation of Animals', 'Body plan and organ systems of an animal', ['digestion-journey', 'heart-circulation', 'nephron-filter']),
        c(14, 'Transportation in Plants and Circulation in Animals', 'Water and food transport in plants, the heart and blood', ['transpiration-lab', 'osmosis-lab', 'heart-circulation', 'cardiac-cycle']),
        c(15, 'Nervous System', 'Neurons, the brain and reflexes', ['brain-map', 'action-potential', 'reaction-time-test']),
        c(16, 'Plant and Animal Hormones', 'Plant growth substances and endocrine glands', ['phototropism', 'hormone-feedback']),
        c(17, 'Reproduction in Plants and Animals', 'Asexual and sexual reproduction, pollination', ['reproduction-modes', 'flower-parts', 'flower-pollination', 'double-fertilisation']),
        c(18, 'Genetics', 'Mendel\'s laws, chromosomes and DNA', ['mendel-peas', 'punnett-square', 'central-dogma', 'sex-determination']),
        c(19, 'Origin and Evolution of Life', 'Evidence and theories of evolution', ['natural-selection', 'geological-time', 'hardy-weinberg-tester']),
        c(20, 'Breeding and Biotechnology', 'Plant and animal breeding, genetic engineering', ['recombinant-insulin', 'restriction-digest', 'plasmid-map', 'pcr-master-mix']),
        c(21, 'Health and Diseases', 'Causes of disease, prevention and immunity', ['immune-response', 'herd-immunity', 'epidemic-model']),
        c(22, 'Environmental Management', 'Resources, waste and conservation', ['carbon-footprint', 'water-quality-index', 'solar-pv-yield', 'landfill-gas']),
      ] },
      { id: 'maths', name: 'Mathematics', chapters: [
        c(1, 'Relations and Functions', 'Ordered pairs, relations and kinds of function', ['relation-checker', 'function-type', 'function-gallery']),
        c(2, 'Numbers and Sequences', 'Euclid\'s division, modular arithmetic, AP and GP', ['number-theory-toolkit', 'ap-explorer', 'gp-explorer', 'sequence-explorer']),
        c(3, 'Algebra', 'Simultaneous equations, quadratics, matrices, HCF and LCM', ['linear-pair-solver', 'quadratic-explorer', 'matrix-calculator', 'hcf-lcm-venn']),
        c(4, 'Geometry', 'Similarity, the basic proportionality theorem, Pythagoras and circles', ['similar-triangles', 'pythagoras-proofs', 'circle-theorems']),
        c(5, 'Coordinate Geometry', 'Area of a triangle, slope and equations of lines', ['coord-triangle', 'line-forms', 'linear-explorer']),
        c(6, 'Trigonometry', 'Identities, heights and distances', ['trig-ratios', 'heights-distances', 'phone-clinometer']),
        c(7, 'Mensuration', 'Surface area and volume of solids and combinations', ['solids-lab', 'combined-solids']),
        c(8, 'Statistics and Probability', 'Spread, standard deviation and probability', ['spread-explorer', 'distribution-explorer', 'sample-space', 'probability-tree']),
      ] },
    ],
  },
];
