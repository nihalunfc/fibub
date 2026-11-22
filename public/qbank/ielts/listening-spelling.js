// IELTS Listening: names, spellings, numbers, dates, times, prices, phone numbers and postcodes, the answers that
// Part 1 is built on. Every item is generated from a seed, so the supply is endless and each seed always gives
// the same item. make(rng) returns { q, answer, sol, audio } where `audio` is read aloud by the browser.
const pick = (r, a) => a[Math.min(a.length - 1, Math.floor(r() * a.length))];
const int = (r, a, b) => a + Math.min(b - a, Math.floor(r() * (b - a + 1)));
const F = (sub, level, extra = {}) => ({ type: 'text', level, exams: ['academic', 'general'], facets: { skill: 'listening', part: '1', qtype: 'spelling' }, sub, ...extra });

const SURNAMES = ['Abernathy', 'Bhattacharya', 'Castellano', 'Delacroix', 'Eriksson', 'Fitzgerald', 'Gallagher', 'Hargreaves', 'Ishikawa', 'Jankowski', 'Kowalczyk', 'Lockhart', 'McAllister', 'Nakamura', 'Oyelaran', 'Pemberton', 'Quigley', 'Rasmussen', 'Szymanski', 'Thornbury', 'Underwood', 'Vasquez', 'Whitfield', 'Xavier', 'Yardley', 'Zimmerman', 'Achterberg', 'Brennan', 'Chaudhry', 'Dunmore', 'Ellingham', 'Ferreira', 'Grosvenor', 'Haddad', 'Iqbal', 'Jefferies', 'Kavanagh', 'Llewellyn', 'Mbeki', 'Nwachukwu', 'Ostrowski', 'Pritchard', 'Quinlan', 'Rourke', 'Sandoval', 'Tremblay', 'Ulrich', 'Venkatesan', 'Wainwright', 'Yeung'];
const STREETS = ['Ashgrove', 'Birchfield', 'Coppergate', 'Dunsmore', 'Elmhurst', 'Foxwell', 'Greythorne', 'Hazeldene', 'Ivydale', 'Juniper', 'Kingsmere', 'Larchwood', 'Maplestead', 'Northcote', 'Oakhampton', 'Parkview', 'Queensbury', 'Rosedale', 'Silverbirch', 'Thistlewood', 'Upperton', 'Valewood', 'Willowbrook', 'Yewtree'];
const KINDS = ['Road', 'Street', 'Avenue', 'Lane', 'Crescent', 'Close', 'Drive', 'Gardens'];
const WORDS = ['accommodation', 'questionnaire', 'necessary', 'environment', 'government', 'restaurant', 'Wednesday', 'February', 'library', 'committee', 'separate', 'temperature', 'equipment', 'souvenir', 'calendar', 'receipt', 'guarantee', 'parliament', 'definitely', 'professional', 'recommend', 'occasionally', 'conscious', 'pronunciation', 'entrance', 'licence', 'cafeteria', 'brochure', 'appointment', 'questionnaire', 'business', 'experience', 'convenient', 'insurance', 'available', 'opportunity', 'beginner', 'vegetarian', 'thermometer', 'microscope'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth'];
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
/** Say a whole number up to 9,999 in British English words ("three hundred and forty"). */
export function say(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + say(n % 100) : '');
  return say(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? (n % 1000 < 100 ? ' and ' : ' ') + say(n % 1000) : '');
}
const spell = (w) => w.toUpperCase().split('').join(', ');
/** Spell with "double" for repeated letters, as people do on the phone. */
const spellPhone = (w) => { const u = w.toUpperCase(); const out = []; for (let i = 0; i < u.length; i++) { if (u[i] === u[i + 1]) { out.push('double ' + u[i]); i++; } else out.push(u[i]); } return out.join(', '); };
const digitsSay = (s) => { const out = []; for (let i = 0; i < s.length; i++) { const d = s[i] === '0' ? 'oh' : ONES[+s[i]]; if (s[i] === s[i + 1]) { out.push('double ' + d); i++; } else out.push(d); } return out.join(' '); };

export default {
  topic: 'listening-spelling',
  items: [],
  gens: [
    { id: 'ls-name', ...F('surnames', 1, { maxWords: 1 }),
      make(r) {
        const name = pick(r, SURNAMES), first = pick(r, ['Anna', 'Ben', 'Carla', 'David', 'Elif', 'Farid', 'Grace', 'Hiro', 'Isla', 'Jamal']);
        return { q: 'Write the caller\'s <b>surname</b>.', answer: [name], audio: [{ who: 'A', text: 'Can I have your name, please?' }, { who: 'B', text: `Yes, it is ${first} ${name}. That is ${spellPhone(name)}.` }],
          sol: `${name}: ${spell(name)}. People say "double" for two same letters in a row.` };
      } },
    { id: 'ls-street', ...F('addresses', 2, { maxWords: 3 }),
      make(r) {
        const n = int(r, 2, 248), st = pick(r, STREETS), k = pick(r, KINDS);
        return { q: 'Write the <b>house number and street</b>.', answer: [`${n} ${st} ${k}`], audio: [{ who: 'A', text: 'And what is your address?' }, { who: 'B', text: `It is ${say(n)} ${st} ${k}. ${st} is spelled ${spell(st)}.` }],
          sol: `${n} ${st} ${k}. Numbers are best written as digits.` };
      } },
    { id: 'ls-postcode', ...F('postcodes', 2, { maxWords: 2 }),
      make(r) {
        const L = 'ABCDEFGHJKLMNPRSTUWY';
        const pc = `${pick(r, L.split(''))}${pick(r, L.split(''))}${int(r, 1, 19)} ${int(r, 1, 9)}${pick(r, L.split(''))}${pick(r, L.split(''))}`;
        const spoken = pc.replace(' ', ', ').split('').map((c) => (c === ',' ? ',' : c === ' ' ? '' : /\d/.test(c) ? ONES[+c] : c)).filter(Boolean).join(' ');
        return { q: 'Write the <b>postcode</b>.', answer: [pc, pc.replace(' ', '')], audio: [{ who: 'A', text: 'What is the postcode?' }, { who: 'B', text: spoken + '.' }],
          sol: `${pc}. Write letters and numbers exactly as heard; capitals or small letters are both fine.` };
      } },
    { id: 'ls-phone', ...F('phone numbers', 2),
      make(r) {
        let num = '07'; for (let i = 0; i < 9; i++) num += (i < 2 && r() < 0.4) ? num[num.length - 1] : String(int(r, 0, 9));
        const a = num.slice(0, 5), b = num.slice(5, 8), c = num.slice(8);
        return { q: 'Write the <b>phone number</b> (digits only).', answer: [num, `${a} ${b} ${c}`, `${a} ${b}${c}`], audio: [{ who: 'A', text: 'And a contact number?' }, { who: 'B', text: `${digitsSay(a)}, ${digitsSay(b)}, ${digitsSay(c)}.` }],
          sol: `${a} ${b} ${c}. "Oh" means zero and "double" means the digit twice.` };
      } },
    { id: 'ls-date', ...F('dates', 1, { maxWords: 2 }),
      make(r) {
        const d = int(r, 1, 28), m = pick(r, MONTHS), off = pick(r, [1, 2, -1]), wrong = d + off >= 1 && d + off <= 28 ? d + off : d < 28 ? d + 1 : d - 1;
        const correct = r() < 0.5;
        const audio = correct
          ? [{ who: 'A', text: 'When would you like to come?' }, { who: 'B', text: `On the ${ORD[wrong - 1]} of ${m}. Actually no, sorry, I am busy then. Make it the ${ORD[d - 1]}.` }]
          : [{ who: 'A', text: 'What date does it start?' }, { who: 'B', text: `It starts on ${m} the ${ORD[d - 1]}.` }];
        return { q: 'Write the <b>date</b> (day and month) that is finally agreed.', answer: [`${d} ${m}`, `${m} ${d}`, `${d}th ${m}`, `${d}st ${m}`, `${d}nd ${m}`, `${d}rd ${m}`, `${m} ${d}th`, `${m} ${d}st`, `${m} ${d}nd`, `${m} ${d}rd`], audio,
          sol: `${d} ${m}.${correct ? ` The ${ORD[wrong - 1]} is said first and then changed.` : ''} 15 June, June 15 and 15th June are all accepted.` };
      } },
    { id: 'ls-time', ...F('times', 2, { maxWords: 2 }),
      make(r) {
        const h = int(r, 1, 11), mins = pick(r, [0, 15, 30, 45, 10, 20, 40, 50]);
        const words = mins === 0 ? `${say(h)} o'clock` : mins === 15 ? `quarter past ${say(h)}` : mins === 30 ? `half past ${say(h)}` : mins === 45 ? `quarter to ${say(h % 12 + 1)}` : mins < 30 ? `${say(mins)} past ${say(h)}` : `${say(60 - mins)} to ${say(h % 12 + 1)}`;
        const t = `${h}.${String(mins).padStart(2, '0')}`;
        return { q: 'Write the <b>time</b> as numbers, for example 4.15.', answer: [t, t.replace('.', ':'), t + 'pm', t + 'am', t.replace('.', ':') + 'pm', t.replace('.', ':') + 'am'], audio: [{ who: 'A', text: 'What time does it start?' }, { who: 'B', text: `At ${words}.` }],
          sol: `"${words}" = ${t}. "Quarter to" and "twenty to" count back from the next hour.` };
      } },
    { id: 'ls-price', ...F('prices', 2, { maxWords: 1 }),
      make(r) {
        const p = pick(r, [int(r, 13, 19), int(r, 3, 9) * 10, int(r, 20, 99), int(r, 100, 950), int(r, 1000, 4500)]);
        const p2 = p >= 13 && p <= 19 ? (p - 10) * 10 : p + 15;
        const audio = [{ who: 'A', text: 'How much is it?' }, { who: 'B', text: `It was ${say(p2)} pounds, but it has just gone down. Now it is ${say(p)} pounds.` }];
        return { q: 'Write the <b>price now</b>, in pounds, as a number.', answer: [String(p), p >= 1000 ? p.toLocaleString('en-GB') : String(p), '£' + p], audio,
          sol: `£${p}. The first price, £${p2}, is the old one. Listen for "-teen" (stress at the end) versus "-ty" (stress at the start).` };
      } },
    { id: 'ls-word', ...F('spelling', 2, { maxWords: 1 }),
      make(r) {
        const w = pick(r, WORDS);
        return { q: 'Write the word you hear, <b>spelled correctly</b>.', answer: [w, w.replace('ence', 'ense')].filter((x, i) => i === 0 || (w === 'licence')), audio: [{ who: 'N', text: `The word is: ${w}. ${w}.` }],
          sol: `${w}: ${spell(w)}. In Listening a misspelled answer is marked wrong. ${w === 'licence' ? 'American spelling "license" is also accepted.' : ''}` };
      } },
    { id: 'ls-mixed-number', ...F('large numbers', 3, { maxWords: 1 }),
      make(r) {
        const n = int(r, 1, 9) * 1000 + int(r, 0, 9) * 100 + pick(r, [0, 15, 50, 13, 30, 40, 14, 17, 70]);
        return { q: 'Write the <b>number</b> of visitors as digits.', answer: [String(n), n.toLocaleString('en-GB')], audio: [{ who: 'N', text: `Last year the museum welcomed ${say(n)} visitors on its opening weekend.` }],
          sol: `${n.toLocaleString('en-GB')}. British English puts "and" before the tens: "three thousand, two hundred and fifteen".` };
      } },
  ],
};
