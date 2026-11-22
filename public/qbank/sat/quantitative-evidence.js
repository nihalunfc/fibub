// SAT Reading and Writing · Information and ideas · command of evidence (quantitative: tables and graphs). Original data (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'info' };
const it = (id, level, sub, text, ask, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `${text}<p>${ask}</p>`, options, answer: 0, sol, trap });
const T = (head, rows) => `<table class="qb-table"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td>${c}</td>` : `<th>${c}</th>`)).join('')}</tr>`).join('')}</table>`;
export default {
  topic: 'quantitative-evidence',
  items: [
    it('sat-qe-001', 2, 'table', T(['Year', 'Bicycles counted per day on Bridge Street'], [['2022', '410'], ['2023', '690'], ['2024', '1,140']]) + '<p>A city added a protected bike lane on Bridge Street at the start of 2023. A planner claims that the lane encouraged more people to cycle on the street.</p>', 'Which choice most effectively uses data from the table to support the claim?',
      ['The number of bicycles counted per day rose from 410 in 2022 to 690 in 2023 and 1,140 in 2024.', 'In 2022, 410 bicycles per day were counted on Bridge Street.', 'The number of bicycles counted in 2024 was 1,140.', 'Bicycles were counted on Bridge Street in three different years.'],
      '<p>The claim is about a change after the lane opened, so the best evidence compares before (2022) with after (2023 and 2024). The other choices give a single number, which cannot show a change.</p>'),
    it('sat-qe-002', 3, 'table', T(['Tomato variety', 'Average yield (kg per plant)', 'Days to first ripe fruit'], [['Redstar', '4.2', '75'], ['Early Gold', '2.9', '58'], ['Longkeeper', '3.6', '82']]) + '<p>A gardener in a region with a short summer wants a variety that produces ripe fruit as early as possible, even if it yields less.</p>', 'Which choice best describes data from the table that support choosing Early Gold?',
      ['Early Gold produces its first ripe fruit in 58 days, sooner than either of the other varieties.', 'Early Gold has the lowest average yield, 2.9 kg per plant.', 'Redstar has the highest average yield, 4.2 kg per plant.', 'Longkeeper takes 82 days to produce its first ripe fruit.'],
      '<p>The gardener cares about speed. Early Gold\'s 58 days is the fastest, which is the reason to choose it. Its low yield is true but is a reason against it, not for it.</p>', 'Picking a true number that does not answer the question asked.'),
    it('sat-qe-003', 4, 'graph described in text', '<p>A survey asked students how many hours a week they spend reading for fun. Among students who own a library card, 46% read 3 or more hours a week; among students without one, 21% do. The researcher concludes that owning a library card is associated with reading more for fun.</p>', 'Which statement about the survey, if true, would make the researcher\'s conclusion most precise and accurate?',
      ['The comparison shows a link between having a library card and reading more, not that the card itself causes the reading.', 'Having a library card makes students read more than twice as much.', 'All students with library cards read 3 or more hours a week.', 'Students without library cards never read for fun.'],
      '<p>The data compare two groups, so they show an association. The second option claims a cause and misreads the percentages; the last two contradict the numbers (46% is not "all", 21% is not "never").</p>'),
  ],
};
