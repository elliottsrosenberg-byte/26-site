---
title: Onboarding Skeptics
description: Getting designers who don't trust AI to use an assistant.
order: 2
---

## The skeptic is right

The designers I build for are openly skeptical of AI, and their reasons are good ones. They have watched tools generate confident nonsense about their own field. They have seen "AI-powered" slapped on products that got worse. Their work is judgment, taste, and relationships, and a chatbot that performs expertise it lacks reads as an insult to all three.

So when I gave Perennial an assistant, the design problem was trust, and trust has to be designed like anything else. Here is what that looked like in practice.

## Arrive small

Ash, Perennial's assistant, starts as a 36 pixel icon resting in a corner. The icon is a small sapling. It has no label, no tooltip, no animation, no greeting. It grows through three sizes, and every one of those steps is the user's choice. The pattern came from watching skeptics use software: they extend trust in inches, and an assistant that takes a whole screen on day one has spent its welcome before it says a word.

The summon gesture works the same way. On any writing surface, Space on an empty line brings Ash to where you already are. Try it below.

<div class="demo os-demo">
  <input class="os-input" type="text" placeholder="Write a note, or press Space" autocomplete="off" spellcheck="false" aria-label="Demo note line" />
  <div class="os-pop" hidden>
    <button type="button">Summarize</button>
    <button type="button">Draft email</button>
    <button type="button">Extract tasks</button>
  </div>
  <p class="os-result" aria-live="polite"></p>
</div>
<style>
  .os-demo { position: relative; margin: 40px 0; padding: 28px; border: 1px solid var(--hairline); border-radius: 10px; background: var(--surface); }
  .os-input { width: 100%; border: 0; border-bottom: 1px solid var(--faint); background: none; font: inherit; font-size: 16px; color: var(--ink); padding: 4px 0 8px; outline: none; }
  .os-input:focus { border-bottom-color: var(--ink); }
  .os-pop { position: absolute; left: 28px; top: calc(100% - 46px); display: flex; flex-direction: column; background: var(--bg); border: 1px solid var(--hairline); border-radius: 10px; padding: 6px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); z-index: 2; }
  .os-pop button { border: 0; background: none; font: inherit; font-size: 14px; color: var(--ink); text-align: left; padding: 7px 12px; border-radius: 6px; cursor: pointer; }
  .os-pop button:hover { background: var(--surface); }
  .os-result { margin: 12px 0 0; font-size: 13px; color: var(--mid); min-height: 18px; }
</style>
<script>
  (() => {
    const box = document.querySelector('.os-demo');
    if (!box) return;
    const input = box.querySelector('.os-input');
    const pop = box.querySelector('.os-pop');
    const result = box.querySelector('.os-result');
    input.addEventListener('keydown', (e) => {
      if (e.key === ' ' && input.value === '') { e.preventDefault(); pop.hidden = false; }
      if (e.key === 'Escape') pop.hidden = true;
    });
    input.addEventListener('input', () => { pop.hidden = true; });
    pop.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      pop.hidden = true;
      result.textContent = b.textContent + ' → done. View →';
      setTimeout(() => { result.textContent = ''; }, 2400);
    }));
    document.addEventListener('click', (e) => { if (!e.target.closest('.os-demo')) pop.hidden = true; });
  })();
</script>

## Educate, then act

The deeper trust work is in how the assistant answers. Ash splits every question into two kinds. Factual questions get a direct answer pulled from live data, so a date or a dollar amount always comes from a fresh read. Judgment questions, like whether a 50 percent gallery split is fair, get the real options and their tradeoffs, because the person asking is the one who has to live with the call. The skeptic's core fear is being told what to do by something that knows less than they do. An assistant that teaches before it acts dissolves that fear.

Two engineering choices back this up. Ash's description of its own abilities is generated from its actual tool registry, so its claims always match reality, and it names what it cannot do in plain language. And its behavior is tested by judged evals that gate every release. An earlier version of those tests graded answers on containing specific numbers, which trained exactly the false confidence skeptics detect instantly. I rewrote the tests to grade the behavior.

## Trust compounds

The pattern across all of it: let the skeptic control every escalation, make the assistant's first useful act small and verifiable, and let confidence build from there. In the beta, the people who described themselves as AI skeptics on day one were asking Ash judgment questions by week three. They updated because the software kept being honest at every size.
