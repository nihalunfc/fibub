// IELTS Academic Writing Task 1: the language of data. Endless generated practice: choosing the right verb and adverb,
// working out percentage change, "twice as many", fractions in words, prepositions, nouns and verbs, superlatives,
// accurate comparisons and approximations. Every item comes from a seed, so each seed always gives the same item.
const pick = (r, a) => a[Math.min(a.length - 1, Math.floor(r() * a.length))];
const int = (r, a, b) => a + Math.min(b - a, Math.floor(r() * (b - a + 1)));
// Put the correct option at a seeded position among the wrong ones.
const place = (r, correct, wrongs) => {
  const pos = int(r, 0, wrongs.length), options = wrongs.slice(); options.splice(pos, 0, correct);
  return { options, answer: pos };
};
const shuf = (r, a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = int(r, 0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const F = (sub, level, type = 'mcq', extra = {}) => ({ type, level, exams: ['academic'], facets: { skill: 'writing', qtype: 'data' }, sub, ...extra });

const THINGS = ['the number of visitors', 'the price of a ticket', 'the population of the town', 'monthly sales', 'the unemployment rate', 'the average temperature', 'the number of students', 'the amount of waste recycled', 'the cost of electricity', 'the number of cars sold'];
const SUBJ = ['Sales', 'Exports', 'Imports', 'Profits', 'Unemployment', 'Attendance', 'Enrolment', 'Output', 'Spending', 'Rainfall'];
const PLACES = ['Spain', 'Norway', 'Kenya', 'Brazil', 'Japan', 'Canada', 'India', 'Egypt', 'Chile', 'Poland', 'Ghana', 'Italy'];

// % change -> degree word. Thresholds (also explained in each solution).
const degree = (pct) => { const a = Math.abs(pct); return a < 3 ? 'stable' : a < 10 ? 'slight' : a < 50 ? 'significant' : 'dramatic'; };
const DEG = { slight: ['slightly', 'a slight'], significant: ['significantly', 'a significant'], dramatic: ['dramatically', 'a dramatic'] };

export default {
  topic: 'writing-data',
  items: [],
  gens: [
    { id: 'wd-verb', ...F('verbs', 2),
      make(r) {
        const thing = pick(r, THINGS), a = pick(r, [40, 50, 80, 100, 120, 200, 250, 400, 500]);
        const pct = pick(r, [1, 2, 5, 8, 15, 20, 30, 40, 60, 80, 100, 150]) * (r() < 0.5 ? 1 : -1);
        const b = Math.round(a * (1 + pct / 100)), real = ((b - a) / a) * 100, d = degree(real), up = b > a;
        const phrase = (dg, upw) => (dg === 'stable' ? 'remained stable' : `${upw ? 'rose' : 'fell'} ${DEG[dg][0]}`);
        const correct = phrase(d, up);
        const others = ['slight', 'significant', 'dramatic'].filter((x) => x !== d);
        const wrongs = d === 'stable'
          ? [phrase('slight', true), phrase('slight', false), phrase('dramatic', true)]
          : [phrase(d, !up), phrase(pick(r, others), up), phrase('stable', up)];
        const set = [...new Set(wrongs)].filter((x) => x !== correct);
        for (const x of ['slight', 'significant', 'dramatic']) { if (set.length >= 3) break; for (const u of [up, !up]) { const p = phrase(x, u); if (p !== correct && !set.includes(p) && set.length < 3) set.push(p); } }
        const { options, answer } = place(r, correct, set.slice(0, 3));
        return { q: `${thing[0].toUpperCase() + thing.slice(1)} changed from ${a} to ${b}. Which phrase describes the change best?`, options, answer,
          sol: `The change is ${Math.abs(Math.round(real * 10) / 10)}% ${up ? 'up' : 'down'}. Rule of thumb used here: under 3% is "stable", 3 to 9% is "slightly", 10 to 49% is "significantly" (or "considerably"), 50% or more is "dramatically" (or "sharply"). So the best phrase is "${correct}".` };
      } },
    { id: 'wd-pct', ...F('percentage change', 2, 'text', { maxWords: 3 }),
      make(r) {
        const a = pick(r, [20, 40, 50, 80, 100, 120, 200, 400, 500]), p = pick(r, [10, 20, 25, 30, 40, 50, 60, 75]), up = r() < 0.6;
        const b = Math.round(a * (1 + (up ? p : -p) / 100));
        const thing = pick(r, THINGS);
        return { q: `${thing[0].toUpperCase() + thing.slice(1)} ${up ? 'rose' : 'fell'} from ${a} to ${b}. Work out the percentage ${up ? 'increase' : 'decrease'}. Write the number with %.`,
          answer: [`${p}%`, `${p} %`, `${p} percent`, `${p} per cent`, String(p)],
          sol: `Change = ${b} minus ${a} = ${b - a}. Divide by the starting figure: ${Math.abs(b - a)} / ${a} = ${p / 100}, which is ${p}%. Always divide by the figure you started from (${a}), not the one you ended on.` };
      } },
    { id: 'wd-multiple', ...F('multiples', 2),
      make(r) {
        const k = pick(r, [2, 3, 4]), small = int(r, 2, 9) * 10, big = small * k, A = pick(r, PLACES);
        let B = pick(r, PLACES); if (B === A) B = PLACES[(PLACES.indexOf(A) + 1) % PLACES.length];
        const hi = { 2: 'twice as high as', 3: 'three times as high as', 4: 'four times as high as' }, lo = { 2: 'half as high as', 3: 'a third as high as', 4: 'a quarter as high as' };
        const bigSubject = r() < 0.5, correct = bigSubject ? hi[k] : lo[k];
        const all = [...Object.values(hi), ...Object.values(lo)].filter((x) => x !== correct);
        const wrongs = shuf(r, all).slice(0, 3);
        const { options, answer } = place(r, correct, wrongs);
        const [s1, s2, v1, v2] = bigSubject ? [A, B, big, small] : [B, A, small, big];
        return { q: `In a survey, ${A} scored ${bigSubject ? big : small} and ${B} scored ${bigSubject ? small : big}. Complete the sentence: ${s1}'s score was ___ ${s2}'s.`, options, answer,
          sol: `${v1} compared with ${v2}: ${v1 > v2 ? `${v1} / ${v2} = ${k}, so ${hi[k]}` : `${v2} / ${v1} = ${k}, so ${v1} is 1/${k} of ${v2}: ${lo[k]}`}.` };
      } },
    { id: 'wd-fraction', ...F('fractions in words', 2),
      make(r) {
        const base = pick(r, [[25, 'a quarter'], [50, 'half'], [75, 'three quarters'], [33, 'a third'], [20, 'one in five'], [10, 'one in ten'], [67, 'two thirds'], [80, 'four in five']]);
        const dev = base[0] === 50 || base[0] === 25 || base[0] === 75 ? pick(r, [0, -1, 1, 2, -2]) : pick(r, [0, 1, -1]);
        const p = base[0] + (base[0] === 33 || base[0] === 67 ? 0 : dev), approx = !(dev === 0 || base[0] === 33 || base[0] === 67);
        const pre = approx ? 'roughly ' : '';
        const wrongs = shuf(r, [[25, 'a quarter'], [50, 'half'], [75, 'three quarters'], [33, 'a third'], [20, 'one in five'], [10, 'one in ten'], [67, 'two thirds'], [80, 'four in five']].filter((x) => x[0] !== base[0])).slice(0, 3).map((x) => pre + x[1]);
        const { options, answer } = place(r, pre + base[1], wrongs);
        const who = pick(r, ['of the students', 'of the visitors', 'of households', 'of the workers', 'of the customers']);
        return { q: `${p}% ${who} chose option A. Which phrase describes this figure best?`, options, answer,
          sol: `${base[1]} = ${base[0]}%${base[0] === 33 || base[0] === 67 ? ' (about, as thirds are recurring)' : ''}. ${p}% is ${p === base[0] ? 'exactly that' : 'very close to it, so we add "roughly"'}.` };
      } },
    { id: 'wd-prep', ...F('prepositions', 1),
      make(r) {
        const n = int(r, 2, 9) * 5, m = n + int(r, 2, 8) * 5, S = pick(r, SUBJ), v = pick(r, ['rose', 'increased', 'grew']), vd = pick(r, ['fell', 'dropped', 'decreased']);
        const T = [
          { q: `${S} ${v} ___ ${n}% last year. (${n}% is the size of the rise.)`, c: 'by', why: 'After a verb of change, "by" gives the size of the change.' },
          { q: `${S} ${v} from ${n}% ___ ${m}%.`, c: 'to', why: '"from ... to ..." gives the starting and the finishing figures.' },
          { q: `${S} peaked ___ ${m}% in 2015.`, c: 'at', why: '"at" gives the level reached at a peak, a low point or a plateau.' },
          { q: `There was a sharp rise ___ ${S.toLowerCase()} in 2010.`, c: 'in', why: 'A noun of change (a rise, a fall) is followed by "in" plus the thing that changed.' },
          { q: `There was an increase ___ ${n}% in ${S.toLowerCase()}.`, c: 'of', why: 'A noun of change is followed by "of" plus the size of the change.' },
          { q: `${S} ${vd} ___ ${m}% to ${n}%.`, c: 'from', why: '"fell from ... to ..." gives the starting and finishing figures; "from" goes with the starting figure.' },
          { q: `${S} remained stable ___ ${n}% for three years.`, c: 'at', why: 'Use "at" for the level at which something stays.' },
        ];
        const t = pick(r, T), wrongs = shuf(r, ['by', 'to', 'at', 'in', 'of', 'from'].filter((x) => x !== t.c)).slice(0, 3);
        const { options, answer } = place(r, t.c, wrongs);
        return { q: 'Choose the correct preposition: ' + t.q, options, answer, sol: `"${t.c}". ${t.why}` };
      } },
    { id: 'wd-noun-verb', ...F('nouns and verbs', 2),
      make(r) {
        const ups = [['rise', 'rose'], ['increase', 'increased'], ['growth', 'grew']], downs = [['fall', 'fell'], ['drop', 'dropped'], ['decline', 'declined']];
        const advs = [['sharp', 'sharply'], ['steady', 'steadily'], ['slight', 'slightly'], ['gradual', 'gradually'], ['rapid', 'rapidly'], ['significant', 'significantly']];
        const up = r() < 0.5, pair = pick(r, up ? ups : downs), opp = pick(r, up ? downs : ups), ad = pick(r, advs), ad2 = pick(r, advs.filter((x) => x !== ad));
        const S = pick(r, SUBJ).toLowerCase(), toNoun = r() < 0.5;
        const nounP = (p, a) => `${/^[aeiou]/.test(a[0]) ? 'an' : 'a'} ${a[0]} ${p[0]} in ${S}`, verbP = (p, a) => `${S} ${p[1]} ${a[1]}`;
        const [src, mk2, kind] = toNoun ? [verbP(pair, ad), nounP, 'noun phrase'] : [nounP(pair, ad), verbP, 'sentence with a verb'];
        const correct = mk2(pair, ad), wrongs = [mk2(opp, ad), mk2(pair, ad2), mk2(opp, ad2)];
        const { options, answer } = place(r, correct, wrongs);
        const cap = (x) => x[0].toUpperCase() + x.slice(1);
        return { q: toNoun ? `Which noun phrase has the same meaning as "${cap(src)}"?` : `Which sentence with a verb has the same meaning as "There was ${src}"?`, options, answer,
          sol: `Adjective + noun (${ad[0]} ${pair[0]}) matches verb + adverb (${pair[1]} ${ad[1]}). Check both the direction (${pair[0]} = ${up ? 'up' : 'down'}) and the degree (${ad[0]}). Pattern: "a ${ad[0]} ${pair[0]} in X" = "X ${pair[1]} ${ad[1]}".` };
      } },
    { id: 'wd-superlative', ...F('highest and lowest', 3),
      make(r) {
        const names = shuf(r, PLACES).slice(0, 2 + int(r, 0, 2)), vals = [];
        while (vals.length < names.length) { const v = int(r, 8, 60); if (!vals.includes(v)) vals.push(v); }
        const metric = pick(r, [['rainfall in mm', 'rainfall'], ['unemployment rate', 'unemployment rate'], ['number of tourists in thousands', 'number of tourists'], ['average salary in thousands of euros', 'average salary']]);
        const high = r() < 0.5, order = vals.map((v, i) => i).sort((x, y) => (high ? vals[y] - vals[x] : vals[x] - vals[y])), top = order[0];
        const two = names.length === 2, other = order[1];
        const correct = two ? (high ? 'higher than' : 'lower than') : (high ? 'the highest' : 'the lowest');
        const wrongs = ['higher than', 'the highest', 'lower than', 'the lowest'].filter((x) => x !== correct);
        const { options, answer } = place(r, correct, wrongs);
        const data = names.map((n, i) => `${n}: ${vals[i]}`).join(', ');
        const stem = two ? `${names[top]}'s ${metric[1]} was ___ ${names[other]}'s.` : `${names[top]} recorded ___ ${metric[1]} of the ${names.length} countries.`;
        return { q: `${metric[0][0].toUpperCase() + metric[0].slice(1)}. ${data}. Complete the sentence: ${stem}`, options, answer,
          sol: `${names[top]} has the ${high ? 'largest' : 'smallest'} figure (${vals[top]}). ${two ? 'With only two items we use a comparative + "than" (higher than, lower than).' : 'With three or more items we use "the" + a superlative (the highest, the lowest).'}` };
      } },
    { id: 'wd-compare', ...F('accurate comparisons', 3),
      make(r) {
        const B = pick(r, [40, 50, 80, 100, 200]), p = pick(r, [10, 20, 25, 50]), A = Math.round(B * (1 + p / 100));
        const X = pick(r, PLACES); let Y = pick(r, PLACES); if (Y === X) Y = PLACES[(PLACES.indexOf(X) + 3) % PLACES.length];
        const correct = `${X}'s figure was ${p}% higher than ${Y}'s.`;
        const wrongs = [`${Y}'s figure was ${p}% lower than ${X}'s.`, `${X}'s figure was ${p}% lower than ${Y}'s.`, `${Y}'s figure was ${p}% higher than ${X}'s.`];
        const { options, answer } = place(r, correct, wrongs);
        const back = Math.round(((A - B) / A) * 1000) / 10;
        return { q: `${X} has a figure of ${A} and ${Y} has a figure of ${B}. Which sentence is accurate?`, options, answer,
          sol: `The difference is ${A - B}. As a percentage of ${Y}'s ${B}, that is ${p}%, so ${X} is ${p}% higher. The reverse sentence "${Y} is ${p}% lower" is false: as a percentage of ${X}'s ${A} the gap is only ${back}%. Percentages always use the second item in "than" as the base.` };
      } },
    { id: 'wd-approx', ...F('approximations', 2),
      make(r) {
        const ref = pick(r, [[50, 'half'], [25, 'a quarter'], [75, 'three quarters'], [20, 'a fifth'], [10, 'a tenth']]), dev = pick(r, [-3, -2, -1, 0, 1, 2, 3]), p = ref[0] + dev;
        const correct = dev === 0 ? `exactly ${ref[1]}` : dev < 0 ? `just under ${ref[1]}` : `just over ${ref[1]}`;
        const all = [`exactly ${ref[1]}`, `just under ${ref[1]}`, `just over ${ref[1]}`, `well over ${ref[1]}`].filter((x) => x !== correct);
        const { options, answer } = place(r, correct, all.slice(0, 3));
        const who = pick(r, ['of the respondents', 'of the passengers', 'of the workforce', 'of the buyers']);
        return { q: `${p}% ${who} said yes. Which phrase describes this figure best?`, options, answer,
          sol: `${ref[1]} = ${ref[0]}%. ${dev === 0 ? 'The figure is exactly equal, so "exactly" is right.' : dev < 0 ? `${p}% is a little below ${ref[0]}%: "just under" (or "almost" or "nearly").` : `${p}% is a little above ${ref[0]}%: "just over" (or "slightly more than").`} "Well over" is only for a large gap.` };
      } },
  ],
};
