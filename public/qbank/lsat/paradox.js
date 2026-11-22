// LSAT · Logical Reasoning · Paradox (resolve the discrepancy). Every passage is original and written for fibub.
const F = { section: 'lr', qtype: 'paradox' };
const Q = 'Which one of the following, if true, most helps to resolve the apparent discrepancy described above?';
import { place } from './_util.js';
const it = (id, level, arg, options, answer, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], facets: F, format: 'single', q: `<p>${arg}</p><p>${Q}</p>`, options, answer, sol, trap });
export default {
  topic: 'paradox',
  items: [
    it('lsat-px-001', 2, 'After the city added a new lane to the highway, traffic jams on it became worse, not better.',
      ['The new lane was built quickly.', 'The extra lane made the highway more attractive, so many drivers who used to take other routes or the train switched to it.', 'Some drivers prefer the left lane.', 'Traffic jams are common in big cities.', 'The highway has speed cameras.'], 1,
      '<p>More room should mean less traffic. {B} explains the surprise: the extra room drew more drivers, so traffic grew to fill it. Both facts can now be true together.</p>', ''),
    it('lsat-px-002', 3, 'A hospital that is famous for treating heart disease has a higher death rate among its heart patients than a small local hospital nearby.',
      ['The famous hospital has more doctors.', 'The famous hospital takes the most serious heart cases from across the region, while the local hospital sends its serious cases there.', 'The local hospital is newer.', 'Some patients prefer smaller hospitals.', 'Heart disease is the leading cause of death.'], 1,
      '<p>The famous hospital treats far sicker patients, so more of them die even if its care is better. {B} explains how the excellent hospital can have a worse death rate.</p>', ''),
    it('lsat-px-003', 3, 'Sales of umbrellas in the city were higher in the dry summer than in the rainy spring.',
      ['Umbrellas are cheaper in summer.', 'In summer, many tourists buy umbrellas to shade themselves from the strong sun, and the city receives far more tourists in summer.', 'Most umbrellas last several years.', 'It rains in the city every month.', 'Umbrella shops close in winter.'], 1,
      '<p>{B} gives a second use for umbrellas (sun shade) and a large group of summer buyers (tourists). That explains high summer sales without rain. {A} could help a little, but price alone would not usually outweigh the need in rainy weather.</p>', ''),
    it('lsat-px-004', 4, 'In a region where wolves were brought back after decades away, the number of deer fell, yet the number of young aspen trees, which deer eat, rose sharply even in areas where deer numbers had not fallen much.',
      ['Wolves eat some plants.', 'With wolves around, deer avoid lingering in open valleys where aspens grow, even when the deer population is large.', 'Aspen trees grow slowly.', 'Deer numbers had been rising before the wolves returned.', 'Other animals also eat aspen.'], 1,
      '<p>The puzzle is that aspens recovered even where deer numbers stayed high. {B} explains it: deer change where they feed when wolves are present, so the aspens are eaten less without fewer deer.</p>', 'The answer must explain the part of the puzzle that seems odd, here the areas with many deer.'),
    it('lsat-px-005', 5, 'Since the factory introduced a bonus for every week without a reported injury, the number of reported injuries has fallen sharply. Yet the number of workers visiting the local clinic for work-related injuries has risen.',
      ['The clinic opened new hours.', 'Some workers stopped reporting injuries at work to protect the team\'s bonus, and had them treated at the clinic instead.', 'The factory hired more workers.', 'The bonus is paid weekly.', 'Most injuries at the factory are minor.'], 1,
      '<p>{B} explains both facts at once: injuries did not really fall; reporting at work fell because of the bonus, and the injuries showed up at the clinic instead. {C} helps a little with clinic visits but would not explain a sharp fall in reports.</p>', 'The best answer explains both sides of the discrepancy.'),
    it('lsat-px-101', 2, 'A city made its buses free to ride. Ridership rose sharply, yet the number of cars on the city’s roads did not fall.',
      ['Most new bus riders had previously walked or cycled rather than driven.', 'Buses produce less pollution per passenger than cars.', 'The city also bought new buses.', 'Some drivers dislike buses.', 'Fuel prices rose during the year.'], 0,
      '<p>If new riders came from walking and cycling, buses filled up without taking cars off the road. {A}. {E} would, if anything, push people out of cars, deepening the puzzle.</p>'),
    it('lsat-px-102', 3, 'Hospitals with the most experienced heart surgeons have higher death rates after heart surgery than hospitals with less experienced surgeons.',
      ['The most difficult and high-risk heart cases are usually sent to hospitals with the most experienced surgeons.', 'Experienced surgeons earn higher salaries.', 'Some hospitals have no heart surgeons.', 'Less experienced surgeons perform fewer operations.', 'Heart surgery has become safer over time.'], 0,
      '<p>If experienced surgeons take the riskiest patients, higher death rates reflect the patients, not worse care. {A}.</p>'),
    it('lsat-px-103', 4, 'After a country raised the tax on cigarettes, the government’s revenue from the cigarette tax increased, even though the number of cigarettes sold fell.',
      ['The tax rise per pack was large enough that the extra tax on each pack sold outweighed the drop in packs sold.', 'Some smokers switched to cheaper brands.', 'Smoking rates had been falling for years.', 'The government spent the revenue on health care.', 'Cigarettes are also sold in neighbouring countries.'], 0,
      '<p>Revenue = tax per pack × packs. A big enough rise in the first outweighs a fall in the second. {A}. {E} would suggest cross-border buying, making the puzzle worse.</p>'),
    it('lsat-px-104', 5, 'In a region where a disease spread by mosquitoes is common, villages that received free bed nets reported more cases of the disease in the following year than villages that did not.',
      ['Free bed nets were given first to the villages that had the highest rates of the disease before the programme began.', 'Bed nets can last several years.', 'Some villagers did not use their nets.', 'The disease is also found in other regions.', 'Mosquitoes bite mainly at night.'], 0,
      '<p>If the nets went to the worst-hit villages, they could still have more cases afterwards even if the nets helped. {A}. {C} explains only why the nets might not help, not why case counts were higher.</p>', 'Explaining only one side of the clash.'),
  ],
};
