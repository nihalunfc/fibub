// Word building: prefixes, suffixes, word families, spelling (lesson 2.2). Original items by fibub, not ETS material.
const items = [];
const pad = (n) => String(n).padStart(2, '0');

// 1. Prefixes: what does the prefix add?
const prefixes = [
  ['un-', 'unclear', 'not', ['again', 'before', 'too much']],
  ['re-', 'rebuild', 'again', ['not', 'against', 'under']],
  ['pre-', 'preview', 'before', ['after', 'again', 'wrongly']],
  ['post-', 'postwar', 'after', ['before', 'against', 'across']],
  ['mis-', 'misread', 'wrongly', ['again', 'before', 'together']],
  ['over-', 'overestimate', 'too much', ['not enough', 'again', 'under']],
  ['under-', 'underfunded', 'not enough', ['too much', 'after', 'between']],
  ['inter-', 'international', 'between', ['inside', 'against', 'before']],
  ['trans-', 'transatlantic', 'across', ['under', 'before', 'not']],
  ['sub-', 'subsurface', 'below', ['above', 'again', 'many']],
  ['multi-', 'multilingual', 'many', ['one', 'half', 'not']],
  ['anti-', 'antibacterial', 'against', ['for', 'before', 'many']],
  ['co-', 'coauthor', 'together, with', ['against', 'alone', 'again']],
  ['non-', 'nonprofit', 'not', ['before', 'after', 'many']],
];
prefixes.forEach(([p, ex, m, wrong], i) => items.push({ id: `rwb-p${pad(i + 1)}`, type: 'mcq', q: `What does the prefix <b>${p}</b> mean in <b>${ex}</b>?`, options: [m, ...wrong], answer: 0, sol: `<b>${p}</b> = "${m}". So <b>${ex}</b> means ${m} + ${ex.slice(p.length - 1)}.` }));

// 2. Suffixes: what part of speech does the ending make?
const suffixes = [
  ['-tion', 'production', 'a noun', ['a verb', 'an adjective', 'an adverb']],
  ['-ment', 'development', 'a noun', ['a verb', 'an adjective', 'an adverb']],
  ['-ness', 'darkness', 'a noun', ['a verb', 'an adjective', 'an adverb']],
  ['-ity', 'activity', 'a noun', ['a verb', 'an adjective', 'an adverb']],
  ['-ize', 'modernize', 'a verb', ['a noun', 'an adjective', 'an adverb']],
  ['-en', 'strengthen', 'a verb', ['a noun', 'an adjective', 'an adverb']],
  ['-ify', 'simplify', 'a verb', ['a noun', 'an adjective', 'an adverb']],
  ['-ous', 'dangerous', 'an adjective', ['a noun', 'a verb', 'an adverb']],
  ['-ful', 'useful', 'an adjective', ['a noun', 'a verb', 'an adverb']],
  ['-able', 'renewable', 'an adjective', ['a noun', 'a verb', 'an adverb']],
  ['-al', 'seasonal', 'an adjective', ['a noun', 'a verb', 'an adverb']],
  ['-ly', 'rapidly', 'an adverb', ['a noun', 'a verb', 'an adjective']],
];
suffixes.forEach(([s, ex, pos, wrong], i) => items.push({ id: `rwb-s${pad(i + 1)}`, type: 'mcq', q: `The ending <b>${s}</b> in <b>${ex}</b> usually makes the word...`, options: [pos, ...wrong], answer: 0, sol: `<b>${s}</b> usually makes ${pos}: <b>${ex}</b>.`, trap: s === '-ly' ? 'Careful: a few -ly words are adjectives (friendly, lonely), but most are adverbs.' : undefined }));

// 3. Word families: write the right form
const forms = [
  ['DECIDE', 'The committee will announce its final ___ next week.', 'decision', 'a noun after "its final"'],
  ['GROW', 'The city saw rapid ___ after the railway arrived.', 'growth', 'a noun after the adjective "rapid"'],
  ['SCIENCE', 'The ___ spent ten years studying the lake.', 'scientist', 'a person (noun) after "The"'],
  ['DIFFER', 'There is a clear ___ between weather and climate.', 'difference', 'a noun after "a clear"'],
  ['DEPEND', 'Many plants are ___ on insects for pollination.', 'dependent', 'an adjective after "are"; it goes with "on"'],
  ['SUCCESS', 'The experiment was ___, so the team repeated it on a larger scale.', 'successful', 'an adjective after "was"'],
  ['RAPID', 'The ice is melting more ___ than expected.', 'rapidly', 'an adverb describing "is melting"'],
  ['ECONOMY', 'The town faced serious ___ problems after the mine closed.', 'economic', 'an adjective before "problems"'],
  ['ABLE', 'Some birds have the ___ to sense magnetic fields.', 'ability', 'a noun after "the"'],
  ['PRODUCE', 'Rice ___ rose sharply in the 1960s.', 'production', 'a noun after "Rice"'],
  ['STRONG', 'Engineers added steel bars to ___ the wall.', 'strengthen', 'a verb after "to"'],
  ['POSSIBLE', 'It is ___ to see the planet without a telescope.', 'impossible', 'a negative adjective; the context needs "not possible"'],
  ['ACCURATE', 'Older maps were often ___ because the land had not been measured.', 'inaccurate', 'a negative adjective after "were often"'],
  ['EXPLAIN', 'The professor gave a simple ___ of the process.', 'explanation', 'a noun after "a simple"'],
  ['DESTROY', 'The storm caused widespread ___ along the coast.', 'destruction', 'a noun after "widespread"'],
  ['PERSUADE', 'The author makes a ___ argument for public transport.', 'persuasive', 'an adjective before "argument"'],
  ['ANALYZE', 'A careful ___ of the data showed a small error.', 'analysis', 'a noun after "A careful"'],
  ['HISTORY', 'The building is of great ___ importance.', 'historical', 'an adjective before "importance"'],
  ['BEHAVE', 'Researchers recorded the ___ of the young chimpanzees.', 'behavior', 'a noun after "the" (US spelling)'],
  ['SIGNIFY', 'The discovery was a ___ step forward in medicine.', 'significant', 'an adjective before "step"'],
  ['COMPARE', 'The study makes a ___ between two farming methods.', 'comparison', 'a noun after "a"'],
  ['TRADITION', 'The village still uses ___ methods to make cloth.', 'traditional', 'an adjective before "methods"'],
  ['EXIST', 'Scientists debated the ___ of water on the planet.', 'existence', 'a noun after "the"'],
  ['RELY', 'The new instruments are more ___ than the old ones.', 'reliable', 'an adjective after "more"'],
  ['PURE', 'Workers used sand and charcoal to ___ the water.', 'purify', 'a verb after "to"'],
  ['FREQUENT', 'Earthquakes occur ___ in this region.', 'frequently', 'an adverb describing "occur"'],
  ['EMPLOY', 'The factory was the largest ___ in the town.', 'employer', 'a person or company (noun) after "the largest"'],
  ['CAREFUL', 'The sample was ruined by ___ handling.', 'careless', 'an adjective; ruined handling was not careful'],
  ['INVENT', 'The ___ of the telescope changed astronomy.', 'invention', 'a noun after "The"'],
  ['CONTINUE', 'The animals need a ___ supply of fresh water.', 'continuous', 'an adjective before "supply"'],
];
forms.forEach(([base, s, a, why], i) => items.push({ id: `rwb-f${pad(i + 1)}`, type: 'text', maxWords: 1, q: `Write the correct form of <b>${base}</b>: ${s}`, answer: [a], sol: `<b>${a}</b>. The gap needs ${why}.` }));

// 4. Spelling patterns
const spell = [
  ['The museum will ___ the old ship next year.', 'receive', ['recieve', 'receeve', 'resieve'], '"i before e except after c": rec<b>ei</b>ve.'],
  ['The plan was ___ by the city council.', 'approved', ['aproved', 'approoved', 'apprroved'], 'Double p, single r: a<b>pp</b>roved.'],
  ['The ___ of the river changed after the dam was built.', 'environment', ['enviroment', 'enviornment', 'envirnoment'], 'Keep the n before -ment: enviro<b>n</b>ment.'],
  ['The cost of the project was much ___ than planned.', 'higher', ['hier', 'highr', 'heigher'], 'high + er: <b>higher</b>.'],
  ['Most students found the second test ___.', 'easier', ['easyer', 'easer', 'easiest'], 'Consonant + y: change y to i before -er: eas<b>i</b>er.'],
  ['The team is ___ the results this week.', 'studying', ['studing', 'studiing', 'studdying'], 'Keep the y before -ing: stud<b>y</b>ing.'],
  ['Prices ___ sharply last year.', 'dropped', ['droped', 'dropt', 'drroped'], 'Short vowel + one consonant: double it before -ed: dro<b>pp</b>ed.'],
  ['The scientist is ___ a new model.', 'making', ['makeing', 'makking', 'maiking'], 'Drop the silent e before -ing: mak<b>ing</b>.'],
  ['Results ___ from one region to another.', 'vary', ['vairy', 'varry', 'verry'], 'One r: va<b>r</b>y.'],
  ['The report was ___ written.', 'beautifully', ['beautifuly', 'beatifully', 'beautifull'], 'beautiful + ly keeps both l letters: beautifu<b>ll</b>y.'],
  ['Please bring all the ___ forms to the office.', 'necessary', ['neccessary', 'necesary', 'neccesary'], 'One c, two s: ne<b>c</b>e<b>ss</b>ary.'],
  ['The two cities are ___ the same size.', 'roughly', ['rufly', 'roughley', 'rougly'], 'The "uff" sound is spelled -ough here: r<b>ough</b>ly.'],
  ['The ___ of the bridge took four years.', 'beginning', ['begining', 'beggining', 'beginnig'], 'Stress on the last syllable (be-GIN): double the n: begi<b>nn</b>ing.'],
  ['The forest is home to many ___ animals.', 'different', ['diferent', 'differant', 'diffrent'], 'Double f, -ent ending: di<b>ff</b>er<b>ent</b>.'],
];
spell.forEach(([s, a, wrong, why], i) => items.push({ id: `rwb-sp${pad(i + 1)}`, type: 'mcq', q: `Choose the correct spelling: ${s}`, options: [a, ...wrong], answer: 0, sol: why }));
export default { title: 'Word building: prefixes, suffixes and spelling', accent: 'en-US', items };
