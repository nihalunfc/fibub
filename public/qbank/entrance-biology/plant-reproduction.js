// NEET UG Biology: Sexual reproduction in flowering plants (NCERT Class 12, Chapter 1 in the 2023 rationalised book). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [1, 3, 0, 2];
const nid = () => `prp-${String(++n).padStart(3, '0')}`;
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
  items.push({ id: nid(), type: 'nat', level, format: tol ? 'numeric' : 'integer', exams: ['neet'], sub, q, answer, tol, ...(unit ? { unit } : {}), sol, ...(trap ? { trap } : {}) });
}

// ---------------------------------------------------------------- Level 1
mc(1, `flower structure`, `The male reproductive whorl of a flower is called the`, `androecium`, [`gynoecium`, `calyx`, `corolla`], `Androecium is the whorl of stamens and makes pollen. Gynoecium is the female whorl (pistils). Calyx and corolla are the protective and attractive whorls.`);
mc(1, `flower structure`, `A typical angiosperm anther is`, `bilobed, with each lobe having two chambers (dithecous)`, [`unilobed with one chamber`, `bilobed with one chamber in each lobe`, `trilobed with three chambers`], `A typical anther has two lobes, and each lobe has two thecae. So it is bilobed and dithecous.`);
mc(1, `microsporogenesis`, `The number of microsporangia in a typical anther is`, `four`, [`two`, `six`, `eight`], `Two lobes with two thecae each give four microsporangia (tetrasporangiate). In section the anther looks like a butterfly.`);
mc(1, `microsporogenesis`, `The innermost wall layer of a microsporangium, which nourishes the developing pollen grains, is the`, `tapetum`, [`endothecium`, `epidermis`, `middle layer`], `Wall layers from outside to inside: epidermis, endothecium, middle layers, tapetum. The tapetum supplies nutrients to the developing pollen.`);
mc(1, `microsporogenesis`, `Each cell of the sporogenous tissue is capable of forming a`, `microspore tetrad`, [`megaspore tetrad`, `triad of pollen`, `embryo sac`], `Each sporogenous cell can become a pollen mother cell (microspore mother cell), which divides by meiosis to form a tetrad of four microspores.`);
mc(1, `pollen grain`, `The hard outer layer of a pollen grain is called the`, `exine`, [`intine`, `tegmen`, `testa`], `Exine is the tough outer layer made of sporopollenin. Intine is the thin inner layer of cellulose and pectin. Testa and tegmen belong to the seed.`);
mc(1, `pollen grain`, `The material that makes the exine of the pollen grain resistant to heat, acids and alkali is`, `sporopollenin`, [`cutin`, `suberin`, `lignin`], `Sporopollenin is one of the most resistant organic materials known. No enzyme is known to degrade it, so pollen fossilises well.`);
mc(1, `megasporogenesis`, `A mature embryo sac of a typical flowering plant is`, `7-celled and 8-nucleate`, [`8-celled and 7-nucleate`, `7-celled and 7-nucleate`, `8-celled and 8-nucleate`], `Three antipodals, two synergids, one egg and one large central cell make 7 cells. The central cell has two polar nuclei, so there are 8 nuclei.`);
mc(1, `megasporogenesis`, `The egg apparatus consists of`, `one egg cell and two synergids`, [`one egg cell and two polar nuclei`, `three antipodal cells`, `two synergids and the central cell`], `At the micropylar end, the egg cell and the two synergids together form the egg apparatus.`);
mc(1, `pollination`, `Transfer of pollen from the anther to the stigma is called`, `pollination`, [`fertilisation`, `germination`, `dehiscence`], `Pollination is only the transfer of pollen. Fertilisation is the fusion of gametes, which happens later.`);
mc(1, `pollination`, `Flowers that never open and always self-pollinate are called`, `cleistogamous`, [`chasmogamous`, `dioecious`, `unisexual`], `In cleistogamous flowers, as in <i>Viola</i>, <i>Oxalis</i> and <i>Commelina</i>, the anthers and stigma lie close together and pollination happens inside the closed bud.`);
mc(1, `pollination`, `Pollination by water is seen in`, `<i>Vallisneria</i>`, [`maize`, `<i>Salvia</i>`, `<i>Yucca</i>`], `<i>Vallisneria</i> and <i>Hydrilla</i> are pollinated by water. Maize is wind pollinated, and <i>Salvia</i> and <i>Yucca</i> are pollinated by insects.`);
mc(1, `artificial hybridisation`, `Removal of anthers from a bisexual flower bud before they burst is called`, `emasculation`, [`bagging`, `tagging`, `castration of pollen`], `Emasculation is done with forceps before the anthers dehisce, so the flower cannot self-pollinate. The bud is then bagged.`);
mc(1, `double fertilisation`, `Fusion of one male gamete with the egg and the other with the two polar nuclei is called`, `double fertilisation`, [`parthenogenesis`, `apomixis`, `polyspermy`], `Two fusions occur in the embryo sac: syngamy and triple fusion. Together they are called double fertilisation.`);
mc(1, `double fertilisation`, `The primary endosperm nucleus is`, `triploid`, [`haploid`, `diploid`, `tetraploid`], `PEN forms by fusion of one haploid male gamete with two haploid polar nuclei, so it is 3n.`);
mc(1, `seed and fruit`, `After fertilisation the ovule develops into a`, `seed`, [`fruit`, `embryo`, `endosperm`], `The ovule becomes the seed, and the ovary becomes the fruit.`);
mc(1, `seed and fruit`, `The wall of a true fruit develops from the`, `ovary wall`, [`integuments`, `nucellus`, `thalamus`], `The ovary wall becomes the pericarp. The integuments become seed coats.`);
mc(1, `apomixis`, `Formation of seeds without fertilisation is called`, `apomixis`, [`double fertilisation`, `syngamy`, `emasculation`], `Apomixis is a type of asexual reproduction that mimics sexual reproduction by producing seeds.`);
mc(1, `apomixis`, `Occurrence of more than one embryo in a seed is called`, `polyembryony`, [`parthenocarpy`, `apogamy only`, `heterospory`], `Polyembryony is seen in citrus and mango, where nucellar cells give extra embryos.`);
mc(1, `embryo`, `In the embryo of a grass, the single cotyledon is called the`, `scutellum`, [`coleoptile`, `coleorhiza`, `plumule`], `The scutellum is the shield-shaped single cotyledon of monocots such as the grasses. Coleoptile and coleorhiza are sheaths of the plumule and radicle.`);
mc(1, `pollen grain`, `The thin-walled apertures in the exine of a pollen grain, from which the pollen tube comes out, are the`, `germ pores`, [`micropyles`, `hila`, `stomata`], `Germ pores are places where sporopollenin is absent. The pollen tube emerges through one of them.`);
mc(1, `endosperm`, `The tender coconut water is a`, `free-nuclear endosperm`, [`cellular endosperm`, `perisperm`, `nucellus`], `Coconut water is multinucleate liquid endosperm, with free nuclei and no cell walls. The white kernel is the cellular endosperm.`);
mc(1, `flower structure`, `A pistil is made of`, `stigma, style and ovary`, [`filament and anther`, `sepals and petals`, `ovule and funicle only`], `The pistil is the female unit: stigma receives pollen, style joins it to the ovary, and the ovary holds the ovules.`);

// ---------------------------------------------------------------- Level 2
mc(2, `flower structure`, `The stalk by which an ovule is attached to the placenta is the`, `funicle`, [`filament`, `hilum`, `chalaza`], `The funicle is the stalk of the ovule. The point where the funicle fuses with the body of the ovule is the hilum.`);
mc(2, `flower structure`, `Which of the following has an apocarpous gynoecium?`, `<i>Michelia</i>`, [`<i>Papaver</i>`, `<i>Hibiscus</i>`, `Tomato`], `In <i>Michelia</i> the carpels are free (apocarpous). In <i>Papaver</i> they are fused (syncarpous). Hibiscus and tomato are also syncarpous.`);
mc(2, `flower structure`, `The basal part of the ovule where the body fuses with the funicle is the`, `hilum`, [`micropyle`, `chalaza`, `nucellus`], `The hilum is the junction of funicle and ovule. The chalaza is the basal end of the ovule opposite the micropyle.`);
mc(2, `flower structure`, `The ovule has one or two protective envelopes called`, `integuments`, [`nucelli`, `thecae`, `perianths`], `Integuments surround the nucellus. They leave a small opening, the micropyle, at the top.`);
mc(2, `microsporogenesis`, `The pollen mother cell is`, `diploid and divides by meiosis`, [`haploid and divides by mitosis`, `diploid and divides by mitosis only`, `haploid and divides by meiosis`], `A pollen mother cell comes from the 2n sporogenous tissue. Meiosis converts it into four haploid microspores.`);
mc(2, `microsporogenesis`, `The layer of the anther wall that helps in dehiscence by its hygroscopic thickenings is the`, `endothecium`, [`tapetum`, `epidermis`, `sporogenous tissue`], `Endothecium, just below the epidermis, has thickenings. It helps the anther to burst and release pollen. Tapetum is the nutritive layer.`);
mc(2, `pollen grain`, `The inner wall of a pollen grain, the intine, is made of`, `cellulose and pectin`, [`sporopollenin`, `lignin and suberin`, `chitin`], `Exine is sporopollenin. Intine is a thin layer of cellulose and pectin.`);
mc(2, `pollen grain`, `Which cell of a 2-celled pollen grain is spindle shaped with dense cytoplasm?`, `generative cell`, [`vegetative cell`, `tube cell`, `synergid`], `The generative cell is small, spindle shaped and dense. The vegetative cell is large, has abundant food and an irregular nucleus.`);
mc(2, `pollen grain`, `In most angiosperms, pollen grains are shed at the`, `2-celled stage`, [`1-celled stage`, `4-celled stage`, `spore tetrad stage`], `More than 60 per cent of angiosperms shed pollen at the 2-celled stage. The generative cell divides later in the pollen tube. The rest shed pollen as 3-celled grains.`);
mc(2, `pollen grain`, `Which of the following loses viability fastest after leaving the anther?`, `Rice pollen`, [`Pollen of Rosaceae`, `Pollen of Leguminosae`, `Pollen of Solanaceae`], `Rice and wheat pollen lose viability within about 30 minutes. Pollen of Rosaceae, Leguminosae and Solanaceae can stay viable for months.`);
mc(2, `pollen grain`, `Pollen grains can be stored for years in liquid nitrogen at`, `&minus;196 &deg;C`, [`&minus;20 &deg;C`, `&minus;80 &deg;C`, `0 &deg;C`], `Cryopreserved pollen is kept in liquid nitrogen at &minus;196 &deg;C in pollen banks, much like seed banks.`);
mc(2, `megasporogenesis`, `Out of the four megaspores formed from a megaspore mother cell, usually`, `one is functional and three degenerate`, [`all four are functional`, `two are functional`, `three are functional`], `Normally only one megaspore, usually the chalazal one, remains functional. It forms the female gametophyte.`);
mc(2, `megasporogenesis`, `The development of the embryo sac from a single megaspore is called`, `monosporic development`, [`bisporic development`, `tetrasporic development`, `polysporic development`], `One functional megaspore gives the embryo sac, which is monosporic development. Most flowering plants follow it.`);
mc(2, `megasporogenesis`, `The cells at the chalazal end of the embryo sac are the`, `three antipodals`, [`two synergids`, `the egg cell`, `the polar nuclei`], `The chalazal end has three antipodal cells, and the micropylar end has the egg apparatus.`);
mc(2, `megasporogenesis`, `The filiform apparatus is found in`, `synergids`, [`antipodals`, `egg cell`, `central cell`], `Filiform apparatus is a thread-like thickening at the micropylar tip of the synergids. It guides the pollen tube into the synergid.`);
mc(2, `pollination`, `Pollen grains of a flower falling on the stigma of another flower of the same plant is`, `geitonogamy`, [`autogamy`, `xenogamy`, `cleistogamy`], `Geitonogamy is functionally cross pollination (it needs an agent) but genetically like self-pollination, since the pollen comes from the same plant.`);
mc(2, `pollination`, `Transfer of pollen between flowers of two different plants of the same species is`, `xenogamy`, [`autogamy`, `geitonogamy`, `apogamy`], `Xenogamy is the only type of pollination that brings genetically different pollen to the stigma.`);
mc(2, `pollination`, `Which of the following is a feature of wind pollinated flowers?`, `Light, non-sticky pollen and large feathery stigma`, [`Large coloured petals and nectar`, `Heavy sticky pollen`, `Small smooth stigma`], `Wind pollinated flowers do not need to attract insects. They have light dry pollen and feathery stigmas to catch it.`);
mc(2, `pollination`, `Maize cob shows that the stigmas are`, `long and feathery, forming silk`, [`short and sticky`, `absent`, `hidden in the style`], `The tassel of the cob is a bunch of feathery stigmas that trap wind-borne pollen. Each ovary has a single ovule.`);
mc(2, `pollination`, `In <i>Yucca</i> the pollinator is`, `a moth that lays eggs in the ovary`, [`a bat`, `a honeybee`, `a sunbird`], `<i>Yucca</i> and its moth are obligate partners. The moth lays eggs in the locule, and the larvae feed on some of the developing seeds.`);
mc(2, `outbreeding`, `Which of the following prevents both autogamy and geitonogamy?`, `Dioecy`, [`Monoecy`, `Cleistogamy`, `Bisexual flowers`], `In dioecious plants, such as papaya, male and female flowers are on different plants. So even pollen from another flower of the same plant is impossible.`);
mc(2, `outbreeding`, `Castor and maize are`, `monoecious and prevent autogamy but not geitonogamy`, [`dioecious and prevent geitonogamy`, `monoecious and prevent geitonogamy`, `cleistogamous and prevent xenogamy`], `Both have male and female flowers on the same plant. This avoids autogamy but geitonogamy is still possible.`);
mc(2, `outbreeding`, `When the anther and stigma of a bisexual flower are placed at different positions, the device is called`, `herkogamy`, [`dichogamy`, `self-incompatibility`, `protandry`], `Herkogamy is the spatial separation of anther and stigma. Dichogamy is a difference in time of pollen release and stigma receptivity.`);
mc(2, `pollen-pistil`, `Pollen tube enters the ovule most commonly through the`, `micropyle`, [`chalaza`, `integument`, `funicle`], `Entry through the micropyle is porogamy, the common type. Entry through the chalaza is chalazogamy, as in <i>Casuarina</i>.`);
mc(2, `pollen-pistil`, `Entry of a pollen tube through the chalaza of the ovule, as in <i>Casuarina</i>, is called`, `chalazogamy`, [`porogamy`, `mesogamy`, `siphonogamy`], `Chalazogamy means the pollen tube enters via the chalaza. Porogamy is via the micropyle.`);
mc(2, `artificial hybridisation`, `If the female parent bears unisexual flowers, the breeder does`, `only bagging, with no emasculation`, [`emasculation and no bagging`, `neither bagging nor emasculation`, `only tagging before opening`], `Unisexual female flowers have no anthers, so emasculation is not needed. They are bagged before opening to keep out foreign pollen.`);
mc(2, `artificial hybridisation`, `Bagging is done with`, `butter paper bags`, [`transparent glass`, `cotton cloth`, `wax paper`], `A bag made of butter paper keeps out unwanted pollen and still lets the flower breathe.`);
mc(2, `double fertilisation`, `After double fertilisation, the synergids and antipodals`, `degenerate`, [`form the endosperm`, `form the embryo`, `become the seed coat`], `They have done their job and degenerate after fertilisation.`);
mc(2, `endosperm`, `The most common type of endosperm development in angiosperms is`, `free-nuclear`, [`cellular`, `helobial only`, `ruminate`], `The PEN divides many times without wall formation, so many free nuclei form. Cell walls form later.`);
mc(2, `embryo`, `The part of the embryonal axis above the cotyledons, ending in the plumule, is the`, `epicotyl`, [`hypocotyl`, `radicle`, `coleoptile`], `Epicotyl lies above the cotyledon node and ends in the plumule. Hypocotyl lies below the node and ends in the radicle.`);
mc(2, `seed and fruit`, `A seed that has no endosperm at maturity is`, `non-albuminous`, [`albuminous`, `perispermic`, `parthenocarpic`], `Non-albuminous seeds (pea, groundnut, beans) use up all their endosperm. Wheat, maize and castor are albuminous.`);
mc(2, `seed and fruit`, `Residual persistent nucellus in a seed is called`, `perisperm`, [`endosperm`, `tegmen`, `hilum`], `Perisperm is the leftover nucellus, as in black pepper and beet.`);
mc(2, `seed and fruit`, `Which of the following is a false fruit?`, `Apple`, [`Mango`, `Tomato`, `Orange`], `In apple the thalamus also grows and forms the fleshy part. A fruit formed from parts other than the ovary is called a false fruit. Cashew and strawberry are other examples.`);
mc(2, `seed and fruit`, `Parthenocarpy means`, `formation of fruit without fertilisation`, [`formation of seed without fertilisation`, `formation of many embryos`, `fruit from thalamus only`], `Parthenocarpic fruits like banana are seedless. Seed formation without fertilisation is apomixis.`);
mc(2, `apomixis`, `Which is an advantage of apomixis in hybrid seed production?`, `Hybrid characters are kept for generations without segregation`, [`Seeds always have more endosperm`, `It needs pollinators`, `It increases the genetic variation`], `Because no meiosis or fusion is involved, hybrid seeds raised by apomixis give offspring identical to the parent. Farmers can reuse them.`);
mc(2, `microsporogenesis`, `The process of formation of microspores from a pollen mother cell is called`, `microsporogenesis`, [`megasporogenesis`, `microgametogenesis`, `gametogenesis`], `Microsporogenesis means meiotic formation of microspores. Their growth into pollen (male gametophytes) is later.`);
mc(2, `pollen products`, `Pollen grains of which of the following cause pollen allergy and bronchial problems?`, `<i>Parthenium</i>`, [`Maize`, `Rice`, `Mango`], `<i>Parthenium</i> (carrot grass) is a common cause of pollen allergy in India.`);
mc(2, `pollination`, `Which of the following is a reward given to insect visitors by flowers?`, `Nectar and pollen grains`, [`Seeds`, `Endosperm`, `Embryo sacs`], `Nectar and pollen are the rewards. Some flowers give safe places for egg laying instead.`);

// ---------------------------------------------------------------- Assertions and statements (level 2-4)
asr(2, `pollen grain`, `The exine of a pollen grain has germ pores.`, `Sporopollenin is absent at the germ pores.`, 0, `Germ pores are the places where the pollen tube comes out, and they exist because sporopollenin is absent there. So R explains A.`);
asr(2, `double fertilisation`, `Fertilisation in angiosperms is called double fertilisation.`, `Two male gametes are used in two different fusion events in the embryo sac.`, 0, `One male gamete fuses with the egg (syngamy) and the other with two polar nuclei (triple fusion). The two fusions explain the name.`);
asr(3, `pollination`, `Geitonogamy is genetically similar to autogamy.`, `In geitonogamy the pollen comes from a flower on the same plant.`, 0, `All flowers of one plant are genetically identical, so the pollen and the ovules carry the same genes. R explains why.`, `Geitonogamy needs an agent (so it is ecologically cross pollination), yet it is genetically self-pollination.`);
asr(3, `outbreeding`, `Papaya prevents both autogamy and geitonogamy.`, `Papaya bears bisexual flowers.`, 2, `Papaya is dioecious, with male and female flowers on separate plants. So A is true and R is false.`);
asr(3, `megasporogenesis`, `The embryo sac is a female gametophyte.`, `It develops from a megaspore, which is haploid.`, 0, `The embryo sac forms from a haploid megaspore by mitosis and makes the egg. A haploid structure that produces gametes is a gametophyte.`);
asr(3, `apomixis`, `Apomictic seeds produce plants identical to the parent.`, `In apomixis the embryo develops without fertilisation, often from a diploid cell formed without meiosis.`, 0, `No reduction or fusion of gametes means no recombination, so the offspring are clones.`);
asr(3, `embryo`, `A maize grain has only one cotyledon.`, `The scutellum lies on one side of the embryonal axis.`, 1, `Both true. The scutellum is the single cotyledon of grasses and it lies lateral to the axis. But the position is not the reason it is the only cotyledon: monocots have one cotyledon by definition.`, `True and true is not always an explanation.`);
asr(4, `endosperm`, `Endosperm is triploid in most angiosperms.`, `It develops from the zygote.`, 2, `The endosperm develops from the primary endosperm nucleus (3n), not from the zygote. So A is true and R is false.`);
asr(4, `pollen grain`, `Pollen grains are well preserved as fossils.`, `The exine of pollen is made of sporopollenin, which resists degradation.`, 0, `Sporopollenin withstands strong acids, alkali and high temperature, and no enzyme digests it. This is why pollen appear in rocks.`);
asr(4, `seed and fruit`, `Banana is a parthenocarpic fruit.`, `Ovules in banana develop into seeds without fertilisation.`, 2, `Banana is seedless (parthenocarpy): the fruit forms without fertilisation and seeds do not form. R wrongly says seeds develop.`, `Do not mix parthenocarpy (fruit without seed) with apomixis (seed without fertilisation).`);
stm(2, `microsporogenesis`, `The tapetum is the innermost wall layer of a microsporangium.`, `It provides nutrition to the developing pollen grains.`, 0, `Both are correct. The tapetum is innermost and nourishes pollen. Cells of the tapetum often have dense cytoplasm and more than one nucleus.`);
stm(3, `pollination`, `Cleistogamous flowers produce assured seed set even in the absence of pollinators.`, `Cleistogamous flowers promote cross pollination.`, 2, `Cleistogamous flowers stay closed and self-pollinate, so seed set is assured. They cannot be cross pollinated. Statement II is wrong.`);
stm(3, `megasporogenesis`, `The central cell of the embryo sac contains two polar nuclei.`, `The egg apparatus lies at the chalazal end.`, 2, `The egg apparatus lies at the micropylar end. The antipodals are at the chalazal end.`, `Micropylar end: egg apparatus. Chalazal end: antipodals.`);
stm(3, `double fertilisation`, `Syngamy forms a diploid zygote.`, `Triple fusion forms a diploid endosperm nucleus.`, 2, `Triple fusion gives a 3n (triploid) PEN, not diploid.`);
stm(3, `embryo`, `Coleoptile is the protective sheath of the radicle in monocots.`, `Coleorhiza is the protective sheath of the plumule.`, 1, `It is the opposite: coleoptile covers the plumule and coleorhiza covers the radicle. Both statements are incorrect.`, `Coleoptile covers the shoot (plumule); coleorhiza covers the root (radicle, rhiza = root).`);
stm(3, `pollen grain`, `The generative cell of a pollen grain divides to form two male gametes.`, `The vegetative cell becomes the pollen tube.`, 0, `The generative cell divides by mitosis (in the grain or in the tube) to give two male gametes. The vegetative cell has a large nucleus, and the tube grows from it. Both are correct.`);
stm(4, `seed and fruit`, `In true fruits the pericarp has three layers: epicarp, mesocarp and endocarp.`, `The fruit wall of a false fruit also has only these three layers formed from the ovary.`, 2, `Statement I is correct. In false fruits other floral parts, such as the thalamus, also contribute, so Statement II is wrong.`);
stm(4, `outbreeding`, `Self-incompatibility is a genetic mechanism that prevents self-pollen from fertilising ovules.`, `It acts by stopping pollen germination or pollen tube growth in the pistil.`, 0, `Self-incompatibility prevents seed set from self-pollination by inhibiting germination or tube growth. Both are correct.`);
stm(4, `apomixis`, `Citrus and mango show polyembryony.`, `The extra embryos in citrus come from diploid nucellar cells.`, 0, `Nucellar cells (2n) protrude into the embryo sac and form embryos without meiosis. Both are correct.`);
stm(4, `pollination`, `Wind pollinated plants usually have one ovule in each ovary and many flowers packed into an inflorescence.`, `Pollen of wind pollinated plants are heavy and sticky.`, 2, `Wind pollen are light and non-sticky. Statement II is wrong.`);

// ---------------------------------------------------------------- Level 3
mc(3, `microsporogenesis`, `A pollen mother cell of a plant with 2n = 24 forms pollen grains. Each microspore of the tetrad has`, `12 chromosomes`, [`24 chromosomes`, `6 chromosomes`, `48 chromosomes`], `Meiosis halves the number: 24 to 12. Each of the four microspores is haploid with 12 chromosomes.`);
mc(3, `microsporogenesis`, `Which layer of the anther wall is NOT part of the four-layered wall?`, `Sporogenous layer`, [`Epidermis`, `Endothecium`, `Tapetum`], `The wall has epidermis, endothecium, middle layers and tapetum. The sporogenous tissue is inside the wall; it makes the pollen mother cells.`, `Sporogenous tissue is the content of the locule, not the wall.`);
mc(3, `pollen grain`, `Which of the following statements about the pollen grain is NOT correct?`, `The intine is made of sporopollenin`, [`The exine is made of sporopollenin`, `The germ pores have no exine`, `The generative cell is smaller than the vegetative cell`], `The intine is made of cellulose and pectin, not sporopollenin. All other statements are correct.`, `Questions with NOT: find the false one.`);
mc(3, `pollen grain`, `The pollen grain is the`, `male gametophyte, which is partially developed at shedding`, [`male gamete`, `sporophyte`, `microsporangium`], `A pollen grain is a microspore that has become a 2- or 3-celled male gametophyte. It makes the gametes but is not itself one.`);
mc(3, `megasporogenesis`, `Which cell of the nucellus divides by meiosis to form megaspores?`, `Megaspore mother cell`, [`Synergid`, `Central cell`, `Antipodal`], `One cell near the micropyle of the nucellus becomes the megaspore mother cell, which is diploid and large, with dense cytoplasm. Its meiosis gives four megaspores.`);
mc(3, `megasporogenesis`, `The functional megaspore undergoes three successive mitoses without cytokinesis at first. How many nuclei result after the first mitosis?`, `2`, [`1`, `4`, `8`], `Nuclei double each time: 1, then 2, 4, 8. The first mitotic division gives 2 nuclei, one at each pole.`);
mc(3, `megasporogenesis`, `The two polar nuclei in a mature embryo sac come from`, `one nucleus from each pole that move to the centre`, [`both from the micropylar pole`, `both from the chalazal pole`, `two synergids`], `After the 8-nucleate stage, 3 nuclei at each pole form cells, and one nucleus from each pole moves to the centre. They are the polar nuclei of the central cell.`);
mc(3, `pollination`, `An aquatic plant, a water lily, is pollinated by`, `insects and wind, not water`, [`water currents only`, `fishes`, `snails`], `Many aquatic plants such as water hyacinth and water lily produce flowers above water and are pollinated by insects or wind. Water pollination is rare and limited to some 30 genera, mostly monocots.`, `Aquatic does not mean water pollinated.`);
mc(3, `pollination`, `In <i>Vallisneria</i>, pollination occurs when`, `male flowers or pollen float to the water surface and reach female flowers there`, [`the female flowers stay submerged`, `pollen is released under water`, `bats visit the flowers`], `The female flower reaches the surface on a long stalk. The male flowers or pollen are released on the surface and drift passively.`);
mc(3, `pollination`, `Which pair of features suits insect pollinated flowers?`, `Sticky pollen with rough surface and showy fragrant petals`, [`Dry light pollen and feathery stigma`, `Small dull flowers and abundant smooth pollen`, `Exposed anthers with large smooth stigma`], `Insects need to be attracted, so flowers are showy and fragrant. Pollen is sticky or has sculptured walls so it clings to the body.`);
mc(3, `pollination`, `Wind pollinated flowers typically have`, `well exposed stamens and numerous flowers in a compact inflorescence`, [`large brightly coloured petals`, `nectar guides`, `heavy sticky pollen`], `Exposed stamens release pollen to the wind. Many flowers close together increase the chance of capture. Colour and nectar are for animals.`);
mc(3, `outbreeding`, `Which of the following is NOT an outbreeding device?`, `Cleistogamy`, [`Dichogamy`, `Herkogamy`, `Dioecy`], `Cleistogamy compels self-pollination. The others promote cross pollination.`);
mc(3, `outbreeding`, `Pollen release before the stigma becomes receptive, in the same flower, is`, `protandry`, [`protogyny`, `herkogamy`, `cleistogamy`], `This is a type of dichogamy. When the stigma is receptive before the anthers release pollen it is protogyny.`);
mc(3, `pollen-pistil`, `Which of the following is correct for a compatible pollination?`, `Pollen germinates on the stigma and the tube grows through the style to the ovule`, [`Pollen is rejected by the stigma`, `Pollen tube stops in the style`, `Pollen tube enters the ovary through the funicle`], `Compatible pollen is recognised by the pistil and accepted. The tube grows down the style, enters via the micropyle and reaches the synergid.`);
mc(3, `pollen-pistil`, `Where are the two male gametes released after the pollen tube reaches the ovule?`, `Into one of the synergids`, [`Into the egg cell directly`, `Into the antipodals`, `Into the central cell directly`], `The tube enters one synergid through the filiform apparatus and discharges the two male gametes into the synergid cytoplasm. One moves to the egg and one to the central cell.`);
mc(3, `artificial hybridisation`, `A breeder wants to cross two bisexual flowers. The correct sequence is`, `emasculation, bagging, dusting the chosen pollen, rebagging`, [`bagging, emasculation, rebagging only`, `dusting pollen, emasculation, bagging`, `rebagging, emasculation, dusting`], `Remove anthers from the female parent before dehiscence, bag, dust the stigma with the desired pollen when receptive, and bag again, with a tag.`);
mc(3, `artificial hybridisation`, `Why is a flower rebagged after dusting?`, `To stop contamination from any other pollen`, [`To stop the pollen from drying`, `To make the stigma receptive`, `To increase seed size`], `Rebagging keeps all foreign pollen out until the fruit starts to develop.`);
mc(3, `double fertilisation`, `In a plant with 2n = 14, the number of chromosomes in the PEN is`, `21`, [`7`, `14`, `28`], `n = 7. The PEN is formed by two polar nuclei (7 + 7) and one male gamete (7), so 21.`);
mc(3, `double fertilisation`, `Which cell of the embryo sac fuses with the male gamete to form the endosperm?`, `Central cell`, [`Egg cell`, `Synergid`, `Antipodal`], `The male gamete fuses with the two polar nuclei in the central cell. The result is the PEN.`);
mc(3, `endosperm`, `Tender coconut shows both cellular and free-nuclear endosperm. The cellular part is`, `the white kernel`, [`the water`, `the shell`, `the husk`], `Coconut water is the free-nuclear endosperm. The white kernel is the cellular endosperm formed later.`);
mc(3, `endosperm`, `Endosperm in an albuminous seed is`, `a food storage tissue that persists at maturity`, [`completely used before the seed matures`, `diploid in origin`, `formed from the zygote`], `Albuminous seeds, as in wheat and castor, keep their endosperm. Non-albuminous seeds (pea, groundnut) consume it during embryo growth.`);
mc(3, `embryo`, `The correct sequence of embryo development in a dicot is`, `proembryo, globular, heart-shaped, mature embryo`, [`globular, proembryo, heart-shaped, mature`, `heart-shaped, globular, proembryo, mature`, `proembryo, heart-shaped, globular, mature`], `The zygote divides to form the proembryo, which becomes globular, then heart-shaped (cotyledons begin), and then mature.`);
mc(3, `embryo`, `The shield-shaped scutellum in a maize grain`, `lies on one side of the embryonal axis`, [`covers the radicle`, `covers the plumule`, `is the endosperm`], `The scutellum is the single cotyledon of monocots. It sits lateral to the embryonal axis. Coleorhiza covers the radicle.`);
mc(3, `seed and fruit`, `In a mature seed, which part develops from the integuments?`, `Seed coat`, [`Embryo`, `Endosperm`, `Perisperm`], `Outer integument forms the testa, inner forms the tegmen. Together they make the seed coat.`);
mc(3, `seed and fruit`, `A fruit develops from the ovary after fertilisation. This is a`, `true fruit`, [`false fruit`, `parthenocarpic fruit always`, `aggregate fruit only`], `Fruits that develop only from the ovary are true. If any other part such as thalamus joins in, it is a false fruit.`);
mc(3, `seed and fruit`, `Some seeds can remain viable for hundreds or thousands of years. Which example is given in NCERT?`, `<i>Phoenix dactylifera</i> (date palm), about 2000 years`, [`Wheat, 500 years`, `Pea, 1000 years`, `Mango, 5000 years`], `A date palm seed found in Masada (about 2000 years old) germinated. The arctic lupine, <i>Lupinus arcticus</i>, grew from a seed about 10,000 years old.`);
mc(3, `seed and fruit`, `The seed coat of a seed is the combination of`, `testa and tegmen`, [`pericarp and testa`, `epicarp and endocarp`, `perisperm and tegmen`], `Testa is the outer and tegmen the inner coat. Pericarp belongs to the fruit.`);
mc(3, `apomixis`, `In which of the following can apomixis produce embryos from nucellar cells?`, `Citrus`, [`Pea`, `Wheat`, `Maize`], `In some citrus varieties, nucellar cells protrude into the embryo sac and give embryos. This is a kind of apomixis with polyembryony.`);
mc(3, `apomixis`, `Apomixis is important because`, `hybrid varieties can be kept true with no need to buy new seeds every year`, [`it speeds up meiosis`, `it increases pollen viability`, `it gives triploid endosperm`], `Hybrids lose vigour after segregation in selfing. If apomixis is built into hybrids, farmers can grow the same seed each year.`);
mc(3, `pollen products`, `Which statement about pollen as a food supplement is correct?`, `Pollen tablets are sold as supplements to improve performance`, [`Pollen has no nutrients`, `Pollen is harmful to all`, `Pollen is used to make cellulose`], `Pollen grains are rich in nutrients and are sold as tablets. Some people are allergic to pollen of certain plants.`);
mc(3, `flower structure`, `The body of the ovule is made of`, `parenchymatous nucellus enclosed by integuments`, [`only integuments`, `only the embryo sac`, `funicle and hilum only`], `Nucellus is the central mass of parenchyma that holds reserve food and the embryo sac. Integuments wrap it.`);
mc(3, `flower structure`, `A flower in which the ovary lies above the other whorls is`, `hypogynous`, [`epigynous`, `perigynous`, `cleistogamous`], `Hypogynous means ovary superior. In epigynous flowers the ovary is inferior. Plum and rose are perigynous.`);
mc(3, `pollination`, `Which of the following is a floral adaptation in <i>Amorphophallus</i> associated with pollination?`, `The inflorescence is huge and gives a strong smell attracting insects`, [`Wind-feathered stigma`, `Underwater pollen`, `Bat-dispersed seeds`], `<i>Amorphophallus</i> has the largest inflorescence (about 6 feet). It is insect pollinated.`);

match(3, `pollination`, `prp-m1`, `Plants and their pollinating agent`, [`A. <i>Vallisneria</i>`, `B. Maize`, `C. <i>Salvia</i>`, `D. <i>Yucca</i>`], [`p. Wind`, `q. Water`, `r. Insect that has a hinge mechanism of stamens`, `s. A moth that lays eggs in the ovary`], `A-q, B-p, C-r, D-s`, [`A-p, B-q, C-r, D-s`, `A-q, B-p, C-s, D-r`, `A-r, B-p, C-q, D-s`], `<i>Vallisneria</i> is water pollinated (q). Maize is wind pollinated (p). <i>Salvia</i> has a lever mechanism that dusts pollen on the bee (r). <i>Yucca</i> pairs with a moth (s).`);
match(3, `microsporogenesis`, `prp-m2`, `Parts of the anther and pollen`, [`A. Pollen mother cell`, `B. Tapetum`, `C. Exine`, `D. Intine`], [`p. Divides by meiosis to form a tetrad`, `q. Nourishes the developing pollen`, `r. Made of sporopollenin`, `s. Made of cellulose and pectin`], `A-p, B-q, C-r, D-s`, [`A-q, B-p, C-r, D-s`, `A-p, B-q, C-s, D-r`, `A-r, B-q, C-p, D-s`], `PMC undergoes meiosis (p). Tapetum feeds pollen (q). Exine is sporopollenin (r). Intine is cellulose and pectin (s).`);
match(3, `seed and fruit`, `prp-m3`, `Fruit or seed examples`, [`A. False fruit`, `B. Parthenocarpic fruit`, `C. Albuminous seed`, `D. Perisperm`], [`p. Banana`, `q. Black pepper`, `r. Castor`, `s. Apple`], `A-s, B-p, C-r, D-q`, [`A-p, B-s, C-r, D-q`, `A-s, B-p, C-q, D-r`, `A-r, B-p, C-s, D-q`], `Apple is a false fruit (s). Banana is parthenocarpic (p). Castor has an endosperm in the seed (r). Black pepper keeps perisperm (q).`);
match(3, `outbreeding`, `prp-m4`, `Outbreeding devices`, [`A. Dichogamy`, `B. Herkogamy`, `C. Dioecy`, `D. Self-incompatibility`], [`p. Different times of pollen release and stigma receptivity`, `q. Anther and stigma at different positions`, `r. Male and female flowers on separate plants`, `s. Pollen rejected by the same plant's pistil`], `A-p, B-q, C-r, D-s`, [`A-q, B-p, C-r, D-s`, `A-p, B-q, C-s, D-r`, `A-r, B-q, C-p, D-s`], `Each term is matched with its definition.`);

pass(`prp-p1`, `An embryo sac in a mystery plant`, `A plant breeder studies a diploid plant with 2n = 16. She looks at a mature ovule under the microscope and counts the cells and nuclei of the embryo sac. She then crosses the plant, and after fertilisation she examines the young seed.`);
pq(`prp-p1`, 3, `megasporogenesis`, `How many nuclei does the mature embryo sac have, and how many chromosomes does each have?`, `8 nuclei, 8 chromosomes each`, [`7 nuclei, 16 chromosomes each`, `8 nuclei, 16 chromosomes each`, `4 nuclei, 8 chromosomes each`], `The embryo sac has 8 haploid nuclei. n = 8. So each nucleus has 8 chromosomes. The 7 cells are 3 antipodals, 2 synergids, the egg and the central cell with two polar nuclei.`);
pq(`prp-p1`, 3, `double fertilisation`, `How many chromosomes will the PEN of the young seed have?`, `24`, [`16`, `32`, `8`], `PEN = 2 polar nuclei (8 + 8) + 1 male gamete (8) = 24.`);
pq(`prp-p1`, 4, `double fertilisation`, `The zygote and the endosperm nucleus thus differ in that`, `the zygote has 16 and the PEN has 24 chromosomes`, [`both have 16 chromosomes`, `the zygote has 24 and the PEN has 16`, `both have 24 chromosomes`], `Zygote = 8 (egg) + 8 (male gamete) = 16. PEN = 24. Their combined chromosome number difference arises from the second polar nucleus.`);

pass(`prp-p2`, `Pollen tubes in a petri dish`, `Pollen from a flower is placed on a sugar solution with boron and calcium, and the grains start growing tubes. The tubes are long and thin, and each carries a tube nucleus and two sperm cells. The grains were collected from freshly opened anthers. Some flowers of the same species opened a week later and their pollen was dried and kept in a refrigerator.`);
pq(`prp-p2`, 3, `pollen grain`, `Each tube carries two sperm cells because`, `the generative cell divides mitotically to give two male gametes`, [`the tube nucleus divides by meiosis`, `the vegetative cell divides to give two gametes`, `two pollen grains fuse`], `The generative cell divides once by mitosis (in the grain or the tube) to give two male gametes. The tube nucleus stays behind and is not a gamete.`);
pq(`prp-p2`, 4, `pollen grain`, `If the experiment was repeated with rice pollen kept for two hours before testing, most grains will probably`, `fail to germinate, because rice pollen loses viability within about 30 minutes`, [`germinate normally`, `germinate better than fresh pollen`, `turn into embryo sacs`], `Rice and wheat pollen remain viable for only about 30 minutes. Pollen of Rosaceae, Leguminosae and Solanaceae can last for months.`);

pass(`prp-p3`, `Papaya, maize and pea`, `A student surveys three plants. Papaya has male flowers on one plant and female flowers on another. Maize has male flowers in the tassel and female flowers in the cob on the same plant. Pea flowers are bisexual and the anthers are close to the stigma.`);
pq(`prp-p3`, 3, `outbreeding`, `Which of the three can undergo neither autogamy nor geitonogamy?`, `Papaya`, [`Maize`, `Pea`, `Both papaya and maize`], `Papaya is dioecious. Maize is monoecious, so geitonogamy is possible. Pea can self-pollinate.`);
pq(`prp-p3`, 4, `outbreeding`, `For which of them is emasculation needed in hybridisation?`, `Pea`, [`Papaya female`, `Maize female cob`, `All of them`], `Emasculation is needed for bisexual flowers (pea). Female flowers of papaya or maize have no anthers, so only bagging is used.`);

// ---------------------------------------------------------------- Level 4
mc(4, `microsporogenesis`, `A plant has an anther with 120 pollen mother cells. How many pollen grains can this anther make in all?`, `480`, [`120`, `240`, `960`], `Each PMC makes 4 microspores by meiosis, and each microspore becomes one pollen grain: 120 &times; 4 = 480.`, `The answer is not 120 pollen (that is the number of meiosis events).`);
mc(4, `megasporogenesis`, `If all the cells of one mature embryo sac were counted, which combination of ploidy is correct?`, `All nuclei n, except that the central cell has two n nuclei (so it is functionally 2n)`, [`All cells are 2n`, `Antipodals are 3n`, `Egg is 2n and synergids n`], `All eight nuclei arise from one haploid megaspore by mitosis, so each is n. The central cell holds two n polar nuclei, which fuse with a male gamete to make 3n.`);
mc(4, `pollination`, `A plant produces both chasmogamous and cleistogamous flowers. Which statement is correct?`, `Cleistogamous flowers assure seed set but cause inbreeding`, [`Cleistogamous flowers need pollinators`, `Chasmogamous flowers always self-pollinate`, `Cleistogamous flowers have bright petals`], `Chasmogamous (open) flowers allow cross pollination. Cleistogamous (closed) flowers self and do not need pollinators, but they give no new gene combinations.`);
mc(4, `pollination`, `A gardener places the pollen of a flower on the stigma of another flower on the same tree. The resulting seeds will be`, `genetically like selfed seeds, though the pollen needed an agent`, [`like xenogamy seeds`, `triploid`, `apomictic`], `This is geitonogamy: it needs an agent but the genes are the same as the plant that bears both flowers.`);
mc(4, `pollen-pistil`, `The female plant would reject the pollen of its own species if`, `the pollen is self-incompatible, so tube growth stops in the pistil`, [`the stigma is wet`, `the style is hollow`, `the ovary is superior`], `Self-incompatibility is genetic. The pistil recognises the chemical signals of pollen and stops germination or tube growth if it is from the same genotype.`);
mc(4, `pollen-pistil`, `The pollen tube grows towards the micropyle guided by`, `chemical signals from the synergids and the filiform apparatus`, [`light`, `gravity only`, `water pressure`], `Chemotropic signals from the egg apparatus guide the tube. The filiform apparatus helps entry into the synergid.`);
mc(4, `double fertilisation`, `A researcher damages the central cell of an embryo sac before pollination. Normal pollination takes place. What is the most likely result?`, `Syngamy may happen, but the endosperm cannot form, so the embryo is starved`, [`Neither fertilisation can happen`, `The endosperm forms but the zygote does not`, `The seed forms normally`], `The egg still fuses with one male gamete. The second male gamete finds no polar nuclei, so no PEN. Without endosperm the embryo lacks nutrition.`);
mc(4, `double fertilisation`, `If a male gamete with genotype A fertilises an embryo sac with genotype a (egg a, polar nuclei a, a), the endosperm genotype is`, `Aaa`, [`AAa`, `aaa`, `Aa`], `Triple fusion adds two polar nuclei (a, a) and one male gamete (A): Aaa. The embryo is Aa.`, `Both polar nuclei are always identical to the egg, since they come from one megaspore.`);
mc(4, `endosperm`, `Which of the following is true about the endosperm of coconut?`, `The liquid is free-nuclear and the white kernel is cellular`, [`The liquid is cellular and the kernel is free-nuclear`, `Both are cellular`, `The liquid is the embryo`], `Free nuclei float in the liquid. Later, wall formation turns the periphery into the white cellular kernel.`);
mc(4, `endosperm`, `What happens to the endosperm in a pea seed?`, `It is consumed by the developing embryo, so cotyledons store food`, [`It persists in the mature seed`, `It becomes the seed coat`, `It forms the pericarp`], `Pea is non-albuminous. The cotyledons become thick with the stored food taken from the endosperm.`);
mc(4, `embryo`, `The zygote in most angiosperms starts dividing`, `after some endosperm has formed`, [`before any endosperm develops`, `along with the PEN at the same time`, `only in the pollen tube`], `Endosperm develops first so that nutrition is ready for the developing embryo. This ensures the embryo does not starve.`);
mc(4, `embryo`, `In a dicot embryo, the radicle is covered by`, `a root cap`, [`a coleorhiza`, `a coleoptile`, `a scutellum`], `Dicots have a root cap. Coleorhiza is a sheath over the radicle in monocots, and coleoptile covers the plumule.`);
mc(4, `seed and fruit`, `Which of the following is a true fruit that is parthenocarpic?`, `Banana`, [`Apple`, `Strawberry`, `Cashew`], `Banana is a true fruit (from ovary) and can form without fertilisation. The others are false fruits.`);
mc(4, `seed and fruit`, `Dormancy of a seed helps the plant to`, `wait for favourable conditions for germination`, [`reduce the number of seeds`, `increase the endosperm`, `start fertilisation again`], `Seed dormancy keeps the seed alive but inactive and moisture-poor (about 10 to 15 per cent moisture). It germinates when conditions suit.`);
mc(4, `apomixis`, `In apomixis in many Asteraceae and grasses, the diploid egg cell is formed without`, `meiosis`, [`mitosis`, `fertilisation`, `germination`], `A diploid egg develops into an embryo without fertilisation (parthenogenesis). Meiosis is skipped when the egg forms.`);
mc(4, `apomixis`, `Which of the following about apomixis is incorrect?`, `Apomictic offspring show recombination`, [`Seeds are formed without fertilisation`, `It is common in some grasses`, `Offspring are clones`], `No meiosis and no gamete fusion occur, so recombination does not happen.`);
mc(4, `flower structure`, `Which statement about a mature anther is correct?`, `The tapetum degenerates as pollen matures and the septum breaks to join the two thecae`, [`The tapetum becomes the exine`, `The endothecium forms pollen`, `Each theca has four lobes`], `The anther cells and septum break to release pollen on dehiscence. The tapetum also supplies material for the exine but does not become it.`);
mc(4, `microsporogenesis`, `Sporopollenin in the exine is mostly supplied by`, `tapetum`, [`endothecium`, `middle layers`, `epidermis`], `The tapetum feeds and also contributes to the wall of the pollen.`);
mc(4, `pollen grain`, `When a pollen grain is 3-celled at shedding, the cells are`, `a vegetative cell and two male gametes`, [`one vegetative and one generative cell`, `three vegetative cells`, `two synergids and an egg`], `The generative cell has already divided in the grain to give two male gametes. This is the 3-celled stage.`);
mc(4, `artificial hybridisation`, `A breeder is crossing pea plants. Anthers are removed before they open because`, `otherwise self-pollination would give no hybrid`, [`pea has unisexual flowers`, `stigma gets damaged by the anther`, `pollen is harmful to ovules`], `Pea is bisexual and often cleistogamous. The anthers must be removed before dehiscence so only the chosen pollen is used.`);
mc(4, `megasporogenesis`, `If the functional megaspore of a plant with 2n = 18 undergoes the usual development, how many chromosomes are in the central cell in total?`, `18`, [`9`, `27`, `36`], `The central cell has two polar nuclei with n = 9 each, so 2 &times; 9 = 18 chromosomes in the cell before fertilisation. It is not 2n in origin, but it has 18 chromosomes in total.`, `Do not call the central cell diploid: its two nuclei are both haploid and genetically identical.`);
mc(4, `pollination`, `Which of the following is NOT true of animal pollination?`, `All animal pollinators are insects`, [`Pollen of such flowers is often sticky`, `Birds and bats may pollinate some flowers`, `Floral rewards attract visitors`], `Birds, bats, snails and some other animals also pollinate. Insects such as bees are only the most common.`);
mc(4, `outbreeding`, `A dioecious plant differs from a monoecious plant in that`, `dioecious plants bear flowers of separate sexes on separate plants, so geitonogamy cannot occur`, [`dioecious plants bear only bisexual flowers`, `monoecious plants cannot self-pollinate`, `both prevent geitonogamy`], `Papaya (dioecious) prevents autogamy and geitonogamy. Castor and maize (monoecious) prevent autogamy only.`);
mc(4, `seed and fruit`, `A flower has an ovary with 6 ovules. The maximum number of seeds in the fruit is`, `6`, [`3`, `12`, `1`], `Each ovule that is fertilised makes one seed. So at most 6. It needs 6 pollen grains reaching the ovules.`);
mc(4, `double fertilisation`, `The first division of the primary endosperm cell is`, `usually before the first division of the zygote`, [`the same time as the zygote`, `later than 10 divisions of the zygote`, `a meiotic division`], `PEN divides first. This gives a store of food around the embryo before it begins growing.`);
mc(4, `pollen-pistil`, `The stigma of wind pollinated flowers is large and feathery because`, `it can catch wind-borne pollen from a wide area`, [`it holds nectar`, `it releases scent`, `it needs to attract insects`], `A large surface helps catch the floating light pollen.`);
mc(4, `embryo`, `An embryo shows plumule, radicle and one cotyledon. The seed is from`, `a monocot such as maize`, [`a dicot such as pea`, `a gymnosperm`, `a pteridophyte`], `Monocots have one cotyledon (scutellum). Dicots have two.`);

// ---------------------------------------------------------------- Level 5
mc(5, `megasporogenesis`, `Meiosis I of a megaspore mother cell is completed, and meiosis II happens in the dyad cells. Which statement is correct?`, `Four haploid cells form in a linear arrangement, with usually the chalazal one functional`, [`Two diploid cells form, one functional`, `Eight haploid cells form`, `Four cells form, all functional`], `The MMC divides to give a dyad and then a linear tetrad of four haploid megaspores. In most angiosperms the one at the chalazal end becomes functional.`);
mc(5, `pollen grain`, `A student tries to clean pollen grains from a lake mud sample with boiling strong acid and alkali. What is the most likely outcome?`, `The exine survives, so the pollen can still be counted and identified`, [`The pollen is dissolved completely`, `Only the intine survives`, `The generative cell survives alone`], `Sporopollenin of the exine resists strong acids, alkali and high temperature, and enzymes cannot degrade it. This is why palynologists can extract pollen from sediments and rocks.`, `The living contents die, but the exine stays.`);
mc(5, `double fertilisation`, `A plant has 2n = 10. One pollen tube delivers its male gametes to an embryo sac. The total number of chromosomes in the zygote and the PEN together is`, `25`, [`20`, `30`, `35`], `n = 5. Zygote = 5 + 5 = 10. PEN = 5 + 5 + 5 = 15. Together 25.`, `Zygote is 2n (10) and PEN is 3n (15).`);
mc(5, `double fertilisation`, `Which of the following correctly describes the endosperm of a maize seed obtained by crossing female <i>Aa</i> with male <i>Aa</i>? The possible endosperm genotypes are`, `AAA, AAa, Aaa and aaa`, [`AA, Aa, aa`, `AAA and aaa only`, `Aaa only`], `Female embryo sacs are A or a (polar nuclei both the same: AA or aa). Male gametes are A or a. Endosperm: AA + A = AAA, AA + a = AAa, aa + A = Aaa, aa + a = aaa.`);
mc(5, `embryo`, `Which statement correctly compares monocot and dicot embryos?`, `Monocot: one cotyledon, coleoptile and coleorhiza present; dicot: two cotyledons, no such sheaths`, [`Monocot: two cotyledons, coleoptile absent`, `Dicot: one cotyledon, root cap absent`, `Both have a scutellum`], `The sheaths coleoptile and coleorhiza are features of the grass embryo. Dicots have a root cap but lack these sheaths.`);
mc(5, `apomixis`, `A seed formed without fertilisation gives a plant with the genotype of the mother. In which case can this happen?`, `A diploid cell of the nucellus forms an embryo in the embryo sac`, [`A haploid egg fuses with the pollen`, `A synergid forms the endosperm`, `Meiosis occurs in the zygote`], `Adventive embryony: nucellar cells (2n) form embryos without meiosis and so give the same genotype as the mother, as in citrus.`);
mc(5, `apomixis`, `A citrus seed sown in a pot gives three seedlings. Of these, the one that comes from a fertilised egg differs from the other two because`, `the other two are from nucellus and are clones of the mother`, [`the other two are triploid`, `the other two are haploid`, `all three are hybrids`], `Nucellar seedlings are genetically identical to the mother. The sexual seedling has combined genes of both parents, so it differs.`);
mc(5, `seed and fruit`, `In a mature fruit of coconut (a drupe), the edible and watery parts are`, `endosperm`, [`mesocarp and endocarp`, `pericarp and seed coat`, `perisperm`], `Coconut water and kernel are both endosperm. The fibrous husk is mesocarp.`, `Do not call the husk the edible part.`);
mc(5, `pollination`, `Which combination is characteristic of a water-pollinated plant like <i>Zostera</i>?`, `Long ribbon-like pollen carried passively inside water`, [`Heavy sticky pollen`, `Large coloured petals`, `Nectar-rich flowers above the water`], `In sea grass such as <i>Zostera</i>, female flowers remain submerged and pollen grains are long and ribbon-like. They are carried passively by water currents.`);
mc(5, `pollen-pistil`, `The pollen tube enters the ovule through the micropyle, then the embryo sac through`, `one synergid by way of the filiform apparatus`, [`the egg directly`, `the central cell`, `an antipodal cell`], `Entry through a synergid is the norm. The male gametes are released inside the synergid, and it degenerates.`);
mc(5, `double fertilisation`, `If a plant has an ovary with a single ovule and wind pollination, the minimum number of pollen grains needed for a seed is`, `1`, [`2`, `3`, `4`], `One pollen grain gives one tube and two male gametes. That is enough for syngamy and triple fusion.`, `Two male gametes per pollen tube.`);
asr(5, `double fertilisation`, `In a plant with 2n = 28, the endosperm cells have 42 chromosomes.`, `The endosperm is formed by fusion of one male gamete with the two polar nuclei.`, 0, `n = 14. 14 + 14 + 14 = 42. The PEN is 3n, and R is the correct reason.`);
stm(5, `embryo`, `In monocots, the coleorhiza protects the radicle.`, `The scutellum lies on the lateral side of the embryonal axis and absorbs food from the endosperm.`, 0, `Both are correct. The scutellum acts as a haustorium-like organ and transfers food from endosperm to the embryo during germination.`);
stm(5, `pollination`, `In geitonogamy the pollen comes from another flower of the same plant, so the progeny are genetically like selfed progeny.`, `Cleistogamy is a type of geitonogamy.`, 2, `Statement I is correct. Cleistogamy is a type of autogamy, since pollen falls on the stigma of the same flower. Statement II is incorrect.`, `Geitonogamy: different flower, same plant. Autogamy: same flower.`);

// ---------------------------------------------------------------- Number questions (fixed)
nat(3, `counting`, `An anther has 250 pollen mother cells. How many pollen grains will it release if every microspore develops into a pollen grain?`, 1000, `Each PMC makes 4 microspores by meiosis. 250 &times; 4 = 1000.`);
nat(3, `counting`, `A plant produces fruits with 40 seeds each. How many meiotic divisions of pollen mother cells are needed at the very least to supply one pollen grain for each of the 40 seeds? (One meiosis forms four pollen grains.)`, 10, `40 seeds need 40 pollen grains (one grain per seed). Each meiosis gives 4 grains. 40 / 4 = 10.`);
nat(3, `counting`, `A plant has 2n = 18. How many chromosomes are present in the PEN?`, 27, `n = 9. PEN = 3n = 27.`);
nat(4, `counting`, `How many nuclei are in the embryo sacs of an ovary containing 25 mature ovules? (All ovules have normal 8-nucleate embryo sacs.)`, 200, `8 nuclei in each embryo sac. 25 &times; 8 = 200.`);
nat(4, `counting`, `How many cells are present in the embryo sacs of a flower with 12 ovules (normal 7-celled sacs)?`, 84, `7 &times; 12 = 84.`);
nat(4, `counting`, `A flower has a pistil with 30 ovules and all are fertilised. How many pollen tubes with two male gametes each are needed, and how many male gametes are used in total? Give the number of male gametes.`, 60, `Each ovule needs two male gametes (one for syngamy, one for triple fusion). 30 &times; 2 = 60.`);
nat(4, `counting`, `The PEN of a plant divides by free nuclear division 6 times. How many free nuclei are there?`, 64, `Each division doubles the number of nuclei: 2<sup>6</sup> = 64.`);
nat(4, `counting`, `A pollen tube grows at 1.5 mm per hour. A style is 12 mm long. How many hours does the tube take to cross the style?`, 8, `Time = length / rate = 12 / 1.5 = 8 h.`, 'h');
nat(5, `counting`, `A plant has 2n = 24. How many chromosomes, in all, are present in the seven cells of a mature embryo sac before fertilisation? (Count all chromosomes in all nuclei.)`, 96, `n = 12. There are 8 haploid nuclei. 8 &times; 12 = 96.`, '', `The central cell has two nuclei.`);
nat(5, `counting`, `How many meiotic divisions (meioses) in all are needed to form 40 seeds if every seed needs one ovule (embryo sac from one megaspore mother cell) and one pollen grain? Pollen grains come in sets of four per pollen mother cell.`, 50, `Ovules: 40 megaspore mother cells need 40 meioses. Pollen: 40 grains need 40 / 4 = 10 meioses. Total 50.`, '', `Each megaspore mother cell gives only one functional embryo sac. Each PMC gives four pollen grains.`);

// ---------------------------------------------------------------- Number templates
const PLANTS = [['onion', 16], ['maize', 20], ['rice', 24], ['pea', 14], ['tomato', 24], ['wheat (a diploid sample)', 14], ['barley', 14], ['cotton (a diploid sample)', 26], ['mustard', 36], ['sunflower', 34]];
const TISSUES = [
  ['an egg cell', 1, 'is haploid (n)'], ['a synergid', 1, 'is haploid (n)'], ['an antipodal cell', 1, 'is haploid (n)'], ['a pollen grain', 1, 'is haploid (n)'], ['a megaspore', 1, 'is haploid (n)'],
  ['a cell of the nucellus', 2, 'is a diploid sporophytic cell (2n)'], ['a cell of the integument', 2, 'is a diploid sporophytic cell (2n)'], ['a cell of the seed coat', 2, 'comes from the integuments, so it is diploid (2n)'], ['a cell of the pericarp', 2, 'comes from the ovary wall, so it is 2n'],
  ['a pollen mother cell', 2, 'is diploid (2n)'], ['a tapetal cell', 2, 'is diploid (2n)'], ['a cell of the embryo', 2, 'comes from the zygote (n + n = 2n)'], ['a zygote', 2, 'forms from the egg and a male gamete (n + n)'],
  ['a cell of the endosperm', 3, 'is triploid (3n): two polar nuclei plus one male gamete'], ['the primary endosperm nucleus', 3, 'is triploid (3n): two polar nuclei plus one male gamete'],
];
const gens = [
  {
    id: 'prp-g01', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'chromosome numbers',
    make(rng) {
      const [pl, d] = choose(rng, PLANTS);
      const [nm, k, why] = choose(rng, TISSUES);
      const nn = d / 2, ans = k * nn;
      return { d, k, q: `A ${pl} plant has ${d} chromosomes (2n) in its body cells. How many chromosomes will ${nm} have?`, answer: ans, tol: 0, sol: `Idea: find n = ${d} / 2 = ${nn}. ${nm[0].toUpperCase() + nm.slice(1)} ${why}, so the number is ${k === 1 ? 'n' : k === 2 ? '2n' : '3n'} = ${ans}.` };
    },
    verify(p) { return p.k * (p.d / 2); },
  },
  {
    id: 'prp-g02', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'counting pollen',
    make(rng) {
      const pmc = choose(rng, [25, 50, 60, 75, 100, 120, 150, 200, 250, 300]);
      const anthers = choose(rng, [1, 2, 4, 5, 6]);
      return { pmc, anthers, q: `An anther of a plant has ${pmc} pollen mother cells${anthers > 1 ? `. A flower has ${anthers} such anthers` : ''}. How many pollen grains can ${anthers > 1 ? 'the flower' : 'the anther'} make in all? (Every microspore becomes a pollen grain.)`, answer: pmc * anthers * 4, tol: 0, sol: `Idea: one pollen mother cell gives a tetrad of 4 microspores, and each makes one pollen grain. Pollen = ${pmc} &times; ${anthers} &times; 4 = ${pmc * anthers * 4}.` };
    },
    verify(p) { return p.pmc * p.anthers * 4; },
  },
  {
    id: 'prp-g03', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'counting meiosis',
    make(rng) {
      const seeds = choose(rng, [8, 12, 16, 20, 24, 40, 60, 100, 200]);
      const kind = choose(rng, ['pollen', 'sacs', 'both']);
      const pm = seeds / 4, ans = kind === 'pollen' ? pm : kind === 'sacs' ? seeds : pm + seeds;
      const what = kind === 'pollen' ? 'in the anthers (pollen mother cells) alone' : kind === 'sacs' ? 'in the ovules (megaspore mother cells) alone' : 'in anthers and ovules together';
      return { seeds, kind, q: `A plant must form ${seeds} seeds, each from one fertilised ovule with a normal embryo sac, and each fertilised by a different pollen grain. How many meiosis events are needed ${what}?`, answer: ans, tol: 0, sol: `Idea: one meiosis of a pollen mother cell gives 4 pollen grains, but one meiosis of a megaspore mother cell gives only 1 functional embryo sac. Pollen: ${seeds} grains need ${seeds} / 4 = ${pm} meioses. Ovules: ${seeds} embryo sacs need ${seeds} meioses. Required here: ${ans}.` };
    },
    verify(p) { const a = p.seeds / 4, b = p.seeds; return p.kind === 'pollen' ? a : p.kind === 'sacs' ? b : a + b; },
  },
  {
    id: 'prp-g04', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'embryo sac counts',
    make(rng) {
      const ov = choose(rng, [4, 6, 8, 10, 12, 15, 20, 25, 30]);
      const t = choose(rng, ['nuclei', 'cells', 'synergids', 'antipodal cells', 'polar nuclei', 'egg cells']);
      const per = { nuclei: 8, cells: 7, synergids: 2, 'antipodal cells': 3, 'polar nuclei': 2, 'egg cells': 1 }[t];
      return { ov, t, q: `An ovary has ${ov} ovules, each with a normal mature embryo sac (7 cells, 8 nuclei). How many ${t} are there in all the embryo sacs of the ovary?`, answer: ov * per, tol: 0, sol: `Idea: one mature embryo sac has 3 antipodals, 2 synergids, 1 egg and 1 central cell (2 polar nuclei) = 7 cells and 8 nuclei. Number of ${t} per sac = ${per}. Total = ${ov} &times; ${per} = ${ov * per}.` };
    },
    verify(p) { const m = { nuclei: 3 + 2 + 1 + 2, cells: 3 + 2 + 1 + 1, synergids: 2, 'antipodal cells': 3, 'polar nuclei': 2, 'egg cells': 1 }; return p.ov * m[p.t]; },
  },
  {
    id: 'prp-g05', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'chromosomes in the embryo sac',
    make(rng) {
      const [pl, d] = choose(rng, PLANTS);
      const w = choose(rng, ['whole', 'central']);
      const nn = d / 2;
      const ans = w === 'whole' ? 8 * nn : 2 * nn;
      return { d, w, q: `A ${pl} plant has 2n = ${d}. How many chromosomes are present in ${w === 'whole' ? 'all the nuclei of one mature embryo sac together (before fertilisation)' : 'the central cell of a mature embryo sac (before fertilisation)'}?`, answer: ans, tol: 0, sol: `Idea: n = ${nn}. Every nucleus of the embryo sac is haploid (n). ${w === 'whole' ? `There are 8 nuclei, so 8 &times; ${nn} = ${ans}.` : `The central cell has 2 polar nuclei, so 2 &times; ${nn} = ${ans}.`}` };
    },
    verify(p) { return (p.w === 'whole' ? 8 : 2) * (p.d / 2); },
  },
  {
    id: 'prp-g06', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'endosperm nuclei',
    make(rng) {
      const k = int(rng, 3, 9);
      const w = choose(rng, ['free', 'after']);
      return { k, w, q: `The primary endosperm nucleus of a plant divides ${w === 'free' ? `${k} times` : `${k} times in all`} by free-nuclear division (no wall is formed). How many free nuclei are there in the endosperm afterwards?`, answer: 2 ** k, tol: 0, sol: `Idea: every division doubles the number of nuclei, starting from one. After ${k} divisions: 2<sup>${k}</sup> = ${2 ** k}.` };
    },
    verify(p) { let c = 1; for (let i = 0; i < p.k; i++) c *= 2; return c; },
  },
  {
    id: 'prp-g07', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'megaspore nuclei',
    make(rng) {
      const k = int(rng, 1, 3);
      return { k, q: `The functional megaspore of a flowering plant divides by mitosis ${k} time${k > 1 ? 's' : ''} in succession without wall formation (nuclear divisions only). How many nuclei are present in the developing embryo sac after this?`, answer: 2 ** k, tol: 0, sol: `Idea: the functional megaspore is one nucleus, and each round of mitosis doubles the number: 1 to 2 to 4 to 8. After ${k} round${k > 1 ? 's' : ''} there are ${2 ** k} nuclei.` };
    },
    verify(p) { return Math.pow(2, p.k); },
  },
  {
    id: 'prp-g08', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'male gametes',
    make(rng) {
      const ov = choose(rng, [1, 2, 4, 5, 8, 10, 12, 20, 30, 50]);
      const t = choose(rng, ['male gametes', 'pollen grains (each pollen tube carries two male gametes)', 'syngamy events', 'triple fusions']);
      const ans = t === 'male gametes' ? 2 * ov : t.startsWith('pollen') ? ov : ov;
      return { ov, t, q: `All ${ov} ovules of an ovary are fertilised. How many ${t} are needed?`, answer: ans, tol: 0, sol: `Idea: each ovule has one double fertilisation, using two male gametes from one pollen tube (one for syngamy, one for triple fusion). Male gametes = ${ov} &times; 2 = ${2 * ov}; pollen tubes (pollen grains) = ${ov}; syngamy = ${ov}; triple fusion = ${ov}. Answer for the asked quantity: ${ans}.` };
    },
    verify(p) { return p.t === 'male gametes' ? p.ov * 2 : p.ov; },
  },
  {
    id: 'prp-g09', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'pollen tube growth',
    make(rng) {
      const L = choose(rng, [6, 9, 12, 15, 18, 24, 30, 45]);
      const r = choose(rng, [1.5, 2, 3, 4.5, 6]);
      const t = L / r;
      return { L, r, q: `A pollen tube grows through a style at a steady rate of ${r} mm per hour. The style is ${L} mm long. How many hours does the tube take to reach the ovary?`, answer: +t.toFixed(2), tol: 0.01, unit: 'h', sol: `Idea: time = distance / rate = ${L} / ${r} = ${t.toFixed(2)} h.` };
    },
    verify(p) { return +(p.L / p.r).toFixed(2); },
  },
  {
    id: 'prp-g10', type: 'mcq', level: 4, format: 'single', exams: ex(4), sub: 'endosperm genotype',
    make(rng) {
      const f = choose(rng, ['A', 'a']);
      const m = choose(rng, ['A', 'a']);
      const sorted = (s) => s.split('').sort().join('');
      const ans = sorted(f + f + m);
      const pool = ['AAA', 'AAa', 'Aaa', 'aaa'];
      const wrong = [sorted(f + m), sorted(f + m + m), sorted(f + f + (m === 'A' ? 'a' : 'A'))].filter((x) => x !== ans);
      const alt = pool.filter((x) => x !== ans && !wrong.includes(x));
      const o = shuffleOpts(rng, ans, [...wrong, ...alt]);
      return { f, m, q: `An embryo sac carries allele <b>${f}</b> in its egg. It is fertilised by pollen carrying allele <b>${m}</b> (both male gametes of the tube carry the same allele). What is the genotype of the endosperm?`, options: o.options, answer: o.answer, sol: `Idea: the two polar nuclei are identical to the egg, so both carry ${f}. The male gamete adds ${m}. Endosperm = ${f}${f}${m}, written as ${ans}. The embryo is ${sorted(f + m)}.` };
    },
    verify(p) { const sorted = (s) => s.split('').sort().join(''); return p.options.indexOf(sorted(p.f + p.f + p.m)); },
  },
  {
    id: 'prp-g11', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'ploidy',
    make(rng) {
      const [pl, d] = choose(rng, PLANTS);
      const nn = d / 2;
      const items2 = [['the embryo', 2 * nn], ['the endosperm', 3 * nn], ['the seed coat', 2 * nn], ['the egg cell', nn], ['the pericarp', 2 * nn], ['the nucellus', 2 * nn]];
      const [nm, v] = choose(rng, items2);
      const o = numOpts(rng, v, [nn, 2 * nn, 3 * nn, 4 * nn], '', 3);
      return { nn, nm, v, q: `A ${pl} plant has ${d} chromosomes in its leaf cells. How many chromosomes does a cell of ${nm} have?`, options: o.options, answer: o.answer, sol: `Idea: n = ${nn}. The embryo (n + n), the seed coat, pericarp and nucellus (sporophytic tissue) are 2n = ${2 * nn}. The endosperm is 3n = ${3 * nn}. The egg is n = ${nn}. So ${nm} has ${v}.` };
    },
  },
  {
    id: 'prp-g12', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'total chromosomes in a seed',
    make(rng) {
      const [pl, d] = choose(rng, PLANTS);
      const w = choose(rng, ['zygote PEN']);
      const nn = d / 2;
      return { d, q: `A ${pl} plant has 2n = ${d}. After double fertilisation, how many chromosomes are there in the zygote and the primary endosperm nucleus together?`, answer: 5 * nn, tol: 0, sol: `Idea: n = ${nn}. Zygote = 2n = ${2 * nn}. PEN = 3n = ${3 * nn}. Together = ${5 * nn}.` };
    },
    verify(p) { return 2 * (p.d / 2) + 3 * (p.d / 2); },
  },
  {
    id: 'prp-g13', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'pollen viability',
    make(rng) {
      const tot = choose(rng, [200, 250, 400, 500, 800, 1000]);
      const pct = choose(rng, [40, 45, 60, 64, 72, 75, 80, 88]);
      const g2 = (tot * pct) / 100;
      return { tot, g2, q: `In a pollen viability test, ${g2} of ${tot} pollen grains put on sugar solution produced a pollen tube. What is the percentage germination?`, answer: pct, tol: 0.01, unit: '%', sol: `Idea: percentage = germinated / total &times; 100 = ${g2} / ${tot} &times; 100 = ${pct}%.` };
    },
    verify(p) { return +((p.g2 / p.tot) * 100).toFixed(2); },
  },
  {
    id: 'prp-g14', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'seeds from ovules',
    make(rng) {
      const fl = choose(rng, [3, 5, 8, 10, 12]);
      const ov = choose(rng, [4, 6, 8, 10, 15]);
      const rate = choose(rng, [50, 60, 75, 80]);
      const seeds = (fl * ov * rate) / 100;
      if (!Number.isInteger(seeds)) return gens[13].make(rng);
      return { fl, ov, rate, q: `A plant has ${fl} flowers, each with ${ov} ovules. ${rate} per cent of the ovules are fertilised. How many seeds form? How many male gametes were used? Give the number of male gametes.`, answer: seeds * 2, tol: 0, sol: `Idea: seeds = ${fl} &times; ${ov} &times; ${rate}/100 = ${seeds}. Each seed needs two male gametes (double fertilisation). Male gametes = ${seeds} &times; 2 = ${seeds * 2}.` };
    },
    verify(p) { return (p.fl * p.ov * p.rate) / 100 * 2; },
  },
];

export default { topic: 'plant-reproduction', groups, items, gens };
