import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [2, 0, 3, 1];
const PFX = 'pg';
const nid = () => `${PFX}-${String(++n).padStart(3, '0')}`;
const ex = () => ['neet'];
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: ex(level), sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function ms(level, sub, q, options, answer, sol, trap) {
  items.push({ id: nid(), type: 'msq', level, format: 'multi', exams: ex(level), sub, q, options, answer, sol, ...(trap ? { trap } : {}) });
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
mc(1, 'growth', 'Growth in higher plants is called indeterminate because', 'meristems keep dividing throughout the life of the plant', ['the plant stops growing after flowering', 'growth occurs only in leaves', 'the number of cells never changes'], 'Plants have meristems (open form of growth) that add new cells throughout life, so growth is indeterminate. Most animals stop growing at adulthood.');
mc(1, 'growth', 'Primary growth in a plant (increase in length) takes place at the', 'apical meristems of root and shoot', ['vascular cambium', 'cork cambium', 'intercalary only in dicots'], 'Apical meristems at the root and shoot tips add length (primary growth). The vascular cambium and cork cambium add thickness (secondary growth).');
mc(1, 'phases of growth', 'The region of the root tip where cells have dense protoplasm and divide rapidly is the', 'meristematic zone', ['elongation zone', 'maturation zone', 'root cap only'], 'In the meristematic phase cells are small, with large nuclei, thin walls and rich protoplasm, and they divide actively.');
mc(1, 'PGR', 'Which plant growth regulator is a gas?', 'Ethylene', ['Auxin', 'Gibberellin', 'Cytokinin'], 'Ethylene (C<sub>2</sub>H<sub>4</sub>) is the only gaseous plant growth regulator. The others are non-gaseous organic molecules.');
mc(1, 'PGR discovery', 'F.W. Went isolated auxin from the tips of the coleoptiles of', 'oat seedlings', ['rice seedlings', 'pea roots', 'tobacco callus'], 'Went worked on oat (<i>Avena</i>) coleoptile tips, following the Darwins\' earlier work on canary grass. Auxin comes from the Greek word "auxein", to grow.');
mc(1, 'PGR discovery', 'The bakanae (foolish seedling) disease of rice led to the discovery of', 'gibberellins', ['auxins', 'cytokinins', 'abscisic acid'], 'The fungus <i>Gibberella fujikuroi</i> makes a substance that makes rice seedlings grow too tall and weak. This led to the isolation of gibberellic acid (GA<sub>3</sub>).');
mc(1, 'PGR discovery', 'Kinetin, the first cytokinin, was obtained by Skoog and Miller from', 'autoclaved herring sperm DNA', ['human urine', 'coconut milk', 'ripening bananas'], 'Kinetin is an adenine derivative made when DNA is autoclaved (heated under pressure). Zeatin was isolated from corn kernels and coconut milk.');
mc(1, 'PGR functions', 'Which plant growth regulator is called the stress hormone?', 'Abscisic acid', ['Auxin', 'Gibberellin', 'Cytokinin'], 'ABA helps the plant tolerate stresses such as drought. It closes stomata and promotes seed dormancy.');
mc(1, 'PGR functions', 'Fruit ripening is hastened mainly by', 'ethylene', ['auxin', 'gibberellin', 'cytokinin'], 'Ethylene is made in large quantities by ripening fruits and rapidly speeds up the process.');
mc(1, 'PGR functions', 'Which PGR mainly promotes cell division (cytokinesis)?', 'Cytokinin', ['Abscisic acid', 'Ethylene', 'Auxin alone'], 'Cytokinins (from "cytokinesis") are made where cell division is rapid: root apices, young fruits and shoot buds.');
mc(1, 'PGR functions', 'Bolting (rapid elongation of the internodes of a rosette plant before flowering) is caused by', 'gibberellins', ['abscisic acid', 'ethylene', 'cytokinins'], 'Gibberellins promote bolting in cabbage, beet and other rosette plants by making the stem axis elongate.');
mc(1, 'PGR discovery', 'Charles Darwin and Francis Darwin observed that the coleoptile of canary grass bends towards light. This response is', 'phototropism', ['geotropism', 'thigmotropism', 'hydrotropism'], 'They saw that the tip perceives light and some influence moves down to make the lower part bend. The influence was later identified as auxin.');
mc(1, 'PGR', 'Which one of the following is a synthetic auxin?', '2,4-D', ['IAA', 'Zeatin', 'GA<sub>3</sub>'], '2,4-Dichlorophenoxyacetic acid (2,4-D) and NAA are synthetic auxins. IAA is the natural one; zeatin is a cytokinin and GA<sub>3</sub> is a gibberellin.');
mc(1, 'differentiation', 'When fully differentiated cells lose their specialisation and regain the power to divide, the process is called', 'dedifferentiation', ['redifferentiation', 'differentiation', 'determination'], 'Dedifferentiation: mature cells go back to a meristem-like state. Interfascicular cambium and cork cambium form this way.');
mc(1, 'plasticity', 'Different leaf shapes in juvenile and mature cotton plants are an example of', 'heterophylly', ['phyllotaxy', 'photoperiodism', 'apical dominance'], 'Heterophylly (leaves of different shapes in the same plant) is seen in cotton, coriander and larkspur, and is an example of plasticity.');

// ---------------------------------------------------------------- Level 2
mc(2, 'phases of growth', 'The three phases of growth in a plant cell, in order, are', 'meristematic, elongation, maturation', ['elongation, meristematic, maturation', 'maturation, elongation, meristematic', 'lag, log, stationary'], 'Cells first divide (meristematic phase), then enlarge (elongation phase), then reach final size with wall thickening and other changes (maturation). Lag, log and stationary are phases of the sigmoid growth curve of a population.', 'Do not mix the three phases of a cell with the three phases of the sigmoid curve.');
mc(2, 'phases of growth', 'Increased vacuolation, cell enlargement and new cell wall deposition are characteristic of the', 'elongation phase', ['meristematic phase', 'maturation phase', 'lag phase'], 'In the zone of elongation, cells grow in size by taking in water (vacuoles enlarge) and laying down new wall material.');
mc(2, 'growth rate', 'In arithmetic growth, after each mitotic division of a meristematic cell,', 'only one daughter cell continues to divide while the other differentiates', ['both daughter cells continue to divide', 'both daughter cells differentiate', 'the cell number doubles each time'], 'This produces a straight-line (linear) increase in length, as in a root tip growing at a constant rate. When both daughters keep dividing, growth is geometric.');
mc(2, 'growth rate', 'In the equation W<sub>1</sub> = W<sub>0</sub> e<sup>rt</sup> for geometric growth, r stands for', 'the relative growth rate', ['the absolute growth rate', 'the number of cells', 'the time of growth'], 'W<sub>1</sub> is the final size, W<sub>0</sub> the initial size, r the relative growth rate (efficiency index), t the time and e the base of natural logarithms.');
mc(2, 'growth rate', 'A plot of growth against time in a natural environment is usually', 'S-shaped (sigmoid)', ['a straight line', 'a horizontal line', 'a downward curve all the time'], 'Growth starts with a lag phase, then rises fast (log or exponential phase), and finally levels off (stationary phase) as nutrients become limiting.');
mc(2, 'growth conditions', 'Which of these is NOT listed as a condition needed for plant growth?', 'Ultraviolet radiation', ['Water', 'Oxygen', 'Nutrients'], 'Growth needs water, oxygen, nutrients and a suitable temperature. Light and gravity act as environmental signals. UV radiation is not a requirement.');
mc(2, 'growth conditions', 'Water is needed for growth chiefly because it', 'brings about cell enlargement through turgidity and provides a medium for enzyme action', ['is a mineral nutrient', 'is a source of nitrogen', 'is used to make lignin only'], 'Cell enlargement during the elongation phase is driven by water uptake (turgor). Water is also the medium for the enzymatic reactions needed for growth.');
mc(2, 'differentiation', 'Cork cambium arises from', 'dedifferentiation of mature cortical cells', ['redifferentiation of xylem', 'the root apical meristem', 'the endodermis only'], 'Fully differentiated cortex cells regain the ability to divide and form the cork cambium (phellogen). This is dedifferentiation.');
mc(2, 'differentiation', 'Interfascicular cambium in a dicot stem is formed by', 'dedifferentiation of parenchyma between vascular bundles', ['apical meristem of the shoot', 'differentiation of xylem vessels', 'redifferentiation of phloem'], 'Parenchyma cells in the medullary rays between the bundles become meristematic and form interfascicular cambium. Together with the fascicular cambium it forms a ring of cambium.');
mc(2, 'PGR functions', 'Cutting off the shoot tip of a hedge plant makes it bushy because', 'the apical dominance caused by auxin is removed and the lateral buds grow', ['more auxin is made in lateral buds', 'ethylene is lost', 'ABA is increased'], 'Auxin from the apical bud suppresses the lateral buds. When the tip is removed, the suppression ends and side shoots grow. This trick is used for hedges.');
mc(2, 'PGR functions', '2,4-D is used by farmers to kill', 'dicot weeds in a cereal field', ['monocot crops', 'all plants alike', 'fungi in the soil'], '2,4-D is an auxin-type herbicide. It kills dicotyledonous weeds but does not harm mature monocot crops such as wheat and maize.');
mc(2, 'PGR functions', 'Seedless tomatoes can be produced by spraying flowers with', 'auxins', ['abscisic acid', 'ethylene', 'cytokinin only'], 'Auxins induce parthenocarpy: fruit development without fertilisation, as in tomato.');
mc(2, 'PGR functions', 'Stem cuttings root faster when they are treated with', 'auxins such as IBA or NAA', ['abscisic acid', 'ethylene alone', 'gibberellins only'], 'Auxin promotes root initiation at the cut base of stem cuttings, which is why commercial rooting powders contain IBA or NAA.');
mc(2, 'PGR functions', 'Spraying sugarcane with gibberellins', 'increases the length of the stem and so the yield of sugar', ['closes its stomata', 'causes leaf fall', 'prevents seed germination'], 'Gibberellins make the internodes longer. This raises the yield of sugarcane by as much as 20 tonnes per acre.');
mc(2, 'PGR functions', 'In the brewing industry, which PGR is used to speed up the malting process?', 'Gibberellin', ['Ethylene', 'Cytokinin', 'Abscisic acid'], 'GA triggers the production of enzymes (such as amylase) in germinating barley, which speeds up malting.');
mc(2, 'PGR functions', 'Cytokinins delay leaf senescence by', 'promoting the mobilisation of nutrients to the leaves', ['closing the stomata', 'making the leaves heavier', 'increasing ethylene'], 'Cytokinins keep nutrients moving into the leaf, so the leaves stay green longer. Ethylene and ABA promote senescence.');
mc(2, 'PGR functions', 'Ethephon is a chemical that, when taken up by the plant, releases', 'ethylene', ['IAA', 'gibberellic acid', 'zeatin'], 'Ethephon is the most widely used source of ethylene. It hastens ripening of tomatoes and apples and accelerates fruit and flower abscission.');
mc(2, 'PGR functions', 'Apical hook formation in dicot seedlings is influenced by', 'ethylene', ['gibberellins', 'cytokinins', 'abscisic acid'], 'Ethylene influences the horizontal growth of seedlings, swelling of the axis, and the apical hook of dicot seedlings.');
mc(2, 'PGR functions', 'The hormone that acts as an antagonist to gibberellins in seed dormancy is', 'abscisic acid', ['ethylene', 'IAA', 'zeatin'], 'ABA induces dormancy in seeds and helps them withstand desiccation. Gibberellins break dormancy. In most situations ABA acts opposite to GA.');
mc(2, 'PGR functions', 'Which hormone helps deep-water rice plants to keep their leaves above the water?', 'Ethylene', ['Abscisic acid', 'Auxin alone', 'Cytokinin'], 'Ethylene promotes rapid elongation of internodes and petioles in deep-water rice, keeping upper leaves above water.');
mc(2, 'PGR', 'Match the correct chemical nature: kinetin is a', 'derivative of adenine', ['derivative of carotenoids', 'terpene', 'indole compound'], 'Kinetin and zeatin are adenine derivatives. IAA is an indole compound, ABA is a carotenoid derivative and gibberellic acid is a terpene.');
mc(2, 'PGR', 'Abscisic acid is chemically a', 'derivative of carotenoids', ['derivative of adenine', 'indole compound', 'gaseous hydrocarbon'], 'ABA is a carotenoid derivative. Auxin is indole based, cytokinin is adenine based, GA is a terpene and ethylene is a gas.');
mc(2, 'growth', 'Which pair correctly names the parameters used to measure growth in a pollen tube and in a root apical meristem?', 'Length and cell number', ['Area and volume', 'Fresh weight and dry weight', 'Volume and area'], 'Growth can be measured as increase in cell number, length, area, volume, fresh weight or dry weight. Pollen tube growth is measured in length, and root meristem growth in cell numbers.');

// ---------------------------------------------------------------- Level 3
mc(3, 'growth rate', 'Which statement about geometric growth is correct?', 'Both daughter cells keep dividing and the growth rate increases with time', ['Only one daughter cell keeps dividing', 'It gives a straight line when size is plotted against time', 'It continues indefinitely in nature'], 'In geometric (exponential) growth both daughters divide, so size rises faster and faster. It gives a J-shaped curve at first and cannot go on in nature because nutrients become limiting; then the stationary phase begins.', 'An S-shaped curve is the overall shape; the middle part is exponential.');
mc(3, 'growth rate', 'The relative growth rate of an organ is', 'growth per unit time expressed per unit of the initial size', ['the total increase in size in the unit time', 'the size reached at the end of growth', 'the number of cells produced per hour'], 'Absolute growth rate = total growth per unit time. Relative growth rate = growth per unit time on a common basis, such as per unit initial size. It lets us compare organs of different sizes.', 'Absolute and relative are very commonly swapped.');
mc(3, 'growth rate', 'The lag phase of the sigmoid growth curve is a period of', 'slow growth while the organism adjusts and begins to grow', ['fastest growth', 'no change because the nutrients are exhausted', 'death of cells'], 'In the lag phase growth is slow. Then the log phase has rapid exponential growth. In the stationary phase the growth rate falls to zero (limited nutrients) and then senescence starts.');
mc(3, 'growth conditions', 'Which of the following correctly describes the effect of temperature on plant growth?', 'Each plant has an optimum range of temperature for growth', ['Growth is faster the higher the temperature', 'Growth is unaffected by temperature', 'Only roots respond to temperature'], 'Enzymes controlling growth work best in an optimum temperature range. Beyond the limit of the range, growth falls.');
mc(3, 'growth conditions', 'Oxygen is required for plant growth because it', 'is needed for aerobic respiration which provides metabolic energy', ['is a source of nitrogen', 'forms cellulose', 'makes the cells turgid'], 'Growth is an energy-requiring process. The energy comes from respiration, and most plants need oxygen for that.');
mc(3, 'differentiation', 'Which of the following describes differentiation of a tracheary element?', 'The cell loses its protoplasm and develops a thick, lignocellulosic secondary wall', ['The cell becomes meristematic', 'The cell loses its cell wall', 'The cell wall becomes thinner'], 'Tracheary elements (vessels and tracheids) become dead, hollow, thick-walled, lignified conducting cells. This is an example of differentiation.');
mc(3, 'differentiation', 'The cells formed from the dedifferentiated meristems, which lose the ability to divide and mature to perform specific functions, show', 'redifferentiation', ['dedifferentiation', 'plasmolysis', 'determination of tissue'], 'Redifferentiation is the second change: the dedifferentiated cells divide, and their daughters again differentiate and mature (for example secondary xylem formed by vascular cambium).', 'Dedifferentiation gains division ability; redifferentiation loses it.');
mc(3, 'differentiation', 'Which sequence correctly represents the order of events leading to formation of secondary tissues in a stem?', 'Differentiated parenchyma &rarr; dedifferentiation &rarr; cambium &rarr; redifferentiation &rarr; secondary tissue', ['Cambium &rarr; differentiation &rarr; dedifferentiation &rarr; parenchyma', 'Secondary tissue &rarr; redifferentiation &rarr; dedifferentiation &rarr; cambium', 'Parenchyma &rarr; redifferentiation &rarr; dedifferentiation &rarr; cambium'], 'Permanent cells regain division ability (dedifferentiation) and form cambium; cambial derivatives lose division ability and mature into secondary tissues (redifferentiation).');
mc(3, 'development', 'Development in a plant is best defined as', 'the sum of growth and differentiation', ['only the increase in size', 'only the formation of flowers', 'only the loss of cells'], 'Development includes all the changes in the life of a plant, from seed germination to senescence, that is, growth plus differentiation.');
mc(3, 'plasticity', 'Plasticity in plant development means', 'plants can form different structures in response to environment or life phase', ['plants cannot change their shape', 'the cells become plastic-like', 'plants stop growing in winter'], 'Heterophylly in cotton, coriander and larkspur (juvenile and mature leaves differ), and in buttercup (leaves in air differ from those in water), is plasticity.');
mc(3, 'plasticity', 'The leaves of buttercup differ in shape when grown in water and in air. This is an example of', 'heterophylly due to environment', ['heterophylly due to age', 'dedifferentiation', 'apical dominance'], 'The environment (water or air) decides the leaf form in buttercup. In cotton and coriander, the stage of life (juvenile or mature) decides it. Both are plasticity.', 'Both heterophylly types are examples of plasticity.');
mc(3, 'PGR', 'Which pair of plant growth regulators is primarily growth promoters?', 'Auxins and gibberellins', ['Abscisic acid and ethylene', 'Ethylene and cytokinin', 'Abscisic acid and auxin'], 'Auxins, gibberellins and cytokinins are growth promoters. ABA is a growth inhibitor; ethylene is mostly an inhibitor of growth too.');
mc(3, 'PGR functions', 'Auxins help to prevent early fruit and leaf drop. They also', 'promote abscission of older, mature leaves and fruits', ['prevent abscission of all leaves', 'cause leaf fall in young leaves only', 'have no role in abscission'], 'Auxin has a double role: it prevents fruit and leaf drop at early stages, but promotes abscission of older mature leaves and fruits.');
mc(3, 'PGR functions', 'Which is the most accurate statement about gibberellins?', 'They are all acidic and over 100 types are known from fungi and higher plants', ['They are all neutral gases', 'Only GA<sub>3</sub> exists', 'They are made only by roots'], 'More than 100 GAs (GA<sub>1</sub>, GA<sub>2</sub>, GA<sub>3</sub> ...) are known. GA<sub>3</sub> (gibberellic acid) was the first discovered and the most studied. All GAs are acidic.');
mc(3, 'PGR functions', 'Gibberellin treatment of apples is useful because it', 'delays senescence, so fruits stay on the tree longer, and improves shape', ['hastens ripening', 'causes premature drop', 'stops flower formation'], 'GAs delay senescence, so fruits can be left on the tree longer for the market, and make apples more elongated and better shaped.');
mc(3, 'PGR functions', 'Spraying GA on juvenile conifers', 'hastens the maturity period, leading to early seed production', ['delays flowering', 'causes bud dormancy', 'makes the needles fall'], 'GA hastens maturation of juvenile conifers, so seed is produced earlier.');
mc(3, 'PGR functions', 'Cytokinins help to overcome apical dominance. Therefore', 'lateral buds grow when cytokinin is applied', ['lateral buds die', 'apical buds elongate faster', 'leaves fall'], 'Cytokinin counters the inhibition of lateral buds by auxin from the apex, so lateral shoots develop.');
mc(3, 'PGR functions', 'Which of the following is NOT a function of ethylene?', 'Promotes closure of stomata under water stress', ['Promotes fruit ripening', 'Promotes root hair formation', 'Breaks dormancy in potato tubers'], 'ABA, not ethylene, closes stomata in drought. Ethylene ripens fruit, promotes root growth and root hairs, and breaks bud and seed dormancy (peanut seeds, potato tubers).');
mc(3, 'PGR functions', 'Spraying cucumber plants with ethephon', 'promotes the formation of female flowers', ['promotes only male flowers', 'prevents all flowering', 'makes the fruit seedless'], 'Ethylene promotes female flowers in cucumber, which prevents self-pollination in the crop.');
mc(3, 'PGR functions', 'Ethylene raises the rate of respiration during ripening. This increase is known as', 'the respiratory climacteric', ['photorespiration', 'the Pasteur effect', 'the Emerson effect'], 'In climacteric fruits (apple, banana, tomato), a burst of respiration and ethylene accompanies ripening.', 'Mixed with respiration.');
mc(3, 'PGR functions', 'ABA helps seeds withstand desiccation by', 'inducing dormancy during seed development and maturation', ['promoting germination', 'breaking dormancy', 'increasing cell elongation'], 'ABA plays a role in seed development, maturation and dormancy and so helps seeds to survive dry conditions.');
mc(3, 'PGR functions', 'Which hormone causes stomatal closure and helps the plant to tolerate water stress?', 'Abscisic acid', ['Gibberellin', 'Auxin', 'Cytokinin'], 'ABA acts on guard cells and closes the stomata, reducing water loss, so it is called the stress hormone.', 'Mixed with transport in plants.');
mc(3, 'PGR discovery', 'ABA was discovered when three different inhibitors were being studied: inhibitor-B, abscission II and dormin. They were later found to be', 'chemically identical', ['three different hormones', 'forms of ethylene', 'forms of cytokinin'], 'All three turned out to be the same substance, named abscisic acid (ABA).');
mc(3, 'PGR discovery', 'The discovery that gaseous substance from ripened oranges hastened the ripening of stored bananas is credited to', 'Cousins', ['Went', 'Skoog and Miller', 'Kurosawa'], 'Cousins found that a volatile substance from ripened oranges hastened ripening of bananas. It was later identified as ethylene. Kurosawa worked on bakanae, Skoog and Miller on kinetin.');
mc(3, 'PGR discovery', 'Which scientist is associated with the isolation of gibberellins from <i>Gibberella fujikuroi</i> in connection with bakanae disease of rice?', 'E. Kurosawa', ['F.W. Went', 'F. Skoog', 'H.H. Cousins'], 'Kurosawa studied the foolish seedling disease and showed that the fungal extract caused it. The active substance was later named gibberellic acid.');
mc(3, 'PGR discovery', 'Zeatin, a naturally occurring cytokinin, was isolated from', 'corn kernels and coconut milk', ['human urine', 'autoclaved DNA', 'oat coleoptile tips'], 'Zeatin comes from immature corn (maize) kernels and coconut milk. Kinetin is a synthetic-like product from autoclaved herring sperm DNA.');
mc(3, 'growth', 'The maize root apical meristem can produce more than 17,500 new cells per hour. This shows the growth is measured as', 'increase in cell number', ['increase in cell volume', 'increase in dry weight', 'increase in surface area'], 'The data are given as cells produced per hour, so cell number is the parameter. In contrast, the watermelon fruit cells increase hugely in size (volume).');
ms(3, 'PGR', 'Which of these are used as growth promoters in plants? (one or more correct)', ['Auxins', 'Gibberellins', 'Cytokinins', 'Abscisic acid'], [0, 1, 2], 'Auxins, gibberellins and cytokinins promote growth (cell division, enlargement, flowering, fruiting). ABA is an inhibitor.');
ms(3, 'PGR functions', 'Which of these effects are produced by auxins? (one or more correct)', ['Apical dominance', 'Induction of rooting in cuttings', 'Parthenocarpy in tomato', 'Bolting in cabbage'], [0, 1, 2], 'Apical dominance, rooting of cuttings and parthenocarpy are auxin effects. Bolting is caused by gibberellins.');
asr(3, 'PGR functions', 'Removing the shoot apex of a plant makes lateral buds grow.', 'The apical bud produces auxin, which suppresses lateral buds.', 0, 'Auxin made in the apical bud moves down and inhibits the lateral buds (apical dominance). When the tip is removed the source is gone, so lateral buds grow. R explains A.');
asr(3, 'PGR functions', '2,4-D is used to kill dicot weeds in wheat fields.', 'Wheat, being a monocot, is not affected by 2,4-D whereas dicots respond.', 0, 'The herbicide acts like a high-dose auxin and kills dicot weeds. Mature monocots such as wheat are not affected, so the crop survives. R explains A.');
asr(3, 'PGR functions', 'Gibberellins are used to increase the length of grape stalks.', 'Gibberellins cause elongation of the plant axis.', 0, 'GAs lengthen internodes and stalks, which gives a looser bunch. R explains A.');
asr(3, 'PGR functions', 'Fruits ripen faster when kept together with a ripe banana.', 'Ripe fruits release ethylene, which hastens the ripening of other fruits.', 0, 'Ripening fruits produce ethylene, a gaseous hormone. It spreads through the air and speeds up ripening of the neighbours. R explains A.');
asr(3, 'differentiation', 'Plants show an open form of growth and differentiation.', 'Meristems continue to produce new cells that differentiate into different structures throughout life.', 0, 'Plant meristems are active for the life of the plant and their cells can become different cell types, so plant growth and differentiation are open. R explains A.');
stm(3, 'growth rate', 'In arithmetic growth, the length of a root increases linearly with time.', 'In geometric growth, the initial growth is slow and later it becomes rapid.', 0, 'Both are correct. Arithmetic growth gives a straight line. Geometric growth has a slow start (lag) and then speeds up (log phase).');
stm(3, 'PGR', 'Ethylene is a gaseous plant growth regulator.', 'Abscisic acid promotes seed germination.', 2, 'I is correct. II is wrong: ABA inhibits germination and promotes dormancy, with gibberellins doing the opposite.');
stm(3, 'differentiation', 'Dedifferentiation is the process by which mature cells regain the capacity to divide.', 'Redifferentiation is the loss of the capacity to divide by the cells formed from dedifferentiated tissue.', 0, 'Both are correct. Cambium formation is dedifferentiation; the maturation of cambial derivatives to xylem and phloem is redifferentiation.');
match(3, 'PGR', 'pA', 'PGRs and their discovery', ['A. Auxin', 'B. Gibberellin', 'C. Cytokinin', 'D. Ethylene'], ['p. Bakanae disease of rice', 'q. Ripened oranges and stored bananas', 'r. Kinetin from autoclaved DNA', 's. Coleoptile of oat or canary grass'], 'A-s, B-p, C-r, D-q', ['A-p, B-s, C-r, D-q', 'A-s, B-r, C-p, D-q', 'A-s, B-p, C-q, D-r'], 'Auxin was found from the coleoptile studies of the Darwins and Went (A-s). Gibberellin from bakanae disease (B-p). Cytokinin: kinetin from autoclaved herring sperm DNA (C-r). Ethylene: Cousins, oranges and bananas (D-q).');
match(3, 'PGR functions', 'pB', 'PGRs and applications', ['A. 2,4-D', 'B. Ethephon', 'C. Gibberellic acid', 'D. IBA'], ['p. Increase in sugarcane yield', 'q. Rooting of stem cuttings', 'r. Killing of dicot weeds', 's. Ripening of tomatoes'], 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-q, B-s, C-p, D-r'], '2,4-D is a herbicide (A-r). Ethephon gives ethylene for ripening (B-s). GA lengthens sugarcane stems (C-p). IBA helps the rooting of cuttings (D-q).');
match(3, 'PGR', 'pC', 'PGRs and chemical nature', ['A. Auxin (IAA)', 'B. Cytokinin (kinetin)', 'C. Abscisic acid', 'D. Gibberellic acid'], ['p. Terpene', 'q. Adenine derivative', 'r. Indole compound', 's. Carotenoid derivative'], 'A-r, B-q, C-s, D-p', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-r, B-s, C-q, D-p'], 'IAA = indole (A-r); kinetin = adenine derivative (B-q); ABA = carotenoid derivative (C-s); GA = terpene (D-p).');
match(3, 'growth', 'pD', 'Phases and curves', ['A. Meristematic phase', 'B. Elongation phase', 'C. Maturation phase', 'D. Log phase'], ['p. Cells reach full size with wall thickening', 'q. Rapid division with dense protoplasm', 'r. Vacuolation and cell enlargement', 's. Fast exponential growth in sigmoid curve'], 'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-q, B-p, C-r, D-s'], 'Meristematic: dense protoplasm, rapid division (A-q). Elongation: vacuolation and enlargement (B-r). Maturation: final size and wall changes (C-p). The log phase of the sigmoid curve is exponential (D-s).');

nat(3, 'growth rate', 'A leaf grows from 12 cm<sup>2</sup> to 20 cm<sup>2</sup> in 4 days. What is its absolute growth rate in cm<sup>2</sup> per day?', 2, 'Absolute growth rate = total growth / time = (20 - 12)/4 = 8/4 = 2 cm<sup>2</sup> per day.', 'cm<sup>2</sup>/day', 'Absolute growth rate does not use the initial size.');
nat(3, 'growth rate', 'A leaf of area 5 cm<sup>2</sup> grows to 10 cm<sup>2</sup> in one day. What is its relative growth rate per day, as a fraction of the initial area?', 1, 'Relative growth rate = growth per unit initial size per day = (10 - 5)/5 = 1 per day (that is, 100% per day).', 'per day', '', 0);
nat(3, 'growth rate', 'In arithmetic growth, a meristematic cell divides mitotically 6 times in succession, and each time only one daughter keeps dividing while the other differentiates. How many cells are there in all at the end?', 7, 'After each division one cell continues to divide and one differentiates. After 6 divisions there are 6 differentiated cells and 1 dividing cell: 6 + 1 = 7.', '', 'In geometric growth the count would be 2<sup>6</sup> = 64.');
nat(3, 'growth rate', 'In geometric growth, one cell divides and both daughter cells keep dividing in every round. How many cells are there after 6 rounds of division?', 64, 'The number doubles each round: 2<sup>6</sup> = 64.', '', 'Do not use 6 + 1 = 7; that is arithmetic growth.');

// ---------------------------------------------------------------- Passages
pass('pgP1', 'Growth of a root', 'A student measured the length of a root at fixed times. The root grew at a steady rate, because the meristem cells divided in such a way that only one daughter cell continued to divide at each round. Length (mm): day 0 = 10, day 2 = 14, day 4 = 18 and day 6 = 22.');
pq('pgP1', 2, 'growth rate', 'The type of growth shown by the root is', 'arithmetic growth', ['geometric growth', 'sigmoid growth', 'no growth'], 'The length rises by the same amount (4 mm) every 2 days, so the graph is a straight line. This is arithmetic growth, as one daughter cell divides and the other differentiates.');
pq('pgP1', 3, 'growth rate', 'The rate of elongation of the root is', '2 mm per day', ['4 mm per day', '10 mm per day', '22 mm per day'], 'The rate is the change in length divided by time: (14 - 10)/2 = 2 mm per day. The 4 mm is the change in 2 days.');
pq('pgP1', 3, 'growth rate', 'If this rate continues, the root length on day 15 will be', '40 mm', ['30 mm', '45 mm', '25 mm'], 'L<sub>t</sub> = L<sub>0</sub> + rt = 10 + 2 &times; 15 = 40 mm.', 'Remember to add the starting length.');

pass('pgP2', 'Two seedlings', 'Seedling A is 10 cm tall at the start of a week and 15 cm tall at the end of the week. Seedling B is 40 cm tall at the start and 45 cm tall at the end of the same week.');
pq('pgP2', 3, 'growth rate', 'Comparing the absolute growth rates of A and B, we find that', 'both are equal at 5 cm per week', ['A is higher', 'B is higher', 'A is 5 cm per week and B is 45 cm per week'], 'Absolute growth rate = increase in height per unit time. Both plants gained 5 cm in a week, so the rates are equal.');
pq('pgP2', 3, 'growth rate', 'The relative growth rate of A (per week, per unit initial height) is', '0.5', ['5', '0.125', '1.5'], 'RGR = (15 - 10)/10 = 5/10 = 0.5 per week, which is 50% per week.');
pq('pgP2', 4, 'growth rate', 'Which statement is correct about the two seedlings?', 'A has the higher relative growth rate even though the absolute growth rates are equal', ['B has the higher relative growth rate because it is taller', 'Both have equal relative growth rates', 'The relative growth rate of B is 50% per week'], 'RGR of B = 5/40 = 0.125 per week = 12.5%. RGR of A = 50% per week. The same absolute gain is a larger fraction of the small starting size.', 'Equal absolute growth does not mean equal relative growth.');

pass('pgP3', 'Pea seedlings and buds', 'Four sets of pea seedlings were grown. Set 1: intact plants; their lateral buds stayed dormant. Set 2: shoot tip cut off; lateral buds began to grow. Set 3: shoot tip cut off and the cut surface covered with a paste of IAA; lateral buds stayed dormant. Set 4: intact plants with a cytokinin paste on one lateral bud; that bud began to grow.');
pq('pgP3', 2, 'apical dominance', 'The phenomenon shown by Set 1 is called', 'apical dominance', ['phototropism', 'parthenocarpy', 'bolting'], 'The apical bud suppresses the growth of lateral buds. This is apical dominance.');
pq('pgP3', 4, 'apical dominance', 'Comparing Set 2 and Set 3 shows that', 'auxin from the shoot tip is the factor that keeps lateral buds dormant', ['IAA is a growth promoter of lateral buds', 'the shoot tip has no effect on lateral buds', 'IAA makes lateral buds produce cytokinin'], 'Removing the tip freed the buds (Set 2). Putting IAA in place of the tip kept them dormant (Set 3). So the tip works through auxin.');
pq('pgP3', 4, 'apical dominance', 'Set 4 indicates that cytokinins', 'overcome the inhibitory effect of auxin on lateral buds', ['are made in the shoot tip', 'close the stomata', 'inhibit cell division'], 'The lateral bud grew even though the tip (the source of auxin) was present. So cytokinin counters apical dominance.');

// ---------------------------------------------------------------- Level 4
mc(4, 'growth rate', 'Which of the following is an example of arithmetic growth in a plant?', 'A root elongating at a constant rate', ['The early divisions of a zygote when all cells divide', 'A bacterial colony in a rich medium', 'A callus with all cells dividing'], 'In arithmetic growth only one daughter cell divides after each mitosis, giving a constant increase per unit time, as in root tip elongation at a constant rate. When all cells divide, growth is geometric.');
mc(4, 'growth rate', 'Fresh weight is a less reliable measure of growth than dry weight because', 'fresh weight changes with the water content of the cells', ['dry weight includes water', 'fresh weight does not include cell walls', 'dry weight changes every minute'], 'Water content varies with humidity and turgor, so fresh weight can change without real growth. Dry weight measures the organic matter and minerals actually built up.');
mc(4, 'growth rate', 'If W<sub>1</sub> = W<sub>0</sub> e<sup>rt</sup>, plotting W<sub>1</sub> against t gives', 'a curve rising ever more steeply', ['a straight line', 'a curve that flattens quickly', 'a horizontal line'], 'The exponential function increases faster as it gets larger: the larger the plant, the more it adds. In real conditions, limitation of nutrients leads to the stationary phase.');
mc(4, 'differentiation', 'Vascular cambium shows an "open" form of differentiation because', 'the same meristem gives rise to different cell types such as xylem and phloem', ['it never divides', 'it forms only one type of cell', 'its cells lose all their walls'], 'Cambium cut off secondary xylem inwards and secondary phloem outwards. A meristem producing structurally different cells is a feature of the open form of plant differentiation.');
mc(4, 'differentiation', 'Which is NOT correct about tracheary elements?', 'They remain alive with a thin cellulose wall when mature', ['They lose their protoplasm', 'They have lignocellulosic secondary walls', 'They are formed by differentiation of meristem-derived cells'], 'Mature vessels and tracheids are dead, hollow cells with thick, lignified secondary walls. The statement in the correct option describes the opposite.');
mc(4, 'PGR discovery', 'In an experiment on a canary grass coleoptile, the tip was covered with an opaque cap and the rest was lit from one side. No bending occurred. When only the base was covered, bending took place. The conclusion is that', 'the tip is the part that perceives the light', ['the base perceives light', 'light is not needed for bending', 'covering stops auxin from being made anywhere'], 'Bending depends on the tip: an influence passes from the tip to the growing region below. This led to the isolation of auxin.');
mc(4, 'PGR functions', 'A tissue culture of tobacco shows roots when the medium has a high ratio of auxin to cytokinin, and shoots when the ratio is low. This shows that', 'the balance of PGRs controls differentiation', ['only auxin controls differentiation', 'cytokinin kills root cells', 'differentiation is not possible in vitro'], 'Skoog and Miller showed that the type of organ formed depends on the ratio of the two hormones. A medium with equal amounts supports undifferentiated callus growth.', 'Mixed with plant tissue culture.');
mc(4, 'PGR functions', 'ABA closes stomata by', 'causing loss of potassium ions and so water from guard cells', ['increasing potassium in guard cells', 'making the guard cell walls thicker', 'blocking the xylem'], 'ABA acts on guard cells: ions leave, water follows by osmosis, and the guard cells lose turgor, so the stomata close.', 'Mixed with transport in plants.');
mc(4, 'PGR functions', 'Which pair of hormones acts in an opposing way on seed germination?', 'Gibberellin and abscisic acid', ['Auxin and cytokinin', 'Ethylene and ABA', 'Gibberellin and cytokinin'], 'GA breaks dormancy and promotes germination, while ABA keeps seeds dormant. They are antagonists in most situations.');
mc(4, 'PGR functions', 'Flowering of mango can be induced by', 'ethylene', ['abscisic acid', 'cytokinin', 'gibberellin'], 'Ethylene is used to start flowering in mango and also to synchronise flowering and fruit set in pineapple.');
mc(4, 'PGR functions', 'Which statement about ethylene is correct?', 'It is formed in large amounts by ripening fruits and senescing tissues', ['It is formed only in roots', 'It is a growth promoter that prevents abscission', 'It inhibits respiration of fruits'], 'Ethylene is made in large amounts by tissues undergoing senescence and by ripening fruits. It promotes abscission and increases respiration during ripening.');
mc(4, 'PGR functions', 'The use of auxin, gibberellin and cytokinin as growth promoters differs from ABA because ABA', 'is a general growth inhibitor and a stress hormone', ['makes cells divide', 'elongates cells', 'is a gas'], 'ABA inhibits plant metabolism and growth: it promotes dormancy, inhibits seed germination and closes stomata.');
mc(4, 'PGR', 'Which pair of auxins both occur naturally in plants?', 'IAA and IBA', ['NAA and 2,4-D', 'IAA and 2,4-D', 'IBA and NAA'], 'IAA and indole butyric acid (IBA) have been isolated from plants. NAA and 2,4-D are synthetic compounds with auxin-like properties.');
mc(4, 'PGR functions', 'Which of the following raises the yield of sugarcane?', 'Spraying gibberellins, which lengthen the stem', ['Spraying ABA to dry the stem', 'Spraying ethephon to cause leaf fall', 'Spraying 2,4-D at high dose to kill the crop'], 'GA increases internode length; the yield rises by up to about 20 tonnes per acre.');
mc(4, 'PGR functions', 'A florist wants to delay the yellowing (senescence) of cut leafy vegetables. Which hormone is the best choice?', 'Cytokinin', ['Ethylene', 'Abscisic acid', 'Auxin at high dose'], 'Cytokinins delay leaf senescence by promoting nutrient mobilisation. Ethylene and ABA hasten senescence.');
mc(4, 'PGR functions', 'Which PGR is most closely linked to breaking dormancy of potato tubers and initiating germination in peanut seeds?', 'Ethylene', ['Abscisic acid', 'Kinetin', 'IBA'], 'Ethylene breaks seed and bud dormancy; it initiates germination in peanut seeds and sprouting of potato tubers.');
mc(4, 'growth', 'Increase in the girth of a tree trunk is the result of', 'secondary growth by the vascular cambium and cork cambium', ['primary growth by apical meristems', 'activity of the intercalary meristem only', 'elongation of vacuoles only'], 'Lateral meristems (vascular cambium and cork cambium) add thickness. Apical meristems add length.', 'Mixed with plant anatomy.');
mc(4, 'growth', 'The cells of a watermelon can enlarge up to 350,000 times in size. This is mostly because of', 'the elongation (enlargement) phase with water uptake and vacuole growth', ['the meristematic phase with fast division', 'the maturation phase with wall thickening', 'dedifferentiation'], 'Large increases in cell size come from the elongation phase, in which the vacuole takes up water and cells swell. Division does not make cells bigger.');
mc(4, 'PGR functions', 'A farmer wants to produce seedless grapes with bigger bunches. Which hormone is commonly sprayed?', 'Gibberellin', ['Abscisic acid', 'Ethylene', 'Kinetin'], 'GA increases the length of grape stalks and berry size, so the bunch is loose and large.');
nat(4, 'growth rate', 'A cell mass doubles in number every 3 hours. If it starts with 100 cells, how many cells are there after 12 hours?', 1600, '12 hours is 4 doubling times (12/3). Number = 100 &times; 2<sup>4</sup> = 100 &times; 16 = 1600.', '', 'This is geometric growth, so the number multiplies, not adds.');
nat(4, 'growth', 'A maize root meristem produces about 17,500 new cells per hour. How many new cells will it produce in 12 hours?', 210000, '17,500 &times; 12 = 210,000 cells.', '', 'The rate is per hour.');
nat(4, 'growth', 'A seedling has a fresh weight of 80 g and a dry weight of 20 g. What percentage of its fresh weight is water?', 75, 'Water = 80 - 20 = 60 g. Percentage = 60/80 &times; 100 = 75%. (Dry matter is 25%.)', '%', 'Dry weight percentage would be 25.');
nat(4, 'growth rate', 'A culture shows geometric growth with relative growth rate r = 0.0693 per day. Using ln 2 = 0.693, what is its doubling time in days?', 10, 'Size doubles when e<sup>rt</sup> = 2, so rt = ln 2. Doubling time = ln 2 / r = 0.693/0.0693 = 10 days.', 'days', '', 0.1);
ms(4, 'PGR functions', 'Which of these effects are caused by gibberellins? (one or more correct)', ['Bolting in rosette plants', 'Faster malting of barley', 'Elongation of sugarcane internodes', 'Closure of stomata'], [0, 1, 2], 'Bolting, malting and sugarcane stem elongation are all GA effects. Stomatal closure is caused by ABA.');
ms(4, 'PGR functions', 'Which of these are effects of ethylene? (one or more correct)', ['Fruit ripening', 'Abscission of leaves and flowers', 'Increase in respiration rate during ripening', 'Delay of senescence in leaves'], [0, 1, 2], 'Ethylene hastens ripening, abscission and the respiratory climacteric. Delaying senescence is a cytokinin and gibberellin effect.');
asr(4, 'growth rate', 'Dry weight is a better measure of growth than fresh weight.', 'Fresh weight changes with the amount of water in the cells.', 0, 'Dry weight shows the real build-up of organic matter and minerals. Fresh weight can rise from water uptake without growth. R explains A.');
asr(4, 'growth rate', 'Two organs can have the same absolute growth rate and different relative growth rates.', 'Relative growth rate is calculated on the basis of the initial size of the organ.', 0, 'Equal gains in size are a different fraction of different starting sizes. Because RGR is worked out per unit initial size, the smaller organ shows the higher RGR. R explains A.');
asr(4, 'PGR functions', 'Gibberellins are used to speed up the malting of barley.', 'Gibberellins inhibit the synthesis of enzymes during germination of barley.', 2, 'A is true: GA speeds up malting. R is false: GA induces hydrolytic enzymes such as amylase in germinating seeds.');
asr(4, 'PGR functions', 'Cytokinins are made mainly in mature leaves.', 'Cytokinins promote cell division and are made at sites of rapid division such as root apices.', 3, 'A is false: cytokinins are synthesised where cells divide actively (root apices, developing shoot buds, young fruits). R is true.');
asr(4, 'PGR functions', 'Abscisic acid is called the stress hormone.', 'It increases the tolerance of plants to stresses such as drought, by closing stomata.', 0, 'ABA increases tolerance to stress. Closing stomata saves water in drought. R explains A.');
asr(4, 'growth rate', 'In arithmetic growth, length plotted against time gives a straight line.', 'In arithmetic growth, both daughter cells divide after each mitosis.', 2, 'A is true. R is false: only one daughter cell divides, the other differentiates. If both divide, it is geometric growth.');
stm(4, 'PGR functions', 'Gibberellins cause bolting and hasten malting.', 'Gibberellins and abscisic acid act as antagonists in the dormancy of seeds.', 0, 'Both correct. GA promotes stem elongation and enzyme formation, and breaks dormancy, while ABA induces dormancy.');
stm(4, 'PGR', 'Auxins are synthesised only in the root tip.', 'Kinetin is a naturally occurring cytokinin isolated from maize.', 1, 'Both are wrong. Auxins are made mostly in growing tips of shoots and roots. Kinetin comes from autoclaved DNA; the natural cytokinin of maize is zeatin.');
stm(4, 'PGR functions', 'Ethylene stimulates the horizontal growth of seedlings and swelling of the axis.', 'Cytokinins promote the formation of the apical hook in dicot seedlings.', 2, 'I is correct. In II the apical hook is influenced by ethylene, not by cytokinins.');
stm(4, 'differentiation', 'Dedifferentiation produces meristem-like cells from permanent cells.', 'Cells formed after redifferentiation continue to divide indefinitely.', 2, 'I is correct. II is wrong: redifferentiation means the cells lose the ability to divide and mature into specific cells.');
match(4, 'PGR functions', 'pE', 'PGRs and physiological roles', ['A. Abscisic acid', 'B. Ethylene', 'C. Cytokinin', 'D. Gibberellin'], ['p. Delays leaf senescence', 'q. Closure of stomata', 'r. Bolting in cabbage', 's. Ripening of fruits'], 'A-q, B-s, C-p, D-r', ['A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p', 'A-p, B-s, C-q, D-r'], 'ABA closes stomata (A-q). Ethylene ripens fruits (B-s). Cytokinin delays senescence (C-p). Gibberellin causes bolting (D-r).');

// ---------------------------------------------------------------- Level 5
mc(5, 'growth rate', 'In geometric growth, if the size at time t is four times the initial size, the size at time 2t is', '16 times the initial size', ['8 times the initial size', '6 times the initial size', '4 times the initial size'], 'W<sub>1</sub>/W<sub>0</sub> = e<sup>rt</sup> = 4. At 2t it is e<sup>2rt</sup> = (e<sup>rt</sup>)<sup>2</sup> = 16.', 'For arithmetic growth it would be 7 times (1 + 2 &times; 3).');
mc(5, 'growth rate', 'A culture shows geometric growth with doubling time T. The relative growth rate r is', 'ln 2 / T', ['T / ln 2', '2 / T', 'ln T / 2'], 'W = W<sub>0</sub> e<sup>rt</sup> = W<sub>0</sub> 2<sup>t/T</sup> gives e<sup>rT</sup> = 2, so r = ln 2 / T.');
mc(5, 'PGR', 'Which sequence correctly pairs hormone, discovery source and chemical nature?', 'Cytokinin, autoclaved herring sperm DNA, adenine derivative', ['Auxin, bakanae disease, indole', 'Gibberellin, canary grass coleoptile, terpene', 'ABA, ripened oranges, carotenoid derivative'], 'Kinetin: autoclaved DNA, adenine derivative. Auxin comes from coleoptile studies (bakanae is gibberellin). Gibberellin: bakanae, terpene. ABA: inhibitor-B, abscission II and dormin.', 'Each wrong option swaps one part.');
mc(5, 'PGR functions', 'A student sprays a mature dicot weed and a mature maize plant with 2,4-D. The dicot dies while maize survives. The most appropriate explanation is that', 'the dicot responds to the auxin-like herbicide at that dose while mature monocots do not', ['maize has no auxin at all', '2,4-D is converted to ethylene only in maize', 'dicots have no cytokinin'], 'This is a selective herbicide effect. 2,4-D kills dicotyledonous weeds without affecting mature monocot crops.');
mc(5, 'PGR functions', 'Which statement about auxin is NOT correct?', 'It is the only plant growth regulator that promotes abscission', ['It promotes apical dominance', 'It prevents early fruit drop', 'It controls xylem differentiation and helps cell division'], 'Ethylene also promotes abscission, and ABA is linked to it. Auxins prevent early drop but promote abscission of old leaves and fruits. They help xylem differentiation and cell division.');
mc(5, 'growth', 'A student plots growth rate (not size) against time for an organism with the sigmoid size curve. The graph will most likely be', 'bell-shaped, with the peak during the log phase', ['a straight line', 'an ever-rising line', 'a horizontal line'], 'The rate is small in the lag phase, highest in the log phase, and falls to zero in the stationary phase. Plotting the size gives an S-curve; the rate gives a bell shape.', 'Mixing "rate" with "size" is the classic error.');
mc(5, 'differentiation', 'Which of the following correctly represents a case where dedifferentiation and redifferentiation both occur?', 'Mature parenchyma forms cork cambium, which then produces cork cells', ['A tracheid forms from a procambial cell', 'A root hair forms from an epidermal cell', 'A meristem cell divides to form two meristem cells'], 'The cortex cells (differentiated) return to division (dedifferentiation: cork cambium) and the cells they produce lose division ability and become cork (redifferentiation). In the others, no step of returning to meristem state is involved.');
mc(5, 'growth', 'Which of these is a correct comparison of growth measurements?', 'Pollen tube: length; dorsiventral leaf: surface area; watermelon fruit: volume', ['Pollen tube: volume; leaf: length; root meristem: area', 'Leaf: cell number; fruit: area; root: dry weight', 'Pollen tube: area; leaf: volume; fruit: length'], 'The parameter used depends on the organ: length for pollen tube, area for a flat leaf, volume for a fruit and cell number for a meristem.');
mc(5, 'PGR functions', 'A researcher treats a rosette plant with gibberellin and finds early bolting and also treats seeds with ABA together. The seeds fail to germinate although GA is present. This supports the idea that', 'ABA can antagonise the effect of GA on seed germination', ['ABA is a growth promoter', 'GA has no effect on seeds', 'GA is a gas'], 'ABA induces dormancy and acts as an antagonist of GA in most situations, so germination is blocked.');
mc(5, 'PGR functions', 'An enterprising grower keeps raw bananas in a closed box with a few ripe ones and finds that they ripen earlier than raw ones kept in the open. Which statement correctly explains the result and applies the finding?', 'Ripe fruits release ethylene, which hastens ripening; ethephon can be used in a similar way commercially', ['Ripe bananas release auxin that raises the respiration rate of unripe ones; so 2,4-D is used to ripen fruits', 'Ripe bananas release ABA which opens the stomata', 'Closed boxes increase cytokinin; kinetin is sprayed on fruits'], 'Ethylene (gas) from ripe fruits speeds up ripening of the others. In practice, ethephon releases ethylene. Auxin, ABA or cytokinin do not do this job.');
nat(5, 'growth rate', 'Seedling A grows from 20 cm to 30 cm in 5 days and seedling B from 50 cm to 65 cm in 5 days. What is the difference (RGR of A - RGR of B) in percentage per day, based on initial height?', 4, 'RGR of A = (10/20)/5 = 0.10 per day = 10% per day. RGR of B = (15/50)/5 = 0.06 per day = 6% per day. The difference is 4% per day.', '% per day', 'B has the higher absolute growth rate (3 cm/day against 2) but a lower relative growth rate.', 0.01);
nat(5, 'growth rate', 'A plant part follows W<sub>1</sub> = W<sub>0</sub> e<sup>rt</sup> with W<sub>0</sub> = 2 g, r = 0.2 per day and t = 5 days. Taking e = 2.718, what is W<sub>1</sub> in g?', 5.44, 'rt = 0.2 &times; 5 = 1, so e<sup>rt</sup> = e = 2.718. W<sub>1</sub> = 2 &times; 2.718 = 5.436 g, about 5.44 g.', 'g', 'Do not multiply 2 by 0.2 &times; 5 = 1 alone; the exponential must be used.', 0.02);
asr(5, 'PGR functions', 'Ethylene hastens the ripening of fruits and also the abscission of leaves and flowers.', 'Ethylene is made in large quantities in tissues undergoing senescence and in ripening fruits.', 1, 'Both are true. The reason does not directly explain why it causes both effects: the amount made explains its presence, not the response of the target cells. R is true but not the explanation.', 'Trap: A true and R true does not always mean "explanation".');
stm(5, 'PGR', 'IBA and IAA have been isolated from plants.', 'NAA and 2,4-D are natural gibberellins.', 2, 'I is correct. II is wrong: NAA and 2,4-D are synthetic compounds with auxin-like properties.');
mc(5, 'mixed concepts', 'How many of the following are correct? (i) Heterophylly shows plasticity. (ii) Redifferentiation means regaining the capacity to divide. (iii) Zeatin was isolated from coconut milk. (iv) Ethylene promotes female flowers in cucumber. (v) ABA helps seeds to withstand desiccation.', 'Four', ['Two', 'Three', 'Five'], '(i), (iii), (iv) and (v) are correct. (ii) is wrong: that is dedifferentiation. Redifferentiation is the loss of ability to divide.', '', 'statements');

// ---------------------------------------------------------------- Templates
const HORMS = ['Auxin', 'Gibberellin', 'Cytokinin', 'Ethylene', 'Abscisic acid'];
const EFFECTS = [
  [0, 'suppresses the growth of lateral buds when the shoot tip is present (apical dominance)', 'Auxin from the apical bud suppresses lateral buds.'],
  [0, 'induces rooting in stem cuttings', 'Auxins such as IBA and NAA start root formation on cuttings.'],
  [0, 'induces fruit development without fertilisation (parthenocarpy) in tomato', 'Auxin causes parthenocarpy.'],
  [0, 'kills dicot weeds in a cereal field when used as 2,4-D', '2,4-D is an auxin-type herbicide that kills dicots but not mature monocots.'],
  [1, 'causes internode elongation (bolting) in cabbage and beet before flowering', 'Gibberellins promote bolting in rosette plants.'],
  [1, 'increases the yield of sugarcane by lengthening the stem', 'Gibberellins lengthen internodes, raising sugarcane yield.'],
  [1, 'speeds up malting in the brewing industry', 'GA speeds up malting.'],
  [1, 'delays senescence of apples so fruits can stay on the tree longer', 'Gibberellins delay senescence of fruit.'],
  [2, 'delays leaf senescence by mobilising nutrients to the leaf', 'Cytokinins delay senescence.'],
  [2, 'promotes cell division and is made in root apices and young fruits', 'Cytokinins promote cytokinesis.'],
  [2, 'overcomes apical dominance and promotes lateral shoot growth', 'Cytokinins counter the effect of auxin on lateral buds.'],
  [3, 'hastens ripening of fruits and is a gas', 'Ethylene is the gaseous ripening hormone.'],
  [3, 'promotes the swelling of the axis and apical hook formation in dicot seedlings', 'Ethylene shows this response.'],
  [3, 'promotes internode elongation in deep-water rice', 'Ethylene helps deep-water rice keep leaves above water.'],
  [3, 'promotes the formation of female flowers in cucumber', 'Ethylene (as ethephon) promotes female flowers.'],
  [4, 'closes the stomata and increases tolerance to stress', 'ABA is the stress hormone.'],
  [4, 'induces seed dormancy and helps seeds to withstand desiccation', 'ABA promotes dormancy.'],
  [4, 'acts as an antagonist to gibberellins in seeds', 'ABA is the antagonist of GA.'],
];
const USES = [
  [0, 'a rooting powder for stem cuttings', 'IBA or NAA, which are auxins, promote rooting.'],
  [0, 'a herbicide against dicot weeds in a wheat field', '2,4-D is an auxin.'],
  [1, 'a spray to make sugarcane stems longer and raise the yield', 'GA lengthens internodes.'],
  [1, 'a treatment to speed up the malting of barley', 'GA speeds up malting.'],
  [1, 'a spray to make grape stalks longer for larger, looser bunches', 'GA lengthens the stalks.'],
  [2, 'a treatment to keep cut leafy vegetables green for longer', 'Cytokinin delays senescence.'],
  [2, 'a medium additive with auxin to make callus divide in tissue culture', 'Cytokinin with auxin supports division and shoot formation.'],
  [3, 'a source (ethephon) to ripen tomatoes and apples', 'Ethephon releases ethylene.'],
  [3, 'a way to thin cotton, cherry and walnut by loosening the fruit', 'Ethephon (ethylene) accelerates abscission.'],
  [3, 'a way to induce flowering in mango and to synchronise fruit set in pineapple', 'Ethylene initiates flowering in these plants.'],
];
function hormOpts(rng, idx) {
  const wrongs = HORMS.filter((_, i) => i !== idx);
  for (let i = wrongs.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [wrongs[i], wrongs[j]] = [wrongs[j], wrongs[i]]; }
  return shuffleOpts(rng, HORMS[idx], wrongs.slice(0, 3));
}
const gens = [
  {
    id: 'pg-g01', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const N0 = choose(rng, [1, 2, 5, 10, 50, 100]); const T = choose(rng, [1, 2, 3, 4, 6, 12]); const k = int(rng, 2, 7); const t = T * k;
      return { N0, T, k, t, q: `A culture of plant cells shows geometric growth: every cell keeps dividing and the number doubles every ${T} hour${T > 1 ? 's' : ''}. It starts with ${N0} cell${N0 > 1 ? 's' : ''}. How many cells are there after ${t} hours?`, answer: N0 * 2 ** k, tol: 0, sol: `Idea: in geometric growth the number doubles each doubling time. Number of doublings = ${t}/${T} = ${k}. Cells = ${N0} &times; 2<sup>${k}</sup> = ${N0 * 2 ** k}.`, trap: 'Growth multiplies; it does not add a fixed amount.' };
    },
    verify(p) { let x = p.N0; for (let i = 0; i < p.t / p.T; i++) x *= 2; return x; },
  },
  {
    id: 'pg-g02', type: 'nat', level: 2, format: 'numeric', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const L0 = pick(rng, 5, 40, 5); const r = pick(rng, 0.5, 6, 0.5); const t = int(rng, 3, 20);
      const answer = +(L0 + r * t).toFixed(2);
      return { L0, r, t, q: `A root tip shows arithmetic growth. It is ${L0} mm long at the start and lengthens at a steady ${r} mm per day. What is its length after ${t} days?`, answer, tol: 0.01, unit: 'mm', sol: `In arithmetic growth L<sub>t</sub> = L<sub>0</sub> + rt = ${L0} + ${r} &times; ${t} = ${L0} + ${+(r * t).toFixed(2)} = ${answer} mm.`, trap: 'Do not forget the initial length.' };
    },
    verify(p) { return +(p.L0 + p.t * p.r).toFixed(2); },
  },
  {
    id: 'pg-g03', type: 'nat', level: 2, format: 'numeric', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const A0 = int(rng, 4, 30); const A1 = A0 + int(rng, 2, 25); const t = int(rng, 2, 8); const what = choose(rng, ['leaf area (cm<sup>2</sup>)', 'plant height (cm)', 'dry weight (g)']);
      const unit = what.match(/\((.+)\)/)[1]; const nm = what.split(' (')[0];
      const answer = +((A1 - A0) / t).toFixed(3);
      return { A0, A1, t, q: `The ${nm} of a seedling rises from ${A0} ${unit} to ${A1} ${unit} in ${t} days. What is the absolute growth rate in ${unit} per day?`, answer, tol: 0.01, unit: `${unit}/day`, sol: `Absolute growth rate = total growth / time = (${A1} - ${A0})/${t} = ${A1 - A0}/${t} = ${answer} ${unit} per day.`, trap: 'Absolute growth rate does not divide by the initial size.' };
    },
    verify(p) { return +((p.A1 - p.A0) / p.t).toFixed(3); },
  },
  {
    id: 'pg-g04', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const W0 = choose(rng, [4, 5, 8, 10, 20, 25, 40, 50]); const pct = choose(rng, [10, 20, 25, 40, 50, 60, 100]); const W1 = W0 * (1 + pct / 100); const t = choose(rng, [1, 2, 4, 5]);
      const answer = +(pct / t).toFixed(2);
      return { W0, W1, t, pct, q: `A growing organ increases from ${W0} units to ${+W1.toFixed(2)} units in ${t} day${t > 1 ? 's' : ''}. What is its relative growth rate, in percent per day of the initial size?`, answer, tol: 0.01, unit: '% per day', sol: `Relative growth rate = (growth / initial size) / time. Growth = ${+W1.toFixed(2)} - ${W0} = ${+(W1 - W0).toFixed(2)}. Per unit initial size: ${+(W1 - W0).toFixed(2)}/${W0} = ${+(pct / 100).toFixed(2)}, which is ${pct}%. Per day: ${pct}/${t} = ${answer}% per day.`, trap: 'Divide by the initial size, and by the time as well.' };
    },
    verify(p) { return +((((p.W1 - p.W0) / p.W0) * 100) / p.t).toFixed(2); },
  },
  {
    id: 'pg-g05', type: 'mcq', level: 4, format: 'single', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const a0 = choose(rng, [5, 8, 10, 20]); const b0 = a0 * choose(rng, [2, 3, 4, 5]); const gain = choose(rng, [2, 4, 5, 10]);
      const ra = gain / a0, rb = gain / b0;
      const correct = 'A has the higher relative growth rate; the absolute growth rates are equal';
      const o = shuffleOpts(rng, correct, ['B has the higher relative growth rate because it is larger', 'The two have equal relative growth rates since they gained the same amount', 'B has the higher absolute growth rate']);
      return { a0, b0, gain, ra, rb, correctText: correct, q: `Plant A is ${a0} cm tall and plant B is ${b0} cm tall. In one week each gains ${gain} cm. Which statement is correct?`, options: o.options, answer: o.answer, sol: `Absolute growth rate: both gain ${gain} cm per week, so they are equal. Relative growth rate = gain / initial size: A = ${gain}/${a0} = ${+ra.toFixed(3)}, B = ${gain}/${b0} = ${+rb.toFixed(3)}. A is higher because the same gain is a bigger fraction of the smaller initial size.`, trap: 'Equal absolute growth does not give equal relative growth.' };
    },
    verify(p) { return p.ra > p.rb ? p.options.indexOf(p.correctText) : -1; },
  },
  {
    id: 'pg-g06', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const n = int(rng, 3, 12); const mode = int(rng, 0, 2);
      let q, answer, how;
      if (mode === 0) { q = `In arithmetic growth, a meristematic cell divides ${n} times in succession; each time one daughter keeps dividing and the other differentiates. How many differentiated cells are formed?`; answer = n; how = `One differentiated cell is added at each division, so ${n} cells.`; }
      else if (mode === 1) { q = `In arithmetic growth, a meristematic cell divides ${n} times in succession; each time one daughter keeps dividing and the other differentiates. How many cells are there in all (dividing and differentiated)?`; answer = n + 1; how = `${n} differentiated cells plus the one cell that still divides: ${n} + 1 = ${n + 1}.`; }
      else { q = `In geometric growth, one cell divides and every cell divides again in each of ${n} rounds. How many cells are there at the end?`; answer = 2 ** n; how = `The number doubles each round, so 2<sup>${n}</sup> = ${2 ** n}.`; }
      return { n, mode, q, answer, tol: 0, sol: `Idea: arithmetic growth keeps only one dividing cell; geometric growth doubles all. ${how}`, trap: 'Arithmetic: only one daughter keeps dividing.' };
    },
    verify(p) { return p.mode === 0 ? p.n : p.mode === 1 ? p.n + 1 : Math.pow(2, p.n); },
  },
  {
    id: 'pg-g07', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const d = int(rng, 1, 5); const t = choose(rng, [2, 3, 4, 5, 6, 8, 10]);
      const r = +((d * 0.693) / t).toFixed(4);
      return { d, t, r, q: `A culture shows geometric growth and its size becomes ${2 ** d} times in ${t} days. Taking ln 2 = 0.693, what is its relative growth rate r (per day) in W<sub>1</sub> = W<sub>0</sub> e<sup>rt</sup>?`, answer: r, tol: 0.0005, unit: 'per day', sol: `${2 ** d} = 2<sup>${d}</sup>, so e<sup>rt</sup> = 2<sup>${d}</sup> and rt = ${d} ln 2 = ${d} &times; 0.693 = ${+(d * 0.693).toFixed(3)}. With t = ${t} days, r = ${+(d * 0.693).toFixed(3)}/${t} = ${r} per day.`, trap: 'Take the natural log of the ratio, then divide by t.' };
    },
    verify(p) { return +(Math.log(2 ** p.d) / p.t).toFixed(4); },
  },
  {
    id: 'pg-g08', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const T = choose(rng, [2, 4, 5, 8, 10, 20, 25]); const r = +(0.693 / T).toFixed(4);
      return { T, r, q: `A cell culture shows geometric growth with relative growth rate r = ${r} per hour. Taking ln 2 = 0.693, what is the doubling time in hours?`, answer: T, tol: 0.05, unit: 'h', sol: `The size doubles when e<sup>rt</sup> = 2, that is rt = ln 2. Doubling time = ln 2 / r = 0.693/${r} = ${T} hours.`, trap: 'Doubling time is ln 2 / r, not 2 / r.' };
    },
    verify(p) { return +(0.693 / p.r).toFixed(2); },
  },
  {
    id: 'pg-g09', type: 'mcq', level: 2, format: 'single', exams: ['neet'], sub: 'phases of growth',
    make(rng) {
      const cases = [
        ['The cells are small, with dense protoplasm, large nuclei, thin walls and many plasmodesmata, and they divide actively.', 'Meristematic phase', 'the cells are dividing'],
        ['The cells take in water, vacuoles enlarge and new wall material is added, so the cells grow in size.', 'Elongation phase', 'the cells enlarge'],
        ['The cells reach their maximum size, the walls thicken and the protoplasm is modified.', 'Maturation phase', 'the cells finish growing and become specialised'],
        ['Growth is slow and the organism is just starting to adjust.', 'Lag phase of the sigmoid curve', 'the growth rate is low'],
        ['Growth is very fast and exponential, with the number of cells rising steeply.', 'Log phase of the sigmoid curve', 'the growth rate is highest'],
        ['Growth stops because nutrients become limiting.', 'Stationary phase of the sigmoid curve', 'the growth rate falls to zero'],
      ];
      const [d, correct, why] = choose(rng, cases);
      const all = cases.map((c) => c[1]).filter((x) => x !== correct);
      const mates = correct.includes('sigmoid') ? all.filter((x) => x.includes('sigmoid')).concat(all.filter((x) => !x.includes('sigmoid')).slice(0, 1)) : all.filter((x) => !x.includes('sigmoid')).concat(all.filter((x) => x.includes('sigmoid')).slice(0, 1));
      const o = shuffleOpts(rng, correct, mates.slice(0, 3));
      return { correctText: correct, q: `Identify the phase: ${d}`, options: o.options, answer: o.answer, sol: `Match the description to the phase: ${why}, so it is the ${correct.toLowerCase()}. The meristematic, elongation and maturation phases belong to a cell or tissue; lag, log and stationary belong to a growth curve.`, trap: 'Do not mix the three phases of a cell with the three phases of a growth curve.' };
    },
    verify(p) { return p.options.indexOf(p.correctText); },
  },
  {
    id: 'pg-g10', type: 'mcq', level: 3, format: 'single', exams: ['neet'], sub: 'PGR functions',
    make(rng) {
      const [idx, desc, why] = choose(rng, EFFECTS); const o = hormOpts(rng, idx);
      return { correctText: HORMS[idx], q: `The plant growth regulator that ${desc} is`, options: o.options, answer: o.answer, sol: `Idea: recall the main role of each hormone. ${why} So the answer is ${HORMS[idx].toLowerCase()}. The others are wrong because their main roles are different: auxin (apical dominance, rooting), gibberellin (stem elongation, bolting), cytokinin (cell division, delaying senescence), ethylene (ripening, abscission) and ABA (stress, dormancy, stomatal closure).` };
    },
    verify(p) { return p.options.indexOf(p.correctText); },
  },
  {
    id: 'pg-g11', type: 'mcq', level: 3, format: 'single', exams: ['neet'], sub: 'PGR applications',
    make(rng) {
      const [idx, desc, why] = choose(rng, USES); const o = hormOpts(rng, idx);
      return { correctText: HORMS[idx], q: `A farmer wants ${desc}. Which plant growth regulator is the right one to use?`, options: o.options, answer: o.answer, sol: `Idea: match the use with the hormone. ${why} So the answer is ${HORMS[idx].toLowerCase()}.`, trap: 'Auxin and gibberellin are confused most often.' };
    },
    verify(p) { return p.options.indexOf(p.correctText); },
  },
  {
    id: 'pg-g12', type: 'mcq', level: 2, format: 'single', exams: ['neet'], sub: 'PGR',
    make(rng) {
      const cases = [
        ['Indole-3-acetic acid (IAA)', 'Auxin', 'indole compound'],
        ['Kinetin', 'Cytokinin', 'adenine derivative'],
        ['Zeatin', 'Cytokinin', 'adenine derivative'],
        ['Gibberellic acid (GA<sub>3</sub>)', 'Gibberellin', 'terpene'],
        ['Abscisic acid', 'Abscisic acid', 'derivative of carotenoids'],
        ['Ethephon', 'Ethylene', 'compound that releases ethylene'],
        ['2,4-D', 'Auxin', 'synthetic auxin'],
        ['Naphthalene acetic acid (NAA)', 'Auxin', 'synthetic auxin'],
      ];
      const [nm, grp] = choose(rng, cases); const idx = HORMS.indexOf(grp); const o = hormOpts(rng, idx);
      const hint = cases.find((c) => c[0] === nm)[2];
      return { correctText: grp, q: `${nm} belongs to the group of plant growth regulators called`, options: o.options, answer: o.answer, sol: `${nm} is a ${hint}, so it belongs to the ${grp.toLowerCase()} group. IAA, IBA, NAA and 2,4-D are auxins; kinetin and zeatin are cytokinins; GA<sub>3</sub> is a gibberellin; ABA is abscisic acid; ethephon gives ethylene.` };
    },
    verify(p) { return p.options.indexOf(p.correctText); },
  },
  {
    id: 'pg-g13', type: 'nat', level: 2, format: 'numeric', exams: ['neet'], sub: 'growth measures',
    make(rng) {
      const F = choose(rng, [20, 40, 50, 80, 120, 200]); const dPct = choose(rng, [10, 15, 20, 25, 30, 40]); const D = +(F * dPct / 100).toFixed(2);
      const mode = int(rng, 0, 1);
      return { F, D, mode, q: `A seedling has a fresh weight of ${F} g and a dry weight of ${D} g. ${mode ? 'What is the mass of water in it (g)?' : 'What percentage of the fresh weight is water?'}`, answer: mode ? +(F - D).toFixed(2) : +(100 - dPct).toFixed(2), tol: 0.01, unit: mode ? 'g' : '%', sol: `Water = fresh weight - dry weight = ${F} - ${D} = ${+(F - D).toFixed(2)} g. ${mode ? '' : `As a percentage of fresh weight: ${+(F - D).toFixed(2)}/${F} &times; 100 = ${+(100 - dPct).toFixed(2)}%.`}`, trap: 'Dry weight does not include water.' };
    },
    verify(p) { return p.mode ? +(p.F - p.D).toFixed(2) : +(((p.F - p.D) / p.F) * 100).toFixed(2); },
  },
  {
    id: 'pg-g14', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'growth measures',
    make(rng) {
      const rate = choose(rng, [1500, 5000, 10000, 17500, 20000]); const h = choose(rng, [2, 3, 6, 12, 24]);
      return { rate, h, q: `A root apical meristem produces about ${rate.toLocaleString('en-US')} new cells every hour. How many new cells does it produce in ${h} hours?`, answer: rate * h, tol: 0, sol: `Number of cells = rate &times; time = ${rate} &times; ${h} = ${rate * h}. (This is growth measured as an increase in cell number.)`, trap: 'Check the unit of time.' };
    },
    verify(p) { return p.h * p.rate; },
  },
  {
    id: 'pg-g15', type: 'mcq', level: 4, format: 'single', exams: ['neet'], sub: 'tissue culture',
    make(rng) {
      const cases = [
        ['a high ratio of auxin to cytokinin', 'roots form', 'High auxin favours root formation.'],
        ['a high ratio of cytokinin to auxin', 'shoots form', 'High cytokinin favours shoot formation.'],
        ['roughly equal amounts of auxin and cytokinin', 'an undifferentiated mass of cells (callus) grows', 'A balanced ratio keeps cells dividing without organising into organs.'],
      ];
      const [cond, correct, why] = choose(rng, cases);
      const all = ['roots form', 'shoots form', 'an undifferentiated mass of cells (callus) grows', 'the cells stop dividing and die'];
      const o = shuffleOpts(rng, correct, all.filter((x) => x !== correct));
      return { correctText: correct, q: `A tobacco callus is grown in a medium with ${cond}. The most likely result is that`, options: o.options, answer: o.answer, sol: `Idea: the ratio of auxin to cytokinin decides what the callus makes. ${why} So the result is: ${correct}.`, trap: 'The balance of hormones, not one hormone alone, controls differentiation.' };
    },
    verify(p) { return p.options.indexOf(p.correctText); },
  },
  {
    id: 'pg-g16', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'growth rate',
    make(rng) {
      const A0 = choose(rng, [10, 20, 25, 40]); const B0 = A0 * choose(rng, [2, 3]); const gA = choose(rng, [5, 10]); const gB = choose(rng, [10, 15, 20]); const t = choose(rng, [2, 5]);
      const ra = (gA / A0 / t) * 100, rb = (gB / B0 / t) * 100; const answer = +(ra - rb).toFixed(2);
      return { A0, B0, gA, gB, t, q: `Seedling A grows from ${A0} cm to ${A0 + gA} cm and seedling B from ${B0} cm to ${B0 + gB} cm, both in ${t} days. Find RGR of A minus RGR of B, in percent per day (based on initial height).`, answer, tol: 0.02, unit: '% per day', sol: `RGR of A = (${gA}/${A0})/${t} = ${+(ra / 100).toFixed(4)} per day = ${+ra.toFixed(2)}% per day. RGR of B = (${gB}/${B0})/${t} = ${+(rb / 100).toFixed(4)} per day = ${+rb.toFixed(2)}% per day. Difference = ${answer}% per day.`, trap: 'A positive answer means the smaller plant has the higher relative rate; a negative one means B does.' };
    },
    verify(p) { return +((p.gA / p.A0 - p.gB / p.B0) / p.t * 100).toFixed(2); },
  },
];

export default { topic: 'plant-growth', groups, items, gens };
