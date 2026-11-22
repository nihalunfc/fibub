// CUET General Test: analogy and odd one out. Original questions for fibub.
import { pick, int, choose, fmt, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
const mc = (id, level, sub, q, opts, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4; const o = opts.slice(1); o.splice(k, 0, opts[0]);
  return mcq(id, level, sub, q, o, k, sol, trap);
};
const L = (v) => String.fromCharCode(65 + (((v % 26) + 26) % 26));
const odd = (id, level, q, opts, sol, trap) => mc(id, level, 'odd one out', 'Find the odd one out: ' + q, opts, sol, trap);

export default {
  topic: 'analogy-odd-one-out',
  items: [
    mc('an-001', 1, 'worker-place', 'Doctor : Hospital :: Teacher : ?', ['School', 'Book', 'Student', 'Chalk'], 'A doctor works in a hospital; a teacher works in a <b>school</b>. The link is "person : place of work".'),
    mc('an-002', 1, 'tool-use', 'Pen : Write :: Knife : ?', ['Cut', 'Sharp', 'Kitchen', 'Steel'], 'A pen is used to write; a knife is used to <b>cut</b>. The link is "tool : its job".'),
    mc('an-003', 1, 'home', 'Bird : Nest :: Bee : ?', ['Hive', 'Honey', 'Flower', 'Sting'], 'A bird lives in a nest; a bee lives in a <b>hive</b>. The link is "animal : home".'),
    mc('an-004', 1, 'opposite', 'Hot : Cold :: Day : ?', ['Night', 'Sun', 'Light', 'Morning'], 'Hot and cold are opposites; the opposite of day is <b>night</b>.'),
    mc('an-005', 1, 'wear', 'Foot : Shoe :: Hand : ?', ['Glove', 'Cap', 'Belt', 'Scarf'], 'A shoe is worn on the foot; a <b>glove</b> is worn on the hand. The link is "body part : what covers it".'),
    mc('an-006', 2, 'number', '8 : 64 :: 9 : ?', ['81', '71', '18', '27'], '64 = 8², so the rule is "square". 9² = <b>81</b>.', 'Doubling the 9 (18) or tripling it (27) does not follow from 8 : 64. Ask what was done to 8 to reach 64.'),
    mc('an-007', 2, 'number', '3 : 27 :: 4 : ?', ['64', '16', '48', '12'], '27 = 3³, so the rule is "cube". 4³ = <b>64</b>.', 'Do not stop at the first rule that fits one pair: 3 × 9 = 27 also works, so the pair alone is not enough. Cubes are the pattern the examiner expects.'),
    mc('an-008', 1, 'capital', 'Kolkata : West Bengal :: Jaipur : ?', ['Rajasthan', 'Gujarat', 'Haryana', 'Punjab'], 'Kolkata is the capital of West Bengal; Jaipur is the capital of <b>Rajasthan</b>.'),
    mc('an-009', 1, 'currency', 'Rupee : India :: Yen : ?', ['Japan', 'China', 'Korea', 'Thailand'], 'The rupee is the currency of India; the yen is the currency of <b>Japan</b>.'),
    mc('an-010', 1, 'worker-place', 'Lawyer : Court :: Chef : ?', ['Kitchen', 'Hotel', 'Food', 'Knife'], 'A lawyer works in a court; a chef works in a <b>kitchen</b>.'),
    mc('an-011', 1, 'sound', 'Tiger : Roar :: Elephant : ?', ['Trumpet', 'Bark', 'Neigh', 'Hiss'], 'A tiger roars; an elephant <b>trumpets</b>. The link is "animal : its sound".'),
    mc('an-012', 2, 'instrument', 'Thermometer : Temperature :: Barometer : ?', ['Air pressure', 'Humidity', 'Wind speed', 'Rainfall'], 'A thermometer measures temperature; a barometer measures <b>air pressure</b>.'),
    mc('an-013', 1, 'organ', 'Ear : Hear :: Tongue : ?', ['Taste', 'Speak only', 'Eat', 'Smell'], 'The ear is used for hearing; the tongue is mainly the organ of <b>taste</b>.'),
    mc('an-014', 2, 'fuel', 'Ink : Pen :: Petrol : ?', ['Engine', 'Road', 'Driver', 'Tyre'], 'Ink is what a pen runs on; petrol is what an <b>engine</b> runs on.'),
    mc('an-015', 2, 'letters', 'CAT : DBU :: DOG : ?', ['EPH', 'ENF', 'DPH', 'EOH'], 'Each letter moves one step forward: C→D, A→B, T→U. So D→E, O→P, G→H: <b>EPH</b>.'),
    mc('an-016', 2, 'number', '5 : 30 :: 7 : ?', ['56', '49', '40', '63'], '30 = 5 × 6, so the rule is n × (n + 1). 7 × 8 = <b>56</b>.', '49 (7²) comes from guessing "square"; 5² is 25, not 30.'),
    mc('an-017', 2, 'place', 'Book : Library :: Painting : ?', ['Gallery', 'Frame', 'Colour', 'Brush'], 'Books are kept and displayed in a library; paintings in a <b>gallery</b>.'),
    mc('an-018', 2, 'growth', 'Seed : Plant :: Egg : ?', ['Bird', 'Nest', 'Shell', 'Wing'], 'A seed grows into a plant; an egg grows into a <b>bird</b>. The link is "start : what it becomes".'),
    mc('an-019', 2, 'deficiency', 'Vitamin C : Scurvy :: Vitamin D : ?', ['Rickets', 'Night blindness', 'Goitre', 'Anaemia'], 'Lack of vitamin C causes scurvy; lack of vitamin D causes <b>rickets</b>.'),
    mc('an-020', 1, 'creator', 'Poet : Poem :: Sculptor : ?', ['Statue', 'Stone', 'Museum', 'Hammer'], 'A poet creates a poem; a sculptor creates a <b>statue</b>.'),
    mc('an-021', 2, 'unit', 'Kilogram : Mass :: Litre : ?', ['Volume', 'Weight', 'Length', 'Density'], 'The kilogram is a unit of mass; the litre is a unit of <b>volume</b>.'),
    mc('an-022', 2, 'class', 'Moon : Satellite :: Earth : ?', ['Planet', 'Star', 'Sun', 'Galaxy'], 'The Moon is a natural satellite (of Earth); Earth is a <b>planet</b>. The link is "member : type".'),
    mc('an-023', 2, 'place', 'Cricket : Pitch :: Boxing : ?', ['Ring', 'Court', 'Track', 'Field'], 'Cricket is played on a pitch; boxing is fought in a <b>ring</b>.'),
    odd('an-024', 1, 'Mango, Banana, Potato, Apple', ['Potato', 'Mango', 'Banana', 'Apple'], 'Mango, banana and apple are fruits; potato is a vegetable (an underground stem). Odd one: <b>Potato</b>.'),
    odd('an-025', 1, 'Ganga, Yamuna, Godavari, Thar', ['Thar', 'Ganga', 'Yamuna', 'Godavari'], 'Ganga, Yamuna and Godavari are rivers; the Thar is a desert. Odd one: <b>Thar</b>.'),
    odd('an-026', 1, '16, 25, 36, 48', ['48', '16', '25', '36'], '16 = 4², 25 = 5², 36 = 6². 48 is not a perfect square. Odd one: <b>48</b>.'),
    odd('an-027', 2, '11, 13, 17, 21, 23', ['21', '11', '13', '23'], '11, 13, 17, 23 are prime. 21 = 3 × 7. Odd one: <b>21</b>.', 'Many odd numbers look prime; test each with small divisors 3, 5, 7.'),
    odd('an-028', 1, 'Triangle, Square, Pentagon, Sphere', ['Sphere', 'Triangle', 'Square', 'Pentagon'], 'Triangle, square and pentagon are flat (2-D) shapes; a sphere is a solid (3-D). Odd one: <b>Sphere</b>.'),
    odd('an-029', 1, 'Cat, Dog, Cow, Sparrow', ['Sparrow', 'Cat', 'Dog', 'Cow'], 'Cat, dog and cow are mammals; a sparrow is a bird. Odd one: <b>Sparrow</b>.'),
    odd('an-030', 2, 'Sitar, Violin, Tabla, Veena', ['Tabla', 'Sitar', 'Violin', 'Veena'], 'Sitar, violin and veena are string instruments; the tabla is a drum (percussion). Odd one: <b>Tabla</b>.'),
    odd('an-031', 2, '8, 27, 64, 100, 125', ['100', '8', '27', '125'], '8 = 2³, 27 = 3³, 64 = 4³, 125 = 5³. 100 is a square, not a cube. Odd one: <b>100</b>.'),
    odd('an-032', 2, 'Wheat, Rice, Maize, Cotton', ['Cotton', 'Wheat', 'Rice', 'Maize'], 'Wheat, rice and maize are food grains; cotton is grown for fibre. Odd one: <b>Cotton</b>.'),
    odd('an-033', 2, 'Kathak, Bharatanatyam, Odissi, Ghazal', ['Ghazal', 'Kathak', 'Bharatanatyam', 'Odissi'], 'The first three are classical dance forms; a ghazal is a form of poetry and song. Odd one: <b>Ghazal</b>.'),
    odd('an-034', 3, 'ACE, BDF, CEG, DFI', ['DFI', 'ACE', 'BDF', 'CEG'], 'Each group has letters 2 apart, and starts one letter later each time: ACE, BDF, CEG, DFH. The group DFI breaks the rule (I is 3 after F). Odd one: <b>DFI</b>.'),
    odd('an-035', 1, 'Copper, Iron, Zinc, Sulphur', ['Sulphur', 'Copper', 'Iron', 'Zinc'], 'Copper, iron and zinc are metals; sulphur is a non-metal. Odd one: <b>Sulphur</b>.'),
    odd('an-036', 2, 'Mercury, Venus, Moon, Mars', ['Moon', 'Mercury', 'Venus', 'Mars'], 'Mercury, Venus and Mars are planets; the Moon is a satellite of Earth. Odd one: <b>Moon</b>.'),
    odd('an-037', 3, 'AZ, BY, CX, DV', ['DV', 'AZ', 'BY', 'CX'], 'The pairs go A–Z, B–Y, C–X and then should be D–W (letters add up to 27). DV breaks the rule. Odd one: <b>DV</b>.'),
  ],
  gens: [
    { id: 'an-g01', type: 'mcq', level: 2, sub: 'number', ...T,
      make(rng) {
        const rules = [['square', (n) => n * n, 'n²'], ['cube', (n) => n ** 3, 'n³'], ['n × (n + 1)', (n) => n * (n + 1), 'n × (n + 1)'], ['n² + 1', (n) => n * n + 1, 'n² + 1']];
        const [name, f, expr] = choose(rng, rules), a = int(rng, 3, 9); let b = int(rng, 3, 12); if (b === a) b++;
        const { options, answer } = shuffleOpts(rng, f(b), [f(b) + b, f(b - 1), f(b + 1)]);
        return { q: `${a} : ${f(a)} :: ${b} : ?`, options, answer, name, a, b,
          sol: steps(`Find the rule from the first pair: ${f(a)} comes from ${a} by "${name}" (${expr}).`, `Apply it to ${b}: <b>${f(b)}</b>.`),
          trap: 'Check your rule on the first pair before applying it; a rule that only roughly fits gives a close but wrong number.' };
      },
      verify: (p) => { const f = { square: (n) => n * n, cube: (n) => n ** 3, 'n × (n + 1)': (n) => n * (n + 1), 'n² + 1': (n) => n * n + 1 }[p.name]; return p.options.indexOf(String(f(p.b))); } },
    { id: 'an-g02', type: 'mcq', level: 2, sub: 'letters', ...T,
      make(rng) {
        const k = int(rng, 2, 5), x = int(rng, 0, 12), y = int(rng, 13, 21);
        const { options, answer } = shuffleOpts(rng, y + k, [y + k + 1, y + k - 1, y - k], L);
        return { q: `${L(x)} : ${L(x + k)} :: ${L(y)} : ?`, options, answer, k, y,
          sol: steps(`${L(x)} is letter ${x + 1} and ${L(x + k)} is letter ${x + k + 1}: the step is +${k}.`, `${L(y)} is letter ${y + 1}; add ${k} to get letter ${y + k + 1}, which is <b>${L(y + k)}</b>.`) };
      },
      verify: (p) => p.options.indexOf(String.fromCharCode(65 + ((p.y + p.k) % 26))) },
    { id: 'an-g03', type: 'mcq', level: 2, sub: 'odd one out', ...T,
      make(rng) {
        const m = choose(rng, [3, 4, 5, 6, 7, 9]);
        const ks = []; while (ks.length < 3) { const k = int(rng, 2, 14); if (!ks.includes(k)) ks.push(k); }
        const bad = m * int(rng, 2, 14) + int(rng, 1, m - 1);
        const { options, answer } = shuffleOpts(rng, bad, ks.map((k) => k * m));
        return { q: 'Find the odd one out among these numbers.', options, answer, m, bad,
          sol: steps(`Three of the numbers are multiples of ${m} (they are in the ${m} times table).`, `${bad} ÷ ${m} leaves a remainder, so it is the odd one: <b>${bad}</b>.`) };
      },
      verify: (p) => (p.options.findIndex((o) => +o % p.m !== 0)) },
    { id: 'an-g04', type: 'mcq', level: 2, sub: 'odd one out', ...T,
      make(rng) {
        const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47], comps = [21, 27, 33, 39, 49, 51, 57, 63, 91];
        const ps = []; while (ps.length < 3) { const p = choose(rng, primes); if (!ps.includes(p)) ps.push(p); }
        const c = choose(rng, comps);
        const { options, answer } = shuffleOpts(rng, c, ps);
        return { q: 'Find the odd one out among these numbers.', options, answer, c,
          sol: steps('Test each number for small divisors (2, 3, 5, 7).', `Three numbers have none: they are prime. ${c} can be divided by ${[3, 7].find((d) => c % d === 0)}, so it is the odd one: <b>${c}</b>.`),
          trap: 'Odd numbers such as 21, 27, 33 and 39 look prime but are multiples of 3.' };
      },
      verify: (p) => p.options.findIndex((o) => { const n = +o; for (let d = 2; d * d <= n; d++) if (n % d === 0) return true; return false; }) },
    { id: 'an-g05', type: 'mcq', level: 2, sub: 'number', ...T,
      make(rng) {
        const k = int(rng, 2, 9), a = int(rng, 3, 15); let c = int(rng, 3, 15); if (c === a) c++;
        const { options, answer } = shuffleOpts(rng, c * k + 1, [c * k, c * k + k, (c + 1) * k + 1]);
        return { q: `${a} : ${a * k + 1} :: ${c} : ?`, options, answer, k, c,
          sol: steps(`From ${a} to ${a * k + 1}: multiply by ${k}, then add 1 (${a} × ${k} = ${a * k}, plus 1).`, `Same rule for ${c}: ${c} × ${k} + 1 = <b>${c * k + 1}</b>.`),
          trap: 'Forgetting the +1 step gives a number that fits only half of the pattern.' };
      },
      verify: (p) => p.options.indexOf(String(p.c * p.k + 1)) },
  ],
};
