// Class 11 Biology, Chapter 1 The Living World: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('lw');

export default {
  topic: 'the-living-world', name: 'The Living World', n: 1,
  items: [
    m.mcq(1, 'living', '<p>Which property is found in ALL living things and in no non-living thing?</p>', 'metabolism', ['growth by adding material outside', 'movement from place to place', 'ability to be broken into parts'], '<p>Metabolism and cellular organisation define life. Crystals and snowballs also "grow", and rivers also move.</p>'),
    m.mcq(1, 'living', '<p>Growth in a living organism differs from growth of a snowball because it is:</p>', 'intrinsic, by cell division from inside', ['by sticking on of material from outside', 'always faster', 'found only in animals'], '<p>Living things grow from inside by cell division and use of food; non-living things grow only by accumulation of matter on the surface.</p>'),
    m.mcq(2, 'living', '<p>A mule cannot reproduce, yet it is alive. This shows that:</p>', 'reproduction is not a defining property of every living individual', ['mules are non-living', 'metabolism is not needed for life', 'growth is the only defining property'], '<p>A mule has cells and metabolism. Sterile organisms, and workers in a bee hive, are alive without reproducing.</p>'),
    m.mcq(2, 'living', '<p>A dry seed kept in a cupboard for months is:</p>', 'living, with a very slow metabolism', ['non-living because it does not grow', 'non-living because it does not respond', 'living because it moves'], '<p>The seed is dormant, but its cells are alive and it germinates when it gets water.</p>', { trap: 'Thinking "no growth" means "not alive".' }),
    m.mcq(1, 'naming', '<p>Binomial nomenclature was introduced by:</p>', 'Carolus Linnaeus', ['Charles Darwin', 'Ernst Mayr', 'Robert Whittaker'], '<p>Linnaeus (Sweden) gave the two-word system.</p>'),
    m.mcq(1, 'naming', '<p>The first word of a scientific name is:</p>', 'the genus, starting with a capital letter', ['the species, starting with a capital letter', 'the genus, starting with a small letter', 'the family, in italics'], '<p>Genus first with a capital; species epithet second with a small letter.</p>'),
    m.mcq(2, 'naming', '<p>A handwritten scientific name is shown by:</p>', 'underlining the genus and species separately', ['writing it all in capitals', 'writing it in brackets', 'underlining it as one single line'], '<p>Print uses italics; handwriting underlines the two words separately.</p>'),
    m.mcq(2, 'naming', '<p>Which of these is written correctly?</p>', '<i>Homo sapiens</i> Linn.', ['<i>homo Sapiens</i> Linn.', '<i>Homo Sapiens</i>', 'Homo sapiens (in plain type, no underline)'], '<p>Genus capital, species small, italic, and the author name is in plain type after.</p>'),
    m.mcq(2, 'naming', '<p>The International Code of Zoological Nomenclature (ICZN) governs the naming of:</p>', 'animals', ['plants', 'bacteria only', 'viruses only'], '<p>ICBN (now the code for algae, fungi and plants) is for plants; ICZN for animals.</p>'),
    m.mcq(2, 'ranks', '<p>Which rank comes immediately after "Order" when going from the largest to the smallest?</p>', 'Family', ['Class', 'Genus', 'Phylum'], '<p>Kingdom, Phylum, Class, Order, Family, Genus, Species.</p>'),
    m.mcq(2, 'ranks', '<p>The tiger and the lion belong to the same:</p>', 'genus, Panthera', ['species', 'subspecies only', 'tribe only, not genus'], '<p><i>Panthera tigris</i> and <i>Panthera leo</i> share the genus but are different species.</p>'),
    m.mcq(2, 'ranks', '<p>In plants the group equivalent to a phylum in animals is called:</p>', 'division', ['tribe', 'family', 'section'], '<p>Plants use "Division" in place of "Phylum".</p>'),
    m.mcq(3, 'ranks', '<p>Cat, dog and bear are placed in the same order, Carnivora. They must therefore also be in the same:</p>', 'class and phylum', ['family', 'genus', 'species'], '<p>Groups below order can differ; every group above the order is shared.</p>', { trap: 'Assuming the same order means the same family.' }),
    m.mcq(3, 'ranks', '<p>The smallest rank which contains the largest number of shared characters among its members is:</p>', 'species', ['kingdom', 'order', 'phylum'], '<p>Moving from kingdom down to species the groups get smaller and members share more characters.</p>'),
    m.mcq(1, 'aids', '<p>A herbarium is:</p>', 'a store of dried, pressed and labelled plant specimens', ['a garden of living plants', 'a museum of stuffed animals', 'a book that lists plants of a place'], '<p>A botanical garden holds living plants and a flora is a book.</p>'),
    m.mcq(2, 'aids', '<p>A key used to identify organisms is based on:</p>', 'pairs of contrasting characters called couplets', ['the age of the specimen', 'the colour only', 'the name given by locals'], '<p>Each couplet has two contrasting statements.</p>'),
    m.mcq(2, 'aids', '<p>Which aid keeps <b>living</b> plants with their names labelled for study and conservation?</p>', 'botanical garden', ['herbarium', 'museum', 'monograph'], '<p>A herbarium stores dried specimens, a museum preserved ones.</p>'),
    m.mcq(2, 'aids', '<p>A book which lists the plants of one region with descriptions is a:</p>', 'flora', ['manual', 'catalogue of a museum', 'monograph'], '<p>A flora covers an area; a monograph covers all about one taxon.</p>'),
    m.ar(2, 'living', 'A crystal of salt is non-living although it grows.', 'Its growth is by deposition of material on the outside and it has no metabolism.', 0, '<p>Both true and R explains A: no metabolism, no cells.</p>'),
    m.ar(3, 'naming', 'Local names are not enough for scientific communication.', 'A single organism can have different common names in different languages, and one name can mean different organisms.', 0, '<p>Both statements are true and the reason explains the need for scientific names.</p>'),
    m.ar(3, 'ranks', 'Species is the largest taxonomic category.', 'All members of a species share many characters and can breed together.', 3, '<p>A is false: species is the <i>smallest</i> rank. R is a true statement about a species.</p>'),
    m.msq(2, 'living', '<p>Which of these are true for ALL living organisms? (Choose all that apply.)</p>', ['They are made of cells', 'They have metabolism', 'They can reproduce themselves', 'They respond to the environment'], [0, 1, 3], '<p>Not every individual can reproduce (mules, worker bees).</p>'),
    m.msq(2, 'aids', '<p>Which of these are taxonomical aids? (Choose all that apply.)</p>', ['Herbarium', 'Zoological park', 'Microscope slide of onion peel', 'Key'], [0, 1, 3], '<p>Herbaria, zoos, museums, gardens and keys help to identify and study organisms. An onion peel slide is a study of cells.</p>'),
    m.msq(3, 'naming', '<p>Which of these scientific names are written correctly in print? (Choose all that apply.)</p>', ['<i>Solanum melongena</i>', '<i>Musca domestica</i>', '<i>Panthera Tigris</i>', '<i>mangifera indica</i>'], [0, 1], '<p>The species epithet must be in small letters and the genus capital.</p>'),
    m.nat(2, 'ranks', '<p>Counting Kingdom as 1 and Species as 7, which number is the rank "Order"?</p>', () => 4, 0, '<p>Kingdom 1, Phylum 2, Class 3, Order 4.</p>'),
    m.nat(2, 'aids', '<p>A key has to separate 9 plants. How many couplets does the shortest possible key need?</p>', () => 8, 0, '<p>Each couplet adds one group; from 1 group to 9 groups needs 8 couplets.</p>'),
    m.nat(3, 'living', '<p>A cell divides every 30 minutes. How many cells arise from one cell in 3 hours?</p>', () => 64, 0, '<p>3 h = 6 divisions, so 2<sup>6</sup> = 64.</p>'),
  ],
  gens: [
    { id: 'lw-g01', type: 'nat', level: 2, exams: ['board'], sub: 'living',
      make(rng) { const mins = choose(rng, [20, 30, 60]), h = choose(rng, [2, 3, 4]); return { mins, h, q: `<p>A bacterium divides every ${mins} minutes. How many bacteria arise from one cell in ${h} hours?</p>`, answer: 2 ** (h * 60 / mins), tol: 0.001, unit: '', sol: `<p>Divisions = ${h * 60} ÷ ${mins} = ${h * 60 / mins}; cells = 2<sup>${h * 60 / mins}</sup> = ${2 ** (h * 60 / mins)}.</p>` }; },
      verify: (p) => { let c = 1; for (let t = p.mins; t <= p.h * 60; t += p.mins) c *= 2; return c; } },
    { id: 'lw-g02', type: 'nat', level: 2, exams: ['board'], sub: 'aids',
      make(rng) { const k = pick(rng, 5, 30); return { k, q: `<p>A key must identify ${k} different organisms with yes/no couplets. What is the minimum number of couplets?</p>`, answer: k - 1, tol: 0, unit: '', sol: `<p>Each couplet makes one more group; ${k} groups need ${k} − 1 = ${k - 1} couplets.</p>` }; },
      verify: (p) => { let g = 1, c = 0; while (g < p.k) { g++; c++; } return c; } },
    { id: 'lw-g03', type: 'nat', level: 1, exams: ['board'], sub: 'ranks',
      make(rng) { const g = pick(rng, 2, 8), s = pick(rng, 2, 9); return { g, s, q: `<p>A family has ${g} genera with ${s} species in each genus. How many species are in the family?</p>`, answer: g * s, tol: 0, unit: '', sol: `<p>${g} × ${s} = ${g * s} species.</p>` }; },
      verify: (p) => Array.from({ length: p.g }, () => p.s).reduce((a, b) => a + b, 0) },
  ],
};
