// NEET UG Biology: Cell cycle and cell division (NCERT Class 11, Chapter 10). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const E = ['neet'];
const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [2, 0, 3, 1];
const nid = () => `cc-${String(++n).padStart(3, '0')}`;
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];

// single-answer mcq; the right option is placed at a cycling position
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: E, sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function asr(level, sub, A, R, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'assertion', exams: E, sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function stm(level, sub, s1, s2, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'statements', exams: E, sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function match(level, sub, key, title, list1, list2, correct, wrongs, sol, trap) {
  groups[key] = { title, list1, list2 };
  const p = POS[pos++ % 4];
  const options = [...wrongs]; options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'match', exams: E, sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function pass(key, title, passage) { groups[key] = { title, passage }; }
function pq(key, level, sub, q, correct, wrongs, sol, trap) {
  const p = POS[pos++ % 4];
  const options = [...wrongs]; options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'passage', exams: E, sub, group: key, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}

// ---------------------------------------------------------------- Level 1
mc(1, 'cell cycle phases', 'In which phase of the cell cycle is DNA replicated?', 'S phase', ['G1 phase', 'G2 phase', 'M phase'], 'S stands for synthesis. DNA replication happens in S phase; G1 is growth before replication and G2 is preparation for division.');
mc(1, 'cell cycle phases', 'The phase in which actual cell division takes place is the', 'M phase', ['G1 phase', 'S phase', 'G0 phase'], 'M (mitosis) phase is when the nucleus and then the cell divide. Everything else is interphase.');
mc(1, 'cell cycle phases', 'The inactive stage in which a cell stops dividing and remains metabolically active is the', 'G0 phase (quiescent stage)', ['S phase', 'prophase', 'telophase'], 'Cells that do not divide further exit G1 and enter G0. They stay alive and active but do not proliferate unless called on.');
mc(1, 'mitosis', 'Mitosis is also called equational division because', 'daughter cells keep the same chromosome number as the parent cell', ['the chromosome number is halved', 'only one daughter cell is formed', 'DNA is not replicated'], 'In mitosis the diploid number (2n) is kept in both daughter cells. Halving is the job of meiosis.');
mc(1, 'mitosis', 'The stage of mitosis in which chromosomes are arranged at the equator of the cell is', 'metaphase', ['prophase', 'anaphase', 'telophase'], 'Chromosomes line up on the metaphase plate at the equator, attached by kinetochores to spindle fibres from both poles.');
mc(1, 'mitosis', 'During anaphase of mitosis, the', 'sister chromatids separate and move to opposite poles', ['homologous chromosomes pair', 'nuclear envelope forms', 'chromosomes first become visible'], 'The centromere splits and the chromatids are pulled apart. Pairing of homologues is a feature of meiosis I.');
mc(1, 'meiosis', 'Meiosis produces', 'four haploid cells', ['two diploid cells', 'two haploid cells', 'four diploid cells'], 'One diploid cell goes through two divisions (meiosis I and II) but only one DNA replication, giving four haploid cells.');
mc(1, 'meiosis', 'Pairing of homologous chromosomes is called', 'synapsis', ['terminalisation', 'cytokinesis', 'karyokinesis'], 'Synapsis happens in zygotene of prophase I. The paired homologues form a bivalent.');
mc(1, 'meiosis', 'Crossing over takes place between', 'non-sister chromatids of homologous chromosomes', ['sister chromatids of one chromosome', 'two non-homologous chromosomes', 'chromatids of different cells'], 'Crossing over exchanges segments between non-sister chromatids of a homologous pair, during pachytene.');
mc(1, 'cytokinesis', 'In a plant cell, cytokinesis begins with the formation of a', 'cell plate', ['cleavage furrow', 'spindle', 'kinetochore'], 'The cell plate forms in the centre and grows outward to the side walls. It becomes the middle lamella. Animal cells form a furrow.');
mc(1, 'cytokinesis', 'In animal cells, cytokinesis is by', 'a furrow in the plasma membrane that deepens', ['a cell plate at the centre', 'chiasmata formation', 'a synaptonemal complex'], 'The membrane pinches in by a furrow that deepens until the cell is divided.');
mc(1, 'cell cycle phases', 'Which part of the cell cycle is the longest?', 'Interphase', ['Metaphase', 'Anaphase', 'Cytokinesis'], 'Interphase lasts more than 95 per cent of the cycle. In a human cell dividing every 24 hours, mitosis takes only about an hour.');
mc(1, 'mitosis', 'Mitosis is useful for', 'growth and repair of the body', ['formation of gametes', 'formation of variation by crossing over', 'halving of the chromosome number'], 'Mitosis makes identical cells for growth, repair and replacement. Gamete formation uses meiosis.');
mc(1, 'meiosis', 'The stage between meiosis I and meiosis II is', 'interkinesis', ['interphase with S phase', 'diakinesis', 'synapsis'], 'Interkinesis is short and there is no DNA replication in it.');

// ---------------------------------------------------------------- Level 2
mc(2, 'cell cycle phases', 'A human cell in culture takes about 24 hours for one cycle. The time for M phase is roughly', '1 hour', ['12 hours', '8 hours', '4 hours'], 'NCERT: M phase is about an hour; the other 23 hours is interphase (over 95 per cent).', 'People guess M phase as half the cycle.');
mc(2, 'cell cycle phases', 'Yeast can complete a cell cycle in about', '90 minutes', ['24 hours', '3 hours exactly in all cases', '20 days'], 'Yeast divides in about 90 minutes, compared with 24 hours in a typical human cell in culture.');
mc(2, 'cell cycle phases', 'What happens in G1 phase?', 'The cell grows and is metabolically active, but DNA is not replicated', ['DNA content doubles', 'Spindle fibres pull chromatids apart', 'Homologous chromosomes pair up'], 'G1 is the gap between mitosis and DNA synthesis. DNA doubles in S phase.');
mc(2, 'cell cycle phases', 'In animal cells the centriole is duplicated in the', 'S phase, in the cytoplasm', ['M phase, in the nucleus', 'G0 phase', 'telophase'], 'While DNA replication begins in the nucleus in S phase, the centrosome duplicates in the cytoplasm.');
mc(2, 'cell cycle phases', 'In G2 phase the cell', 'makes proteins for mitosis and continues to grow', ['replicates its DNA', 'divides its nucleus', 'exits the cycle permanently'], 'G2 is preparation for mitosis: proteins are made and the cell keeps growing.');
mc(2, 'cell cycle phases', 'Which cells in adult animals usually exhibit G0 (do not divide)?', 'Heart cells', ['Cells of the skin epidermis', 'Cells of the intestinal lining', 'Cells of bone marrow'], 'Cells such as heart cells do not divide. Others divide only occasionally, to replace cells lost by injury or death.');
mc(2, 'mitosis', 'At the end of prophase of mitosis, which of these is NOT seen?', 'Nuclear envelope', ['Chromatids joined at centromere', 'Asters and spindle fibres', 'Duplicated centrosomes moving apart'], 'By late prophase the nuclear envelope, nucleolus, Golgi complex and ER are no longer seen. Chromosomes show two chromatids.');
mc(2, 'mitosis', 'The best stage for studying the morphology of chromosomes is', 'metaphase', ['prophase', 'telophase', 'interphase'], 'Chromosome condensation is complete at metaphase, so shape, size and centromere position are clearly seen.');
mc(2, 'mitosis', 'Kinetochores are the', 'sites on the centromere where spindle fibres attach', ['sites of crossing over', 'ends of the chromosomes', 'parts of the nucleolus'], 'These disc-shaped protein structures lie on the centromere surface. One chromatid is connected to one pole, its sister to the opposite pole.');
mc(2, 'mitosis', 'During anaphase the chromosome moves so that', 'the centromere leads and the arms trail behind', ['the arms lead and the centromere trails', 'the whole chromosome moves sideways', 'the telomeres lead'], 'The centromere, attached to spindle fibres, is at the leading edge.');
mc(2, 'mitosis', 'Which event is typical of telophase?', 'Chromosomes decondense and the nuclear envelope reforms', ['Chromosomes condense and the envelope breaks', 'Chromatids separate', 'Chromosomes align at the equator'], 'Telophase reverses prophase: nucleolus, Golgi and ER reform and chromatin collects in a mass at each pole.');
mc(2, 'mitosis', 'Aster is', 'a radiating set of microtubules around each centrosome', ['a membrane around the nucleus', 'a part of the centromere', 'a type of chiasma'], 'Each centrosome radiates microtubules called asters; together with spindle fibres they form the mitotic apparatus.');
mc(2, 'cytokinesis', 'A multinucleate condition, called a syncytium, arises when', 'karyokinesis is not followed by cytokinesis', ['cytokinesis is not followed by karyokinesis', 'DNA is not replicated', 'meiosis I is skipped'], 'Nuclear division without cytoplasmic division gives many nuclei in one cell. The liquid endosperm of coconut is an example.');
mc(2, 'meiosis', 'Which stage of prophase I shows synapsis and the synaptonemal complex?', 'Zygotene', ['Leptotene', 'Pachytene', 'Diplotene'], 'Homologues pair in zygotene, helped by the synaptonemal complex. In leptotene chromosomes just become visible.');
mc(2, 'meiosis', 'Recombination nodules appear in', 'pachytene', ['leptotene', 'zygotene', 'diakinesis'], 'They are the sites of crossing over, between non-sister chromatids.');
mc(2, 'meiosis', 'The X-shaped structures seen in diplotene are called', 'chiasmata', ['bivalents', 'kinetochores', 'asters'], 'Chiasmata are the places where homologues stay joined after the synaptonemal complex dissolves.', 'Chiasmata are seen in diplotene, but crossing over happened earlier in pachytene.');
mc(2, 'meiosis', 'Terminalisation of chiasmata takes place in', 'diakinesis', ['leptotene', 'zygotene', 'pachytene'], 'In diakinesis chromosomes are fully condensed; chiasmata slide to the ends and the spindle forms.');
mc(2, 'meiosis', 'The enzyme that takes part in crossing over is', 'recombinase', ['DNA ligase only', 'RNA polymerase', 'amylase'], 'Crossing over is enzyme-mediated; recombinase is the enzyme named in NCERT.');
mc(2, 'meiosis', 'The complex of a pair of synapsed homologous chromosomes is a', 'bivalent (tetrad)', ['monad', 'diad', 'chromomere'], 'A bivalent has two chromosomes and four chromatids, which is why it is also called a tetrad.');
mc(2, 'meiosis', 'In anaphase I of meiosis', 'homologous chromosomes separate while sister chromatids stay together', ['sister chromatids separate', 'homologues pair', 'the nuclear envelope breaks'], 'Anaphase I is the reductional step. Sister chromatids separate only in anaphase II.');
mc(2, 'meiosis', 'The cells formed after telophase I and cytokinesis are called', 'a diad of cells', ['a tetrad of cells', 'a triad of cells', 'a monad of cells'], 'Two cells (diad) at the end of meiosis I; four (tetrad) at the end of meiosis II.');
mc(2, 'meiosis significance', 'An important role of meiosis in sexually reproducing organisms is to', 'keep the chromosome number constant across generations', ['double the chromosome number each generation', 'form identical copies of the parent', 'repair injured tissue'], 'If gametes were diploid, the number would double at fertilisation. Meiosis halves it first.');
mc(2, 'mitosis significance', 'Mitosis in meristematic tissue of plants takes place at', 'apical and lateral meristems', ['phloem fibres', 'xylem vessels', 'guard cells'], 'Meristems (apical and the lateral cambium) divide throughout life, adding new cells for growth in length and girth.');
mc(2, 'mitosis significance', 'Mitosis restores the', 'nucleo-cytoplasmic ratio', ['number of chromosomes by halving', 'genetic variation', 'number of gametes'], 'As a cell grows the ratio of nucleus to cytoplasm falls; division brings it back.');

// ---------------------------------------------------------------- Level 3
mc(3, 'DNA and chromosome count', 'A diploid cell has DNA content 2C in G1. The DNA content at G2 phase and chromosome number are', '4C and 2n', ['2C and 4n', '4C and 4n', '2C and 2n'], 'S phase doubles DNA from 2C to 4C. The chromosome number is still 2n, since each replicated chromosome has two chromatids but one centromere.', 'DNA doubles, but the chromosome number does not.');
mc(3, 'DNA and chromosome count', 'DNA content per cell at the end of mitosis (after cytokinesis) compared with the G1 cell of the parent is', 'the same (2C)', ['double (4C)', 'half (C)', 'one-fourth (C/2)'], 'Each daughter gets 2C, the same as parent G1. Doubling only exists between S phase and the end of M phase.');
mc(3, 'DNA and chromosome count', 'A cell has 2C DNA in G1. Its DNA content after meiosis I (each daughter cell) and after meiosis II (each cell) is', '2C and C', ['4C and 2C', 'C and C/2', '2C and 2C'], 'After S phase: 4C. Meiosis I (reductional) halves to 2C per cell; meiosis II (equational) halves to C per cell.', 'Count C values per cell, not for the whole set.');
mc(3, 'DNA and chromosome count', 'The number of chromatids in a meiocyte with 2n = 20 at metaphase I is', '40', ['20', '10', '80'], 'The cell has 20 chromosomes, each with two chromatids (after S phase): 20 × 2 = 40.');
mc(3, 'DNA and chromosome count', 'A cell with 2n = 14 is at metaphase II of meiosis. Number of chromosomes and chromatids in one cell are', '7 and 14', ['14 and 28', '7 and 7', '14 and 14'], 'Meiosis I halved the chromosome number to n = 7. Each chromosome still has two chromatids until anaphase II, so 14 chromatids.');
mc(3, 'DNA and chromosome count', 'Counting each separated chromatid as a chromosome, a human cell (2n = 46) at mitotic anaphase has how many chromosomes?', '92', ['46', '23', '184'], 'At anaphase the 46 chromosomes split into 92 daughter chromosomes, 46 at each pole.', 'The 92 appears only from anaphase to telophase; each daughter cell ends with 46.');
mc(3, 'cell cycle phases', 'Which of the following is correctly paired with the phase?', 'G2: protein synthesis for mitosis', ['G1: DNA doubling', 'S: spindle formation', 'G0: DNA replication'], 'DNA doubling belongs to S. Spindle formation is an M phase event. G0 is a resting stage with no division.');
mc(3, 'cell cycle phases', 'A cell passing through G1, S and G2 without division is in the', 'interphase', ['M phase', 'cytokinesis', 'prophase'], 'Interphase (G1, S, G2) is the phase of preparation; M phase is the division itself.', 'Interphase is not a "resting" phase.');
mc(3, 'mitosis', 'Which pair of events occurs in prophase of mitosis?', 'Condensation of chromosomes and movement of centrosomes to opposite poles', ['Splitting of centromere and cell plate formation', 'Chromosome alignment and nuclear membrane reformation', 'Synapsis and crossing over'], 'Prophase has compaction and centrosomes moving apart with asters forming. The other pairs mix events of metaphase, anaphase, telophase or meiosis.');
mc(3, 'mitosis', 'In which stage of mitosis do the chromosomes lose their individuality?', 'Telophase', ['Prophase', 'Metaphase', 'Anaphase'], 'In telophase they decondense so individual chromosomes cannot be seen; chromatin collects in a mass at each pole.');
mc(3, 'mitosis', 'Metaphase plate is', 'the plane at which the chromosomes align', ['a structure made of cell wall', 'a layer of the nuclear envelope', 'the cell plate of plant cells'], 'The metaphase plate is an imaginary plane at the equator. The cell plate is the plant cytokinesis structure.', 'Metaphase plate vs cell plate.');
mc(3, 'mitosis', 'Mitotic apparatus consists of', 'asters and spindle fibres', ['nucleolus and nucleoplasm', 'chiasmata and bivalents', 'cell plate and plasmodesmata'], 'Asters and spindle fibres together form the mitotic apparatus.');
mc(3, 'cytokinesis', 'Which difference between plant and animal cytokinesis is correct?', 'Plant: cell plate grows outward from the centre; animal: furrow deepens from the edge inward', ['Plant: furrow; animal: cell plate', 'Both use a cell plate', 'Plant: cell plate grows from the wall inward'], 'In plants wall formation starts in the centre and grows outward to meet the lateral walls; in animals the plasma membrane pinches in.');
mc(3, 'cytokinesis', 'The cell plate represents the', 'middle lamella between the walls of two adjacent cells', ['primary wall of the parent cell', 'secondary wall of the daughter', 'plasma membrane of the parent'], 'The cell plate is a simple precursor that becomes the middle lamella (calcium pectate) between the new walls.');
mc(3, 'meiosis', 'Which of these is correct about the stages of prophase I in order?', 'Leptotene, zygotene, pachytene, diplotene, diakinesis', ['Zygotene, leptotene, pachytene, diakinesis, diplotene', 'Leptotene, pachytene, zygotene, diplotene, diakinesis', 'Leptotene, zygotene, diplotene, pachytene, diakinesis'], 'Remember: chromosomes appear (lepto), pair (zygo), cross over (pachy), separate except at chiasmata (diplo), terminalise (diakinesis).');
mc(3, 'meiosis', 'Diplotene is marked by', 'dissolution of the synaptonemal complex', ['formation of the synaptonemal complex', 'appearance of recombination nodules', 'disappearance of the nucleolus'], 'The synaptonemal complex forms in zygotene and dissolves in diplotene. Nodules appear in pachytene; the nucleolus disappears at the end of diakinesis.');
mc(3, 'meiosis', 'At the end of diakinesis', 'the nucleolus disappears and the nuclear envelope breaks down', ['chromosomes pair for the first time', 'crossing over starts', 'the cell becomes haploid'], 'Diakinesis is the transition to metaphase I: chromosomes are fully condensed, the spindle is assembled and the envelope is lost.');
mc(3, 'meiosis', 'Which statement about meiosis II is correct?', 'It resembles mitosis and separates sister chromatids', ['It pairs homologous chromosomes', 'It includes crossing over', 'It is preceded by DNA replication'], 'There is no S phase between meiosis I and II. Meiosis II separates sister chromatids, as in mitosis.');
mc(3, 'meiosis', 'Prophase II is simpler than prophase I because', 'chromosomes are already reduced in number, with no pairing or crossing over', ['DNA is replicated', 'no chromosomes are present', 'the nuclear envelope is always intact'], 'The complex events (synapsis, crossing over, chiasmata) are over. Chromosomes only recompact and the envelope disappears.');
mc(3, 'meiosis significance', 'Meiosis increases genetic variability because of', 'crossing over and random assortment of homologues', ['DNA replication errors only', 'equal division of cytoplasm', 'cytokinesis in plants'], 'Crossing over mixes segments; the random orientation of bivalents at metaphase I mixes maternal and paternal chromosomes.');
mc(3, 'mitosis significance', 'A student removes a skin flap and finds that it heals over a few days. The process that mainly produces the new cells is', 'mitosis', ['meiosis I', 'meiosis II', 'synapsis'], 'Repair of tissue is by mitosis, which gives genetically identical cells.');
mc(3, 'mixed', 'A haploid cell can undergo mitosis. Which statement then holds?', 'Daughter cells are also haploid', ['Daughter cells become diploid', 'Chromosome number is halved again', 'Crossing over occurs and gives 4 cells'], 'Mitosis keeps the same number as the parent, whether haploid or diploid.', 'Mitosis is not only for diploid cells.');
mc(3, 'cell cycle phases', 'Which of the following correctly shows the sequence of the cell cycle?', 'G1 → S → G2 → M', ['G1 → G2 → S → M', 'S → G1 → G2 → M', 'M → S → G1 → G2'], 'Cells grow in G1, copy DNA in S, prepare in G2 and divide in M.');
asr(3, 'cell cycle phases', 'Chromosome number remains 2n in G2 although DNA content is 4C.', 'Replicated chromatids are held together at one centromere and count as one chromosome.', 0, 'A chromosome is counted by its centromere. Sister chromatids share a centromere, so the number is unchanged while DNA doubles. R explains A.');
asr(3, 'mitosis', 'Metaphase is the best stage to count chromosomes.', 'At metaphase chromosomes are fully condensed and lie at the equatorial plate.', 0, 'Full condensation and alignment make each chromosome distinct, so R explains A.');
asr(3, 'meiosis', 'Anaphase I of meiosis is reductional.', 'Homologous chromosomes separate and sister chromatids stay joined.', 0, 'Because whole chromosomes of each pair go to opposite poles, the number per cell is halved. R is the explanation.');
asr(3, 'cytokinesis', 'In plant cells cytokinesis is by furrowing.', 'Plant cells have a rigid cell wall.', 3, 'A is false: plants form a cell plate. R is true, and it is the reason a furrow cannot be used.');
asr(3, 'meiosis', 'Cells in diplotene can remain in this stage for months or years in some vertebrate oocytes.', 'Diplotene begins with the dissolution of the synaptonemal complex.', 1, 'Both statements are correct, but dissolution of the complex does not explain the long pause, so R is not the reason.');
asr(3, 'mitosis', 'Daughter cells formed by mitosis are genetically identical to the parent.', 'DNA replicates once and the cell divides once in mitosis.', 0, 'One replication followed by equal distribution of sister chromatids keeps the genetic content the same. R explains A (ignoring rare mutations).');
stm(3, 'meiosis', 'Meiosis involves two cycles of nuclear division and two cycles of DNA replication.', 'Meiosis gives four haploid cells.', 3, 'I is wrong: there is only one DNA replication. II is right.');
stm(3, 'mitosis', 'Centromere splits at the start of anaphase.', 'Nucleolus reappears in telophase.', 0, 'Both are correct. The centromere splitting lets chromatids separate, and nucleolus, Golgi and ER reform in telophase.');
stm(3, 'cell cycle phases', 'G0 cells are metabolically inactive and dead.', 'G0 cells can re-enter the cycle when needed.', 3, 'I is wrong: G0 cells are alive and metabolically active, but not dividing. II is right.');
stm(3, 'meiosis', 'Chiasmata are the visible points of crossing over seen in diplotene.', 'Synapsis takes place in diplotene.', 2, 'I is correct. Synapsis happens in zygotene, so II is false.');
match(3, 'prophase I', 'm1', 'Prophase I stage and event', ['A. Leptotene', 'B. Zygotene', 'C. Pachytene', 'D. Diakinesis'], ['p. Recombination nodules', 'q. Terminalisation of chiasmata', 'r. Chromosomes become visible', 's. Synapsis'], 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'], 'Leptotene: chromosomes start to be visible. Zygotene: synapsis. Pachytene: recombination nodules. Diakinesis: terminalisation.');
match(3, 'mitosis', 'm2', 'Mitosis stage and feature', ['A. Prophase', 'B. Metaphase', 'C. Anaphase', 'D. Telophase'], ['p. Centromere splits', 'q. Nuclear envelope reforms', 'r. Chromosomes align at equator', 's. Condensation begins'], 'A-s, B-r, C-p, D-q', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p', 'A-s, B-p, C-r, D-q'], 'Prophase: condensation; metaphase: alignment; anaphase: centromere splits; telophase: envelope reforms.');

// ---------------------------------------------------------------- Level 4
mc(4, 'DNA and chromosome count', 'A diploid cell (2n = 8) has 2C DNA in G1. Which row gives the correct (chromosomes, chromatids, DNA) for one cell at the stated stage?', 'Metaphase of mitosis: 8, 16, 4C', ['Metaphase of mitosis: 16, 16, 4C', 'Metaphase I: 4, 8, 4C', 'Metaphase II: 8, 16, 2C'], 'At mitotic metaphase: 8 chromosomes (counted by centromeres), each with 2 chromatids = 16, DNA 4C. At metaphase I there are still 8 chromosomes (arranged as 4 bivalents). At metaphase II: 4 chromosomes, 8 chromatids, 2C.', 'Bivalents are counted as 4, but the chromosomes inside them are still 8.');
mc(4, 'DNA and chromosome count', 'A cell has 2n = 12. The number of bivalents at metaphase I, and the total number of chromatids in them, are', '6 and 24', ['12 and 24', '6 and 12', '12 and 48'], 'Homologues pair: 12/2 = 6 bivalents. Each bivalent has 2 chromosomes × 2 chromatids = 4 chromatids, so 6 × 4 = 24.');
mc(4, 'DNA and chromosome count', 'A cell of 2n = 6 divides by meiosis without crossing over. How many different chromosome combinations are possible in the gametes?', '8', ['6', '12', '64'], 'Each of the n = 3 bivalents can orient in 2 ways at metaphase I, giving 2<sup>3</sup> = 8 combinations.');
mc(4, 'DNA and chromosome count', 'If the DNA in a cell at G1 is 6 pg, the DNA in a sperm formed from it is', '3 pg', ['6 pg', '12 pg', '1.5 pg'], 'G1 = 2C = 6 pg, so C = 3 pg. A sperm is haploid with 1C = 3 pg.', 'Students halve once more, for meiosis II, by mistake.');
mc(4, 'DNA and chromosome count', 'A cell with 2C DNA in G1 is at telophase I of meiosis. Chromosome number and DNA per daughter cell are', 'n and 2C', ['2n and 4C', 'n and C', '2n and 2C'], 'Meiosis I halves the number to n, but every chromosome still has two chromatids. So the DNA per cell is half of 4C = 2C.');
mc(4, 'cell cycle phases', 'A drug blocks DNA replication. The cells would be arrested at the end of', 'G1 phase', ['G2 phase', 'M phase', 'telophase'], 'Without replication cells cannot go from G1 into S and G2, so they stop before S phase with 2C DNA.');
mc(4, 'cell cycle phases', 'A colchicine-like drug destroys spindle fibres after S phase. Cells would be arrested in', 'metaphase, with chromosomes not separated', ['G1 with half the DNA', 'S phase with replicating DNA', 'telophase with two nuclei'], 'Without spindle fibres the chromatids cannot be pulled apart. Cells with duplicated chromosomes stay at metaphase.');
mc(4, 'mitosis', 'Which of the following is NOT true of mitotic metaphase?', 'Centromeres split at this stage', ['The nuclear envelope has disintegrated', 'Chromosomes are fully condensed', 'Each chromatid is attached to a pole by kinetochore fibres'], 'Centromeres split at the start of anaphase. In metaphase each sister chromatid is attached to the opposite pole.', 'Splitting is anaphase; alignment is metaphase.');
mc(4, 'mitosis', 'The cell cycle of a plant meristem cell takes 20 hours. After 60 hours of continuous division one cell would give', '8 cells', ['3 cells', '6 cells', '60 cells'], 'In 60 h there are 60/20 = 3 divisions. The count doubles each time: 2<sup>3</sup> = 8.', 'Cells double; they do not add.');
mc(4, 'cytokinesis', 'In plant cytokinesis, which feature is correct?', 'Wall formation starts in the centre as the cell plate (a precursor of the middle lamella) and grows outward', ['A contractile ring pinches the cell wall inward', 'The new wall starts at the old wall and grows to the centre', 'The nuclear envelope grows across the cell'], 'The cell plate forms in the centre and grows outward to join the lateral walls. Wall layers are added on each side later.');
mc(4, 'cytokinesis', 'Which of these best describes the fate of organelles at cytokinesis?', 'Mitochondria and plastids are distributed between the daughter cells', ['They are all destroyed and rebuilt', 'They all go to one daughter cell', 'They are made only in the nucleus'], 'Organelles like mitochondria and plastids get distributed between the two daughter cells at cytoplasmic division.');
mc(4, 'meiosis', 'Which pair is correct for prophase I of meiosis?', 'Pachytene: crossing over between non-sister chromatids', ['Zygotene: crossing over between sister chromatids', 'Diplotene: synapsis begins', 'Leptotene: chiasmata appear'], 'Crossing over is completed by the end of pachytene between non-sister chromatids; chiasmata are seen later, in diplotene; synapsis is in zygotene.');
mc(4, 'meiosis', 'Which of the following does NOT happen during meiosis I?', 'Separation of sister chromatids', ['Pairing of homologues', 'Formation of chiasmata', 'Reduction of chromosome number'], 'Sister chromatids separate in anaphase II. Meiosis I pairs and separates homologues.');
mc(4, 'meiosis', 'Which feature differentiates metaphase I from mitotic metaphase?', 'Bivalents on the plate, with homologues attached to opposite poles', ['Chromosomes are not condensed', 'Nuclear envelope is present', 'Spindle fibres are absent'], 'In metaphase I a homologous pair lines up as a bivalent, with spindle microtubules from opposite poles attached to the two homologues. In mitosis each chromosome lines up singly.');
mc(4, 'meiosis', 'In which stage does the "tendency of homologues to separate except at sites of crossover" begin?', 'Diplotene', ['Zygotene', 'Pachytene', 'Telophase I'], 'After the synaptonemal complex dissolves, the recombined homologues try to separate but stay joined at chiasmata.');
mc(4, 'meiosis', 'A primary oocyte of a vertebrate may remain in one stage for months or years. This stage is', 'diplotene', ['leptotene', 'metaphase I', 'telophase II'], 'NCERT says diplotene can last for months or years in the oocytes of some vertebrates.');
mc(4, 'meiosis significance', 'A species has 2n = 4. The maximum number of chromosome combinations in gametes without crossing over is', '4', ['2', '8', '16'], 'n = 2, so 2<sup>2</sup> = 4. With crossing over there would be many more.');
mc(4, 'DNA and chromosome count', 'A cell is in prophase I. A student says the cell is haploid since it will give haploid cells. The cell is actually', 'diploid, with 4C DNA', ['haploid, with 2C DNA', 'diploid, with 2C DNA', 'haploid, with C DNA'], 'Ploidy changes only at anaphase I and telophase I. In prophase I the cell is still 2n, and DNA is 4C after S phase.');
mc(4, 'mixed', 'In meiosis, the word "tetrad" can refer to', 'the four chromatids of a pair of homologues, or the four cells at the end of meiosis II', ['only the four cells at the end', 'only the four chromatids', 'four nuclei in a syncytium'], 'Bivalent = tetrad (four chromatids) in prophase I; the four cells at the end of meiosis II are also a tetrad. The question\'s wording decides.', 'Check whether the question asks about chromatids or cells.');
asr(4, 'meiosis', 'Meiosis II is called equational division.', 'Sister chromatids separate in meiosis II, as in mitosis, so the number of chromosomes per cell is unchanged.', 0, 'The chromosome number of each cell stays n through meiosis II, and the chromatids are shared equally. This is the reason for the name.');
asr(4, 'meiosis', 'In meiosis I, ploidy is reduced from 2n to n.', 'Homologous chromosomes, not sister chromatids, are separated in anaphase I.', 0, 'Separating homologues sends one of each pair to each pole, so the number per cell halves.');
asr(4, 'cell cycle phases', 'DNA content per cell falls from 4C to 2C at the end of mitosis.', 'DNA is degraded during telophase.', 2, 'A is true after cytokinesis; R is false. DNA is not degraded; it is shared between two daughter cells.');
asr(4, 'mitosis', 'During anaphase, chromosome arms trail behind the centromere.', 'Spindle fibres are attached to the kinetochore at the centromere.', 0, 'The pull is applied at the centromere, so it leads and the arms follow.');
stm(4, 'meiosis', 'The synaptonemal complex is formed in zygotene.', 'It dissolves at the start of diplotene.', 0, 'Both are true: it forms during synapsis (zygotene), is complete in pachytene, and dissolves in diplotene.');
stm(4, 'DNA and chromosome count', 'At prophase of mitosis in a diploid cell with 2n = 8, there are 16 chromatids.', 'At metaphase I of the same species there are 8 bivalents.', 2, 'I is correct: 8 chromosomes × 2 chromatids = 16. II is wrong: there are 4 bivalents (8 chromosomes in pairs).');
match(4, 'ploidy', 'm3', 'Stage and condition per cell (2n = 8)', ['A. G2 phase', 'B. Metaphase II', 'C. Gamete', 'D. G1 phase'], ['p. 4 chromosomes, 1 chromatid each', 'q. 8 chromosomes, 2 chromatids each', 'r. 4 chromosomes, 2 chromatids each', 's. 8 chromosomes, 1 chromatid each'], 'A-q, B-r, C-p, D-s', ['A-q, B-p, C-r, D-s', 'A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p'], 'G2: DNA is replicated, 8 chromosomes with two chromatids. Metaphase II: n = 4 chromosomes, two chromatids each. Gamete: 4 chromosomes of one chromatid. G1: 8 chromosomes of one chromatid.', 'Count both chromosomes and chromatids.');
match(4, 'significance', 'm4', 'Process and example of use', ['A. Mitosis', 'B. Meiosis', 'C. Cytokinesis in plants', 'D. Syncytium'], ['p. Gamete formation', 'q. Growth of meristem', 'r. Cell plate', 's. Liquid endosperm of coconut'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'], 'Mitosis adds cells to meristems; meiosis gives gametes; the cell plate belongs to plant cytokinesis; liquid endosperm of coconut is a syncytium.');

// passages
pass('p1', 'Passage: a root tip experiment', 'A root tip of an onion (2n = 16) is squashed and stained. Cells are seen in different stages. One cell shows 16 chromosomes lined up at the middle of the cell, each made of two chromatids. Another shows two groups of 16 separate chromatids moving to opposite poles. A third shows two clusters of chromatin at the poles, each with a new envelope, but the cell has not yet pinched in two.');
pq('p1', 3, 'mitosis', 'The first cell is at', 'metaphase', ['prophase', 'anaphase', 'telophase'], 'Chromosomes lined up at the equator with two chromatids each is metaphase.');
pq('p1', 4, 'mitosis', 'In the second cell, how many separated chromatids are moving in all, and what is the stage?', '32, anaphase', ['16, anaphase', '32, telophase', '16, metaphase'], 'Two groups of 16 chromatids = 32 chromatids in all, moving apart: anaphase. Each pole group is a future set of 16 chromosomes.');
pq('p1', 4, 'DNA and chromosome count', 'If the G1 DNA of this plant is 2C, the DNA in the whole third cell is', '4C, which becomes 2C in each daughter cell', ['2C in the whole cell', 'C in the whole cell', '8C in the whole cell'], 'Before cytokinesis the cell still holds both nuclei, so the total is 4C. After cytokinesis each daughter has 2C.');
pass('p2', 'Passage: gamete formation', 'A pollen mother cell of a plant (2n = 10) undergoes meiosis. A researcher examines one cell showing 5 structures, each with four chromatids held together at X-shaped points. A later cell has two groups, each with 5 chromosomes of two chromatids. A final stage shows four cells, each with 5 chromosomes of one chromatid.');
pq('p2', 3, 'meiosis', 'The 5 structures with four chromatids each are', 'bivalents', ['sister chromatid pairs of mitosis', 'tetrads of cells', 'chromosomes at telophase II'], 'Five bivalents (10/2), each with two chromosomes of two chromatids, joined at chiasmata (X-shaped points).');
pq('p2', 4, 'meiosis', 'The two groups, each with 5 chromosomes of two chromatids, are seen at', 'telophase I or metaphase II', ['anaphase II', 'prophase I', 'G2'], 'After anaphase I each pole holds n = 5 chromosomes still with two chromatids. Telophase I and metaphase II show this.');
pq('p2', 4, 'meiosis', 'How many chromatids in all do the four final cells contain, and what is the DNA per cell relative to G1 (2C)?', '20 chromatids in total and C per cell', ['40 chromatids in total and 2C per cell', '20 chromatids in total and 2C per cell', '10 chromatids in total and C per cell'], 'Four cells × 5 single-chromatid chromosomes = 20; each cell is haploid with C.');
pass('p3', 'Passage: the cycle time of a culture', 'In a tissue culture cell line, G1 is 11 hours, S is 8 hours, G2 is 4 hours and M is 1 hour, so the cycle is 24 hours. A scientist adds a drug that blocks cells from entering M phase but does not stop DNA synthesis.');
pq('p3', 3, 'cell cycle phases', 'What fraction of the cycle is spent in interphase?', '23/24', ['1/24', '19/24', '8/24'], 'G1 + S + G2 = 11 + 8 + 4 = 23 hours out of 24. This matches the "over 95 per cent" statement.');
pq('p3', 4, 'DNA and chromosome count', 'After 30 hours in the drug, a cell that began in G1 will most likely be arrested with', '4C DNA and 2n chromosomes', ['2C DNA and 2n chromosomes', '4C DNA and 4n chromosomes', 'C DNA and n chromosomes'], 'The cell goes through S (doubling DNA) and G2 and is blocked from entering M. It stays with 4C DNA and 2n chromosomes.');

// ---------------------------------------------------------------- Level 5
mc(5, 'DNA and chromosome count', 'A cell has 2n = 10 and 4C DNA at G2. How many centromeres, chromatids and bivalents are present at metaphase of mitosis?', '10 centromeres, 20 chromatids, no bivalents', ['5 centromeres, 20 chromatids, 5 bivalents', '10 centromeres, 10 chromatids, no bivalents', '20 centromeres, 20 chromatids, 5 bivalents'], 'The count is by centromere: 10. Each has two chromatids: 20. Bivalents form only in meiosis.', 'Bivalents do not form in mitosis, even though homologues are present.');
mc(5, 'DNA and chromosome count', 'A cell with 2n = 4 shows 4 chromosomes, each with one chromatid, and 2C DNA. This cell is in', 'G1 or G0 (before S phase)', ['G2', 'metaphase of mitosis', 'metaphase I'], 'Single-chromatid chromosomes with 2C DNA mean DNA has not replicated: G1 or G0. G2, mitotic metaphase and metaphase I all have 4C.', 'Check chromatid number before ploidy.');
mc(5, 'DNA and chromosome count', 'DNA per cell is plotted over a full mitotic cycle starting from G1 (2C). Which sequence is correct?', '2C, rising to 4C in S, staying 4C until telophase, then 2C in each daughter', ['2C, rising to 4C in S, back to 2C at metaphase', '2C, constant through S, doubling in M', '4C in G1, falling to 2C in S'], 'Replication in S doubles DNA. It stays at 4C through G2, prophase, metaphase and anaphase and is halved per cell at cytokinesis.');
mc(5, 'DNA and chromosome count', 'In a meiocyte with G1 DNA = 2C, DNA per cell first falls to C after', 'cytokinesis of meiosis II', ['cytokinesis of meiosis I', 'anaphase I', 'metaphase II'], 'DNA: 2C, then 4C (S), then 2C (after meiosis I), then C (after meiosis II).');
mc(5, 'meiosis', 'In a cell with 2n = 8, each bivalent shows exactly one chiasma at diplotene. The number of bivalents and chiasmata are', '4 bivalents and 4 chiasmata', ['8 bivalents and 8 chiasmata', '4 bivalents and 8 chiasmata', '8 bivalents and 4 chiasmata'], '8/2 = 4 bivalents; one chiasma in each gives 4 chiasmata.');
mc(5, 'meiosis', 'Which is correct for centromeres in anaphase I and anaphase II?', 'AI: centromeres do not split; AII: centromeres split', ['AI: centromeres split; AII: centromeres do not split', 'Both: centromeres split', 'Both: centromeres do not split'], 'In anaphase I whole homologues move and chromatids remain joined at centromeres. In anaphase II the centromere of each chromosome splits.', 'Anaphase I is not like mitotic anaphase.');
mc(5, 'meiosis', 'A mutant fails to form the synaptonemal complex. The most direct effect would be', 'failure of homologue pairing and crossing over in prophase I', ['failure of DNA replication in S phase', 'failure of cytokinesis in G1', 'failure of spindle formation in mitosis'], 'The complex holds homologues together in zygotene and pachytene, so pairing and recombination would be disturbed.');
mc(5, 'mixed', 'Which one is a correct difference between mitosis and meiosis I?', 'In meiosis I homologues pair and chiasmata form; in mitosis they do not', ['In mitosis DNA is replicated twice; in meiosis I once', 'Mitosis gives four cells; meiosis I gives two', 'In mitosis homologues pair; in meiosis I they do not'], 'Pairing and chiasmata are only in meiosis. DNA is replicated once before either division; mitosis gives 2 cells and meiosis I also gives 2 (a diad).');
mc(5, 'cytokinesis', 'A coconut liquid endosperm has many free nuclei in a common cytoplasm. This is explained by', 'repeated karyokinesis without cytokinesis', ['repeated meiosis with cytokinesis', 'fusion of many cells into one', 'DNA replication without nuclear division'], 'Nuclear divisions not followed by cytoplasmic division make a multinucleate syncytium.');
mc(5, 'cell cycle phases', 'An adult cell resting in G0 is stimulated to divide. Its next step is', 're-entering the cycle at G1, then S, G2 and M', ['starting directly at M phase', 'going to S phase after skipping G1 for ever', 'undergoing meiosis'], 'G0 cells re-enter the cycle through G1.');
asr(5, 'meiosis', 'Chiasmata persist from diplotene until anaphase I even though crossing over was completed at pachytene.', 'Chiasmata mark the points where homologues remain linked after crossing over.', 0, 'The recombined chromosomes stay linked at crossover sites, seen as chiasmata, until terminalisation and separation in anaphase I.');
asr(5, 'mitosis', 'In metaphase of mitosis each chromosome is held to both poles.', 'One chromatid is connected to one pole and its sister chromatid to the opposite pole by spindle fibres.', 0, 'Each chromosome is attached to both poles through the kinetochores of its two sister chromatids, which is exactly what R says.');
stm(5, 'meiosis', 'DNA content per cell is halved at the end of telophase I with cytokinesis.', 'Chromosome number per cell is halved in telophase I.', 0, 'After cytokinesis of meiosis I each cell has half the DNA (4C to 2C) and half the chromosome number (2n to n). Both are right.');
stm(5, 'cytokinesis', 'The cell plate becomes the middle lamella.', 'Cytokinesis in animals begins with the cell plate.', 2, 'I is true. Animals form a furrow, so II is false.');

// ---------------------------------------------------------------- templates
const gens = [
  {
    id: 'cc-g01', type: 'nat', level: 3, format: 'numeric', exams: E, sub: 'DNA and chromosome count',
    make(rng) {
      const x = choose(rng, [4, 6, 8, 10, 12, 7.2, 5.6]);
      const stages = [
        ['G2 phase of the same cycle', 2, 'S phase doubles the DNA, so G2 has 4C = 2 × G1'],
        ['metaphase of mitosis', 2, 'DNA is still 4C = 2 × G1 until cytokinesis'],
        ['each daughter cell just after mitosis and cytokinesis', 1, 'Each daughter returns to 2C, the same as G1'],
        ['metaphase I of meiosis', 2, 'After S phase it is 4C = 2 × G1; meiosis I has not yet halved it'],
        ['each cell after meiosis I and cytokinesis', 1, 'Meiosis I halves 4C to 2C per cell, the same as G1'],
        ['each gamete at the end of meiosis II', 0.5, 'Meiosis II halves 2C to C, which is half of G1'],
      ];
      const [name, mult, why] = choose(rng, stages);
      const ans = +(x * mult).toFixed(2);
      return { x, mult, q: `A diploid cell has ${x} pg of DNA in its nucleus in G1 phase. How much DNA (in pg) is present in ${name}?`, answer: ans, tol: 0.01, unit: 'pg', sol: `Idea: write G1 as 2C and follow the C-value. G1 = 2C = ${x} pg. ${why}. So the DNA is ${x} × ${mult} = ${ans} pg.` };
    },
    verify(p) { const C = p.x / 2; const cs = { 2: 4, 1: 2, 0.5: 1 }[p.mult]; return +(cs * C).toFixed(2); },
  },
  {
    id: 'cc-g02', type: 'nat', level: 3, format: 'integer', exams: E, sub: 'DNA and chromosome count',
    make(rng) {
      const n2 = choose(rng, [8, 10, 12, 14, 16, 20, 24, 28, 38, 46]);
      const stages = [
        ['metaphase of mitosis', 'chromatids', 2, 'Each of the 2n chromosomes has two chromatids'],
        ['G1 phase', 'chromatids', 1, 'DNA is not yet replicated, so one chromatid per chromosome'],
        ['metaphase I of meiosis', 'chromatids', 2, 'Replicated chromosomes, 2n of them, with two chromatids each'],
        ['metaphase II of meiosis (one cell)', 'chromatids', 1, 'The cell has n chromosomes, each of two chromatids: 2n chromatids'],
        ['metaphase II of meiosis (one cell)', 'centromeres', 0.5, 'The cell has n chromosomes, so n centromeres'],
        ['telophase I (one daughter cell)', 'centromeres', 0.5, 'Each daughter has n chromosomes'],
        ['anaphase of mitosis (the whole cell, counting each separated chromatid as a chromosome)', 'chromosomes', 2, 'The 2n chromosomes split into 4n daughter chromosomes'],
      ];
      const [name, what, f, why] = choose(rng, stages);
      const ans = n2 * f;
      return { n2, f, q: `A cell has 2n = ${n2}. How many ${what} are present at ${name}?`, answer: ans, tol: 0, sol: `Idea: count centromeres for chromosomes, and two chromatids per replicated chromosome. ${why}. For 2n = ${n2} this gives ${ans}.`, unit: '' };
    },
    verify(p) { return p.n2 * p.f; },
  },
  {
    id: 'cc-g03', type: 'nat', level: 4, format: 'integer', exams: E, sub: 'meiosis',
    make(rng) {
      const n = int(rng, 3, 12);
      const kind = choose(rng, ['biv', 'chr', 'comb', 'chi']);
      if (kind === 'biv') return { n, kind, q: `A meiocyte has 2n = ${2 * n}. How many bivalents are seen at metaphase I?`, answer: n, tol: 0, sol: `Idea: homologues pair, so bivalents = 2n/2 = n. Here ${2 * n}/2 = ${n}.` };
      if (kind === 'chr') return { n, kind, q: `How many chromatids are present in all the bivalents of a meiocyte with 2n = ${2 * n} at pachytene?`, answer: 4 * n, tol: 0, sol: `Idea: each bivalent (tetrad) has 2 chromosomes × 2 chromatids = 4 chromatids. Number of bivalents = ${n}, so ${n} × 4 = ${4 * n}.` };
      if (kind === 'comb') return { n, kind, q: `In a species with 2n = ${2 * n}, how many different combinations of maternal and paternal chromosomes are possible in the gametes, ignoring crossing over?`, answer: 2 ** n, tol: 0, sol: `Idea: each of the n = ${n} bivalents orients in 2 ways at metaphase I, independently. Combinations = 2<sup>${n}</sup> = ${2 ** n}.` };
      const per = int(rng, 1, 3);
      return { n, kind, per, q: `A meiocyte has 2n = ${2 * n} and every bivalent shows exactly ${per} chiasma${per > 1 ? 'ta' : ''} at diplotene. How many chiasmata are present in the cell?`, answer: n * per, tol: 0, sol: `Idea: bivalents = ${2 * n}/2 = ${n}. Chiasmata = ${n} × ${per} = ${n * per}.` };
    },
    verify(p) { return p.kind === 'biv' ? p.n : p.kind === 'chr' ? p.n * 2 * 2 : p.kind === 'comb' ? Math.pow(2, p.n) : p.n * p.per; },
  },
  {
    id: 'cc-g04', type: 'nat', level: 3, format: 'integer', exams: E, sub: 'cell cycle phases',
    make(rng) {
      const kind = choose(rng, ['grow', 'sperm', 'egg']);
      if (kind === 'grow') {
        const T = choose(rng, [6, 8, 12, 15, 20, 24]); const k = int(rng, 2, 6); const t = T * k;
        return { kind, T, k, q: `A cell divides by mitosis every ${T} hours. If all its descendants keep dividing at the same rate, how many cells are there after ${t} hours, starting from one cell?`, answer: 2 ** k, tol: 0, sol: `Idea: the number doubles each cycle. Divisions = ${t}/${T} = ${k}. Cells = 2<sup>${k}</sup> = ${2 ** k}.` };
      }
      const m = int(rng, 3, 40);
      if (kind === 'sperm') return { kind, m, q: `How many sperm are formed from ${m} primary spermatocytes after complete meiosis?`, answer: 4 * m, tol: 0, sol: `Idea: each primary spermatocyte gives 4 haploid cells (4 sperm). ${m} × 4 = ${4 * m}.` };
      return { kind, m, q: `How many functional ova are formed from ${m} primary oocytes after complete meiosis?`, answer: m, tol: 0, sol: `Idea: each primary oocyte gives one functional ovum and polar bodies, which are not functional. So ${m} primary oocytes give ${m} ova.`, trap: 'Polar bodies are not functional ova.' };
    },
    verify(p) { return p.kind === 'grow' ? Math.pow(2, p.k) : p.kind === 'sperm' ? p.m * 4 : p.m; },
  },
];

export default { topic: 'cell-cycle', groups, items, gens };
