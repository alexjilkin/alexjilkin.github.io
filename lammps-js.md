---
layout: simulation
title: lammps.js
description: A browser-native polymer dynamics demo running LAMMPS through WebAssembly and rendering the trajectory with WebGL.
permalink: /lammps-js/
nav: true
nav_order: 3
---

[lammps.js](https://github.com/lammps/lammps.js) brings LAMMPS molecular simulation into the browser through WebAssembly. This page runs a bead-spring polymer trajectory locally and renders it as a live scene.

The polymer positions come from LAMMPS as the simulation advances. The panel reports radius of gyration, end-to-end distance, qualitative chain state, and timestep while the trajectory evolves.
