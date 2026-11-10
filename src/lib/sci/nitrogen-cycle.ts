// The nitrogen cycle for school (Learn): the stores nitrogen passes through and the processes that move it, with
// a simple and a detailed (Class 11) description of each, and the fewest steps between two stores. No DOM.

export type Store = 'air' | 'plants' | 'animals' | 'dead' | 'ammonium' | 'nitrate';
export type Process = { id: string; name: string; from: Store; to: Store; human?: boolean; simple: string; detail: string };

export const STORES: Record<Store, { name: string; form: string }> = {
  air: { name: 'Air', form: 'N₂ gas' },
  plants: { name: 'Plants', form: 'proteins, DNA' },
  animals: { name: 'Animals', form: 'proteins, DNA' },
  dead: { name: 'Dead matter & wastes', form: 'urea, proteins' },
  ammonium: { name: 'Soil ammonium', form: 'NH₃ / NH₄⁺' },
  nitrate: { name: 'Soil nitrate', form: 'NO₂⁻ → NO₃⁻' },
};

export const PROCESSES: Process[] = [
  { id: 'fix', name: 'Nitrogen fixation', from: 'air', to: 'ammonium', simple: 'Bacteria in the soil and in the root nodules of peas, beans and other legumes turn nitrogen gas into ammonia.', detail: 'Rhizobium in legume root nodules (and free-living Azotobacter, and cyanobacteria such as Anabaena) use the enzyme nitrogenase to make N₂ + 8H⁺ + 8e⁻ → 2NH₃ + H₂. Leghaemoglobin keeps oxygen away from the enzyme.' },
  { id: 'light', name: 'Lightning', from: 'air', to: 'nitrate', simple: 'Lightning makes nitrogen and oxygen join; rain washes the result into the soil as nitrate.', detail: 'The heat of a lightning bolt makes N₂ + O₂ → 2NO; NO is oxidised to NO₂, which dissolves in rain as nitric acid and reaches the soil as nitrate.' },
  { id: 'haber', name: 'Fertiliser factory', from: 'air', to: 'ammonium', human: true, simple: 'Factories make ammonia from nitrogen in the air, for fertilisers.', detail: 'The Haber process: N₂ + 3H₂ ⇌ 2NH₃ over an iron catalyst at about 450 °C and 200 atm. Ammonia becomes urea and ammonium fertilisers.' },
  { id: 'nitrif', name: 'Nitrification', from: 'ammonium', to: 'nitrate', simple: 'Other soil bacteria turn ammonia into nitrites and then nitrates.', detail: 'Nitrosomonas oxidises NH₄⁺ to nitrite NO₂⁻; Nitrobacter oxidises nitrite to nitrate NO₃⁻. Both need oxygen, so they work in well-aired soil.' },
  { id: 'assimN', name: 'Uptake of nitrate', from: 'nitrate', to: 'plants', simple: 'Plant roots take in nitrates and use them to build proteins.', detail: 'Roots absorb NO₃⁻; the plant reduces it to NH₄⁺ (nitrate and nitrite reductase) and builds amino acids by reductive amination and transamination.' },
  { id: 'assimA', name: 'Uptake of ammonium', from: 'ammonium', to: 'plants', simple: 'Plants can also take in ammonium directly, especially legumes from their nodules.', detail: 'NH₄⁺ from nodules or soil is built into glutamate and then other amino acids, which make proteins and nucleic acids.' },
  { id: 'eat', name: 'Feeding', from: 'plants', to: 'animals', simple: 'Animals get their nitrogen by eating plants (or other animals).', detail: 'Digestion breaks plant proteins into amino acids, which the animal absorbs and rebuilds into its own proteins.' },
  { id: 'dieP', name: 'Death and leaf fall', from: 'plants', to: 'dead', simple: 'Dead plants and fallen leaves keep their nitrogen in proteins.', detail: 'Organic nitrogen in dead plant tissue joins the soil organic matter.' },
  { id: 'dieA', name: 'Death and excretion', from: 'animals', to: 'dead', simple: 'Animal droppings, urine and dead bodies hold nitrogen.', detail: 'Animals excrete nitrogen as ammonia, urea or uric acid, and their bodies hold proteins when they die.' },
  { id: 'ammon', name: 'Ammonification (decay)', from: 'dead', to: 'ammonium', simple: 'Decomposers (bacteria and fungi) break down dead matter and wastes, releasing ammonia.', detail: 'Decomposers break proteins into amino acids and deaminate them, releasing NH₃, which becomes NH₄⁺ in moist soil.' },
  { id: 'denit', name: 'Denitrification', from: 'nitrate', to: 'air', simple: 'In waterlogged soil, some bacteria turn nitrates back into nitrogen gas.', detail: 'Pseudomonas and Thiobacillus use nitrate instead of oxygen where the soil has little air: NO₃⁻ → NO₂⁻ → NO → N₂O → N₂.' },
];

/** The processes that start in a store. */
export const outOf = (s: Store) => PROCESSES.filter((p) => p.from === s);

/** Fewest processes to get from one store to another (breadth-first), with the path of process ids. */
export function shortest(a: Store, b: Store): string[] | null {
  if (a === b) return [];
  const prev = new Map<Store, Process>(), seen = new Set<Store>([a]), queue: Store[] = [a];
  while (queue.length) {
    const s = queue.shift()!;
    for (const p of outOf(s)) {
      if (seen.has(p.to)) continue;
      seen.add(p.to); prev.set(p.to, p); queue.push(p.to);
      if (p.to === b) {
        const path: string[] = []; let t: Store = b;
        while (t !== a) { const q = prev.get(t)!; path.unshift(q.id); t = q.from; }
        return path;
      }
    }
  }
  return null;
}

/** Fewest processes to go out from a store and come back to it. */
export function shortestLoop(s: Store): string[] | null {
  let best: string[] | null = null;
  for (const p of outOf(s)) { const back = shortest(p.to, s); if (back && (!best || back.length + 1 < best.length)) best = [p.id, ...back]; }
  return best;
}
