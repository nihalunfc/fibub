// #T864 Ingredient swaps: fibub's own list, written from general kitchen knowledge.
// Each swap replaces ONE unit of the ingredient (the `per` unit). Flags say what the swap itself is:
// v vegan, d dairy-free, e egg-free, g gluten-free (check labels: oats, stock and tamari vary).
export type Part = [number, string, string]; // quantity, unit ('' for none), what
export type Swap = { parts: Part[]; note?: string; f: string };
export type Item = { name: string; per: string; also?: string; swaps: Swap[] };

export const PLURAL: Record<string, string> = { cup: 'cups', egg: 'eggs', clove: 'cloves', 'medium onion': 'medium onions', 'vanilla pod': 'vanilla pods' };

export const ITEMS: Item[] = [
  { name: 'Buttermilk', per: 'cup', swaps: [
    { parts: [[1, 'cup', 'milk'], [1, 'tbsp', 'lemon juice or white vinegar']], note: 'Stir and let it stand 5 minutes until it thickens.', f: 'eg' },
    { parts: [[1, 'cup', 'unsweetened soy milk'], [1, 'tbsp', 'lemon juice']], note: 'Let it stand 5 minutes.', f: 'vdeg' }] },
  { name: 'Self-raising flour', per: 'cup', also: 'self-rising flour', swaps: [
    { parts: [[1, 'cup', 'all-purpose (plain) flour'], [1.5, 'tsp', 'baking powder'], [0.25, 'tsp', 'salt']], note: 'Whisk well so the baking powder is spread evenly.', f: 'vde' }] },
  { name: 'Cake flour', per: 'cup', swaps: [
    { parts: [[0.75, 'cup', 'all-purpose flour'], [2, 'tbsp', 'all-purpose flour'], [2, 'tbsp', 'cornstarch']], note: 'Sift together twice for a lighter crumb.', f: 'vde' }] },
  { name: 'Wheat flour', per: 'cup', also: 'all-purpose flour plain flour maida gluten', swaps: [
    { parts: [[1, 'cup', 'gluten-free 1-to-1 baking blend (with xanthan gum)']], note: 'Works best in cakes, cookies and muffins; bread needs its own recipe.', f: 'vdeg' }] },
  { name: 'Flour for thickening', per: 'tbsp', also: 'thicken sauce gravy', swaps: [
    { parts: [[1.5, 'tsp', 'cornstarch']], note: 'Mix with a little cold water first, then stir into the hot liquid.', f: 'vdeg' }] },
  { name: 'Cornstarch', per: 'tbsp', also: 'cornflour corn starch', swaps: [
    { parts: [[2, 'tbsp', 'all-purpose flour']], note: 'For thickening; cook a few minutes longer so it does not taste floury.', f: 'vde' },
    { parts: [[1, 'tbsp', 'potato starch or arrowroot']], f: 'vdeg' }] },
  { name: 'Baking powder', per: 'tsp', swaps: [
    { parts: [[0.25, 'tsp', 'baking soda'], [0.5, 'tsp', 'cream of tartar']], note: 'Mix just before using.', f: 'vdeg' }] },
  { name: 'Baking soda', per: 'tsp', also: 'bicarbonate of soda bicarb', swaps: [
    { parts: [[3, 'tsp', 'baking powder']], note: 'Leave out any salt in the recipe; the taste may change slightly.', f: 'vdeg' }] },
  { name: 'Egg (in baking)', per: 'egg', also: 'eggs', swaps: [
    { parts: [[1, 'tbsp', 'ground flaxseed'], [3, 'tbsp', 'water']], note: 'Stir and rest 5 minutes until it gels. Good in muffins, cookies and pancakes.', f: 'vdeg' },
    { parts: [[0.25, 'cup', 'unsweetened applesauce']], note: 'Adds moisture; best in moist cakes and quick breads.', f: 'vdeg' },
    { parts: [[3, 'tbsp', 'aquafaba (liquid from a can of chickpeas)']], note: 'Whisk until foamy. Can be whipped like egg white.', f: 'vdeg' }] },
  { name: 'Butter', per: 'cup', also: 'margarine', swaps: [
    { parts: [[1, 'cup', 'solid coconut oil']], note: 'Gives a faint coconut taste.', f: 'vdeg' },
    { parts: [[0.75, 'cup', 'vegetable oil'], [2, 'tbsp', 'vegetable oil']], note: 'For cakes and muffins, not for pastry or cookies that need solid fat.', f: 'vdeg' }] },
  { name: 'Ghee', per: 'cup', also: 'clarified butter', swaps: [
    { parts: [[1, 'cup', 'unsalted butter']], note: 'Butter burns at a lower heat, so cook a little gentler.', f: 'eg' },
    { parts: [[1, 'cup', 'coconut oil or neutral oil']], f: 'vdeg' }] },
  { name: 'Milk', per: 'cup', swaps: [
    { parts: [[0.5, 'cup', 'evaporated milk'], [0.5, 'cup', 'water']], f: 'eg' },
    { parts: [[1, 'cup', 'unsweetened soy milk']], note: 'Oat or almond milk also work; oat is gluten-free only if the pack says so.', f: 'vdeg' }] },
  { name: 'Heavy cream (in cooking)', per: 'cup', also: 'double cream whipping cream', swaps: [
    { parts: [[0.75, 'cup', 'milk'], [0.25, 'cup', 'melted butter']], note: 'For sauces and soups. It will not whip.', f: 'eg' },
    { parts: [[1, 'cup', 'full-fat coconut milk']], note: 'For curries and soups.', f: 'vdeg' }] },
  { name: 'Sour cream', per: 'cup', swaps: [
    { parts: [[1, 'cup', 'plain Greek yogurt']], note: 'Add it off the heat so it does not split.', f: 'eg' },
    { parts: [[1, 'cup', 'thick plain soy yogurt'], [1, 'tsp', 'lemon juice']], f: 'vdeg' }] },
  { name: 'Plain yogurt', per: 'cup', also: 'yoghurt curd dahi', swaps: [
    { parts: [[1, 'cup', 'sour cream']], f: 'eg' },
    { parts: [[1, 'cup', 'plain soy yogurt']], f: 'vdeg' }] },
  { name: 'Mayonnaise (in dressings)', per: 'cup', also: 'mayo', swaps: [
    { parts: [[1, 'cup', 'plain Greek yogurt']], note: 'Tangier and lighter; add a pinch of salt.', f: 'eg' }] },
  { name: 'Cream cheese', per: 'cup', swaps: [
    { parts: [[1, 'cup', 'thick strained yogurt (labneh)']], note: 'For dips and spreads rather than cheesecake.', f: 'eg' }] },
  { name: 'Ricotta', per: 'cup', also: 'paneer', swaps: [
    { parts: [[1, 'cup', 'cottage cheese, blended smooth']], f: 'eg' }] },
  { name: 'White sugar', per: 'cup', also: 'granulated sugar caster sugar', swaps: [
    { parts: [[0.75, 'cup', 'honey']], note: 'Use 3 tbsp less of the other liquid and bake 15 °C (25 °F) lower; it browns faster.', f: 'deg' },
    { parts: [[1, 'cup', 'coconut sugar']], note: 'Darker colour and a caramel taste.', f: 'vdeg' }] },
  { name: 'Brown sugar', per: 'cup', swaps: [
    { parts: [[1, 'cup', 'white sugar'], [1, 'tbsp', 'molasses']], note: 'Use 2 tbsp molasses for dark brown sugar.', f: 'vdeg' }] },
  { name: 'Powdered sugar', per: 'cup', also: 'icing sugar confectioners sugar', swaps: [
    { parts: [[1, 'cup', 'white sugar'], [1, 'tbsp', 'cornstarch']], note: 'Blend in a dry blender until fine as dust.', f: 'vdeg' }] },
  { name: 'Honey', per: 'cup', swaps: [
    { parts: [[1, 'cup', 'maple syrup']], f: 'vdeg' },
    { parts: [[1, 'cup', 'golden syrup or light corn syrup']], f: 'vdeg' }] },
  { name: 'Corn syrup', per: 'cup', also: 'golden syrup', swaps: [
    { parts: [[1, 'cup', 'white sugar'], [0.25, 'cup', 'water']], note: 'Heat and stir until the sugar dissolves, then cool.', f: 'vdeg' }] },
  { name: 'Semi-sweet chocolate', per: 'oz', also: 'dark chocolate chips', swaps: [
    { parts: [[0.5, 'oz', 'unsweetened chocolate'], [1, 'tbsp', 'sugar']], note: '1 oz is about 28 g.', f: 'vdeg' }] },
  { name: 'Unsweetened chocolate', per: 'oz', also: 'baking chocolate', swaps: [
    { parts: [[3, 'tbsp', 'unsweetened cocoa powder'], [1, 'tbsp', 'vegetable oil']], note: '1 oz is about 28 g.', f: 'vdeg' }] },
  { name: 'Vanilla extract', per: 'tsp', also: 'vanilla essence', swaps: [
    { parts: [[1 / 3, 'vanilla pod', 'seeds scraped out']], f: 'vdeg' },
    { parts: [[1, 'tsp', 'maple syrup']], note: 'A softer flavour; fine in pancakes and oats.', f: 'vdeg' }] },
  { name: 'Lemon juice', per: 'tsp', also: 'lime juice', swaps: [
    { parts: [[0.5, 'tsp', 'white vinegar']], note: 'For acidity only; it will not taste of lemon.', f: 'vdeg' }] },
  { name: 'Rice vinegar', per: 'tbsp', swaps: [
    { parts: [[1, 'tbsp', 'apple cider vinegar'], [0.25, 'tsp', 'sugar']], f: 'vdeg' }] },
  { name: 'Red wine (in cooking)', per: 'cup', also: 'alcohol', swaps: [
    { parts: [[1, 'cup', 'vegetable stock'], [1, 'tbsp', 'red wine vinegar']], f: 'vdeg' }] },
  { name: 'White wine (in cooking)', per: 'cup', also: 'alcohol', swaps: [
    { parts: [[1, 'cup', 'vegetable stock'], [1, 'tbsp', 'lemon juice']], f: 'vdeg' }] },
  { name: 'Soy sauce', per: 'tbsp', swaps: [
    { parts: [[1, 'tbsp', 'tamari']], note: 'Most tamari is wheat-free; check the label.', f: 'vdeg' }] },
  { name: 'Prepared mustard', per: 'tbsp', also: 'dijon', swaps: [
    { parts: [[1, 'tsp', 'dry mustard powder'], [2, 'tsp', 'vinegar']], note: 'Stir and let it stand 10 minutes.', f: 'vdeg' }] },
  { name: 'Tomato paste', per: 'tbsp', also: 'tomato puree', swaps: [
    { parts: [[3, 'tbsp', 'tomato sauce or passata']], note: 'Simmer it down to about a third, or cut other liquid.', f: 'vdeg' }] },
  { name: 'Garlic', per: 'clove', swaps: [
    { parts: [[0.125, 'tsp', 'garlic powder']], f: 'vdeg' }] },
  { name: 'Onion', per: 'medium onion', swaps: [
    { parts: [[1, 'tsp', 'onion powder']], note: 'Flavour only: you lose the bulk and moisture.', f: 'vdeg' }] },
  { name: 'Fresh herbs', per: 'tbsp', also: 'basil oregano thyme parsley', swaps: [
    { parts: [[1, 'tsp', 'dried herbs']], note: 'Add dried herbs earlier in the cooking.', f: 'vdeg' }] },
  { name: 'Fresh ginger, grated', per: 'tbsp', swaps: [
    { parts: [[0.25, 'tsp', 'ground ginger']], f: 'vdeg' }] },
  { name: 'Allspice', per: 'tsp', swaps: [
    { parts: [[0.5, 'tsp', 'ground cinnamon'], [0.25, 'tsp', 'ground nutmeg'], [0.25, 'tsp', 'ground cloves']], f: 'vdeg' }] },
  { name: 'Pumpkin pie spice', per: 'tsp', also: 'mixed spice', swaps: [
    { parts: [[0.5, 'tsp', 'ground cinnamon'], [0.25, 'tsp', 'ground ginger'], [0.125, 'tsp', 'ground nutmeg'], [0.125, 'tsp', 'ground cloves']], f: 'vdeg' }] },
  { name: 'Breadcrumbs', per: 'cup', also: 'panko', swaps: [
    { parts: [[1, 'cup', 'quick rolled oats']], note: 'Gluten-free only if the oats are labelled so.', f: 'vde' },
    { parts: [[1, 'cup', 'ground almonds']], f: 'vdeg' }] },
];

const FR: [number, string][] = [[0, ''], [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'], [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'], [1, '']];

/** Kitchen fraction: 1.5 -> "1½", 0.25 -> "¼", 2 -> "2". Below 1/16 -> "a pinch of". */
export function frac(q: number): string {
  if (q < 1 / 16) return 'a pinch of';
  if (q >= 10) return String(Math.round(q));
  let w = Math.floor(q), r = q - w, best = FR[0];
  for (const f of FR) if (Math.abs(f[0] - r) < Math.abs(best[0] - r)) best = f;
  if (best[0] === 1) { w += 1; best = FR[0]; }
  return w === 0 ? best[1] : `${w}${best[1]}`;
}

/** "2 cups milk", with the unit pluralised when the amount is over 1. */
export function amount(q: number, unit: string, what = ''): string {
  const s = frac(q);
  if (s === 'a pinch of') return `a pinch of ${what}`.trim();
  const u = unit && q > 1.0001 ? PLURAL[unit] || unit : unit;
  return [s, u, what].filter(Boolean).join(' ');
}
