---
title: People, Projects, Notes, Invoices, Tasks, Posts, Docs
description: How Perennial keeps a task in sync everywhere it shows up.
draft: true
order: 3
---

## One record, many rooms

A task in a studio lives several lives at once. It is a line in your to-do list. It is a checkbox on a project. It sits on a day in the calendar. If it involves a client, it belongs to that relationship too. Most software handles this by making you create the task in each place, and then the copies drift apart, and then you stop trusting all of them.

Perennial models the task once. Every task is a single row that carries pointers to its parents: a project, a person, an organization, an opportunity, any or all of them. The task list, the project panel, the calendar, and the contact page are rooms that look at the same record through different windows. Complete it anywhere and it is complete everywhere, because there is only one "it."

## See it happen

One task, three views. Check it in any of them.

<div class="demo se-demo">
  <div class="se-col">
    <span class="se-head">Tasks</span>
    <div class="se-row">
      <button type="button" class="se-check" aria-label="Complete task"></button>
      <span class="se-text">Invoice the Lehman commission</span>
    </div>
  </div>
  <div class="se-col">
    <span class="se-head">Project · Lehman table</span>
    <div class="se-row">
      <button type="button" class="se-check" aria-label="Complete task"></button>
      <span class="se-text">Invoice the commission</span>
    </div>
  </div>
  <div class="se-col">
    <span class="se-head">Calendar · Friday</span>
    <div class="se-row se-chip">
      <button type="button" class="se-check" aria-label="Complete task"></button>
      <span class="se-text">Invoice</span>
    </div>
  </div>
  <button type="button" class="se-reset">Reset</button>
</div>
<style>
  .se-demo { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 40px 0; padding: 24px 24px 44px; border: 1px solid var(--hairline); border-radius: 10px; background: var(--surface); }
  .se-head { display: block; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--faint); margin-bottom: 12px; }
  .se-row { display: flex; align-items: center; gap: 9px; background: var(--bg); border: 1px solid var(--hairline); border-radius: 8px; padding: 9px 11px; }
  .se-chip { border-radius: 999px; }
  .se-check { width: 16px; height: 16px; flex: 0 0 16px; border: 1.5px solid var(--mid); border-radius: 50%; background: none; cursor: pointer; display: grid; place-items: center; padding: 0; transition: background-color 150ms ease, border-color 150ms ease; }
  .se-demo.done .se-check { background: var(--ink); border-color: var(--ink); }
  .se-demo.done .se-check::after { content: ''; width: 4px; height: 7px; border: solid var(--bg); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg) translateY(-1px); }
  .se-text { font-size: 13px; color: var(--ink); transition: color 200ms ease; }
  .se-demo.done .se-text { color: var(--faint); text-decoration: line-through; }
  .se-reset { position: absolute; right: 16px; bottom: 12px; border: 0; background: none; font: inherit; font-size: 12px; color: var(--faint); cursor: pointer; padding: 0; }
  .se-reset:hover { color: var(--mid); }
  @media (max-width: 640px) { .se-demo { grid-template-columns: 1fr; } }
</style>
<script>
  (() => {
    const demo = document.querySelector('.se-demo');
    if (!demo) return;
    demo.querySelectorAll('.se-check').forEach((c) => c.addEventListener('click', () => demo.classList.add('done')));
    demo.querySelector('.se-reset').addEventListener('click', () => demo.classList.remove('done'));
  })();
</script>

## Provenance over copies

The same principle runs through the whole data model. An invoice line item points at the time entry that produced it. A bank deposit points at the invoice it pays. The files page is an index over every file where it already lives. When something appears in two places, both places hold a pointer to one source, so the question "which one is true" never comes up.

The cost of this design is honesty about where it is paid: in the schema, up front. Pointers mean join tables, nullable parents, and rules about what happens when a parent goes away. That work is invisible when it is done well, and the payoff is a studio owner who trusts what the screen says, because every room in the software is looking at the same furniture.
