---
title: "Refugee and native age structure in 1928 Greece, checked ratio by ratio"
summary: "A 2026 study measures how the 1922 Asia Minor refugees changed the age structure of the Aegean islands. We rebuild its twelve dependency ratios and ageing indices with fibub's population pyramid tool."
tools: [population-pyramid, cohort-component-projection, life-table]
updated: 2026-11-24
sources:
  - "Rontos, K., Antonoglou, D., Giavrimis, P., Baltas, P. and Kontogiannis, G. (2026), Quantifying Displacement and Socio-Demographic Change: Asia Minor Refugee Flows in the Eastern Aegean Islands After 1922, Genealogy 10(4): 114, doi:10.3390/genealogy10040114. Licence CC BY 4.0, taken from the Crossref record (api.crossref.org/works?filter=doi:10.3390/genealogy10040114), checked 2026-11-24; no correction or retraction on the record. (The MDPI page's own rights metadata says CC BY 3.0, which is MDPI's known metadata quirk.) Values used here, all for the 1928 Greek census: total, refugee and native populations of Greece and the prefectures of Lesvos, Samos and Chios (Table 5); the shares aged 0-14, 15-64 and 65+ with the dependency ratio and ageing index of each (Tables 10-13); sex ratios (Table 9); mean ages (Table 8)."
  - "Definitions: United Nations, Department of Economic and Social Affairs, standard demographic measures - child, old-age and total dependency ratios per 100 people aged 15-64, ageing index as people 65+ per 100 aged 0-14, grouped median by linear interpolation within the age group."
paper:
  title: "Quantifying Displacement and Socio-Demographic Change: Asia Minor Refugee Flows in the Eastern Aegean Islands After 1922"
  authors: "Rontos K, Antonoglou D, Giavrimis P, Baltas P, Kontogiannis G"
  journal: "Genealogy"
  year: 2026
  doi: "10.3390/genealogy10040114"
  url: "https://www.mdpi.com/2313-5778/10/4/114"
  licence: "CC BY 4.0"
  reviewed: true
---

In 1922 and 1923 about 1.2 million Orthodox Christians left Asia Minor for Greece, a country of some five million people. The islands nearest the coast took in the most, and the 1928 census counted refugees and natives separately, which makes it one of the few historical censuses that lets you compare two populations living side by side in the same place. A 2026 paper in *Genealogy* uses it to measure what the arrivals did to the age structure of Lesvos, Samos and Chios, and reports a dependency ratio and an ageing index for every group. All of those are ratios of age-group shares, which means a reader can check them, and the [[population-pyramid]] does it in a few seconds. For what comes next in a demographic analysis, see the [[cohort-component-projection]] and the [[life-table]].

## The paper in brief

The authors work from the published 1928 census, which separates "refugees" (people who arrived after 1922) from the native-born population. For Greece as a whole and for each of the three island prefectures they report both groups' size, their shares in three broad age groups (0-14, 15-64, 65 and over), a total dependency ratio, an ageing index, a sex ratio and a mean age.

Their picture is consistent across all three islands. Refugees were a large minority: 20.2 % of Lesvos, 17.0 % of Chios, 9.0 % of Samos, 17.2 % of Greece. They were **older** than the natives (mean age 32.8 against 29.8 on Lesvos), **more female** (82.4 men per 100 women against 91.8), and had **fewer children**: a quarter of refugees were under 15, against roughly a third of natives. So the refugee population had a *lower* dependency ratio, because the children who would have made up the difference were missing, and a much higher ageing index. On Chios the effect is extreme: the refugee ageing index is 45.6 old people per 100 children, against 26.7 among natives.

## Checked with the tools

Nothing here needs the census returns. The paper prints enough for the tool to rebuild each population as a three-group pyramid: the size of the group, its three age shares, and its sex ratio. We turned the shares into counts (normalising, because three of the twelve rows print as 99.9 % or 100.1 %) and split each age group by the group's own sex ratio. That last step is **our assumption** and is needed only for the picture and the medians by sex; a dependency ratio uses the age totals, so it cannot be affected.

<!-- fig:pyramid -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Population pyramid of the 1928 refugee population of Lesvos in three broad age groups, with the native population as an outline. The refugee bars are narrower at the bottom: a quarter of refugees were under 15 against a third of natives." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Lesvos 1928: refugee and native age structure</title><text x="8" y="5.2" dy="0.8em" font-size="14.040000000000001" fill="var(--ink)" text-anchor="start" font-weight="700">Lesvos 1928: refugees (bars) and natives (outline)</text>
<text x="132.96" y="29.9" dy="0.8em" font-size="13" fill="var(--ink)" text-anchor="middle" font-weight="700">Male</text>
<text x="427.04" y="29.9" dy="0.8em" font-size="13" fill="var(--ink)" text-anchor="middle" font-weight="700">Female</text>
<polyline points="132.96,48.1 132.96,219" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<polyline points="132.96,219 132.96,223" fill="none" stroke="var(--ink)" stroke-width="1" stroke-linejoin="round"/>
<text x="132.96" y="225" dy="0.8em" font-size="10.66" fill="var(--ink)" text-anchor="middle">20 %</text>
<polyline points="427.04,48.1 427.04,219" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<polyline points="427.04,219 427.04,223" fill="none" stroke="var(--ink)" stroke-width="1" stroke-linejoin="round"/>
<text x="427.04" y="225" dy="0.8em" font-size="10.66" fill="var(--ink)" text-anchor="middle">20 %</text>
<polyline points="8,48.1 8,219" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<polyline points="8,219 8,223" fill="none" stroke="var(--ink)" stroke-width="1" stroke-linejoin="round"/>
<text x="8" y="225" dy="0.8em" font-size="10.66" fill="var(--ink)" text-anchor="middle">40 %</text>
<polyline points="552,48.1 552,219" fill="none" stroke="var(--line)" stroke-width="1" stroke-linejoin="round"/>
<polyline points="552,219 552,223" fill="none" stroke="var(--ink)" stroke-width="1" stroke-linejoin="round"/>
<text x="552" y="225" dy="0.8em" font-size="10.66" fill="var(--ink)" text-anchor="middle">40 %</text>
<text x="257.91" y="225" dy="0.8em" font-size="10.66" fill="var(--ink)" text-anchor="middle">0</text>
<text x="302.09" y="225" dy="0.8em" font-size="10.66" fill="var(--ink)" text-anchor="middle">0</text>
<text x="280" y="243.7" dy="0.8em" font-size="11.700000000000001" fill="var(--muted)" text-anchor="middle">Share of total population</text>
<polygon points="186.79,166.59 257.91,166.59 257.91,214.44 186.79,214.44" fill="var(--c-blog)"/>
<polygon points="302.09,166.59 388.41,166.59 388.41,214.44 302.09,214.44" fill="var(--c-tools)"/>
<text x="280" y="190.52" dy="0.35em" font-size="11.700000000000001" fill="var(--ink)" text-anchor="middle">0-14</text>
<polygon points="68.52,109.62 257.91,109.62 257.91,157.48 68.52,157.48" fill="var(--c-blog)"/>
<polygon points="302.09,109.62 531.93,109.62 531.93,157.48 302.09,157.48" fill="var(--c-tools)"/>
<text x="280" y="133.55" dy="0.35em" font-size="11.700000000000001" fill="var(--ink)" text-anchor="middle">15-64</text>
<polygon points="236.18,52.66 257.91,52.66 257.91,100.51 236.18,100.51" fill="var(--c-blog)"/>
<polygon points="302.09,52.66 328.46,52.66 328.46,100.51 302.09,100.51" fill="var(--c-tools)"/>
<text x="280" y="76.58" dy="0.35em" font-size="11.700000000000001" fill="var(--ink)" text-anchor="middle">65+</text>
<polyline points="257.91,219 161.92,219 161.92,162.03 80.29,162.03 80.29,105.07 232.49,105.07 232.49,48.1 257.91,48.1" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
<polyline points="302.09,219 406.65,219 406.65,162.03 495.58,162.03 495.58,105.07 329.78,105.07 329.78,48.1 302.09,48.1" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
<polygon points="8,263.4 20,263.4 20,273.4 8,273.4" fill="var(--c-blog)"/>
<text x="24" y="268.4" dy="0.35em" font-size="11.700000000000001" fill="var(--ink)" text-anchor="start">Lesvos refugees</text>
<polyline points="136.53,262.4 136.53,274.4" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
<text x="142.53" y="268.4" dy="0.35em" font-size="11.700000000000001" fill="var(--ink)" text-anchor="start">Lesvos native</text>
<text class="fibub-mark" x="556" y="296" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The 1928 refugee population of Lesvos (bars) and the native population of the same prefecture (outline), drawn by the Population pyramid tool from the paper’s three broad age shares. Each half is a share of that population’s own total. The split between men and women inside each age group is ours, from the group’s overall sex ratio; the paper publishes no age-by-sex table.</figcaption></figure>
<!-- /fig:pyramid -->

**Step 1: all twelve dependency ratios and all twelve ageing indices survive.** The age shares are printed to 0.1 %, which leaves each ratio some room: the Lesvos total dependency ratio, for instance, can be anywhere from 63.88 to 64.32 depending on what was rounded away. Every printed value falls inside its own window, and the largest single gap is 0.13 (Samos refugees, 46.13 against the printed 46.0).

| Population | Dependency ratio, paper | From the tool | Ageing index, paper | From the tool |
|---|---|---|---|---|
| Lesvos, total | 64.1 | 64.10 | 27.2 | 27.36 |
| Lesvos, refugees | 49.0 | 49.03 | 30.5 | 30.56 |
| Lesvos, native | 68.4 | 68.35 | 26.6 | 26.48 |
| Samos, total | 63.2 | 63.13 | 26.2 | 26.06 |
| Samos, refugees | 46.0 | 46.13 | 28.4 | 28.46 |
| Samos, native | 65.1 | 65.02 | 26.0 | 25.88 |
| Chios, total | 67.7 | 67.79 | 29.1 | 29.07 |
| Chios, refugees | 54.5 | 54.40 | 45.6 | 45.45 |
| Chios, native | 70.7 | 70.65 | 26.7 | 26.61 |
| Greece, total | 61.4 | 61.45 | 18.2 | 18.32 |
| Greece, refugees | 48.1 | 48.15 | 18.9 | 19.05 |
| Greece, native | 64.4 | 64.47 | 18.1 | 18.07 |

**Step 2: the tables agree with each other.** Two checks the paper does not state. First, the refugee and native populations add up to the published total exactly, in all four areas. Second, each area's total age shares should be the population-weighted average of its refugee and native shares. They are: on Lesvos the mix gives 30.71, 60.96 and 8.34 % against the printed 30.7, 61.0 and 8.4, and the mixed dependency ratio is 64.05 against the printed 64.1. The same holds for Samos, Chios and Greece, every share within 0.04 points. Tables 5 and 10 to 13 of the paper were computed from the same underlying counts, as they should be.

**Step 3: splitting the dependency ratio tells the real story.** A single dependency ratio hides what is happening, because children and old people both count as "dependants". The tool splits it. On Lesvos, the native ratio of 68.4 is 54.0 children plus 14.3 old people per 100 of working age; the refugee ratio of 49.0 is 37.6 plus 11.5. So the refugees' lower ratio is almost entirely about missing children, not about having fewer old people. Chios is the exception that proves the point: its refugees have the **highest old-age dependency of any group in the study**, 17.0 per 100, against 14.9 for the natives beside them, and 11.0 % of the refugee population is 65 or over, against 5.2 % for refugees nationally. Whatever happened to the people who reached Chios, it left an unusually old group.

**Step 4: what the tool cannot do with three age groups.** The tool also reports a median age, found by interpolating inside the group the middle person falls in. Here that group is always 15-64, fifty years wide, and the interpolation spreads people evenly across it. The result is a median that is too high: for all twelve populations it comes out 0.1 to 2.8 years *above* the mean age the paper reports, when in a young, growing population the median should sit below the mean. The ranking is still right (refugees older in every area, Chios refugees oldest at 34.9), but the number itself is an artefact of the coarse groups. With five-year groups the same routine gives a median to within a few months.

<!-- fig:median -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Twelve populations: the paper’s mean age on the x-axis, the median age the tool works out from three broad age groups on the y-axis. Every point sits above the dashed one-to-one line, by 0.6 to 2.7 years." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Grouped median age against the paper’s mean age</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Grouped median age against the paper’s mean age</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">28</text><line x1="58" x2="546" y1="201.5" y2="201.5" style="stroke:var(--line)"/><text x="52" y="205.5" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">32</text><line x1="58" x2="546" y1="100.5" y2="100.5" style="stroke:var(--line)"/><text x="52" y="104.5" text-anchor="end" style="fill:var(--muted)">34</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">36</text><line x1="119" x2="119" y1="252" y2="256" style="stroke:var(--muted)"/><text x="119" y="269" text-anchor="middle" style="fill:var(--muted)">28</text><line x1="241" x2="241" y1="252" y2="256" style="stroke:var(--muted)"/><text x="241" y="269" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="363" x2="363" y1="252" y2="256" style="stroke:var(--muted)"/><text x="363" y="269" text-anchor="middle" style="fill:var(--muted)">32</text><line x1="485" x2="485" y1="252" y2="256" style="stroke:var(--muted)"/><text x="485" y="269" text-anchor="middle" style="fill:var(--muted)">34</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Mean age in the paper (years)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Median age from the tool (years)</text><circle cx="253.2" cy="179.8" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="234.9" cy="182.8" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="265.4" cy="184.1" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="119" cy="216.7" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="411.8" cy="113.6" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="295.9" cy="111.1" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="478.9" cy="77.8" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="180" cy="155.8" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="228.8" cy="199.7" r="4.5" style="fill:var(--ink);opacity:1"/><circle cx="228.8" cy="190.6" r="4.5" style="fill:var(--ink);opacity:1"/><circle cx="222.7" cy="207.6" r="4.5" style="fill:var(--ink);opacity:1"/><circle cx="106.8" cy="231.3" r="4.5" style="fill:var(--ink);opacity:1"/><path d="M58 277.3L546 75.3" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Total</text><circle cx="125" cy="36" r="4" style="fill:var(--c-tools)"/><text x="136" y="40" style="fill:var(--muted)">Refugees</text><circle cx="208.6" cy="36" r="4" style="fill:var(--ink)"/><text x="219.6" y="40" style="fill:var(--muted)">Native</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The median age the tool interpolates inside three broad age groups, against the mean age the paper reports for the same twelve populations. The ranking is reproduced, but a three-group median is biased upwards: with only 0-14, 15-64 and 65+ to work with, the 15-64 group is spread evenly over fifty years.</figcaption></figure>
<!-- /fig:median -->

The sex ratios the tool reports (89.8, 82.4, 91.8 and so on) match the paper exactly, but that is arithmetic, not a check: we built the pyramids using those very ratios. We report them only to show the pyramids were built from the paper's own numbers.

## How we made the graphs

Both figures and every number come from `scripts/blog-figures/refugee-native-age-structure-dependency-ratios-aegean-1928.mjs` in fibub's public code. It calls `parsePyramid`, `pyramidStats`, `groupedMedian` and `drawPyramid` from `src/lib/sci/pyramid.ts`, the maths behind the [[population-pyramid]]. Figure 1 is drawn by `drawPyramid` itself through the same SVG painter the tool uses for its downloads, so it is the tool's own picture with the page's colours.

The inputs are the paper's Table 5 (populations), Tables 10 to 13 (age shares, dependency ratios, ageing indices), Table 9 (sex ratios) and Table 8 (mean ages), all for 1928. The only things we added are the normalisation of shares that print to 99.9 or 100.1 %, the assumption that each age group has its population's overall sex ratio, and the rounding windows, which the script works out by moving every printed share by ±0.05.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/population-pyramid.mjs`, which pins the measures against an independent pandas and NumPy calculation:

- On an eighteen-group example year, the tool must give a total of 86,310 people, a sex ratio of 98.0041, a child dependency ratio of 25.9092, an old-age ratio of 23.5712 and a median age of 38.5506, with the male and female medians at 37.6258 and 39.4841.
- Switching "old age starts at" to 60 must change the old-age ratio to 35.0303, and a table whose groups do not begin at 15 and 65 must report that dependency ratios cannot be worked out rather than inventing them.
- A hand case pins the interpolation: ten people aged 0-9 and ten aged 10-19 must give a median of exactly 10.
- New with this article: the twelve 1928 populations rebuilt from the paper's shares must give total dependency ratios of 64.10, 49.03, 68.35, 63.13, 46.13, 65.02, 67.79, 54.40, 70.65, 61.45, 48.15 and 64.47, and a Chios refugee old-age ratio of 17.00.

## Check it yourself

On the [[population-pyramid]], in the *Population by age and sex* card:

1. Put `Lesvos refugees` in *Name*, and replace the age table with these four lines (tab or comma separated), the refugee counts our script works out from the paper's shares:
   `Age, Male, Female`
   `0-14, 3716, 4510`
   `15-64, 9895, 12008`
   `65+, 1135, 1378`
2. Leave *Compare with a second year or area* ticked, put `Lesvos natives` in the second *Name*, and paste:
   `Age, Male, Female`
   `0-14, 19806, 21575`
   `15-64, 36651, 39924`
   `65+, 5245, 5713`
3. Leave *Show bars as* on **% of each total** and *Old age starts at* on **65**.
4. The summary table gives, for the refugees, a sex ratio of **82.4**, a young dependency of **37.6**, an old-age dependency of **11.5** and a total of **49.0**, against **54.0**, **14.3** and **68.3** for the natives. The paper prints 49.0 and 68.4; the second is 68.35 before rounding, and whole-number counts push it to 68.3.
5. The headline line reads *median age 33.5 (Lesvos natives: 30.1)*. Compare it with the paper's mean ages of 32.8 and 29.8, and with Step 4 above, before quoting it.

## What researchers can use it for

- **Audit a published dependency ratio** in seconds: the ratio is fixed by the three age shares, so any paper that prints them has published its own check.
- **Work out how much rounding allows.** Shares given to 0.1 % leave a ratio about ±0.22 of room here; a disagreement smaller than that is not a disagreement.
- **Split a ratio before interpreting it.** Two populations with the same total dependency ratio can be opposites, one full of children and the other of pensioners, and the tool's young and old columns say which.
- **Compare two populations in one picture** with the overlay, which is how a refugee and a host population are best shown.
- **Know when your groups are too coarse**: three age groups give a usable dependency ratio but an unreliable median age, as Figure 2 shows.

## The fine print

- The paper publishes no age-by-sex table, so the split of each age group between men and women is **ours**, from the group's overall sex ratio. It affects only the picture and the medians by sex.
- Our counts come from rounded percentages, so they are accurate to roughly the nearest hundred people in Lesvos and the nearest few thousand for Greece.
- "Refugee" here is the 1928 census category, which counted people who arrived after 1922 and their household members as the census recorded them.
- A dependency ratio counts people by age, not who worked or who depended on whom. In 1928 Greece many under-15s worked and many over-65s kept farming.
- The paper's running text also quotes sex ratios for the islands that we could not match to the values in its Table 9; a reader using those numbers should check which population and year each refers to.
- Age heaping, common in early twentieth-century censuses, would move all of these measures a little, and three broad groups hide it completely.
