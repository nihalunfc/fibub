// Chapter maps for the two Plus Two entrance courses (nihal, 2026-11-22):
//   Engineering entrance (src/courses/engineering-entrance/): Physics, Chemistry, Maths for KEAM, CUSAT CAT,
//   COMEDK UGET, JEE Main and JEE Advanced.
//   Medical entrance (src/courses/medical-entrance/): Physics, Chemistry, Biology for NEET UG.
// Physics and Chemistry are written once (lesson files in src/courses/engineering-entrance/) and shown in both
// courses; the medical copies point search engines at the engineering page (canonical), so each search has one page.
// Chapters follow the NCERT Class 11 and 12 books (rationalised 2023), which JEE Main, NEET UG and the state
// tests follow, plus the extra topics JEE Advanced and KEAM still ask (marked `extra`). Plan and question-bank
// format: /mnt/project-files/entrance-courses/plan.md. Questions live in public/qbank/entrance-<subject>/<chapter>.*
//
// Each chapter becomes one module with two lessons: `<id>` (the ideas, from basics to top-rank depth) and
// `<id>-questions` (every question type the exams use for it, with traps and mixed-chapter questions), plus a
// practice set in the question bank. A lesson goes live when its Markdown file exists.

export type Exam = 'keam' | 'cusat' | 'comedk' | 'jee-main' | 'jee-adv' | 'neet';
export const EXAMS: Record<Exam, { name: string; long: string; site: string }> = {
  keam: { name: 'KEAM', long: 'Kerala Engineering Architecture Medical entrance (engineering paper), CEE Kerala', site: 'https://cee.kerala.gov.in' },
  cusat: { name: 'CUSAT CAT', long: 'Cochin University Common Admission Test (B.Tech)', site: 'https://admissions.cusat.ac.in' },
  comedk: { name: 'COMEDK UGET', long: 'Consortium of Medical, Engineering and Dental Colleges of Karnataka, engineering test', site: 'https://www.comedk.org' },
  'jee-main': { name: 'JEE Main', long: 'Joint Entrance Examination Main, National Testing Agency', site: 'https://jeemain.nta.nic.in' },
  'jee-adv': { name: 'JEE Advanced', long: 'Joint Entrance Examination Advanced, for the IITs', site: 'https://jeeadv.ac.in' },
  neet: { name: 'NEET UG', long: 'National Eligibility cum Entrance Test (UG), National Testing Agency, syllabus by the National Medical Commission', site: 'https://neet.nta.nic.in' },
};

export type Subject = 'physics' | 'chemistry' | 'maths' | 'biology';
export type Chapter = {
  id: string;         // URL slug of the chapter lesson, and the question-bank file name
  name: string;       // as students say it
  cls: 11 | 12;
  extra?: boolean;    // not in the NCERT books now, still asked by JEE Advanced or state tests
  neet?: false;       // left out of the NEET syllabus
};

export const CHAPTERS: Record<Subject, Chapter[]> = {
  physics: [
    { id: 'units-measurements', name: 'Units, dimensions and errors', cls: 11 },
    { id: 'motion-straight-line', name: 'Motion in a straight line', cls: 11 },
    { id: 'motion-plane', name: 'Vectors and motion in a plane', cls: 11 },
    { id: 'laws-of-motion', name: 'Laws of motion and friction', cls: 11 },
    { id: 'work-energy-power', name: 'Work, energy and power', cls: 11 },
    { id: 'centre-of-mass-collisions', name: 'Centre of mass, momentum and collisions', cls: 11 },
    { id: 'rotational-motion', name: 'Rotational motion', cls: 11 },
    { id: 'gravitation', name: 'Gravitation', cls: 11 },
    { id: 'solids-elasticity', name: 'Elasticity of solids', cls: 11 },
    { id: 'fluids', name: 'Fluids: pressure, flow, viscosity and surface tension', cls: 11 },
    { id: 'thermal-properties', name: 'Heat, expansion, calorimetry and heat transfer', cls: 11 },
    { id: 'thermodynamics-physics', name: 'Thermodynamics', cls: 11 },
    { id: 'kinetic-theory', name: 'Kinetic theory of gases', cls: 11 },
    { id: 'oscillations', name: 'Oscillations and simple harmonic motion', cls: 11 },
    { id: 'waves', name: 'Waves and sound', cls: 11 },
    { id: 'electric-charges-fields', name: 'Electric charges, fields and Gauss\'s law', cls: 12 },
    { id: 'potential-capacitance', name: 'Electric potential and capacitors', cls: 12 },
    { id: 'current-electricity', name: 'Current electricity and circuits', cls: 12 },
    { id: 'moving-charges-magnetism', name: 'Moving charges and magnetic fields', cls: 12 },
    { id: 'magnetism-matter', name: 'Magnetism and matter', cls: 12 },
    { id: 'electromagnetic-induction', name: 'Electromagnetic induction', cls: 12 },
    { id: 'alternating-current', name: 'Alternating current', cls: 12 },
    { id: 'em-waves', name: 'Electromagnetic waves', cls: 12 },
    { id: 'ray-optics', name: 'Ray optics and optical instruments', cls: 12 },
    { id: 'wave-optics', name: 'Wave optics', cls: 12 },
    { id: 'dual-nature', name: 'Dual nature of radiation and matter', cls: 12 },
    { id: 'atoms', name: 'Atoms', cls: 12 },
    { id: 'nuclei', name: 'Nuclei and radioactivity', cls: 12 },
    { id: 'semiconductors', name: 'Semiconductor electronics', cls: 12 },
    { id: 'experimental-physics', name: 'Experimental skills and practical physics', cls: 12 },
  ],
  chemistry: [
    { id: 'mole-concept', name: 'Some basic concepts: moles and stoichiometry', cls: 11 },
    { id: 'atomic-structure', name: 'Structure of the atom', cls: 11 },
    { id: 'periodic-table', name: 'Classification of elements and periodicity', cls: 11 },
    { id: 'chemical-bonding', name: 'Chemical bonding and molecular structure', cls: 11 },
    { id: 'states-of-matter', name: 'Gases and liquids', cls: 11, extra: true, neet: false },
    { id: 'chemical-thermodynamics', name: 'Chemical thermodynamics', cls: 11 },
    { id: 'chemical-equilibrium', name: 'Chemical equilibrium', cls: 11 },
    { id: 'ionic-equilibrium', name: 'Ionic equilibrium: acids, bases, pH and buffers', cls: 11 },
    { id: 'redox', name: 'Redox reactions', cls: 11 },
    { id: 's-block', name: 's-block elements and hydrogen', cls: 11, extra: true, neet: false },
    { id: 'goc', name: 'Organic chemistry basics (GOC) and isomerism', cls: 11 },
    { id: 'hydrocarbons', name: 'Hydrocarbons', cls: 11 },
    { id: 'solutions', name: 'Solutions and colligative properties', cls: 12 },
    { id: 'electrochemistry', name: 'Electrochemistry', cls: 12 },
    { id: 'chemical-kinetics', name: 'Chemical kinetics', cls: 12 },
    { id: 'solid-state-surface', name: 'Solid state and surface chemistry', cls: 12, extra: true, neet: false },
    { id: 'p-block', name: 'p-block elements (groups 13 to 18)', cls: 12 },
    { id: 'd-f-block', name: 'd- and f-block elements', cls: 12 },
    { id: 'coordination-compounds', name: 'Coordination compounds', cls: 12 },
    { id: 'metallurgy', name: 'Metals and metallurgy', cls: 12, extra: true, neet: false },
    { id: 'haloalkanes-haloarenes', name: 'Haloalkanes and haloarenes', cls: 12 },
    { id: 'alcohols-phenols-ethers', name: 'Alcohols, phenols and ethers', cls: 12 },
    { id: 'aldehydes-ketones-acids', name: 'Aldehydes, ketones and carboxylic acids', cls: 12 },
    { id: 'amines', name: 'Amines and diazonium salts', cls: 12 },
    { id: 'biomolecules', name: 'Biomolecules', cls: 12 },
    { id: 'practical-chemistry', name: 'Practical chemistry: salt analysis, titrations and tests', cls: 12 },
  ],
  maths: [
    { id: 'sets-relations-functions', name: 'Sets, relations and functions', cls: 11 },
    { id: 'trigonometry', name: 'Trigonometric functions and identities', cls: 11 },
    { id: 'trig-equations-triangles', name: 'Trigonometric equations and properties of triangles', cls: 11, extra: true },
    { id: 'complex-numbers', name: 'Complex numbers', cls: 11 },
    { id: 'quadratic-equations', name: 'Quadratic equations and inequalities', cls: 11 },
    { id: 'permutations-combinations', name: 'Permutations and combinations', cls: 11 },
    { id: 'binomial-theorem', name: 'Binomial theorem', cls: 11 },
    { id: 'sequences-series', name: 'Sequences and series', cls: 11 },
    { id: 'straight-lines', name: 'Straight lines', cls: 11 },
    { id: 'circles', name: 'Circles', cls: 11 },
    { id: 'conic-sections', name: 'Parabola, ellipse and hyperbola', cls: 11 },
    { id: 'limits', name: 'Limits', cls: 11 },
    { id: 'statistics', name: 'Statistics', cls: 11 },
    { id: 'probability', name: 'Probability', cls: 12 },
    { id: 'inverse-trig', name: 'Inverse trigonometric functions', cls: 12 },
    { id: 'matrices-determinants', name: 'Matrices and determinants', cls: 12 },
    { id: 'continuity-differentiability', name: 'Continuity and differentiability', cls: 12 },
    { id: 'applications-derivatives', name: 'Applications of derivatives', cls: 12 },
    { id: 'indefinite-integrals', name: 'Indefinite integrals', cls: 12 },
    { id: 'definite-integrals', name: 'Definite integrals and area', cls: 12 },
    { id: 'differential-equations', name: 'Differential equations', cls: 12 },
    { id: 'vectors', name: 'Vectors', cls: 12 },
    { id: 'three-d-geometry', name: 'Three-dimensional geometry', cls: 12 },
    { id: 'linear-programming', name: 'Linear programming', cls: 12 },
  ],
  biology: [
    { id: 'living-world-classification', name: 'The living world and biological classification', cls: 11 },
    { id: 'plant-kingdom', name: 'Plant kingdom', cls: 11 },
    { id: 'animal-kingdom', name: 'Animal kingdom', cls: 11 },
    { id: 'plant-morphology', name: 'Morphology of flowering plants', cls: 11 },
    { id: 'plant-anatomy', name: 'Anatomy of flowering plants', cls: 11 },
    { id: 'animal-tissues', name: 'Structural organisation in animals', cls: 11 },
    { id: 'cell', name: 'Cell: the unit of life', cls: 11 },
    { id: 'cell-biomolecules', name: 'Biomolecules and enzymes', cls: 11 },
    { id: 'cell-cycle', name: 'Cell cycle and cell division', cls: 11 },
    { id: 'photosynthesis', name: 'Photosynthesis in higher plants', cls: 11 },
    { id: 'plant-respiration', name: 'Respiration in plants', cls: 11 },
    { id: 'plant-growth', name: 'Plant growth and development', cls: 11 },
    { id: 'breathing', name: 'Breathing and exchange of gases', cls: 11 },
    { id: 'circulation', name: 'Body fluids and circulation', cls: 11 },
    { id: 'excretion', name: 'Excretory products and their elimination', cls: 11 },
    { id: 'locomotion', name: 'Locomotion and movement', cls: 11 },
    { id: 'neural-control', name: 'Neural control and coordination', cls: 11 },
    { id: 'chemical-coordination', name: 'Chemical coordination: hormones', cls: 11 },
    { id: 'plant-reproduction', name: 'Sexual reproduction in flowering plants', cls: 12 },
    { id: 'human-reproduction', name: 'Human reproduction', cls: 12 },
    { id: 'reproductive-health', name: 'Reproductive health', cls: 12 },
    { id: 'inheritance', name: 'Principles of inheritance and variation', cls: 12 },
    { id: 'molecular-inheritance', name: 'Molecular basis of inheritance', cls: 12 },
    { id: 'evolution', name: 'Evolution', cls: 12 },
    { id: 'health-disease', name: 'Human health and disease', cls: 12 },
    { id: 'microbes-welfare', name: 'Microbes in human welfare', cls: 12 },
    { id: 'biotech-principles', name: 'Biotechnology: principles and processes', cls: 12 },
    { id: 'biotech-applications', name: 'Biotechnology and its applications', cls: 12 },
    { id: 'organisms-populations', name: 'Organisms and populations', cls: 12 },
    { id: 'ecosystem', name: 'Ecosystem', cls: 12 },
    { id: 'biodiversity', name: 'Biodiversity and conservation', cls: 12 },
  ],
};

export const SUBJECT_NAMES: Record<Subject, string> = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics', biology: 'Biology' };
