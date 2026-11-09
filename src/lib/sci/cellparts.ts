// Cell explorer (school biology): the parts of plant, animal and bacterial cells, what each one does,
// and microscope magnification. Plain data and maths, no DOM. Written by fibub in plain English.

export type CellKind = 'plant' | 'animal' | 'bacterium';
export type Part = {
  id: string; name: string; job: string; more: string;
  /** Which cells have it. */ in: CellKind[];
  /** 9: shown from Class 9; 11: Class 11 detail. */ level: 9 | 11;
  /** One-word idea of its job, for the compare table and quiz. */ tag: string;
};

export const PARTS: Part[] = [
  { id: 'wall', name: 'Cell wall', tag: 'support', in: ['plant', 'bacterium'], level: 9, job: 'A tough outer layer that gives the cell its shape and stops it bursting when water comes in.', more: 'In plants it is made mostly of cellulose and lets water and dissolved substances through freely. A bacterium\'s wall is made of a different material (peptidoglycan).' },
  { id: 'membrane', name: 'Cell membrane', tag: 'gatekeeper', in: ['plant', 'animal', 'bacterium'], level: 9, job: 'A thin, flexible skin around the cytoplasm that decides what goes in and out.', more: 'It is selectively permeable: water passes by osmosis, while many other substances need carrier proteins. It is a double layer of lipids with proteins floating in it (the fluid mosaic model).' },
  { id: 'cytoplasm', name: 'Cytoplasm', tag: 'jelly', in: ['plant', 'animal', 'bacterium'], level: 9, job: 'The jelly-like fluid inside the membrane where the organelles sit and many reactions happen.', more: 'It is mostly water with dissolved salts, sugars and enzymes. Some steps of respiration (glycolysis) happen here.' },
  { id: 'nucleus', name: 'Nucleus', tag: 'control', in: ['plant', 'animal'], level: 9, job: 'The control centre: it holds the DNA, the instructions for making the cell\'s proteins.', more: 'It is wrapped in a double nuclear membrane with pores. Inside, the DNA forms chromatin, which coils into chromosomes when the cell divides. The nucleolus makes ribosomes.' },
  { id: 'nucleolus', name: 'Nucleolus', tag: 'ribosome maker', in: ['plant', 'animal'], level: 11, job: 'A dense spot inside the nucleus where the parts of ribosomes are made.', more: 'It has no membrane of its own. Cells that make a lot of protein often have a large nucleolus.' },
  { id: 'mito', name: 'Mitochondrion', tag: 'energy', in: ['plant', 'animal'], level: 9, job: 'The powerhouse: it releases energy from food in aerobic respiration, stored as ATP.', more: 'It has two membranes; the inner one is folded into cristae, giving more surface for the enzymes of respiration. Mitochondria have their own small circle of DNA and their own ribosomes.' },
  { id: 'chloro', name: 'Chloroplast', tag: 'food maker', in: ['plant'], level: 9, job: 'Traps light energy with green chlorophyll and uses it to make food (photosynthesis).', more: 'It is a plastid with two membranes. Inside, stacks of discs (grana, made of thylakoids) hold the chlorophyll, and the fluid around them (stroma) is where sugar is built. Like mitochondria, it has its own DNA.' },
  { id: 'vacuole', name: 'Vacuole', tag: 'storage', in: ['plant', 'animal'], level: 9, job: 'A sac of watery cell sap. In plant cells one large vacuole keeps the cell firm (turgid).', more: 'The plant vacuole is surrounded by its own membrane, the tonoplast, and can take up most of the cell. Animal cells have only small, temporary vacuoles.' },
  { id: 'er', name: 'Endoplasmic reticulum', tag: 'transport', in: ['plant', 'animal'], level: 9, job: 'A network of membrane tubes that carries materials through the cell.', more: 'Rough ER has ribosomes on it and makes proteins; smooth ER has none and makes lipids (fats), and in liver cells it helps remove poisons.' },
  { id: 'golgi', name: 'Golgi apparatus', tag: 'packaging', in: ['plant', 'animal'], level: 9, job: 'Stacks of flat sacs that sort, package and send off proteins and other products.', more: 'Products arrive from the ER, are changed and packed into small vesicles, then sent to the membrane or to other organelles. It also makes lysosomes.' },
  { id: 'lyso', name: 'Lysosome', tag: 'clean-up', in: ['animal'], level: 9, job: 'A small bag of digestive enzymes that breaks down worn-out parts and germs: the cell\'s waste disposal.', more: 'If the cell is damaged, lysosomes can burst and digest the cell itself, which is why they are called suicide bags. Plant cells use their vacuole for much of this job.' },
  { id: 'ribo', name: 'Ribosomes', tag: 'protein maker', in: ['plant', 'animal', 'bacterium'], level: 9, job: 'Tiny grains that join amino acids together to make proteins.', more: 'Found free in the cytoplasm and on rough ER. Plant and animal cells have larger 80S ribosomes; bacteria have smaller 70S ones (S is a unit of how fast they settle in a centrifuge).' },
  { id: 'centriole', name: 'Centrioles', tag: 'division', in: ['animal'], level: 11, job: 'A pair of short tubes that help pull chromosomes apart when an animal cell divides.', more: 'They sit in the centrosome near the nucleus and organise the spindle fibres. Most plant cells have none.' },
  { id: 'plasmo', name: 'Plasmodesmata', tag: 'links', in: ['plant'], level: 11, job: 'Tiny channels through the wall that join the cytoplasm of neighbouring plant cells.', more: 'They let water and small molecules pass from cell to cell without crossing a membrane.' },
  { id: 'nucleoid', name: 'Nucleoid', tag: 'control', in: ['bacterium'], level: 9, job: 'The region where a bacterium keeps its single, circular DNA. There is no nuclear membrane.', more: 'Cells without a true nucleus are called prokaryotes (bacteria). Cells with one, like plant and animal cells, are eukaryotes.' },
  { id: 'plasmid', name: 'Plasmids', tag: 'extra genes', in: ['bacterium'], level: 11, job: 'Small extra rings of DNA that carry a few useful genes, such as resistance to an antibiotic.', more: 'Bacteria can pass plasmids to each other. Scientists use them to carry genes into bacteria (genetic engineering).' },
  { id: 'capsule', name: 'Capsule', tag: 'protection', in: ['bacterium'], level: 11, job: 'A slimy outer coat on some bacteria that protects them and helps them stick to surfaces.', more: 'It also makes it harder for white blood cells to engulf the bacterium.' },
  { id: 'flagellum', name: 'Flagellum', tag: 'moving', in: ['bacterium'], level: 9, job: 'A long whip-like tail that spins to push the bacterium along.', more: 'A bacterial flagellum turns like a propeller, driven by a tiny motor in the membrane.' },
  { id: 'pili', name: 'Pili', tag: 'sticking', in: ['bacterium'], level: 11, job: 'Short hair-like threads that help a bacterium stick to surfaces and to other bacteria.', more: 'Special sex pili join two bacteria so DNA (often a plasmid) can pass between them.' },
  { id: 'mesosome', name: 'Mesosome', tag: 'folds', in: ['bacterium'], level: 11, job: 'An infolding of the membrane, once thought to help with respiration and with copying DNA.', more: 'Many scientists now think mesosomes appear only when cells are prepared for the electron microscope. Your syllabus may still name them.' },
];

export const partById = (id: string) => PARTS.find((p) => p.id === id);
export const partsFor = (kind: CellKind, level: 9 | 11) => PARTS.filter((p) => p.in.includes(kind) && p.level <= level);

/** Rows of the compare table: each part with yes/no for plant, animal and bacterium. */
export function compare(level: 9 | 11) {
  return PARTS.filter((p) => p.level <= level).map((p) => ({ id: p.id, name: p.name, plant: p.in.includes('plant'), animal: p.in.includes('animal'), bacterium: p.in.includes('bacterium') }));
}

/** Typical sizes for the scale bar and the magnification sums (round teaching values, in micrometres). */
export const TYPICAL_UM: Record<CellKind, number> = { plant: 50, animal: 20, bacterium: 2 };

/** Magnification = image size ÷ real size (same units). */
export const magnification = (imageMm: number, realUm: number) => (imageMm * 1000) / realUm;
/** Real size in micrometres from an image size in mm and a magnification. */
export const realSize = (imageMm: number, mag: number) => (imageMm * 1000) / mag;
/** Total magnification of a light microscope = eyepiece × objective. */
export const totalMag = (eyepiece: number, objective: number) => eyepiece * objective;
