---
name: Vector map viewer
num: 893
shelf: science
section: remote-sensing-and-gis
title: "Shapefile, GeoJSON and KML viewer: map, attribute table, geodesic area and perimeter, convert to GeoJSON, KML or CSV (WKT)"
summary: "Open a zipped shapefile, GeoJSON, KML or KMZ, or a CSV with WKT, and see it on a map you can pan and zoom. Read the attribute table, get each feature's area, perimeter and length on the WGS 84 ellipsoid, and save the layer as GeoJSON, KML or CSV with WKT. Projected shapefiles (UTM, Lambert, Albers, Web Mercator) are converted to latitude and longitude. Files never leave your device."
status: live
ads: false
order: 893
icon: image
works: offline
updated: 2026-11-09
related: [spectral-index-calculator, utm-converter, gps-track-analyser]
sources:
  - "Shapefile and dBASE layouts: the ESRI Shapefile Technical Description (1998), an open specification; reader written by fibub. Zip files are opened with the fflate library (MIT)."
  - "GeoJSON (RFC 7946), KML 2.2 (OGC) and WKT (OGC Simple Features): open standards; readers and writers written by fibub."
  - "Map projections (Transverse Mercator, Mercator, Lambert conformal conic, Albers equal-area): formulas from J. P. Snyder, Map Projections: A Working Manual (USGS, 1987, public domain) and C. F. F. Karney (2011); written by fibub."
  - "Areas: geodesic edges (Vincenty, 1975) on the WGS 84 ellipsoid, measured on the authalic sphere; a published method, written by fibub."
  - "World coastline: Natural Earth 1:110 million land outlines (public domain)."
  - "The example farm and its fields are made up by fibub."
flow:
  - { icon: zip, label: "Open file" }
  - { icon: image, label: "See map" }
  - { icon: table, label: "Attributes" }
  - { icon: download, label: "Convert" }
---

## What it does

GIS layers arrive in many formats: a shapefile from a government portal, a KML from Google Earth, a GeoJSON from a web map, a table with WKT from a database. This viewer opens all of them **in your browser** without installing GIS software, and without sending the file anywhere:

- draws the features on a map you can **drag, zoom and pinch**, over a light world coastline;
- lists every feature in an **attribute table**, with its **area, perimeter and length** measured on the WGS 84 ellipsoid;
- tells you the extent, the number of vertices, the coordinate system and anything odd it found (no .prj file, heights, text encoding);
- **converts** the layer to GeoJSON, KML or CSV with WKT, optionally with the area, perimeter and length as new columns;
- makes a small **report** (image, PDF or Word) with the map and the table.

## How to use it

1. Press **Open files** and choose a .geojson, .kml, .kmz, a shapefile .zip, or the .shp, .dbf, .prj and .cpg files of one shapefile together. A CSV with a column called WKT (or geometry), or with latitude and longitude columns, also works. You can paste GeoJSON or KML text instead.
2. If the zip holds several shapefiles, choose the **Layer**.
3. Drag the map to move it and scroll or pinch to zoom. **Fit** shows everything again. Tap a feature, or a row in the table, to see its details.
4. Pick the units for area (m², hectares, km², acres) and length.
5. Choose a format under **Convert and download** and press Download.

## Projections and accuracy

GeoJSON, KML and WKT are always longitude and latitude. Shapefiles often are not: their .prj file names a map projection. The viewer reads the .prj and converts **Transverse Mercator** (UTM, national grids), **Mercator** and **Web Mercator**, **Lambert conformal conic** (one or two standard parallels, State Plane, Lambert-93) and **Albers equal-area** back to latitude and longitude, in metres or feet. Other projections give a clear message asking you to reproject first. There is no datum shift: a layer on an old datum (such as OSGB36) is placed within a few hundred metres, which barely changes areas. For projected shapefiles the table also shows the **map-plane area**, the area your GIS reports in the projection itself, for comparison.

Areas follow each edge along the geodesic (the shortest path on the ellipsoid), and are measured on the authalic sphere, which has exactly the ellipsoid's area. Checked against PROJ's geodesic area (pyproj 3.8, GeographicLib) on 429 polygons from 1 m² to whole continents, including rings around both poles: they agree to 3 parts in 100 million for anything over 1,000 m². Shapefile reading was checked against pyshp 3.0 on 11 test layers (points, lines and polygons with holes and several parts, Z and M types, UTF-8 and Windows-1252 text, and six projections): every coordinate and attribute matched.

## Worked example

Press **Use the example** to load a made-up farm with three fields, a brook, a gate and a well. The table gives **North meadow** an area of **37.8586 ha** with a perimeter of 2,473.65 m. **Pond field** has a pond cut out of it as a hole: its area is 39.378 ha, and its perimeter of 3,191.14 m includes the pond's 606 m edge (the outer perimeter alone is 2,585.1 m). **Wood** is one feature with two parts, 36.7248 ha in all. The three fields total **113.961 ha**, and the **Brook** is 1,900.41 m long. Tick "Add area, perimeter and length columns", choose CSV (WKT) and download: each row gets the WKT geometry, the name, use and owner, and area_ha, perimeter_m and length_m.

## Tips

- If attribute text shows odd characters (Ã© instead of é), the shapefile's .cpg file is missing; the viewer guesses UTF-8 or Windows-1252 and says which it used.
- A shapefile needs at least its .shp. Without the .dbf there are no attributes; without the .prj the coordinates are taken as longitude and latitude.
- KML styles, images and network links are not kept; folders become a "folder" column.

## FAQ

**Is my data uploaded?** No. The file is read by JavaScript in this page, and the page works offline once loaded.

**Why is my area slightly different from my GIS?** Most desktop GIS tools report the planar area in the layer's projection unless asked for an ellipsoidal one. Compare with the map-plane area column, or with the GIS's ellipsoidal or geodesic area.

**Can it edit features?** Not yet: it views, measures and converts.
