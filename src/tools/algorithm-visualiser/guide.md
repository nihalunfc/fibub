---
name: Algorithm visualiser
num: 573
shelf: science
section: computer-science
title: "Algorithm visualiser: sorting, binary search and dynamic programming step by step, with comparison and swap counts"
summary: "Watch bubble, insertion, selection, merge, quick, heap, counting and radix sort work on your own list, one step at a time, with exact comparison, swap and write counts. Also linear and binary search, and the tables for longest common subsequence, edit distance and the 0/1 knapsack."
status: live
ads: true
order: 573
icon: chart
works: offline
updated: 2026-11-09
related: [big-o-plotter, regex-fsm-visualiser, graph-algorithms, sql-playground]
sources:
  - "Algorithms as described in standard textbooks (general computer science); the quicksort is the Lomuto partition with the last value as pivot, as in Cormen, Leiserson, Rivest and Stein, Introduction to Algorithms."
  - "Checked against separate Python implementations written for this tool: sorted output and comparison, swap and write counts for all eight sorts on 32 lists, linear and binary search results and counts, LCS and edit distance on 16 pairs (including the textbook ABCBDAB / BDCABA and kitten / sitting), and knapsack optima against an integer linear program solved by SciPy (milp)."
  - "The example list is the one in the textbook merge sort figure; the camping items are made up for this tool."
flow:
  - { icon: pencil, label: "Your list" }
  - { icon: sliders, label: "Algorithm" }
  - { icon: eye, label: "Step" }
  - { icon: table, label: "Counts" }
---

## What it does

Algorithms are much easier to understand when you can watch them. This visualiser runs a classic algorithm on your own data and records every single step: each comparison of two values, each swap, each value written. You then play it like a video, step forwards and backwards, or drag the slider to any point, and the counters show exactly how much work has been done so far.

- **Sorting:** bubble, insertion, selection, merge, quick, heap, counting and radix sort. The list is drawn as bars; blue bars are being compared, amber bars are being swapped, the second colour shows a write or read, and green bars are in their final place.
- **Searching:** linear search and binary search, with the part of the list that is still possible shown and the rest greyed out.
- **Dynamic programming:** the table for the longest common subsequence (LCS) of two words, the edit (Levenshtein) distance, and the 0/1 knapsack, filled one cell at a time, showing which earlier cells each one uses, then the trace back that reads off the answer.

Below the player, a table runs **every sorting method on the same list**, so you can see that, for example, selection sort always makes n(n − 1)/2 comparisons while insertion sort makes very few on a nearly sorted list.

## How to use it

1. Choose an algorithm.
2. Type a list of numbers, or set **How many** and **Order** (random, nearly sorted, reversed, few different values or already sorted) and press **Make a list**. Up to 100 numbers.
3. Press **Play**, or **Step ▶** to go one step at a time. **◀** goes back, **⏮** and **⏭** jump to the start and the end, and the slider moves to any step. **Speed** sets how fast Play runs.
4. Read the sentence under the picture: it says what the last step did, for example "Compare 27 and 38: left > right? Yes."
5. Save the **step log** (every step with the running counts and the list after it) or the **sorting comparison** as CSV, or the summary as an image, PDF or Word file.

For **binary search**, keep "Sort the list first" ticked: binary search only works on a sorted list. For the **knapsack**, type one item per line as name, weight, value, with whole-number weights, and a capacity up to 60.

## How the counting works

- A **comparison** is one test between two values, such as "is the left value larger than the right?", or a value against the pivot. In searches, each value looked at counts once (binary search counts one three-way comparison per middle value).
- A **swap** exchanges two places; swapping a place with itself is not done and not counted.
- A **write** puts one value into the list. Merge sort copies values back from a spare list, and counting and radix sort write values in order, so they show writes instead of swaps. Counting and radix sort also show **reads**: each time a value is looked at to tally it.

Insertion sort here moves each value left by swapping neighbours, so its swap count is exactly the number of pairs that were out of order (the "inversions").

## Worked example

The starting list is 38, 27, 43, 3, 9, 82, 10, the list in the textbook picture of merge sort. With **Merge sort** the page shows "Sorted: 3, 9, 10, 27, 38, 43, 82" after 14 comparisons and 20 writes. The comparison table shows, for the same seven numbers:

| Method | Comparisons | Swaps | Writes |
|---|---|---|---|
| Bubble sort | 20 | 11 | 0 |
| Insertion sort | 15 | 11 | 0 |
| Selection sort | 21 | 5 | 0 |
| Merge sort | 14 | 0 | 20 |
| Quicksort | 11 | 5 | 0 |
| Heap sort | 19 | 15 | 0 |

Bubble and insertion sort both make 11 swaps, because the list has 11 pairs out of order. Selection sort makes 7 × 6 / 2 = 21 comparisons, as it always does for seven values.

**Binary search** for 43 in the same list (sorted to 3, 9, 10, 27, 38, 43, 82) looks at the middle value 27 first, rules out the left half, then finds 43 at place 5 after 2 comparisons. Linear search on the unsorted list needs 3.

**LCS** of ABCBDAB and BDCABA gives "Length 4: BCBA", and **edit distance** turns kitten into sitting with 3 edits: change k to s, change e to i, insert g. The **knapsack** example packs Stove, Camera and Food for the best value of 165 with a weight of exactly 10.

## Tips

- Try **Quicksort** on an already sorted list of 30 numbers: the last value is always the largest, so every split is lopsided and it makes 435 comparisons, the O(n²) worst case.
- Try **Insertion sort** on a nearly sorted list: it needs barely more than n comparisons.
- Places are numbered from 0, as array indices are in most programming languages.

## What it does not do

It shows one textbook version of each algorithm. Real libraries use hybrids (Python's Timsort, C++'s introsort) that are faster but harder to watch, and other quicksort pivots (middle value, random) give different counts. Counting and radix sort take whole numbers of 0 or more only.

## FAQ

**Why do my counts differ from my lecture notes?** Small changes, such as stopping bubble sort early or swapping a value with itself in quicksort, change the counts. The rules used here are listed above, and the step log shows every step so you can follow them.

**Is anything sent anywhere?** No. Everything runs in your browser, and it keeps working without internet once the page is open.
