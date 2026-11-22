// SAT Reading and Writing · Standard English conventions · subject-verb agreement. Original sentences (fibub).
import { choose, shuffleOpts } from './_util.js';
const F = { section: 'rw', domain: 'conventions' };
const Q = 'Which choice completes the text so that it conforms to the conventions of Standard English?';
// [singular subject head, plural subject head, a phrase that sits between subject and verb, verb set [sing, plural, past-ish wrong, -ing]]
const SUBJ = [
  ['The collection', 'The collections', 'of handwritten letters from the early settlers', 'gives', 'give', 'giving', 'having given'],
  ['The study', 'The studies', 'of coral reefs near the two islands', 'suggests', 'suggest', 'suggesting', 'having suggested'],
  ['The leader', 'The leaders', 'of the volunteer firefighters in the valley towns', 'plans', 'plan', 'planning', 'having planned'],
  ['The map', 'The maps', 'showing the old trade routes across the desert', 'reveals', 'reveal', 'revealing', 'having revealed'],
  ['The flock', 'The flocks', 'of migrating geese that pass over the lake', 'returns', 'return', 'returning', 'having returned'],
  ['The report', 'The reports', 'on rising water levels in the coastal wetlands', 'warns', 'warn', 'warning', 'having warned'],
  ['The design', 'The designs', 'for the new bridges over the river', 'includes', 'include', 'including', 'having included'],
  ['The painting', 'The paintings', 'by the artist\'s many students', 'hangs', 'hang', 'hanging', 'having hung'],
  ['The recipe', 'The recipes', 'passed down through four generations of bakers', 'calls', 'call', 'calling', 'having called'],
  ['The telescope', 'The telescopes', 'built by the university\'s engineering students', 'tracks', 'track', 'tracking', 'having tracked'],
];
const REST = { gives: 'historians a vivid picture of daily life.', suggests: 'that warmer water slows their growth.', plans: 'to train new members every spring.', reveals: 'how goods moved between distant cities.', returns: 'each autumn to the same marshes.', warns: 'that several roads may flood within a decade.', includes: 'wide lanes for cyclists.', hangs: 'in the museum\'s main hall.', calls: 'for an unusual amount of cardamom.', tracks: 'faint objects at the edge of the solar system.' };

export default {
  topic: 'subject-verb-agreement',
  gens: [
    { id: 'sat-sv-g01', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'words between subject and verb', facets: F, format: 'single',
      make(r) {
        const s = choose(r, SUBJ), plural = r() < 0.5;
        const subj = plural ? s[1] : s[0], right = plural ? s[4] : s[3], wrong = plural ? s[3] : s[4];
        const o = shuffleOpts(r, right, [wrong, s[6], s[5]]);
        return { q: `<p>${subj} ${s[2]} ______ ${REST[s[3]]}</p><p>${Q}</p>`, ...o,
          sol: `<p>The verb must agree with the subject, <b>${subj.replace('The ', '').toLowerCase()}</b>, which is ${plural ? 'plural' : 'singular'}. The words "${s[2]}" sit between them and do not change it. So the verb is "<b>${right}</b>". A form like "${s[5]}" would leave the sentence with no main verb.</p>`,
          trap: `Matching the verb to the nearest noun in "${s[2]}" instead of to the real subject.` };
      } },
  ],
  items: [
    { id: 'sat-sv-001', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'compound subject', facets: F,
      q: `<p>The mayor and the city's chief engineer ______ the new flood barrier at a public meeting next week.</p><p>${Q}</p>`,
      options: ['will present', 'presents', 'is presenting', 'has presented'], answer: 0,
      sol: '<p>Two subjects joined by "and" make a plural subject, so singular forms ("presents", "is presenting", "has presented") are wrong. "Next week" also needs a future form: <b>will present</b>.</p>' },
    { id: 'sat-sv-002', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'each and every', facets: F,
      q: `<p>Each of the twelve new trails in the national park ______ a sign showing its length and difficulty.</p><p>${Q}</p>`,
      options: ['has', 'have', 'having', 'are having'], answer: 0,
      sol: '<p>The subject is "Each", which is singular; "of the twelve new trails" does not change it. So: <b>has</b>.</p>' },
    { id: 'sat-sv-003', type: 'mcq', marks: 1, level: 4, exams: ['sat'], sub: 'inverted order', facets: F,
      q: `<p>Beneath the floor of the ancient temple ______ a network of narrow tunnels that archaeologists mapped only in 2019.</p><p>${Q}</p>`,
      options: ['lies', 'lie', 'are lying', 'lying'], answer: 0,
      sol: '<p>The sentence is inverted: the subject comes after the verb. Ask "what lies beneath the floor?" A <i>network</i> (singular), so <b>lies</b>. "Tunnels" is inside the phrase "of narrow tunnels".</p>' },
    { id: 'sat-sv-004', type: 'mcq', marks: 1, level: 4, exams: ['sat'], sub: 'neither nor', facets: F,
      q: `<p>Neither the original blueprints nor the architect's own notebook ______ how the dome was supported during construction.</p><p>${Q}</p>`,
      options: ['explains', 'explain', 'explaining', 'have explained'], answer: 0,
      sol: '<p>With "neither ... nor", the verb agrees with the nearer subject: "notebook", singular. So <b>explains</b>.</p>' },
  ],
};
