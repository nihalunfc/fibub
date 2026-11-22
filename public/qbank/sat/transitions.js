// SAT Reading and Writing · Expression of ideas · transitions. Original sentences (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'expression' };
const it = (id, level, sub, text, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>Which choice completes the text with the most logical transition?</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'transitions',
  items: [
    it('sat-tr-001', 2, 'contrast', 'Polar bears look white, and most people assume their fur is white too. ______ each hair is actually clear and hollow; it only looks white because it scatters light.',
      ['In reality,', 'Similarly,', 'For example,', 'As a result,'], '<p>The second sentence corrects the assumption in the first: <b>In reality</b>. "Similarly" and "For example" would continue the same idea, and nothing here is a result.</p>'),
    it('sat-tr-002', 2, 'example', 'Some animals use tools to find food. ______ sea otters crack open shellfish by hitting them against stones balanced on their chests.',
      ['For instance,', 'However,', 'Instead,', 'In conclusion,'], '<p>Sea otters are a specific case of the general claim, so <b>For instance</b>.</p>'),
    it('sat-tr-003', 3, 'cause and effect', 'The factory switched from coal to solar power in 2019. ______ its yearly energy bill fell by nearly half.',
      ['As a result,', 'Nevertheless,', 'By contrast,', 'Meanwhile,'], '<p>The lower bill follows from the switch: <b>As a result</b>.</p>'),
    it('sat-tr-004', 3, 'concession', 'The first electric cars of the 1890s were quiet and easy to drive. ______ they could travel only short distances before their heavy batteries ran out, and petrol cars soon replaced them.',
      ['However,', 'Therefore,', 'Likewise,', 'Specifically,'], '<p>The second sentence gives a drawback that contrasts with the advantages in the first: <b>However</b>.</p>'),
    it('sat-tr-005', 4, 'sequence', 'To make paper by hand, workers first beat plant fibres into a pulp and stir it into water. ______ they dip a fine screen into the mixture and lift it out, leaving a thin, even layer of fibres to dry.',
      ['Next,', 'In contrast,', 'For example,', 'Still,'], '<p>The text describes steps in order, and the second sentence is the following step: <b>Next</b>.</p>'),
    it('sat-tr-006', 5, 'addition versus contrast', 'Urban trees cool city streets by shading pavement. ______ they cool the air through their leaves, releasing water vapour that absorbs heat as it evaporates.',
      ['Moreover,', 'Conversely,', 'Nonetheless,', 'Instead,'], '<p>The second sentence adds a second way trees cool the city, in the same direction as the first: <b>Moreover</b>. The other words signal contrast.</p>', 'Contrast words feel "sophisticated" but are wrong when the ideas agree.'),
  ],
};
