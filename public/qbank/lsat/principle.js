// LSAT · Logical Reasoning · Principle (justify and conform). Every argument is original and written for fibub.
const F = { section: 'lr', qtype: 'principle' };
import { place } from './_util.js';
const it = (id, level, q, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q, options, answer, sol, trap });
const J = 'Which one of the following principles, if valid, most helps to justify the reasoning above?';
export default {
  topic: 'principle',
  items: [
    it('lsat-pr-001', 2, `<p>Priya promised to help her neighbour move on Saturday. On Friday, a friend offered her a free concert ticket for Saturday. Priya should still help her neighbour.</p><p>${J}</p>`,
      ['People should always do what makes them happiest.', 'A promise should be kept unless keeping it would cause serious harm, and missing a concert is not serious harm.', 'Neighbours should help one another whenever they can.', 'Free gifts should never be refused.', 'Concerts are less important than moving house.'], 1,
      '<p>The reasoning says Priya should keep her promise even though something better came up. {B} states a rule that covers exactly that case, including why the concert is not an exception. {C} is broader but does not explain why the promise wins.</p>', ''),
    it('lsat-pr-002', 3, `<p>The city should not approve the new tower. Although it would add three hundred homes, it would block sunlight from the only public park in the neighbourhood for most of the afternoon.</p><p>${J}</p>`,
      ['New housing should be approved whenever it adds more than a hundred homes.', 'A building should not be approved if it would significantly reduce the use or enjoyment of a public space that has no nearby substitute.', 'Tall buildings are always harmful to neighbourhoods.', 'Parks are more important than housing in every case.', 'The city should build more parks.'], 1,
      '<p>{B} fits the facts precisely: significant loss of enjoyment (afternoon shade) of a public space with no substitute (the only park). {D} is too extreme. {A} would point the other way.</p>', 'Prefer the principle that covers the case without going too far.'),
    it('lsat-pr-003', 3, '<p>Principle: An employer should not ask job applicants about matters that have no bearing on whether they can do the job.</p><p>Which one of the following judgments most closely conforms to the principle?</p>',
      ['A bakery should not ask applicants for a delivery driver job whether they have a driving licence.', 'A software firm should not ask applicants for a programming job what their favourite sport is.', 'A hospital should ask nurse applicants about their training.', 'A school may ask teacher applicants about their teaching experience.', 'A shop should ask applicants whether they can work weekends if the job includes weekend shifts.'], 1,
      '<p>The principle forbids questions with no bearing on the job. Favourite sport has nothing to do with programming, so {B} applies the principle. {C}, {D} and {E} are about questions that do bear on the job, so the principle says nothing against them; {A} gets it backwards.</p>', ''),
    it('lsat-pr-004', 4, `<p>Editor: The newspaper should print the leaked report. It shows that the water authority hid test results showing unsafe lead levels, and residents need that information to protect their health, even though the authority asked us not to publish.</p><p>${J}</p>`,
      ['Newspapers should print any document they obtain.', 'Information that people need to protect their health should be made public even when the body that holds it objects.', 'Leaked documents are usually accurate.', 'A newspaper\'s first duty is to its readers\' entertainment.', 'Public bodies should never keep test results private.'], 1,
      '<p>The editor\'s reason is that residents need the information for their health, and that this beats the authority\'s objection. {B} states that rule. {A} and {E} are broader than the reasoning needs and would justify much more.</p>', ''),
    it('lsat-pr-005', 5, '<p>Principle: It is unfair to judge someone\'s decision by an outcome that they could not have foreseen when they made it.</p><p>The principle most supports which one of the following?</p>',
      ['A coach should be blamed for choosing a player who was injured in a fall on the way to the game.', 'A hiker who set out after a forecast of clear skies should not be criticised for being caught in a sudden, unforecast storm.', 'A driver who ignored a road-closed sign should not be blamed for getting stuck.', 'An investor who bought shares should be praised if the shares rose.', 'A student should be judged only by exam results.'], 1,
      '<p>The hiker could not have foreseen an unforecast storm, so judging the decision by that outcome is unfair, which is what {B} says. In {C} the risk was foreseeable (there was a sign). {A} goes against the principle.</p>', ''),
  ],
};
