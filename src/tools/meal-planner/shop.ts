// #T866 Meal planner: read ingredient lines and merge them into a grouped shopping list.
export type Line = { q: number | null; unit: string; name: string };
export type Item = { name: string; amounts: [number, string][]; plain: boolean; group: string };

const UNITS: Record<string, string> = {
  g: 'g', gram: 'g', grams: 'g', kg: 'kg', mg: 'mg', ml: 'ml', l: 'l', litre: 'l', litres: 'l', liter: 'l', liters: 'l',
  cup: 'cup', cups: 'cup', tbsp: 'tbsp', tbsps: 'tbsp', tsp: 'tsp', tsps: 'tsp', oz: 'oz', lb: 'lb', lbs: 'lb',
  can: 'can', cans: 'can', tin: 'can', tins: 'can', jar: 'jar', jars: 'jar', pack: 'pack', packs: 'pack', packet: 'pack', packets: 'pack',
  bunch: 'bunch', bunches: 'bunch', clove: 'clove', cloves: 'clove', slice: 'slice', slices: 'slice', piece: 'piece', pieces: 'piece',
  handful: 'handful', handfuls: 'handful', pinch: 'pinch', pinches: 'pinch',
};
const PLURAL: Record<string, string> = { cup: 'cups', can: 'cans', jar: 'jars', pack: 'packs', bunch: 'bunches', clove: 'cloves', slice: 'slices', piece: 'pieces', handful: 'handfuls', pinch: 'pinches' };
const UF: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 };

export const GROUPS: [string, RegExp][] = [
  ['Spices and seasoning', /\b(salt|black pepper|turmeric|cumin|cinnamon|paprika|chilli|chili|spice|masala|oregano|nutmeg)/],
  ['Tins, jars and dry goods', /\b(stock|sauce|oil|vinegar|sugar|honey|jam|lentil|bean|chickpea|tomato paste|ketchup|mustard|nut|seed)/],
  ['Dairy and eggs', /\b(milk|egg|cheese|butter|yogurt|yoghurt|cream|paneer|curd)/],
  ['Meat and fish', /\b(chicken|beef|pork|lamb|fish|salmon|tuna|prawn|shrimp|mince|turkey|bacon|sausage|ham)/],
  ['Bread, grains and pasta', /\b(rice|pasta|spaghetti|bread|flour|oat|noodle|tortilla|wrap|cereal|couscous|bun|roll)/],
  ['Fruit and vegetables', /\b(onion|garlic|tomato|potato|carrot|pea|banana|apple|lemon|lime|spinach|lettuce|pepper|ginger|herb|coriander|cilantro|cucumber|mushroom|fruit|berr|avocado|broccoli|cabbage|orange|grape|courgette|zucchini|celery|salad)/],
];

export function parseLine(raw: string): Line | null {
  let s = raw.trim().replace(/^[-*•]\s*/, '');
  if (!s) return null;
  let q: number | null = null;
  const m = s.match(/^(\d+(?:[.,]\d+)?)?\s*(?:(\d+)\/(\d+)|([½¼¾⅓⅔⅛]))?(?=\s|$|[a-zA-Z])/);
  if (m && (m[1] || m[2] || m[4])) {
    const whole = m[1] ? +m[1].replace(',', '.') : 0;
    const f = m[2] ? +m[2] / +m[3] : m[4] ? UF[m[4]] : 0;
    // "1 1/2" or "1½"; a lone "1/2" has no whole part.
    q = whole + f;
    s = s.slice(m[0].length).trim();
  }
  let unit = '';
  if (q !== null) {
    const u = s.match(/^([a-zA-Z]+)\.?(?:\s+of)?\s+(.+)$/);
    if (u && UNITS[u[1].toLowerCase()]) { unit = UNITS[u[1].toLowerCase()]; s = u[2]; }
  }
  return { q, unit, name: s.trim() };
}

const key = (name: string) => name.toLowerCase().replace(/\s+/g, ' ').replace(/(?<=[a-z]{3})(es|s)$/, '');

export function merge(lines: string[]): Item[] {
  const map = new Map<string, Item>();
  for (const raw of lines) {
    const p = parseLine(raw);
    if (!p || !p.name) continue;
    const k = key(p.name);
    let it = map.get(k);
    if (!it) {
      const low = p.name.toLowerCase(), g = GROUPS.find(([, re]) => re.test(low));
      it = { name: p.name, amounts: [], plain: true, group: p.unit === 'can' || p.unit === 'jar' ? 'Tins, jars and dry goods' : g ? g[0] : 'Other' };
      map.set(k, it);
    }
    if (p.q !== null) {
      it.plain = false;
      // kg, l and mg are added to g and ml so 500 g + 1 kg become one line (shown again as kg or l from 1000 up).
      const [q, unit] = p.unit === 'kg' ? [p.q * 1000, 'g'] : p.unit === 'mg' ? [p.q / 1000, 'g'] : p.unit === 'l' ? [p.q * 1000, 'ml'] : [p.q, p.unit];
      const a = it.amounts.find((x) => x[1] === unit);
      if (a) a[0] += q; else it.amounts.push([q, unit]);
    }
  }
  return [...map.values()];
}

const FR: [number, string][] = [[0.25, '¼'], [1 / 3, '⅓'], [0.5, '½'], [2 / 3, '⅔'], [0.75, '¾']];
export function qty(q: number): string {
  const w = Math.floor(q + 1e-9), r = q - w;
  if (r < 0.01) return String(w);
  for (const [v, s] of FR) if (Math.abs(r - v) < 0.01) return w ? `${w}${s}` : s;
  return String(Math.round(q * 100) / 100);
}

/** "400 g rice", "4 cloves garlic", "2 onions", "rice: 400 g + 1 cup" style lines. */
export function itemText(it: Item): string {
  if (!it.amounts.length) return it.name;
  const parts = it.amounts.map(([q0, u0]) => {
    const [q, u] = u0 === 'g' && q0 >= 1000 ? [q0 / 1000, 'kg'] : u0 === 'ml' && q0 >= 1000 ? [q0 / 1000, 'l'] : [q0, u0];
    return u ? `${qty(q)} ${q > 1 && PLURAL[u] ? PLURAL[u] : u}` : qty(q);
  });
  let name = it.name;
  const n = it.amounts.length === 1 && !it.amounts[0][1] ? it.amounts[0][0] : 0;
  if (n > 1 && !/s$/i.test(name)) name += /o$/i.test(name) ? 'es' : 's';
  return `${parts.join(' + ')} ${name}`;
}

const MEASURES = new Set(['g', 'kg', 'mg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'pinch', 'handful']);

/** Multiply every amount by k (people cooked for / people planned for). Whole things you buy by the piece (eggs, cans, cloves) round up. */
export function scaleItems(items: Item[], k: number): Item[] {
  if (!(k > 0) || !Number.isFinite(k) || Math.abs(k - 1) < 1e-9) return items;
  return items.map((it) => ({ ...it, amounts: it.amounts.map(([q, u]) => [MEASURES.has(u) ? q * k : Math.ceil(q * k - 1e-9), u] as [number, string]) }));
}

/** Leave out things already at home. Matches on the name only, whole words, either way round ("oil" covers "olive oil"). */
export function removeHave(items: Item[], have: string): Item[] {
  const keys = have.split('\n').map((l) => parseLine(l)).filter((p): p is Line => !!p && !!p.name).map((p) => ' ' + key(p.name) + ' ');
  if (!keys.length) return items;
  return items.filter((it) => { const ik = ' ' + key(it.name) + ' '; return !keys.some((hk) => ik.includes(hk) || hk.includes(ik)); });
}

/** Factor for "planned for" and "shopping for" people; 1 when either is blank, and NaN when not a sensible number. */
export function peopleFactor(planned: string, shopping: string): number {
  if (planned.trim() === '' || shopping.trim() === '') return 1;
  const a = +planned.replace(',', '.'), b = +shopping.replace(',', '.');
  return a > 0 && b > 0 && Number.isFinite(a) && Number.isFinite(b) && a <= 1000 && b <= 1000 ? b / a : NaN;
}
