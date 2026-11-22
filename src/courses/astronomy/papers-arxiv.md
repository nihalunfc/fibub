---
title: "Reading research papers and arXiv"
seoTitle: "How to read astronomy papers and use arXiv | Astronomy"
summary: "Astronomy research is shared as papers, almost all free on arXiv and searchable in NASA ADS. Read them in three passes: abstract and figures, then conclusions, then methods, and always check the error bars."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "arXiv is:"
    choices: ["A free server of research papers, many before journal publication", "A telescope", "A paid journal"]
    ans: 0
    why: "Most astronomy papers appear on arXiv (astro-ph) free to read, often before peer review."
  - q: "A good first pass through a paper is:"
    choices: ["Read every equation in order", "Abstract, figures and conclusions", "Only the references"]
    ans: 1
    why: "That tells you the claim and the evidence in minutes, so you can decide whether to read on."
  - q: "A preprint on arXiv:"
    choices: ["Has always been peer reviewed", "May not yet have been peer reviewed", "Is never cited"]
    ans: 1
    why: "Check whether it later appeared in a journal, and read claims with care."
sources:
  - "arXiv (Cornell University), arxiv.org; NASA Astrophysics Data System, ui.adsabs.harvard.edu"
---

**Module 5 · about 20 minutes · no new maths.** You'll be able to find astronomy papers, read one efficiently, and judge how much to trust its main claim.

## 1. Why this matters

Papers are where new astronomy lives. Textbooks lag by years; papers tell you what was found last week. Reading them is a skill like observing: at first slow, then quicker. It is also how you check a news story: go to the paper and see what it actually says, with what uncertainty.

## 2. Finding papers

- **arXiv astro-ph**: new preprints every weekday, free. Sections for solar and stellar, planetary, galaxies, cosmology, instrumentation and more.
- **NASA ADS**: search everything in astronomy by author, object or keyword; see who cited what.
- **Journals**: ApJ, MNRAS, A&A, AJ and others; many are now open access.

<!--fig:read-paper-->

Things to notice:

- The figures usually carry the result; read their captions slowly.
- The methods section is where you find out whether you could repeat the work.

<details class="maths" open>
<summary>Maths and principle</summary>

**Reading a result**: a value like `$R = 1.21^{+0.08}_{-0.06}\,R_\oplus$` means the best estimate is 1.21, and the truth probably (about 68% chance) lies between 1.15 and 1.29.

**Significance**: a difference of `$\Delta$` between two values with uncertainty `$\sigma$` is `$\Delta/\sigma$` "sigma". Astronomers treat about 3σ as interesting and 5σ as a discovery.

**Try it:** two measurements of H₀, `$73.0 \pm 1.0$` and `$67.4 \pm 0.5$`: `$\Delta = 5.6$`, `$\sigma = \sqrt{1.0^2 + 0.5^2} = 1.12$`, so `$5.0\sigma$`. That is the Hubble tension, explored in the [cosmology course](/learn/courses/cosmology/).
</details>

## 3. What it means physically

A paper is an argument: here is what we measured, here is how, here is what it means, and here is why other explanations don't fit. Peer review checks the argument but doesn't guarantee it is right; science corrects itself when others repeat the work with new data. That is why the data section, and open archives (Lesson 5.6), matter so much.

## 4. Worked example

*A preprint claims a planet's atmosphere contains a certain gas, detected at "3.1σ". How excited should you be?*

3σ means a random fluke this large would happen about 1 time in 370 if there were no gas. Given how many gases and planets people search, flukes of that size turn up. Treat it as "worth checking", look for whether the authors tried other explanations, and wait for an independent confirmation or a 5σ result.

## 5. Practice

1. Where would you look for every paper about the star Betelgeuse?
2. A result reads `$0.30 \pm 0.15$`. Is it clearly different from zero?
3. What should you check first when a news headline reports a discovery?

<details>
<summary>Answers</summary>

1. NASA ADS (search by object), or SIMBAD, which lists papers for each object.
2. Only 2σ: suggestive, not convincing.
3. The paper itself: the stated uncertainty or significance, whether it is peer reviewed, and what the authors actually claim.
</details>

**Try it with real numbers:** recreate a paper's plot with fibub tools, for example a star's wobble in the [[radial-velocity-fitter]].

**New words:** *preprint*, *arXiv*, *peer review*, *NASA ADS*, *sigma (significance)*, *citation*.
