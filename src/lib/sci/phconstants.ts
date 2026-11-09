// Physical constants: CODATA 2018 and CODATA 2022 recommended values (NIST, public domain), as published, with
// helpers to show them with grouped digits, concise uncertainties and relative uncertainties. Exact values marked
// "truncated" go on forever and are shown to the published digits. Plain TypeScript, no DOM.

export type Edition = '2018' | '2022';
/** [value, standard uncertainty (null if exact), truncated (exact value with more digits)] as published strings. */
export type Entry = [string, string | null, boolean?];
export type Constant = { name: string; sym: string; group: string; unit: string; e: Record<Edition, Entry> };
type Row = [string, string, string, string, Entry, Entry];

const ROWS: Row[] = [
  ["Speed of light in vacuum", "c", "Universal", "m s⁻¹", ["299792458", null], ["299792458", null]],
  ["Planck constant", "h", "Universal", "J Hz⁻¹", ["6.62607015e-34", null], ["6.62607015e-34", null]],
  ["Planck constant in eV/Hz", "h", "Universal", "eV Hz⁻¹", ["4.135667696e-15", null, true], ["4.135667696e-15", null, true]],
  ["Reduced Planck constant", "ħ", "Universal", "J s", ["1.054571817e-34", null, true], ["1.054571817e-34", null, true]],
  ["Reduced Planck constant in eV s", "ħ", "Universal", "eV s", ["6.582119569e-16", null, true], ["6.582119569e-16", null, true]],
  ["Newtonian constant of gravitation", "G", "Universal", "m³ kg⁻¹ s⁻²", ["6.67430e-11", "0.00015e-11"], ["6.67430e-11", "0.00015e-11"]],
  ["Vacuum magnetic permeability", "μ₀", "Universal", "N A⁻²", ["1.25663706212e-6", "0.00000000019e-6"], ["1.25663706127e-6", "0.00000000020e-6"]],
  ["Vacuum electric permittivity", "ε₀", "Universal", "F m⁻¹", ["8.8541878128e-12", "0.0000000013e-12"], ["8.8541878188e-12", "0.0000000014e-12"]],
  ["Characteristic impedance of vacuum", "Z₀", "Universal", "Ω", ["376.730313668", "0.000000057"], ["376.730313412", "0.000000059"]],
  ["Planck length", "l_P", "Universal", "m", ["1.616255e-35", "0.000018e-35"], ["1.616255e-35", "0.000018e-35"]],
  ["Planck mass", "m_P", "Universal", "kg", ["2.176434e-8", "0.000024e-8"], ["2.176434e-8", "0.000024e-8"]],
  ["Planck time", "t_P", "Universal", "s", ["5.391247e-44", "0.000060e-44"], ["5.391247e-44", "0.000060e-44"]],
  ["Elementary charge", "e", "Electromagnetic", "C", ["1.602176634e-19", null], ["1.602176634e-19", null]],
  ["Magnetic flux quantum", "Φ₀", "Electromagnetic", "Wb", ["2.067833848e-15", null, true], ["2.067833848e-15", null, true]],
  ["Conductance quantum", "G₀", "Electromagnetic", "S", ["7.748091729e-5", null, true], ["7.748091729e-5", null, true]],
  ["Josephson constant", "K_J", "Electromagnetic", "Hz V⁻¹", ["483597.8484e9", null, true], ["483597.8484e9", null, true]],
  ["von Klitzing constant", "R_K", "Electromagnetic", "Ω", ["25812.80745", null, true], ["25812.80745", null, true]],
  ["Bohr magneton", "μ_B", "Electromagnetic", "J T⁻¹", ["9.2740100783e-24", "0.0000000028e-24"], ["9.2740100657e-24", "0.0000000029e-24"]],
  ["Bohr magneton in eV/T", "μ_B", "Electromagnetic", "eV T⁻¹", ["5.7883818060e-5", "0.0000000017e-5"], ["5.7883817982e-5", "0.0000000018e-5"]],
  ["Nuclear magneton", "μ_N", "Electromagnetic", "J T⁻¹", ["5.0507837461e-27", "0.0000000015e-27"], ["5.0507837393e-27", "0.0000000016e-27"]],
  ["Fine-structure constant", "α", "Atomic and nuclear", "", ["7.2973525693e-3", "0.0000000011e-3"], ["7.2973525643e-3", "0.0000000011e-3"]],
  ["Inverse fine-structure constant", "α⁻¹", "Atomic and nuclear", "", ["137.035999084", "0.000000021"], ["137.035999177", "0.000000021"]],
  ["Rydberg constant", "R∞", "Atomic and nuclear", "m⁻¹", ["10973731.568160", "0.000021"], ["10973731.568157", "0.000012"]],
  ["Rydberg constant times hc in eV", "R∞hc", "Atomic and nuclear", "eV", ["13.605693122994", "0.000000000026"], ["13.605693122990", "0.000000000015"]],
  ["Bohr radius", "a₀", "Atomic and nuclear", "m", ["5.29177210903e-11", "0.00000000080e-11"], ["5.29177210544e-11", "0.00000000082e-11"]],
  ["Hartree energy", "E_h", "Atomic and nuclear", "J", ["4.3597447222071e-18", "0.0000000000085e-18"], ["4.3597447222060e-18", "0.0000000000048e-18"]],
  ["Hartree energy in eV", "E_h", "Atomic and nuclear", "eV", ["27.211386245988", "0.000000000053"], ["27.211386245981", "0.000000000030"]],
  ["Electron mass", "m_e", "Atomic and nuclear", "kg", ["9.1093837015e-31", "0.0000000028e-31"], ["9.1093837139e-31", "0.0000000028e-31"]],
  ["Electron mass energy equivalent in MeV", "m_e c²", "Atomic and nuclear", "MeV", ["0.51099895000", "0.00000000015"], ["0.51099895069", "0.00000000016"]],
  ["Electron mass in u", "m_e", "Atomic and nuclear", "u", ["5.48579909065e-4", "0.00000000016e-4"], ["5.485799090441e-4", "0.000000000097e-4"]],
  ["Proton mass", "m_p", "Atomic and nuclear", "kg", ["1.67262192369e-27", "0.00000000051e-27"], ["1.67262192595e-27", "0.00000000052e-27"]],
  ["Proton mass energy equivalent in MeV", "m_p c²", "Atomic and nuclear", "MeV", ["938.27208816", "0.00000029"], ["938.27208943", "0.00000029"]],
  ["Proton mass in u", "m_p", "Atomic and nuclear", "u", ["1.007276466621", "0.000000000053"], ["1.0072764665789", "0.0000000000083"]],
  ["Neutron mass", "m_n", "Atomic and nuclear", "kg", ["1.67492749804e-27", "0.00000000095e-27"], ["1.67492750056e-27", "0.00000000085e-27"]],
  ["Neutron mass energy equivalent in MeV", "m_n c²", "Atomic and nuclear", "MeV", ["939.56542052", "0.00000054"], ["939.56542194", "0.00000048"]],
  ["Neutron mass in u", "m_n", "Atomic and nuclear", "u", ["1.00866491595", "0.00000000049"], ["1.00866491606", "0.00000000040"]],
  ["Proton-electron mass ratio", "m_p/m_e", "Atomic and nuclear", "", ["1836.15267343", "0.00000011"], ["1836.152673426", "0.000000032"]],
  ["Atomic mass constant", "m_u", "Atomic and nuclear", "kg", ["1.66053906660e-27", "0.00000000050e-27"], ["1.66053906892e-27", "0.00000000052e-27"]],
  ["Atomic mass constant energy equivalent in MeV", "m_u c²", "Atomic and nuclear", "MeV", ["931.49410242", "0.00000028"], ["931.49410372", "0.00000029"]],
  ["Muon mass", "m_μ", "Atomic and nuclear", "kg", ["1.883531627e-28", "0.000000042e-28"], ["1.883531627e-28", "0.000000042e-28"]],
  ["Deuteron mass", "m_d", "Atomic and nuclear", "kg", ["3.3435837724e-27", "0.0000000010e-27"], ["3.3435837768e-27", "0.0000000010e-27"]],
  ["Alpha particle mass", "m_α", "Atomic and nuclear", "kg", ["6.6446573357e-27", "0.0000000020e-27"], ["6.6446573450e-27", "0.0000000021e-27"]],
  ["Electron charge to mass quotient", "−e/m_e", "Atomic and nuclear", "C kg⁻¹", ["-1.75882001076e11", "0.00000000053e11"], ["-1.75882000838e11", "0.00000000055e11"]],
  ["Classical electron radius", "r_e", "Atomic and nuclear", "m", ["2.8179403262e-15", "0.0000000013e-15"], ["2.8179403205e-15", "0.0000000013e-15"]],
  ["Compton wavelength", "λ_C", "Atomic and nuclear", "m", ["2.42631023867e-12", "0.00000000073e-12"], ["2.42631023538e-12", "0.00000000076e-12"]],
  ["Thomson cross section", "σ_e", "Atomic and nuclear", "m²", ["6.6524587321e-29", "0.0000000060e-29"], ["6.6524587051e-29", "0.0000000062e-29"]],
  ["Electron magnetic moment", "μ_e", "Atomic and nuclear", "J T⁻¹", ["-9.2847647043e-24", "0.0000000028e-24"], ["-9.2847646917e-24", "0.0000000029e-24"]],
  ["Electron g factor", "g_e", "Atomic and nuclear", "", ["-2.00231930436256", "0.00000000000035"], ["-2.00231930436092", "0.00000000000036"]],
  ["Proton magnetic moment", "μ_p", "Atomic and nuclear", "J T⁻¹", ["1.41060679736e-26", "0.00000000060e-26"], ["1.41060679545e-26", "0.00000000060e-26"]],
  ["Proton g factor", "g_p", "Atomic and nuclear", "", ["5.5856946893", "0.0000000016"], ["5.5856946893", "0.0000000016"]],
  ["Proton rms charge radius", "r_p", "Atomic and nuclear", "m", ["8.414e-16", "0.019e-16"], ["8.4075e-16", "0.0064e-16"]],
  ["Avogadro constant", "N_A", "Physico-chemical", "mol⁻¹", ["6.02214076e23", null], ["6.02214076e23", null]],
  ["Boltzmann constant", "k", "Physico-chemical", "J K⁻¹", ["1.380649e-23", null], ["1.380649e-23", null]],
  ["Boltzmann constant in eV/K", "k", "Physico-chemical", "eV K⁻¹", ["8.617333262e-5", null, true], ["8.617333262e-5", null, true]],
  ["Molar gas constant", "R", "Physico-chemical", "J mol⁻¹ K⁻¹", ["8.314462618", null, true], ["8.314462618", null, true]],
  ["Faraday constant", "F", "Physico-chemical", "C mol⁻¹", ["96485.33212", null, true], ["96485.33212", null, true]],
  ["Stefan-Boltzmann constant", "σ", "Physico-chemical", "W m⁻² K⁻⁴", ["5.670374419e-8", null, true], ["5.670374419e-8", null, true]],
  ["Wien wavelength displacement law constant", "b", "Physico-chemical", "m K", ["2.897771955e-3", null, true], ["2.897771955e-3", null, true]],
  ["Wien frequency displacement law constant", "b′", "Physico-chemical", "Hz K⁻¹", ["5.878925757e10", null, true], ["5.878925757e10", null, true]],
  ["First radiation constant", "c₁", "Physico-chemical", "W m²", ["3.741771852e-16", null, true], ["3.741771852e-16", null, true]],
  ["Second radiation constant", "c₂", "Physico-chemical", "m K", ["1.438776877e-2", null, true], ["1.438776877e-2", null, true]],
  ["Molar volume of ideal gas (273.15 K, 101.325 kPa)", "V_m", "Physico-chemical", "m³ mol⁻¹", ["22.41396954e-3", null, true], ["22.41396954e-3", null, true]],
  ["Loschmidt constant (273.15 K, 101.325 kPa)", "n₀", "Physico-chemical", "m⁻³", ["2.686780111e25", null, true], ["2.686780111e25", null, true]],
  ["Molar mass constant", "M_u", "Physico-chemical", "kg mol⁻¹", ["0.99999999965e-3", "0.00000000030e-3"], ["1.00000000105e-3", "0.00000000031e-3"]],
  ["Molar Planck constant", "N_A h", "Physico-chemical", "J Hz⁻¹ mol⁻¹", ["3.990312712e-10", null, true], ["3.990312712e-10", null, true]],
  ["Hyperfine transition frequency of Cs-133", "Δν_Cs", "Adopted values", "Hz", ["9192631770", null], ["9192631770", null]],
  ["Luminous efficacy", "K_cd", "Adopted values", "lm W⁻¹", ["683", null], ["683", null]],
  ["Standard acceleration of gravity", "g_n", "Adopted values", "m s⁻²", ["9.80665", null], ["9.80665", null]],
  ["Standard atmosphere", "atm", "Adopted values", "Pa", ["101325", null], ["101325", null]],
  ["Electron volt", "eV", "Adopted values", "J", ["1.602176634e-19", null], ["1.602176634e-19", null]],
];
export const GROUPS = ['Universal', 'Electromagnetic', 'Atomic and nuclear', 'Physico-chemical', 'Adopted values'];
export const CONSTANTS: Constant[] = ROWS.map(([name, sym, group, unit, a, b]) => ({ name, sym, group, unit, e: { '2018': a, '2022': b } }));

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = (n: number) => String(n).split('').map((c) => SUP[c] ?? c).join('');
/** Split "6.62607015e-34" into mantissa "6.62607015" and exponent −34. */
export function split(v: string): { mant: string; exp: number } {
  const [m, e] = v.toLowerCase().split('e');
  return { mant: m, exp: e ? parseInt(e, 10) : 0 };
}
/** Digits in groups of three either side of the point (thin spaces), as CODATA prints them (a lone last digit joins the group before). */
export function group3(mant: string): string {
  const neg = mant.startsWith('-'), m = neg ? mant.slice(1) : mant;
  const [i, f = ''] = m.split('.');
  const gi = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009') : i; // 1836 stays whole, as CODATA prints it
  const parts = f.match(/\d{1,3}/g) ?? [];
  if (parts.length > 1 && parts[parts.length - 1].length === 1) parts.splice(-2, 2, parts[parts.length - 2] + parts[parts.length - 1]);
  const gf = parts.join('\u2009');
  return (neg ? '−' : '') + gi + (f ? '.' + gf : '');
}
/** Value as text: 6.626 070 15 × 10⁻³⁴ (with … when an exact value is truncated). */
export function show(c: Constant, ed: Edition): string {
  const [v, , trunc] = c.e[ed], { mant, exp } = split(v);
  return group3(mant) + (trunc ? '…' : '') + (exp ? ` × 10${sup(exp)}` : '');
}
/** Concise form with the uncertainty in brackets on the last digits: 6.674 30(15) × 10⁻¹¹; exact values unchanged. */
export function concise(c: Constant, ed: Edition): string {
  const [v, u] = c.e[ed];
  if (!u) return show(c, ed);
  const { mant, exp } = split(v), uu = split(u), dec = (mant.split('.')[1] ?? '').length;
  const digits = Math.round(Number(uu.mant) * 10 ** (dec + uu.exp - exp));
  return group3(mant) + `(${digits})` + (exp ? ` × 10${sup(exp)}` : '');
}
export const value = (c: Constant, ed: Edition) => Number(c.e[ed][0]);
export const uncertainty = (c: Constant, ed: Edition) => (c.e[ed][1] ? Number(c.e[ed][1]) : 0);
/** Relative standard uncertainty (0 if exact). */
export const relU = (c: Constant, ed: Edition) => Math.abs(uncertainty(c, ed) / value(c, ed));
/** Text to paste into a calculator, spreadsheet or code: the value in plain E notation. */
export const plain = (c: Constant, ed: Edition) => c.e[ed][0];
/** Search by name, symbol or unit (case and accents ignored). */
export function search(q: string, group = ''): Constant[] {
  const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const words = norm(q).split(/\s+/).filter(Boolean);
  return CONSTANTS.filter((c) => (!group || c.group === group) && words.every((w) => norm(`${c.name} ${c.sym} ${c.unit}`).includes(w)));
}
/** Constants whose value or uncertainty changed between the 2018 and 2022 adjustments. */
export const changed = (c: Constant) => c.e['2018'][0] !== c.e['2022'][0] || c.e['2018'][1] !== c.e['2022'][1];
