// Round 4 extras for bonding: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'], JG = ['jam', 'gate', 'net'];
const KE2 = 14.40; // e^2/4 pi eps0 in eV Å

export default {
  items: [
    { id: 'bd-r4-01', type: 'mcq', level: 2, exams: JG, sub: 'ionic character',
      q: R`Pauling's estimate of the fractional ionic character of a bond is $1 - e^{-(\Delta\chi)^2/4}$, where $\Delta\chi$ is the electronegativity difference. For Na ($\chi = 0.93$) and Cl ($\chi = 3.16$) it is about`,
      options: [R`$0.29$`, R`$0.71$`, R`$0.56$`, R`$0.99$`], answer: 1,
      sol: R`$\Delta\chi = 3.16 - 0.93 = 2.23$, $(\Delta\chi)^2/4 = 4.97/4 = 1.243$, $e^{-1.243} = 0.288$. Ionic character $= 1 - 0.288 = 0.71$: NaCl is mostly but not purely ionic. For Si-Si ($\Delta\chi = 0$) the formula gives $0$, pure covalent.`,
      trap: R`$0.29$ is the covalent fraction $e^{-(\Delta\chi)^2/4}$, not the ionic one.` },
    { id: 'bd-r4-02', type: 'mcq', level: 2, exams: JG, sub: 'van der Waals',
      q: R`Which of these interactions between two neutral molecules does NOT fall off as $1/r^6$?`,
      options: [R`The London (dispersion) energy between two non-polar atoms`, R`The Keesom energy between two freely rotating polar molecules, averaged over orientations at temperature $T$`, R`The energy between two polar molecules whose dipoles are held fixed in a given orientation`, R`The Debye energy between a polar molecule and the dipole it induces in a non-polar one`], answer: 2,
      sol: R`Two fixed dipoles interact as $\mu^2/r^3$ (times an angle factor), much longer-ranged. London: fluctuating dipole $\times$ induced dipole $\propto\alpha^2/r^6$. Debye: field $\propto\mu/r^3$ induces $\alpha E$, energy $\propto\alpha\mu^2/r^6$. Keesom: thermal averaging over orientations cancels the $1/r^3$ term, leaving $-\tfrac23\mu^4/(k_BTr^6)$ (in Gaussian-style units). All three "van der Waals" terms go as $1/r^6$.`,
      trap: R`The thermal averaging is what turns the $1/r^3$ dipole-dipole energy into $1/r^6$.` },
    { id: 'bd-r4-03', type: 'nat', level: 3, exams: G, sub: 'Morse potential', unit: 'eV/Å²',
      q: R`A diatomic bond is described by the Morse potential $U(r) = D\left[1 - e^{-\beta(r - r_0)}\right]^2 - D$ with $D = 4.5$ eV and $\beta = 1.9$ Å$^{-1}$. The force constant $U''(r_0)$ is ______ eV/Å$^2$ (to one decimal place).`,
      answer: 32.5, tol: 0.1, calc: () => 2 * 4.5 * 1.9 ** 2,
      sol: R`Near $r_0$, $1 - e^{-\beta x}\approx\beta x - \tfrac12\beta^2x^2$, so $U\approx D\beta^2x^2 - D$ to second order. Then $U'' = 2D\beta^2 = 2\times4.5\times3.61 = 32.5$ eV/Å$^2$, which is $32.5\times16.02 = 521$ N/m.`,
      trap: R`$U\approx D\beta^2x^2$ means $k = 2D\beta^2$, not $D\beta^2$ (compare $U = \tfrac12kx^2$).` },
    { id: 'bd-r4-04', type: 'mcq', level: 3, exams: JG, sub: 'zero-point energy',
      q: R`H$_2$ and D$_2$ have the same electronic potential curve (same well depth). Their dissociation energies $D_0$, measured from the lowest vibrational level,`,
      options: [R`are equal, because the potential is the same`, R`are larger for H$_2$, because hydrogen vibrates faster`, R`differ by a factor of $2$, the mass ratio`, R`are larger for D$_2$, because its zero-point energy is smaller`], answer: 3,
      sol: R`$D_0 = D_e - \tfrac12\hbar\omega$, with $\omega = \sqrt{k/\mu}$. The force constant is the same, but D$_2$ has twice the reduced mass, so its $\tfrac12\hbar\omega$ is smaller by $\sqrt2$ (about $0.19$ eV against $0.27$ eV). D$_2$ starts deeper in the well and needs more energy to break: about $4.56$ eV against $4.48$ eV.`,
      trap: R`Same potential does not mean same binding: the zero-point energy depends on the mass.` },
    { id: 'bd-r4-05', type: 'nat', level: 3, exams: G, sub: 'Born-Lande', unit: 'eV',
      q: R`MgO has the rock-salt structure ($\alpha = 1.7476$) with ions Mg$^{2+}$ and O$^{2-}$, nearest-neighbour distance $r_0 = 2.106$ Å and Born exponent $n = 7$. With $e^2/4\pi\varepsilon_0 = 14.40$ eV Å, the Born-Landé lattice energy per ion pair, $\alpha z^2e^2(1 - 1/n)/4\pi\varepsilon_0r_0$, is ______ eV (to one decimal place).`,
      answer: 41, tol: 0.1, calc: () => 1.7476 * 4 * 14.4 / 2.106 * (1 - 1 / 7),
      sol: R`$z^2 = 4$ for doubly charged ions. $\alpha z^2e^2/4\pi\varepsilon_0r_0 = 1.7476\times4\times14.40/2.106 = 47.80$ eV; times $(1 - 1/7) = 0.857$ gives $41.0$ eV per ion pair, about five times that of NaCl. This is why MgO melts near $2850^\circ$C.`,
      trap: R`Forgetting $z^2 = 4$ gives $10.2$ eV, an NaCl-like value.` },
    { id: 'bd-r4-06', type: 'msq', level: 3, exams: JG, sub: 'covalent bonds', format: 'statements',
      q: R`Which statements about graphite are correct?`,
      options: [R`Within each layer, every carbon forms three $sp^2$ bonds at $120^\circ$.`, R`The layers are held together by weak van der Waals forces, so graphite cleaves and slides easily.`, R`Graphite conducts electricity well along the layers, thanks to the delocalised $\pi$ electrons.`, R`Graphite is harder than diamond in every direction, since its in-plane bonds are stronger.`], answer: [0, 1, 2],
      sol: R`Each carbon uses three $sp^2$ hybrids for in-plane $\sigma$ bonds at $120^\circ$; the fourth electron sits in a $p_z$ orbital and joins a delocalised $\pi$ system, giving metallic-like in-plane conduction. The layers, $3.35$ Å apart, are bound only by van der Waals forces, so graphite is soft and a lubricant. The in-plane bond is indeed slightly stronger than diamond's, but the weak interlayer binding makes the crystal as a whole soft.`,
      trap: R`A strong bond in one direction does not make a hard crystal if another direction is weak.` },
    { id: 'bd-r4-07', type: 'mcq', level: 4, exams: G, sub: 'hydrogen bonds',
      q: R`In ice each water molecule takes part in four hydrogen bonds, each shared with one neighbour. If the sublimation energy, $51$ kJ/mol, is put down entirely to hydrogen bonds, the energy of one hydrogen bond is about (1 eV per particle $= 96.5$ kJ/mol)`,
      options: [R`$0.13$ eV`, R`$0.53$ eV`, R`$0.26$ eV`, R`$0.066$ eV`], answer: 2,
      sol: R`Four bonds per molecule, each shared by two molecules, means $2$ bonds per molecule. Breaking a mole of ice into free molecules breaks $2N_A$ bonds: $51/2 = 25.5$ kJ per mole of bonds $= 25.5/96.5 = 0.26$ eV per bond. This is about $10$ times $k_BT$ at room temperature, weak next to a covalent O-H bond ($\approx4.8$ eV).`,
      trap: R`Dividing by $4$ counts each shared bond twice.` },
    { id: 'bd-r4-08', type: 'nat', level: 4, exams: G, sub: 'Morse potential', unit: 'eV',
      q: R`For H$_2$, take a Morse potential with depth $D = 4.75$ eV and $\beta = 1.94$ Å$^{-1}$, so the force constant is $2D\beta^2$. With reduced mass $\mu = 0.504$ u ($1$ u $= 1.661\times10^{-27}$ kg), $1$ eV/Å$^2 = 16.02$ N/m and $\hbar = 6.582\times10^{-16}$ eV s, the vibrational quantum $\hbar\omega$ is ______ eV (to three decimal places).`,
      answer: 0.545, tol: 0.003, calc: () => 6.582e-16 * Math.sqrt(2 * 4.75 * 1.94 ** 2 * 16.02 / (0.504 * 1.661e-27)),
      sol: R`$k = 2D\beta^2 = 2\times4.75\times3.764 = 35.75$ eV/Å$^2 = 572.8$ N/m. $\mu = 0.504\times1.661\times10^{-27} = 8.37\times10^{-28}$ kg. $\omega = \sqrt{k/\mu} = \sqrt{6.84\times10^{29}} = 8.27\times10^{14}$ s$^{-1}$, $\hbar\omega = 0.545$ eV, close to the measured H$_2$ value. The zero-point energy is half of this, $0.27$ eV.`,
      trap: R`The reduced mass of H$_2$ is half a hydrogen mass, not the molecular mass.` },
    { id: 'bd-r4-09', type: 'msq', level: 4, exams: G, sub: 'Morse potential', format: 'statements',
      q: R`For the Morse potential $U(r) = D\left[1 - e^{-\beta(r - r_0)}\right]^2 - D$ ($D, \beta > 0$), which statements are correct?`,
      options: [R`The minimum is at $r_0$, with depth $D$ below the dissociated atoms.`, R`The force constant at the minimum is $2D\beta^2$.`, R`The well is symmetric about $r_0$, so the mean bond length does not change as the molecule is heated.`, R`At $r = 0$ the Morse potential is finite, unlike the Lennard-Jones potential.`], answer: [0, 1, 3],
      sol: R`At $r = r_0$ the bracket vanishes, giving $U = -D$, and $U\to0$ as $r\to\infty$. Expanding gives $U\approx-D + D\beta^2(r - r_0)^2$, so $k = 2D\beta^2$. The well is steep on the inside and gentle on the outside, so higher vibrational levels spend more time at large $r$: the mean bond length grows (the origin of thermal expansion). $U(0) = D(1 - e^{\beta r_0})^2 - D$ is large but finite, while $4\varepsilon(\sigma/r)^{12}$ diverges.`,
      trap: R`A harmonic well is symmetric; a real bond potential is not, and that asymmetry drives thermal expansion.` },
    { id: 'bd-r4-10', type: 'nat', level: 5, exams: G, sub: 'bulk modulus',
      q: R`In the Born-Landé model of a rock-salt crystal the bulk modulus is $B = \dfrac{(n - 1)\alpha z^2e^2}{72\pi\varepsilon_0r_0^4}$. MgO ($z = 2$, $r_0 = 2.106$ Å) and NaF ($z = 1$, $r_0 = 2.317$ Å) are taken to have the same Born exponent $n$. The predicted ratio $B_{\rm MgO}/B_{\rm NaF}$ is ______ (to two decimal places).`,
      answer: 5.86, tol: 0.02, calc: () => 4 * (2.317 / 2.106) ** 4,
      sol: R`Same structure and $n$ leave $B\propto z^2/r_0^4$. Ratio $= \dfrac{2^2}{1^2}\times\left(\dfrac{2.317}{2.106}\right)^4 = 4\times1.1002^4 = 4\times1.465 = 5.86$. The measured ratio is closer to $3.5$ (about $160$ against $46$ GPa), a reminder that the model's $n$ and point-charge picture are rough for MgO.`,
      trap: R`The fourth power of $r_0$, not the first, enters the bulk modulus.` },
  ],
  gens: [
    { id: 'bd-r4g1', type: 'nat', level: 3, exams: G, sub: 'Born-Lande', unit: 'eV',
      make(r) {
        const [salt, st, al, z, r0, n] = choose(r, [['MgO', 'rock-salt', 1.7476, 2, 2.106, 7], ['CaO', 'rock-salt', 1.7476, 2, 2.405, 8], ['SrO', 'rock-salt', 1.7476, 2, 2.580, 8], ['BaO', 'rock-salt', 1.7476, 2, 2.762, 9], ['ZnS', 'zinc-blende', 1.6381, 2, 2.342, 9], ['NaCl', 'rock-salt', 1.7476, 1, 2.820, 8], ['CsCl', 'caesium chloride', 1.7627, 1, 3.571, 11]]);
        const rr = round(r0 + pick(r, -0.02, 0.02, 0.01), 3), U = al * z * z * KE2 / rr * (1 - 1 / n);
        return { q: `${salt} has the ${st} structure ($\\alpha = ${al}$) with ions of charge $\\pm ${z === 1 ? '' : z}e$, nearest-neighbour distance $${rr}$ Å and Born exponent $n = ${n}$. With $e^2/4\\pi\\varepsilon_0 = 14.40$ eV Å, the Born-Landé lattice energy per ion pair is ______ eV (to two decimal places).`,
          answer: round(U, 2), tol: Math.max(0.02, round(U * 0.002, 2)), al, z, rr, n,
          sol: `$U = \\dfrac{\\alpha z^2e^2}{4\\pi\\varepsilon_0r_0}\\left(1 - \\dfrac1n\\right) = \\dfrac{${al}\\times${z * z}\\times14.40}{${rr}}\\times${round(1 - 1 / n, 4)} = ${round(U, 2)}$ eV.`,
          trap: z === 2 ? 'Doubly charged ions multiply the Coulomb energy by $z^2 = 4$.' : 'The factor $1 - 1/n$ removes the repulsion\'s share.' };
      },
      verify: (p) => p.al * p.z * p.z * KE2 / p.rr * (1 - 1 / p.n) },
    { id: 'bd-r4g2', type: 'nat', level: 4, exams: G, sub: 'Morse potential', unit: 'meV',
      make(r) {
        const [mol, mu] = choose(r, [['H$_2$', 0.504], ['HD', 0.672], ['D$_2$', 1.007], ['HCl', 0.980], ['N$_2$', 7.00], ['O$_2$', 8.00], ['CO', 6.86]]);
        const D = pick(r, 3, 10, 0.05), be = pick(r, 1.5, 2.8, 0.01), k = 2 * D * be * be, hw = 1000 * 6.582e-16 * Math.sqrt(k * 16.02 / (mu * 1.661e-27));
        return { q: `Model the ${mol} bond (reduced mass $${mu}$ u, $1$ u $= 1.661\\times10^{-27}$ kg) by a Morse potential with depth $D = ${D}$ eV and $\\beta = ${be}$ Å$^{-1}$. With $1$ eV/Å$^2 = 16.02$ N/m and $\\hbar = 6.582\\times10^{-16}$ eV s, the vibrational quantum $\\hbar\\omega$ is ______ meV (to the nearest meV).`,
          answer: Math.round(hw), tol: Math.max(1, Math.round(hw * 0.005)), mu, D, be,
          sol: `$k = 2D\\beta^2 = 2\\times${D}\\times${be}^2 = ${round(k, 3)}$ eV/Å$^2 = ${round(k * 16.02, 1)}$ N/m. $\\omega = \\sqrt{k/\\mu} = ${round(Math.sqrt(k * 16.02 / (mu * 1.661e-27)) / 1e14, 4)}\\times10^{14}$ s$^{-1}$, $\\hbar\\omega = ${Math.round(hw)}$ meV.`,
          trap: 'Use the reduced mass, and convert eV/Å$^2$ to N/m before taking the square root.' };
      },
      verify: (p) => 1000 * 6.582e-16 * Math.sqrt(2 * p.D * p.be ** 2 * 16.02 / (p.mu * 1.661e-27)) },
    { id: 'bd-r4g3', type: 'nat', level: 2, exams: JG, sub: 'ionic character',
      make(r) {
        const A = [['Li', 0.98], ['Na', 0.93], ['K', 0.82], ['Mg', 1.31], ['Ga', 1.81], ['Zn', 1.65], ['Si', 1.90], ['H', 2.20]];
        const B = [['F', 3.98], ['Cl', 3.16], ['Br', 2.96], ['I', 2.66], ['O', 3.44], ['N', 3.04], ['S', 2.58], ['As', 2.18]];
        const [a, xa] = A[int(r, 0, A.length - 1)], [b, xb] = B[int(r, 0, B.length - 1)], d = Math.abs(xb - xa), ic = 100 * (1 - Math.exp(-d * d / 4));
        return { q: `Using Pauling's estimate $1 - e^{-(\\Delta\\chi)^2/4}$ with electronegativities $\\chi_{\\rm ${a}} = ${xa}$ and $\\chi_{\\rm ${b}} = ${xb}$, the ionic character of the ${a}-${b} bond is ______ % (to one decimal place).`,
          answer: round(ic, 1), tol: 0.2, xa, xb,
          sol: `$\\Delta\\chi = ${round(d, 2)}$, $(\\Delta\\chi)^2/4 = ${round(d * d / 4, 4)}$, $e^{-${round(d * d / 4, 4)}} = ${round(Math.exp(-d * d / 4), 4)}$. Ionic character $= ${round(ic, 1)}$%.`,
          trap: '$e^{-(\\Delta\\chi)^2/4}$ is the covalent share; subtract it from 1.' };
      },
      verify: (p) => 100 * (1 - Math.exp(-((p.xb - p.xa) ** 2) / 4)) },
  ],
};
