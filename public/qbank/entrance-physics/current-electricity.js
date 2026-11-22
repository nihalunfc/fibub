// Current electricity: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EXB = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const exFor = (level, type) => (type === 'mcq' && level <= 3 ? [...EXB[level], 'cuet'] : EXB[level]);
const QE = 1.6e-19; const ME = 9.1e-31;
const S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const tx = (x, sig = 3) => {
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e4 || a < 1e-2) { const e = Math.floor(Math.log10(a)); let m = +(x / 10 ** e).toPrecision(sig); if (Math.abs(m) >= 10) { m /= 10; return `${+m.toPrecision(sig)}\\times10^{${e + 1}}`; } return `${m}\\times10^{${e}}`; }
  return S(x, sig);
};
let k = 0; let c = 0;
const nid = () => `ec-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: exFor(level, o.type), sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
// numeric mcq: options formatted alike with a unit
const mn = (level, sub, q, correct, wrongs, unit, sol, o = {}) => {
  const f = (v) => `${fmt(v, 3)}${unit ? ' ' + unit : ''}`;
  return mcq(level, sub, q, f(correct), wrongs.map(f), sol, o);
};
const nat = (level, sub, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
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
const asrt = (level, sub, A, R, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
const EC = r`Take $e = 1.6\times10^{-19}$ C.`;

const items = [
  // ---------- Level 1 ----------
  mcq(1, 'electric current', r`The SI unit of electric current, the ampere, is equal to`, r`one coulomb per second`, [r`one volt per coulomb`, r`one joule per second`, r`one coulomb per volt`],
    r`$I = Q/t$, so 1 A = 1 C/s. A joule per second is a watt, a volt per coulomb is not a unit of anything common, and a coulomb per volt is a farad.`),
  mcq(1, 'electric current', r`In a metal wire carrying current, the direction of the conventional current is`, 'opposite to the direction of drift of the electrons', ['the same as the direction of drift of the electrons', 'perpendicular to the drift of the electrons', 'random'],
    r`By convention current is the flow of positive charge. The charge carriers in a metal are electrons (negative), so they drift opposite to the conventional current.`),
  nat(1, 'electric current', r`A steady current of 0.5 A flows in a wire for 20 s. How much charge passes any cross-section (in C)?`, 0.5 * 20, 0.01, 1,
    r`$Q = It = 0.5\times20 = 10$ C.`, { unit: 'C' }),
  mcq(1, 'Ohm\'s law', r`For an ohmic conductor at constant temperature, the graph of $V$ (on the vertical axis) against $I$ is`, 'a straight line through the origin', ['a parabola', 'a straight line with a negative slope', 'a curve that flattens out'],
    r`$V = IR$ with constant $R$ gives a straight line through the origin whose slope is $R$.`),
  nat(1, 'Ohm\'s law', r`A resistor carries 3 A when 12 V is applied across it. Find its resistance (in $\Omega$).`, 12 / 3, 0.01, 1,
    r`$R = V/I = 12/3 = 4\ \Omega$.`, { unit: 'Ω' }),
  mcq(1, 'resistivity', r`The resistivity of a wire depends on`, 'the material and the temperature', ['the length of the wire', 'the cross-sectional area', 'the current flowing'],
    r`Resistivity is a property of the material (at a given temperature). The resistance $R = \rho L/A$ depends on the length and area, but $\rho$ itself does not.`),
  mcq(1, 'resistance of a wire', r`The length of a uniform wire is doubled by joining an identical wire to it end to end. Its resistance becomes`, 'double', ['half', 'four times', 'one-fourth'],
    r`$R = \rho L/A$ is proportional to $L$ for the same area and material.`),
  nat(1, 'series combination', r`Resistors of $2\ \Omega$, $3\ \Omega$ and $5\ \Omega$ are connected in series. Find the equivalent resistance (in $\Omega$).`, 10, 0, 0,
    r`In series the resistances add: $2 + 3 + 5 = 10\ \Omega$.`, { unit: 'Ω' }),
  nat(1, 'parallel combination', r`Resistors of $6\ \Omega$ and $3\ \Omega$ are connected in parallel. Find the equivalent resistance (in $\Omega$).`, 2, 0, 0,
    r`$\dfrac1R = \dfrac16 + \dfrac13 = \dfrac12$, so $R = 2\ \Omega$ (smaller than both).`, { unit: 'Ω' }),
  mcq(1, 'resistivity', r`The SI unit of resistivity is`, r`$\Omega\,\mathrm{m}$`, [r`$\Omega\,\mathrm{m^{-1}}$`, r`$\Omega$`, r`$\mathrm{S\,m}$`],
    r`$\rho = RA/L$ has the unit $\Omega\,\mathrm{m^2}/\mathrm{m} = \Omega\,\mathrm{m}$.`),
  mcq(1, 'drift velocity', r`The drift velocity of free electrons in a copper wire carrying a few amperes is of the order of`, r`$10^{-4}\ \mathrm{m\,s^{-1}}$ (a fraction of a millimetre per second)`, [r`$10^{8}\ \mathrm{m\,s^{-1}}$`, r`$10^{6}\ \mathrm{m\,s^{-1}}$`, r`$1\ \mathrm{m\,s^{-1}}$`],
    r`$v_d = I/(nAe)$ gives about $10^{-4}$ m/s for ordinary currents. The thermal speed is about $10^{5}$ to $10^{6}$ m/s, and the speed of the signal is about the speed of light.`),
  mcq(1, 'cells', r`When a cell is supplying current to an external resistor, its terminal potential difference is`, 'less than its emf', ['equal to its emf', 'greater than its emf', 'zero'],
    r`$V = \mathcal E - Ir$. The drop $Ir$ across the internal resistance makes $V < \mathcal E$. (They are equal only on open circuit.)`),
  mcq(1, 'Kirchhoff\'s laws', r`Kirchhoff's junction rule is a statement of`, 'conservation of charge', ['conservation of energy', 'conservation of momentum', 'Ohm\'s law'],
    r`The charge entering a junction per second equals the charge leaving. The loop rule is the one based on conservation of energy.`),
  nat(1, 'electric power', r`A heater draws 2 A from a 230 V supply. Find its power (in W).`, 230 * 2, 1, 0,
    r`$P = VI = 230\times2 = 460$ W.`, { unit: 'W' }),
  mcq(1, 'meters', r`An ideal ammeter and an ideal voltmeter should have, respectively,`, 'zero resistance and infinite resistance', ['infinite resistance and zero resistance', 'zero resistance for both', 'infinite resistance for both'],
    r`An ammeter goes in series and must not change the current, so its resistance should be tiny. A voltmeter goes in parallel and must not draw current, so its resistance should be huge.`),
  mcq(1, 'temperature dependence', r`With rise of temperature, the resistance of a metallic conductor`, 'increases', ['decreases', 'stays the same', 'first decreases then increases'],
    r`More frequent collisions of electrons with the vibrating ions reduce the drift speed, so the resistivity and the resistance rise.`),
  nat(1, 'electrical energy', r`A 1 kW heater is used for 2 hours. How many units (kWh) of electrical energy does it use?`, 2, 0, 0,
    r`Energy $= P\,t = 1\ \mathrm{kW}\times2\ \mathrm{h} = 2$ kWh (2 units).`, { unit: 'kWh' }),
  mcq(1, 'Wheatstone bridge', r`A Wheatstone bridge with arms $P$, $Q$ (one side) and $R$, $S$ (the other side) is balanced when`, r`$\dfrac PQ = \dfrac RS$`, [r`$\dfrac PQ = \dfrac SR$`, r`$P + Q = R + S$`, r`$PQ = R + S$`],
    r`At balance the galvanometer shows no current, so the two middle points are at the same potential. This gives $P/Q = R/S$, where $P$ and $R$ are the two resistors connected to the same battery terminal.`),

  // ---------- Level 2 ----------
  nat(2, 'drift velocity', r`A copper wire of cross-section $1\ \mathrm{mm^2}$ carries 2 A. The number of free electrons per unit volume is $8.5\times10^{28}\ \mathrm{m^{-3}}$. Find the drift velocity (in $\mathrm{mm\,s^{-1}}$, 3 decimals). ${EC}`, 2 / (8.5e28 * 1e-6 * QE) * 1e3, 0.002, 3,
    r`$v_d = \dfrac{I}{nAe} = \dfrac{2}{8.5\times10^{28}\times10^{-6}\times1.6\times10^{-19}} = 1.47\times10^{-4}\ \mathrm{m\,s^{-1}} = 0.147\ \mathrm{mm\,s^{-1}}$. ($1\ \mathrm{mm^2} = 10^{-6}\ \mathrm{m^2}$.)`, { unit: 'mm/s', trap: 'Change mm² to m².' }),
  nat(2, 'resistance of a wire', r`Find the resistance of a copper wire 10 m long and $1\ \mathrm{mm^2}$ in cross-section (resistivity $1.7\times10^{-8}\ \Omega\,\mathrm{m}$), in $\Omega$ (2 decimals).`, 1.7e-8 * 10 / 1e-6, 0.005, 2,
    r`$R = \dfrac{\rho L}{A} = \dfrac{1.7\times10^{-8}\times10}{10^{-6}} = 0.17\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'stretching a wire', r`A wire of resistance $5\ \Omega$ is uniformly stretched to twice its length (its volume stays constant). Find its new resistance (in $\Omega$).`, 5 * 4, 0.1, 1,
    r`Volume is fixed, so doubling $L$ halves $A$. $R = \dfrac{\rho L}{A}\propto\dfrac{L^2}{V}$, so $R$ becomes $2^2 = 4$ times: $20\ \Omega$. (Not 10, which would be the answer if the area stayed the same.)`, { unit: 'Ω', trap: 'Stretching changes the area as well as the length.' }),
  nat(2, 'cutting a wire', r`A wire of resistance $32\ \Omega$ is cut into 4 equal pieces, and the pieces are joined in parallel. Find the equivalent resistance (in $\Omega$).`, 32 / 16, 0.01, 2,
    r`Each piece has $32/4 = 8\ \Omega$. Four equal resistors in parallel: $8/4 = 2\ \Omega$. In general $R/n^2$.`, { unit: 'Ω' }),
  nat(2, 'temperature dependence', r`A resistor has $100\ \Omega$ at $0^\circ$C and a temperature coefficient $\alpha = 0.004\ \mathrm{^\circ C^{-1}}$. Find its resistance at $50^\circ$C (in $\Omega$).`, 100 * (1 + 0.004 * 50), 0.1, 1,
    r`$R_t = R_0(1 + \alpha\,\Delta T) = 100\times(1 + 0.004\times50) = 120\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'internal resistance', r`A cell of emf 12 V and internal resistance $0.5\ \Omega$ is connected to a $5.5\ \Omega$ resistor. Find the current (in A).`, 12 / 6, 0.01, 2,
    r`$I = \dfrac{\mathcal E}{R + r} = \dfrac{12}{5.5 + 0.5} = 2$ A.`, { unit: 'A' }),
  nat(2, 'internal resistance', r`A battery of emf 6 V and internal resistance $0.4\ \Omega$ delivers 5 A. Find its terminal voltage (in V).`, 6 - 5 * 0.4, 0.01, 2,
    r`$V = \mathcal E - Ir = 6 - 5\times0.4 = 4$ V.`, { unit: 'V' }),
  nat(2, 'Kirchhoff\'s junction rule', r`Currents of 5 A and 3 A flow into a junction. One wire carries 4 A away from it. What current flows away in the only other wire (in A)?`, 5 + 3 - 4, 0, 0,
    r`Current in = current out: $5 + 3 = 4 + I$, so $I = 4$ A.`, { unit: 'A' }),
  nat(2, 'parallel combination', r`Resistors of $12\ \Omega$, $6\ \Omega$ and $4\ \Omega$ are in parallel. Find the equivalent resistance (in $\Omega$).`, 2, 0, 0,
    r`$\dfrac1R = \dfrac1{12} + \dfrac16 + \dfrac14 = \dfrac{1 + 2 + 3}{12} = \dfrac12$, so $R = 2\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'Wheatstone bridge', r`A Wheatstone bridge is balanced with $P = 10\ \Omega$, $Q = 15\ \Omega$ and $R = 30\ \Omega$. Find $S$ (in $\Omega$), where $P/Q = R/S$.`, 30 * 15 / 10, 0.1, 1,
    r`$S = \dfrac{RQ}{P} = \dfrac{30\times15}{10} = 45\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'metre bridge', r`In a metre bridge the known resistance $R = 10\ \Omega$ is in the left gap and the unknown $X$ in the right. The balance point is at 40 cm from the left end. Find $X$ (in $\Omega$).`, 10 * 60 / 40, 0.05, 2,
    r`$\dfrac{R}{X} = \dfrac{l}{100 - l}$, so $X = R\dfrac{100 - l}{l} = 10\times\dfrac{60}{40} = 15\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'potentiometer', r`A cell of emf 1.5 V balances at 75 cm on a potentiometer wire. Another cell balances at 50 cm with the same driver cell. Find its emf (in V).`, 1.5 * 50 / 75, 0.01, 2,
    r`$\dfrac{\mathcal E_1}{\mathcal E_2} = \dfrac{l_1}{l_2}$, so $\mathcal E_2 = 1.5\times\dfrac{50}{75} = 1.0$ V.`, { unit: 'V' }),
  nat(2, 'galvanometer to ammeter', r`A galvanometer of resistance $100\ \Omega$ gives full-scale deflection for 1 mA. What shunt (in $\Omega$, 3 decimals) converts it into an ammeter reading up to 1 A?`, 1e-3 * 100 / (1 - 1e-3), 0.002, 3,
    r`The shunt takes $I - I_g = 0.999$ A at the same voltage: $I_gG = (I - I_g)S$, so $S = \dfrac{10^{-3}\times100}{0.999} = 0.100\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'galvanometer to voltmeter', r`A galvanometer of resistance $50\ \Omega$ gives full-scale deflection for 2 mA. What series resistance (in $\Omega$) converts it into a voltmeter of range 10 V?`, 10 / 2e-3 - 50, 0.5, 0,
    r`Total resistance needed $= V/I_g = 10/(2\times10^{-3}) = 5000\ \Omega$. Series resistance $= 5000 - 50 = 4950\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'heating effect', r`A current of 2 A flows through a $25\ \Omega$ resistor. Find the power dissipated (in W).`, 4 * 25, 0.5, 0,
    r`$P = I^2R = 2^2\times25 = 100$ W.`, { unit: 'W' }),
  nat(2, 'electrical energy', r`Three bulbs of 100 W each are used for 5 hours. How many kWh of energy do they use (1 decimal)?`, 3 * 0.1 * 5, 0.05, 1,
    r`Total power $= 300$ W $= 0.3$ kW. Energy $= 0.3\times5 = 1.5$ kWh.`, { unit: 'kWh' }),
  nat(2, 'heating effect', r`A coil of $10\ \Omega$ carries 4 A for 30 s. Find the heat produced (in J).`, 16 * 10 * 30, 1, 0,
    r`$H = I^2Rt = 16\times10\times30 = 4800$ J.`, { unit: 'J' }),
  nat(2, 'combination of cells', r`Three cells, each of emf 1.5 V and internal resistance $0.2\ \Omega$, are connected in series with a $2.4\ \Omega$ resistor. Find the current (in A).`, 4.5 / (2.4 + 0.6), 0.01, 2,
    r`Series: emf $= 3\times1.5 = 4.5$ V, internal resistance $= 3\times0.2 = 0.6\ \Omega$. $I = \dfrac{4.5}{2.4 + 0.6} = 1.5$ A.`, { unit: 'A' }),
  nat(2, 'combination of cells', r`Three identical cells, each of emf 2 V and internal resistance $0.9\ \Omega$, are connected in parallel across a $0.3\ \Omega$ resistor. Find the current (in A, 2 decimals).`, 2 / (0.3 + 0.3), 0.01, 2,
    r`Parallel: emf $= 2$ V, internal resistance $= 0.9/3 = 0.3\ \Omega$. $I = \dfrac{2}{0.3 + 0.3} = 3.33$ A.`, { unit: 'A' }),
  nat(2, 'maximum power', r`A battery of emf 12 V and internal resistance $3\ \Omega$ is connected to a variable resistor. Find the maximum power that can be delivered to it (in W).`, 144 / 12, 0.05, 2,
    r`Maximum power occurs when $R = r = 3\ \Omega$: $I = \dfrac{12}{6} = 2$ A, $P = I^2R = 4\times3 = 12$ W. (Also $P_{max} = \mathcal E^2/4r = 144/12$.)`, { unit: 'W' }),
  nat(2, 'electric power', r`A bulb is marked 220 V, 100 W. Find the resistance of its filament when it works at the rated values (in $\Omega$).`, 220 * 220 / 100, 0.5, 0,
    r`$P = V^2/R$, so $R = \dfrac{V^2}{P} = \dfrac{220^2}{100} = 484\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'electric power', r`The 220 V, 100 W bulb above is connected to 110 V. Assuming the resistance stays the same, find the power it uses (in W).`, 100 / 4, 0.1, 1,
    r`$P = V^2/R$ with the same $R$: halving $V$ divides $P$ by 4. $P = 25$ W. (In a real bulb the cooler filament has lower resistance, so the power is a little more.)`, { unit: 'W' }),
  nat(2, 'current density', r`A wire of cross-section $2\ \mathrm{mm^2}$ carries 5 A. Find the current density (in $\mathrm{MA\,m^{-2}}$, 1 decimal).`, 5 / 2e-6 / 1e6, 0.05, 1,
    r`$J = I/A = \dfrac{5}{2\times10^{-6}} = 2.5\times10^{6}\ \mathrm{A\,m^{-2}} = 2.5$ MA/m$^2$.`, { unit: 'MA/m²' }),
  nat(2, 'combination of resistors', r`A $2\ \Omega$ and a $3\ \Omega$ resistor in parallel are joined in series with a $4\ \Omega$ resistor. Find the equivalent resistance (in $\Omega$, 1 decimal).`, 6 / 5 + 4, 0.05, 1,
    r`The parallel pair: $\dfrac{2\times3}{5} = 1.2\ \Omega$. In series with $4$: $5.2\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'potential divider', r`A 12 V battery of negligible internal resistance is connected across a $4\ \Omega$ and an $8\ \Omega$ resistor in series. Find the potential difference across the $8\ \Omega$ resistor (in V).`, 12 * 8 / 12, 0.01, 1,
    r`$I = 12/12 = 1$ A. $V_8 = 1\times8 = 8$ V. The larger resistor takes the larger share.`, { unit: 'V' }),
  nat(2, 'electric power', r`Two identical bulbs, each marked 60 W, 220 V, are connected in series across a 220 V supply. Find the total power they consume (in W, assume constant resistance).`, 30, 0.5, 0,
    r`Each has $R = 220^2/60 = 806.7\ \Omega$. In series: $1613\ \Omega$. $P = V^2/R = \dfrac{220^2}{1613} = 30$ W (half of the 60 W of a single bulb).`, { unit: 'W' }),
  mcq(2, 'resistivity and temperature', r`With rise of temperature, the resistivity of a semiconductor like silicon`, 'decreases', ['increases', 'stays the same', 'becomes infinite'],
    r`Heating frees more charge carriers, and this effect beats the increase in collisions. Metals show the opposite trend, and this is why a thermistor (a semiconductor) is used as a sensitive thermometer.`),
  mcq(2, 'cells', r`A cell of emf $\mathcal E$ and internal resistance $r$ is connected to a resistor $R$. The terminal voltage is`, r`$\mathcal E\dfrac{R}{R + r}$`, [r`$\mathcal E\dfrac{r}{R + r}$`, r`$\mathcal E\dfrac{R + r}{R}$`, r`$\mathcal E - \dfrac{\mathcal E}{R}$`],
    r`$I = \dfrac{\mathcal E}{R + r}$ and $V = IR = \mathcal E\dfrac{R}{R + r}$, which is below $\mathcal E$. The second option is the voltage lost inside the cell.`),
  mcq(2, 'drift velocity', r`The drift velocity of electrons in a wire of uniform material carrying current $I$ is $v_d$. If the cross-sectional area is doubled for the same current, the drift velocity becomes`, r`$v_d/2$`, [r`$2v_d$`, r`$v_d$`, r`$v_d/4$`],
    r`$v_d = \dfrac{I}{nAe}\propto\dfrac1A$ for the same $I$. A thicker wire gives a slower drift.`),

  // ---------- Level 3 ----------
  nat(3, 'temperature coefficient', r`The resistance of a wire is $10\ \Omega$ at $20^\circ$C and $14\ \Omega$ at $120^\circ$C. Find its temperature coefficient of resistance, based on the resistance at $20^\circ$C (in $\mathrm{^\circ C^{-1}}$, 4 decimals).`, (14 - 10) / (10 * 100), 0.00005, 4,
    r`$\alpha = \dfrac{R_2 - R_1}{R_1(T_2 - T_1)} = \dfrac{4}{10\times100} = 0.0040\ \mathrm{^\circ C^{-1}}$.`, { unit: '/°C', trap: 'The reference resistance is the one at the starting temperature (20 °C), not 0 °C.' }),
  nat(3, 'Kirchhoff\'s loop rule', r`Two batteries of emf 10 V and 4 V, with negligible internal resistance, are joined in a single loop with a $2\ \Omega$ and a $3\ \Omega$ resistor, with the batteries opposing each other. Find the current (in A).`, (10 - 4) / 5, 0.01, 2,
    r`The emfs oppose, so the net emf is $10 - 4 = 6$ V and the resistance is $5\ \Omega$. $I = 6/5 = 1.2$ A, in the sense set by the 10 V battery.`, { unit: 'A', trap: 'Opposing batteries subtract.' }),
  nat(3, 'cells in parallel', r`A battery of emf 6 V and internal resistance $1\ \Omega$ and another of emf 4 V and internal resistance $2\ \Omega$ are connected in parallel (like poles together) across a $3\ \Omega$ resistor. Find the current in the $3\ \Omega$ resistor (in A, 2 decimals).`, 16 / 11, 0.01, 2,
    r`Let the common terminal voltage be $V$. Currents out of the two cells: $\dfrac{6 - V}{1}$ and $\dfrac{4 - V}{2}$. Their sum goes through $3\ \Omega$: $(6 - V) + \dfrac{4 - V}{2} = \dfrac V3$. $8 = V\left(1 + \tfrac12 + \tfrac13\right) = \tfrac{11}{6}V$, so $V = \dfrac{48}{11} = 4.364$ V and $I = V/3 = 1.45$ A.`, { unit: 'A' }),
  nat(3, 'Kirchhoff\'s laws', r`Two batteries are connected in parallel with a $6\ \Omega$ resistor: one of emf 10 V with a $2\ \Omega$ series resistor, and one of emf 6 V with a $3\ \Omega$ series resistor (all internal resistances included). Find the current in the $6\ \Omega$ resistor (in A, 2 decimals).`, 7 / 6, 0.01, 2,
    r`With the top node at $V$: $\dfrac{10 - V}{2} + \dfrac{6 - V}{3} = \dfrac{V}{6}$. Multiply by 6: $30 - 3V + 12 - 2V = V$, so $42 = 6V$ and $V = 7$ V. $I = 7/6 = 1.17$ A.`, { unit: 'A' }),
  nat(3, 'bridge', r`A Wheatstone bridge has $2\ \Omega$ and $3\ \Omega$ in the two arms from A to B and from B to D, and $4\ \Omega$ and $6\ \Omega$ in the arms from A to C and from C to D, with a $10\ \Omega$ galvanometer between B and C. Find the resistance between A and D (in $\Omega$, 2 decimals).`, 5 * 10 / 15, 0.01, 2,
    r`Check: $2/3 = 4/6$, so the bridge is balanced and no current flows in the galvanometer. The arms are $2 + 3 = 5\ \Omega$ and $4 + 6 = 10\ \Omega$ in parallel: $\dfrac{5\times10}{15} = 3.33\ \Omega$.`, { unit: 'Ω', trap: 'In a balanced bridge the middle resistor is irrelevant.' }),
  nat(3, 'ladder of resistors', r`An infinite ladder is built from identical sections: a $10\ \Omega$ resistor in the upper rail followed by a $10\ \Omega$ resistor across the two rails. Find the resistance between the input terminals (in $\Omega$, 2 decimals).`, 10 * (1 + Math.sqrt(5)) / 2, 0.02, 2,
    r`Let the ladder be $x$. Adding a section gives the same ladder: $x = R + \dfrac{Rx}{R + x}$. So $x^2 - Rx - R^2 = 0$ and $x = \dfrac{(1 + \sqrt5)R}{2} = 1.618\times10 = 16.18\ \Omega$.`, { unit: 'Ω' }),
  nat(3, 'potentiometer', r`A potentiometer wire AB is 10 m long and has a resistance of $20\ \Omega$. It is connected in series with a $10\ \Omega$ resistor to a 3 V battery of negligible internal resistance. A cell is balanced at the point 5.5 m from A. Find its emf (in V, 2 decimals).`, 3 / 30 * 20 / 10 * 5.5, 0.01, 2,
    r`Current $= \dfrac{3}{20 + 10} = 0.1$ A. Potential difference across the wire $= 0.1\times20 = 2$ V, so the potential gradient is $0.2\ \mathrm{V\,m^{-1}}$. $\mathcal E = 0.2\times5.5 = 1.10$ V.`, { unit: 'V' }),
  nat(3, 'potentiometer', r`A cell of emf $\mathcal E$ balances at 75 cm on a potentiometer wire. When a $10\ \Omega$ resistor is joined across the cell, the balance point moves to 60 cm. Find the internal resistance of the cell (in $\Omega$, 1 decimal).`, 10 * (75 - 60) / 60, 0.05, 1,
    r`Open circuit: $\mathcal E\propto75$. With $R$ across the cell the terminal voltage is $V\propto60$. $r = R\left(\dfrac{\mathcal E}{V} - 1\right) = R\dfrac{l_1 - l_2}{l_2} = 10\times\dfrac{15}{60} = 2.5\ \Omega$.`, { unit: 'Ω', trap: 'Balance point falls because the voltage across the cell falls.' }),
  nat(3, 'ammeter', r`A galvanometer of resistance $20\ \Omega$ has a full-scale current of 10 mA and a shunt of $0.2\ \Omega$ is connected across it. Find the full-scale current of the ammeter formed (in A, 2 decimals).`, 0.01 * (1 + 20 / 0.2), 0.01, 2,
    r`The shunt carries $\dfrac{I_gG}{S} = \dfrac{0.01\times20}{0.2} = 1.0$ A. Total $I = 1.0 + 0.01 = 1.01$ A.`, { unit: 'A' }),
  nat(3, 'voltmeter loading', r`A 12 V battery of negligible internal resistance is connected to two $1\ \mathrm{k\Omega}$ resistors in series. A voltmeter of resistance $1\ \mathrm{k\Omega}$ is connected across one of them. Find the reading (in V).`, 12 * 500 / (500 + 1000), 0.05, 2,
    r`The meter in parallel with $1\ \mathrm{k\Omega}$ gives $500\ \Omega$. Total $= 1500\ \Omega$. The voltage across the parallel part $= 12\times\dfrac{500}{1500} = 4$ V. (The true value without the meter would be 6 V.)`, { unit: 'V', trap: 'A real voltmeter changes the circuit it measures.' }),
  nat(3, 'charging a battery', r`A battery of emf 12 V and internal resistance $0.5\ \Omega$ is charged by a 20 V supply through an external resistor of $3.5\ \Omega$. Find the potential difference between the battery's terminals (in V).`, 12 + 2 * 0.5, 0.01, 2,
    r`Net driving emf $= 20 - 12 = 8$ V over $3.5 + 0.5 = 4\ \Omega$: $I = 2$ A into the battery. While charging, $V = \mathcal E + Ir = 12 + 2\times0.5 = 13$ V, which is above its emf.`, { unit: 'V', trap: 'While charging the terminal voltage is above the emf.' }),
  nat(3, 'power in bulbs', r`Two bulbs rated (220 V, 40 W) and (220 V, 60 W) are joined in series across 220 V. Find the power dissipated in the 40 W bulb (in W, 1 decimal). Assume constant resistances.`, (220 / (220 ** 2 / 40 + 220 ** 2 / 60)) ** 2 * (220 ** 2 / 40), 0.1, 1,
    r`$R_{40} = \dfrac{220^2}{40} = 1210\ \Omega$ and $R_{60} = 806.7\ \Omega$. In series $I = \dfrac{220}{2016.7} = 0.1091$ A. $P_{40} = I^2R = 0.1091^2\times1210 = 14.4$ W (and $P_{60} = 9.6$ W). In series the larger resistance gets more power, so the 40 W bulb is brighter.`, { unit: 'W', trap: 'In series the lower-rated bulb glows brighter; in parallel the higher-rated one does.' }),
  nat(3, 'mixed: heating water', r`An immersion heater of 1 kW is used to heat 2 kg of water from $20^\circ$C to $60^\circ$C. Taking the specific heat as $4200\ \mathrm{J\,kg^{-1}\,K^{-1}}$ and no losses, find the time needed (in s).`, 2 * 4200 * 40 / 1000, 1, 0,
    r`Heat needed $= mc\Delta T = 2\times4200\times40 = 3.36\times10^{5}$ J. $t = \dfrac{Q}{P} = \dfrac{3.36\times10^{5}}{1000} = 336$ s.`, { unit: 's', sub: 'mixed' }),
  nat(3, 'mixed: electric motor', r`A motor takes 100 W from the supply and lifts a 10 kg load at a steady 0.5 m/s ($g = 9.8$). Find its efficiency (in per cent).`, 10 * 9.8 * 0.5 / 100 * 100, 0.2, 1,
    r`Useful power $= mgv = 10\times9.8\times0.5 = 49$ W. Efficiency $= \dfrac{49}{100} = 49\ \%$.`, { unit: '%', sub: 'mixed' }),
  nat(3, 'mobility', r`The electric field in a copper wire is $0.02\ \mathrm{V\,m^{-1}}$ and the drift velocity is $1.5\times10^{-4}\ \mathrm{m\,s^{-1}}$. Find the mobility of the electrons (in $10^{-3}\ \mathrm{m^2\,V^{-1}\,s^{-1}}$, 1 decimal).`, 1.5e-4 / 0.02 / 1e-3, 0.05, 1,
    r`$\mu = \dfrac{v_d}{E} = \dfrac{1.5\times10^{-4}}{0.02} = 7.5\times10^{-3}\ \mathrm{m^2\,V^{-1}\,s^{-1}}$.`, { unit: '×10⁻³ m²/(V s)' }),
  nat(3, 'symmetry', r`Six equal resistors of $12\ \Omega$ form a regular hexagon. Find the resistance between two opposite corners (in $\Omega$).`, 1.5 * 12, 0.1, 1,
    r`Between opposite corners there are two identical paths of three resistors each: $36\ \Omega$ each. In parallel: $18\ \Omega$ ($= 3R/2$).`, { unit: 'Ω' }),
  nat(3, 'combination of resistors', r`In a circuit, a $6\ \Omega$ resistor is in series with the parallel pair of $12\ \Omega$ and $4\ \Omega$. The combination is connected to a 18 V battery of internal resistance $1\ \Omega$. Find the current drawn from the battery (in A).`, 18 / (6 + 3 + 1), 0.01, 2,
    r`The parallel pair is $\dfrac{12\times4}{16} = 3\ \Omega$. Total $= 6 + 3 + 1 = 10\ \Omega$. $I = 18/10 = 1.8$ A.`, { unit: 'A' }),
  nat(3, 'ring of wire', r`A uniform wire of resistance $32\ \Omega$ is bent into a circle. Find the resistance between two points that are $90^\circ$ apart on the circle (in $\Omega$).`, 32 * (90 / 360) * (270 / 360), 0.05, 2,
    r`The wire is split into arcs of $8\ \Omega$ (quarter) and $24\ \Omega$ (three-quarters), in parallel: $\dfrac{8\times24}{32} = 6\ \Omega$.`, { unit: 'Ω' }),
  nat(3, 'balanced bridge', r`A Wheatstone bridge of four arms has $P = 4\ \Omega$, $Q = 6\ \Omega$ and $R = 10\ \Omega$ and is balanced. What is $S$ (in $\Omega$)?`, 15, 0.01, 1,
    r`$S = \dfrac{RQ}{P} = \dfrac{10\times6}{4} = 15\ \Omega$.`, { unit: 'Ω' }),
  mcq(3, 'brightness of bulbs', r`A 100 W bulb and a 40 W bulb, both rated 220 V, are connected in parallel across 220 V. Which statement is correct?`, 'The 100 W bulb is brighter', ['The 40 W bulb is brighter', 'Both are equally bright', 'The 40 W bulb carries more current'],
    r`In parallel both have 220 V, so each gets its rated power, 100 W and 40 W. The 100 W bulb has less resistance and carries more current. (In series it would be the other way: the 40 W bulb would be brighter.)`, { trap: 'Parallel: the higher power rating glows brighter. Series: the lower rating does.' }),
  mcq(3, 'graph', r`The $V$-$I$ graphs for two ohmic resistors $R_1$ and $R_2$ are straight lines through the origin, with $R_1$'s line steeper (V on the vertical axis). Which is true?`, r`$R_1 > R_2$`, [r`$R_1 < R_2$`, r`$R_1 = R_2$`, r`Cannot be compared without knowing the emf`],
    r`The slope of a $V$-$I$ graph is $R$. A steeper line means more resistance. (If the axes were swapped, the steeper line would mean less resistance. Check the axes first.)`, { trap: 'The slope of an I-V graph is the conductance 1/R.' }),
  mcq(3, 'resistance and radius', r`Two wires of the same material and length have radii in the ratio $1:2$. The ratio of their resistances is`, '4 : 1', ['2 : 1', '1 : 2', '1 : 4'],
    r`$R\propto\dfrac1A\propto\dfrac1{r^2}$. The thinner wire (radius 1) has 4 times the resistance of the thicker wire (radius 2).`),
  mcq(3, 'combination of resistors', r`$n$ identical resistors each of resistance $R$ are first connected in series and then in parallel. The ratio of the equivalent resistances (series : parallel) is`, r`$n^2 : 1$`, [r`$n : 1$`, r`$1 : n^2$`, r`$1 : n$`],
    r`Series: $nR$. Parallel: $R/n$. Ratio $= nR\Big/\dfrac Rn = n^2$.`),
  mcq(3, 'cells', r`$n$ identical cells, each of emf $\mathcal E$ and internal resistance $r$, are joined in series. The emf and internal resistance of the combination are`, r`$n\mathcal E$ and $nr$`, [r`$\mathcal E$ and $r/n$`, r`$n\mathcal E$ and $r/n$`, r`$\mathcal E$ and $nr$`],
    r`In series the emfs add and the internal resistances add. (The parallel combination of identical cells has emf $\mathcal E$ and internal resistance $r/n$.)`),
  mn(3, 'internal resistance', r`A cell of emf 2 V gives a terminal voltage of 1.6 V when it drives a current of 0.5 A. Its internal resistance is`, 0.8, [0.4, 3.2, 1.25], 'Ω',
    r`$r = \dfrac{\mathcal E - V}{I} = \dfrac{2 - 1.6}{0.5} = 0.8\ \Omega$.`),
  mn(3, 'electrical energy', r`An electric iron of 1000 W is used for 3 hours a day for 30 days. At 5 rupees per unit the cost of the energy is`, 450, [90, 1500, 2250], 'rupees',
    r`Energy $= 1\ \mathrm{kW}\times3\times30 = 90$ units. Cost $= 90\times5 = 450$ rupees. Option 1 forgets the price, and 1500 forgets the 3 hours.`),
  nat(3, 'mixed: drift and kinematics', r`The drift velocity of electrons in a wire is $1.5\times10^{-4}\ \mathrm{m\,s^{-1}}$. How long does an electron take to drift along a 2 m length of the wire (in hours, 2 decimals)?`, 2 / 1.5e-4 / 3600, 0.02, 2,
    r`$t = \dfrac{L}{v_d} = \dfrac{2}{1.5\times10^{-4}} = 1.33\times10^{4}$ s $= 3.70$ h. The bulb lights at once because the field is set up everywhere along the wire at nearly the speed of light, not because an electron travels the whole length.`, { unit: 'h', sub: 'mixed' }),
  nat(3, 'current from moving charge', r`A thin ring carrying a charge of $3\ \mu$C rotates at 50 revolutions per second. Find the equivalent current (in $\mu$A).`, 3 * 50, 0.5, 0,
    r`Charge passes a fixed point $f = 50$ times per second: $I = Qf = 3\ \mu\mathrm{C}\times50 = 150\ \mu$A.`, { unit: 'µA' }),
  nat(3, 'current from moving charge', r`In a model of the hydrogen atom the electron orbits the proton at a radius of $0.53\times10^{-10}$ m with a speed of $2.2\times10^{6}\ \mathrm{m\,s^{-1}}$. Find the equivalent current (in mA, 2 decimals). ${EC}`, QE * 2.2e6 / (2 * Math.PI * 0.53e-10) * 1e3, 0.02, 2,
    r`Frequency $f = \dfrac{v}{2\pi r} = \dfrac{2.2\times10^{6}}{2\pi\times0.53\times10^{-10}} = 6.6\times10^{15}$ Hz. $I = ef = 1.6\times10^{-19}\times6.6\times10^{15} = 1.06\times10^{-3}$ A $= 1.06$ mA.`, { unit: 'mA' }),
  nat(3, 'heating effect', r`A heater coil is rated 1000 W at a fixed supply voltage. Twenty per cent of its length is cut off and the rest is used on the same supply. Find the new power (in W).`, 1000 / 0.8, 1, 0,
    r`$P = V^2/R$ with $R\propto L$. The new length is $0.8L$, so $R' = 0.8R$ and $P' = P/0.8 = 1250$ W.`, { unit: 'W' }),
  nat(3, 'mixed: heater coils', r`An electric kettle has two heating coils. Used alone, one boils the water in 20 minutes and the other in 30 minutes. Find the time taken when they are used in parallel on the same supply (in minutes).`, 20 * 30 / 50, 0.05, 1,
    r`The heat needed is the same, $H = \dfrac{V^2}{R}t$, so $t\propto R$. In parallel $R = \dfrac{R_1R_2}{R_1 + R_2}$, so $t = \dfrac{t_1t_2}{t_1 + t_2} = \dfrac{20\times30}{50} = 12$ min. (In series it would be $50$ min.)`, { unit: 'min' }),
  nat(3, 'charge from a varying current', r`The current in a wire varies as $I = 2t$ (in A, $t$ in s). Find the charge that passes in the first 3 s (in C).`, 3 ** 2, 0.01, 1,
    r`$Q = \int_0^3I\,dt = \int_0^32t\,dt = t^2\Big|_0^3 = 9$ C.`, { unit: 'C' }),

  // ---------- Level 4 ----------
  nat(4, 'symmetry', r`A cube is made of 12 equal resistors of $12\ \Omega$ each, one on each edge. Find the resistance between the two ends of one edge (in $\Omega$).`, 7, 0, 0,
    r`Use superposition. (1) Put current $I$ into A and take $I/8$ out of every one of the 8 corners. The net $\tfrac78I$ leaving A splits equally into its 3 edges, so edge AB carries $\tfrac{7I}{24}$. (2) Take $I$ out of B and put $I/8$ into every corner: by symmetry edge AB again carries $\tfrac{7I}{24}$, in the same direction. Adding the two (the $I/8$ parts cancel), edge AB carries $\tfrac{7I}{12}$, so $V_{AB} = \tfrac{7I}{12}R$ and $R_{AB} = \tfrac{7}{12}R = \tfrac7{12}\times12 = 7\ \Omega$.`, { unit: 'Ω' }),
  nat(4, 'symmetry', r`A cube is made of 12 resistors of $18\ \Omega$ each. Find the resistance between two opposite corners, at the ends of a body diagonal (in $\Omega$).`, 18 * 5 / 6, 0, 0,
    r`From A the current $I$ splits into $I/3$ in each of 3 edges. The three corners next to A are at the same potential, and so are the three next to the far corner. So the network is 3 resistors in parallel, then 6 in parallel (the face edges), then 3 in parallel: $\dfrac R3 + \dfrac R6 + \dfrac R3 = \dfrac{5R}{6} = 15\ \Omega$.`, { unit: 'Ω' }),
  nat(4, 'symmetry', r`A square frame has four resistors of $8\ \Omega$ on its sides and a fifth $8\ \Omega$ resistor along one diagonal AC. Find the resistance between A and C (in $\Omega$).`, 4, 0, 0,
    r`Between A and C the two paths along the sides are $8 + 8 = 16\ \Omega$ each, and the diagonal is $8\ \Omega$. B and D have no resistor joining them, so the three paths are independent and in parallel: $\dfrac1{R} = \dfrac1{16} + \dfrac1{16} + \dfrac18 = \dfrac14$ and $R = 4\ \Omega$.`, { unit: 'Ω' }),
  nat(4, 'temperature compensation', r`A carbon resistor ($\alpha = -0.0005\ \mathrm{^\circ C^{-1}}$) is joined in series with a $10\ \Omega$ copper resistor ($\alpha = +0.004\ \mathrm{^\circ C^{-1}}$), both measured at $0^\circ$C. What carbon resistance (in $\Omega$) makes the combination's resistance independent of temperature?`, 10 * 0.004 / 0.0005, 0.5, 0,
    r`Total change $= R_1\alpha_1\Delta T + R_2\alpha_2\Delta T = 0$. So $10\times0.004 = R_2\times0.0005$ and $R_2 = 80\ \Omega$.`, { unit: 'Ω' }),
  nat(4, 'relaxation time', r`Copper has $8.5\times10^{28}$ free electrons per $\mathrm{m^3}$ and resistivity $1.7\times10^{-8}\ \Omega\,\mathrm{m}$. Find the average time between collisions of an electron (in units of $10^{-14}$ s, 2 decimals; $m = 9.1\times10^{-31}$ kg, $e = 1.6\times10^{-19}$ C).`, ME / (8.5e28 * QE * QE * 1.7e-8) / 1e-14, 0.05, 2,
    r`$\rho = \dfrac{m}{ne^2\tau}$, so $\tau = \dfrac{m}{ne^2\rho} = \dfrac{9.1\times10^{-31}}{8.5\times10^{28}\times(1.6\times10^{-19})^2\times1.7\times10^{-8}} = 2.46\times10^{-14}$ s.`, { unit: '×10⁻¹⁴ s' }),
  nat(4, 'cells', r`Ten identical cells, each of emf 1.5 V and internal resistance $0.2\ \Omega$, are joined in series, but two of the cells are connected with reversed polarity. The battery drives a $3\ \Omega$ resistor. Find the current (in A).`, (10 - 4) * 1.5 / (3 + 10 * 0.2), 0.01, 2,
    r`Net emf $= (8 - 2)\times1.5 = 9$ V. Internal resistance $= 10\times0.2 = 2\ \Omega$ (every cell still resists). $I = \dfrac{9}{3 + 2} = 1.8$ A.`, { unit: 'A', trap: 'A reversed cell cancels another AND still adds its internal resistance.' }),
  nat(4, 'maximum power', r`A battery of emf 12 V and internal resistance $2\ \Omega$ is in series with a fixed $3\ \Omega$ resistor and a variable resistor $X$. Find the maximum power that can be delivered to $X$ (in W, 1 decimal).`, 144 * 5 / 100, 0.05, 1,
    r`Treat $3 + 2 = 5\ \Omega$ as the source resistance. Power in $X$ is largest when $X = 5\ \Omega$: $I = \dfrac{12}{10} = 1.2$ A, $P = I^2X = 1.44\times5 = 7.2$ W. ($\mathcal E^2/4r_{eff} = 144/20 = 7.2$.)`, { unit: 'W', trap: 'The fixed resistor adds to the internal resistance for this purpose.' }),
  nat(4, 'potentiometer', r`When two cells are joined in series so that they help each other, the balance point on a potentiometer is at 8 m. When one is reversed, it is at 2 m. Find the ratio $\mathcal E_1/\mathcal E_2$ (2 decimals).`, (8 + 2) / (8 - 2), 0.01, 2,
    r`Aiding: $\mathcal E_1 + \mathcal E_2\propto8$. Opposing: $\mathcal E_1 - \mathcal E_2\propto2$. Add and subtract: $\mathcal E_1\propto5$ and $\mathcal E_2\propto3$. Ratio $= 5/3 = 1.67$.`),
  nat(4, 'potentiometer', r`A 10 m potentiometer wire of resistance $20\ \Omega$ is connected in series with an $8\ \Omega$ resistor and a 4 V battery of internal resistance $2\ \Omega$. Find the balancing length for a cell of emf 1.2 V (in m, 2 decimals).`, 1.2 / (4 / 30 * 20 / 10), 0.02, 2,
    r`Current $= \dfrac{4}{20 + 8 + 2} = \dfrac{2}{15}$ A. Voltage across the wire $= \dfrac2{15}\times20 = 2.667$ V, gradient $0.2667\ \mathrm{V\,m^{-1}}$. $l = \dfrac{1.2}{0.2667} = 4.50$ m.`, { unit: 'm', trap: 'The driver cell\'s internal resistance and the series resistor are part of the circuit current.' }),
  nat(4, 'switch-on current of a bulb', r`A 220 V, 100 W tungsten bulb works at $2020^\circ$C. Take $\alpha = 0.0045\ \mathrm{^\circ C^{-1}}$ for tungsten (relative to $20^\circ$C, treated as constant). Find the current at the instant of switching on when the filament is at $20^\circ$C (in A, 2 decimals).`, 220 / (220 * 220 / 100 / (1 + 0.0045 * 2000)), 0.03, 2,
    r`Working resistance $R_{hot} = \dfrac{220^2}{100} = 484\ \Omega$. $R_{hot} = R_{20}(1 + 0.0045\times2000) = 10R_{20}$, so $R_{20} = 48.4\ \Omega$. Switch-on current $= \dfrac{220}{48.4} = 4.55$ A, ten times the working current of 0.4545 A.`, { unit: 'A', sub: 'mixed' }),
  nat(4, 'charge from a varying current', r`The current in a wire varies with time as $I = 4t - t^2$ (in A, $t$ in s) from $t = 0$ to $t = 4$ s. Find the charge that passes (in C, 2 decimals).`, 2 * 16 - 64 / 3, 0.02, 2,
    r`$Q = \int_0^4(4t - t^2)dt = \left[2t^2 - \dfrac{t^3}{3}\right]_0^4 = 32 - 21.33 = 10.67$ C.`, { unit: 'C' }),
  nat(4, 'metre bridge', r`In a metre bridge, an unknown resistance in the left gap is balanced against a $10\ \Omega$ resistor in the right gap at 40 cm from the left end. The resistances are then interchanged, with the same wire. Where is the new balance point (in cm from the left end)?`, 60, 0.1, 1,
    r`First: $\dfrac X{10} = \dfrac{40}{60}$, so $X = 6.67\ \Omega$. After interchange: $\dfrac{10}{X} = \dfrac{l}{100 - l}$, so $\dfrac{l}{100 - l} = 1.5$ and $l = 60$ cm. In general the two balance points add to 100 cm.`, { unit: 'cm' }),

  // ---------- Level 5 ----------
  nat(5, 'unbalanced bridge', r`In a bridge circuit, A to B is $1\ \Omega$, B to D is $2\ \Omega$, A to C is $3\ \Omega$, C to D is $4\ \Omega$, and B to C is $5\ \Omega$. Find the equivalent resistance between A and D (in $\Omega$, 2 decimals).`, 1 / 0.4774193548387095, 0.01, 2,
    r`The bridge is not balanced ($1/2\neq3/4$), so use node equations with A at 1 V and D at 0 V (conductances 1, 1/2, 1/3, 1/4, 1/5 S). Node B: $1(1 - v_B) = \tfrac12v_B + \tfrac15(v_B - v_C)$. Node C: $\tfrac13(1 - v_C) + \tfrac15(v_B - v_C) = \tfrac14v_C$. Solving gives $v_B = 0.658$ V and $v_C = 0.594$ V. Current from A $= (1 - 0.658) + \tfrac13(1 - 0.594) = 0.342 + 0.135 = 0.477$ A. $R = 1/0.477 = 2.09\ \Omega$.`, { unit: 'Ω', trap: 'No series-parallel shortcut: use node voltages.' }),
  nat(5, 'resistance of a tapered conductor', r`A solid copper cone-frustum of length 1 m has circular ends of radii 1 mm and 2 mm. Taking the current to flow along the axis with uniform density over each cross-section, find the resistance between the ends (in $\mathrm{m\Omega}$, 2 decimals; $\rho = 1.7\times10^{-8}\ \Omega\,\mathrm{m}$).`, 1.7e-8 * 1 / (Math.PI * 1e-3 * 2e-3) * 1e3, 0.03, 2,
    r`Slice into thin discs: $dR = \dfrac{\rho\,dx}{\pi r^2}$ with $r = a + \dfrac{(b - a)x}{L}$. $R = \dfrac{\rho L}{\pi(b - a)}\left(\dfrac1a - \dfrac1b\right) = \dfrac{\rho L}{\pi ab} = \dfrac{1.7\times10^{-8}\times1}{\pi\times10^{-3}\times2\times10^{-3}} = 2.71\times10^{-3}\ \Omega = 2.71\ \mathrm{m\Omega}$.`, { unit: 'mΩ', trap: 'Not the average area: the discs are in series, so integrate dR.' }),
  nat(5, 'radial flow of current', r`A thick spherical shell of inner radius 0.1 m and outer radius 0.2 m is made of a material of resistivity $100\ \Omega\,\mathrm{m}$. Find the resistance between the inner and outer surfaces for radial flow of current (in $\Omega$, 1 decimal).`, 100 / (4 * Math.PI) * (1 / 0.1 - 1 / 0.2), 0.1, 1,
    r`Thin spherical layers are in series: $dR = \dfrac{\rho\,dr}{4\pi r^2}$. $R = \dfrac{\rho}{4\pi}\left(\dfrac1a - \dfrac1b\right) = \dfrac{100}{4\pi}(10 - 5) = 39.8\ \Omega$.`, { unit: 'Ω' }),
  nat(5, 'non-uniform resistivity', r`A rod of length 2 m and cross-section $1\ \mathrm{mm^2}$ has resistivity that varies along its length as $\rho = \rho_0(1 + x/L)$ with $\rho_0 = 2\times10^{-6}\ \Omega\,\mathrm{m}$. Find its resistance (in $\Omega$).`, 1.5 * 2e-6 * 2 / 1e-6, 0.02, 2,
    r`The slices are in series: $R = \dfrac1A\int_0^L\rho\,dx = \dfrac{\rho_0}{A}\left(L + \dfrac L2\right) = 1.5\times\dfrac{2\times10^{-6}\times2}{10^{-6}} = 6\ \Omega$.`, { unit: 'Ω' }),
  nat(5, 'mixed: heating of a wire', r`A thick copper wire carries a uniform current density $10^{7}\ \mathrm{A\,m^{-2}}$ for 1 s, with no heat loss. Find the rise in temperature (in K, 2 decimals). Use $\rho = 1.7\times10^{-8}\ \Omega\,\mathrm{m}$, density $8900\ \mathrm{kg\,m^{-3}}$ and specific heat $385\ \mathrm{J\,kg^{-1}K^{-1}}$.`, 1.7e-8 * 1e14 * 1 / (8900 * 385), 0.01, 2,
    r`Per unit volume the heating rate is $\rho J^2$ (since $I^2R/(AL) = \rho J^2$). Heat per unit volume $= \rho J^2t = 1.7\times10^{-8}\times10^{14}\times1 = 1.7\times10^{6}\ \mathrm{J\,m^{-3}}$. Needed per kelvin: $dc = 8900\times385 = 3.43\times10^{6}$. $\Delta T = 0.50$ K.`, { unit: 'K', sub: 'mixed' }),
  nat(5, 'metre bridge errors', r`In a metre bridge, the unknown resistance $X$ is in the right gap and a $10\ \Omega$ resistor in the left. The balance point reads 40 cm from the left end. The end resistances are equivalent to extra wire lengths of 1 cm at the left end and 2 cm at the right end. Find $X$ with the correction (in $\Omega$, 2 decimals).`, 10 * (100 - 40 + 2) / (40 + 1), 0.03, 2,
    r`The effective length on the left is $40 + 1 = 41$ cm and on the right $60 + 2 = 62$ cm. $\dfrac{10}{X} = \dfrac{41}{62}$, so $X = \dfrac{10\times62}{41} = 15.12\ \Omega$ (the uncorrected value is $15\ \Omega$).`, { unit: 'Ω' }),
  nat(5, 'galvanometer resistance', r`A galvanometer with a series resistance of $120\ \Omega$ from a cell of negligible internal resistance gives a deflection. When a $60\ \Omega$ shunt is put across the galvanometer (the series resistance unchanged), the deflection is exactly halved. Find the galvanometer's resistance (in $\Omega$).`, 120 * 60 / (120 - 60), 0.5, 0,
    r`Let $R = 120$, $S = 60$, galvanometer $G$. Without the shunt: $I = \mathcal E/(R + G)$. With the shunt, the total current is $\mathcal E/(R + G_p)$ with $G_p = \dfrac{GS}{G + S}$, and the galvanometer gets the fraction $\dfrac{S}{G + S}$ of it. Setting this equal to $I/2$ and simplifying: $G = \dfrac{SR}{R - S} = \dfrac{60\times120}{60} = 120\ \Omega$. (The approximation $G\approx S$ is valid only if $R\gg S$.)`, { unit: 'Ω', trap: 'The shunt changes the total current as well, so G = S only when R is very large.' }),
  nat(5, 'meter errors', r`A battery of 12 V (negligible internal resistance) drives a $10\ \Omega$ resistor. An ammeter of resistance $2\ \Omega$ is put in series. What is the percentage error in the reading, compared with the true current without the ammeter (1 decimal)?`, (12 / 10 - 12 / 12) / (12 / 10) * 100, 0.1, 1,
    r`True current $= 12/10 = 1.2$ A. Reading $= 12/12 = 1.0$ A. Error $= \dfrac{0.2}{1.2} = 16.7\ \%$ low. A good ammeter needs a resistance much smaller than the circuit's.`, { unit: '%' }),

  // ---------- Assertion-Reason ----------
  asrt(2, 'electric current', r`Electric current is a scalar quantity although it has a direction.`, r`Currents do not add by the parallelogram law, they add algebraically.`, 0,
    r`Two currents meeting at a junction add as numbers whatever the angle between the wires. That is why current is a scalar. R explains A.`),
  asrt(2, 'series circuit', r`In a series circuit the same current flows through every resistor.`, r`In a series circuit the potential difference across every resistor is the same.`, 2,
    r`A is true: there is no junction to split the current. R is false: in series the current is common and the voltages are $IR_i$, different for different resistors. (In parallel the voltage is common.)`),
  asrt(3, 'Kirchhoff\'s laws', r`Kirchhoff's junction rule follows from the conservation of charge.`, r`Kirchhoff's loop rule follows from the conservation of energy.`, 1,
    r`Both are true. But R does not explain A: the junction rule has its own cause, charge conservation (no charge piles up at a junction). Option 2.`),
  asrt(3, 'cells', r`The terminal voltage of a cell is always less than its emf.`, r`A cell has internal resistance, so some voltage is lost inside when it supplies current.`, 3,
    r`A is false: on open circuit $V = \mathcal E$, and while a cell is being charged $V = \mathcal E + Ir > \mathcal E$. R is true.`, { trap: '"Always" makes A false.' }),
  asrt(3, 'power in bulbs', r`Two bulbs of different power ratings but the same voltage rating are connected in series. The bulb of the lower power rating glows brighter.`, r`The bulb of lower power rating has the higher resistance, and in series $P = I^2R$ with the same $I$.`, 0,
    r`$R = V^2/P$ is larger for the lower rating. In series the current is common, so the larger $R$ dissipates more power: R explains A.`),
  asrt(3, 'drift velocity', r`If the cross-section of a wire is increased for the same current, the drift velocity of electrons increases.`, r`The drift velocity is $v_d = I/(nAe)$.`, 3,
    r`$v_d\propto1/A$ for fixed $I$: a larger area makes the drift slower, so A is false. R is the correct formula, so it is true.`),
  asrt(4, 'resistance of a wire', r`A thicker copper wire of the same length has less resistance than a thinner one.`, r`The resistivity of a thick wire is less than that of a thin wire.`, 2,
    r`A is true because $R = \rho L/A$ and $A$ is larger. R is false: the resistivity is a property of the material (and temperature), not of the size of the wire.`),
  asrt(5, 'maximum power', r`A battery delivers maximum power to a load when the load resistance equals the internal resistance.`, r`At that load the efficiency of the battery is 50 %.`, 1,
    r`Both are true. At $R = r$ the power in the load is $\mathcal E^2R/(R + r)^2$, maximum for $R = r$ (set the derivative to zero), and the battery wastes as much inside as it delivers outside, so the efficiency is $\tfrac12$. The efficiency does not explain why the power is maximum.`),

  // ---------- Statements ----------
  stm(2, 'temperature dependence', r`The resistivity of metals increases with temperature.`, r`The resistivity of semiconductors increases with temperature.`, 2,
    r`I is true. II is false: more carriers become available as a semiconductor is heated, so its resistivity falls.`),
  stm(2, 'combination of resistors', r`The equivalent resistance of resistors in parallel is less than the smallest of them.`, r`The equivalent resistance of resistors in series is more than the largest of them.`, 0,
    r`Parallel: $\dfrac1R$ is a sum, so $R$ is below every $R_i$. Series: $R = \sum R_i$ exceeds each. Both are true.`),
  stm(3, 'Ohm\'s law', r`Ohm's law is obeyed by all conducting devices.`, r`A semiconductor diode does not obey Ohm's law.`, 3,
    r`I is false: filament lamps, diodes, thermistors and electrolytes are non-ohmic. II is true, since the current in a diode is not proportional to the voltage and flows mainly one way.`),
  stm(3, 'maximum power', r`A cell delivers maximum power to the load when $R = r$.`, r`The efficiency of the cell at that moment is 100 %.`, 2,
    r`I is true. II is false: the efficiency is $\dfrac{R}{R + r} = 50\ \%$ at $R = r$, and tends to 100 % only when $R\gg r$ (when the power is small).`),
  stm(4, 'Wheatstone bridge', r`The galvanometer in a Wheatstone bridge shows no current only when all four resistors are equal.`, r`The balance of the bridge depends on the emf of the cell.`, 1,
    r`Both are false. The no-current condition is $P/Q = R/S$ for any values; the cell's emf (or its internal resistance) does not matter for balance, only for how big the current is when unbalanced.`),
  stm(4, 'stretching a wire', r`When a wire is stretched to double its length, its resistivity doubles.`, r`When a wire is stretched to double its length, its resistance becomes four times.`, 3,
    r`I is false: the material is the same, so $\rho$ is unchanged. II is true: $L\to2L$ and $A\to A/2$ give $R\to4R$.`),
  stm(4, 'voltmeter', r`A voltmeter reads a little less than the true potential difference when connected across a resistor.`, r`A real voltmeter has a very large but finite resistance.`, 0,
    r`The finite resistance of the voltmeter in parallel lowers the combined resistance, which lowers the voltage across it a little. II explains why I happens. Both are true.`),
  stm(5, 'potentiometer', r`At the balance point of a potentiometer the cell being tested does not supply any current.`, r`A potentiometer therefore measures the emf of a cell and not its terminal voltage.`, 0,
    r`At balance the cell is in a branch with no current, so no voltage is lost in its internal resistance, and the reading is its emf. Both are true. (A voltmeter, which draws some current, reads less than the emf.)`),

  // ---------- Multi-correct ----------
  msq(3, 'stretching a wire', r`A wire is uniformly stretched to twice its length (volume unchanged). Which are correct?`, [r`Its resistance becomes four times.`, r`Its resistivity is unchanged.`, r`Its resistivity doubles.`, r`Its resistance doubles.`], [0, 1],
    r`$R\to4R$ because $L\to2L$ and $A\to A/2$. $\rho$ depends on the material only, so it is unchanged. C and D are wrong.`),
  msq(3, 'series circuit', r`A $2\ \Omega$ and a $4\ \Omega$ resistor are connected in series across 12 V. Which are correct?`, [r`The current is 2 A.`, r`The voltage across the $2\ \Omega$ resistor is 4 V.`, r`The power in the $4\ \Omega$ resistor is 16 W.`, r`The $2\ \Omega$ resistor dissipates more power than the $4\ \Omega$ one.`], [0, 1, 2],
    r`$I = 12/6 = 2$ A. $V_2 = 4$ V. $P_4 = I^2R = 16$ W. $P_2 = 8$ W, so D is false: in series the larger resistance gets more power.`),
  msq(4, 'non-ohmic conductors', r`Which of the following do NOT obey Ohm's law?`, [r`A semiconductor diode`, r`A copper wire at constant temperature`, r`A thermistor`, r`The filament of a bulb`], [0, 2, 3],
    r`The diode is non-linear, the thermistor's resistance changes strongly with temperature (and so with current), and the filament's resistance rises as it heats. The copper wire at fixed temperature is ohmic.`),
  msq(4, 'metre bridge', r`In a metre bridge, a known resistance $R$ in the left gap balances an unknown $X$ in the right gap at 40 cm. Which are correct?`, [r`$X = 1.5R$`, r`After interchanging $R$ and $X$ the balance point is at 60 cm.`, r`The balance point shifts if the cell emf is doubled.`, r`The most accurate reading is when the balance point is near the middle.`], [0, 1, 3],
    r`$X/R = 60/40$. Interchange gives $l' = 100 - 40 = 60$ cm. The emf does not affect the balance. Near the middle the relative error in $l/(100 - l)$ is smallest.`),
  msq(2, 'scalars and vectors', r`Which of the following are vector quantities?`, [r`Current density`, r`Electric current`, r`Resistance`, r`Electric field`], [0, 3],
    r`Current density $\vec J$ and electric field $\vec E$ have directions in space. The current $I$ through a wire is a scalar (it adds algebraically), as is the resistance.`),
  msq(5, 'maximum power', r`A cell of emf $\mathcal E$ and internal resistance $r$ drives a load $R = r$. Which are correct?`, [r`The current is $\mathcal E/2r$.`, r`The power in the load is $\mathcal E^2/4r$.`, r`The efficiency is 50 %.`, r`The terminal voltage is $\mathcal E$.`], [0, 1, 2],
    r`$I = \mathcal E/(r + r)$, $P = I^2r = \mathcal E^2/4r$, power lost inside is equal, so the efficiency is 50 %. The terminal voltage is $\mathcal E/2$.`),
  msq(5, 'potentiometer', r`Which changes make a potentiometer more sensitive (a larger shift of the balance point for a given small change in emf)?`, [r`Adding a series resistor in the driver circuit to reduce the current in the wire`, r`Using a longer wire with the same potential difference across its ends`, r`Increasing the emf of the driver cell, with everything else the same`, r`Using a shorter wire with the same potential difference across its ends`], [0, 1],
    r`The potential gradient is $k = V_{wire}/L$. A shift $\Delta l = \Delta\mathcal E/k$ is larger when $k$ is smaller. A: less current means a smaller $V_{wire}$, so smaller $k$. B: the same $V$ over a longer $L$ gives smaller $k$. C: a bigger driver emf raises the current and $k$, which makes it less sensitive. D: shorter $L$ raises $k$.`),
  msq(5, 'symmetry', r`Twelve equal resistors $R$ are placed along the edges of a cube. Which are correct?`, [r`Across one edge: $7R/12$`, r`Across a face diagonal: $3R/4$`, r`Across a body diagonal: $5R/6$`, r`Across a body diagonal: $3R/4$`], [0, 1, 2],
    r`These are the three standard results. The body diagonal is $\tfrac R3 + \tfrac R6 + \tfrac R3 = \tfrac{5R}{6}$, not $3R/4$.`),

  // ---------- Concepts, graphs and mixed ----------
  mcq(3, 'drift and thermal motion', r`Which statement about electrons in a metal wire carrying a steady current is NOT correct?`, 'They all move along the wire at their thermal speed of about $10^{6}\\ \\mathrm{m\\,s^{-1}}$', ['They drift in the direction opposite to the field with a very small average speed', 'The drift velocity is proportional to the electric field in an ohmic conductor', 'A small electric field exists along the wire'],
    r`The thermal motion is random in direction, with an average of zero along the wire. Only a tiny drift (about $10^{-4}$ m/s) is superposed, and this carries the current. The other statements are correct.`, { trap: 'Do not confuse the thermal speed with the drift speed.' }),
  mcq(3, 'sign conventions', r`A current of 2 A flows through a $5\ \Omega$ resistor from point X to point Y. The potential difference $V_X - V_Y$ is`, '+10 V', ['-10 V', '+2.5 V', '+7 V'],
    r`Current flows from high to low potential through a resistor, so $V_X > V_Y$ and $V_X - V_Y = IR = 2\times5 = +10$ V.`),
  mcq(4, 'resistance of a wire', r`A wire has its length doubled and its radius doubled (same material). Its resistance becomes`, 'half the original', ['the same', 'double', 'one-fourth'],
    r`$R = \dfrac{\rho L}{\pi r^2}$. $L\to2L$ gives a factor 2 and $r\to2r$ gives a factor $\tfrac14$: $R\to\tfrac24R = \tfrac12R$.`),
  mcq(4, 'graph of resistance and temperature', r`The graph of resistance against temperature for an NTC thermistor shows`, 'a resistance that falls steeply (roughly exponentially) as the temperature rises', ['a resistance that rises linearly with temperature', 'a constant resistance', 'a resistance that rises steeply with temperature'],
    r`An NTC (negative temperature coefficient) thermistor is a semiconductor whose carrier density rises quickly with temperature, so the resistance falls rapidly. A metal's graph rises roughly linearly.`),
  mn(4, 'resistance of a wire', r`Wire A has resistivity $\rho$ and radius $r$. Wire B has resistivity $2\rho$ and radius $2r$. Both have the same length. The ratio $R_A/R_B$ is`, 2, [0.5, 8, 4], '',
    r`$R\propto\dfrac{\rho}{r^2}$. $\dfrac{R_A}{R_B} = \dfrac{\rho/r^2}{2\rho/4r^2} = \dfrac{1}{1/2} = 2$.`),
  mcq(4, 'ammeter', r`A galvanometer of resistance $G$ is converted into an ammeter by a shunt $S$. The resistance of the ammeter is`, r`$\dfrac{GS}{G + S}$, which is smaller than $S$`, [r`$G + S$`, r`$G$`, r`$\dfrac{G + S}{GS}$`],
    r`$G$ and $S$ are in parallel: $\dfrac{GS}{G + S}$, smaller than both. This is why a good ammeter hardly disturbs the circuit. A voltmeter, made by adding a series resistance, has a resistance larger than $G$.`),
  mcq(5, 'infinite grid', r`An infinite square grid is made of identical resistors $R$ on every side of each square. The resistance between two adjacent nodes is`, r`$R/2$`, [r`$R$`, r`$R/4$`, r`$2R/3$`],
    r`Inject $I$ at node A and remove it at infinity: by symmetry $I/4$ flows into each of the four resistors at A. Then take $I$ out at B and bring it in from infinity, with $I/4$ along each of B's four resistors. Superposing, the resistor AB carries $\tfrac I4 + \tfrac I4 = \tfrac I2$, so $V_{AB} = \tfrac I2R$ and $R_{AB} = R/2$.`, { trap: 'The superposition (symmetry) trick; no series-parallel reduction exists.' }),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: exFor(2, 'mcq'), sub: 'units', group: 'm1',
    q: r`Match each quantity in List I with its SI unit in List II.`,
    options: ['A-q, B-s, C-p, D-r', 'A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p', 'A-q, B-p, C-s, D-r'], answer: 0,
    sol: r`Resistivity: $\Omega\,\mathrm{m}$ (q). Conductivity is the inverse: $\Omega^{-1}\mathrm{m}^{-1}$ (s). Current density is current per area: $\mathrm{A\,m^{-2}}$ (p). Mobility is $v_d/E$: $\mathrm{m^2\,V^{-1}\,s^{-1}}$ (r).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: exFor(3, 'mcq'), sub: 'instruments', group: 'm2',
    q: r`Match each instrument with its description.`,
    options: ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'], answer: 0,
    sol: r`The ammeter has a very small resistance and is in series (q). The voltmeter has a very large resistance and is in parallel (p). The potentiometer measures an emf without drawing current from the cell (r). The metre bridge finds an unknown resistance by comparing it with a known one at a balance point (s).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: exFor(4, 'mcq'), sub: 'symmetrical networks', group: 'm3',
    q: r`All resistors have resistance $R$. Match each network with its equivalent resistance.`,
    options: ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'], answer: 0,
    sol: r`A cube across an edge: $\tfrac{7R}{12}$ (p). Across a face diagonal: $\tfrac{3R}{4}$ (q). Across a body diagonal: $\tfrac{5R}{6}$ (r). The infinite ladder with series $R$ and shunt $R$: $\tfrac{(1 + \sqrt5)R}{2}$ (s).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: exFor(3, 'mcq'), sub: 'combination of cells', group: 'm4',
    q: r`$n$ identical cells, each of emf $\mathcal E$ and internal resistance $r$, are combined. Match each property with its value.`,
    options: ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'], answer: 0,
    sol: r`Series: emf $n\mathcal E$ (p) and internal resistance $nr$ (r). Parallel: emf $\mathcal E$ (q) and internal resistance $r/n$ (s).` },
];
// vary the position of the correct code in match items
items.filter((x) => x.format === 'match').forEach((it, i) => {
  const pos = [1, 3, 0, 2][i]; const a = it.answer; [it.options[a], it.options[pos]] = [it.options[pos], it.options[a]]; it.answer = pos;
});

const groups = {
  m1: { title: 'Quantities and units',
    list1: ['A. Resistivity', 'B. Conductivity', 'C. Current density', 'D. Mobility of charge carriers'],
    list2: [r`p. $\mathrm{A\,m^{-2}}$`, r`q. $\Omega\,\mathrm{m}$`, r`r. $\mathrm{m^2\,V^{-1}\,s^{-1}}$`, r`s. $\Omega^{-1}\,\mathrm{m^{-1}}$`] },
  m2: { title: 'Instruments',
    list1: ['A. Ammeter', 'B. Voltmeter', 'C. Potentiometer', 'D. Metre bridge'],
    list2: ['p. Very high resistance, connected in parallel', 'q. Very low resistance, connected in series', 'r. Measures an emf without drawing current from the cell', 's. Compares an unknown resistance with a known one at a balance point'] },
  m3: { title: 'Equivalent resistances',
    list1: ['A. Cube, across one edge', 'B. Cube, across a face diagonal', 'C. Cube, across a body diagonal', 'D. Infinite ladder (series $R$, shunt $R$)'],
    list2: [r`p. $\dfrac{7R}{12}$`, r`q. $\dfrac{3R}{4}$`, r`r. $\dfrac{5R}{6}$`, r`s. $\dfrac{(1 + \sqrt5)R}{2}$`] },
  m4: { title: 'Combining identical cells',
    list1: ['A. Emf of $n$ cells in series', 'B. Emf of $n$ cells in parallel', 'C. Internal resistance of $n$ cells in series', 'D. Internal resistance of $n$ cells in parallel'],
    list2: [r`p. $n\mathcal E$`, r`q. $\mathcal E$`, r`r. $nr$`, r`s. $r/n$`] },
  p1: { title: 'A resistor network on a battery',
    passage: r`<p>A battery of emf 12 V and internal resistance $1\ \Omega$ is connected to a circuit made of a $3\ \Omega$ resistor and a $6\ \Omega$ resistor in parallel, in series with a $4\ \Omega$ resistor.</p>` },
  p2: { title: 'An immersion heater',
    passage: r`<p>An immersion heater is marked 1500 W, 220 V. It is used to heat 3 kg of water from $25^\circ$C to $75^\circ$C. The specific heat of water is $4200\ \mathrm{J\,kg^{-1}K^{-1}}$ and 10 % of the heat given out by the heater is lost to the surroundings.</p>` },
  p3: { title: 'A potentiometer experiment',
    passage: r`<p>A potentiometer wire AB is 10 m long with a resistance of $20\ \Omega$. It is connected in series with a $10\ \Omega$ resistor to a 3 V battery of negligible internal resistance. A cell X balances at 6.5 m from A. When a $4\ \Omega$ resistor is connected across X, the balance point moves to 5.0 m.</p>` },
};

const pas = (level, sub, group, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: exFor(level, 'nat'), sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
items.push(
  pas(2, 'combination of resistors', 'p1', r`Find the current drawn from the battery (in A, 2 decimals).`, 12 / 7, 0.01, 2,
    r`The parallel pair: $\dfrac{3\times6}{9} = 2\ \Omega$. Total external $= 2 + 4 = 6\ \Omega$. With the internal $1\ \Omega$: $7\ \Omega$. $I = 12/7 = 1.71$ A.`, { unit: 'A' }),
  pas(3, 'internal resistance', 'p1', r`Find the terminal voltage of the battery (in V, 2 decimals).`, 12 - 12 / 7, 0.02, 2,
    r`$V = \mathcal E - Ir = 12 - \dfrac{12}{7}\times1 = 10.29$ V.`, { unit: 'V' }),
  pas(4, 'combination of resistors', 'p1', r`Find the power dissipated in the $6\ \Omega$ resistor (in W, 2 decimals).`, (12 / 7 * 2) ** 2 / 6, 0.02, 2,
    r`The voltage across the parallel pair is $I\times2 = \dfrac{24}{7} = 3.43$ V. $P = \dfrac{V^2}{R} = \dfrac{3.43^2}{6} = 1.96$ W.`, { unit: 'W' }),
  pas(2, 'electric power', 'p2', r`Find the resistance of the heater (in $\Omega$, 1 decimal).`, 220 * 220 / 1500, 0.1, 1,
    r`$R = V^2/P = \dfrac{220^2}{1500} = 32.3\ \Omega$.`, { unit: 'Ω' }),
  pas(3, 'electric power', 'p2', r`Find the current drawn from a 220 V supply (in A, 2 decimals).`, 1500 / 220, 0.01, 2,
    r`$I = P/V = \dfrac{1500}{220} = 6.82$ A.`, { unit: 'A' }),
  pas(4, 'heating effect', 'p2', r`Find the time needed (in s, nearest whole second).`, 3 * 4200 * 50 / (1500 * 0.9), 1, 0,
    r`Heat needed $= mc\Delta T = 3\times4200\times50 = 6.3\times10^{5}$ J. Useful power $= 0.9\times1500 = 1350$ W. $t = \dfrac{6.3\times10^{5}}{1350} = 467$ s.`, { unit: 's' }),
  pas(2, 'potentiometer', 'p3', r`Find the potential gradient along the wire (in $\mathrm{V\,m^{-1}}$, 2 decimals).`, 0.2, 0.005, 2,
    r`Current $= 3/30 = 0.1$ A. Voltage across the wire $= 0.1\times20 = 2$ V over 10 m: $0.20\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m' }),
  pas(3, 'potentiometer', 'p3', r`Find the emf of the cell X (in V, 2 decimals).`, 1.3, 0.005, 2,
    r`$\mathcal E = 0.2\times6.5 = 1.30$ V.`, { unit: 'V' }),
  pas(4, 'potentiometer', 'p3', r`Find the internal resistance of the cell X (in $\Omega$, 1 decimal).`, 4 * (6.5 - 5) / 5, 0.05, 1,
    r`The terminal voltage with the $4\ \Omega$ load is $0.2\times5.0 = 1.0$ V. $r = R\left(\dfrac{\mathcal E}{V} - 1\right) = 4\times(1.3 - 1) = 1.2\ \Omega$.`, { unit: 'Ω' }),
);

const gens = [
  { id: 'ec-g01', type: 'nat', level: 1, exams: exFor(1, 'nat'), sub: 'electric current',
    make(rng) {
      const I = choose(rng, [0.5, 1, 2, 3, 4]); const t = choose(rng, [10, 20, 30, 60]); const Q = I * t;
      return { I, t, q: `A steady current of ${I} A flows through a wire for ${t} s. How much charge passes a cross-section (in C)?`, answer: Q, tol: 0.01, unit: 'C',
        sol: r`$Q = It = ${I}\times${t} = ${Q}$ C.`, trap: 'Charge is current times time.' };
    },
    verify: (p) => p.I * p.t },
  { id: 'ec-g02', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'drift velocity',
    make(rng) {
      const I = choose(rng, [1, 2, 3, 5]); const A = choose(rng, [0.5, 1, 2]); const v = I / (8.5e28 * A * 1e-6 * QE) * 1e3;
      return { I, A, q: `A copper wire of cross-section ${A} $\\mathrm{mm^2}$ carries ${I} A. The free-electron density is $8.5\\times10^{28}\\ \\mathrm{m^{-3}}$ ($e = 1.6\\times10^{-19}$ C). Find the drift velocity (in $\\mathrm{mm\\,s^{-1}}$, 3 decimals).`, answer: +v.toFixed(3), tol: 0.002, unit: 'mm/s',
        sol: r`$v_d = \dfrac{I}{nAe} = \dfrac{${I}}{8.5\times10^{28}\times${A}\times10^{-6}\times1.6\times10^{-19}} = ${tx(v / 1e3)}\ \mathrm{m\,s^{-1}} = ${S(v)}\ \mathrm{mm\,s^{-1}}$.`, trap: 'mm² to m² is 10⁻⁶.' };
    },
    verify: (p) => { const J = p.I / (p.A * 1e-6); return J / (8.5e28 * QE) * 1e3; } },
  { id: 'ec-g03', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'resistance of a wire',
    make(rng) {
      const L = choose(rng, [5, 10, 20, 50]); const A = choose(rng, [0.5, 1, 2]); const R = 1.7e-8 * L / (A * 1e-6);
      return { L, A, q: `Find the resistance of a copper wire ${L} m long with cross-section ${A} $\\mathrm{mm^2}$ (resistivity $1.7\\times10^{-8}\\ \\Omega\\,\\mathrm{m}$), in $\\Omega$ (3 decimals).`, answer: +R.toFixed(3), tol: 0.002, unit: 'Ω',
        sol: r`$R = \dfrac{\rho L}{A} = \dfrac{1.7\times10^{-8}\times${L}}{${A}\times10^{-6}} = ${S(R)}\ \Omega$.`, trap: 'Convert mm² to m².' };
    },
    verify: (p) => 0.017 * p.L / p.A },
  { id: 'ec-g04', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'stretching a wire',
    make(rng) {
      const R0 = pick(rng, 2, 10, 1); const n = choose(rng, [2, 3, 4]); const R = R0 * n * n;
      return { R0, n, q: `A wire of resistance ${R0} $\\Omega$ is uniformly stretched to ${n} times its length (volume unchanged). Find its new resistance (in $\\Omega$).`, answer: R, tol: 0.01, unit: 'Ω',
        sol: r`Length $\times${n}$, area $\div${n}$. $R = \rho L/A$ is multiplied by $${n}\times${n} = ${n * n}$: $${R0}\times${n * n} = ${R}\ \Omega$.`, trap: 'Stretching also makes the wire thinner: factor n², not n.' };
    },
    verify: (p) => { const L = p.n; const A = 1 / p.n; return p.R0 * (L / A); } },
  { id: 'ec-g05', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'cutting a wire',
    make(rng) {
      const n = choose(rng, [2, 3, 4, 5]); const k = pick(rng, 1, 6, 1); const R0 = k * n * n;
      return { n, k, R0, q: `A uniform wire of resistance ${R0} $\\Omega$ is cut into ${n} equal pieces and the pieces are connected in parallel. Find the equivalent resistance (in $\\Omega$).`, answer: k, tol: 0.01, unit: 'Ω',
        sol: r`Each piece is $${R0}/${n} = ${R0 / n}\ \Omega$. ${n} equal resistors in parallel: $${R0 / n}/${n} = ${k}\ \Omega$ ($= R/n^2$).`, trap: 'Both the piece and the parallel step divide by n.' };
    },
    verify: (p) => { const piece = p.R0 / p.n; return 1 / (p.n / piece); } },
  { id: 'ec-g06', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'temperature dependence',
    make(rng) {
      const R0 = choose(rng, [50, 100, 200]); const a = choose(rng, [0.003, 0.004, 0.0045]); const dT = choose(rng, [20, 40, 60, 80, 100]); const R = R0 * (1 + a * dT);
      return { R0, a, dT, q: `A resistor has $${R0}\\ \\Omega$ at $0^\\circ$C and a temperature coefficient of $${a}\\ \\mathrm{^\\circ C^{-1}}$. Find its resistance at $${dT}^\\circ$C (in $\\Omega$, 2 decimals).`, answer: +R.toFixed(2), tol: 0.02, unit: 'Ω',
        sol: r`$R_t = R_0(1 + \alpha t) = ${R0}\times(1 + ${a}\times${dT}) = ${S(R)}\ \Omega$.`, trap: 'The factor is (1 + αΔT), not αΔT alone.' };
    },
    verify: (p) => p.R0 + p.R0 * p.a * p.dT },
  { id: 'ec-g07', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'combination of resistors',
    make(rng) {
      const R1 = pick(rng, 2, 12, 2); const R2 = pick(rng, 2, 12, 2); const R3 = pick(rng, 3, 12, 3);
      const par = R1 * R2 / (R1 + R2); const Req = par + R3;
      const o = numOpts(rng, Req, [R1 + R2 + R3, (R1 + R2) * R3 / (R1 + R2 + R3), par + R3 + 1], 'Ω', 3);
      return { R1, R2, R3, ...o, q: `Resistors of ${R1} Ω and ${R2} Ω are connected in parallel, and this pair is in series with a ${R3} Ω resistor. The equivalent resistance is`,
        sol: `Parallel pair: $\\dfrac{${R1}\\times${R2}}{${R1} + ${R2}} = ${fmt(par, 3)}$ Ω. In series with ${R3} Ω: ${fmt(Req, 3)} Ω. Adding all three (${R1 + R2 + R3} Ω) treats everything as series; the third wrong value puts the series pair in parallel instead.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(1 / (1 / p.R1 + 1 / p.R2) + p.R3, 3)} Ω`) },
  { id: 'ec-g08', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'internal resistance',
    make(rng) {
      const E = choose(rng, [6, 9, 12, 24]); const rin = choose(rng, [0.5, 1, 2]); const R = choose(rng, [4, 5, 8, 10]); const V = E * R / (R + rin);
      return { E, rin, R, q: `A battery of emf ${E} V and internal resistance ${rin} $\\Omega$ is connected to a ${R} $\\Omega$ resistor. Find the terminal voltage (in V, 2 decimals).`, answer: +V.toFixed(2), tol: 0.02, unit: 'V',
        sol: r`$I = \dfrac{\mathcal E}{R + r} = \dfrac{${E}}{${R + rin}} = ${S(E / (R + rin), 4)}$ A. $V = IR = ${S(E / (R + rin), 4)}\times${R} = ${S(V)}$ V. (Check: $\mathcal E - Ir = ${S(E - E / (R + rin) * rin)}$ V.)`, trap: 'Terminal voltage is the voltage across R, not the emf.' };
    },
    verify: (p) => p.E - p.E / (p.R + p.rin) * p.rin },
  { id: 'ec-g09', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'maximum power',
    make(rng) {
      const E = choose(rng, [6, 9, 12, 24]); const rin = choose(rng, [1, 2, 3, 4]); const P = E * E / (4 * rin);
      return { E, rin, q: `A battery of emf ${E} V and internal resistance ${rin} $\\Omega$ is connected to a variable resistor. Find the maximum power that can be delivered to the resistor (in W, 2 decimals).`, answer: +P.toFixed(2), tol: 0.02, unit: 'W',
        sol: r`The maximum occurs for $R = r = ${rin}\ \Omega$. $I = \dfrac{${E}}{${2 * rin}} = ${S(E / (2 * rin))}$ A and $P = I^2R = ${S(P)}$ W ($= \mathcal E^2/4r$).`, trap: 'Do not use the full emf squared over R; the current is E/2r.' };
    },
    verify: (p) => { let best = 0; for (let R = 0.01; R < 50; R += 0.01) { const I = p.E / (R + p.rin); best = Math.max(best, I * I * R); } return best; } },
  { id: 'ec-g10', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'Wheatstone bridge',
    make(rng) {
      const P = choose(rng, [5, 10, 20]); const Q = choose(rng, [10, 15, 20, 30]); const R = choose(rng, [6, 12, 18, 24]); const S2 = R * Q / P;
      return { P, Q, R, q: `A Wheatstone bridge is balanced with $P = ${P}\\ \\Omega$, $Q = ${Q}\\ \\Omega$ and $R = ${R}\\ \\Omega$, where $P/Q = R/S$. Find $S$ (in $\\Omega$).`, answer: +S2.toFixed(2), tol: 0.02, unit: 'Ω',
        sol: r`$S = \dfrac{RQ}{P} = \dfrac{${R}\times${Q}}{${P}} = ${S(S2)}\ \Omega$.`, trap: 'Keep P/Q = R/S as written: S = RQ/P, not RP/Q.' };
    },
    verify: (p) => p.R / (p.P / p.Q) },
  { id: 'ec-g11', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'metre bridge',
    make(rng) {
      const R = choose(rng, [5, 10, 20]); const l = choose(rng, [20, 25, 30, 40, 60]); const X = R * (100 - l) / l;
      return { R, l, q: `In a metre bridge the known resistance $R = ${R}\\ \\Omega$ is in the left gap and the unknown $X$ in the right gap. The balance point is ${l} cm from the left end. Find $X$ (in $\\Omega$, 2 decimals).`, answer: +X.toFixed(2), tol: 0.02, unit: 'Ω',
        sol: r`$\dfrac RX = \dfrac{l}{100 - l}$, so $X = R\dfrac{100 - l}{l} = ${R}\times\dfrac{${100 - l}}{${l}} = ${S(X)}\ \Omega$.`, trap: 'The resistor in the left gap pairs with the LEFT length.' };
    },
    verify: (p) => { const k = p.l / (100 - p.l); return p.R / k; } },
  { id: 'ec-g12', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'potentiometer',
    make(rng) {
      const R = choose(rng, [2, 4, 5, 10]); const l1 = choose(rng, [60, 75, 80, 90]); const l2 = l1 - choose(rng, [5, 10, 15]); const r2 = R * (l1 - l2) / l2;
      return { R, l1, l2, q: `A cell balances at ${l1} cm on a potentiometer wire when on open circuit. With a ${R} $\\Omega$ resistor across it, the balance point is at ${l2} cm. Find the internal resistance of the cell (in $\\Omega$, 2 decimals).`, answer: +r2.toFixed(2), tol: 0.02, unit: 'Ω',
        sol: r`$\mathcal E\propto${l1}$ and $V\propto${l2}$. $r = R\left(\dfrac{\mathcal E}{V} - 1\right) = ${R}\times\dfrac{${l1} - ${l2}}{${l2}} = ${S(r2)}\ \Omega$.`, trap: 'The fall of balance length measures the voltage lost inside.' };
    },
    verify: (p) => { const E = p.l1; const V = p.l2; const I = V / p.R; return (E - V) / I; } },
  { id: 'ec-g13', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'galvanometer to ammeter',
    make(rng) {
      const G = choose(rng, [50, 100, 200]); const Ig = choose(rng, [1, 2, 5]); const I = choose(rng, [0.5, 1, 2, 5]); const S2 = Ig * 1e-3 * G / (I - Ig * 1e-3);
      return { G, Ig, I, q: `A galvanometer of resistance ${G} $\\Omega$ gives full-scale deflection for ${Ig} mA. What shunt resistance (in $\\Omega$, 4 decimals) converts it into an ammeter of range ${I} A?`, answer: +S2.toFixed(4), tol: 0.0005, unit: 'Ω',
        sol: r`The shunt takes $I - I_g = ${S(I - Ig * 1e-3, 5)}$ A at the same voltage: $S = \dfrac{I_gG}{I - I_g} = \dfrac{${Ig}\times10^{-3}\times${G}}{${S(I - Ig * 1e-3, 5)}} = ${S(S2, 4)}\ \Omega$.`, trap: 'Use the current in the shunt (I - Ig), not the full range.' };
    },
    verify: (p) => { const V = p.Ig * 1e-3 * p.G; return V / (p.I - p.Ig * 1e-3); } },
  { id: 'ec-g14', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'galvanometer to voltmeter',
    make(rng) {
      const G = choose(rng, [50, 100, 200]); const Ig = choose(rng, [1, 2, 5]); const V = choose(rng, [3, 5, 10, 15, 30]); const R = V / (Ig * 1e-3) - G;
      return { G, Ig, V, q: `A galvanometer of resistance ${G} $\\Omega$ gives full-scale deflection for ${Ig} mA. What series resistance (in $\\Omega$) converts it into a voltmeter of range ${V} V?`, answer: R, tol: 0.5, unit: 'Ω',
        sol: r`The total resistance must be $\dfrac{V}{I_g} = \dfrac{${V}}{${Ig}\times10^{-3}} = ${V / (Ig * 1e-3)}\ \Omega$. Series resistance $= ${V / (Ig * 1e-3)} - ${G} = ${R}\ \Omega$.`, trap: 'Subtract the galvanometer resistance.' };
    },
    verify: (p) => p.V / (p.Ig / 1000) - p.G },
  { id: 'ec-g15', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'combination of cells',
    make(rng) {
      const n = choose(rng, [2, 3, 4, 5]); const m = choose(rng, [2, 3, 4]); const E = choose(rng, [1.5, 2]); const rin = choose(rng, [0.2, 0.4, 0.5]); const R = choose(rng, [1, 2, 3]);
      const I = n * E / (R + n * rin / m);
      return { n, m, E, rin, R, q: `${n * m} identical cells, each of emf ${E} V and internal resistance ${rin} $\\Omega$, are arranged in ${m} parallel rows with ${n} cells in series in each row. The battery drives a ${R} $\\Omega$ resistor. Find the current (in A, 2 decimals).`, answer: +I.toFixed(2), tol: 0.02, unit: 'A',
        sol: r`Each row: emf $${n}\times${E} = ${n * E}$ V and internal resistance $${n}\times${rin} = ${S(n * rin)}\ \Omega$. ${m} rows in parallel: emf ${n * E} V and $${S(n * rin)}/${m} = ${S(n * rin / m, 3)}\ \Omega$. $I = \dfrac{${n * E}}{${R} + ${S(n * rin / m, 3)}} = ${S(I)}$ A.`, trap: 'Rows in parallel divide the internal resistance by the number of rows.' };
    },
    verify: (p) => { const rowR = p.n * p.rin; return (p.m * p.n * p.E / rowR) / (1 + p.m * p.R / rowR); } },
  { id: 'ec-g16', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'electrical energy',
    make(rng) {
      const n = choose(rng, [3, 4, 5, 6]); const P = choose(rng, [40, 60, 100]); const h = choose(rng, [4, 5, 6]); const rate = choose(rng, [5, 6, 7, 8]); const kwh = n * P * h * 30 / 1000; const cost = kwh * rate;
      return { n, P, h, rate, q: `${n} bulbs of ${P} W each are used for ${h} hours a day for 30 days. Electrical energy costs ${rate} rupees per unit (kWh). Find the cost (in rupees, 1 decimal).`, answer: +cost.toFixed(1), tol: 0.1, unit: 'rupees',
        sol: r`Energy $= ${n}\times${P}\ \mathrm{W}\times${h}\ \mathrm{h}\times30 = ${n * P * h * 30}$ Wh $= ${S(kwh)}$ kWh. Cost $= ${S(kwh)}\times${rate} = ${S(cost)}$ rupees.`, trap: 'Convert watt-hours to kilowatt-hours.' };
    },
    verify: (p) => (p.n * (p.P / 1000) * p.h * 30) * p.rate },
  { id: 'ec-g17', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'power in bulbs',
    make(rng) {
      const P1 = choose(rng, [25, 40, 60]); const P2 = choose(rng, [75, 100, 150]); const R1 = 220 * 220 / P1; const R2 = 220 * 220 / P2; const I = 220 / (R1 + R2); const p1 = I * I * R1;
      return { P1, P2, q: `Bulbs rated (220 V, ${P1} W) and (220 V, ${P2} W) are connected in series across 220 V. Find the power dissipated in the ${P1} W bulb (in W, 2 decimals; constant resistances).`, answer: +p1.toFixed(2), tol: 0.03, unit: 'W',
        sol: r`$R_1 = \dfrac{220^2}{${P1}} = ${S(R1)}\ \Omega$ and $R_2 = \dfrac{220^2}{${P2}} = ${S(R2)}\ \Omega$. $I = \dfrac{220}{${S(R1 + R2)}} = ${S(I, 4)}$ A. $P_1 = I^2R_1 = ${S(p1)}$ W. In series the lower-rated bulb (larger resistance) glows brighter.`, trap: 'In series the lower-rated bulb dissipates more.' };
    },
    verify: (p) => { const a = 220 * 220 / p.P1; const b = 220 * 220 / p.P2; return 220 * 220 * a / ((a + b) ** 2); } },
  { id: 'ec-g18', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'symmetrical networks',
    make(rng) {
      const kind = choose(rng, ['edge', 'face', 'body']); const k = pick(rng, 1, 4, 1);
      const R = kind === 'edge' ? 12 * k : kind === 'face' ? 4 * k : 6 * k; const ans = kind === 'edge' ? 7 * k : kind === 'face' ? 3 * k : 5 * k;
      const where = kind === 'edge' ? 'the two ends of one edge' : kind === 'face' ? 'two opposite corners of one face (the ends of a face diagonal)' : 'two opposite corners of the cube (the ends of a body diagonal)';
      const frac = kind === 'edge' ? '7R/12' : kind === 'face' ? '3R/4' : '5R/6';
      return { kind, k, R, q: `Twelve resistors of ${R} $\\Omega$ each are placed along the edges of a cube. Find the resistance between ${where} (in $\\Omega$).`, answer: ans, tol: 0, unit: 'Ω',
        sol: r`By symmetry (equal-potential corners, or superposition) the standard result is $${frac}$. With $R = ${R}\ \Omega$ this gives ${ans} $\Omega$.`, trap: 'Edge 7R/12, face diagonal 3R/4, body diagonal 5R/6.' };
    },
    verify: (p) => { const f = { edge: 7 / 12, face: 3 / 4, body: 5 / 6 }[p.kind]; return Math.round(f * p.R); } },
  { id: 'ec-g19', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'ladder of resistors',
    make(rng) {
      const [r1, r2, x] = choose(rng, [[1, 2, 2], [2, 1.5, 3], [3, 6, 6], [4, 3, 6], [6, 4.5, 9], [2, 4, 4], [5, 10, 10]]);
      return { r1, r2, x, q: `An infinite ladder repeats a section of ${r1} $\\Omega$ in the upper rail followed by ${r2} $\\Omega$ across the two rails. Find the resistance between the input terminals (in $\\Omega$).`, answer: x, tol: 0.01, unit: 'Ω',
        sol: r`Let the ladder be $x$. Then $x = ${r1} + \dfrac{${r2}x}{${r2} + x}$, so $x^2 - ${r1}x - ${S(r1 * r2)} = 0$ and $x = \dfrac{${r1} + \sqrt{${r1}^2 + 4\times${S(r1 * r2)}}}{2} = \dfrac{${r1} + ${S(Math.sqrt(r1 * r1 + 4 * r1 * r2))}}{2} = ${x}\ \Omega$.`, trap: 'The rest of the ladder is the same ladder again.' };
    },
    verify: (p) => { let x = 1; for (let i = 0; i < 200; i++) x = p.r1 + p.r2 * x / (p.r2 + x); return x; } },
  { id: 'ec-g20', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'ring of wire',
    make(rng) {
      const R = choose(rng, [32, 48, 64, 72]); const th = choose(rng, [60, 90, 120, 180]); const Req = R * th * (360 - th) / 360 ** 2;
      return { R, th, q: `A uniform wire of resistance ${R} $\\Omega$ is bent into a circle. Find the resistance between two points on it ${th}° apart (in $\\Omega$, 2 decimals).`, answer: +Req.toFixed(2), tol: 0.02, unit: 'Ω',
        sol: r`The arcs have resistances $${S(R * th / 360)}\ \Omega$ and $${S(R * (360 - th) / 360)}\ \Omega$, in parallel: $\dfrac{${S(R * th / 360)}\times${S(R * (360 - th) / 360)}}{${R}} = ${S(Req)}\ \Omega$.`, trap: 'The two arcs are in parallel, not in series.' };
    },
    verify: (p) => { const a = p.R * p.th / 360; const b = p.R - a; return 1 / (1 / a + 1 / b); } },
  { id: 'ec-g21', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'Kirchhoff\'s laws',
    make(rng) {
      const E1 = choose(rng, [6, 8, 10, 12]); const E2 = choose(rng, [2, 4, 6]); const r1 = choose(rng, [1, 2]); const r2 = choose(rng, [1, 2, 3]); const R = choose(rng, [2, 3, 4, 6]);
      const V = (E1 / r1 + E2 / r2) / (1 / r1 + 1 / r2 + 1 / R); const I = V / R;
      return { E1, E2, r1, r2, R, q: `Two cells, ${E1} V with internal resistance ${r1} $\\Omega$ and ${E2} V with internal resistance ${r2} $\\Omega$, are connected in parallel (like poles together) across a ${R} $\\Omega$ resistor. Find the current in the resistor (in A, 2 decimals).`, answer: +I.toFixed(2), tol: 0.02, unit: 'A',
        sol: r`Let the common voltage be $V$. Node equation: $\dfrac{${E1} - V}{${r1}} + \dfrac{${E2} - V}{${r2}} = \dfrac{V}{${R}}$, giving $V = \dfrac{${E1}/${r1} + ${E2}/${r2}}{1/${r1} + 1/${r2} + 1/${R}} = ${S(V)}$ V. $I = V/R = ${S(I)}$ A.`, trap: 'Both cells feed the same node voltage; do not add their emfs.' };
    },
    verify: (p) => { const Eth = (p.E1 * p.r2 + p.E2 * p.r1) / (p.r1 + p.r2); const rth = p.r1 * p.r2 / (p.r1 + p.r2); return Eth / (rth + p.R); } },
  { id: 'ec-g22', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'brightness of bulbs',
    make(rng) {
      const [Pa, Pb] = choose(rng, [[40, 100], [60, 100], [25, 60], [40, 60], [100, 200]]); const series = rng() < 0.5;
      const brighter = series ? `The ${Pa} W bulb` : `The ${Pb} W bulb`;
      const wrong = series ? `The ${Pb} W bulb` : `The ${Pa} W bulb`;
      const o = shuffleOpts(rng, brighter, [wrong, 'Both glow equally', 'It cannot be said without the supply voltage']);
      return { Pa, Pb, series, ...o, q: `Two bulbs rated ${Pa} W and ${Pb} W, both for 220 V, are connected ${series ? 'in series' : 'in parallel'} across a 220 V supply. Which bulb glows brighter?`,
        sol: series ? `$R = V^2/P$, so the ${Pa} W bulb has the larger resistance. In series the same current flows, and $P = I^2R$ is larger for the larger $R$: the ${Pa} W bulb glows brighter.` : `In parallel each gets 220 V, so each uses its rated power, and the ${Pb} W bulb (smaller resistance, larger current) is brighter.`, trap: 'Series: lower rating brighter. Parallel: higher rating brighter.' };
    },
    verify: (p) => p.options.findIndex((o) => o === (p.series ? `The ${p.Pa} W bulb` : `The ${p.Pb} W bulb`)) },
  { id: 'ec-g23', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'voltmeter loading',
    make(rng) {
      const E = choose(rng, [6, 12, 24]); const R = choose(rng, [1, 2, 5]); const f = choose(rng, [1, 2, 5, 10]); const Rv = f * R; const par = R * Rv / (R + Rv); const V = E * par / (par + R);
      return { E, R, f, q: `A ${E} V battery of negligible internal resistance is connected to two ${R} $\\mathrm{k\\Omega}$ resistors in series. A voltmeter of resistance ${Rv} $\\mathrm{k\\Omega}$ is connected across one of them. What does it read (in V, 2 decimals)?`, answer: +V.toFixed(2), tol: 0.02, unit: 'V',
        sol: r`The meter in parallel with ${R} kΩ: $\dfrac{${R}\times${Rv}}{${R} + ${Rv}} = ${S(par)}$ kΩ. Voltage divider: $${E}\times\dfrac{${S(par)}}{${S(par)} + ${R}} = ${S(V)}$ V. (The true value without the meter is ${E / 2} V.)`, trap: 'The voltmeter changes the circuit it measures.' };
    },
    verify: (p) => { const Rv = p.f * p.R; const g = 1 / p.R + 1 / Rv; const Rp = 1 / g; const I = p.E / (p.R + Rp); return I * Rp; } },
  { id: 'ec-g24', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'heating effect',
    make(rng) {
      const m = choose(rng, [1, 2, 3]); const dT = choose(rng, [20, 40, 60, 80]); const P = choose(rng, [1000, 1500, 2000]); const eta = choose(rng, [1, 0.8, 0.9]); const t = m * 4200 * dT / (P * eta);
      return { m, dT, P, eta, q: `An immersion heater of ${P} W heats ${m} kg of water through ${dT} K. ${eta === 1 ? 'No heat is lost.' : `${Math.round((1 - eta) * 100)} % of the heat is lost to the surroundings.`} Take $c = 4200\\ \\mathrm{J\\,kg^{-1}K^{-1}}$. Find the time needed (in s, nearest second).`, answer: Math.round(t), tol: 1, unit: 's',
        sol: r`Heat needed $= mc\Delta T = ${m}\times4200\times${dT} = ${m * 4200 * dT}$ J. Useful power $= ${S(P * eta)}$ W. $t = \dfrac{${m * 4200 * dT}}{${S(P * eta)}} = ${S(t, 4)}$ s $\approx ${Math.round(t)}$ s.`, trap: 'Only the useful fraction of the power heats the water.' };
    },
    verify: (p) => Math.round(p.m * 4200 * p.dT / (p.P * p.eta)) },
  { id: 'ec-g25', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'electric power',
    make(rng) {
      const P = choose(rng, [40, 60, 100, 200]); const V = 220; const V2 = choose(rng, [110, 165, 200, 240]); const P2 = P * (V2 / V) ** 2;
      return { P, V2, q: `A bulb is marked (220 V, ${P} W). Assuming its resistance stays constant, find the power it uses when connected to ${V2} V (in W, 2 decimals).`, answer: +P2.toFixed(2), tol: 0.03, unit: 'W',
        sol: r`$R = \dfrac{220^2}{${P}} = ${S(220 * 220 / P)}\ \Omega$. $P' = \dfrac{V'^2}{R} = \dfrac{${V2}^2}{${S(220 * 220 / P)}} = ${S(P2)}$ W. (Or $P' = P(V'/V)^2$.)`, trap: 'Power goes as the square of the voltage.' };
    },
    verify: (p) => { const R = 220 * 220 / p.P; return p.V2 ** 2 / R; } },
  { id: 'ec-g26', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'balanced bridge',
    make(rng) {
      const a = choose(rng, [2, 4, 6]); const c = choose(rng, [3, 5, 9]); const k = choose(rng, [2, 3]); const b = a * k; const d = c * k; const gal = choose(rng, [5, 10, 50]);
      const Req = (a + b) * (c + d) / (a + b + c + d);
      return { a, b, c, d, gal, q: `A bridge has ${a} $\\Omega$ and ${b} $\\Omega$ in series on the upper path from A to D (through B), and ${c} $\\Omega$ and ${d} $\\Omega$ in series on the lower path (through C), with a ${gal} $\\Omega$ galvanometer joining B and C. Find the resistance between A and D (in $\\Omega$, 2 decimals).`, answer: +Req.toFixed(2), tol: 0.02, unit: 'Ω',
        sol: r`$${a}/${b} = ${c}/${d}$ (both $= 1/${k}$), so the bridge is balanced and the ${gal} Ω galvanometer carries no current. The paths $${a + b}\ \Omega$ and $${c + d}\ \Omega$ are in parallel: $\dfrac{${a + b}\times${c + d}}{${a + b + c + d}} = ${S(Req)}\ \Omega$.`, trap: 'At balance the middle element can be removed.' };
    },
    verify: (p) => 1 / (1 / (p.a + p.b) + 1 / (p.c + p.d)) },
  { id: 'ec-g27', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'current from moving charge',
    make(rng) {
      const Q = pick(rng, 1, 9, 1); const f = choose(rng, [10, 20, 25, 40, 50]); const I = Q * f;
      return { Q, f, q: `A thin ring carrying a charge of ${Q} $\\mu$C rotates at ${f} revolutions per second. Find the equivalent current (in $\\mu$A).`, answer: I, tol: 0.1, unit: 'µA',
        sol: r`The charge passes a fixed point ${f} times each second: $I = Qf = ${Q}\ \mu\mathrm{C}\times${f}\ \mathrm{s^{-1}} = ${I}\ \mu$A.`, trap: 'Use revolutions per second (frequency), not the angular speed.' };
    },
    verify: (p) => p.Q * (p.f * 2 * Math.PI) / (2 * Math.PI) },
];

export default { topic: 'current-electricity', groups, items, gens };
