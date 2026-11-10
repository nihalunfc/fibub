// Separation lab for the school separation-lab tool: a mixture sits in a container, the student picks a method,
// and simple property rules (size, magnetism, solubility, density, boiling point, subliming, dye solubility)
// decide what comes out. Plain TypeScript, no DOM. The boiling points are rounded textbook values.

export type Size = 'big' | 'grain' | 'fine' | 'tiny';
export type Comp = {
  id: string; name: string; liquid?: boolean; soluble?: boolean; size?: Size; magnetic?: boolean; sublimes?: boolean;
  bp?: number; immiscible?: boolean; dense?: number; pick?: boolean; dye?: number; colour: string;
};

// dye: the made-up Rf value of each dye on paper with water as the solvent.
export const COMPS: Record<string, Comp> = {
  rice: { id: 'rice', name: 'rice', size: 'big', colour: '#e8e2cf' },
  stone: { id: 'stone', name: 'small stones', size: 'big', pick: true, colour: '#7b7b7b' },
  flour: { id: 'flour', name: 'flour', size: 'fine', colour: '#f1ead8' },
  bran: { id: 'bran', name: 'bran', size: 'big', colour: '#9a6a2f' },
  iron: { id: 'iron', name: 'iron filings', size: 'grain', magnetic: true, colour: '#3d3d3d' },
  sulphur: { id: 'sulphur', name: 'sulphur powder', size: 'grain', colour: '#e3c51b' },
  sand: { id: 'sand', name: 'sand', size: 'grain', colour: '#c9a35b' },
  salt: { id: 'salt', name: 'salt', size: 'grain', soluble: true, bp: 1465, colour: '#d9d9d9' },
  nh4cl: { id: 'nh4cl', name: 'ammonium chloride', size: 'grain', soluble: true, sublimes: true, colour: '#f4f4f4' },
  clay: { id: 'clay', name: 'clay (mud)', size: 'fine', colour: '#8a6a4a' },
  cream: { id: 'cream', name: 'cream (fat drops)', size: 'tiny', colour: '#fff4c8' },
  water: { id: 'water', name: 'water', liquid: true, bp: 100, dense: 1, colour: '#6aa7e0' },
  oil: { id: 'oil', name: 'cooking oil', liquid: true, bp: 300, immiscible: true, dense: 0.92, colour: '#e0a526' },
  acetone: { id: 'acetone', name: 'acetone', liquid: true, bp: 56, dense: 0.79, colour: '#b8d7f2' },
  ethanol: { id: 'ethanol', name: 'ethanol (alcohol)', liquid: true, bp: 78, dense: 0.79, colour: '#c6dff5' },
  blue: { id: 'blue', name: 'blue dye', soluble: true, size: 'tiny', dye: 0.3, colour: '#2050c0' },
  yellow: { id: 'yellow', name: 'yellow dye', soluble: true, size: 'tiny', dye: 0.7, colour: '#e0b400' },
};

export type Mixture = { id: string; name: string; comps: string[]; targets: string[]; best: string[]; note: string };
export const MIXTURES: Mixture[] = [
  { id: 'rice', name: 'Rice and small stones', comps: ['rice', 'stone'], targets: ['rice', 'stone'], best: ['hand'], note: 'Big pieces you can see and tell apart.' },
  { id: 'flour', name: 'Flour and bran', comps: ['flour', 'bran'], targets: ['flour', 'bran'], best: ['sieve'], note: 'Fine powder and big flakes.' },
  { id: 'iron', name: 'Iron filings and sulphur', comps: ['iron', 'sulphur'], targets: ['iron', 'sulphur'], best: ['magnet'], note: 'Only one of them is pulled by a magnet.' },
  { id: 'sandw', name: 'Sand in water', comps: ['sand', 'water'], targets: ['sand', 'water'], best: ['settle', 'filter'], note: 'Sand does not dissolve and is heavier than water.' },
  { id: 'brine', name: 'Salt water', comps: ['salt', 'water'], targets: ['salt', 'water'], best: ['distil'], note: 'The salt is dissolved: it passes through any filter.' },
  { id: 'sandsalt', name: 'Sand and salt', comps: ['sand', 'salt'], targets: ['sand', 'salt'], best: ['water', 'filter', 'evap'], note: 'Two grains of the same size. One of them dissolves in water.' },
  { id: 'oil', name: 'Oil and water', comps: ['oil', 'water'], targets: ['oil', 'water'], best: ['funnel'], note: 'Two liquids that do not mix: oil floats on top.' },
  { id: 'acetone', name: 'Acetone and water', comps: ['acetone', 'water'], targets: ['acetone', 'water'], best: ['distil'], note: 'Two liquids that mix completely. Boiling points 56 °C and 100 °C.' },
  { id: 'ethanol', name: 'Alcohol and water', comps: ['ethanol', 'water'], targets: ['ethanol', 'water'], best: ['frac'], note: 'Two liquids that mix. Boiling points 78 °C and 100 °C: only 22 °C apart.' },
  { id: 'ink', name: 'Green ink', comps: ['blue', 'yellow', 'water'], targets: ['blue', 'yellow'], best: ['chroma'], note: 'Is it one dye or several? Very small amounts.' },
  { id: 'nh4cl', name: 'Salt and ammonium chloride', comps: ['salt', 'nh4cl'], targets: ['salt', 'nh4cl'], best: ['sublime'], note: 'Both dissolve in water, but one turns straight into vapour when heated.' },
  { id: 'milk', name: 'Milk (cream in milk)', comps: ['cream', 'water'], targets: ['cream', 'water'], best: ['spin'], note: 'Tiny fat drops spread through the milk: they do not settle.' },
  { id: 'mud', name: 'Muddy water', comps: ['clay', 'water'], targets: ['clay', 'water'], best: ['filter', 'spin'], note: 'Very fine clay: it settles only slowly.' },
];

export type MethodId = 'hand' | 'sieve' | 'magnet' | 'water' | 'settle' | 'filter' | 'evap' | 'cryst' | 'distil' | 'frac' | 'funnel' | 'sublime' | 'chroma' | 'spin';
export const METHODS: { id: MethodId; name: string; uses: string }[] = [
  { id: 'hand', name: 'Handpicking', uses: 'size and look: pick out pieces you can see' },
  { id: 'sieve', name: 'Sieving', uses: 'particle size' },
  { id: 'magnet', name: 'Magnet', uses: 'magnetism' },
  { id: 'water', name: 'Add water and stir', uses: 'solubility: one part may dissolve' },
  { id: 'settle', name: 'Settle and pour off', uses: 'density: heavy bits sink (sedimentation and decantation)' },
  { id: 'filter', name: 'Filtration', uses: 'particle size: undissolved bits stay on the paper' },
  { id: 'evap', name: 'Evaporation', uses: 'the liquid boils away and leaves the solid' },
  { id: 'cryst', name: 'Crystallisation', uses: 'a hot strong solution forms pure crystals as it cools' },
  { id: 'distil', name: 'Distillation', uses: 'boiling point: the vapour is cooled back to liquid' },
  { id: 'frac', name: 'Fractional distillation', uses: 'small differences in boiling point' },
  { id: 'funnel', name: 'Separating funnel', uses: 'liquids that do not mix form layers' },
  { id: 'sublime', name: 'Sublimation', uses: 'a solid that turns straight into vapour' },
  { id: 'chroma', name: 'Chromatography', uses: 'dyes travel up paper at different speeds' },
  { id: 'spin', name: 'Centrifuge', uses: 'spinning fast makes the heavier part move out' },
];

/** A container: the substances in it, and whether it still holds a little of something else (a trace). */
export type Box = { comps: string[]; trace?: string[]; label?: string };
export type Result = { ok: 'yes' | 'part' | 'no'; out: Box[]; why: string; lost?: string[]; temps?: number[] };

const C = (id: string) => COMPS[id];
const names = (ids: string[]) => {
  const n = ids.map((i) => C(i).name);
  return n.length < 2 ? n.join('') : `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`;
};
const sortComps = (ids: string[]) => [...new Set(ids)].sort();

/** Simple distillation separates two liquids cleanly when their boiling points differ by this much or more. */
export const SIMPLE_GAP = 25;

/** What happens when `method` is used on a container holding `box`. */
export function apply(method: MethodId, box: Box): Result {
  const ids = box.comps, liq = ids.filter((i) => C(i).liquid), sol = ids.filter((i) => !C(i).liquid);
  const wet = liq.length > 0, keepTrace = (b: Box): Box => ({ ...b, trace: box.trace?.length ? sortComps([...(b.trace ?? []), ...box.trace]) : b.trace });
  const no = (why: string): Result => ({ ok: 'no', out: [box], why });
  if (ids.length < 2 && method !== 'water' && !(box.trace?.length)) return no(`This is already just ${names(ids)}.`);
  const dissolved = wet ? sol.filter((i) => C(i).soluble) : [];
  const undissolved = sol.filter((i) => !dissolved.includes(i));
  switch (method) {
    case 'hand': {
      if (wet) return no('You cannot pick things out of a liquid by hand.');
      const p = sol.filter((i) => C(i).pick);
      if (!p.length) return no(`The pieces of ${names(sol)} are too small or too alike to pick out one by one.`);
      return { ok: 'yes', out: [{ comps: p }, keepTrace({ comps: sol.filter((i) => !p.includes(i)) })], why: `The ${names(p)} are big and easy to see, so you pick them out by hand. Slow, but fine for a small amount.` };
    }
    case 'sieve': {
      if (wet) return no('A sieve lets the liquid and everything small run through. Sieving is for dry solids of different sizes.');
      const big = sol.filter((i) => C(i).size === 'big'), small = sol.filter((i) => C(i).size !== 'big');
      if (!big.length || !small.length) return no(`The particles of ${names(sol)} are about the same size, so they all ${big.length ? 'stay on' : 'pass through'} the sieve together.`);
      return { ok: 'yes', out: [{ comps: big, label: 'on the sieve' }, { comps: small, label: 'passed through' }], why: `The ${names(big)} ${big.length > 1 ? 'are' : 'is'} too big for the holes; the ${names(small)} falls through.` };
    }
    case 'magnet': {
      const m = sol.filter((i) => C(i).magnetic);
      if (!m.length) return no(`Nothing here is magnetic: ${names(ids)} ${ids.length > 1 ? 'are' : 'is'} not pulled by a magnet.`);
      if (m.length === ids.length) return no('Everything is pulled by the magnet together.');
      return { ok: 'yes', out: [{ comps: m, label: 'on the magnet' }, keepTrace({ comps: ids.filter((i) => !m.includes(i)) })], why: `Iron is magnetic, so the magnet pulls the ${names(m)} out and leaves the ${names(ids.filter((i) => !m.includes(i)))}.` };
    }
    case 'water': {
      if (wet) return { ok: 'no', out: [box], why: `There is already ${names(liq)} here. Adding water just dilutes it.` };
      const s = sol.filter((i) => C(i).soluble);
      const out = { comps: sortComps([...ids, 'water']), trace: box.trace };
      return { ok: s.length && s.length < sol.length ? 'yes' : 'part', out: [out], why: s.length ? `The ${names(s)} dissolve${s.length > 1 ? '' : 's'} in the water${s.length < sol.length ? `; the ${names(sol.filter((i) => !s.includes(i)))} do${sol.length - s.length > 1 ? '' : 'es'} not.` : '. Everything dissolved, so nothing is separated yet.'}` : `Nothing dissolves: the ${names(sol)} just sit${sol.length > 1 ? '' : 's'} in the water.` };
    }
    case 'settle': {
      if (!wet) return no('Settling needs a liquid for the heavy part to sink through.');
      const imm = liq.filter((i) => C(i).immiscible);
      if (imm.length && liq.length > 1) {
        const top = [...liq].sort((a, b) => C(a).dense! - C(b).dense!)[0], rest = ids.filter((i) => i !== top);
        return { ok: 'part', out: [{ comps: [top], trace: rest.filter((i) => C(i).liquid), label: 'poured off' }, keepTrace({ comps: rest, trace: [top], label: 'left behind' })], why: `The ${C(top).name} floats on top and you can pour most of it off, but a little is always left or poured with it. A separating funnel is cleaner.` };
      }
      const sink = undissolved.filter((i) => C(i).size === 'grain' || C(i).size === 'big'), slow = undissolved.filter((i) => C(i).size === 'fine');
      if (sink.length) return { ok: 'yes', out: [{ comps: sink, label: 'settled (then dried)' }, keepTrace({ comps: ids.filter((i) => !sink.includes(i)), label: 'poured off' })], why: `The ${names(sink)} sinks to the bottom; you pour the ${names(liq)} off the top (decanting). The solid is still damp, so dry it.` };
      if (slow.length) return { ok: 'part', out: [{ comps: slow, trace: liq, label: 'settled' }, keepTrace({ comps: liq, trace: slow, label: 'still cloudy' })], why: `The ${names(slow)} is so fine that it settles only slowly and the poured-off water stays cloudy. Filtration or a centrifuge works better.` };
      return no(dissolved.length ? `Dissolved ${names(dissolved)} never settles: its particles are spread all through the liquid.` : 'The particles are too small to settle out.');
    }
    case 'filter': {
      if (!wet) return no('Filtration is for an undissolved solid in a liquid. Try adding water first.');
      const res = undissolved.filter((i) => C(i).size !== 'tiny');
      if (!res.length) return no(dissolved.length ? `The ${names(dissolved)} is dissolved, so it goes straight through the filter paper with the ${names(liq)}.` : 'The particles are small enough to pass through the filter paper.');
      return { ok: 'yes', out: [{ comps: res, label: 'residue' }, keepTrace({ comps: ids.filter((i) => !res.includes(i)), label: 'filtrate' })], why: `The ${names(res)} cannot pass the tiny holes of the filter paper (the residue); the ${names(ids.filter((i) => !res.includes(i)))} runs through (the filtrate).` };
    }
    case 'evap': {
      if (!wet) return no('There is no liquid to evaporate.');
      const left = sol.filter((i) => !C(i).sublimes);
      if (!left.length) return { ok: 'part', out: [], lost: ids, why: 'Everything goes into the air.' };
      return { ok: liq.length === ids.length ? 'no' : 'part', out: [keepTrace({ comps: left, label: 'left in the dish' })], lost: [...liq, ...sol.filter((i) => C(i).sublimes)], why: `The ${names(liq)} evaporate${liq.length > 1 ? '' : 's'} into the air and the ${names(left)} is left in the dish. You get the solid back but lose the liquid.` };
    }
    case 'cryst': {
      if (!dissolved.length) return no('Crystallisation needs a solid dissolved in a liquid.');
      if (undissolved.length) return no(`Filter out the undissolved ${names(undissolved)} first, or it ends up mixed with the crystals.`);
      const [x] = dissolved;
      return { ok: 'yes', out: [{ comps: [x], label: 'crystals' }, keepTrace({ comps: liq, trace: dissolved, label: 'left-over solution' })], why: `Heat the solution until it is strong, then let it cool: pure crystals of ${C(x).name} grow and are filtered off. Some stays dissolved in the left-over liquid.` };
    }
    case 'distil':
    case 'frac': {
      if (!wet) return no('Distillation is for liquids, or a solid dissolved in a liquid.');
      if (liq.some((i) => C(i).immiscible)) return no('These liquids do not mix: they form two layers, so a separating funnel does it without boiling.');
      const order = [...liq].sort((a, b) => C(a).bp! - C(b).bp!), temps = order.map((i) => C(i).bp!);
      if (order.length === 1) {
        if (!sol.length) return no('There is only one liquid here.');
        return { ok: 'yes', out: [{ comps: order, label: 'distillate' }, keepTrace({ comps: sol, label: 'left in the flask' })], temps, why: `The ${C(order[0]).name} boils at ${C(order[0]).bp} °C, its vapour is cooled in the condenser and drips out pure. The ${names(sol)} cannot boil at this temperature and stays in the flask.${undissolved.length ? ' (It works, but filtering is quicker.)' : ''}` };
      }
      const [lo, hi] = order, gap = C(hi).bp! - C(lo).bp!;
      if (method === 'distil' && gap < SIMPLE_GAP) return { ok: 'part', out: [{ comps: [lo], trace: [hi], label: 'first liquid out' }, keepTrace({ comps: [hi, ...sol], trace: [lo], label: 'left in the flask' })], temps, why: `The boiling points are only ${gap} °C apart, so a lot of ${C(hi).name} vapour comes over with the ${C(lo).name}. The two are not cleanly separated: use a fractionating column.` };
      return { ok: 'yes', out: [{ comps: [lo], label: `first, at ${C(lo).bp} °C` }, keepTrace({ comps: [hi, ...sol], label: method === 'frac' ? `then, at ${C(hi).bp} °C` : 'left in the flask' })], temps, why: method === 'frac'
        ? `In the fractionating column the vapour condenses and boils again many times, so only the ${C(lo).name} (${C(lo).bp} °C) reaches the top first. When it is all gone the temperature rises to ${C(hi).bp} °C.`
        : `The boiling points are ${gap} °C apart. The ${C(lo).name} boils off first at ${C(lo).bp} °C and is cooled back into a liquid; the ${C(hi).name} stays behind.` };
    }
    case 'funnel': {
      const imm = liq.filter((i) => C(i).immiscible);
      if (liq.length < 2 || !imm.length) return no(liq.length < 2 ? 'A separating funnel needs two liquids that form layers.' : 'These liquids mix completely, so there are no layers to run off.');
      const [low, top] = [...liq].sort((a, b) => C(b).dense! - C(a).dense!);
      return { ok: 'yes', out: [{ comps: ids.filter((i) => i !== top), label: 'bottom layer, run off' }, { comps: [top], label: 'top layer' }], why: `The liquids form two layers. Open the tap to run off the heavier ${C(low).name} at the bottom; close it when the ${C(top).name} reaches the tap.` };
    }
    case 'sublime': {
      if (wet) return no('Dry the mixture first: sublimation works on solids.');
      const s = sol.filter((i) => C(i).sublimes);
      if (!s.length) return no(`Neither ${names(sol)} sublimes: on heating they melt or stay solid.`);
      return { ok: 'yes', out: [{ comps: s, label: 'on the funnel' }, keepTrace({ comps: sol.filter((i) => !s.includes(i)), label: 'left in the dish' })], why: `On heating, the ${names(s)} turns straight into vapour and turns back into a solid on the cool funnel. The ${names(sol.filter((i) => !s.includes(i)))} stays in the dish.` };
    }
    case 'chroma': {
      const d = dissolved.filter((i) => C(i).dye);
      if (d.length < 2) return no(d.length ? 'There is only one dye: one spot moves up the paper.' : 'Chromatography is for coloured substances (dyes) dissolved in a solvent, in tiny amounts.');
      return { ok: 'yes', out: d.map((i) => ({ comps: [i], label: `spot, Rf ${C(i).dye}` })), lost: liq, why: `The water climbs the paper and carries each dye along. The ${names(d.filter((i) => C(i).dye! > 0.5))} dissolves better and travels further, so the colours separate into spots. It shows what is in the ink, for tiny amounts.` };
    }
    case 'spin': {
      if (!wet) return no('A centrifuge spins a liquid with tiny solid bits or drops in it.');
      const s = undissolved;
      if (!s.length) return no(dissolved.length ? `The dissolved ${names(dissolved)} is spread as single particles: spinning cannot pull it out.` : 'There is nothing in the liquid to spin out.');
      const light = s.filter((i) => i === 'cream');
      return { ok: 'yes', out: [{ comps: s, label: light.length ? 'cream at the top' : 'packed at the bottom' }, keepTrace({ comps: ids.filter((i) => !s.includes(i)), label: 'clear liquid' })], why: light.length ? 'Spinning fast pushes the denser milk liquid outwards; the lighter cream collects at the top and is skimmed off.' : `Spinning fast throws the denser ${names(s)} to the bottom of the tube; the clear ${names(liq)} is poured off.` };
    }
  }
}

/** True when the container holds exactly one substance and no trace of anything else. */
export const isPure = (b: Box) => b.comps.length === 1 && !(b.trace?.length);

/** Which of the mixture's target substances have been recovered pure in some container. */
export function recovered(boxes: Box[], targets: string[]) {
  return targets.filter((t) => boxes.some((b) => isPure(b) && b.comps[0] === t));
}

/** Run a list of [container index, method] steps from the start of a mixture; returns the containers after each step. */
export function run(mix: Mixture, steps: [number, MethodId][]) {
  let boxes: Box[] = [{ comps: sortComps(mix.comps) }];
  const results: Result[] = [];
  for (const [i, m] of steps) {
    const r = apply(m, boxes[i]);
    results.push(r);
    if (r.ok !== 'no') boxes = [...boxes.slice(0, i), ...r.out, ...boxes.slice(i + 1)];
  }
  return { boxes, results };
}

/** Rf = distance moved by the spot ÷ distance moved by the solvent front. */
export const rf = (spot: number, front: number) => spot / front;

// ---- Check yourself ----------------------------------------------------------------------------------------
import type { QuizQuestion } from '../school-quiz-b';
const pick = (r: () => number, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const n = (x: number, d = 2) => String(Math.round(x * 10 ** d) / 10 ** d);
export function questions(level: 9 | 11, r: () => number = Math.random): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  { const tot = pick(r, 4, 12) * 5, fe = pick(r, 1, tot / 5 - 1) * 5, pc = (fe / tot) * 100;
    qs.push({ text: `A ${tot} g mixture of iron filings and sulphur is separated with a magnet. ${fe} g of iron is collected. What percentage of the mixture was iron?`, ans: pc, unit: '%', work: `Percentage = part ÷ whole × 100 = ${fe} ÷ ${tot} × 100 = ${n(pc, 1)} %.` }); }
  { const v = pick(r, 2, 10) * 50, c = pick(r, 2, 8) * 5, m = (v / 1000) * c;
    qs.push({ text: `Salt water holds ${c} g of salt in every litre. You evaporate ${v} mL of it to dryness. How many grams of salt are left?`, ans: m, unit: 'g', work: `${v} mL = ${n(v / 1000, 3)} L. Salt = ${n(v / 1000, 3)} L × ${c} g/L = ${n(m)} g.` }); }
  { const front = pick(r, 8, 12), spot = pick(r, 2, front * 10 - 10) / 10, R = spot / front;
    qs.push({ text: `In paper chromatography the water front moved ${front} cm and a dye spot moved ${n(spot, 1)} cm from the start line. What is the Rf value of the dye?`, ans: R, unit: '', tol: 0.011, work: `Rf = distance moved by the spot ÷ distance moved by the solvent = ${n(spot, 1)} ÷ ${front} = ${n(R)}. Rf is always between 0 and 1.` }); }
  { const a = pick(r, 40, 90), b = a + pick(r, 5, 50), gap = b - a;
    qs.push({ text: `Two liquids that mix boil at ${a} °C and ${b} °C. How many degrees apart are their boiling points? (Below about ${SIMPLE_GAP} °C you need fractional distillation.)`, ans: gap, unit: '°C', tol: 0.01, work: `${b} − ${a} = ${gap} °C. ${gap < SIMPLE_GAP ? 'That is less than 25 °C, so use fractional distillation.' : 'That is 25 °C or more, so simple distillation separates them.'} The ${a} °C liquid comes over first.` }); }
  if (level === 11) {
    const m = pick(r, 10, 40), y = pick(r, 50, 90), got = (m * y) / 100;
    qs.push({ text: `You crystallise ${m} g of an impure solid and collect ${n(got, 1)} g of pure crystals. What is the percentage recovery?`, ans: y, unit: '%', work: `Recovery = mass of pure crystals ÷ mass you started with × 100 = ${n(got, 1)} ÷ ${m} × 100 = ${y} %. Some always stays dissolved in the left-over liquid.` });
  }
  return qs;
}
