// Round 4 extras for relativistic-quantum: original questions, written 2026-11-22.
import { pick, int, choose, fmt } from '../_util.js';
const R = String.raw;

const HC = 1239.84198; // MeV fm
const E_CH = 1.602176634e-19;
/** Particles: label, rest energy (MeV). */
const PART = [['an electron', 0.51100], ['a muon', 105.658], ['a charged pion', 139.570], ['a proton', 938.272]];

// ---- explicit Dirac matrices (Dirac representation) for verifying traces ----
const c = (re, im = 0) => [re, im];
const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const ca = (a, b) => [a[0] + b[0], a[1] + b[1]];
const Z4 = () => Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => c(0)));
const mm = (A, B) => { const C = Z4(); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = c(0); for (let k = 0; k < 4; k++) s = ca(s, cm(A[i][k], B[k][j])); C[i][j] = s; } return C; };
const sc = (A, k) => A.map((row) => row.map((z) => [z[0] * k, z[1] * k]));
const add = (A, B) => A.map((row, i) => row.map((z, j) => ca(z, B[i][j])));
const blk = (a, b, cc, d) => { const M = Z4(); const put = (S, r0, c0) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) M[r0 + i][c0 + j] = S[i][j]; }; put(a, 0, 0); put(b, 0, 2); put(cc, 2, 0); put(d, 2, 2); return M; };
const I2 = [[c(1), c(0)], [c(0), c(1)]], O2 = [[c(0), c(0)], [c(0), c(0)]], nI2 = [[c(-1), c(0)], [c(0), c(-1)]];
const SX = [[c(0), c(1)], [c(1), c(0)]], SY = [[c(0), c(0, -1)], [c(0, 1), c(0)]], SZ = [[c(1), c(0)], [c(0), c(-1)]];
const neg2 = (S) => S.map((row) => row.map((z) => [-z[0], -z[1]]));
const G = [blk(I2, O2, O2, nI2), blk(O2, SX, neg2(SX), O2), blk(O2, SY, neg2(SY), O2), blk(O2, SZ, neg2(SZ), O2)];
/** p-slash = gamma^0 p0 - gamma^i p^i for contravariant p = [p0, px, py, pz]. */
const slash = (p) => add(add(sc(G[0], p[0]), sc(G[1], -p[1])), add(sc(G[2], -p[2]), sc(G[3], -p[3])));
const tr = (A) => A[0][0][0] + A[1][1][0] + A[2][2][0] + A[3][3][0];
const dot = (a, b) => a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3];
const vec = (p) => `(${p.join(', ')})`;

export default {
  items: [
    { id: 'netrq-r4-01', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'concepts',
      q: R`The Klein-Gordon equation, taken as a single-component wave equation, describes free particles of spin`,
      options: [R`$0$`, R`$\tfrac12$`, R`$1$`, R`any value`], answer: 0,
      sol: R`The Klein-Gordon equation $(\Box + m^2c^2/\hbar^2)\phi = 0$ acts on one scalar function, which carries no spin index: it describes spin-0 particles such as pions or the Higgs boson. Spin $\tfrac12$ needs the four-component Dirac equation; spin 1 needs a vector field (Proca or Maxwell), although each component of those fields also obeys the Klein-Gordon equation.`,
      trap: R`Every relativistic field component satisfies the KG relation, but a single scalar field has spin 0.` },
    { id: 'netrq-r4-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'de Broglie wavelength', unit: 'fm',
      q: R`An electron has total energy $1.000$ GeV. Its de Broglie wavelength is ______ fm (two decimal places). Use $hc = 1239.8$ MeV fm and $m_ec^2 = 0.511$ MeV.`,
      answer: 1.24, tol: 0.01, calc: () => HC / Math.sqrt(1000 ** 2 - 0.511 ** 2),
      sol: R`$pc = \sqrt{E^2 - m^2c^4} = \sqrt{1000^2 - 0.511^2}$ MeV $\approx999.9999$ MeV, so the electron is ultra-relativistic and $pc\approx E$. $\lambda = h/p = hc/pc = 1239.8/1000 = 1.24$ fm, about the size of a proton, which is why GeV electrons probe nuclear structure.`,
      trap: R`The non-relativistic $p = \sqrt{2mK}$ gives $p c = 32$ MeV and a wavelength 30 times too long.` },
    { id: 'netrq-r4-03', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Dirac matrices',
      q: R`With $\gamma^0 = \beta$, $\gamma^i = \beta\alpha_i$ ($\alpha_i$, $\beta$ Hermitian) and metric $(+,-,-,-)$, the Hermiticity properties of the gamma matrices are`,
      options: [R`all four are Hermitian`, R`all four are anti-Hermitian`, R`$\gamma^0$ is Hermitian and each $\gamma^i$ is anti-Hermitian`, R`$\gamma^0$ is anti-Hermitian and each $\gamma^i$ is Hermitian`], answer: 2,
      sol: R`$(\gamma^0)^\dagger = \beta^\dagger = \beta = \gamma^0$. $(\gamma^i)^\dagger = \alpha_i^\dagger\beta^\dagger = \alpha_i\beta = -\beta\alpha_i = -\gamma^i$, using $\alpha_i\beta = -\beta\alpha_i$. Both facts are summarised by $\gamma^{\mu\dagger} = \gamma^0\gamma^\mu\gamma^0$. It matches $(\gamma^0)^2 = 1$ and $(\gamma^i)^2 = -1$.`,
      trap: R`$\alpha_i$ and $\beta$ are Hermitian, but their product is not, because they anticommute.` },
    { id: 'netrq-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wave packets',
      q: R`For a free electron with momentum $0.300$ MeV/$c$ ($m_ec^2 = 0.511$ MeV), the phase velocity $\omega/k = E/p$ of its de Broglie wave is ______ $c$ (three decimal places).`,
      answer: 1.975, tol: 0.003, calc: () => Math.sqrt(0.09 + 0.511 ** 2) / 0.3,
      sol: R`$E = \sqrt{(pc)^2 + (mc^2)^2} = \sqrt{0.0900 + 0.2611} = 0.5926$ MeV. $v_\text{phase} = E/p = c\times0.5926/0.300 = 1.975c$. The group velocity is $pc^2/E = 0.506c$, and $v_\text{phase}v_\text{group} = c^2$. A phase velocity above $c$ carries no signal.`,
      trap: R`Using the kinetic energy instead of the total energy in $E/p$ gives 0.27$c$.` },
    { id: 'netrq-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bilinears',
      q: R`With $\bar\psi = \psi^\dagger\gamma^0$, which of these Dirac bilinears is a Lorentz scalar (unchanged by boosts, rotations and parity)?`,
      options: [R`$\psi^\dagger\psi$`, R`$\bar\psi\psi$`, R`$\bar\psi\gamma^\mu\psi$`, R`$\bar\psi\gamma^5\psi$`], answer: 1,
      sol: R`$\bar\psi\psi$ is the scalar (it appears in the mass term). $\psi^\dagger\psi = \bar\psi\gamma^0\psi$ is the time component of the four-vector current $\bar\psi\gamma^\mu\psi$, so it changes under boosts (a density is not invariant). $\bar\psi\gamma^5\psi$ is invariant under proper Lorentz transformations but changes sign under parity: a pseudoscalar.`,
      trap: R`$\psi^\dagger\psi$ is positive and looks like a scalar, but it is a density, the 0th component of a four-vector.` },
    { id: 'netrq-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'length scales', format: 'statements',
      q: R`Which statements about the natural length scales of the electron are correct? ($\alpha\approx1/137$)`,
      options: [R`$\hbar c\approx197.3$ MeV fm`, R`The reduced Compton wavelength $\hbar/m_ec$ is about 386 fm`,
        R`The classical electron radius is $\alpha$ times the reduced Compton wavelength`, R`The Bohr radius is $\alpha$ times the reduced Compton wavelength`], answer: [0, 1, 2],
      sol: R`$\hbar/m_ec = \hbar c/m_ec^2 = 197.3/0.511 = 386$ fm. The three lengths form a ladder with step $\alpha$: $r_e = \alpha\,\hbar/m_ec = 2.82$ fm, $\hbar/m_ec = 386$ fm, $a_0 = (\hbar/m_ec)/\alpha = 52\,900$ fm $= 0.529$ Å. So the Bohr radius is the Compton wavelength divided by $\alpha$, not multiplied.`,
      trap: R`The atom is 137 times bigger than the Compton wavelength, not smaller.` },
    { id: 'netrq-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'anomalous moment', unit: 'kHz',
      q: R`In a storage ring with $B = 1.45$ T, a muon's spin turns relative to its momentum at the anomalous frequency $\omega_a = a_\mu eB/m_\mu$ (independent of its speed when electric fields are absent). With $a_\mu = 1.1659\times10^{-3}$ and $m_\mu = 1.8835\times10^{-28}$ kg, $\omega_a/2\pi$ is ______ kHz (nearest whole number).`,
      answer: 229, tol: 1.5, calc: () => 0.0011659 * E_CH * 1.45 / 1.8835e-28 / (2 * Math.PI) / 1e3,
      sol: R`$eB/m_\mu = 1.602\times10^{-19}\times1.45/1.8835\times10^{-28} = 1.233\times10^9$ s$^{-1}$. Times $a_\mu$: $1.438\times10^6$ s$^{-1}$. Divide by $2\pi$: $2.29\times10^5$ Hz $= 229$ kHz. If $g$ were exactly 2 the spin would stay locked to the momentum; measuring this small rotation measures $g - 2$ directly.`,
      trap: R`$eB/m$ is an angular frequency; divide by $2\pi$ for hertz.` },
    { id: 'netrq-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'helicity and chirality',
      q: R`For a massive spin-$\tfrac12$ particle, which quantity depends on the reference frame?`,
      options: [R`its rest mass`, R`its chirality (eigenvalue of $\gamma^5$) as a label of the field component`, R`its electric charge`, R`its helicity (spin projection on the momentum)`], answer: 3,
      sol: R`A massive particle moves slower than light, so an observer can overtake it; in that frame the momentum reverses while the spin does not, and the helicity flips. Chirality is defined by $\gamma^5$, which commutes with Lorentz transformations, so the left/right chiral projections are frame-independent (but mixed by the mass term in time). For massless particles helicity and chirality coincide and both are invariant.`,
      trap: R`Helicity is conserved for a free particle (it commutes with $H$) but it is still not Lorentz invariant when $m\ne0$.` },
    { id: 'netrq-r4-09', type: 'nat', level: 5, exams: ['net'], sub: 'traces',
      q: R`Using $\{\gamma^\mu, \gamma^\nu\} = 2g^{\mu\nu}$ in four dimensions, $\text{Tr}(\gamma^\mu\gamma^\nu\gamma_\mu\gamma_\nu)$ (summed over $\mu$ and $\nu$) equals ______.`,
      answer: -32, tol: 0, calc: () => -2 * 4 * 4,
      sol: R`First $\gamma^\mu\gamma^\nu\gamma_\mu = \gamma^\mu(2g^\nu{}_\mu - \gamma_\mu\gamma^\nu) = 2\gamma^\nu - 4\gamma^\nu = -2\gamma^\nu$. Then $\text{Tr}(-2\gamma^\nu\gamma_\nu) = -2\,\text{Tr}(4\cdot\mathbb 1) = -2\times16 = -32$.`,
      trap: R`$\gamma^\mu\gamma_\mu = 4$ (not 1); and moving $\gamma^\nu$ past $\gamma_\mu$ costs a sign plus the $2g$ term.` },
    { id: 'netrq-r4-10', type: 'mcq', level: 5, exams: ['net'], sub: 'chirality',
      q: R`Write $\psi = \psi_L + \psi_R$ with $\psi_{L,R} = \tfrac12(1\mp\gamma^5)\psi$. The mass term $m\bar\psi\psi$ of the Dirac Lagrangian equals`,
      options: [R`$m(\bar\psi_L\psi_R + \bar\psi_R\psi_L)$`, R`$m(\bar\psi_L\psi_L + \bar\psi_R\psi_R)$`, R`$m\bar\psi_L\psi_L$ only`, R`$0$`], answer: 0,
      sol: R`$\bar\psi_L = \psi_L^\dagger\gamma^0 = \psi^\dagger\tfrac12(1 - \gamma^5)\gamma^0 = \bar\psi\tfrac12(1 + \gamma^5)$, because $\gamma^5$ anticommutes with $\gamma^0$. Then $\bar\psi_L\psi_L = \bar\psi\tfrac12(1 + \gamma^5)\tfrac12(1 - \gamma^5)\psi = 0$, and likewise $\bar\psi_R\psi_R = 0$. Only the cross terms survive: $m\bar\psi\psi = m(\bar\psi_L\psi_R + \bar\psi_R\psi_L)$. The mass couples the two chiralities, which is why chirality is not conserved for massive fermions (and why the Standard Model needs the Higgs to give them mass).`,
      trap: R`The bar contains $\gamma^0$, which flips the chiral projector: $\bar\psi_L$ pairs with $\psi_R$.` },
    { id: 'netrq-r4-11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pair creation',
      q: R`By the energy-time uncertainty relation, a virtual electron-positron pair can exist for about $\Delta t\approx\hbar/(2m_ec^2)$. With $\hbar = 6.582\times10^{-22}$ MeV s and $m_ec^2 = 0.511$ MeV, this is ______ $\times10^{-22}$ s (two decimal places).`,
      answer: 6.44, tol: 0.02, calc: () => 6.582119569e-22 / 1.022 / 1e-22,
      sol: R`$\Delta t = 6.582\times10^{-22}/1.022 = 6.44\times10^{-22}$ s. In that time light travels $c\Delta t\approx190$ fm, half the reduced Compton wavelength: vacuum polarisation is felt only within about that distance of a charge.`,
      trap: R`The pair costs $2m_ec^2 = 1.022$ MeV, not $0.511$ MeV.` },
    { id: 'netrq-r4-12', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'concepts',
      q: R`Which of these free particles are described by the Dirac equation (spin-$\tfrac12$ with mass)?`,
      options: [R`the electron`, R`the muon`, R`the charged pion`, R`the proton (as a point particle, ignoring its structure)`], answer: [0, 1, 3],
      sol: R`Electrons and muons are pointlike spin-$\tfrac12$ fermions: the Dirac equation describes them very well (plus small QED corrections). A proton has spin $\tfrac12$ too, so a Dirac field describes its motion, but its magnetic moment ($g_p = 5.59$ instead of 2) shows it is not pointlike. The pion has spin 0 and obeys the Klein-Gordon equation.`,
      trap: R`Pions are mesons with spin 0, not fermions.` },
  ],
  gens: [
    { id: 'netrq-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wave packets',
      make(r) {
        const [name, m] = choose(r, PART);
        const p = +(m * pick(r, 0.2, 5, 0.1)).toPrecision(3);
        const E = Math.sqrt(p * p + m * m);
        const ask = choose(r, ['phase', 'lambda']);
        const ans = ask === 'phase' ? E / p : HC / p;
        return { q: ask === 'phase'
          ? R`For ${name} ($mc^2 = ${m}$ MeV) with momentum $${p}$ MeV/$c$, the phase velocity $E/p$ of its de Broglie wave is ______ $c$ (three significant figures).`
          : R`For ${name} ($mc^2 = ${m}$ MeV) with momentum $${p}$ MeV/$c$, the de Broglie wavelength is ______ fm (three significant figures). Use $hc = 1239.84$ MeV fm.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.005).toPrecision(2), m, p, ask,
          sol: ask === 'phase'
            ? R`$E = \sqrt{(pc)^2 + (mc^2)^2} = \sqrt{${p}^2 + ${m}^2} = ${+E.toPrecision(5)}$ MeV. $v_\text{phase} = E/p = ${+ans.toPrecision(3)}c$ (always above $c$; the group velocity is $c^2/v_\text{phase}$).`
            : R`$\lambda = h/p = hc/(pc) = 1239.84/${p} = ${+ans.toPrecision(3)}$ fm. The mass does not enter once the momentum is given.`,
          trap: ask === 'phase' ? 'Use the total energy, rest energy included.' : 'lambda = h/p holds relativistically; only the link between p and energy changes.' };
      },
      verify: (p) => (p.ask === 'phase' ? Math.sqrt(p.p * p.p + p.m * p.m) / p.p : HC / p.p) },
    { id: 'netrq-r4g2', type: 'nat', level: 4, exams: ['net'], sub: 'traces',
      make(r) {
        const v = () => [int(r, 1, 4), int(r, -2, 2), int(r, -2, 2), int(r, -2, 2)];
        const a = v(), b = v(), cc = v(), d = v();
        const t = 4 * (dot(a, b) * dot(cc, d) - dot(a, cc) * dot(b, d) + dot(a, d) * dot(b, cc));
        return { q: R`With metric $(+,-,-,-)$ and contravariant four-vectors $a = ${vec(a)}$, $b = ${vec(b)}$, $c = ${vec(cc)}$, $d = ${vec(d)}$, the trace $\text{Tr}(\not a\,\not b\,\not c\,\not d)$ equals ______.`,
          answer: t, tol: 0, a, b, cc, d,
          sol: R`$\text{Tr}(\not a\not b\not c\not d) = 4[(a\cdot b)(c\cdot d) - (a\cdot c)(b\cdot d) + (a\cdot d)(b\cdot c)]$. Here $a\cdot b = ${dot(a, b)}$, $c\cdot d = ${dot(cc, d)}$, $a\cdot c = ${dot(a, cc)}$, $b\cdot d = ${dot(b, d)}$, $a\cdot d = ${dot(a, d)}$, $b\cdot c = ${dot(b, cc)}$. So the trace is $4[${dot(a, b) * dot(cc, d)} - (${dot(a, cc) * dot(b, d)}) + (${dot(a, d) * dot(b, cc)})] = ${t}$.`,
          trap: 'The middle pairing (a.c)(b.d) enters with a minus sign; dot products use the minus signs of the metric.' };
      },
      verify: (p) => tr(mm(mm(slash(p.a), slash(p.b)), mm(slash(p.cc), slash(p.d)))) },
    { id: 'netrq-r4g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'anomalous moment',
      make(r) {
        const [name, a, m] = choose(r, [['electron', 1.15965e-3, 9.1093837e-31], ['muon', 1.16592e-3, 1.8835316e-28]]);
        const B = pick(r, 0.1, 5, 0.05);
        const f = a * E_CH * B / m / (2 * Math.PI);
        const unit = name === 'electron' ? 'MHz' : 'kHz', sc = name === 'electron' ? 1e6 : 1e3;
        return { q: R`${name === 'electron' ? 'An' : 'A'} ${name} circulates in a uniform field $B = ${B}$ T (no electric field). Its spin turns relative to its momentum at $\omega_a = a\,eB/m$, with $a = ${a}$ and $m = ${fmt(m, 5)}$ kg. The frequency $\omega_a/2\pi$ is ______ ${unit} (three significant figures).`,
          answer: +(f / sc).toPrecision(3), tol: +(f / sc * 0.005).toPrecision(2), unit, a, m, B, sc,
          sol: R`$eB/m = ${fmt(E_CH * B / m, 4)}$ s$^{-1}$ (the cyclotron frequency). Multiply by $a$ and divide by $2\pi$: $${+(f / sc).toPrecision(3)}$ ${unit}. Only the anomaly $a = (g - 2)/2$ makes the spin drift relative to the momentum.`,
          trap: 'Without the factor a you get the cyclotron frequency itself.' };
      },
      verify: (p) => p.a * E_CH * p.B / p.m / (2 * Math.PI) / p.sc },
  ],
};
