// Barometer and altitude (Learn #1224): air pressure falls with height; water boils at a lower temperature in the
// hills; a pressure cooker puts the pressure back up. Plain TypeScript, no DOM.
// Air: the International Standard Atmosphere's lowest layer (to 11 km): T = T0 − L h, P = P0 (1 − L h / T0)^(g0 M / R L).
// Boiling point: the Clausius–Clapeyron equation through 100 °C at 101.325 kPa with an average ΔHvap = 41.5 kJ/mol.

export const P0 = 101325; // Pa, sea level
export const T0 = 288.15; // K (15 °C)
export const LAPSE = 0.0065; // K/m
export const G0 = 9.80665; // m/s²
export const M_AIR = 0.0289644; // kg/mol
export const R = 8.314462618; // J/(mol K)
export const EXP = (G0 * M_AIR) / (R * LAPSE); // ≈ 5.2559
export const H_VAP = 41500; // J/mol, an average for water between about 65 and 120 °C (40.7 at 100 °C)
export const RHO_HG = 13595.1; // kg/m³, mercury at 0 °C
export const RHO_W = 1000; // kg/m³

/** Air pressure (Pa) at height h metres above sea level (−500 to 11,000 m). */
export const pressureAt = (h: number) => P0 * (1 - (LAPSE * h) / T0) ** EXP;
/** Air temperature (°C) of the standard atmosphere at h metres. */
export const tempAt = (h: number) => T0 - LAPSE * h - 273.15;
/** Height (m) at which the standard pressure is P (Pa): the inverse of pressureAt. */
export const heightFor = (P: number) => (T0 / LAPSE) * (1 - (P / P0) ** (1 / EXP));
/** Boiling point of water (°C) at absolute pressure P (Pa). */
export const boilAt = (P: number) => 1 / (1 / 373.15 - (R / H_VAP) * Math.log(P / P0)) - 273.15;
/** Height (mm) of a liquid column that this pressure holds up: h = P / (ρ g). */
export const column = (P: number, rho = RHO_HG) => (P / (rho * G0)) * 1000;

export type Place = { id: string; name: string; h: number };
/** Heights rounded to the nearest 100 m or so (teaching values). */
export const PLACES: Place[] = [
  { id: 'sea', name: 'A seaside city', h: 0 },
  { id: 'plateau', name: 'A plateau city', h: 900 },
  { id: 'hill', name: 'A hill station', h: 2200 },
  { id: 'leh', name: 'A high Himalayan town', h: 3500 },
  { id: 'pass', name: 'A high mountain pass', h: 5400 },
  { id: 'everest', name: 'Top of Mount Everest', h: 8849 },
];
/** A typical pressure cooker adds about 1 bar (100 kPa) on top of the air outside (rounded teaching value). */
export const COOKER = 100000;

export type Q = { q: string; ans: number; unit?: string; tol?: number; abs?: number; choices?: string[]; work: string };
const n3 = (x: number) => String(+x.toPrecision(3));
/** Fresh "Check yourself" questions; lvl '8' or '11'. */
export function questions(lvl: string, rnd: () => number = Math.random): Q[] {
  const ri = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));
  const mm = ri(50, 76) * 10, Pmm = (RHO_HG * G0 * mm) / 1000;
  const out: Q[] = [
    { q: 'You carry a barometer from the beach up a mountain. What happens to its reading?', ans: 1, choices: ['It goes up', 'It goes down', 'It stays the same'], work: 'Higher up there is less air above you pressing down, so the air pressure, and the barometer reading, falls.' },
    { q: 'Why does food take longer to cook in an open pot high in the mountains?', ans: 2, choices: ['The fire is weaker there', 'Water boils at a higher temperature there', 'Water boils at a lower temperature there', 'Food is heavier there'], work: 'The air pressure is lower, so water boils below 100 °C. The boiling water is cooler, so food cooks more slowly. A pressure cooker raises the pressure and the boiling point again.' },
    { q: `A mercury barometer's column stands ${mm} mm high. What is the air pressure in kPa? (Mercury: 13,600 kg/m³, g = 9.8 m/s²)`, ans: (13600 * 9.8 * mm) / 1e6, unit: 'kPa', work: `P = ρgh = 13,600 × 9.8 × ${mm / 1000} = ${n3(13600 * 9.8 * mm / 1000)} Pa = ${n3((13600 * 9.8 * mm) / 1e6)} kPa.` },
  ];
  void Pmm;
  if (lvl === '11') {
    const Pa = ri(60, 100), g = ri(8, 12) * 10;
    out.push({ q: `The air pressure in a hill town is ${Pa} kPa and a pressure cooker adds ${g} kPa. What is the absolute pressure inside the cooker in kPa?`, ans: Pa + g, unit: 'kPa', abs: 0.5, work: `Inside = air outside + the cooker's extra (gauge) pressure = ${Pa} + ${g} = ${Pa + g} kPa.` });
    const P2 = ri(50, 100);
    out.push({ q: `How tall a column of water (1,000 kg/m³) would ${P2} kPa of air hold up in a water barometer? Give it in metres (g = 9.8 m/s²).`, ans: (P2 * 1000) / (1000 * 9.8), unit: 'm', work: `h = P ÷ (ρg) = ${P2 * 1000} ÷ (1,000 × 9.8) = ${n3((P2 * 1000) / 9800)} m. That is why barometers use dense mercury, not water.` });
  }
  return out;
}
