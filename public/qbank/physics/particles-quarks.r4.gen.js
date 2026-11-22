// Round 4 extras for particles-quarks: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const MP = 0.938272;   // GeV
const sig3 = (x) => +x.toPrecision(3);
const pstar = (M, a, b) => Math.sqrt((M * M - (a + b) ** 2) * (M * M - (a - b) ** 2)) / (2 * M);
const BEAMS = [['proton', 0.938272], ['positive pion', 0.13957], ['electron', 0.000511], ['negative kaon', 0.493677]];
const DECAYS = [[R`K^+ \to \pi^+\pi^0`, 493.677, 139.570, 134.977], [R`K^0_S \to \pi^+\pi^-`, 497.611, 139.570, 139.570], [R`\Sigma^+ \to p\,\pi^0`, 1189.37, 938.272, 134.977],
  [R`\Xi^- \to \Lambda\,\pi^-`, 1321.71, 1115.683, 139.570], [R`D^0 \to K^-\pi^+`, 1864.84, 493.677, 139.570], [R`\phi \to K^+K^-`, 1019.461, 493.677, 493.677], [R`\Omega^- \to \Lambda K^-`, 1672.45, 1115.683, 493.677]];
const LIVES = [[R`K^0_S`, 0.497611, 2.6844, 'cm', 1], [R`\Lambda`, 1.115683, 7.89, 'cm', 1], [R`B^+`, 5.27934, 0.04911, 'mm', 10], [R`D^0`, 1.86484, 0.01229, 'mm', 10],
  [R`\pi^+`, 0.13957, 780.45, 'm', 0.01], [R`\mu^+`, 0.105658, 65864, 'm', 0.01]];

export default {
  items: [
    { id: 'pqk-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'force carriers',
      q: R`Which force carrier is electrically neutral, massless and itself carries colour charge?`,
      options: [R`the photon`, R`the $Z^0$`, R`the $W^\pm$`, R`the gluon`], answer: 3,
      sol: R`Gluons carry the strong force between quarks. They are massless and neutral, but unlike the photon they carry colour (a colour and an anticolour), so gluons interact with each other. The photon is massless but colourless; $W$ and $Z$ are heavy ($80$ and $91$ GeV$/c^2$).`,
      trap: R`Choosing the photon: it is neutral and massless but does not carry the charge it couples to.` },
    { id: 'pqk-r4-02', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'lepton number',
      q: R`The electron lepton number $L_e$ of a positron is`,
      options: [R`$+1$`, R`$-1$`, R`$0$`, R`$+\tfrac12$`], answer: 1,
      sol: R`Particles in the electron family ($e^-$, $\nu_e$) have $L_e = +1$; their antiparticles ($e^+$, $\bar\nu_e$) have $L_e = -1$. That is why $\beta^+$ decay emits $e^+$ together with $\nu_e$: the total stays $0$.`,
      trap: R`Mixing up lepton number with electric charge or with spin.` },
    { id: 'pqk-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'widths and lifetimes',
      q: R`The $Z^0$ boson has a total width $\Gamma = 2.495$ GeV. With $\hbar = 6.582\times10^{-25}$ GeV s, its mean life is ______ $\times10^{-25}$ s (two decimal places).`,
      answer: 2.64, tol: 0.01, unit: 's', calc: () => 6.582 / 2.495,
      sol: R`$\tau = \hbar/\Gamma = 6.582\times10^{-25}/2.495 = 2.64\times10^{-25}$ s. Moving at nearly light speed it would travel only about $10^{-16}$ m before decaying, so the $Z$ is seen only through its decay products, as a peak in their invariant mass.`,
      trap: R`Using $h$ instead of $\hbar$, which makes the lifetime $2\pi$ times too long.` },
    { id: 'pqk-r4-04', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'classification',
      q: R`Which of these particles is a fermion?`,
      options: [R`$\pi^0$`, R`$J/\psi$`, R`$\Omega^-$`, R`the photon`], answer: 2,
      sol: R`Fermions have half-integer spin. The $\Omega^-$ is a baryon ($sss$) with spin $\tfrac32$. Mesons such as $\pi^0$ (spin 0) and $J/\psi$ (spin 1) are quark-antiquark pairs with integer spin, and the photon has spin 1.`,
      trap: R`Thinking "made of quarks" means fermion; an even number of quarks and antiquarks makes a boson.` },
    { id: 'pqk-r4-05', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      q: R`Which of these are MESONS that contain a charm quark or a charm antiquark?`,
      options: [R`$D^0$`, R`$J/\psi$`, R`$\Lambda_c^+$`, R`$K^+$`], answer: [0, 1],
      sol: R`$D^0 = c\bar u$ (open charm). $J/\psi = c\bar c$ (hidden charm, total charm zero but it does contain a charm quark and antiquark). $\Lambda_c^+ = udc$ contains charm but is a baryon. $K^+ = u\bar s$ has strangeness, not charm.`,
      trap: R`Leaving out the $J/\psi$ because its net charm quantum number is zero.` },
    { id: 'pqk-r4-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'decay kinematics',
      q: R`A $K^+$ ($493.68$ MeV) at rest decays to $\pi^+\pi^0$ ($139.57$ and $134.98$ MeV). The momentum of each pion is ______ MeV$/c$ (one decimal place).`,
      answer: 205.1, tol: 0.3, unit: 'MeV/c', calc: () => Math.sqrt((493.68 ** 2 - (139.57 + 134.98) ** 2) * (493.68 ** 2 - (139.57 - 134.98) ** 2)) / (2 * 493.68),
      sol: R`For $M \to m_1 + m_2$ at rest, $p^* = \dfrac{\sqrt{[M^2 - (m_1 + m_2)^2][M^2 - (m_1 - m_2)^2]}}{2M}$. Here $M^2 - (274.55)^2 = 243\,720 - 75\,378 = 168\,342$ and $M^2 - (4.59)^2 = 243\,699$, so $p^* = \dfrac{\sqrt{168\,342\times243\,699}}{987.36} = \dfrac{202\,548}{987.36} = 205.1$ MeV$/c$. (The $\pi^+$ then has total energy $248.1$ MeV.)`,
      trap: R`Sharing the kinetic energy equally between the pions; equal momenta, not equal energies, follow from momentum conservation.` },
    { id: 'pqk-r4-07', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'interactions',
      q: R`The $\pi^0$ lives about $8.5\times10^{-17}$ s, while the $\pi^\pm$ live about $2.6\times10^{-8}$ s. The main reason for this huge difference is that`,
      options: [R`the $\pi^0$ can decay electromagnetically into two photons, while a charged pion, the lightest charged hadron, can only decay weakly`, R`the $\pi^0$ is heavier and so has more phase space`, R`the charged pions are protected by charge conservation from any decay`, R`the $\pi^0$ decays strongly`], answer: 0,
      sol: R`No lighter hadron exists, so no pion can decay strongly. The neutral pion can turn into $\gamma\gamma$ through the electromagnetic interaction. A charged pion cannot decay into photons alone (charge must be carried off by a charged particle), and the lightest charged particles it can reach are leptons, which needs the weak interaction ($\pi^+ \to \mu^+\nu_\mu$). The mass difference of $4.6$ MeV matters little.`,
      trap: R`Thinking the $\pi^0$ decays strongly; strong decays need lighter hadrons in the final state.` },
    { id: 'pqk-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'decay kinematics',
      q: R`In muon decay at rest, $\mu^- \to e^-\bar\nu_e\nu_\mu$ (massless neutrinos, $m_\mu c^2 = 105.658$ MeV, $m_ec^2 = 0.511$ MeV), the largest possible total energy of the electron is ______ MeV (two decimal places).`,
      answer: 52.83, tol: 0.02, unit: 'MeV', calc: () => (105.658 ** 2 + 0.511 ** 2) / (2 * 105.658),
      sol: R`The electron is most energetic when both neutrinos fly off together opposite to it, acting like one massless particle. That is a two-body decay into the electron and a massless system: $E_e = \dfrac{m_\mu^2 + m_e^2}{2m_\mu}c^2 = \dfrac{105.658^2 + 0.511^2}{211.316} = 52.83$ MeV, essentially half the muon mass. The electron spectrum is continuous up to this edge, which was used to measure the Michel parameters.`,
      trap: R`Giving the electron the whole muon energy minus its own mass; the neutrinos must carry away momentum equal to the electron's.` },
    { id: 'pqk-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'weak interaction',
      q: R`Which of these processes involve exchange of a $W$ boson at lowest order?`,
      options: [R`$n \to p\,e^-\bar\nu_e$`, R`$\pi^+ \to \mu^+\nu_\mu$`, R`$e^+e^- \to \mu^+\mu^-$`, R`$\bar\nu_ee^- \to \bar\nu_ee^-$`], answer: [0, 1, 3],
      sol: R`Neutron decay ($d \to uW^-$, $W^- \to e^-\bar\nu_e$) and pion decay ($u\bar d$ annihilating into $W^+$) are charged-current processes. $e^+e^- \to \mu^+\mu^-$ goes through a photon or a $Z$, never a $W$, because the final leptons are of a different family. In $\bar\nu_ee^-$ scattering the electron and antineutrino can annihilate into a $W^-$ (which turns back into $e^-\bar\nu_e$), besides $Z$ exchange; with muon neutrinos only the $Z$ would contribute.`,
      trap: R`Assuming every neutrino-electron scattering is neutral-current only; for $\bar\nu_e$ and $\nu_e$ a $W$ diagram exists too.` },
    { id: 'pqk-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'flavour physics',
      q: R`In 1970, before charm was discovered, Glashow, Iliopoulos and Maiani proposed a fourth quark. The observation it was mainly invented to explain is`,
      options: [R`the narrow width of the $J/\psi$`, R`the existence of three colours`, R`the value of the Cabibbo angle`, R`the strong suppression of flavour-changing neutral-current decays such as $K_L \to \mu^+\mu^-$`], answer: 3,
      sol: R`With only $u$, $d$ and $s$, the $W$ couples $u$ to $d\cos\theta_C + s\sin\theta_C$, and box diagrams with a $u$ quark predict $K_L \to \mu^+\mu^-$ far more often than seen. A charm quark coupling to the orthogonal combination $-d\sin\theta_C + s\cos\theta_C$ gives diagrams that cancel the $u$ ones (exactly if $m_c = m_u$), so these decays are suppressed. The size of the remaining effect even pointed to $m_c \approx 1.5$ GeV, before the $J/\psi$ was found in 1974.`,
      trap: R`Attributing charm to the $J/\psi$ discovery; the theoretical reason came four years earlier.` },
  ],
  gens: [
    { id: 'pqk-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'invariant mass',
      make(r) {
        const [nm, m] = choose(r, BEAMS), E = choose(r, [10, 20, 50, 120, 400, 800, 1000]), s = m * m + MP * MP + 2 * E * MP, ans = Math.sqrt(s);
        return { q: R`${nm === 'electron' ? 'An' : 'A'} ${nm} beam of total energy $${E}$ GeV hits protons at rest (rest energies: proton $0.938272$ GeV, beam particle $${m}$ GeV). The centre-of-mass energy $\sqrt s$ is ______ GeV (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), m, E,
          sol: R`$s = m_b^2 + m_p^2 + 2E_bm_p$ (in units with $c = 1$) $= ${round(m * m, 6)} + 0.880354 + 2\times${E}\times0.938272 = ${round(s, 3)}$ GeV$^2$, so $\sqrt s = ${sig3(ans)}$ GeV. At high energy $\sqrt s\approx\sqrt{2E_bm_p}$ grows only as the square root of the beam energy, which is why colliders replaced fixed targets.`,
          trap: R`Adding the beam energy and the target mass, $E_b + m_p$, as if the products could be at rest.` };
      },
      verify: (p) => Math.sqrt(p.m * p.m + MP * MP + 2 * p.E * MP) },
    { id: 'pqk-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'decay kinematics',
      make(r) {
        const [t, M, a, b] = choose(r, DECAYS), ans = pstar(M, a, b);
        return { q: R`In the decay $${t}$ of a particle at rest (masses $${M}$, $${a}$ and $${b}$ MeV$/c^2$), each product carries momentum ______ MeV$/c$ (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), M, a, b,
          sol: R`$p^* = \dfrac{\sqrt{[M^2 - (m_1 + m_2)^2][M^2 - (m_1 - m_2)^2]}}{2M} = \dfrac{\sqrt{${round(M * M - (a + b) ** 2, 0)}\times${round(M * M - (a - b) ** 2, 0)}}}{${round(2 * M, 2)}} = ${sig3(ans)}$ MeV$/c$.`,
          trap: R`Splitting the released kinetic energy equally between the two products.` };
      },
      verify: (p) => pstar(p.M, p.a, p.b) },
    { id: 'pqk-r4g3', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'time dilation',
      make(r) {
        const [nm, m, ct, unit, f] = choose(r, LIVES), p = choose(r, [1, 2, 5, 10, 20, 50]), L = p / m * ct * f;
        return { q: R`A $${nm}$ (rest energy $${m}$ GeV, $c\tau = ${ct}$ cm) is produced with momentum $${p}$ GeV$/c$. Its mean decay length in the lab is ______ ${unit} (three significant figures).`,
          answer: sig3(L), tol: sig3(L * 0.005), m, ct, f, p,
          sol: R`The mean decay length is $\beta\gamma c\tau$ with $\beta\gamma = p/mc = ${p}/${m} = ${sig3(p / m)}$. So $L = ${sig3(p / m)}\times${ct}$ cm $= ${sig3(L)}$ ${unit}.`,
          trap: R`Using $\gamma$ alone or forgetting the time dilation entirely ($L = c\tau$).` };
      },
      verify: (p) => p.p / p.m * p.ct * p.f },
  ],
};
