---
title: 'Amines and diazonium salts'
seoTitle: 'Amines and diazonium salts: JEE and NEET chemistry'
summary: 'Classes and names of amines, preparation (reduction, Gabriel, Hofmann bromamide), basicity in water and gas phase, aniline versus aliphatic amines, reactions (alkylation, acylation, carbylamine, nitrous acid, Hinsberg), electrophilic substitution in aniline, diazonium salts with Sandmeyer, Gattermann and coupling reactions, from basics to JEE Advanced depth.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'Which is the strongest base in water?'
    choices: ['NH₃', 'CH₃NH₂', '(CH₃)₂NH', '(CH₃)₃N']
    ans: 2
    why: 'In water, dimethylamine wins: two methyl groups push electrons onto N, and its ion can still form two hydrogen bonds with water. Trimethylamine''s ion has only one N-H, so it is less stabilised by solvation.'
  - q: 'The carbylamine test (CHCl₃ + alcoholic KOH, foul smell) is given by:'
    choices: ['primary amines only', 'secondary amines only', 'tertiary amines only', 'all amines']
    ans: 0
    why: 'Only a primary amine, R-NH₂, has the two N-H hydrogens needed to form an isocyanide R-NC (the foul smell).'
  - q: 'The Hofmann bromamide reaction converts CH₃CH₂CONH₂ into:'
    choices: ['CH₃CH₂CH₂NH₂', 'CH₃CH₂NH₂', 'CH₃CH₂COOH', 'CH₃CH₂CN']
    ans: 1
    why: 'Br₂ and NaOH remove the carbonyl carbon as CO₃²⁻: the amine has one carbon fewer than the amide. Propanamide gives ethanamine.'
sources:
  - 'NEET (UG), JEE Main and JEE Advanced 2026 syllabi: Amines (organic compounds containing nitrogen)'
  - 'pKb values of amines in water at 25 °C: CRC Handbook of Chemistry and Physics, 97th edition'
  - 'IUPAC Nomenclature of Organic Chemistry, Recommendations 2013 https://iupac.org/what-we-do/books/bluebook/'
---

**Chemistry · Class 12 · about 36 minutes.** By the end you will be able to name and make amines, rank them by basicity, tell 1°, 2° and 3° amines apart with tests, control substitution in aniline, and use diazonium salts to put almost any group on a benzene ring.

<div class="bigidea">An amine is ammonia with carbon groups in place of hydrogens. The lone pair on nitrogen is the whole story: it takes H⁺ (basicity), attacks carbon (nucleophile), and, in aniline, leaks into the ring, making the ring very reactive and the amine a much weaker base. Turn the NH₂ into N₂⁺ and you get a group that leaves as nitrogen gas, so you can swap it for almost anything.</div>

## 1. Classes, names and structure

Primary (1°) R-NH₂, secondary (2°) R₂NH, tertiary (3°) R₃N; quaternary ammonium salts R₄N⁺X⁻. Names: methanamine CH₃NH₂, N-methylmethanamine (CH₃)₂NH, N,N-dimethylmethanamine (CH₃)₃N, benzenamine (aniline) C₆H₅NH₂, N-methylaniline. Nitrogen is sp³ with a pyramidal shape (C-N-C angle about 108° in trimethylamine).

1° and 2° amines form hydrogen bonds (weaker than in alcohols, since N is less electronegative than O), so they boil above alkanes but below alcohols of similar mass. 3° amines have no N-H and boil lowest among isomeric amines. Small amines dissolve in water; aniline only slightly.

## 2. Making amines

- **Reduce nitro compounds:** Fe/HCl (preferred industrially, since FeCl₂ formed is hydrolysed to regenerate HCl), Sn/HCl, or H₂/Pd. Nitrobenzene → aniline.
- **Ammonolysis of alkyl halides:** R-X + NH₃ gives a mixture of 1°, 2°, 3° amines and the quaternary salt (each amine formed is itself a nucleophile). Excess NH₃ favours the 1° amine.
- **Reduce nitriles** (LiAlH₄ or H₂/Ni, **Mendius reduction**) → R-CH₂NH₂, one carbon more than the halide used. **Reduce amides** (LiAlH₄) → amines with the same carbons.
- **Gabriel phthalimide synthesis:** potassium phthalimide + R-X, then hydrolysis → **pure 1° amine**. It fails for aryl amines (aryl halides do not do SN2).
- **Hofmann bromamide degradation:** RCONH₂ + Br₂ + 4NaOH → R-NH₂ + Na₂CO₃ + 2NaBr + 2H₂O, one carbon fewer.

## 3. Basicity

Basicity is how readily the N lone pair takes H⁺. **pKb** measures it: lower pKb, stronger base.

- **Alkyl groups push electrons** onto N (+I effect), so in the gas phase basicity rises 3° > 2° > 1° > NH₃.
- **In water**, the ammonium ion is stabilised by hydrogen bonds to water, more N-H, more stabilisation. Crowding also matters. The result: (CH₃)₂NH > CH₃NH₂ > (CH₃)₃N > NH₃, and (C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃.
- **Aryl amines are much weaker bases**: in aniline the lone pair is shared with the ring by resonance, and the anilinium ion has no such resonance. Electron-withdrawing groups (NO₂, Cl) on the ring weaken it further; electron-donating ones (CH₃, OCH₃ at para) strengthen it a little.

<figure class="fig" data-fig="amine-basicity"><figcaption>A pKb ladder: stronger bases at the top. Pick an amine to see how it compares with ammonia and why. Switch to Gas phase to see the order without water.</figcaption></figure>

<div class="meaning">
<dl>
<dt>pKb</dt><dd>−log Kb for B + H₂O ⇌ BH⁺ + OH⁻; lower pKb, stronger base; pKb + pKa(BH⁺) = 14</dd>
<dt>1°, 2°, 3°</dt><dd>one, two or three carbon groups on nitrogen (not on the carbon, as in alcohols)</dd>
<dt>ArN₂⁺</dt><dd>arenediazonium ion; N₂ is an excellent leaving group</dd>
<dt>+I, +R, −R</dt><dd>electron push by induction or resonance, or pull by resonance</dd>
<dt>Physical meaning</dt><dd>A base is only as strong as its lone pair is available. Anything that shares it (a ring) or crowds the ion (no solvation) weakens the base.</dd>
</dl>
</div>

<div class="problem" data-problem="am-ph"></div>

<div class="myth">

**"More alkyl groups always mean a stronger base, so trimethylamine beats dimethylamine in water."** That is true only in the gas phase. In water, the ions need hydrogen bonds to be stable, and (CH₃)₃NH⁺ has just one N-H, so trimethylamine falls behind both dimethylamine and methylamine.

</div>

**Try it:** let the nitrogen flip, then switch to the quaternary ammonium ion and the strained N-chloro aziridine.

<figure class="fig" data-fig="@chem-amine-inversion"><figcaption>A simple amine flips through a flat state about 10¹⁰ times a second, so its two mirror-image pyramids cannot be separated even with three different groups on N. A quaternary ammonium ion has no lone pair to flip, so such an ion can be chiral.</figcaption></figure>

## 4. Reactions of amines

- **Salt formation:** with acids, amines give ammonium salts (anilinium chloride), which dissolve in water; NaOH sets the amine free again.
- **Alkylation:** with R-X, up to quaternary salts. **Acylation:** with acid chlorides or anhydrides (pyridine as base) → amides. 1° and 2° amines react, 3° do not. Acetanilide is aniline with its reactivity tamed.
- **Carbylamine reaction:** 1° amines (aliphatic and aromatic) with CHCl₃ and alcoholic KOH give **isocyanides**, with a foul smell. Test for 1° amines.
- **Nitrous acid** (NaNO₂ + HCl, cold): 1° aliphatic amines give alcohols and **N₂ gas** (the diazonium ion breaks up at once); 1° aromatic amines at 273 to 278 K give stable **diazonium salts**; 2° amines give yellow oily **N-nitrosoamines**; 3° aliphatic amines just form salts.
- **Hinsberg test** with benzenesulphonyl chloride C₆H₅SO₂Cl: 1° amine gives a sulphonamide that **dissolves in KOH** (it still has an acidic N-H); 2° gives one **insoluble in KOH** (no N-H left); 3° does not react.

<div class="problem" data-problem="am-kjeldahl"></div>

## 5. Electrophilic substitution in aniline

The NH₂ group strongly activates the ring and directs ortho and para.

- **Bromine water** gives a white precipitate of **2,4,6-tribromoaniline** at once. To get only 4-bromoaniline, first **acetylate** (acetanilide is less activating, since the N lone pair is also shared with C=O), brominate, then hydrolyse.
- **Nitration** with the nitrating mixture gives a lot of **meta** product (about 47%) plus tarry oxidation products, because in strong acid aniline becomes the anilinium ion, which is meta-directing. Protecting the group by acetylation gives mainly p-nitroaniline.
- **Sulphonation** gives sulphanilic acid (4-aminobenzenesulphonic acid), which exists as a **zwitterion**.
- Aniline does **not** undergo Friedel-Crafts reactions: the NH₂ lone pair binds the AlCl₃ catalyst, and the ring is deactivated.

<div class="problem" data-problem="am-acetanilide"></div>

## 6. Diazonium salts

Made by **diazotisation**: ArNH₂ + NaNO₂ + 2HCl at 273 to 278 K → ArN₂⁺Cl⁻. Aryl diazonium salts are stable only in the cold (the ring delocalises the positive charge); alkyl ones break up immediately.

**Replacing N₂** (the N₂ leaves as gas):

| Reagent | Product | Name |
|---|---|---|
| CuCl/HCl, CuBr/HBr, CuCN/KCN | Ar-Cl, Ar-Br, Ar-CN | Sandmeyer |
| Cu powder with HCl or HBr | Ar-Cl, Ar-Br | Gattermann |
| KI | Ar-I | (no catalyst) |
| HBF₄, then heat | Ar-F | Balz-Schiemann |
| H₃PO₂ or ethanol | Ar-H | reduction (removes the NH₂ trace) |
| warm water | Ar-OH | hydrolysis |

**Coupling (N₂ kept):** the diazonium ion is a weak electrophile that attacks activated rings at the para position, giving brightly coloured **azo dyes**: with phenol in alkali, **p-hydroxyazobenzene** (orange); with aniline in mild acid, **p-aminoazobenzene** (aniline yellow).

<div class="myth">

**"Diazonium salts can be made from any primary amine."** Only aryl diazonium salts are stable enough to use, and only below about 5 °C. An aliphatic amine with nitrous acid loses N₂ at once and gives a mixture of alcohols and alkenes. That fizz of nitrogen is in fact a test for 1° aliphatic amines.

</div>

<div class="keypoints">

- Make amines by reducing nitro, nitrile or amide groups; Gabriel gives pure 1° aliphatic amines; Hofmann bromamide loses one carbon.
- Basicity in water: (CH₃)₂NH > CH₃NH₂ > (CH₃)₃N > NH₃ > aniline; gas phase follows the +I order.
- Aniline is weak because its lone pair is shared with the ring; o/p electron-withdrawing groups weaken it further.
- Tests: carbylamine (1°), Hinsberg (1° soluble in KOH, 2° insoluble, 3° no reaction), nitrous acid (N₂ from 1° aliphatic).
- Aniline: tribromoaniline with bromine water; protect as acetanilide for mono-substitution; meta product in nitration; no Friedel-Crafts.
- Diazonium: Sandmeyer (Cu(I) salts), Gattermann (Cu), KI, HBF₄, H₃PO₂, water; coupling at para gives azo dyes.

</div>
