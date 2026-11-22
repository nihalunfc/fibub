// LSAT · Logical Reasoning · Parallel reasoning and parallel flaw. Every argument is original and written for fibub.
const F = { section: 'lr', qtype: 'parallel' };
import { place } from './_util.js';
const it = (id, level, arg, ask, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${ask}</p>`, options, answer, sol, trap });
const P = 'Which one of the following arguments is most similar in its reasoning to the argument above?';
const PF = 'The flawed reasoning in which one of the following is most similar to that in the argument above?';
export default {
  topic: 'parallel-reasoning',
  items: [
    it('lsat-pa-001', 2, 'All members of the orchestra can read music. Tomas is a member of the orchestra. So Tomas can read music.', P,
      ['All cats are mammals. Rex is a mammal. So Rex is a cat.', 'Every nurse at the clinic is certified in first aid. Mira is a nurse at the clinic. So Mira is certified in first aid.', 'Some birds cannot fly. Penguins are birds. So penguins cannot fly.', 'Most doctors work long hours. Jun works long hours. So Jun is a doctor.', 'No fish can climb trees. Goldie cannot climb trees. So Goldie is a fish.'], 1,
      '<p>Pattern: all A are B; x is an A; so x is a B. {B} matches exactly and is valid. {A}, {D} and {E} reverse the direction; {C} uses "some", which does not give a sure conclusion about penguins.</p>', ''),
    it('lsat-pa-002', 3, 'If it rains, the match is cancelled. The match was cancelled. So it must have rained.', PF,
      ['If the oven is on, the kitchen is warm. The oven is not on. So the kitchen is not warm.', 'If a plant gets no water, it wilts. This plant wilted. So it got no water.', 'If the alarm sounds, people leave. The alarm sounded. So people left.', 'If a shop is open, its lights are on. Its lights are off. So it is closed.', 'Either the bus is late or I am early. I am not early. So the bus is late.'], 1,
      '<p>The original affirms the result to conclude the condition (if P then Q; Q; so P), which is invalid because something else could cause Q. {B} does the same: wilting could have another cause. {A} is a different flaw (denying the condition). {C} and {D} are valid.</p>', 'Match the flaw, not the topic.'),
    it('lsat-pa-003', 3, 'Most residents of Maple Street have gardens. Most residents of Maple Street have dogs. So some residents of Maple Street have both a garden and a dog.', P,
      ['Most students in the class passed the test. Most students in the class like maths. So some students in the class passed and like maths.', 'Most students passed the test. So most students like maths.', 'Some students passed the test. Some students like maths. So some students passed and like maths.', 'All students passed the test. So some students like maths.', 'Most students passed. Few students like maths. So no student both passed and likes maths.'], 0,
      '<p>Two "mosts" about the same group must overlap, so the original is valid. {A} has exactly the same structure. {C} uses two "somes", which do not have to overlap.</p>', ''),
    it('lsat-pa-004', 4, 'The new phone model sold out in its first week, so it must be the best phone on the market.', PF,
      ['The film earned more on its opening weekend than any other film this year, so it must be the best film of the year.', 'The bakery sold out of bread by noon, so it should bake more bread.', 'The museum was crowded on Saturday, so it will be crowded on Sunday.', 'This car is the fastest in its class, so it will sell well.', 'The restaurant has excellent reviews, so it is probably good.'], 0,
      '<p>The original treats popularity (selling out) as proof of quality (best on the market). {A} makes the same leap from box-office success to "best film". {E} is a reasonable inference from reviews about quality, not a popularity-to-quality leap.</p>', ''),
    it('lsat-pa-005', 5, 'Only those who finish the course receive a certificate. Dana did not finish the course, so Dana will not receive a certificate.', P,
      ['Only ticket holders may enter the hall. Lee has a ticket, so Lee will enter the hall.', 'Only licensed drivers may rent a car. Ravi is not a licensed driver, so Ravi may not rent a car.', 'Anyone with a ticket may enter. Lee has no ticket, so Lee may not enter.', 'Only members may vote. Some members did not vote. So some members are not eligible.', 'Every runner who finishes gets a medal. Kim got a medal, so Kim finished.'], 1,
      '<p>"Only those who finish get a certificate" means certificate → finished. Dana did not finish, so no certificate (the valid contrapositive). {B} is the same: rent → licensed; not licensed, so cannot rent. {A} reverses the rule; {C} denies the condition of a plain "if" rule, which is invalid.</p>', '"Only X" puts X after the arrow.'),
  ],
};
