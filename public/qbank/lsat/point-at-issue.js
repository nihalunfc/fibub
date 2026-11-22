// LSAT · Logical Reasoning · Point at issue (disagree / agree). Every dialogue is original and written for fibub.
const F = { section: 'lr', qtype: 'point-at-issue' };
import { place } from './_util.js';
const it = (id, level, arg, ask, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${ask}</p>`, options, answer, sol, trap });
const D = (a, b) => `The dialogue provides the most support for the claim that ${a} and ${b} disagree over whether`;
export default {
  topic: 'point-at-issue',
  items: [
    it('lsat-pi-001', 2, 'Omar: Our town should build a public pool. Swimming is excellent exercise, and many families cannot afford private clubs.<br>Beth: A pool would cost far more to run each year than the town can afford. The town should not build one.', D('Omar', 'Beth'),
      ['swimming is good exercise', 'the town should build a public pool', 'many families cannot afford private clubs', 'the pool would be expensive to build', 'exercise is important'], 1,
      '<p>Omar says the town should build a pool; Beth says it should not. Beth never challenges the exercise or affordability points, so we cannot say they disagree about those.</p>', 'A correct answer needs a view from both speakers.'),
    it('lsat-pi-002', 3, 'Ines: Remote work raises productivity, since workers save time on commuting.<br>Paul: Saving time on commuting is real, but many remote workers are interrupted more at home, so overall productivity does not rise.', D('Ines', 'Paul'),
      ['remote workers save time on commuting', 'remote work raises productivity', 'remote workers are interrupted at home', 'commuting is tiring', 'offices should close'], 1,
      '<p>Paul agrees that commuting time is saved ("is real") but denies that productivity rises. Ines claims it rises. So they disagree over {B} and agree on {A}.</p>', 'Watch for concessions: Paul agrees with {A}.'),
    it('lsat-pi-003', 4, 'Critic: The novel\'s ending is weak because it leaves the main mystery unsolved.<br>Writer: An unsolved mystery can be a strength. It leaves readers thinking about the story long after they finish it, which is what makes this ending powerful.', D('the critic', 'the writer'),
      ['the novel leaves the main mystery unsolved', 'the novel\'s ending is weak', 'readers think about the story after finishing it', 'all novels should solve their mysteries', 'the novel is popular'], 1,
      '<p>Both accept that the mystery is unsolved. The critic says this makes the ending weak; the writer says it makes the ending powerful. They disagree over whether the ending is weak. {D} goes beyond what the critic said about this novel.</p>', ''),
    it('lsat-pi-004', 5, 'Lena: The study proves that the reading programme works: children in it read better after a year.<br>Marco: Children read better after any year of school. Without a comparison group, the study does not show the programme made a difference, though it may well have.', D('Lena', 'Marco'),
      ['children in the programme read better after a year', 'the study shows that the reading programme made a difference', 'the reading programme does not work', 'children read better after a year of school', 'a comparison group is impossible to arrange'], 1,
      '<p>Marco accepts that the children improved and even says the programme "may well" have worked. He denies only that the study shows it. Lena says the study proves it. So they disagree over {B}. {C} is a trap: Marco never says the programme fails.</p>', ''),
    it('lsat-pi-101', 2, 'Lena: Schools should start later in the morning. Teenagers who get more sleep do better in class.<br>Dev: Starting later would push after-school sports and jobs into the evening. Schools should keep their current start times.', D('Lena', 'Dev'),
      ['schools should start later in the morning', 'teenagers who get more sleep do better in class', 'after-school sports are valuable', 'teenagers have after-school jobs', 'school buses are expensive'], 0,
      '<p>Lena says schools should start later; Dev says they should keep current times. {A}. Dev never disputes the sleep claim ({B}).</p>'),
    it('lsat-pi-102', 3, 'Aiko: The council’s plan to plant trees on Market Street will make the street more pleasant and attract shoppers.<br>Rafael: The trees will certainly make the street more pleasant. But shoppers choose where to go based on prices and parking, not trees.', D('Aiko', 'Rafael'),
      ['planting trees on Market Street will attract shoppers', 'trees will make Market Street more pleasant', 'shoppers care about prices', 'the council should plant trees', 'parking on Market Street is limited'], 0,
      '<p>Rafael agrees the trees will make the street pleasant but denies they will attract shoppers. {A}. {B} is a point of agreement.</p>', 'Choosing a point the second speaker concedes.'),
    it('lsat-pi-103', 4, 'Nadia: The museum should allow photography. Visitors who share photos online bring in new visitors, and modern cameras do not damage paintings.<br>Owen: Flash photography can fade some pigments over time, so allowing photography would put the collection at risk.', D('Nadia', 'Owen'),
      ['allowing photography would put the paintings at risk of damage', 'photos shared online bring in new visitors', 'the museum needs more visitors', 'some pigments are older than others', 'visitors enjoy taking photographs'], 0,
      '<p>Nadia says cameras do not damage paintings; Owen says photography risks fading. They clash on {A}. Owen says nothing about online sharing.</p>'),
    it('lsat-pi-104', 5, 'Grace: Because the new vaccine prevented infection in 90 percent of trial participants, it will greatly reduce infections once it is given to the public.<br>Hamid: The trial participants were all healthy adults. The public includes many older people and people with weak immune systems, in whom vaccines often work less well.', D('Grace', 'Hamid'),
      ['the trial results justify the prediction that the vaccine will greatly reduce infections in the public', 'the vaccine prevented infection in 90 percent of trial participants', 'vaccines often work less well in older people', 'the trial participants were healthy adults', 'the vaccine should be given to the public'], 0,
      '<p>Hamid accepts the trial result but questions whether it carries over to the public. The dispute is whether the trial supports Grace’s prediction, {A}. Hamid does not deny {B}.</p>'),
  ],
};
