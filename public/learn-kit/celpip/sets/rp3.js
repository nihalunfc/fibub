// CELPIP-style Reading Part 3: Reading for Information (lesson 3.4). Original texts and statements by fibub.
// Each statement comes from one paragraph (A to D) or from none (E, not given). Answers are typed as one letter.
const texts = {
  i1: { title: 'Read the article. Decide which paragraph (A, B, C or D) each statement comes from. Type E if the information is not given.', passage: '<p><b>Bees on the Rooftops</b></p><p><b>A.</b> Ten years ago, almost nobody in Canadian cities kept bees. Today, hives sit on hotel roofs in Toronto, on community gardens in Winnipeg and in backyards across Halifax. Most cities now allow beekeeping, but the rules differ widely. Some require hives to be a set distance from the property line, while others ask beekeepers to register each hive with the province.</p><p><b>B.</b> Supporters say urban hives help more than honey lovers. Bees pollinate fruit trees and vegetable gardens, and several community gardens report bigger harvests of squash and beans since hives arrived. Hotels and offices also use their rooftop honey in restaurants and as gifts, which gives them a story to tell customers.</p><p><b>C.</b> Not everyone is pleased. Some scientists warn that too many honeybees in one area may compete with wild bees for flowers. Canada has more than 800 kinds of native bees, and most of them live alone and nest in the ground. When flowers are limited, honeybees, which travel in large groups, can take most of the pollen and nectar.</p><p><b>D.</b> For people who want to help pollinators without keeping a hive, experts offer simple advice. Plant native flowers that bloom at different times from spring to fall, leave a small patch of bare soil for ground-nesting bees, and avoid spraying chemicals on lawns. Even a few pots on a balcony can make a difference.</p>' },
  i2: { title: 'Read the park guide. Decide which paragraph (A, B, C or D) each statement comes from. Type E if the information is not given.', passage: '<p><b>Winter Camping at Silver Pine Provincial Park</b></p><p><b>A.</b> Silver Pine is one of the few provincial parks in the region that stays open all year. From December to March, twelve campsites near the main gate are kept clear of snow, and the washroom building there is heated. The rest of the park is open for day use, but roads beyond the gate are not ploughed.</p><p><b>B.</b> Visitors can rent one of four heated yurts, round tents with wooden floors, bunk beds and a small wood stove. Yurts must be reserved at least three days in advance, and they fill quickly on long weekends. Firewood is sold at the gate office, as bringing wood from outside the area can spread insects that damage trees.</p><p><b>C.</b> The park’s groomed trails are its main winter attraction. A 6-kilometre loop around Silver Lake is suitable for beginners on cross-country skis or snowshoes, and both can be rented at the gate office by the hour. A longer 15-kilometre trail climbs to a lookout and is recommended only for experienced skiers.</p><p><b>D.</b> Staff remind visitors that winter conditions can change quickly. Temperatures at night often fall below minus twenty-five. Campers should tell someone their plans, carry extra dry clothing and check the trail report at the office each morning. Cell service is weak beyond the lake, so a paper map is essential.</p>' },
  i3: { title: 'Read the article about a library. Decide which paragraph (A, B, C or D) each statement comes from. Type E if the information is not given.', passage: '<p><b>From Bookshelves to Sewing Machines</b></p><p><b>A.</b> When the public library in Fernhill, a town of nine thousand people, lost a third of its visitors over five years, the staff did not cut hours. Instead, they asked residents what they wanted. The most common answer surprised them: a place to make and fix things.</p><p><b>B.</b> In 2023 the library turned an old storage room into a makerspace. It now holds two 3D printers, four sewing machines, a laser cutter and a set of hand tools. The equipment was paid for mostly by a provincial grant, with a local hardware store donating the tools. Anyone with a library card can use it for free after a short safety session.</p><p><b>C.</b> The most popular program is the monthly Repair Café, where volunteers help people fix broken toasters, torn jackets and wobbly chairs. Organizers say about seventy items are repaired each month that would otherwise go to the landfill. Teenagers from the high school volunteer there to earn the community service hours they need to graduate.</p><p><b>D.</b> Visits to the library have now climbed above their old level, and many newcomers stay to borrow books. Other small towns have started calling Fernhill for advice. The head librarian says the lesson is simple: “Libraries were always about sharing. We just added more things to share.”</p>' },
};
const stmts = [
  ['i1', 'Cities do not all have the same rules for keeping bees.', 'A', '"Most cities now allow beekeeping, but the rules differ widely."'],
  ['i1', 'Some gardens have produced more vegetables since bees arrived.', 'B', '"several community gardens report bigger harvests of squash and beans since hives arrived".'],
  ['i1', 'Most native bees do not live in large groups.', 'C', '"most of them live alone and nest in the ground".'],
  ['i1', 'People living in apartments can help bees too.', 'D', '"Even a few pots on a balcony can make a difference." A balcony points to an apartment.'],
  ['i1', 'Businesses use honey to attract customers.', 'B', 'Hotels and offices use honey in restaurants and as gifts, "which gives them a story to tell customers".'],
  ['i1', 'Honeybees may leave less food for other bees.', 'C', '"honeybees ... can take most of the pollen and nectar". This is a paraphrase: "food" = pollen and nectar.'],
  ['i1', 'Beekeepers must take a course before they start.', 'E', 'No paragraph mentions a course. A mentions distance rules and registration, which is a different requirement.'],
  ['i1', 'Lawn chemicals can be harmful to pollinators.', 'D', '"avoid spraying chemicals on lawns" is advice for helping pollinators.'],
  ['i1', 'Honey from city hives tastes better than honey from farms.', 'E', 'Taste is never compared. B mentions honey only as something businesses use.'],
  ['i2', 'Most park roads are not cleared in winter.', 'A', '"roads beyond the gate are not ploughed".'],
  ['i2', 'Visitors should not bring their own firewood.', 'B', '"bringing wood from outside the area can spread insects that damage trees".'],
  ['i2', 'People who are new to skiing have a suitable route.', 'C', '"A 6-kilometre loop ... is suitable for beginners".'],
  ['i2', 'Phones may not work in parts of the park.', 'D', '"Cell service is weak beyond the lake".'],
  ['i2', 'Some accommodation must be booked ahead of time.', 'B', '"Yurts must be reserved at least three days in advance".'],
  ['i2', 'Equipment can be rented for short periods.', 'C', 'Skis and snowshoes "can be rented at the gate office by the hour".'],
  ['i2', 'The park is unusual because it never closes.', 'A', '"one of the few provincial parks in the region that stays open all year".'],
  ['i2', 'Dogs must be kept on a leash on the trails.', 'E', 'Dogs are not mentioned anywhere.'],
  ['i2', 'Visitors should find out about trail conditions every day.', 'D', '"check the trail report at the office each morning".'],
  ['i3', 'The library first asked the public for ideas.', 'A', '"they asked residents what they wanted".'],
  ['i3', 'Most of the money for the equipment came from the government.', 'B', '"paid for mostly by a provincial grant". Province = government.'],
  ['i3', 'Young people help out as part of a school requirement.', 'C', 'Teenagers volunteer "to earn the community service hours they need to graduate".'],
  ['i3', 'People from other places want to copy the idea.', 'D', '"Other small towns have started calling Fernhill for advice."'],
  ['i3', 'Users must learn how to stay safe before using the machines.', 'B', '"free after a short safety session".'],
  ['i3', 'The program reduces the amount of waste.', 'C', 'About seventy items a month are repaired "that would otherwise go to the landfill".'],
  ['i3', 'Library staff had their hours reduced.', 'E', 'A says the opposite: "the staff did not cut hours". No paragraph gives this as a fact, so the answer is E.'],
  ['i3', 'The library now has more visitors than before its decline.', 'D', '"Visits to the library have now climbed above their old level".'],
  ['i3', 'The makerspace is open seven days a week.', 'E', 'Opening days are not mentioned.'],
];
const items = stmts.map(([g, s, a, why], i) => ({
  id: `rp3-${String(i + 1).padStart(2, '0')}`,
  type: 'text',
  group: g,
  q: `Which paragraph says this? <i>"${s}"</i> (type A, B, C, D, or E for not given)`,
  answer: a === 'E' ? ['E', 'not given', 'E not given'] : [a, `paragraph ${a}`],
  maxWords: 3,
  sol: a === 'E' ? `<b>E (not given).</b> ${why}` : `<b>Paragraph ${a}.</b> ${why}`,
}));
export default { title: 'Reading Part 3: Reading for Information', accent: 'en-CA', groups: texts, items };
