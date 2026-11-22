// NEET UG Biology: Ecosystem (NCERT Class 12, 2023 rationalised book). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [2, 0, 3, 1];
const nid = () => `ey-${String(++n).padStart(3, '0')}`;
const ex = (level) => (level <= 3 ? ['neet', 'cuet'] : ['neet']);
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: ex(level), sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function asr(level, sub, A, R, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'assertion', exams: ex(level), sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function stm(level, sub, s1, s2, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'statements', exams: ex(level), sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function match(level, sub, key, title, list1, list2, correct, wrongs, sol, trap) {
  groups[key] = { title, list1, list2 };
  const p = POS[pos++ % 4];
  const options = [...wrongs]; options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'match', exams: ex(level), sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function pass(key, title, passage) { groups[key] = { title, passage }; }
function pq(key, level, sub, q, correct, wrongs, sol, trap) {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'passage', exams: ex(level), sub, group: key, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function nat(level, sub, q, answer, sol, unit, trap, tol = 0) {
  items.push({ id: nid(), type: 'nat', level, format: tol ? 'numeric' : 'integer', exams: ex(level), sub, q, answer, tol, ...(unit ? { unit } : {}), sol, ...(trap ? { trap } : {}) });
}
// ---------------------------------------------------------------- Level 1
mc(1, 'structure', 'The term "ecosystem" was proposed by', 'A. G. Tansley', ['Ernst Haeckel', 'Eugene Odum', 'Raymond Lindeman'], 'Tansley (1935) coined the word. Haeckel coined "ecology"; Lindeman studied energy flow in Cedar Bog Lake and gave the ten per cent law (published 1942).');
mc(1, 'structure', 'An ecosystem is best called', 'a structural and functional unit of nature', ['a group of one species', 'a group of communities only', 'the living part of a habitat only'], 'It includes living (biotic) and non-living (abiotic) components interacting with each other and with energy flow.');
mc(1, 'structure', 'Which of these is a biotic component of a pond ecosystem?', 'Phytoplankton', ['Water', 'Sunlight', 'Dissolved oxygen'], 'Phytoplankton are living producers. Water, light and dissolved gases are abiotic.');
mc(1, 'structure', 'Vertical distribution of different species occupying different levels in a biological community is called', 'stratification', ['succession', 'zonation by tide', 'productivity'], 'In a forest, trees occupy the top vertical strata, shrubs the second and herbs and grasses the bottom.');
mc(1, 'structure', 'In a pond ecosystem, the main producers are', 'phytoplankton, algae and aquatic plants', ['zooplankton', 'fishes', 'bacteria'], 'Zooplankton and fishes are consumers; bacteria and fungi are decomposers.');
mc(1, 'structure', 'The four components that make an ecosystem function are', 'productivity, decomposition, energy flow and nutrient cycling', ['evolution, mutation, selection and drift', 'birth, death, growth and decay of one species', 'light, heat, water and soil'], 'NCERT lists these four as the functional components of any ecosystem.');
mc(1, 'productivity', 'The rate of production of organic matter during photosynthesis is called', 'primary productivity', ['secondary productivity', 'decomposition rate', 'standing crop'], 'It is the amount of biomass or energy produced by producers per unit area in a given time. Secondary productivity belongs to consumers.');
mc(1, 'productivity', 'Net primary productivity is', 'gross primary productivity minus respiration losses', ['gross primary productivity plus respiration losses', 'gross primary productivity divided by respiration', 'the energy in the consumers'], 'NPP = GPP &minus; R. NPP is the biomass available to consumers.');
mc(1, 'productivity', 'Primary productivity is expressed in units of', 'g m<sup>&minus;2</sup> yr<sup>&minus;1</sup> or kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', ['g only', 'kcal only', 'individuals per m<sup>2</sup>'], 'Expressing it per unit area per year allows ecosystems to be compared.');
mc(1, 'productivity', 'The rate of formation of new organic matter by consumers is called', 'secondary productivity', ['gross primary productivity', 'net primary productivity', 'standing state'], 'Consumers make new organic matter from the food they take in.');
mc(1, 'decomposition', 'The main decomposers in an ecosystem are', 'bacteria and fungi', ['earthworms and insects', 'algae and mosses', 'viruses'], 'Decomposers secrete digestive enzymes that break down dead matter. Earthworms are detritivores that fragment detritus.');
mc(1, 'decomposition', 'Dead remains of plants and animals, including faecal matter, are called', 'detritus', ['humus', 'standing crop', 'biomass'], 'Detritus is the raw material for decomposition and is the starting point of the detritus food chain.');
mc(1, 'decomposition', 'The breakdown of detritus into smaller particles by earthworms is called', 'fragmentation', ['leaching', 'humification', 'mineralisation'], 'Detritivores break detritus into smaller pieces and increase the surface area for microbial action.');
mc(1, 'decomposition', 'The dark amorphous substance which is highly resistant to microbial action is', 'humus', ['detritus', 'lignin', 'chitin'], 'Humus decomposes very slowly and is a reservoir of nutrients.');
mc(1, 'energy flow', 'The only source of energy for most ecosystems on Earth is', 'solar radiation', ['geothermal energy', 'chemical fertiliser', 'wind'], 'Autotrophs capture solar energy through photosynthesis. Apart from deep sea vents (chemosynthesis), the Sun is the source.');
mc(1, 'energy flow', 'The direction of energy flow in an ecosystem is', 'unidirectional', ['cyclic', 'bidirectional', 'random'], 'Energy goes from producers to consumers and is lost as heat. It does not return to the Sun. Nutrients cycle; energy does not.');
mc(1, 'energy flow', 'According to the ten per cent law, the amount of energy passed from one trophic level to the next is about', '10%', ['1%', '50%', '90%'], 'Lindeman\'s law states that only about 10 per cent of the energy at one level is transferred to the next. The rest is lost as heat or used for life processes.');
mc(1, 'food chain', 'Which of these is the correct grazing food chain?', 'Grass &rarr; grasshopper &rarr; frog &rarr; snake', ['Snake &rarr; frog &rarr; grasshopper &rarr; grass', 'Frog &rarr; grass &rarr; snake &rarr; grasshopper', 'Grasshopper &rarr; grass &rarr; frog &rarr; snake'], 'The arrow shows the flow of energy from the eaten to the eater. The chain starts with the producer.');
mc(1, 'food chain', 'A network of interconnected food chains in an ecosystem is called a', 'food web', ['food pyramid', 'trophic level', 'energy cycle'], 'Most organisms eat more than one kind of food, so chains link into a web.');
mc(1, 'food chain', 'The first trophic level in a food chain is always occupied by', 'producers', ['herbivores', 'carnivores', 'decomposers'], 'Producers (autotrophs) fix energy; everything else depends on them.');
mc(1, 'food chain', 'Herbivores occupy the', 'second trophic level (primary consumers)', ['first trophic level', 'third trophic level', 'fourth trophic level'], 'Producers are T1; herbivores T2; carnivores that eat herbivores T3, and so on.');
mc(1, 'pyramids', 'The graphical representation of the number, biomass or energy at each trophic level is called an', 'ecological pyramid', ['energy cycle', 'age pyramid', 'trophic web'], 'Producers form the base, and each next level forms a layer above it.');
mc(1, 'pyramids', 'Which ecological pyramid is always upright?', 'Pyramid of energy', ['Pyramid of numbers', 'Pyramid of biomass', 'Pyramid of age'], 'Energy decreases at each step because some is lost as heat, so a higher level can never have more energy than the one below.');
mc(1, 'pyramids', 'The pyramid of numbers in a grassland ecosystem is', 'upright', ['inverted', 'spindle-shaped with decomposers on top', 'impossible to draw'], 'Grass is more numerous than grasshoppers, which are more numerous than frogs, and so on.');
mc(1, 'pyramids', 'Which pyramid in the sea is often inverted?', 'Pyramid of biomass', ['Pyramid of energy', 'Pyramid of numbers in grassland', 'Pyramid of age'], 'Phytoplankton have a small standing biomass at any time, which is less than that of the fishes that feed on them.');

// ---------------------------------------------------------------- Level 2
mc(2, 'structure', 'An ecosystem has producers, consumers and decomposers. Which of these is correctly paired with its role?', 'Bacteria - decomposers that break down dead matter', ['Algae - consumers of detritus', 'Frogs - producers', 'Grass - decomposers'], 'Decomposers return nutrients to the soil. Producers make food from light.');
mc(2, 'structure', 'Which of these is an artificial (man-made) ecosystem?', 'Aquarium', ['Pond', 'Forest', 'Grassland'], 'Aquaria and crop fields are made by humans. Pond, forest and grassland are natural.');
mc(2, 'structure', 'Which pairing of the component and its kind is correct for a terrestrial ecosystem?', 'Soil moisture - abiotic', ['Earthworm - abiotic', 'Fungus - abiotic', 'Dead leaves - producer'], 'Moisture, temperature and light are abiotic. Earthworms and fungi are biotic.');
mc(2, 'structure', 'Species composition and stratification are features of', 'ecosystem structure', ['energy flow', 'decomposition', 'productivity'], 'Structure refers to the organisation of biotic and abiotic components, including the vertical distribution.');
mc(2, 'productivity', 'Which of these decides the primary productivity of an ecosystem?', 'The plant species, photosynthetic capacity, nutrient availability and environmental factors', ['The number of carnivores only', 'The number of decomposers only', 'The rate of respiration of herbivores'], 'Primary productivity depends on the plants living there and on factors such as light, water and nutrients.');
mc(2, 'productivity', 'The annual net primary productivity of the whole biosphere is about', '170 billion tons (dry weight) of organic matter', ['17 billion tons', '55 billion tons', '1700 billion tons'], 'Of this, the oceans (70% of the Earth\'s surface) contribute only about 55 billion tons.', '55 billion is the ocean share, not the total.');
mc(2, 'productivity', 'The productivity of oceans is low compared with the land despite covering most of the Earth because', 'the plants and phytoplankton in the oceans are limited by light and nutrients', ['oceans have no producers', 'ocean water is too warm', 'the Sun does not reach the oceans'], 'The ocean is large but its producers have a small share of the total NPP.');
mc(2, 'productivity', 'Biomass is', 'the dry weight of living organic matter at a particular time', ['the energy in food', 'the number of organisms', 'the rate of food production'], 'Biomass is a stock (g m<sup>&minus;2</sup>). Productivity is a rate.', 'Do not mix the stock and the rate.');
mc(2, 'productivity', 'Net primary productivity is the energy or biomass available to', 'consumers', ['only decomposers', 'only producers', 'no organism'], 'After the producers respire, what is left is stored as NPP, which is eaten by herbivores or decomposed.');
mc(2, 'decomposition', 'Which of these is the correct order of decomposition steps in a general sense (all operate at the same time on detritus)?', 'Fragmentation, leaching, catabolism, humification, mineralisation', ['Humification, leaching, fragmentation, catabolism, mineralisation', 'Mineralisation, humification, catabolism, leaching, fragmentation', 'Catabolism, fragmentation, mineralisation, leaching, humification'], 'NCERT lists these steps in this order, but notes that they operate simultaneously.');
mc(2, 'decomposition', 'Leaching is the process in which', 'water-soluble inorganic nutrients go down the soil horizon and get precipitated as unavailable salts', ['bacteria degrade detritus', 'humus is formed', 'earthworms break detritus'], 'Leaching removes nutrients from the topsoil layer. Catabolism is the enzymatic breakdown.');
mc(2, 'decomposition', 'Which step produces inorganic nutrients from humus?', 'Mineralisation', ['Fragmentation', 'Leaching', 'Humification'], 'Microbes degrade humus and release inorganic nutrients such as nitrates and phosphates.');
mc(2, 'decomposition', 'Humus is important in soil because it', 'acts as a reservoir of nutrients', ['is quickly mineralised', 'is a source of light', 'is made of mineral salts'], 'It is colloidal in nature and serves as a slow-release store of nutrients.');
mc(2, 'decomposition', 'Decomposition is faster if the detritus is rich in', 'nitrogen and water-soluble substances like sugars', ['lignin and chitin', 'wax only', 'tannins only'], 'Lignin and chitin are resistant. Nitrogen-rich, soluble material is quickly broken down.', 'Lignin and chitin slow decomposition, so they are the wrong choice.');
mc(2, 'decomposition', 'Which condition favours decomposition?', 'Warm and moist environment', ['Low temperature and anaerobic conditions', 'Frozen dry soil', 'Waterlogged soil without oxygen'], 'Warmth and moisture favour microbial activity. Cold and anaerobic conditions slow it down.');
mc(2, 'decomposition', 'Decomposition is described as an', 'oxygen-requiring process', ['anaerobic only process', 'energy-producing process in plants', 'process that needs light'], 'Aerobic decomposers need oxygen, which is why waterlogged soils accumulate organic matter.');
mc(2, 'energy flow', 'The amount of solar radiation that is photosynthetically active radiation (PAR) is', 'less than 50% of the incident solar radiation', ['100%', 'more than 90%', 'exactly 10%'], 'Only wavelengths 400-700 nm are useful for photosynthesis.');
mc(2, 'energy flow', 'Plants capture what percentage of PAR?', '2-10%', ['50-60%', '90-100%', '0.1%'], 'This small share fuels the entire living world.', 'The PAR is already less than 50% of the sunlight, so the net is small.');
mc(2, 'energy flow', 'In the detritus food chain, the first trophic level is', 'dead organic matter (detritus)', ['phytoplankton', 'zooplankton', 'carnivores'], 'The DFC begins with detritus. Decomposers and detritivores feed on it, and then their predators.');
mc(2, 'energy flow', 'In aquatic ecosystems, the major conduit for energy flow is', 'the grazing food chain', ['the detritus food chain', 'the parasitic chain', 'there is no major channel'], 'In terrestrial ecosystems a much larger fraction flows through the detritus food chain.');
mc(2, 'energy flow', 'The energy loss between trophic levels limits the number of trophic levels in a chain to', 'four or five', ['two', 'ten', 'twenty'], 'Since only about 10 per cent is passed on, very little energy remains after four or five steps.');
mc(2, 'energy flow', 'Why can a food chain not be very long?', 'Energy is lost as heat at each step', ['Predators are rare', 'Plants die early', 'Water is limited'], 'Respiration and heat loss reduce the available energy at each transfer.');
mc(2, 'food chain', 'Sparrow feeding on seeds and also on insects occupies', 'more than one trophic level', ['only the second trophic level', 'only the first trophic level', 'only the third trophic level'], 'When it eats seeds it is a primary consumer; when it eats insects it is a secondary consumer. This is why webs form.');
mc(2, 'food chain', 'Which of the following is an example of the detritus food chain?', 'Dead leaves &rarr; earthworm &rarr; frog &rarr; snake', ['Grass &rarr; deer &rarr; tiger', 'Phytoplankton &rarr; zooplankton &rarr; fish', 'Grass &rarr; grasshopper &rarr; bird'], 'The chain begins with dead organic matter. The rest start with living producers (grazing chains).');
mc(2, 'food chain', 'Standing crop refers to', 'the mass of living organisms at each trophic level at a given time', ['the energy of crops', 'the harvest of farmers', 'the rate of photosynthesis'], 'It is measured as biomass or number in a unit area.');
mc(2, 'food chain', 'Decomposers are not given a trophic level in a food chain. They', 'break down dead material of every trophic level', ['are producers', 'are primary consumers', 'are always at the top'], 'Decomposers act on dead matter of all levels and are shown in their own position in the energy diagram.');
mc(2, 'pyramids', 'The pyramid of numbers in a tree ecosystem is usually', 'inverted at its base, since a single large tree supports many insects', ['upright', 'always horizontal', 'the same as the pyramid of energy'], 'One tree (producer) supports many insects and birds, so the base has the smallest number.');
mc(2, 'pyramids', 'Which of the following is NOT a limitation of ecological pyramids?', 'They show the flow of energy between trophic levels accurately in every case', ['They do not allow for the same species belonging to two trophic levels', 'They assume a simple food chain', 'They do not accommodate saprophytes'], 'These three are NCERT\'s limitations. A pyramid of energy does show the flow, but numbers and biomass do not always.', 'Read the NOT: the true statement that is not a limitation is the answer.');
mc(2, 'pyramids', 'The pyramid of biomass in a terrestrial ecosystem is generally', 'upright', ['inverted', 'rectangular', 'spherical'], 'Plants have the largest standing biomass. Each higher level has less.');
mc(2, 'pyramids', 'Why is the pyramid of energy never inverted?', 'Energy is lost as heat at each transfer, so each level has less than the one below', ['Because energy cycles', 'Because decomposers add energy', 'Because the Sun supplies each level'], 'The second law of thermodynamics forbids gaining energy at each step.');

// ---------------------------------------------------------------- Level 3
mc(3, 'productivity', 'In a field, GPP is 2400 g m<sup>&minus;2</sup> yr<sup>&minus;1</sup> and respiration is 900 g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>. The NPP is', '1500 g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', ['3300 g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '2.67 g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '900 g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>'], 'NPP = GPP &minus; R = 2400 &minus; 900 = 1500.', 'Adding R is the usual slip.');
mc(3, 'productivity', 'Which of these correctly ranks the following in the order of productivity (highest first) for a typical situation?', 'GPP &gt; NPP &gt; secondary productivity', ['NPP &gt; GPP &gt; secondary productivity', 'Secondary productivity &gt; NPP &gt; GPP', 'GPP = NPP = secondary productivity'], 'NPP is GPP minus the producers\' respiration. Consumers get only a part of NPP.');
mc(3, 'productivity', 'Primary productivity is measured by', 'the amount of organic matter or energy produced per unit area per unit time', ['the amount of food eaten by herbivores', 'the number of plant species', 'the soil depth'], 'It is a rate, so time must be included in the unit.');
mc(3, 'productivity', 'Primary productivity is not the same everywhere. Which of these would lower primary productivity of a forest most?', 'Shortage of soil nutrients and water', ['More herbivores in the tropics', 'Higher number of decomposers', 'A taller canopy'], 'Plant growth depends on light, water, nutrients and temperature. NPP falls when they are limited.');
mc(3, 'productivity', 'Which of the following is true of the oceans compared with land?', 'Oceans cover most of the Earth but produce only about a third of the total NPP', ['Oceans produce more than land', 'Oceans produce no NPP', 'Oceans produce the whole NPP'], '55 of 170 billion tons is about 32%.');
mc(3, 'decomposition', 'Which process is performed by bacterial and fungal enzymes?', 'Catabolism', ['Fragmentation', 'Leaching', 'Humification'], 'Catabolism degrades the detritus into simple inorganic substances.', 'Fragmentation is done by detritivores such as earthworms, with no enzymes from microbes.');
mc(3, 'decomposition', 'Which of the following is a correct comparison of the decomposition rates?', 'Detritus rich in nitrogen decomposes faster than detritus rich in lignin', ['Detritus rich in lignin decomposes faster', 'Both have the same rate in cold soil', 'Decomposition stops in warm soil'], 'Nitrogen-rich matter feeds microbes; lignin resists enzymes.');
mc(3, 'decomposition', 'In which place will the build-up of organic material be greatest?', 'In a cold, waterlogged peat bog', ['In a warm tropical forest floor', 'In a well-aerated compost heap', 'In a warm moist garden soil'], 'Low temperature and anaerobic conditions inhibit decomposition, so organic matter accumulates (as peat).');
mc(3, 'decomposition', 'Humification and mineralisation take place', 'in the soil, during decomposition, as the last steps', ['in the air', 'in the plant leaves before they fall', 'only in water'], 'NCERT notes that humification and mineralisation occur in the soil. Humus forms and is later mineralised.');
mc(3, 'decomposition', 'Which of these is a detritivore?', 'Earthworm', ['<i>Rhizobium</i>', '<i>Penicillium</i>', '<i>Nostoc</i>'], 'Earthworms ingest detritus and fragment it. <i>Penicillium</i> is a fungal decomposer.');
mc(3, 'energy flow', 'If the producers in a grassland capture 20000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>, how much energy is available to the secondary consumers (T3), following the ten per cent law?', '200 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', ['2000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '20 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '10000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>'], 'T2 gets 10% of 20000 = 2000. T3 gets 10% of 2000 = 200.', 'Stopping at T2 gives 2000.');
mc(3, 'energy flow', 'In a food chain Plant &rarr; Insect &rarr; Frog &rarr; Snake &rarr; Hawk, the hawk has 2 kJ. How much energy did the plants have?', '20000 kJ', ['200 kJ', '2000 kJ', '200000 kJ'], 'Hawk is T5. Plant energy = 2 &times; 10<sup>4</sup> = 20000 kJ (four steps of 10 times each).', 'Counting five steps gives 200000 kJ.');
mc(3, 'energy flow', 'The Sun\'s energy captured by plants is stored as', 'chemical energy in the organic compounds', ['heat in the air', 'kinetic energy', 'nuclear energy'], 'Photosynthesis converts light to the chemical energy of carbohydrates.');
mc(3, 'energy flow', 'Which statement about energy flow is correct?', 'The energy lost as heat is not available for use again by the producers', ['Energy returns to the Sun', 'Energy cycles in the ecosystem like water', 'Decomposers add new energy from outside'], 'Energy flows one way. Nutrients, not energy, circulate.');
mc(3, 'energy flow', 'Why do larger carnivores like tigers occur in smaller numbers than deer?', 'Only a small part of energy reaches the higher trophic level', ['Tigers eat more than deer', 'Tigers lose more water', 'Deer breed slowly'], 'Because the energy decreases by about 90% each step, the top level supports fewer individuals.');
mc(3, 'food chain', 'In a food web, the number of food chains', 'is greater than the number of species at one level because of cross-links', ['equals the number of producers', 'is always one', 'is zero'], 'Each possible path from producer to top consumer is a separate chain; a web has many.');
mc(3, 'food chain', 'Which of these organisms can occupy more than one trophic level?', 'Humans', ['Grass', 'Phytoplankton', 'Earthworm only as T1'], 'Humans eat plants (T2) and animals (T3 or higher). Producers are always T1.');
mc(3, 'food chain', 'In the chain Phytoplankton &rarr; Zooplankton &rarr; Small fish &rarr; Large fish, the large fish are', 'tertiary consumers', ['secondary consumers', 'primary consumers', 'producers'], 'Zooplankton are primary consumers, small fish secondary, large fish tertiary.', 'Counting the producers as consumers shifts all labels.');
mc(3, 'food chain', 'Which statement about the detritus food chain is correct?', 'It transfers energy from dead organic matter to decomposers and the animals that feed on them', ['It is absent in terrestrial ecosystems', 'It begins with producers', 'It begins with carnivores'], 'It starts from detritus and is more important on land than in water.');
mc(3, 'pyramids', 'In the sea the pyramid of biomass is inverted because', 'phytoplankton have a small standing crop that turns over rapidly', ['phytoplankton are larger than fishes', 'fishes are producers', 'there are no zooplankton'], 'A small standing biomass of fast-reproducing phytoplankton supports a larger biomass of animals that eat them.');
mc(3, 'pyramids', 'The pyramid of numbers in a parasitic food chain is generally', 'inverted, since one host supports many parasites', ['upright', 'perfectly square', 'unrelated to the numbers'], 'A single tree or host animal supports numerous parasites, so the number rises at higher levels.');
mc(3, 'pyramids', 'The unit of the pyramid of energy is', 'kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup> (energy per area per time)', ['g m<sup>&minus;2</sup>', 'number per m<sup>2</sup>', 'kg'], 'Energy pyramids show a rate, so time is in the unit. Biomass pyramids use g m<sup>&minus;2</sup>.');
mc(3, 'pyramids', 'Which is true of a pyramid of energy?', 'It always has producers at the base and is never inverted', ['It can be inverted in an ocean', 'It shows the number of individuals', 'Decomposers are placed at its apex'], 'Because energy is lost at each step, the pyramid is always upright.');
mc(3, 'pyramids', 'The pyramid of biomass in a lake at a given time shows', 'the standing crop at each trophic level', ['the rate of production', 'the flow of energy', 'the age of the lake'], 'It is a snapshot of the dry mass of living organisms at each level at one time.');
mc(3, 'pyramids', 'Which pyramid does NOT consider the rate of production, so it can be inverted?', 'Biomass', ['Energy', 'Productivity', 'Trophic transfer'], 'Biomass is a stock, which can be small for fast-growing producers. Energy is a rate over time.');

// ---------------------------------------------------------------- Assertion
asr(3, 'energy flow', 'Energy flow in an ecosystem is unidirectional.', 'Energy lost as heat by organisms cannot be reused by the producers.', 0, 'Heat dissipated into the environment cannot be captured again, so the flow is one-way. R explains A.');
asr(3, 'energy flow', 'The number of trophic levels in a food chain is limited to four or five.', 'Only about 10% of the energy passes to the next trophic level.', 0, 'After four steps only 0.01% of the energy remains, too little to support another level. R explains A.');
asr(3, 'productivity', 'Net primary productivity is always less than gross primary productivity.', 'Plants use some of the gross productivity in their own respiration.', 0, 'NPP = GPP &minus; R, with R &gt; 0. R explains A.');
asr(3, 'decomposition', 'Decomposition is slow in cold regions.', 'Low temperature inhibits the action of microbes.', 0, 'Cold slows the activity of decomposers, so organic matter accumulates.');
asr(4, 'decomposition', 'Humus is a reservoir of nutrients in soil.', 'Humus is rapidly mineralised by soil microbes.', 2, 'Humus is a reservoir because it is broken down very slowly. R is false.', 'Rapid mineralisation would give no reservoir.');
asr(3, 'pyramids', 'The pyramid of energy is always upright.', 'Energy lost at each trophic level is much more than the energy transferred.', 0, 'With about 90% lost, each level has less energy than the one below. R explains A.');
asr(4, 'pyramids', 'The pyramid of biomass in the sea is generally inverted.', 'The biomass of fishes far exceeds that of the phytoplankton at a given time.', 0, 'The small standing crop of phytoplankton supports a larger standing crop of consumers. R is the reason.');
asr(4, 'pyramids', 'The pyramid of numbers in a grassland is upright.', 'Pyramids of numbers are always upright in every ecosystem.', 2, 'In a tree ecosystem or a parasitic chain the pyramid of numbers is inverted. R is false.');
asr(3, 'food chain', 'In aquatic ecosystems the grazing food chain is the major conduit of energy flow.', 'In terrestrial ecosystems a larger fraction flows through the detritus food chain.', 1, 'Both true, but R does not explain A. They are two separate statements comparing the two systems.');
asr(3, 'food chain', 'Humans can be placed at more than one trophic level.', 'Humans eat both plants and animals.', 0, 'When eating plants, we are primary consumers; eating herbivores, secondary or higher. R explains A.');
asr(4, 'structure', 'Stratification is seen in forests.', 'Different species occupy different vertical layers such as trees, shrubs and herbs.', 0, 'That is the definition of stratification, so R explains A.');
asr(3, 'productivity', 'Oceans contribute only about a third of the Earth\'s net primary productivity although they cover about 70% of the surface.', 'The NPP per unit area of the oceans is higher than that of the land.', 2, 'A is true (about 55 of 170 billion tons). R is false: if the oceans had a higher NPP per area they would give more than the land. Their NPP per area is lower.', 'Large area does not mean large productivity.');
asr(4, 'decomposition', 'Earthworms are called the farmers\' friends in the context of decomposition.', 'They break detritus into smaller particles, speeding up decomposition.', 0, 'Fragmentation increases surface area for microbial action, so R explains A.');
asr(4, 'energy flow', 'Decomposers do not need any source of energy.', 'They obtain energy by breaking down dead organic matter.', 3, 'A is false: decomposers are heterotrophs and need energy, which comes from the dead matter. R is true.');

// ---------------------------------------------------------------- Statements
stm(3, 'energy flow', 'About 10% of the energy is transferred from one trophic level to the next.', 'The remaining energy is used by the lower level or lost as heat.', 0, 'The rest is used in respiration, movement and lost as heat, or stays in uneaten and undigested matter. Both are correct.');
stm(3, 'productivity', 'Gross primary productivity is the rate of production of organic matter during photosynthesis.', 'Net primary productivity is GPP plus the respiration losses.', 2, 'NPP = GPP &minus; R, so II is wrong.');
stm(3, 'decomposition', 'Fragmentation is performed by detritivores.', 'Leaching moves soluble nutrients to deeper soil layers.', 0, 'Both are correct.');
stm(3, 'decomposition', 'Humus is quickly broken down by microbes.', 'Mineralisation releases inorganic nutrients from humus.', 3, 'Humus decomposes at an extremely slow rate. Mineralisation of it releases nutrients, so II is correct.');
stm(3, 'pyramids', 'The pyramid of energy can be inverted in the sea.', 'The pyramid of biomass can be inverted in the sea.', 3, 'Energy pyramids are never inverted. Biomass pyramids in the sea often are.');
stm(3, 'pyramids', 'Ecological pyramids do not accommodate a food web.', 'Ecological pyramids assume a simple food chain that does not exist in nature.', 0, 'These are two of the limitations given in the NCERT text.');
stm(4, 'pyramids', 'Saprophytes (decomposers) find a place in an ecological pyramid.', 'Species belonging to two trophic levels are not allocated in an ecological pyramid.', 3, 'Saprophytes are given no place in the pyramid, so I is wrong. II is one of the stated limitations.');
stm(3, 'food chain', 'In terrestrial ecosystems, the detritus food chain carries a larger fraction of energy than the grazing chain.', 'In aquatic ecosystems the grazing food chain is the major conduit of energy flow.', 0, 'This is the NCERT comparison.');
stm(4, 'food chain', 'A food web is more stable than a single food chain.', 'In a food web an organism can have alternative food sources.', 0, 'Alternatives reduce the damage if one species declines. This is why webs are more stable.');
stm(3, 'energy flow', 'The Sun\'s energy is captured by all plants with 100% efficiency.', 'Only about 2 to 10% of PAR is captured by plants.', 3, 'I is false. Capture is only 2-10% of PAR, which itself is below 50% of sunlight.');
stm(4, 'energy flow', 'Energy flows in a cycle between the producers and decomposers.', 'Nutrients such as carbon and nitrogen are re-used again and again.', 3, 'Energy does not cycle. Nutrients do.');
stm(4, 'productivity', 'Primary productivity is expressed as g m<sup>&minus;2</sup> yr<sup>&minus;1</sup> because it is a rate.', 'Biomass is expressed as g m<sup>&minus;2</sup> because it is a stock at one time.', 0, 'Rates include time; stocks do not.');
stm(4, 'decomposition', 'Decomposition is oxygen-requiring.', 'Warm and moist conditions favour decomposition.', 0, 'Both are correct.');
stm(5, 'structure', 'The producers, consumers and decomposers together make a biotic community only.', 'An ecosystem includes biotic and abiotic components.', 0, 'The three groups form the living community; adding the abiotic part and energy flow gives the ecosystem.');
stm(5, 'productivity', 'In a lake, standing crop of phytoplankton is small, but its productivity can be high.', 'Standing crop and productivity mean the same thing.', 2, 'Standing crop is a stock at a time; productivity is a rate. A small but fast-turning stock can have high productivity.');

// ---------------------------------------------------------------- Match
match(3, 'decomposition', 'ey-m1', 'Decomposition steps and their features', ['A. Fragmentation', 'B. Leaching', 'C. Catabolism', 'D. Humification'], ['p. Formation of dark amorphous humus', 'q. Soluble nutrients move down the soil', 'r. Enzymes degrade detritus to simpler substances', 's. Breakdown into smaller particles by detritivores'], 'A-s, B-q, C-r, D-p', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-r, B-q, C-s, D-p'], 'Fragmentation: detritivores (s). Leaching: nutrients wash deeper (q). Catabolism: enzymes (r). Humification: humus (p).');
match(3, 'pyramids', 'ey-m2', 'Ecosystem and the shape of pyramid', ['A. Grassland (numbers)', 'B. Tree ecosystem (numbers)', 'C. Sea (biomass)', 'D. Any ecosystem (energy)'], ['p. Inverted', 'q. Upright', 'r. Always upright', 's. Inverted, since a few trees support many insects'], 'A-q, B-s, C-p, D-r', ['A-s, B-q, C-p, D-r', 'A-q, B-p, C-s, D-r', 'A-q, B-s, C-r, D-p'], 'Grassland numbers are upright (q). A tree supports many insects, so it is inverted (s). Sea biomass is inverted (p). Energy is always upright (r).');
match(3, 'food chain', 'ey-m3', 'Chain: grass, grasshopper, frog, snake. Trophic level and organism', ['A. T1', 'B. T2', 'C. T3', 'D. T4'], ['p. Snake', 'q. Frog', 'r. Grass', 's. Grasshopper'], 'A-r, B-s, C-q, D-p', ['A-s, B-r, C-q, D-p', 'A-r, B-s, C-p, D-q', 'A-q, B-s, C-r, D-p'], 'In the chain grass &rarr; grasshopper &rarr; frog &rarr; snake: grass is T1 (r), grasshopper T2 (s), frog T3 (q), snake T4 (p).');
match(4, 'productivity', 'ey-m4', 'Term and meaning', ['A. GPP', 'B. NPP', 'C. Secondary productivity', 'D. Standing crop'], ['p. Mass of living organisms at a trophic level at a given time', 'q. Rate of photosynthetic production of organic matter', 'r. GPP minus respiration', 's. Rate of formation of new organic matter by consumers'], 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-s, B-r, C-q, D-p'], 'GPP is the photosynthetic production (q). NPP = GPP &minus; R (r). Secondary productivity is made by consumers (s). Standing crop is the mass at one time (p).');
match(4, 'energy flow', 'ey-m5', 'Concept and statement', ['A. Ten per cent law', 'B. PAR', 'C. Detritus food chain', 'D. Grazing food chain'], ['p. Begins with dead organic matter', 'q. Begins with green plants', 'r. Wavelengths 400-700 nm', 's. Lindeman'], 'A-s, B-r, C-p, D-q', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p', 'A-p, B-r, C-s, D-q'], 'Ten per cent law: Lindeman (s). PAR: 400-700 nm (r). DFC begins with detritus (p). GFC begins with green plants (q).');

// ---------------------------------------------------------------- Passages
pass('ey-p1', 'Energy in a grassland', 'In a grassland the producers fix 12000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup> as gross primary productivity. They use 3000 kcal in respiration. Herbivores obtain 10 per cent of the NPP, and the first-level carnivores obtain 10 per cent of the herbivores\' energy.');
pq('ey-p1', 3, 'productivity', 'The NPP of the grassland is', '9000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', ['15000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '3000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '12000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>'], 'NPP = GPP &minus; R = 12000 &minus; 3000 = 9000.');
pq('ey-p1', 3, 'energy flow', 'The energy available to the herbivores is', '900 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', ['1200 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '9000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '90 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>'], 'Herbivores get 10% of NPP = 900.', 'Taking 10% of GPP gives 1200.');
pq('ey-p1', 4, 'energy flow', 'The energy reaching the first-level carnivores is', '90 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', ['9 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '900 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>', '120 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>'], '10% of 900 = 90.');
pass('ey-p2', 'Pyramids of a pond', 'In a pond, the phytoplankton biomass is 4 g m<sup>&minus;2</sup>, zooplankton biomass is 11 g m<sup>&minus;2</sup> and the fish biomass is 20 g m<sup>&minus;2</sup> at the time of survey. The phytoplankton double in number every day, and they are eaten rapidly.');
pq('ey-p2', 3, 'pyramids', 'The pyramid of biomass of this pond at that time is', 'inverted', ['upright', 'rectangular', 'cannot be drawn'], 'The lowest level (4) has less biomass than the next levels (11, 20).');
pq('ey-p2', 4, 'pyramids', 'The pyramid of energy for this pond would be', 'upright', ['inverted', 'the same as the biomass pyramid', 'zero at the base'], 'Energy flow per year at each level must decrease, so the pyramid of energy is upright even when the standing crop is inverted.', 'Do not carry the biomass shape to the energy pyramid.');
pq('ey-p2', 4, 'pyramids', 'The best explanation for the inverted biomass pyramid is', 'a small standing crop of rapidly reproducing phytoplankton supports larger consumer biomass', ['fish are producers', 'zooplankton have no food', 'phytoplankton are decomposers'], 'High turnover means the producers make a lot of food although their stock at one time is small.');
pass('ey-p3', 'Leaf litter experiment', 'Leaf litter bags of two kinds of leaves, A (rich in nitrogen, low in lignin) and B (poor in nitrogen, rich in lignin), are buried in warm moist soil and in cold dry soil. After 6 months, 80% of A is gone in warm moist soil, while only 20% of B is gone in cold dry soil.');
pq('ey-p3', 3, 'decomposition', 'Which factor makes A decompose faster than B?', 'High nitrogen and low lignin content', ['High lignin content', 'Low moisture', 'Low microbial activity'], 'Nitrogen-rich, low-lignin litter is easy for microbes to break down.');
pq('ey-p3', 4, 'decomposition', 'The slowest decomposition would be expected for', 'type B in cold, dry soil', ['type A in warm, moist soil', 'type A in cold, dry soil', 'type B in warm, moist soil'], 'Both poor chemistry (lignin) and poor climate (cold, dry) slow the microbes.');

// ---------------------------------------------------------------- Numbers (fixed)
nat(3, 'energy flow', 'In a food chain the producers fix 5000 kJ of energy. Following the ten per cent law, how much energy (kJ) reaches the fourth trophic level?', 5, 'Idea: each step keeps 10%. T1 = 5000, T2 = 500, T3 = 50, T4 = 5 kJ.', 'kJ', 'Using only two steps gives 500.');
nat(3, 'productivity', 'GPP of a field is 1800 g m<sup>&minus;2</sup> yr<sup>&minus;1</sup> and 40% of it is used in respiration. What is the NPP (g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>)?', 1080, 'Idea: NPP = GPP &minus; R. R = 0.4 &times; 1800 = 720. NPP = 1800 &minus; 720 = 1080.', 'g/m<sup>2</sup>/yr', 'Giving 720 answers for R, not NPP.');
nat(4, 'energy flow', 'A tertiary consumer in a chain gets 2 kg of biomass. If only 10% of the biomass passes on at each step, how many kg of producer biomass were needed?', 2000, 'Idea: the tertiary consumer is T4, which is three steps above T1. Producers = 2 &times; 10<sup>3</sup> = 2000 kg.', 'kg', 'Counting four steps gives 20000.');
nat(4, 'energy flow', 'A producer level has 10000 kJ. Each level keeps 10% for the next. If a level needs at least 1 kJ to survive, how many trophic levels (counting producers) can the chain support?', 5, 'Idea: 10000, 1000, 100, 10, 1 kJ are T1 to T5, with 1 kJ just enough. The next would have 0.1 kJ.', '', 'Stopping at 4 ignores that 1 kJ is enough.');
nat(3, 'productivity', 'The biosphere\'s annual NPP is 170 billion tons, of which 55 billion tons come from the oceans. What percentage comes from the land (to the nearest whole number)?', 68, 'Idea: land = 170 &minus; 55 = 115 billion tons. 115/170 = 0.676, or about 68%.', '%', 'The ocean share is 32%.', 1);
nat(3, 'energy flow', 'Grass fixes 40000 kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>. How much reaches the secondary consumer (T3) under the ten per cent law?', 400, 'Idea: T2 = 4000. T3 = 400.', 'kcal/m<sup>2</sup>/yr', 'Stopping at T2 gives 4000.');
nat(4, 'energy flow', 'In a grazing chain the herbivores have 3000 kcal and the first carnivores 240 kcal (same area and year). What is the percentage of energy transfer from herbivores to carnivores?', 8, 'Idea: transfer efficiency = 240/3000 &times; 100 = 8%.', '%', 'Dividing the other way gives 1250%.');
nat(4, 'energy flow', 'Incident solar radiation on a field is 2000 units. PAR is 50% of it, and the plants capture 5% of the PAR. How many units are captured?', 50, 'Idea: PAR = 0.5 &times; 2000 = 1000. Captured = 0.05 &times; 1000 = 50 units.', 'units', 'Taking 5% of the 2000 gives 100.');
nat(5, 'productivity', 'The NPP of a forest is 1200 g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>. How many kg of NPP are produced in 5 hectares in a year? (1 ha = 10000 m<sup>2</sup>)', 60000, 'Idea: area = 5 &times; 10000 = 50000 m<sup>2</sup>. Total = 1200 &times; 50000 = 6 &times; 10<sup>7</sup> g = 60000 kg.', 'kg', 'Forgetting g to kg conversion gives 6 &times; 10<sup>7</sup>.');
nat(5, 'energy flow', 'A pond chain is phytoplankton, zooplankton, small fish, large fish and a heron. The heron gets 6 kJ. How many kJ of energy did the phytoplankton fix, with 10% transferred at every step?', 60000, 'Idea: the heron is T5, four steps above T1. Phytoplankton energy = 6 &times; 10<sup>4</sup> = 60000 kJ.', 'kJ', 'Counting five steps gives 600000.');

// ---------------------------------------------------------------- Level 4 and 5 extras
mc(4, 'energy flow', 'A student states: "Because only 10% of energy is passed on, a vegetarian diet supports more people than a meat diet from the same farmland." This is', 'correct, since eating at a lower trophic level loses less energy', ['wrong, since meat has more energy', 'wrong, since plants have no energy', 'correct only for fish'], 'Each step in the chain loses about 90%. Eating plants (T2) uses fewer steps than eating animals fed on plants (T3).');
mc(4, 'energy flow', 'In an ecosystem, the energy lost between trophic levels is mostly', 'as heat from respiration', ['as light', 'as stored fat', 'as new species'], 'Respiration, movement, and metabolism release heat. Undigested material goes to decomposers.');
mc(4, 'energy flow', 'Which of the following correctly describes the flow of energy through detritivores?', 'They obtain energy from detritus and pass part of it to their predators', ['They produce energy from sunlight', 'They send it back to the producers', 'They do not respire'], 'Detritivores and decomposers are consumers of dead matter; their energy goes up the detritus food chain.');
mc(4, 'productivity', 'If the respiration losses of the producers are higher than the GPP, the NPP will be', 'negative, so the plants would lose biomass', ['zero', 'positive and large', 'equal to GPP'], 'NPP = GPP &minus; R. If R &gt; GPP, the value is negative.');
mc(4, 'productivity', 'Which of these correctly distinguishes standing crop and productivity?', 'Standing crop is mass present at a time; productivity is the rate of production', ['Both are rates', 'Both are stocks', 'Standing crop is a rate; productivity is mass'], 'Units tell the difference: g m<sup>&minus;2</sup> versus g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>.');
mc(4, 'decomposition', 'Which of the following has the correct relation between humus and nutrient supply?', 'Humus releases nutrients slowly, thus keeping soil fertile for long', ['Humus releases all nutrients at once', 'Humus has no nutrients', 'Humus is destroyed in a day'], 'Because it is highly resistant to microbial action, humus is a slow-release reservoir.');
mc(4, 'decomposition', 'During decomposition, which process increases the surface area of detritus for microbial action?', 'Fragmentation', ['Humification', 'Mineralisation', 'Leaching'], 'Smaller pieces mean more surface exposed to enzymes.');
mc(4, 'decomposition', 'Why does the removal of earthworms from the soil slow decomposition?', 'Less fragmentation of detritus', ['Less leaching', 'Less light', 'More humus'], 'Without detritivores, detritus stays as big pieces, so microbes work more slowly.');
mc(4, 'pyramids', 'A pyramid of numbers is drawn for a forest with 1 big tree, 500 insects, 20 birds and 1 hawk. It looks', 'spindle-shaped (narrow at both ends)', ['upright', 'a perfect cone', 'cannot be drawn'], 'The base has 1, the second level 500, then 20, then 1. The widest level is in the middle.', 'It is neither upright nor fully inverted.');
mc(4, 'pyramids', 'Which is NOT a limitation of pyramids of numbers?', 'They show the energy flow of each level accurately', ['They give equal weight to a tiny and a huge organism', 'They may be inverted in a tree ecosystem', 'They ignore the biomass of each organism'], 'Pyramids of numbers do not show energy transfer. The other three are real limitations.');
mc(4, 'food chain', 'Which of the following is NOT a feature of a food web?', 'The energy flows both ways between two species', ['It has many interconnected chains', 'Omnivores link different levels', 'It is more stable than a chain'], 'Energy flows from the eaten to the eater only.');
mc(5, 'energy flow', 'The energy pyramid of a salt marsh: T1 = 8000, T2 = 900, T3 = 90, T4 = 10 (kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>). Which transfer is the most efficient?', 'T1 to T2 (11.25%)', ['T2 to T3 (10%)', 'T3 to T4 (11.1%)', 'All three are equal'], 'T1 to T2: 900/8000 = 11.25%. T2 to T3: 90/900 = 10%. T3 to T4: 10/90 = 11.1%. The highest is T1 to T2.', 'Computing each ratio is needed; the ten per cent law is an average.');

// ---------------------------------------------------------------- Templates
const CHAINS = [
  ['grass', 'grasshopper', 'frog', 'snake', 'hawk'],
  ['phytoplankton', 'zooplankton', 'small fish', 'large fish', 'fish eagle'],
  ['wheat', 'rat', 'snake', 'owl'],
  ['algae', 'water flea', 'minnow', 'trout', 'bear'],
  ['leaf', 'caterpillar', 'sparrow', 'cat'],
  ['grass', 'rabbit', 'fox', 'eagle'],
];
const gens = [
  { id: 'ey-g01', type: 'nat', level: 3, format: 'numeric', exams: ex(3), sub: 'energy flow',
    make(rng) {
      const E = choose(rng, [1000, 2000, 5000, 8000, 10000, 20000, 40000, 50000]), n = int(rng, 2, 5);
      const ans = E * 0.1 ** (n - 1);
      return { E, n, q: `Producers in an ecosystem fix ${E} kJ of energy. How much energy (kJ) reaches trophic level T${n}, by the ten per cent law?`, answer: +ans.toFixed(4), tol: ans * 0.001, unit: 'kJ', sol: `Idea: each transfer keeps 10%. From T1 to T${n} there are ${n - 1} steps. Energy = ${E} &times; 0.1<sup>${n - 1}</sup> = ${fmt(ans, 4)} kJ.`, trap: `Using ${n} steps instead of ${n - 1} is the usual slip.` };
    },
    verify(p) { let e = p.E; for (let i = 1; i < p.n; i++) e *= 0.1; return +e.toFixed(4); } },
  { id: 'ey-g02', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'productivity',
    make(rng) {
      const GPP = int(rng, 8, 60) * 100, Rp = choose(rng, [10, 20, 25, 30, 40, 50]);
      const R = GPP * Rp / 100, NPP = GPP - R;
      return { GPP, Rp, R, q: `The GPP of an ecosystem is ${GPP} g m<sup>&minus;2</sup> yr<sup>&minus;1</sup> and the producers respire ${Rp}% of it. What is the NPP (g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>)?`, answer: NPP, tol: 0, unit: 'g m<sup>-2</sup> yr<sup>-1</sup>', sol: `Idea: NPP = GPP &minus; R. R = ${Rp}% of ${GPP} = ${R}. NPP = ${GPP} &minus; ${R} = ${NPP}.`, trap: 'The respiration is a loss, not a gain.' };
    },
    verify(p) { return p.GPP * (100 - p.Rp) / 100; } },
  { id: 'ey-g03', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'productivity',
    make(rng) {
      const NPP = int(rng, 5, 40) * 100, R = int(rng, 2, 20) * 100;
      return { NPP, R, q: `The NPP of a grassland is ${NPP} kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup> and respiration by the grass is ${R} kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>. Find the GPP (kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>).`, answer: NPP + R, tol: 0, unit: 'kcal m<sup>-2</sup> yr<sup>-1</sup>', sol: `Idea: GPP = NPP + R = ${NPP} + ${R} = ${NPP + R}.`, trap: 'Subtracting R is the reverse of the formula.' };
    },
    verify(p) { return p.NPP + p.R; } },
  { id: 'ey-g04', type: 'nat', level: 4, format: 'numeric', exams: ex(4), sub: 'energy flow',
    make(rng) {
      const top = choose(rng, [1, 2, 4, 5, 8, 10, 20]), n = int(rng, 3, 5);
      const ans = top * 10 ** (n - 1);
      return { top, n, q: `The animals at trophic level T${n} of a chain have ${top} kJ of energy. Assuming 10% transfer at each step, how much energy (kJ) did the producers fix?`, answer: ans, tol: 0, unit: 'kJ', sol: `Idea: work backwards, multiplying by 10 at each step. There are ${n - 1} steps from T1 to T${n}. Energy = ${top} &times; 10<sup>${n - 1}</sup> = ${ans} kJ.`, trap: `Using ${n} steps gives ${top * 10 ** n}.` };
    },
    verify(p) { let e = p.top; for (let i = 1; i < p.n; i++) e *= 10; return e; } },
  { id: 'ey-g05', type: 'nat', level: 3, format: 'numeric', exams: ex(3), sub: 'energy flow',
    make(rng) {
      const a = int(rng, 10, 100) * 100, f = choose(rng, [5, 8, 10, 12, 15, 20]);
      const b = a * f / 100;
      return { a, b, f, q: `A herbivore level has ${a} kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup> and the carnivore level above it has ${b} kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>. What percentage of energy is transferred between them?`, answer: f, tol: 0.05, unit: '%', sol: `Idea: efficiency = energy at upper level &divide; energy at lower level &times; 100 = ${b}/${a} &times; 100 = ${f}%.`, trap: 'Dividing lower by upper inverts the answer.' };
    },
    verify(p) { return +(p.b / p.a * 100).toFixed(2); } },
  { id: 'ey-g06', type: 'nat', level: 4, format: 'numeric', exams: ex(4), sub: 'energy flow',
    make(rng) {
      const I = int(rng, 10, 40) * 100, par = choose(rng, [40, 45, 50]), cap = choose(rng, [2, 3, 4, 5, 8, 10]);
      const ans = I * par / 100 * cap / 100;
      return { I, par, cap, q: `A field receives ${I} units of solar energy. PAR is ${par}% of it and the crop captures ${cap}% of the PAR. How many units are captured?`, answer: +ans.toFixed(2), tol: 0.02, unit: 'units', sol: `Idea: first find PAR, then the captured share of it. PAR = ${par}% of ${I} = ${I * par / 100}. Captured = ${cap}% of ${I * par / 100} = ${ans.toFixed(2)}.`, trap: 'The capture percentage applies to PAR, not to total sunlight.' };
    },
    verify(p) { return +(p.I * p.par * p.cap / 10000).toFixed(2); } },
  { id: 'ey-g07', type: 'nat', level: 3, format: 'numeric', exams: ex(3), sub: 'energy flow',
    make(rng) {
      const P = choose(rng, [1000, 2000, 3000, 5000, 8000, 12000, 15000]), steps = int(rng, 2, 4);
      const ans = P * 0.1 ** steps;
      return { P, steps, q: `A biomass of ${P} kg of producers supports consumers ${steps} trophic levels above them. Using the ten per cent law, how many kg of biomass is expected at that top level?`, answer: +ans.toFixed(3), tol: 0.001 + ans * 0.001, unit: 'kg', sol: `Idea: biomass is multiplied by 0.1 at each step. After ${steps} steps: ${P} &times; 0.1<sup>${steps}</sup> = ${fmt(ans, 4)} kg.`, trap: 'The number of steps is the difference of levels, not the level number.' };
    },
    verify(p) { let e = p.P; for (let i = 0; i < p.steps; i++) e *= 0.1; return +e.toFixed(3); } },
  { id: 'ey-g08', type: 'nat', level: 4, format: 'integer', exams: ex(4), sub: 'energy flow',
    make(rng) {
      const k = int(rng, 3, 6), E = 10 ** k * choose(rng, [1, 2, 5]), min = choose(rng, [1, 2, 5]);
      let n = 1, e = E; while (e * 0.1 >= min) { e *= 0.1; n++; }
      return { E, min, q: `Producers fix ${E} kJ. Each next level gets 10% of the energy of the one below. A trophic level needs at least ${min} kJ to survive. How many trophic levels (counting producers) can the chain support?`, answer: n, tol: 0, sol: `Idea: keep dividing by 10 until the energy would fall below ${min} kJ. Levels: ${Array.from({ length: n }, (_, i) => fmt(E * 0.1 ** i, 4)).join(', ')} kJ. That is ${n} levels. The next would have ${fmt(E * 0.1 ** n, 4)} kJ, which is too little.`, trap: 'Stop when the next level would be below the minimum, not at it.' };
    },
    verify(p) { let n = 1, e = p.E; while (e / 10 >= p.min - 1e-9) { e /= 10; n++; } return n; } },
  { id: 'ey-g09', type: 'nat', level: 4, format: 'numeric', exams: ex(4), sub: 'productivity',
    make(rng) {
      const npp = int(rng, 4, 30) * 100, ha = int(rng, 1, 20);
      const ans = npp * ha * 10000 / 1000;
      return { npp, ha, q: `A forest has an NPP of ${npp} g m<sup>&minus;2</sup> yr<sup>&minus;1</sup>. How many kg of NPP does ${ha} hectare${ha > 1 ? 's' : ''} produce in a year? (1 ha = 10000 m<sup>2</sup>)`, answer: ans, tol: 0, unit: 'kg', sol: `Idea: multiply the rate by the area, then convert g to kg. Area = ${ha} &times; 10000 = ${ha * 10000} m<sup>2</sup>. Total = ${npp} &times; ${ha * 10000} = ${npp * ha * 10000} g = ${ans} kg.`, trap: 'The final step g to kg is easily missed.' };
    },
    verify(p) { return p.npp * p.ha * 10 ; } },
  { id: 'ey-g10', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'food chain',
    make(rng) {
      const chain = choose(rng, CHAINS), k = int(rng, 1, chain.length - 1);
      const names = ['producer (first trophic level)', 'primary consumer (second trophic level)', 'secondary consumer (third trophic level)', 'tertiary consumer (fourth trophic level)', 'quaternary consumer (fifth trophic level)'];
      const s = shuffleOpts(rng, names[k], names.filter((_, i) => i !== k && i < chain.length).concat([names[0], 'decomposer']).filter((x, i, a) => a.indexOf(x) === i && x !== names[k]).slice(0, 3));
      return { q: `In the chain ${chain.join(' &rarr; ')}, the ${chain[k]} is a`, options: s.options, answer: s.answer, sol: `Idea: count from the producer. ${chain.slice(0, k + 1).join(', ')}: the ${chain[k]} is number ${k + 1}, so it is a ${names[k]}.`, trap: 'Producers are T1, not consumers.' };
    } },
  { id: 'ey-g11', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'pyramids',
    make(rng) {
      const cases = [
        ['numbers', 'a grassland ecosystem', 'upright'],
        ['numbers', 'a single large tree with insects, small birds and hawks', 'inverted at the base (spindle-shaped overall)'],
        ['biomass', 'a sea ecosystem', 'inverted'],
        ['biomass', 'a grassland', 'upright'],
        ['energy', 'a sea ecosystem', 'always upright'],
        ['energy', 'a forest', 'always upright'],
        ['numbers', 'a parasitic chain on a single host', 'inverted'],
      ];
      const [kind, where, ans] = choose(rng, cases);
      const all = ['upright', 'inverted', 'always upright', 'inverted at the base (spindle-shaped overall)'];
      const wrongs = all.filter((x) => x !== ans).slice(0, 3);
      const s = shuffleOpts(rng, ans, ans === 'upright' ? ['inverted', 'always inverted', 'rectangular'] : ans === 'inverted' || ans.startsWith('inverted') ? ['upright', 'always upright', 'rectangular'] : ['inverted', 'sometimes inverted', 'rectangular']);
      return { q: `The pyramid of ${kind} for ${where} is generally`, options: s.options, answer: s.answer, sol: `Idea: recall the rule for ${kind}. For ${where}, the shape is ${ans}. Energy pyramids are never inverted; numbers and biomass pyramids can be inverted when producers are few or small-standing.`, trap: 'Do not carry the inverted shape of biomass over to the energy pyramid.' };
    } },
  { id: 'ey-g12', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'decomposition',
    make(rng) {
      const cases = [
        ['Earthworms chew leaf litter into small pieces.', 'fragmentation'],
        ['Rain carries soluble salts from litter into deeper soil.', 'leaching'],
        ['Bacterial and fungal enzymes break down litter into simple inorganic substances.', 'catabolism'],
        ['A dark, amorphous, resistant substance builds up in the soil.', 'humification'],
        ['Microbes release inorganic nutrients from humus.', 'mineralisation'],
      ];
      const [d, a] = choose(rng, cases);
      const s = shuffleOpts(rng, a, ['fragmentation', 'leaching', 'catabolism', 'humification', 'mineralisation'].filter((x) => x !== a).slice(0, 3));
      return { q: `${d} This step of decomposition is called`, options: s.options, answer: s.answer, sol: `Idea: match the description to the step. "${d}" describes ${a}.`, trap: 'Catabolism is enzymatic; fragmentation is physical.' };
    } },
  { id: 'ey-g13', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'decomposition',
    make(rng) {
      const A = ['rich in nitrogen and sugars', 'low in lignin and chitin', 'rich in nitrogen and sugars'], B = ['rich in lignin and chitin', 'rich in lignin and chitin', 'rich in lignin and chitin'];
      const place = [['warm and moist soil', 'cold dry soil'], ['well-aerated soil', 'waterlogged soil without oxygen'], ['a warm tropical floor', 'a frozen tundra soil']];
      const i = int(rng, 0, 2), j = int(rng, 0, 2), sw = rng() < 0.5;
      const fast = `${A[i]} in ${place[j][0]}`, slow = `${B[i]} in ${place[j][1]}`;
      const s = shuffleOpts(rng, fast, [slow, `${A[i]} in ${place[j][1]}`, `${B[i]} in ${place[j][0]}`]);
      return { q: 'Which litter will decompose the fastest?', options: s.options, answer: s.answer, sol: `Idea: chemistry and climate both matter. Nitrogen-rich, low-lignin, fragmented litter and a warm, moist, aerated place make microbes work fast. So the fastest is "${fast}".`, trap: 'A good litter in bad conditions, or bad litter in good conditions, is slower than good in good.' };
    } },
  { id: 'ey-g14', type: 'nat', level: 3, format: 'numeric', exams: ex(3), sub: 'energy flow',
    make(rng) {
      const E1 = int(rng, 10, 90) * 100, e2 = int(rng, 5, 15), e3 = int(rng, 5, 15);
      const T2 = E1 * e2 / 100, T3 = T2 * e3 / 100;
      return { E1, e2, e3, q: `Producers have ${E1} kcal. Herbivores keep ${e2}% of it and carnivores keep ${e3}% of the herbivores\' energy. How much energy (kcal) do the carnivores get?`, answer: +T3.toFixed(2), tol: 0.02, unit: 'kcal', sol: `Idea: apply each percentage in turn. Herbivores = ${e2}% of ${E1} = ${T2}. Carnivores = ${e3}% of ${T2} = ${T3.toFixed(2)} kcal.`, trap: 'Take the second percentage of the herbivore figure, not of the producer figure.' };
    },
    verify(p) { return +(p.E1 * p.e2 * p.e3 / 10000).toFixed(2); } },
  { id: 'ey-g15', type: 'nat', level: 3, format: 'numeric', exams: ex(3), sub: 'productivity',
    make(rng) {
      const tot = choose(rng, [170, 150, 180, 200]), part = int(rng, 30, 70);
      const ans = (tot - part) / tot * 100;
      return { tot, part, q: `The biosphere produces ${tot} billion tons of NPP a year, and the oceans produce ${part} billion tons. What percentage is produced on land? (one decimal place)`, answer: +ans.toFixed(1), tol: 0.1, unit: '%', sol: `Idea: land share = (total &minus; ocean)/total. = (${tot} &minus; ${part})/${tot} = ${((tot - part) / tot).toFixed(3)}, which is ${ans.toFixed(1)}%.`, trap: 'The ocean share is a different number from the land share.' };
    },
    verify(p) { return +(100 - p.part / p.tot * 100).toFixed(1); } },
  { id: 'ey-g16', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'energy flow',
    make(rng) {
      const E = choose(rng, [1000, 2000, 5000]), n = int(rng, 2, 4);
      const ans = E * 0.1 ** (n - 1);
      const wr = [ans * 10, ans / 10, E * 0.1];
      const s = numOpts(rng, ans, wr, 'kJ', 4);
      return { q: `A chain has ${E} kJ at T1. By the ten per cent law, the energy at T${n} is`, options: s.options, answer: s.answer, sol: `Idea: ${n - 1} steps of 10% each. ${E} &times; 0.1<sup>${n - 1}</sup> = ${fmt(ans, 4)} kJ.`, trap: `Number of steps is ${n - 1}, not ${n}.` };
    } },
];

// ---------------------------------------------------------------- More top-rank items
mc(5, 'decomposition', 'Choose the correct statement about leaching and catabolism.', 'Leaching removes soluble nutrients from the upper soil while catabolism is enzymatic breakdown', ['Leaching is enzymatic breakdown while catabolism removes soluble nutrients', 'Both are done by earthworms', 'Both occur only in the air'], 'Leaching is a physical movement of soluble salts with water. Catabolism is by microbial enzymes. Fragmentation is by detritivores.');
mc(5, 'decomposition', 'A compost heap is turned often and kept moist and warm. Which combination explains its quick decomposition?', 'Aerobic conditions, warmth and moisture favour decomposer activity', ['Anaerobic conditions favour decomposition', 'Cold temperature favours it', 'Dryness favours it'], 'Decomposition is an oxygen-requiring process, favoured by warm and moist conditions.');
mc(5, 'productivity', 'In which case is secondary productivity likely to be the smallest?', 'A grazing area where herbivores can use only a small part of the NPP', ['A forest with a high NPP and many herbivores', 'A lake with abundant zooplankton', 'A well-grazed meadow'], 'Consumers\' production depends on how much of the NPP they can eat and assimilate.');
mc(5, 'pyramids', 'Which statement about pyramids is correct?', 'Pyramids of energy include the time factor and so give the best comparison of trophic levels', ['Pyramids of numbers give the best comparison', 'Pyramids of biomass include time', 'A pyramid of numbers is never inverted'], 'Energy pyramids show a rate (kcal m<sup>&minus;2</sup> yr<sup>&minus;1</sup>), thus including time and the quality of food.');
mc(5, 'food chain', 'In which respect is a detritus food chain unlike a grazing one?', 'Its first level is dead organic matter, not a living producer', ['It has no decomposers', 'It exists only in water', 'It has no energy loss'], 'The DFC begins with detritus. Energy is lost at each step in both chains.');
mc(5, 'energy flow', 'Which is a correct conclusion from the fact that only 2-10% of PAR is captured by plants and PAR is less than 50% of sunlight?', 'Less than 5% of incident sunlight at most ends up in plant production', ['Plants capture more than half of sunlight', 'Sunlight is not important', 'PAR has no role'], 'Less than 50% of sunlight is PAR, and 2-10% of that is captured, so at most 10% &times; 50% = 5% of sunlight.', 'Combine the two percentages rather than quoting one.');
mc(5, 'structure', 'Which of the following correctly lists all the components that NCERT says make an ecosystem function?', 'Productivity, decomposition, energy flow and nutrient cycling', ['Productivity, mutation, speciation and drift', 'Light, water, soil and wind only', 'Food chain and food web only'], 'These four processes together keep the ecosystem working.');
mc(5, 'energy flow', 'The energy at T2 is 450 kJ and at T4 is 4.5 kJ. The average efficiency per step between T2 and T4 is', '10%', ['1%', '0.1%', '5%'], 'There are 2 steps. 4.5/450 = 0.01 = 0.1 &times; 0.1, so each step is 10%.', 'The overall 1% is two steps of 10%.');
mc(5, 'pyramids', 'In a tree ecosystem: one tree, 1000 insects, 20 birds, 2 hawks. The base of the pyramid of biomass will most likely be', 'wide, since the tree has a huge biomass', ['narrow, like the number pyramid', 'zero', 'smaller than the birds\' layer'], 'Tree biomass far exceeds that of the insects, so the pyramid of biomass is upright even though the pyramid of numbers is inverted at the base.', 'Numbers and biomass can give different shapes for the same ecosystem.');
mc(5, 'productivity', 'Which of the following does NOT change GPP?', 'The rate of respiration of producers', ['The light available', 'The nutrient availability', 'The species of plants'], 'Respiration affects NPP (GPP &minus; R), not GPP itself.');
export default { topic: 'ecosystem', groups, items, gens };
