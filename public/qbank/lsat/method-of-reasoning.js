// LSAT · Logical Reasoning · Method of reasoning ("proceeds by"). Every argument is original and written for fibub.
const F = { section: 'lr', qtype: 'method' };
import { place } from './_util.js';
const it = (id, level, arg, ask, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${ask}</p>`, options, answer, sol, trap });
const P = 'The argument proceeds by';
export default {
  topic: 'method-of-reasoning',
  items: [
    it('lsat-mr-001', 2, 'Some say that tomatoes are vegetables. But botanists define a fruit as the part of a plant that grows from the flower and holds the seeds, and tomatoes do exactly that. So tomatoes are fruit.', P,
      ['citing an expert\'s personal opinion', 'applying a definition to a particular case', 'drawing an analogy between two different things', 'showing that a view leads to a contradiction', 'generalising from a few examples'], 1,
      '<p>The argument gives the botanical definition of fruit and shows tomatoes meet it. That is applying a definition to a case.</p>', ''),
    it('lsat-mr-002', 3, 'Kai: Sugar taxes are pointless, because people will just buy sugary drinks anyway. Ana: When one country added a sugar tax, sales of sugary drinks fell by a quarter within two years.', 'Ana responds to Kai by',
      ['questioning Kai\'s motives', 'offering evidence that conflicts with the assumption behind Kai\'s claim', 'agreeing with Kai\'s conclusion but for a different reason', 'pointing out that Kai uses a word in two senses', 'claiming that sugar is harmless'], 1,
      '<p>Kai assumes the tax does not change buying. Ana gives a real case where buying fell, which counts against that assumption.</p>', ''),
    it('lsat-mr-003', 3, 'If the museum\'s claim were right that the vase is from the tenth century, it would have to be made with a glaze that, according to chemists, was not invented until the fourteenth century. So the vase cannot be from the tenth century.', P,
      ['showing that a claim, if true, would lead to something known to be false', 'appealing to the popularity of a view', 'questioning the reliability of chemists', 'proposing a new explanation for an old fact', 'arguing that because something is possible it is likely'], 0,
      '<p>The argument supposes the claim is true, shows it leads to an impossibility (a glaze that did not exist yet), and rejects the claim. That is reduction to the absurd.</p>', ''),
    it('lsat-mr-004', 4, 'Just as a gardener must pull weeds before they spread, a city must fix small problems like broken streetlights before they lead to larger decline. So the city should repair its streetlights promptly.', P,
      ['using a comparison with a similar situation to support a recommendation', 'citing statistics about crime', 'rejecting an alternative as impossible', 'appealing to an authority on city planning', 'showing that a claim contradicts itself'], 0,
      '<p>The argument compares the city to a garden and uses what is true of weeds to support a recommendation about streetlights. That is reasoning by analogy.</p>', ''),
    it('lsat-mr-005', 5, 'Researcher: The decline in local bee numbers has been blamed on a new pesticide. Yet bees have declined just as much in areas where the pesticide was never used, and bee numbers have also fallen in the many years before the pesticide was introduced. Something else must be the main cause.', 'The researcher\'s argument proceeds by',
      ['showing that the proposed cause is present in cases where the effect is absent', 'showing that the effect occurs where the proposed cause is absent', 'proving that a different cause is responsible', 'arguing that the pesticide is harmless to all insects', 'questioning the accuracy of bee counts'], 1,
      '<p>The researcher points to places and times where bees declined without the pesticide. Effect without the cause weakens the causal claim. {A} is the reverse pattern (cause without effect). {C} goes too far: the researcher never names the other cause.</p>', '{A} and {B} describe opposite patterns; read them carefully.'),
  ],
};
