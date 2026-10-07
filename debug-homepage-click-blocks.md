# Debug Session: homepage-click-blocks
- **Status**: `[OPEN]`
- **Created**: 2026-10-07
- **Symptom**: Landing/homepage interactive elements between "WHO STOLE THE SHOW?" and Movies/Search bar do nothing on click/tap — actor cards, character cards, CTA buttons.
- **Expected**: Card clicks navigate to actor page / title page per section semantics. CTA buttons fire navigation.
- **Sections affected**: HomeHeroSection (#1 Performance), HomeStandoutsSection (#2-5), HomeTopPerformancesList (all-time #1-8), LeaderboardSection Heroes+Villains #1 feat + #2-4 stack.
- **Regression window**: Immediately after the nested-anchor refactor (Phase 4) which rewrote outer-Link cards to use a z-0 background absolute `<Link>` layer + z-10 content siblings + z-20 actor sub-links.

## Hypotheses
| # | Hypothesis | Likelihood | Falsifiable Check |
|---|---|---|---|
| H1 | **Sibling stacking blocks clicks on background Link.** Absolute `<Link href="/title/...">` placed as DOM-first sibling of `z-10` content `<div>`. Same stacking context, DOM-first z=0 link paints BELOW the sibling content div; clicks on non-link text/poster inside z-10 never reach the z-0 sibling because sibling-to-sibling events do not propagate to lower layers. | HIGH | Instrument click event on the absolute Link and on the card div — verify the Link receives zero clicks on poster/title areas. |
| H2 | **pointer-events conflict on overlays.** Some section uses `pointer-events-none` on a layer that should be transparent, OR lacks `pointer-events-none` on a gradient/pseudo overlay that captures clicks instead of passing them through. | MEDIUM | Check CSS classes on `::before`, gradients, backdrop `<div>` layers; add instrumentation logs for `window.getEventListeners()` and click targets. |
| H3 | **z-index starvation.** Actor identity sub-links are declared `relative z-20` but live inside `relative z-10` content parent, which may create a new stacking context capping child z-20 to the parent's plane. Combined with main card absolute Link at z-0, maybe no actual stacking separation exists between title Link and content. | HIGH | Dump computed stacking; in-browser inspect the clickable painted layers for each card zone. |
| H4 | **Missing href / incorrect route pattern.** Actor IDs rendered as `/actor/undefined` or `/actor/[object Object]` because a renamed prop no longer provides `person_id`. The click fires but goes to a 404 route that looks like a "do nothing" response. | MEDIUM | Log actual href strings from rendered elements; inspect `person_id` value from props at render time. |
| H5 | **Client/server boundary failure.** Components are Server Components; `onClick` instrumentation won't execute, but `Link` should render as real `<a>` with working href. Verify `<a>` elements actually exist in HTML output. | LOW | Use DevTools "inspect element" or curl to confirm `<a>` tags with hrefs exist in the static HTML, not just React fragments. |

## Instrumentation Log (injected into components as inline fetch() reporting)
- Session: homepage-click-blocks
- Debug server endpoint: pending

## Pre-Fix Evidence
(empty — collecting via Step 2)

## Fix
(empty — evidence required first)

## Post-Fix Evidence
(empty)

## Notes
- Regression happened immediately after refactor that replaced `outer <Link> + inner <Link onClick=stopPropagation>` pattern with `absolute z-0 overlay Link + z-10 sibling content layer`.
- H1 is by far the most likely: CSS stacking rules say same-parent siblings with different z-index have events captured by whichever painted last, and events don't "fall through" from upper sibling to lower one even if upper has no click handler.
