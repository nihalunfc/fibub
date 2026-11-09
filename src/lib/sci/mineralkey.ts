// Mineral identification key: about 40 common rock-forming and ore minerals with rounded, general hand-specimen
// properties (Mohs hardness range, specific gravity range, lustre, streak, cleavage, colours, simple tests), written
// by fibub from general mineralogy knowledge, and a scoring filter that ranks minerals against what you observe.
// Plain TypeScript, no DOM. Values are rounded general facts; real specimens vary.

export type Lustre = 'metallic' | 'submetallic' | 'vitreous' | 'adamantine' | 'resinous' | 'pearly' | 'silky' | 'greasy' | 'earthy';
export type Streak = 'white' | 'grey' | 'black' | 'greenish-black' | 'red-brown' | 'red' | 'yellow-brown' | 'brown' | 'green' | 'blue' | 'yellow' | 'copper' | 'gold';
export type Cleavage = 'none' | '1' | '2-90' | '2-not90' | '3-90' | '3-not90' | '4' | '6';
export type Colour = 'colourless' | 'white' | 'grey' | 'black' | 'brown' | 'red' | 'pink' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'brassy' | 'silvery' | 'metal-grey' | 'copper' | 'gold';
export type Test = 'fizz-cold' | 'fizz-powder' | 'magnetic' | 'weak-magnetic' | 'sheets' | 'greasy-feel' | 'striations' | 'soluble' | 'double-refraction';

export type Mineral = {
  id: string; name: string; formula: string; kind: 'rock-forming' | 'ore' | 'both';
  H: [number, number]; SG: [number, number]; lustre: Lustre[]; streak: Streak[]; cleavage: Cleavage[]; colours: Colour[]; tests: Test[]; note: string;
};

const m = (id: string, name: string, formula: string, kind: Mineral['kind'], H: [number, number], SG: [number, number], lustre: Lustre[], streak: Streak[], cleavage: Cleavage[], colours: Colour[], tests: Test[], note: string): Mineral => ({ id, name, formula, kind, H, SG, lustre, streak, cleavage, colours, tests, note });

/** The key's minerals (rounded general values). */
export const MINERALS: Mineral[] = [
  m('quartz', 'Quartz', 'SiO₂', 'rock-forming', [7, 7], [2.6, 2.7], ['vitreous', 'greasy'], ['white'], ['none'], ['colourless', 'white', 'grey', 'pink', 'purple', 'brown', 'black', 'yellow'], [], 'Conchoidal fracture, six-sided crystals; scratches glass easily.'),
  m('orthoclase', 'Orthoclase (K-feldspar)', 'KAlSi₃O₈', 'rock-forming', [6, 6], [2.5, 2.6], ['vitreous', 'pearly'], ['white'], ['2-90'], ['pink', 'white', 'orange', 'grey'], [], 'Two cleavages at about 90°; often pink in granite; no striations.'),
  m('microcline', 'Microcline', 'KAlSi₃O₈', 'rock-forming', [6, 6.5], [2.5, 2.6], ['vitreous'], ['white'], ['2-90'], ['pink', 'white', 'green'], [], 'K-feldspar; green variety is amazonite; may show a cross-hatched texture.'),
  m('plagioclase', 'Plagioclase feldspar', '(Na,Ca)(Al,Si)₄O₈', 'rock-forming', [6, 6.5], [2.6, 2.8], ['vitreous', 'pearly'], ['white'], ['2-90'], ['white', 'grey', 'colourless'], ['striations'], 'Fine parallel striations on one cleavage face; some show a blue play of colour.'),
  m('muscovite', 'Muscovite (white mica)', 'KAl₂(AlSi₃O₁₀)(OH)₂', 'rock-forming', [2, 3], [2.7, 2.9], ['vitreous', 'pearly'], ['white'], ['1'], ['colourless', 'silvery', 'brown', 'yellow'], ['sheets'], 'Peels into thin, clear, elastic sheets.'),
  m('biotite', 'Biotite (black mica)', 'K(Mg,Fe)₃(AlSi₃O₁₀)(OH)₂', 'rock-forming', [2.5, 3], [2.8, 3.3], ['vitreous', 'pearly', 'submetallic'], ['white', 'grey'], ['1'], ['black', 'brown', 'green'], ['sheets'], 'Peels into thin, dark, elastic sheets.'),
  m('chlorite', 'Chlorite', '(Mg,Fe)₅Al(AlSi₃O₁₀)(OH)₈', 'rock-forming', [2, 2.5], [2.6, 3.3], ['vitreous', 'pearly'], ['white', 'green'], ['1'], ['green'], ['sheets'], 'Green, soft flakes that bend but do not spring back.'),
  m('hornblende', 'Hornblende (amphibole)', 'Ca₂(Mg,Fe)₄Al(Si₇Al)O₂₂(OH)₂', 'rock-forming', [5, 6], [3, 3.4], ['vitreous'], ['white', 'grey', 'green'], ['2-not90'], ['black', 'green', 'brown'], [], 'Two cleavages at about 56° and 124°; long prismatic crystals.'),
  m('augite', 'Augite (pyroxene)', '(Ca,Na)(Mg,Fe,Al)(Si,Al)₂O₆', 'rock-forming', [5.5, 6], [3.2, 3.6], ['vitreous'], ['white', 'grey', 'green'], ['2-90'], ['black', 'green', 'brown'], [], 'Two cleavages at about 87° and 93°; stubby crystals.'),
  m('olivine', 'Olivine', '(Mg,Fe)₂SiO₄', 'rock-forming', [6.5, 7], [3.2, 4.4], ['vitreous'], ['white'], ['none'], ['green', 'yellow', 'brown'], [], 'Olive-green glassy grains, often in basalt; conchoidal fracture.'),
  m('garnet', 'Garnet', 'e.g. Fe₃Al₂(SiO₄)₃', 'rock-forming', [6.5, 7.5], [3.5, 4.3], ['vitreous', 'resinous'], ['white'], ['none'], ['red', 'brown', 'pink', 'orange', 'green', 'black'], [], 'Ball-like 12- or 24-sided crystals in metamorphic rocks.'),
  m('tourmaline', 'Tourmaline', 'complex borosilicate', 'rock-forming', [7, 7.5], [3, 3.3], ['vitreous'], ['white'], ['none'], ['black', 'green', 'pink', 'brown', 'blue'], [], 'Long crystals with a rounded triangle cross-section and lengthwise grooves.'),
  m('kyanite', 'Kyanite', 'Al₂SiO₅', 'rock-forming', [4.5, 7], [3.5, 3.7], ['vitreous', 'pearly'], ['white'], ['1'], ['blue', 'white', 'grey', 'green'], [], 'Bladed blue crystals; softer along the blade than across it.'),
  m('sillimanite', 'Sillimanite', 'Al₂SiO₅', 'rock-forming', [6.5, 7.5], [3.2, 3.3], ['vitreous', 'silky'], ['white'], ['1'], ['white', 'brown', 'grey'], [], 'Fibrous or needle-like masses in high-grade metamorphic rocks.'),
  m('andalusite', 'Andalusite', 'Al₂SiO₅', 'rock-forming', [6.5, 7.5], [3.1, 3.2], ['vitreous'], ['white'], ['2-90'], ['pink', 'brown', 'grey', 'red'], [], 'Square prisms; the chiastolite variety shows a dark cross.'),
  m('staurolite', 'Staurolite', 'Fe₂Al₉Si₄O₂₃(OH)', 'rock-forming', [7, 7.5], [3.7,3.8], ['vitreous', 'resinous'], ['white', 'grey'], ['none'], ['brown', 'red', 'black'], [], 'Brown prisms, often crossed twins, in schist.'),
  m('epidote', 'Epidote', 'Ca₂(Al,Fe)₃(SiO₄)₃(OH)', 'rock-forming', [6, 7], [3.3, 3.5], ['vitreous'], ['white', 'grey'], ['1'], ['green', 'yellow'], [], 'Pistachio-green crystals or masses.'),
  m('calcite', 'Calcite', 'CaCO₃', 'rock-forming', [3, 3], [2.7, 2.7], ['vitreous'], ['white'], ['3-not90'], ['colourless', 'white', 'grey', 'yellow', 'pink', 'orange', 'green', 'blue'], ['fizz-cold', 'double-refraction'], 'Breaks into rhombs; fizzes in cold dilute acid; clear pieces show double images.'),
  m('dolomite', 'Dolomite', 'CaMg(CO₃)₂', 'rock-forming', [3.5, 4], [2.8, 2.9], ['vitreous', 'pearly'], ['white'], ['3-not90'], ['white', 'pink', 'grey', 'brown'], ['fizz-powder'], 'Like calcite but fizzes in cold dilute acid only when powdered; often curved crystal faces.'),
  m('gypsum', 'Gypsum', 'CaSO₄·2H₂O', 'rock-forming', [2, 2], [2.3, 2.3], ['vitreous', 'pearly', 'silky'], ['white'], ['1'], ['colourless', 'white', 'grey', 'pink', 'brown'], [], 'Scratched by a fingernail; clear selenite, fibrous satin spar.'),
  m('halite', 'Halite (rock salt)', 'NaCl', 'rock-forming', [2.5, 2.5], [2.1, 2.2], ['vitreous'], ['white'], ['3-90'], ['colourless', 'white', 'pink', 'grey'], ['soluble'], 'Cubic cleavage; dissolves in water.'),
  m('fluorite', 'Fluorite', 'CaF₂', 'rock-forming', [4, 4], [3.1, 3.2], ['vitreous'], ['white'], ['4'], ['purple', 'green', 'yellow', 'colourless', 'blue'], [], 'Cubes; cleaves into octahedra (four directions).'),
  m('apatite', 'Apatite', 'Ca₅(PO₄)₃(F,Cl,OH)', 'both', [5, 5], [3.1, 3.2], ['vitreous', 'resinous'], ['white'], ['none'], ['green', 'blue', 'brown', 'yellow'], [], 'Six-sided prisms; Mohs 5, just scratched by a knife.'),
  m('talc', 'Talc', 'Mg₃Si₄O₁₀(OH)₂', 'rock-forming', [1, 1], [2.7, 2.8], ['pearly', 'greasy'], ['white'], ['1'], ['white', 'green', 'grey'], ['greasy-feel'], 'Very soft, soapy feel; Mohs 1.'),
  m('kaolinite', 'Kaolinite (clay)', 'Al₂Si₂O₅(OH)₄', 'rock-forming', [2, 2.5], [2.6, 2.6], ['earthy'], ['white'], ['none'], ['white', 'yellow'], [], 'Soft white earthy masses; clay smell when breathed on.'),
  m('serpentine', 'Serpentine', '(Mg,Fe)₃Si₂O₅(OH)₄', 'rock-forming', [2.5, 5], [2.5, 2.6], ['greasy', 'silky'], ['white'], ['none'], ['green', 'yellow', 'black'], ['greasy-feel'], 'Mottled green, greasy to waxy look; some forms fibrous.'),
  m('topaz', 'Topaz', 'Al₂SiO₄(F,OH)₂', 'rock-forming', [8, 8], [3.5, 3.6], ['vitreous'], ['white'], ['1'], ['colourless', 'yellow', 'blue', 'brown', 'pink'], [], 'Mohs 8; one perfect cleavage across the prism.'),
  m('corundum', 'Corundum', 'Al₂O₃', 'both', [9, 9], [3.9, 4.1], ['adamantine', 'vitreous'], ['white'], ['none'], ['grey', 'brown', 'red', 'blue', 'pink'], [], 'Mohs 9; barrel-shaped six-sided crystals; ruby and sapphire.'),
  m('barite', 'Barite', 'BaSO₄', 'both', [3, 3.5], [4.3, 4.6], ['vitreous', 'pearly'], ['white'], ['3-not90'], ['white', 'colourless', 'grey', 'blue', 'brown'], [], 'Feels very heavy for a light-coloured mineral.'),
  m('siderite', 'Siderite', 'FeCO₃', 'ore', [3.5, 4.5], [3.7, 3.9], ['vitreous', 'pearly'], ['white'], ['3-not90'], ['brown', 'yellow', 'grey'], ['fizz-powder'], 'Brown rhombs; fizzes slowly in warm or powdered acid tests.'),
  m('magnetite', 'Magnetite', 'Fe₃O₄', 'ore', [5.5, 6.5], [5.1, 5.2], ['metallic'], ['black'], ['none'], ['black', 'metal-grey'], ['magnetic'], 'Strongly attracted to a magnet; octahedral crystals.'),
  m('hematite', 'Hematite', 'Fe₂O₃', 'ore', [5, 6.5], [4.9, 5.3], ['metallic', 'submetallic', 'earthy'], ['red-brown', 'red'], ['none'], ['metal-grey', 'black', 'red', 'brown'], [], 'Red-brown streak even when the specimen is steel grey.'),
  m('goethite', 'Goethite (limonite)', 'FeO(OH)', 'ore', [4, 5.5], [3.3, 4.3], ['submetallic', 'earthy', 'silky'], ['yellow-brown', 'brown'], ['none'], ['brown', 'yellow', 'black'], [], 'Yellow-brown streak; rusty earthy masses (limonite).'),
  m('ilmenite', 'Ilmenite', 'FeTiO₃', 'ore', [5, 6], [4.5, 5], ['metallic', 'submetallic'], ['black', 'brown'], ['none'], ['black', 'metal-grey'], ['weak-magnetic'], 'Black, weakly magnetic; common in black sands.'),
  m('chromite', 'Chromite', 'FeCr₂O₄', 'ore', [5.5, 5.5], [4.5, 5.1], ['metallic', 'submetallic'], ['brown'], ['none'], ['black'], ['weak-magnetic'], 'Black with a dark brown streak; in ultramafic rocks.'),
  m('pyrite', 'Pyrite', 'FeS₂', 'ore', [6, 6.5], [4.9, 5.2], ['metallic'], ['greenish-black', 'black'], ['none'], ['brassy'], [], '"Fool’s gold": pale brass, hard, cubes with striated faces.'),
  m('chalcopyrite', 'Chalcopyrite', 'CuFeS₂', 'ore', [3.5, 4], [4.1, 4.3], ['metallic'], ['greenish-black'], ['none'], ['brassy', 'gold'], [], 'Deeper brass-yellow than pyrite, softer (a knife scratches it), often tarnished.'),
  m('pyrrhotite', 'Pyrrhotite', 'Fe₁₋ₓS', 'ore', [3.5, 4.5], [4.6, 4.7], ['metallic'], ['grey', 'black'], ['none'], ['brassy', 'brown'], ['weak-magnetic'], 'Bronze colour; weakly magnetic.'),
  m('galena', 'Galena', 'PbS', 'ore', [2.5, 2.5], [7.4, 7.6], ['metallic'], ['grey', 'black'], ['3-90'], ['metal-grey'], [], 'Very heavy, lead grey, cubic cleavage.'),
  m('sphalerite', 'Sphalerite', 'ZnS', 'ore', [3.5, 4], [3.9, 4.1], ['resinous', 'adamantine', 'submetallic'], ['yellow-brown', 'white', 'brown', 'yellow'], ['6'], ['brown', 'yellow', 'black', 'red'], [], 'Resinous lustre, six cleavage directions, pale streak despite a dark colour.'),
  m('cinnabar', 'Cinnabar', 'HgS', 'ore', [2, 2.5], [8, 8.2], ['adamantine', 'submetallic'], ['red'], ['3-not90'], ['red'], [], 'Scarlet streak, very heavy. Contains mercury: wash hands, do not heat.'),
  m('stibnite', 'Stibnite', 'Sb₂S₃', 'ore', [2, 2], [4.6, 4.6], ['metallic'], ['grey', 'black'], ['1'], ['metal-grey'], [], 'Long lead-grey blades with one perfect lengthwise cleavage.'),
  m('molybdenite', 'Molybdenite', 'MoS₂', 'ore', [1, 1.5], [4.6, 4.8], ['metallic'], ['grey', 'greenish-black'], ['1'], ['metal-grey', 'blue'], ['sheets', 'greasy-feel'], 'Like graphite but bluish and heavier; flexible sheets.'),
  m('graphite', 'Graphite', 'C', 'both', [1, 2], [2.1, 2.3], ['metallic', 'submetallic'], ['black', 'grey'], ['1'], ['black', 'metal-grey'], ['greasy-feel', 'sheets'], 'Marks paper; greasy feel; light for a metallic mineral.'),
  m('arsenopyrite', 'Arsenopyrite', 'FeAsS', 'ore', [5.5, 6], [5.9, 6.2], ['metallic'], ['grey', 'black'], ['none'], ['silvery', 'metal-grey'], [], 'Silver-white, striated prisms. Contains arsenic: wash hands.'),
  m('cassiterite', 'Cassiterite', 'SnO₂', 'ore', [6, 7], [6.8, 7.1], ['adamantine', 'submetallic'], ['white', 'yellow-brown', 'brown'], ['none'], ['brown', 'black'], [], 'Hard, very heavy, dark brown with a pale streak; tin ore.'),
  m('malachite', 'Malachite', 'Cu₂CO₃(OH)₂', 'ore', [3.5, 4], [3.6, 4], ['silky', 'vitreous', 'earthy'], ['green'], ['none'], ['green'], ['fizz-cold'], 'Banded bright green; fizzes in dilute acid.'),
  m('azurite', 'Azurite', 'Cu₃(CO₃)₂(OH)₂', 'ore', [3.5, 4], [3.7, 3.9], ['vitreous', 'earthy'], ['blue'], ['none'], ['blue'], ['fizz-cold'], 'Deep blue, often with malachite; fizzes in dilute acid.'),
  m('copper', 'Native copper', 'Cu', 'ore', [2.5, 3], [8.9, 8.9], ['metallic'], ['copper'], ['none'], ['copper', 'brown', 'green'], [], 'Copper-red, bends, hackly fracture; green tarnish.'),
  m('gold', 'Native gold', 'Au', 'ore', [2.5, 3], [15, 19.3], ['metallic'], ['gold'], ['none'], ['gold'], [], 'Gold-yellow streak, soft, bends, extremely heavy; does not tarnish.'),
  m('sulfur', 'Native sulfur', 'S', 'ore', [1.5, 2.5], [2, 2.1], ['resinous', 'greasy'], ['white', 'yellow'], ['none'], ['yellow'], [], 'Bright yellow, light, brittle; smells when burned (do not burn it).'),
];

// What counts as "close" when the exact category does not match.
const NEAR: Record<string, string[][]> = {
  lustre: [['metallic', 'submetallic'], ['vitreous', 'adamantine', 'resinous', 'greasy'], ['pearly', 'silky']],
  streak: [['grey', 'black', 'greenish-black'], ['red-brown', 'red', 'brown'], ['yellow-brown', 'brown', 'yellow']],
  cleavage: [['2-90', '2-not90'], ['3-90', '3-not90'], ['4', '6']],
};
const near = (kind: string, a: string, list: string[]) => (NEAR[kind] ?? []).some((g) => g.includes(a) && list.some((x) => g.includes(x)));

export type Tri = 'yes' | 'no';
export type Obs = {
  H?: [number, number]; // observed hardness interval (a single value as [h, h])
  SG?: number;
  lustre?: Lustre; streak?: Streak; cleavage?: Cleavage; colour?: Colour;
  tests?: Partial<Record<Test, Tri>>;
};
export type Tol = { H: number; SG: number };
export type Reason = { what: string; ok: 'match' | 'near' | 'miss'; text: string };
export type Ranked = { mineral: Mineral; score: number; of: number; misses: number; reasons: Reason[] };

/** Hardness intervals from simple scratch tests (Mohs: fingernail about 2.5, copper coin 3.5, knife or glass 5.5). */
export const SCRATCH: Record<string, [number, number]> = {
  nail: [1, 2.5], coin: [2.5, 3.5], knife: [3.5, 5.5], glass: [5.5, 10],
};

/** Compare one mineral with the observations. Each observation scores 1 (match), 0.5 (near) or 0 (miss). */
export function compare(min: Mineral, o: Obs, tol: Tol = { H: 0.5, SG: 0.2 }): Ranked {
  const reasons: Reason[] = [];
  const range = (r: [number, number]) => (r[0] === r[1] ? String(r[0]) : `${r[0]}–${r[1]}`);
  if (o.H) {
    const gap = Math.max(0, min.H[0] - o.H[1], o.H[0] - min.H[1]);
    reasons.push({ what: 'hardness', ok: gap === 0 ? 'match' : gap <= tol.H + 1e-9 ? 'near' : 'miss', text: `hardness ${range(min.H)}` });
  }
  if (o.SG !== undefined) {
    const gap = Math.max(0, min.SG[0] - o.SG, o.SG - min.SG[1]);
    reasons.push({ what: 'specific gravity', ok: gap <= tol.SG + 1e-9 ? 'match' : gap <= 2 * tol.SG + 1e-9 ? 'near' : 'miss', text: `specific gravity ${range(min.SG)}` });
  }
  for (const [what, key, list] of [['lustre', o.lustre, min.lustre], ['streak', o.streak, min.streak], ['cleavage', o.cleavage, min.cleavage]] as const) {
    if (!key) continue;
    const ok = (list as string[]).includes(key) ? 'match' : near(what, key, list as string[]) ? 'near' : 'miss';
    const names = what === 'cleavage' ? (list as string[]).map((c) => CLEAVAGES.find((x) => x[0] === c)?.[1] ?? c) : (list as string[]);
    reasons.push({ what, ok, text: `${what} ${names.join(' or ')}` });
  }
  if (o.colour) reasons.push({ what: 'colour', ok: min.colours.includes(o.colour) ? 'match' : 'miss', text: `colour ${min.colours.join(', ')}` });
  for (const [t, v] of Object.entries(o.tests ?? {}) as [Test, Tri][]) {
    if (!v) continue;
    let has = min.tests.includes(t);
    // a weak magnet test, or "fizzes when powdered", is also passed by stronger reactions
    if (t === 'weak-magnetic' && min.tests.includes('magnetic')) has = true;
    if (t === 'fizz-powder' && min.tests.includes('fizz-cold')) has = true;
    reasons.push({ what: t, ok: has === (v === 'yes') ? 'match' : 'miss', text: `${TESTS[t]}: ${has ? 'yes' : 'no'}` });
  }
  const score = reasons.reduce((s, r) => s + (r.ok === 'match' ? 1 : r.ok === 'near' ? 0.5 : 0), 0);
  return { mineral: min, score, of: reasons.length, misses: reasons.filter((r) => r.ok === 'miss').length, reasons };
}

/** Rank all minerals: highest score first, then fewest misses, then name. `maxMisses` drops minerals with more misses. */
export function rank(o: Obs, tol: Tol = { H: 0.5, SG: 0.2 }, maxMisses = Infinity, list = MINERALS): Ranked[] {
  return list.map((x) => compare(x, o, tol)).filter((r) => r.misses <= maxMisses)
    .sort((a, b) => b.score - a.score || a.misses - b.misses || a.mineral.name.localeCompare(b.mineral.name));
}

export const TESTS: Record<Test, string> = {
  'fizz-cold': 'fizzes in cold dilute acid', 'fizz-powder': 'fizzes when powdered', magnetic: 'strongly magnetic', 'weak-magnetic': 'weakly magnetic',
  sheets: 'splits into thin sheets', 'greasy-feel': 'greasy or soapy feel', striations: 'striations on cleavage faces', soluble: 'dissolves in water', 'double-refraction': 'double image through a clear piece',
};
export const LUSTRES: Lustre[] = ['metallic', 'submetallic', 'vitreous', 'adamantine', 'resinous', 'pearly', 'silky', 'greasy', 'earthy'];
export const STREAKS: Streak[] = ['white', 'grey', 'black', 'greenish-black', 'red-brown', 'red', 'yellow-brown', 'brown', 'green', 'blue', 'yellow', 'copper', 'gold'];
export const CLEAVAGES: [Cleavage, string][] = [['none', 'none seen (fracture only)'], ['1', '1 direction (sheets or flat flakes)'], ['2-90', '2 directions at about 90°'], ['2-not90', '2 directions not at 90° (about 60° and 120°)'], ['3-90', '3 directions at 90° (cubes)'], ['3-not90', '3 directions not at 90° (rhombs)'], ['4', '4 directions (octahedra)'], ['6', '6 directions']];
export const COLOURS: Colour[] = ['colourless', 'white', 'grey', 'black', 'brown', 'red', 'pink', 'orange', 'yellow', 'green', 'blue', 'purple', 'brassy', 'silvery', 'metal-grey', 'copper', 'gold'];
