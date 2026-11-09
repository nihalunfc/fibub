// #1103 MO diagram for diatomics. Checked against the bond orders and magnetic behaviour of the homonuclear
// diatomics in general chemistry texts (H₂ 1, He₂ 0, Li₂ 1, Be₂ 0, B₂ 1 paramagnetic, C₂ 2, N₂ 3, O₂ 2 with 2
// unpaired electrons, F₂ 1, Ne₂ 0) and the oxygen and nitrogen ions (O₂⁺ 2.5, O₂⁻ 1.5, O₂²⁻ 1, N₂⁺ 2.5, H₂⁺ and He₂⁺ 0.5),
// and the textbook electron configurations of N₂ (with s–p mixing) and O₂.
import { fillMO, speciesName, boText, autoMixing, order } from '../../src/lib/sci/modiagram.ts';

export default async (check) => {
  const want = { H: [1, 0], He: [0, 0], Li: [1, 0], Be: [0, 0], B: [1, 2], C: [2, 0], N: [3, 0], O: [2, 2], F: [1, 0], Ne: [0, 0] };
  check('mo: bond order and unpaired electrons H2 to Ne2', Object.entries(want).every(([el, [bo, up]]) => { const r = fillMO(el); return r.bondOrder === bo && r.unpaired === up; }));
  check('mo: O2 paramagnetic, N2 diamagnetic, Ne2 does not exist', fillMO('O').magnetic === 'paramagnetic' && fillMO('N').magnetic === 'diamagnetic' && !fillMO('Ne').exists && !fillMO('He').exists && fillMO('H').exists);
  const ions = [['O', 1, 2.5, 1], ['O', -1, 1.5, 1], ['O', -2, 1, 0], ['O', 2, 3, 0], ['N', 1, 2.5, 1], ['N', -1, 2.5, 1], ['H', 1, 0.5, 1], ['He', 1, 0.5, 1], ['H', -1, 0.5, 1], ['F', 1, 1.5, 1]];
  check('mo: ions', ions.every(([el, q, bo, up]) => { const r = fillMO(el, q); return r.bondOrder === bo && r.unpaired === up; }));
  check('mo: N2 configuration (s–p mixing)', fillMO('N').config === 'σ1s² σ*1s² σ2s² σ*2s² π2px² π2py² σ2pz²');
  check('mo: O2 configuration', fillMO('O').config === 'σ1s² σ*1s² σ2s² σ*2s² σ2pz² π2px² π2py² π*2px¹ π*2py¹');
  check('mo: B2 without mixing would be diamagnetic; C2 without mixing paramagnetic', fillMO('B', 0, false).unpaired === 0 && fillMO('C', 0, false).unpaired === 2 && fillMO('B', 0, true).unpaired === 2);
  check('mo: mixing auto up to N', autoMixing('N') && !autoMixing('O') && order(true)[4].label === 'π2px' && order(false)[4].label === 'σ2pz');
  check('mo: partial filling (Hund)', fillMO('O', 0, false, 12).fill.slice(4, 7).join() === '2,1,1' && fillMO('O', 0, false, 13).fill.slice(4, 7).join() === '2,2,1' && fillMO('O', 0, false, 15).unpaired === 1);
  check('mo: counts', fillMO('O').bonding === 10 && fillMO('O').antibonding === 6 && fillMO('Ne').electrons === 20);
  check('mo: errors', typeof fillMO('Na') === 'string' && typeof fillMO('Ne', -1) === 'string' && typeof fillMO('H', 2) === 'string');
  check('mo: names', speciesName('O', -2) === 'O₂²⁻' && speciesName('N', 1) === 'N₂⁺' && speciesName('C', 0) === 'C₂' && boText(2.5) === '2½' && boText(0.5) === '½' && boText(3) === '3');
};
