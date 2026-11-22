---
title: 'Biotechnology: Principles and Processes'
seoTitle: 'Biotechnology Principles Class 12 notes: rDNA, PCR'
summary: 'Class 12 Biotechnology: Principles and Processes with animations: restriction enzymes, vectors, competent hosts, PCR, gel electrophoresis and bioreactors.'
minutes: 85
updated: 2026-11-22
quiz:
  - q: 'The enzyme EcoRI cuts DNA at the sequence 5′-GAATTC-3′. A circular plasmid has three EcoRI sites. How many fragments does it give?'
    choices: ['2', '3', '4', '1']
    ans: 1
    why: 'A ring has no ends. One cut only opens it; each extra cut adds a piece. So 3 cuts give 3 fragments (a linear DNA would give 4).'
  - q: 'In PCR, the step that needs a heat-stable enzyme such as Taq polymerase is:'
    choices: ['denaturation at 94 °C only', 'annealing of primers at 54 °C only', 'extension at 72 °C, with the enzyme surviving every denaturation', 'none of the steps']
    ans: 2
    why: 'Taq adds nucleotides at 72 °C, but it sits in the tube through every 94 °C denaturation, so it must not be destroyed by heat. That is why it comes from a hot-spring bacterium, Thermus aquaticus.'
  - q: 'A gene is cloned into the BamHI site inside the tetracycline-resistance gene of pBR322. The recombinant cells will:'
    choices: ['grow on tetracycline but not on ampicillin', 'grow on ampicillin but not on tetracycline', 'grow on both', 'grow on neither']
    ans: 1
    why: 'The insert breaks tetR (insertional inactivation), so the cell is tetracycline-sensitive; the ampicillin gene is still working, so it grows on ampicillin.'
sources:
  - 'NCERT Class 12 Biology, Chapter 9 “Biotechnology: Principles and Processes” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Cohen, S. N., Chang, A. C. Y., Boyer, H. W., Helling, R. B. (1973) Construction of biologically functional bacterial plasmids in vitro. Proceedings of the National Academy of Sciences 70(11): 3240-3244'
  - 'Bolivar, F. et al. (1977) Construction and characterization of new cloning vehicles II: a multipurpose cloning system. Gene 2(2): 95-113 (the plasmid pBR322)'
  - 'Saiki, R. K. et al. (1988) Primer-directed enzymatic amplification of DNA with a thermostable DNA polymerase. Science 239(4839): 487-491'
  - 'Smith, H. O. and Wilcox, K. W. (1970) A restriction enzyme from Hemophilus influenzae. Journal of Molecular Biology 51(2): 379-391'
---

**Biology · Class 12 · Chapter 9 · about 85 minutes.** By the end you will be able to explain how DNA is cut, joined and copied outside a cell, name the tools of genetic engineering (restriction enzymes, vectors, competent hosts), describe the steps of PCR and gel electrophoresis, and say how a bioreactor makes a product on a large scale.

<div class="bigidea">Genetic engineering is cutting and pasting with molecules. Restriction enzymes are the scissors, DNA ligase is the glue, a plasmid or virus is the vehicle that carries the piece into a cell, and the cell’s own machinery copies it. PCR is a photocopier that makes billions of copies of one chosen stretch of DNA. A bioreactor is the factory that grows the cells and collects the product.</div>

## 1. What is biotechnology?

**Biotechnology** is the use of living organisms, cells or their parts to make products and services for people. Making curd from milk and brewing are old forms. The modern form, which this chapter is about, began when scientists learnt to move genes between organisms. The European Federation of Biotechnology describes it as the integration of natural science and organisms, cells, parts of them and molecular analogues for products and services.

Two techniques made modern biotechnology possible:

1. **Genetic engineering**: changing the genetic material (DNA or RNA), putting it into a host and growing the host, so the host makes a new protein or trait.
2. **Bioprocess engineering**: keeping the right conditions (sterile, the right food, temperature and oxygen) so that only the wanted microbe or cell grows, in large amounts, to give a product such as an antibiotic, vaccine or enzyme.

Think of a **recipe and a kitchen**. Genetic engineering writes a new line into the recipe (the gene). Bioprocess engineering is the big clean kitchen where thousands of litres of that dish are cooked.

## 2. The principle: recombinant DNA

In 1972 Stanley Cohen and Herbert Boyer joined a gene for antibiotic resistance from one bacterium (a plasmid of *Salmonella*) to a plasmid of *E. coli*. The new plasmid carried the resistance gene and made *E. coli* resistant. This **recombinant DNA** molecule, made by joining DNA from two sources, was the start of genetic engineering. It needed three tools, which became the three headings of the next section:

- **scissors** to cut DNA at an exact place (restriction enzymes);
- a **vehicle** that can copy itself inside a cell (a cloning vector);
- a **host** cell that takes up the DNA (a competent cell) and copies it.

<div class="history">

<ul>
<li><b>1963</b> Two enzymes are found in <i>E. coli</i>: one adds methyl groups to DNA, the other cuts DNA. The cutting one is the first restriction enzyme.</li>
<li><b>1970</b> Hamilton Smith isolates <i>Hind</i> II and shows that it cuts DNA only at one specific 6-base-pair sequence.</li>
<li><b>1972-73</b> Cohen, Boyer and co-workers make the first recombinant plasmid.</li>
<li><b>1977</b> The plasmid pBR322, a model cloning vector, is described.</li>
<li><b>1985-88</b> Kary Mullis’s idea of PCR becomes a practical method after the heat-stable Taq polymerase is used.</li>
</ul>

</div>

## 3. Tools of recombinant DNA technology

### 3.1 Restriction enzymes: the molecular scissors

A **restriction enzyme** is an enzyme, first found in bacteria, that cuts DNA at a **specific sequence**. Bacteria use them as a defence: they cut up the DNA of invading viruses (bacteriophages) and so *restrict* their growth. The bacterium’s own DNA is protected by methyl groups added by a partner enzyme.

- **Exonucleases** remove nucleotides from the **ends** of DNA.
- **Endonucleases** cut **inside** the strand. Restriction enzymes are endonucleases.

**Names.** The name is a code. For **EcoRI**: **E** = genus *Escherichia*, **co** = species *coli*, **R** = the strain RY13, **I** = the first enzyme found in this strain. Over 900 restriction enzymes are known.

**The palindrome.** Each enzyme recognises a short **palindromic sequence** of base pairs, one that reads the same on both strands when each is read 5′ to 3′. For EcoRI it is GAATTC (top strand 5′-GAATTC-3′, bottom strand 3′-CTTAAG-5′, which also reads GAATTC from the 5′ end). The enzyme cuts each strand **between G and A**.

The two cuts are four bases apart, so each fragment has a short single-stranded tail, an **overhang**. These tails are **sticky ends**: they are complementary, so they bind to each other with hydrogen bonds, like the two halves of a zip. Any two DNAs cut with the **same** enzyme have matching sticky ends, whether they come from a bacterium or a human. **DNA ligase** then joins the sugar-phosphate backbone and the pieces become one molecule.

<div class="steps" data-fig="c12b-btp-sticky">
<div class="step"><b>Find the site.</b> EcoRI scans along the DNA for GAATTC. It is a palindrome: GAATTC on the top strand reads the same as the bottom strand read from its own 5′ end.</div>
<div class="step"><b>Cut one strand.</b> The enzyme breaks the phosphodiester bond between G and A on the top strand.</div>
<div class="step"><b>Cut the other strand.</b> It cuts the bottom strand between G and A as well. Because the sites are on opposite sides of the palindrome, the cuts are four bases apart.</div>
<div class="step"><b>Sticky ends.</b> The DNA falls into two pieces, each with a 5′ overhang AATT. Only the hydrogen bonds across the four-base overhang were broken, so the ends are free to pair again.</div>
<div class="step"><b>Pair with another piece.</b> A gene cut out with the same enzyme has the same overhangs, which pair with those of the vector by hydrogen bonds.</div>
<div class="step"><b>Ligate.</b> DNA ligase makes the covalent bonds that close the four breaks in the sugar-phosphate backbone. The result is recombinant DNA.</div>
</div>

<div class="meaning">

<dl>
<dt>1 site per 4ⁿ</dt><dd>`$\text{expected number of sites} = \dfrac{L}{4^{n}}$` for a random DNA of length L base pairs and a recognition sequence n bases long.</dd>
<dt>Physical meaning</dt><dd>Each position has 4 choices of base, so a given n-base word turns up with chance (¼)ⁿ. A 4-base enzyme cuts about every 256 bp, a 6-base enzyme like EcoRI about every 4096 bp. Longer sites mean fewer, bigger fragments.</dd>
</dl>

</div>

<div class="problem" data-problem="c12b-btp-sites"></div>

<div class="problem" data-problem="c12b-btp-frag"></div>

Try the enzyme yourself. Choose a DNA, pick enzymes and see where they cut.

<!--fig:tool restriction-digest-->

### 3.2 Gel electrophoresis: seeing the pieces

After cutting, the fragments must be **separated** and checked. **Agarose gel electrophoresis** does it.

1. Melt agarose (a polysaccharide from seaweed) in a buffer and pour it into a tray with a comb. When it sets, the comb leaves little **wells**.
2. Put the DNA samples in the wells, with a **ladder** (DNA of known sizes) in one well.
3. Switch on an electric field. DNA is **negatively charged** (the phosphate groups), so it moves toward the **positive** electrode (anode).
4. The gel is a mesh. **Small fragments slip through easily and travel far; large ones are held back.** The distance travelled falls roughly with the log of size.
5. Stain the gel with **ethidium bromide** and look at it under **UV light**: the DNA glows as orange bands. (Ethidium bromide is a poison; handle it with gloves. Safer stains exist.)
6. Cut the band you want from the gel and **elute** (extract) the DNA. This is the purified fragment for the next step.

Match the sizes against the ladder: a band level with the 3000 bp ladder band is about 3000 bp.

<figure class="fig" data-fig="c12b-btp-gel"><figcaption>Choose an enzyme for a 10 000 bp DNA. Two cuts give three bands, four cuts give five. Use the agarose slider: a denser gel (2 %) spreads out small pieces; a thin gel (0.7 %) separates big ones.</figcaption></figure>

<div class="problem" data-problem="c12b-btp-ladder"></div>

<!--fig:tool gel-band-sizer-->

<div class="myth">

**“DNA moves because it is attracted to the gel.”** It moves because it is negatively charged and the field pulls it toward the positive end. The gel only sorts the pieces by size, like a crowd where small people get through faster than large ones.

</div>

### 3.3 Cloning vectors: the vehicles

A piece of DNA without an **origin of replication** cannot copy itself in a cell. A **cloning vector** is a DNA molecule that can carry a foreign gene into a host and make copies of it. Plasmids (small circles of DNA in bacteria) and bacteriophages are the usual ones. A good vector has:

- **ori** (origin of replication): the place where copying starts. It decides the **copy number**: some vectors make 15-20 copies of themselves per cell, others hundreds, and a gene joined to a high-copy ori is copied hundreds of times.
- a **selectable marker**: a gene, usually antibiotic resistance, that lets you pick out the cells that took up the vector. Ordinary *E. coli* is killed by ampicillin, chloramphenicol, tetracycline or kanamycin; a cell with the matching resistance gene survives.
- **cloning sites**: unique places for restriction enzymes to cut (often only one site for each enzyme, so the vector opens at one place).
- ideally small and with a recognised **screening** system.

**pBR322** is the classic example. It has an ori, two resistance genes (ampR and tetR), and cloning sites inside them: **BamHI** in tetR, **PstI** in ampR. 

**Insertional inactivation.** If you clone a gene into BamHI, the tetracycline-resistance gene is broken. A cell with the empty vector still grows on both antibiotics. A cell with the recombinant grows on ampicillin but **not** on tetracycline. So you grow the cells on ampicillin first, then check which colonies fail on tetracycline: these are your recombinants.

<figure class="fig" data-fig="c12b-btp-vector"><figcaption>Choose where the gene goes and which bacteria you have. Watch which plate grows colonies. This is how recombinants are told from non-recombinants.</figcaption></figure>

**Colour selection (blue-white screening).** Newer vectors place the cloning site inside the gene for **β-galactosidase**. A plain vector makes the enzyme, which turns a chromogenic substrate **blue**. A recombinant, whose enzyme gene is broken (insertional inactivation again), makes **no** colour: **white colonies are recombinants**. This avoids using a second antibiotic, which is faster and cheaper.

**Vectors for plants and animals.** *Agrobacterium tumefaciens* naturally moves a part of its Ti plasmid into plant cells and makes a tumour. Scientists remove the tumour genes (**disarm** it) and use the bacterium to carry useful genes into plants. Disarmed **retroviruses** do the same for animal cells.

### 3.4 Competent host cells

DNA is a large, water-loving molecule and cannot pass a cell membrane easily. The host must be made **competent**, that is, able to take up DNA.

- **Bacteria:** treat with a divalent cation such as **calcium chloride**, which makes pores in the cell wall. Chill the cells with the recombinant DNA on ice, give them a brief **heat shock at 42 °C**, then put them back on ice. The pores open and DNA enters.
- **Animal cells:** **micro-injection**, a very fine glass needle puts DNA directly into the nucleus.
- **Plant cells:** a **gene gun** (biolistics) shoots gold or tungsten particles coated with DNA through the cell wall.
- **Disarmed pathogens** as vectors: *Agrobacterium* for plants, retroviruses for animals.

<figure class="fig" data-fig="c12b-btp-host"><figcaption>Pick a method. The animation shows how each one gets the DNA through the membrane (and wall): heat shock opens pores in bacteria, the needle goes straight to the nucleus, the gene gun fires DNA-coated particles, the disarmed vector injects its own cargo.</figcaption></figure>

<div class="myth">

**“A plasmid ‘knows’ which cell to enter.”** It does not. Only a tiny fraction of competent bacteria take up a plasmid. That is why the selectable marker is vital: antibiotic plates kill all the cells that did not get the plasmid.

</div>

## 4. Processes of recombinant DNA technology

The whole procedure goes in a fixed order. The shared figure below walks through it.

<div class="steps" data-fig="@bio-rdna-steps">
<div class="step"><b>Cut</b> the vector and the source DNA with the same restriction enzyme.</div>
<div class="step"><b>Anneal.</b> The matching sticky ends pair up.</div>
<div class="step"><b>Ligate.</b> DNA ligase seals the joints: a recombinant plasmid.</div>
<div class="step"><b>Transform.</b> Competent bacteria take up the plasmid.</div>
<div class="step"><b>Select.</b> Only cells with the plasmid (and its resistance gene) survive on the antibiotic.</div>
<div class="step"><b>Grow.</b> The clones copy the plasmid and make the protein.</div>
</div>

### 4.1 Isolation of the DNA

The DNA is inside cells, wrapped in proteins and mixed with RNA. To get it out, break the cells open with enzymes: **lysozyme** for bacteria, **cellulase** for plants, **chitinase** for fungi. Then use **ribonuclease** to destroy RNA and **protease** to destroy proteins. Add **chilled ethanol**: the DNA does not dissolve in it and appears as fine **white threads** you can spool out. Other debris stays in the liquid.

### 4.2 Cutting the DNA

Pure DNA is incubated with a restriction enzyme at the right temperature and buffer. Both the **source DNA** (with the gene of interest) and the **vector** are cut with the same enzyme. Check with agarose gel electrophoresis that the cut worked.

### 4.3 Amplifying the gene by PCR

There may be only a trace of the gene. The **polymerase chain reaction (PCR)** makes millions to billions of copies **in a test tube** in a few hours. It needs:

- the **template** DNA with the target;
- two short **primers** (about 20 nucleotides), single strands complementary to the 3′ ends of the target, one for each strand;
- **Taq DNA polymerase**, a heat-stable enzyme from *Thermus aquaticus*, a bacterium of hot springs, which stays active even at 94 °C;
- the four **deoxynucleotides** (dATP, dGTP, dCTP, dTTP) and a buffer with Mg²⁺.

A **thermal cycler** machine repeats three steps, 30 or more times:

1. **Denaturation** at about 94 °C: heat separates the two strands.
2. **Annealing** at about 54 °C: the primers bind (anneal) to the template.
3. **Extension** at about 72 °C: Taq polymerase extends each primer, using the template as a pattern and the nucleotides as bricks.

<div class="steps" data-fig="c12b-btp-pcrcycle">
<div class="step"><b>Start.</b> One double strand of target DNA, plus primers, Taq and nucleotides in the tube.</div>
<div class="step"><b>Denature (94 °C).</b> Heat breaks the hydrogen bonds between the bases. The two strands separate.</div>
<div class="step"><b>Anneal (54 °C).</b> The mixture cools. Each primer binds to its complementary end of a template strand.</div>
<div class="step"><b>Extend (72 °C).</b> Taq adds nucleotides to the 3′ end of each primer, copying the template.</div>
<div class="step"><b>One cycle done.</b> One double strand has become two, each with one old and one new strand. Repeat from the top.</div>
</div>

Each cycle **doubles** the number of target copies, so after n cycles there are `$N = N_0 \times 2^{n}$` copies. In practice, efficiency is a little below 100 %, and the growth of the target is exponential: 10 cycles give about a thousand times more, 20 cycles a million times, 30 cycles a billion times.

<figure class="fig" data-fig="c12b-btp-pcrcount"><figcaption>Slide the number of cycles. The graph has a log scale on the y axis, so doubling every cycle is a straight line. Lower the efficiency and the line bends below the dashed perfect-doubling line.</figcaption></figure>

<div class="problem" data-problem="c12b-btp-pcr"></div>

<div class="problem" data-problem="c12b-btp-cycles"></div>

<!--fig:tool pcr-master-mix-->

PCR is used well beyond cloning: to detect HIV or SARS-CoV-2 (RT-PCR) in a patient sample, to find cancer-causing mutations, and in DNA fingerprinting in forensics. The amplified DNA is often cut with a restriction enzyme and checked on a gel.

### 4.4 Inserting the gene into a host

The amplified gene (and the cut vector) are mixed with **DNA ligase**, which joins them into recombinant DNA. The recombinant DNA is then put into a **competent host** (section 3.4) by one of the methods above. Cells that take it up are called **transformed** (or transgenic if the organism carries the foreign gene). They are picked using the selectable marker.

### 4.5 Obtaining the foreign gene product

Making the gene only helps if it is **expressed**, that is, if the cell makes the protein. This needs the right promoter and other signals in the vector. A small laboratory culture makes very little, so we scale up in a **bioreactor** (fermenter), a large vessel in which the cells can be grown in **100-1000 litres** of culture.

A common design is the **stirred-tank reactor**:

- A **stirrer** mixes the contents so that cells, nutrients and oxygen are spread evenly.
- A **sparger** bubbles **sterile air** in, so the cells have oxygen. Some use a simple **air-lift** instead.
- A **foam** breaker, a **jacket** for temperature control, and **probes** for temperature, pH and oxygen.
- A port to **take out samples** safely.
- A way to add acid or base to keep the **pH** steady.

The culture goes through a lag, a log (rapid growth), a stationary and a death phase. The aim is to harvest when the product is at its highest.

<figure class="fig" data-fig="c12b-btp-bioreactor"><figcaption>Change the stirring and temperature. Poor stirring starves the cells of oxygen; a temperature far from the best (37 °C for this bacterium) also slows growth. The right-hand graph is the batch culture: lag, log, stationary, death.</figcaption></figure>

### 4.6 Downstream processing

The product from a bioreactor is not yet ready to use. **Downstream processing** is everything after the fermentation: **separation and purification** (removing cells, then the unwanted proteins), then **formulation** with preservatives, and **clinical trials** and quality-control tests before a medicine is sold.

Other related tools you can open: [Plasmid map](/science/plasmid-map/), [Bioreactor](/learn/bioreactor/) and [Recombinant insulin](/learn/recombinant-insulin/), which puts a human gene into bacteria step by step.

<div class="history">

**Beyond the syllabus (not examined in the Class 12 board paper).** CRISPR-Cas9 gene editing, which finds a target by a guide RNA instead of a palindrome, and quantitative PCR (real-time PCR) go beyond this chapter. Check the current CBSE syllabus for what is asked this year.

</div>

<div class="keypoints">

- Recombinant DNA: DNA from two sources joined in a test tube. Tools: restriction enzymes (scissors), DNA ligase (glue), a vector with ori, selectable marker and cloning sites, and a competent host.
- Restriction enzymes cut at palindromic sites, e.g. EcoRI at G^AATTC, leaving sticky ends. Endonucleases cut inside DNA; exonucleases remove ends.
- Agarose gel electrophoresis: DNA runs to the positive electrode; small fragments move farthest; ethidium bromide and UV show the bands.
- Selection: antibiotic resistance markers; insertional inactivation (a clone in tetR makes cells tetracycline-sensitive); blue-white screening with β-galactosidase.
- Competent bacteria: CaCl₂ and 42 °C heat shock. Other methods: micro-injection, gene gun, disarmed vectors (Agrobacterium, retrovirus).
- Isolation of DNA: lysozyme (bacteria), cellulase (plants), chitinase (fungi), RNase, protease, chilled ethanol.
- PCR: denaturation 94 °C, annealing 54 °C, extension 72 °C with Taq polymerase; n cycles give 2ⁿ copies.
- A stirred-tank bioreactor has a stirrer, sparger, foam breaker and probes. After it, downstream processing purifies and formulates the product.

</div>

Going further for JEE/NEET: the exam-level questions on restriction maps, primer design, vector choice and bioreactor types are in [Biotechnology: principles and processes (NEET)](/learn/courses/medical-entrance/biotech-principles/).
