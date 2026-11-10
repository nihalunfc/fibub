---
name: Graph algorithms
num: 556
shelf: science
section: discrete-maths-and-graph-theory
title: "Graph algorithms"
summary: "Draw a graph or paste an edge list (weighted, directed or not) and run Dijkstra, Bellman-Ford, breadth- and depth-first search, Kruskal and Prim spanning trees, maximum flow with the minimum cut, greedy and DSatur colouring, degree, betweenness and closeness centrality, or a topological order. Results are highlighted on the drawing. Checked against networkx."
status: live
ads: true
order: 556
icon: link
works: offline
updated: 2026-11-09
related: [network-metrics, transportation-assignment, combinatorics-calculator, sql-playground, plot-maker, logic-simplifier, vehicle-routing, project-scheduler, matrix-calculator, social-network-analysis]
sources:
  - "Standard textbook algorithms (Dijkstra, Bellman-Ford, BFS, DFS, Kruskal, Prim, Edmonds-Karp, greedy and DSatur colouring, Brandes betweenness, Kahn's topological sort, Fruchterman-Reingold layout), written by fibub."
  - "Checked against networkx 3.7 (BSD licence) on the examples and on 100 random graphs, directed and undirected: distances, search orders, spanning tree weights, flow values, colourings, centralities and topological orders all equal."
  - "The road, pipe and task examples are made up for this tool."
flow:
  - { icon: pencil, label: "Draw graph" }
  - { icon: sliders, label: "Pick method" }
  - { icon: eye, label: "See result" }
  - { icon: download, label: "Download" }
---

## What it does

A graph is a set of points (nodes) joined by lines (edges): towns and roads, computers and cables, tasks and the tasks they depend on, people and who knows whom. This tool lets you draw one or paste it as a list, then run the classic graph algorithms from a discrete maths or algorithms course and see the answer drawn on the graph:

- **Shortest path** with **Dijkstra** (weights of 0 or more) or **Bellman-Ford** (negative weights allowed; it reports a negative cycle if there is one).
- **Breadth-first** and **depth-first search** from a start node, with the visiting order and the search tree.
- **Minimum spanning tree** by **Kruskal** or **Prim**: the cheapest set of edges joining every node.
- **Maximum flow** (Edmonds-Karp) from a source to a sink, with the **minimum cut** that proves it.
- **Colouring**: greedy (largest degree first) and **DSatur**, so no two neighbours share a colour.
- **Centrality**: degree, betweenness and closeness, normalised to 0–1.
- **Topological order** of a directed graph, or the cycle that makes one impossible.

Everything runs in your browser. Nothing is uploaded.

Measure how central each node is with [[network-metrics]], and plan real delivery rounds with [[vehicle-routing]].

## How to use it

1. Pick an example, or type an edge list: one edge per line as `from to weight`, for example `A B 7`. Leave the weight out and it counts as 1. A line with one name adds a node with no edges. You can also open a CSV, TSV, text or Excel file with up to three columns.
2. Tick **Directed** if each edge goes one way only (from → to). Leave it unticked for two-way edges.
3. Or draw: choose **Add node** and tap an empty spot, **Add edge** and tap two nodes (the edge gets the weight in the box), **Delete** to remove a node or an edge, and **Move** to drag nodes about. The edge list updates as you draw, so you can copy or download it.
4. Choose the algorithm under **Run** and, where it needs them, the start and end (or source and sink).
5. Read the headline answer, the table and the drawing. Download the table as CSV, or the whole result with the picture as an image, PDF or Word file.

## What each option does

- **Weights** are lengths for shortest paths and centrality, costs for spanning trees and capacities for maximum flow.
- **Spanning trees and colouring** ignore the direction of edges. If the graph is in several pieces, you get a spanning forest.
- **Betweenness** is the share of shortest routes between other pairs that pass through a node; **closeness** is based on how far the node is from the rest, scaled for graphs in pieces as networkx does (for a directed graph it counts routes into the node).
- **Topological order** takes the earliest-listed node first when several are ready, so the answer is always the same.

## Worked example

Load the road network (seven places, weights in km). Dijkstra from A to G gives **22 km along A → D → F → G**, and the table lists every place's distance from A: D 5, B 7, F 11, E 14, C 15, G 22. Kruskal and Prim both give a **minimum spanning tree of weight 39** with the edges A–B, A–D, B–E, C–E, D–F and E–G. Both colourings need **3 colours**. By betweenness, **E is the most central (0.233)**. Switch to the pipe network: the **maximum flow from S to T is 19**, and the minimum cut (the dashed red edges) has the same capacity, 19.

## What it does not do

It is for learning and for small to medium graphs (up to 2,000 nodes and 20,000 edges, drawn up to 300). It does not handle several edges between the same pair (the last weight is used), loops, or minimum-cost flow. Greedy colouring does not promise the fewest colours possible. For network statistics such as clustering, PageRank and communities, use the network metrics tool.

## Frequently asked questions

**Why does Dijkstra refuse my graph?** It needs weights of 0 or more. Use Bellman-Ford for negative weights.

**Why "negative cycle"?** If going round a loop adds up to less than zero, every trip round makes a route shorter, so no shortest route exists. In an undirected graph a single negative edge is already such a loop.

**Do my answers match networkx?** Yes: they were checked against networkx on the examples and on 100 random graphs.

**Is my graph stored?** No. Nothing is stored or sent anywhere.
