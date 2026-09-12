# Repro for cloudflare/kumo#759

Select popup renders behind a consumer sticky header. This is the app setup from the original
report ([cloudflare/kumo#759](https://github.com/cloudflare/kumo/issues/759)) cut down to the
minimum, with the exact package versions we run pinned in `package.json`.

## Running it

```sh
pnpm install
pnpm dev
```

## What happens

With the selection deep in the list, the popup opens upward (align-with-selected behavior) and
its upper rows disappear behind the sticky header. It looks clipped, but it is not a viewport or
collision problem: remove the header's z-index in `src/styles.css` and the popup renders fine,
with its internal scroll. The popup simply paints below the header.

The header here is `position: sticky; z-index: 20`, taken verbatim from our app. The magnitude
does not matter, any positive value reproduces it. The Select sits in normal page flow below the
header and the popup portals to `document.body` as expected.

Tested on Windows 11 in Chrome 152 and Firefox, `@cloudflare/kumo` 2.12.0.

## What may be different from your test page

Since you could not reproduce it on a minimal page, the candidates we can see in our setup:

* Kumo's CSS comes in as `@import "@cloudflare/kumo/styles/standalone";` from an app stylesheet
  that Vite processes (`src/styles.css`), not as a JS import.
* Nothing anywhere sets `isolation`. `#root` is an ordinary div and the header lives inside it.
* `<html data-mode="dark">`, React 19.2.8, Vite 8.2.2, all pinned.

## Root cause, as far as we can tell

Same as in the issue: in 2.12.0 the Select popup and positioner carry no z-index (the only
`z-50` in `dist/chunks/select-*.js` is `focus-visible:z-50` on list items), and Base UI's
portaled `Select.Positioner` defaults to `z-index: auto`. So the open popup paints in the z-auto
tier of the root stacking context and anything with a positive z-index paints above it, portal
or not.

Consistent with that, this single consumer-side rule makes the overlap disappear both here and
in our app:

```css
[data-side][data-align][data-open] { z-index: 50; }
```

`isolation: isolate` on the root also sidesteps it, but that puts the burden on every consumer.
We would expect the floating layer to establish its own overlay z-index out of the box.
