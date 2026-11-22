// Round 4 extras for fresnel-equations: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

// Normal-incidence reflectance of a single layer n2 between n1 and n3, with round-trip phase delta.
const layerR = (n1, n2, n3, delta) => { const a = (n1 - n2) / (n1 + n2), b = (n2 - n3) / (n2 + n3), c = Math.cos(delta); return (a * a + b * b + 2 * a * b * c) / (1 + a * a * b * b + 2 * a * b * c); };
// Reflectance of air | (H L)^N | substrate quarter-wave stack at its design wavelength.
const stackR = (nH, nL, ns, N) => { const Y = (nH / nL) ** (2 * N) * ns; return ((1 - Y) / (1 + Y)) ** 2; };

export default {
  items: [
    { id: 'frs-r4-01', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'normal incidence',
      q: R`At night, a window of a brightly lit room looks like a mirror from inside, though in daytime you see straight through it. The best explanation is that`,
      options: ['glass reflects more strongly when it is cold', 'at night the glass reflects almost all the light that falls on it', 'the glass reflects the same few per cent of light as by day, but the weak light coming in from the dark outside no longer swamps that reflection', 'the room lights make the light polarised, and polarised light is reflected totally'], answer: 2,
      sol: R`Each glass surface reflects about 4% at normal incidence whatever the time of day. In daytime the light coming in from outside is far brighter than the 8% of the room's light reflected back, so you see through. At night almost no light comes in, so the reflected image of the room dominates. From outside, the same window looks transparent: the lit room is bright compared with the reflection of the dark street.`,
      trap: R`The reflectance is a property of the surface; what changes is the light competing with the reflection.` },
    { id: 'frs-r4-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'normal incidence',
      q: R`An uncoated germanium window ($n = 4.0$ in the infrared) is used in air. The percentage of the infrared intensity reflected at its front surface at normal incidence is ______ %.`,
      answer: 36, tol: 0.1, unit: '%', calc: () => 100 * ((4 - 1) / (4 + 1)) ** 2,
      sol: R`$R = \left(\dfrac{n - 1}{n + 1}\right)^2 = (3/5)^2 = 0.36$, that is 36%. With two surfaces, barely 40% of the light would get through an uncoated window, which is why infrared optics are always given anti-reflection coatings.`,
      trap: R`$(n - 1)/(n + 1) = 0.6$ is the amplitude ratio; square it for intensity.` },
    { id: 'frs-r4-03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'polarisation by reflection',
      q: R`Polarising sunglasses cut the glare reflected from a lake surface. To do this, their transmission axis must be`,
      options: ['horizontal, because reflected glare is polarised vertically', 'vertical, because reflected glare is mostly polarised with its electric field horizontal', 'at 45° to the horizontal', 'along the line of sight'], answer: 1,
      sol: R`Light reflected from a horizontal surface is mostly s-polarised: its electric field is perpendicular to the (vertical) plane of incidence, i.e. horizontal. Near Brewster's angle (about $53^\circ$ for water) the reflection is almost purely s. Lenses that pass only vertical $\vec E$ block most of it while passing half of the unpolarised light from elsewhere.`,
      trap: R`The plane of incidence is vertical; the reflected field is mostly perpendicular to it.` },
    { id: 'frs-r4-04', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'normal incidence',
      q: R`Light in air falls normally on a material whose refractive index is made larger and larger ($n_2 \to \infty$), approaching a perfect conductor. The amplitude reflection coefficient $E_r/E_i$ tends to`,
      options: [R`$-1$`, R`$+1$`, R`$0$`, R`$-1/2$`], answer: 0,
      sol: R`$r = \dfrac{n_1 - n_2}{n_1 + n_2} \to -1$. All the light is reflected, with the electric field flipped so that the total tangential field at the surface is zero, as it must be at a perfect conductor. The standing wave in front of a mirror therefore has a node of $\vec E$ at the surface.`,
      trap: R`$+1$ would make the field at the surface double, not zero.` },
    { id: 'frs-r4-05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'total internal reflection',
      q: R`Light is produced evenly in all directions inside a large block of semiconductor ($n = 3.5$) with a flat top face to air. Ignoring partial reflection inside the escape cone and any light reflected back up from other faces, the percentage of the light that can leave through the top face is ______ % (one decimal place).`,
      answer: 2.1, tol: 0.05, unit: '%', calc: () => (100 * (1 - Math.cos(Math.asin(1 / 3.5)))) / 2,
      sol: R`Only rays within the critical angle of the normal escape: $\sin\theta_c = 1/3.5$, $\theta_c = 16.6^\circ$. The fraction of all directions inside a cone of half-angle $\theta_c$ is its solid angle over $4\pi$: $\dfrac{2\pi(1 - \cos\theta_c)}{4\pi} = \dfrac{1 - 0.958}{2} = 0.021$, about 2.1%. This is the main reason early LEDs were so inefficient.`,
      trap: R`$\theta_c/90^\circ$ (18%) treats directions as spread evenly in angle, not in solid angle.` },
    { id: 'frs-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'reflection facts', format: 'statements',
      q: R`Which statements about phase changes of reflected light at a boundary between two lossless dielectrics are correct?`,
      options: ['At normal incidence from air onto glass, the reflected electric field is reversed (a phase change of $\\pi$)', 'At normal incidence from glass onto air, the reflected electric field is not reversed', 'For p polarisation going from air into glass, the sign of the reflected amplitude is different above and below the Brewster angle', 'Under total internal reflection the reflected wave is weaker than the incident one'], answer: [0, 1, 2],
      sol: R`At normal incidence $r = \dfrac{n_1 - n_2}{n_1 + n_2}$: negative from air to glass (field reversed), positive from glass to air. For p polarisation, $r_p$ passes through zero at the Brewster angle, so it has opposite signs on the two sides of it. Under total internal reflection $|r_s| = |r_p| = 1$: all the energy is reflected, and only the phase changes.`,
      trap: R`Total internal reflection is total: the evanescent wave carries no average energy across the boundary.` },
    { id: 'frs-r4-07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'evanescent waves',
      q: R`Light is totally reflected at the long face of a glass prism. A second prism is brought up parallel to that face, leaving a thin air gap. As the gap is narrowed from many wavelengths towards zero, the light transmitted into the second prism`,
      options: ['stays zero until the prisms touch', 'rises in proportion to the inverse of the gap', 'oscillates as the gap passes through each half wavelength', 'grows roughly exponentially as the gap shrinks, becoming large when the gap is below about a wavelength'], answer: 3,
      sol: R`Beyond the critical angle the field in the air is an evanescent wave whose amplitude falls as $e^{-z/\delta}$, with $\delta$ a fraction of a wavelength. If the second prism reaches into this field, light can leak across ("frustrated total internal reflection", the optical cousin of quantum tunnelling). The transmitted fraction is roughly proportional to $e^{-2d/\delta}$, growing quickly as the gap $d$ closes.`,
      trap: R`Total reflection does not mean zero field beyond the surface.` },
    { id: 'frs-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'thin layers',
      q: R`Two blocks of glass ($n = 1.5$) are separated by a parallel air gap whose thickness is a quarter of the wavelength (in air) of the light used. At normal incidence, the fraction of the intensity reflected by the gap (both of its surfaces together, coherently) is ______ (three decimal places).`,
      answer: 0.148, tol: 0.002, calc: () => layerR(1.5, 1, 1.5, Math.PI),
      sol: R`Glass to air: $r_1 = \dfrac{1.5 - 1}{2.5} = +0.2$. Air to glass: $r_2 = -0.2$. The round trip across the gap adds phase $\delta = 2k t = \pi$. Summing all the reflections: $r = \dfrac{r_1 + r_2e^{i\delta}}{1 + r_1r_2e^{i\delta}} = \dfrac{0.2 + 0.2}{1 + 0.04} = 0.385$, so $R = 0.148$. A half-wave gap would reflect nothing, as if it were not there.`,
      trap: R`Adding the two 4% reflections (8%) ignores interference; at a quarter wave they add in amplitude.` },
    { id: 'frs-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'boundary conditions', format: 'statements',
      q: R`A light wave passes from air into glass (no free charges or currents on the surface). Which field components are continuous across the surface?`,
      options: [R`The component of $\vec E$ along the surface`, R`The component of $\vec H$ along the surface`, R`The component of $\vec D$ normal to the surface`, R`The component of $\vec E$ normal to the surface`], answer: [0, 1, 2],
      sol: R`From Maxwell's equations in integral form: $\oint\vec E\cdot d\vec l = -\dfrac{d\Phi_B}{dt}$ makes tangential $\vec E$ continuous; with no surface current, tangential $\vec H$ is continuous; with no free surface charge, normal $\vec D$ is continuous; and normal $\vec B$ is continuous. Normal $\vec E$ jumps, because $\epsilon_1E_{1n} = \epsilon_2E_{2n}$ with $\epsilon_1 \ne \epsilon_2$ (bound charge sits on the surface).`,
      trap: R`$\vec D_n$ is continuous, so $\vec E_n$ is not when the permittivities differ.` },
    { id: 'frs-r4-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'thin layers',
      q: R`A dielectric mirror is made of 4 pairs of quarter-wave layers on glass ($n_s = 1.52$), arranged air | H L H L H L H L | glass, with $n_H = 2.35$ and $n_L = 1.38$. At the design wavelength and normal incidence, its reflectance is ______ (three decimal places).`,
      answer: 0.963, tol: 0.002, calc: () => stackR(2.35, 1.38, 1.52, 4),
      sol: R`A quarter-wave layer of index $n$ turns the "optical admittance" $Y$ of whatever lies behind it into $n^2/Y$. Start from the glass, $Y = 1.52$. An L layer gives $1.38^2/1.52$; the H layer on top gives $2.35^2\times1.52/1.38^2$. Each HL pair multiplies $Y$ by $(n_H/n_L)^2 = 2.90$, so after 4 pairs $Y = 2.90^4\times1.52 = 107.5$. Then $R = \left(\dfrac{1 - Y}{1 + Y}\right)^2 = \left(\dfrac{106.5}{108.5}\right)^2 = 0.963$.`,
      trap: R`The layers do not each add 4%: in a quarter-wave stack all the reflections are in phase and the reflectance climbs towards 1.` },
  ],
  gens: [
    { id: 'frs-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'total internal reflection',
      make(r) {
        const [mat, n] = choose(r, [['gallium nitride', 2.4], ['gallium arsenide', 3.5], ['gallium phosphide', 3.3], ['silicon carbide', 2.6], ['glass', 1.5], ['sapphire', 1.77]]), out = choose(r, [['air', 1], ['an epoxy dome of index 1.5', 1.5]]);
        if (out[1] >= n) out[0] = 'air', out[1] = 1;
        const tc = Math.asin(out[1] / n), answer = round((100 * (1 - Math.cos(tc))) / 2, 2);
        return { q: R`Light is produced evenly in all directions deep inside a block of ${mat} ($n = ${n}$) with a flat face against ${out[0]}. Ignoring partial reflection inside the escape cone and light returned by other faces, what percentage of the light can leave through that face?`,
          answer, tol: Math.max(0.02, answer * 0.005), unit: '%', n, n2: out[1],
          sol: R`$\sin\theta_c = ${out[1]}/${n}$, $\theta_c = ${round((tc * 180) / Math.PI, 2)}^\circ$. Fraction of the full sphere of directions inside the cone: $\dfrac{1 - \cos\theta_c}{2} = ${round(answer / 100, 4)}$, i.e. ${answer}%.`,
          trap: 'Directions are spread evenly in solid angle, not in angle.' };
      },
      verify: (p) => (100 * (1 - Math.cos(Math.asin(p.n2 / p.n)))) / 2 },
    { id: 'frs-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'thin layers',
      make(r) {
        const [what, n1, n2, n3] = choose(r, [['an air gap between two glass blocks', 1.5, 1, 1.5], ['a water film between two glass plates', 1.5, 1.33, 1.5], ['a layer of zinc sulphide on glass, in air', 1, 2.35, 1.52], ['a layer of magnesium fluoride on glass, in air', 1, 1.38, 1.52], ['an air gap between two diamond pieces', 2.42, 1, 2.42]]);
        const [tw, delta] = choose(r, [['a quarter', Math.PI], ['an eighth', Math.PI / 2], ['three eighths', (3 * Math.PI) / 2], ['a half', 2 * Math.PI]]);
        const answer = round(layerR(n1, n2, n3, delta), 4);
        return { q: R`Light falls normally on ${what} (indices ${n1} | ${n2} | ${n3}). The layer's optical thickness is ${tw} of the wavelength. Find the fraction of the intensity reflected, adding all reflections coherently.`,
          answer, tol: Math.max(0.0005, answer * 0.005), n1, n2, n3, delta,
          sol: R`$r_{12} = ${round((n1 - n2) / (n1 + n2), 4)}$, $r_{23} = ${round((n2 - n3) / (n2 + n3), 4)}$, round-trip phase $\delta = ${round(delta / Math.PI, 3)}\pi$. $R = \dfrac{r_{12}^2 + r_{23}^2 + 2r_{12}r_{23}\cos\delta}{1 + r_{12}^2r_{23}^2 + 2r_{12}r_{23}\cos\delta} = ${answer}$.`,
          trap: 'The round-trip phase is twice the one-way phase: a quarter-wave layer gives π.' };
      },
      verify: (p) => layerR(p.n1, p.n2, p.n3, p.delta) },
    { id: 'frs-r4g3', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'thin layers',
      make(r) {
        const [nH, nL] = choose(r, [[2.35, 1.38], [2.3, 1.46], [2.1, 1.46], [1.9, 1.38]]), ns = choose(r, [1.46, 1.5, 1.52]), N = int(r, 2, 8);
        const Y = (nH / nL) ** (2 * N) * ns, answer = round(stackR(nH, nL, ns, N), 4);
        return { q: R`A dielectric mirror has ${N} pairs of quarter-wave layers, air | (H L)$^{${N}}$ | substrate, with $n_H = ${nH}$, $n_L = ${nL}$ and $n_s = ${ns}$. Find its reflectance at the design wavelength, at normal incidence.`,
          answer, tol: Math.max(0.0005, (1 - answer) * 0.01), nH, nL, ns, N,
          sol: R`Each quarter-wave layer maps the admittance $Y \to n^2/Y$, so each HL pair multiplies it by $(n_H/n_L)^2$: $Y = (${nH}/${nL})^{${2 * N}}\times${ns} = ${round(Y, 2)}$. $R = \left(\dfrac{1 - Y}{1 + Y}\right)^2 = ${answer}$.`,
          trap: 'In a quarter-wave stack all reflections add in phase; do not add percentages.' };
      },
      verify: (p) => stackR(p.nH, p.nL, p.ns, p.N) },
  ],
};
