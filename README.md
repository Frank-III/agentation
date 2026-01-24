# agentation-svelte

A **Svelte 5 port** of [agentation](https://github.com/benjitaylor/agentation) by Benji Taylor.

Agentation is an agent-agnostic visual feedback tool. Click elements on your page, add notes, and copy structured output that helps AI coding agents find the exact code you're referring to.

## Install

```bash
npm install agentation-svelte -D
```

## Usage

```svelte
<script>
  import { Agentation } from 'agentation-svelte';
  import { browser } from '$app/environment';
</script>

{#if browser}
  <Agentation />
{/if}
```

> **Note:** The component must be wrapped in `{#if browser}` due to `$effect` usage requiring a client-only environment.

The toolbar appears in the bottom-right corner. Click to activate, then click any element to annotate it.

## Features

- **Click to annotate** – Click any element with automatic selector identification
- **Text selection** – Select text to annotate specific content
- **Multi-select** – Drag to select multiple elements at once
- **Area selection** – Drag to annotate any region, even empty space
- **Animation pause** – Freeze CSS animations to capture specific states
- **Structured output** – Copy markdown with selectors, positions, and context
- **Dark/light mode** – Matches your preference or set manually
- **Svelte component detection** – Detects Svelte component hierarchy (dev mode)
- **Zero dependencies** – Pure CSS animations, no runtime libraries

## Callbacks

```svelte
<Agentation
  onAnnotationAdd={(annotation) => console.log('Added:', annotation)}
  onAnnotationDelete={(annotation) => console.log('Deleted:', annotation)}
  onAnnotationUpdate={(annotation) => console.log('Updated:', annotation)}
  onAnnotationsClear={(annotations) => console.log('Cleared:', annotations)}
  onCopy={(markdown) => fetch('/api/feedback', { method: 'POST', body: markdown })}
  copyToClipboard={true}
/>
```

## How it works

Agentation captures class names, selectors, and element positions so AI agents can `grep` for the exact code you're referring to. Instead of describing "the blue button in the sidebar," you give the agent `.sidebar > button.primary` and your feedback.

## Differences from React version

| Feature | React | Svelte |
|---------|-------|--------|
| Component detection | React fiber tree | Svelte dev metadata + CSS scope hashes |
| Runtime | React 18+ | Svelte 5 |
| SSR | Works directly | Requires `{#if browser}` wrapper |

## Requirements

- Svelte 5
- SvelteKit (recommended) or Vite + Svelte
- Desktop browser (mobile not supported)

## Credits

Original React implementation by [Benji Taylor](https://github.com/benjitaylor/agentation).

Svelte port by [Frank-III](https://github.com/Frank-III/agentation).

## License

© 2026 Benji Taylor
Licensed under PolyForm Shield 1.0.0
