// Semiconductor devices at GATE / CSIR NET level: the diode equation with ideality factor and temperature, junction and
// diffusion capacitance, varactors, Zener and tunnel diodes; BJT small-signal parameters (g_m, r_pi, r_o, Early
// voltage, intrinsic gain); JFET square law, pinch-off, self-bias and transconductance; MOSFET regions, square law,
// triode resistance, channel-length modulation, body effect, MOS capacitor, subthreshold swing, short-channel effects
// and the CMOS inverter. The JAM topics `diodes` and `transistors` cover rectifiers, alpha/beta and load lines.
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './semiconductor-devices.more.gen.js';
import more2 from './semiconductor-devices.more2.gen.js';
import r4 from './semiconductor-devices.r4.gen.js';

const VT300 = 0.025852; // kT/q at 300 K, volts
const G = ['gate', 'net'];

export default {
  topic: 'semiconductor-devices',
  items: [
    // ---------- level 1 ----------
    { id: 'sd-001', type: 'mcq', level: 1, exams: G, sub: 'MOSFET regions',
      q: 'An n-channel enhancement MOSFET has threshold voltage $V_T$. It operates in saturation (the constant-current region) when $V_{GS} > V_T$ and',
      options: ['$V_{DS} < V_{GS} - V_T$', '$V_{DS} = 0$', '$V_{DS} \\ge V_{GS} - V_T$', '$V_{DS} < 0$'], answer: 2,
      sol: 'The channel pinches off at the drain end when the gate-to-drain voltage $V_{GD} = V_{GS} - V_{DS}$ falls to $V_T$, that is when $V_{DS} = V_{GS} - V_T$. For larger $V_{DS}$ the current hardly changes: saturation. For smaller $V_{DS}$ the channel is continuous and the device acts as a voltage-controlled resistor (triode region).',
      trap: 'In a BJT "saturation" means both junctions forward biased and a small $V_{CE}$; in a MOSFET it means the opposite, a large $V_{DS}$.' },
    { id: 'sd-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'MOSFET structure',
      q: 'Why is the DC gate current of a MOSFET practically zero?',
      options: ['The gate is separated from the channel by an insulating oxide layer', 'The gate-channel junction is reverse biased', 'The channel has no free carriers until the gate current flows', 'The source and drain are shorted together'], answer: 0,
      sol: 'The gate electrode sits on a thin insulator (SiO$_2$ or a high-$\\kappa$ oxide). It forms a capacitor with the channel: charge on the gate induces the channel charge, but no steady current crosses the insulator. Input resistances of $10^{12}\\,\\Omega$ or more are typical.',
      trap: 'A reverse-biased junction is the reason for the JFET, which still has a small leakage current, not the MOSFET.' },
    { id: 'sd-003', type: 'mcq', level: 1, exams: G, sub: 'MOSFET types',
      q: 'An n-channel depletion-mode MOSFET has its gate tied to its source ($V_{GS} = 0$) and a positive $V_{DS}$. The drain current is',
      options: ['exactly zero, because no gate voltage is applied', 'non-zero, because a conducting channel exists even at $V_{GS} = 0$', 'negative, flowing from source to drain', 'set only by the gate leakage'], answer: 1,
      sol: 'A depletion-mode device is made with a doped channel already in place (its threshold voltage is negative for an n-channel device). At $V_{GS} = 0$ it conducts $I_{DSS}$; a negative gate voltage is needed to turn it off. An enhancement device, with positive $V_T$, would be off at $V_{GS} = 0$.',
      trap: 'Assuming every MOSFET is off at zero gate voltage: that is only true of enhancement devices.' },
    { id: 'sd-004', type: 'nat', level: 1, exams: G, sub: 'thermal voltage', unit: 'mV',
      q: 'The thermal voltage $V_T = k_BT/q$ of a diode at $400$ K is ______ mV (to two decimal places).',
      answer: 34.47, tol: 0.05, calc: () => 1.380649e-23 * 400 / 1.602176634e-19 * 1000,
      sol: '$V_T = \\dfrac{1.381\\times10^{-23}\\times400}{1.602\\times10^{-19}} = 3.447\\times10^{-2}$ V $= 34.47$ mV. It scales linearly with $T$: 25.85 mV at 300 K times 4/3.',
      trap: 'Using the room-temperature value 25 or 26 mV at any temperature.' },
    { id: 'sd-005', type: 'mcq', level: 1, exams: G, sub: 'BJT small signal',
      q: 'For a BJT in the active region carrying collector current $I_C$, the small-signal transconductance $g_m = \\partial I_C/\\partial V_{BE}$ is',
      options: ['$\\beta I_C/V_T$', '$V_T/I_C$', '$I_C/(\\beta V_T)$', '$I_C/V_T$'], answer: 3,
      sol: '$I_C = I_S e^{V_{BE}/V_T}$, so $\\partial I_C/\\partial V_{BE} = I_S e^{V_{BE}/V_T}/V_T = I_C/V_T$. It does not depend on $\\beta$ or on the size of the transistor: 40 mA/V for every milliampere at room temperature.',
      trap: '$V_T/I_C$ is the emitter resistance $r_e$ (roughly $1/g_m$), not $g_m$.' },
    { id: 'sd-006', type: 'msq', level: 1, exams: G, sub: 'device types', format: 'multi',
      q: 'Which of these devices conduct mainly by majority carriers (unipolar devices)?',
      options: ['Schottky barrier diode', 'n-channel JFET', 'Bipolar junction transistor', 'Enhancement-mode MOSFET'], answer: [0, 1, 3],
      sol: 'In a Schottky diode electrons pass from the semiconductor over the barrier into the metal: majority carriers only, so there is no stored minority charge and it switches fast. JFETs and MOSFETs carry current in a channel of one carrier type. A BJT relies on minority carriers injected into the base: it is bipolar.',
      trap: 'In an enhancement nMOSFET the inversion layer is formed in p-type material, but within the channel the electrons are the carriers that conduct; it is still a unipolar device.' },

    // ---------- level 2 ----------
    { id: 'sd-007', type: 'nat', level: 2, exams: G, sub: 'BJT small signal', unit: 'mA/V',
      q: 'A BJT is biased at $I_C = 2.0$ mA. Taking $V_T = 25$ mV, its transconductance is ______ mA/V.',
      answer: 80, tol: 0, calc: () => 2.0 / 0.025,
      sol: '$g_m = I_C/V_T = 2.0\\text{ mA}/25\\text{ mV} = 0.080$ A/V $= 80$ mA/V.',
      trap: 'Dividing by 0.25 V or by 25 V: keep the units straight.' },
    { id: 'sd-008', type: 'mcq', level: 2, exams: G, sub: 'BJT small signal',
      q: 'A transistor with $\\beta = 120$ is biased at $I_C = 1.5$ mA ($V_T = 25$ mV). The small-signal input resistance $r_\\pi$ seen at the base is',
      options: ['$25\\,\\Omega$', '$2.4$ k$\\Omega$', '$2.0$ k$\\Omega$', '$0.5$ k$\\Omega$'], answer: 2,
      sol: '$g_m = 1.5/25 = 0.060$ A/V. $r_\\pi = \\beta/g_m = 120/0.060 = 2000\\,\\Omega = 2.0$ k$\\Omega$.',
      trap: '$V_T/I_C \\approx 17\\,\\Omega$ is $r_e$, the resistance seen at the emitter; the base sees $\\beta$ (more exactly $\\beta + 1$) times more.' },
    { id: 'sd-009', type: 'nat', level: 2, exams: G, sub: 'JFET', unit: 'mA',
      q: 'An n-channel JFET has $I_{DSS} = 12$ mA and pinch-off voltage $V_P = -4$ V. In saturation with $V_{GS} = -1.5$ V the drain current is ______ mA (to two decimal places).',
      answer: 4.69, tol: 0.02, calc: () => 12 * (1 - 1.5 / 4) ** 2,
      sol: 'Shockley\'s equation: $I_D = I_{DSS}(1 - V_{GS}/V_P)^2 = 12(1 - 0.375)^2 = 12\\times0.3906 = 4.69$ mA.',
      trap: 'Writing $1 + V_{GS}/V_P$ gives $1.375^2$; both $V_{GS}$ and $V_P$ are negative, so their ratio is positive and less than one.' },
    { id: 'sd-010', type: 'mcq', level: 2, exams: G, sub: 'Early effect',
      q: 'A BJT has an Early voltage $V_A = 100$ V and runs at $I_C = 1$ mA. Its small-signal output resistance $r_o$ is about',
      options: ['$100$ k$\\Omega$', '$1$ k$\\Omega$', '$25\\,\\Omega$', '$10$ M$\\Omega$'], answer: 0,
      sol: 'The output characteristics, extended backwards, meet the $V_{CE}$ axis at $-V_A$. Their slope is $I_C/V_A$, so $r_o = V_A/I_C = 100\\text{ V}/1\\text{ mA} = 100$ k$\\Omega$.',
      trap: 'Ignoring $r_o$ altogether is fine only when the load is much smaller than $V_A/I_C$.' },
    { id: 'sd-011', type: 'nat', level: 2, exams: G, sub: 'MOSFET square law', unit: 'mA',
      q: 'An nMOSFET has $V_T = 0.8$ V and $k_n = \\mu_nC_{ox}(W/L) = 2$ mA/V$^2$, with $I_D = \\tfrac12k_n(V_{GS} - V_T)^2$ in saturation. At $V_{GS} = 2.3$ V (and a large $V_{DS}$) the drain current is ______ mA.',
      answer: 2.25, tol: 0.01, calc: () => 0.5 * 2 * (2.3 - 0.8) ** 2,
      sol: 'Overdrive $V_{ov} = 2.3 - 0.8 = 1.5$ V. $I_D = \\tfrac12\\times2\\times1.5^2 = 2.25$ mA.',
      trap: 'Dropping the factor $\\tfrac12$ doubles the answer; check which convention a question uses for $k_n$.' },
    { id: 'sd-012', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'temperature',
      q: 'A silicon diode carries a constant forward current. As its temperature rises, its forward voltage',
      options: ['rises by about $2$ mV per kelvin', 'stays the same', 'falls by about $25$ mV per kelvin', 'falls by about $2$ mV per kelvin'], answer: 3,
      sol: 'The saturation current $I_S \\propto n_i^2 \\propto T^3e^{-E_g/k_BT}$ grows very fast with temperature, so a smaller voltage is needed for the same current. For silicon the net effect is about $-2$ mV/K, used in diode thermometers.',
      trap: 'Thinking only of $V_T = k_BT/q$ in the exponent, which alone would make $V$ rise; the growth of $I_S$ wins.' },
    { id: 'sd-013', type: 'msq', level: 2, exams: G, sub: 'MOSFET small signal', format: 'multi',
      q: 'For a long-channel MOSFET in saturation obeying $I_D = \\tfrac12k_n V_{ov}^2$ (with $V_{ov} = V_{GS} - V_T$), which statements are correct?',
      options: ['$g_m = 2I_D/V_{ov}$', 'At fixed $W/L$, $g_m \\propto \\sqrt{I_D}$', 'At fixed $W/L$, $g_m \\propto I_D$, as for a BJT', 'With channel-length modulation, $I_D$ is still exactly independent of $V_{DS}$'], answer: [0, 1],
      sol: '$g_m = dI_D/dV_{GS} = k_nV_{ov} = 2I_D/V_{ov}$. Eliminating $V_{ov}$: $g_m = \\sqrt{2k_nI_D}\\propto\\sqrt{I_D}$. Only a BJT has $g_m\\propto I_C$. Channel-length modulation adds the factor $(1 + \\lambda V_{DS})$, giving a finite $r_o = 1/(\\lambda I_D)$.',
      trap: 'Both first statements are the same physics written two ways: at fixed current, $g_m$ grows as $V_{ov}$ shrinks; at fixed $W/L$, it grows as $\\sqrt{I_D}$.' },
    { id: 'sd-014', type: 'mcq', level: 2, exams: G, sub: 'JFET',
      q: 'The pinch-off voltage $V_P$ of an n-channel JFET is the gate-source voltage at which',
      options: ['the gate junction starts to conduct', 'the depletion layers close the channel completely and the drain current falls to zero', 'the drain current equals $I_{DSS}$', 'avalanche breakdown starts at the drain'], answer: 1,
      sol: 'Making the gate more negative widens the depletion layers of the reverse-biased gate junction until they meet across the whole channel: cut-off, $I_D = 0$. The same voltage, measured as $V_{DS}$ with $V_{GS} = 0$, marks the start of current saturation.',
      trap: 'At $V_{GS} = 0$ the current is largest ($I_{DSS}$), not zero.' },
    { id: 'sd-015', type: 'nat', level: 2, exams: G, sub: 'junction capacitance', unit: 'pF',
      q: 'An abrupt silicon junction with built-in potential $0.8$ V has a depletion capacitance of $20$ pF at zero bias. At a reverse bias of $7.2$ V its capacitance is ______ pF (to two decimal places).',
      answer: 6.32, tol: 0.03, calc: () => 20 * Math.sqrt(0.8 / 8.0),
      sol: 'For an abrupt junction $W\\propto\\sqrt{V_{bi} + V_R}$ and $C = \\varepsilon A/W\\propto(V_{bi} + V_R)^{-1/2}$. $C = 20\\sqrt{0.8/(0.8 + 7.2)} = 20\\sqrt{0.1} = 6.32$ pF.',
      trap: 'Forgetting $V_{bi}$, or using the exponent $-1/3$ that belongs to a linearly graded junction.' },
    { id: 'sd-016', type: 'mcq', level: 2, exams: G, sub: 'MOS capacitor',
      q: 'An MOS capacitor is built on p-type silicon. When a large positive voltage is applied to the gate, the semiconductor surface is in',
      options: ['accumulation: extra holes gather at the surface', 'flat-band: no charge at the surface', 'depletion only, however large the voltage', 'strong inversion: a thin layer of electrons forms at the surface'], answer: 3,
      sol: 'A positive gate first pushes holes away (depletion). Beyond the threshold the surface potential has bent the bands so far that electrons, the minority carriers, gather in a thin inversion layer: this is the channel of an nMOSFET. Negative gate voltage gives accumulation of holes.',
      trap: 'Accumulation needs the gate polarity that attracts the majority carriers: negative for p-type.' },

    // ---------- level 3 ----------
    { id: 'sd-017', type: 'nat', level: 3, exams: G, sub: 'triode region', unit: 'mA',
      q: 'An nMOSFET with $k_n = 1$ mA/V$^2$ and overdrive $V_{GS} - V_T = 2$ V is operated at $V_{DS} = 0.5$ V. Using $I_D = k_n[(V_{GS} - V_T)V_{DS} - V_{DS}^2/2]$, the drain current is ______ mA (to three decimal places).',
      answer: 0.875, tol: 0.005, calc: () => 1 * (2 * 0.5 - 0.5 ** 2 / 2),
      sol: 'First check the region: $V_{DS} = 0.5 < V_{ov} = 2$ V, so the device is in the triode region and the formula applies. $I_D = 1\\times(2\\times0.5 - 0.125) = 0.875$ mA.',
      trap: 'Using the saturation formula would give 2 mA, far too large at such a small $V_{DS}$.' },
    { id: 'sd-018', type: 'msq', level: 3, exams: G, sub: 'triode region', format: 'multi',
      q: 'An nMOSFET is used as a voltage-controlled resistor with very small $V_{DS}$. Which statements are correct?',
      options: ['Its resistance is about $r_{DS} = 1/[k_n(V_{GS} - V_T)]$', 'Doubling the overdrive $V_{GS} - V_T$ halves the resistance', 'In this region $I_D$ does not depend on $V_{DS}$', 'The region requires $V_{DS} < V_{GS} - V_T$'], answer: [0, 1, 3],
      sol: 'For $V_{DS}\\ll V_{ov}$ the triode formula becomes $I_D\\approx k_nV_{ov}V_{DS}$: linear in $V_{DS}$, with slope $1/r_{DS} = k_nV_{ov}$. So the resistance falls as the overdrive grows. The triode region is $V_{DS} < V_{ov}$; independence from $V_{DS}$ is the saturation region.',
      trap: 'The device is ohmic only for small $V_{DS}$; the $V_{DS}^2/2$ term bends the curve as $V_{DS}$ approaches $V_{ov}$.' },
    { id: 'sd-019', type: 'nat', level: 3, exams: G, sub: 'intrinsic gain',
      q: 'A MOSFET in saturation carries $I_D = 0.5$ mA with overdrive $0.25$ V and channel-length modulation parameter $\\lambda = 0.05$ V$^{-1}$. Its intrinsic voltage gain $g_mr_o$ is ______.',
      answer: 160, tol: 0, calc: () => (2 * 0.5 / 0.25) * (1 / (0.05 * 0.5)),
      sol: '$g_m = 2I_D/V_{ov} = 2\\times0.5/0.25 = 4$ mA/V. $r_o = 1/(\\lambda I_D) = 1/(0.05\\times0.5\\text{ mA}) = 40$ k$\\Omega$. $g_mr_o = 4\\times40 = 160$. Equivalently $2/(\\lambda V_{ov})$.',
      trap: 'Using $g_m = I_D/V_{ov}$ (missing the 2) gives 80.' },
    { id: 'sd-020', type: 'mcq', level: 3, exams: G, sub: 'intrinsic gain',
      q: 'A BJT has Early voltage $50$ V. At room temperature ($V_T = 25$ mV) its intrinsic gain $g_mr_o$, the largest voltage gain one common-emitter transistor can give, is',
      options: ['200', '50', '2000', '20 000'], answer: 2,
      sol: '$g_m = I_C/V_T$ and $r_o = V_A/I_C$, so $g_mr_o = V_A/V_T = 50/0.025 = 2000$, independent of the bias current. This is why BJT stages reach gains that need cascodes in MOS technology.',
      trap: 'The bias current cancels; a question that gives $I_C$ here is offering a distraction.' },
    { id: 'sd-021', type: 'mcq', level: 3, exams: G, sub: 'diode equation',
      q: 'An ideal diode (ideality factor 1) at 300 K is forward biased well above $V_T$. To increase its current tenfold, its voltage must rise by about',
      options: ['26 mV', '60 mV', '2.3 mV', '120 mV'], answer: 1,
      sol: '$I\\approx I_Se^{V/V_T}$, so $\\Delta V = V_T\\ln(I_2/I_1) = 25.85\\text{ mV}\\times\\ln10 = 59.5$ mV. With ideality factor $n$ it is $n\\times59.5$ mV, so 120 mV per decade means $n = 2$.',
      trap: '26 mV is a factor of $e$, not of 10.' },
    { id: 'sd-022', type: 'mcq', level: 3, exams: G, sub: 'BJT modes',
      q: 'An npn transistor has $V_{BE} = 0.75$ V and $V_{BC} = 0.55$ V. It is in the',
      options: ['saturation region', 'active region', 'cut-off region', 'reverse-active region'], answer: 0,
      sol: 'Both junctions are forward biased (base above both emitter and collector), which is saturation. $V_{CE} = V_{BE} - V_{BC} = 0.20$ V, the typical $V_{CE(sat)}$. Active needs the base-collector junction reverse biased.',
      trap: 'A positive $V_{BC}$ means the collector is below the base: forward bias, not reverse.' },
    { id: 'sd-023', type: 'msq', level: 3, exams: G, sub: 'CMOS inverter', format: 'multi',
      q: 'About a static CMOS inverter (one nMOS, one pMOS) driving another CMOS gate, which statements are correct?',
      options: ['With the input steady at either logic level, it draws almost no supply current', 'During a transition both transistors conduct briefly, giving a short-circuit current', 'Its output high level is essentially $V_{DD}$ and its output low level essentially 0 V', 'Its switching threshold is $V_{DD}/2$ whatever the sizes of the two transistors'], answer: [0, 1, 2],
      sol: 'In each steady state one transistor is off, so there is no DC path from $V_{DD}$ to ground, and with a gate load (no DC current) the output reaches the rail. While the input passes through mid-range both are on. The threshold depends on the ratio $k_n/k_p$; it is $V_{DD}/2$ only for matched devices with $|V_{Tp}| = V_{Tn}$.',
      trap: 'Most CMOS power is dynamic, $CV_{DD}^2f$, not static.' },
    { id: 'sd-024', type: 'nat', level: 3, exams: G, sub: 'JFET', unit: 'mA/V',
      q: 'An n-channel JFET with $I_{DSS} = 10$ mA and $V_P = -5$ V is biased at $V_{GS} = -2$ V. Its transconductance is ______ mA/V (to two decimal places).',
      answer: 2.4, tol: 0.01, calc: () => (2 * 10 / 5) * (1 - 2 / 5),
      sol: 'Differentiate $I_D = I_{DSS}(1 - V_{GS}/V_P)^2$: $g_m = -\\dfrac{2I_{DSS}}{V_P}(1 - V_{GS}/V_P) = \\dfrac{2\\times10}{5}(1 - 0.4) = 4\\times0.6 = 2.40$ mA/V.',
      trap: '$g_{m0} = 2I_{DSS}/|V_P| = 4$ mA/V applies only at $V_{GS} = 0$.' },
    { id: 'sd-025', type: 'mcq', level: 3, exams: G, sub: 'body effect',
      q: 'In an nMOSFET, the reverse bias between source and body ($V_{SB} > 0$) is increased. The threshold voltage',
      options: ['decreases, because the body supplies more electrons', 'is unchanged, because the body is not part of the channel', 'increases, because more depletion charge must be balanced before inversion', 'becomes negative'], answer: 2,
      sol: 'The depletion region under the channel widens, so its fixed negative charge grows. The gate must supply that extra charge before an inversion layer forms: $V_T = V_{T0} + \\gamma(\\sqrt{2\\phi_F + V_{SB}} - \\sqrt{2\\phi_F})$ rises. The body acts as a second gate (body transconductance $g_{mb}$).',
      trap: 'Thinking the body terminal is irrelevant because it carries no current.' },
    { id: 'sd-026', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'breakdown',
      q: 'A heavily doped junction breaks down at about $3$ V. The mechanism and the sign of the temperature coefficient of its breakdown voltage are',
      options: ['avalanche multiplication, positive', 'Zener (band-to-band) tunnelling, negative', 'avalanche multiplication, negative', 'thermal runaway, positive'], answer: 1,
      sol: 'Heavy doping gives a very thin depletion layer and huge fields, so electrons tunnel from the valence band on one side into the conduction band on the other. A higher temperature shrinks the gap and makes tunnelling easier: negative coefficient. Avalanche breakdown (above about 6 V) has a positive coefficient because phonon scattering shortens the free path; diodes near 5-6 V have almost zero drift.',
      trap: 'Every breakdown diode is sold as a "Zener", but true Zener tunnelling is the low-voltage one.' },
    { id: 'sd-027', type: 'mcq', level: 3, exams: G, sub: 'BJT vs MOSFET',
      q: 'A BJT and a MOSFET (overdrive $V_{ov} = 0.2$ V) carry the same bias current. Taking $V_T = 25$ mV, the ratio of the BJT\'s transconductance to the MOSFET\'s is',
      options: ['8', '0.25', '2', '4'], answer: 3,
      sol: '$g_{m,BJT} = I/V_T$ and $g_{m,MOS} = 2I/V_{ov}$. Ratio $= V_{ov}/(2V_T) = 0.2/0.05 = 4$. A MOSFET would need $V_{ov} = 2V_T = 50$ mV (near weak inversion) to match.',
      trap: 'Forgetting the factor 2 in the MOSFET $g_m$ gives 8.' },
    { id: 'sd-028', type: 'mcq', level: 3, exams: G, sub: 'subthreshold',
      q: 'Below threshold a MOSFET\'s drain current grows exponentially with $V_{GS}$. At 300 K the subthreshold swing (gate voltage per decade of current) cannot be smaller than about',
      options: ['26 mV/decade', '120 mV/decade', '1 V/decade', '60 mV/decade'], answer: 3,
      sol: 'In weak inversion $I_D\\propto e^{V_{GS}/(nV_T)}$ with $n\\ge1$, so the swing $S = nV_T\\ln10\\ge25.85\\times2.303 = 59.5$ mV/decade. This thermal limit is why supply voltages cannot shrink much further without new devices (tunnel FETs, negative-capacitance FETs).',
      trap: '26 mV is $V_T$ itself, a factor $e$ in current, not 10.' },

    // ---------- level 4 ----------
    { id: 'sd-029', type: 'nat', level: 4, exams: G, sub: 'MOSFET biasing', unit: 'kΩ',
      q: 'An nMOSFET ($V_T = 1$ V, $I_D = \\tfrac12k_n(V_{GS} - V_T)^2$ with $k_n = 0.5$ mA/V$^2$) has $V_{GS} = 3$ V fixed, its source grounded and its drain fed through $R_D$ from $V_{DD} = 10$ V. The largest $R_D$ for which the transistor stays in saturation is ______ k$\\Omega$.',
      answer: 8, tol: 0.05, calc: () => (10 - 2) / (0.5 * 0.5 * 4),
      sol: 'In saturation $I_D = 0.25\\times2^2 = 1$ mA, whatever $R_D$. Saturation needs $V_{DS} = V_{DD} - I_DR_D\\ge V_{ov} = 2$ V, so $R_D\\le(10 - 2)/1 = 8$ k$\\Omega$. A larger $R_D$ pushes the device into the triode region.',
      trap: 'Using $V_{DS}\\ge V_{GS} = 3$ V (instead of $V_{GS} - V_T$) gives 7 k$\\Omega$.' },
    { id: 'sd-030', type: 'nat', level: 4, exams: G, sub: 'JFET self-bias', unit: 'mA',
      q: 'An n-channel JFET ($I_{DSS} = 8$ mA, $V_P = -4$ V) is self-biased with its gate grounded through a large resistor and $R_S = 1$ k$\\Omega$ from source to ground. The drain current is ______ mA.',
      answer: 2, tol: 0.01, calc: () => { const a = 8 / 16, b = -(8 * 2 / 4 + 1), c = 8; return (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a); },
      sol: 'The gate is at 0 V, so $V_{GS} = -I_DR_S = -I_D$ (volts, with $I_D$ in mA). Then $I_D = 8(1 - I_D/4)^2 = 8 - 4I_D + I_D^2/2$, i.e. $I_D^2 - 10I_D + 16 = 0$, with roots 2 and 8 mA. The root 8 mA would make $V_{GS} = -8$ V, beyond pinch-off, so it is rejected. $I_D = 2$ mA, $V_{GS} = -2$ V.',
      trap: 'Keeping the larger root of the quadratic: always check $V_P < V_{GS}\\le0$.' },
    { id: 'sd-031', type: 'mcq', level: 4, exams: G, sub: 'Early effect',
      q: 'At a fixed base current a transistor carries $1.00$ mA at $V_{CE} = 2$ V and $1.05$ mA at $V_{CE} = 7$ V. Its Early voltage is about',
      options: ['5 V', '20 V', '100 V', '98 V'], answer: 3,
      sol: 'Slope $= 0.05\\text{ mA}/5\\text{ V} = 0.01$ mA/V, so $r_o = 100$ k$\\Omega$. The straight line reaches $I_C = 0$ at $V_{CE} = 2 - 1.00/0.01 = -98$ V, so $V_A = 98$ V.',
      trap: '$r_o\\times I_C = 100$ V uses the current at one point and ignores the 2 V offset.' },
    { id: 'sd-032', type: 'msq', level: 4, exams: G, sub: 'short-channel effects', format: 'multi',
      q: 'As MOSFET channels are made very short, which statements become true?',
      options: ['Velocity saturation makes the saturation current grow roughly linearly with overdrive rather than as its square', 'With full velocity saturation, $g_m$ becomes nearly independent of the overdrive', 'Channel-length modulation becomes stronger (larger $\\lambda$, smaller $r_o$)', 'The threshold voltage becomes completely independent of channel length'], answer: [0, 1, 2],
      sol: 'With carriers at $v_{sat}$, $I_D\\approx WC_{ox}v_{sat}V_{ov}$, so $g_m\\approx WC_{ox}v_{sat}$, a constant. A fixed change in pinch-off length is a larger fraction of a short channel, so $\\lambda\\propto1/L$ grows. The threshold falls for short channels (roll-off, drain-induced barrier lowering), so the last statement is false.',
      trap: 'The square law is a long-channel result; modern devices sit between square and linear.' },
    { id: 'sd-033', type: 'nat', level: 4, exams: G, sub: 'diffusion capacitance', unit: 'pF',
      q: 'A forward-biased diode with minority-carrier transit time $5$ ns carries $2$ mA. Taking $V_T = 25$ mV, its diffusion capacitance is ______ pF.',
      answer: 400, tol: 2, calc: () => 5e-9 * 2e-3 / 0.025 * 1e12,
      sol: 'Stored minority charge $Q = \\tau_TI_D$, so $C_d = dQ/dV = \\tau_T\\,dI_D/dV = \\tau_TI_D/V_T = 5\\times10^{-9}\\times2\\times10^{-3}/0.025 = 4.0\\times10^{-10}$ F $= 400$ pF. It dwarfs the depletion capacitance under forward bias.',
      trap: 'Depletion (transition) capacitance dominates in reverse bias; diffusion capacitance in forward bias.' },
    { id: 'sd-034', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'temperature',
      q: 'A silicon diode\'s reverse saturation current is $10$ nA at $25\\,^\\circ$C and roughly doubles every $10\\,^\\circ$C. At $75\\,^\\circ$C it is about',
      options: ['50 nA', '160 nA', '1.0 μA', '320 nA'], answer: 3,
      sol: 'A rise of 50 °C is five doublings: $10\\times2^5 = 320$ nA.',
      trap: 'Adding 10 nA per step (50 nA) or stopping at four doublings (160 nA).' },
    { id: 'sd-035', type: 'nat', level: 4, exams: G, sub: 'varactor',
      q: 'A tuned circuit uses a fixed inductor and an abrupt-junction varactor with $C = C_0(1 + V_R/V_{bi})^{-1/2}$ and $V_{bi} = 0.7$ V. As $V_R$ goes from 0 to $27.3$ V, the ratio of highest to lowest resonant frequency is ______ (to two decimal places).',
      answer: 2.51, tol: 0.01, calc: () => (1 + 27.3 / 0.7) ** 0.25,
      sol: '$f = 1/(2\\pi\\sqrt{LC})\\propto C^{-1/2}\\propto(1 + V_R/V_{bi})^{1/4}$. At 27.3 V, $1 + 27.3/0.7 = 40$, and $40^{1/4} = 2.51$.',
      trap: 'Using the capacitance ratio ($\\sqrt{40} = 6.3$) instead of its square root.' },
    { id: 'sd-036', type: 'mcq', level: 4, exams: G, sub: 'tunnel diode',
      q: 'A tunnel diode shows a region of negative differential resistance in forward bias. This comes from',
      options: ['avalanche multiplication at low voltage', 'very heavy doping on both sides, so filled states on one side face empty states on the other only over a narrow voltage range', 'high-level injection of minority carriers', 'the thermal dependence of the saturation current'], answer: 1,
      sol: 'Both sides are degenerate, so the depletion layer is only nanometres thick. At small forward bias, filled conduction-band states on the n side line up with empty valence-band states on the p side and electrons tunnel: the current rises. More bias moves the bands past each other, the overlap shrinks and the current falls (negative resistance) until ordinary diffusion current takes over. Used in microwave oscillators.',
      trap: 'Avalanche is a reverse-bias, high-field process.' },

    // ---------- level 5 ----------
    { id: 'sd-037', type: 'nat', level: 5, exams: G, sub: 'MOSFET biasing', unit: 'mA',
      q: 'An nMOSFET ($V_T = 1$ V, $I_D = \\tfrac12k_n(V_{GS} - V_T)^2$, $k_n = 2$ mA/V$^2$) has its gate at $4$ V and a $1$ k$\\Omega$ resistor from source to ground; the drain is high enough for saturation. The drain current is ______ mA (to two decimal places).',
      answer: 1.70, tol: 0.01, calc: () => { const x = (-1 + Math.sqrt(13)) / 2; return x * x; },
      sol: 'Let $x = V_{GS} - V_T$. Then $I_D = x^2$ (mA) and $V_G - V_T = x + I_DR_S$: $3 = x + x^2$. So $x = (-1 + \\sqrt{13})/2 = 1.303$ V and $I_D = 1.697$ mA $\\approx 1.70$ mA. The negative root is not physical.',
      trap: 'Ignoring the source resistor ($V_{GS} = 4$ V) gives 9 mA; the source resistor is negative feedback.' },
    { id: 'sd-038', type: 'msq', level: 5, exams: G, sub: 'BJT vs MOSFET', format: 'multi',
      q: 'Compare a BJT and a long-channel MOSFET used as amplifying devices. Which statements are correct?',
      options: ['At the same bias current, the BJT has the larger $g_m$ whenever the MOSFET overdrive exceeds $2V_T$', 'The MOSFET has essentially infinite DC input resistance at the gate', 'The BJT\'s $r_\\pi$ does not depend on the bias current', 'At fixed $W/L$, the MOSFET\'s $g_m$ grows linearly with $I_D$'], answer: [0, 1],
      sol: 'Ratio $g_{m,BJT}/g_{m,MOS} = V_{ov}/(2V_T)$, which exceeds 1 when $V_{ov} > 2V_T$. The insulated gate draws no DC current. $r_\\pi = \\beta V_T/I_C$ falls as the current rises. At fixed $W/L$, $g_m = \\sqrt{2k_nI_D}$ grows only as the square root.',
      trap: 'Mixing up "at fixed current" and "at fixed size" when comparing transconductances.' },
    { id: 'sd-039', type: 'nat', level: 5, exams: G, sub: 'diode equation',
      q: 'At 300 K a diode carries $1$ mA at $0.650$ V and $10$ mA at $0.740$ V. Its ideality factor is ______ (to two decimal places).',
      answer: 1.51, tol: 0.02, calc: () => 0.090 / (VT300 * Math.LN10),
      sol: 'With $I\\propto e^{V/nV_T}$, a tenfold change needs $\\Delta V = nV_T\\ln10$. So $n = 0.090/(0.025852\\times2.3026) = 0.090/0.05953 = 1.51$. Values between 1 (diffusion current) and 2 (recombination in the depletion layer) are typical.',
      trap: 'Using $\\ln$ of the voltage ratio instead of the current ratio.' },
    { id: 'sd-040', type: 'mcq', level: 5, exams: G, sub: 'MOSFET physics',
      q: 'Why does the drain current of a long-channel MOSFET stop growing (nearly) once $V_{DS}$ exceeds $V_{GS} - V_T$?',
      options: ['The gate oxide breaks down and limits the current', 'The extra drain voltage drops across a short pinched-off region near the drain, while the channel voltage at the pinch-off point stays at $V_{GS} - V_T$', 'The carriers in the channel recombine before reaching the drain', 'The source runs out of carriers'], answer: 1,
      sol: 'In the gradual-channel picture the channel charge per length is $C_{ox}(V_{GS} - V(x) - V_T)$, which vanishes where $V(x) = V_{GS} - V_T$. Beyond that, the strong field of the pinched-off region sweeps carriers to the drain; the voltage across the inverted channel, and so the current, stays fixed. The pinch-off point creeps slightly towards the source as $V_{DS}$ grows: that is channel-length modulation.',
      trap: 'Pinch-off does not stop the current; carriers cross the depleted region easily, as in a reverse-biased collector junction.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'sd-g01', type: 'nat', level: 2, exams: G, sub: 'MOSFET square law',
      make(r) {
        const VT = pick(r, 0.4, 1.2, 0.1), ov = pick(r, 0.3, 2.0, 0.1), k = pick(r, 0.5, 8, 0.5), lam = choose(r, [0, 0, 0.02, 0.05]), VDS = round(ov + pick(r, 1, 5, 0.5), 2);
        const I = 0.5 * k * ov * ov * (1 + lam * VDS);
        return { q: `An nMOSFET has $V_T = ${VT}$ V, $k_n = ${k}$ mA/V$^2$ (saturation law $I_D = \\tfrac12k_n(V_{GS} - V_T)^2(1 + \\lambda V_{DS})$) and $\\lambda = ${lam}$ V$^{-1}$. At $V_{GS} = ${round(VT + ov, 2)}$ V and $V_{DS} = ${VDS}$ V the drain current is ______ mA (to three decimal places).`,
          answer: round(I, 3), tol: Math.max(0.002, round(I * 0.005, 3)), unit: 'mA', VT, ov, k, lam, VDS,
          sol: `Overdrive $V_{ov} = ${round(VT + ov, 2)} - ${VT} = ${ov}$ V, and $V_{DS} = ${VDS}$ V $> V_{ov}$, so the device is saturated. $I_D = \\tfrac12\\times${k}\\times${ov}^2\\times(1 + ${lam}\\times${VDS}) = ${round(I, 3)}$ mA.`,
          trap: 'Squaring $V_{GS}$ instead of the overdrive $V_{GS} - V_T$.' };
      },
      verify: (p) => 0.5 * p.k * p.ov ** 2 * (1 + p.lam * p.VDS) },
    { id: 'sd-g02', type: 'nat', level: 3, exams: G, sub: 'MOSFET biasing',
      make(r) {
        const VT = pick(r, 0.5, 1.5, 0.1), ov = pick(r, 0.5, 2.5, 0.25), k = pick(r, 0.5, 4, 0.5), VDD = pick(r, 5, 15, 1);
        const I = 0.5 * k * ov * ov;
        const R = (VDD - ov) / I;
        return { q: `An nMOSFET ($V_T = ${VT}$ V, $I_D = \\tfrac12k_n(V_{GS} - V_T)^2$ with $k_n = ${k}$ mA/V$^2$, no channel-length modulation) has $V_{GS} = ${round(VT + ov, 2)}$ V, its source grounded and a drain resistor $R_D$ to $V_{DD} = ${VDD}$ V. The largest $R_D$ that keeps it in saturation is ______ k$\\Omega$ (to two decimal places).`,
          answer: round(R, 2), tol: Math.max(0.01, round(R * 0.005, 2)), unit: 'kΩ', VT, ov, k, VDD,
          sol: `Saturation current $I_D = \\tfrac12\\times${k}\\times${ov}^2 = ${round(I, 4)}$ mA. The edge of saturation is $V_{DS} = V_{ov} = ${ov}$ V, so $R_D = (${VDD} - ${ov})/${round(I, 4)} = ${round(R, 2)}$ k$\\Omega$.`,
          trap: 'Requiring $V_{DS}\\ge V_{GS}$ instead of $V_{DS}\\ge V_{GS} - V_T$.' };
      },
      verify: (p) => (p.VDD - p.ov) / (0.5 * p.k * p.ov ** 2) },
    { id: 'sd-g03', type: 'nat', level: 4, exams: G, sub: 'JFET self-bias',
      make(r) {
        const Idss = pick(r, 4, 20, 1), Vp = pick(r, 2, 6, 0.5), Rs = pick(r, 0.2, 2, 0.1);
        const a = Rs / Vp, A = Idss * a * a, B = -(2 * Idss * a + 1);
        const I = (-B - Math.sqrt(B * B - 4 * A * Idss)) / (2 * A);
        return { q: `An n-channel JFET with $I_{DSS} = ${Idss}$ mA and $V_P = -${Vp}$ V is self-biased: gate returned to ground, $R_S = ${Rs}$ k$\\Omega$ from source to ground. The drain current is ______ mA (to two decimal places).`,
          answer: round(I, 2), tol: Math.max(0.01, round(I * 0.005, 2)), unit: 'mA', Idss, Vp, Rs,
          sol: `$V_{GS} = -I_DR_S$, so $I_D = ${Idss}\\left(1 - \\dfrac{${Rs}I_D}{${Vp}}\\right)^2$. This is the quadratic $${round(A, 4)}I_D^2 - ${round(-B, 4)}I_D + ${Idss} = 0$. The physical root is the smaller one, $I_D = ${round(I, 3)}$ mA, giving $V_{GS} = -${round(I * Rs, 3)}$ V, which lies between $V_P$ and 0. (The larger root would put $V_{GS}$ beyond pinch-off.)`,
          trap: 'Choosing the larger root, for which $|V_{GS}| > |V_P|$ and the JFET would be cut off.' };
      },
      verify: (p) => { let lo = 0, hi = p.Vp / p.Rs; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (p.Idss * (1 - m * p.Rs / p.Vp) ** 2 - m > 0) lo = m; else hi = m; } return lo; } },
    { id: 'sd-g04', type: 'mcq', level: 2, exams: G, sub: 'MOSFET regions',
      make(r) {
        const VT = pick(r, 0.5, 1.5, 0.1), kind = int(r, 0, 2);
        const VGS = kind === 0 ? round(VT - pick(r, 0.1, 0.5, 0.1), 2) : round(VT + pick(r, 0.5, 3, 0.1), 2);
        const ov = round(VGS - VT, 2);
        const VDS = kind === 1 ? round(Math.max(0.05, ov - pick(r, 0.1, 0.4, 0.05)), 2) : round(Math.max(ov, 0) + pick(r, 0.2, 4, 0.1), 2);
        const options = ['cut-off', 'triode (linear) region', 'saturation', 'breakdown'];
        const answer = kind === 0 ? 0 : kind === 1 ? 1 : 2;
        return { q: `An n-channel enhancement MOSFET with $V_T = ${VT}$ V has $V_{GS} = ${VGS}$ V and $V_{DS} = ${VDS}$ V. It operates in`, options, answer, VT, VGS, VDS,
          sol: kind === 0 ? `$V_{GS} = ${VGS}$ V is below $V_T = ${VT}$ V, so no inversion channel forms: cut-off (apart from a tiny subthreshold current).` : `$V_{GS} > V_T$, so a channel exists, with overdrive $V_{ov} = ${ov}$ V. ${kind === 1 ? `$V_{DS} = ${VDS}$ V $< V_{ov}$, so the channel reaches the drain: triode region.` : `$V_{DS} = ${VDS}$ V $\\ge V_{ov}$, so the channel is pinched off at the drain: saturation.`}`,
          trap: 'Comparing $V_{DS}$ with $V_{GS}$ instead of with $V_{GS} - V_T$.' };
      } },
    { id: 'sd-g05', type: 'nat', level: 2, exams: G, sub: 'BJT small signal',
      make(r) {
        const beta = pick(r, 50, 300, 10), Ic = pick(r, 0.1, 5, 0.1), VA = pick(r, 30, 150, 10), ask = choose(r, ['rpi', 'ro', 'gain']);
        const gm = Ic / 25; // mA/V with VT = 25 mV
        const val = ask === 'rpi' ? beta * 0.025 / Ic : ask === 'ro' ? VA / Ic : VA / 0.025;
        const what = ask === 'rpi' ? '$r_\\pi$ in k$\\Omega$' : ask === 'ro' ? '$r_o$ in k$\\Omega$' : 'the intrinsic gain $g_mr_o$';
        return { q: `A BJT with $\\beta = ${beta}$ and Early voltage $V_A = ${VA}$ V is biased at $I_C = ${Ic}$ mA. Taking $V_T = 25$ mV, ${what} is ______ (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, round(val * 0.005, 2)), beta, Ic, VA, ask,
          sol: `$g_m = I_C/V_T = ${Ic}/25 = ${round(gm, 4)}$ A/V. $r_\\pi = \\beta/g_m = ${beta}/${round(gm * 1000, 2)}\\text{ mA/V} = ${round(beta * 0.025 / Ic, 3)}$ k$\\Omega$. $r_o = V_A/I_C = ${round(VA / Ic, 3)}$ k$\\Omega$. $g_mr_o = V_A/V_T = ${round(VA / 0.025, 1)}$. Asked: ${round(val, 2)}.`,
          trap: 'Mixing A/V and mA/V: $r_\\pi$ in k$\\Omega$ needs $g_m$ in mA/V.' };
      },
      verify: (p) => (p.ask === 'rpi' ? p.beta / (40 * p.Ic) : p.ask === 'ro' ? p.VA / p.Ic : p.VA / 0.025) },
    { id: 'sd-g06', type: 'nat', level: 3, exams: G, sub: 'diode equation',
      make(r) {
        const n = choose(r, [1, 1, 1.2, 1.5, 2]), T = choose(r, [250, 300, 300, 350, 400]), dV = pick(r, 20, 150, 5);
        const VT = 8.617333e-5 * T, ratio = Math.exp(dV / 1000 / (n * VT));
        return { q: `A diode with ideality factor $${n}$ at $${T}$ K is forward biased well above $V_T$. Its voltage is raised by $${dV}$ mV. The current increases by a factor of ______ (to two decimal places).`,
          answer: round(ratio, 2), tol: Math.max(0.01, round(ratio * 0.005, 2)), n, T, dV,
          sol: `$V_T = k_BT/q = ${round(VT * 1000, 3)}$ mV. $I_2/I_1 = \\exp\\left(\\dfrac{\\Delta V}{nV_T}\\right) = \\exp\\left(\\dfrac{${dV}}{${n}\\times${round(VT * 1000, 3)}}\\right) = ${round(ratio, 2)}$.`,
          trap: 'Leaving out the ideality factor, or using 25 mV at a temperature other than about 300 K.' };
      },
      verify: (p) => Math.exp(p.dV / 1000 / (p.n * 8.617333e-5 * p.T)) },
    { id: 'sd-g07', type: 'nat', level: 3, exams: G, sub: 'junction capacitance',
      make(r) {
        const graded = r() < 0.5, m = graded ? 1 / 3 : 1 / 2, Vbi = pick(r, 0.6, 0.9, 0.05), C0 = pick(r, 5, 100, 5), V1 = pick(r, 0, 4, 1), V2 = V1 + pick(r, 2, 20, 1);
        const C1 = C0 * (1 + V1 / Vbi) ** -m, C2 = C0 * (1 + V2 / Vbi) ** -m;
        return { q: `A ${graded ? 'linearly graded' : 'abrupt'} junction (built-in potential $${Vbi}$ V) has depletion capacitance $${round(C1, 3)}$ pF at a reverse bias of $${V1}$ V. At a reverse bias of $${V2}$ V its capacitance is ______ pF (to two decimal places).`,
          answer: round(C2, 2), tol: Math.max(0.01, round(C2 * 0.005, 2)), unit: 'pF', m, Vbi, V1, V2, C1: round(C1, 3),
          sol: `$C\\propto(V_{bi} + V_R)^{-m}$ with $m = ${graded ? '1/3' : '1/2'}$ for a ${graded ? 'linearly graded' : 'abrupt'} junction. $C_2 = ${round(C1, 3)}\\left(\\dfrac{${Vbi} + ${V1}}{${Vbi} + ${V2}}\\right)^{${graded ? '1/3' : '1/2'}} = ${round(C2, 2)}$ pF.`,
          trap: `Using the exponent of the other junction profile (${graded ? '1/2' : '1/3'}), or dropping $V_{bi}$.` };
      },
      verify: (p) => p.C1 * ((p.Vbi + p.V1) / (p.Vbi + p.V2)) ** p.m },
    { id: 'sd-g08', type: 'mcq', level: 3, exams: G, sub: 'Early effect',
      make(r) {
        const I1 = pick(r, 0.5, 4, 0.5), V1 = pick(r, 1, 4, 1), VA = pick(r, 40, 200, 10), V2 = V1 + pick(r, 4, 10, 1);
        const I2 = round(I1 * (V2 + VA) / (V1 + VA), 4);
        const slope = (I2 - I1) / (V2 - V1), VAc = Math.round(I1 / slope - V1);
        const o = mcqOptions(r, VAc, [Math.round(I1 / slope), Math.round(V2 - V1), Math.round(VAc / 2), Math.round(VAc + 2 * V2)], (v) => `${v} V`);
        return { q: `At a fixed base current a BJT carries $${I1}$ mA at $V_{CE} = ${V1}$ V and $${I2}$ mA at $V_{CE} = ${V2}$ V. Its Early voltage is about`, ...o,
          sol: `Slope $= (${I2} - ${I1})/(${V2} - ${V1}) = ${round(slope, 6)}$ mA/V, so $r_o = ${round(1 / slope, 1)}$ k$\\Omega$. Extrapolating to $I_C = 0$: $V_{CE} = ${V1} - ${I1}/${round(slope, 6)} = -${VAc}$ V, so $V_A\\approx ${VAc}$ V.`,
          trap: 'Taking $r_oI_C$ at one point forgets that the line starts from that point, not from $V_{CE} = 0$.' };
      } },
    { id: 'sd-g09', type: 'nat', level: 5, exams: G, sub: 'MOSFET biasing',
      make(r) {
        const VT = pick(r, 0.5, 1.5, 0.1), k = pick(r, 0.5, 4, 0.5), VG = round(VT + pick(r, 1.5, 5, 0.5), 2), Rs = pick(r, 0.5, 4, 0.5);
        const c = k * Rs / 2, x = (-1 + Math.sqrt(1 + 4 * c * (VG - VT))) / (2 * c), I = 0.5 * k * x * x;
        return { q: `An nMOSFET ($V_T = ${VT}$ V, $I_D = \\tfrac12k_n(V_{GS} - V_T)^2$ with $k_n = ${k}$ mA/V$^2$) has its gate held at $${VG}$ V and a source resistor of $${Rs}$ k$\\Omega$ to ground; the drain is high enough for saturation. The drain current is ______ mA (to three decimal places).`,
          answer: round(I, 3), tol: Math.max(0.002, round(I * 0.005, 3)), unit: 'mA', VT, k, VG, Rs,
          sol: `Let $x = V_{GS} - V_T$. Then $V_G - V_T = x + I_DR_S = x + \\tfrac12k_nR_Sx^2$: $${round(c, 3)}x^2 + x - ${round(VG - VT, 2)} = 0$, so $x = ${round(x, 4)}$ V (positive root). $I_D = \\tfrac12\\times${k}\\times${round(x, 4)}^2 = ${round(I, 3)}$ mA.`,
          trap: 'Setting $V_{GS} = V_G$ ignores the voltage drop across the source resistor.' };
      },
      verify: (p) => { let lo = 0, hi = p.VG - p.VT; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (m + 0.5 * p.k * p.Rs * m * m < p.VG - p.VT) lo = m; else hi = m; } return 0.5 * p.k * lo * lo; } },
    { id: 'sd-g10', type: 'msq', level: 3, exams: G, sub: 'MOSFET regions', format: 'multi',
      make(r) {
        const VT = pick(r, 0.5, 1.2, 0.1);
        const mk = (kind) => {
          const VGS = kind === 0 ? round(VT - pick(r, 0.1, 0.4, 0.1), 2) : round(VT + pick(r, 0.4, 2.5, 0.1), 2);
          const ov = VGS - VT;
          const VDS = kind === 1 ? round(Math.max(0.05, ov - pick(r, 0.1, 0.3, 0.05)), 2) : round(Math.max(ov, 0) + pick(r, 0.1, 3, 0.1), 2);
          return { VGS, VDS, sat: kind === 2 };
        };
        const set = shuffle(r, [mk(2), mk(int(r, 0, 2)), mk(1), mk(0)]);
        const options = set.map((s, i) => `Device ${'PQRS'[i]}: $V_{GS} = ${s.VGS}$ V, $V_{DS} = ${s.VDS}$ V`);
        const answer = set.map((s, i) => (s.sat ? i : -1)).filter((i) => i >= 0);
        return { q: `An n-channel enhancement MOSFET has $V_T = ${VT}$ V. Four identical devices are biased as listed. Which of them are in saturation?`, options, answer,
          sol: 'Saturation needs both $V_{GS} > V_T$ (a channel exists) and $V_{DS}\\ge V_{GS} - V_T$ (pinched off at the drain). ' + set.map((s) => `$(${s.VGS}, ${s.VDS})$: overdrive ${round(s.VGS - VT, 2)} V, ${s.VGS <= VT ? 'cut-off' : s.VDS >= s.VGS - VT ? 'saturation' : 'triode'}.`).join(' '),
          trap: 'A device below threshold is cut off however large $V_{DS}$ is.' };
      } },
    { id: 'sd-g11', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'temperature',
      make(r) {
        const I0 = pick(r, 1, 50, 1), T1 = pick(r, 20, 30, 5), dT = pick(r, 10, 60, 5), coef = choose(r, [2, 2, 2.2]);
        const VF = pick(r, 0.55, 0.75, 0.01), ask = r() < 0.5 ? 'I' : 'V';
        const val = ask === 'I' ? I0 * 2 ** (dT / 10) : VF - coef * dT / 1000;
        return { q: ask === 'I' ? `A silicon diode has reverse saturation current $${I0}$ nA at $${T1}\\,^\\circ$C. Assuming it doubles for every $10\\,^\\circ$C rise, at $${T1 + dT}\\,^\\circ$C it is ______ nA (to one decimal place).` : `A silicon diode drops $${VF}$ V at a fixed forward current at $${T1}\\,^\\circ$C. With a temperature coefficient of $-${coef}$ mV/$^\\circ$C, at $${T1 + dT}\\,^\\circ$C (same current) it drops ______ V (to three decimal places).`,
          answer: ask === 'I' ? round(val, 1) : round(val, 3), tol: ask === 'I' ? Math.max(0.1, round(val * 0.005, 1)) : 0.001, I0, dT, VF, coef, ask,
          sol: ask === 'I' ? `$I_S = ${I0}\\times2^{${dT}/10} = ${I0}\\times${round(2 ** (dT / 10), 4)} = ${round(val, 1)}$ nA.` : `$V = ${VF} - ${coef}\\times10^{-3}\\times${dT} = ${round(val, 3)}$ V.`,
          trap: ask === 'I' ? 'Adding a fixed amount per 10 degrees instead of doubling.' : 'The forward voltage falls with temperature; it does not rise.' };
      },
      verify: (p) => (p.ask === 'I' ? p.I0 * 2 ** (p.dT / 10) : p.VF - p.coef * p.dT / 1000) },
    { id: 'sd-g12', type: 'nat', level: 4, exams: G, sub: 'varactor',
      make(r) {
        const L = pick(r, 10, 200, 10), C0 = pick(r, 50, 500, 50), Vbi = pick(r, 0.6, 0.9, 0.1), VR = pick(r, 1, 20, 1);
        const C = C0 / Math.sqrt(1 + VR / Vbi), f = 1 / (2 * Math.PI * Math.sqrt(L * 1e-6 * C * 1e-12)) / 1e6;
        return { q: `A varactor ($C = C_0(1 + V_R/V_{bi})^{-1/2}$ with $C_0 = ${C0}$ pF, $V_{bi} = ${Vbi}$ V) tunes a $${L}$ μH inductor. At a reverse bias of $${VR}$ V the resonant frequency is ______ MHz (to two decimal places).`,
          answer: round(f, 2), tol: Math.max(0.01, round(f * 0.005, 2)), unit: 'MHz', L, C0, Vbi, VR,
          sol: `$C = ${C0}/\\sqrt{1 + ${VR}/${Vbi}} = ${round(C, 3)}$ pF. $f = \\dfrac1{2\\pi\\sqrt{LC}} = \\dfrac1{2\\pi\\sqrt{${L}\\times10^{-6}\\times${round(C, 3)}\\times10^{-12}}} = ${round(f, 2)}$ MHz.`,
          trap: 'Using $C_0$ (the zero-bias value) or forgetting that more reverse bias lowers $C$ and raises $f$.' };
      },
      verify: (p) => 1 / (2 * Math.PI * Math.sqrt(p.L * 1e-6 * p.C0 / Math.sqrt(1 + p.VR / p.Vbi) * 1e-12)) / 1e6 },
    ...more,
    ...r4.gens,
  ],
};
