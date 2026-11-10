---
name: Cache simulator
num: 576
shelf: science
code: T404
section: computer-science
title: "Cache simulator"
summary: "Run an address trace (pasted, from a file, or generated: array walks, matrix multiply loop orders, random) through one or two cache levels. See every hit and miss with its tag, set and offset, compulsory, capacity and conflict misses, the cache contents at any step, and the average memory access time."
status: live
ads: true
order: 576
icon: table
works: offline
updated: 2026-11-09
related: [float-inspector, big-o-plotter, algorithm-visualiser, toy-compiler]
sources:
  - "Cache organisation, LRU and FIFO replacement, the compulsory/capacity/conflict classification (Hill) and the AMAT formula are standard computer architecture, as in Hennessy and Patterson's textbooks."
  - "Checked against a separate Python simulator written for this tool: hits, the three kinds of miss, level 2 hits and misses and total cycles agree on 56 runs (7 traces × 8 one- and two-level designs covering direct-mapped, 2, 4 and 8-way and fully associative caches with LRU, FIFO and random replacement), plus hand-worked cases."
  - "The default cache sizes and timings are round example numbers, not those of any real processor."
flow:
  - { icon: pencil, label: "Trace" }
  - { icon: sliders, label: "Caches" }
  - { icon: table, label: "Hit or miss" }
  - { icon: clock, label: "AMAT" }
---

## What it does

A processor's caches keep recently used memory close by, and whether a program runs fast often depends on how well its memory accesses fit them. This simulator runs a list of memory addresses (a trace) through a cache you design and shows what happens to every access.

- **Placement:** direct-mapped (each block has one place), 2, 4, 8 or 16-way set associative, or fully associative (anywhere).
- **Replacement:** LRU (throw out the least recently used block), FIFO (the block that arrived first) or random.
- **Two levels:** an optional level 2 cache behind level 1, then main memory, each with its own time in cycles.
- **Every access:** the address split into tag, set index and offset, hit or miss, the kind of miss, the block thrown out, and its cost in cycles.
- **Kinds of miss** (the "three Cs"): compulsory (the first time a block is used), capacity (a fully associative LRU cache of the same size would have missed too) and conflict (the rest: caused by blocks fighting over the same set).
- **AMAT**, the average memory access time, from the simulation and from the textbook formula.
- **Cache contents** after any access, and a table of the **same trace on other level 1 designs**.

Compare how whole algorithms grow with the [[big-o-plotter|Big-O plotter]], and see how numbers are stored in memory with the [[float-inspector|floating point inspector]].

## How to use it

1. Choose where the addresses come from:
   - **Matrix multiply:** C = A × B for n × n matrices stored row by row, in the loop order you choose. Each step of the innermost loop reads A[i][k], B[k][j] and C[i][j].
   - **Walk through an array:** every stride-th element, several passes.
   - **Random addresses** in a range.
   - **My own trace:** paste addresses or open a CSV or text file (one address per line, decimal or hex; R and W letters are ignored). Up to 100,000 accesses.
2. Set the level 1 cache: size and block size in bytes (powers of 2), placement, replacement and hit time. Tick **Level 2 cache** to add one, and set the memory time.
3. Read the AMAT, the hit and miss counts and the formula. The chart shows the miss rate as the trace runs.
4. Scroll through **Every access**, or type an access number to see the level 1 contents at that moment (the set used is shaded; the block just placed is bold).
5. Save every access as CSV, or the summary as an image, PDF or Word file.

## Worked example

The defaults multiply two 16 × 16 matrices of 8-byte numbers in i j k order: 12,288 accesses. Level 1 is 1,024 bytes with 32-byte blocks, 2-way set associative with LRU and a 1-cycle hit (16 sets × 2 ways). Level 2 is 8,192 bytes with 64-byte blocks, 4-way, 10 cycles; memory takes 100 cycles.

The page shows **AMAT 5.814 cycles**. Level 1 hits 7,332 times (59.7 %) and misses 4,956 times: 192 compulsory, 960 capacity and 3,804 conflict misses. Level 2 hits 4,860 of its 4,956 lookups, a local miss rate of 1.94 %. Changing the loop order to **i k j**, which walks B and C along rows, drops the AMAT to 3.295 cycles; **j k i**, which walks down columns, raises it to 8.656.

## Tips

- Conflict misses fall as associativity rises; the comparison table shows how much.
- A stride of at least one block (for example 16 four-byte elements with 64-byte blocks) uses only one element per block fetched, so on the first pass every access misses.
- The "Kinds of miss" are for level 1 only.

## What it does not do

It models one stream of accesses on one core: no separate instruction and data caches, no prefetching, no write-back traffic or dirty blocks, no multiple cores or coherence, and level 2 is neither inclusive nor exclusive (a block can be in either level). Times are simple fixed cycle counts per level.

## FAQ

**Why can a fully associative cache have more misses than a 2-way one?** LRU is not always the best choice: with a loop slightly larger than the cache, LRU throws out exactly the block needed next. With the default level 1 (1,024 bytes in 32-byte blocks), walk through 264 elements of 4 bytes with a stride of 8 (one access per block, 33 blocks, one more than fit) for 4 passes: fully associative misses all 132 times, 2-way 42 times and direct-mapped 39 times.

**Is my trace sent anywhere?** No. The simulation runs in your browser and the page keeps working offline.
