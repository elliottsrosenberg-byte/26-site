---
title: Canvas First!
description: Making productivity tools fun for creatives.
order: 1
---

## The blank page

Every productivity tool asks you a question before it helps you. What is the project called. What is the due date. Which status is it in. Forms are how software says hello, and for a lot of people forms are fine. For makers, forms are the moment the tool stops feeling like theirs.

When I built Perennial, the studio management tool behind most of my recent work, I kept watching the same thing in interviews: designers plan on paper, on walls, on tables. They spread things out. They circle what matters. Then they open software and everything collapses into rows.

So Perennial opens onto a canvas. The home screen is a freeform surface with drawing tools down one side and the studio's real objects available to place: notes, task cards, calendar blocks. The first thing the software asks of you is nothing. It hands you a table and lets you spread out.

## Try the idea

Click anywhere below to put a thought down. Drag to move it. That is the entire pitch.

<div class="demo cf-demo" aria-label="A small canvas. Click to add a note, drag to move it.">
  <span class="cf-hint">Click to add. Drag to arrange.</span>
</div>
<style>
  .cf-demo { position: relative; height: 300px; margin: 40px 0; border: 1px solid var(--hairline); border-radius: 10px; background: var(--surface); overflow: hidden; cursor: crosshair; }
  .cf-hint { position: absolute; left: 16px; bottom: 12px; font-size: 12px; color: var(--faint); pointer-events: none; }
  .cf-note { position: absolute; width: 92px; height: 68px; background: var(--bg); border: 1px solid var(--hairline); border-radius: 8px; box-shadow: 0 3px 14px rgba(0,0,0,0.06); cursor: grab; animation: cf-in 200ms var(--ease-out); }
  .cf-note::after { content: ''; position: absolute; left: 10px; top: 12px; right: 30px; height: 3px; border-radius: 2px; background: var(--faint); box-shadow: 0 9px 0 var(--faint), 0 18px 0 var(--faint); }
  @keyframes cf-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
</style>
<script>
  (() => {
    const demo = document.querySelector('.cf-demo');
    if (!demo) return;
    let drag = null, ox = 0, oy = 0;
    demo.addEventListener('pointerdown', (e) => {
      const t = e.target.closest('.cf-note');
      const r = demo.getBoundingClientRect();
      if (t) {
        drag = t; ox = e.clientX - t.offsetLeft; oy = e.clientY - t.offsetTop;
        t.setPointerCapture(e.pointerId);
      } else {
        const n = document.createElement('div');
        n.className = 'cf-note';
        n.style.left = Math.min(e.clientX - r.left - 46, r.width - 96) + 'px';
        n.style.top = Math.min(e.clientY - r.top - 34, r.height - 72) + 'px';
        demo.appendChild(n);
      }
    });
    demo.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const r = demo.getBoundingClientRect();
      drag.style.left = Math.min(Math.max(e.clientX - ox, 0), r.width - 96) + 'px';
      drag.style.top = Math.min(Math.max(e.clientY - oy, 0), r.height - 72) + 'px';
    });
    demo.addEventListener('pointerup', () => { drag = null; });
  })();
</script>

## What a canvas changes

The canvas earns its place by changing behavior. People write more when the surface looks like paper. They group things spatially before they know what the groups are called, and the naming comes later, once the shape of the work is visible. A form demands the answer first. A canvas lets the answer develop.

It also changes how the assistant fits. Perennial's assistant lives inside the canvas: press Space on an empty line and it is there, and what it returns lands on the surface next to your own thinking. Help arrives inside your working material, in your own space, on your terms.

## Fun is a feature

Fun gets treated as decoration in productivity software, something added after the real features. I think that has it backwards. A maker opens a management tool a few times a week under mild protest. The tool that feels like a studio gets opened more, and a tool that gets opened more is the one that actually manages the studio. Fun is retention. The canvas is the most serious feature in the product.
