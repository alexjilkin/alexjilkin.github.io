---
layout: home
title: Alex Zhilkin
subtitle: PhD student working on computational molecular engineering, molecular simulation, machine learning, and scientific software.
permalink: /
nav: true
nav_order: 1
---

I am a PhD student at the Technion – Israel Institute of Technology, working in the [Mendels Lab for Computational Molecular Engineering](https://mendelsgroup.net.technion.ac.il/). My research focuses on developing computational methods for understanding and controlling molecular systems, especially through molecular simulations, collective variables, free-energy surfaces, and machine learning.

I hold an MSc in Theoretical and Computational Methods from the University of Helsinki, where I also worked as a research assistant in the Sum of Products group. During my master’s, I focused on statistical and computational methods for machine learning, with an emphasis on building general tools for understanding and modeling complex data.

Alongside academia, I have around 10 years of experience as a software engineer. Most recently, I led the technical side of a game development project at Netflix. This mix of research and engineering strongly shapes how I work: I am interested in methods that are mathematically grounded, computationally useful, and practical enough to become real tools.

My current work sits at the intersection of molecular simulation, statistical modeling, machine learning, and scientific computing. I am especially interested in how local molecular fluctuations encode information about global thermodynamic and kinetic behavior, and how that can be used to guide molecular design. More broadly, I like working on problems where computation is not only used to analyze data, but also to build new ways of thinking about physical systems.

### Featured Research

My research sits between molecular simulation, statistical modeling, and scientific computing. I am interested in building computational methods that extract useful low-dimensional structure from complex systems, whether the system is a molecular trajectory, a free-energy landscape, or a space of graphical models.

## Molecular simulation and collective variables

My current work focuses on collective variables, free-energy surface engineering, and peptide kinetics. In particular, I use the Collective Variables for Free Energy Surface Tailoring framework (CV-FEST) together with Harmonic Linear Discriminant Analysis (HLDA) to build low-dimensional, interpretable descriptions of molecular motion.

One direction I am especially interested in is how local fluctuations inside metastable states can already encode information about barrier crossing and conformational change. This opens the possibility of guiding molecular kinetics with much less sampling than traditional rare-event approaches require.

## Statistical structure learning

My earlier research focused on sampling Markov equivalent directed acyclic graphs (DAGs) for Bayesian network discovery. In that work, I studied how to sample and count acyclic moral orientations, which represent Markov equivalence classes and are important for understanding uncertainty in learned Bayesian network structures.

Key topics include:

- Collective variables and reduced representations
- CV-FEST and free-energy surface engineering
- Harmonic Linear Discriminant Analysis (HLDA)
- Peptide kinetics and mutation-dependent unfolding rates
- Molecular simulation and rare-event sampling
- Markov chain Monte Carlo (MCMC)
- Bayesian networks and Markov equivalent DAGs
- Sampling and counting acyclic moral orientations
- Interpretable machine learning for physical and statistical systems

{% include featured-paper-card.liquid %}

## Open-Source Project

I co-authored [lammps.js](https://github.com/lammps/lammps.js), an open-source project that compiles LAMMPS for the browser through WebAssembly and makes interactive molecular simulation possible on the web. The live bead-chain demo below is one example of that workflow in practice.

{% include simulation-panel.liquid %}

## Contact

- Email: [jilkinalex@gmail.com](mailto:jilkinalex@gmail.com)
- GitHub: [github.com/alex-zhilkin](https://github.com/alex-zhilkin)
- Google Scholar: [Scholar profile](https://scholar.google.com/citations?user=LKxy80oAAAAJ&hl=en)
- ORCID: [0009-0002-7205-1387](https://orcid.org/0009-0002-7205-1387)
- LinkedIn: [alex-zhilkin](https://www.linkedin.com/in/alex-zhilkin/)
