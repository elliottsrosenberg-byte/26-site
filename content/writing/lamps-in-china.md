---
title: Why I Made my Lamps in China
description: The truth about manufacturing, and unfortunate misconceptions.
draft: true
order: 4
---

## The lamp

Sedum is a lamp I designed and brought to production. Getting it made meant choosing a factory, and choosing a factory meant confronting a belief I had absorbed without examining: that manufacturing in China is the compromise, the thing you do when you stop caring.

I made the lamps in China, and the reason is the one this piece exists to explain: it was where the lamp could be made best.

![Sedum lamp.](/extras/sedum-p01.jpg "bare")

## The misconception

The story people carry about overseas manufacturing was formed decades ago and has calcified into a moral position: domestic means quality and virtue, overseas means cutting corners. The reality I found was a supply chain of specialists. The factory that made Sedum had process knowledge, tooling depth, and finish quality that I could not buy domestically at any price a lamp can carry, because the domestic shops that once held that knowledge are gone or booked serving industries with deeper pockets.

Choosing that factory was a quality decision. The corner-cutting version of my lamp was available too, from factories on either side of the ocean. Where a thing is made tells you very little. Who makes it, and what they are given the time and money to do, tells you almost everything.

## What the money actually buys

A hover over each band below shows where the money in a production lamp goes. The numbers are illustrative, and the shape is the honest part: making the object is one slice of a stack that is mostly logistics, duty, and the retail math that keeps the businesses around the lamp alive.

<div class="demo lc-demo" aria-label="An illustrative cost breakdown. Hover each band for the label.">
  <div class="lc-bar">
    <div class="lc-seg" style="--w: 18; --c: var(--ink)" data-label="Materials · 18%"></div>
    <div class="lc-seg" style="--w: 22; --c: #8b5d51" data-label="Fabrication and finish · 22%"></div>
    <div class="lc-seg" style="--w: 8; --c: #537f48" data-label="Tooling, amortized · 8%"></div>
    <div class="lc-seg" style="--w: 12; --c: #b5b5b6" data-label="Freight and duty · 12%"></div>
    <div class="lc-seg" style="--w: 10; --c: #e8c547" data-label="Packaging and QC · 10%"></div>
    <div class="lc-seg" style="--w: 30; --c: var(--faint)" data-label="Retail margin · 30%"></div>
  </div>
  <p class="lc-label" aria-live="polite">Hover a band</p>
</div>
<style>
  .lc-demo { margin: 40px 0; padding: 28px; border: 1px solid var(--hairline); border-radius: 10px; background: var(--surface); }
  .lc-bar { display: flex; height: 56px; border-radius: 8px; overflow: hidden; }
  .lc-seg { flex-grow: var(--w); background: var(--c); opacity: 0.85; cursor: default; transition: opacity 150ms ease, flex-grow 300ms var(--ease-out); }
  @media (hover: hover) and (pointer: fine) {
    .lc-bar:hover .lc-seg { opacity: 0.35; }
    .lc-bar .lc-seg:hover { opacity: 1; flex-grow: calc(var(--w) * 1.6); }
  }
  .lc-label { margin: 14px 0 0; font-size: 13px; color: var(--mid); min-height: 18px; font-variant-numeric: tabular-nums; }
</style>
<script>
  (() => {
    const demo = document.querySelector('.lc-demo');
    if (!demo) return;
    const label = demo.querySelector('.lc-label');
    demo.querySelectorAll('.lc-seg').forEach((s) => {
      s.addEventListener('pointerenter', () => { label.textContent = s.dataset.label; });
    });
    demo.querySelector('.lc-bar').addEventListener('pointerleave', () => { label.textContent = 'Hover a band'; });
  })();
</script>

## What I would tell another designer

Visit the factory, or have someone you trust visit it. Judge the shop by its process control and its questions, because a good factory asks you hard questions about your drawings. Budget for tooling like it is part of the design, because it is. And make the location decision the way you make every other design decision: from the object's requirements outward. The lamp told me where it needed to be made. My job was to listen over the noise.
