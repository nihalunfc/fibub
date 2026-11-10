// Parts of a flower for the Flower parts Learn tool (#1488). Plain TypeScript, no DOM.
export type Part = { id: string; name: string; job: string; group: string };
export const PARTS: Part[] = [
  { id: 'sepal', name: 'Sepal', job: 'Green leaf-like part that protects the bud', group: 'outer whorl' },
  { id: 'petal', name: 'Petal', job: 'Bright part that attracts insects and birds', group: 'outer whorl' },
  { id: 'filament', name: 'Filament', job: 'Thin stalk that holds the anther up', group: 'stamen, the male part' },
  { id: 'anther', name: 'Anther', job: 'Makes and holds the pollen grains', group: 'stamen, the male part' },
  { id: 'stigma', name: 'Stigma', job: 'Sticky top that catches pollen', group: 'carpel, the female part' },
  { id: 'style', name: 'Style', job: 'Tube that joins the stigma to the ovary', group: 'carpel, the female part' },
  { id: 'ovary', name: 'Ovary', job: 'Swollen base that holds the ovules and becomes the fruit', group: 'carpel, the female part' },
  { id: 'ovule', name: 'Ovule', job: 'Holds the egg cell and becomes the seed', group: 'carpel, the female part' },
];
export const STAGES = [
  { btn: 'Peel sepals', after: 'Sepals removed. The petals are now on the outside.' },
  { btn: 'Peel petals', after: 'Petals removed. The stamens (male) and carpel (female) are left.' },
  { btn: 'Peel stamens', after: 'Stamens removed. Only the carpel is left: stigma, style and ovary.' },
];
type QItem = { q: string; ans: number; choices: string[]; work: string };
/** Four label questions; every right answer is the part whose job (or name) the question gives. */
export function quizSet(pick: (lo: number, hi: number) => number): QItem[] {
  const idx = PARTS.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = pick(0, i); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx.slice(0, 4).map((pi, n) => {
    const p = PARTS[pi];
    const others = PARTS.filter((x) => x.id !== p.id).map((x) => ({ x, k: pick(0, 1000) })).sort((a, b) => a.k - b.k).slice(0, 2).map((o) => o.x);
    const pos = pick(0, 2), opts = [...others]; opts.splice(pos, 0, p);
    return n % 2 === 0
      ? { q: `Which part: "${p.job}"?`, ans: pos, choices: opts.map((o) => o.name), work: `${p.name}: ${p.job.toLowerCase()}.` }
      : { q: `What does the ${p.name.toLowerCase()} do?`, ans: pos, choices: opts.map((o) => o.job), work: `${p.name}: ${p.job.toLowerCase()}.` };
  });
}
