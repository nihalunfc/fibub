// SAT Reading and Writing · Information and ideas · inferences ("most logically completes the text"). Original (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'info' };
const it = (id, level, sub, text, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>Which choice most logically completes the text?</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'inferences',
  items: [
    it('sat-in-001', 2, 'complete the logic', 'Glass frogs have see-through skin on their bellies. While they sleep, about 90% of their red blood cells gather in the liver, which is covered by a reflective layer. Because red blood cells are what make blood visible, this suggests that ______',
      ['hiding the blood cells helps the sleeping frogs become even harder for predators to see.', 'glass frogs need more oxygen while sleeping than while awake.', 'the liver of the glass frog is larger than that of other frogs.', 'glass frogs sleep only during the day.'],
      '<p>The text sets up: see-through bodies, red cells hidden while asleep, red cells are what make blood visible. The conclusion that follows is that hiding them makes the frogs harder to see. The other choices bring in ideas the text does not support.</p>'),
    it('sat-in-002', 3, 'complete the logic', 'In one experiment, chimpanzees were given a choice between a tool that would get them food immediately and a token they could trade for a better tool an hour later. Many chimpanzees chose the token and kept it until they could trade it. These results suggest that chimpanzees ______',
      ['can plan for future needs rather than acting only on what they want right now.', 'prefer tokens to food.', 'cannot tell the difference between tools.', 'are unable to wait for rewards.'],
      '<p>Choosing a token for a better tool later, and keeping it, shows planning ahead. The last option is the opposite; the others are not supported.</p>'),
    it('sat-in-003', 4, 'complete the logic', 'Historians once thought a medieval trade route through the mountains was used only in summer, because snow blocked the passes in winter. But coins found at a village along the route include some minted in December and January of several different years, and the village\'s records list winter deliveries of salt. Thus, ______',
      ['the route was probably used in at least some winters too.', 'the passes never received any snow.', 'the coins were brought to the village in summer.', 'salt was the only good carried on the route.'],
      '<p>Winter-dated coins and records of winter deliveries both point to winter travel. That challenges the old view. The second option goes too far; the third ignores the delivery records.</p>', 'Choosing an extreme version of the right idea.'),
    it('sat-in-004', 5, 'complete the logic', 'A plant called the Venus flytrap closes its trap only when a trigger hair is touched twice within about 20 seconds. A single touch, such as from a falling raindrop, does not close the trap. Closing takes energy, and reopening takes about a day. The two-touch rule therefore most likely helps the plant ______',
      ['avoid wasting energy closing on things that are not prey.', 'catch larger insects than other plants can.', 'grow faster in rainy weather.', 'attract insects with its smell.'],
      '<p>A raindrop touches once; a moving insect touches again. Requiring two touches means the trap closes mostly on live prey, so the costly closing is not wasted. Nothing in the text is about size, growth or smell.</p>'),
  ],
};
