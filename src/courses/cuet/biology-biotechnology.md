---
title: 'Biology: biotechnology, principles and applications'
seoTitle: 'Biotechnology for CUET Biology: rDNA, PCR, Bt crops'
summary: 'Tools of recombinant DNA technology (restriction enzymes, vectors, hosts), PCR and gel electrophoresis, the steps of making a recombinant product, and uses in farming and medicine such as Bt cotton, RNAi, insulin and gene therapy, with a live PCR problem.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'EcoRI cuts DNA at a palindromic site. A palindrome here means:'
    choices: ['the sequence reads the same 5′ → 3′ on both strands', 'the sequence is all one base', 'the DNA is circular']
    ans: 0
    why: 'GAATTC on one strand reads GAATTC on the other strand, also 5′ to 3′.'
  - q: 'Taq polymerase is used in PCR because it:'
    choices: ['stays active at the high temperatures of each cycle', 'cuts DNA', 'joins DNA fragments']
    ans: 0
    why: 'It comes from Thermus aquaticus, a bacterium of hot springs, so it survives the ~94 °C denaturing step.'
  - q: 'Bt cotton resists bollworms because it makes:'
    choices: ['an inactive protoxin that becomes toxic in the insect gut', 'a pesticide that kills all insects', 'a hormone that repels insects']
    ans: 0
    why: 'The cry gene product is activated by the alkaline gut of the insect and damages its gut lining.'
sources:
  - 'NCERT, Biology (Class 12), Biotechnology: Principles and Processes; Biotechnology and its Applications'
  - 'National Testing Agency, CUET (UG) Biology syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 9 · about 24 minutes.** By the end you will explain how a gene is cut, pasted, copied and expressed, and give uses in farming and medicine. Read first: [molecular inheritance](/learn/courses/cuet/biology-molecular-inheritance/).

<div class="bigidea">Biotechnology moves a useful gene into a new host that then makes the product for us. The tools are molecular scissors (restriction enzymes), glue (ligase), a delivery vehicle (vector) and a photocopier (PCR).</div>

**Everyday picture:** cutting a sentence out of one document and pasting it into another, then printing thousands of copies. A restriction enzyme cuts, ligase pastes, and a plasmid in bacteria prints.

## 1. The tools

| Tool | Job | Example |
|---|---|---|
| Restriction endonuclease | cuts at a specific palindrome, often leaving sticky ends | EcoRI (GAATTC) |
| DNA ligase | joins DNA pieces | |
| Vector | carries the gene into the host | plasmid pBR322 (ori, amp^R, tet^R), Ti plasmid of Agrobacterium for plants |
| Selectable marker | lets only transformed cells grow or be spotted | antibiotic resistance; blue-white screening with lacZ |
| Competent host | takes up DNA | E. coli treated with Ca²⁺ and heat shock; microinjection, gene gun |
| Gel electrophoresis | separates DNA by size (small pieces run farther); stained with ethidium bromide | |

## 2. The process

<div class="steps" data-title="Making a recombinant product">
<div class="step"><b>Isolate DNA</b> (break cells with lysozyme, cellulase or chitinase; remove RNA and protein with enzymes).</div>
<div class="step"><b>Cut</b> the gene and the vector with the same restriction enzyme so their sticky ends match.</div>
<div class="step"><b>Paste</b> with ligase to make recombinant DNA.</div>
<div class="step"><b>Insert</b> into the host and select the transformed cells.</div>
<div class="step"><b>Grow</b> them in a bioreactor and purify the product (downstream processing).</div>
</div>

PCR copies a chosen piece of DNA in cycles of denaturation (~94 °C), primer annealing (~55 °C) and extension (~72 °C, Taq polymerase). Each cycle doubles the DNA.

<div class="problem" data-problem="pcr-copies"></div>

## 3. Applications

| Field | Example |
|---|---|
| Pest-resistant crops | Bt cotton (cry genes from Bacillus thuringiensis) |
| RNA interference | tobacco protected from a nematode (Meloidogyne) by silencing its mRNA |
| Medicine | human insulin made in E. coli (Eli Lilly, 1983: A and B chains made separately and joined) |
| Gene therapy | first in 1990 for ADA deficiency (adenosine deaminase) |
| Diagnosis | PCR and ELISA find infections early |
| Transgenic animals | to study disease, test vaccine safety, make proteins (Rosie the cow, α-lactalbumin) |
| Ethics | GEAC in India approves GM organisms; biopiracy disputes such as basmati rice and turmeric patents |

<div class="myth">

**"Genetically modified means poisoned."** A GM crop carries a precisely chosen gene and is tested before approval. Bt toxin harms specific insects because their gut activates it; the human gut does not.

</div>

## 4. Practice

<div class="qbank" data-bank="entrance-biology" data-topics="biotech-principles,biotech-applications" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Restriction enzyme cuts at palindromes; ligase joins; vector carries.
- pBR322: ori, amp^R, tet^R; insertional inactivation for selection.
- PCR: denature, anneal, extend; doubles per cycle; Taq polymerase.
- Bt cotton (cry genes), RNAi tobacco, recombinant insulin, ADA gene therapy.

</div>
