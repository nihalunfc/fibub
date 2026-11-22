// Complete the Words: whole paragraphs (lesson 2.1). Original paragraphs by fibub, not ETS material.
// Words in {braces} are cut: the first half (rounded up) stays and the learner completes each numbered gap.
const P = [
  ['Why leaves change color', 'In autumn, the leaves of many trees turn red, orange or yellow. During the summer, leaves are green {because} they contain a pigment called chlorophyll. As the days {become} shorter, the tree stops making chlorophyll, and the green color slowly {fades}. Other colors, which were there all {along}, can then be seen. Some red colors, {however}, are made fresh in autumn when sugar is trapped {inside} the leaf.'],
  ['The first public libraries', 'For most of history, books were rare and {expensive}. Only wealthy families and religious {schools} could own large collections. In the nineteenth century, several cities {opened} libraries that anyone could use for free. Supporters believed that reading would {help} workers improve their lives. Within a few {decades}, public libraries had spread to small towns {across} the country.'],
  ['How camels survive', 'Camels are well suited to life in hot, dry {places}. Contrary to a common belief, a camel’s hump does not {store} water. Instead, it holds fat, which the {animal} can use for energy when food is scarce. Camels also {lose} very little water through sweat, and they can drink a {large} amount quickly when they find a well. Their wide feet keep them from {sinking} into soft sand.'],
  ['Sleep and learning', 'Students often stay up late to study {before} an exam, but research suggests this may not be the {best} plan. While we sleep, the brain {replays} and organizes what we learned during the day. People who sleep well after {studying} tend to remember more the next {morning}. A short nap can also {improve} performance on some memory tasks.'],
  ['Early writing systems', 'The earliest known writing was used for {practical} purposes. Clerks pressed marks into wet clay to {record} how much grain or how many animals a family owned. Over {time}, these simple marks developed into signs that could stand for {sounds}. This change allowed people to write down names, stories and {laws}. Writing therefore began as a tool for trade but soon {became} a tool for culture.'],
  ['Urban heat islands', 'Cities are often warmer than the {countryside} around them. Roads and buildings absorb heat during the day and {release} it slowly at night. There are also fewer {trees} to provide shade and cool the air. To reduce this {effect}, some cities paint roofs white or plant gardens on top of {buildings}. These changes can lower summer temperatures by a few {degrees}.'],
];
const cut = (w) => { const k = Math.ceil(w.length / 2); return [w.slice(0, k), w.slice(k)]; };
const groups = {}, items = [];
P.forEach(([title, text], p) => {
  const g = `p${p + 1}`; let n = 0; const words = [];
  const shown = text.replace(/\{(\w+)\}/g, (_, w) => { n++; words.push(w); const [h, t] = cut(w); return `<b>(${n}) ${h}${'_'.repeat(t.length)}</b>`; });
  groups[g] = { title: `Complete the words in the paragraph: ${title}`, passage: `<p><b>${title}</b></p><p>${shown}</p>` };
  words.forEach((w, i) => {
    const [h, t] = cut(w);
    items.push({ id: `rcwp-${p + 1}${i + 1}`, type: 'text', group: g, maxWords: 1, q: `Gap (${i + 1}): ${h}${'_'.repeat(t.length)}`, answer: [w, t], sol: `<b>${w}</b>. Read the words around gap ${i + 1}: the grammar and the meaning of the sentence both point to "${w}". Missing letters: "${t}".` });
  });
});
export default { title: 'Complete the Words: full paragraphs', accent: 'en-US', groups, items };
