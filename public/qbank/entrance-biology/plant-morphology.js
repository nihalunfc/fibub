// NEET UG Biology: Morphology of flowering plants (NCERT Class 11, Chapter 5). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const E = ['neet'];
const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [2, 0, 3, 1];
const nid = () => `pm-${String(++n).padStart(3, '0')}`;
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
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
const FF_FAB = '% ⚥ K<sub>(5)</sub> C<sub>1+2+(2)</sub> A<sub>(9)+1</sub> <u>G</u><sub>1</sub>';
const FF_SOL = '⊕ ⚥ K<sub>(5)</sub> C<sub>(5)</sub> A<sub>5</sub> <u>G</u><sub>(2)</sub>';
const FF_LIL = 'Br ⊕ ⚥ P<sub>(3+3)</sub> A<sub>3+3</sub> <u>G</u><sub>(3)</sub>';

// ---------------------------------------------------------------- Level 1
mc(1, 'root', 'The root system that develops from the radicle and persists, as in mustard, is the', 'tap root system', ['fibrous root system', 'adventitious root system', 'prop root system'], 'In dicots the radicle grows into the primary root, with lateral roots: a tap root system.');
mc(1, 'root', 'Most monocotyledonous plants have', 'fibrous roots', ['tap roots', 'pneumatophores only', 'no roots'], 'In monocots the primary root is short-lived and is replaced by many roots from the base of the stem: a fibrous root system, as in wheat.');
mc(1, 'root', 'Root hairs are found in the', 'region of maturation', ['root cap', 'region of meristematic activity', 'region of elongation'], 'In the zone of maturation some cells form fine, thin root hairs that absorb water and minerals.');
mc(1, 'root', 'The thimble-like structure at the tip of a root is the', 'root cap', ['coleorhiza', 'coleoptile', 'scutellum'], 'The root cap protects the tender apical meristem as the root pushes through soil.');
mc(1, 'stem', 'The region of the stem where leaves arise is called', 'node', ['internode', 'hilum', 'petiole'], 'Leaves arise at nodes; the part between two nodes is an internode.');
mc(1, 'stem', 'Potato is a modified', 'underground stem', ['root', 'leaf', 'fruit'], 'A potato tuber has eyes (nodes with buds), so it is a stem.', 'It grows underground, but it is not a root.');
mc(1, 'leaf', 'The broad, green, expanded part of a leaf is the', 'lamina', ['petiole', 'leaf base', 'stipule'], 'The lamina or leaf blade is traversed by veins and veinlets.');
mc(1, 'leaf', 'Parallel venation is typical of', 'monocots', ['dicots', 'both dicots and monocots', 'neither'], 'Dicot leaves have reticulate venation. Parallel venation is typical of monocots, e.g. grasses.');
mc(1, 'inflorescence', 'The arrangement of flowers on the floral axis is called', 'inflorescence', ['phyllotaxy', 'placentation', 'aestivation'], 'Inflorescence is the flower arrangement. Phyllotaxy is the leaf arrangement.');
mc(1, 'flower', 'The male reproductive part of a flower is the', 'androecium', ['gynoecium', 'calyx', 'corolla'], 'The androecium is made of stamens. The gynoecium is the female part.');
mc(1, 'flower', 'A flower that has both stamens and carpels is', 'bisexual', ['unisexual', 'incomplete', 'sterile'], 'Bisexual flowers have both androecium and gynoecium. Unisexual flowers have only one.');
mc(1, 'fruit', 'A fruit is a', 'mature, ripened ovary', ['mature ovule', 'ripened anther', 'ripened stigma'], 'After fertilisation the ovary develops into the fruit and ovules into seeds.');
mc(1, 'seed', 'A dicot seed has', 'two cotyledons', ['one cotyledon', 'no cotyledon', 'three cotyledons'], 'Dicot means two cotyledons, e.g. gram and bean.');
mc(1, 'phyllotaxy', 'The pattern of arrangement of leaves on the stem or branch is', 'phyllotaxy', ['inflorescence', 'aestivation', 'placentation'], 'Phyllotaxy may be alternate, opposite or whorled.');
mc(1, 'families', 'Pea belongs to the family', 'Fabaceae', ['Solanaceae', 'Liliaceae', 'Poaceae'], 'The pea is a member of Fabaceae (Papilionoideae).');

// ---------------------------------------------------------------- Level 2
mc(2, 'root', 'Which is an example of adventitious roots arising from the stem?', 'Banyan prop roots', ['Carrot', 'Turnip', 'Mustard root'], 'Roots that arise from parts other than the radicle are adventitious. Carrot and turnip are modified tap roots.');
mc(2, 'root', 'Pneumatophores are found in', '<i>Rhizophora</i>, which grows in swampy areas', ['<i>Opuntia</i>', 'sweet potato', 'maize'], 'These upward-growing roots help the plant breathe in waterlogged soil.');
mc(2, 'root', 'Stilt roots are seen in', 'maize and sugarcane', ['banyan only', 'carrot and radish', 'mangrove only'], 'Stilt roots grow from the lower nodes of the stem and support it. Banyan has prop roots, which come from branches.');
mc(2, 'root', 'The sweet potato root is', 'an adventitious root modified for food storage', ['a modified tap root', 'a stem tuber', 'a stilt root'], 'The tap roots of carrot and turnip, and the adventitious roots of sweet potato, store food.', 'Sweet potato is a root, potato a stem.');
mc(2, 'root', 'Roots of the monocot plant maize that come out from the nodes and enter the soil to support it are', 'stilt roots', ['prop roots', 'pneumatophores', 'nodulated roots'], 'These are adventitious, supporting roots.');
mc(2, 'stem', 'Axillary buds modified into tendrils are seen in', 'watermelon, cucumber and pumpkin', ['<i>Citrus</i> and <i>Bougainvillea</i>', '<i>Opuntia</i>', 'ginger'], 'Tendrils help climbing. Axillary buds of <i>Citrus</i> and <i>Bougainvillea</i> form thorns.');
mc(2, 'stem', 'Thorns of <i>Citrus</i> are modified', 'axillary buds', ['leaves', 'stipules', 'roots'], 'Thorns protect plants from herbivores. They arise from axillary buds, which proves they are stems.');
mc(2, 'stem', 'In <i>Opuntia</i> the stem is modified into a', 'flattened, green structure that does photosynthesis', ['tuber', 'rhizome', 'tendril'], 'In <i>Opuntia</i> the stem is flattened and green and the leaves are reduced to spines. <i>Euphorbia</i> has cylindrical green stems.');
mc(2, 'stem', 'Ginger and turmeric are', 'rhizomes', ['tubers', 'bulbs', 'corms'], 'A rhizome is a thick underground stem with nodes and buds. Zaminkand is a corm.');
mc(2, 'leaf', 'Leaf base swollen as a pulvinus is a feature of', 'leguminous plants', ['grasses', 'sunflower', 'banana'], 'The pulvinus is in pea and other legumes. Monocots have a sheathing leaf base.');
mc(2, 'leaf', 'Opposite phyllotaxy is seen in', '<i>Calotropis</i> and guava', ['mustard and china rose', '<i>Alstonia</i>', 'sunflower'], 'Opposite: a pair of leaves at each node. Alternate: mustard, china rose, sunflower. Whorled: <i>Alstonia</i>.');
mc(2, 'leaf', 'A pinnately compound leaf is found in', 'neem', ['silk cotton', 'banyan', 'mango'], 'In neem, leaflets are on a common axis, the rachis. In silk cotton the leaflets are at a common point of the petiole: palmately compound.');
mc(2, 'leaf', 'Leaves modified into tendrils are present in', 'pea', ['<i>Opuntia</i>', 'onion', '<i>Nepenthes</i>'], 'Pea leaves are tendrils that help it climb. In <i>Opuntia</i> leaves are spines. Onion has fleshy leaves.');
mc(2, 'leaf', 'In insectivorous <i>Nepenthes</i> the leaf is modified into a', 'pitcher', ['bladder', 'tendril', 'phyllode'], '<i>Utricularia</i> has bladder-like leaves; Australian acacia has leaf-like petioles (phyllodes).');
mc(2, 'inflorescence', 'In racemose inflorescence the main axis', 'continues to grow, with flowers in acropetal order', ['ends in a flower', 'bears flowers in basipetal order', 'is lacking'], 'In racemose types the younger flowers are near the apex.');
mc(2, 'inflorescence', 'In cymose inflorescence', 'the main axis ends in a flower and the flowers are basipetal', ['the main axis grows continuously', 'flowers are acropetal', 'there is only one flower'], 'The oldest flower is at the apex and the younger flowers are at the base.');
mc(2, 'flower', 'A flower which can be divided into two equal halves in only one vertical plane is', 'zygomorphic', ['actinomorphic', 'asymmetric', 'trimerous'], 'Pea, gulmohar and bean flowers are zygomorphic. Mustard and datura are actinomorphic.');
mc(2, 'flower', 'The ovary is superior in', 'hypogynous flowers', ['epigynous flowers', 'perigynous flowers only', 'none of them'], 'In hypogynous flowers (mustard, china rose, brinjal) the gynoecium is at the highest position and the ovary is superior.');
mc(2, 'flower', 'Epigynous flowers, as in guava and cucumber, have', 'an inferior ovary', ['a superior ovary', 'a half-inferior ovary', 'no ovary'], 'The margin of the thalamus grows upward, enclosing the ovary, and other parts arise above it.');
mc(2, 'flower', 'Perigynous flowers like rose and plum have', 'a half-inferior ovary', ['an inferior ovary', 'a superior ovary', 'no thalamus'], 'The gynoecium is at the centre and other parts are on the rim of the thalamus at the same level.', 'Rose is perigynous with half-inferior ovary.');
mc(2, 'flower', 'The valvate aestivation is seen in', '<i>Calotropis</i>', ['china rose', 'pea', 'cotton'], 'In valvate, sepals or petals touch each other at the margin without overlapping. China rose and cotton are twisted, and pea is vexillary.');
mc(2, 'flower', 'Vexillary aestivation is found in', 'pea and bean', ['<i>Calotropis</i>', 'cotton', 'gulmohar'], 'The largest petal (standard) overlaps the two lateral wings, which overlap the two smallest keel petals.');
mc(2, 'flower', 'A single bundle of fused stamens, as in china rose, is', 'monoadelphous', ['diadelphous', 'polyadelphous', 'polyandrous'], 'Monoadelphous: one bundle. Diadelphous: two bundles (pea). Polyadelphous: many bundles (<i>Citrus</i>).');
mc(2, 'flower', 'Pea has stamens in', 'two bundles (diadelphous)', ['one bundle', 'many bundles', 'free state'], 'Nine fused and one free: (9)+1.');
mc(2, 'flower', 'Stamens attached to the petals are', 'epipetalous', ['epiphyllous', 'apocarpous', 'syncarpous'], 'Brinjal has epipetalous stamens. Lily has epiphyllous stamens, attached to the perianth.');
mc(2, 'flower', 'A gynoecium of free carpels is', 'apocarpous', ['syncarpous', 'monocarpellary only', 'epigynous'], 'Lotus and rose have apocarpous gynoecia; mustard and tomato are syncarpous.');
mc(2, 'flower', 'Placentation seen in china rose, tomato and lemon is', 'axile', ['marginal', 'parietal', 'basal'], 'Axile: placenta on the central axis, in a multilocular ovary.');
mc(2, 'flower', 'Marginal placentation is seen in', 'pea', ['mustard', 'sunflower', '<i>Dianthus</i>'], 'The placenta forms a ridge along the ventral suture of a one-chambered ovary.');
mc(2, 'flower', 'Parietal placentation is found in', 'mustard and <i>Argemone</i>', ['sunflower and marigold', 'primrose', 'pea'], 'Ovules develop on the inner wall of the ovary, which is one-chambered but becomes two-chambered by a false septum.');
mc(2, 'flower', 'Free central placentation is a feature of', '<i>Dianthus</i> and primrose', ['mustard', 'tomato', 'sunflower'], 'The ovules are borne on the central axis and septa are absent.');
mc(2, 'flower', 'Basal placentation occurs in', 'sunflower and marigold', ['china rose', 'pea', '<i>Argemone</i>'], 'The placenta develops at the base of a unilocular ovary and has a single ovule.');
mc(2, 'fruit', 'A drupe has', 'a hard endocarp, as in mango and coconut', ['a fleshy endocarp', 'no mesocarp', 'a seed with no coat'], 'Drupes develop from monocarpellary superior ovaries and are one-seeded. The three layers: epicarp, mesocarp, endocarp.');
mc(2, 'fruit', 'The edible part of coconut is', 'endosperm', ['epicarp', 'testa', 'the whole pericarp'], 'Coconut is a drupe: the mesocarp is fibrous, the endocarp is hard, and the endosperm inside the seed is the edible part.');
mc(2, 'seed', 'The scar on a seed where it is attached to the fruit is the', 'hilum', ['micropyle', 'plumule', 'radicle'], 'The hilum is the scar. The micropyle is a small pore near it.');
mc(2, 'seed', 'The shield-shaped cotyledon of a monocot seed is the', 'scutellum', ['coleoptile', 'coleorhiza', 'aleurone layer'], 'The scutellum lies on one side of the embryo of maize and transfers food.');
mc(2, 'seed', 'The coleoptile of a monocot seed is a', 'protective sheath around the plumule', ['protective sheath of radicle', 'layer that stores protein', 'cotyledon'], 'The coleorhiza covers the radicle.');
mc(2, 'families', 'The fruit of Fabaceae is a', 'legume', ['berry', 'capsule', 'drupe'], 'Legume (pod). Solanaceae gives berries or capsules; Liliaceae gives capsules.');
mc(2, 'families', 'Brinjal and potato belong to', 'Solanaceae', ['Fabaceae', 'Liliaceae', 'Poaceae'], 'Solanaceae, the potato family, also has tomato, tobacco and belladonna.');
mc(2, 'families', 'Lily and <i>Aloe</i> belong to the family', 'Liliaceae', ['Fabaceae', 'Solanaceae', 'Brassicaceae'], 'Liliaceae are monocots with parallel venation and trimerous flowers.');

// ---------------------------------------------------------------- Level 3
asr(3, 'root', 'Pneumatophores are seen in mangrove plants.', 'They help in gaseous exchange in waterlogged soil.', 0, 'Mangrove soils lack oxygen, and the pneumatophores have pores that take in air.');
asr(3, 'stem', 'Thorns and tendrils are both homologous organs of the stem.', 'Both arise from axillary buds.', 0, 'The axillary bud origin shows both are modified stems. Both are true and R explains A.');
asr(3, 'leaf', 'Dicot leaves usually have reticulate venation.', 'Monocot leaves have parallel venation.', 1, 'Both true. R does not explain A: it is a contrast, not a cause.');
asr(3, 'flower', 'The ovary of a hypogynous flower is called superior.', 'The other floral parts arise below the ovary.', 0, 'In hypogynous flowers the other whorls arise below the gynoecium, so the ovary is superior.');
asr(3, 'flower', 'Axile placentation occurs in a multilocular ovary.', 'In it the ovules are borne on the ovary wall.', 2, 'A is true: the placenta is on the central axis with septa. R is false: ovules on the wall is parietal.', 'Do not confuse axile and parietal.');
asr(3, 'seed', 'Pea seed is non-endospermic.', 'Its cotyledons store food.', 0, 'Non-endospermic seeds (bean, gram, pea) have no endosperm, as it is used up during seed development, so cotyledons store food.');
asr(4, 'flower', 'Floral formula of a pea flower has an underline below G.', 'It indicates a superior ovary.', 0, 'A line below G means superior ovary, and a line above means inferior.');
asr(4, 'stem', 'Potato and sweet potato are both underground storage organs, so both are modified stems.', 'They both store starch.', 3, 'A is false: potato is a stem tuber but sweet potato is an adventitious root. R is true: both store starch.', 'Same storage role but different organs.');
stm(3, 'root', 'Prop roots of banyan arise from branches.', 'Stilt roots of maize arise from the lower nodes of the stem.', 0, 'Both are correct and both are adventitious.');
stm(3, 'leaf', 'A pulvinus is seen in monocot leaves.', 'A sheathing leaf base is seen in monocot leaves.', 3, 'The pulvinus is in leguminous plants (dicots). Monocot leaves have a sheathing base clasping the stem.');
stm(3, 'inflorescence', 'In racemose inflorescence flowers are borne in an acropetal succession.', 'In cymose inflorescence flowers are borne in a basipetal order.', 0, 'Both are correct.');
stm(3, 'flower', 'Calyx and corolla are accessory whorls.', 'Androecium and gynoecium are reproductive whorls.', 0, 'The four whorls: two accessory (calyx, corolla) and two essential (androecium, gynoecium).');
stm(3, 'flower', 'In china rose the stamens are polyadelphous.', 'In <i>Citrus</i> the stamens are monoadelphous.', 1, 'China rose has monoadelphous stamens and <i>Citrus</i> has polyadelphous stamens. Both are incorrect.');
stm(3, 'fruit', 'A banana develops from the ovary without fertilisation.', 'Fruits developing without fertilisation are called parthenocarpic.', 0, 'Banana is a classic parthenocarpic fruit.');
stm(4, 'seed', 'Castor seed is endospermic.', 'Gram seed is endospermic.', 2, 'Castor has an endosperm; gram, bean and pea are non-endospermic.');
stm(4, 'families', 'Fabaceae flowers have a diadelphous androecium.', 'Solanaceae flowers have an epipetalous androecium.', 0, 'Both are correct.');
stm(4, 'families', 'Liliaceae flowers are trimerous with six perianth lobes.', 'Liliaceae stamens are epipetalous.', 2, 'The six tepals form the perianth, and the stamens are attached to them: epiphyllous, not epipetalous.', 'Perianth means epiphyllous.');

match(2, 'root and stem modifications', 'pm1', 'Modification and example', ['A. Prop roots', 'B. Pneumatophores', 'C. Stem tendril', 'D. Stem thorn'], ['p. <i>Citrus</i>', 'q. Banyan', 'r. <i>Rhizophora</i>', 's. Cucumber'], 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-s, B-r, C-q, D-p'], 'Banyan has prop roots, <i>Rhizophora</i> pneumatophores, cucumber stem tendrils and <i>Citrus</i> thorns.');
match(3, 'placentation', 'pm2', 'Placentation and plant', ['A. Marginal', 'B. Axile', 'C. Parietal', 'D. Free central'], ['p. Mustard', 'q. <i>Dianthus</i>', 'r. Pea', 's. Lemon'], 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'], 'Pea marginal, lemon axile, mustard parietal, <i>Dianthus</i> free central.');
match(3, 'aestivation', 'pm3', 'Aestivation and plant', ['A. Valvate', 'B. Twisted', 'C. Vexillary', 'D. Imbricate'], ['p. Pea', 'q. <i>Calotropis</i>', 'r. Cotton', 's. <i>Cassia</i>'], 'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-p, B-r, C-q, D-s'], 'Calotropis valvate, cotton twisted, pea vexillary, <i>Cassia</i> and gulmohar imbricate.');
match(3, 'families', 'pm4', 'Family and economic plant', ['A. Fabaceae', 'B. Solanaceae', 'C. Liliaceae', 'D. Solanaceae (drug)'], ['p. <i>Colchicum</i>', 'q. Soyabean', 'r. Tomato', 's. <i>Atropa belladonna</i>'], 'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-q, B-s, C-p, D-r'], 'Soyabean is a legume, tomato a solanaceous crop, <i>Colchicum</i> a lily family plant giving colchicine, belladonna a solanaceous medicinal plant.');
match(4, 'leaf modifications', 'pm5', 'Leaf modification and plant', ['A. Tendril', 'B. Spine', 'C. Pitcher', 'D. Phyllode'], ['p. Australian acacia', 'q. Pea', 'r. Cactus', 's. <i>Nepenthes</i>'], 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-s, B-r, C-q, D-p'], 'Pea tendrils, cactus spines, <i>Nepenthes</i> pitcher, Australian acacia phyllodes.');
match(4, 'floral formula symbols', 'pm6', 'Symbol and meaning', ['A. %', 'B. ⊕', 'C. ⚥', 'D. Underlined G'], ['p. Bisexual', 'q. Superior ovary', 'r. Actinomorphic', 's. Zygomorphic'], 'A-s, B-r, C-p, D-q', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p', 'A-s, B-p, C-r, D-q'], 'The % symbol means zygomorphic, ⊕ actinomorphic, ⚥ bisexual, and an underlined G a superior ovary.');

mc(3, 'floral formula', 'The floral formula of a Fabaceae flower such as pea is', FF_FAB, [FF_SOL, FF_LIL, '⊕ ⚥ K<sub>(5)</sub> C<sub>5</sub> A<sub>(9)+1</sub> <u>G</u><sub>1</sub>'], 'The pea flower is zygomorphic (%), bisexual, with five united sepals, five petals in a vexillary pattern (1 standard +2 wings +2 keel fused), diadelphous stamens (9)+1 and a monocarpellary superior ovary.');
mc(3, 'floral formula', 'The floral formula of Solanaceae, e.g. brinjal, is', FF_SOL, [FF_FAB, FF_LIL, '⊕ ⚥ K<sub>5</sub> C<sub>5</sub> A<sub>(5)</sub> <u>G</u><sub>2</sub>'], 'Actinomorphic, bisexual, calyx (5) united, corolla (5) united, five epipetalous stamens, and a bicarpellary syncarpous superior ovary. Fusion shows by brackets.');
mc(3, 'floral formula', 'The floral formula of Liliaceae is', FF_LIL, [FF_FAB, FF_SOL, 'Br ⊕ ⚥ K<sub>3+3</sub> C<sub>3+3</sub> A<sub>3+3</sub> <u>G</u><sub>(3)</sub>'], 'The perianth P(3+3) has six tepals in two whorls with the stamens 3+3 and a trilocular syncarpous superior ovary. Lilies have no separate calyx and corolla.', 'Liliaceae use P, not K and C.');
mc(3, 'families', 'Which of the following is a feature of Fabaceae?', 'Root nodules, pulvinate leaf base and a legume fruit', ['Bulbs, parallel venation and capsule', 'Tuber, exstipulate leaves and berry', 'Prop roots and drupe'], 'Papilionoid legumes have nodules with nitrogen-fixing bacteria. Bulbs with capsules describe Liliaceae, and tubers with berries describe Solanaceae.');
mc(3, 'families', 'Which is NOT a feature of Solanaceae?', 'Parallel venation and a bulb', ['Alternate simple leaves', 'Flowers actinomorphic and bisexual', 'Fruit berry or capsule'], 'Solanaceae are dicots and have reticulate venation. Bulbs and parallel venation fit Liliaceae.');
mc(3, 'families', 'Which of these is an ornamental plant of Fabaceae?', 'Sweet pea', ['<i>Petunia</i>', 'Tulip', '<i>Gloriosa</i>'], 'Petunia is Solanaceae; tulip and <i>Gloriosa</i> are Liliaceae.');
mc(3, 'families', 'Green manure plants among these include', '<i>Sesbania</i>', ['<i>Atropa</i>', '<i>Aloe</i>', '<i>Asparagus</i>'], '<i>Sesbania</i> and <i>Trifolium</i> belong to Fabaceae; they fix nitrogen and are used to enrich soil.');
mc(3, 'families', 'Medicinal plants that belong to Solanaceae are', '<i>Atropa belladonna</i> and <i>Withania somnifera</i> (ashwagandha)', ['<i>Aloe</i> and <i>Colchicum</i>', '<i>Indigofera</i> and <i>Lupin</i>', '<i>Allium</i> and <i>Lilium</i>'], 'Belladonna and ashwagandha are solanaceous. <i>Aloe</i> and <i>Colchicum</i> are Liliaceae.');
mc(3, 'families', 'Colchicine, used to double chromosomes, is obtained from', '<i>Colchicum autumnale</i>', ['<i>Atropa</i>', '<i>Indigofera</i>', '<i>Nicotiana</i>'], '<i>Colchicum</i> belongs to Liliaceae.');
mc(3, 'families', '<i>Allium cepa</i> and <i>Allium sativum</i> are', 'onion and garlic', ['onion and ginger', 'garlic and turmeric', 'onion and asparagus'], 'Both are Liliaceae with bulbs. <i>Asparagus</i> is also in the family.');
mc(3, 'root', 'The correct order of the zones in a root tip from apex to base is', 'root cap, meristematic, elongation, maturation', ['root cap, elongation, meristematic, maturation', 'meristematic, root cap, maturation, elongation', 'maturation, elongation, meristematic, root cap'], 'The cells in the meristematic region divide, then enlarge in the elongation zone, and finally differentiate in the zone of maturation.');
mc(3, 'stem', 'Stem modifications for vegetative propagation in grass and strawberry are', 'runners (subaerial)', ['thorns', 'tendrils', 'phylloclades'], 'Subaerial stems such as runner, stolon, sucker and offset spread new plants. Mint has runners.');
mc(3, 'leaf', 'In a compound leaf, the buds are found in the axil of', 'the whole leaf, not at the leaflets', ['each leaflet', 'the rachis', 'the lamina'], 'An axillary bud is in the axil of the petiole, not in the axil of leaflets.', 'Leaflets have no buds.');
mc(3, 'leaf', 'Leaf venation: the arrangement of veins and veinlets in the lamina is', 'venation', ['phyllotaxy', 'vernation', 'inflorescence'], 'Reticulate and parallel are the two types.');
mc(3, 'phyllotaxy', 'Which plants show alternate phyllotaxy?', 'China rose, mustard and sunflower', ['<i>Calotropis</i> and guava', '<i>Alstonia</i> and guava', '<i>Alstonia</i> and china rose'], 'One leaf at each node, alternately. Calotropis and guava are opposite; <i>Alstonia</i> is whorled.');
mc(3, 'flower', 'Which of the following is a complete flower?', 'One with calyx, corolla, androecium and gynoecium', ['One with only stamens', 'One with only carpels', 'One with calyx and corolla only'], 'If any of the four whorls is missing, the flower is incomplete.');
mc(3, 'flower', 'A flower with no distinct calyx and corolla is called', 'perianth, with tepals', ['inflorescence', 'bracteate', 'epigynous'], 'When calyx and corolla are not distinct, the floral whorl is perianth and its units are tepals, as in lily.');
mc(3, 'fruit', 'In a mango fruit, the mesocarp is', 'fleshy and edible', ['hard and stony', 'thin and papery', 'fibrous and inedible'], 'In mango the epicarp is the skin, the mesocarp is fleshy and the endocarp is stony.');
mc(3, 'seed', 'The outer and inner coats of a seed are', 'testa and tegmen', ['pericarp and endocarp', 'scutellum and coleoptile', 'hilum and micropyle'], 'Testa is the hard outer coat, tegmen the thin inner coat.');
mc(3, 'seed', 'The aleurone layer of a maize grain is rich in', 'protein', ['starch', 'fat only', 'cellulose'], 'It is the outermost layer of the endosperm that separates it from the embryo.');
mc(3, 'seed', 'A maize grain is', 'a fruit (caryopsis), with the seed coat fused to the fruit wall', ['a seed with no fruit wall', 'a drupe', 'a berry'], 'In monocot grains, the seed coat is membranous and fused with the fruit wall.');

// ---------------------------------------------------------------- Level 4
mc(4, 'root', 'Which statement about a monocot root system is correct?', 'The primary root is short-lived and replaced by fibrous roots', ['It always has a long tap root', 'It has no root cap', 'It lacks root hairs'], 'The primary root of monocots is short-lived and roots arise from the base of the stem.');
mc(4, 'root', 'Which of the following is a pair of tap root modifications?', 'Carrot and turnip', ['Sweet potato and carrot', 'Banyan and maize', 'Turnip and sweet potato'], 'Sweet potato roots are adventitious, so options A and C are wrong. Banyan and maize have prop and stilt roots.', 'Sweet potato is adventitious.');
mc(4, 'stem', 'Which pair shows homologous organs?', 'Tendril of cucumber and thorn of <i>Citrus</i>', ['Tendril of pea and tendril of cucumber', 'Potato tuber and sweet potato', 'Thorn of <i>Citrus</i> and spine of cactus'], 'Both cucumber tendrils and Citrus thorns come from axillary buds (stems). Pea tendrils are leaves; cactus spines are leaves.');
mc(4, 'stem', 'Which of these is NOT a modified stem?', 'Sweet potato', ['Potato', 'Ginger', '<i>Opuntia</i> pad'], 'Sweet potato is an adventitious root. The rest have nodes, buds or other stem features.');
mc(4, 'leaf', 'Which of these are leaf modifications?', 'Pea tendrils and cactus spines', ['<i>Citrus</i> thorn and pea tendril', 'Cucumber tendril and cactus spine', '<i>Opuntia</i> pad and onion bulb scale'], 'Pea tendrils are modified leaflets; cactus spines are modified leaves. Citrus thorns and cucumber tendrils are stem modifications.');
mc(4, 'leaf', 'The arrangement of leaflets at the tip of the petiole in a point is', 'palmately compound, as in silk cotton', ['pinnately compound, as in neem', 'simple, as in mango', 'phyllode, as in acacia'], 'Leaflets arise from a common point at the petiole top in palmately compound leaves.');
mc(4, 'inflorescence', 'In which type of inflorescence are the flowers arranged basipetally?', 'Cymose', ['Racemose', 'Both', 'Neither'], 'The oldest flower is at the apex and the youngest at the base in cymes.');
mc(4, 'inflorescence', 'The unit of inflorescence of sunflower is', 'a head (capitulum) of ray and disc florets', ['a spike', 'a cyathium', 'a catkin'], 'The outer ray florets are female or neutral and the central disc florets are bisexual, held in a head and surrounded by bracts.');
mc(4, 'flower', 'The flower of <i>Cassia</i> and gulmohar has', 'imbricate aestivation with the corolla being zygomorphic', ['valvate with actinomorphic corolla', 'vexillary with actinomorphic corolla', 'twisted aestivation'], 'In imbricate aestivation the margins overlap irregularly. Gulmohar and <i>Cassia</i> are in Fabaceae, subfamily Caesalpinioideae.', 'Not every legume is vexillary.');
mc(4, 'flower', 'Which flower has an inferior ovary?', 'Guava', ['Mustard', 'China rose', 'Brinjal'], 'Guava, cucumber and sunflower are epigynous. Mustard, china rose and brinjal are hypogynous.');
mc(4, 'flower', 'The gynoecium of mustard is', 'bicarpellary, syncarpous and with parietal placentation', ['monocarpellary with marginal placentation', 'tricarpellary with axile placentation', 'apocarpous with basal placentation'], 'Mustard has two fused carpels, becoming bilocular with a false septum.');
mc(4, 'flower', 'Which of the following correctly describes a pea flower?', 'Zygomorphic, five-petalled, with vexillary aestivation', ['Actinomorphic, with twisted aestivation', 'Zygomorphic, with valvate aestivation', 'Actinomorphic, with imbricate aestivation'], 'A pea flower has standard, two wings and two fused keel petals.');
mc(4, 'floral formula', 'In a floral formula, a bracket around a number shows', 'fusion of members of that whorl', ['absence of the whorl', 'free members', 'inferior position'], 'K(5) means five fused sepals, and K5 means five free sepals.');
mc(4, 'floral formula', 'The symbol "Br" in a floral formula indicates', 'bracteate flowers', ['bisexual flowers', 'bracteolate flowers', 'bulbous plants'], 'Br is bracteate, Brl is bracteolate.', 'Br is not "bulb".');
mc(4, 'seed', 'The embryo of a monocot seed consists of', 'one cotyledon (scutellum), plumule with coleoptile, radicle with coleorhiza', ['two cotyledons and a hypocotyl only', 'scutellum and aleurone layer only', 'testa and tegmen'], 'The scutellum, plumule, radicle and the protective sheaths form the monocot embryo.');
mc(4, 'seed', 'The part of the embryonal axis above the cotyledons in a dicot seed that gives the shoot is the', 'plumule, and the part below is the radicle', ['radicle, and below is plumule', 'epicotyl is the radicle', 'hilum, and below is micropyle'], 'Epicotyl ends in the plumule (future shoot). The hypocotyl ends in the radicle (future root).');
mc(4, 'families', 'Which one is an economically important plant of Solanaceae and which is of Fabaceae?', 'Tomato; groundnut', ['Soyabean; potato', 'Tobacco; sweet pea', 'Indigofera; brinjal'], 'Tomato is Solanaceae and groundnut is Fabaceae. In other options the families are interchanged.');
mc(4, 'families', 'Which pair of features is correct for Liliaceae?', 'Perennial herbs with bulbs; capsule fruit', ['Woody trees with nodules; legume', 'Herbs with tuber; berry', 'Reticulate venation; drupe'], 'Liliaceae are monocots: parallel venation, tepals, capsule, endospermous seeds.');

// ---------------------------------------------------------------- Level 5
mc(5, 'mixed statements', 'How many of these are modified stems? Ginger, turmeric, potato, carrot, <i>Opuntia</i>, cucumber tendril, <i>Citrus</i> thorn, pea tendril', 'Six', ['Five', 'Seven', 'Four'], 'Stems: ginger, turmeric, potato, <i>Opuntia</i>, cucumber tendril, <i>Citrus</i> thorn (six). Carrot is a root and pea tendril a leaf.');
mc(5, 'mixed statements', 'Which sequence from the outermost to the innermost whorl is correct?', 'Calyx, corolla, androecium, gynoecium', ['Corolla, calyx, gynoecium, androecium', 'Calyx, androecium, corolla, gynoecium', 'Gynoecium, androecium, corolla, calyx'], 'Whorls are in this order on the thalamus.');
mc(5, 'mixed statements', 'A flower has fused five sepals, five petals of unequal size, ten stamens in two bundles and a single carpel. This flower is', 'a pea flower (Fabaceae)', ['a brinjal flower', 'a lily flower', 'a mustard flower'], 'A pea flower has a (9)+1 diadelphous androecium and a monocarpellary ovary.');
mc(5, 'mixed statements', 'A flower in which epipetalous stamens and a bicarpellary syncarpous superior ovary with swollen placentae occur belongs to', 'Solanaceae', ['Liliaceae', 'Fabaceae', 'Poaceae'], 'The swollen placenta with many ovules is typical of Solanaceae.');
mc(5, 'mixed statements', 'Which of these describes the potato correctly?', 'It is a stem tuber of Solanaceae with eyes that bear axillary buds', ['It is a root tuber of Solanaceae', 'It is a rhizome of Liliaceae', 'It is a bulb of Fabaceae'], 'The eyes are nodes with buds.');
mc(5, 'mixed statements', 'The ovary of a flower is half-inferior. Which of these is likely?', 'Rose', ['Cucumber', 'Mustard', 'Sunflower'], 'Rose and plum are perigynous. Cucumber and sunflower are epigynous (inferior); mustard is hypogynous (superior).');
mc(5, 'mixed statements', 'In which of the following does the number of cotyledons differ from the others?', 'Maize', ['Pea', 'Gram', 'Bean'], 'Maize is a monocot with one cotyledon. The rest are dicots.');
mc(5, 'mixed statements', 'Which comparison between a bean seed and a maize grain is correct?', 'Bean has no endosperm and the cotyledons store food; maize has a large endosperm', ['Both have a large endosperm', 'Bean has a coleoptile; maize has a hilum', 'Both have two cotyledons'], 'Bean is non-endospermic. Maize has a coleoptile, a scutellum and a starchy endosperm.');
mc(5, 'mixed statements', 'Which description fits a Liliaceae flower that is "trimerous, actinomorphic, bisexual, epiphyllous stamens"?', 'Br ⊕ ⚥ P<sub>(3+3)</sub> A<sub>3+3</sub> <u>G</u><sub>(3)</sub>', ['% ⚥ K<sub>(5)</sub> C<sub>1+2+(2)</sub> A<sub>(9)+1</sub> <u>G</u><sub>1</sub>', '⊕ ⚥ K<sub>(5)</sub> C<sub>(5)</sub> A<sub>5</sub> <u>G</u><sub>(2)</sub>', '⊕ ⚥ K<sub>2+2</sub> C<sub>4</sub> A<sub>2+4</sub> <u>G</u><sub>(2)</sub>'], 'Trimerous: 3 + 3 perianth and 3 + 3 stamens, with three fused carpels.');
mc(5, 'mixed statements', 'A pea plant bearing a fruit with 5 seeds had flowers with a single carpel. The ovules were borne on', 'a marginal placenta along the ventral suture', ['a free central axis', 'the base of the ovary', 'a parietal placenta'], 'Single carpel in pea: marginal placentation.');

pass('pp1', 'Passage: a family on the bench', 'A student examines a flower. It is actinomorphic and bisexual. The calyx has five fused sepals which persist on the fruit. The corolla has five fused petals. Five stamens are attached to the petals. The ovary is superior, two-chambered, obliquely placed, with swollen placentae. The plant is a herb and the fruit is a berry.');
pq('pp1', 3, 'families', 'The flower belongs to the family', 'Solanaceae', ['Fabaceae', 'Liliaceae', 'Poaceae'], 'Epipetalous stamens, a bicarpellary syncarpous superior ovary, swollen placenta and a berry are typical of Solanaceae.');
pq('pp1', 3, 'floral formula', 'The floral formula is', FF_SOL, [FF_FAB, FF_LIL, '⊕ ⚥ K<sub>5</sub> C<sub>5</sub> A<sub>(5)</sub> <u>G</u><sub>2</sub>'], 'Fusion of the sepals and the petals shows as brackets: K(5) C(5), A5 is free of each other and G(2) is bicarpellary and superior.');
pq('pp1', 4, 'families', 'A possible plant is', 'brinjal or tomato', ['pea', 'lily', 'maize'], 'Brinjal and tomato are Solanaceae. Pea is Fabaceae and lily is Liliaceae.');
pass('pp2', 'Passage: two seeds', 'Seed X, soaked and cut open, shows a hard outer coat, a thin inner coat, a scar, and two thick halves that fill the seed. Seed Y has a fused fruit wall and seed coat, a large starch-filled tissue, one shield-shaped structure next to the embryo, and a protein layer around the starch.');
pq('pp2', 3, 'seed', 'Seed X is', 'a dicot, non-endospermic, such as gram', ['a monocot, endospermic, such as maize', 'a dicot, endospermic, such as castor', 'a monocot, non-endospermic'], 'Two thick cotyledons fill the seed, which suggests a non-endospermic dicot. The scar is the hilum.');
pq('pp2', 3, 'seed', 'The shield-shaped structure of seed Y and the protein layer are', 'scutellum and aleurone layer', ['coleoptile and coleorhiza', 'testa and tegmen', 'plumule and radicle'], 'Maize-like monocot grain: scutellum is the single cotyledon, aleurone layer the outer endosperm layer.');
pq('pp2', 4, 'seed', 'Which sheath covers the radicle of seed Y?', 'Coleorhiza', ['Coleoptile', 'Tegmen', 'Scutellum'], 'The coleorhiza covers the radicle. The coleoptile covers the plumule.', 'Coleoptile is the shoot sheath.');

// ---------------------------------------------------------------- Expansion (added 2026-11-22)
// ---- Level 2
mc(2, 'root', 'The region of the root where cells are rapidly elongating is behind', 'the region of meristematic activity', ['the root cap', 'the root hairs', 'the region of maturation'], 'Order from the apex: root cap, meristematic zone, elongation zone, maturation zone.');
mc(2, 'root', 'Which of these roots comes out of the nodes of the stem of a banyan to support the branch?', 'Prop roots', ['Stilt roots', 'Pneumatophores', 'Tap roots'], 'Prop roots hang from branches. Stilt roots arise from lower nodes of maize and sugarcane.');
mc(2, 'root', 'A turnip is a modified', 'tap root', ['stem', 'leaf', 'adventitious root only'], 'The tap root becomes swollen for food storage.');
mc(2, 'stem', 'The underground stem of ginger is called a', 'rhizome', ['tuber', 'bulb', 'corm'], 'Rhizomes are underground stems with nodes and scale leaves.');
mc(2, 'stem', 'Which of these is a stem tendril plant?', 'Cucumber', ['Pea', 'Opuntia', 'Citrus'], 'In cucumber, axillary buds become tendrils. In pea, leaflets become tendrils.');
mc(2, 'leaf', 'The leaf of a monocot has a base that', 'expands into a sheath that clasps the stem', ['forms a pulvinus', 'forms stipules', 'is absent'], 'Grass leaves have a sheathing leaf base.');
mc(2, 'leaf', 'Alternate phyllotaxy is seen in', 'china rose', ['guava', 'Calotropis', 'Alstonia'], 'Guava and Calotropis show opposite phyllotaxy; Alstonia has whorled leaves.');
mc(2, 'inflorescence', 'The inflorescence in which the main axis terminates in a flower is', 'cymose', ['racemose', 'spadix', 'catkin'], 'Cymose is determinate; flowers open basipetally.');
mc(2, 'flower', 'The female reproductive organ of a flower is the', 'gynoecium', ['androecium', 'calyx', 'corolla'], 'The gynoecium is made of carpels.');
mc(2, 'flower', 'The essential whorls of a flower are', 'androecium and gynoecium', ['calyx and corolla', 'calyx and androecium', 'corolla and gynoecium'], 'Calyx and corolla are accessory whorls.');
mc(2, 'fruit', 'The part of the fruit that develops from the ovary wall is the', 'pericarp', ['testa', 'tegmen', 'plumule'], 'The pericarp may have epicarp, mesocarp and endocarp.');
mc(2, 'seed', 'The two protective coats of a seed are', 'testa and tegmen', ['epicarp and endocarp', 'sepal and petal', 'coleoptile and coleorhiza'], 'The outer is testa and the inner is tegmen.');
mc(2, 'families', 'Brinjal, tomato and potato belong to', 'Solanaceae', ['Fabaceae', 'Liliaceae', 'Poaceae'], 'The potato family.');
mc(2, 'families', 'The fruit of the pea family is a', 'legume', ['drupe', 'berry only', 'capsule only'], 'A legume (pod) is typical of Fabaceae.');

// ---- Level 3
mc(3, 'root', 'The root cap protects', 'the delicate root tip as it moves through the soil', ['the root hairs only', 'the stem', 'the leaf'], 'It is a thimble-like structure.');
mc(3, 'root', 'Which of these is NOT a function of roots?', 'Photosynthesis in all plants', ['Absorption of water', 'Anchorage', 'Storage of food'], 'Roots may also give support and conduct. Photosynthesis is a function of leaves and green stems.', 'Some aerial roots are green, but it is not a general function.');
mc(3, 'root', 'Which of these is an adventitious root system?', 'The root system of grasses', ['The root system of mustard', 'The root of gram', 'The root of mango seedling'], 'Grass roots arise from the base of the stem, not from the radicle.');
mc(3, 'root', 'Pneumatophores are modified', 'roots that grow upwards out of the mud in mangrove', ['stems of cacti', 'leaves of Nepenthes', 'petioles of Acacia'], 'They help to get oxygen for respiration.');
mc(3, 'root', 'Carrot, turnip and radish are adaptations for', 'food storage in the tap root', ['support', 'respiration', 'water collection'], 'Carrot is conical, turnip is napiform and radish is fusiform.');
mc(3, 'stem', 'Which of these is a stem?', 'Potato tuber', ['Sweet potato', 'Carrot', 'Radish'], 'Potato has eyes (nodes with buds). Sweet potato is an adventitious root.', 'Both potato and sweet potato are underground but different organs.');
mc(3, 'stem', 'The thorns of Bougainvillea and Citrus are', 'modified axillary buds, that is, stem', ['modified leaves', 'modified roots', 'modified stipules'], 'Stem thorns arise from axillary buds, are woody and protect against herbivores.', 'Thorns are stem; the spines of a cactus are leaf.');
mc(3, 'stem', 'The flattened green stem of Opuntia performs', 'photosynthesis', ['absorption', 'respiration only', 'flowering only'], 'Its leaves are reduced to spines.');
mc(3, 'leaf', 'The leaf of Australian Acacia has', 'a flattened green petiole called phyllode', ['a swollen leaf base', 'tendrils at the tips', 'spines at the nodes'], 'The petiole expands, turns green and makes food.');
mc(3, 'leaf', 'Which of these is a plant with a pinnately compound leaf?', 'Neem', ['Silk cotton', 'Mango', 'Banyan'], 'Neem has leaflets on a common axis (rachis). Silk cotton is palmately compound.');
mc(3, 'leaf', 'Pitcher of Nepenthes is a modification of', 'the leaf', ['the stem', 'the root', 'the stipule'], 'Leaf lamina forms a pitcher to trap insects.');
mc(3, 'leaf', 'Fleshy leaves for food storage are seen in', 'onion and garlic', ['pea and sweet pea', 'cactus', 'Opuntia'], 'Onion and garlic leaves store food.');
mc(3, 'leaf', 'Whorled phyllotaxy is seen in', 'Alstonia', ['Mustard', 'Sunflower', 'Guava'], 'More than two leaves arise at a node.');
mc(3, 'inflorescence', 'In racemose inflorescence, the flowers are arranged', 'in acropetal succession', ['in basipetal succession', 'in a single whorl', 'at the base only'], 'Older flowers are at the base and younger ones at the tip.');
mc(3, 'inflorescence', 'A flower with a short stalk and a leaf-like bract below it is', 'bracteate', ['ebracteate', 'bracteolate only', 'actinomorphic'], 'Bracteate flowers have bracts.');
mc(3, 'flower', 'A flower that cannot be divided into two equal halves by any vertical plane is', 'asymmetric', ['actinomorphic', 'zygomorphic', 'trimerous'], 'Canna is an asymmetric flower.');
mc(3, 'flower', 'A flower in which the gynoecium occupies the highest position and the other parts lie below it is', 'hypogynous', ['epigynous', 'perigynous', 'zygomorphic'], 'Mustard, china rose and brinjal have a superior ovary.');
mc(3, 'flower', 'In epigynous flowers, the ovary is', 'inferior', ['superior', 'half-superior', 'absent'], 'The other whorls arise above the ovary.');
mc(3, 'flower', 'Imbricate aestivation is shown by', 'Cassia', ['Calotropis', 'pea', 'cotton'], 'Pea shows vexillary; cotton shows twisted; Calotropis shows valvate.');
mc(3, 'flower', 'Twisted aestivation is seen in', 'cotton', ['Calotropis', 'Cassia', 'pea'], 'Each petal overlaps the next in one direction; also in china rose and lady finger.');
mc(3, 'flower', 'Epiphyllous stamens are attached to', 'the perianth', ['the petals only', 'the thalamus', 'the carpels'], 'They are found in the lily.');
mc(3, 'flower', 'Stamens are united in several bundles in', 'citrus', ['china rose', 'pea', 'brinjal'], 'This is the polyadelphous condition.');
mc(3, 'flower', 'The pistil of lotus and rose is', 'apocarpous', ['syncarpous', 'epipetalous', 'monoadelphous'], 'The carpels are free.');
mc(3, 'flower', 'Axile placentation is characteristic of', 'tomato', ['pea', 'mustard', 'sunflower'], 'Placenta is axial in a multilocular ovary.');
mc(3, 'flower', 'Basal placentation occurs in', 'sunflower', ['pea', 'tomato', 'Dianthus'], 'The placenta develops at the base of the ovary with a single ovule.');
mc(3, 'flower', 'Free central placentation occurs in', 'Dianthus', ['mustard', 'tomato', 'pea'], 'Ovules are borne on a central axis lacking septa.');
mc(3, 'fruit', 'The fleshy edible part of a mango is the', 'mesocarp', ['epicarp', 'endocarp', 'seed coat'], 'The endocarp is stony.');
mc(3, 'fruit', 'Parthenocarpic fruits like banana develop', 'without fertilisation', ['after double fertilisation', 'from the stem', 'from several flowers'], 'Such fruits are seedless.');
mc(3, 'fruit', 'Which of these is a drupe?', 'Mango', ['Tomato', 'Pea pod', 'Gram pod'], 'Drupes have a stony endocarp.');
mc(3, 'seed', 'The embryo of a dicot seed consists of', 'an embryonal axis and two cotyledons', ['a plumule and one scutellum', 'coleoptile and coleorhiza', 'endosperm and testa'], 'Monocots have one cotyledon.');
mc(3, 'seed', 'The seed of castor is', 'endospermic', ['non-endospermic', 'without a seed coat', 'monocot'], 'Castor is a dicot with an endospermic seed.');
mc(3, 'seed', 'The covering of the radicle in a monocot embryo is the', 'coleorhiza', ['coleoptile', 'scutellum', 'aleurone'], 'The coleoptile covers the plumule.');
mc(3, 'seed', 'Which seed is non-endospermic?', 'Gram', ['Castor', 'Maize', 'Wheat'], 'Gram, bean and pea are non-endospermic. Cereals are endospermic.');
mc(3, 'families', 'Sesbania is used as', 'green manure, in Fabaceae', ['an ornamental, in Solanaceae', 'a medicine, in Liliaceae', 'a fibre, in Fabaceae'], 'It is a Fabaceae plant used as green manure.');
mc(3, 'families', 'Belladonna is a medicinal plant of', 'Solanaceae', ['Fabaceae', 'Liliaceae', 'Poaceae'], 'Atropa belladonna is in the potato family.');
mc(3, 'families', 'Which of these belongs to Liliaceae?', 'Aloe', ['Datura', 'Lupin', 'Petunia'], 'Datura and Petunia belong to Solanaceae; Lupin to Fabaceae.');
mc(3, 'families', 'The stem of Liliaceae is usually', 'an underground bulb, corm or rhizome', ['a tendril', 'a woody trunk', 'a pneumatophore'], 'They are perennial herbs.');

asr(2, 'root', 'The root cap is present at the tip of a root.', 'It protects the tender apical meristem.', 0, 'The cap shields the growing point.');
asr(3, 'root', 'Mangrove plants possess pneumatophores.', 'Pneumatophores help to take in oxygen from the air.', 0, 'The soil is waterlogged and has little oxygen.');
asr(3, 'stem', 'Potato is a root tuber.', 'Potato has eyes.', 3, 'A is false: potato is a stem tuber. R is true: eyes are nodes with axillary buds.');
asr(3, 'leaf', 'Leaves of a monocot show parallel venation.', 'Veins run parallel to each other within the lamina.', 0, 'This is the definition of parallel venation.');
asr(4, 'flower', 'In a pea flower the placentation is marginal.', 'The ovary is monocarpellary and unilocular.', 0, 'A single carpel with the placenta along the ventral suture gives marginal placentation.');
asr(4, 'flower', 'The stamens of brinjal are epipetalous.', 'Epipetalous stamens are attached to the petals.', 0, 'Attachment to the petals is the meaning of epipetalous, so R explains A.');
asr(4, 'seed', 'Maize grain is a fruit.', 'The seed coat is fused with the fruit wall.', 0, 'The grain is a caryopsis where seed coat and pericarp are fused.');
asr(5, 'fruit', 'Coconut is a drupe.', 'Its mesocarp is fibrous and its endocarp is hard.', 0, 'A drupe has a hard endocarp and a fleshy or fibrous mesocarp.');
asr(5, 'floral formula', 'In a floral formula, G with a line above it represents an inferior ovary.', 'G with a line below it represents a superior ovary.', 1, 'Both are the NCERT conventions, but one does not explain the other.', 'Both are true; they are separate symbols.');
asr(5, 'families', 'Fabaceae is a monocot family.', 'The fruit of Fabaceae is a legume.', 3, 'A is false: Fabaceae are dicots. R is true.');

stm(3, 'root', 'Fibrous roots arise from the base of the stem in monocots.', 'The radicle persists as the primary root in dicots.', 0, 'Both are correct.');
stm(3, 'leaf', 'Alternate phyllotaxy has one leaf at each node.', 'Opposite phyllotaxy has two leaves at each node.', 0, 'Both are correct.');
stm(3, 'flower', 'Superior ovary is hypogynous.', 'Inferior ovary is hypogynous.', 2, 'Inferior is epigynous.');
stm(4, 'flower', 'Polyadelphous stamens are in many bundles.', 'Monoadelphous stamens are in two bundles.', 2, 'Monoadelphous means one bundle; diadelphous is two.');
stm(4, 'seed', 'Bean is a non-endospermic seed.', 'Maize is an endospermic seed.', 0, 'Both are correct.');
stm(4, 'fruit', 'Mesocarp of coconut is fibrous.', 'Edible part of coconut is the mesocarp.', 2, 'The edible part is the endosperm (coconut water is free nuclear endosperm).');
stm(4, 'inflorescence', 'Racemose inflorescence has unlimited growth of the main axis.', 'Cymose inflorescence has an unlimited main axis.', 2, 'Cymose is limited.');
mc(4, 'flower', 'Consider: (i) China rose is hypogynous. (ii) Guava is epigynous. (iii) Rose is perigynous. (iv) Mustard is epigynous. How many are correct?', 'Three', ['Two', 'Four', 'One'], '(i), (ii), (iii) are right. Mustard is hypogynous.', null, 'statements');
mc(4, 'stem', 'Consider: (i) Ginger is a rhizome. (ii) Potato is a stem tuber. (iii) Carrot is a stem. (iv) Opuntia stem is flattened. How many are correct?', 'Three', ['Two', 'Four', 'One'], '(i), (ii), (iv) are right. Carrot is a modified tap root.', null, 'statements');
mc(5, 'leaf', 'Consider: (i) Pea tendrils are leaf modifications. (ii) Cucumber tendrils are stem modifications. (iii) Cactus spines are leaf modifications. (iv) Citrus thorns are leaf modifications. (v) Nepenthes pitcher is a leaf modification. How many are correct?', 'Four', ['Three', 'Five', 'Two'], '(i), (ii), (iii), (v) are right. Citrus thorns are stem.', 'Thorns are stems and spines are leaves.', 'statements');
mc(5, 'families', 'Consider: (i) Fabaceae: papilionaceous corolla. (ii) Solanaceae: epipetalous stamens. (iii) Liliaceae: six tepals. (iv) Fabaceae: axile placentation. (v) Solanaceae: bicarpellary ovary. How many are correct?', 'Four', ['Three', 'Five', 'Two'], '(i), (ii), (iii), (v) are right. Fabaceae has marginal placentation.', null, 'statements');
stm(5, 'seed', 'The aleurone layer is found in the maize grain.', 'The aleurone layer is rich in starch.', 2, 'It is rich in protein.');

// ---- Matches
match(2, 'root', 'pmx1', 'Root and plant', ['A. Prop root', 'B. Stilt root', 'C. Pneumatophore', 'D. Tap root storage'], ['p. Rhizophora', 'q. Banyan', 'r. Maize', 's. Carrot'], 'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-p, B-r, C-q, D-s'], 'Banyan: prop roots. Maize: stilt roots. Rhizophora: pneumatophores. Carrot: storage tap root.');
match(3, 'stem', 'pmx2', 'Modified organ and plant', ['A. Stem tendril', 'B. Stem thorn', 'C. Leaf tendril', 'D. Rhizome'], ['p. Pea', 'q. Cucumber', 'r. Citrus', 's. Ginger'], 'A-q, B-r, C-p, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s'], 'Cucumber: stem tendril. Citrus: thorn. Pea: leaf tendril. Ginger: rhizome.');
match(3, 'flower', 'pmx3', 'Position of ovary and example', ['A. Hypogynous', 'B. Perigynous', 'C. Epigynous', 'D. Zygomorphic'], ['p. Mustard', 'q. Rose', 'r. Guava', 's. Pea'], 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'], 'Mustard: hypogynous. Rose: perigynous. Guava: epigynous. Pea: zygomorphic.');
match(3, 'flower', 'pmx4', 'Aestivation and example', ['A. Valvate', 'B. Twisted', 'C. Imbricate', 'D. Vexillary'], ['p. Cassia', 'q. Pea', 'r. Calotropis', 's. China rose'], 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'], 'Calotropis: valvate. China rose: twisted. Cassia: imbricate. Pea: vexillary.');
match(4, 'flower', 'pmx5', 'Placentation and plant', ['A. Marginal', 'B. Axile', 'C. Parietal', 'D. Basal'], ['p. Mustard', 'q. Pea', 'r. Sunflower', 's. Lemon'], 'A-q, B-s, C-p, D-r', ['A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p', 'A-p, B-s, C-q, D-r'], 'Pea: marginal. Lemon: axile. Mustard: parietal. Sunflower: basal.');
match(4, 'flower', 'pmx6', 'Androecium and example', ['A. Monoadelphous', 'B. Diadelphous', 'C. Polyadelphous', 'D. Epipetalous'], ['p. Pea', 'q. China rose', 'r. Citrus', 's. Brinjal'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'], 'China rose has one bundle, pea two, citrus many; brinjal stamens are on the petals.');
match(4, 'seed', 'pmx7', 'Seed part and function or position', ['A. Scutellum', 'B. Coleoptile', 'C. Coleorhiza', 'D. Aleurone layer'], ['p. Covers the radicle', 'q. Covers the plumule', 'r. Single cotyledon of a monocot', 's. Protein-rich layer of endosperm'], 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s', 'A-r, B-q, C-s, D-p'], 'Scutellum is the single cotyledon; coleoptile covers the plumule; coleorhiza covers the radicle; aleurone is protein rich.');
match(4, 'inflorescence', 'pmx8', 'Type and feature', ['A. Racemose', 'B. Cymose', 'C. Head or capitulum', 'D. Spadix'], ['p. Main axis terminates in a flower', 'q. Acropetal succession of flowers', 'r. Sunflower', 's. Fleshy axis, e.g. banana'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'], 'Racemose is acropetal; cymose terminates in a flower; capitulum e.g. sunflower; spadix is a fleshy axis.');
match(5, 'floral formula', 'pmx9', 'Family and formula part', ['A. Fabaceae', 'B. Solanaceae', 'C. Liliaceae', 'D. Fabaceae ovary'], ['p. P(3+3)', 'q. K(5) C(5)', 'r. K(5) C 1+2+(2)', 's. G1 superior'], 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-p, B-q, C-r, D-s'], 'Fabaceae: K(5) C 1+2+(2). Solanaceae: K(5) C(5). Liliaceae: P(3+3). Fabaceae ovary: one carpel superior.');
match(5, 'families', 'pmx10', 'Plant and use', ['A. Colchicum', 'B. Atropa', 'C. Sesbania', 'D. Petunia'], ['p. Source of colchicine', 'q. Belladonna, medicinal', 'r. Green manure', 's. Ornamental'], 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'], 'Colchicum: colchicine; Atropa: belladonna; Sesbania: green manure; Petunia: ornamental.');

// ---- Passages
pass('pmx11', 'Passage: a flower dissected', 'A flower has five fused sepals and five fused petals. The five stamens are attached to the petals. The ovary is superior and has two chambers with swollen placenta bearing many ovules. The fruit is a berry. The flower is radially symmetrical and bisexual.');
pq('pmx11', 3, 'families', 'The flower is most probably of', 'Solanaceae', ['Fabaceae', 'Liliaceae', 'Poaceae'], 'Epipetalous stamens and a bilocular superior ovary with swollen placenta are features of Solanaceae.');
pq('pmx11', 4, 'floral formula', 'Its floral formula would be', '⊕ ⚥ K(5) C(5) A5 G(2)', ['% ⚥ K(5) C 1+2+(2) A(9)+1 G1', 'Br ⊕ ⚥ P(3+3) A3+3 G(3)', '⊕ ⚥ K5 C5 A10 G5'], 'It is actinomorphic, bisexual, with five fused sepals and petals, five stamens and two fused carpels.');
pq('pmx11', 4, 'flower', 'The stamens are described as', 'epipetalous', ['epiphyllous', 'diadelphous', 'polyadelphous'], 'Attached to the petals.');
pass('pmx12', 'Passage: two seeds', 'Seed M is kidney-shaped with a hilum and a micropyle. Soaked, its coat peels off easily to show two fleshy halves and no extra food tissue. Seed N is a small grain whose coat is fused with the fruit wall. It has a large starchy tissue and a shield-shaped structure at the side.');
pq('pmx12', 3, 'seed', 'Seed M is', 'a dicot, non-endospermic', ['a monocot, endospermic', 'a dicot, endospermic', 'a monocot, non-endospermic'], 'Two cotyledons with no endosperm.');
pq('pmx12', 4, 'seed', 'The shield-shaped structure in seed N is the', 'scutellum', ['coleoptile', 'testa', 'hilum'], 'It is the single cotyledon of a monocot.');
pq('pmx12', 5, 'seed', 'Which statement is true?', 'Seed N is a caryopsis, a fruit with a fused seed coat and pericarp', ['Seed M is a monocot', 'Seed N has no endosperm', 'Seed N has two cotyledons'], 'Maize or wheat grain is such a fruit.');
pass('pmx13', 'Passage: leaves of three plants', 'Plant A has leaves with a swollen base at the point of attachment. Plant B has leaves that arise one at each node. Plant C has narrow leaves whose bases form a sheath around the stem.');
pq('pmx13', 3, 'leaf', 'The swollen leaf base of A is', 'a pulvinus', ['a stipule', 'a phyllode', 'a tendril'], 'It is found in leguminous plants.');
pq('pmx13', 4, 'phyllotaxy', 'Plant B shows', 'alternate phyllotaxy', ['opposite phyllotaxy', 'whorled phyllotaxy', 'no phyllotaxy'], 'One leaf per node.');
pq('pmx13', 5, 'leaf', 'Which statement about C is likely?', 'It is a monocot with parallel venation', ['It is a dicot with reticulate venation', 'It is a pteridophyte', 'It has a pulvinus at its leaf base'], 'A sheathing leaf base points to a monocot, with parallel veins.');

// ---- Level 4
mc(4, 'root', 'Which of the following correctly lists the zones of a root from the tip?', 'Root cap, meristematic, elongation, maturation', ['Root cap, elongation, meristematic, maturation', 'Meristematic, root cap, maturation, elongation', 'Maturation, elongation, meristematic, root cap'], 'Cells divide in the meristematic zone, elongate, then mature with root hairs.');
mc(4, 'root', 'Which of these roots is a modified adventitious root?', 'Sweet potato', ['Carrot', 'Turnip', 'Radish'], 'Sweet potato is a modified adventitious root; the others are tap roots.');
mc(4, 'stem', 'In Opuntia the spines are modified', 'leaves', ['stems', 'roots', 'stipules only'], 'The stem is flattened and green and does the photosynthesis; the leaves are reduced to spines.');
mc(4, 'stem', 'Which of these helps a plant to climb by stem tendrils?', 'Watermelon', ['Pea', 'Lathyrus', 'Sweet pea'], 'Pea and sweet pea use leaf tendrils.');
mc(4, 'leaf', 'In peas the leaflets are modified into tendrils to', 'climb', ['store food', 'fix nitrogen', 'trap insects'], 'This leaf modification helps climbing.');
mc(4, 'leaf', 'Which of these is correct about a pulvinus?', 'It is the swollen leaf base in legumes', ['It is the leaf apex in monocots', 'It is a stipule', 'It is an ovule'], 'Pulvinus is the swollen base of the leaf in Fabaceae.');
mc(4, 'inflorescence', 'Which of the following is NOT a racemose inflorescence?', 'Monochasial cyme', ['Raceme', 'Spike', 'Catkin'], 'Cymose types include uniparous, biparous and multiparous cymes.');
mc(4, 'flower', 'The flowers of sunflower are', 'borne on a head or capitulum with ray and disc florets', ['borne singly', 'borne on a spadix', 'in a spike only'], 'Ray florets are zygomorphic and disc florets are actinomorphic.');
mc(4, 'flower', 'The pea flower has', 'a standard, two wings and two fused keel petals', ['three sepals only', 'a single large petal', 'six free petals'], 'This is the papilionaceous corolla.');
mc(4, 'flower', 'In a syncarpous gynoecium the carpels are', 'fused', ['free', 'absent', 'only one'], 'As in mustard and tomato.');
mc(4, 'flower', 'Axile placentation needs an ovary that is', 'multilocular, with septa', ['unilocular', 'monocarpellary', 'without septa'], 'Tomato, lemon and china rose have several chambers and a central axis.');
mc(4, 'fruit', 'In a drupe like mango, the stony part around the seed is', 'the endocarp', ['the epicarp', 'the mesocarp', 'the testa'], 'The endocarp is hard and stony.');
mc(4, 'fruit', 'The coconut shell is the', 'endocarp', ['epicarp', 'mesocarp', 'testa'], 'The mesocarp is fibrous (coir).');
mc(4, 'seed', 'The seed coat has two layers called', 'testa and tegmen', ['coleoptile and coleorhiza', 'epicarp and mesocarp', 'plumule and radicle'], 'The testa is outer.');
mc(4, 'seed', 'The embryonal axis of a dicot seed above the cotyledon is called', 'epicotyl ending in the plumule', ['hypocotyl ending in the radicle', 'scutellum', 'aleurone layer'], 'Hypocotyl lies below the cotyledons.');
mc(4, 'families', 'The root nodules in plants of Fabaceae contain', 'nitrogen-fixing bacteria', ['mycorrhiza', 'cyanobacteria only', 'algae'], 'The bacteria are Rhizobium.');
mc(4, 'families', 'The ovary of Fabaceae has', 'one chamber with many ovules and marginal placentation', ['two chambers with swollen placenta', 'three chambers with axile placentation', 'one chamber, basal placenta'], 'Compare with Solanaceae and Liliaceae.');
mc(4, 'families', 'The ovary of Liliaceae is', 'superior and trilocular with axile placentation', ['inferior with marginal placentation', 'superior and unilocular', 'half-inferior'], 'Liliaceae has a trilocular superior ovary.');
mc(4, 'floral formula', 'In a floral formula, K stands for', 'calyx', ['corolla', 'androecium', 'gynoecium'], 'K comes from the German Kelch.');
mc(4, 'floral formula', 'In the floral formula the symbol % indicates', 'a zygomorphic flower', ['an actinomorphic flower', 'a unisexual flower', 'a bracteate flower'], 'Zygomorphic is shown by %; actinomorphic by ⊕.');
mc(4, 'floral formula', 'A line drawn between two whorls in a floral formula shows', 'adhesion of whorls', ['cohesion within a whorl', 'a bracteate flower', 'a unisexual flower'], 'Brackets show cohesion (fusion within a whorl); a line shows adhesion.');
mc(4, 'floral formula', 'The symbol ♀ indicates', 'a female (pistillate) flower', ['a bisexual flower', 'a male flower', 'a neutral flower'], 'The symbol ⚥ shows bisexual.');
mc(4, 'phyllotaxy', 'In a plant the leaves arise in a whorl of five at each node. This is called', 'whorled', ['alternate', 'opposite', 'imbricate'], 'More than two leaves per node.');

// ---- Level 5
mc(5, 'root', 'Which of these is correct for a monocot such as wheat?', 'Fibrous root system arising from the base of the stem', ['Tap root system with a persistent radicle', 'Adventitious roots with reticulate venation', 'A pneumatophore'], 'Monocots typically have fibrous roots; the radicle is short-lived.');
mc(5, 'stem', 'Which pair has the same function but a different origin?', 'Stem tendril of cucumber and leaf tendril of pea', ['Thorn of Citrus and thorn of Bougainvillea', 'Rhizome of ginger and rhizome of turmeric', 'Tuber of potato and tuber of sweet potato'], 'Both tendrils help climbing but one is stem, the other leaf.');
mc(5, 'stem', 'Which of these is correct for thorns and spines?', 'Thorns are stem, spines are leaf modifications', ['Thorns are leaf, spines are stem', 'Both are root', 'Both are leaf'], 'A thorn arises from an axillary bud; the cactus spine is a leaf.');
mc(5, 'flower', 'A flower with the gynoecium of a single carpel and the stamens in two bundles is typical of', 'pea', ['china rose', 'mustard', 'lily'], 'Pea has diadelphous stamens and a monocarpellary ovary.');
mc(5, 'flower', 'Which placentation is found in a monocarpellary, unilocular ovary?', 'Marginal', ['Axile', 'Free central', 'Parietal'], 'A single carpel gives marginal placentation as in pea. Parietal needs more than one carpel.', 'Parietal also has one chamber, but needs fused carpels.');
mc(5, 'fruit', 'A fruit in which the thalamus also contributes, as in apple, is called', 'a false fruit', ['a true fruit', 'a parthenocarpic fruit', 'a drupe'], 'In most plants only the ovary becomes the fruit; in apple, strawberry and cashew the thalamus also takes part.');
mc(5, 'seed', 'In which of these does the coleoptile protect the plumule?', 'Maize', ['Castor', 'Gram', 'Bean'], 'A coleoptile is found in monocots.');
mc(5, 'seed', 'A seed with two cotyledons and abundant endosperm is', 'castor', ['pea', 'gram', 'bean'], 'Castor is an endospermic dicot.');
mc(5, 'families', 'Which of these is NOT correct for Solanaceae?', 'Fruit is a legume', ['Stamens are epipetalous', 'Ovary is superior', 'Seeds are endospermous'], 'Fruit is a berry or capsule.');
mc(5, 'families', 'A plant with underground bulb, parallel venation, trimerous flowers and a capsule fruit most probably belongs to', 'Liliaceae', ['Solanaceae', 'Fabaceae', 'Poaceae'], 'These are the key features of lily family.');
export default { topic: 'plant-morphology', groups, items, gens: [] };
