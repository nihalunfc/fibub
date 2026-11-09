---
name: Network metrics
num: 588
shelf: science
section: complex-systems-and-network-science
title: "Network analysis online: degree distribution, clustering, diameter, assortativity, PageRank and communities from an edge list"
summary: "Open or paste an edge list and get the network's density, components, diameter and average path length, clustering and transitivity, degree assortativity, PageRank, Louvain communities with modularity, a log-log degree distribution and a drawing of small networks. Checked against networkx. Nothing is uploaded."
status: live
ads: true
order: 588
icon: chart
works: offline
updated: 2026-11-09
related: [graph-algorithms, plot-maker, data-cleaner]
sources:
  - "Standard network-science measures (density, clustering, transitivity, components, diameter, degree assortativity, PageRank, modularity, the Louvain method of Blondel et al. 2008, Fruchterman-Reingold layout), written by fibub."
  - "Checked against networkx 3.7 (BSD licence) on the example and on 40 random networks: every measure equal to networkx; Louvain modularity close to networkx's (its result depends on node order, as networkx's depends on its random seed)."
  - "The example network of three friend groups is made up for this tool."
flow:
  - { icon: file, label: "Edge list" }
  - { icon: sigma, label: "Measures" }
  - { icon: chart, label: "Degrees" }
  - { icon: table, label: "Nodes" }
---

## What it does

Give it a network as a list of links (who knows whom, which page links to which, which proteins interact, which airports have flights between them) and it works out the standard measures of network science in your browser:

- **Size and density**: nodes, links, average degree, and the share of all possible links that exist.
- **Components**: the separate pieces of the network (weak and strong components for a directed network).
- **Diameter and average path length** of the largest piece: the longest and the typical number of steps between two nodes.
- **Clustering**: each node's clustering coefficient (how many of its neighbours know each other), the average, and the transitivity (share of closed triangles).
- **Degree assortativity**: whether well-connected nodes link to other well-connected nodes (positive) or to poorly connected ones (negative).
- **PageRank**: the importance score Google first used for web pages, with the damping factor you choose.
- **Communities** by the Louvain method, with their **modularity**: how much more densely the groups are linked inside than chance would give.
- A **degree distribution** on log-log axes, and a force-directed **drawing** of networks up to 300 nodes, coloured by community and sized by PageRank.

## How to use it

1. Paste an edge list, one link per line: `Ann Bob`, or `Ann Bob 3` with a weight. Or open a CSV, TSV, text or Excel file of up to three columns (from, to, weight). A header row such as `source,target,weight` is skipped.
2. Tick **Directed** if links go one way (follows, citations, web links).
3. **Use weights** makes heavier links count more in PageRank and communities. Other measures count links, not weights.
4. **PageRank damping** is the chance of following a link rather than jumping to a random node; 0.85 is the usual choice.
5. Read the summary, the drawing, the degree distribution, the community table and the node table, sorted by PageRank. Download the node table or the degree distribution as CSV, or everything as an image, PDF or Word file.

## Worked example

The example is a made-up network of 34 people in three friend groups. The tool reports **34 nodes and 83 links**, density **0.148**, one component, **diameter 5** and an average path length of **2.537** steps. Average clustering is **0.2391** and transitivity **0.1886**. Degree assortativity is **0.137**, slightly assortative. Louvain finds **3 communities with modularity 0.494**, exactly the three groups the example was built from (their names start with A, B and C), and **B1 has the highest PageRank (0.03941)**. All of these match networkx.

## Tips and limits

- Distances, clustering and communities treat links as two-way, even in a directed network. PageRank and assortativity (out-degree of the source against in-degree of the target) use the direction.
- Louvain is a fast heuristic: it finds a good split, not always the best possible one, and the split can change slightly if you reorder the list.
- Repeated links keep the last weight; links from a node to itself are left out.
- It handles up to 5,000 nodes and 50,000 links; large networks can take a few seconds. To run shortest paths, flows or colouring on a network, use the [graph editor with algorithms](/science/graph-algorithms/).

## Frequently asked questions

**Why is assortativity "undefined"?** When every link joins nodes of the same degree (a ring, for example), there is no variation to correlate. networkx gives NaN in the same case.

**Is the degree distribution a power law?** A straight line on the log-log plot is a hint, not proof. Fitting a power law properly needs more care than a straight line through the points.

**Is my data uploaded?** No. Everything runs in your browser and nothing is stored or sent anywhere.
