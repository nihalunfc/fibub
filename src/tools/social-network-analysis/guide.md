---
name: Social network analysis
num: 749
shelf: science
section: sociology-and-survey-research
title: "Social network analysis from survey name lists: centrality, density, communities and network drawing (free)"
summary: "Turn 'name your friends' survey answers or an edge list into a network: in- and out-degree, betweenness, closeness and eigenvector centrality, density, reciprocity, components, Louvain communities and a force-directed drawing. Matches networkx; nothing leaves your browser."
status: live
ads: false
order: 749
icon: link
works: offline
updated: 2026-11-09
related: [data-cleaner, plot-maker, sample-size, reliability-analysis, kinship-diagram]
sources:
  - "Methods: Freeman (1977, 1978) degree and betweenness, Brandes (2001) algorithm, Wasserman and Faust (1994) closeness, Bonacich (1972) eigenvector centrality, Blondel et al. (2008) Louvain communities, Fruchterman and Reingold (1991) layout. Example data made up."
flow:
  - { icon: table, label: "Name lists" }
  - { icon: link, label: "Network" }
  - { icon: target, label: "Centrality" }
  - { icon: download, label: "CSV" }
---

## What it does

Sociometric surveys ask people to name others: friends, people they go to for advice, colleagues they work with. This tool turns those answers into a network and measures it, in your browser:

- **Reads** name lists (each respondent followed by the people they named) or a plain edge list (source and target).
- **Builds** a directed network (A named B), or an undirected one if you untick the direction.
- **Measures every person**: in-degree (how often named), out-degree, degree centrality, betweenness (brokerage), closeness and eigenvector centrality.
- **Measures the whole network**: density, reciprocity (share of ties that are returned), weak and strong components.
- **Finds communities** with the Louvain method and shows the modularity.
- **Draws** the network with a force-directed layout: bigger dots are named more often, colours are communities, arrows show direction.

Download the measures as CSV, the drawing as SVG, or a full report as an image, PDF or Word file.

## How to use it

1. Choose **Name lists** or **Edge list**, then paste your data or open a CSV or Excel file. Untick **First row is a header** if your data has no header.
2. Names must be spelled the same way each time; spaces at the ends are ignored. Someone who is named but did not answer still becomes part of the network.
3. Leave **Ties have a direction** ticked for "who named whom" data. Untick it for ties that are mutual by nature, such as co-authorship.
4. Sort the table by any measure. Use **Try another layout** if the drawing is crowded; the measures do not change.

## Worked example (made-up data)

The sample is a made-up class survey: 20 pupils each named two to five friends, and two more pupils (Uma and Vic) were named but did not answer. That gives 22 people and 68 directed ties: density 0.147 and reciprocity 0.353 (12 mutual pairs). **Hugo** is named most often (in-degree 6) and has the highest eigenvector centrality (0.473) and closeness (0.452). **Sam** has the highest betweenness (0.237): he links his friendship group to another. The Louvain method finds 3 communities (modularity 0.524) matching three friendship groups: Ava, Ben, Cara, Dev, Ella, Finn, Gita and Hugo; Iris, Jon, Kai, Lena, Milo, Nora and Omar; and Pia, Quinn, Rosa, Sam, Tara, Uma and Vic.

## How it was checked

Degree, in-degree and out-degree centrality, betweenness, closeness, eigenvector centrality, density, reciprocity and the components match networkx exactly, for the directed and the undirected network. The Louvain communities reach the same modularity as the best of 20 runs of networkx's louvain_communities, and the modularity calculation itself matches networkx.

## Privacy

Network surveys collect names, which are personal data. This page never uploads or stores anything: the data stays in your browser tab and is gone when you close it. Where you can, replace names with codes before analysis.

## Frequently asked questions

**Why do people with no answers have an out-degree of 0?** They were named but did not fill in the survey. Missing answers lower density and closeness, so report the response rate.

**Are tie strengths used?** No. Every tie counts once and repeated ties are counted once, as the tool reports.

**How big a network can it handle?** Up to 2,000 people; names are hidden in the drawing above 150.
