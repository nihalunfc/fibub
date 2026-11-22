---
title: Molecular Basis of Inheritance
seoTitle: 'Molecular Basis of Inheritance Class 12 notes'
summary: 'Class 12 Molecular Basis of Inheritance: DNA structure, replication, transcription, genetic code, translation, lac operon, genome project, DNA fingerprinting.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'In a double-stranded DNA sample 20 % of the bases are cytosine. What percentage is adenine?'
    choices: ['20 %', '30 %', '40 %', '60 %']
    ans: 1
    why: 'G = C = 20 %, so G + C = 40 %. The other 60 % is A + T, and A = T, so A = 30 %.'
  - q: 'Heavy-nitrogen (15N) E. coli is moved to 14N medium for one generation. Its DNA is then:'
    choices: ['all heavy', 'all hybrid (one heavy, one light strand)', 'half heavy and half light', 'all light']
    ans: 1
    why: 'Replication is semi-conservative: each new molecule keeps one old (heavy) strand and gets one new (light) strand, so every molecule is hybrid.'
  - q: 'An mRNA codon reads 5′-AUG-3′. The anticodon of the tRNA that pairs with it is:'
    choices: ['5′-UAC-3′', '3′-UAC-5′', '3′-AUG-5′', '5′-TAC-3′']
    ans: 1
    why: 'The anticodon pairs by complementary, antiparallel base pairing: A with U, U with A, G with C. Written 3′ to 5′ it is UAC. tRNA is RNA, so there is no T.'
sources:
  - 'NCERT Class 12 Biology, Chapter 5 “Molecular Basis of Inheritance” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Watson, J. D. and Crick, F. H. C., Molecular structure of nucleic acids, Nature 171, 737-738 (1953)'
  - 'Hershey, A. D. and Chase, M., Independent functions of viral protein and nucleic acid in growth of bacteriophage, Journal of General Physiology 36, 39-56 (1952)'
  - 'Meselson, M. and Stahl, F. W., The replication of DNA in Escherichia coli, Proceedings of the National Academy of Sciences 44, 671-682 (1958)'
  - 'Jacob, F. and Monod, J., Genetic regulatory mechanisms in the synthesis of proteins, Journal of Molecular Biology 3, 318-356 (1961)'
  - 'Nurk, S. et al., The complete sequence of a human genome, Science 376, 44-53 (2022): 3.055 billion base pairs'
  - 'Jeffreys, A. J., Wilson, V. and Thein, S. L., Hypervariable minisatellite regions in human DNA, Nature 314, 67-73 (1985)'
---

**Biology · Class 12 · Chapter 5 · about 90 minutes.** By the end you will be able to describe the structure and packaging of DNA, explain how experiments proved DNA is the genetic material, work through replication, transcription and translation step by step, use the genetic code, explain the lac operon, and say what the Human Genome Project and DNA fingerprinting do.

<div class="bigidea">Every cell carries a long message written in four letters. The cell copies the message before it divides (replication), copies a part of it into a working RNA note (transcription), and a ribosome reads the note three letters at a time to join amino acids into a protein (translation). Genes are switched on and off by proteins that read the cell's surroundings, and changing even one letter can change the protein.</div>

## 1. DNA and RNA: the structure

**DNA** (deoxyribonucleic acid) is a long polymer of **nucleotides**. Each nucleotide has three parts:

- a **nitrogenous base**: the purines **adenine (A)** and **guanine (G)** have two rings; the pyrimidines **cytosine (C)**, **thymine (T)** (in DNA) and **uracil (U)** (in RNA) have one ring;
- a **pentose sugar**: deoxyribose in DNA, ribose in RNA (ribose has one more –OH);
- a **phosphate group**.

A base joined to a sugar is a **nucleoside** (adenosine, guanosine, cytidine, thymidine, uridine); add a phosphate and it is a **nucleotide**. Nucleotides link through a **phosphodiester bond** between the 3′-OH of one sugar and the phosphate on the 5′ carbon of the next, so a **polynucleotide chain** has a sugar-phosphate backbone with a free 5′ end at one end and a free 3′ end at the other. Think of a train: the backbone is the coupling, the bases are the passengers facing sideways.

### The double helix

In 1953 Watson and Crick, using the X-ray pictures of Rosalind Franklin and Maurice Wilkins, proposed a model with these features:

1. Two polynucleotide chains twist into a right-handed **double helix**.
2. The backbones are on the outside; the bases are inside, **stacked like steps of a spiral staircase**.
3. The two chains are **antiparallel**: one runs 5′ to 3′, the other 3′ to 5′.
4. **A pairs with T by two hydrogen bonds, and G pairs with C by three.** A purine always pairs with a pyrimidine, so the width stays the same, 2 nm.
5. One full turn (the **pitch**) is **3.4 nm** and holds **10 base pairs**, so adjacent pairs are **0.34 nm** apart.

Because of rule 4, the two strands are **complementary**: if you know one, you can write the other. Try it.

<figure class="fig" data-fig="c12b-mol-pairing"><figcaption>Build the partner of the strand on top by pressing A, T, G or C. A wrong base shows a cross. Count the hydrogen bonds: a strand rich in G and C is held together more firmly.</figcaption></figure>

Erwin Chargaff's measurements, years before the model, gave the clue: in any double-stranded DNA the amount of A equals T and the amount of G equals C, so purines equal pyrimidines.

<figure class="fig" data-fig="c12b-mol-chargaff"><figcaption>Move the A slider. In double-stranded DNA the bars for A and T always match, and so do G and C. Switch to a single-stranded virus genome and the rule breaks: there is no second strand to pair with.</figcaption></figure>

<div class="problem" data-problem="c12b-mol-chargaff"></div>

<div class="myth">

**“The amount of A equals the amount of G.”** No. It is A = T and G = C. A and G are both purines, but they do not pair with each other. The ratio (A + T) : (G + C) is different for different species and is a kind of fingerprint of a genome.

</div>

### DNA packaging

Count the length: a human haploid set has about 3.2 billion base pairs. At 0.34 nm each that is about **1 m** of DNA, and a human cell has two sets, about 2 m, inside a nucleus only a few micrometres wide. It would be like folding a 2 km thread into a cricket ball. The cell does it in stages.

<div class="problem" data-problem="c12b-mol-dnalen"></div>

In **prokaryotes** such as E. coli there is no nucleus: the circular DNA is coiled and held in a region called the **nucleoid** with positively charged proteins and RNA. In **eukaryotes**:

1. DNA is negatively charged (phosphates). It wraps around a core of **eight histone proteins** (an octamer of H2A, H2B, H3 and H4, two of each), which are rich in the basic amino acids lysine and arginine and so are positively charged.
2. About 200 bp of DNA wrap around each octamer: this bead is the **nucleosome**. Under the electron microscope the chromatin looks like **beads on a string**.
3. The nucleosomes fold into the thicker **chromatin fibre**, and the fibre loops and coils again. During metaphase it is packed into **chromosomes**, with the help of non-histone chromosomal (NHC) proteins.
4. **Euchromatin** is lightly packed and stains light: it is transcriptionally active. **Heterochromatin** is densely packed and stains dark: it is inactive.

<figure class="fig" data-fig="c12b-mol-pack"><figcaption>Slide through the five levels of packing, from the 2 nm helix to the 1400 nm metaphase chromosome. The text below the picture says what holds each level together.</figcaption></figure>

### RNA

RNA differs from DNA in three ways: the sugar is ribose, uracil replaces thymine, and it is usually a single strand. There are three main kinds. **mRNA** (messenger) carries the code for a protein. **tRNA** (transfer) is a small, cloverleaf-shaped adaptor, with an anticodon loop at one end and an amino acid binding end (CCA) at the other. **rRNA** (ribosomal) builds the ribosome and does the work of joining amino acids.

## 2. The search for the genetic material

Before 1950 many scientists thought proteins carried heredity, since proteins are so varied. Three experiments settled it.

**Griffith (1928)** used Streptococcus pneumoniae. Smooth (S) cells with a capsule kill mice; rough (R) cells without one do not. Heat-killed S cells were harmless, yet when mixed with live R cells the mice died and live S cells were found. Something from the dead S cells had **transformed** the R cells: the "transforming principle".

**Avery, MacLeod and McCarty (1944)** purified the biochemicals in the heat-killed S extract. Protein-digesting enzymes (proteases) and RNA-digesting enzymes (RNase) did not stop the transformation; **DNase, which destroys DNA, did**. So DNA is the transforming principle.

**Hershey and Chase (1952)** used a bacteriophage, a virus that infects bacteria. Follow the steps.

<div class="steps" data-fig="c12b-mol-hershey">
<div class="step">Grow one batch of phages with radioactive phosphorus (32P), which goes into DNA. Grow another with radioactive sulphur (35S), which goes into protein. DNA has no sulphur and protein has almost no phosphorus, so the labels separate the two molecules.</div>
<div class="step">Let each batch infect E. coli. The phages attach to the outside of the bacteria and inject something into them.</div>
<div class="step">Blend the mixture in a kitchen blender: the shaking breaks the empty phage coats off the bacterial surface.</div>
<div class="step">Spin in a centrifuge: the heavy bacteria settle at the bottom (the pellet) and the light viral coats stay in the liquid above.</div>
<div class="step">Measure the radioactivity: the 32P (DNA) is in the bacteria, the 35S (protein) is in the liquid. DNA, not protein, enters the cell and carries the instructions to make new viruses.</div>
</div>

<div class="history">

**1928** Griffith: a transforming principle. **1944** Avery, MacLeod, McCarty: it is DNA. **1950** Chargaff's base ratios. **1952** Hershey and Chase: DNA enters the cell. **1953** Watson and Crick: the double helix. **1958** Meselson and Stahl: replication is semi-conservative. **1961** Jacob and Monod: the lac operon.

</div>

### The RNA world

DNA is stable, but it needs proteins (enzymes) to copy it. Proteins cannot copy themselves. RNA can **store information and act as an enzyme** (ribozyme: for example the part of the ribosome that joins amino acids is RNA). So many scientists think the first genetic material was **RNA**, and DNA appeared later as a more stable store, since 2′-OH in RNA makes it reactive and easily broken and uracil errors are not easy to repair. Some viruses (tobacco mosaic virus, many flu viruses) still use RNA as their genes.

## 3. Replication of DNA

Watson and Crick wrote that the pairing "suggests a possible copying mechanism": each strand can serve as a template. Three ideas were possible: **conservative** (old molecule stays whole, a new one is made), **dispersive** (mixed pieces), **semi-conservative** (each daughter has one old and one new strand).

**The Meselson-Stahl experiment (1958).** They grew E. coli for many generations in medium with heavy nitrogen 15N, so all its DNA was heavy. They moved the cells to normal 14N medium and took samples every generation. In a caesium chloride density gradient, heavy and light DNA settle at different depths. After one generation all DNA was of **intermediate** density; after two generations half intermediate and half light. Only semi-conservative copying gives that pattern.

<!--fig:tool meselson-stahl-->

<div class="problem" data-problem="c12b-mol-meselson"></div>

### How it is done

Replication starts at a fixed **origin of replication** (bacteria have one; eukaryote chromosomes have many) and goes both ways, making two **replication forks**. The machinery:

- **Helicase** unwinds and opens the helix; single-strand binding proteins stop it closing; **topoisomerase** relieves the twist ahead of the fork.
- **DNA polymerase** adds deoxynucleotides (as triphosphates, which supply the energy) to a **3′-OH end** only, so it works **5′ to 3′**. It needs a primer to start, made by **primase** (a short RNA piece).
- The **leading strand** is copied continuously. The **lagging strand** has the wrong direction, so it is built in short pieces (**Okazaki fragments**) and joined by **DNA ligase**.

<div class="steps" data-fig="c12b-mol-replsteps">
<div class="step">The parent DNA: two old antiparallel strands.</div>
<div class="step">Helicase opens a replication fork. Each old strand is a template.</div>
<div class="step">Primase lays a primer. DNA polymerase extends the new strand 5′ to 3′ in the direction of fork opening: the leading strand, made in one go.</div>
<div class="step">The other template runs the wrong way for continuous copying, so polymerase makes Okazaki fragments, each starting from its own primer.</div>
<div class="step">Primers are replaced by DNA and ligase seals the nicks. Two identical daughters, each half old and half new.</div>
</div>

<figure class="fig" data-fig="@bio-replication-fork"><figcaption>The fork in motion: change the speed, and switch the ligase off to see the Okazaki fragments stay separate.</figcaption></figure>

Bacterial DNA polymerase adds about 1000 nucleotides per second and makes roughly one mistake in 10⁹ to 10¹⁰ bases because it also proof-reads. Cells that copy DNA must finish before division: in the human cell, replication of 3 billion base pairs takes about 8 hours using many origins at once. Replication happens in the **S phase** of the cell cycle; a failure to finish can mean daughter cells with damaged chromosomes.

<div class="problem" data-problem="c12b-mol-replrate"></div>

## 4. Transcription

**Transcription** copies one strand of DNA into RNA. The part of DNA copied is a **transcription unit** with three regions: a **promoter** (where the enzyme binds, upstream of the gene), the **structural gene**, and a **terminator** (downstream). The strand that is read is the **template strand**, running 3′ to 5′, and the RNA is made 5′ to 3′ with the same sequence as the other strand, the **coding strand** (except U for T). Bacteria use a single **RNA polymerase** for all RNAs; it needs no primer and uses a sigma factor to find the promoter and a rho factor in stopping.

<div class="steps" data-fig="c12b-mol-transcribe">
<div class="step">RNA polymerase binds the promoter and opens a short bubble of DNA.</div>
<div class="step">It adds ribonucleotides that pair with the template (A with U, T with A, C with G, G with C), making mRNA 5′ to 3′.</div>
<div class="step">At the terminator the RNA and enzyme are released.</div>
<div class="step">In eukaryotes the first RNA, hnRNA, has coding exons and non-coding introns.</div>
<div class="step">Introns are removed and exons joined: splicing.</div>
<div class="step">A cap is added at 5′ and a poly-A tail at 3′: mature mRNA leaves the nucleus.</div>
</div>

Eukaryotes use three RNA polymerases: **I** makes the large rRNAs, **II** makes hnRNA (mRNA), **III** makes tRNA, 5S rRNA and snRNAs. In bacteria the gene is continuous and translation can begin before transcription finishes, since there is no nucleus to separate them. In eukaryotes the **split gene** structure means the primary transcript must be processed: **splicing, capping and tailing** (as in the steps above). Introns can be long, and the same gene can be spliced in different ways to give different proteins.

<div class="myth">

**“mRNA is a copy of the coding strand's complement, so it matches the template strand.”** It is the other way round: the mRNA is complementary to the template and has the same sequence as the coding strand (with U in place of T). Always ask which strand the polymerase reads.

</div>

## 5. The genetic code

The code tells how the sequence of bases in mRNA fixes the sequence of amino acids. With four bases and 20 amino acids, groups of one (4) or two (16) are too few; groups of three give 64, so the code is a **triplet code**. George Gamow predicted it; Marshall Nirenberg, Har Gobind Khorana (born in Punjab) and others cracked it, for instance an mRNA of only uracil (UUUU...) made only the amino acid phenylalanine.

<div class="problem" data-problem="c12b-mol-triplet"></div>

**Features of the code:**

- **Triplet:** 3 bases code for one amino acid (a codon).
- **61 codons code for amino acids; 3 are stop codons** (UAA, UAG, UGA). **AUG** codes for methionine and is the **start codon**.
- **Degenerate:** most amino acids have more than one codon (for example 6 for leucine). This protects against some mutations.
- **Unambiguous (specific):** one codon never codes for two amino acids.
- **Non-overlapping and comma-less:** read three at a time from a fixed start, with no gaps.
- **Nearly universal:** the same in bacteria and in humans (small exceptions in mitochondria).

<figure class="fig" data-fig="@bio-codon-table"><figcaption>The genetic code table. Choose a codon, then change one letter to see whether the change is silent, missense or nonsense.</figcaption></figure>

<div class="problem" data-problem="c12b-mol-codons"></div>

### Mutations and the code

A **mutation** is a change in DNA sequence. A **point mutation** changes one base. **Sickle-cell anaemia** is the classic case: one base change (GAG to GUG in the mRNA) swaps glutamic acid for valine in one chain of haemoglobin. A **frameshift** is an insertion or deletion of one or two bases: the triplets after it are all read wrongly. Three (or a multiple of 3) bases added or removed keep the frame, and add or remove whole amino acids. Both kinds are shown below; move the slider through the message.

<figure class="fig" data-fig="c12b-mol-frameshift"><figcaption>Choose substitute, insert or delete, a position and a new base. Compare the two rows: red shows the codons that changed and the amino acids that follow.</figcaption></figure>

### tRNA, the adaptor

tRNA reads the code. Its **anticodon loop** pairs with the mRNA codon; its amino-acid end carries the amino acid; an enzyme (**aminoacyl-tRNA synthetase**) joins the right amino acid to the right tRNA, using ATP. There is a special **initiator tRNA** for AUG and no tRNA for the stop codons.

## 6. Translation

**Translation** builds a polypeptide in the order set by the mRNA, on the **ribosome**: a small subunit and a large subunit of rRNA and proteins, with sites for **P (peptidyl)**, **A (aminoacyl)** and **E (exit)**. The mRNA has untranslated regions (**UTRs**) before the start codon and after the stop codon, which help the ribosome bind and control the message.

<div class="steps" data-fig="c12b-mol-translate">
<div class="step">Amino acids are attached to their tRNAs (charging), using ATP.</div>
<div class="step">Initiation: the small subunit binds mRNA and the initiator tRNA binds AUG.</div>
<div class="step">The large subunit joins; the ribosome has E, P and A sites.</div>
<div class="step">Elongation: the next tRNA enters the A site and a peptide bond forms.</div>
<div class="step">Translocation: the ribosome moves one codon, the spent tRNA leaves, the A site is free again.</div>
<div class="step">Termination at a stop codon: a release factor frees the polypeptide.</div>
</div>

Many ribosomes can read one mRNA at once: a string of them is a **polysome**, which makes many copies of the protein quickly. In bacteria the mRNA is often **polycistronic** (carries several genes) and starts being translated while it is still being made. Together with the steps before: DNA → (transcription) → mRNA → (translation) → protein. This flow is the **central dogma** of Francis Crick, with the addition that some viruses copy RNA to DNA by **reverse transcriptase**.

<figure class="fig" data-fig="@bio-central-dogma"><figcaption>The whole path in one player: template DNA, mRNA, a ribosome reading codons, a peptide growing and the stop codon.</figcaption></figure>

Try your own sequences, work out reverse complements and translate them:

<!--fig:tool sequence-tools-->

## 7. Regulation of gene expression: the lac operon

A bacterium does not need to make a lactose-digesting enzyme when there is no lactose. Making proteins costs energy, so genes are switched on only when needed. François Jacob and Jacques Monod worked out the model in 1961, the **operon**: a group of genes under one switch.

The **lac operon** of E. coli has:

- three **structural genes**: **z** (β-galactosidase, splits lactose into glucose and galactose), **y** (permease, lets lactose in) and **a** (transacetylase);
- a **promoter** (where RNA polymerase binds) and an **operator** (where the repressor binds, next to the promoter);
- a separate regulatory gene, **i**, which makes the **repressor protein**.

**No lactose:** the repressor sits on the operator and blocks the polymerase, so the genes are **off**. **Lactose present:** lactose (the **inducer**) binds the repressor, which changes shape and falls off the operator, so the polymerase moves and the three genes are **on**. When the lactose is used up, the repressor goes back and the genes are switched off. This is **negative regulation**: the repressor does the switching off. Glucose is the cell's preferred sugar and also reduces the operon's activity.

Switch lactose on and off in the tool below and watch the repressor.

<!--fig:tool lac-operon-->

<figure class="fig" data-fig="@bio-trp-operon"><figcaption>A different operon, for tryptophan: it is on when the amino acid is missing and the end product switches it off (repressible, not inducible).</figcaption></figure>

<div class="myth">

**“The inducer attaches to the operator.”** The lactose (inducer) binds the repressor protein, not the DNA. It is the repressor that sits on the operator, and without a working repressor the operon is always on.

</div>

<div class="history">

**Beyond the syllabus.** In eukaryotes there are no operons in this sense: genes are controlled one at a time by transcription factors, enhancers far from the gene, chromatin that is packed or open, and RNA processing. The idea (switches that read the cell's state) is the same.

</div>

## 8. The Human Genome Project

The **genome** is the whole set of DNA in a cell. The **Human Genome Project (HGP)** ran from 1990 to 2003 as a public, international effort (with a private rival, Celera Genomics). It was the largest single biology project, and its data were released free for everyone.

**Goals:** find all genes, write down the sequence of all 3 billion base pairs, store it in databases, build tools to analyse it, hand the technology to industry, and study the ethical, legal and social issues.

**Methods:** two main approaches. **Expressed sequence tags (ESTs)** find only the genes that are expressed (made into RNA). **Sequence annotation** sequences all of the DNA, genes and non-coding parts together, then marks the genes. The DNA was cut into small pieces, cloned in bacteria or yeast (BAC and YAC vectors), sequenced by the automated Sanger method, and the overlapping pieces assembled by computer: **bioinformatics** was needed for this.

**Findings** (as first reported, with later updates):

- About 3 × 10⁹ base pairs in the haploid genome. The first complete telomere-to-telomere sequence (2022) measured about 3.06 billion.
- The first estimate, about 30,000 genes, is now about 20,000 genes that code for proteins. Less than 2 % of the genome codes for protein.
- More than half the genome is **repeated sequences** that do not code for protein; they are useful in DNA fingerprinting. People differ in only about 0.1 % of their DNA, in single-letter changes called **SNPs** (single nucleotide polymorphisms) which help track disease genes.
- Chromosome 1 has the most genes and the Y chromosome has the fewest; the function of many genes is unknown.

**Uses:** finding genes for diseases, understanding human variation and evolution, early tests, and designing drugs. **Model organisms** sequenced include E. coli, yeast, the fruit fly, a nematode worm, rice and mouse, and these helped to understand the human genome.

## 9. DNA fingerprinting

Apart from identical twins, every person's DNA differs in tiny ways. **DNA fingerprinting** compares those differences to tell people apart. Alec Jeffreys developed it in 1984-85.

It uses **VNTRs** (variable number of tandem repeats): short sequences repeated one after another, whose number of repeats differs between people (a form of DNA polymorphism). A child inherits half the VNTR pattern from each parent.

1. Isolate DNA from blood, hair roots, semen or any cells (even a very small sample can be amplified by PCR).
2. Cut it with a restriction enzyme into fragments of different lengths.
3. Separate the fragments by size by gel electrophoresis: smaller pieces travel farther.
4. Transfer (blot) the bands from the gel to a nylon membrane.
5. Add a labelled, single-stranded VNTR probe, which sticks to matching fragments.
6. Photograph the pattern (autoradiography): the bar-code of bands is the DNA fingerprint. Compare samples.

<figure class="fig" data-fig="@bio-gel-electrophoresis"><figcaption>A gel run with a ladder, a crime-scene sample and three suspects. Raise the voltage and change the agarose to see how bands move.</figcaption></figure>

Uses: **forensics** (matching a crime scene sample to a suspect), **paternity** disputes, identifying remains, and studying **genetic diversity** in populations and in wildlife. Because the bands in a child come only from the mother or the father, a band that matches neither parent shows the child is not theirs.

<div class="keypoints">

- Nucleotide = base + sugar + phosphate. A-T has 2 hydrogen bonds and G-C has 3; strands are antiparallel; one helical turn is 3.4 nm with 10 bp (0.34 nm each). Chargaff: A = T, G = C.
- DNA wraps round 8 histones (200 bp per nucleosome) and packs up to the chromosome. Euchromatin is active, heterochromatin is not.
- Griffith, Avery, Hershey and Chase showed DNA is the genetic material. Replication is semi-conservative (Meselson and Stahl); polymerase works 5′ to 3′: leading strand continuous, lagging strand in Okazaki fragments.
- Transcription: promoter, structural gene, terminator; the template strand is read. In eukaryotes, hnRNA is spliced, capped and tailed.
- The code is triplet, 64 codons (61 sense, 3 stop), AUG start, degenerate, unambiguous, universal. A frameshift changes everything after it.
- Translation: ribosome with E, P, A sites; tRNA anticodon pairs with the codon; the central dogma is DNA to RNA to protein.
- Lac operon: repressor blocks the operator; lactose (inducer) removes it, and genes z, y, a are switched on.
- HGP: about 3 billion bp, about 20,000 protein-coding genes, repeats, SNPs. DNA fingerprinting uses VNTRs.

</div>

Going further for JEE/NEET: the exam-level version of this chapter is [Molecular Basis of Inheritance for NEET](/learn/courses/medical-entrance/molecular-inheritance/).
