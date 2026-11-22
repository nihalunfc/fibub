// Multi-Source Reasoning: sets of two or three tabs (all made up for practice) with several questions each.
const E = ['gmat'];
const tab = (name, html) => `<p class="qb-gtitle">${name}</p>${html}`;
export default {
  topic: 'msr',
  groups: {
    m1: { title: 'Set 1: A delivery firm', passage:
      tab('Tab 1: Delivery policy', '<p>Standard delivery arrives within 5 working days of the order. Express delivery arrives within 2 working days and costs 12 dollars more than standard. If a parcel arrives later than promised, the customer may claim back the full delivery charge.</p>') +
      tab('Tab 2: Email from the operations manager, 3 March', '<p>Because the northern depot is closed for repairs until 30 April, standard parcels to the North region are now taking about 7 working days. Express parcels to the North are not affected, because they travel by a different route. Please warn North customers who choose standard delivery.</p>') +
      tab('Tab 3: Parcels sent in February', '<table class="qb-match"><tr><th>Region</th><th>Parcels</th><th>Share sent express</th></tr><tr><td>North</td><td>4,000</td><td>15%</td></tr><tr><td>South</td><td>6,000</td><td>10%</td></tr><tr><td>East</td><td>5,000</td><td>20%</td></tr><tr><td>West</td><td>5,000</td><td>25%</td></tr></table>') },
    m2: { title: 'Set 2: A research grant', passage:
      tab('Tab 1: Grant rules', '<p>A city fund gives research grants of up to 50,000 dollars. Applicants must be based in the city. A project must finish within 18 months. At least 20% of the money must be spent on work that involves the public, such as workshops or open data.</p>') +
      tab('Tab 2: Note from the fund manager', '<p>This year we received 40 applications and can fund about 10. Panels have told us they favour projects that publish their data openly, and that they rarely fund projects asking for the full 50,000 dollars unless the budget is explained line by line.</p>') +
      tab('Tab 3: Three applications', '<table class="qb-match"><tr><th>Project</th><th>Amount asked</th><th>Length</th><th>Public share</th><th>Open data?</th></tr><tr><td>River sensors</td><td>48,000</td><td>12 months</td><td>25%</td><td>Yes</td></tr><tr><td>School gardens</td><td>30,000</td><td>20 months</td><td>40%</td><td>Yes</td></tr><tr><td>Bus timing</td><td>50,000</td><td>15 months</td><td>15%</td><td>No</td></tr></table>') },
  },
  items: [
    { id: 'msr-001', type: 'mcq', level: 2, exams: E, format: 'msr', group: 'm1', sub: 'single choice',
      q: '<p>A customer in the North region orders standard delivery on 10 March. Based on the information, which is most likely?</p>',
      options: ['The parcel arrives within 5 working days.', 'The parcel arrives in about 7 working days, and the customer may claim back the delivery charge.', 'The parcel arrives in 2 working days.', 'The parcel cannot be sent until 30 April.', 'The customer must pay 12 dollars extra.'],
      answer: 1,
      sol: '<p>Tab 2: North standard parcels take about 7 working days until 30 April. Tab 1: a parcel later than promised (5 days) lets the customer claim back the delivery charge. B joins the two tabs.</p><p>A is the policy, which the email says is not being met. C is express. D misreads the depot date. E applies only to express.</p>' },
    { id: 'msr-002', type: 'msq', level: 3, exams: E, format: 'msr', group: 'm1', sub: 'yes or no',
      q: '<p>Select every statement that is supported by the information.</p>',
      options: ['In February, more parcels were sent express to the East than to the North.', 'In February, the West sent more express parcels than any other region.', 'Express parcels to the North in March should still arrive within 2 working days.', 'Altogether, more than a fifth of February\'s parcels were sent express.'],
      answer: [0, 1, 2],
      sol: '<ol><li><b>Yes.</b> East: 20% of 5,000 = 1,000. North: 15% of 4,000 = 600.</li><li><b>Yes.</b> West: 25% of 5,000 = 1,250; South: 600; East: 1,000; North: 600.</li><li><b>Yes.</b> Tab 2: express to the North is not affected.</li><li><b>No.</b> Express total = 600 + 600 + 1,000 + 1,250 = 3,450 out of 20,000 = 17.25%, less than a fifth (20%).</li></ol>',
      trap: 'Statement 4: do not average the four percentages (17.5%); weight them by the number of parcels.' },
    { id: 'msr-003', type: 'mcq', level: 3, exams: E, format: 'msr', group: 'm1', sub: 'single choice',
      q: '<p>If, during March, North customers who would have chosen standard delivery all switched to express, and North sent the same number of parcels as in February, about how much extra would North customers pay in delivery charges in March compared with February?</p>',
      options: ['7,200 dollars', '40,800 dollars', '48,000 dollars', '4,080 dollars', '12,000 dollars'],
      answer: 1,
      sol: '<p>In February 85% of 4,000 = 3,400 North parcels went standard. If all switch, each pays 12 dollars more: 3,400 × 12 = 40,800 dollars.</p><p>C uses all 4,000 parcels, but 600 were already express. A uses the 600 express parcels.</p>' },
    { id: 'msr-004', type: 'msq', level: 3, exams: E, format: 'msr', group: 'm2', sub: 'yes or no',
      q: '<p>Select every application in Tab 3 that meets <b>all</b> of the grant rules in Tab 1 (assume every applicant is based in the city).</p>',
      options: ['River sensors', 'School gardens', 'Bus timing'],
      answer: [0],
      sol: '<ol><li><b>Meets the rules.</b> 48,000 ≤ 50,000; 12 ≤ 18 months; public share 25% ≥ 20%.</li><li><b>Does not.</b> 20 months is longer than 18.</li><li><b>Does not.</b> Public share 15% is below 20%.</li></ol>' },
    { id: 'msr-005', type: 'mcq', level: 3, exams: E, format: 'msr', group: 'm2', sub: 'single choice',
      q: '<p>Based on the fund manager\'s note, which change would most improve the Bus timing project\'s chance of being funded, apart from meeting the rules?</p>',
      options: ['Making the project longer', 'Asking for less than the full amount, or explaining the budget line by line, and publishing its data openly', 'Applying again next year', 'Adding a second project to the same application', 'Reducing the public share further'],
      answer: 1,
      sol: '<p>Tab 2 says panels favour open data and rarely fund full-amount requests without a line-by-line budget. Bus timing asks for exactly 50,000 dollars and has no open data. B addresses both.</p><p>A and E would break the rules; C and D are not supported.</p>' },
    { id: 'msr-006', type: 'mcq', level: 2, exams: E, format: 'msr', group: 'm2', sub: 'single choice',
      q: '<p>About what share of this year\'s applications can the fund support?</p>',
      options: ['About one in four', 'About one in ten', 'About half', 'About one in forty', 'All of them'],
      answer: 0,
      sol: '<p>Tab 2: about 10 funded out of 40 applications: 10 ÷ 40 = 1/4.</p>' },
  ],
};
