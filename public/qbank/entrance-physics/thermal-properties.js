import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const PI = Math.PI;
let k = 0; let c = 0;
const nid = () => `tp-${String(++k).padStart(3, '0')}`;
const R = (x, dp) => +x.toFixed(dp);
const tl = (a) => +Math.max(Math.abs(a) * 0.01, 1e-9).toPrecision(1);
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const nat = (level, sub, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  if (tol === 0 && !Number.isInteger(answer)) tol = +(0.6 * 10 ** -dp).toPrecision(1);
  return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const msq = (level, sub, q, options, answer, sol, o = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const asrt = (level, sub, A, Rr, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${Rr}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
const stc = (level, sub, q, correct, wrongs, sol, o = {}) => { const it = mcq(level, sub, q, correct, wrongs, sol, o); it.format = 'statements'; return it; };
const mat = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const pas = (level, sub, group, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  if (tol === 0 && !Number.isInteger(answer)) tol = +(0.6 * 10 ** -dp).toPrecision(1);
  return base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, calc: () => answer, sol, ...o });
};
const pasm = (level, sub, group, q, correct, wrongs, sol, o = {}) => { const it = mcq(level, sub, q, correct, wrongs, sol, o); it.format = 'passage'; it.group = group; return it; };
// Thermal properties of matter: Plus Two entrance bank (original fibub questions).
const SIG = 5.67e-8; const LF = 3.36e5; const LV = 2.26e6; const CW = 4200;

const items = [
  // ---------- Level 1 ----------
  nat(1, 'temperature scales', r`Convert $50\,^\circ\mathrm{C}$ to the Fahrenheit scale (in $^\circ\mathrm{F}$).`, () => 50 * 9 / 5 + 32, 0, 0,
    r`$F = \tfrac{9}{5}C + 32 = \tfrac95\times50 + 32 = 90 + 32 = 122\,^\circ\mathrm{F}$.`, { unit: '°F' }),
  mcq(1, 'temperature scales', r`Absolute zero on the Celsius scale is about`, r`$-273\,^\circ\mathrm{C}$`, [r`$0\,^\circ\mathrm{C}$`, r`$-100\,^\circ\mathrm{C}$`, r`$-373\,^\circ\mathrm{C}$`],
    r`$T(\mathrm K) = t(^\circ\mathrm C) + 273.15$. Zero kelvin is therefore $-273.15\,^\circ\mathrm C$. The other options are not special points.`),
  nat(1, 'linear expansion', r`A steel rod 2 m long has $\alpha = 12\times10^{-6}\ \mathrm{K^{-1}}$. By how many mm does it lengthen when heated by $50\,^\circ\mathrm C$?`, () => 2 * 12e-6 * 50 * 1000, 0.05, 1,
    r`$\Delta L = L\alpha\Delta T = 2\times12\times10^{-6}\times50 = 1.2\times10^{-3}$ m $= 1.2$ mm.`, { unit: 'mm' }),
  mcq(1, 'calorimetry', r`The SI unit of specific heat capacity is`, r`$\mathrm{J\,kg^{-1}\,K^{-1}}$`, [r`$\mathrm{J\,kg^{-1}}$`, r`$\mathrm{J\,K^{-1}}$`, r`$\mathrm{W\,m^{-1}\,K^{-1}}$`],
    r`$c = Q/(m\Delta T)$, so its unit is J per kg per kelvin. J kg<sup>-1</sup> is latent heat, J K<sup>-1</sup> is heat capacity and W m<sup>-1</sup> K<sup>-1</sup> is thermal conductivity.`),
  mcq(1, 'anomalous expansion of water', r`Water has its maximum density at`, r`$4\,^\circ\mathrm{C}$`, [r`$0\,^\circ\mathrm{C}$`, r`$100\,^\circ\mathrm{C}$`, r`$-4\,^\circ\mathrm{C}$`],
    r`Between 0 and $4\,^\circ$C water contracts on heating, so its density is largest at about $4\,^\circ$C (3.98 $^\circ$C).`),
  nat(1, 'specific heat', r`How much heat (in kJ) raises the temperature of 2 kg of water by $10\,^\circ\mathrm C$? ($c = 4200\ \mathrm{J\,kg^{-1}K^{-1}}$)`, () => 2 * 4200 * 10 / 1000, 0, 0,
    r`$Q = mc\Delta T = 2\times4200\times10 = 84000$ J $= 84$ kJ.`, { unit: 'kJ' }),
  mcq(1, 'heat transfer', r`Heat from the Sun reaches the Earth mainly by`, 'radiation', ['conduction', 'convection', 'conduction and convection together'],
    r`Space is almost a vacuum, so there is no medium for conduction or convection. Electromagnetic radiation does not need a medium.`),
  nat(1, 'temperature scales', r`At what temperature (in $^\circ$C) do the Celsius and Fahrenheit readings become equal?`, () => -40, 0, 0,
    r`Put $F = C = x$ in $F = \tfrac95C + 32$: $x = \tfrac95x + 32 \Rightarrow -\tfrac45x = 32 \Rightarrow x = -40$.`, { unit: '°C' }),
  mcq(1, 'thermal expansion', r`For an isotropic solid the coefficients of linear, area and volume expansion are in the ratio $\alpha:\beta:\gamma$ (approximately)`, '1 : 2 : 3', ['1 : 3 : 2', '1 : 1 : 1', '3 : 2 : 1'],
    r`Area $\propto L^2$ gives $\beta = 2\alpha$ and volume $\propto L^3$ gives $\gamma = 3\alpha$ (for small $\alpha\Delta T$).`),
  nat(1, 'latent heat', r`How much heat (in kJ) is needed to melt 0.5 kg of ice at $0\,^\circ$C? ($L_f = 336\ \mathrm{kJ\,kg^{-1}}$)`, () => 0.5 * 336, 0, 0,
    r`$Q = mL_f = 0.5\times336 = 168$ kJ. The temperature stays at $0\,^\circ$C while the ice melts.`, { unit: 'kJ' }),
  mcq(1, 'radiation', r`An ideal black body`, 'absorbs all the radiation falling on it', ['reflects all the radiation falling on it', 'emits only visible light', 'must look black at every temperature'],
    r`Black body means perfect absorber at all wavelengths (and so the best emitter). A very hot black body glows white or red, so it need not look black.`),
  nat(1, 'temperature scales', r`Express $27\,^\circ\mathrm C$ on the Kelvin scale (in K).`, () => 27 + 273, 0, 0, r`$T = 27 + 273 = 300$ K.`, { unit: 'K' }),
  mcq(1, 'Stefan-Boltzmann law', r`According to Stefan's law, the power radiated by a black body is proportional to`, r`$T^4$`, [r`$T$`, r`$T^2$`, r`$T^{1/4}$`],
    r`$P = \sigma A T^4$, with $T$ in kelvin.`),
  mcq(1, 'pendulum clock', r`A pendulum clock is set right in winter. On a hot summer day it will`, 'run slow', ['run fast', 'keep correct time', 'stop'],
    r`The rod lengthens, so the time period $T = 2\pi\sqrt{L/g}$ increases. Each tick takes longer than 1 s, so the clock loses time.`),
  mcq(1, 'heat transfer', r`The silvered walls of a thermos flask mainly reduce heat loss by`, 'radiation', ['conduction through the glass', 'convection of the liquid', 'evaporation'],
    r`The vacuum between the double wall stops conduction and convection. The shiny silver coating reflects radiation back.`),
  mcq(1, 'latent heat', r`While ice at $0\,^\circ$C is melting into water at $0\,^\circ$C, the heat supplied`, 'goes into breaking the ordered structure, with no rise in temperature', ['raises the temperature of the ice', 'is stored as kinetic energy of the molecules', 'is lost to the surroundings'],
    r`Latent heat changes the potential energy of the molecules (their arrangement). The temperature, a measure of kinetic energy, stays at $0\,^\circ$C until all the ice has melted.`),

  // ---------- Level 2 ----------
  nat(2, 'linear expansion', r`A railway rail is 12 m long with $\alpha = 1.1\times10^{-5}\ \mathrm{K^{-1}}$. Find the gap (in mm) needed to allow for a rise from $10\,^\circ$C to $50\,^\circ$C.`, () => 12 * 1.1e-5 * 40 * 1000, 0.05, 2,
    r`$\Delta L = L\alpha\Delta T = 12\times1.1\times10^{-5}\times40 = 5.28\times10^{-3}$ m $= 5.28$ mm.`, { unit: 'mm' }),
  nat(2, 'area expansion', r`A metal plate of area $0.50\ \mathrm{m^2}$ ($\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$) is heated by $100\,^\circ$C. Find the increase in its area (in $\mathrm{cm^2}$).`, () => 2 * 1.2e-5 * 100 * 0.5 * 1e4, 0.1, 1,
    r`$\Delta A = 2\alpha A\Delta T = 2\times1.2\times10^{-5}\times0.50\times100 = 1.2\times10^{-3}\ \mathrm{m^2} = 12\ \mathrm{cm^2}$.`, { unit: 'cm²', trap: 'Use $2\\alpha$, not $\\alpha$, for area.' }),
  nat(2, 'volume expansion of liquids', r`$500\ \mathrm{cm^3}$ of mercury ($\gamma = 1.8\times10^{-4}\ \mathrm{K^{-1}}$) is heated by $50\,^\circ$C. Find the increase in volume (in $\mathrm{cm^3}$).`, () => 500 * 1.8e-4 * 50, 0.05, 1,
    r`$\Delta V = V\gamma\Delta T = 500\times1.8\times10^{-4}\times50 = 4.5\ \mathrm{cm^3}$.`, { unit: 'cm³' }),
  nat(2, 'calorimetry', r`200 g of water at $80\,^\circ$C is mixed with 300 g of water at $20\,^\circ$C in an insulated vessel. Find the final temperature (in $^\circ$C).`, () => (200 * 80 + 300 * 20) / 500, 0, 0,
    r`Heat lost = heat gained: $200(80 - T) = 300(T - 20)$, so $16000 - 200T = 300T - 6000$ and $T = 22000/500 = 44\,^\circ$C.`, { unit: '°C' }),
  nat(2, 'calorimetry with ice', r`100 g of ice at $0\,^\circ$C is dropped into 400 g of water at $30\,^\circ$C. ($L_f = 80\ \mathrm{cal\,g^{-1}}$, $c_w = 1\ \mathrm{cal\,g^{-1}\,{}^\circ C^{-1}}$.) Find the final temperature (in $^\circ$C).`, () => (400 * 30 - 100 * 80) / 500, 0, 0,
    r`Water cooling to $0\,^\circ$C gives $400\times30 = 12000$ cal, more than the 8000 cal needed to melt all the ice, so everything melts and the mixture rises above $0\,^\circ$C. Then $400(30 - T) = 8000 + 100T$ gives $T = 4000/500 = 8\,^\circ$C.`, { unit: '°C' }),
  nat(2, 'conduction', r`A copper rod ($k = 400\ \mathrm{W\,m^{-1}K^{-1}}$) has area $2\times10^{-4}\ \mathrm{m^2}$ and length 0.5 m. Its ends are held at $100\,^\circ$C and $0\,^\circ$C. Find the rate of heat flow (in W).`, () => 400 * 2e-4 * 100 / 0.5, 0, 0,
    r`$H = kA\Delta T/L = 400\times2\times10^{-4}\times100/0.5 = 16$ W.`, { unit: 'W' }),
  nat(2, 'conduction in series', r`Two rods of equal length and area are joined end to end. The first has conductivity $2k$ and the second $k$. The free ends are at $100\,^\circ$C (first rod) and $0\,^\circ$C. Find the temperature of the joint (in $^\circ$C, 1 decimal).`, () => 200 / 3, 0.1, 1,
    r`In steady state the same heat flows through both: $2k(100 - T) = k(T - 0)$, so $200 - 2T = T$ and $T = 66.7\,^\circ$C. The better conductor has the smaller temperature drop.`, { unit: '°C' }),
  nat(2, 'Stefan-Boltzmann law', r`A black body of surface area $0.01\ \mathrm{m^2}$ is at 1000 K. Find the power it radiates (in W). Take $\sigma = 5.67\times10^{-8}\ \mathrm{W\,m^{-2}K^{-4}}$.`, () => SIG * 0.01 * 1e12, 0.5, 0,
    r`$P = \sigma A T^4 = 5.67\times10^{-8}\times0.01\times10^{12} = 567$ W.`, { unit: 'W' }),
  nat(2, 'Wien displacement law', r`The radiation from a star peaks at 500 nm. Find its surface temperature (in K, nearest whole number). Take $b = 2.898\times10^{-3}$ m K.`, () => 2.898e-3 / 500e-9, 5, 0,
    r`$\lambda_m T = b$, so $T = 2.898\times10^{-3}/(500\times10^{-9}) = 5796$ K.`, { unit: 'K' }),
  nat(2, 'Stefan-Boltzmann law', r`The absolute temperature of a black body is doubled. By what factor does the radiated power increase?`, () => 16, 0, 0,
    r`$P\propto T^4$, so the factor is $2^4 = 16$.`, { unit: '' }),
  mcq(2, 'bimetallic strip', r`A bimetallic strip of brass (larger $\alpha$) and iron is heated. It bends so that`, 'the brass is on the outer (convex) side', ['the brass is on the inner (concave) side', 'it stays straight but gets longer', 'the iron is on the convex side'],
    r`The metal with larger $\alpha$ expands more, so it must lie on the outside of the curve (it has the longer arc). When the strip is cooled it bends the other way.`),
  nat(2, 'calorimetry', r`How much heat (in cal) is needed to raise the temperature of a 500 g copper block ($c = 0.09\ \mathrm{cal\,g^{-1}\,{}^\circ C^{-1}}$) from $20\,^\circ$C to $100\,^\circ$C?`, () => 500 * 0.09 * 80, 0, 0,
    r`$Q = mc\Delta T = 500\times0.09\times80 = 3600$ cal.`, { unit: 'cal' }),
  nat(2, 'latent heat', r`How much heat (in kJ, 1 decimal) is released when 10 g of steam at $100\,^\circ$C condenses to water at $100\,^\circ$C? ($L_v = 2260\ \mathrm{J\,g^{-1}}$)`, () => 10 * 2.26, 0.05, 1,
    r`$Q = mL_v = 10\times2260 = 22600$ J $= 22.6$ kJ.`, { unit: 'kJ' }),
  mcq(2, 'conduction', r`The SI unit of thermal conductivity is`, r`$\mathrm{W\,m^{-1}\,K^{-1}}$`, [r`$\mathrm{W\,m^{-2}\,K^{-1}}$`, r`$\mathrm{J\,m^{-1}\,K^{-1}}$`, r`$\mathrm{W\,m\,K^{-1}}$`],
    r`$H = kA\Delta T/L$ gives $k = HL/(A\Delta T)$: W $\times$ m / (m$^2$ K) $=$ W m<sup>-1</sup> K<sup>-1</sup>.`),
  nat(2, 'pendulum clock', r`A pendulum clock is correct at $20\,^\circ$C. The rod has $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$. How many seconds does it lose in one day if the temperature stays at $40\,^\circ$C?`, () => 0.5 * 1.2e-5 * 20 * 86400, 0.1, 1,
    r`$T\propto\sqrt L$, so $\Delta T_p/T_p = \tfrac12\alpha\Delta\theta$. Time lost per day $= \tfrac12\alpha\Delta\theta\times86400 = 0.5\times1.2\times10^{-5}\times20\times86400 = 10.4$ s.`, { unit: 's' }),
  mcq(2, 'thermal expansion', r`A metal plate has a circular hole. On heating the plate, the diameter of the hole`, 'increases', ['decreases', 'stays the same', 'increases only if the plate is thin'],
    r`Expansion is like a photographic enlargement: every length on the plate, including the hole's diameter, grows by the same factor $(1 + \alpha\Delta T)$.`, { trap: 'The metal does not "fill in" the hole.' }),
  nat(2, 'temperature scales', r`A faulty thermometer reads 5 at the ice point and 95 at the steam point. What is the true temperature (in $^\circ$C) when it reads 41?`, () => (41 - 5) / (95 - 5) * 100, 0, 0,
    r`Fundamental interval is 90 divisions for 100 $^\circ$C. True $= \dfrac{41 - 5}{95 - 5}\times100 = 40\,^\circ$C.`, { unit: '°C' }),
  nat(2, 'thermal stress', r`A steel rod ($Y = 2\times10^{11}$ Pa, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$) is clamped rigidly between two walls and heated by $50\,^\circ$C. Find the compressive stress in it (in MPa).`, () => 2e11 * 1.2e-5 * 50 / 1e6, 0, 0,
    r`The rod wants to expand by strain $\alpha\Delta T$ but the walls prevent this, so stress $= Y\alpha\Delta T = 2\times10^{11}\times1.2\times10^{-5}\times50 = 1.2\times10^{8}$ Pa $= 120$ MPa.`, { unit: 'MPa' }),
  nat(2, 'latent heat', r`A 2 kW heater boils away water already at $100\,^\circ$C. How long (in s) does it take to turn 0.5 kg into steam? ($L_v = 2.26\times10^6\ \mathrm{J\,kg^{-1}}$; all heat is used.)`, () => 0.5 * LV / 2000, 0, 0,
    r`$Pt = mL_v$, so $t = 0.5\times2.26\times10^6/2000 = 565$ s.`, { unit: 's' }),
  mcq(2, 'convection', r`The sea breeze blows from sea to land in the daytime because`, 'land warms faster than water (lower specific heat), so air above land rises and cooler sea air flows in', ['sea water is hotter than land during the day', 'cold air is lighter than warm air', 'land has a higher specific heat than water'],
    r`Land has smaller specific heat, so it heats faster. The warm air over it rises (convection) and the cooler air over the sea moves in at ground level.`),
  nat(2, 'conduction', r`A window pane of area $1.5\ \mathrm{m^2}$ and thickness 4 mm has $k = 0.8\ \mathrm{W\,m^{-1}K^{-1}}$. The temperature difference across it is $10\,^\circ$C. Find the heat flow (in W).`, () => 0.8 * 1.5 * 10 / 0.004, 0, 0,
    r`$H = kA\Delta T/L = 0.8\times1.5\times10/0.004 = 3000$ W. (Real windows lose less, because still air layers on each side add resistance.)`, { unit: 'W', trap: 'Convert 4 mm to 0.004 m.' }),
  nat(2, 'emissivity', r`A surface of emissivity 0.5 and area $0.2\ \mathrm{m^2}$ is at 500 K. Find the power it radiates (in W, nearest whole number). $\sigma = 5.67\times10^{-8}$ SI.`, () => 0.5 * SIG * 0.2 * 500 ** 4, 3, 0,
    r`$P = e\sigma AT^4 = 0.5\times5.67\times10^{-8}\times0.2\times(500)^4 = 0.5\times5.67\times10^{-8}\times0.2\times6.25\times10^{10} = 354$ W.`, { unit: 'W' }),
  mcq(2, 'latent heat', r`Steam at $100\,^\circ$C burns more severely than water at $100\,^\circ$C because`, 'steam gives out its latent heat when it condenses on the skin', ['steam is at a higher temperature', 'steam has a larger specific heat than water', 'steam is a better conductor'],
    r`Both are at $100\,^\circ$C. Each gram of steam additionally releases 2260 J as it condenses, which is more than five times the heat released by cooling the same water by $100\,^\circ$C.`),
  nat(2, 'calorimetry', r`An electric kettle rated 2 kW heats 3 kg of water from $20\,^\circ$C to $70\,^\circ$C. Find the time taken in seconds if all the heat goes to the water.`, () => 3 * 4200 * 50 / 2000, 0, 0,
    r`$Pt = mc\Delta T$, so $t = 3\times4200\times50/2000 = 315$ s.`, { unit: 's' }),
  mcq(2, 'Newton\'s law of cooling', r`According to Newton's law of cooling, the rate of loss of heat of a body is proportional to`, 'the difference between its temperature and that of the surroundings', ['the temperature of the body', 'the fourth power of the temperature of the body', 'the temperature of the surroundings'],
    r`$\dfrac{dQ}{dt}\propto(T - T_s)$. It holds for small differences. The fourth power belongs to Stefan's law.`),
  nat(2, 'calorimetry with ice', r`How much heat (in cal) is needed to convert 100 g of ice at $-10\,^\circ$C into water at $0\,^\circ$C? ($c_{ice} = 0.5\ \mathrm{cal\,g^{-1}\,{}^\circ C^{-1}}$, $L_f = 80\ \mathrm{cal\,g^{-1}}$)`, () => 100 * 0.5 * 10 + 100 * 80, 0, 0,
    r`Warm the ice: $100\times0.5\times10 = 500$ cal. Melt it: $100\times80 = 8000$ cal. Total $8500$ cal.`, { unit: 'cal' }),
];

items.push(
  // ---------- Level 3 ----------
  nat(3, 'expansion of liquids', r`Mercury has $\gamma = 1.8\times10^{-4}\ \mathrm{K^{-1}}$ and the glass of its container has $\alpha = 9\times10^{-6}\ \mathrm{K^{-1}}$. Find the coefficient of apparent expansion of mercury in this glass (in units of $10^{-5}\ \mathrm{K^{-1}}$, 1 decimal).`, () => (1.8e-4 - 3 * 9e-6) * 1e5, 0.1, 1,
    r`The vessel's volume also grows, with $\gamma_g = 3\alpha = 2.7\times10^{-5}$. Apparent $\gamma = \gamma_l - \gamma_g = 18\times10^{-5} - 2.7\times10^{-5} = 15.3\times10^{-5}$.`, { unit: '×10⁻⁵ /K', trap: 'Glass expands too: subtract $3\\alpha$, not $\\alpha$.' }),
  nat(3, 'density and temperature', r`A liquid has $\gamma = 2\times10^{-4}\ \mathrm{K^{-1}}$. By what percentage (1 decimal) does its density fall when it is heated by $100\,^\circ$C?`, () => (1 - 1 / (1 + 2e-4 * 100)) * 100, 0.1, 1,
    r`Mass is fixed and volume becomes $V(1 + \gamma\Delta T) = 1.02V$. $\rho'/\rho = 1/1.02 = 0.9804$, so the density falls by $1.96\% \approx 2.0\%$.`, { unit: '%' }),
  nat(3, 'expansion of composite rods', r`Two rods of different metals have $\alpha_1 = 2\times10^{-5}$ and $\alpha_2 = 1\times10^{-5}\ \mathrm{K^{-1}}$. Their lengths differ by 10 cm and this difference stays the same at all temperatures. Find the length (in cm) of the shorter rod.`, () => 10, 0, 0,
    r`The difference stays fixed only if both expand equally: $L_1\alpha_1 = L_2\alpha_2$. So $L_2 = 2L_1$ (the rod with smaller $\alpha$ is longer). $L_2 - L_1 = L_1 = 10$ cm. The shorter rod is 10 cm (and the other 20 cm).`, { unit: 'cm' }),
  nat(3, 'bimetallic strip', r`Two thin metal strips are joined face to face with their centre-lines 1.0 mm apart. Their coefficients are $1.2\times10^{-5}$ and $2.0\times10^{-5}\ \mathrm{K^{-1}}$. Treat each as a line and find the radius of curvature (in m, 2 decimals) when the pair is heated by $100\,^\circ$C.`, () => 1e-3 / ((2.0e-5 - 1.2e-5) * 100), 0.02, 2,
    r`The strips subtend the same angle $\theta$. Outer arc $= (R + d)\theta = L(1 + \alpha_2\Delta T)$ and inner arc $= R\theta = L(1 + \alpha_1\Delta T)$. Subtract: $d\theta = L(\alpha_2 - \alpha_1)\Delta T$. Dividing, $R = \dfrac{d(1 + \alpha_1\Delta T)}{(\alpha_2 - \alpha_1)\Delta T}\approx\dfrac{d}{(\alpha_2 - \alpha_1)\Delta T} = \dfrac{10^{-3}}{8\times10^{-6}\times100} = 1.25$ m.`, { unit: 'm' }),
  nat(3, 'pendulum clock', r`A brass pendulum clock ($\alpha = 1.9\times10^{-5}\ \mathrm{K^{-1}}$) is correct at $30\,^\circ$C. It is kept in a room at $15\,^\circ$C. How many seconds does it gain per day?`, () => 0.5 * 1.9e-5 * 15 * 86400, 0.1, 1,
    r`The rod shortens, so the period is less than 1 s per tick and the clock runs fast. Gain per day $=\tfrac12\alpha\Delta\theta\times86400 = 0.5\times1.9\times10^{-5}\times15\times86400 = 12.3$ s.`, { unit: 's' }),
  nat(3, 'calorimetry with steam', r`10 g of steam at $100\,^\circ$C is passed into 100 g of water at $20\,^\circ$C in an insulated vessel (negligible heat capacity). Find the final temperature (in $^\circ$C, 1 decimal). Use $L_v = 540\ \mathrm{cal\,g^{-1}}$.`, () => (10 * 540 + 10 * 100 + 100 * 20) / 110 - 0, 0.1, 1,
    r`Steam condenses (540 cal per g) and the condensed water cools from $100$ to $T$. Heat lost $= 10\times540 + 10(100 - T)$. Heat gained $= 100(T - 20)$. So $5400 + 1000 - 10T = 100T - 2000$, giving $T = 8400/110 = 76.4\,^\circ$C.`, { unit: '°C' }),
  nat(3, 'calorimetry with ice', r`100 g of ice at $-20\,^\circ$C is mixed with 200 g of water at $40\,^\circ$C. How many grams of ice remain unmelted at equilibrium? ($c_{ice} = 0.5$, $c_w = 1$ cal g$^{-1}$ $^\circ$C$^{-1}$; $L_f = 80$ cal g$^{-1}$)`, () => 100 - (200 * 40 - 100 * 0.5 * 20) / 80, 0.05, 1,
    r`Water cooling to $0\,^\circ$C releases $200\times40 = 8000$ cal. Warming the ice to $0\,^\circ$C needs $100\times0.5\times20 = 1000$ cal. Left over: 7000 cal, which melts $7000/80 = 87.5$ g. Since $87.5 < 100$, the final temperature is $0\,^\circ$C with $100 - 87.5 = 12.5$ g of ice remaining.`, { unit: 'g', trap: 'Check first whether all the ice can melt before using a mixing formula.' }),
  nat(3, 'heating curve', r`A 1 kW heater supplies all its energy to 1 kg of ice at $-10\,^\circ$C. How long (in s) until the water reaches $20\,^\circ$C? ($c_{ice} = 2100$, $c_w = 4200\ \mathrm{J\,kg^{-1}K^{-1}}$, $L_f = 3.36\times10^5\ \mathrm{J\,kg^{-1}}$)`, () => (1 * 2100 * 10 + 3.36e5 + 1 * 4200 * 20) / 1000, 0.5, 0,
    r`Total heat $= 2100\times10 + 336000 + 4200\times20 = 21000 + 336000 + 84000 = 441000$ J. Time $= 441000/1000 = 441$ s.`, { unit: 's' }),
  nat(3, 'conduction in series', r`A copper rod ($k = 400$, length 20 cm) and a steel rod ($k = 50$, length 30 cm), both of the same area, are joined end to end. The free end of copper is at $100\,^\circ$C and of steel at $0\,^\circ$C. Find the temperature of the joint (in $^\circ$C, 1 decimal).`, () => 100 - 100 * (0.2 / 400) / (0.2 / 400 + 0.3 / 50), 0.1, 1,
    r`Thermal resistance per unit area is $L/k$: copper $0.2/400 = 5\times10^{-4}$, steel $0.3/50 = 6\times10^{-3}$. The drop across copper is $100\times\dfrac{5\times10^{-4}}{6.5\times10^{-3}} = 7.7\,^\circ$C. So the joint is at $100 - 7.7 = 92.3\,^\circ$C.`, { unit: '°C' }),
  mcq(3, 'conduction in series', r`Two slabs of the same thickness and area, with conductivities $k$ and $3k$, are placed in series. The equivalent conductivity is`, r`$1.5k$`, [r`$2k$`, r`$4k$`, r`$0.75k$`],
    r`Resistances add: $\dfrac{2L}{k_{eq}} = \dfrac{L}{k} + \dfrac{L}{3k} = \dfrac{4L}{3k}$, so $k_{eq} = 1.5k$. (The parallel value would be $2k$.)`, { trap: 'Series: resistances add. Parallel: conductances add.' }),
  nat(3, 'growth of ice on ponds', r`The ice on a pond is 1 cm thick after 1 hour of freezing weather. Assuming steady conditions, how many more hours (integer) are needed for it to reach 2 cm?`, () => 3, 0, 0,
    r`Thickness $x$ obeys $t\propto x^2$ (the ice itself becomes an insulating layer). Time to 1 cm: 1 h. Time to 2 cm: $4$ h. Additional time $= 4 - 1 = 3$ h.`, { unit: 'h', trap: 'The question asks for the additional time, not the total.' }),
  nat(3, 'Stefan-Boltzmann law', r`A sphere's radius is doubled and its absolute temperature is halved. By what factor (decimal) does the power it radiates change?`, () => 4 / 16, 0, 2,
    r`$P\propto r^2T^4$. Factor $= 2^2\times(1/2)^4 = 4/16 = 0.25$.`, { unit: '' }),
  nat(3, 'Wien displacement law', r`Star A has its radiation peak at 400 nm and star B at 800 nm. Find the ratio $T_A/T_B$.`, () => 800 / 400, 0, 0,
    r`$\lambda_mT = b$, so $T\propto1/\lambda_m$. $T_A/T_B = 800/400 = 2$.`, { unit: '' }),
  nat(3, 'Newton\'s law of cooling', r`Hot water cools from $90\,^\circ$C to $60\,^\circ$C in 10 minutes in a room at $30\,^\circ$C. Use the exact exponential law and find how many further minutes it takes to cool from $60\,^\circ$C to $45\,^\circ$C.`, () => 10, 0, 0,
    r`$T - T_s = (T_0 - T_s)e^{-kt}$. Excess over the room: 60, then 30 after 10 min, so the excess halves in 10 min. From $60\,^\circ$C (excess 30) to $45\,^\circ$C (excess 15) is another halving: 10 min.`, { unit: 'min', trap: 'The cooling is exponential in the excess temperature, not linear in time.' }),
  nat(3, 'calorimetry', r`A calorimeter of water equivalent 20 g holds 180 g of water at $20\,^\circ$C. A 100 g metal ball at $100\,^\circ$C is dropped in and the final temperature is $30\,^\circ$C. Find the specific heat of the metal (in cal g$^{-1}$ $^\circ$C$^{-1}$, 3 decimals).`, () => (200 * 10) / (100 * 70), 0.003, 3,
    r`Total water-equivalent of the cold part $= 180 + 20 = 200$ g. Heat gained $= 200\times(30 - 20) = 2000$ cal. Heat lost by the ball $= 100\,c\,(100 - 30) = 7000c$. So $c = 2000/7000 = 0.286$.`, { unit: 'cal/g°C' }),
  mcq(3, 'thermal expansion', r`A steel tape is calibrated at $20\,^\circ$C. On a hot day at $40\,^\circ$C it is used to measure the length of a wooden table (wood hardly expands). The reading will be`, 'less than the true length', ['more than the true length', 'equal to the true length', 'more by $2\\alpha\\Delta T$ of the length'],
    r`The tape's scale lengthens, so each marked "centimetre" is slightly more than 1 cm. A fixed table therefore spans fewer marks than before: the reading is smaller than the true length.`, { trap: 'The reading is about the scale, not the object, expanding.' }),
  nat(3, 'area expansion', r`An aluminium plate has a circular hole of diameter 5.000 cm at $20\,^\circ$C. It is heated to $120\,^\circ$C ($\alpha = 2.3\times10^{-5}\ \mathrm{K^{-1}}$). Find the new diameter of the hole (in cm, 4 decimals).`, () => 5 * (1 + 2.3e-5 * 100), 0.0005, 4,
    r`$d' = d(1 + \alpha\Delta T) = 5.000\times(1 + 2.3\times10^{-3}) = 5.0115$ cm.`, { unit: 'cm' }),
  nat(3, 'temperature scales', r`A new temperature scale X has its ice point at $-10\,^\circ$X and its steam point at $140\,^\circ$X. What is the reading on this scale (in $^\circ$X) when a Celsius thermometer reads $40\,^\circ$C?`, () => -10 + 150 * 40 / 100, 0, 0,
    r`The interval is $150$ X-degrees for $100$ C-degrees. $X = -10 + \dfrac{150}{100}\times40 = -10 + 60 = 50\,^\circ$X.`, { unit: '°X' }),
  nat(3, 'Newton\'s law of cooling', r`A body cools from $80\,^\circ$C to $70\,^\circ$C in 5 minutes in surroundings at $30\,^\circ$C. Using the average-temperature form of Newton's law, find the time (in minutes, 2 decimals) to cool from $70\,^\circ$C to $60\,^\circ$C.`, () => 10 / (((80 - 70) / 5) / (75 - 30) * (65 - 30)), 0.05, 2,
    r`Rate $=\dfrac{\Delta T}{t} = k(T_{avg} - T_s)$. First interval: $\dfrac{10}{5} = k(75 - 30) = 45k$, so $k = 2/45$ per min. Second: $\dfrac{10}{t} = \dfrac{2}{45}(65 - 30) = \dfrac{70}{45}$, so $t = 450/70 = 6.43$ min.`, { unit: 'min', trap: 'Later cooling takes longer because the excess over the room is smaller.' }),
  nat(3, 'mechanical equivalent of heat', r`A lead bullet moving at $250\ \mathrm{m\,s^{-1}}$ stops in a wall and all its kinetic energy becomes heat inside the bullet. Find its temperature rise (in K). ($c_{lead} = 130\ \mathrm{J\,kg^{-1}K^{-1}}$; ignore melting.)`, () => 250 ** 2 / (2 * 130), 1, 0,
    r`$\tfrac12mv^2 = mc\Delta T$, so $\Delta T = \dfrac{v^2}{2c} = \dfrac{62500}{260} = 240$ K. The mass cancels.`, { unit: 'K', exams: ['jee-main', 'neet', 'keam', 'comedk'], sub: 'mixed' }),
  nat(3, 'latent heat', r`A 500 W heater melts ice at $0\,^\circ$C for 4 minutes, with no losses. Find the mass of ice melted (in kg, 3 decimals).`, () => 500 * 240 / 3.36e5, 0.003, 3,
    r`Heat $= Pt = 500\times240 = 1.2\times10^5$ J. $m = Q/L_f = 1.2\times10^5/3.36\times10^5 = 0.357$ kg.`, { unit: 'kg' }),
  nat(3, 'conduction in parallel', r`Two rods of equal length 0.5 m and equal area $1\times10^{-4}\ \mathrm{m^2}$ (copper, $k = 400$, and steel, $k = 50$) join the same two bodies at $100\,^\circ$C and $0\,^\circ$C. Find the total heat flow (in W).`, () => (400 + 50) * 1e-4 * 100 / 0.5, 0.05, 1,
    r`In parallel the heat flows add: $H = (k_1 + k_2)A\Delta T/L = 450\times10^{-4}\times100/0.5 = 9$ W.`, { unit: 'W' }),
  nat(3, 'latent heat', r`How much heat (in kJ) turns 1 kg of water at $20\,^\circ$C into steam at $100\,^\circ$C? ($c_w = 4200$, $L_v = 2.26\times10^6$ SI)`, () => (4200 * 80 + 2.26e6) / 1000, 0.5, 0,
    r`Heat the water: $1\times4200\times80 = 336000$ J. Boil it: $2.26\times10^6$ J. Total $= 2.596\times10^6$ J $= 2596$ kJ.`, { unit: 'kJ' }),
  mcq(3, 'Newton\'s law of cooling', r`Two solid spheres of the same material and surface finish have radii in the ratio $1:2$ and are at the same temperature in the same surroundings. The ratio of their initial rates of fall of temperature (small : large) is`, '2 : 1', ['1 : 2', '1 : 4', '4 : 1'],
    r`Rate of heat loss $\propto$ area $\propto r^2$. Heat capacity $\propto$ mass $\propto r^3$. So rate of temperature fall $\propto r^2/r^3 = 1/r$. Small : large $= 2:1$. Small objects cool faster.`),
  nat(3, 'specific heat', r`Equal masses of liquids P and Q are heated by identical heaters for the same time. P rises by $20\,^\circ$C and Q by $30\,^\circ$C. Find $c_P/c_Q$ (2 decimals).`, () => 30 / 20, 0.02, 2,
    r`The same heat $Q = mc\Delta T$ goes into each, with the same mass: $c\propto1/\Delta T$. $c_P/c_Q = 30/20 = 1.5$.`, { unit: '' }),
  nat(3, 'volume expansion', r`A solid has $\alpha = 1.5\times10^{-5}\ \mathrm{K^{-1}}$. By roughly what percentage (1 decimal) does its density decrease when it is heated by $200\,^\circ$C?`, () => (1 - 1 / (1 + 1.5e-5 * 200) ** 3) * 100, 0.05, 1,
    r`The volume grows by the factor $(1 + \alpha\Delta T)^3 = (1.003)^3 = 1.00902$. Density ratio $= 1/1.00902 = 0.99106$. The density falls by about $0.9\%$.`, { unit: '%' }),
  nat(3, 'expansion of liquids', r`A glass bulb of volume $1\ \mathrm{cm^3}$ is full of mercury and joined to a fine tube of cross-section $1\ \mathrm{mm^2}$. When heated by $50\,^\circ$C, by how many mm does the mercury rise in the tube? ($\gamma_{Hg} = 1.8\times10^{-4}$, $\alpha_{glass} = 9\times10^{-6}\ \mathrm{K^{-1}}$; neglect the tube volume.)`, () => 1000 * (1.8e-4 - 2.7e-5) * 50 / 1, 0.1, 2,
    r`Apparent expansion $= V(\gamma_l - \gamma_g)\Delta T = 1000\ \mathrm{mm^3}\times(1.8\times10^{-4} - 2.7\times10^{-5})\times50 = 7.65\ \mathrm{mm^3}$. Rise $= 7.65\ \mathrm{mm^3}/1\ \mathrm{mm^2} = 7.65$ mm.`, { unit: 'mm' }),
  nat(3, 'calorimetry', r`100 g, 200 g and 300 g of the same liquid at $10\,^\circ$C, $40\,^\circ$C and $80\,^\circ$C are mixed. Find the final temperature (in $^\circ$C).`, () => (100 * 10 + 200 * 40 + 300 * 80) / 600, 0, 0,
    r`With the same liquid, $T = \dfrac{\sum m_iT_i}{\sum m_i} = \dfrac{1000 + 8000 + 24000}{600} = 55\,^\circ$C.`, { unit: '°C' }),
  nat(3, 'calorimetry with steam and ice', r`1 g of steam at $100\,^\circ$C is mixed with 10 g of ice at $0\,^\circ$C. How many grams of ice remain at equilibrium? ($L_v = 540$, $L_f = 80$ cal g$^{-1}$, $c_w = 1$)`, () => 10 - (540 + 100) / 80, 0.05, 1,
    r`Steam can give at most $540 + 100 = 640$ cal (condensing, then cooling to $0\,^\circ$C). That melts $640/80 = 8$ g of ice. So the mixture ends at $0\,^\circ$C with $10 - 8 = 2$ g of ice left.`, { unit: 'g' }),
  nat(3, 'radiation', r`A person's skin (area $1.5\ \mathrm{m^2}$, emissivity 0.9) is at 306 K in a room at 293 K. Find the net radiated power (in W, nearest whole number). $\sigma = 5.67\times10^{-8}$ SI.`, () => 0.9 * SIG * 1.5 * (306 ** 4 - 293 ** 4), 3, 0,
    r`$P_{net} = e\sigma A(T^4 - T_0^4)$. $306^4 = 8.768\times10^9$ and $293^4 = 7.370\times10^9$, difference $1.398\times10^9$. $P = 0.9\times5.67\times10^{-8}\times1.5\times1.398\times10^9 = 107$ W.`, { unit: 'W', trap: 'Use the difference of fourth powers, not the fourth power of the difference.' }),
  nat(3, 'thermal expansion', r`A metal rod 1 m long is heated by $100\,^\circ$C and its length increases by 1.2 mm. Find $\alpha$ (in units of $10^{-6}\ \mathrm{K^{-1}}$).`, () => 1.2e-3 / (1 * 100) * 1e6, 0.05, 0,
    r`$\alpha = \dfrac{\Delta L}{L\Delta T} = \dfrac{1.2\times10^{-3}}{1\times100} = 1.2\times10^{-5} = 12\times10^{-6}\ \mathrm{K^{-1}}$.`, { unit: '×10⁻⁶ /K' }),
);

items.push(
  // ---------- Level 4 ----------
  nat(4, 'radiation', r`The Sun's radiation intensity at the Earth ($d = 1.5\times10^{11}$ m) is $1400\ \mathrm{W\,m^{-2}}$. The Sun's radius is $7\times10^8$ m. Treating it as a black body, find its surface temperature (in K, nearest 10 K). $\sigma = 5.67\times10^{-8}$ SI.`, () => (1400 * (1.5e11) ** 2 / (SIG * (7e8) ** 2)) ** 0.25, 20, 0,
    r`Power leaving the Sun $= 4\pi d^2\times1400 = \sigma\,4\pi R^2T^4$. So $T^4 = \dfrac{1400}{\sigma}\left(\dfrac dR\right)^2$ with $d/R = 214.3$, so $(d/R)^2 = 45918$. $T^4 = \dfrac{1400\times45918}{5.67\times10^{-8}} = 1.1338\times10^{15}$. $T = 5803$ K, about 5800 K.`, { unit: 'K', sub: 'Stefan-Boltzmann law' }),
  nat(4, 'thermal stress', r`A steel wire of cross-section $1\ \mathrm{cm^2}$ is stretched tight between rigid supports at $40\,^\circ$C. It is cooled to $0\,^\circ$C. ($Y = 2\times10^{11}$ Pa, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$.) Find the tension that develops (in N).`, () => 2e11 * 1e-4 * 1.2e-5 * 40, 5, 0,
    r`The wire tries to shorten by strain $\alpha\Delta T$ but cannot. $F = YA\alpha\Delta T = 2\times10^{11}\times10^{-4}\times1.2\times10^{-5}\times40 = 9600$ N.`, { unit: 'N', trap: '$1\\ \\mathrm{cm^2} = 10^{-4}\\ \\mathrm{m^2}$.' }),
  nat(4, 'rotation and expansion', r`A uniform disc rotates freely about its axis. It is heated so that its radius increases by a fraction $\alpha\Delta T$ with $\alpha\Delta T = 1.1\times10^{-3}$. By what percentage (2 decimals) does its angular speed decrease? (Use the exact ratio.)`, () => (1 - 1 / (1 + 1.1e-3) ** 2) * 100, 0.01, 2,
    r`No external torque, so $L = I\omega$ is constant. $I\propto R^2$, so $\omega'/\omega = I/I' = 1/(1 + 1.1\times10^{-3})^2 = 0.99780$. The decrease is $0.22\%$.`, { unit: '%', sub: 'mixed' }),
  nat(4, 'Newton\'s law of cooling', r`A body cools from $70\,^\circ$C to $60\,^\circ$C in 4 minutes in a room at $20\,^\circ$C. Using the exact exponential law, find the time (in min, 2 decimals) it needs to cool from $60\,^\circ$C to $50\,^\circ$C.`, () => 4 * Math.log(40 / 30) / Math.log(50 / 40), 0.05, 2,
    r`Excess: 50, 40, 30. $e^{-4k} = 40/50$, so $k = \tfrac14\ln1.25 = 0.05579\ \mathrm{min^{-1}}$. Next: $e^{-kt} = 30/40$, so $t = \ln(4/3)/k = 0.28768/0.05579 = 5.16$ min.`, { unit: 'min' }),
  nat(4, 'expansion of liquids', r`A glass vessel of volume $1000\ \mathrm{cm^3}$ contains some mercury. On heating, the volume of the empty space above the mercury stays constant. ($\gamma_{Hg} = 1.8\times10^{-4}$, $\alpha_{glass} = 9\times10^{-6}\ \mathrm{K^{-1}}$.) Find the volume of mercury (in $\mathrm{cm^3}$).`, () => 1000 * 3 * 9e-6 / 1.8e-4, 0.5, 0,
    r`Empty volume $=V_v - V_l$ stays fixed if both grow by the same amount: $V_v\gamma_v\Delta T = V_l\gamma_l\Delta T$. $V_l = 1000\times\dfrac{2.7\times10^{-5}}{1.8\times10^{-4}} = 150\ \mathrm{cm^3}$.`, { unit: 'cm³' }),
  nat(4, 'floating and expansion', r`A cube floats in a liquid with half its volume submerged at $20\,^\circ$C. The liquid has $\gamma_l = 1.2\times10^{-3}\ \mathrm{K^{-1}}$ and the cube $\gamma_s = 3\times10^{-5}\ \mathrm{K^{-1}}$. What fraction (3 decimals) of its volume is submerged at $70\,^\circ$C?`, () => 0.5 * (1 + 1.2e-3 * 50) / (1 + 3e-5 * 50), 0.002, 3,
    r`Fraction submerged $f = \rho_s/\rho_l$. $\rho_l' = \rho_l/(1 + \gamma_l\Delta T)$ and $\rho_s' = \rho_s/(1 + \gamma_s\Delta T)$. So $f' = f\dfrac{1 + \gamma_l\Delta T}{1 + \gamma_s\Delta T} = 0.5\times\dfrac{1.06}{1.0015} = 0.529$. The liquid is less dense when hot, so the cube sinks deeper.`, { unit: '', sub: 'mixed' }),
  nat(4, 'mechanical equivalent of heat', r`Water falls through 420 m at the foot of a waterfall and all the kinetic energy becomes heat in the water. Find the rise in temperature (in $^\circ$C, 2 decimals). ($c = 4200$, $g = 9.8$ SI)`, () => 9.8 * 420 / 4200, 0.01, 2,
    r`$mgh = mc\Delta T$, so $\Delta T = gh/c = 9.8\times420/4200 = 0.98\,^\circ$C.`, { unit: '°C', sub: 'mixed' }),
  nat(4, 'conduction', r`A refrigerator box has walls of total area $2\ \mathrm{m^2}$, thickness 5 cm and $k = 0.04\ \mathrm{W\,m^{-1}K^{-1}}$. Inside is at $0\,^\circ$C and outside at $30\,^\circ$C. How many kg of ice (to 1 decimal) would the heat leaking in a day melt? ($L_f = 3.36\times10^5$)`, () => 0.04 * 2 * 30 / 0.05 * 86400 / 3.36e5, 0.1, 1,
    r`$H = kA\Delta T/L = 0.04\times2\times30/0.05 = 48$ W. In a day: $48\times86400 = 4.147\times10^6$ J. Ice melted $= 4.147\times10^6/3.36\times10^5 = 12.3$ kg.`, { unit: 'kg' }),
  nat(4, 'specific heat', r`The specific heat of a solid varies as $c = (2 + 0.01T)\ \mathrm{J\,g^{-1}K^{-1}}$ with $T$ in kelvin. Find the heat (in J) needed to raise 10 g of it from 100 K to 300 K.`, () => 10 * (2 * 200 + 0.005 * (300 ** 2 - 100 ** 2)), 1, 0,
    r`$Q = m\int c\,dT = 10\int_{100}^{300}(2 + 0.01T)dT = 10\left[2T + 0.005T^2\right]_{100}^{300} = 10\,(400 + 0.005\times80000) = 10\times800 = 8000$ J.`, { unit: 'J' }),
  nat(4, 'conduction in series and parallel', r`Each of three identical rods has length 0.1 m, area $1\times10^{-4}\ \mathrm{m^2}$. Two (conductivity 200 each) are side by side (parallel) and joined in series to a third of conductivity 100. The free ends are at $100\,^\circ$C and $0\,^\circ$C. Find the heat flow (in W).`, () => 100 / (0.1 / (400 * 1e-4) + 0.1 / (100 * 1e-4)), 0.05, 1,
    r`Parallel pair: $R_p = \dfrac{L}{(k_1 + k_2)A} = \dfrac{0.1}{400\times10^{-4}} = 2.5\ \mathrm{K\,W^{-1}}$. Third rod: $R_3 = \dfrac{0.1}{100\times10^{-4}} = 10$. Total $R = 12.5$. $H = 100/12.5 = 8$ W.`, { unit: 'W' }),
  nat(4, 'radiation', r`A filament radiates 60 W at 2400 K. Its emissivity is 0.35. Find its surface area (in $\mathrm{mm^2}$, 1 decimal). Surroundings may be ignored. $\sigma = 5.67\times10^{-8}$ SI.`, () => 60 / (0.35 * SIG * 2400 ** 4) * 1e6, 0.5, 1,
    r`$A = \dfrac{P}{e\sigma T^4} = \dfrac{60}{0.35\times5.67\times10^{-8}\times3.3178\times10^{13}} = \dfrac{60}{6.584\times10^{5}} = 9.11\times10^{-5}\ \mathrm{m^2} = 91.1\ \mathrm{mm^2}$.`, { unit: 'mm²' }),
  nat(4, 'radiation', r`Earth absorbs 70% of the sunlight (albedo 0.3) with solar constant $S = 1361\ \mathrm{W\,m^{-2}}$ and radiates as a black body from its whole surface. Find its equilibrium temperature (in K, nearest whole number). $\sigma = 5.67\times10^{-8}$ SI.`, () => (1361 * 0.7 / (4 * SIG)) ** 0.25, 2, 0,
    r`The Earth intercepts $S\pi R^2$ but radiates over $4\pi R^2$. Balance: $0.7S\pi R^2 = 4\pi R^2\sigma T^4$, so $T^4 = \dfrac{0.7\times1361}{4\times5.67\times10^{-8}} = 4.20\times10^{9}$ and $T = 255$ K ($-18\,^\circ$C).`, { unit: 'K', sub: 'Stefan-Boltzmann law' }),
  nat(4, 'Newton\'s law of cooling', r`A copper sphere of radius 1 cm ($\rho = 8900\ \mathrm{kg\,m^{-3}}$, $c = 390\ \mathrm{J\,kg^{-1}K^{-1}}$), perfectly black, is at 400 K in a vacuum chamber whose walls are at a very low temperature. Find its initial rate of cooling (in K s$^{-1}$, 3 decimals). $\sigma = 5.67\times10^{-8}$ SI.`, () => 3 * SIG * 400 ** 4 / (8900 * 0.01 * 390), 0.002, 3,
    r`$mc\dfrac{dT}{dt} = -\sigma(4\pi r^2)T^4$ with $m = \tfrac43\pi r^3\rho$. So $\dfrac{dT}{dt} = \dfrac{3\sigma T^4}{\rho rc} = \dfrac{3\times5.67\times10^{-8}\times2.56\times10^{10}}{8900\times0.01\times390} = \dfrac{4355}{34710} = 0.125\ \mathrm{K\,s^{-1}}$.`, { unit: 'K/s' }),
  nat(4, 'growth of ice on ponds', r`Ice on a lake is 5 cm thick and the air above is at $-10\,^\circ$C (lake water at $0\,^\circ$C). Find the rate at which the thickness grows (in mm per hour, 2 decimals). For ice $k = 2.2\ \mathrm{W\,m^{-1}K^{-1}}$, $\rho = 900\ \mathrm{kg\,m^{-3}}$, $L_f = 3.36\times10^5\ \mathrm{J\,kg^{-1}}$.`, () => 2.2 * 10 / (900 * 3.36e5 * 0.05) * 3600 * 1000, 0.05, 2,
    r`Heat conducted up through the ice freezes new ice below: $kA\dfrac{\Delta T}{x} = \rho AL_f\dfrac{dx}{dt}$. $\dfrac{dx}{dt} = \dfrac{k\Delta T}{\rho L_fx} = \dfrac{2.2\times10}{900\times3.36\times10^5\times0.05} = 1.455\times10^{-6}\ \mathrm{m\,s^{-1}} = 5.24\ \mathrm{mm\,h^{-1}}$.`, { unit: 'mm/h' }),
  nat(4, 'pendulum clock', r`A pendulum clock ($\alpha = 2.0\times10^{-5}\ \mathrm{K^{-1}}$) is correct at $20\,^\circ$C. It spends 12 hours of every day at $10\,^\circ$C and 12 hours at $40\,^\circ$C. By how many seconds does it lose per day (2 decimals)?`, () => 0.5 * 2e-5 * (20 * 43200 - 10 * 43200), 0.05, 2,
    r`Fractional error in the rate is $\tfrac12\alpha(\theta - 20)$ (positive loss when hot). At $10\,^\circ$C: gain $= \tfrac12\alpha\times10\times43200$. At $40\,^\circ$C: loss $= \tfrac12\alpha\times20\times43200$. Net loss $= \tfrac12\times2\times10^{-5}\times(20 - 10)\times43200 = 4.32$ s.`, { unit: 's' }),
  nat(4, 'steady-state conduction', r`The two ends of a rod of length 2 m are kept at $20\,^\circ$C and $120\,^\circ$C, so the temperature varies linearly along it. ($\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$ and the rod was 2 m at $20\,^\circ$C.) Find the elongation (in mm, 2 decimals).`, () => 1.2e-5 * 2 * 50 * 1000, 0.02, 2,
    r`A slice $dx$ at distance $x$ has temperature rise $\Delta\theta(x) = 100x/L$. $\Delta L = \int\alpha\,\Delta\theta\,dx = \alpha L\times\overline{\Delta\theta} = 1.2\times10^{-5}\times2\times50 = 1.2\times10^{-3}$ m $= 1.20$ mm.`, { unit: 'mm' }),
  nat(4, 'conduction and latent heat', r`A copper rod joins a steam chamber (steam condensing at $100\,^\circ$C) to an ice bath (ice melting at $0\,^\circ$C), and the heat flow is steady and lossless. Find the ratio of the mass of ice melted to the mass of steam condensed in the same time (2 decimals). ($L_v = 2.26\times10^6$, $L_f = 3.36\times10^5$ J kg$^{-1}$)`, () => 2.26e6 / 3.36e5, 0.05, 2,
    r`Heat released by the steam = heat conducted = heat absorbed by the ice. $m_sL_v = m_iL_f$, so $m_i/m_s = L_v/L_f = 2.26\times10^6/3.36\times10^5 = 6.73$.`, { unit: '' }),
  nat(4, 'radiation', r`A hot body at 600 K stands in a room at 300 K. Find the ratio of its net radiation loss in this room to its net loss if the room were at (almost) 0 K (3 decimals).`, () => (600 ** 4 - 300 ** 4) / 600 ** 4, 0.002, 3,
    r`$P_{net}\propto T^4 - T_0^4$. Ratio $= \dfrac{600^4 - 300^4}{600^4} = 1 - \dfrac1{16} = 0.9375\approx0.938$. The surroundings reduce the loss by only 6%.`, { unit: '', trap: 'The room radiates back, so the net loss is less than the loss into a cold room.' }),
  nat(4, 'calorimetry', r`An electric heater of 1.5 kW is placed in 2 kg of water at $20\,^\circ$C inside a calorimeter of water equivalent 0.2 kg. It also loses 100 W to the surroundings, constantly. How long (in s, nearest whole number) does it take to reach $60\,^\circ$C?`, () => (2.2 * 4200 * 40) / (1500 - 100), 3, 0,
    r`Net power $= 1500 - 100 = 1400$ W. Heat needed $= (2 + 0.2)\times4200\times40 = 369600$ J. $t = 369600/1400 = 264$ s.`, { unit: 's' }),
  nat(4, 'Wien displacement law', r`A star's radiation peaks at 600 nm and another star's at 400 nm. The first star has 3 times the radius of the second. Find the ratio of the power radiated by the first to that by the second (2 decimals).`, () => 9 * (400 / 600) ** 4, 0.02, 2,
    r`$P\propto R^2T^4$ and $T\propto1/\lambda_m$. Ratio $= 3^2\times(400/600)^4 = 9\times\dfrac{16}{81} = 1.78$.`, { unit: '', sub: 'Wien displacement law' }),
  nat(4, 'calorimetry', r`A 100 g piece of ice at $-10\,^\circ$C absorbs 10 000 cal. ($c_{ice} = 0.5$, $c_w = 1$ cal g$^{-1}$ $^\circ$C$^{-1}$, $L_f = 80$ cal g$^{-1}$.) Find its final temperature (in $^\circ$C, 1 decimal).`, () => (10000 - 500 - 8000) / 100, 0.1, 1,
    r`Warm the ice to $0\,^\circ$C: 500 cal. Melt it all: 8000 cal. Total 8500 cal. Remaining $10000 - 8500 = 1500$ cal heats 100 g of water: $\Delta T = 1500/100 = 15\,^\circ$C. Final $15.0\,^\circ$C.`, { unit: '°C' }),
  nat(4, 'expansion of solids', r`A steel ball of radius 5.00 cm is heated by $200\,^\circ$C ($\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$). Find the increase in its volume (in $\mathrm{cm^3}$, 2 decimals), using the small-change formula $\gamma = 3\alpha$.`, () => 4 / 3 * PI * 125 * 3 * 1.2e-5 * 200, 0.05, 2,
    r`$V = \tfrac43\pi(5)^3 = 523.6\ \mathrm{cm^3}$. $\Delta V = V\gamma\Delta T = 523.6\times3.6\times10^{-5}\times200 = 3.77\ \mathrm{cm^3}$.`, { unit: 'cm³' }),
);

items.push(
  // ---------- Level 5 ----------
  nat(5, 'conduction through a cylinder', r`A steam pipe has inner radius 1 cm and outer radius 2 cm, $k = 0.5\ \mathrm{W\,m^{-1}K^{-1}}$, length 10 m. The inner surface is at $100\,^\circ$C and the outer at $0\,^\circ$C. Find the radial heat flow (in W, nearest whole number).`, () => 2 * PI * 0.5 * 10 * 100 / Math.log(2), 5, 0,
    r`Radial heat flow in a shell: $H = -kA\dfrac{dT}{dr}$ with $A = 2\pi rL$ varying. $H\dfrac{dr}{r} = -2\pi kL\,dT$. Integrating: $H\ln\dfrac{r_2}{r_1} = 2\pi kL\,\Delta T$, so $H = \dfrac{2\pi kL\Delta T}{\ln(r_2/r_1)} = \dfrac{2\pi\times0.5\times10\times100}{0.6931} = 4532$ W.`, { unit: 'W', trap: 'The area changes with radius, so you cannot use $kA\\Delta T/L$ directly.' }),
  nat(5, 'conduction through a sphere', r`A hollow spherical shell has inner radius 0.10 m and outer radius 0.20 m, $k = 0.5\ \mathrm{W\,m^{-1}K^{-1}}$. The inner surface is at $60\,^\circ$C above the outer surface. Find the heat flow (in W, 1 decimal).`, () => 4 * PI * 0.5 * 60 * 0.1 * 0.2 / (0.2 - 0.1), 0.2, 1,
    r`$H = -k\,4\pi r^2\dfrac{dT}{dr}$ gives $H\int\dfrac{dr}{r^2} = 4\pi k\Delta T$, so $H\left(\dfrac1{r_1} - \dfrac1{r_2}\right) = 4\pi k\Delta T$ and $H = \dfrac{4\pi k\Delta T\,r_1r_2}{r_2 - r_1} = \dfrac{4\pi\times0.5\times60\times0.02}{0.10} = 75.4$ W.`, { unit: 'W' }),
  nat(5, 'conduction with variable conductivity', r`The conductivity of a rod varies with temperature as $k = k_0(1 + \beta\theta)$ with $k_0 = 100\ \mathrm{W\,m^{-1}K^{-1}}$ and $\beta = 0.002\,{}^\circ\mathrm{C}^{-1}$ ($\theta$ in $^\circ$C). The rod has $A = 10^{-4}\ \mathrm{m^2}$, $L = 0.5$ m, with ends at $100\,^\circ$C and $0\,^\circ$C. Find the steady heat flow (in W, 2 decimals).`, () => 1e-4 * 100 * (100 + 0.002 * 100 ** 2 / 2) / 0.5, 0.02, 2,
    r`Steady flow: $H = -kA\dfrac{d\theta}{dx}$ is constant. So $H\int_0^Ldx = A\int_0^{100}k_0(1 + \beta\theta)d\theta$. $HL = Ak_0\left[100 + \beta\dfrac{100^2}{2}\right] = 10^{-4}\times100\times(100 + 10) = 1.1$. $H = 1.1/0.5 = 2.20$ W.`, { unit: 'W' }),
  nat(5, 'conduction through layered cylinder', r`A hot pipe is lagged with two layers. Layer 1 spans $r = 1$ to 2 cm with $k_1 = 0.1\ \mathrm{W\,m^{-1}K^{-1}}$ and layer 2 spans $r = 2$ to 4 cm with $k_2 = 0.2$. The inner surface is $100\,^\circ$C above the outer surface. Find the heat loss per metre of pipe (in W, 1 decimal).`, () => 2 * PI * 100 / (Math.log(2) / 0.1 + Math.log(2) / 0.2), 0.3, 1,
    r`Each cylindrical layer has resistance $\dfrac{\ln(r_{out}/r_{in})}{2\pi kL}$, and the two add in series. Per metre: $R = \dfrac{1}{2\pi}\left(\dfrac{\ln2}{0.1} + \dfrac{\ln2}{0.2}\right) = \dfrac{6.931 + 3.466}{2\pi}$. $H = \Delta T/R = \dfrac{2\pi\times100}{10.397} = 60.4$ W.`, { unit: 'W/m' }),
  nat(5, 'growth of ice on ponds', r`On a pond the air temperature is $-10\,^\circ$C. Ice takes a time $t_1$ to grow from 0 to 1 cm. The air then drops to $-20\,^\circ$C. Find $t_2/t_1$ (decimal), where $t_2$ is the time to grow from 1 cm to 2 cm at the new temperature.`, () => ((4 - 1) / 20) / (1 / 10), 0.01, 2,
    r`$x\,dx = \dfrac{k\Delta T}{\rho L_f}dt$, so $t = \dfrac{\rho L_f(x_2^2 - x_1^2)}{2k\Delta T}$. First: $t_1\propto\dfrac{1^2 - 0}{10} = 0.1$. Second: $t_2\propto\dfrac{2^2 - 1^2}{20} = 0.15$. $t_2/t_1 = 1.5$.`, { unit: '' }),
  nat(5, 'thermal stress in compound rods', r`A steel rod and a copper rod, each 0.5 m long and of the same cross-section, are placed end to end between two rigid walls just touching them at $20\,^\circ$C. The temperature is raised by $100\,^\circ$C. ($\alpha_s = 1.2\times10^{-5}$, $\alpha_c = 1.7\times10^{-5}\ \mathrm{K^{-1}}$; $Y_s = 2.0\times10^{11}$, $Y_c = 1.1\times10^{11}$ Pa.) Find the stress in the rods (in MPa, nearest whole number).`, () => (0.5 * (1.2e-5 + 1.7e-5) * 100) / (0.5 * (1 / 2e11 + 1 / 1.1e11)) / 1e6, 2, 0,
    r`Free expansion would be $0.5\times(1.2 + 1.7)\times10^{-5}\times100 = 1.45$ mm in total. The walls stop this, so the rods compress by the same total. With the same force $F$ (same area): $\dfrac{FL}{AY_s} + \dfrac{FL}{AY_c} = 1.45\times10^{-3}$. $\sigma = \dfrac{1.45\times10^{-3}}{0.5\,(5\times10^{-12} + 9.09\times10^{-12})} = 2.06\times10^{8}$ Pa $= 206$ MPa.`, { unit: 'MPa', trap: 'Different materials, so the strains differ. The forces are equal, not the strains.' }),
  nat(5, 'expansion of liquid columns', r`In a U-tube the left column is at $0\,^\circ$C and the right column at $100\,^\circ$C. The liquid has $\gamma = 1.8\times10^{-4}\ \mathrm{K^{-1}}$ and the cold column stands 76.0 cm above the common level of the junction. Ignore expansion of the tube. Find the difference in height of the two columns (in cm, 2 decimals).`, () => 76 * 1.8e-4 * 100, 0.02, 2,
    r`Pressure at the base must be the same: $\rho_0g\,h_0 = \rho_{100}g\,h_{100}$. $\rho_{100} = \rho_0/(1 + \gamma\Delta T)$, so $h_{100} = h_0(1 + \gamma\Delta T) = 76\times1.018 = 77.37$ cm. The difference is $76\times1.8\times10^{-4}\times100 = 1.37$ cm. (This is how Regnault measured $\gamma$ of mercury.)`, { unit: 'cm', sub: 'expansion of liquids' }),
  nat(5, 'bimetallic strip', r`A bimetallic strip is made of two metals each of thickness $t = 0.5$ mm with $\alpha_1 = 1.2\times10^{-5}$ and $\alpha_2 = 2.0\times10^{-5}\ \mathrm{K^{-1}}$ and equal Young's moduli. Using the standard thin-strip result $\kappa = \dfrac{3\,\Delta\alpha\,\Delta T}{4t}$ for curvature $\kappa = 1/R$, find the radius of curvature (in m, 2 decimals) for $\Delta T = 100\,^\circ$C.`, () => 4 * 0.5e-3 / (3 * 8e-6 * 100), 0.01, 2,
    r`$\kappa = \dfrac{3\Delta\alpha\Delta T}{4t} = \dfrac{3\times8\times10^{-6}\times100}{4\times0.5\times10^{-3}} = 1.2\ \mathrm{m^{-1}}$. $R = 1/\kappa = 0.83$ m. (The simple line model, which puts the centre-lines $t$ apart, would give $t/(\Delta\alpha\Delta T) = 0.625$ m. The better model includes the stiffness of the strips.)`, { unit: 'm', trap: 'The result depends on the model: here the formula is given.' }),
  nat(5, 'Stefan-Boltzmann law', r`A thin black plate in space faces the Sun on one side only (intensity $1400\ \mathrm{W\,m^{-2}}$, perpendicular) and radiates from both faces. Find its equilibrium temperature (in K, nearest whole number). $\sigma = 5.67\times10^{-8}$ SI.`, () => (1400 / (2 * SIG)) ** 0.25, 2, 0,
    r`Absorbed per unit area $= 1400$ W. Emitted per unit area of plate $= 2\sigma T^4$ (two faces). $T^4 = \dfrac{1400}{2\times5.67\times10^{-8}} = 1.2346\times10^{10}$, $T = 333$ K.`, { unit: 'K' }),
  nat(5, 'cooling with latent heat', r`A 100 W heater is switched on under a flask of 0.5 kg of ice at $0\,^\circ$C inside a perfect insulator, and the heat flow also includes a 20 W leak from the room into the mixture (so 120 W in total). How long (in minutes, 1 decimal) does it take to melt the ice? ($L_f = 3.36\times10^5$)`, () => 0.5 * 3.36e5 / 120 / 60, 0.1, 1,
    r`Total power $= 100 + 20 = 120$ W. $t = mL_f/P = 0.5\times3.36\times10^5/120 = 1400$ s $= 23.3$ min.`, { unit: 'min', sub: 'latent heat' }),
  nat(5, 'conduction', r`A slab has two parts in parallel of equal area, one of thickness $L$ and conductivity $2k$ and the other of thickness $L$ and conductivity $k$. Each is in series with a layer of thickness $L$ and conductivity $k$ that spans the full face (area $2A$ in total). Heat flows steadily from $100\,^\circ$C to $0\,^\circ$C across the whole slab, each part has area $A$. Find the temperature (in $^\circ$C, 1 decimal) at the interface between the full layer and the parallel pair (the full layer is on the hot side).`, () => 100 - 100 * (1 / (1 * 2)) / (1 / 2 + 1 / 3), 0.2, 1,
    r`Use resistances in units of $L/(kA)$. Full layer: area $2A$, so $R_1 = \dfrac{L}{k\,2A} = 0.5$. Parallel pair: conductances $2k\cdot A/L + kA/L = 3kA/L$, so $R_2 = 1/3$. The drop across layer 1 is $100\times\dfrac{0.5}{0.5 + 0.333} = 60\,^\circ$C. Interface at $100 - 60 = 40\,^\circ$C.`, { unit: '°C' }),
);

// ---------- Multiple correct (JEE Advanced style) ----------
items.push(
  msq(3, 'heat transfer', r`Which of the following statements about heat transfer are correct?`,
    ['Conduction needs a material medium', 'Convection can occur in a solid', 'Radiation can pass through a vacuum', 'Convection is heat transfer by bulk motion of a fluid'], [0, 2, 3],
    r`Conduction needs matter; radiation does not. Convection means the fluid itself moves, carrying heat, so it cannot happen in a rigid solid. (B is false.)`),
  msq(4, 'thermal expansion', r`A uniform metal plate with a circular hole is heated evenly. Which of the following increase?`,
    ['The area of the hole', 'The diameter of the hole', 'The volume of the plate', 'The mass of the plate'], [0, 1, 2],
    r`Every dimension, including the hole, scales by $(1 + \alpha\Delta T)$. The volume of the plate (with its hole) grows too. The mass is unchanged. Density falls.`, { trap: 'The hole grows; it is not filled in.' }),
  msq(4, 'black body radiation', r`The temperature of a black body is raised from 300 K to 600 K. Which statements are true?`,
    ['The total power radiated becomes 16 times', 'The wavelength of peak emission becomes half', 'The wavelength of peak emission becomes double', 'The emission increases at every wavelength'], [0, 1, 3],
    r`$P\propto T^4$ gives $2^4 = 16$. $\lambda_m\propto1/T$ halves. A hotter body radiates more at every wavelength (the Planck curves do not cross).`),
  msq(4, 'anomalous expansion of water', r`Which statements about water near its freezing point are correct?`,
    ['Water at 4 °C is denser than water at 0 °C', 'Between 0 °C and 4 °C its volume decreases as the temperature rises', 'In a frozen lake the water at the bottom is at about 4 °C', 'Ice at 0 °C is denser than water at 0 °C'], [0, 1, 2],
    r`Maximum density is at 4 °C, so heating from 0 to 4 °C shrinks it. The coldest water (lighter) rises, so ice forms on top while the bottom stays near 4 °C. Ice floats, so it is less dense than water.`),
  msq(5, 'conduction in series', r`Two rods of the same length and cross-section, with $k_1 > k_2$, are joined end to end with their free ends at different fixed temperatures. In the steady state,`,
    ['the same heat flows per second through both rods', 'the temperature drop is the same across both rods', 'the rod with the smaller conductivity has the larger temperature drop', 'the joint is at the average of the end temperatures'], [0, 2],
    r`Steady state means the same heat current in both: $k_1\Delta T_1 = k_2\Delta T_2$ (equal $A$, $L$). So $\Delta T_2 > \Delta T_1$. The joint is at the average only if $k_1 = k_2$.`),
  msq(3, 'Newton\'s law of cooling', r`A cooling body obeys Newton's law of cooling. Which statements are correct?`,
    ['It applies for a small temperature difference', 'Its rate of cooling decreases as it cools', 'Its temperature falls linearly with time', 'The excess temperature falls exponentially with time'], [0, 1, 3],
    r`$\dfrac{dT}{dt} = -k(T - T_s)$ gives $T - T_s = (T_0 - T_s)e^{-kt}$: exponential, slowing down as the excess shrinks. The fall is not linear.`),
  msq(5, 'pendulum clock', r`A pendulum clock with a brass rod is correct at $20\,^\circ$C. Which statements are correct?`,
    ['It gains time at $5\\,^\\circ$C', 'It loses time at $35\\,^\\circ$C', 'The time lost depends on the mass of the bob', 'Using an invar rod (very small $\\alpha$) reduces the error'], [0, 1, 3],
    r`Cold: shorter pendulum, shorter period, clock runs fast. Hot: loses. Fractional change in period is $\tfrac12\alpha\Delta\theta$ and does not involve the mass. Invar has a tiny $\alpha$.`),
  msq(4, 'expansion of liquids', r`A liquid with $\gamma_l$ fills a glass vessel whose volume coefficient is $\gamma_g$. When both are heated,`,
    ['the level rises if $\\gamma_l > \\gamma_g$', 'the level stays unchanged if $\\gamma_l = \\gamma_g$', 'the apparent coefficient is $\\gamma_l - \\gamma_g$', 'the level always rises'], [0, 1, 2],
    r`The apparent expansion is the real expansion of the liquid minus that of the vessel. If this is positive, the level rises; if zero it stays; if negative it falls. Water between $0$ and $4\,^\circ$C is an example of a falling level for suitable vessels.`),
  msq(3, 'latent heat', r`Which of the following are correct?`,
    ['During boiling at fixed pressure, the temperature stays constant', 'Latent heat of vaporisation of water is greater than its latent heat of fusion', 'The specific heat of ice is greater than that of water', 'Heat absorbed during melting raises the temperature'], [0, 1],
    r`Boiling and melting happen at constant temperature. $L_v = 2260$ kJ/kg and $L_f = 336$ kJ/kg. Ice has $c = 2100$, water $4200$ J kg$^{-1}$K$^{-1}$, so C is false. D is false, as the heat is latent.`),
  msq(5, 'radiation', r`Which statements about thermal radiation are correct?`,
    ['A good absorber at a wavelength is a good emitter at that wavelength', 'A perfect reflector is a poor emitter', 'The emissivity of an ideal black body is 1', 'The Sun at 5800 K emits only visible light'], [0, 1, 2],
    r`Kirchhoff's law links absorptivity and emissivity: $a_\lambda = e_\lambda$. A perfect reflector has $a = 0$, so $e = 0$. The solar spectrum extends from ultraviolet to infrared, so D is false.`),
);

// ---------- Assertion / Reason ----------
items.push(
  asrt(2, 'anomalous expansion of water', r`In cold countries a lake freezes from the surface downward.`, r`Water has its maximum density at $4\,^\circ$C.`, 0,
    r`As the surface cools to $4\,^\circ$C, the denser water sinks and mixes. Below $4\,^\circ$C, the colder water is less dense and stays on top, so it freezes there. R explains A.`),
  asrt(3, 'conduction', r`On a winter morning an iron rod feels colder than a wooden stick at the same temperature.`, r`Iron has a higher specific heat than wood.`, 2,
    r`A is true because iron's much greater conductivity draws heat from the hand quickly. R is false: wood has the larger specific heat (about 1700 J kg$^{-1}$K$^{-1}$ against 450 for iron). The right reason is conductivity.`),
  asrt(2, 'latent heat', r`Steam at $100\,^\circ$C scalds more severely than boiling water at $100\,^\circ$C.`, r`Steam is at a higher temperature than boiling water.`, 2,
    r`A is true: steam releases latent heat on condensing. R is false: both are at the same temperature, $100\,^\circ$C.`),
  asrt(3, 'latent heat', r`The temperature of ice at $0\,^\circ$C does not change while it melts, even though heat is being supplied.`, r`Heat flows only from a body at higher temperature to a body at lower temperature.`, 1,
    r`A is true (latent heat). R is also a true statement, but it does not explain A. The explanation is that the energy goes into overcoming molecular bonds rather than raising kinetic energy.`),
  asrt(3, 'Stefan-Boltzmann law', r`When the temperature of a black body is doubled, its radiated power increases by a factor 16.`, r`A body at higher temperature has more internal energy.`, 1,
    r`A is true by $P\propto T^4$. R is also true, but it is not the reason for the factor of 16. The reason is the fourth-power law.`),
  asrt(3, 'bimetallic strip', r`A bimetallic strip bends when its temperature changes.`, r`The two metals have different coefficients of linear expansion.`, 0,
    r`Unequal expansion of two bonded layers forces the strip into an arc. R is the correct explanation.`),
  asrt(2, 'specific heat', r`Water is used as a coolant in car radiators.`, r`Water has a very low specific heat capacity.`, 2,
    r`A is true. R is false: water has one of the highest specific heats among common liquids, so it carries away a lot of heat for a small rise in temperature.`),
  asrt(2, 'latent heat', r`Ice at $0\,^\circ$C cools a drink more effectively than the same mass of water at $0\,^\circ$C.`, r`Ice absorbs the latent heat of fusion as it melts.`, 0,
    r`Water at $0\,^\circ$C can only warm up, absorbing $c\Delta T$ per kg. Ice absorbs 336 kJ per kg first, then warms as water. R explains A.`),
  asrt(4, 'boiling', r`The boiling point of a liquid rises when the pressure above it is increased.`, r`A liquid boils when its saturated vapour pressure equals the external pressure.`, 0,
    r`Higher external pressure needs a higher temperature for the vapour pressure to match it. A pressure cooker uses this. R explains A.`),
  asrt(4, 'conduction', r`When a metal rod is heated at one end, after a long time every part of the rod reaches the same temperature.`, r`In the steady state each section absorbs as much heat as it passes on.`, 3,
    r`A is false: in the steady state the temperature still falls steadily from the hot end to the far end (a constant gradient). It is the temperature of each point that stops changing with time, not the temperature difference along the rod. R is a true description of the steady state.`),
  asrt(4, 'thermal expansion', r`The coefficient of volume expansion of an ideal gas at constant pressure is different for different gases.`, r`All ideal gases follow $V\propto T$ at constant pressure.`, 3,
    r`A is false: $\gamma_p = 1/T$ (about $1/273$ per K at $0\,^\circ$C) for every ideal gas. R is true (Charles' law) and is the reason they all have the same value.`),
);

// ---------- Statement I / Statement II ----------
items.push(
  stm(2, 'heat capacity', r`The thermal capacity of a body depends on its mass.`, r`The specific heat of a substance does not depend on its mass.`, 0,
    r`Heat capacity $C = mc$ grows with mass; $c$ is a property of the material. Both true.`),
  stm(3, 'heat and temperature', r`Heat flows from a body at higher temperature to one at lower temperature.`, r`Heat always flows from a body with more internal energy to one with less.`, 2,
    r`I is true. II is false: a big block of cool water has more internal energy than a hot spark, yet heat flows from the spark to the water. The direction is set by temperature, not by total energy.`),
  stm(3, 'area expansion', r`The coefficient of area expansion of a solid is twice its coefficient of linear expansion.`, r`The area of a square plate varies as the square of its side.`, 0,
    r`$A = L^2$ gives $\Delta A/A\approx2\Delta L/L$, hence $\beta = 2\alpha$. Both true (for small $\alpha\Delta T$).`),
  stm(3, 'Newton\'s law of cooling', r`In Newton's law of cooling a body reaches the temperature of its surroundings after a finite time.`, r`The rate of cooling decreases as the temperature difference falls.`, 3,
    r`I is false: $T - T_s = (T_0 - T_s)e^{-kt}$ approaches zero only as $t\to\infty$. II is true.`),
  stm(4, 'boiling', r`The boiling point of water increases with pressure.`, r`Food cooks faster in a pressure cooker.`, 0,
    r`Both true. The higher pressure raises the boiling point (about $120\,^\circ$C), and food cooks faster at the higher temperature.`),
  stm(4, 'radiation', r`Two bodies at the same temperature always radiate equal power.`, r`The power radiated by a body depends only on its temperature.`, 1,
    r`Power $= e\sigma AT^4$: it also depends on the surface area and the emissivity. Both statements are false.`),
  stm(3, 'specific heat', r`Raising 1 kg of ice by $1\,^\circ$C needs about half the heat needed for 1 kg of water.`, r`The specific heat of ice is about twice that of water.`, 2,
    r`I is true ($2100$ against $4200$ J kg$^{-1}$K$^{-1}$). II is false: it is the other way round.`),
  stm(5, 'pendulum clock', r`The fractional time lost by a pendulum clock when the temperature rises does not depend on the length of its pendulum.`, r`The fractional change in the period is $\tfrac12\alpha\Delta\theta$.`, 0,
    r`$T = 2\pi\sqrt{L/g}$, $L' = L(1 + \alpha\Delta\theta)$, so $\Delta T/T = \tfrac12\alpha\Delta\theta$ and the length cancels. Both true.`),
  stc(3, 'thermal expansion', r`Consider: (i) a bimetallic strip bends towards the side of the metal with the smaller $\alpha$ when heated; (ii) $\alpha$ of a solid is exactly the same at all temperatures; (iii) the coefficient of area expansion is about $2\alpha$; (iv) gases expand much more than solids for the same temperature rise. How many are correct?`,
    '3', ['1', '2', '4'],
    r`(i) True: the longer outer arc is the high-$\alpha$ metal, so the strip curves towards the low-$\alpha$ side. (ii) False: $\alpha$ varies a little with temperature. (iii) True. (iv) True: gases $\gamma\approx1/273\approx3.7\times10^{-3}$, solids about $10^{-5}$ to $10^{-4}$. Three are correct.`, { trap: 'Statement (ii) sounds harmless, but $\\alpha$ is only nearly constant.' }),
  stc(4, 'heat and temperature', r`Consider: (i) heat is a property that a body possesses; (ii) the degree on the Fahrenheit scale is the same size as the kelvin; (iii) the latent heat of fusion of ice is about 80 cal per gram; (iv) a body at $0\,^\circ$C has no thermal energy. How many are correct?`,
    '1', ['2', '3', '0'],
    r`(i) False: heat is energy in transit, not a possession. (ii) False: $1\,\mathrm K = 1.8\,^\circ\mathrm F$. (iii) True. (iv) False: the energy is zero only at 0 K. Only (iii) is correct.`),
);

// ---------- Match the following ----------
const groups = {
  m1: { title: 'Laws of heat transfer',
    list1: ['A. Stefan\'s law', 'B. Wien\'s displacement law', 'C. Newton\'s law of cooling', 'D. Fourier\'s law of conduction'],
    list2: [r`p. $P = \sigma AT^4$`, r`q. $\lambda_mT = \text{constant}$`, r`r. $dT/dt\propto-(T - T_s)$`, r`s. $H = -kA\,dT/dx$`] },
  m2: { title: 'Quantities and units',
    list1: ['A. Specific heat capacity', 'B. Latent heat', 'C. Thermal conductivity', 'D. Stefan\'s constant'],
    list2: [r`p. $\mathrm{W\,m^{-1}\,K^{-1}}$`, r`q. $\mathrm{J\,kg^{-1}}$`, r`r. $\mathrm{W\,m^{-2}\,K^{-4}}$`, r`s. $\mathrm{J\,kg^{-1}\,K^{-1}}$`] },
  m3: { title: 'Expansion coefficients',
    list1: ['A. Coefficient of linear expansion', 'B. Coefficient of area expansion', 'C. Coefficient of volume expansion of a solid', 'D. Coefficient of apparent expansion of a liquid'],
    list2: [r`p. $\Delta V/(V\Delta T)$ of the solid`, r`q. $\gamma_{liquid} - \gamma_{vessel}$`, r`r. $\Delta L/(L\Delta T)$`, r`s. $\Delta A/(A\Delta T)$`] },
  m4: { title: 'Mixing and the final state',
    list1: ['A. 50 g ice at 0 °C into 100 g water at 80 °C', 'B. 200 g ice at 0 °C into 100 g water at 80 °C', 'C. 10 g steam at 100 °C into 100 g water at 0 °C', 'D. 100 g water at 40 °C with 100 g water at 60 °C'],
    list2: ['p. Final temperature 0 °C, ice remains', 'q. Final temperature about 26.7 °C', 'r. Final temperature 50 °C', 's. Final temperature about 58.2 °C'] },
  p1: { title: 'Heating a block of ice',
    passage: r`<p>A 200 g block of ice at $-20\,^\circ$C is heated by a 400 W heater, and all the heat goes into the sample. Use $c_{ice} = 2100$, $c_w = 4200\ \mathrm{J\,kg^{-1}K^{-1}}$ and $L_f = 3.36\times10^5\ \mathrm{J\,kg^{-1}}$.</p>` },
  p2: { title: 'A wall of brick and foam',
    passage: r`<p>A wall of area $10\ \mathrm{m^2}$ has a brick layer 0.20 m thick ($k = 0.8\ \mathrm{W\,m^{-1}K^{-1}}$) on the inside and a foam layer 0.05 m thick ($k = 0.04$) on the outside. The inside surface is at $20\,^\circ$C and the outside at $-10\,^\circ$C. Assume steady conditions.</p>` },
  p3: { title: 'A cooling kettle',
    passage: r`<p>Water in a kettle cools from $90\,^\circ$C to $70\,^\circ$C in 8 minutes in a room at $30\,^\circ$C. Assume Newton's law of cooling holds exactly: $T - T_s = (T_0 - T_s)e^{-kt}$.</p>` },
};

items.push(
  mat(2, 'laws of heat transfer', 'm1', r`Match each law in List I with its expression or statement in List II.`,
    'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-s, C-p, D-q'],
    r`Stefan: $P = \sigma AT^4$ (p). Wien: $\lambda_mT$ constant (q). Newton: rate of cooling proportional to the excess temperature (r). Fourier: $H = -kA\,dT/dx$ (s).`),
  mat(2, 'units', 'm2', r`Match each quantity in List I with its SI unit in List II.`,
    'A-s, B-q, C-p, D-r', ['A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p', 'A-p, B-q, C-s, D-r'],
    r`Specific heat: $Q/(m\Delta T)$, J kg$^{-1}$K$^{-1}$ (s). Latent heat: $Q/m$, J kg$^{-1}$ (q). Conductivity: W m$^{-1}$K$^{-1}$ (p). Stefan's constant: W m$^{-2}$K$^{-4}$ (r).`),
  mat(3, 'expansion coefficients', 'm3', r`Match each coefficient in List I with its definition or relation in List II.`,
    'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'],
    r`$\alpha = \Delta L/(L\Delta T)$ (r). $\beta = \Delta A/(A\Delta T)\approx2\alpha$ (s). $\gamma = \Delta V/(V\Delta T)\approx3\alpha$ (p). Apparent expansion of a liquid in a vessel is $\gamma_l - \gamma_v$ (q).`),
  mat(4, 'calorimetry', 'm4', r`Match each mixing situation in List I with its outcome in List II. (Insulated vessel, $L_f = 80$ cal g$^{-1}$, $L_v = 540$ cal g$^{-1}$.)`,
    'A-q, B-p, C-s, D-r', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-r, B-p, C-s, D-q'],
    r`A: water gives $100\times80 = 8000$ cal, melting 50 g needs 4000. The rest, 4000 cal, warms $150$ g: $T = 26.7\,^\circ$C (q). B: 8000 cal melts only 100 g of the 200 g, so $0\,^\circ$C with ice left (p). C: $5400 + 10(100 - T) = 100T$, $T = 58.2\,^\circ$C (s). D: equal masses of water give the average, $50\,^\circ$C (r).`),
);

items.push(
  pas(2, 'heating curve', 'p1', r`How long (in s) does the ice take to reach $0\,^\circ$C?`, () => 0.2 * 2100 * 20 / 400, 0, 0,
    r`$Q = 0.2\times2100\times20 = 8400$ J. $t = 8400/400 = 21$ s.`, { unit: 's' }),
  pas(3, 'heating curve', 'p1', r`At what time (in s, from the start) has the last of the ice just melted?`, () => (0.2 * 2100 * 20 + 0.2 * 3.36e5) / 400, 0, 0,
    r`Add the melting heat: $0.2\times3.36\times10^5 = 67200$ J. Total $= 8400 + 67200 = 75600$ J. $t = 75600/400 = 189$ s.`, { unit: 's' }),
  pas(4, 'heating curve', 'p1', r`At what time (in s, from the start) does the water reach $50\,^\circ$C?`, () => (0.2 * 2100 * 20 + 0.2 * 3.36e5 + 0.2 * 4200 * 50) / 400, 0, 0,
    r`Total heat $= 8400 + 67200 + 0.2\times4200\times50 = 8400 + 67200 + 42000 = 117600$ J. $t = 117600/400 = 294$ s.`, { unit: 's' }),
  pas(2, 'conduction in series', 'p2', r`Find the rate of heat flow through the wall (in W).`, () => 30 / (0.2 / (0.8 * 10) + 0.05 / (0.04 * 10)), 0, 0,
    r`Resistances: brick $\dfrac{0.2}{0.8\times10} = 0.025$, foam $\dfrac{0.05}{0.04\times10} = 0.125$ K W$^{-1}$. Total $0.15$. $H = 30/0.15 = 200$ W.`, { unit: 'W' }),
  pas(3, 'conduction in series', 'p2', r`Find the temperature (in $^\circ$C) at the interface between brick and foam.`, () => 20 - 200 * 0.025, 0, 0,
    r`Drop across brick $= HR = 200\times0.025 = 5$ K. The brick is on the inside (at $20\,^\circ$C), so the interface is at $20 - 5 = 15\,^\circ$C. The foam takes the remaining $25$ K.`, { unit: '°C' }),
  pas(4, 'conduction in series', 'p2', r`The foam layer is made twice as thick. Find the new heat flow (in W, 1 decimal).`, () => 30 / (0.025 + 0.25), 0.2, 1,
    r`New foam resistance $= 0.10/(0.04\times10) = 0.25$. Total $R = 0.275$. $H = 30/0.275 = 109.1$ W. Doubling the insulation cuts the loss by 45%, not 50%, because the brick remains.`, { unit: 'W', trap: 'Only part of the total resistance doubles.' }),
  pas(3, 'Newton\'s law of cooling', 'p3', r`Find the cooling constant $k$ (in $\mathrm{min^{-1}}$, 4 decimals).`, () => Math.log(60 / 40) / 8, 0.0005, 4,
    r`Excess falls from 60 to 40 in 8 min: $e^{-8k} = 40/60$, so $k = \ln1.5/8 = 0.4055/8 = 0.0507\ \mathrm{min^{-1}}$.`, { unit: '/min' }),
  pas(4, 'Newton\'s law of cooling', 'p3', r`How long (in min, 2 decimals) does the water take to cool from $70\,^\circ$C to $50\,^\circ$C?`, () => Math.log(40 / 20) / (Math.log(1.5) / 8), 0.1, 2,
    r`Excess: 40 to 20, a halving. $t = \ln2/k = 0.6931/0.05068 = 13.68$ min.`, { unit: 'min' }),
  pas(4, 'Newton\'s law of cooling', 'p3', r`What is the temperature (in $^\circ$C, 1 decimal) of the water 20 minutes after it was at $90\,^\circ$C?`, () => 30 + 60 * Math.exp(-Math.log(1.5) / 8 * 20), 0.2, 1,
    r`$T = 30 + 60e^{-kt} = 30 + 60e^{-1.0137} = 30 + 60\times0.3629 = 51.8\,^\circ$C.`, { unit: '°C' }),
);

// ---------- Number templates ----------
const an = (w) => (/^[aeiou]/i.test(w) ? 'An ' : 'A ') + w;
const TT = (a, dp) => +Math.max(Math.abs(a) * 0.01, 0.6 * 10 ** -dp).toPrecision(1);
const MET = [['steel', 12], ['copper', 17], ['aluminium', 23], ['brass', 19], ['iron', 12], ['glass', 9]];
const mk = (id, level, sub, make, verify) => ({ id, type: 'nat', level, exams: EX[level], sub, make, verify });
const out = (v, q, ans, dp, unit, sol, extra = {}) => ({ v, q, answer: R(ans, dp), tol: TT(ans, dp), unit, sol, ...extra });

const gens = [
  mk('tp-g01', 1, 'temperature scales', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const C = pick(rng, -20, 120, 5); return out(v, r`Convert ${C} $^\circ$C to the Fahrenheit scale (in $^\circ$F, 1 decimal).`, 1.8 * C + 32, 1, '°F', r`$F = \tfrac95C + 32 = 1.8\times${C} + 32 = ${R(1.8 * C + 32, 1)}\,^\circ$F.`, { C }); }
    if (v === 1) { const F = pick(rng, 14, 212, 6); return out(v, r`A temperature is ${F} $^\circ$F. Express it in $^\circ$C (1 decimal).`, (F - 32) / 1.8, 1, '°C', r`$C = \tfrac59(F - 32) = \tfrac59\times(${F} - 32) = ${R((F - 32) / 1.8, 1)}\,^\circ$C.`, { F }); }
    if (v === 2) { const a = pick(rng, 0, 20, 5); const n = pick(rng, 80, 160, 20); const C = pick(rng, 10, 90, 10); const x = a + n * C / 100;
      return out(v, r`A new scale reads ${a} at the ice point and ${a + n} at the steam point. Find the true temperature in $^\circ$C when it reads ${R(x, 1)}.`, C, 0, '°C', r`The fundamental interval has ${n} divisions for 100 $^\circ$C. $C = \dfrac{${R(x, 1)} - ${a}}{${n}}\times100 = ${C}\,^\circ$C.`, { a, n, x }); }
    const K = pick(rng, 250, 400, 10); return out(v, r`Convert ${K} K to the Fahrenheit scale (in $^\circ$F, 1 decimal).`, 1.8 * (K - 273.15) + 32, 1, '°F', r`$C = ${K} - 273.15 = ${R(K - 273.15, 2)}$, then $F = 1.8C + 32 = ${R(1.8 * (K - 273.15) + 32, 1)}\,^\circ$F.`, { K });
  }, (p) => (p.v === 0 ? p.C * 9 / 5 + 32 : p.v === 1 ? (p.F - 32) * 5 / 9 : p.v === 2 ? (p.x - p.a) / p.n * 100 : (p.K - 273.15) * 9 / 5 + 32)),

  mk('tp-g02', 2, 'linear expansion', (rng) => {
    const v = int(rng, 0, 3); const [name, a] = choose(rng, MET); const L = pick(rng, 1, 20, 1); const dT = pick(rng, 20, 200, 10);
    if (v === 0) return out(v, r`${an(name)} rod of length ${L} m ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$) is heated by ${dT} $^\circ$C. Find the increase in length (in mm, 2 decimals).`, L * a * 1e-6 * dT * 1000, 2, 'mm', r`$\Delta L = L\alpha\Delta T = ${L}\times${a}\times10^{-6}\times${dT} = ${R(L * a * 1e-6 * dT * 1000, 2)}$ mm.`, { L, a, dT });
    if (v === 1) return out(v, r`${an(name)} wire is ${L} m long at $20\,^\circ$C ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$). Find its length at ${20 + dT} $^\circ$C (in m, 4 decimals).`, L * (1 + a * 1e-6 * dT), 4, 'm', r`$L' = L(1 + \alpha\Delta T) = ${L}\times(1 + ${a}\times10^{-6}\times${dT}) = ${R(L * (1 + a * 1e-6 * dT), 4)}$ m.`, { L, a, dT }, );
    if (v === 2) { const dL = R(L * a * 1e-6 * dT * 1000, 2); return out(v, r`${an(name)} rod ${L} m long ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$) lengthens by ${dL} mm. Find the rise in temperature (in $^\circ$C).`, dL / 1000 / (L * a * 1e-6), 0, '°C', r`$\Delta T = \dfrac{\Delta L}{L\alpha} = \dfrac{${dL}\times10^{-3}}{${L}\times${a}\times10^{-6}} = ${R(dL / 1000 / (L * a * 1e-6), 0)}\,^\circ$C.`, { L, a, dL }); }
    const dL = R(L * a * 1e-6 * dT * 1000, 2); return out(v, r`A rod ${L} m long lengthens by ${dL} mm when heated by ${dT} $^\circ$C. Find $\alpha$ (in units of $10^{-6}\ \mathrm{K^{-1}}$).`, dL / 1000 / (L * dT) * 1e6, 1, '×10⁻⁶ /K', r`$\alpha = \dfrac{\Delta L}{L\Delta T} = \dfrac{${dL}\times10^{-3}}{${L}\times${dT}} = ${R(dL / 1000 / (L * dT) * 1e6, 1)}\times10^{-6}\ \mathrm{K^{-1}}$.`, { L, dT, dL });
  }, (p) => (p.v === 0 ? p.L * p.a * 1e-6 * p.dT * 1000 : p.v === 1 ? p.L * (1 + p.a * 1e-6 * p.dT) : p.v === 2 ? p.dL / (p.L * p.a * 1e-3) : p.dL / (p.L * p.dT) * 1e3)),

  mk('tp-g03', 2, 'area and volume expansion', (rng) => {
    const v = int(rng, 0, 3); const [name, a] = choose(rng, MET); const dT = pick(rng, 50, 300, 50);
    if (v === 0) { const A = pick(rng, 100, 900, 100); return out(v, r`${an(name)} plate has area ${A} $\mathrm{cm^2}$ at $20\,^\circ$C ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$). Find the increase in area when it is heated by ${dT} $^\circ$C (in $\mathrm{cm^2}$, 2 decimals).`, 2 * a * 1e-6 * dT * A, 2, 'cm²', r`$\Delta A = 2\alpha A\Delta T = 2\times${a}\times10^{-6}\times${A}\times${dT} = ${R(2 * a * 1e-6 * dT * A, 2)}\ \mathrm{cm^2}$.`, { a, A, dT }); }
    if (v === 1) { const s = pick(rng, 2, 10, 1); return out(v, r`${an(name)} cube of edge ${s} cm ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$) is heated by ${dT} $^\circ$C. Find the increase in its volume (in $\mathrm{mm^3}$, nearest whole number).`, 3 * a * 1e-6 * dT * s ** 3 * 1000, 0, 'mm³', r`$V = ${s ** 3}\ \mathrm{cm^3}$. $\Delta V = 3\alpha V\Delta T = 3\times${a}\times10^{-6}\times${s ** 3}\times${dT} = ${R(3 * a * 1e-6 * dT * s ** 3, 4)}\ \mathrm{cm^3} = ${R(3 * a * 1e-6 * dT * s ** 3 * 1000, 0)}\ \mathrm{mm^3}$.`, { a, s, dT }); }
    if (v === 2) return out(v, r`${an(name)} sheet ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$) is heated by ${dT} $^\circ$C. By what percentage does its area increase (3 decimals)?`, 2 * a * 1e-6 * dT * 100, 3, '%', r`$\dfrac{\Delta A}{A} = 2\alpha\Delta T = 2\times${a}\times10^{-6}\times${dT} = ${R(2 * a * 1e-6 * dT, 5)}$, which is $${R(2 * a * 1e-6 * dT * 100, 3)}\%$.`, { a, dT });
    const d = pick(rng, 2, 10, 1); return out(v, r`${an(name)} plate has a circular hole of diameter ${d}.000 cm at $20\,^\circ$C ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$). Find the diameter at ${20 + dT} $^\circ$C (in cm, 4 decimals).`, d * (1 + a * 1e-6 * dT), 4, 'cm', r`The hole grows like the metal: $d' = d(1 + \alpha\Delta T) = ${d}\times(1 + ${a}\times10^{-6}\times${dT}) = ${R(d * (1 + a * 1e-6 * dT), 4)}$ cm.`, { a, d, dT });
  }, (p) => (p.v === 0 ? p.A * (1 + p.a * 1e-6 * p.dT) ** 2 - p.A : p.v === 1 ? ((1 + p.a * 1e-6 * p.dT) ** 3 - 1) * p.s ** 3 * 1000 : p.v === 2 ? ((1 + p.a * 1e-6 * p.dT) ** 2 - 1) * 100 : p.d * (1 + p.a * 1e-6 * p.dT))),

  mk('tp-g04', 3, 'pendulum clock', (rng) => {
    const v = int(rng, 0, 2); const [name, a] = choose(rng, [['steel', 12], ['brass', 19], ['aluminium', 23]]); const t0 = pick(rng, 15, 30, 5);
    if (v === 0) { const t1 = t0 + pick(rng, 10, 30, 5); const s = 0.5 * a * 1e-6 * (t1 - t0) * 86400; return out(v, r`A pendulum clock with a ${name} rod ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$) is correct at ${t0} $^\circ$C. How many seconds does it lose per day at ${t1} $^\circ$C (1 decimal)?`, s, 1, 's', r`$\Delta T_p/T_p = \tfrac12\alpha\Delta\theta$, so the loss per day $= \tfrac12\times${a}\times10^{-6}\times${t1 - t0}\times86400 = ${R(s, 1)}$ s.`, { a, t0, t1 }); }
    if (v === 1) { const t1 = t0 - pick(rng, 5, 15, 5); const s = 0.5 * a * 1e-6 * (t0 - t1) * 86400; return out(v, r`A pendulum clock with a ${name} rod ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$) is correct at ${t0} $^\circ$C. How many seconds does it gain per day at ${t1} $^\circ$C (1 decimal)?`, s, 1, 's', r`The rod shortens, so the clock runs fast. Gain per day $= \tfrac12\alpha\Delta\theta\times86400 = \tfrac12\times${a}\times10^{-6}\times${t0 - t1}\times86400 = ${R(s, 1)}$ s.`, { a, t0, t1 }); }
    const dT = pick(rng, 10, 40, 10); const s = R(0.5 * a * 1e-6 * dT * 86400, 1); return out(v, r`A clock with a ${name} pendulum rod ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$) loses ${s} s per day when the temperature changes by what amount from the setting temperature? (in $^\circ$C)`, s / (0.5 * a * 1e-6 * 86400), 0, '°C', r`$\Delta\theta = \dfrac{2\times\text{loss}}{\alpha\times86400} = \dfrac{2\times${s}}{${a}\times10^{-6}\times86400} = ${R(s / (0.5 * a * 1e-6 * 86400), 0)}\,^\circ$C.`, { a, s });
  }, (p) => (p.v === 2 ? p.s * 2 / (p.a * 1e-6 * 86400) : 0.5 * p.a * 1e-6 * Math.abs(p.t1 - p.t0) * 86400)),

  mk('tp-g05', 3, 'compound rods and bimetal', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const a1 = pick(rng, 10, 20, 2); const a2 = a1 + pick(rng, 4, 10, 2); const L1 = pick(rng, 20, 60, 10); const L2 = L1 * a1 / a2;
      return out(v, r`Two rods of coefficients $${a1}\times10^{-6}$ and $${a2}\times10^{-6}\ \mathrm{K^{-1}}$ must keep a constant length difference at all temperatures. The first rod is ${L1} cm long. Find the length of the second (in cm, 2 decimals).`, L2, 2, 'cm', r`Equal expansion needs $L_1\alpha_1 = L_2\alpha_2$. $L_2 = L_1\alpha_1/\alpha_2 = ${L1}\times${a1}/${a2} = ${R(L2, 2)}$ cm.`, { a1, a2, L1 }); }
    if (v === 1) { const a1 = pick(rng, 10, 15, 1); const a2 = a1 + pick(rng, 5, 12, 1); const d = pick(rng, 0.5, 2, 0.5); const dT = pick(rng, 50, 150, 25); const Rr = d * 1e-3 / ((a2 - a1) * 1e-6 * dT);
      return out(v, r`Two thin strips with $\alpha_1 = ${a1}\times10^{-6}$ and $\alpha_2 = ${a2}\times10^{-6}\ \mathrm{K^{-1}}$ are joined, with their centre-lines ${d} mm apart. Using $R = d/[(\alpha_2 - \alpha_1)\Delta T]$, find the radius of curvature (in m, 2 decimals) after heating by ${dT} $^\circ$C.`, Rr, 2, 'm', r`$R = \dfrac{d}{(\alpha_2 - \alpha_1)\Delta T} = \dfrac{${d}\times10^{-3}}{${a2 - a1}\times10^{-6}\times${dT}} = ${R(Rr, 2)}$ m.`, { a1, a2, d, dT }); }
    const a1 = pick(rng, 10, 15, 1); const k2 = choose(rng, [1.5, 2, 3]); const a2 = a1 * k2; const D = pick(rng, 6, 30, 6); const L1 = D / (k2 - 1) * 1; // longer rod is the one with smaller alpha
    const Ls = D / (k2 - 1); return out(v, r`A rod of $\alpha = ${R(a2, 1)}\times10^{-6}$ and a rod of $\alpha = ${a1}\times10^{-6}\ \mathrm{K^{-1}}$ differ in length by ${D} cm at every temperature. Find the length of the longer rod (in cm).`, Ls * k2, 1, 'cm', r`The difference stays constant when both expand equally: $L_s\alpha_{big} = L_l\alpha_{small}$. So $L_l/L_s = ${k2}$ and $L_l - L_s = ${D}$ gives $L_s = ${R(Ls, 2)}$ and $L_l = ${R(Ls * k2, 2)}$ cm.`, { k2, D, L1 });
  }, (p) => (p.v === 0 ? p.L1 * p.a1 / p.a2 : p.v === 1 ? p.d * 1e-3 / ((p.a2 - p.a1) * 1e-6 * p.dT) : p.D * p.k2 / (p.k2 - 1))),

  mk('tp-g06', 3, 'expansion of liquids', (rng) => {
    const v = int(rng, 0, 2); const [ln, g] = choose(rng, [['mercury', 180], ['glycerine', 490], ['alcohol', 1100], ['water (room temperature)', 210]]); const ag = pick(rng, 6, 12, 3);
    if (v === 0) return out(v, r`A liquid ($\gamma = ${g}\times10^{-6}\ \mathrm{K^{-1}}$) is in a glass vessel ($\alpha = ${ag}\times10^{-6}\ \mathrm{K^{-1}}$). Find the coefficient of apparent expansion (in units of $10^{-6}\ \mathrm{K^{-1}}$).`, g - 3 * ag, 0, '×10⁻⁶ /K', r`$\gamma_{app} = \gamma_l - 3\alpha_g = ${g} - ${3 * ag} = ${g - 3 * ag}$ (in $10^{-6}\ \mathrm{K^{-1}}$).`, { g, ag });
    const V = pick(rng, 100, 500, 100); const dT = pick(rng, 20, 60, 10);
    if (v === 1) { const ov = V * (g - 3 * ag) * 1e-6 * dT; return out(v, r`A glass flask of volume ${V} $\mathrm{cm^3}$ is filled to the brim with ${ln} ($\gamma = ${g}\times10^{-6}\ \mathrm{K^{-1}}$, flask $\alpha = ${ag}\times10^{-6}\ \mathrm{K^{-1}}$) and heated by ${dT} $^\circ$C. How much overflows (in $\mathrm{cm^3}$, 3 decimals)?`, ov, 3, 'cm³', r`The overflow is the apparent expansion: $V(\gamma_l - 3\alpha_g)\Delta T = ${V}\times(${g} - ${3 * ag})\times10^{-6}\times${dT} = ${R(ov, 3)}\ \mathrm{cm^3}$.`, { V, g, ag, dT }); }
    const rho = pick(rng, 800, 1300, 100); const rho2 = rho / (1 + g * 1e-6 * dT * 10); return out(v, r`A liquid has density ${rho} $\mathrm{kg\,m^{-3}}$ at $20\,^\circ$C and $\gamma = ${g}\times10^{-6}\ \mathrm{K^{-1}}$. Find its density after heating by ${dT * 10} $^\circ$C (in $\mathrm{kg\,m^{-3}}$, 1 decimal).`, rho2, 1, 'kg/m³', r`$\rho' = \dfrac{\rho}{1 + \gamma\Delta T} = \dfrac{${rho}}{1 + ${g}\times10^{-6}\times${dT * 10}} = ${R(rho2, 1)}\ \mathrm{kg\,m^{-3}}$.`, { rho, g, dT });
  }, (p) => (p.v === 0 ? p.g - 3 * p.ag : p.v === 1 ? p.V * (p.g - 3 * p.ag) * 1e-6 * p.dT : p.rho / (1 + p.g * 1e-6 * p.dT * 10))),

  mk('tp-g07', 3, 'thermal stress', (rng) => {
    const v = int(rng, 0, 2); const [name, a, Y] = choose(rng, [['steel', 12, 200], ['copper', 17, 120], ['aluminium', 23, 70], ['brass', 19, 100]]); const dT = pick(rng, 20, 100, 10);
    if (v === 0) return out(v, r`${an(name)} rod ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$, $Y = ${Y}$ GPa) is fixed rigidly at both ends and heated by ${dT} $^\circ$C. Find the compressive stress (in MPa, 1 decimal).`, Y * 1e3 * a * 1e-6 * dT, 1, 'MPa', r`$\sigma = Y\alpha\Delta T = ${Y}\times10^{9}\times${a}\times10^{-6}\times${dT} = ${R(Y * 1e3 * a * 1e-6 * dT, 1)}$ MPa.`, { a, Y, dT });
    if (v === 1) { const A = pick(rng, 1, 5, 1); return out(v, r`${an(name)} bar of cross-section ${A} $\mathrm{cm^2}$ ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$, $Y = ${Y}$ GPa) is held between rigid walls and cooled by ${dT} $^\circ$C. Find the tension (in kN, 2 decimals).`, Y * 1e9 * A * 1e-4 * a * 1e-6 * dT / 1000, 2, 'kN', r`$F = YA\alpha\Delta T = ${Y}\times10^9\times${A}\times10^{-4}\times${a}\times10^{-6}\times${dT} = ${R(Y * 1e9 * A * 1e-4 * a * 1e-6 * dT / 1000, 2)}$ kN.`, { a, Y, A, dT }); }
    const L = pick(rng, 5, 20, 5); const gap = pick(rng, 1, 5, 1); const dTc = gap * 1e-3 / (L * a * 1e-6); return out(v, r`Two ${name} rails each ${L} m long ($\alpha = ${a}\times10^{-6}\ \mathrm{K^{-1}}$) are laid end to end with a total gap of ${gap} mm between the pair at the joint. By how many degrees must the temperature rise for the gap to just close? (1 decimal)`, gap * 1e-3 / (2 * L * a * 1e-6), 1, '°C', r`Both rails expand: total length $2L$ grows by $2L\alpha\Delta T$. Set this equal to ${gap} mm: $\Delta T = \dfrac{${gap}\times10^{-3}}{2\times${L}\times${a}\times10^{-6}} = ${R(gap * 1e-3 / (2 * L * a * 1e-6), 1)}\,^\circ$C.`, { a, L, gap });
  }, (p) => (p.v === 0 ? p.Y * p.a * p.dT / 1000 : p.v === 1 ? p.Y * p.A * p.a * p.dT / 10000 : p.gap * 1e-3 / (2 * p.L * p.a * 1e-6))),
];

gens.push(
  mk('tp-g08', 2, 'calorimetry', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const m1 = pick(rng, 100, 500, 50); const m2 = pick(rng, 100, 500, 50); const t1 = pick(rng, 50, 90, 10); const t2 = pick(rng, 10, 40, 10); const T = (m1 * t1 + m2 * t2) / (m1 + m2);
      return out(v, r`${m1} g of water at ${t1} $^\circ$C is mixed with ${m2} g of water at ${t2} $^\circ$C in an insulated vessel. Find the final temperature (in $^\circ$C, 1 decimal).`, T, 1, '°C', r`$m_1(t_1 - T) = m_2(T - t_2)$ gives $T = \dfrac{${m1}\times${t1} + ${m2}\times${t2}}{${m1 + m2}} = ${R(T, 1)}\,^\circ$C.`, { m1, m2, t1, t2 }); }
    if (v === 1) { const m2 = pick(rng, 200, 800, 100); const t2 = pick(rng, 10, 30, 10); const t1 = 100; const T = pick(rng, 40, 60, 5); const m1 = m2 * (T - t2) / (t1 - T);
      return out(v, r`How much boiling water ($100\,^\circ$C) must be added to ${m2} g of water at ${t2} $^\circ$C to make a mixture at ${T} $^\circ$C? (in g, 1 decimal; no heat loss)`, m1, 1, 'g', r`$m_1(100 - ${T}) = ${m2}(${T} - ${t2})$, so $m_1 = ${m2}\times${T - t2}/${100 - T} = ${R(m1, 1)}$ g.`, { m2, t2, T }); }
    const mm = pick(rng, 100, 300, 50); const tm = pick(rng, 80, 100, 10); const mw = pick(rng, 200, 400, 100); const tw = 20; const c = pick(rng, 0.1, 0.4, 0.05); const T = (mm * c * tm + mw * tw) / (mm * c + mw);
    return out(v, r`A ${mm} g metal piece at ${tm} $^\circ$C is dropped into ${mw} g of water at ${tw} $^\circ$C and the mixture settles at ${R(T, 2)} $^\circ$C. Find the specific heat of the metal (in cal g$^{-1}$ $^\circ$C$^{-1}$, 3 decimals).`, mw * (R(T, 2) - tw) / (mm * (tm - R(T, 2))), 3, 'cal/g°C', r`Heat lost by the metal = heat gained by the water: $${mm}\,c\,(${tm} - ${R(T, 2)}) = ${mw}(${R(T, 2)} - ${tw})$. So $c = \dfrac{${mw}\times${R(R(T, 2) - tw, 2)}}{${mm}\times${R(tm - R(T, 2), 2)}} = ${R(mw * (R(T, 2) - tw) / (mm * (tm - R(T, 2))), 3)}$`, { mm, tm, mw, Tm: R(T, 2) });
  }, (p) => (p.v === 0 ? (p.m1 * p.t1 + p.m2 * p.t2) / (p.m1 + p.m2) : p.v === 1 ? p.m2 * (p.T - p.t2) / (100 - p.T) : (p.mw * (p.Tm - 20)) / (p.mm * (p.tm - p.Tm)))),

  mk('tp-g09', 3, 'calorimetry with ice', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const mi = pick(rng, 20, 80, 10); const mw = pick(rng, 200, 400, 50); const tw = pick(rng, 30, 60, 10); const T = (mw * tw - mi * 80) / (mw + mi);
      return out(v, r`${mi} g of ice at $0\,^\circ$C is added to ${mw} g of water at ${tw} $^\circ$C in an insulated vessel. Find the final temperature (in $^\circ$C, 1 decimal). ($L_f = 80$ cal g$^{-1}$)`, T, 1, '°C', r`Water cooling to $0$ gives ${mw * tw} cal, enough to melt ${mi * 80} cal worth of ice, so all melts. $${mw}(${tw} - T) = ${mi}\times80 + ${mi}T$, so $T = \dfrac{${mw * tw} - ${mi * 80}}{${mw + mi}} = ${R(T, 1)}\,^\circ$C.`, { mi, mw, tw }); }
    if (v === 1) { const mi = pick(rng, 200, 400, 50); const mw = pick(rng, 100, 150, 25); const tw = pick(rng, 40, 80, 10); const melted = mw * tw / 80; const left = mi - melted;
      return out(v, r`${mi} g of ice at $0\,^\circ$C is mixed with ${mw} g of water at ${tw} $^\circ$C. How many grams of ice remain at equilibrium? ($L_f = 80$ cal g$^{-1}$; 1 decimal)`, left, 1, 'g', r`Water can give ${mw}\times${tw} = ${mw * tw} cal on cooling to $0\,^\circ$C. That melts ${mw * tw}/80 = ${R(melted, 2)} g, less than ${mi} g. So the mixture stays at $0\,^\circ$C with ${R(left, 1)} g of ice left.`, { mi, mw, tw }); }
    const mw = pick(rng, 200, 500, 100); const tw = pick(rng, 20, 30, 5); const T = pick(rng, 5, 10, 5); const mi = mw * (tw - T) / (80 + T);
    return out(v, r`How much ice at $0\,^\circ$C (in g, 1 decimal) must be added to ${mw} g of water at ${tw} $^\circ$C to cool it to ${T} $^\circ$C? ($L_f = 80$ cal g$^{-1}$)`, mi, 1, 'g', r`$${mw}(${tw} - ${T}) = m_i(80 + ${T})$, so $m_i = ${mw}\times${tw - T}/${80 + T} = ${R(mi, 1)}$ g.`, { mw, tw, T });
  }, (p) => (p.v === 0 ? (p.mw * p.tw - p.mi * 80) / (p.mw + p.mi) : p.v === 1 ? p.mi - p.mw * p.tw / 80 : p.mw * (p.tw - p.T) / (80 + p.T))),

  mk('tp-g10', 3, 'calorimetry with steam', (rng) => {
    const v = int(rng, 0, 1);
    if (v === 0) { const ms = pick(rng, 5, 20, 5); const mw = pick(rng, 100, 300, 50); const tw = pick(rng, 10, 30, 10); const T = (ms * 540 + ms * 100 + mw * tw) / (ms + mw);
      return out(v, r`${ms} g of steam at $100\,^\circ$C is bubbled into ${mw} g of water at ${tw} $^\circ$C in an insulated vessel of negligible heat capacity. Find the final temperature (in $^\circ$C, 1 decimal). ($L_v = 540$ cal g$^{-1}$)`, T, 1, '°C', r`$${ms}\times540 + ${ms}(100 - T) = ${mw}(T - ${tw})$, so $T = \dfrac{${ms * 540} + ${ms * 100} + ${mw * tw}}{${ms + mw}} = ${R(T, 1)}\,^\circ$C.`, { ms, mw, tw }); }
    const mw = pick(rng, 100, 400, 100); const tw = pick(rng, 10, 20, 5); const T = pick(rng, 40, 60, 10); const ms = mw * (T - tw) / (540 + 100 - T);
    return out(v, r`How many grams of steam at $100\,^\circ$C must condense in ${mw} g of water at ${tw} $^\circ$C to bring it to ${T} $^\circ$C? ($L_v = 540$ cal g$^{-1}$; 2 decimals)`, ms, 2, 'g', r`$m_s\times540 + m_s(100 - ${T}) = ${mw}(${T} - ${tw})$. So $m_s = \dfrac{${mw}\times${T - tw}}{${540 + 100 - T}} = ${R(ms, 2)}$ g.`, { mw, tw, T });
  }, (p) => (p.v === 0 ? (p.ms * 640 + p.mw * p.tw) / (p.ms + p.mw) : p.mw * (p.T - p.tw) / (640 - p.T))),

  mk('tp-g11', 3, 'heating curve', (rng) => {
    const v = int(rng, 0, 2); const m = pick(rng, 0.1, 1, 0.1); const t0 = pick(rng, 10, 30, 10); const t1 = pick(rng, 20, 80, 10); const P = pick(rng, 500, 2000, 250);
    const Q = m * 2100 * t0 + m * 3.36e5 + m * 4200 * t1;
    if (v === 0) return out(v, r`How much heat (in kJ, 1 decimal) turns ${m} kg of ice at $-${t0}\,^\circ$C into water at ${t1} $^\circ$C? ($c_{ice} = 2100$, $c_w = 4200$ J kg$^{-1}$K$^{-1}$, $L_f = 3.36\times10^5$ J kg$^{-1}$)`, Q / 1000, 1, 'kJ', r`Warm ice: $${m}\times2100\times${t0} = ${R(m * 2100 * t0, 0)}$ J. Melt: $${m}\times3.36\times10^5 = ${R(m * 3.36e5, 0)}$ J. Warm water: $${m}\times4200\times${t1} = ${R(m * 4200 * t1, 0)}$ J. Total ${R(Q / 1000, 1)} kJ.`, { m, t0, t1 });
    if (v === 1) return out(v, r`A heater of ${P} W supplies all its power to ${m} kg of ice at $-${t0}\,^\circ$C. How long (in s, nearest whole number) until the sample is water at ${t1} $^\circ$C? ($c_{ice} = 2100$, $c_w = 4200$, $L_f = 3.36\times10^5$ SI)`, Q / P, 0, 's', r`Total heat $= ${R(m * 2100 * t0, 0)} + ${R(m * 3.36e5, 0)} + ${R(m * 4200 * t1, 0)} = ${R(Q, 0)}$ J. $t = Q/P = ${R(Q, 0)}/${P} = ${R(Q / P, 0)}$ s.`, { m, t0, t1, P });
    const t = pick(rng, 5, 15, 5) * 60; return out(v, r`What power (in W, nearest whole number) melts ${m} kg of ice at $0\,^\circ$C in ${t / 60} minutes? ($L_f = 3.36\times10^5\ \mathrm{J\,kg^{-1}}$; no losses)`, m * 3.36e5 / t, 0, 'W', r`$P = mL_f/t = ${m}\times3.36\times10^5/${t} = ${R(m * 3.36e5 / t, 0)}$ W.`, { m, t });
  }, (p) => (p.v === 0 ? (p.m * 2100 * p.t0 + p.m * 3.36e5 + p.m * 4200 * p.t1) / 1000 : p.v === 1 ? (p.m * (2100 * p.t0 + 336000 + 4200 * p.t1)) / p.P : p.m * 336000 / p.t)),

  mk('tp-g12', 2, 'conduction', (rng) => {
    const v = int(rng, 0, 3); const [name, k] = choose(rng, [['copper', 400], ['aluminium', 235], ['iron', 80], ['glass', 0.8], ['brick', 0.7]]);
    const A = pick(rng, 1, 10, 1) * 1e-4 * (k < 5 ? 1000 : 1); const L = pick(rng, 10, 100, 10) / 100 * (k < 5 ? 0.1 : 1); const dT = pick(rng, 20, 100, 10);
    const H = k * A * dT / L; const Au = A * 1e4;
    if (v === 0) return out(v, r`${an(name)} slab ($k = ${k}\ \mathrm{W\,m^{-1}K^{-1}}$) has area ${R(Au, 1)} $\mathrm{cm^2}$ and thickness ${R(L * 100, 1)} cm. Its faces differ by ${dT} $^\circ$C. Find the heat flow in the steady state (in W, 2 decimals).`, H, 2, 'W', r`$H = kA\Delta T/L = ${k}\times${R(A, 6)}\times${dT}/${R(L, 4)} = ${R(H, 2)}$ W.`, { k, A, L, dT });
    if (v === 1) return out(v, r`Heat flows at ${R(H, 2)} W through a slab of area ${R(Au, 1)} $\mathrm{cm^2}$ and thickness ${R(L * 100, 1)} cm when its faces differ by ${dT} $^\circ$C. Find its conductivity (in $\mathrm{W\,m^{-1}K^{-1}}$, 1 decimal).`, R(H, 2) * L / (A * dT), 1, 'W/m K', r`$k = \dfrac{HL}{A\Delta T} = \dfrac{${R(H, 2)}\times${R(L, 4)}}{${R(A, 6)}\times${dT}} = ${R(R(H, 2) * L / (A * dT), 1)}\ \mathrm{W\,m^{-1}K^{-1}}$.`, { H2: R(H, 2), A, L, dT });
    if (v === 2) { const mel = H * 3600 / 3.36e5 * 1000; return out(v, r`One end of a ${name} bar ($k = ${k}$) of area ${R(Au, 1)} $\mathrm{cm^2}$ and length ${R(L * 100, 1)} cm is in melting ice and the other end is ${dT} $^\circ$C hotter. How many grams of ice melt in an hour (1 decimal; $L_f = 3.36\times10^5$ J kg$^{-1}$, lossless)?`, mel, 1, 'g', r`$H = kA\Delta T/L = ${R(H, 3)}$ W. In 3600 s: ${R(H * 3600, 1)} J. Ice melted $= ${R(H * 3600, 1)}/3.36\times10^5 = ${R(mel / 1000, 5)}$ kg $= ${R(mel, 1)}$ g.`, { k, A, L, dT }); }
    return out(v, r`${an(name)} rod ($k = ${k}$) of area ${R(Au, 1)} $\mathrm{cm^2}$ and length ${R(L * 100, 1)} cm carries ${R(H, 2)} W in the steady state. Find the temperature difference between its ends (in $^\circ$C, 1 decimal).`, R(H, 2) * L / (k * A), 1, '°C', r`$\Delta T = \dfrac{HL}{kA} = \dfrac{${R(H, 2)}\times${R(L, 4)}}{${k}\times${R(A, 6)}} = ${R(R(H, 2) * L / (k * A), 1)}\,^\circ$C.`, { H2: R(H, 2), k, A, L });
  }, (p) => (p.v === 0 ? p.k * p.A * p.dT / p.L : p.v === 1 ? p.H2 * p.L / (p.A * p.dT) : p.v === 2 ? p.k * p.A * p.dT / p.L * 3600 / 336 : p.H2 * p.L / (p.k * p.A))),
);

gens.push(
  mk('tp-g13', 3, 'conduction in series', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const n = choose(rng, [2, 3, 4, 5]); const T1 = pick(rng, 80, 100, 10); const T = (n * T1) / (n + 1);
      return out(v, r`Two rods of the same length and area have conductivities $${n}k$ and $k$. They are joined end to end, with the free end of the first at ${T1} $^\circ$C and of the second at $0\,^\circ$C. Find the temperature of the joint (in $^\circ$C, 1 decimal).`, T, 1, '°C', r`Same heat flows: $${n}k(${T1} - T) = k(T - 0)$, so $T = \dfrac{${n}\times${T1}}{${n + 1}} = ${R(T, 1)}\,^\circ$C.`, { n, T1 }); }
    if (v === 1) { const k1 = pick(rng, 100, 400, 100); const k2 = pick(rng, 20, 80, 20); const L1 = pick(rng, 10, 40, 10) / 100; const L2 = pick(rng, 10, 40, 10) / 100; const R1 = L1 / k1; const R2 = L2 / k2; const T = 100 - 100 * R1 / (R1 + R2);
      return out(v, r`A rod of conductivity ${k1} (length ${L1 * 100} cm) is joined to a rod of conductivity ${k2} (length ${L2 * 100} cm), same cross-section. The free ends are at $100\,^\circ$C (first rod) and $0\,^\circ$C. Find the joint temperature (in $^\circ$C, 1 decimal).`, T, 1, '°C', r`Resistance per unit area $L/k$: first $${L1}/${k1} = ${R(R1, 6)}$, second $${L2}/${k2} = ${R(R2, 6)}$. The first rod takes the fraction $\dfrac{R_1}{R_1 + R_2}$ of the drop: $${R(100 * R1 / (R1 + R2), 2)}\,^\circ$C. The joint is at $${R(T, 1)}\,^\circ$C.`, { k1, k2, L1, L2 }); }
    const k1 = pick(rng, 100, 400, 100); const k2 = pick(rng, 50, 100, 25); const A = 2e-4; const L = pick(rng, 20, 50, 10) / 100; const H = 100 * A / (L / k1 + L / k2);
    return out(v, r`Two rods, each ${L * 100} cm long and of area $2\ \mathrm{cm^2}$, with conductivities ${k1} and ${k2}, are joined end to end between $100\,^\circ$C and $0\,^\circ$C. Find the steady heat flow (in W, 2 decimals).`, H, 2, 'W', r`Series resistances $L/(kA)$ add: $R = \dfrac{${L}}{${k1}\times2\times10^{-4}} + \dfrac{${L}}{${k2}\times2\times10^{-4}} = ${R(L / (k1 * A) + L / (k2 * A), 3)}\ \mathrm{K\,W^{-1}}$. $H = 100/R = ${R(H, 2)}$ W.`, { k1, k2, L });
  }, (p) => (p.v === 0 ? p.T1 - p.T1 / (p.n + 1) : p.v === 1 ? 100 * (p.L2 / p.k2) / (p.L1 / p.k1 + p.L2 / p.k2) : 100 / (p.L / p.k1 / 2e-4 + p.L / p.k2 / 2e-4))),

  mk('tp-g14', 3, 'conduction in parallel and equivalent conductivity', (rng) => {
    const v = int(rng, 0, 2); const k1 = pick(rng, 100, 400, 50); const k2 = pick(rng, 20, 90, 10);
    if (v === 0) { const A = pick(rng, 1, 4, 1) * 1e-4; const L = pick(rng, 20, 60, 10) / 100; const H = (k1 + k2) * A * 100 / L;
      return out(v, r`Two rods of equal length ${L * 100} cm and equal area ${A * 1e4} $\mathrm{cm^2}$, conductivities ${k1} and ${k2}, connect the same two bodies at $100\,^\circ$C and $0\,^\circ$C. Find the total heat flow (in W, 2 decimals).`, H, 2, 'W', r`Parallel: $H = (k_1 + k_2)A\Delta T/L = ${k1 + k2}\times${A * 1e4}\times10^{-4}\times100/${L} = ${R(H, 2)}$ W.`, { k1, k2, A, L }); }
    if (v === 1) { const e = 2 * k1 * k2 / (k1 + k2); return out(v, r`Two slabs of the same thickness and area have conductivities ${k1} and ${k2}. Find the equivalent conductivity when they are in series (in $\mathrm{W\,m^{-1}K^{-1}}$, 1 decimal).`, e, 1, 'W/m K', r`$\dfrac{2L}{k_{eq}} = \dfrac{L}{${k1}} + \dfrac{L}{${k2}}$, so $k_{eq} = \dfrac{2k_1k_2}{k_1 + k_2} = \dfrac{2\times${k1}\times${k2}}{${k1 + k2}} = ${R(e, 1)}$.`, { k1, k2 }); }
    const e = (k1 + k2) / 2; return out(v, r`Two slabs of the same thickness and the same face area $A$ lie side by side (in parallel). Their conductivities are ${k1} and ${k2}. Find the equivalent conductivity for the combined slab (in $\mathrm{W\,m^{-1}K^{-1}}$, 1 decimal).`, e, 1, 'W/m K', r`Heat flows add: $k_{eq}(2A) = k_1A + k_2A$, so $k_{eq} = (k_1 + k_2)/2 = ${R(e, 1)}$.`, { k1, k2 });
  }, (p) => (p.v === 0 ? (p.k1 * p.A * 100 + p.k2 * p.A * 100) / p.L : p.v === 1 ? 1 / (0.5 / p.k1 + 0.5 / p.k2) : (p.k1 + p.k2) / 2)),

  mk('tp-g15', 4, 'growth of ice on ponds', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const x1 = pick(rng, 1, 4, 1); const x2 = x1 + pick(rng, 1, 4, 1); const t1 = pick(rng, 1, 5, 1); const t = t1 * (x2 ** 2 - x1 ** 2) / x1 ** 2;
      return out(v, r`Ice on a pond reaches ${x1} cm thickness after ${t1} hours of steady freezing from zero. How many more hours (1 decimal) are needed to reach ${x2} cm?`, t, 1, 'h', r`$t\propto x^2$. Hours for ${x1} cm: ${t1}. Further time $= ${t1}\times\dfrac{${x2}^2 - ${x1}^2}{${x1}^2} = ${R(t, 1)}$ h.`, { x1, x2, t1 }); }
    if (v === 1) { const x = pick(rng, 2, 10, 2) / 100; const dT = pick(rng, 5, 20, 5); const t = 900 * 3.36e5 * x * x / (2 * 2.2 * dT) / 3600;
      return out(v, r`A pond's surface air is at $-${dT}\,^\circ$C and the water below the ice is at $0\,^\circ$C. How many hours (1 decimal) does the ice take to grow from zero to ${x * 100} cm? ($k = 2.2$, $\rho = 900$, $L_f = 3.36\times10^5$ SI)`, t, 1, 'h', r`$t = \dfrac{\rho L_fx^2}{2k\Delta T} = \dfrac{900\times3.36\times10^5\times${x * x}}{2\times2.2\times${dT}} = ${R(t * 3600, 0)}$ s $= ${R(t, 1)}$ h.`, { x, dT }); }
    const x = pick(rng, 2, 10, 2) / 100; const dT = pick(rng, 5, 20, 5); const rate = 2.2 * dT / (900 * 3.36e5 * x) * 3600 * 1000;
    return out(v, r`Ice ${x * 100} cm thick lies on a pond; the air is at $-${dT}\,^\circ$C. Find the rate at which the ice thickens (in mm per hour, 2 decimals). ($k = 2.2$, $\rho = 900$, $L_f = 3.36\times10^5$ SI)`, rate, 2, 'mm/h', r`$\dfrac{dx}{dt} = \dfrac{k\Delta T}{\rho L_fx} = \dfrac{2.2\times${dT}}{900\times3.36\times10^5\times${x}} = ${R(rate / 3.6e6, 9)}\ \mathrm{m\,s^{-1}} = ${R(rate, 2)}\ \mathrm{mm\,h^{-1}}$.`, { x, dT });
  }, (p) => (p.v === 0 ? p.t1 * (p.x2 ** 2 / p.x1 ** 2 - 1) : p.v === 1 ? 900 * 3.36e5 * p.x ** 2 / (4.4 * p.dT * 3600) : 2.2 * p.dT * 3.6e6 / (3.024e8 * p.x))),

  mk('tp-g16', 3, 'Stefan-Boltzmann law', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const T = pick(rng, 500, 3000, 100); const A = pick(rng, 1, 20, 1) / 100; const P = SIG * A * T ** 4;
      return out(v, r`A black body of area ${A} $\mathrm{m^2}$ is at ${T} K. Find the power it radiates (in W, 1 decimal). $\sigma = 5.67\times10^{-8}$ SI.`, P, 1, 'W', r`$P = \sigma AT^4 = 5.67\times10^{-8}\times${A}\times${T}^4 = ${R(P, 1)}$ W.`, { T, A }); }
    if (v === 1) { const f = choose(rng, [2, 3, 4]); const g = choose(rng, [2, 3]); const ratio = f ** 2 * g ** 4;
      return out(v, r`A spherical black body has its radius multiplied by ${f} and its absolute temperature by ${g}. By what factor does the radiated power change?`, ratio, 0, '', r`$P\propto r^2T^4$. Factor $= ${f}^2\times${g}^4 = ${ratio}$.`, { f, g }); }
    if (v === 2) { const P = pick(rng, 100, 1000, 100); const A = pick(rng, 1, 5, 1) / 100; const T = (P / (SIG * A)) ** 0.25;
      return out(v, r`A black body of area ${A} $\mathrm{m^2}$ radiates ${P} W. Find its temperature (in K, nearest whole number). $\sigma = 5.67\times10^{-8}$ SI.`, T, 0, 'K', r`$T = \left(\dfrac{P}{\sigma A}\right)^{1/4} = \left(\dfrac{${P}}{5.67\times10^{-8}\times${A}}\right)^{1/4} = ${R(T, 0)}$ K.`, { P, A }); }
    const T = pick(rng, 400, 800, 100); const T0 = pick(rng, 280, 320, 20); const A = pick(rng, 1, 5, 1) / 10; const e = choose(rng, [0.5, 0.8, 0.9]); const P = e * SIG * A * (T ** 4 - T0 ** 4);
    return out(v, r`A body of emissivity ${e} and area ${A} $\mathrm{m^2}$ at ${T} K sits in surroundings at ${T0} K. Find the net power it loses by radiation (in W, 1 decimal). $\sigma = 5.67\times10^{-8}$ SI.`, P, 1, 'W', r`$P_{net} = e\sigma A(T^4 - T_0^4) = ${e}\times5.67\times10^{-8}\times${A}\times(${T}^4 - ${T0}^4) = ${R(P, 1)}$ W.`, { T, T0, A, e });
  }, (p) => (p.v === 0 ? 5.67e-8 * p.A * p.T ** 4 : p.v === 1 ? (p.f * p.g * p.g) ** 2 * 1 : p.v === 2 ? Math.sqrt(Math.sqrt(p.P / (5.67e-8 * p.A))) : p.e * 5.67e-8 * p.A * (p.T ** 4 - p.T0 ** 4))),

  mk('tp-g17', 2, 'Wien displacement law', (rng) => {
    const v = int(rng, 0, 2); const b = 2.898e-3;
    if (v === 0) { const T = pick(rng, 3000, 9000, 500); const l = b / T * 1e9; return out(v, r`Find the wavelength of peak emission (in nm, nearest whole number) of a black body at ${T} K. ($b = 2.898\times10^{-3}$ m K)`, l, 0, 'nm', r`$\lambda_m = b/T = 2.898\times10^{-3}/${T} = ${R(l, 0)}$ nm.`, { T }); }
    if (v === 1) { const l = pick(rng, 300, 900, 50); const T = b / (l * 1e-9); return out(v, r`The radiation of a star peaks at ${l} nm. Find its surface temperature (in K, nearest whole number). ($b = 2.898\times10^{-3}$ m K)`, T, 0, 'K', r`$T = b/\lambda_m = 2.898\times10^{-3}/(${l}\times10^{-9}) = ${R(T, 0)}$ K.`, { l }); }
    const l1 = pick(rng, 300, 500, 50); const l2 = pick(rng, 600, 900, 100); const T1 = 6000; const T2 = T1 * l1 / l2; return out(v, r`Star A has peak wavelength ${l1} nm and star B ${l2} nm. If A is at ${T1} K, find B's temperature (in K, nearest whole number).`, T2, 0, 'K', r`$T\propto1/\lambda_m$. $T_B = T_A\times\dfrac{\lambda_A}{\lambda_B} = ${T1}\times\dfrac{${l1}}{${l2}} = ${R(T2, 0)}$ K.`, { l1, l2, T1 });
  }, (p) => (p.v === 0 ? 2.898e6 / p.T : p.v === 1 ? 2.898e6 / p.l : p.T1 * p.l1 / p.l2)),

  mk('tp-g18', 4, 'Newton\'s law of cooling', (rng) => {
    const v = int(rng, 0, 2); const Ts = pick(rng, 20, 30, 10); const T0 = pick(rng, 80, 100, 10); const T1 = T0 - pick(rng, 10, 20, 10); const t1 = pick(rng, 4, 10, 2);
    const k = Math.log((T0 - Ts) / (T1 - Ts)) / t1;
    if (v === 0) { const t = t1 * 2; const T = Ts + (T0 - Ts) * Math.exp(-k * t); return out(v, r`A body cools from ${T0} $^\circ$C to ${T1} $^\circ$C in ${t1} min in a room at ${Ts} $^\circ$C. Using the exact exponential law, find its temperature after ${t} min from the start (in $^\circ$C, 1 decimal).`, T, 1, '°C', r`$k = \dfrac1{${t1}}\ln\dfrac{${T0 - Ts}}{${T1 - Ts}} = ${R(k, 4)}\ \mathrm{min^{-1}}$. $T = T_s + (T_0 - T_s)e^{-kt} = ${Ts} + ${T0 - Ts}e^{-${R(k * t, 4)}} = ${R(T, 1)}\,^\circ$C.`, { Ts, T0, T1, t1, t }); }
    if (v === 1) { const T2 = Ts + (T1 - Ts) / 2; const t = Math.log((T1 - Ts) / (T2 - Ts)) / k; return out(v, r`A body cools from ${T0} $^\circ$C to ${T1} $^\circ$C in ${t1} min in a room at ${Ts} $^\circ$C. How long (in min, 2 decimals) does it take to cool from ${T1} $^\circ$C to ${R(T2, 1)} $^\circ$C (exact exponential law)?`, t, 2, 'min', r`Excess falls from ${T1 - Ts} to ${R(T2 - Ts, 1)}, a factor of 2. $k = ${R(k, 4)}\ \mathrm{min^{-1}}$, so $t = \ln2/k = ${R(t, 2)}$ min.`, { Ts, T0, T1, t1, T2 }); }
    const dT = T0 - T1; const kk = (dT / t1) / ((T0 + T1) / 2 - Ts); const T2 = T1 - pick(rng, 5, 10, 5); const t = (T1 - T2) / (kk * ((T1 + T2) / 2 - Ts));
    return out(v, r`A body cools from ${T0} $^\circ$C to ${T1} $^\circ$C in ${t1} min in surroundings at ${Ts} $^\circ$C. Using the average-temperature form of Newton's law, find how many minutes (2 decimals) it needs to cool from ${T1} $^\circ$C to ${T2} $^\circ$C.`, t, 2, 'min', r`Rate $=k(T_{avg} - T_s)$. First: $\dfrac{${dT}}{${t1}} = k(${(T0 + T1) / 2} - ${Ts})$, so $k = ${R(kk, 5)}$. Then $t = \dfrac{${T1 - T2}}{k\,(${(T1 + T2) / 2} - ${Ts})} = ${R(t, 2)}$ min.`, { Ts, T0, T1, t1, T2 });
  }, (p) => (p.v === 0 ? p.Ts + (p.T0 - p.Ts) * ((p.T1 - p.Ts) / (p.T0 - p.Ts)) ** (p.t / p.t1) : p.v === 1 ? p.t1 * Math.log(2) / Math.log((p.T0 - p.Ts) / (p.T1 - p.Ts)) : ((p.T1 - p.T2) / (((p.T0 - p.T1) / p.t1) / ((p.T0 + p.T1) / 2 - p.Ts))) / ((p.T1 + p.T2) / 2 - p.Ts))),

  mk('tp-g19', 4, 'radiation and cooling rate', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const P = pick(rng, 40, 100, 20); const T = pick(rng, 2200, 2800, 200); const e = choose(rng, [0.3, 0.35, 0.4]); const A = P / (e * SIG * T ** 4) * 1e6;
      return out(v, r`A filament of emissivity ${e} radiates ${P} W at ${T} K. Find its surface area (in $\mathrm{mm^2}$, 1 decimal). Ignore the surroundings. $\sigma = 5.67\times10^{-8}$ SI.`, A, 1, 'mm²', r`$A = \dfrac{P}{e\sigma T^4} = \dfrac{${P}}{${e}\times5.67\times10^{-8}\times${T}^4} = ${R(A / 1e6, 8)}\ \mathrm{m^2} = ${R(A, 1)}\ \mathrm{mm^2}$.`, { P, T, e }); }
    if (v === 1) { const rr = pick(rng, 5, 20, 5) / 1000; const T = pick(rng, 300, 600, 100); const rate = 3 * SIG * T ** 4 / (8900 * rr * 390);
      return out(v, r`A black copper sphere of radius ${rr * 1000} mm ($\rho = 8900$, $c = 390$ SI) is at ${T} K in a vacuum with very cold walls. Find its initial rate of fall of temperature (in K s$^{-1}$, 4 decimals). $\sigma = 5.67\times10^{-8}$ SI.`, rate, 4, 'K/s', r`$mc\dfrac{dT}{dt} = \sigma4\pi r^2T^4$ with $m = \tfrac43\pi r^3\rho$: $\dfrac{dT}{dt} = \dfrac{3\sigma T^4}{\rho rc} = \dfrac{3\times5.67\times10^{-8}\times${T}^4}{8900\times${rr}\times390} = ${R(rate, 4)}\ \mathrm{K\,s^{-1}}$.`, { rr, T }); }
    const T = pick(rng, 250, 290, 10); const S = pick(rng, 1300, 1400, 50); const al = choose(rng, [0.2, 0.3, 0.4]); const Te = ((1 - al) * S / (4 * SIG)) ** 0.25;
    return out(v, r`A planet with albedo ${al} receives sunlight of intensity ${S} $\mathrm{W\,m^{-2}}$ and radiates as a black body from its whole surface. Find its equilibrium temperature (in K, nearest whole number). $\sigma = 5.67\times10^{-8}$ SI.`, Te, 0, 'K', r`Absorbed: $(1 - ${al})S\pi R^2$. Radiated: $4\pi R^2\sigma T^4$. $T = \left[\dfrac{${1 - al}\times${S}}{4\times5.67\times10^{-8}}\right]^{1/4} = ${R(Te, 0)}$ K.`, { S, al });
  }, (p) => (p.v === 0 ? p.P / (p.e * 5.67e-8 * p.T ** 4) * 1e6 : p.v === 1 ? 3 * 5.67e-8 * p.T ** 4 / (8900 * p.rr * 390) : Math.pow((1 - p.al) * p.S / (4 * 5.67e-8), 0.25))),

  mk('tp-g20', 3, 'heat and energy conversion', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const vv = pick(rng, 150, 400, 50); const [n, c] = choose(rng, [['lead', 130], ['copper', 390], ['iron', 450]]); const dT = vv * vv / (2 * c);
      return out(v, r`${an(n)} bullet ($c = ${c}\ \mathrm{J\,kg^{-1}K^{-1}}$) hits a wall at ${vv} $\mathrm{m\,s^{-1}}$ and all its kinetic energy heats it. Find its temperature rise (in K, 1 decimal; ignore melting).`, dT, 1, 'K', r`$\tfrac12v^2 = c\Delta T$, so $\Delta T = \dfrac{${vv}^2}{2\times${c}} = ${R(dT, 1)}$ K.`, { vv, c }); }
    if (v === 1) { const h = pick(rng, 50, 500, 50); const dT = 9.8 * h / 4200; return out(v, r`Water falls ${h} m over a waterfall and all its energy becomes heat in the water. Find the rise in temperature (in $^\circ$C, 3 decimals). ($c = 4200$, $g = 9.8$ SI)`, dT, 3, '°C', r`$gh = c\Delta T$, so $\Delta T = 9.8\times${h}/4200 = ${R(dT, 3)}\,^\circ$C.`, { h }); }
    if (v === 2) { const m = pick(rng, 2, 10, 2); const h = pick(rng, 10, 40, 10); const times = pick(rng, 100, 400, 100); const dT = m * 9.8 * h * times / (m * 4200 * 1); return out(v, r`A paddle wheel is driven by a ${m} kg weight falling ${h} m, repeated ${times} times. All the work heats ${m} kg of water. Find the rise in temperature (in $^\circ$C, 2 decimals). ($g = 9.8$, $c = 4200$ SI)`, dT, 2, '°C', r`Work $= ${times}\times${m}\times9.8\times${h}$ J $= ${R(times * m * 9.8 * h, 0)}$ J. $\Delta T = W/(mc) = ${R(times * m * 9.8 * h, 0)}/(${m}\times4200) = ${R(dT, 2)}\,^\circ$C.`, { m, h, times }); }
    const P = pick(rng, 500, 2000, 500); const mm = pick(rng, 1, 3, 1); const t = pick(rng, 100, 300, 100); const eta = choose(rng, [0.6, 0.8, 0.9]); const dT = eta * P * t / (mm * 4200); return out(v, r`A heater of ${P} W with ${eta * 100}% efficiency warms ${mm} kg of water for ${t} s. Find the rise in temperature (in $^\circ$C, 1 decimal). ($c = 4200$ SI)`, dT, 1, '°C', r`Heat to water $= ${eta}\times${P}\times${t} = ${eta * P * t}$ J. $\Delta T = \dfrac{${eta * P * t}}{${mm}\times4200} = ${R(dT, 1)}\,^\circ$C.`, { P, mm, t, eta });
  }, (p) => (p.v === 0 ? p.vv * p.vv / (2 * p.c) : p.v === 1 ? 9.8 * p.h / 4200 : p.v === 2 ? 9.8 * p.h * p.times / 4200 : p.eta * p.P * p.t / (p.mm * 4200))),
);

// ======== Expansion block (added 2026-11-22): more hard items and templates, ids tp-x001 onward ========
import * as XH from '../_entrance.js';
const { pick: xpick, int: xint, choose: xchoose, fmt: xfmt, shuffleOpts: xsh, numOpts: xno } = XH;
const xr = String.raw;
const XE = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const xex = (level, type, neet) => { const e = [...XE[level]]; if (neet && level === 4) e.push('neet'); if (false && level <= 3 && type === 'mcq') e.push('cuet'); return e; };
let xk = 0, xc = 0;
const XPOS = [2, 0, 3, 1, 3, 1, 0, 2];
const xb = (level, sub, o) => { const { neet, ...rest } = o; return { id: `tp-x${String(++xk).padStart(3, '0')}`, level, exams: xex(level, o.type, neet), sub, ...rest }; };
const xq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const xn = (level, sub, q, ans, tol, calc, sol, o = {}) => {
  const v = calc();
  if (!(Math.abs(v - ans) <= Math.max(tol, 1e-9) + 1e-9)) throw new Error(`tp item ${xk + 1}: calc ${v} vs answer ${ans}`);
  return xb(level, sub, { type: 'nat', format: tol === 0 && Number.isInteger(ans) ? 'integer' : 'numeric', q, answer: ans, tol, calc, sol, ...o });
};
const xs = (level, sub, q, options, answer, sol, o = {}) => xb(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const XAO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const xa = (level, sub, A, R, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: XAO, answer, sol, ...o });
const XSO = ['Both Statement I and Statement II are true and II explains I', 'Both Statement I and Statement II are true but II does not explain I', 'Statement I is true and Statement II is false', 'Statement I is false and Statement II is true'];
const xt = (level, sub, I, II, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: XSO, answer, sol, ...o });
const XSW = [['A', 'B'], ['C', 'D'], ['A', 'C'], ['B', 'D'], ['A', 'D'], ['B', 'C']];
/** match item: map like {A:'q',B:'s',C:'p',D:'r'}; three wrong codes made by swapping two answers. */
const xm = (level, sub, group, q, map, sol, o = {}) => {
  const code = (m) => ['A', 'B', 'C', 'D'].map((l) => `${l}-${m[l]}`).join(', ');
  const wrongs = [];
  for (let i = 0; wrongs.length < 3; i++) { const [a, b] = XSW[(xc + i) % 6]; const m = { ...map }; [m[a], m[b]] = [m[b], m[a]]; wrongs.push(code(m)); }
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, code(map));
  return xb(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const XMU = xr`\mathrm{m\,s^{-1}}`;

const xSIG = 5.67e-8;
const xgroups = {
  xm1: { title: 'Heat constants', list1: ['A. Latent heat of fusion of ice', 'B. Latent heat of vaporisation of water at $100\\,^\\circ$C', 'C. Specific heat of water', 'D. Specific heat of ice'],
    list2: [xr`p. $3.36\times10^5\ \mathrm{J\,kg^{-1}}$`, xr`q. $2.26\times10^6\ \mathrm{J\,kg^{-1}}$`, xr`r. $4200\ \mathrm{J\,kg^{-1}K^{-1}}$`, xr`s. $2100\ \mathrm{J\,kg^{-1}K^{-1}}$`, xr`t. $900\ \mathrm{J\,kg^{-1}K^{-1}}$`] },
  xm2: { title: 'Heating an isotropic rod', list1: [xr`A. Fractional change in length`, 'B. Fractional change in area of a cross-section', 'C. Fractional change in volume', 'D. Fractional change in density (small changes)'],
    list2: [xr`p. $+1\times10^{-3}$`, xr`q. $+2\times10^{-3}$`, xr`r. $+3\times10^{-3}$`, xr`s. $-3\times10^{-3}$`, xr`t. $-1\times10^{-3}$`] },
  xm3: { title: 'Power radiated by a black body', list1: ['A. Absolute temperature doubled (same size)', 'B. Absolute temperature tripled (same size)', 'C. Radius doubled (same temperature)', 'D. Temperature halved and radius doubled'],
    list2: [xr`p. $\tfrac14$ times`, 'q. 4 times', 'r. 16 times', 's. 81 times', 't. 8 times'] },
  xm4: { title: 'Mixing and the final state (no heat loss; L_f = 80 cal/g, c_w = 1 cal/g °C)', list1: ['A. 100 g of ice at $0\\,^\\circ$C and 200 g of water at $20\\,^\\circ$C', 'B. 100 g of ice at $0\\,^\\circ$C and 100 g of water at $80\\,^\\circ$C', 'C. 100 g of ice at $0\\,^\\circ$C and 100 g of water at $100\\,^\\circ$C', 'D. 200 g of water at $20\\,^\\circ$C and 100 g of water at $80\\,^\\circ$C'],
    list2: ['p. All water at $0\\,^\\circ$C, no ice left', 'q. Water and ice at $0\\,^\\circ$C, with 50 g of ice left', 'r. All water at $10\\,^\\circ$C', 's. All water at $40\\,^\\circ$C', 't. All ice at $0\\,^\\circ$C'] },
  xm5: { title: 'Two rods in series and in parallel', list1: [xr`A. Interface temperature when rod A ($2k$) is at 100 °C and rod B ($k$) at 0 °C, in series`, xr`B. Interface temperature when rod B ($k$) is at 100 °C and rod A ($2k$) at 0 °C, in series`, xr`C. Effective conductivity of the two rods in series (same length and area)`, xr`D. Effective conductivity of the two rods in parallel (same length and area)`],
    list2: ['p. 66.7 °C', 'q. 33.3 °C', xr`r. $4k/3$`, xr`s. $3k/2$`, xr`t. $3k$`] },
  xm6: { title: 'Equilibrium temperature of a planet (no atmosphere)', list1: ['A. Earth: $S = 1361\\ \\mathrm{W\\,m^{-2}}$, albedo 0.30', 'B. Mars: $S = 590\\ \\mathrm{W\\,m^{-2}}$, albedo 0.25', 'C. Venus: $S = 2600\\ \\mathrm{W\\,m^{-2}}$, albedo 0.77', 'D. Mercury: $S = 9100\\ \\mathrm{W\\,m^{-2}}$, albedo 0.10'],
    list2: ['p. 210 K', 'q. 227 K', 'r. 255 K', 's. 436 K', 't. 270 K'] },
  xm7: { title: 'Wien\'s displacement law (peak wavelength times temperature = 2.9e-3 m K)', list1: ['A. Wavelength of peak emission of the Sun (5800 K)', 'B. Wavelength of peak emission of a human body (310 K)', 'C. Temperature of a star whose spectrum peaks at 290 nm', 'D. Wavelength of peak emission of a filament at 2900 K'],
    list2: ['p. 500 nm', xr`q. $9.35\ \mu$m`, 'r. 10 000 K', 's. 1000 nm', 't. 5800 K'] },
  xm8: { title: 'A steel rod clamped between rigid walls (alpha = 1.2e-5 per K, Y = 2e11 Pa)', list1: ['A. Strain when heated by 50 K', 'B. Stress when heated by 50 K', xr`C. Force for a cross-section of $1\ \mathrm{cm^2}$`, 'D. Stress if there had been a gap equal to half of the free expansion'],
    list2: [xr`p. $6\times10^{-4}$`, xr`q. $1.2\times10^8$ Pa`, xr`r. $1.2\times10^4$ N`, xr`s. $6\times10^7$ Pa`, xr`t. $3\times10^{-4}$`] },
  xp1: { title: 'An immersion heater',
    passage: xr`<p>A 300 W immersion heater, 80 % efficient (80 % of the electrical energy reaches the liquid), heats 0.5 kg of water from $20\,^\circ$C. Take $c_w = 4200\ \mathrm{J\,kg^{-1}K^{-1}}$ and $L_v = 2.26\times10^6\ \mathrm{J\,kg^{-1}}$. Ignore the heat capacity of the container.</p>` },
  xp2: { title: 'Conduction through a tapered rod',
    passage: xr`<p>A round copper rod ($k = 400\ \mathrm{W\,m^{-1}K^{-1}}$) is 0.50 m long. Its radius changes uniformly from 1.0 cm at the hot end ($100\,^\circ$C) to 2.0 cm at the cold end ($0\,^\circ$C). The curved surface is insulated and the flow is steady.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xq(2, 'heat capacity', xr`The SI unit of heat capacity (thermal capacity) of a body is`, xr`$\mathrm{J\,K^{-1}}$`, [xr`$\mathrm{J\,kg^{-1}K^{-1}}$`, xr`$\mathrm{J\,kg^{-1}}$`, xr`$\mathrm{W\,m^{-1}K^{-1}}$`],
    xr`Heat capacity $C = Q/\Delta T$ is in $\mathrm{J\,K^{-1}}$. Specific heat is per kilogram ($\mathrm{J\,kg^{-1}K^{-1}}$), latent heat is per kilogram ($\mathrm{J\,kg^{-1}}$) and conductivity is in $\mathrm{W\,m^{-1}K^{-1}}$.`),
  xn(2, 'calorimetry', xr`An aluminium calorimeter of mass 100 g has specific heat $0.2\ \mathrm{cal\,g^{-1}\,^\circ C^{-1}}$. Find its water equivalent in g.`, 20, 0, () => 100 * 0.2 / 1,
    xr`Water equivalent $= mc/c_w = 100\times0.2/1 = 20$ g: the calorimeter absorbs as much heat as 20 g of water would.`),
  xn(2, 'specific heat', xr`How much heat, in kJ, raises the temperature of 2 kg of copper ($c = 400\ \mathrm{J\,kg^{-1}K^{-1}}$) from $20\,^\circ$C to $70\,^\circ$C?`, 40, 0, () => 2 * 400 * 50 / 1000,
    xr`$Q = mc\Delta T = 2\times400\times50 = 40\,000$ J $= 40$ kJ.`),
  xn(2, 'latent heat', xr`How much heat, in kcal, is needed to melt 200 g of ice at $0\,^\circ$C? ($L_f = 80\ \mathrm{cal\,g^{-1}}$)`, 16, 0, () => 200 * 80 / 1000,
    xr`$Q = mL = 200\times80 = 16\,000$ cal $= 16$ kcal.`),
  xq(2, 'Wien displacement law', xr`As the temperature of a hot body rises, the wavelength at which it emits most strongly`, 'decreases', ['increases', 'stays the same', 'first increases and then decreases'],
    xr`Wien's law: $\lambda_mT = $ constant. A hotter body has its peak at a shorter wavelength, which is why a heated metal goes from red to white.`),
  xq(2, 'radiation', xr`A surface that is a good absorber of radiation is also`, 'a good emitter', ['a poor emitter', 'a good reflector', 'a good insulator'],
    xr`Kirchhoff's law: at a given wavelength and temperature, good absorbers are good emitters, and good reflectors are poor absorbers and poor emitters.`),

  // ---------- Level 3 ----------
  xn(3, 'specific heat', xr`A 500 W heater, with no heat loss, raises the temperature of 2 kg of a liquid by 25 K in 5 minutes. Find the specific heat of the liquid in $\mathrm{J\,kg^{-1}K^{-1}}$.`, 3000, 0, () => 500 * 300 / (2 * 25),
    xr`Energy supplied $= 500\times300 = 150\,000$ J. $c = Q/(m\Delta T) = 150\,000/(2\times25) = 3000\ \mathrm{J\,kg^{-1}K^{-1}}$.`),
  xn(3, 'calorimetry', xr`A 200 g piece of aluminium ($c = 900\ \mathrm{J\,kg^{-1}K^{-1}}$) at $100\,^\circ$C is dropped into 500 g of water at $20\,^\circ$C ($c_w = 4200$). Find the final temperature in $^\circ$C (2 decimals), ignoring losses.`, 26.32, 0.02,
    () => (0.5 * 4200 * 20 + 0.2 * 900 * 100) / (0.5 * 4200 + 0.2 * 900),
    xr`Heat lost by Al = heat gained by water: $0.2\times900(100 - T) = 0.5\times4200(T - 20)$, so $180(100 - T) = 2100(T - 20)$. $18000 + 42000 = 2280T$ gives $T = 26.32\,^\circ$C.`),
  xn(3, 'expansion of cavities', xr`A metal block ($\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$) has an internal cavity of $10\ \mathrm{cm^3}$ at $20\,^\circ$C. By how much does the volume of the cavity increase, in $\mathrm{cm^3}$ (3 decimals), when the block is heated by 100 K?`, 0.036, 0.001, () => 10 * 3 * 1.2e-5 * 100,
    xr`A cavity expands as if it were solid material of the same kind: $\Delta V = \gamma V\Delta T = 3\alpha V\Delta T = 3\times1.2\times10^{-5}\times10\times100 = 0.036\ \mathrm{cm^3}$. It does not shrink.`,
    { trap: 'Thinking the walls expand inward so that the cavity gets smaller.' }),
  xn(3, 'Wien displacement law', xr`The radiation from a star peaks at 725 nm. Using $\lambda_mT = 2.9\times10^{-3}$ m K, find its surface temperature in K.`, 4000, 0, () => 2.9e-3 / 725e-9,
    xr`$T = \dfrac{2.9\times10^{-3}}{725\times10^{-9}} = 4000$ K.`),
  xn(3, 'specific heat of solids', xr`Dulong and Petit's law says the molar heat capacity of a solid is about $3R$. Estimate the specific heat of copper ($M = 63.5\ \mathrm{g\,mol^{-1}}$) in $\mathrm{J\,kg^{-1}K^{-1}}$ (nearest whole number). $R = 8.31$.`, 393, 2, () => 3 * 8.31 / 0.0635,
    xr`$c = 3R/M = \dfrac{24.93}{0.0635\ \mathrm{kg}} = 393\ \mathrm{J\,kg^{-1}K^{-1}}$ (the measured value is 385).`),
  xq(3, 'calorimetry', xr`Equal masses of aluminium ($c = 900$) and lead ($c = 130$ $\mathrm{J\,kg^{-1}K^{-1}}$), both at $100\,^\circ$C, are placed on separate blocks of ice at $0\,^\circ$C. Which melts more ice?`, 'Aluminium, because it stores more heat per kilogram', ['Lead, because it is denser', 'Both melt the same, because they start at the same temperature', 'Lead, because its atoms are heavier'],
    xr`Heat released $= mc\Delta T$. Equal $m$ and $\Delta T$, so the larger $c$ gives more heat and more melting: aluminium.`,
    { trap: 'Equal temperatures do not mean equal heat content.' }),
  xq(3, 'conduction', xr`A uniform rod, thermally insulated along its side, has its ends at $100\,^\circ$C and $0\,^\circ$C. In the steady state the temperature along the rod`, 'varies linearly with distance', ['varies exponentially with distance', 'is the same everywhere', 'varies as the square of the distance'],
    xr`Steady state: the heat current $kA\,dT/dx$ is the same at every cross-section. For uniform $k$ and $A$, $dT/dx$ is constant, so $T$ falls linearly.`),
  xa(3, 'boiling', xr`The temperature of a boiling liquid stays constant while heat is continuously supplied.`, xr`The heat supplied is used as latent heat to change the liquid into vapour, not to raise its temperature.`, 0,
    xr`Both are true and R explains A. At the boiling point the energy goes into overcoming the attraction between molecules (changing the phase) while the average kinetic energy stays fixed.`),
  xa(3, 'anomalous expansion of water', xr`A sealed glass bottle full of water may break when the water freezes.`, xr`Ice has a larger volume than the same mass of water.`, 0,
    xr`Both are true and R explains A. Water expands by about 9 % on freezing, and a rigid sealed container cannot accommodate it.`),
  xt(3, 'evaporation', xr`Evaporation of a liquid causes cooling.`, xr`The molecules with the highest speeds escape from the surface, so the average kinetic energy of those left behind decreases.`, 0,
    xr`Both are true and II explains I. The remaining liquid has a lower mean kinetic energy, so its temperature falls unless heat flows in.`),
  xm(3, 'heat constants', 'xm1', xr`Match each quantity in List I with its value in List II.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`Fusion of ice: $3.36\times10^5\ \mathrm{J\,kg^{-1}}$ (p). Vaporisation of water: $2.26\times10^6$ (q). Water: 4200 (r). Ice: 2100 (s), about half that of water. The 900 belongs to aluminium.`),
  xm(3, 'thermal expansion', 'xm2', xr`A rod with $\alpha = 1.0\times10^{-5}\ \mathrm{K^{-1}}$ is heated through 100 K. Match the quantities in List I with the changes in List II.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`$\alpha\Delta T = 10^{-3}$ (p); area coefficient $2\alpha$: $2\times10^{-3}$ (q); volume coefficient $3\alpha$: $3\times10^{-3}$ (r); density falls by about the same fraction as volume rises: $-3\times10^{-3}$ (s).`),
  xm(3, 'Stefan-Boltzmann law', 'xm3', xr`A black body radiates power $P = \sigma AT^4$. Match each change in List I with the factor by which $P$ changes.`, { A: 'r', B: 's', C: 'q', D: 'p' },
    xr`A: $2^4 = 16$ (r). B: $3^4 = 81$ (s). C: area $\propto r^2$, so $2^2 = 4$ (q). D: $(\tfrac12)^4\times2^2 = \tfrac1{16}\times4 = \tfrac14$ (p).`),
  xm(3, 'Wien displacement law', 'xm7', xr`Use Wien's law $\lambda_mT = 2.9\times10^{-3}$ m K to match each item.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`A: $2.9\times10^{-3}/5800 = 500$ nm (p). B: $2.9\times10^{-3}/310 = 9.35\ \mu$m, infrared (q). C: $T = 2.9\times10^{-3}/290\times10^{-9} = 10\,000$ K (r). D: $2.9\times10^{-3}/2900 = 1000$ nm (s).`),

  // ---------- Level 4 ----------
  xn(4, 'mixing and final state', xr`50 g of steam at $100\,^\circ$C is passed into 400 g of ice at $-10\,^\circ$C in an insulated vessel. How many grams of ice are left when equilibrium is reached? ($L_v = 540$, $L_f = 80\ \mathrm{cal\,g^{-1}}$, $c_{ice} = 0.5$, $c_w = 1\ \mathrm{cal\,g^{-1}\,^\circ C^{-1}}$)`, 25, 0, () => 400 - (50 * 540 + 50 * 100 - 400 * 0.5 * 10) / 80,
    xr`Heat available if the steam condenses and cools to $0\,^\circ$C: $50\times540 + 50\times100 = 27000 + 5000 = 32000$ cal. Heat to warm the ice to $0\,^\circ$C: $400\times0.5\times10 = 2000$ cal. Heat to melt all of it: $400\times80 = 32000$ cal. Available after warming: $30000$ cal, which melts $30000/80 = 375$ g. So $400 - 375 = 25$ g of ice remain, at $0\,^\circ$C.`,
    { trap: 'Assuming all the ice melts and computing a final temperature above 0 °C.' }),
  xn(4, 'mixing and final state', xr`100 g of ice at $-20\,^\circ$C is mixed with 50 g of water at $80\,^\circ$C in an insulated vessel. How many grams of ice remain? ($c_{ice} = 0.5$, $L_f = 80\ \mathrm{cal\,g^{-1}}$, $c_w = 1\ \mathrm{cal\,g^{-1}\,^\circ C^{-1}}$.) Give the answer to 1 decimal.`, 62.5, 0.1, () => 100 - (50 * 80 - 100 * 0.5 * 20) / 80,
    xr`The water can give $50\times80 = 4000$ cal when cooled to $0\,^\circ$C. Warming the ice to $0\,^\circ$C needs $100\times0.5\times20 = 1000$ cal. That leaves $3000$ cal, which melts $3000/80 = 37.5$ g. So $100 - 37.5 = 62.5$ g of ice remain, and the temperature is $0\,^\circ$C.`),
  xn(4, 'cooling curves', xr`Equal masses of water and an oil are cooled from $60\,^\circ$C to $40\,^\circ$C in identical containers under the same conditions. Water takes 100 s and the oil takes 60 s. Find the specific heat of the oil in $\mathrm{J\,kg^{-1}K^{-1}}$ (water: 4200).`, 2520, 0, () => 4200 * 60 / 100,
    xr`Under the same conditions the rate of heat loss is the same at the same temperatures, so $mc_w\Delta T/t_w = mc_o\Delta T/t_o$. $c_o = c_w\,t_o/t_w = 4200\times\dfrac{60}{100} = 2520\ \mathrm{J\,kg^{-1}K^{-1}}$ (the container's own heat capacity is neglected).`),
  xn(4, 'thermal stress', xr`A steel rod ($\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$, $Y = 2\times10^{11}$ Pa) is 1.000 m long and fits between two rigid walls with a gap of 0.3 mm in total. It is heated by 60 K. Find the stress in the rod in MPa.`, 84, 0.5, () => 2e11 * (1.2e-5 * 60 - 0.3e-3) / 1e6,
    xr`Free expansion $= \alpha L\Delta T = 1.2\times10^{-5}\times1\times60 = 0.72$ mm. The walls allow only 0.3 mm, so $0.42$ mm is suppressed. Strain $= 0.42\times10^{-3}/1 = 4.2\times10^{-4}$. Stress $= Y\times\text{strain} = 2\times10^{11}\times4.2\times10^{-4} = 8.4\times10^7$ Pa $= 84$ MPa.`,
    { trap: 'Using the full free expansion (0.72 mm), which ignores the gap.' }),
  xn(4, 'conduction at a junction', xr`Three identical rods (same material and cross-section) of lengths 1 m, 2 m and 4 m meet at a point $O$. Their other ends are held at $100\,^\circ$C, $60\,^\circ$C and $20\,^\circ$C respectively. Find the steady temperature of $O$ in $^\circ$C (1 decimal).`, 77.1, 0.1, () => (100 / 1 + 60 / 2 + 20 / 4) / (1 + 1 / 2 + 1 / 4),
    xr`In steady state the net heat flow into $O$ is zero. For equal $kA$, flow $\propto(T_i - T_O)/L_i$: $\dfrac{100 - T}{1} + \dfrac{60 - T}{2} + \dfrac{20 - T}{4} = 0$. Multiply by 4: $400 - 4T + 120 - 2T + 20 - T = 0$, so $7T = 540$ and $T = 77.1\,^\circ$C.`),
  xn(4, 'radiation', xr`A copper sphere of radius 1 cm (density $8900\ \mathrm{kg\,m^{-3}}$, $c = 390\ \mathrm{J\,kg^{-1}K^{-1}}$) at 500 K is a perfect black body in a vacuum chamber at 0 K. Find its initial rate of cooling in $\mathrm{K\,s^{-1}}$ (3 decimals). $\sigma = 5.67\times10^{-8}$.`, 0.306, 0.004,
    () => 5.67e-8 * 4 * Math.PI * 1e-4 * 500 ** 4 / (8900 * (4 / 3) * Math.PI * 1e-6 * 390),
    xr`Power radiated $= \sigma AT^4 = 5.67\times10^{-8}\times1.257\times10^{-3}\times500^4 = 4.45$ W. Mass $= 8900\times\tfrac43\pi(0.01)^3 = 0.0373$ kg; $mc = 14.5\ \mathrm{J\,K^{-1}}$. Rate $= 4.45/14.5 = 0.306\ \mathrm{K\,s^{-1}}$.`),
  xn(4, 'planetary temperature', xr`Mars receives $590\ \mathrm{W\,m^{-2}}$ from the Sun and reflects 25 % of it. Treating it as a black-body radiator with no atmosphere, find its equilibrium temperature in K (nearest whole number). $\sigma = 5.67\times10^{-8}$.`, 210, 1, () => Math.pow(590 * 0.75 / (4 * 5.67e-8), 0.25),
    xr`Absorbed power $= \pi R^2S(1 - A)$; radiated $= 4\pi R^2\sigma T^4$. $T^4 = \dfrac{S(1-A)}{4\sigma} = \dfrac{590\times0.75}{4\times5.67\times10^{-8}} = 1.95\times10^9$, so $T = 210$ K.`,
    { trap: 'Leaving out the 4: the planet absorbs over its cross-section πR² but radiates from its whole surface 4πR².' }),
  xn(4, 'thermometer', xr`A mercury thermometer has a bulb of volume $0.5\ \mathrm{cm^3}$ and a stem of cross-section $1\ \mathrm{mm^2}$. Mercury has $\gamma = 1.8\times10^{-4}\ \mathrm{K^{-1}}$ and the glass bulb $\gamma = 2.7\times10^{-5}\ \mathrm{K^{-1}}$. By how many mm does the mercury thread rise when the temperature rises by 100 K? (Ignore the expansion of the stem.)`, 7.65, 0.05, () => 500 * (1.8e-4 - 2.7e-5) * 100 / 1,
    xr`The bulb itself expands, so the apparent expansion of mercury is $\gamma_{app} = 1.8\times10^{-4} - 2.7\times10^{-5} = 1.53\times10^{-4}\ \mathrm{K^{-1}}$. $\Delta V = 0.5\times1.53\times10^{-4}\times100 = 7.65\times10^{-3}\ \mathrm{cm^3} = 7.65\ \mathrm{mm^3}$. The stem area is $1\ \mathrm{mm^2}$, so the thread rises $7.65$ mm.`),
  xq(4, 'Stefan-Boltzmann law', xr`Star A has twice the surface temperature of star B and half its radius. The ratio of the luminosities $L_A/L_B$ is`, '4', ['8', '16', '64'],
    xr`$L = 4\pi R^2\sigma T^4$. $L_A/L_B = (R_A/R_B)^2(T_A/T_B)^4 = (\tfrac12)^2\times2^4 = \tfrac14\times16 = 4$.`,
    { trap: '16 from the temperature alone; or 64 from using the cube of the radius ratio.' }),
  xs(4, 'heating curve', xr`Ice at $-20\,^\circ$C is heated by a steady source until it becomes steam. On the temperature-time graph, which are correct?`,
    [xr`The temperature rises faster per second in the ice stage than in the water stage`, 'There are flat portions at $0\\,^\\circ$C and $100\\,^\\circ$C', 'The flat portion at $100\\,^\\circ$C is longer than at $0\\,^\\circ$C', 'The temperature rises slowly during the melting', 'The steam stage is steeper than the water stage'], [0, 1, 2, 4],
    xr`Rate of rise $= P/(mc)$: ice ($c = 2100$) rises faster than water (4200), and steam ($c\approx2000$) rises faster than water (true, true). The plateaus are where latent heat is absorbed at constant temperature; $L_v = 2.26\times10^6 > L_f = 3.36\times10^5$, so the 100 °C plateau is about seven times longer (true, true). During melting the temperature is constant, not slowly rising (false).`),
  xs(4, 'conduction', xr`Heat flows steadily along a rod of non-uniform cross-section whose curved side is insulated. Which are correct?`,
    ['The heat current is the same at every cross-section', 'For a uniform rod, the temperature gradient is the same everywhere', xr`The thermal resistance of a uniform rod is $L/(kA)$`, 'In a non-uniform rod the temperature gradient is larger where the cross-section is smaller', 'The temperature at each point keeps rising with time'], [0, 1, 2, 3],
    xr`Steady state means no storage, so $H = kA\,|dT/dx|$ is constant (true). Uniform $A$ gives constant gradient (true), and $R = L/kA$ (true). If $A$ is smaller the gradient must be larger to carry the same $H$ (true). In steady state temperatures do not change with time (false).`),
  xs(4, 'cooling', xr`A body cools in a room at $20\,^\circ$C according to Newton's law, from $80\,^\circ$C to $60\,^\circ$C in 10 minutes. Which are correct?`,
    ['The rate of cooling is proportional to the difference from room temperature', 'The temperature approaches $20\\,^\\circ$C exponentially', 'The fall from $60\\,^\\circ$C to $40\\,^\\circ$C takes less than 10 minutes', 'Equal fractional decreases of $(T - 20)$ take equal times', 'The law holds well for large temperature differences'], [0, 1, 3],
    xr`The first, second and fourth are the content of Newton's law. $\ln\dfrac{60}{40} = 0.405$ takes 10 min, and $\ln\dfrac{40}{20} = 0.693$ takes $17.1$ min: the second interval is longer (third false). The law is accurate only for small differences (last false).`),
  xs(4, 'thermal stress', xr`A straight steel rod is clamped between rigid walls and heated by $\Delta T$. Which are correct?`,
    [xr`The stress is $Y\alpha\Delta T$`, xr`The force on each wall is $YA\alpha\Delta T$`, 'The length of the rod does not change', xr`The strain is $-\alpha\Delta T$ (compressive)`, 'The stress is larger for a longer rod'], [0, 1, 2, 3],
    xr`Clamped, the rod cannot expand, so the compressive strain needed to cancel the free expansion is $\alpha\Delta T$, giving stress $Y\alpha\Delta T$, force $YA\alpha\Delta T$ and unchanged length. The length does not appear in the stress (last false).`),
  xm(4, 'mixing and final state', 'xm4', xr`Each mixture in List I is isolated and has reached equilibrium. Match it with the outcome in List II.`, { A: 'q', B: 'p', C: 'r', D: 's' },
    xr`A: the water gives $200\times20 = 4000$ cal, enough to melt 50 g; 50 g of ice is left (q). B: the water gives $8000$ cal, exactly enough to melt all 100 g, giving water at $0\,^\circ$C (p). C: the water gives $10000$ cal; 8000 melts the ice and 2000 raises 200 g by $10\,^\circ$C (r). D: simple mixing: $(200\times20 + 100\times80)/300 = 40\,^\circ$C (s).`),
  xm(4, 'conduction', 'xm5', xr`Rod A has conductivity $2k$ and rod B has $k$, with equal length and cross-section. Match the items in List I with those in List II.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`Series: $2k(100 - T) = k(T - 0)$ gives $T = 200/3 = 66.7\,^\circ$C (p). With B at the hot end: $k(100 - T) = 2kT$ gives $T = 33.3\,^\circ$C (q). Effective $k$ in series $= \dfrac{2L}{L/2k + L/k} = \dfrac{4k}{3}$ (r). In parallel $= (2k + k)/2 = 3k/2$ (s). The $3k$ would be the sum, not the effective conductivity for double the area.`),
  xm(4, 'thermal stress', 'xm8', xr`A steel rod is heated by 50 K. Match the quantities.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`Strain $= \alpha\Delta T = 1.2\times10^{-5}\times50 = 6\times10^{-4}$ (p). Stress $= Y\alpha\Delta T = 1.2\times10^8$ Pa (q). Force $= 1.2\times10^8\times10^{-4} = 1.2\times10^4$ N (r). With a gap of half the free expansion the suppressed strain is $3\times10^{-4}$, so the stress is $6\times10^7$ Pa (s).`),
  xa(4, 'radiation', xr`A body at the same temperature as its surroundings still emits radiation.`, xr`A body at any temperature above absolute zero radiates, and it absorbs exactly as much from the surroundings when in thermal equilibrium (Prevost's theory of exchanges).`, 0,
    xr`Both are true and R explains A. The net energy flow is zero, but each of emission and absorption continues.`),
  xa(4, 'expansion', xr`Two metal spheres of the same material and outer radius, one solid and one hollow, expand by the same fractional volume when heated through the same temperature.`, xr`A cavity in a body expands as if it were made of the same material as the body.`, 0,
    xr`Both are true and R explains A. The outer volume of the hollow sphere expands by $\gamma V_{outer}\Delta T$ just like the solid, because the cavity grows with the material.`),
  xa(4, 'Newton\'s law of cooling', xr`A graph of $\ln(T - T_0)$ against time for a cooling body (small excess temperature) is a straight line.`, xr`The excess temperature $T - T_0$ decays exponentially with time.`, 0,
    xr`Both are true and R explains A. $T - T_0 = (T_i - T_0)e^{-kt}$ gives $\ln(T - T_0) = \ln(T_i - T_0) - kt$, a straight line of slope $-k$.`),
  xt(4, 'heat and temperature', xr`A body with more internal energy is always at a higher temperature.`, xr`Heat flows spontaneously from a hotter body to a colder body.`, 3,
    xr`II is true. I is false: internal energy depends on mass and material too; a lake at $10\,^\circ$C has far more internal energy than a cup of tea at $80\,^\circ$C, yet heat flows from the tea to the lake.`),
  xt(4, 'steady conduction', xr`In steady-state conduction through a uniform rod with insulated sides, the temperature falls linearly along the rod.`, xr`The heat current is the same at every cross-section.`, 0,
    xr`Both are true and II explains I. $H = kA\,dT/dx$ is constant and $k$, $A$ are uniform, so $dT/dx$ is constant.`),


  // ---------- Level 4-5 more ----------
  xn(4, 'heating with loss', xr`A 100 W heater is immersed in a large tank. The tank loses heat to the room at $20\,^\circ$C at a rate $2\ \mathrm{W\,K^{-1}}$ times the excess temperature. What steady temperature, in $^\circ$C, does the tank reach?`, 70, 0, () => 20 + 100 / 2,
    xr`In steady state, power in = power lost: $100 = 2(T - 20)$, so $T - 20 = 50$ and $T = 70\,^\circ$C.`),
  xn(5, 'radiation shield', xr`Two large parallel black plates in vacuum are at 600 K and 300 K. A thin black shield is placed between them and reaches steady state. Find the shield's temperature in K (nearest whole number). $\sigma = 5.67\times10^{-8}$.`, 512, 1, () => Math.pow((600 ** 4 + 300 ** 4) / 2, 0.25),
    xr`Steady state: power received equals power given, per unit area: $\sigma(T_1^4 - T_s^4) = \sigma(T_s^4 - T_2^4)$, so $T_s^4 = \dfrac{T_1^4 + T_2^4}{2} = \dfrac{1.296\times10^{11} + 8.1\times10^{9}}{2} = 6.885\times10^{10}$. $T_s = 512$ K.`,
    { trap: 'The shield temperature is not the arithmetic mean (450 K): the fourth powers average, not the temperatures.' }),
  xn(5, 'radiation shield', xr`Two large parallel black plates in vacuum exchange radiation at a net rate $F$. Three thin black shields are placed in between, all parallel, and the system reaches steady state. The new net rate is $F/N$. Find $N$.`, 4, 0, () => 3 + 1,
    xr`Each shield must pass on exactly what it receives, so the temperature drop in $T^4$ is shared equally among the $n + 1$ gaps. The net flux is $\sigma(T_1^4 - T_2^4)/(n + 1)$. With 3 shields: $F/4$, so $N = 4$.`),
  xn(5, 'stellar radius', xr`A star has a luminosity of $3.8\times10^{28}$ W and its spectrum peaks at 500 nm ($\lambda_mT = 2.9\times10^{-3}$ m K). Treating it as a black body, find its radius in units of $10^9$ m (2 decimals). $\sigma = 5.67\times10^{-8}$.`, 6.87, 0.05,
    () => Math.sqrt(3.8e28 / (4 * Math.PI * 5.67e-8 * (2.9e-3 / 500e-9) ** 4)) / 1e9,
    xr`Wien: $T = 2.9\times10^{-3}/500\times10^{-9} = 5800$ K. $L = 4\pi R^2\sigma T^4$, so $R = \sqrt{\dfrac{L}{4\pi\sigma T^4}} = \sqrt{\dfrac{3.8\times10^{28}}{4\pi\times5.67\times10^{-8}\times1.13\times10^{15}}} = 6.87\times10^9$ m (about 10 solar radii).`),
  xs(5, 'radiation shield', xr`Two large parallel black plates at 600 K and 300 K are separated by a vacuum. A thin black shield is placed between them and reaches steady state. Which are correct?`,
    ['The shield settles at about 512 K', 'The net radiant flux from the hot plate to the cold plate is halved', 'With two such shields the net flux would be one third of the original', 'The shield temperature is 450 K, the mean of 600 K and 300 K', 'The flux from the hot plate to the shield is larger than the flux from the shield to the cold plate'], [0, 1, 2],
    xr`$\sigma(T_1^4 - T_s^4) = \sigma(T_s^4 - T_2^4)$ gives $T_s^4 = (T_1^4 + T_2^4)/2$, so $T_s = 512$ K (true, and 450 K is false). Each gap now carries half of the old $T^4$ difference, so the net flux is halved (true), and with $n$ shields it is $1/(n+1)$ (true for $n = 2$: one third). In steady state the two fluxes are equal (false).`),
  xs(5, 'radiative cooling', xr`A black body at temperature $T$ is in surroundings at $T_0$, with net radiative loss $P = \sigma A(T^4 - T_0^4)$. Which are correct?`,
    [xr`$P = 0$ when $T = T_0$`, xr`For small excess $\Delta T = T - T_0$, $P\approx4\sigma AT_0^3\,\Delta T$ (Newton's law)`, xr`A body at 600 K in surroundings at 300 K loses heat at $\tfrac{15}{16}$ of the rate at which it would lose it into a 0 K vacuum`, xr`A body at 600 K radiates 16 times as much power as an identical body at 300 K`, xr`$P\propto(T - T_0)^4$`], [0, 1, 2, 3],
    xr`At equal temperatures emission and absorption balance (true). Expanding $T^4 - T_0^4 = (T - T_0)(T + T_0)(T^2 + T_0^2)\approx4T_0^3\Delta T$ for small $\Delta T$ (true). $1 - (300/600)^4 = 15/16$ (true). $(600/300)^4 = 16$ (true). The fourth power belongs to $T$ and $T_0$ separately, not to their difference (false).`),
  xs(5, 'conduction through a cylinder', xr`Heat flows steadily and radially outward through a long hollow cylinder (inner radius $r_1$, outer radius $r_2$, conductivity $k$, length $L$). Which are correct?`,
    ['The heat current through every cylindrical shell is the same', 'The temperature falls logarithmically with the radius', 'The temperature gradient is larger at smaller radius', xr`The thermal resistance is $\dfrac{\ln(r_2/r_1)}{2\pi kL}$`, 'The temperature falls linearly with the radius'], [0, 1, 2, 3],
    xr`Steady state means the same $H$ through every shell: $H = -k\,(2\pi rL)\,\dfrac{dT}{dr}$, so $dT/dr\propto1/r$ (larger at small $r$) and $T$ varies as $\ln r$. Integrating gives $R = \dfrac{\ln(r_2/r_1)}{2\pi kL}$. It is not linear in $r$ (last false).`),
  xs(5, 'changes of state', xr`Which of these are correct?`,
    ['The latent heat of vaporisation of water at $100\\,^\\circ$C is larger than its latent heat of fusion', 'At the triple point ice, water and water vapour exist together in equilibrium', 'The boiling point of water rises when the pressure rises', 'The melting point of ice falls when the pressure rises', 'A pressure cooker works by lowering the boiling point of water'], [0, 1, 2, 3],
    xr`$L_v = 2.26\times10^6 > L_f = 3.36\times10^5$ (true). The triple point of water is at 273.16 K and 611 Pa (true). Raising the pressure raises the boiling point (true) and, because ice is less dense than water, lowers the melting point (true). A pressure cooker raises the boiling point and so cooks faster (the last is false).`),
  xs(4, 'stars', xr`Star A has surface temperature 6000 K and radius $R$. Star B has surface temperature 3000 K and radius $2R$. Which are correct?`,
    [xr`The wavelength of peak emission of A is half that of B`, xr`The luminosity of A is 4 times that of B`, 'B emits more total power than A', xr`The power radiated per unit area of A is 16 times that of B`, 'A looks bluer than B'], [0, 1, 3, 4],
    xr`Wien: $\lambda_m\propto1/T$, so A's peak is at half the wavelength (true, and bluer: true). $L\propto R^2T^4$: $L_A/L_B = (1/2)^2\times2^4 = 4$ (true). A emits 4 times more, so the third is false. Per unit area, $P\propto T^4 = 16$ (true).`),
  xs(4, 'specific heat', xr`Which statements about heat capacity and specific heat are correct?`,
    [xr`The heat capacity of a body equals $mc$`, 'The high specific heat of water moderates the climate near the sea', 'The heat capacity of a body depends on its mass', 'All materials have the same specific heat per kilogram', 'The specific heat of a gas depends on whether the volume or the pressure is kept constant'], [0, 1, 2, 4],
    xr`$C = mc$ (true) and so depends on mass (true). Water's large $c$ means large energy changes cause small temperature changes (true). Different materials have different $c$ (false). For gases $C_p\ne C_v$ (true).`),
  xm(5, 'planetary temperature', 'xm6', xr`Treat each planet as a black body with no atmosphere, using $T = \left[\dfrac{S(1 - A)}{4\sigma}\right]^{1/4}$. Match each planet with its equilibrium temperature.`, { A: 'r', B: 'p', C: 'q', D: 's' },
    xr`Earth: $T^4 = 1361\times0.7/(4\times5.67\times10^{-8}) = 4.2\times10^9$, $T = 255$ K (r). Mars: 210 K (p). Venus (albedo 0.77): $T = 227$ K (q), colder than Earth even though closer to the Sun. Mercury: 436 K (s). The 270 K would be that of the Moon.`),
  xt(5, 'pendulum clock', xr`When the temperature of a pendulum clock rises by $\Delta T$, it loses a fraction $\tfrac12\alpha\Delta T$ of time.`, xr`The period is $T = 2\pi\sqrt{L/g}$ and the length changes by $\alpha L\,\Delta T$.`, 0,
    xr`Both are true and II explains I. $\Delta T_{period}/T = \tfrac12\Delta L/L = \tfrac12\alpha\Delta T$, so the clock runs slow by that fraction.`),
  xb(5, 'statements', { type: 'mcq', format: 'statements', q: xr`How many of these are correct?<br>(a) Water has its maximum density at $4\,^\circ$C.<br>(b) The specific heat of water is larger than that of ice.<br>(c) The latent heat of vaporisation of water is the same at all temperatures.<br>(d) For a black body $\lambda_mT$ is a constant.<br>(e) Doubling the length of a rod doubles the rate of heat conduction through it.`,
    options: ['1', '2', '3', '4'], answer: 2,
    sol: xr`(a) true. (b) true: 4200 against 2100. (c) false: $L_v$ varies with the temperature (it is smaller at higher temperature). (d) true (Wien). (e) false: $H\propto1/L$, so it halves. Three are correct.` }),

  xn(3, 'steam calorimetry', xr`How much heat, in kcal, is given out when 100 g of steam at $100\,^\circ$C condenses and the water cools to $60\,^\circ$C? ($L_v = 540\ \mathrm{cal\,g^{-1}}$, $c_w = 1\ \mathrm{cal\,g^{-1}\,^\circ C^{-1}}$)`, 58, 0, () => (100 * 540 + 100 * 40) / 1000,
    xr`Condensing: $100\times540 = 54\,000$ cal. Cooling the water by $40\,^\circ$C: $100\times1\times40 = 4000$ cal. Total $= 58\,000$ cal $= 58$ kcal.`),

  // ---------- passages ----------
  xn(3, 'electric heating', xr`How long, in s, does the heater take to bring the water to $100\,^\circ$C?`, 700, 0.5, () => 0.5 * 4200 * 80 / (300 * 0.8),
    xr`Heat needed $= 0.5\times4200\times80 = 168\,000$ J. Useful power $= 0.8\times300 = 240$ W. Time $= 168000/240 = 700$ s.`, { format: 'passage', group: 'xp1' }),
  xn(4, 'electric heating', xr`The heater then keeps running until 100 g of water has boiled away. How long, in s (nearest whole number), does that take?`, 942, 1, () => 0.1 * 2.26e6 / 240,
    xr`Latent heat needed $= 0.1\times2.26\times10^6 = 226\,000$ J. At 240 W: $226000/240 = 941.7\approx942$ s.`, { format: 'passage', group: 'xp1' }),
  xn(4, 'electric heating', xr`How much electrical energy, in kWh (3 decimals), is used from the start until 100 g has boiled away?`, 0.137, 0.001, () => (168000 + 226000) / 0.8 / 3.6e6,
    xr`Useful energy $= 168\,000 + 226\,000 = 394\,000$ J. Electrical energy $= 394000/0.8 = 492\,500$ J $= 492500/3.6\times10^6 = 0.137$ kWh.`, { format: 'passage', group: 'xp1', trap: 'Using the useful energy instead of the electrical energy.' }),
  xn(4, 'conduction through a tapered rod', xr`Find the thermal resistance of the rod in $\mathrm{K\,W^{-1}}$ (2 decimals). (For a rod of radius $r(x)$, $R = \int dx/(k\pi r^2)$.)`, 1.99, 0.01, () => 0.5 / (Math.PI * 400 * 0.01 * 0.02),
    xr`With $r = r_1 + (r_2 - r_1)x/L$, $\int_0^L\dfrac{dx}{\pi kr^2} = \dfrac{1}{\pi k}\cdot\dfrac{L}{(r_2 - r_1)}\left(\dfrac1{r_1} - \dfrac1{r_2}\right) = \dfrac{L}{\pi kr_1r_2}$. $R = \dfrac{0.5}{\pi\times400\times0.01\times0.02} = 1.99\ \mathrm{K\,W^{-1}}$.`, { format: 'passage', group: 'xp2' }),
  xn(4, 'conduction through a tapered rod', xr`Find the rate of heat flow along the rod in W (1 decimal).`, 50.3, 0.2, () => 100 / (0.5 / (Math.PI * 400 * 0.01 * 0.02)),
    xr`$H = \Delta T/R = 100/1.989 = 50.3$ W.`, { format: 'passage', group: 'xp2' }),
  xn(5, 'conduction through a tapered rod', xr`Find the temperature, in $^\circ$C (1 decimal), at the midpoint of the rod (0.25 m from the hot end).`, 33.3, 0.2,
    () => { const R = (x) => x / (Math.PI * 400 * 0.01 * (0.01 + 0.01 * x / 0.5)); return 100 - (100 / R(0.5)) * R(0.25); },
    xr`At $x = 0.25$ m the radius is 1.5 cm. Resistance of the first half $= \dfrac{x}{\pi kr_1r(x)} = \dfrac{0.25}{\pi\times400\times0.01\times0.015} = 1.326\ \mathrm{K\,W^{-1}}$. Temperature drop $= H\times R = 50.27\times1.326 = 66.7$ K. So $T = 100 - 66.7 = 33.3\,^\circ$C, not 50 °C: the thin hot half has most of the resistance.`, { format: 'passage', group: 'xp2', trap: 'Saying 50 °C because the point is at the middle of the rod.' }),
];

const xgens = [
  { id: 'tp-g21', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'conduction through a tapered rod',
    make(rng) {
      const r1 = xchoose(rng, [1, 1.5, 2]), m = xchoose(rng, [2, 3]), L = xchoose(rng, [0.5, 1]), k = xchoose(rng, [200, 400]), dT = xchoose(rng, [50, 80, 100]);
      const r2 = r1 * m; const H = dT * Math.PI * k * (r1 / 100) * (r2 / 100) / L; const answer = +H.toFixed(2);
      return { r1, r2, L, k, dT, answer, tol: Math.max(0.05, answer * 0.01), unit: 'W',
        q: `A round rod (k = ${k} W m⁻¹ K⁻¹) is ${L} m long, with radius ${r1} cm at one end and ${r2} cm at the other. The ends are kept ${dT} K apart and the curved surface is insulated. Find the steady rate of heat flow in W.`,
        sol: `For a linearly tapering rod, R = L/(πk r₁r₂) = ${L}/(π×${k}×${r1 / 100}×${r2 / 100}) = ${xfmt(L / (Math.PI * k * r1 / 100 * r2 / 100), 4)} K/W. H = ΔT/R = ${dT}/${xfmt(L / (Math.PI * k * r1 / 100 * r2 / 100), 4)} = ${xfmt(answer, 4)} W.` };
    },
    verify: (p) => { let R = 0; const n = 20000; for (let i = 0; i < n; i++) { const x = (i + 0.5) / n * p.L, r = (p.r1 + (p.r2 - p.r1) * x / p.L) / 100; R += (p.L / n) / (p.k * Math.PI * r * r); } return p.dT / R; } },
  { id: 'tp-g22', type: 'nat', level: 3, exams: xex(3, 'nat'), sub: 'mixing and final state',
    make(rng) {
      const mi = xchoose(rng, [100, 150, 200, 300]), mw = xchoose(rng, [50, 100, 150, 200]), tw = xchoose(rng, [20, 30, 40, 50]);
      if (mw * tw / 80 >= mi) return xgens[1].make(rng);
      const left = mi - mw * tw / 80; const answer = +left.toFixed(2);
      return { mi, mw, tw, answer, tol: 0.05, unit: 'g',
        q: `${mi} g of ice at 0 °C is mixed with ${mw} g of water at ${tw} °C in an insulated vessel. How many grams of ice remain at equilibrium? (L_f = 80 cal/g, c_w = 1 cal/g °C)`,
        sol: `The water can give ${mw}×${tw} = ${mw * tw} cal on cooling to 0 °C. This melts ${mw * tw}/80 = ${xfmt(mw * tw / 80, 4)} g of ice, less than ${mi} g, so the final temperature is 0 °C and ${mi} − ${xfmt(mw * tw / 80, 4)} = ${xfmt(answer, 4)} g of ice remain.` };
    },
    verify: (p) => p.mi - (p.mw * 1 * p.tw) / 80 },
  { id: 'tp-g23', type: 'nat', level: 5, exams: xex(5, 'nat'), sub: 'radiation shield',
    make(rng) {
      const t1 = xchoose(rng, [500, 600, 800]), t2 = xchoose(rng, [200, 300, 400]); const answer = +Math.pow((t1 ** 4 + t2 ** 4) / 2, 0.25).toFixed(1);
      return { t1, t2, answer, tol: 0.5, unit: 'K',
        q: `Two large parallel black plates in vacuum are at ${t1} K and ${t2} K. A thin black shield between them reaches steady state. Find the shield's temperature in K.`,
        sol: `In steady state σ(T₁⁴ − T_s⁴) = σ(T_s⁴ − T₂⁴), so T_s⁴ = (T₁⁴ + T₂⁴)/2 = (${xfmt(t1 ** 4, 4)} + ${xfmt(t2 ** 4, 4)})/2 = ${xfmt((t1 ** 4 + t2 ** 4) / 2, 4)}. T_s = ${xfmt(answer, 4)} K.` };
    },
    verify: (p) => { let lo = 0, hi = 2000; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if ((p.t1 ** 4 - mid ** 4) > (mid ** 4 - p.t2 ** 4)) lo = mid; else hi = mid; } return lo; } },
  { id: 'tp-g24', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'radiative cooling',
    make(rng) {
      const r = xchoose(rng, [0.5, 1, 2]), T = xchoose(rng, [400, 500, 600]); const answer = +(3 * 5.67e-8 * T ** 4 / (8900 * 390 * r / 100)).toFixed(3);
      return { r, T, answer, tol: Math.max(0.003, answer * 0.01), unit: 'K/s',
        q: `A copper sphere of radius ${r} cm (ρ = 8900 kg/m³, c = 390 J/kg K) at ${T} K is a perfect black body in a vacuum chamber at 0 K. Find its initial rate of cooling in K/s. σ = 5.67×10⁻⁸.`,
        sol: `Power radiated = σ·4πr²·T⁴. Heat capacity = (4/3)πr³ρc. Rate = 3σT⁴/(ρ c r) = 3×5.67×10⁻⁸×${xfmt(T ** 4, 4)}/(8900×390×${r / 100}) = ${xfmt(answer, 4)} K/s.` };
    },
    verify: (p) => { const rr = p.r / 100; const A = 4 * Math.PI * rr * rr, m = 8900 * (4 / 3) * Math.PI * rr ** 3; return 5.67e-8 * A * p.T ** 4 / (m * 390); } },
  { id: 'tp-g25', type: 'nat', level: 3, exams: xex(3, 'nat'), sub: 'specific heat of solids',
    make(rng) {
      const [nm, M] = xchoose(rng, [['copper', 63.5], ['aluminium', 27], ['lead', 207], ['iron', 55.8], ['silver', 108]]); const answer = +(3 * 8.31 / (M / 1000)).toFixed(1);
      return { M, answer, tol: Math.max(1, answer * 0.01), unit: 'J/kg K',
        q: `Use Dulong and Petit's law (molar heat capacity ≈ 3R, R = 8.31) to estimate the specific heat of ${nm} (M = ${M} g/mol), in J kg⁻¹ K⁻¹.`,
        sol: `c = 3R/M = 3×8.31/${M / 1000} kg = ${xfmt(answer, 4)} J kg⁻¹ K⁻¹.` };
    },
    verify: (p) => 24.93 / (p.M / 1000) },
  { id: 'tp-g26', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'thermometer',
    make(rng) {
      const v = xchoose(rng, [0.4, 0.5, 0.8]), A = xchoose(rng, [0.5, 1, 2]); const dT = xchoose(rng, [50, 100]); const answer = +(v * 1e3 * (1.8e-4 - 2.7e-5) * dT / A).toFixed(3);
      return { v, A, dT, answer, tol: Math.max(0.03, answer * 0.01), unit: 'mm',
        q: `A mercury thermometer has a bulb of volume ${v} cm³ and a stem of cross-section ${A} mm². Mercury has γ = 1.8×10⁻⁴ K⁻¹ and the glass γ = 2.7×10⁻⁵ K⁻¹. By how many mm does the thread rise for a ${dT} K rise? (Ignore the stem's expansion.)`,
        sol: `Apparent expansion coefficient = 1.8×10⁻⁴ − 2.7×10⁻⁵ = 1.53×10⁻⁴ K⁻¹. ΔV = ${v * 1000} mm³ × 1.53×10⁻⁴ × ${dT} = ${xfmt(v * 1000 * 1.53e-4 * dT, 4)} mm³. Rise = ΔV/A = ${xfmt(answer, 4)} mm.` };
    },
    verify: (p) => (p.v * 1000 * 1.8e-4 * p.dT - p.v * 1000 * 2.7e-5 * p.dT) / p.A },
  { id: 'tp-g27', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'thermal stress',
    make(rng) {
      const gap = xchoose(rng, [0.2, 0.3, 0.4, 0.5]), dT = xchoose(rng, [40, 50, 60, 80]); const L = 1; const free = 1.2e-5 * L * dT * 1000; // mm
      const answer = +(2e11 * ((free - gap) * 1e-3) / L / 1e6).toFixed(1);
      return { gap, dT, free, answer, tol: Math.max(0.5, answer * 0.01), unit: 'MPa',
        q: `A steel rod (α = 1.2×10⁻⁵ K⁻¹, Y = 2×10¹¹ Pa) 1.000 m long fits between two rigid walls with a total gap of ${gap} mm. It is heated by ${dT} K. Find the stress in the rod in MPa.`,
        sol: `Free expansion = αLΔT = 1.2×10⁻⁵×1×${dT} = ${xfmt(free, 4)} mm. Suppressed: ${xfmt(free, 4)} − ${gap} = ${xfmt(free - gap, 4)} mm, a strain of ${xfmt((free - gap) / 1000, 4)}. Stress = Yε = ${xfmt(answer, 4)} MPa.` };
    },
    verify: (p) => 2e11 * (1.2e-5 * p.dT - p.gap * 1e-3) / 1e6 },
  { id: 'tp-g28', type: 'mcq', level: 4, exams: xex(4, 'mcq'), sub: 'Stefan-Boltzmann law',
    make(rng) {
      const a = xchoose(rng, [2, 3, 0.5]), b = xchoose(rng, [2, 3, 0.5, 4]); const ratio = a ** 4 * b ** 2;
      const f = (x) => xfmt(x, 3);
      const o = xsh(rng, f(ratio), [f(a ** 4 * b), f(a ** 2 * b ** 2), f(a ** 4 * b ** 3)]);
      return { a, b, options: o.options, answer: o.answer,
        q: `Star A has ${a === 0.5 ? 'half' : a + ' times'} the surface temperature of star B and ${b === 0.5 ? 'half' : b + ' times'} its radius. Find the ratio of luminosities L_A/L_B.`,
        sol: `L = 4πR²σT⁴, so L_A/L_B = (R_A/R_B)²(T_A/T_B)⁴ = ${b}² × ${a}⁴ = ${f(b ** 2)} × ${f(a ** 4)} = ${f(ratio)}. The other options use the radius or temperature to the wrong power.` };
    },
    verify: (p) => p.options.indexOf(xfmt((4 * Math.PI * (p.b) ** 2 * 5.67e-8 * p.a ** 4) / (4 * Math.PI * 5.67e-8), 3)) },
  { id: 'tp-g29', type: 'mcq', level: 3, exams: xex(3, 'mcq'), sub: 'conduction',
    make(rng) {
      const fa = xchoose(rng, [0.5, 2, 3]), fl = xchoose(rng, [0.5, 2, 4]), ft = xchoose(rng, [1, 2, 3]); const ratio = fa * ft / fl;
      const f = (x) => `×${xfmt(x, 3)}`;
      const o = xsh(rng, f(ratio), [f(fa * ft * fl), f(fa * fl / ft), f(fa / (fl * ft))].filter((v) => true));
      return { fa, fl, ft, options: o.options, answer: o.answer,
        q: `A rod conducts heat steadily. Its cross-sectional area is multiplied by ${fa}, its length by ${fl} and the temperature difference across it by ${ft}. By what factor does the rate of heat flow change?`,
        sol: `H = kAΔT/L, so H changes by (${fa} × ${ft})/${fl} = ${xfmt(ratio, 3)}.` };
    },
    verify: (p) => p.options.indexOf(`×${xfmt(p.fa * p.ft / p.fl, 3)}`) },
  { id: 'tp-g30', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'conduction at a junction',
    make(rng) {
      const Ls = xchoose(rng, [[1, 2, 4], [0.5, 1, 2], [1, 1, 2], [2, 4, 4]]); const Ts = [xchoose(rng, [100, 90, 80]), xchoose(rng, [50, 60, 40]), xchoose(rng, [0, 10, 20])];
      const answer = +(Ts.reduce((s, t, i) => s + t / Ls[i], 0) / Ls.reduce((s, l) => s + 1 / l, 0)).toFixed(2);
      return { Ls, Ts, answer, tol: 0.1, unit: '°C',
        q: `Three identical rods (same material and cross-section) of lengths ${Ls.join(' m, ')} m meet at a point O. Their far ends are held at ${Ts.join(' °C, ')} °C respectively. Find the steady temperature of O in °C.`,
        sol: `Net heat flow into O is zero: Σ(T_i − T)/L_i = 0, so T = Σ(T_i/L_i)/Σ(1/L_i) = ${xfmt(Ts.reduce((s, t, i) => s + t / Ls[i], 0), 5)}/${xfmt(Ls.reduce((s, l) => s + 1 / l, 0), 5)} = ${xfmt(answer, 4)} °C.` };
    },
    verify: (p) => { let lo = Math.min(...p.Ts), hi = Math.max(...p.Ts); for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; const net = p.Ts.reduce((s, t, k) => s + (t - mid) / p.Ls[k], 0); if (net > 0) lo = mid; else hi = mid; } return lo; } },
];

export default { topic: 'thermal-properties', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] };
