---
title: 'Biotechnology: principles and processes'
seoTitle: 'Biotechnology principles and processes: NEET biology'
summary: 'The principles of genetic engineering, restriction enzymes and their naming, palindromes and sticky ends, gel electrophoresis, cloning vectors (ori, selectable markers, pBR322, insertional inactivation, blue-white screening), making hosts competent, isolating DNA, PCR, bioreactors and downstream processing, with the counts and traps NEET asks most.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'In the name EcoRI, the letter "R" stands for:'
    choices: ['restriction', 'the strain RY13', 'recombinant', 'the order of discovery']
    ans: 1
    why: 'E = genus Escherichia, co = species coli, R = strain RY13, I = the first enzyme found in that strain (Roman numeral order).'
  - q: 'During gel electrophoresis DNA fragments move towards the:'
    choices: ['cathode, because DNA is positive', 'anode, because DNA is negative', 'anode, because DNA is positive', 'centre of the gel']
    ans: 1
    why: 'The phosphate backbone makes DNA negatively charged, so it moves towards the positive electrode (anode). Smaller fragments move farther.'
  - q: 'If a foreign gene is inserted into the tetracycline resistance gene of pBR322, recombinant cells will:'
    choices: ['grow on both ampicillin and tetracycline', 'grow on ampicillin but not on tetracycline', 'grow on tetracycline but not on ampicillin', 'grow on neither']
    ans: 1
    why: 'The insert breaks the tetR gene (insertional inactivation) but leaves ampR working. Recombinants survive ampicillin and die on tetracycline.'
sources:
  - 'NCERT Biology Class 12 (2023 rationalised), chapter Biotechnology: principles and processes: topics followed, no text copied'
  - 'National Medical Commission, NEET (UG) syllabus: Biotechnology and its applications https://www.nmc.org.in'
  - 'Cohen S. N., Chang A. C. Y., Boyer H. W., Helling R. B. (1973), Construction of biologically functional bacterial plasmids in vitro, PNAS 70(11), 3240-3244 https://doi.org/10.1073/pnas.70.11.3240'
  - 'Saiki R. K. et al. (1988), Primer-directed enzymatic amplification of DNA with a thermostable DNA polymerase, Science 239(4839), 487-491 https://doi.org/10.1126/science.2448875'
---

**Biology · Class 12 · about 32 minutes.** By the end you will be able to explain how a gene is cut, joined into a vector, put into a host and copied, choose the right selection method, solve PCR and restriction counting problems, and describe how a recombinant product is made on a large scale.

<div class="bigidea">Genetic engineering is cut, paste and copy for DNA. Restriction enzymes are the scissors, ligase is the glue, a plasmid is the carrier that a cell will copy, and the host cell is the photocopier. PCR copies a gene without any cell at all.</div>

## 1. The principles

Modern biotechnology rests on two techniques: **genetic engineering** (changing DNA or RNA and putting it into a host to change its traits) and **bioprocess engineering** (keeping sterile conditions so only the wanted microbe grows, in large amounts). A piece of DNA alone cannot copy itself in a new cell; it must join a sequence that starts replication, the **origin of replication (ori)**.

The first recombinant DNA was made in **1972 by Stanley Cohen and Herbert Boyer**: they joined an antibiotic resistance gene into a plasmid of *Salmonella typhimurium* and put it into *E. coli*, where it was copied. The three basic steps of any genetic engineering: **find the DNA with the wanted gene; move it into a host; keep and transfer it to the host's progeny**.

## 2. Tools: restriction enzymes

In 1963 two enzymes that stop virus growth in *E. coli* were found; one cut DNA. These are **restriction endonucleases**, and the first was **Hind II**, which always cuts at a particular six base-pair sequence (its **recognition sequence**). More than 900 are now known from over 230 strains of bacteria.

**Naming**: In EcoRI, **E** is the genus *Escherichia*, **co** the species *coli*, **R** the strain RY13 and **I** means the first enzyme found in it. The genus gives a capital letter, the species two small letters, then the strain, then a Roman numeral for the order of discovery.

**Nucleases**: **exonucleases** remove nucleotides from the ends; **endonucleases** cut inside. A restriction endonuclease reads the length of DNA and cuts both strands at its recognition site, which is a **palindrome**: the sequence reads the same on both strands when read in the same direction (5′ → 3′):

top strand 5′-GAATTC-3′, bottom strand 3′-CTTAAG-5′ (read 5′ → 3′, the bottom strand is also GAATTC).

EcoRI cuts between G and A on each strand, a little away from the centre, leaving short single-stranded overhangs called **sticky ends**. Because any DNA cut by the same enzyme has matching sticky ends, a gene and a vector cut with the same enzyme stick together by hydrogen bonds, and **DNA ligase** seals the backbone.

<div class="problem" data-problem="btp-site"></div>

<div class="problem" data-problem="btp-fragments"></div>

## 3. Gel electrophoresis

Cut DNA is separated by **agarose gel electrophoresis**. Agarose is a natural polymer from sea weeds. DNA is negatively charged, so in an electric field it moves towards the **anode**; the gel acts as a sieve, so **smaller fragments move farther**. The DNA is invisible until stained with **ethidium bromide** and lit with **UV light**, when bands glow bright orange. The wanted band is cut out of the gel and extracted (**elution**), then used to make recombinant DNA.

## 4. Cloning vectors

Plasmids and bacteriophages copy themselves inside bacteria independently of the chromosome, so a gene joined to them is copied with them. A good vector needs:

1. **ori**: where replication starts; it also controls the **copy number**, so a high-copy vector gives many copies of the gene.
2. **Selectable marker**: a gene that lets only transformed cells grow, usually **antibiotic resistance** (ampicillin, chloramphenicol, tetracycline or kanamycin). Normal *E. coli* resists none of these.
3. **Cloning sites**: preferably a single recognition site for each enzyme used, so the vector is cut in only one place. In **pBR322**, BamH I and Sal I sites lie in the tetracycline resistance gene (tetR), Pvu I and Pst I in the ampicillin resistance gene (ampR); ori and *rop* (a gene for proteins that take part in replication) are also present.
4. **Small size**.

**Insertional inactivation.** If a gene is inserted into tetR, the tetracycline resistance is lost. Plate the cells on ampicillin (all transformed cells grow), then copy to tetracycline: recombinants are the colonies that grew on ampicillin but not on tetracycline. Because this needs two plates, a simpler method uses the **β-galactosidase (lacZ) gene** as the cloning site: with a chromogenic substrate, colonies with an intact gene turn **blue**; recombinants, whose gene is broken by the insert, stay **white**. This is **blue-white screening**.

<div class="myth">

**"In blue-white screening the blue colonies carry the gene."** Blue means β-galactosidase still works, so nothing was inserted. White colonies are the recombinants.

</div>

**Vectors for plants and animals.** *Agrobacterium tumefaciens* naturally puts a piece of DNA (T-DNA) from its **Ti plasmid** into plant cells, causing tumours. Disarmed Ti plasmids, no longer harmful, are used to carry genes into plants. **Retroviruses**, disarmed, carry genes into animal cells.

## 5. Making the host take up DNA

DNA is charged and cannot easily pass through cell membranes, so hosts must be made **competent**:

- Treat bacteria with a **divalent cation**, usually **calcium**, then incubate the cells with the DNA on ice, give a brief **heat shock at 42 °C**, and return to ice.
- **Microinjection**: inject DNA directly into an animal cell nucleus.
- **Biolistics (gene gun)**: shoot microparticles of gold or tungsten coated with DNA into plant cells.
- **Disarmed pathogen vectors**: let them infect the cell to deliver the DNA.

## 6. The process step by step

<div class="steps" data-ms="8000">
<div class="step"><b>1. Isolate the DNA.</b> Break the cell with enzymes: <b>lysozyme</b> (bacteria), <b>cellulase</b> (plant), <b>chitinase</b> (fungus). Remove RNA with <b>ribonuclease</b> and proteins with <b>protease</b>. Add chilled ethanol: purified DNA precipitates as fine threads that can be spooled out.</div>
<div class="step"><b>2. Cut it.</b> Incubate purified DNA with a restriction enzyme at the right conditions; check the cutting by agarose gel electrophoresis. Cut the vector with the same enzyme.</div>
<div class="step"><b>3. Amplify the gene by PCR</b> (polymerase chain reaction). Two short <b>primers</b> (chemically made oligonucleotides) bind on either side of the target; a heat-stable DNA polymerase extends them. Repeated cycles copy the gene about a billion times.</div>
<div class="step"><b>4. Ligate and insert.</b> Join the gene to the vector with DNA ligase and transform a competent host. Select transformants on an antibiotic plate.</div>
<div class="step"><b>5. Get the product.</b> A protein coded by a foreign gene and made in a host is a <b>recombinant protein</b>. The cells are grown in large volumes in a bioreactor, and the product is collected and purified.</div>
</div>

## 7. PCR in detail

Each PCR cycle has three steps: **denaturation** (about 94 °C, strands separate), **annealing** (cooler, primers bind), **extension** (polymerase copies from each primer). The enzyme is **Taq polymerase** from the bacterium *Thermus aquaticus*, which lives in hot springs and stays active at the high temperatures used to separate strands. Each cycle doubles the DNA.

<figure class="fig" data-fig="pcr-cycles"><figcaption>PCR copies on a log scale: n cycles give start × 2ⁿ copies (ideal). The strip shows the three temperatures of one cycle.</figcaption></figure>

<div class="problem" data-problem="btp-pcr"></div>

## 8. Bioreactors and downstream processing

Small cultures cannot make enough product, so cells are grown in **bioreactors** of 100 to 1000 litres or more. A bioreactor gives the best conditions for growth: temperature, pH, substrate, salts, vitamins and oxygen. The most common is the **stirred-tank** type: a cylinder with a curved base and a stirrer that mixes the contents and spreads oxygen; air may also be bubbled in (**sparged**). It has an agitator, oxygen delivery, foam control, temperature and pH control, and sampling ports. In a **continuous culture**, used medium is drained from one side while fresh medium is added from the other, keeping cells in their active log phase for longer and giving more product.

After growth, the product goes through **downstream processing**: **separation and purification**, then **formulation** with suitable preservatives. For medicines, strict **quality control** and **clinical trials** follow. Each product needs its own process.

<div class="meaning">
<dl>
<dt>Palindrome</dt><dd>a DNA sequence that reads the same 5′ → 3′ on both strands, e.g. GAATTC</dd>
<dt>Sticky ends</dt><dd>single-stranded overhangs left by a staggered cut; they pair with matching ends</dd>
<dt>ori, marker, cloning site</dt><dd>start of copying, gene to select transformants, unique place to insert the gene</dd>
<dt>Competent cell</dt><dd>a host made able to take up DNA (Ca²⁺ and heat shock)</dd>
<dt>Downstream processing</dt><dd>separation, purification and formulation of the product</dd>
<dt>Physical meaning</dt><dd>Sticky ends are like puzzle pieces cut by the same die: any two pieces cut by one enzyme fit together.</dd>
</dl>
</div>

<div class="keypoints">

- Two pillars: genetic engineering and bioprocess engineering; first rDNA by Cohen and Boyer (1972).
- Restriction endonucleases cut at palindromes; Hind II first; EcoRI = *E. coli* RY13, enzyme I; sticky ends joined by ligase.
- Gel: agarose, DNA to the anode, small fragments go farthest, ethidium bromide + UV, elution.
- Vector needs ori (copy number), selectable marker, unique cloning sites, small size; pBR322: BamH I and Sal I in tetR, Pvu I and Pst I in ampR.
- Insertional inactivation; blue-white screening (white = recombinant).
- Ti plasmid of *Agrobacterium* for plants, disarmed retroviruses for animals.
- Competence: Ca²⁺, ice, 42 °C heat shock; microinjection; gene gun.
- Isolation: lysozyme, cellulase, chitinase; RNase, protease; chilled ethanol.
- PCR: denature, anneal, extend; Taq polymerase; start × 2ⁿ.
- Stirred-tank bioreactors; downstream processing: separation, purification, formulation, quality control.

</div>
