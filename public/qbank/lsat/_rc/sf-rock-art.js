// LSAT RC passage (natural science and archaeology): dating rock paintings. Original, written for fibub.
import { rc } from './h.js';
const it = rc('p3');
export default {
  group: 'p3',
  passage: { title: 'Passage: how old is a painting on stone?', passage: `<p>Paintings on the walls of caves and rock shelters are among the oldest surviving works of human art, but determining their age has proved stubbornly difficult. Many were made with mineral pigments such as red ochre, which contain no carbon and so cannot be dated by the radiocarbon method that archaeologists use for bone, charcoal and wood. For a long time, the ages assigned to such paintings rested largely on style: images that resembled others of known age were assumed to be roughly contemporary with them.</p>
<p>Stylistic dating has obvious weaknesses. Styles can persist for long periods or be revived, and two images that look alike to modern eyes may have been made thousands of years apart. A more direct approach became possible when researchers began to exploit thin mineral crusts that form over some paintings as water seeps across the rock. These crusts, made largely of calcite, contain tiny amounts of uranium, which decays at a known rate into thorium. Because the crust starts with almost no thorium, the ratio of the two elements indicates how long ago the crust formed.</p>
<p>The method has an important limitation that its results must be read with: it dates the crust, not the paint. Since a crust can form only on top of a painting that already exists, its age gives a minimum age for the painting beneath it. The painting could be much older; the method cannot say by how much. A further complication is that water can wash uranium out of a crust after it forms, which would make the crust appear older than it is. Researchers try to guard against this by sampling several layers of a crust, expecting the ages to increase steadily from the outer layers to the inner ones; a sequence that does not do so suggests the crust has been disturbed.</p>
<p>Applied carefully, the method has produced surprising results. Some paintings once assumed, on stylistic grounds, to be relatively recent have proved to lie beneath crusts many tens of thousands of years old. These findings have unsettled the view that sophisticated cave art arose first in one region and spread outward. They suggest instead that the practice of painting on stone may be older and more widespread than was once believed, though, given the method’s limits, how much older remains an open question.</p>` },
  items: [
    it('lsat-rsf-301', 3, 'function of a paragraph', 'The third paragraph functions primarily to',
      ['explain the limits of the dating method and how researchers try to reduce one source of error', 'describe the chemistry of red ochre', 'present the surprising results of the method', 'argue that stylistic dating should be preferred', 'introduce the radiocarbon method'],
      '<p>P3: the method dates the crust, not the paint (a minimum age), and uranium can wash out, which multi-layer sampling checks. {A}. Results come in P4.</p>'),
    it('lsat-rsf-302', 3, 'detail', 'According to the passage, mineral pigments such as red ochre cannot be dated by radiocarbon because they',
      ['contain no carbon', 'are covered by crusts', 'contain uranium', 'were applied too recently', 'wash away in water'],
      '<p>Paragraph 1: they "contain no carbon and so cannot be dated by the radiocarbon method". {A}.</p>'),
    it('lsat-rsf-303', 4, 'inference', 'If a crust over a painting is dated to 40,000 years ago, which one of the following can be concluded from the passage?',
      ['The painting is at least about 40,000 years old, assuming the crust has not been disturbed.', 'The painting is exactly 40,000 years old.', 'The painting is less than 40,000 years old.', 'The painting was made with charcoal.', 'The painting’s style must be very old.'],
      '<p>A crust "can form only on top of a painting that already exists", so its age is a minimum. {A}. The painting "could be much older", so {B} and {C} fail.</p>'),
    it('lsat-rsf-304', 4, 'function', 'The author mentions that ages should increase steadily from outer to inner layers in order to',
      ['describe a check researchers use to detect crusts disturbed by water', 'show that the outer layers are older than the inner ones', 'explain why red ochre contains no carbon', 'argue that the method gives the exact age of paint', 'show that stylistic dating is unreliable'],
      '<p>"A sequence that does not do so suggests the crust has been disturbed." {A}. {B} reverses the order.</p>'),
    it('lsat-rsf-305', 5, 'author’s attitude', 'The author’s attitude toward the new findings in the last paragraph is best described as',
      ['interested in their implications while cautious about how precisely they date the art', 'certain that they prove cave art began in one region', 'dismissive, because the method has limits', 'indifferent to their significance', 'convinced they show the exact age of the earliest paintings'],
      '<p>The findings "unsettled" an older view and "suggest" art is older and more widespread, "though ... how much older remains an open question". {A}.</p>'),
    it('lsat-rsf-306', 5, 'weaken', 'Which one of the following, if true, would most undermine a conclusion drawn from a crust’s uranium-thorium date?',
      ['Samples from that crust gave ages that were older in the outer layers than in the inner layers.', 'The painting beneath the crust resembles paintings found elsewhere.', 'The painting was made with red ochre.', 'The crust is made largely of calcite.', 'The cave also contains charcoal that can be radiocarbon dated.'],
      '<p>Ages should increase toward the inner layers; a reversed sequence "suggests the crust has been disturbed", so the date is unreliable. {A}.</p>'),
  ],
};
