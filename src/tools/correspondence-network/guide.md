---
name: "Correspondence network visualiser"
num: 417
shelf: science
section: digital-humanities
title: "Correspondence network visualiser: who wrote to whom, go-betweens and circles of letter writers"
summary: "Paste or open a list of letters (sender, recipient, date, place) and see the network of correspondents: a force-directed picture, letters per person, degree, strength, betweenness, communities by modularity, and a date filter. CSV and report downloads; nothing is uploaded."
status: live
ads: false
order: 417
icon: link
works: offline
updated: 2026-11-09
related: [stylometry-delta, topic-modeller, historic-calendar-converter]
sources:
  - "Methods: U. Brandes (2001), \"A faster algorithm for betweenness centrality\", Journal of Mathematical Sociology 25(2); A. Clauset, M. Newman and C. Moore (2004), \"Finding community structure in very large networks\", Physical Review E 70, 066111; M. Newman (2004), weighted modularity; T. Fruchterman and E. Reingold (1991), force-directed layout."
  - "Checked against networkx on the example and 30 random letter networks: degree, strength, betweenness and modularity identical (to 1e-15); greedy_modularity_communities gave the same communities in 30 of 31, and in the other our joining order found a slightly higher modularity."
  - "The example letters and people are made up for this tool."
flow:
  - { icon: table, label: "Letters" }
  - { icon: link, label: "Network" }
  - { icon: target, label: "Go-betweens" }
  - { icon: download, label: "CSV" }
---

## What it does

Letters are one of the richest sources for history: who wrote to whom, how often, and when. This tool turns a list of letters into a **network of correspondents** and measures it:

- a **picture** of the network, laid out so that people who wrote to each other sit close together;
- for each person, the letters **sent** and **received**, **degree** (how many correspondents), **strength** (all letters in and out) and **betweenness** (how often they sit on the shortest route between two other people, which marks go-betweens and brokers);
- **communities**: circles of people who wrote more among themselves than to others, found by greedy modularity maximisation, with the **modularity** score;
- a **date filter** to see how the network looked in any period.

Everything runs in your browser and your list is never uploaded.

## How to use it

1. Paste your letters, one per row, with sender, recipient, date and place, or press **Open a file** for a CSV, TSV or Excel sheet. A first row of column names (sender or from, recipient or to, date, place) can be in any order. Without one, the columns are read in that order.
2. Write each person's name the same way every time. "J. Reid" and "James Reid" count as two people.
3. Type a **From date** and a **To date** (1822, 1822-06 or 1822-06-15) to look at one period. Undated letters are left out while the filter is on, and the page says how many.
4. Choose which **names** to print on the picture, and change the **layout seed** if names overlap. The seed only moves the picture; the measures do not change.
5. Download the people and the pairs as CSV, or the whole report as an image, PDF or Word file.

## Worked example

Press **Use the example**. It loads 35 made-up letters from 1821 to 1825 between 8 invented people: a family (Anna, Clara and Henry Price, and their friend Martha Lowe) and a circle of naturalists (Edward Moss, James Reid, Sarah Hart and Thomas Webb). The page shows **8 people, 35 letters, 2 communities**, with a modularity of 0.296. Edward Moss wrote or received the most letters (15) and has the highest betweenness, 0.595; Henry Price, who writes to both his family and Edward Moss, is next at 0.571. They are the two bridges between the circles. Anna and Clara exchanged 7 letters, the most of any pair.

Now type 1822 in **From** and 1823 in **To**. Only 18 letters are left, Thomas Webb drops out, and Henry Price becomes the main go-between (0.600): in those years he is the only link between the two groups.

## FAQ

**Which way do letters count?** Sent and received are kept for each person and each pair, but the network itself is undirected: a pair's line width is all the letters between them, either way.

**How is betweenness worked out?** On shortest paths counted in steps (who wrote to whom), not weighted by the number of letters, and scaled from 0 to 1 as in the networkx library. People in separate, unconnected groups do not count as paths.

**What does modularity mean?** It compares letters inside communities with what you would expect by chance; above about 0.3 usually means clear circles. Communities in small networks are only a guide.

**Is my data uploaded?** No. It stays on your device.
