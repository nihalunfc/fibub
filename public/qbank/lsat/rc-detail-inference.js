// LSAT · Reading Comprehension · detail and inference questions. Original passage written for fibub.
import { place } from './_util.js';
const F = { section: 'rc', qtype: 'rc' };
const it = (id, level, sub, q, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], sub, facets: F, format: 'passage', group: 'p1', q: `<p>${q}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'rc-detail-inference',
  groups: {
    p1: { title: 'Passage: how forests talk underground', passage: `<p>Beneath most forests runs a network of fungal threads, called mycorrhizae, that wrap around tree roots or grow into them. The relationship is an exchange. The fungi, which cannot make their own food, receive sugars that trees produce through photosynthesis. In return, their threads, far thinner and more numerous than roots, gather water and minerals such as phosphorus from a volume of soil the tree could never reach alone.</p>
<p>Because a single fungus can connect to many trees at once, researchers in the 1990s began to ask whether these networks also carry resources between trees. Experiments using carbon isotopes as tracers showed that they can: carbon fixed by one tree turned up in the roots of its neighbours. Popular accounts soon described a "wood-wide web" through which mother trees feed their seedlings and warn neighbours of insect attacks.</p>
<p>More recent reviews have urged caution. The amount of carbon moved between trees in most field studies is small, often a few percent of what a seedling needs, and it is not always clear whether it travels through fungal threads or through the soil. Moreover, the fungi are not neutral carriers. They move resources along whichever paths benefit the fungi themselves, which may or may not coincide with the needs of any tree. The underground network is real, and it is important to forest health, but the image of trees deliberately caring for one another goes well beyond the evidence.</p>` },
  },
  items: [
    it('lsat-rdi-001', 2, 'detail', 'According to the passage, what do the fungi receive from trees?',
      ['sugars produced by photosynthesis', 'water gathered by the roots', 'phosphorus from deep soil', 'carbon isotopes', 'protection from insects'],
      '<p>Paragraph 1: the fungi "receive sugars that trees produce through photosynthesis". Water and phosphorus go the other way, from fungi to trees.</p>', 'Reversing which partner gives what.'),
    it('lsat-rdi-002', 3, 'detail', 'The passage states that the experiments of the 1990s used carbon isotopes in order to',
      ['trace whether carbon fixed by one tree reached other trees', 'measure how fast trees grow', 'kill harmful fungi', 'count the fungal threads in a forest', 'show that seedlings make no carbon of their own'],
      '<p>The isotopes were "tracers": carbon fixed by one tree "turned up in the roots of its neighbours". That is tracing movement between trees.</p>'),
    it('lsat-rdi-003', 4, 'inference', 'It can be inferred from the passage that the authors of the "more recent reviews" would most likely agree that',
      ['some carbon may reach seedlings by routes other than fungal threads', 'mycorrhizal networks do not exist', 'trees deliberately send carbon to their offspring', 'seedlings get most of their carbon from neighbouring trees', 'fungi always act in the interest of the oldest tree'],
      '<p>The reviews say "it is not always clear whether it travels through fungal threads or through the soil", so they would accept that some may travel through soil. They do not deny the network exists ("The underground network is real").</p>'),
    it('lsat-rdi-004', 4, 'inference', 'The passage suggests that the popular "wood-wide web" accounts are flawed mainly because they',
      ['attribute purposes to trees that the evidence does not support', 'deny that fungi connect to more than one tree', 'are based on experiments without tracers', 'claim that fungi make their own food', 'ignore the role of phosphorus'],
      '<p>The last sentence says the image of trees "deliberately caring for one another goes well beyond the evidence". The flaw is reading intention into the network.</p>'),
    it('lsat-rdi-005', 5, 'application', 'Which one of the following findings would most clearly support the reviews\' point that the fungi are "not neutral carriers"?',
      ['Fungi send more carbon toward trees that supply them with more sugar, regardless of which trees most need it.', 'Seedlings in shade grow more slowly than seedlings in sun.', 'Fungal threads are thinner than tree roots.', 'Carbon isotopes are present in all living things.', 'Some forests have more fungal species than others.'],
      '<p>"Not neutral" means the fungi move resources to suit themselves. A finding that they favour the trees that feed them best, whatever the trees\' needs, shows exactly that.</p>'),
  ],
};
