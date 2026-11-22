// Reading speed: skim, scan and follow signal words (lesson 2.6). Original items by fibub, not ETS material.
const items = [];
const pad = (n) => String(n).padStart(2, '0');

// 1. Skim: read one paragraph fast and choose its main idea (aim for 30 seconds each)
const skim = [
  ['Many people believe that goldfish have a memory of only a few seconds. Experiments tell a different story. Goldfish trained to push a lever for food remembered the task for weeks, and some learned to respond only at a certain time of day.', 'Goldfish remember far longer than people think', ['Goldfish are easy to train with food', 'Goldfish prefer to eat at night', 'People should not keep goldfish as pets']],
  ['The city’s first subway line opened in 1904 and carried more than a hundred thousand passengers on its opening day. Within twenty years, the network had tripled in length, and neighborhoods that had been farmland grew into busy suburbs along the new lines.', 'The subway grew fast and changed where people lived', ['The first subway line was very crowded', 'Farmland is better than suburbs', 'Subway tickets were cheap in 1904']],
  ['Bamboo is often called a tree, but it is actually a type of grass. Like other grasses, it grows from the base rather than the tip, and some kinds can grow almost a meter in a single day. This speed makes bamboo a useful building material that can be replaced quickly.', 'Bamboo is a fast-growing grass with practical uses', ['Bamboo is the tallest tree in the world', 'Grass grows from the tip', 'Bamboo is difficult to build with']],
  ['Volunteers who count birds each winter have produced one of the longest wildlife records in North America. Because the counts follow the same method every year, scientists can use them to see which species are increasing and which are declining.', 'Long-running bird counts give scientists useful data', ['Volunteers prefer winter to summer', 'Most bird species are increasing', 'Scientists do not trust volunteers']],
  ['Chewing gum has a long history. Ancient peoples chewed tree resin to clean their teeth and freshen their breath. Modern gum, made with flavors and sweeteners, appeared in the late 1800s and quickly became popular around the world.', 'People have chewed gum-like substances for a very long time', ['Gum is bad for your teeth', 'Tree resin tastes sweet', 'Gum was invented by dentists']],
  ['At first, the town’s new recycling program struggled. Residents mixed food waste with paper, and much of it had to be thrown away. After the town sent clear picture guides to every home, contamination fell by half within a year.', 'Clear guides helped fix a struggling recycling program', ['Residents refused to recycle', 'Paper cannot be recycled', 'The program was cancelled after a year']],
];
skim.forEach(([p, a, wrong], i) => items.push({ id: `rsp-k${pad(i + 1)}`, type: 'mcq', q: `Skim in about 30 seconds. What is the main idea?<br><br>${p}`, options: [a, ...wrong], answer: 0, sol: `The main idea covers the whole paragraph: <b>${a.toLowerCase()}</b>. The wrong options are a single detail, an opinion the text does not give, or something it contradicts.` }));

// 2. Scan: find one fact fast in a timetable
const groups = {
  t1: { title: 'Scan the timetable. Look only for what the question asks.', passage: '<p><b>Fall Orientation Week</b></p><table><tr><th>Day</th><th>Time</th><th>Event</th><th>Place</th></tr><tr><td>Monday</td><td>9:00 a.m.</td><td>Welcome talk</td><td>Main Hall</td></tr><tr><td>Monday</td><td>2:00 p.m.</td><td>Campus tour</td><td>Library steps</td></tr><tr><td>Tuesday</td><td>10:30 a.m.</td><td>Library skills workshop</td><td>Room L204</td></tr><tr><td>Tuesday</td><td>6:00 p.m.</td><td>International student dinner</td><td>Student Center</td></tr><tr><td>Wednesday</td><td>11:00 a.m.</td><td>Course registration help</td><td>Room B118</td></tr><tr><td>Thursday</td><td>4:00 p.m.</td><td>Clubs fair</td><td>Sports Field</td></tr><tr><td>Friday</td><td>7:30 p.m.</td><td>Outdoor movie night</td><td>Sports Field (Main Hall if rain)</td></tr></table>' },
};
const scan = [
  ['Where does the campus tour start?', 'Library steps', ['Main Hall', 'Room L204', 'Student Center'], 'Monday 2:00 p.m.: "Campus tour, Library steps".'],
  ['What time is the international student dinner?', '6:00 p.m. on Tuesday', ['10:30 a.m. on Tuesday', '6:00 p.m. on Monday', '7:30 p.m. on Friday'], 'Tuesday row: "6:00 p.m., International student dinner".'],
  ['Which day can students get help with registration?', 'Wednesday', ['Monday', 'Tuesday', 'Thursday'], '"Wednesday, 11:00 a.m., Course registration help".'],
  ['Where will the movie be shown if it rains?', 'Main Hall', ['Sports Field', 'Student Center', 'Room B118'], '"Sports Field (Main Hall if rain)".'],
  ['Which two events use the Sports Field?', 'The clubs fair and movie night', ['The welcome talk and the tour', 'The dinner and the workshop', 'Registration help and the clubs fair'], 'Thursday clubs fair and Friday movie night both list "Sports Field".'],
  ['What room is the library skills workshop in?', 'L204', ['B118', 'Main Hall', 'L118'], 'Tuesday 10:30 a.m.: "Room L204".'],
];
scan.forEach(([q, a, wrong, sol], i) => items.push({ id: `rsp-s${pad(i + 1)}`, type: 'mcq', group: 't1', q, options: [a, ...wrong], answer: 0, sol: `Scan for the key word, then read only that row. ${sol}` }));

// 3. Signal words: predict what comes next
const signals = [
  ['The new medicine worked well in the laboratory. <b>However</b>, ...', 'it caused side effects in some patients', ['it worked well in patients too', 'the laboratory was very large', 'it was also cheap to make'], '"However" signals a contrast: something negative follows the good result.'],
  ['Many farmers switched to drip irrigation. <b>As a result</b>, ...', 'water use on farms fell sharply', ['drip irrigation was invented in 1960', 'some farmers did not switch', 'farmers grew tired of the old method'], '"As a result" signals an effect of what came before.'],
  ['Some birds use tools. <b>For example</b>, ...', 'crows bend wire into hooks to catch insects', ['birds are related to dinosaurs', 'most birds cannot use tools', 'tools are made by people'], '"For example" introduces a specific case of the general idea.'],
  ['Wind energy is clean. <b>In addition</b>, ...', 'it has become cheaper in recent years', ['it does not work on calm days', 'coal is still widely used', 'the wind blows from the west'], '"In addition" adds another point in the same direction (another advantage).'],
  ['Although the theory was popular, ...', 'there was little evidence to support it', ['many people believed it', 'it was taught in schools', 'scientists liked it'], '"Although" sets up a contrast inside the sentence: popular, but weak evidence.'],
  ['The bridge was closed for repairs. <b>Therefore</b>, ...', 'drivers had to take a longer route', ['the bridge was built in 1950', 'repairs are expensive', 'the river was very wide'], '"Therefore" signals a logical result.'],
  ['First, the clay is shaped on a wheel. <b>Next</b>, ...', 'it is left to dry for several days', ['clay is found near rivers', 'the potter is very skilled', 'wheels were invented long ago'], '"Next" signals the following step in a process.'],
  ['Cats and dogs both make popular pets. <b>Unlike</b> dogs, however, ...', 'cats rarely need to be walked outside', ['dogs need to be walked', 'cats and dogs both need food', 'many families own a dog'], '"Unlike dogs" signals a difference about cats.'],
  ['Most scientists accept the model. <b>Nevertheless</b>, ...', 'a few still question one of its assumptions', ['it is taught in every university', 'most scientists accept it', 'the model is very old'], '"Nevertheless" signals a contrast despite what was just said.'],
  ['The lake froze earlier than usual this year. <b>In other words</b>, ...', 'winter arrived ahead of schedule', ['the lake is very deep', 'summer was long and hot', 'fish live under the ice'], '"In other words" restates the same idea more simply.'],
  ['The old library was too small. <b>Moreover</b>, ...', 'its roof leaked during heavy rain', ['it had a beautiful garden', 'a new library is now open', 'many people loved it'], '"Moreover" adds another problem in the same direction.'],
  ['Prices rose sharply in the spring. <b>By contrast</b>, ...', 'they stayed flat during the autumn', ['they rose again in the summer', 'people bought fewer goods', 'the spring was warm'], '"By contrast" points to an opposite situation.'],
];
signals.forEach(([s, a, wrong, why], i) => items.push({ id: `rsp-w${pad(i + 1)}`, type: 'mcq', q: `What most likely comes next?<br><br>${s}`, options: [a, ...wrong], answer: 0, sol: why }));
export default { title: 'Reading speed: skim, scan and signal words', accent: 'en-US', groups, items };
