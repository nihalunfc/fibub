---
title: Amines
seoTitle: 'Amines Class 12 notes with animations'
summary: 'Class 12 amines: classification, naming, preparation, basic strength, Hinsberg and carbylamine tests, aniline reactions and diazonium salts, with live problems.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'Which amine is the strongest base in water?'
    choices: ['NH₃', 'CH₃NH₂', '(CH₃)₂NH', 'C₆H₅NH₂']
    ans: 2
    why: 'Dimethylamine (pKb 3.27) has two electron-pushing methyl groups and is still well solvated. Aniline is far weaker (pKb 9.4) because its lone pair is delocalised into the ring.'
  - q: 'Hofmann bromamide degradation of propanamide (CH₃CH₂CONH₂) gives:'
    choices: ['propan-1-amine', 'ethanamine', 'propanoic acid', 'N-methylethanamine']
    ans: 1
    why: 'The carbonyl carbon is lost as carbonate, so the amine has one carbon fewer: ethanamine, CH₃CH₂NH₂.'
  - q: 'A cold solution of benzenediazonium chloride is warmed to room temperature in water. The main product is:'
    choices: ['benzene', 'phenol', 'chlorobenzene', 'aniline']
    ans: 1
    why: 'Above about 283 K the diazonium ion reacts with water: ArN₂⁺ + H₂O → ArOH + N₂ + H⁺.'
sources:
  - 'NCERT Class 12 Chemistry, Chapter 9 “Amines” (topic list only; all text, figures and questions here are original fibub work)'
  - 'pKb values of amines in water at 298 K: CRC Handbook of Chemistry and Physics, 97th edition, “Dissociation constants of organic bases”'
  - 'Reaction conditions and mechanisms: Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, chapters 8, 23 and 22'
  - 'Basicity trend in water against gas phase: Aue, Webb and Bowers, Journal of the American Chemical Society 98 (1976) 311 to 317'
---

**Chemistry · Class 12 · Chapter 9 · about 80 minutes.** By the end you will be able to classify and name amines, choose a method to prepare each class, rank amines by basic strength, predict the products of their main reactions including the Hinsberg and carbylamine tests, and use benzenediazonium salts to build other aromatic compounds.

<div class="bigidea">An amine is ammonia with carbon groups in place of hydrogens. Everything starts with the lone pair on nitrogen: it makes an amine a base (it grabs H⁺), a nucleophile (it attacks carbon), and its availability explains why some amines are strong bases and aniline, whose lone pair is shared with the ring, is weak. The aromatic amine aniline then gives diazonium salts, the doorway to dozens of ring compounds.</div>

## 1. Structure, classification and naming

The nitrogen of an amine is sp³ with a lone pair, so the shape is pyramidal (C–N–C about 108°). An amine **inverts** like an umbrella in a blur, so the two mirror forms cannot be separated.

<figure class="fig" data-fig="@chem-amine-inversion"><figcaption>The nitrogen flips through a flat state about ten billion times per second. This is why simple amines with three different groups are not found as separate mirror-image forms.</figcaption></figure>

**Classification: by the number of carbon groups on nitrogen** (different from alcohols, where it is the carbon that is counted). One group: **primary (1°)**, RNH₂. Two: **secondary (2°)**, R₂NH. Three: **tertiary (3°)**, R₃N. Four carbons and a positive charge give a **quaternary ammonium salt**.

<figure class="fig" data-fig="c12c-amine-class"><figcaption>Choose an amine. Count the carbon groups on N to read off 1°, 2°, 3° (or quaternary). Notice aniline (N on the ring) and phenylmethanamine (N on a CH₂) are both primary but behave very differently.</figcaption></figure>

**Naming.** Aliphatic amines: replace the “e” of the alkane by **“amine”** (propan-1-amine, propan-2-amine). For 2° and 3° amines, use the longest chain as the parent and **N-** for the other groups: CH₃NHCH₂CH₃ is N-methylethanamine; (CH₃)₃N is N,N-dimethylmethanamine. Aromatic: **benzenamine (aniline)**, with ring groups numbered from the carbon with NH₂ (4-methylaniline, p-toluidine). Common names to know: methylamine, ethylamine, aniline, benzylamine (phenylmethanamine).

Count and draw all the isomers of C₃H₉N or C₄H₁₁N with this tool; there are four and eight respectively:

<!--fig:tool isomer-explorer-->

You can also name any chain with the [IUPAC namer](/learn/carbon-chain-namer/).

## 2. Preparation of amines

1. **Reduction of nitro compounds.** Ar–NO₂ + H₂/Pd (or Sn + HCl, Fe + HCl) gives Ar–NH₂. This is how aniline is made from nitrobenzene. Fe/HCl is preferred in industry because only a little HCl is needed.
2. **Ammonolysis of alkyl halides.** R–X + NH₃ gives RNH₂, but each product is a better nucleophile than NH₃ and keeps reacting. You get a **mixture** of 1°, 2°, 3° amines and the quaternary salt. A big excess of ammonia gives mainly the primary amine:

<figure class="fig" data-fig="c12c-amine-ammonolysis"><figcaption>Slide the amount of NH₃ per mole of alkyl halide. With little ammonia you get a mixture and more of the higher amines; with a big excess, mostly the primary amine. (The model uses assumed relative rates to show the trend.)</figcaption></figure>

3. **Reduction of nitriles:** R–C≡N + LiAlH₄ (or H₂/Ni) gives R–CH₂–NH₂. The amine has **one more carbon** than the halide the nitrile came from (R–X → R–CN).
4. **Reduction of amides:** RCONH₂ + LiAlH₄ gives RCH₂NH₂ (same number of carbons).
5. **Gabriel phthalimide synthesis:** potassium phthalimide + R–X, then hydrolysis with NaOH, gives a **pure primary aliphatic amine**. The phthalimide has only one N–H, so only one R group can be added. It does **not** work for aniline (aryl halides do not react by this route).
6. **Hofmann bromamide degradation:** an amide + Br₂ + NaOH gives the primary amine with **one carbon less**, `$\text{RCONH}_2 + \text{Br}_2 + 4\,\text{NaOH} \to \text{RNH}_2 + \text{Na}_2\text{CO}_3 + 2\,\text{NaBr} + 2\,\text{H}_2\text{O}$`.

<div class="steps" data-fig="c12c-amine-hofmann">
<div class="step"><b>Start.</b> Propanamide: three carbons.</div>
<div class="step"><b>N-bromination.</b> Br₂ in base replaces an N–H hydrogen.</div>
<div class="step"><b>Base removes the other N–H.</b> A bromamide anion forms.</div>
<div class="step"><b>The group R migrates</b> from carbon to nitrogen as Br⁻ leaves: an isocyanate.</div>
<div class="step"><b>Water adds</b> to the isocyanate, giving a carbamate.</div>
<div class="step"><b>CO₂ is lost</b> (as carbonate in base): the amine with one carbon fewer remains.</div>
</div>

<div class="problem" data-problem="c12c-amine-hofmann"></div>

<div class="myth">

**“Hofmann degradation and Gabriel synthesis give the same amine.”** In Gabriel synthesis the amine has the **same** carbon chain as R–X. In Hofmann it has **one carbon fewer** than the amide. Choosing between them (or the nitrile route, which adds one carbon) is a common board question.

</div>

## 3. Physical properties

The lowest amines are gases with a fishy smell; higher amines are liquids; aniline is a colourless oil that turns brown in air. Primary and secondary amines form hydrogen bonds (N–H···N) and so boil higher than alkanes of similar mass, but **lower than alcohols**, since N is less electronegative than O. Isomers boil in the order **1° > 2° > 3°** because more N–H bonds mean more hydrogen bonding. The first few amines dissolve in water (they hydrogen-bond to it); solubility falls as the carbon part grows, and aniline is only slightly soluble.

## 4. Basic character

Amines are bases: R–NH₂ + H₂O ⇌ R–NH₃⁺ + OH⁻. A **smaller pKb means a stronger base**, and the conjugate acid has pKa = 14 − pKb. Three effects decide strength: the **+I effect** of alkyl groups (pushes electrons onto N: stronger), **solvation** of the ammonium ion by water (more N–H bonds: more stable ion), and **steric crowding** around the nitrogen. In an aryl amine the lone pair is delocalised into the ring (a resonance effect), so it is less available:

<div class="steps" data-fig="c12c-amine-resonance">
<div class="step"><b>Aniline.</b> N has a lone pair next to the ring.</div>
<div class="step"><b>The lone pair joins the ring</b> and spreads out.</div>
<div class="step"><b>Charge on an ortho carbon.</b></div>
<div class="step"><b>Charge on the para carbon.</b></div>
<div class="step"><b>Meaning:</b> weaker base, and a ring that is rich in electrons at the ortho and para carbons.</div>
</div>

Rank the amines in each series and see how much of each is protonated at the pH you choose:

<figure class="fig" data-fig="c12c-amine-basicity"><figcaption>Switch the series and slide the pH. In water the order for the methyl series is (CH₃)₂NH > CH₃NH₂ > (CH₃)₃N > NH₃, and for the ethyl series (C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃. Aryl amines are far weaker bases; –NO₂ on the ring weakens them further and –CH₃ strengthens them slightly.</figcaption></figure>

<div class="meaning">

<dl>
<dt>pKb</dt><dd>−log K_b for the reaction B + H₂O ⇌ BH⁺ + OH⁻. Smaller pKb, stronger base.</dd>
<dt>pKa of BH⁺</dt><dd>14 − pKb. A large pKa of the ammonium ion means the amine holds on to its H⁺.</dd>
<dt>% protonated</dt><dd>at a given pH, 1/(1 + 10^(pH − pKa)) × 100.</dd>
</dl>

</div>

<div class="problem" data-problem="c12c-amine-ph"></div>

<div class="problem" data-problem="c12c-amine-prot"></div>

<div class="myth">

**“Tertiary amines are the strongest bases because they have three alkyl groups.”** That is true in the gas phase. In water the ammonium ion R₃NH⁺ has only one N–H to hydrogen-bond to water, and the three groups crowd the nitrogen, so the 3° amine falls behind the 2° amine.

</div>

## 5. Reactions of amines

1. **Salt formation:** RNH₂ + HCl → RNH₃⁺Cl⁻ (soluble in water). Adding NaOH frees the amine again. This is how an amine is separated from neutral organic compounds.
2. **Alkylation:** with R–X the amine becomes a 2° and then a 3° amine and the quaternary salt. **Acylation:** with acid chlorides or anhydrides (and a base like pyridine to remove HCl) gives **amides**, only for 1° and 2° amines. Aniline gives **acetanilide**, ArNHCOCH₃.
3. **Carbylamine reaction (isocyanide test):** only **primary** amines (aliphatic and aromatic) heated with chloroform and alcoholic KOH give a foul-smelling **isocyanide** (R–N≡C).
4. **Reaction with benzenesulphonyl chloride, the Hinsberg test,** tells the three classes apart:

<div class="steps" data-fig="c12c-amine-hinsberg">
<div class="step"><b>Three amines, one reagent.</b> Choose a class below the picture.</div>
<div class="step"><b>Shake with C₆H₅SO₂Cl in NaOH.</b> 1° dissolves (N–H remains), 2° gives a precipitate (no N–H), 3° does not react.</div>
<div class="step"><b>Acidify.</b> The 1° product precipitates; the 2° one stays; the 3° amine dissolves as a salt.</div>
</div>

5. **Electrophilic substitution of aniline.** –NH₂ is a very strong activator and directs ortho and para. Aniline with **bromine water** gives a white precipitate of **2,4,6-tribromoaniline** at once. To make only the mono product, protect the amine by acetylation first (acetanilide is less activated, because its lone pair is also pulled towards C=O) and hydrolyse afterwards. **Nitration** of aniline directly in acid gives a lot of meta product, because the –NH₃⁺ ion that forms in strong acid is meta-directing, and the acid also oxidises the amine; so it is nitrated as acetanilide. **Sulphonation** gives sulphanilic acid, which exists as a zwitterion. Aniline does not undergo Friedel–Crafts reactions because it forms a salt with AlCl₃.

<div class="myth">

**Beyond the syllabus (extension, check your school's list).** Reaction with **nitrous acid** (NaNO₂ + HCl): primary aliphatic amines give an alcohol and N₂ at once; secondary amines give N-nitroso compounds; tertiary amines give a salt. Only the aromatic primary case, which gives a diazonium salt, is needed for the next section.

</div>

## 6. Diazonium salts

An aromatic primary amine reacts with sodium nitrite and HCl (which make nitrous acid) at **273 to 278 K** to form a **diazonium salt**: `$\text{C}_6\text{H}_5\text{NH}_2 + \text{NaNO}_2 + 2\,\text{HCl} \to \text{C}_6\text{H}_5\text{N}_2^+\text{Cl}^- + \text{NaCl} + 2\,\text{H}_2\text{O}$`. It must be kept cold (an ice bath) and used at once: above about 283 K it reacts with water to give phenol. Aromatic diazonium salts are stable enough to use in cold solution because the positive charge is shared with the ring; aliphatic ones break up instantly.

The group –N₂⁺ is an excellent leaving group (N₂ gas), so it can be replaced by almost anything. This is the **great use** of diazonium salts: a nitro group on the ring is reduced to NH₂, then to N₂⁺, then swapped for Cl, Br, CN, I, F, H or OH.

<figure class="fig" data-fig="c12c-amine-diazo"><figcaption>Pick a reagent. The left ring is the diazonium ion; the right ring shows the product. N₂ gas bubbles away in every replacement reaction. In coupling with phenol or aniline the N₂ group stays and links two rings: an azo dye.</figcaption></figure>

| Reagent | Product | Name |
|---|---|---|
| CuCl/HCl, CuBr/HBr | ArCl, ArBr | Sandmeyer reaction (Cu powder instead of Cu(I) salt: Gattermann) |
| CuCN/KCN | ArCN | Sandmeyer; hydrolysis gives ArCOOH |
| KI | ArI | no copper needed |
| HBF₄, then heat | ArF | Balz–Schiemann |
| H₃PO₂ (or ethanol) | ArH | removes the NH₂ group after it has done its job |
| H₂O, warm | ArOH | phenol |
| Phenol/NaOH, aniline | ArN=NAr′ | coupling: azo dyes |

<div class="problem" data-problem="c12c-amine-sandmeyer"></div>

<div class="problem" data-problem="c12c-amine-nano2"></div>

**Coupling.** The diazonium ion is a weak **electrophile** and attacks the activated para position of phenol (in alkaline solution, as phenoxide) or aniline (in slightly acidic solution). The product has an –N=N– link between two rings, and the long conjugated system absorbs visible light: **azo dyes** (orange, yellow, red), used for textiles and in indicators such as methyl orange.

**Importance in synthesis.** Direct reactions of benzene cannot put –I, –F, –CN or –OH where wanted. The diazonium route can. It is also how a group is put into a ring in a position that is otherwise hard to reach: to make m-bromotoluene, for example, you use a nitro group to direct the substitution and then replace it.

Map the connections between all these compounds:

<!--fig:tool organic-reaction-map-->

<div class="history">

- **1858** Peter Griess discovers diazonium salts while working on dyes.
- **1881** August Hofmann reports the degradation of amides by bromine and alkali.
- **1884** Traugott Sandmeyer finds the copper-catalysed replacement reactions.
- **1887** Siegmund Gabriel publishes the phthalimide route to primary amines.

</div>

<div class="keypoints">

- Amine classes: 1° RNH₂, 2° R₂NH, 3° R₃N (count carbon groups on N). Names: -amine, N- prefixes; aniline = benzenamine.
- Preparation: reduction of nitro compounds, nitriles (adds a C) and amides; ammonolysis (mixture); Gabriel (pure 1° aliphatic only); Hofmann (one carbon fewer).
- Boiling points: 1° > 2° > 3° for isomers; lower than alcohols. Lower amines dissolve in water.
- Basic strength in water: (CH₃)₂NH > CH₃NH₂ > (CH₃)₃N > NH₃; (C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃; aryl amines are much weaker (lone pair delocalised).
- Tests: carbylamine (1° only, foul isocyanide); Hinsberg (1° dissolves in NaOH, 2° insoluble, 3° no reaction). Acylation with RCOCl gives amides.
- Aniline: ortho/para activated; Br₂ water gives 2,4,6-tribromoaniline; acetylate to control reactions; no Friedel–Crafts.
- Diazonium salts: aromatic 1° amine + NaNO₂/HCl at 273 to 278 K. Replace N₂ with Cl, Br, CN (Cu), I (KI), F (HBF₄), H (H₃PO₂), OH (warm water). Coupling with phenol or aniline gives azo dyes.

</div>

Going further for JEE/NEET: Hinsberg and carbylamine tests, named reactions and basicity ranking are in [Amines (JEE)](/learn/courses/engineering-entrance/amines/).
