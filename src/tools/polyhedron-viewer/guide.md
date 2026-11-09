---
name: Polyhedron and tiling viewer
num: 554
shelf: science
section: geometry-and-topology
title: "Polyhedron viewer: Platonic and Archimedean solids, duals, Euler's formula and plane tilings (free)"
summary: "Turn all 5 Platonic and 13 Archimedean solids in 3D, see their duals, and read vertices, edges, faces, V − E + F, vertex configuration, surface area and volume. Also draws the 11 regular and semi-regular plane tilings. PNG, SVG and OBJ downloads."
status: live
ads: true
order: 554
icon: eye
works: offline
updated: 2026-11-09
related: [function-grapher]
sources:
  - "Vertex coordinates from the standard closed-form formulas (sign changes and permutations of numbers built from √2, the golden ratio and the tribonacci constant); the snub dodecahedron is solved numerically as the orbit of one point under the icosahedral rotations. General mathematics; no outside data."
  - "Checked against closed-form volumes for edge 1 and Python scipy.spatial.ConvexHull (volume, area and face count) for all 18 solids."
flow:
  - { icon: pointer, label: "Pick a solid" }
  - { icon: eye, label: "Turn it" }
  - { icon: calculator, label: "V − E + F" }
  - { icon: download, label: "PNG/OBJ" }
---

## What it does

A **polyhedron** is a solid with flat polygon faces. This viewer shows the most symmetrical ones:

- The 5 **Platonic solids** (tetrahedron, cube, octahedron, dodecahedron, icosahedron): every face is the same regular polygon, and the same number of faces meets at every vertex.
- The 13 **Archimedean solids**, from the truncated tetrahedron to the snub dodecahedron: two or more kinds of regular face, arranged the same way around every vertex. The truncated icosahedron is the classic football.

Each solid is built from its vertex coordinates, worked out from exact formulas, not copied from a model file. The edges are the shortest distances between vertices and the faces are traced from the edges, so the counts on the page are computed, not typed in.

The second tab draws the 11 **plane tilings** in which regular polygons meet the same way at every corner: 3 regular ones (triangles, squares, hexagons) and 8 semi-regular ones.

## How to use it

1. Choose a **Solid**. **Drag** it to turn it in any direction, or tick **Spin**. **Reset the turn** puts it back.
2. **Show** the solid, its **dual**, or both together. The dual has a vertex for every face and a face for every vertex. Duals of the Archimedean solids are the Catalan solids, such as the rhombic dodecahedron.
3. Set the **Edge length** to scale the surface area, volume and radii (area grows with the square, volume with the cube).
4. Download a **PNG** or **SVG** picture, an **OBJ** 3D model (for Blender, a 3D printer slicer or a game engine), or the **vertices** as CSV.
5. In **Plane tilings**, choose one of the 11. Tick **Show the repeating cell** to see the parallelogram that repeats to fill the plane.

## What the numbers mean

- **V − E + F**, the Euler characteristic, is always 2 for these solids (and for any convex polyhedron).
- **At every vertex** lists the faces round a vertex. 3.4.3.4 means triangle, square, triangle, square.
- **Angle defect**: 360° minus the face angles at a vertex. Descartes' theorem says the defects of a convex polyhedron add up to exactly 720°.
- **Circumradius** is the distance from the centre to each vertex; **midradius** is the distance to the middle of each edge (the dual is made by reflecting in the sphere of this radius).

## Worked example

The opening solid is the truncated icosahedron. With edge length 1 the page shows 60 vertices, 90 edges and 32 faces (12 pentagons and 20 hexagons), 60 − 90 + 32 = 2, and 5.6.6 at every vertex. The angle defect is 360° − (108° + 120° + 120°) = 12° at each of the 60 vertices: 720°. The surface area is 72.6073, the volume 55.2877, which matches the exact formula (125 + 43√5)/4, the circumradius 2.47802 and the midradius 2.42705. Its dual, the pentakis dodecahedron, has 32 vertices, 90 edges and 60 triangular faces.

The tiling 3.4.6.4 (rhombitrihexagonal) repeats a cell of area 6.4641 holding 1 hexagon, 3 squares and 2 triangles, so squares cover 46.4 % of the plane, the hexagon 40.2 % and triangles 13.4 %.

## Good to know

Snub solids and snub tilings come in left- and right-handed mirror pairs; the viewer shows one of each. Johnson solids, prisms and antiprisms, star polyhedra and the Laves (dual) tilings are not included.

## Frequently asked questions

**Is anything uploaded?** No. Everything is calculated and drawn in your browser, and the page works offline.

**Can I 3D print a solid?** Download the OBJ and open it in your slicer. Set the edge length first: the OBJ uses the same units.
