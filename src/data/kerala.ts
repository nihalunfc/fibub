// Kerala state syllabus (SCERT Kerala), Class 8 to 10 science and maths, for the many Kerala students at
// home and in the Gulf. Same shape as src/data/ncert.ts; a tool id that is not live yet is left out of the page.
//
// Chapter titles follow the SCERT Kerala English-medium textbooks in use for 2026-27: Class 8 and 10 are the
// new books first printed in 2025, Class 9 the new books first printed in 2024. Class 8 science is one book,
// Basic Science, with physics, chemistry and biology chapters in turn; Class 9 and 10 have separate books.
// Sources (checked 2026-11-16):
// - Class 9 Physics, Chemistry, Biology and Maths Part 1: the official PDFs on samagra.kite.kerala.gov.in
//   (SCERT Kerala, "First Edition: 2024").
// - Class 10 Maths Part 1: the SCERT Kerala book, First Edition 2025 (copy linked from scert.kerala.gov.in/class-x/).
// - Class 8 and 10 science, Class 8 maths and the Part 2 books: SCERT's own 2025 files could not be opened
//   from here, so their chapter lists were matched across two independent textbook-notes sites (hsslive.guru
//   and textbooksall.co.in), which agree with each other and with every official contents page we could open.
// Only chapter titles and our own short topic lines are used: fibub is not part of SCERT Kerala or the
// Government of Kerala and copies no textbook text or figures.
import type { Chapter, SchoolClass } from './ncert';

const c = (n: number, title: string, topics: string, tools: string[] = []): Chapter => ({ n, title, topics, tools });

export const KERALA_CLASSES: SchoolClass[] = [
  {
    id: 'kerala-class-8', n: 8, name: 'Kerala Class 8', blurb: 'Basic Science and Mathematics (SCERT Kerala, 2025 books).',
    subjects: [
      { id: 'science', name: 'Basic Science', book: 'Parts 1 and 2', chapters: [
        c(1, 'Measurement and Units', 'Physics: SI units, measuring length, mass and time, accuracy', ['si-unit-converter', 'parallax-reading', 'sig-fig-checker', 'temperature-scales']),
        c(2, 'Motion and Force', 'Physics: distance and displacement, speed, forces and their effects, friction', ['distance-displacement', 'motion-graphs', 'newtons-laws', 'tug-of-war-forces', 'friction-ramp', 'inertia-demos']),
        c(3, 'Pressure', 'Physics: pressure in solids, liquids and air, and its uses', ['pressure-explorer', 'liquid-pressure', 'barometer-altitude', 'hydraulic-lift']),
        c(4, 'Chemistry of Changes', 'Chemistry: physical and chemical changes, signs of a reaction', ['reaction-type-sorter', 'rusting-lab', 'states-of-matter']),
        c(5, 'Elements and Compounds', 'Chemistry: elements, symbols, compounds and simple formulas', ['matter-sorter', 'build-an-atom', 'periodic-table', 'formula-writer', 'constant-proportions']),
        c(6, 'Metals and Non-Metals', 'Chemistry: properties and uses of metals and non-metals, alloys', ['reactivity-series', 'alloy-mixer', 'periodic-trends', 'rusting-lab']),
        c(7, "Let's Cultivate and Reap Goodness", 'Biology: crops, soil, water and nutrients for plants, farming practices', ['soil-texture-triangle', 'nitrogen-cycle', 'photosynthesis-lab', 'transpiration-lab', 'fertiliser-blend-calculator']),
        c(8, 'Origin of Life, Origin of Living Things', 'Biology: ideas on how life began and how living things changed', ['geological-time', 'natural-selection', 'five-kingdoms']),
        c(9, 'Cells and Cell Clusters', 'Biology: cells, the microscope, cell parts and tissues', ['cell-explorer', 'virtual-microscope', 'microscope-magnification', 'cell-membrane', 'tissue-identifier']),
        c(10, 'Static Electricity', 'Physics: charging by rubbing, attraction and repulsion, lightning', ['static-charge', 'coulomb-forces', 'faraday-cage']),
        c(11, 'Magnetism and Electricity', 'Physics: magnets, magnetic fields, electric circuits and electromagnets', ['magnetic-field-mapper', 'magnetic-materials', 'electromagnet-builder', 'simple-circuit-lab', 'electric-bell']),
        c(12, 'Spherical Mirrors', 'Physics: concave and convex mirrors, images and their uses', ['mirror-ray-diagram', 'plane-mirror-lab']),
        c(13, 'Acids, Bases, Salts', 'Chemistry: indicators, the pH scale, neutralisation and salts', ['ph-scale-explorer', 'titration-curve', 'ion-tests']),
        c(14, 'Water', 'Chemistry: water as a solvent, hard and soft water, the water cycle', ['dissolving-lab', 'water-cycle-sim', 'hydrogen-bonding', 'water-of-crystallisation']),
        c(15, 'Chemistry of Matter', 'Chemistry: particles, states of matter and mixtures', ['states-of-matter', 'kinetic-theory', 'separation-lab', 'tyndall-effect']),
        c(16, 'Tree of Life', 'Biology: grouping living things and how groups are related', ['classification-tree', 'taxonomy-ladder', 'dichotomous-key']),
        c(17, 'The Beauty of Diversity', 'Biology: variety of life, kingdoms, protecting biodiversity', ['five-kingdoms', 'biodiversity-indices', 'animal-key', 'food-web-builder']),
        c(18, 'Cells that Become Daughter Cells', 'Biology: cell division, mitosis and meiosis', ['cell-division', 'virtual-microscope']),
      ] },
      { id: 'maths', name: 'Mathematics', book: 'Parts 1 and 2', chapters: [
        c(1, 'Squares', 'Square numbers, square roots and patterns', ['square-cube-builder', 'square-root-finder', 'pythagoras-proofs']),
        c(2, 'Equal Triangles', 'Congruent triangles and the conditions for them', ['triangle-congruence', 'rigid-motions', 'geometry-construction']),
        c(3, 'Square Identities', 'Squares of sums and differences as areas', ['identity-tiles', 'multiplication-area']),
        c(4, 'Polygons', 'Angles of polygons and regular polygons', ['polygon-angle-sum', 'tessellation-studio']),
        c(5, 'Solutions of Equations', 'Forming and solving equations from problems', ['balance-scale', 'linear-word-problems', 'algebra-tricks']),
        c(6, 'New Numbers', 'Numbers that are not fractions, square roots on the number line', ['root-spiral', 'number-line-zoom', 'square-root-finder']),
        c(7, 'Bisectors', 'Bisecting lines and angles, constructions', ['geometry-construction']),
        c(8, 'Ratio', 'Ratio, proportion and sharing', ['ratio-mixer', 'proportion-grapher', 'map-scale']),
        c(9, 'Circles', 'Parts of a circle, circumference and area', ['circle-slices', 'circle-sector']),
        c(10, 'Decimal Forms', 'Fractions as decimals, recurring decimals', ['number-systems', 'rational-explorer', 'number-line-zoom']),
        c(11, 'Parallelograms', 'Properties and area of parallelograms', ['quadrilateral-explorer', 'area-shear']),
        c(12, 'Trapeziums', 'Properties and area of trapeziums', ['quadrilateral-explorer', 'field-area']),
        c(13, 'Statistics', 'Collecting data, tables, graphs and averages', ['grouped-data-stats', 'histogram-builder', 'spread-explorer']),
      ] },
    ],
  },
  {
    id: 'kerala-class-9', n: 9, name: 'Kerala Class 9', blurb: 'Physics, Chemistry, Biology and Mathematics (SCERT Kerala, 2024 books).',
    subjects: [
      { id: 'physics', name: 'Physics', book: 'Parts 1 and 2', chapters: [
        c(1, 'Refraction of Light', 'Bending of light, refractive index, total internal reflection', ['snell-law', 'optical-fibre', 'prism-dispersion']),
        c(2, 'Equations of Motion', 'Velocity, acceleration, motion graphs and the equations of motion', ['equations-of-motion', 'motion-graphs', 'distance-displacement', 'free-fall']),
        c(3, 'Laws of Motion', "Newton's laws, momentum and its conservation", ['newtons-laws', 'free-body-diagram', 'collision-carts', 'collision-lab', 'inertia-demos']),
        c(4, 'Gravitation', 'Universal gravitation, g, weight, orbits', ['gravity-height-depth', 'kepler-orbits', 'free-fall', 'projectile-launcher']),
        c(5, 'Buoyant Force', "Upthrust, Archimedes' principle, floating and density", ['buoyancy-lab', 'density-lab', 'liquid-pressure', 'hydraulic-lift']),
        c(6, 'Work and Energy', 'Work, kinetic and potential energy, power, conservation of energy', ['energy-track', 'variable-force-work', 'spring-energy', 'energy-stores', 'simple-machines']),
        c(7, 'Electric Current', "Current, voltage, resistance, Ohm's law, series and parallel", ['ohms-law-lab', 'simple-circuit-lab', 'series-parallel', 'internal-resistance', 'power-bill']),
        c(8, 'Sound', 'Sound waves, frequency, pitch, loudness, echo', ['sound-wave-visualiser', 'travelling-wave', 'echo-sonar', 'hearing-range', 'resonance-tube']),
      ] },
      { id: 'chemistry', name: 'Chemistry', book: 'Parts 1 and 2', chapters: [
        c(1, 'Structure of Atom', 'Atomic models, protons, neutrons, electrons, shells', ['build-an-atom', 'rutherford-scattering', 'electron-configuration', 'hydrogen-spectrum']),
        c(2, 'Periodic Table', 'Groups, periods and trends in the periodic table', ['periodic-table', 'periodic-trends', 'mendeleev-predictor', 'electron-configuration']),
        c(3, 'Chemical Bonding', 'Ionic and covalent bonds, electron dot diagrams, shapes', ['ionic-bond-dots', 'lewis-structures', 'vsepr-shapes', 'dipole-polarity']),
        c(4, 'Redox Reactions', 'Oxidation, reduction and oxidation numbers', ['oxidation-number', 'reactivity-series', 'galvanic-cell']),
        c(5, 'Chemical Kinetics', 'Rate of reaction and what changes it', ['rate-of-reaction-lab', 'order-graphs', 'enzyme-activity']),
        c(6, 'Solutions', 'Solute, solvent, solubility and concentration', ['dissolving-lab', 'solution-calculator', 'concentration-converter', 'henrys-law', 'tyndall-effect']),
        c(7, 'Non Metals', 'Hydrogen, oxygen, nitrogen and their compounds', ['periodic-trends', 'le-chatelier', 'nitrogen-cycle']),
        c(8, 'Organic Chemistry', 'Carbon compounds, hydrocarbons and their names', ['carbon-chain-namer', 'isomer-explorer', 'organic-reaction-map']),
      ] },
      { id: 'biology', name: 'Biology', book: 'Parts 1 and 2', chapters: [
        c(1, 'To Life Processes', 'Nutrition in plants and animals, photosynthesis, cell energy', ['photosynthesis-lab', 'cell-explorer', 'respiration-atp']),
        c(2, 'Digestion and Transport of Nutrients', 'Digestive system, enzymes, blood and circulation', ['digestion-journey', 'enzyme-activity', 'biomolecule-tests', 'heart-circulation', 'cardiac-cycle']),
        c(3, 'Respiration and Excretion', 'Breathing, cell respiration, kidneys and excretion', ['respiration-pathways', 'respiration-atp', 'oxygen-dissociation', 'nephron-filter']),
        c(4, 'Behind Movements', 'Bones, joints and muscles, how movement happens', ['sliding-filament', 'moments-lab']),
        c(5, 'Reproductive Health', 'Human reproduction, hormones and health', ['hormone-feedback', 'reproduction-modes', 'sex-determination']),
        c(6, 'Classification', 'How living things are named and grouped', ['classification-tree', 'five-kingdoms', 'taxonomy-ladder', 'dichotomous-key']),
      ] },
      { id: 'maths', name: 'Mathematics', book: 'Parts 1 and 2', chapters: [
        c(1, 'Pairs of Equations', 'Two equations in two unknowns', ['linear-pair-solver', 'two-variable-line']),
        c(2, 'New Numbers', 'Irrational numbers and square roots', ['irrational-proof', 'root-spiral', 'number-line-zoom']),
        c(3, 'Parallel Lines', 'Parallel lines and the lengths they cut off', ['midpoint-theorem', 'similar-triangles', 'section-formula']),
        c(4, 'Multiplication Identities', 'Algebraic identities and products', ['identity-tiles', 'multiplication-area', 'factorise-steps']),
        c(5, 'Irrational Multiplication', 'Multiplying and dividing square roots', ['surds', 'rationalise-denominator', 'root-spiral']),
        c(6, 'Similar Triangles', 'Similarity and the ratio of sides', ['similar-triangles', 'map-scale']),
        c(7, 'Negative Numbers', 'Negative numbers, operations and the number line', ['number-line-zoom', 'coordinate-hunt']),
        c(8, 'Circle Measures', 'Circumference, area, arcs and sectors', ['circle-sector', 'circle-slices', 'radian-ruler']),
        c(9, 'Real Numbers', 'Rational and irrational numbers together', ['number-systems', 'rational-explorer', 'irrational-proof']),
        c(10, 'Polynomials', 'Polynomials, their values and factors', ['polynomial-zeros', 'factorise-steps']),
        c(11, 'Parts of Circles', 'Arcs, chords and sectors', ['circle-sector', 'geometry-construction']),
        c(12, 'Prisms', 'Surface area and volume of prisms', ['solids-lab', 'combined-solids']),
        c(13, 'Polynomial Pictures', 'Graphs of polynomials', ['function-gallery', 'linear-explorer', 'quadratic-explorer']),
        c(14, 'Proportion', 'Direct and inverse proportion', ['proportion-grapher', 'ratio-mixer']),
        c(15, 'Statistics', 'Mean, median and frequency tables', ['grouped-data-stats', 'histogram-builder', 'spread-explorer']),
      ] },
    ],
  },
  {
    id: 'kerala-class-10', n: 10, name: 'Kerala Class 10', blurb: 'SSLC year: Physics, Chemistry, Biology and Mathematics (SCERT Kerala, 2025 books).',
    subjects: [
      { id: 'physics', name: 'Physics', book: 'Parts 1 and 2', chapters: [
        c(1, 'Sound Waves', 'Wave properties, speed of sound, resonance and beats', ['sound-wave-visualiser', 'travelling-wave', 'ripple-tank', 'beats-lab', 'resonance-tube', 'echo-sonar']),
        c(2, 'Lenses', 'Convex and concave lenses, images, power of a lens', ['lens-ray-diagram', 'microscope-telescope']),
        c(3, 'The World of Colours and Vision', 'Dispersion, colours, the eye and its defects', ['prism-dispersion', 'eye-defects', 'sky-colour']),
        c(4, 'Magnetic Effect of Electric Current', 'Fields around wires and coils, force on a current, motors', ['magnetic-field-mapper', 'fleming-rule', 'electromagnet-builder', 'biot-savart', 'lorentz-motion']),
        c(5, 'Electric Energy: Consumption and Conservation', 'Heating effect, electric power, bills and saving energy', ['power-bill', 'fuse-heating', 'ohms-law-lab', 'series-parallel']),
        c(6, 'Electromagnetic Induction in Daily Life', 'Induced current, generators, transformers, AC', ['faraday-induction', 'motional-emf', 'transformer-calculator', 'rms-waveform']),
        c(7, 'Mechanical Advantage in Action', 'Levers, pulleys and other simple machines', ['simple-machines', 'moments-lab', 'hydraulic-lift']),
      ] },
      { id: 'chemistry', name: 'Chemistry', book: 'Parts 1 and 2', chapters: [
        c(1, 'Nomenclature of Organic Compounds and Isomerism', 'Naming carbon compounds, isomers', ['carbon-chain-namer', 'isomer-explorer', 'chirality-checker']),
        c(2, 'Chemical Reactions of Organic Compounds', 'Substitution, addition, combustion, esters and soaps', ['organic-reaction-map', 'esterification', 'markovnikov-addition', 'soap-micelle']),
        c(3, 'Periodic Table and Electron Configuration', 'Subshells, electron configuration and the blocks', ['electron-configuration', 'periodic-table', 'periodic-trends']),
        c(4, 'Gas Laws and Mole Concept', "Boyle's and Charles's laws, moles and molar volume", ['gas-law-calculator', 'kinetic-theory', 'mole-bridge', 'limiting-reagent']),
        c(5, 'Electrochemistry', 'Galvanic cells, electrolysis and its uses', ['galvanic-cell', 'electrolysis-lab', 'chlor-alkali', 'kohlrausch-law']),
        c(6, 'Metals', 'Reactivity series, extracting metals, corrosion, alloys', ['reactivity-series', 'alloy-mixer', 'rusting-lab']),
        c(7, 'Some Compounds of Industrial Importance', 'Making ammonia, sulphuric acid and other compounds, equilibrium', ['le-chatelier', 'chlor-alkali']),
      ] },
      { id: 'biology', name: 'Biology', book: 'Parts 1 and 2', chapters: [
        c(1, 'Genetics of Life', 'Genes, inheritance, DNA and how traits pass on', ['mendel-peas', 'pedigree-analyser', 'central-dogma', 'sex-determination', 'polygenic-traits']),
        c(2, 'Paths of Evolution', 'Evidence and theories of evolution', ['natural-selection', 'geological-time', 'copy-errors']),
        c(3, 'Behind Sensations', 'Nerves, the brain and sense organs', ['action-potential', 'brain-map', 'reaction-time-test', 'eye-defects']),
        c(4, 'Chemoreception in Organisms', 'Hormones and chemical signals in animals and plants', ['hormone-feedback', 'phototropism']),
        c(5, 'Immunity and Healthcare', 'Disease, the immune system, vaccines and public health', ['immune-response', 'infection-spread-sim', 'herd-immunity', 'epidemic-model', 'antibiotic-zones', 'hand-washing']),
        c(6, 'Biology and Technology', 'Genetic engineering and biotechnology', ['recombinant-insulin', 'bioreactor', 'central-dogma']),
      ] },
      { id: 'maths', name: 'Mathematics', book: 'Parts 1 and 2', chapters: [
        c(1, 'Arithmetic Sequences', 'Patterns with a common difference, nth term', ['ap-explorer', 'sequence-explorer']),
        c(2, 'Circles and Angles', 'Angles in circles and cyclic quadrilaterals', ['circle-theorems', 'circle-sector', 'geometry-construction']),
        c(3, 'Arithmetic Sequences and Algebra', 'Sums of arithmetic sequences, algebra of terms', ['ap-explorer', 'sequence-explorer']),
        c(4, 'Mathematics of Chance', 'Probability as a number, sample spaces', ['sample-space', 'probability-tree', 'spinner-designer']),
        c(5, 'Second Degree Equations', 'Quadratic equations and their solutions', ['quadratic-explorer', 'factorise-steps']),
        c(6, 'Trigonometry', 'Trigonometric ratios, heights and distances', ['trig-ratios', 'heights-distances', 'unit-circle']),
        c(7, 'Coordinates', 'Points, distance between points', ['coordinate-hunt', 'coord-triangle', 'section-formula']),
        c(8, 'Tangents', 'Tangents to circles and their properties', ['circle-theorems', 'geometry-construction']),
        c(9, 'Polynomials and Equations', 'Factors and zeros of polynomials', ['polynomial-zeros', 'factorise-steps']),
        c(10, 'Circles and Lines', 'Lines and circles together, chords and secants', ['circle-theorems', 'circle-sector', 'geometry-construction']),
        c(11, 'Geometry and Algebra', 'Slope, equation of a line, geometry with algebra', ['line-forms', 'linear-explorer', 'section-formula']),
        c(12, 'Solids', 'Surface area and volume of pyramids, cones and spheres', ['solids-lab', 'combined-solids']),
        c(13, 'Statistics', 'Mean and median of grouped data', ['grouped-data-stats', 'cumulative-frequency', 'box-plot-lab', 'spread-explorer']),
      ] },
    ],
  },
];
