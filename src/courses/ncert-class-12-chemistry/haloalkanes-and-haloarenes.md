---
title: Haloalkanes and Haloarenes
seoTitle: 'Haloalkanes and Haloarenes Class 12 notes, SN1 and SN2'
summary: 'Class 12 Haloalkanes and Haloarenes: naming, preparation, SN1 and SN2 animations, chirality, elimination and why haloarenes are unreactive, with live problems.'
minutes: 85
updated: 2026-11-22
quiz:
  - q: 'Which haloalkane reacts fastest with aqueous KOH by the SN1 mechanism?'
    choices: ['CH₃CH₂CH₂Br', '(CH₃)₂CHBr', '(CH₃)₃CBr', 'CH₃Br']
    ans: 2
    why: 'SN1 goes through a carbocation, and the tertiary carbocation (CH₃)₃C⁺ is the most stable of these, so tert-butyl bromide ionises fastest.'
  - q: 'When an optically active haloalkane reacts by SN2 at the stereocentre, the product:'
    choices: ['has the same configuration', 'has the inverted configuration', 'is a racemic mixture', 'is achiral']
    ans: 1
    why: 'The nucleophile attacks from the side opposite the leaving group, so the three other groups flip like an umbrella: Walden inversion.'
  - q: 'Chlorobenzene is much less reactive than chloroethane toward nucleophilic substitution mainly because:'
    choices: ['the C–Cl bond in chlorobenzene is on an sp² carbon and has partial double bond character', 'chlorobenzene has no dipole', 'benzene is not aromatic', 'Cl is a poor leaving group in all cases']
    ans: 0
    why: 'The lone pair of Cl overlaps with the ring (resonance) and the carbon is sp², so the C–Cl bond is shorter and stronger. Also the nucleophile must approach a crowded, electron-rich ring.'
sources:
  - 'NCERT Class 12 Chemistry, Chapter 6 “Haloalkanes and Haloarenes” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Bond lengths, enthalpies, dipole moments and boiling points: CRC Handbook of Chemistry and Physics, 97th edition'
  - 'SN1, SN2 and elimination: Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, chapters 17 and 19'
  - 'Elimination product ratios: Brown, H. C. and Wheeler, O. H. (1956), Journal of the American Chemical Society 78, 2199 (2-bromobutane with ethoxide)'
---

**Chemistry · Class 12 · Chapter 6 · about 85 minutes.** By the end you will be able to classify and name haloalkanes and haloarenes, prepare them, explain SN1 and SN2 (including inversion and racemisation), predict substitution against elimination, and say why haloarenes behave differently.

<div class="bigidea">A carbon–halogen bond is polar: the carbon is slightly positive and the halogen slightly negative. A nucleophile attacks the positive carbon and pushes the halogen out as a leaving group. How it happens (in one step, or in two steps through a carbocation) decides the speed, the 3D result and which molecules react best. A base can instead pull off a hydrogen next door and make an alkene.</div>

## 1. Classification and naming

A **haloalkane** has a halogen on an sp³ carbon of an alkyl group (R–X); a **haloarene** has it on an sp² carbon of an aromatic ring (Ar–X). Count the halogens: mono-, di-, tri- and polyhalogen compounds. **Dihalides** are geminal (both on the same carbon) or vicinal (on neighbouring carbons).

Haloalkanes are further sorted by the carbon that holds X: **primary** (1°, one carbon group on it), **secondary** (2°), **tertiary** (3°). The halogen can also sit next to a double bond or a ring:

- **allylic**: X on an sp³ carbon next to C=C (CH₂=CH–CH₂Cl);
- **benzylic**: X on an sp³ carbon next to a benzene ring (C₆H₅CH₂Cl);
- **vinylic**: X on an sp² carbon of C=C (CH₂=CHCl);
- **aryl**: X on a ring carbon (chlorobenzene).

<figure class="fig" data-fig="c12c-halo-classify"><figcaption>Pick a compound to see the carbon that bears the halogen (the α carbon), its hybridisation and how reactive it is. Allylic and benzylic halides are the most reactive; vinylic and aryl halides the least.</figcaption></figure>

**Naming.** In the IUPAC system a haloalkane is an alkane with a halo substituent: CH₃CH₂CHBrCH₃ is 2-bromobutane, (CH₃)₃CCl is 2-chloro-2-methylpropane. Number from the end that gives the lowest numbers to all substituents, and list them alphabetically. Haloarenes use ortho (1,2), meta (1,3) and para (1,4) in common names (p-chlorotoluene) or numbers in IUPAC names (1-chloro-4-methylbenzene). Common names for the small ones: CH₃Cl methyl chloride, CHCl₃ chloroform, CHI₃ iodoform.

<div class="problem" data-problem="c12c-halo-isomc"></div>

## 2. The nature of the C–X bond

Halogens are more electronegative than carbon, so the bond is polar, C(δ+)–X(δ−). Down the group (F, Cl, Br, I) the halogen atom gets larger, so the C–X bond gets **longer and weaker**. That is why iodides are the most reactive in substitution and fluorides the least.

<figure class="fig" data-fig="c12c-halo-cx"><figcaption>Slide through the halogens. The molecule is drawn to scale for bond length. The bond enthalpy falls from C–F (452 kJ/mol) to C–I (234 kJ/mol). Dipole moment does not follow the same order, because charge falls while distance rises.</figcaption></figure>

## 3. Methods of preparation

**From alcohols** (the usual lab route): ROH + HX with ZnCl₂ for chlorides (the Lucas reagent), red P + X₂ (for bromides and iodides), or **thionyl chloride, SOCl₂**, which is the best because the by-products SO₂ and HCl are gases and the pure chloride is left behind: `$\text{R–OH} + \text{SOCl}_2 \rightarrow \text{R–Cl} + \text{SO}_2 + \text{HCl}$`. Tertiary alcohols react fastest with HX, primary slowest, because the mechanism goes through a carbocation.

**From alkenes**: HX adds across C=C following **Markovnikov's rule** (H goes to the carbon with more H, X to the carbon with fewer): propene + HBr gives 2-bromopropane. X₂ adds to give vicinal dihalides (the test for unsaturation with bromine water).

**From alkanes by free radical halogenation.** In light or at high temperature, chlorine replaces H of an alkane. It is a **chain reaction**:

<div class="steps" data-fig="c12c-halo-radical">
<div class="step">Initiation: light breaks the weak Cl–Cl bond into two chlorine atoms, each with an unpaired electron (radicals).</div>
<div class="step">Propagation 1: a Cl· pulls a hydrogen off methane, giving HCl and a methyl radical CH₃·.</div>
<div class="step">Propagation 2: the methyl radical takes a Cl from Cl₂, giving CH₃Cl and a new Cl·.</div>
<div class="step">The new Cl· starts step 1 again, so the chain goes round and round: one photon can make thousands of molecules.</div>
<div class="step">Termination: two radicals meet and join (Cl· + Cl·, CH₃· + CH₃·, CH₃· + Cl·), which ends that chain. Since CH₃Cl still has H atoms, CH₂Cl₂, CHCl₃ and CCl₄ also form: this is a poor way to make one pure compound.</div>
</div>

**Halogen exchange.** The **Finkelstein reaction** makes iodides: RCl or RBr with NaI in dry acetone, `$\text{R–Cl} + \text{NaI} \rightarrow \text{R–I} + \text{NaCl}\downarrow$`. NaCl and NaBr do not dissolve in acetone and precipitate, which pulls the reaction forward. The **Swarts reaction** makes fluorides: heating a chloride or bromide with AgF, Hg₂F₂, CoF₂ or SbF₃.

**Haloarenes** are made by **electrophilic substitution** of the ring (benzene + Cl₂ with FeCl₃ gives chlorobenzene; a methyl-substituted ring gives a mix of ortho and para products), and from a diazonium salt: ArN₂⁺Cl⁻ with Cu₂Cl₂/HCl (**Sandmeyer**) or Cu/HCl (**Gattermann**) gives ArCl, with KI gives ArI; iodination and fluorination of the ring directly do not work well, so these routes matter.

## 4. Physical properties

Haloalkanes are colourless liquids (a few gases) with sweet smells. Their boiling points are much higher than those of alkanes of similar mass, because the polar C–X bond adds dipole–dipole attraction to the van der Waals forces. For the same alkyl group the boiling point rises from RF to RI (bigger, more polarisable halogen); for the same halogen it rises with chain length and falls with branching (a compact molecule has less surface in contact with its neighbours).

<figure class="fig" data-fig="c12c-halo-bp"><figcaption>Boiling points of n-alkyl halides against chain length, and of the four butyl bromides. Switch the view and slide the carbon count.</figcaption></figure>

They are only very slightly soluble in water: to dissolve, a haloalkane would have to break hydrogen bonds between water molecules and make only weaker haloalkane–water attractions in return. They dissolve readily in organic solvents. Their densities rise with the mass of the halogen (bromides and iodides are denser than water and sink).

## 5. Chemical reactions of haloalkanes

### 5.1 Nucleophilic substitution

A **nucleophile** (Nu⁻, an electron-rich group) replaces the halide: `$\text{R–X} + \text{Nu}^- \rightarrow \text{R–Nu} + \text{X}^-$`. The common ones:

| Reagent | Product |
|---|---|
| aqueous KOH | alcohol, R–OH |
| sodium alkoxide, R′ONa | ether, R–OR′ (Williamson) |
| KCN (alcoholic) | nitrile R–CN |
| AgCN | isocyanide R–NC (N is the donor; ionic CN⁻ attacks through C, covalent AgCN through N) |
| KNO₂ / AgNO₂ | nitrite R–ONO / nitroalkane R–NO₂ |
| NH₃ (excess) | amine R–NH₂ |

Two mechanisms are possible.

### 5.2 The SN2 mechanism

SN2 means substitution, nucleophilic, **bimolecular**: the nucleophile and the haloalkane both take part in the one slow step, so the rate depends on both: `$\text{rate} = k[\text{RX}][\text{Nu}^-]$` (second order). The nucleophile attacks from the side opposite the leaving group (**back-side attack**), the bonds change at the same time, and the three other groups on carbon flip over like an umbrella in the wind. The result is **inversion of configuration** (Walden inversion).

<div class="steps" data-fig="c12c-halo-sn2steps">
<div class="step">(R)-2-bromobutane and OH⁻. The carbon is tetrahedral and Br is on the right; the three other groups point away from Br.</div>
<div class="step">OH⁻ approaches from the side opposite to Br (back-side attack), where it meets the least repulsion from the leaving group.</div>
<div class="step">Transition state: the carbon is partly bonded to both OH and Br. The three other groups lie in one plane, like an umbrella blown flat. This is the top of the energy hump. There is no intermediate.</div>
<div class="step">C–Br breaks completely and Br⁻ leaves; the three groups flip towards the Br side.</div>
<div class="step">The product, (S)-butan-2-ol, has the opposite spatial arrangement: inversion. The profile shows one hump only.</div>
</div>

Crowded carbons block the back-side approach, so SN2 speed follows **methyl > primary > secondary >> tertiary**. It prefers a strong nucleophile and a polar aprotic solvent such as acetone.

### 5.3 The SN1 mechanism

SN1 means substitution, nucleophilic, **unimolecular**. The slow step involves only the haloalkane, which ionises on its own to a **carbocation**; the nucleophile joins in a fast second step: `$\text{rate} = k[\text{RX}]$` (first order). The carbocation is flat (sp²), so the nucleophile can attack either face with equal chance.

<div class="steps" data-fig="c12c-halo-sn1steps">
<div class="step">A tertiary halide R₃C–Br in water. The carbon is tetrahedral.</div>
<div class="step">Slow step: the C–Br bond breaks without any help from the nucleophile, and Br⁻ leaves. This is the highest hump and the rate-determining step.</div>
<div class="step">The carbocation R₃C⁺ is planar, with an empty p orbital above and below. It sits in the valley between the two humps.</div>
<div class="step">Fast step: water attacks the flat cation from the top or from the bottom face with equal probability.</div>
<div class="step">Two products, one from each face. If the original halide was chiral the two alcohols are mirror images in equal amounts: a 50 : 50 racemic mixture (racemisation).</div>
</div>

SN1 is fastest for the carbocation that is most stable: **tertiary > secondary > primary**, and allylic and benzylic cations are especially stable. It is helped by a polar protic solvent (water, alcohol) that stabilises the ions.

<figure class="fig" data-fig="c12c-halo-kinetics"><figcaption>Switch between SN2 and SN1 and change the concentrations. For SN2 the reaction events track [RX] × [Nu⁻]; for SN1 only [RX] matters, whatever you do to the nucleophile.</figcaption></figure>

<div class="problem" data-problem="c12c-halo-rate2"></div>

<div class="problem" data-problem="c12c-halo-rate1"></div>

Compare the two mechanisms side by side:

<!--fig:tool sn1-sn2-->

<div class="myth">

**“SN1 is faster than SN2, so tertiary halides always react faster.”** Neither mechanism is faster in general. Tertiary halides react fastest by SN1 (stable cation) but **cannot** do SN2 at all (blocked). Primary halides react by SN2 and hardly at all by SN1. Secondary halides are in between and can use both.

</div>

### 5.4 Stereochemistry: chirality, retention, inversion, racemisation

A carbon with four **different** groups is a **stereocentre** (chiral centre, marked C*). The molecule is **chiral**: its mirror image cannot be superimposed on it. The two forms, **enantiomers**, have identical physical properties except that they rotate plane-polarised light in opposite directions: dextrorotatory (+) turns right, laevorotatory (−) turns left. A 50 : 50 mixture of the two is a **racemic mixture** and shows no rotation because the effects cancel. Do not confuse (+) or (−) with the R and S labels, which come from the priorities of the groups and not from the rotation.

<figure class="fig" data-fig="c12c-halo-mirror"><figcaption>Choose a compound and drag to turn. The model and its mirror image fit on each other only when two groups on the carbon are the same.</figcaption></figure>

<div class="problem" data-problem="c12c-halo-stereo"></div>

What happens to the 3D arrangement depends on the mechanism: **inversion** in SN2 (back-side attack), **racemisation** in SN1 (flat cation, attack on both faces), and **retention** when the bond to the stereocentre is never broken (for example when an alcohol is first turned into a tosylate, a step that does not touch the stereocentre). Check configurations with the R/S checker:

<!--fig:tool chirality-checker-->

<div class="problem" data-problem="c12c-halo-ee"></div>

### 5.5 Substitution or elimination?

A nucleophile attacks carbon. But many nucleophiles are also **bases**, and a base can instead remove a hydrogen from the carbon next to the C–X carbon (the β carbon), pushing out X⁻ and forming a C=C bond: **elimination** (dehydrohalogenation).

```math
\text{CH}_3\text{CH}_2\text{CHBrCH}_3 + \text{KOH(alc.)} \xrightarrow{\text{heat}} \text{CH}_3\text{CH=CHCH}_3 + \text{KBr} + \text{H}_2\text{O}
```

**Saytzeff's rule:** when two alkenes are possible, the **more substituted** (more stable) alkene is the major product. With 2-bromobutane about 80 % is but-2-ene and 20 % but-1-ene.

<figure class="fig" data-fig="c12c-halo-elim"><figcaption>Choose a haloalkane and see the β carbons, the H that is lost and the alkenes. The more substituted alkene is the major product even if the other β carbon has more hydrogens.</figcaption></figure>

<div class="problem" data-problem="c12c-halo-mass"></div>

The conditions decide the outcome: **aqueous KOH** (a lot of water, which solvates and weakens the base) favours substitution to the alcohol; **alcoholic KOH** and heat favour elimination to the alkene. Tertiary halides eliminate most easily; primary halides substitute most easily.

<figure class="fig" data-fig="c12c-halo-chooser"><figcaption>Choose the type of haloalkane and the reagent to see which path (SN2, SN1 or elimination) is most likely. The bars are rules of thumb, not measured yields.</figcaption></figure>

### 5.6 Reaction with metals

With magnesium in dry ether, a haloalkane gives a **Grignard reagent**: `$\text{R–Br} + \text{Mg} \xrightarrow{\text{dry ether}} \text{R–MgBr}$`. The carbon of the C–Mg bond is negative, which makes it a strong nucleophile and a strong base, so it reacts with water to give the alkane (the moisture must be excluded): `$\text{R–MgBr} + \text{H}_2\text{O} \rightarrow \text{R–H} + \text{Mg(OH)Br}$`. It is the most important use of haloalkanes in building carbon chains.

## 6. Haloarenes

### 6.1 Why they are less reactive

Chlorobenzene hardly reacts with aqueous NaOH at room temperature, though chloroethane does. Three reasons: (1) **resonance**: a lone pair on Cl overlaps with the ring π system, giving the C–Cl bond a partial double bond character, so it is shorter (169 pm against 177 pm in chloroethane) and stronger; (2) the carbon is **sp²**, which holds its bonding electrons closer than sp³ does; (3) the cation needed for SN1 (a phenyl cation) is very unstable, and back-side attack for SN2 is blocked by the ring itself.

### 6.2 Nucleophilic substitution made easier

Strong conditions work: chlorobenzene with NaOH at 623 K and 300 atm, then acid, gives phenol. Electron-withdrawing **nitro groups at the ortho and para positions** speed it up greatly. The nucleophile adds to the ring and makes an intermediate with a negative charge, shared (by resonance) between the ortho and para carbons; a nitro group on one of those carbons takes up the charge and stabilises it.

<figure class="fig" data-fig="c12c-halo-nas"><figcaption>Add nitro groups and watch the temperature needed fall from 623 K to room temperature. The pulsing dots mark where the negative charge sits.</figcaption></figure>

A nitro group in the **meta** position cannot take up the charge in this way and has little effect.

### 6.3 Electrophilic substitution

Haloarenes undergo the usual ring reactions: halogenation (Cl₂/FeCl₃), nitration (HNO₃/H₂SO₄), sulphonation and Friedel–Crafts. The halogen is **deactivating** (it withdraws electrons through the sigma bond, so the ring reacts more slowly than benzene) but **ortho, para-directing** (its lone pair helps stabilise the intermediate when the attack is at the ortho or para position). Nitration of chlorobenzene gives mostly the para isomer (the ortho position is more crowded) with some ortho.

<div class="history">

<ul class="timeline">
<li><b>1835</b> Henri Regnault makes vinyl chloride; PVC follows (about 1912).</li>
<li><b>1900</b> Victor Grignard discovers the organomagnesium reagents that now carry his name (Nobel Prize in Chemistry, 1912).</li>
<li><b>1896</b> Paul Walden shows that a reaction can turn a compound into the mirror image of itself: the Walden inversion.</li>
<li><b>1935</b> Edward Hughes and Christopher Ingold name SN1 and SN2 and explain them with rate laws and stereochemistry.</li>
<li><b>1928–1930</b> Thomas Midgley develops the Freon refrigerants; their ozone damage is discovered in the 1970s.</li>
</ul>

</div>

<div class="history">

**Beyond the syllabus (not examined in Class 12 boards).** The Wurtz reaction (2 RX + 2 Na in dry ether gives R–R), the Wurtz–Fittig and Fittig reactions of haloarenes, and the section on polyhalogen compounds (dichloromethane, chloroform, iodoform, carbon tetrachloride, freons and DDT, with their uses and environmental effects) were removed in the rationalisation. Good to know: chloroform was an early anaesthetic but is a hazard; freons (CFCs) thin the ozone layer and were phased out under the Montreal Protocol; DDT built up in food chains and was banned for farm use in India, though it is still used for mosquito control against malaria in some areas under strict control.

</div>

<div class="keypoints">

- Classes: alkyl (1°, 2°, 3°), allylic, benzylic (sp³ C–X, reactive), vinylic and aryl (sp² C–X, unreactive). Naming: halo substituent, alphabetical, lowest numbers.
- C–X is polar; going F → I the bond gets longer and weaker (452 → 234 kJ/mol) and the leaving ability improves. Boiling point: RF < RCl < RBr < RI; falls with branching.
- Preparation: ROH + SOCl₂ (best), HX/ZnCl₂; alkene + HX (Markovnikov); radical chlorination (a mixture); Finkelstein (NaI/acetone), Swarts (AgF); haloarenes by ring substitution or via diazonium (Sandmeyer, Gattermann).
- SN2: one step, rate = k[RX][Nu⁻], inversion, methyl > 1° > 2° >> 3°, strong Nu, aprotic solvent. SN1: two steps, rate = k[RX], carbocation, racemisation, 3° > 2° > 1°, polar protic solvent.
- Stereocentre = four different groups; enantiomers rotate light oppositely; racemic mixture = 50 : 50, no rotation.
- Elimination (alcoholic KOH, heat) follows Saytzeff: the more substituted alkene is major. Aqueous KOH: substitution.
- RX + Mg (dry ether) gives the Grignard reagent RMgX, a strong base and nucleophile.
- Haloarenes: resonance and sp² carbon make C–Cl strong; ortho/para NO₂ makes nucleophilic substitution easier (623 K → 298 K); halogens are deactivating but ortho, para-directing.

</div>

Going further for JEE/NEET: reactivity orders, solvent effects, rearranging carbocations and named reactions are in [Haloalkanes and haloarenes (JEE)](/learn/courses/engineering-entrance/haloalkanes-haloarenes/). The [Organic reaction map](/learn/organic-reaction-map/) connects these reactions to the rest of organic chemistry.
