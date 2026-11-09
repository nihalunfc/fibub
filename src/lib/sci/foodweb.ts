// Food web builder (school biology): who eats whom, trophic levels, food chains, what happens when a species
// is removed, and the energy pyramid with the 10 % rule. Plain maths, no DOM. Example webs are simplified
// teaching examples, not survey data.

export type Org = { id: string; name: string; producer?: boolean };
/** A link [food, eater]: energy flows from the food to the eater (the way the arrows point). */
export type Link = [string, string];
export type Web = { id: string; name: string; orgs: Org[]; links: Link[] };

export const WEBS: Web[] = [
  { id: 'forest', name: 'Forest', orgs: [
    { id: 'grass', name: 'Grass', producer: true }, { id: 'trees', name: 'Trees', producer: true }, { id: 'shrubs', name: 'Shrubs', producer: true },
    { id: 'grasshopper', name: 'Grasshopper' }, { id: 'caterpillar', name: 'Caterpillar' }, { id: 'deer', name: 'Deer' }, { id: 'rabbit', name: 'Rabbit' }, { id: 'mouse', name: 'Mouse' },
    { id: 'frog', name: 'Frog' }, { id: 'sparrow', name: 'Sparrow' }, { id: 'snake', name: 'Snake' }, { id: 'hawk', name: 'Hawk' }, { id: 'tiger', name: 'Tiger' },
  ], links: [
    ['grass', 'grasshopper'], ['trees', 'caterpillar'], ['grass', 'deer'], ['shrubs', 'deer'], ['grass', 'rabbit'], ['shrubs', 'rabbit'], ['grass', 'mouse'], ['shrubs', 'mouse'],
    ['grasshopper', 'frog'], ['caterpillar', 'frog'], ['grasshopper', 'sparrow'], ['caterpillar', 'sparrow'],
    ['frog', 'snake'], ['mouse', 'snake'], ['sparrow', 'snake'], ['snake', 'hawk'], ['mouse', 'hawk'], ['sparrow', 'hawk'], ['rabbit', 'hawk'], ['deer', 'tiger'],
  ] },
  { id: 'pond', name: 'Pond', orgs: [
    { id: 'algae', name: 'Algae', producer: true }, { id: 'weed', name: 'Water plants', producer: true },
    { id: 'zoo', name: 'Water fleas' }, { id: 'snail', name: 'Snail' }, { id: 'larvae', name: 'Mosquito larvae' }, { id: 'tadpole', name: 'Tadpole' },
    { id: 'smallfish', name: 'Small fish' }, { id: 'nymph', name: 'Dragonfly nymph' }, { id: 'bigfish', name: 'Big fish' }, { id: 'heron', name: 'Heron' },
  ], links: [
    ['algae', 'zoo'], ['algae', 'snail'], ['weed', 'snail'], ['algae', 'larvae'], ['algae', 'tadpole'],
    ['zoo', 'smallfish'], ['larvae', 'smallfish'], ['larvae', 'nymph'], ['tadpole', 'nymph'],
    ['smallfish', 'bigfish'], ['nymph', 'bigfish'], ['tadpole', 'bigfish'], ['bigfish', 'heron'], ['smallfish', 'heron'],
  ] },
];

const foodOf = (links: Link[], id: string) => links.filter(([, e]) => e === id).map(([f]) => f);
const eatersOf = (links: Link[], id: string) => links.filter(([f]) => f === id).map(([, e]) => e);

/** Trophic level: producers 1; others 1 + the shortest chain down to a producer. NaN if no route to a producer. */
export function levels(orgs: Org[], links: Link[]): Record<string, number> {
  const lv: Record<string, number> = {};
  for (const o of orgs) lv[o.id] = o.producer ? 1 : NaN;
  let changed = true;
  while (changed) {
    changed = false;
    for (const o of orgs) {
      if (o.producer) continue;
      const best = Math.min(...foodOf(links, o.id).map((f) => lv[f]).filter((x) => Number.isFinite(x)));
      if (Number.isFinite(best) && !(lv[o.id] <= best + 1)) { lv[o.id] = best + 1; changed = true; }
    }
  }
  return lv;
}

/** Every food chain from a producer to a top consumer (one nobody here eats). Cycles are cut. */
export function chains(orgs: Org[], links: Link[], limit = 5000): string[][] {
  const out: string[][] = [];
  const walk = (path: string[]) => {
    if (out.length >= limit) return;
    const next = eatersOf(links, path[path.length - 1]).filter((e) => !path.includes(e));
    if (!next.length) { if (path.length > 1) out.push(path); return; }
    for (const e of next) walk([...path, e]);
  };
  for (const o of orgs) if (o.producer) walk([o.id]);
  return out;
}

/** What happens when one species is removed: who loses all food and dies out (repeated down the web),
 *  who has fewer predators (likely to increase), and who lost some food but still has other food. */
export function removeEffects(orgs: Org[], links: Link[], removed: string) {
  const gone = new Set([removed]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const o of orgs) {
      if (o.producer || gone.has(o.id)) continue;
      const food = foodOf(links, o.id);
      if (food.length && food.every((f) => gone.has(f))) { gone.add(o.id); changed = true; }
    }
  }
  const alive = orgs.filter((o) => !gone.has(o.id)).map((o) => o.id);
  const more = alive.filter((id) => eatersOf(links, id).some((e) => gone.has(e)));
  const hungrier = alive.filter((id) => foodOf(links, id).some((f) => gone.has(f)));
  return { gone: [...gone].filter((id) => id !== removed), more, hungrier, alive };
}

/** Energy at each trophic level (kJ) when each level passes on `eff` (0.1 = the 10 % rule). */
export const pyramid = (e0: number, eff: number, n: number) => Array.from({ length: n }, (_, i) => e0 * eff ** i);
