// One place for the site's name, shelves and links. Pages read from here.
export const SITE = {
  name: 'fibub',
  url: 'https://fibub.com',
  tagline: 'Free tools that run in your browser',
  meaning: 'Free In-Browser Utility Bubble',
  description:
    'Free tools for documents, money, data, everyday tasks and science, made to fill the gaps other tools leave. Everything runs in your browser: your files and numbers never leave your device.',
  maker: { name: 'Nihal Sulaiman', url: 'https://nihalsulaiman.com' },
};

// The shelves. A tool's `shelf` must be one of these ids; it sets the tool's URL: /<shelf>/<tool>/.
export const SHELVES = [
  { id: 'money', name: 'Money', blurb: 'Budgets, loans, taxes and currency.' },
  { id: 'documents', name: 'Documents', blurb: 'PDFs and images, processed on your device.' },
  { id: 'everyday', name: 'Everyday', blurb: 'Dates, units, time zones and more.' },
  { id: 'science', name: 'Science', blurb: 'Astronomy and more science tools, worked out in your browser.' },
  { id: 'collecting', name: 'Collecting', blurb: 'Check, value and record coins, banknotes, bullion and any collection.' },
] as const;

// Science is big, so its tools sit in subjects (Physics, Chemistry, ...) and each subject in sections
// (Physics > Optics and photonics). A tool joins a section with `section:` in its guide.md; the section
// names its subject. Menus go shelf > subject > section > tool, and each subject has its own page at
// /<shelf>/<subject>/. A subject or section shows up on the site once it has a live tool.
// Money and Documents work the same way. Everyday has no subjects or sections: its tools are listed together.
export type Subject = { id: string; name: string; blurb: string };
export type Section = { id: string; name: string; blurb?: string; subject?: string };
export const SUBJECTS: Record<string, Subject[]> = {
  science: [
    { id: 'physics', name: 'Physics', blurb: 'Mechanics, fields, heat, light, sound, quantum and lab work.' },
    { id: 'astronomy', name: 'Astronomy and space', blurb: 'Plan the night, take pictures of the sky, and work with astronomical data.' },
    { id: 'chemistry', name: 'Chemistry', blurb: 'Lab maths, analysis, kinetics, electrochemistry and more.' },
    { id: 'materials', name: 'Materials science', blurb: 'Crystals, strength tests, microscopy and semiconductors.' },
    { id: 'earth', name: 'Earth sciences', blurb: 'Geology in the field and the lab, from stereonets to rock ages.' },
    { id: 'climate', name: 'Weather, ocean and climate', blurb: 'Weather, air, sea, ice and water.' },
    { id: 'environment', name: 'Environmental science', blurb: 'Monitoring, toxicity, treatment, carbon and conservation.' },
    { id: 'cell-biology', name: 'Molecular and cell biology', blurb: 'Bench maths, sequences, proteins, cells and microbes.' },
    { id: 'ecology', name: 'Ecology and organisms', blurb: 'Populations, communities, plants, animals and the brain.' },
    { id: 'agriculture', name: 'Agriculture and food', blurb: 'Soil, crops, food science and animals.' },
    { id: 'health', name: 'Health and medicine', blurb: 'Epidemiology, biostatistics and teaching calculators.' },
    { id: 'maths', name: 'Maths, statistics and computing', blurb: 'Maths, statistics, data and computer science.' },
    { id: 'engineering', name: 'Engineering', blurb: 'Circuits, signals, structures, machines and energy.' },
    { id: 'social', name: 'Social sciences', blurb: 'Psychology, language, economics, surveys and populations.' },
    { id: 'humanities', name: 'Humanities and archaeology', blurb: 'Dating, archaeology, texts, heritage and music.' },
    { id: 'research-kit', name: 'Research toolkit', blurb: 'Figures, writing, lab planning and data for any field.' },
  ],
  // Money and Documents (nihal, 2026-11-10): categories and subcategories the same way as Science.
  money: [
    { id: 'everyday-money', name: 'Everyday money', blurb: 'Budgets, bills, shopping maths and prices.' },
    { id: 'borrowing', name: 'Loans and debt', blurb: 'Loans, mortgages, credit cards and paying off debt.' },
    { id: 'saving', name: 'Saving and investing', blurb: 'Interest, investing and retirement, worked out plainly.' },
    { id: 'tax', name: 'Tax and pay', blurb: 'Income tax, take-home pay and what your work earns.' },
    { id: 'canada-work', name: 'Work in Canada', blurb: 'EI, pay and benefits for anyone working in Canada: students, work-permit holders, permanent residents and citizens.' },
    { id: 'insurance', name: 'Insurance', blurb: 'What a policy really costs and pays, worked out with plain maths. Educational, not advice.' },
    { id: 'vehicles', name: 'Cars, bikes and trucks', blurb: 'Buying, running and driving a car, two-wheeler or truck, with India, Canada and US rules.' },
    { id: 'business', name: 'Business', blurb: 'Pricing, break-even and the numbers behind a small business.' },
    { id: 'medical-costs', name: 'Medical costs', blurb: 'Check medical bills, claim back costs and plan what you owe.' },
  ],
  documents: [
    { id: 'pdf', name: 'PDF tools', blurb: 'Organise, number, stamp, sign and fill PDFs on your device.' },
    { id: 'convert', name: 'Convert and compress', blurb: 'Change formats, shrink files and size photos.' },
    { id: 'privacy', name: 'Privacy and checks', blurb: 'Redact, remove hidden data and compare versions before you send.' },
    { id: 'writing', name: 'Writing and templates', blurb: 'Invoices, letters, mail merge and text helpers.' },
    { id: 'career', name: 'Jobs and study', blurb: 'Resumes, cover letters and applications.' },
    { id: 'health-records', name: 'Health records', blurb: 'Organise and read your own reports, scans and health logs, on your device.' },
  ],
};

export const SECTIONS: Record<string, Section[]> = {
  science: [
    // Physics
    { id: 'classical-mechanics', subject: 'physics', name: 'Classical mechanics' },
    { id: 'electromagnetism', subject: 'physics', name: 'Electromagnetism' },
    { id: 'thermodynamics-and-statistical-physics', subject: 'physics', name: 'Thermodynamics and statistical physics' },
    { id: 'quantum-mechanics', subject: 'physics', name: 'Quantum mechanics' },
    { id: 'optics-and-photonics', subject: 'physics', name: 'Optics and photonics' },
    { id: 'acoustics-and-wave-physics', subject: 'physics', name: 'Acoustics and wave physics' },
    { id: 'nuclear-and-particle-physics', subject: 'physics', name: 'Nuclear and particle physics' },
    { id: 'plasma-physics', subject: 'physics', name: 'Plasma physics' },
    { id: 'fluid-dynamics', subject: 'physics', name: 'Fluid dynamics' },
    { id: 'condensed-matter-physics', subject: 'physics', name: 'Condensed matter physics' },
    { id: 'relativity-and-gravitation', subject: 'physics', name: 'Relativity and gravitation' },
    { id: 'biophysics-and-medical-physics', subject: 'physics', name: 'Biophysics and medical physics' },
    { id: 'general-physics-lab-helpers', subject: 'physics', name: 'General physics lab helpers' },
    // Astronomy and space
    { id: 'observing', subject: 'astronomy', name: 'Observing', blurb: 'Plan the night, find what is up, line up the mount and log what you see.' },
    { id: 'astrophotography', subject: 'astronomy', name: 'Astrophotography', blurb: 'Size up your telescope and camera, set exposures and open FITS files.' },
    { id: 'planetary-science', subject: 'astronomy', name: 'Planetary science' },
    { id: 'solar-physics', subject: 'astronomy', name: 'Solar physics' },
    { id: 'stellar-astrophysics', subject: 'astronomy', name: 'Stellar astrophysics' },
    { id: 'galactic-and-extragalactic-astronomy', subject: 'astronomy', name: 'Galactic and extragalactic astronomy' },
    { id: 'exoplanets', subject: 'astronomy', name: 'Exoplanets' },
    { id: 'radio-astronomy', subject: 'astronomy', name: 'Radio astronomy' },
    { id: 'spaceflight-and-astrodynamics', subject: 'astronomy', name: 'Spaceflight and astrodynamics' },
    { id: 'research', subject: 'astronomy', name: 'Research', blurb: 'Coordinates, time systems and catalogue work for students and researchers.' },
    // Chemistry
    { id: 'general-and-lab-chemistry', subject: 'chemistry', name: 'General and lab chemistry' },
    { id: 'organic-chemistry', subject: 'chemistry', name: 'Organic chemistry' },
    { id: 'analytical-chemistry', subject: 'chemistry', name: 'Analytical chemistry' },
    { id: 'physical-chemistry', subject: 'chemistry', name: 'Physical chemistry' },
    { id: 'inorganic-and-coordination-chemistry', subject: 'chemistry', name: 'Inorganic and coordination chemistry' },
    { id: 'computational-chemistry', subject: 'chemistry', name: 'Computational chemistry' },
    { id: 'electrochemistry-and-battery-science', subject: 'chemistry', name: 'Electrochemistry and battery science' },
    { id: 'polymer-chemistry', subject: 'chemistry', name: 'Polymer chemistry' },
    { id: 'medicinal-chemistry', subject: 'chemistry', name: 'Medicinal chemistry' },
    { id: 'green-chemistry-and-safety', subject: 'chemistry', name: 'Green chemistry and safety' },
    { id: 'nuclear-and-radiochemistry', subject: 'chemistry', name: 'Nuclear and radiochemistry' },
    // Materials science
    { id: 'crystallography', subject: 'materials', name: 'Crystallography' },
    { id: 'mechanical-behaviour', subject: 'materials', name: 'Mechanical behaviour' },
    { id: 'phase-and-thermal-behaviour', subject: 'materials', name: 'Phase and thermal behaviour' },
    { id: 'microscopy-and-image-analysis', subject: 'materials', name: 'Microscopy and image analysis' },
    { id: 'nanoscience', subject: 'materials', name: 'Nanoscience' },
    { id: 'semiconductors-and-electronics-materials', subject: 'materials', name: 'Semiconductors and electronics materials' },
    // Earth sciences
    { id: 'structural-geology', subject: 'earth', name: 'Structural geology' },
    { id: 'mineralogy-and-petrology', subject: 'earth', name: 'Mineralogy and petrology' },
    { id: 'geochemistry-and-geochronology', subject: 'earth', name: 'Geochemistry and geochronology' },
    { id: 'sedimentology-and-stratigraphy', subject: 'earth', name: 'Sedimentology and stratigraphy' },
    { id: 'geophysics-and-seismology', subject: 'earth', name: 'Geophysics and seismology' },
    { id: 'volcanology', subject: 'earth', name: 'Volcanology' },
    { id: 'geomorphology', subject: 'earth', name: 'Geomorphology' },
    { id: 'hydrogeology', subject: 'earth', name: 'Hydrogeology' },
    { id: 'mining-and-economic-geology', subject: 'earth', name: 'Mining and economic geology' },
    { id: 'geodesy-and-surveying', subject: 'earth', name: 'Geodesy and surveying' },
    { id: 'remote-sensing-and-gis', subject: 'earth', name: 'Remote sensing and GIS' },
    // Weather, ocean and climate
    { id: 'meteorology', subject: 'climate', name: 'Meteorology' },
    { id: 'climatology', subject: 'climate', name: 'Climatology' },
    { id: 'atmospheric-chemistry-and-air-quality', subject: 'climate', name: 'Atmospheric chemistry and air quality' },
    { id: 'physical-oceanography', subject: 'climate', name: 'Physical oceanography' },
    { id: 'chemical-and-biological-oceanography', subject: 'climate', name: 'Chemical and biological oceanography' },
    { id: 'glaciology-and-cryosphere', subject: 'climate', name: 'Glaciology and cryosphere' },
    { id: 'paleoclimatology', subject: 'climate', name: 'Paleoclimatology' },
    { id: 'hydrology-and-water-resources', subject: 'climate', name: 'Hydrology and water resources' },
    // Environmental science
    { id: 'environmental-monitoring', subject: 'environment', name: 'Environmental monitoring' },
    { id: 'ecotoxicology', subject: 'environment', name: 'Ecotoxicology' },
    { id: 'environmental-engineering', subject: 'environment', name: 'Environmental engineering' },
    { id: 'carbon-and-energy-accounting', subject: 'environment', name: 'Carbon and energy accounting' },
    { id: 'conservation-science', subject: 'environment', name: 'Conservation science' },
    // Molecular and cell biology
    { id: 'molecular-biology', subject: 'cell-biology', name: 'Molecular biology' },
    { id: 'genomics-and-bioinformatics', subject: 'cell-biology', name: 'Genomics and bioinformatics' },
    { id: 'proteomics-and-protein-science', subject: 'cell-biology', name: 'Proteomics and protein science' },
    { id: 'biochemistry', subject: 'cell-biology', name: 'Biochemistry' },
    { id: 'structural-biology', subject: 'cell-biology', name: 'Structural biology' },
    { id: 'cell-biology-and-cell-culture', subject: 'cell-biology', name: 'Cell biology and cell culture' },
    { id: 'microbiology', subject: 'cell-biology', name: 'Microbiology' },
    { id: 'virology-and-immunology', subject: 'cell-biology', name: 'Virology and immunology' },
    { id: 'genetics', subject: 'cell-biology', name: 'Genetics' },
    { id: 'synthetic-biology', subject: 'cell-biology', name: 'Synthetic biology' },
    { id: 'metabolomics-and-lipidomics', subject: 'cell-biology', name: 'Metabolomics and lipidomics' },
    { id: 'systems-biology', subject: 'cell-biology', name: 'Systems biology' },
    // Ecology and organisms
    { id: 'ecology', subject: 'ecology', name: 'Ecology' },
    { id: 'evolutionary-biology-and-phylogenetics', subject: 'ecology', name: 'Evolutionary biology and phylogenetics' },
    { id: 'population-genetics', subject: 'ecology', name: 'Population genetics' },
    { id: 'zoology-and-animal-behaviour', subject: 'ecology', name: 'Zoology and animal behaviour' },
    { id: 'entomology', subject: 'ecology', name: 'Entomology' },
    { id: 'botany-and-plant-science', subject: 'ecology', name: 'Botany and plant science' },
    { id: 'mycology-and-plant-pathology', subject: 'ecology', name: 'Mycology and plant pathology' },
    { id: 'marine-and-freshwater-biology', subject: 'ecology', name: 'Marine and freshwater biology' },
    { id: 'forestry', subject: 'ecology', name: 'Forestry' },
    { id: 'fisheries-science', subject: 'ecology', name: 'Fisheries science' },
    { id: 'physiology', subject: 'ecology', name: 'Physiology' },
    { id: 'neuroscience', subject: 'ecology', name: 'Neuroscience' },
    { id: 'developmental-biology', subject: 'ecology', name: 'Developmental biology' },
    { id: 'astrobiology', subject: 'ecology', name: 'Astrobiology' },
    // Agriculture and food
    { id: 'agronomy-and-soil-science', subject: 'agriculture', name: 'Agronomy and soil science' },
    { id: 'horticulture-and-plant-breeding', subject: 'agriculture', name: 'Horticulture and plant breeding' },
    { id: 'food-science', subject: 'agriculture', name: 'Food science' },
    { id: 'animal-science', subject: 'agriculture', name: 'Animal science' },
    { id: 'veterinary-science', subject: 'agriculture', name: 'Veterinary science' },
    { id: 'aquaculture', subject: 'agriculture', name: 'Aquaculture' },
    // Health and medicine
    { id: 'epidemiology', subject: 'health', name: 'Epidemiology' },
    { id: 'biostatistics', subject: 'health', name: 'Biostatistics' },
    { id: 'pharmacology', subject: 'health', name: 'Pharmacology' },
    { id: 'toxicology', subject: 'health', name: 'Toxicology' },
    { id: 'clinical-calculators', subject: 'health', name: 'Clinical calculators' },
    { id: 'medical-imaging', subject: 'health', name: 'Medical imaging' },
    { id: 'nutrition-and-dietetics', subject: 'health', name: 'Nutrition and dietetics' },
    { id: 'exercise-and-sport-science', subject: 'health', name: 'Exercise and sport science' },
    { id: 'public-health', subject: 'health', name: 'Public health' },
    { id: 'audiology-and-vision-science', subject: 'health', name: 'Audiology and vision science' },
    { id: 'dentistry', subject: 'health', name: 'Dentistry' },
    { id: 'genetic-counselling', subject: 'health', name: 'Genetic counselling' },
    { id: 'nursing-and-lab-medicine', subject: 'health', name: 'Nursing and lab medicine' },
    // Maths, statistics and computing
    { id: 'pure-mathematics', subject: 'maths', name: 'Pure mathematics' },
    { id: 'applied-mathematics', subject: 'maths', name: 'Applied mathematics' },
    { id: 'geometry-and-topology', subject: 'maths', name: 'Geometry and topology' },
    { id: 'discrete-maths-and-graph-theory', subject: 'maths', name: 'Discrete maths and graph theory' },
    { id: 'statistics', subject: 'maths', name: 'Statistics' },
    { id: 'data-science-and-machine-learning', subject: 'maths', name: 'Data science and machine learning' },
    { id: 'computer-science', subject: 'maths', name: 'Computer science' },
    { id: 'information-theory-and-cryptography', subject: 'maths', name: 'Information theory and cryptography' },
    { id: 'operations-research', subject: 'maths', name: 'Operations research' },
    { id: 'complex-systems-and-network-science', subject: 'maths', name: 'Complex systems and network science' },
    // Engineering
    { id: 'electrical-and-electronics', subject: 'engineering', name: 'Electrical and electronics' },
    { id: 'signal-processing', subject: 'engineering', name: 'Signal processing' },
    { id: 'rf-and-communications', subject: 'engineering', name: 'RF and communications' },
    { id: 'control-and-robotics', subject: 'engineering', name: 'Control and robotics' },
    { id: 'mechanical-engineering', subject: 'engineering', name: 'Mechanical engineering' },
    { id: 'civil-and-structural-engineering', subject: 'engineering', name: 'Civil and structural engineering' },
    { id: 'geotechnical-engineering', subject: 'engineering', name: 'Geotechnical engineering' },
    { id: 'thermal-and-fluid-engineering', subject: 'engineering', name: 'Thermal and fluid engineering' },
    { id: 'chemical-engineering', subject: 'engineering', name: 'Chemical engineering' },
    { id: 'aerospace-engineering', subject: 'engineering', name: 'Aerospace engineering' },
    { id: 'energy-and-power-systems', subject: 'engineering', name: 'Energy and power systems' },
    { id: 'nuclear-engineering', subject: 'engineering', name: 'Nuclear engineering' },
    { id: 'biomedical-engineering', subject: 'engineering', name: 'Biomedical engineering' },
    { id: 'transportation-engineering', subject: 'engineering', name: 'Transportation engineering' },
    { id: 'petroleum-engineering', subject: 'engineering', name: 'Petroleum engineering' },
    { id: 'metrology-and-quality', subject: 'engineering', name: 'Metrology and quality' },
    // Social sciences
    { id: 'psychology-and-psychometrics', subject: 'social', name: 'Psychology and psychometrics' },
    { id: 'cognitive-science', subject: 'social', name: 'Cognitive science' },
    { id: 'linguistics-and-phonetics', subject: 'social', name: 'Linguistics and phonetics' },
    { id: 'economics', subject: 'social', name: 'Economics' },
    { id: 'econometrics', subject: 'social', name: 'Econometrics' },
    { id: 'sociology-and-survey-research', subject: 'social', name: 'Sociology and survey research' },
    { id: 'political-science', subject: 'social', name: 'Political science' },
    { id: 'demography', subject: 'social', name: 'Demography' },
    { id: 'human-geography-and-urban-studies', subject: 'social', name: 'Human geography and urban studies' },
    { id: 'anthropology', subject: 'social', name: 'Anthropology' },
    { id: 'education-research', subject: 'social', name: 'Education research' },
    { id: 'criminology-and-legal-studies', subject: 'social', name: 'Criminology and legal studies' },
    // Humanities and archaeology
    { id: 'archaeology', subject: 'humanities', name: 'Archaeology' },
    { id: 'paleontology', subject: 'humanities', name: 'Paleontology' },
    { id: 'dating-methods', subject: 'humanities', name: 'Dating methods' },
    { id: 'digital-humanities', subject: 'humanities', name: 'Digital humanities' },
    { id: 'heritage-conservation', subject: 'humanities', name: 'Heritage conservation' },
    { id: 'musicology-and-music-acoustics', subject: 'humanities', name: 'Musicology and music acoustics' },
    // Research toolkit
    { id: 'writing-and-publishing', subject: 'research-kit', name: 'Writing and publishing' },
    { id: 'figures-and-data-presentation', subject: 'research-kit', name: 'Figures and data presentation' },
    { id: 'lab-management', subject: 'research-kit', name: 'Lab management' },
    { id: 'data-management', subject: 'research-kit', name: 'Data management' },
    { id: 'ethics-and-planning', subject: 'research-kit', name: 'Ethics and planning' },
    { id: 'teaching-and-outreach', subject: 'research-kit', name: 'Teaching and outreach' },
    { id: 'citizen-science', subject: 'research-kit', name: 'Citizen science' },
  ],
  money: [
    { id: 'budgeting', subject: 'everyday-money', name: 'Budgets and bills' },
    { id: 'shopping', subject: 'everyday-money', name: 'Shopping and prices' },
    { id: 'loans', subject: 'borrowing', name: 'Loans' },
    { id: 'mortgages', subject: 'borrowing', name: 'Mortgages and homes' },
    { id: 'debt', subject: 'borrowing', name: 'Credit cards and debt' },
    { id: 'interest', subject: 'saving', name: 'Savings and interest' },
    { id: 'investing', subject: 'saving', name: 'Investing' },
    { id: 'retirement', subject: 'saving', name: 'Retirement' },
    { id: 'income-tax', subject: 'tax', name: 'Income tax' },
    { id: 'pay', subject: 'tax', name: 'Pay and salary' },
    { id: 'ei-benefits', subject: 'canada-work', name: 'EI and benefits' },
    { id: 'insurance-basics', subject: 'insurance', name: 'Insurance basics' },
    { id: 'health-insurance', subject: 'insurance', name: 'Health and dental' },
    { id: 'car-insurance', subject: 'insurance', name: 'Car and bike' },
    { id: 'life-insurance', subject: 'insurance', name: 'Life' },
    { id: 'home-insurance', subject: 'insurance', name: 'Home and contents' },
    { id: 'vehicle-buying', subject: 'vehicles', name: 'Buying a vehicle' },
    { id: 'vehicle-running', subject: 'vehicles', name: 'Running costs' },
    { id: 'driving', subject: 'vehicles', name: 'Driving and safety' },
    { id: 'two-wheelers', subject: 'vehicles', name: 'Bikes and scooters' },
    { id: 'trucking', subject: 'vehicles', name: 'Trucks and transport' },
    { id: 'small-business', subject: 'business', name: 'Small business' },
    { id: 'accounting', subject: 'business', name: 'Accounting' },
    { id: 'medical-bills', subject: 'medical-costs', name: 'Bills and claims' },
    { id: 'medical-tax', subject: 'medical-costs', name: 'Tax and payment plans' },
  ],
  documents: [
    { id: 'pdf-pages', subject: 'pdf', name: 'Organise pages' },
    { id: 'pdf-edit', subject: 'pdf', name: 'Number, stamp and watermark' },
    { id: 'pdf-sign', subject: 'pdf', name: 'Sign and fill' },
    { id: 'convert-files', subject: 'convert', name: 'Convert and compress files' },
    { id: 'images-scans', subject: 'convert', name: 'Photos and scans' },
    { id: 'privacy-clean', subject: 'privacy', name: 'Redact and clean' },
    { id: 'doc-checks', subject: 'privacy', name: 'Compare and check' },
    { id: 'templates', subject: 'writing', name: 'Invoices, letters and templates' },
    { id: 'text-tools', subject: 'writing', name: 'Text helpers' },
    { id: 'jobs', subject: 'career', name: 'Jobs and applications' },
    { id: 'lab-results', subject: 'health-records', name: 'Lab results' },
    { id: 'records-files', subject: 'health-records', name: 'Records, scans and summaries' },
    { id: 'health-logs', subject: 'health-records', name: 'Logs and prescriptions' },
  ],
  // Collecting: sections only, no subjects.
  collecting: [
    { id: 'vetting', name: 'Check and vet', blurb: 'Weigh, measure and grade a piece, and see where it differs from the official figures.' },
    { id: 'metals', name: 'Metals and bullion', blurb: 'Melt value at today\u2019s prices, purity and bullion weights.' },
    { id: 'coins-notes', name: 'Coins and banknotes', blurb: 'Dates in other calendars, serial numbers and old money.' },
    { id: 'any-collection', name: 'Any collection', blurb: 'Catalogue and value what you own, kept on your device.' },
  ],
  // The Learn shelf (see LEARN_SHELF below): one section per school subject.
  learn: [
    { id: 'school-physics', name: 'Physics' },
    { id: 'school-chemistry', name: 'Chemistry' },
    { id: 'school-biology', name: 'Biology' },
    { id: 'school-maths', name: 'Maths' },
    { id: 'school-earth', name: 'Earth and space' },
  ],
};

export const subjectById = (shelf: string, id?: string) => SUBJECTS[shelf]?.find((s) => s.id === id);
/** "Astronomy and space: observing", or just the section name when it has no subject. */
export const sectionLabel = (s: { name: string; subject?: string }, shelf = 'science') => {
  const sj = subjectById(shelf, s.subject);
  return sj ? `${sj.name}: ${s.name.toLowerCase()}` : s.name;
};

/**
 * Tool ID codes (nihal, 2026-11-10): one capital letter per area, counted without gaps (#T1, #T2 ...,
 * #L1, #L2 ...). A new area gets a free letter that cannot be mixed up with another (never I or O);
 * when its letter is taken, it gets a short code of a few letters instead (Teaching would be TCH).
 * Old plain numbers (#3, #1211) stay as search aliases. scripts/renumber.mjs and new-tool.mjs follow this.
 */
export const CODES = [
  { prefix: 'T', name: 'Tools', shelves: ['science', 'documents', 'money', 'everyday', 'collecting'], text: 'Everything on the Tools tab: Science, Documents, Money, Everyday and Collecting.' },
  { prefix: 'L', name: 'Learn', shelves: ['learn'], text: 'School science and maths activities, Class 8 to 12.' },
] as const;
export const codePrefix = (shelf: string) => CODES.find((c) => (c.shelves as readonly string[]).includes(shelf))?.prefix ?? 'T';


// Learn tools (school science and maths, following the NCERT topics for Class 8 to 12) are a shelf of
// their own so they live at /learn/<id>/ and fill the Learn area, but they are kept out of SHELVES so the
// Tools menus, the home page and /tools/ stay as they are. Class pages (/learn/class-8/ ...) list them by
// chapter from src/data/ncert.ts, together with the science tools that fit a chapter.
export const LEARN_SHELF = { id: 'learn', name: 'Learn', blurb: 'Interactive science and maths for school students, Class 8 to 12.' } as const;
// Pages of the Learn area that sit at /learn/<name>/: a learn tool may never take one of these ids.
export const LEARN_PAGES = ['school', 'experiments', 'courses', 'languages', 'class-8', 'class-9', 'class-10', 'class-11', 'class-12'];
export type ShelfId = (typeof SHELVES)[number]['id'] | 'learn';
export const SHELF_IDS = [...SHELVES.map((s) => s.id), LEARN_SHELF.id] as [ShelfId, ...ShelfId[]];
export const shelfById = (id: string) => (id === LEARN_SHELF.id ? LEARN_SHELF : SHELVES.find((s) => s.id === id)!) as { id: string; name: string; blurb: string };

// The bottom bar (phones and computers): five main tabs, each with its own colour, and a smaller bar
// of that area's sections above it. `match` lists the path starts that belong to an area; Menu is
// everything else (About, Contact, Privacy, ...), and its tab opens the full menu panel.
export type AreaTab = { name: string; href: string; match?: string[] };
export type Area = { id: 'learn' | 'tools' | 'home' | 'news' | 'menu'; name: string; href: string; blurb: string; match: string[]; tabs: AreaTab[] };
export const AREAS: Area[] = [
  {
    id: 'learn', name: 'Learn', href: '/learn/', match: ['/learn/'],
    blurb: 'For school students: tools, experiments, short courses and language practice.',
    tabs: [
      { name: 'Overview', href: '/learn/' },
      { name: 'Class 8 to 12', href: '/learn/school/', match: ['/learn/class-'] },
      { name: 'Experiments', href: '/learn/experiments/' },
      { name: 'Courses', href: '/learn/courses/' },
      { name: 'Languages', href: '/learn/languages/' },
    ],
  },
  {
    id: 'tools', name: 'Tools', href: '/tools/', match: ['/tools/', ...SHELVES.map((s) => `/${s.id}/`)],
    blurb: 'Every fibub tool, shelf by shelf.',
    tabs: [{ name: 'All', href: '/tools/' }, ...SHELVES.map((s) => ({ name: s.name, href: `/${s.id}/`, match: [`/${s.id}/`] }))],
  },
  {
    id: 'home', name: 'Home', href: '/', match: ['/home/'],
    blurb: 'Search, My tools and the shelves.',
    tabs: [{ name: 'Search', href: '/#find' }, ...SHELVES.map((s) => ({ name: s.name, href: `/#${s.id}` }))],
  },
  {
    id: 'news', name: 'News', href: '/news/', match: ['/news/', '/changes/', '/stats/'],
    blurb: 'New tools, every change to the site, and how much the tools are used.',
    tabs: [
      { name: 'Latest', href: '/news/' },
      { name: 'Change log', href: '/changes/', match: ['/changes/'] },
      { name: 'Usage stats', href: '/stats/' },
    ],
  },
  {
    id: 'menu', name: 'Menu', href: '/about/', match: [],
    blurb: 'About fibub, contact, privacy and terms.',
    tabs: [
      { name: 'About', href: '/about/' },
      { name: 'Contact', href: '/contact/' },
      { name: 'Privacy', href: '/privacy/' },
      { name: 'Terms', href: '/terms/' },
    ],
  },
];

/** The area a path belongs to: Home for /, Menu for pages outside the other areas. */
export function areaOf(path: string): Area {
  if (path === '/' || path === '') return AREAS.find((a) => a.id === 'home')!;
  return AREAS.find((a) => a.match.some((m) => path.startsWith(m))) ?? AREAS.find((a) => a.id === 'menu')!;
}
/** The section tab that is current on a path: an exact match, or the longest `match` prefix. */
export function currentTab(area: Area, path: string): AreaTab | undefined {
  const p = path.endsWith('/') ? path : path + '/';
  return area.tabs.find((t) => t.href === p) ?? area.tabs.find((t) => t.match?.some((m) => p.startsWith(m)));
}
