// CUET Economics: employment, environment and sustainable development. Original questions for fibub.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from '../cuet-general-test/_cuet.js';
const T = { exams: ['cuet'], format: 'single' };
const P = [2, 0, 3, 1, 1, 3, 0, 2];
let k = 0;
const put = (c, w) => { const i = P[k++ % 8], o = [...w]; o.splice(i, 0, c); return { options: o, answer: i }; };
const mcq = (id, level, sub, q, c, w, sol, trap) => ({ id, type: 'mcq', level, sub, q, ...put(c, w), sol, ...(trap ? { trap } : {}), ...T });
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const asr = (id, level, sub, A, R, code, sol, trap) => ({ id, type: 'mcq', level, sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: code, sol, ...(trap ? { trap } : {}), exams: ['cuet'], format: 'assertion' });
const mat = (id, level, sub, L, R, c, w, sol) => ({ id, type: 'mcq', level, sub,
  q: `Match List I with List II.<b>List I</b><ul>${L.map((x) => `<li>${x}</li>`).join('')}</ul><b>List II</b><ul>${R.map((x) => `<li>${x}</li>`).join('')}</ul>`,
  ...put(c, w), sol, exams: ['cuet'], format: 'match' });
export default {
  topic: 'employment-environment',
  items: [
    mcq('ee-001', 1, 'employment', 'In economics a worker is', 'a person who takes part in economic activity to produce goods or services, for pay or profit', ['only a person in a factory', 'only a government employee', 'anyone who is above 18 years'],
      'Workers include the self-employed, regular salaried people and casual labourers, and also unpaid family helpers in family business.'),
    mcq('ee-002', 2, 'employment', 'In a village of 300 people, 120 are workers. The worker-population ratio is', '40%', ['2.5%', '25%', '60%'],
      'WPR = workers ÷ population × 100 = 120 ÷ 300 × 100 = <b>40%</b>.'),
    mcq('ee-003', 2, 'employment', 'In a labour force of 500 persons, 450 are employed and 50 are unemployed. The unemployment rate is', '10%', ['11.1%', '5%', '90%'],
      'Unemployment rate = unemployed ÷ labour force × 100 = 50 ÷ 500 × 100 = <b>10%</b>.',
      'The denominator is the labour force (workers + job seekers), not the total population.'),
    mcq('ee-004', 2, 'employment', 'In a population of 1,000, the labour force is 500. The labour force participation rate is', '50%', ['5%', '100%', '20%'],
      '500 ÷ 1,000 × 100 = <b>50%</b>. It includes both those who work and those looking for work.'),
    mcq('ee-005', 1, 'employment', 'A self-employed person is one who', 'runs their own business or farm', ['works for a company for a monthly salary', 'works for a daily wage', 'is unemployed'],
      'Self-employed people earn profit rather than a wage.'),
    mcq('ee-006', 1, 'employment', 'A regular salaried employee', 'works for others and gets a regular salary', ['runs his own shop', 'is paid daily by different employers', 'does not work'],
      'These workers are hired on a regular basis and get social benefits in many cases.'),
    mcq('ee-007', 1, 'employment', 'A casual wage labourer', 'works in others\' farms or enterprises and is paid on a daily basis, without regular employment', ['owns a large factory', 'is paid a fixed yearly salary', 'is a government clerk'],
      'Casual workers have no job security.'),
    mcq('ee-008', 2, 'employment', 'The formal sector in India consists of', 'all public sector establishments and private establishments with ten or more hired workers', ['all small shops', 'all farms', 'only foreign firms'],
      'Everything else is informal sector, where workers often lack social security and legal protection.'),
    mcq('ee-009', 2, 'employment', 'The majority of India\'s workers are employed in the', 'informal sector', ['formal sector', 'public sector', 'defence services'],
      'Most workers are in agriculture, small enterprises and casual jobs, which are informal.'),
    mcq('ee-010', 2, 'employment', 'Jobless growth means', 'GDP grows but employment hardly increases', ['employment grows without GDP growth', 'GDP falls and jobs rise', 'no growth in any area'],
      'It happens when output rises through technology or capital rather than through more workers.'),
    mcq('ee-011', 2, 'unemployment', 'Disguised unemployment means that', 'more workers are engaged in a job than needed, so some could leave without reducing output', ['workers wear disguises', 'workers are unemployed in the off season only', 'workers have been fired'],
      'It is common on small family farms, where extra family members add nothing to output.'),
    mcq('ee-012', 1, 'unemployment', 'Seasonal unemployment is', 'being without work in certain seasons, such as in the farming off-season', ['being unemployed throughout the year', 'being between two jobs', 'being retired'],
      'Many farm labourers find work only during sowing and harvesting.'),
    mcq('ee-013', 2, 'employment', 'Casualisation of the workforce means', 'a shift from regular salaried work to casual wage work', ['a shift from casual to regular work', 'a shift to factory jobs', 'increase in social security'],
      'It signals a decline in the quality of jobs.'),
    mcq('ee-014', 1, 'employment', 'MGNREGA stands for the Mahatma Gandhi National Rural Employment Guarantee Act, passed in', '2005', ['1950', '1969', '1991'],
      'The Act came in 2005 and gives rural households a legal right to work.'),
    mcq('ee-015', 2, 'employment', 'The main aim of MGNREGA is to', 'guarantee 100 days of wage employment a year to rural households whose adult members volunteer for unskilled manual work', ['give free land to all farmers', 'provide jobs only in cities', 'train engineers'],
      'It also builds durable assets such as ponds and roads, and aims to reduce distress migration.'),
    mcq('ee-016', 1, 'environment', 'The environment includes', 'all living and non-living things around us, such as air, water, land and plants', ['only forests', 'only buildings', 'only the sky'],
      'Environment is the total of surrounding biotic and abiotic things.'),
    mcq('ee-017', 2, 'environment', 'Which of the following is NOT a function of the environment?', 'Determining the exchange rate', ['Supplying resources', 'Absorbing waste', 'Sustaining life'],
      'The environment supplies resources, assimilates waste, sustains life and provides aesthetic services.'),
    mcq('ee-018', 2, 'environment', 'Absorptive capacity of the environment is', 'its ability to absorb degradation', ['its ability to produce food only', 'its size in square kilometres', 'its trading power'],
      'When waste goes beyond that capacity, pollution results.'),
    mcq('ee-019', 2, 'environment', 'If the rate of use of a renewable resource exceeds its rate of regeneration, the resource', 'will be depleted over time', ['will always increase', 'will become non-renewable never', 'is not affected'],
      'Overuse of fish stocks or forests faster than they regrow leads to exhaustion.'),
    mcq('ee-020', 1, 'environment', 'Global warming is', 'a rise in the earth\'s average temperature caused by greenhouse gases', ['a fall in the earth\'s temperature', 'a rise in rainfall', 'a decrease in population'],
      'Burning fossil fuels adds gases such as carbon dioxide that trap heat.'),
    mcq('ee-021', 2, 'environment', 'Depletion of the ozone layer is mainly caused by', 'chlorofluorocarbons (CFCs)', ['nitrogen from soil', 'sunlight', 'excess rain'],
      'CFCs from older refrigerators and sprays break down ozone.'),
    mcq('ee-022', 2, 'sustainable development', 'Sustainable development is development that', 'meets present needs without reducing the ability of future generations to meet their needs', ['maximises growth at any cost', 'bans all economic activity', 'is only for rich countries'],
      'This is the standard definition from the Brundtland report.'),
    mcq('ee-023', 2, 'sustainable development', 'The widely used definition of sustainable development appeared in the report', '"Our Common Future" of the Brundtland Commission, 1987', ['the Planning Commission report of 1950', 'the Mahalanobis report of 1956', 'the GATT agreement of 1947'],
      'The World Commission on Environment and Development, chaired by Gro Harlem Brundtland, published it.'),
    mcq('ee-024', 1, 'sustainable development', 'Which of the following is a strategy for sustainable development?', 'Using solar and wind energy', ['Burning more coal', 'Cutting forests faster', 'Dumping waste in rivers'],
      'Renewable energy, organic farming, CNG in public transport and traditional knowledge are examples.'),
    mcq('ee-025', 1, 'sustainable development', 'Which of the following is a non-conventional source of energy?', 'Wind power', ['Coal', 'Petroleum', 'Natural gas'],
      'Wind, solar, small hydro and biogas are non-conventional (renewable) sources.'),
    mcq('ee-026', 2, 'environment', 'A factory dumps waste into a river and villagers fall ill. This is an example of', 'a negative externality', ['a transfer payment', 'a positive externality', 'foreign investment'],
      'The cost is borne by people who are not part of the transaction.'),
    asr('ee-027', 2, 'environment', 'Environmental problems have an economic cost.', 'Environmental damage reduces health and productivity.', 0,
      'Both true; lower health and output are a cost, so R explains A.'),
    asr('ee-028', 2, 'employment', 'Casual workers are paid on a daily basis.', 'Self-employed people earn profit.', 1,
      'Both are true but R does not explain A.'),
    asr('ee-029', 2, 'employment', 'MGNREGA guarantees employment to unskilled rural workers.', 'It was passed in 1991.', 2,
      'A is true; R is false: it was passed in 2005 (1991 was the year of the economic reforms).'),
    asr('ee-030', 2, 'employment', 'A worker in the formal sector has no job security or social security.', 'Formal sector workers usually get social security benefits.', 3,
      'A is false; R is true.'),
    mat('ee-031', 2, 'employment', ['A. Self-employed', 'B. Regular salaried', 'C. Casual wage labourer', 'D. Unpaid family helper'], ['1. Works for a family enterprise and gets no pay', '2. Earns a daily wage without security', '3. Owns and runs the enterprise', '4. Gets a regular salary from an employer'],
      'A-3, B-4, C-2, D-1', ['A-4, B-3, C-2, D-1', 'A-3, B-4, C-1, D-2', 'A-2, B-4, C-3, D-1'],
      'Match the type of worker with the way they earn.'),
    mat('ee-032', 2, 'unemployment', ['A. Seasonal unemployment', 'B. Disguised unemployment', 'C. Open unemployment', 'D. Jobless growth'], ['1. Extra workers whose removal does not reduce output', '2. People willing to work who cannot find work', '3. Output rises but jobs do not', '4. No work in the off-season'],
      'A-4, B-1, C-2, D-3', ['A-1, B-4, C-2, D-3', 'A-4, B-1, C-3, D-2', 'A-2, B-1, C-4, D-3'],
      'Each term names a different cause or form of unemployment.'),
    mcq('ee-033', 3, 'employment', 'The population of a town is 2,000 and the worker-population ratio is 45%. The number of workers is', '900', ['450', '1,100', '9,000'],
      'Workers = 45% of 2,000 = 0.45 × 2,000 = <b>900</b>.'),
    mcq('ee-034', 2, 'employment', 'A high worker-population ratio, by itself, shows that', 'a large share of the population is engaged in economic activity', ['people are rich', 'there is no unemployment', 'the economy has no informal sector'],
      'It tells us the share of people working, not the quality of jobs or pay.',
      'A high WPR can include low-paid and informal work.'),
    mcq('ee-035', 2, 'sustainable development', 'Using public transport on CNG rather than diesel helps sustainable development because', 'it reduces air pollution', ['it raises air pollution', 'it increases fuel imports only', 'it lowers government revenue'],
      'CNG burns cleaner, as in the shift of buses in some cities.'),
  ],
  gens: [
    { id: 'ee-g01', type: 'mcq', level: 1, sub: 'employment', ...T,
      make(rng) {
        const pop = pick(rng, 200, 2000, 100), pc = choose(rng, [20, 25, 30, 40, 45, 50]), w = (pop * pc) / 100;
        const { options, answer } = shuffleOpts(rng, pc, [100 - pc, (pop / w) , pc + 10], (v) => `${fmt(v, 1)}%`);
        return { q: `A town has a population of ${fmt(pop, 0)}, of whom ${fmt(w, 0)} are workers. The worker-population ratio is`, options, answer, pop, w, pc,
          sol: steps('Worker-population ratio = workers ÷ population × 100.', `= ${fmt(w, 0)} ÷ ${fmt(pop, 0)} × 100 = <b>${pc}%</b>.`), trap: 'The denominator is the whole population.' };
      },
      verify: (p) => (`${fmt((p.w / p.pop) * 100, 1)}%` === p.options[p.answer] ? p.answer : -1) },
    { id: 'ee-g02', type: 'mcq', level: 2, sub: 'employment', ...T,
      make(rng) {
        const lf = pick(rng, 200, 1000, 100), pc = choose(rng, [4, 5, 8, 10, 20]), u = (lf * pc) / 100;
        const { options, answer } = shuffleOpts(rng, pc, [100 - pc, (u * 100) / (lf + u), pc * 2], (v) => `${fmt(v, 1)}%`);
        return { q: `The labour force of a region is ${fmt(lf, 0)} persons, of whom ${fmt(u, 0)} are unemployed. The unemployment rate is`, options, answer, lf, u, pc,
          sol: steps('Unemployment rate = unemployed ÷ labour force × 100.', `= ${fmt(u, 0)} ÷ ${fmt(lf, 0)} × 100 = <b>${pc}%</b>.`), trap: 'The labour force already includes the unemployed; do not add them again.' };
      },
      verify: (p) => (`${fmt((p.u / p.lf) * 100, 1)}%` === p.options[p.answer] ? p.answer : -1) },
    { id: 'ee-g03', type: 'mcq', level: 2, sub: 'employment', ...T,
      make(rng) {
        const pop = pick(rng, 500, 5000, 500), pc = choose(rng, [20, 30, 40, 45, 50]), w = (pop * pc) / 100;
        const { options, answer } = shuffleOpts(rng, w, [pop - w, pop / pc, w * 10], (v) => fmt(v, 0));
        return { q: `The population of a district is ${fmt(pop, 0)} and the worker-population ratio is ${pc}%. The number of workers is`, options, answer, pop, pc, w,
          sol: steps(`Workers = ${pc}% of ${fmt(pop, 0)}.`, `= ${pc / 100} × ${fmt(pop, 0)} = <b>${fmt(w, 0)}</b>.`), trap: 'Apply the percentage to the population.' };
      },
      verify: (p) => (fmt((p.pop * p.pc) / 100, 0) === p.options[p.answer] ? p.answer : -1) },
  ],
};
