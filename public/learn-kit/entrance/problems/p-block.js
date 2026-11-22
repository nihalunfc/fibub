// Live problems for p-block elements (groups 13 to 18).
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sub = (s) => s.replace(/(\d+)/g, '<sub>$1</sub>');

// [formula, H, X atoms, O, name of X, charge on the species]
const OXO = [['H3PO2', 3, 1, 2, 'P', 0], ['H3PO3', 3, 1, 3, 'P', 0], ['H3PO4', 3, 1, 4, 'P', 0], ['H4P2O7', 4, 2, 7, 'P', 0], ['H4P2O6', 4, 2, 6, 'P', 0],
  ['H2SO3', 2, 1, 3, 'S', 0], ['H2SO4', 2, 1, 4, 'S', 0], ['H2S2O7', 2, 2, 7, 'S', 0], ['HNO2', 1, 1, 2, 'N', 0], ['HNO3', 1, 1, 3, 'N', 0],
  ['HClO', 1, 1, 1, 'Cl', 0], ['HClO2', 1, 1, 2, 'Cl', 0], ['HClO3', 1, 1, 3, 'Cl', 0], ['HClO4', 1, 1, 4, 'Cl', 0], ['H3BO3', 3, 1, 3, 'B', 0], ['HIO4', 1, 1, 4, 'I', 0]];
// [formula, F atoms, O atoms] for xenon compounds
const XE = [['XeF2', 2, 0], ['XeF4', 4, 0], ['XeF6', 6, 0], ['XeO3', 0, 3], ['XeOF4', 4, 1], ['XeO2F2', 2, 2], ['XeO4', 0, 4], ['XeOF2', 2, 1]];

export default {
  'pb-ox-state': {
    title: 'oxidation state of the central atom in an oxoacid',
    make(r) {
      const i = Math.floor(r() * OXO.length), [f, H, X, O, el] = OXO[i];
      const answer = (2 * O - H) / X;
      return { i, H, X, O,
        q: `<p>What is the oxidation state of ${el} in ${sub(f)}?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'H is +1 and O is −2 (no peroxide bonds here). The total for a neutral molecule is 0. If there are two central atoms, they share the total equally.',
        solution: steps(`Let ${el} = x: ${H}(+1) + ${X}x + ${O}(−2) = 0.`, `${X}x = ${2 * O} − ${H} = ${2 * O - H}.`, `x = <b>+${n(answer)}</b>.`) };
    },
    verify: (x) => -(x.H * 1 + x.O * -2) / x.X,
  },
  'pb-xe-lone': {
    title: 'lone pairs on xenon',
    make(r) {
      const i = Math.floor(r() * XE.length), [f, F, O] = XE[i];
      const answer = (8 - F - 2 * O) / 2;
      return { i, F, O,
        q: `<p>How many lone pairs are on the xenon atom in ${sub(f)}?</p>`,
        answer, unit: 'lone pairs', tol: 0, abs: 0.01,
        hint: 'Xe has 8 valence electrons. Each Xe-F bond uses 1 of them; each Xe=O uses 2. The electrons left over pair up as lone pairs.',
        solution: steps(`Electrons used in bonds: ${F} (to F) + ${2 * O} (to O) = ${F + 2 * O}.`, `Left on Xe: 8 − ${F + 2 * O} = ${8 - F - 2 * O}.`, `Lone pairs = ${8 - F - 2 * O}/2 = <b>${answer}</b>. Steric number = ${F + O} bonded atoms + ${answer} lone pairs = ${F + O + answer}.`) };
    },
    // steric number (from the shape table) minus bonded atoms
    verify: (x) => ({ XeF2: 5, XeF4: 6, XeF6: 7, XeO3: 4, XeOF4: 6, XeO2F2: 5, XeO4: 4, XeOF2: 5 })[XE[x.i][0]] - (x.F + x.O),
  },
  'pb-ostwald': {
    title: 'nitric acid from ammonia (Ostwald process)',
    make(r) {
      const kg = pick(r, 10, 500, 10), y = pick(r, 60, 98, 2);
      const answer = (kg / 17) * 63 * (y / 100);
      return { kg, y,
        q: `<p>In the Ostwald process, ammonia is oxidised to NO, then NO₂, which is absorbed in water. The NO formed in the last step is recycled, so in effect every N atom from NH₃ ends up in HNO₃. How many kg of HNO₃ can be made from ${kg} kg of NH₃ if the overall yield is ${y}%? (N 14, H 1, O 16)</p>`,
        answer, unit: 'kg', tol: 0.005,
        hint: 'With full recycling, 1 mol NH₃ → 1 mol HNO₃ (count N atoms). Moles of NH₃ = mass/17; mass of HNO₃ = moles × 63, then multiply by the yield.',
        solution: steps(`kmol of NH₃ = ${kg}/17 = ${n(kg / 17, 4)}.`, `Theoretical HNO₃ = ${n(kg / 17, 4)} × 63 = ${n((kg / 17) * 63, 4)} kg.`, `At ${y}% yield: <b>${n(answer)} kg</b>.`) };
    },
    // nitrogen mass balance: N in NH₃ is 14/17 of it, HNO₃ is 14/63 nitrogen
    verify: (x) => ((x.kg * 14) / 17 / (14 / 63)) * (x.y / 100),
  },
};
