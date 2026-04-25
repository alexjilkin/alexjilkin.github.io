---
layout: paper
title: Guiding Peptide Kinetics via Collective-Variable Tuning of Free-Energy Barriers
subtitle: A CV-FEST and HLDA workflow for predicting how point mutations can accelerate or slow peptide conformational transitions from limited local sampling.
kicker: Paper Detail
authors: Alexander Zhilkin, Muralika Medaparambath, Dan Mendels
venue: Journal of Chemical Theory and Computation
year: 2026
status: recent paper
system: Chignolin point mutations
methods:
  - CV-FEST
  - HLDA
  - molecular dynamics
  - free-energy surfaces
doi: 10.1021/acs.jctc.6c00418
paper: https://pubs.acs.org/doi/10.1021/acs.jctc.6c00418
arxiv: "2602.19936"
---

## Gist

The paper asks whether peptide kinetics can be guided without exhaustively simulating every mutation. Instead of treating mutation effects as something that must be learned from large datasets or long transition trajectories, it uses short molecular dynamics trajectories inside metastable folded and unfolded states to build a collective variable.

That collective variable is constructed with Harmonic Linear Discriminant Analysis (HLDA), then used within the Collective Variables for Free Energy Surface Tailoring (CV-FEST) framework. The key idea is that local fluctuations inside the stable states already contain information about the free-energy barrier separating them.

## Main Result

For Chignolin point mutations, the HLDA collective variable derived from the wild-type system gives residue-level scores that indicate whether mutations at particular positions are likely to speed up or slow down conformational transitions.

The paper also reports that the leading HLDA eigenvalue, which measures one-dimensional statistical separation between folded and unfolded ensembles, correlates strongly with transition rates across mutations. In practical terms, that makes it a compact proxy for kinetic behavior.

## Result Correlations

<figure class="paper-figure">
  <img src="{{ '/assets/img/mfpt-lambda-corr-scatter.png' | relative_url }}" alt="Scatter plot showing the correlation between HLDA lambda and mutation-dependent mean first passage time ratios.">
  <figcaption>
    Mutation-dependent kinetic effects correlate with the HLDA separation metric. The plot compares HLDA λ against the logarithm of mutant-to-wild-type mean first passage time ratios, showing how the one-dimensional HLDA description tracks transition-rate changes across mutations.
  </figcaption>
</figure>

<figure class="paper-figure">
  <img src="{{ '/assets/img/mean-residue-weight-scatter-plot.png' | relative_url }}" alt="Scatter plot showing residue-level wild-type HLDA scores against mean mutant-to-wild-type mean first passage time ratios.">
  <figcaption>
    Wild-type HLDA residue weights already carry positional information about kinetic sensitivity. Residues with larger scores tend to align with stronger mutation effects on conformational transition times.
  </figcaption>
</figure>

## Why It Matters

Protein structure alone does not determine function. Many functional differences come from thermodynamics and kinetics: how stable states are arranged, how high the barriers are, and how quickly the molecule moves between conformations.

This work points toward a cheaper design loop for molecular kinetics. If mutation effects can be inferred from limited local sampling, then simulation can be used more directly as an engineering tool: propose mutations, estimate their likely kinetic effect, and prioritize the most promising candidates before running expensive rare-event simulations.

## Technical Takeaway

The result is not just that HLDA separates folded and unfolded states. The useful part is that the separation appears predictive: the same low-dimensional description that distinguishes metastable ensembles also carries information about transition-rate changes under mutation.

That connects three things that are often treated separately:

- local equilibrium fluctuations inside metastable states
- free-energy barrier shaping through collective variables
- mutation-dependent conformational kinetics

## Links

- [Published paper](https://pubs.acs.org/doi/10.1021/acs.jctc.6c00418)
- [arXiv preprint](https://arxiv.org/abs/2602.19936)
- [DOI](https://doi.org/10.1021/acs.jctc.6c00418)
