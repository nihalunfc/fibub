// SAT Reading and Writing · Standard English conventions · verb tense and form. Original (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'conventions' };
const Q = 'Which choice completes the text so that it conforms to the conventions of Standard English?';
const it = (id, level, sub, text, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>${text}</p><p>${Q}</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'verb-forms',
  items: [
    it('sat-vf-001', 2, 'tense from time words', 'In 1928, Alexander Fleming ______ that mould had killed the bacteria growing in one of his dishes.',
      ['noticed', 'notices', 'will notice', 'has noticed'], '<p>"In 1928" places the event in the past, and the rest of the sentence ("had killed") is in the past too: <b>noticed</b>.</p>'),
    it('sat-vf-002', 3, 'present perfect', 'Since the new library opened three years ago, the number of children attending its reading clubs ______ every year.',
      ['has grown', 'grew', 'will grow', 'is growing'], '<p>"Since ... three years ago" describes something that started in the past and continues now. That calls for the present perfect: <b>has grown</b>.</p>'),
    it('sat-vf-003', 3, 'past perfect', 'By the time the rescue boat arrived, the stranded hikers ______ on the island for two days.',
      ['had waited', 'waited', 'have waited', 'wait'], '<p>Two past events: the waiting came first and was finished by the time the boat arrived. The earlier past event takes the past perfect: <b>had waited</b>.</p>'),
    it('sat-vf-004', 4, 'finite verb needed', 'The violin, crafted in Italy in the early 1700s and restored by a team of experts last spring, ______ at the concert hall on Friday.',
      ['will be played', 'being played', 'to be played', 'having been played'], '<p>Strip out the descriptive phrases: "The violin ______ at the concert hall on Friday." The sentence needs a main verb, and "Friday" points to the future: <b>will be played</b>. The other choices are not main verbs.</p>', 'Long descriptive phrases can hide that the sentence still has no main verb.'),
    it('sat-vf-005', 4, 'parallel verbs', 'Each morning the baker weighs the flour, ______ the dough by hand, and shapes the loaves before sunrise.',
      ['kneads', 'kneading', 'to knead', 'kneaded'], '<p>The three actions are a list and must match: "weighs", "<b>kneads</b>", "shapes", all present tense to fit "Each morning".</p>'),
  ],
};
