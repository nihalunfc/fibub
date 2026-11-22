// Canadian words and spelling (lesson 1.6). Original items by fibub.
const words = [
  ['hydro', 'electricity', ['water supply', 'heating oil', 'internet']],
  ['washroom', 'a toilet, especially in a public place', ['a laundry room', 'a car wash', 'a bathroom scale']],
  ['line-up', 'a queue of people waiting', ['a list of players', 'a phone line', 'a train route']],
  ['toque', 'a knitted winter hat', ['a winter boot', 'a scarf', 'a snow shovel']],
  ['loonie', 'a one-dollar coin', ['a two-dollar coin', 'a bird-watching club', 'a five-dollar bill']],
  ['toonie', 'a two-dollar coin', ['a one-dollar coin', 'a ten-cent coin', 'a cartoon']],
  ['pay stub', 'the paper or file that shows your pay and deductions', ['a cancelled cheque', 'a parking receipt', 'a job offer']],
  ['stat holiday', 'a public holiday set by law', ['a sick day', 'an unpaid day off', 'a school trip']],
  ['by-law', 'a rule made by a city or town', ['a federal tax', 'a court case', 'a private contract']],
  ['walk-in clinic', 'a clinic where you can see a doctor without an appointment', ['a hospital ward', 'a fitness centre', 'a pharmacy counter']],
  ['e-transfer', 'sending money by email or text through your bank', ['a train ticket', 'a job transfer', 'an electronic signature']],
  ['double-double', 'a coffee with two creams and two sugars', ['two coffees', 'a double shift', 'a large tea']],
  ['cottage', 'a holiday house, often by a lake', ['a small apartment in the city', 'a farm shed', 'a hotel room']],
  ['parkade', 'a multi-level parking garage', ['a city park', 'a parade', 'a street market']],
  ['first and last', 'paying the first and the last month’s rent when you sign a lease', ['a two-week trial', 'the first and last day of work', 'a deposit for utilities']],
  ['superintendent', 'the person who looks after an apartment building', ['a school principal', 'a police chief', 'a bank manager']],
];
const items = words.map(([w, m, wrong], i) => ({ id: `cn-w${i}`, type: 'mcq', q: `What does <b>${w}</b> mean in Canadian English?`, options: [m, ...wrong], answer: 0, sol: `<b>${w}</b>: ${m}.` }));
const spell = [
  ['I left my umbrella at the community ___.', 'centre', ['center', 'centr', 'sentre']],
  ['My ___ has just moved in next door.', 'neighbour', ['nieghbour', 'neihbour', 'neighbur']],
  ['Please make the ___ payable to the city.', 'cheque', ['chequ', 'cheke', 'chek']],
  ['You need a valid driver’s ___ to rent a car.', 'licence', ['lisence', 'licens', 'lycence']],
  ['We ___ the meeting because of the storm.', 'cancelled', ['canceld', 'cancellled', 'canseled']],
  ['What is your ___ colour?', 'favourite', ['favorit', 'favourit', 'faverite']],
];
spell.forEach(([s, a, wrong], i) => items.push({ id: `cn-s${i}`, type: 'mcq', q: `Choose the Canadian spelling: ${s}`, options: [a, ...wrong], answer: 0, sol: `Canadian spelling: <b>${a}</b>.` }));
items.push({ id: 'cn-t1', type: 'text', q: 'In Canada, what is the yearly tax slip your employer gives you called? (one letter and one number)', answer: ['T4', 'a T4', 'T-4'], maxWords: 2, sol: 'A <b>T4</b> shows your pay and the tax taken off over the year.' });
items.push({ id: 'cn-t2', type: 'text', q: 'What is the Canadian word for a school year, as in "my son is in ___ 7"?', answer: ['Grade', 'grade'], maxWords: 1, sol: 'Canadians say <b>Grade</b> 7, not Year 7 or Class 7.' });
export default { title: 'Canadian words and spelling', items };
